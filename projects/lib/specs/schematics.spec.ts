import { MergeStrategy, type SchematicContext } from '@angular-devkit/schematics';
import { describe, expect, it } from 'vitest';

import { getSchematicSchemaOptions } from '../src';
import { runner } from './common.spec';

const context = ({
    schematic: { collection: { description: { name: 'ngx-schematics-utilities' } } },
    engine: runner.engine,
    strategy: MergeStrategy.Default,
    debug: false,
}) as unknown as SchematicContext;

describe('schematics', () => {
    it('helper: getSchematicSchemaOptions - existing local', async () => {
        const options = await getSchematicSchemaOptions(context, 'deployFilesSchematic');
        expect(options).toBeDefined();
        expect(options).toHaveLength(0);
    });

    it('helper: getSchematicSchemaOptions - existing local but not compatible', async () => {
        const test$ = getSchematicSchemaOptions(context, 'nonExistingSchematicName', 'colors');
        await expect(test$).rejects.toThrow('Collection "colors" cannot be resolved.');
    });

    it('helper: getSchematicSchemaOptions - non existing schematic local', async () => {
        const test$ = getSchematicSchemaOptions(context, 'nonExistingSchematicName');
        await expect(test$).rejects.toThrow('Schematic "nonExistingSchematicName" not found in collection "ngx-schematics-utilities".');
    });

    it('helper: getSchematicSchemaOptions - non existing package local', async () => {
        const test$ = getSchematicSchemaOptions(context, 'deployFilesSchematic', '@hug/non-existing-package');
        await expect(test$).rejects.toThrow('Collection "@hug/non-existing-package" cannot be resolved.');
    });

    it('helper: getSchematicSchemaOptions - existing external', async () => {
        const options = await getSchematicSchemaOptions(context, 'ng-add', '@hug/ngx-sentry', true);
        expect(options).toHaveLength(3);
        expect(options[0].name).toEqual('project');
        expect(options[1].name).toEqual('projectName');
        expect(options[2].name).toEqual('dsnUrl');
    });

    it('helper: getSchematicSchemaOptions - existing external but not compatible', async () => {
        const test$ = getSchematicSchemaOptions(context, 'nonExistingSchematicName', '@badisi/wdio-harness', true);
        await expect(test$).rejects.toThrow('Package "@badisi/wdio-harness" was found but does not support schematics.');
    });

    it('helper: getSchematicSchemaOptions - non existing schematic external', async () => {
        const test$ = getSchematicSchemaOptions(context, 'nonExistingSchematicName', '@hug/ngx-sentry', true);
        await expect(test$).rejects.toThrow('Schematic "nonExistingSchematicName" not found in collection "@hug/ngx-sentry".');
    });

    it('helper: getSchematicSchemaOptions - non existing package external', async () => {
        const test$ = getSchematicSchemaOptions(context, 'sentry', '@hug/non-existing-package', true, 0);
        await expect(test$).rejects.toThrow('Request error (404): https://cdn.jsdelivr.net/npm/@hug/non-existing-package@latest/package.json');
    });
});
