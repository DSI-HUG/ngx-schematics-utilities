import { Rule } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import {
    addPackageJsonDependencies, addPackageJsonDevDependencies, addPackageJsonPeerDependencies,
    KeyValueItem, removePackageJsonDependencies, removePackageJsonDevDependencies,
    removePackageJsonPeerDependencies
} from '@hug/ngx-schematics-utilities';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { JSONFile } from '@schematics/angular/utility/json-file';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { join } from 'path';

const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '0.0.0'
};

const appName = 'app-test';

const appOptions: ApplicationOptions = {
    name: appName,
    projectRoot: '',
    inlineStyle: false,
    inlineTemplate: false,
    routing: true,
    style: Style.Scss,
    skipTests: false,
    skipPackageJson: false
};

const collectionPath = join(__dirname, './collection.json');

const runner = new SchematicTestRunner('ngx-schematics-utilities', collectionPath);

const getCleanAppTree = async (): Promise<UnitTestTree> => {
    const workspaceTree = await runner
        .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
        .toPromise();
    return await runner
        .runExternalSchematicAsync('@schematics/angular', 'application', appOptions, workspaceTree)
        .toPromise();
};

// ---- HELPER(s) ----

const expectDep = (tree: UnitTestTree, devType: string, dep: string | KeyValueItem, toExists: boolean): void => {
    const pkgJson = new JSONFile(tree, 'package.json');
    const depName = (typeof dep === 'string') ? dep : dep.key;
    const depValue = (typeof dep === 'string') ? 'latest' : dep.value;
    const depItem = pkgJson.get([devType, depName]);
    const count = (pkgJson.content.match(new RegExp(depName, 'g')) || []).length;

    if (!toExists) {
        expect(count).toEqual(0);
        expect(depItem).toBeUndefined();
    } else {
        expect(count).toEqual(1);
        expect(depItem).toEqual(depValue);
    }
};

const test = async (
    tree: UnitTestTree,
    deps: (string | KeyValueItem)[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addRule: (...args: any[]) => Rule,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    removeRule: (...args: any[]) => Rule,
    devType: string
): Promise<void> => {
    // Before
    deps.forEach(dep => expectDep(tree, devType, dep, false));

    // Add
    await runner.callRule(addRule(deps), tree).toPromise();
    deps.forEach(dep => expectDep(tree, devType, dep, true));

    // Remove
    await runner.callRule(removeRule(deps), tree).toPromise();
    deps.forEach(dep => expectDep(tree, devType, dep, false));
};

// ---- TEST(s) ----

describe('package-json', () => {
    let tree: UnitTestTree;

    beforeEach(async () => {
        tree = await getCleanAppTree();
    });

    it('rule: add/remove packageJson dependencies', async () => {
        // eslint-disable-next-line no-loops/no-loops
        for (const deps of [['@my/dep', { key: 'my-dep', value: '1.2.3' }]]) {
            await test(tree, deps, addPackageJsonDependencies, removePackageJsonDependencies, 'dependencies');
        }
    });

    it('rule: add/remove packageJson devDependencies', async () => {
        // eslint-disable-next-line no-loops/no-loops
        for (const deps of [['@my/dev-dep', { key: 'my-dev-dep', value: '1.2.3' }]]) {
            await test(tree, deps, addPackageJsonDevDependencies, removePackageJsonDevDependencies, 'devDependencies');
        }
    });

    it('rule: add/remove packageJson peerDependencies', async () => {
        // eslint-disable-next-line no-loops/no-loops
        for (const deps of [['@my/peer-dep', { key: 'my-peer-dep', value: '1.2.3' }]]) {
            await test(tree, deps, addPackageJsonPeerDependencies, removePackageJsonPeerDependencies, 'peerDependencies');
        }
    });
});
