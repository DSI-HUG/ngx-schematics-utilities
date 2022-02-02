import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { join } from 'path';

export const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    strict: true,
    version: '0.0.0'
};

export const appName = 'app-test';

export const appOptions: ApplicationOptions = {
    name: appName,
    inlineStyle: false,
    inlineTemplate: false,
    routing: true,
    strict: true,
    style: Style.Scss,
    skipTests: false,
    skipPackageJson: false
};

export const collectionPath = join(__dirname, './collection.json');

export const runner = new SchematicTestRunner('ngx-schematics-utilities', collectionPath);

export const getCleanAppTree = async (useWorkspace = false): Promise<UnitTestTree> => {
    const workspaceTree = await runner
        .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
        .toPromise();
    return await runner
        .runExternalSchematicAsync('@schematics/angular', 'application', {
            ...appOptions,
            projectRoot: (useWorkspace) ? join(workspaceOptions.newProjectRoot as string, appName) : ''
        }, workspaceTree)
        .toPromise();
};
