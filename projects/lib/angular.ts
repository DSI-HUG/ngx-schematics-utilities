import { ProjectDefinition as NgDevKitProjectDefinition } from '@angular-devkit/core/src/workspace';
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
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectType } from '@schematics/angular/utility/workspace-models';
import { join } from 'path';
import { satisfies } from 'semver';

import { commitChanges, getTsSourceFile } from './file';

const removeSymbolFromNgModuleMetadata = (sourceFile: SourceFile, filePath: string, metadataField: string, classifiedName: string): Change => {
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

export interface ProjectDefinition extends NgDevKitProjectDefinition {
    name: string;
    pathFromRoot: (path: string) => string;
    pathFromSourceRoot: (path: string) => string;
}

// --- RULE(s) ----

/**
 * Ensures that the workspace, where the schematic is currently running on, is actually an
 * Angular workspace or throws an exception otherwise. The test is done by ensuring the
 * existence of an `angular.json` file.
 * @throws {SchematicsException} An exception if an `angular.json` file was not found.
 * @returns {Rule}
 */
export const ensureIsAngularWorkspace = (): Rule =>
    (tree: Tree): void => {
        if (!tree.exists('angular.json')) {
            throw new SchematicsException('Unable to locate a workspace file, are you missing an `angular.json` or `.angular.json` file ?.');
        }
    };

/**
 * Ensures that a project is actually an Angular project or throws an exception otherwise.
 * @throws {SchematicsException} An exception if the project is not an Angular project.
 * @param {string} [projectName='defaultProject from angular.json'] The name of the project to look for.
 * @returns {Rule}
 */
export const ensureIsAngularProject = (projectName?: string): Rule =>
    async (tree: Tree): Promise<void> => {
        const project = await getProjectFromWorkspace(tree, projectName);
        if (project.extensions.projectType !== ProjectType.Application) {
            throw new SchematicsException('Project is not an Angular project.');
        }
    };

/**
 * Ensures that a project is actually an Angular library or throws an exception otherwise.
 * @throws {SchematicsException} An exception if the project is not an Angular library.
 * @param {string} [projectName='defaultProject from angular.json'] The name of the project to look for.
 * @returns {Rule}
 */
export const ensureIsAngularLibrary = (projectName?: string): Rule =>
    async (tree: Tree): Promise<void> => {
        const project = await getProjectFromWorkspace(tree, projectName);
        if (project.extensions.projectType !== ProjectType.Library) {
            throw new SchematicsException('Project is not an Angular library.');
        }
    };

/**
 * Executes a rule only if the current Angular version installed in the project satisfies a given range.
 * @param {string} range An Angular version range that must be satisfied.
 * @param {Rule} rule The rule to execute.
 * @returns {Rule}
 */
export const isAngularVersion = (range: string, rule: Rule): Rule =>
    async (): Promise<Rule> => {
        try {
            const angularPkgJsonPath = require.resolve(join('@angular/core', 'package.json'), { paths: ['.'] });
            const ngVersion = (await import(angularPkgJsonPath) as { version: string }).version;
            return (satisfies(ngVersion, range)) ? rule : noop();
        } catch {
            return noop();
        }
    };

/**
 * Adds a new asset to the `build` and `test` sections of the `angular.json` file.
 * @param {string} value The asset to add.
 * @param {string} [projectName='defaultProject from angular.json'] The name of the project to look for.
 * @returns {Rule}
 */
export const addAngularJsonAsset = (value: string, projectName?: string): Rule =>
    (tree: Tree): void => {
        const angularJson = new JSONFile(tree, 'angular.json');
        const architectPath = ['projects', projectName ?? getDefaultProjectName(tree), 'architect'];

        ['build', 'test'].forEach(configName => {
            const assetsPath = [...architectPath, configName, 'options', 'assets'];
            const assets = angularJson.get(assetsPath) as string[];
            if (!assets.includes(value)) {
                assets.push(value);
                angularJson.modify(assetsPath, assets);
            }
        });
    };

/**
 * Removes an asset from the `build` and `test` sections of the `angular.json` file.
 * @param {string} value The asset to remove.
 * @param {string} [projectName='defaultProject from angular.json'] The name of the project to look for.
 * @returns {Rule}
 */
export const removeAngularJsonAsset = (value: string, projectName?: string): Rule =>
    (tree: Tree): void => {
        const angularJson = new JSONFile(tree, 'angular.json');
        const architectPath = ['projects', projectName ?? getDefaultProjectName(tree), 'architect'];

        ['build', 'test'].forEach(configName => {
            const assetsPath = [...architectPath, configName, 'options', 'assets'];
            const assets = angularJson.get(assetsPath) as string[];
            const valueIndex = assets.indexOf(value);
            if (valueIndex !== -1) {
                assets.splice(valueIndex, 1);
                angularJson.modify(assetsPath, assets);
            }
        });
    };

/**
 * Inserts a declaration (ex. Component, Pipe, Directive) into an NgModule declarations and also imports that declaration.
 * @param {string} filePath The path of the file containing the NgModule to modify.
 * @param {string} classifiedName The classified name of the declaration to insert.
 * @param {string} importPath The path of the file containing the declaration to insert.
 * @returns {Rule}
 */
export const addDeclarationToNgModule = (filePath: string, classifiedName: string, importPath: string): Rule =>
    (tree: Tree): void => {
        const sourceFile = getTsSourceFile(tree, filePath);
        const changes = addDeclarationToModule(sourceFile, filePath, classifiedName, importPath);
        commitChanges(tree, filePath, changes);
    };

/**
 * Removes a declaration (ex. Component, Pipe, Directive) from an NgModule declarations.
 * @param {string} filePath The path of the file containing the NgModule to modify.
 * @param {string} classifiedName The classified name of the declaration to remove.
 * @returns {Rule}
 */
export const removeDeclarationFromNgModule = (filePath: string, classifiedName: string): Rule =>
    (tree: Tree): void => {
        const sourceFile = getTsSourceFile(tree, filePath);
        const change = removeSymbolFromNgModuleMetadata(sourceFile, filePath, 'declarations', classifiedName);
        commitChanges(tree, filePath, [change]);
    };

/**
 * Inserts an import (ex. NgModule) into an NgModule imports and also imports that import.
 * @param {string} filePath The path of the file containing the NgModule to modify.
 * @param {string} classifiedName The classified name of the import to insert.
 * @param {string} importPath The path of the file containing the import to insert.
 * @returns {Rule}
 */
export const addImportToNgModule = (filePath: string, classifiedName: string, importPath: string): Rule =>
    (tree: Tree): void => {
        let sourceFile = getTsSourceFile(tree, filePath);

        // Fix: manage module import with `forRoot` or `forChild`
        const matches = new RegExp(/(.*)\.(forRoot|forChild)\(/gm).exec(classifiedName);
        if (matches?.length) {
            const realClassifiedName = matches[1].trim();

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

/**
 * Removes an import (ex. NgModule) from an NgModule imports.
 * @param {string} filePath The path of the file containing the NgModule to modify.
 * @param {string} classifiedName The classified name of the import to remove.
 * @returns {Rule}
 */
export const removeImportFromNgModule = (filePath: string, classifiedName: string): Rule =>
    (tree: Tree): void => {
        const sourceFile = getTsSourceFile(tree, filePath);
        const change = removeSymbolFromNgModuleMetadata(sourceFile, filePath, 'imports', classifiedName);
        commitChanges(tree, filePath, [change]);
    };

/**
 * Inserts an export (ex. Component, Pipe, Directive) into an NgModule exports and also imports that export.
 * @param {string} filePath The path of the file containing the NgModule to modify.
 * @param {string} classifiedName The classified name of the export to insert.
 * @param {string} importPath The path of the file containing the export to insert.
 * @returns {Rule}
 */
export const addExportToNgModule = (filePath: string, classifiedName: string, importPath: string): Rule =>
    (tree: Tree): void => {
        const sourceFile = getTsSourceFile(tree, filePath);
        const changes = addExportToModule(sourceFile, filePath, classifiedName, importPath);
        commitChanges(tree, filePath, changes);
    };

/**
 * Removes an export (ex. Component, Pipe, Directive) from an NgModule exports.
 * @param {string} filePath The path of the file containing the NgModule to modify.
 * @param {string} classifiedName The classified name of the export to remove.
 * @returns {Rule}
 */
export const removeExportFromNgModule = (filePath: string, classifiedName: string): Rule =>
    (tree: Tree): void => {
        const sourceFile = getTsSourceFile(tree, filePath);
        const change = removeSymbolFromNgModuleMetadata(sourceFile, filePath, 'exports', classifiedName);
        commitChanges(tree, filePath, [change]);
    };

/**
 * Inserts a provider (ex. Service) into an NgModule providers and also imports that provider.
 * @param {string} filePath The path of the file containing the NgModule to modify.
 * @param {string} classifiedName The classified name of the provider to insert.
 * @param {string} importPath The path of the file containing the provider to insert.
 * @returns {Rule}
 */
export const addProviderToNgModule = (filePath: string, classifiedName: string, importPath: string): Rule =>
    (tree: Tree): void => {
        const sourceFile = getTsSourceFile(tree, filePath);
        const changes = addProviderToModule(sourceFile, filePath, classifiedName, importPath);
        commitChanges(tree, filePath, changes);
    };

/**
 * Removes a provider (ex. Service) from an NgModule providers.
 * @param {string} filePath The path of the file containing the NgModule to modify.
 * @param {string} classifiedName The classified name of the provider to remove.
 * @returns {Rule}
 */
export const removeProviderFromNgModule = (filePath: string, classifiedName: string): Rule =>
    (tree: Tree): void => {
        const sourceFile = getTsSourceFile(tree, filePath);
        const change = removeSymbolFromNgModuleMetadata(sourceFile, filePath, 'providers', classifiedName);
        commitChanges(tree, filePath, [change]);
    };

/**
 * Inserts a route declaration to a router module (i.e. as a RouterModule declaration).
 * @param {string} filePath The path of the file containing the NgModule to modify.
 * @param {string} routeLiteral The Route object to insert.
 * @returns {Rule}
 */
export const addRouteDeclarationToNgModule = (filePath: string, routeLiteral: string): Rule =>
    (tree: Tree): void => {
        const sourceFile = getTsSourceFile(tree, filePath);
        const change = addRouteDeclarationToModule(sourceFile, filePath, routeLiteral);
        commitChanges(tree, filePath, [change]);
    };

// --- HELPER(s) ----

/**
 * Gets the default project name defined in the `angular.json` file.
 * @param {Tree} tree The current schematic's project tree.
 * @throws {SchematicsException} An exception if a `defaultProject` property was not found in the `angular.json` file.
 * @returns {string} The default project name.
 */
export const getDefaultProjectName = (tree: Tree): string => {
    const angularJson = new JSONFile(tree, 'angular.json');
    const defaultProjectName = angularJson.get(['defaultProject']) as string;
    if (!defaultProjectName) {
        throw new SchematicsException('Cannot find "defaultProject" property in angular.json file.');
    }
    return defaultProjectName;
};

/**
 * Gets a project output path as defined in the `angular.json` file.
 * @param {Tree} tree The current schematic's project tree.
 * @param {string} [projectName='defaultProject from angular.json'] The name of the project to look for.
 * @throws {SchematicsException} An exception if a `defaultProject` property was not found in the `angular.json` file.
 * @returns {string} The default project output path.
 */
export const getProjectOutputPath = (tree: Tree, projectName?: string): string => {
    const angularJson = new JSONFile(tree, 'angular.json');
    return angularJson.get(['projects', projectName ?? getDefaultProjectName(tree), 'architect', 'build', 'options', 'outputPath']) as string;
};

/**
 * Gets a project definition object from the current Angular workspace.
 * @async
 * @param {Tree} tree The current schematic's project tree.
 * @param {string} [projectName='defaultProject from angular.json'] The name of the project to look for.
 * @throws {SchematicsException} An exception if no project was found.
 * @returns {Promise<ProjectDefinition>} A project definition object.
 */
export const getProjectFromWorkspace = async (tree: Tree, projectName?: string): Promise<ProjectDefinition> => {
    const workspace = await getWorkspace(tree);
    const name = projectName ?? workspace.extensions.defaultProject as string;
    const project = workspace.projects.get(name);
    if (!project) {
        throw new SchematicsException(`Project "${name}" was not found in the current workspace.`);
    }
    return {
        name,
        ...project,
        pathFromRoot: (path: string) => join(project.root ?? '', path),
        pathFromSourceRoot: (path: string) => join(project.sourceRoot ?? '', path)
    };
};
