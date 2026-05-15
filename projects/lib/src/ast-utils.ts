/* eslint-disable jsdoc/require-param, jsdoc/require-returns, no-loops/no-loops */
import { SchematicsException, type Tree } from '@angular-devkit/schematics';
import {
    type ArrayLiteralExpression, type CallExpression, type Expression, isArrayLiteralExpression, isCallExpression,
    isIdentifier, isImportDeclaration, isNamedImports, isObjectLiteralExpression, isPropertyAssignment,
    isStringLiteralLike, isVariableStatement, type ObjectLiteralExpression, type PropertyAssignment, type SourceFile,
} from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { getDecoratorMetadata, getMetadataField } from '@schematics/angular/utility/ast-utils';
import { type Change, InsertChange, NoopChange, RemoveChange, ReplaceChange } from '@schematics/angular/utility/change';
import { findBootstrapApplicationCall, getSourceFile } from '@schematics/angular/utility/standalone/util';
import { dirname, join } from 'node:path';

import { commitChanges, getTsSourceFile } from './file';

/**
 * @internal
 */
interface AppConfig {
    filePath: string;
    node: Expression | null;
}

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
    classifiedName: string,
): Change => {
    const ngModuleNodes = getDecoratorMetadata(sourceFile, 'NgModule', '@angular/core');
    const ngModuleImports = getMetadataField(ngModuleNodes[0] as ObjectLiteralExpression, metadataField);
    const arrayLiteral = ngModuleImports[0].initializer as ArrayLiteralExpression;
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
    providerName: string,
): void => {
    const bootstrapApplicationCall = findBootstrapApplicationCall(tree, mainFilePath);
    const appConfig = findAppConfig(tree, mainFilePath, bootstrapApplicationCall);
    if (appConfig?.node) {
        if (isObjectLiteralExpression(appConfig.node)) {
            commitChanges(tree, appConfig.filePath, removeProviderFromConfig(appConfig.filePath, appConfig.node, providerName));
        } else {
            throw new SchematicsException(`Application config is not an object literal in ${appConfig.filePath}`);
        }
    } else {
        throw new SchematicsException(`Could not find application config in ${mainFilePath}`);
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
    indent = 2,
): void => {
    const bootstrapApplicationCall = findBootstrapApplicationCall(tree, mainFilePath);

    // No config at all, we will add one
    if (bootstrapApplicationCall.arguments.length === 1) {
        const indentBy = getIndentBy(tree, mainFilePath, bootstrapApplicationCall.getStart());
        const indentedProviderName = providerName.replace(/\r?\n|\r/gm, `$&${indentBy(indent * 2)}`);
        const toAdd = `, {\n${indentBy(indent)}providers: [\n${indentBy(indent * 2)}${indentedProviderName}\n${indentBy(indent)}]\n${indentBy(0)}}`;
        commitChanges(tree, mainFilePath, [new InsertChange(
            mainFilePath, bootstrapApplicationCall.arguments?.[0].getEnd(), toAdd,
        )]);
    // otherwise, look for the config and add the provider to it
    } else {
        const appConfig = findAppConfig(tree, mainFilePath, bootstrapApplicationCall);
        if (appConfig?.node) {
            if (isObjectLiteralExpression(appConfig.node)) {
                commitChanges(tree, appConfig.filePath, [addProviderToConfig(
                    tree, appConfig.filePath, appConfig.node, providerName, useImportProvidersFrom, indent,
                )]);
            } else {
                throw new SchematicsException(`Application config is not an object literal in ${appConfig.filePath}`);
            }
        } else {
            throw new SchematicsException(`Could not find application config in ${mainFilePath}`);
        }
    }
};

/**
 * @internal
 */
export const findAppConfig = (tree: Tree, mainFilePath: string, bootstrapApplicationCall?: CallExpression): AppConfig | null => {
    try {
        bootstrapApplicationCall ??= findBootstrapApplicationCall(tree, mainFilePath);
        if (bootstrapApplicationCall?.arguments.length > 1) {
            const configNode = bootstrapApplicationCall.arguments[1];
            if (isObjectLiteralExpression(configNode)) {
                return { filePath: mainFilePath, node: configNode };
            } else if (isIdentifier(configNode)) {
                return resolveAppConfig(configNode.getSourceFile(), configNode.text, tree, mainFilePath);
            } else if (isCallExpression(configNode)) {
                return resolveAppConfig(configNode.getSourceFile(), configNode.expression.getText(), tree, mainFilePath);
            }
        }
        return { filePath: mainFilePath, node: null };
    } catch {
        return null;
    }
};

// --- HELPER(s) ---

/**
 * @internal
 */
const removeProviderFromConfig = (
    filePath: string,
    config: ObjectLiteralExpression,
    providerName: string,
): Change[] => {
    const providersArrayProp = config.properties?.find(prop => (
        isPropertyAssignment(prop)
        && isIdentifier(prop.name)
        && isArrayLiteralExpression(prop.initializer)
        && (prop.name.text === 'providers')
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
    indent = 2,
): Change => {
    const indentBy = getIndentBy(tree, filePath, config.getStart());

    const providersArrayProp = config.properties?.find(prop => (
        isPropertyAssignment(prop)
        && isIdentifier(prop.name)
        && isArrayLiteralExpression(prop.initializer)
        && (prop.name.text === 'providers')
    )) as PropertyAssignment;
    if (providersArrayProp) {
        const providersArray = providersArrayProp.initializer as ArrayLiteralExpression;
        if (useImportProvidersFrom) {
            const importProvidersFromProp = providersArray.elements.find(prop =>
                isCallExpression(prop)
                && isIdentifier(prop.expression)
                && (prop.expression.text === 'importProvidersFrom')) as CallExpression;
            if (!importProvidersFromProp) {
                const toAdd = `\n${indentBy(indent * 2)}importProvidersFrom(${providerName})`;
                return new InsertChange(
                    filePath,
                    providersArray.getStart() + 1,
                    (providersArray.elements.length) ? `${toAdd},` : toAdd,
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
                (providersArray.elements.length) ? `${toAdd},` : toAdd,
            );
        }
    } else {
        const indentedProviderName = providerName.replace(/\r?\n|\r/gm, `$&${indentBy(indent * 2)}`);
        const toAdd = `\n${indentBy(indent)}providers: [\n${indentBy(indent * 2)}${indentedProviderName}\n${indentBy(indent)}]`;
        return new InsertChange(
            filePath,
            config.getStart() + 1,
            (config.properties.length) ? `${toAdd},` : `${toAdd}\n`,
        );
    }
};

/**
 * @internal
 */
const findAppConfigFromVariableName = (sourceFile: SourceFile, variableName: string): Expression | null => {
    for (const node of sourceFile.statements) {
        if (isVariableStatement(node)) {
            for (const decl of node.declarationList.declarations) {
                if (isIdentifier(decl.name)
                  && (decl.name.text === variableName)
                  && decl.initializer
                ) {
                    return decl.initializer;
                }
            }
        }
    }
    return null;
};

/**
 * @internal
 */
const resolveAppConfig = (sourceFile: SourceFile, variableName: string, tree: Tree, bootstapFilePath: string): AppConfig => {
    for (const node of sourceFile.statements) {
        // Only look at relative imports. This will break if the app uses a path mapping to refer to the import, but in
        // order to resolve those, we would need knowledge about the entire program.
        if (
            !isImportDeclaration(node)
            || !node.importClause?.namedBindings
            || !isNamedImports(node.importClause.namedBindings)
            || !isStringLiteralLike(node.moduleSpecifier)
            || !node.moduleSpecifier.text.startsWith('.')
        ) {
            continue;
        }

        for (const specifier of node.importClause.namedBindings.elements) {
            if (specifier.name.text !== variableName) {
                continue;
            }

            // Look for a variable with the imported name in the file. Note that ideally we would use the type checker to resolve
            // this, but we can't because these utilities are set up to operate on individual files, not the entire program.
            const filePath = join(dirname(bootstapFilePath), `${node.moduleSpecifier.text}.ts`);
            return {
                filePath,
                node: findAppConfigFromVariableName(getSourceFile(tree, filePath), (specifier.propertyName ?? specifier.name).text),
            };
        }
    }

    return {
        filePath: bootstapFilePath,
        node: findAppConfigFromVariableName(sourceFile, variableName),
    };
};
