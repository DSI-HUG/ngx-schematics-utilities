import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { join } from 'path';
import { lastValueFrom } from 'rxjs';

export const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    strict: true,
    version: '0.0.0'
};

export const libTest: ApplicationOptions = {
    name: 'lib-test',
    skipPackageJson: false,
    standalone: false
};

export const appTest1: ApplicationOptions = {
    name: 'app-test-1',
    inlineStyle: false,
    inlineTemplate: false,
    routing: true,
    strict: true,
    style: Style.Scss,
    skipTests: false,
    skipPackageJson: false,
    standalone: false
};

export const appTest2: ApplicationOptions = {
    name: 'app-test-2',
    inlineStyle: false,
    inlineTemplate: false,
    routing: true,
    strict: true,
    style: Style.Scss,
    skipTests: false,
    skipPackageJson: false,
    standalone: false
};

export const collectionPath = join(__dirname, './collection.json');

export const runner = new SchematicTestRunner('ngx-schematics-utilities', collectionPath);

export const callRule = (rule: Rule, tree: Tree, parentContext?: Partial<SchematicContext>): Promise<Tree | undefined> =>
    lastValueFrom(runner.callRule(rule, tree, parentContext));

export const getCleanAppTree = async (useWorkspace = false, useStandalone = false): Promise<UnitTestTree> => {
    appTest1.projectRoot = (useWorkspace) ? join(workspaceOptions.newProjectRoot!, appTest1.name) : '';
    appTest2.projectRoot = (useWorkspace) ? join(workspaceOptions.newProjectRoot!, appTest2.name) : '';

    appTest1.standalone = useStandalone;
    appTest2.standalone = useStandalone;
    libTest.standalone = useStandalone;

    const workspaceTree = await runner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
    await runner.runExternalSchematic('@schematics/angular', 'application', appTest1, workspaceTree);
    if (useWorkspace) {
        await runner.runExternalSchematic('@schematics/angular', 'application', appTest2, workspaceTree);
    }
    await runner.runExternalSchematic('@schematics/angular', 'library', libTest, workspaceTree);
    return workspaceTree;
};
