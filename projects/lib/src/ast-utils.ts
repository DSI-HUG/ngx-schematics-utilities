import { SchematicsException, Tree } from '@angular-devkit/schematics';
import {
    ArrayLiteralExpression, CallExpression, isArrayLiteralExpression, isCallExpression, isIdentifier, isObjectLiteralExpression, isPropertyAssignment,
    ObjectLiteralExpression, PropertyAssignment, SourceFile
} from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { getDecoratorMetadata, getMetadataField } from '@schematics/angular/utility/ast-utils';
import { Change, InsertChange, NoopChange, RemoveChange, ReplaceChange } from '@schematics/angular/utility/change';
import { findAppConfig } from '@schematics/angular/utility/standalone/app_config';
import { findBootstrapApplicationCall } from '@schematics/angular/utility/standalone/util';

import { commitChanges, getTsSourceFile } from './file';

/**
 * @internal
 */
export const guessLineIndentationAtPosition = (sourceFile: SourceFile, position: number): number => {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(position);
    const lineStartPosition = sourceFile.getPositionOfLineAndCharacter(line, 0);
    const lineStartToPosition = sourceFile.getText().substring(lineStartPosition, lineStartPosition + character);
    const lineIndentation = lineStartToPosition.search(/\S/);
    return (lineIndentation >= 0) ? lineIndentation : 0;
};

/**
 * @internal
 */
export const getIndentBy = (tree: Tree, filePath: string, position: number): (n: number) => string => {
    const sourceFile = getTsSourceFile(tree, filePath);
    const lineIndent = guessLineIndentationAtPosition(sourceFile, position);
    return (n: number): string => ' '.repeat(lineIndent + n);
};

/**
 * @internal
 */
export const removeSymbolFromNgModuleMetadata = (
    sourceFile: SourceFile,
    filePath: string,
    metadataField: string,
    classifiedName: string
): Change => {
    const ngModuleNodes = getDecoratorMetadata(sourceFile, 'NgModule', '@angular/core');
    const ngModuleImports = getMetadataField(ngModuleNodes[0] as ObjectLiteralExpression, metadataField);
    const arrayLiteral = (ngModuleImports[0] as PropertyAssignment).initializer as ArrayLiteralExpression;
    const symbolIndex = arrayLiteral.elements.findIndex(el => el.getText().includes(classifiedName));
    if (symbolIndex !== -1) {
        const el = arrayLiteral.elements[symbolIndex];
        let position = el.getFullStart();
        let fullText = el.getFullText();
        if (symbolIndex !== (arrayLiteral.elements.length - 1)) {
            fullText = `${fullText},`;
        } else if (arrayLiteral.elements.length > 1) {
            position--;
            fullText = `,${fullText}`;
        }
        return new RemoveChange(filePath, position, fullText);
    }
    return new NoopChange();
};

/**
 * @internal
 */
export const removeProviderFromStandaloneApplication = (
    tree: Tree,
    mainFilePath: string,
    providerName: string
): void => {
    const bootstrapApplicationCall = findBootstrapApplicationCall(tree, mainFilePath);
    if (bootstrapApplicationCall) {
        const boostrapApplicationOptions = bootstrapApplicationCall.arguments?.[1] as ObjectLiteralExpression;

        // Options is a variable => new appConfig object introduces with ng16
        if (boostrapApplicationOptions && isIdentifier(boostrapApplicationOptions)) {
            const appConfig = findAppConfig(bootstrapApplicationCall, tree, mainFilePath);
            if (appConfig) {
                commitChanges(tree, appConfig.filePath, removeProviderFromConfig(appConfig.filePath, appConfig.node, providerName));
            } else {
                throw new SchematicsException('Could not find application config');
            }
        // Options is an object
        } else if (boostrapApplicationOptions && isObjectLiteralExpression(boostrapApplicationOptions)) {
            commitChanges(tree, mainFilePath, removeProviderFromConfig(mainFilePath, boostrapApplicationOptions, providerName));
        }
    } else {
        throw new SchematicsException(`Could not find bootstrapApplication call in ${mainFilePath}`);
    }
};

/**
 * @internal
 */
export const addProviderToStandaloneApplication = (
    tree: Tree,
    mainFilePath: string,
    providerName: string,
    useImportProvidersFrom = false,
    indent = 2
): void => {
    const bootstrapApplicationCall = findBootstrapApplicationCall(tree, mainFilePath);
    if (bootstrapApplicationCall) {
        const boostrapApplicationOptions = bootstrapApplicationCall.arguments?.[1] as ObjectLiteralExpression;

        // Options is a variable => new appConfig object introduces with ng16
        if (boostrapApplicationOptions && isIdentifier(boostrapApplicationOptions)) {
            const appConfig = findAppConfig(bootstrapApplicationCall, tree, mainFilePath);
            if (appConfig) {
                commitChanges(tree, appConfig.filePath, [addProviderToConfig(
                    tree, appConfig.filePath, appConfig.node, providerName, useImportProvidersFrom, indent
                )]);
            } else {
                throw new SchematicsException('Could not find application config');
            }
        // Options is an object
        } else if (boostrapApplicationOptions && isObjectLiteralExpression(boostrapApplicationOptions)) {
            commitChanges(tree, mainFilePath, [addProviderToConfig(
                tree, mainFilePath, boostrapApplicationOptions, providerName, useImportProvidersFrom, indent
            )]);
        // No options
        } else {
            const indentBy = getIndentBy(tree, mainFilePath, bootstrapApplicationCall.getStart());
            const indentedProviderName = providerName.replace(/\r?\n|\r/gm, `$&${indentBy(indent * 2)}`);
            const toAdd = `, {\n${indentBy(indent)}providers: [\n${indentBy(indent * 2)}${indentedProviderName}\n${indentBy(indent)}]\n${indentBy(0)}}`;
            commitChanges(tree, mainFilePath, [new InsertChange(
                mainFilePath, bootstrapApplicationCall.arguments?.[0].getEnd(), toAdd
            )]);
        }
    } else {
        throw new SchematicsException(`Could not find bootstrapApplication call in ${mainFilePath}`);
    }
};

// --- HELPER(s) ---

/**
 * @internal
 */
const removeProviderFromConfig = (
    filePath: string,
    config: ObjectLiteralExpression,
    providerName: string
): Change[] => {
    const providersArrayProp = config.properties?.find(prop => (
        isPropertyAssignment(prop) &&
        isIdentifier(prop.name) &&
        isArrayLiteralExpression(prop.initializer) &&
        (prop.name.text === 'providers')
    )) as PropertyAssignment;
    if (providersArrayProp) {
        const providersArray = providersArrayProp.initializer as ArrayLiteralExpression;
        return providersArray.elements
            .map((prop, index) => {
                if (prop.getText().includes(providerName)) {
                    if (isCallExpression(prop) && isIdentifier(prop.expression) && (prop.expression.text === 'importProvidersFrom')) {
                        if (prop.arguments.length > 1) {
                            const newProviders = prop.arguments.map(arg => arg.getText()).filter(name => (name !== providerName));
                            if (newProviders.length) {
                                const toReplace = `importProvidersFrom(${newProviders.join(', ')})`;
                                return new ReplaceChange(filePath, prop.getStart(), prop.getText(), toReplace);
                            }
                        }
                    }
                    const toRemove = (index === (providersArray.elements.length - 1)) ? prop.getFullText() : `${prop.getFullText()},`;
                    return new RemoveChange(filePath, prop.getFullStart(), toRemove);
                }
                return new NoopChange();
            });
    }
    return [];
};

/**
 * @internal
 */
const addProviderToConfig = (
    tree: Tree,
    filePath: string,
    config: ObjectLiteralExpression,
    providerName: string,
    useImportProvidersFrom = false,
    indent = 2
): Change => {
    const indentBy = getIndentBy(tree, filePath, config.getStart());

    const providersArrayProp = config.properties?.find(prop => (
        isPropertyAssignment(prop) &&
        isIdentifier(prop.name) &&
        isArrayLiteralExpression(prop.initializer) &&
        (prop.name.text === 'providers')
    )) as PropertyAssignment;
    if (providersArrayProp) {
        const providersArray = providersArrayProp.initializer as ArrayLiteralExpression;
        if (useImportProvidersFrom) {
            const importProvidersFromProp = providersArray.elements.find(prop =>
                isCallExpression(prop) &&
                    isIdentifier(prop.expression) &&
                    (prop.expression.text === 'importProvidersFrom')) as CallExpression;
            if (!importProvidersFromProp) {
                const toAdd = `\n${indentBy(indent * 2)}importProvidersFrom(${providerName})`;
                return new InsertChange(
                    filePath,
                    providersArray.getStart() + 1,
                    (providersArray.elements.length) ? `${toAdd},` : toAdd
                );
            } else if (!importProvidersFromProp.getText().includes(providerName)) {
                return new InsertChange(filePath, importProvidersFromProp.arguments?.[0].getStart(), `${providerName}, `);
            } else {
                return new NoopChange();
            }
        } else {
            const indentedProviderName = providerName.replace(/\r?\n|\r/gm, `$&${indentBy(indent * 2)}`);
            const toAdd = `\n${indentBy(indent * 2)}${indentedProviderName}`;
            return new InsertChange(
                filePath,
                providersArray.getStart() + 1,
                (providersArray.elements.length) ? `${toAdd},` : toAdd
            );
        }
    } else {
        const indentedProviderName = providerName.replace(/\r?\n|\r/gm, `$&${indentBy(indent * 2)}`);
        const toAdd = `\n${indentBy(indent)}providers: [\n${indentBy(indent * 2)}${indentedProviderName}\n${indentBy(indent)}]`;
        return new InsertChange(
            filePath,
            config.getStart() + 1,
            (config.properties.length) ? `${toAdd},` : `${toAdd}\n`
        );
    }
};
