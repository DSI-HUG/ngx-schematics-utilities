import { MergeStrategy, SchematicContext } from '@angular-devkit/schematics';
import { getSchematicSchemaOptions } from '@hug/ngx-schematics-utilities';

import { runner } from './common';

const context = ({
    schematic: { collection: { description: { name: 'ngx-schematics-utilities' } } },
    engine: runner.engine,
    strategy: MergeStrategy.Default,
    debug: false
}) as unknown as SchematicContext;

describe('schematics', () => {
    it('helper: getSchematicSchemaOptions - existing local', async () => {
        const options = await getSchematicSchemaOptions(context, 'deployFilesSchematic');
        expect(options).toBeDefined();
        expect(options).toHaveSize(0);
    });

    it('helper: getSchematicSchemaOptions - existing local but not compatible', async () => {
        const test$ = getSchematicSchemaOptions(context, 'nonExistingSchematicName', 'colors');
        await expectAsync(test$).toBeRejectedWithError('Package "colors" was found but does not support schematics.');
    });

    it('helper: getSchematicSchemaOptions - non existing schematic local', async () => {
        const test$ = getSchematicSchemaOptions(context, 'nonExistingSchematicName');
        await expectAsync(test$).toBeRejectedWithError('Schematic "nonExistingSchematicName" not found in collection "ngx-schematics-utilities".');
    });

    it('helper: getSchematicSchemaOptions - non existing package local', async () => {
        const test$ = getSchematicSchemaOptions(context, 'deployFilesSchematic', '@hug/non-existing-package');
        await expectAsync(test$).toBeRejectedWithError('Collection "@hug/non-existing-package" cannot be resolved.');
    });

    it('helper: getSchematicSchemaOptions - existing external', async () => {
        const options = await getSchematicSchemaOptions(context, 'sentry', '@hug/ngx-sentry', true);
        expect(options).toHaveSize(2);
        expect(options[0].name).toEqual('projectName');
        expect(options[1].name).toEqual('sentryDsnUrl');
    });

    it('helper: getSchematicSchemaOptions - existing external but not compatible', async () => {
        const test$ = getSchematicSchemaOptions(context, 'nonExistingSchematicName', '@badisi/wdio-harness', true);
        await expectAsync(test$).toBeRejectedWithError('Package "@badisi/wdio-harness" was found but does not support schematics.');
    });

    it('helper: getSchematicSchemaOptions - non existing schematic external', async () => {
        const test$ = getSchematicSchemaOptions(context, 'nonExistingSchematicName', '@hug/ngx-sentry', true);
        await expectAsync(test$).toBeRejectedWithError('Schematic "nonExistingSchematicName" not found in collection "@hug/ngx-sentry".');
    });

    it('helper: getSchematicSchemaOptions - non existing package external', async () => {
        const test$ = getSchematicSchemaOptions(context, 'sentry', '@hug/non-existing-package', true);
        await expectAsync(test$).toBeRejectedWith('Request error (404): https://cdn.jsdelivr.net//npm/@hug/non-existing-package@latest/package.json');
    });
});
