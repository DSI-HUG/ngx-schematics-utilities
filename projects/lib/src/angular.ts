import type { Version } from '@angular/core';
import type { JsonObject, JsonValue } from '@angular-devkit/core';
import { noop, type Rule, SchematicsException, type Tree } from '@angular-devkit/schematics';
import {
    addDeclarationToModule, addExportToModule, addImportToModule, addProviderToModule,
    addRouteDeclarationToModule, addSymbolToNgModuleMetadata, insertImport,
} from '@schematics/angular/utility/ast-utils';
import { NoopChange } from '@schematics/angular/utility/change';
import { JSONFile } from '@schematics/angular/utility/json-file';
import { findAppConfig } from '@schematics/angular/utility/standalone/app_config';
import { findBootstrapApplicationCall } from '@schematics/angular/utility/standalone/util';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { Builders, ProjectType } from '@schematics/angular/utility/workspace-models';
import { join } from 'node:path';
import { satisfies } from 'semver';

import {
    addProviderToStandaloneApplication, getStandaloneApplicationConfig, removeProviderFromStandaloneApplication,
    removeSymbolFromNgModuleMetadata,
} from './ast-utils';
import type { ApplicationDefinition, LibraryDefinition } from './chainable/chainable-project';
import { getAngularVersionFromEsm } from './esm-wrapper';
import { commitChanges, getTsSourceFile } from './file';

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
 * Ensures that a project is actually an Angular application or throws an exception otherwise.
 * @throws {SchematicsException} An exception if the project is not an Angular application.
 * @param {string} projectName The name of the project to look for.
 * @returns {Rule}
 */
export const ensureIsAngularApplication = (projectName: string): Rule =>
    async (tree: Tree): Promise<void> => {
        ensureProjectIsDefined(projectName);
        const project = await getProjectFromWorkspace(tree, projectName);
        if (project.extensions['projectType'] !== ProjectType.Application) {
            throw new SchematicsException('Project is not an Angular application.');
        }
    };

/**
 * Ensures that a project is actually an Angular library or throws an exception otherwise.
 * @throws {SchematicsException} An exception if the project is not an Angular library.
 * @param {string} projectName The name of the project to look for.
 * @returns {Rule}
 */
export const ensureIsAngularLibrary = (projectName: string): Rule =>
    async (tree: Tree): Promise<void> => {
        ensureProjectIsDefined(projectName);
        const project = await getProjectFromWorkspace(tree, projectName);
        if (project.extensions['projectType'] !== ProjectType.Library) {
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
            const ngVersion = await getAngularVersion();
            return (satisfies(ngVersion.full, range)) ? rule : noop();
        } catch {
            return noop();
        }
    };

/**
 * Adds a new asset to the `build` and `test` sections of the `angular.json` file.
 * @param {JsonObject|string} value The asset to add.
 * @param {string} projectName The name of the project to look for.
 * @returns {Rule}
 */
export const addAngularJsonAsset = (value: JsonObject | string, projectName: string): Rule =>
    (tree: Tree): void => {
        ensureProjectIsDefined(projectName);
        customizeAngularJsonBuildAndTestSection('add', 'assets', tree, value, projectName);
    };

/**
 * Removes an asset from the `build` and `test` sections of the `angular.json` file.
 * @param {JsonObject|string} value The asset to remove.
 * @param {string} projectName The name of the project to look for.
 * @returns {Rule}
 */
export const removeAngularJsonAsset = (value: JsonObject | string, projectName: string): Rule =>
    (tree: Tree): void => {
        ensureProjectIsDefined(projectName);
        customizeAngularJsonBuildAndTestSection('remove', 'assets', tree, value, projectName);
    };

/**
 * Adds a new style to the `build` and `test` sections of the `angular.json` file.
 * @param {JsonObject|string} value The style to add.
 * @param {string} projectName The name of the project to look for.
 * @returns {Rule}
 */
export const addAngularJsonStyle = (value: JsonObject | string, projectName: string): Rule =>
    (tree: Tree): void => {
        ensureProjectIsDefined(projectName);
        customizeAngularJsonBuildAndTestSection('add', 'styles', tree, value, projectName);
    };

/**
 * Removes a style from the `build` and `test` sections of the `angular.json` file.
 * @param {JsonObject|string} value The style to remove.
 * @param {string} projectName The name of the project to look for.
 * @returns {Rule}
 */
export const removeAngularJsonStyle = (value: JsonObject | string, projectName: string): Rule =>
    (tree: Tree): void => {
        ensureProjectIsDefined(projectName);
        customizeAngularJsonBuildAndTestSection('remove', 'styles', tree, value, projectName);
    };

/**
 * Adds a new script to the `build` and `test` sections of the `angular.json` file.
 * @param {JsonObject|string} value The script to add.
 * @param {string} projectName The name of the project to look for.
 * @returns {Rule}
 */
export const addAngularJsonScript = (value: JsonObject | string, projectName: string): Rule =>
    (tree: Tree): void => {
        ensureProjectIsDefined(projectName);
        customizeAngularJsonBuildAndTestSection('add', 'scripts', tree, value, projectName);
    };

/**
 * Removes a script from the `build` and `test` sections of the `angular.json` file.
 * @param {JsonObject|string} value The style to remove.
 * @param {string} projectName The name of the project to look for.
 * @returns {Rule}
 */
export const removeAngularJsonScript = (value: JsonObject | string, projectName: string): Rule =>
    (tree: Tree): void => {
        ensureProjectIsDefined(projectName);
        customizeAngularJsonBuildAndTestSection('remove', 'scripts', tree, value, projectName);
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
                removeSymbolFromNgModuleMetadata(sourceFile, filePath, 'imports', realClassifiedName),
            ]);

            // Refresh source and add import + metadata
            sourceFile = getTsSourceFile(tree, filePath);
            commitChanges(tree, filePath, [
                insertImport(sourceFile, filePath, realClassifiedName, importPath),
                ...addSymbolToNgModuleMetadata(sourceFile, filePath, 'imports', classifiedName),
            ]);
        } else {
            commitChanges(tree, filePath,
                addImportToModule(sourceFile, filePath, classifiedName, importPath),
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

/**
 * Inserts a provider (ex. provideRouter) into a bootstrapApplication's providers and also imports that provider.
 * @param {string} filePath The path of the file containing the bootstrapApplication call to modify.
 * @param {string} providerName The name of the provider to insert.
 * @param {string} importPath The path of the file containing the provider to insert.
 * @param {boolean} [useImportProvidersFrom=false] Whether or not to use the importProvidersFrom api.
 * @param {number} [indent=2] The indentation used during the insertion.
 * @returns {Rule}
 */
export const addProviderToBootstrapApplication = (filePath: string, providerName: string, importPath: string, useImportProvidersFrom = false, indent = 2): Rule =>
    (tree: Tree): void => {
        let realProviderName = providerName;

        // Fix: manage provider import with arguments (ex: provideRouter(ROUTES))
        const matches = new RegExp(/(.*)\(/gm).exec(providerName);
        if (matches?.length) {
            realProviderName = matches[1].trim();

            // Remove any entry first
            removeProviderFromStandaloneApplication(tree, filePath, realProviderName);
        }

        // Add provider
        addProviderToStandaloneApplication(tree, filePath, providerName, useImportProvidersFrom, indent);

        // Manage import(s)
        const bootstrapApplicationCall = findBootstrapApplicationCall(tree, filePath);
        const appConfig = findAppConfig(bootstrapApplicationCall, tree, filePath);
        const filePathToUse = (appConfig) ? appConfig.filePath : filePath;
        const sourceFile = getTsSourceFile(tree, filePathToUse);
        commitChanges(tree, filePathToUse, [
            insertImport(sourceFile, filePathToUse, realProviderName, importPath),
            (useImportProvidersFrom) ? insertImport(sourceFile, filePathToUse, 'importsProvidersFrom', '@angular/core') : new NoopChange(),
        ]);
    };

/**
 * Removes a provider (ex. provideRouter) from a bootstrapApplication's providers.
 * @param {string} filePath The path of the file containing the bootstrapApplication call to modify.
 * @param {string} providerName The name of the provider to remove.
 * @returns {Rule}
 */
export const removeProviderFromBootstrapApplication = (filePath: string, providerName: string): Rule =>
    (tree: Tree): void => {
        removeProviderFromStandaloneApplication(tree, filePath, providerName);
    };

// --- HELPER(s) ---

/**
 * Gets the version of Angular currently used in the project.
 * @async
 * @returns {Promise<Version>}
 */
export const getAngularVersion = async (): Promise<Version> =>
    await getAngularVersionFromEsm();

/**
 * Gets a project output path as defined in the `angular.json` file.
 * @param {Tree} tree The current schematic's project tree.
 * @param {string} projectName The name of the project to look for.
 * @throws {SchematicsException} An exception if a `defaultProject` property was not found in the `angular.json` file.
 * @returns {string} The default project output path or `dist/<projectName>` if not defined.
 */
export const getProjectOutputPath = (tree: Tree, projectName: string): string => {
    ensureProjectIsDefined(projectName);
    const angularJson = new JSONFile(tree, 'angular.json');
    const outputPath = angularJson.get(['projects', projectName, 'architect', 'build', 'options', 'outputPath']) as string;
    return outputPath ?? `dist/${projectName}`;
};

/**
 * Gets a project main file path as defined in the `angular.json` file.
 * @param {Tree} tree The current schematic's project tree.
 * @param {string} projectName The name of the project to look for.
 * @returns {string} The default project main file path.
 */
export const getProjectMainFilePath = (tree: Tree, projectName: string): string => {
    ensureProjectIsDefined(projectName);
    const angularJson = new JSONFile(tree, 'angular.json');
    const buildOptions = angularJson.get(['projects', projectName, 'architect', 'build']) as { builder: string; options: Record<string, string> };
    const appBuilders: string[] = [Builders.Application, Builders.BuildApplication];
    return appBuilders.includes(buildOptions?.builder) ? buildOptions?.options?.['browser'] : buildOptions?.options?.['main'];
};

/**
 * Gets a standalone project main config file path.
 * @param {Tree} tree The current schematic's project tree.
 * @param {string} projectName The name of the project to look for.
 * @returns {string|null} The project main config file path if found or null otherwise.
 */
export const getProjectMainConfigFilePath = (tree: Tree, projectName: string): string | null => {
    ensureProjectIsDefined(projectName);
    const appConfig = getStandaloneApplicationConfig(tree, getProjectMainFilePath(tree, projectName));
    return appConfig ? appConfig.filePath : null;
};

/**
 * Gets a project definition object from the current Angular workspace.
 * @async
 * @param {Tree} tree The current schematic's project tree.
 * @param {string} projectName The name of the project to look for.
 * @throws {SchematicsException} An exception if no project was found.
 * @returns {Promise<LibraryDefinition | ApplicationDefinition>} A project definition object.
 */
export const getProjectFromWorkspace = async <T extends LibraryDefinition | ApplicationDefinition>(tree: Tree, projectName: string): Promise<T> => {
    ensureProjectIsDefined(projectName);
    const workspace = await getWorkspace(tree);
    const project = workspace.projects.get(projectName);
    if (!project) {
        throw new SchematicsException(`Project "${projectName}" was not found in the current workspace.`);
    }

    const options = {
        name: projectName,
        ...project,
        pathFromRoot: (path: string): string => join(project.root ?? '', path),
        pathFromSourceRoot: (path: string): string => join(project.sourceRoot ?? 'src', path),
    };

    if (project.extensions['projectType'] === ProjectType.Application) {
        /**
         *  Using tree.getDir().subfiles as tree.exists() does not work for directory only
         */
        let assetsPath: string | null = options.pathFromRoot('public');
        if (!tree.getDir(assetsPath).subfiles.length) {
            assetsPath = options.pathFromSourceRoot('assets');
            if (!tree.getDir(assetsPath).subfiles.length) {
                assetsPath = null;
            }
        }

        return {
            ...options,
            isStandalone: isProjectStandalone(tree, projectName),
            mainFilePath: getProjectMainFilePath(tree, projectName),
            mainConfigFilePath: getProjectMainConfigFilePath(tree, projectName),
            outputPath: getProjectOutputPath(tree, projectName),
            assetsPath,
        } as T;
    }
    return options as T;
};

/**
 * Checks if a project if of type standalone.
 * @param {Tree} tree The current schematic's project tree.
 * @param {string} projectName The name of the project to look for.
 * @returns {boolean} Whether or not the project is of type standalone.
 */
export const isProjectStandalone = (tree: Tree, projectName: string): boolean => {
    try {
        const mainFilePath = getProjectMainFilePath(tree, projectName);
        const bootstrapApplicationCall = findBootstrapApplicationCall(tree, mainFilePath);
        return (bootstrapApplicationCall !== null);
    } catch {
        return false;
    }
};

/**
 * Ensures a project is defined.
 * @param {string} projectName The name of the project to look for.
 * @internal
 */
export const ensureProjectIsDefined = (projectName: string | undefined): void => {
    if (!projectName) {
        throw new SchematicsException('Project cannot be determined and no --project option was provided.');
    }
};

const customizeAngularJsonBuildAndTestSection = (action: 'add' | 'remove', option: string, tree: Tree, value: JsonValue, projectName: string): void => {
    const angularJson = new JSONFile(tree, 'angular.json');
    const architectPath = ['projects', projectName, 'architect'];

    ['build', 'test'].forEach(configName => {
        const path = [...architectPath, configName, 'options', option];
        const values = (angularJson.get(path) ?? []) as (string | JsonValue)[];
        const stringifiedValue = values.map(opt => JSON.stringify(opt));
        if ((action === 'add') && !stringifiedValue.includes(JSON.stringify(value))) {
            values.push(value);
            angularJson.modify(path, values);
        } else if (action === 'remove') {
            const valueIndex = stringifiedValue.indexOf(JSON.stringify(value));
            if (valueIndex !== -1) {
                values.splice(valueIndex, 1);
                angularJson.modify(path, values);
            }
        }
    });
};
