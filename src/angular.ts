import { noop, Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import {
    ArrayLiteralExpression, ObjectLiteralExpression, PropertyAssignment, SourceFile
} from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import {
    addDeclarationToModule, addExportToModule, addImportToModule, addProviderToModule,
    addRouteDeclarationToModule, addSymbolToNgModuleMetadata, getDecoratorMetadata,
    getMetadataField, insertImport
} from '@schematics/angular/utility/ast-utils';
import { Change, NoopChange, RemoveChange } from '@schematics/angular/utility/change';
import { JSONFile } from '@schematics/angular/utility/json-file';
import { join } from 'path';
import { satisfies } from 'semver';

import { commitChanges, getTsSourceFile } from './file';

export const ensureIsAngularProject = (): Rule =>
    (tree: Tree): void => {
        if (!tree.exists('angular.json')) {
            throw new SchematicsException('Project is not an Angular project.');
        }
    };

export const isAngularVersion = (range: string, rule: Rule): Rule => {
    try {
        const angularPkgJsonPath = require.resolve(join('@angular/core', 'package.json'), { paths: ['.'] });
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const ngVersion = (require(angularPkgJsonPath) as { version: string }).version;
        return (satisfies(ngVersion, range)) ? rule : noop();
    } catch {
        return noop();
    }
};

export const addAngularJsonAssets = (value: string): Rule =>
    (tree: Tree): void => {
        const angularJson = new JSONFile(tree, 'angular.json');
        const architectPath = ['projects', getDefaultProjectName(tree), 'architect'];

        ['build', 'test'].forEach(configName => {
            const assetsPath = [...architectPath, configName, 'options', 'assets'];
            const assets = angularJson.get(assetsPath) as string[];
            if (!assets.includes(value)) {
                assets.push(value);
                if (JSON.stringify(angularJson.get(assetsPath)) !== JSON.stringify(assets)) {
                    angularJson.modify(assetsPath, assets);
                }
            }
        });
    };

export const getDefaultProjectName = (tree: Tree): string => {
    const angularJson = new JSONFile(tree, 'angular.json');
    const defaultProjectName = angularJson.get(['defaultProject']) as string;
    if (!defaultProjectName) {
        throw new SchematicsException('Cannot find "defaultProject" property in angular.json file.');
    }
    return defaultProjectName;
};

export const getDefaultProjectOutputPath = (tree: Tree): string => {
    const angularJson = new JSONFile(tree, 'angular.json');
    return angularJson.get(['projects', getDefaultProjectName(tree), 'architect', 'build', 'options', 'outputPath']) as string;
};

export const removeSymbolFromNgModuleMetadata = (sourceFile: SourceFile, filePath: string, metadataField: string, classifiedName: string): Change => {
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

export const addDeclarationToNgModule = (filePath: string, classifiedName: string, importPath: string): Rule =>
    (tree: Tree): void => {
        const sourceFile = getTsSourceFile(tree, filePath);
        const changes = addDeclarationToModule(sourceFile, filePath, classifiedName, importPath);
        commitChanges(tree, filePath, changes);
    };

export const addImportToNgModule = (filePath: string, classifiedName: string, importPath: string): Rule =>
    (tree: Tree): void => {
        let sourceFile = getTsSourceFile(tree, filePath);

        // Fix: manage module import with `forRoot`
        const matches = new RegExp(/(.*).forRoot\(/gm).exec(classifiedName);
        if (matches?.length) {
            const realClassifiedName = matches[1];

            // Remove any entry first
            commitChanges(tree, filePath, [
                removeSymbolFromNgModuleMetadata(sourceFile, filePath, 'imports', realClassifiedName)
            ]);

            // Refresh source and add import + metadata
            sourceFile = getTsSourceFile(tree, filePath);
            commitChanges(tree, filePath, [
                insertImport(sourceFile, filePath, realClassifiedName, importPath),
                ...addSymbolToNgModuleMetadata(sourceFile, filePath, 'imports', classifiedName)
            ]);
        } else {
            commitChanges(tree, filePath,
                addImportToModule(sourceFile, filePath, classifiedName, importPath)
            );
        }
    };


export const addExportToNgModule = (filePath: string, classifiedName: string, importPath: string): Rule =>
    (tree: Tree): void => {
        const sourceFile = getTsSourceFile(tree, filePath);
        const changes = addExportToModule(sourceFile, filePath, classifiedName, importPath);
        commitChanges(tree, filePath, changes);
    };

export const addProviderToNgModule = (filePath: string, classifiedName: string, importPath: string): Rule =>
    (tree: Tree): void => {
        const sourceFile = getTsSourceFile(tree, filePath);
        const changes = addProviderToModule(sourceFile, filePath, classifiedName, importPath);
        commitChanges(tree, filePath, changes);
    };

export const addRouteDeclarationToNgModule = (filePath: string, fileToAdd: string, routeLiteral: string): Rule =>
    (tree: Tree): void => {
        const sourceFile = getTsSourceFile(tree, filePath);
        const change = addRouteDeclarationToModule(sourceFile, fileToAdd, routeLiteral);
        commitChanges(tree, filePath, [change]);
    };
