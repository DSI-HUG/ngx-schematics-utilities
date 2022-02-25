import { tags } from '@angular-devkit/core';
import { Rule } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import {
    addAngularJsonAsset, addDeclarationToNgModule, addExportToNgModule, addImportToNgModule, addProviderToNgModule,
    addRouteDeclarationToNgModule, ensureIsAngularLibrary, ensureIsAngularProject, ensureIsAngularWorkspace,
    getDefaultProjectName, getProjectFromWorkspace, getProjectOutputPath, isAngularVersion, removeAngularJsonAsset,
    removeDeclarationFromNgModule, removeExportFromNgModule, removeImportFromNgModule, removeProviderFromNgModule
} from '@hug/ngx-schematics-utilities';
import { JSONFile } from '@schematics/angular/utility/json-file';
import { join } from 'path';

import { appTest1, appTest2, getCleanAppTree, libTest, runner } from './common';
import { customMatchers } from './jasmine.matchers';

// --- HELPER(s) ---

const getAssets = (tree: UnitTestTree, configName: string): string[] => {
    const angularJson = new JSONFile(tree, 'angular.json');
    const architectPath = ['projects', appTest1.name, 'architect'];
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

const expectRemoveFromNgModule = async (
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

const expectAddToNgModule = async (
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

        it('rule: ensureIsAngularWorkspace', async () => {
            const ok$ = runner.callRule(ensureIsAngularWorkspace(), tree).toPromise();
            await expectAsync(ok$).toBeResolved();

            tree.delete('angular.json');
            const ko$ = runner.callRule(ensureIsAngularWorkspace(), tree).toPromise();
            await expectAsync(ko$).toBeRejectedWithError('Unable to locate a workspace file, are you missing an `angular.json` or `.angular.json` file ?.');
        });

        it('rule: ensureIsAngularProject', async () => {
            const ok$ = runner.callRule(ensureIsAngularProject(), tree).toPromise();
            await expectAsync(ok$).toBeResolved();

            const angularJson = new JSONFile(tree, 'angular.json');
            angularJson.modify(['projects', appTest1.name, 'projectType'], 'library');
            const ko$ = runner.callRule(ensureIsAngularProject(), tree).toPromise();
            await expectAsync(ko$).toBeRejectedWithError('Project is not an Angular project.');
        });

        it('rule: ensureIsAngularLibrary', async () => {
            const ko$ = runner.callRule(ensureIsAngularLibrary(), tree).toPromise();
            await expectAsync(ko$).toBeRejectedWithError('Project is not an Angular library.');

            const angularJson = new JSONFile(tree, 'angular.json');
            angularJson.modify(['projects', appTest1.name, 'projectType'], 'library');
            const ok$ = runner.callRule(ensureIsAngularLibrary(), tree).toPromise();
            await expectAsync(ok$).toBeResolved();
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
            const project = await getProjectFromWorkspace(tree);
            const asset = join(project.root, 'src/manifest.webmanifest');

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
            const project = await getProjectFromWorkspace(tree);
            const asset = join(project.root, 'src/favicon.ico');

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
            const project = await getProjectFromWorkspace(tree);
            const filePath = join(project.root, 'src/app/app.module.ts');

            await expectAddToNgModule(tree, 'declarations', addDeclarationToNgModule, {
                filePath,
                classifiedName: 'TestComponent',
                importPath: './components/test'
            });
            await expectRemoveFromNgModule(tree, 'declarations', removeDeclarationFromNgModule, {
                filePath,
                classifiedName: 'TestComponent'
            });
        });

        it('rule: add/remove simple import in NgModule', async () => {
            const project = await getProjectFromWorkspace(tree);
            const filePath = join(project.root, 'src/app/app.module.ts');

            await expectAddToNgModule(tree, 'imports', addImportToNgModule, {
                filePath,
                classifiedName: 'HttpClientModule',
                importPath: '@angular/common/http'
            });
            await expectRemoveFromNgModule(tree, 'imports', removeImportFromNgModule, {
                filePath,
                classifiedName: 'HttpClientModule'
            });
        });

        it('rule: add/remove forRoot import in NgModule', async () => {
            const project = await getProjectFromWorkspace(tree);
            const filePath = join(project.root, 'src/app/app.module.ts');

            await expectAddToNgModule(tree, 'imports', addImportToNgModule, {
                filePath,
                classifiedName: tags.oneLine`
                TestModule.forRoot({
                    enabled: environment.production
                })
            `,
                importPath: 'src/common/test'
            });
            await expectRemoveFromNgModule(tree, 'imports', removeImportFromNgModule, {
                filePath,
                classifiedName: 'TestModule'
            });
        });

        it('rule: add/remove export in NgModule', async () => {
            const project = await getProjectFromWorkspace(tree);
            const filePath = join(project.root, 'src/app/app.module.ts');

            await expectAddToNgModule(tree, 'exports', addExportToNgModule, {
                filePath,
                classifiedName: 'TestComponent',
                importPath: './components/test'
            });
            await expectRemoveFromNgModule(tree, 'exports', removeExportFromNgModule, {
                filePath,
                classifiedName: 'TestComponent'
            });
        });

        it('rule: add/remove provider in NgModule', async () => {
            const project = await getProjectFromWorkspace(tree);
            const filePath = join(project.root, 'src/app/app.module.ts');

            await expectAddToNgModule(tree, 'providers', addProviderToNgModule, {
                filePath,
                classifiedName: 'TestService',
                importPath: './services/test'
            });
            await expectRemoveFromNgModule(tree, 'providers', removeProviderFromNgModule, {
                filePath,
                classifiedName: 'TestService'
            });
        });

        it('rule: addRouteDeclarationToNgModule', async () => {
            const project = await getProjectFromWorkspace(tree);
            const filePath = join(project.root, 'src/app/app-routing.module.ts');
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
            expect(getDefaultProjectName(tree)).toEqual(appTest1.name);
        });

        it('helper: getProjectOutputPath', () => {
            expect(getProjectOutputPath(tree)).toEqual(`dist/${appTest1.name}`);
            if (useWorkspace) {
                expect(getProjectOutputPath(tree, appTest2.name)).toEqual(`dist/${appTest2.name}`);
            } else {
                expect(getProjectOutputPath(tree, appTest2.name)).toBeUndefined();
            }
            expect(getProjectOutputPath(tree, libTest.name)).toBeUndefined();
        });

        it('helper: getProjectFromWorkspace', async () => {
            await expectAsync(getProjectFromWorkspace(tree)).toBeResolved();
            if (useWorkspace) {
                await expectAsync(getProjectFromWorkspace(tree, appTest2.name)).toBeResolved();
            } else {
                await expectAsync(getProjectFromWorkspace(tree, appTest2.name))
                    .toBeRejectedWithError(`Project "${appTest2.name}" was not found in the current workspace.`);
            }
            await expectAsync(getProjectFromWorkspace(tree, libTest.name)).toBeResolved();
            await expectAsync(getProjectFromWorkspace(tree, 'non-existing-name'))
                .toBeRejectedWithError('Project "non-existing-name" was not found in the current workspace.');
        });

    });
});
