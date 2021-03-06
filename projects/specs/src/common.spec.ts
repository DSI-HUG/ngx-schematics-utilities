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

export const libTest: ApplicationOptions = {
    name: 'lib-test',
    skipPackageJson: false
};

export const appTest1: ApplicationOptions = {
    name: 'app-test-1',
    inlineStyle: false,
    inlineTemplate: false,
    routing: true,
    strict: true,
    style: Style.Scss,
    skipTests: false,
    skipPackageJson: false
};

export const appTest2: ApplicationOptions = {
    name: 'app-test-2',
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
    appTest1.projectRoot = (useWorkspace) ? join(workspaceOptions.newProjectRoot as string, appTest1.name) : '';
    appTest2.projectRoot = (useWorkspace) ? join(workspaceOptions.newProjectRoot as string, appTest2.name) : '';

    const workspaceTree = await runner
        .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
        .toPromise();
    await runner
        .runExternalSchematicAsync('@schematics/angular', 'application', appTest1, workspaceTree)
        .toPromise();
    if (useWorkspace) {
        await runner
            .runExternalSchematicAsync('@schematics/angular', 'application', appTest2, workspaceTree)
            .toPromise();
    }
    await runner
        .runExternalSchematicAsync('@schematics/angular', 'library', libTest, workspaceTree)
        .toPromise();
    return workspaceTree;
};
