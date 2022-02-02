import { tags } from '@angular-devkit/core';
import { Rule } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import {
    addAngularJsonAsset, addDeclarationToNgModule, addExportToNgModule, addImportToNgModule, addProviderToNgModule,
    addRouteDeclarationToNgModule, ensureIsAngularProject, getDefaultProjectName, getProjectOutputPath,
    isAngularVersion, removeAngularJsonAsset, removeDeclarationFromNgModule, removeExportFromNgModule,
    removeImportFromNgModule, removeProviderFromNgModule
} from '@hug/ngx-schematics-utilities';
import { JSONFile } from '@schematics/angular/utility/json-file';
import { join } from 'path';

import { appName, getCleanAppTree, runner } from './common';
import { customMatchers } from './jasmine.matchers';

// --- HELPER(s) ---

const getAssets = (tree: UnitTestTree, configName: string): string[] => {
    const angularJson = new JSONFile(tree, 'angular.json');
    const architectPath = ['projects', appName, 'architect'];
    const assetsPath = [...architectPath, configName, 'options', 'assets'];
    return angularJson.get(assetsPath) as string[];
};

const getNgModule = (property: string, fileContent: string): string[] => {
    const decl = new RegExp(`^.*${property}: \\[(.*?)\\].*$`, 's');
    const matches = fileContent.match(decl);
    if (matches && matches?.length > 1) {
        return matches[1].split(',').map(item => item.trim().replace(/(\r\n|\n|\r)/gm, ''));
    }
    return [];
};

const removeFromNgModule = async (
    tree: UnitTestTree,
    ngModuleProperty: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rule: (...args: any[]) => Rule,
    schematicOptions: { filePath: string; classifiedName: string }
): Promise<void> => {
    // Before
    const fileContent = tree.readContent(schematicOptions.filePath);
    const items = getNgModule(ngModuleProperty, fileContent);
    // use `includes` in case of `forRoot/forChild` items
    expect(items.some(item => item.includes(schematicOptions.classifiedName))).toBeTrue();

    // After
    await runner.callRule(rule(schematicOptions.filePath, schematicOptions.classifiedName), tree).toPromise();
    const newFileContent = tree.readContent(schematicOptions.filePath);
    const newItems = getNgModule(ngModuleProperty, newFileContent);
    // use `includes` in case of `forRoot/forChild` items
    expect(newItems.some(item => item.includes(schematicOptions.classifiedName))).toBeFalse();

    // Twice (expect no error)
    const test$ = runner.callRule(rule(schematicOptions.filePath, schematicOptions.classifiedName), tree).toPromise();
    await expectAsync(test$).toBeResolved();
};

const addToNgModule = async (
    tree: UnitTestTree,
    ngModuleProperty: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rule: (...args: any[]) => Rule,
    schematicOptions: { filePath: string; classifiedName: string; importPath: string }
): Promise<void> => {
    let impt = `import { ${schematicOptions.classifiedName} } from '${schematicOptions.importPath}';`;
    const matches = new RegExp(/(.*)\.(forRoot|forChild)\(/gm).exec(schematicOptions.classifiedName);
    if (matches?.length) {
        impt = `import { ${matches[1].trim()} } from '${schematicOptions.importPath}';`;
    }

    // Before
    const fileContent = tree.readContent(schematicOptions.filePath);
    expect(fileContent).not.toContain(impt);
    const items = getNgModule(ngModuleProperty, fileContent);
    expect(items).not.toContain(schematicOptions.classifiedName);

    // After
    await runner.callRule(rule(schematicOptions.filePath, schematicOptions.classifiedName, schematicOptions.importPath), tree).toPromise();
    const newFileContent = tree.readContent(schematicOptions.filePath);
    expect(newFileContent).toContain(impt);
    const newItems = getNgModule(ngModuleProperty, newFileContent);
    expect(newItems).toContain(schematicOptions.classifiedName);

    // Twice (expect no duplicates)
    await runner.callRule(rule(schematicOptions.filePath, schematicOptions.classifiedName, schematicOptions.importPath), tree).toPromise();
    const newFileContent2 = tree.readContent(schematicOptions.filePath);
    expect(newFileContent2).toContainTimes(impt, 1);
    const newItems2 = getNgModule(ngModuleProperty, newFileContent);
    expect(newItems2).toContainTimes(schematicOptions.classifiedName, 1);
};

// --- TEST(s) ---

[false, true].forEach(useWorkspace => {
    describe(`angular - (${useWorkspace ? 'using workspace project' : 'using flat project'})`, () => {
        let tree: UnitTestTree;

        beforeEach(async () => {
            jasmine.addMatchers(customMatchers);
            tree = await getCleanAppTree(useWorkspace);
        });

        it('rule: ensureIsAngularProject', async () => {
            const ok$ = runner.callRule(ensureIsAngularProject(), tree).toPromise();
            await expectAsync(ok$).toBeResolved();

            tree.delete('angular.json');
            const ko$ = runner.callRule(ensureIsAngularProject(), tree).toPromise();
            await expectAsync(ko$).toBeRejectedWithError('Project is not an Angular project.');
        });

        it('rule: isAngularVersion', async () => {
            const angularPkgJsonPath = require.resolve(join('@angular/core', 'package.json'), { paths: ['.'] });
            const ngVersion = (await import(angularPkgJsonPath) as { version: string }).version;
            const spyObject = {
                callback: (): void => {
                    console.log('it works');
                }
            };
            const spy = spyOn(spyObject, 'callback');

            // eslint-disable-next-line no-loops/no-loops
            for (const range of [ngVersion, `>= ${ngVersion}`]) {
                await runner.callRule(isAngularVersion(range, spyObject.callback), tree).toPromise();
                expect(spyObject.callback).toHaveBeenCalled();
            }

            spy.calls.reset();

            // eslint-disable-next-line no-loops/no-loops
            for (const range of [`> ${ngVersion}`, `< ${ngVersion}`]) {
                await runner.callRule(isAngularVersion(range, spyObject.callback), tree).toPromise();
                expect(spyObject.callback).not.toHaveBeenCalled();
            }
        });

        it('rule: addAngularJsonAsset', async () => {
            const asset = 'src/manifest.webmanifest';

            // Before
            expect(getAssets(tree, 'build')).not.toContain(asset);
            expect(getAssets(tree, 'test')).not.toContain(asset);

            // After
            await runner.callRule(addAngularJsonAsset(asset), tree).toPromise();
            expect(getAssets(tree, 'build')).toContain(asset);
            expect(getAssets(tree, 'test')).toContain(asset);

            // Twice (expect no duplicates)
            await runner.callRule(addAngularJsonAsset(asset), tree).toPromise();
            expect(getAssets(tree, 'build')).toContainTimes(asset, 1);
            expect(getAssets(tree, 'test')).toContainTimes(asset, 1);
        });

        it('rule: removeAngularJsonAsset', async () => {
            const asset = 'src/favicon.ico';

            // Before
            expect(getAssets(tree, 'build')).toContain(asset);
            expect(getAssets(tree, 'test')).toContain(asset);

            // After
            await runner.callRule(removeAngularJsonAsset(asset), tree).toPromise();
            expect(getAssets(tree, 'build')).not.toContain(asset);
            expect(getAssets(tree, 'test')).not.toContain(asset);

            // Twice (expect no error)
            const test$ = runner.callRule(removeAngularJsonAsset(asset), tree).toPromise();
            await expectAsync(test$).toBeResolved();
        });

        it('rule: add/remove declaration in NgModule', async () => {
            await addToNgModule(tree, 'declarations', addDeclarationToNgModule, {
                filePath: 'src/app/app.module.ts',
                classifiedName: 'TestComponent',
                importPath: './components/test'
            });
            await removeFromNgModule(tree, 'declarations', removeDeclarationFromNgModule, {
                filePath: 'src/app/app.module.ts',
                classifiedName: 'TestComponent'
            });
        });

        it('rule: add/remove simple import in NgModule', async () => {
            await addToNgModule(tree, 'imports', addImportToNgModule, {
                filePath: 'src/app/app.module.ts',
                classifiedName: 'HttpClientModule',
                importPath: '@angular/common/http'
            });
            await removeFromNgModule(tree, 'imports', removeImportFromNgModule, {
                filePath: 'src/app/app.module.ts',
                classifiedName: 'HttpClientModule'
            });
        });

        it('rule: add/remove forRoot import in NgModule', async () => {
            await addToNgModule(tree, 'imports', addImportToNgModule, {
                filePath: 'src/app/app.module.ts',
                classifiedName: tags.oneLine`
                TestModule.forRoot({
                    enabled: environment.production
                })
            `,
                importPath: 'src/common/test'
            });
            await removeFromNgModule(tree, 'imports', removeImportFromNgModule, {
                filePath: 'src/app/app.module.ts',
                classifiedName: 'TestModule'
            });
        });

        it('rule: add/remove export in NgModule', async () => {
            await addToNgModule(tree, 'exports', addExportToNgModule, {
                filePath: 'src/app/app.module.ts',
                classifiedName: 'TestComponent',
                importPath: './components/test'
            });
            await removeFromNgModule(tree, 'exports', removeExportFromNgModule, {
                filePath: 'src/app/app.module.ts',
                classifiedName: 'TestComponent'
            });
        });

        it('rule: add/remove provider in NgModule', async () => {
            await addToNgModule(tree, 'providers', addProviderToNgModule, {
                filePath: 'src/app/app.module.ts',
                classifiedName: 'TestService',
                importPath: './services/test'
            });
            await removeFromNgModule(tree, 'providers', removeProviderFromNgModule, {
                filePath: 'src/app/app.module.ts',
                classifiedName: 'TestService'
            });
        });

        it('rule: addRouteDeclarationToNgModule', async () => {
            const filePath = 'src/app/app-routing.module.ts';
            const route1 = '{ path: \'route1\', component: \'src/home/home.component.ts\' }';
            const route2 = '{ path: \'route2\', loadChildren: \'() => import(\'./pages/home/home.module\').then(m => m.HomeModule)\'; }';

            // Before
            const fileContent = tree.readContent(filePath);
            expect(fileContent).not.toContain(route1);
            expect(fileContent).not.toContain(route2);

            // After
            await runner.callRule(addRouteDeclarationToNgModule(filePath, route1), tree).toPromise();
            await runner.callRule(addRouteDeclarationToNgModule(filePath, route2), tree).toPromise();
            const newFileContent = tree.readContent(filePath);
            expect(newFileContent).toContain(route1);
            expect(newFileContent).toContain(route2);
        });

        it('helper: getDefaultProjectName', () => {
            expect(getDefaultProjectName(tree)).toEqual(appName);
        });

        it('helper: getProjectOutputPath', () => {
            expect(getProjectOutputPath(tree)).toEqual(`dist/${appName}`);
        });
    });
});
