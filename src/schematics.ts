import { Option } from '@angular/cli/models/interface';
import { parseJsonSchemaToOptions } from '@angular/cli/utilities/json-schema';
import { JsonObject, schema } from '@angular-devkit/core';
import { SchematicContext } from '@angular-devkit/schematics';
import { dirname as pathDirname, resolve as pathResolve } from 'path';

import { getJsonFromUrl } from './request';

export interface NgCliOption extends Option {
    hint: string;
}

const getExternalSchemaJson = async (packageName: string): Promise<JsonObject> => {
    const hostname = 'cdn.jsdelivr.net';
    const path = `/npm/${packageName}@latest`;
    const pkgJson = await getJsonFromUrl(pathResolve(hostname, path, 'package.json'));
    if (pkgJson?.schematics) {
        const collectionJson = await getJsonFromUrl(pathResolve(hostname, path, pkgJson.schematics as string));
        if (collectionJson?.schematics) {
            return await getJsonFromUrl(pathResolve(
                hostname,
                path,
                pathDirname(pkgJson.schematics as string),
                ((collectionJson.schematics as JsonObject)['ng-add'] as JsonObject).schema as string
            ));
        }
    }
    return {};
};

export const getSchematicSchemaOptions = async (context: SchematicContext, collectionName: string, schematicName: string, external = false): Promise<NgCliOption[]> => {
    try {
        let schemaJson: JsonObject;
        if (!external) {
            const collection = context.engine.createCollection(collectionName);
            const schematic = collection.createSchematic(schematicName, false);
            schemaJson = (schematic.description as unknown as { schemaJson: JsonObject }).schemaJson;
        } else {
            schemaJson = await getExternalSchemaJson(collectionName);
        }
        const registry = (context.engine.workflow as unknown as { registry: schema.SchemaRegistry })?.registry;
        const options = await parseJsonSchemaToOptions(registry, schemaJson || {}) as NgCliOption[];
        /**
         * Fix: @angular/cli is not handling required properly
         * Feat: add support for hint property
         */
        options.forEach(option => {
            const hint = ((schemaJson?.properties as JsonObject)[option.name] as JsonObject)?.hint as string;
            if (hint) {
                option.hint = hint;
            }
            if ((schemaJson?.required as string[])?.includes(option.name)) {
                option.required = true;
            }
        });
        // --
        return options;
    } catch (err) {
        console.error(err);
        return [];
    }
};
