import { Option, parseJsonSchemaToOptions } from '@angular/cli/src/command-builder/utilities/json-schema';
import { JsonObject } from '@angular-devkit/core';
import { CoreSchemaRegistry } from '@angular-devkit/core/src/json/schema';
import { SchematicContext } from '@angular-devkit/schematics';
import { NodeWorkflow } from '@angular-devkit/schematics/tools';
import { dirname as pathDirname, join as pathJoin } from 'path';

import { getJsonFromUrl } from './request';

export interface NgCliOption extends Option {
    hint: string;
}

const getExternalSchemaJson = async (packageName: string, schematicName = 'ng-add'): Promise<JsonObject> => {
    const url = `http://cdn.jsdelivr.net/npm/${packageName}@latest`;

    const pkgJson = await getJsonFromUrl(pathJoin(url, 'package.json'));
    if (pkgJson?.['schematics']) {
        const collectionJson = await getJsonFromUrl(pathJoin(url, pkgJson['schematics'] as string));
        if (collectionJson?.['schematics']) {
            const schema = ((collectionJson['schematics'] as JsonObject)[schematicName] as JsonObject)?.['schema'] as string;
            if (!schema) {
                throw new Error(`Schematic "${schematicName}" not found in collection "${packageName}".`);
            }
            return await getJsonFromUrl(pathJoin(url, pathDirname(pkgJson['schematics'] as string), schema));
        }
    }

    throw new Error(`Package "${packageName}" was found but does not support schematics.`);
};

/**
 * Returns all the options of a specific local or external schematic's schema.
 * @async
 * @param {SchematicContext} context The current schematic context.
 * @param {string} [schematicName="ng-add"] Name of the schematic schema (ex: "drag-drop").
 * @param {string} [packageName="current-schematic-collection-name"] Name of the package containing the schematic schema (ex: "@angular/cli").
 * @param {boolean} [external=false] Whether the schematic is local or external.
 * @returns {Promise<NgCliOption[]>} A collection of `NgCliOption` objects.
 */
export const getSchematicSchemaOptions = async (context: SchematicContext, schematicName = 'ng-add', packageName?: string, external = false): Promise<NgCliOption[]> => {
    let schemaJson: JsonObject;
    if (!packageName) {
        packageName = context.schematic?.collection?.description?.name;
    }
    if (!external) {
        const collection = context.engine.createCollection(packageName);
        const schematic = collection.createSchematic(schematicName, false);
        schemaJson = (schematic.description as unknown as { schemaJson: JsonObject }).schemaJson;
    } else {
        schemaJson = await getExternalSchemaJson(packageName, schematicName);
    }
    const registry = (context.engine.workflow as NodeWorkflow)?.registry || new CoreSchemaRegistry();
    const options = await parseJsonSchemaToOptions(registry, schemaJson || {}) as NgCliOption[];
    /**
     * Fix: @angular/cli is not handling required and default properties
     * Feat: add support for hint property
     */
    options.forEach(option => {
        const props = ((schemaJson?.['properties'] as JsonObject)[option.name] as JsonObject);
        if (props?.['hint']) {
            option.hint = props?.['hint'] as string;
        }
        if (props?.['default']) {
            option.default = props?.['default'] as string;
        }
        if ((schemaJson?.['required'] as string[])?.includes(option.name)) {
            option.required = true;
        }
    });
    // --
    return options;
};

/**
 * Returns all the default options of a specific local or external schematic's schema.
 * @async
 * @param {SchematicContext} context The current schematic context.
 * @param {string} [schematicName="ng-add"] Name of the schematic schema (ex: "drag-drop").
 * @param {string} [packageName="current-schematic-collection-name"] Name of the package containing the schematic schema (ex: "@angular/cli").
 * @param {boolean} [external=false] Whether the schematic is local or external.
 * @returns {Promise<JsonObject>} A JsonObject containing all the default options.
 */
export const getSchematicSchemaDefaultOptions = async (context: SchematicContext, schematicName = 'ng-add', packageName?: string, external = false): Promise<JsonObject> => {
    const schemaOptions = await getSchematicSchemaOptions(context, schematicName, packageName, external);
    return schemaOptions.reduce((defaultOptions, option) => {
        (defaultOptions as Record<string, unknown>)[option.name] = option.default;
        return defaultOptions;
    }, {});
};
