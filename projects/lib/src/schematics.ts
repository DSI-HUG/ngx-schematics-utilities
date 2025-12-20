import { type Option, parseJsonSchemaToOptions } from '@angular/cli/src/command-builder/utilities/json-schema';
import type { JsonObject } from '@angular-devkit/core';
import { CoreSchemaRegistry } from '@angular-devkit/core/src/json/schema/index';
import type { SchematicContext } from '@angular-devkit/schematics';
import type { NodeWorkflow } from '@angular-devkit/schematics/tools';
import { dirname as pathDirname, posix } from 'node:path';

import { getJsonFromUrl } from './request';

export interface NgCliOption extends Option {
    hint: string;
}

const getExternalSchemaJson = async (packageName: string, schematicName = 'ng-add', retries = 3, backoff = 300): Promise<JsonObject> => {
    const url = `http://cdn.jsdelivr.net/npm/${packageName}@latest`;

    const pkgJson = await getJsonFromUrl(posix.join(url, 'package.json'), retries, backoff);
    if (pkgJson?.['schematics']) {
        const collectionJson = await getJsonFromUrl(posix.join(url, pkgJson['schematics'] as string), retries, backoff);
        if (collectionJson?.['schematics']) {
            const schema = ((collectionJson['schematics'] as JsonObject)[schematicName] as JsonObject)?.['schema'] as string;
            if (!schema) {
                throw new Error(`Schematic "${schematicName}" not found in collection "${packageName}".`);
            }
            return await getJsonFromUrl(posix.join(url, pathDirname(pkgJson['schematics'] as string), schema), retries, backoff);
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
 * @param {number} [retries=3] The number of times to retry the request in case of failure.
 * @param {number} [backoff=300] The delay (in milliseconds) between retries.
 * @returns {Promise<NgCliOption[]>} A collection of `NgCliOption` objects.
 */
export const getSchematicSchemaOptions = async (
    context: SchematicContext,
    schematicName = 'ng-add',
    packageName?: string,
    external = false,
    retries = 3,
    backoff = 300,
): Promise<NgCliOption[]> => {
    let schemaJson: JsonObject | undefined;
    if (!packageName) {
        packageName = context.schematic?.collection?.description?.name;
    }
    if (!external) {
        const collection = context.engine.createCollection(packageName);
        const schematic = collection.createSchematic(schematicName, false);
        schemaJson = (schematic.description as unknown as { schemaJson: JsonObject }).schemaJson;
    } else {
        schemaJson = await getExternalSchemaJson(packageName, schematicName, retries, backoff);
    }
    if (schemaJson?.['properties']) {
        const schemaPropertiesOrdered = Object.keys(schemaJson?.['properties'] as JsonObject);
        const registry = (context.engine.workflow as NodeWorkflow)?.registry ?? new CoreSchemaRegistry();
        const options = await parseJsonSchemaToOptions(registry, schemaJson) as NgCliOption[];
        options
            // Fix: @angular/cli is not keeping the options in the same order as they are declared in schema.json
            .sort((a, b) => schemaPropertiesOrdered.indexOf(a.name) - schemaPropertiesOrdered.indexOf(b.name))

            // Feat: add support for "hint" property
            // Fix: @angular/cli is not handling "required" and "default" properties
            .forEach(option => {
                const props = ((schemaJson?.['properties'] as JsonObject)[option.name] as JsonObject);
                if (props?.['hint']) {
                    option.hint = props?.['hint'] as string;
                }
                if (props?.['default']) {
                    option.default = props?.['default'] as string;
                }
                if ((schemaJson?.['required'] as string[])?.includes(option.name)) {
                    // eslint-disable-next-line @typescript-eslint/no-deprecated
                    option.required = true;
                }
            });
        return options;
    }
    return [];
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
