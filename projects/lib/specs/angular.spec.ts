import './custom-matchers';

import { tags } from '@angular-devkit/core';
import type { Rule } from '@angular-devkit/schematics';
import type { UnitTestTree } from '@angular-devkit/schematics/testing';
import { JSONFile } from '@schematics/angular/utility/json-file';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
    addAngularJsonAsset, addAngularJsonScript, addAngularJsonStyle, addDeclarationToNgModule, addExportToNgModule,
    addImportToNgModule, addProviderToBootstrapApplication, addProviderToNgModule, addRouteDeclarationToNgModule,
    ensureIsAngularApplication, ensureIsAngularLibrary, ensureIsAngularWorkspace, getAngularVersion, getProjectFromWorkspace,
    getProjectMainFilePath, getProjectOutputPath, isAngularVersion, isProjectStandalone, removeAngularJsonAsset,
    removeAngularJsonScript, removeAngularJsonStyle, removeDeclarationFromNgModule, removeExportFromNgModule,
    removeImportFromNgModule, removeProviderFromBootstrapApplication, removeProviderFromNgModule,
} from '../src';
import { appTest1, appTest2, callRule, getCleanAppTree, libTest } from './common.spec';

// --- HELPER(s) ---

const getValues = (tree: UnitTestTree, configName: 'build' | 'test', optionName: 'assets' | 'styles' | 'scripts'): string[] | undefined => {
    const angularJson = new JSONFile(tree, 'angular.json');
    const architectPath = ['projects', appTest1.name, 'architect'];
    const optionPath = [...architectPath, configName, 'options', optionName];
    return angularJson.get(optionPath) as string[] | undefined;
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
    schematicOptions: { filePath: string; classifiedName: string },
): Promise<void> => {
    // Before
    const fileContent = tree.readContent(schematicOptions.filePath);
    const items = getNgModule(ngModuleProperty, fileContent);
    // use `includes` in case of `forRoot/forChild` items
    expect(items.some(item => item.includes(schematicOptions.classifiedName))).toBe(true);

    // After
    await callRule(rule(schematicOptions.filePath, schematicOptions.classifiedName), tree);
    const newFileContent = tree.readContent(schematicOptions.filePath);
    const newItems = getNgModule(ngModuleProperty, newFileContent);
    // use `includes` in case of `forRoot/forChild` items
    expect(newItems.some(item => item.includes(schematicOptions.classifiedName))).toBe(false);

    // Twice (expect no error)
    const test$ = callRule(rule(schematicOptions.filePath, schematicOptions.classifiedName), tree);
    await test$;
};

const expectAddToNgModule = async (
    tree: UnitTestTree,
    ngModuleProperty: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rule: (...args: any[]) => Rule,
    schematicOptions: { filePath: string; classifiedName: string; importPath: string },
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
    await callRule(rule(schematicOptions.filePath, schematicOptions.classifiedName, schematicOptions.importPath), tree);
    const newFileContent = tree.readContent(schematicOptions.filePath);
    expect(newFileContent).toContain(impt);
    const newItems = getNgModule(ngModuleProperty, newFileContent);
    expect(newItems).toContain(schematicOptions.classifiedName);

    // Twice (expect no duplicates)
    await callRule(rule(schematicOptions.filePath, schematicOptions.classifiedName, schematicOptions.importPath), tree);
    const newFileContent2 = tree.readContent(schematicOptions.filePath);
    expect(newFileContent2).toContainTimes(impt, 1);
    const newItems2 = getNgModule(ngModuleProperty, newFileContent);
    expect(newItems2).toContainTimes(schematicOptions.classifiedName, 1);
};

// --- TEST(s) ---

[false, true].forEach(useStandalone => {
    [false, true].forEach(useWorkspace => {
        describe(`angular - (using${useStandalone ? ' standalone' : ''}${useWorkspace ? ' workspace' : ' flat'} project)`, () => {
            let tree: UnitTestTree;

            beforeEach(async () => {
                tree = await getCleanAppTree(useWorkspace, useStandalone);
            });

            it('should throw if no project could be found', async () => {
                const error = 'Project cannot be determined and no --project option was provided.';
                const options = { project: undefined as unknown as string };

                let test$: Promise<unknown> = callRule(ensureIsAngularApplication(options.project), tree);
                await expect(test$, 'rule: ensureIsAngularApplication').rejects.toThrow(error);

                test$ = callRule(ensureIsAngularLibrary(options.project), tree);
                await expect(test$, 'rule: ensureIsAngularLibrary').rejects.toThrow(error);

                test$ = callRule(addAngularJsonAsset('', options.project), tree);
                await expect(test$, 'rule: addAngularJsonAsset').rejects.toThrow(error);

                test$ = callRule(removeAngularJsonAsset('', options.project), tree);
                await expect(test$, 'rule: removeAngularJsonAsset').rejects.toThrow(error);

                test$ = callRule(addAngularJsonStyle('', options.project), tree);
                await expect(test$, 'rule: addAngularJsonStyle').rejects.toThrow(error);

                test$ = callRule(removeAngularJsonStyle('', options.project), tree);
                await expect(test$, 'rule: removeAngularJsonStyle').rejects.toThrow(error);

                test$ = callRule(addAngularJsonScript('', options.project), tree);
                await expect(test$, 'rule: addAngularJsonScript').rejects.toThrow(error);

                test$ = callRule(removeAngularJsonScript('', options.project), tree);
                await expect(test$, 'rule: removeAngularJsonScript').rejects.toThrow(error);

                test$ = getProjectFromWorkspace(tree, options.project);
                await expect(test$, 'helper: getProjectFromWorkspace').rejects.toThrow(error);

                expect(() => getProjectOutputPath(tree, options.project), 'helper: getProjectOutputPath').toThrow(error);
            });

            it('rule: ensureIsAngularWorkspace', async () => {
                const ok$ = callRule(ensureIsAngularWorkspace(), tree);
                await ok$;

                tree.delete('angular.json');
                const ko$ = callRule(ensureIsAngularWorkspace(), tree);
                await expect(ko$).rejects.toThrow('Unable to locate a workspace file, are you missing an `angular.json` or `.angular.json` file ?.');
            });

            it('rule: ensureIsAngularApplication', async () => {
                const ok$ = callRule(ensureIsAngularApplication(appTest1.name), tree);
                await ok$;

                const angularJson = new JSONFile(tree, 'angular.json');
                angularJson.modify(['projects', appTest1.name, 'projectType'], 'library');
                const ko$ = callRule(ensureIsAngularApplication(appTest1.name), tree);
                await expect(ko$).rejects.toThrow('Project is not an Angular application.');
            });

            it('rule: ensureIsAngularLibrary', async () => {
                const ko$ = callRule(ensureIsAngularLibrary(appTest1.name), tree);
                await expect(ko$).rejects.toThrow('Project is not an Angular library.');

                const angularJson = new JSONFile(tree, 'angular.json');
                angularJson.modify(['projects', appTest1.name, 'projectType'], 'library');
                const ok$ = callRule(ensureIsAngularLibrary(appTest1.name), tree);
                await ok$;
            });

            it('rule: isAngularVersion', async () => {
                const angularPkgJsonPath = require.resolve(join('@angular/core', 'package.json'), { paths: ['.'] });
                const ngVersion = (await import(angularPkgJsonPath) as { version: string }).version;
                const spyObject = {
                    callback: (): void => {
                        // console.log('it works');
                    },
                };
                const spy = vi.spyOn(spyObject, 'callback');

                // eslint-disable-next-line no-loops/no-loops
                for (const range of [ngVersion, `>= ${ngVersion}`]) {
                    await callRule(isAngularVersion(range, spyObject.callback), tree);
                    expect(spyObject.callback).toHaveBeenCalled();
                }

                spy.mockReset();

                // eslint-disable-next-line no-loops/no-loops
                for (const range of [`> ${ngVersion}`, `< ${ngVersion}`]) {
                    await callRule(isAngularVersion(range, spyObject.callback), tree);
                    expect(spyObject.callback).not.toHaveBeenCalled();
                }
            });

            it('rule: addAngularJsonAsset(string)', async () => {
                const project = await getProjectFromWorkspace(tree, appTest1.name);
                const asset = join(project.root, 'src/manifest.webmanifest');

                // Before
                expect(getValues(tree, 'build', 'assets')?.includes(asset)).toBeFalsy();
                expect(getValues(tree, 'test', 'assets')?.includes(asset)).toBeFalsy();

                // After
                await callRule(addAngularJsonAsset(asset, appTest1.name), tree);
                expect(getValues(tree, 'build', 'assets')?.includes(asset)).toBeTruthy();
                expect(getValues(tree, 'test', 'assets')?.includes(asset)).toBeTruthy();

                // Twice (expect no duplicates)
                await callRule(addAngularJsonAsset(asset, appTest1.name), tree);
                expect(getValues(tree, 'build', 'assets')).toContainTimes(asset, 1);
                expect(getValues(tree, 'test', 'assets')).toContainTimes(asset, 1);
            });

            it('rule: removeAngularJsonAsset(string)', async () => {
                const project = await getProjectFromWorkspace(tree, appTest1.name);
                let input = `${project.root}/public`;
                if (input.startsWith('/') || input.startsWith('\\')) {
                    input = input.substring(1, input.length);
                }
                const asset = { glob: '**/*', input };

                // Get test builder
                const angularJson = new JSONFile(tree, 'angular.json');
                const testBuilder = angularJson.get(['projects', appTest1.name, 'architect', 'test', 'builder']);

                // Before
                expect(getValues(tree, 'build', 'assets')).toContainEqual(expect.objectContaining(asset));
                if (testBuilder !== '@angular/build:unit-test') {
                    expect(getValues(tree, 'test', 'assets')).toContainEqual(expect.objectContaining(asset));
                }

                // After
                await callRule(removeAngularJsonAsset(asset, appTest1.name), tree);
                expect(getValues(tree, 'build', 'assets')).not.toContainEqual(expect.objectContaining(asset));
                if (testBuilder !== '@angular/build:unit-test') {
                    expect(getValues(tree, 'test', 'assets')).not.toContainEqual(expect.objectContaining(asset));
                }

                // Twice (expect no error)
                const test$ = callRule(removeAngularJsonAsset(asset, appTest1.name), tree);
                await test$;
            });

            it('rule: addAngularJsonAsset(JsonValue)', async () => {
                const asset = {
                    glob: '**/*',
                    input: 'node_modules/my-module',
                    output: 'my/output',
                };

                // Before
                expect(getValues(tree, 'build', 'assets') ?? []).not.toContainEqual(expect.objectContaining(asset));
                expect(getValues(tree, 'test', 'assets') ?? []).not.toContainEqual(expect.objectContaining(asset));

                // After
                await callRule(addAngularJsonAsset(asset, appTest1.name), tree);
                expect(getValues(tree, 'build', 'assets') ?? []).toContainEqual(expect.objectContaining(asset));
                expect(getValues(tree, 'test', 'assets') ?? []).toContainEqual(expect.objectContaining(asset));

                // Twice (expect no duplicates)
                await callRule(addAngularJsonAsset(asset, appTest1.name), tree);
                expect(getValues(tree, 'build', 'assets')).toContainTimes(asset, 1);
                expect(getValues(tree, 'test', 'assets')).toContainTimes(asset, 1);
            });

            it('rule: removeAngularJsonAsset(JsonValue)', async () => {
                const asset = {
                    glob: '**/*',
                    input: 'node_modules/my-module',
                    output: 'my/output',
                };

                // Before
                await callRule(addAngularJsonAsset(asset, appTest1.name), tree);
                expect(getValues(tree, 'build', 'assets')).toContainEqual(expect.objectContaining(asset));
                expect(getValues(tree, 'test', 'assets')).toContainEqual(expect.objectContaining(asset));

                // After
                await callRule(removeAngularJsonAsset(asset, appTest1.name), tree);
                expect(getValues(tree, 'build', 'assets')).not.toContainEqual(expect.objectContaining(asset));
                expect(getValues(tree, 'test', 'assets')).not.toContainEqual(expect.objectContaining(asset));

                // Twice (expect no error)
                const test$ = callRule(removeAngularJsonAsset(asset, appTest1.name), tree);
                await test$;
            });

            it('rule: addAngularJsonStyle(string)', async () => {
                const project = await getProjectFromWorkspace(tree, appTest1.name);
                const style = join(project.root, 'src/assets/my-styles.css');

                // Before
                expect(getValues(tree, 'build', 'styles')?.includes(style)).toBeFalsy();
                expect(getValues(tree, 'test', 'styles')?.includes(style)).toBeFalsy();

                // After
                await callRule(addAngularJsonStyle(style, appTest1.name), tree);
                expect(getValues(tree, 'build', 'styles')?.includes(style)).toBeTruthy();
                expect(getValues(tree, 'test', 'styles')?.includes(style)).toBeTruthy();

                // Twice (expect no duplicates)
                await callRule(addAngularJsonStyle(style, appTest1.name), tree);
                expect(getValues(tree, 'build', 'styles')).toContainTimes(style, 1);
                expect(getValues(tree, 'test', 'styles')).toContainTimes(style, 1);
            });

            it('rule: removeAngularJsonStyle(string)', async () => {
                const project = await getProjectFromWorkspace(tree, appTest1.name);
                let style = `${project.root}/src/styles.scss`;
                if (style.startsWith('/') || style.startsWith('\\')) {
                    style = style.substring(1, style.length);
                }

                // Get test builder
                const angularJson = new JSONFile(tree, 'angular.json');
                const testBuilder = angularJson.get(['projects', appTest1.name, 'architect', 'test', 'builder']);

                // Before
                expect(getValues(tree, 'build', 'styles')).toContain(style);
                if (testBuilder !== '@angular/build:unit-test') {
                    expect(getValues(tree, 'test', 'styles')).toContain(style);
                }

                // After
                await callRule(removeAngularJsonStyle(style, appTest1.name), tree);
                expect(getValues(tree, 'build', 'styles')).not.toContain(style);
                if (testBuilder !== '@angular/build:unit-test') {
                    expect(getValues(tree, 'test', 'styles')).not.toContain(style);
                }

                // Twice (expect no error)
                const test$ = callRule(removeAngularJsonStyle(style, appTest1.name), tree);
                await test$;
            });

            it('rule: addAngularJsonStyle(JsonValue)', async () => {
                const style = {
                    input: 'src/assets/my-style.css',
                    bundleName: 'my-bundle-name',
                    inject: false,
                };

                // Before
                expect(getValues(tree, 'build', 'styles') ?? []).not.toContainEqual(expect.objectContaining(style));
                expect(getValues(tree, 'test', 'styles') ?? []).not.toContainEqual(expect.objectContaining(style));

                // After
                await callRule(addAngularJsonStyle(style, appTest1.name), tree);
                expect(getValues(tree, 'build', 'styles') ?? []).toContainEqual(expect.objectContaining(style));
                expect(getValues(tree, 'test', 'styles') ?? []).toContainEqual(expect.objectContaining(style));

                // Twice (expect no duplicates)
                await callRule(addAngularJsonStyle(style, appTest1.name), tree);
                expect(getValues(tree, 'build', 'styles')).toContainTimes(style, 1);
                expect(getValues(tree, 'test', 'styles')).toContainTimes(style, 1);
            });

            it('rule: removeAngularJsonStyle(JsonValue)', async () => {
                const style = {
                    input: 'src/assets/my-style.css',
                    bundleName: 'my-bundle-name',
                    inject: false,
                };

                // Before
                await callRule(addAngularJsonStyle(style, appTest1.name), tree);
                expect(getValues(tree, 'build', 'styles')).toContainEqual(expect.objectContaining(style));
                expect(getValues(tree, 'test', 'styles')).toContainEqual(expect.objectContaining(style));

                // After
                await callRule(removeAngularJsonStyle(style, appTest1.name), tree);
                expect(getValues(tree, 'build', 'styles')).not.toContainEqual(expect.objectContaining(style));
                expect(getValues(tree, 'test', 'styles')).not.toContainEqual(expect.objectContaining(style));

                // Twice (expect no error)
                const test$ = callRule(removeAngularJsonStyle(style, appTest1.name), tree);
                await test$;
            });

            it('rule: addAngularJsonScript(string)', async () => {
                const project = await getProjectFromWorkspace(tree, appTest1.name);
                const script = join(project.root, 'src/my-script.js');

                // Before
                expect(getValues(tree, 'build', 'scripts')).toBeUndefined();
                expect(getValues(tree, 'test', 'scripts')).toBeUndefined();

                // After
                await callRule(addAngularJsonScript(script, appTest1.name), tree);
                expect(getValues(tree, 'build', 'scripts')).toContain(script);
                expect(getValues(tree, 'test', 'scripts')).toContain(script);

                // Twice (expect no duplicates)
                await callRule(addAngularJsonScript(script, appTest1.name), tree);
                expect(getValues(tree, 'build', 'scripts')).toContainTimes(script, 1);
                expect(getValues(tree, 'test', 'scripts')).toContainTimes(script, 1);
            });

            it('rule: removeAngularJsonScript(string)', async () => {
                const project = await getProjectFromWorkspace(tree, appTest1.name);
                let script = `${project.root}/src/my-script.js`;
                if (script.startsWith('/') || script.startsWith('\\')) {
                    script = script.substring(1, script.length);
                }

                // Get test builder
                const angularJson = new JSONFile(tree, 'angular.json');
                const testBuilder = angularJson.get(['projects', appTest1.name, 'architect', 'test', 'builder']);

                // Before
                await callRule(addAngularJsonScript(script, appTest1.name), tree);
                expect(getValues(tree, 'build', 'scripts')).toEqual([script]);
                if (testBuilder !== '@angular/build:unit-test') {
                    expect(getValues(tree, 'test', 'scripts')).toEqual([script]);
                }

                // After
                await callRule(removeAngularJsonScript(script, appTest1.name), tree);
                expect(getValues(tree, 'build', 'scripts')).not.toContain(script);
                if (testBuilder !== '@angular/build:unit-test') {
                    expect(getValues(tree, 'test', 'scripts')).not.toContain(script);
                }

                // Twice (expect no error)
                const test$ = callRule(removeAngularJsonScript(script, appTest1.name), tree);
                await test$;
            });

            it('rule: addAngularJsonScript(JsonValue)', async () => {
                const script = {
                    input: 'src/my-script.js',
                    bundleName: 'my-bundle-name',
                    inject: false,
                };

                // Before
                expect(getValues(tree, 'build', 'scripts') ?? []).not.toContainEqual(expect.objectContaining(script));
                expect(getValues(tree, 'test', 'scripts') ?? []).not.toContainEqual(expect.objectContaining(script));

                // After
                await callRule(addAngularJsonScript(script, appTest1.name), tree);
                expect(getValues(tree, 'build', 'scripts') ?? []).toContainEqual(expect.objectContaining(script));
                expect(getValues(tree, 'test', 'scripts') ?? []).toContainEqual(expect.objectContaining(script));

                // Twice (expect no duplicates)
                await callRule(addAngularJsonScript(script, appTest1.name), tree);
                expect(getValues(tree, 'build', 'scripts')).toContainTimes(script, 1);
                expect(getValues(tree, 'test', 'scripts')).toContainTimes(script, 1);
            });

            it('rule: removeAngularJsonScript(JsonValue)', async () => {
                const script = {
                    input: 'src/my-script.js',
                    bundleName: 'my-bundle-name',
                    inject: false,
                };

                // Before
                await callRule(addAngularJsonScript(script, appTest1.name), tree);
                expect(getValues(tree, 'build', 'scripts')).toContainEqual(expect.objectContaining(script));
                expect(getValues(tree, 'test', 'scripts')).toContainEqual(expect.objectContaining(script));

                // After
                await callRule(removeAngularJsonScript(script, appTest1.name), tree);
                expect(getValues(tree, 'build', 'scripts')).not.toContainEqual(expect.objectContaining(script));
                expect(getValues(tree, 'test', 'scripts')).not.toContainEqual(expect.objectContaining(script));

                // Twice (expect no error)
                const test$ = callRule(removeAngularJsonScript(script, appTest1.name), tree);
                await test$;
            });

            it('rule: add/remove declaration in NgModule', async () => {
                const project = await getProjectFromWorkspace(tree, appTest1.name);
                const filePath = join(project.root, 'src/app/app-module.ts');

                if (useStandalone) {
                    expect(tree.exists(filePath)).toBe(false);
                } else {
                    await expectAddToNgModule(tree, 'declarations', addDeclarationToNgModule, {
                        filePath,
                        classifiedName: 'TestComponent',
                        importPath: './components/test',
                    });
                    await expectRemoveFromNgModule(tree, 'declarations', removeDeclarationFromNgModule, {
                        filePath,
                        classifiedName: 'TestComponent',
                    });
                }
            });

            it('rule: add/remove simple import in NgModule', async () => {
                const project = await getProjectFromWorkspace(tree, appTest1.name);
                const filePath = join(project.root, 'src/app/app-module.ts');

                if (useStandalone) {
                    expect(tree.exists(filePath)).toBe(false);
                } else {
                    await expectAddToNgModule(tree, 'imports', addImportToNgModule, {
                        filePath,
                        classifiedName: 'HttpClientModule',
                        importPath: '@angular/common/http',
                    });
                    await expectRemoveFromNgModule(tree, 'imports', removeImportFromNgModule, {
                        filePath,
                        classifiedName: 'HttpClientModule',
                    });
                }
            });

            it('rule: add/remove forRoot import in NgModule', async () => {
                const project = await getProjectFromWorkspace(tree, appTest1.name);
                const filePath = join(project.root, 'src/app/app-module.ts');

                if (useStandalone) {
                    expect(tree.exists(filePath)).toBe(false);
                } else {
                    await expectAddToNgModule(tree, 'imports', addImportToNgModule, {
                        filePath,
                        classifiedName: tags.oneLine`
                            TestModule.forRoot({
                                enabled: environment.production
                            })
                        `,
                        importPath: 'src/common/test',
                    });
                    await expectRemoveFromNgModule(tree, 'imports', removeImportFromNgModule, {
                        filePath,
                        classifiedName: 'TestModule',
                    });
                }
            });

            it('rule: add/remove export in NgModule', async () => {
                const project = await getProjectFromWorkspace(tree, appTest1.name);
                const filePath = join(project.root, 'src/app/app-module.ts');

                if (useStandalone) {
                    expect(tree.exists(filePath)).toBe(false);
                } else {
                    await expectAddToNgModule(tree, 'exports', addExportToNgModule, {
                        filePath,
                        classifiedName: 'TestComponent',
                        importPath: './components/test',
                    });
                    await expectRemoveFromNgModule(tree, 'exports', removeExportFromNgModule, {
                        filePath,
                        classifiedName: 'TestComponent',
                    });
                }
            });

            it('rule: add/remove provider in NgModule', async () => {
                const project = await getProjectFromWorkspace(tree, appTest1.name);
                const filePath = join(project.root, 'src/app/app-module.ts');

                if (useStandalone) {
                    expect(tree.exists(filePath)).toBe(false);
                } else {
                    await expectAddToNgModule(tree, 'providers', addProviderToNgModule, {
                        filePath,
                        classifiedName: 'TestService',
                        importPath: './services/test',
                    });
                    await expectRemoveFromNgModule(tree, 'providers', removeProviderFromNgModule, {
                        filePath,
                        classifiedName: 'TestService',
                    });
                }
            });

            it('rule: addRouteDeclarationToNgModule', async () => {
                const project = await getProjectFromWorkspace(tree, appTest1.name);
                const filePath = join(project.root, 'src/app/app-routing-module.ts');

                if (useStandalone) {
                    expect(tree.exists(filePath)).toBe(false);
                } else {
                    const route1 = '{ path: \'route1\', component: \'src/home/home.component.ts\' }';
                    const route2 = '{ path: \'route2\', loadChildren: \'() => import(\'./pages/home/home.module\').then(m => m.HomeModule)\'; }';

                    // Before
                    const fileContent = tree.readContent(filePath);
                    expect(fileContent).not.toContain(route1);
                    expect(fileContent).not.toContain(route2);

                    // After
                    await callRule(addRouteDeclarationToNgModule(filePath, route1), tree);
                    await callRule(addRouteDeclarationToNgModule(filePath, route2), tree);
                    const newFileContent = tree.readContent(filePath);
                    expect(newFileContent).toContain(route1);
                    expect(newFileContent).toContain(route2);
                }
            });

            if (useStandalone) {
                it('rule: add provider in bootstrapApplication', async () => {
                    const project = await getProjectFromWorkspace(tree, appTest1.name);
                    const mainFilePath = project.pathFromSourceRoot('main.ts');
                    const configFilePath = project.pathFromSourceRoot('app/app.config.ts');
                    const impt = 'import { provideA } from \'provide/A';

                    // Before
                    expect(tree.readContent(mainFilePath)).not.toContain(impt);
                    expect(tree.readContent(configFilePath)).not.toContain(impt);

                    // After
                    await callRule(addProviderToBootstrapApplication(mainFilePath, 'provideA()', 'provide/A'), tree);
                    expect(tree.readContent(mainFilePath)).not.toContain(impt);
                    expect(tree.readContent(mainFilePath)).not.toContain('provideA()');
                    expect(tree.readContent(configFilePath)).toContain(impt);
                    expect(tree.readContent(configFilePath)).toContain('provideA()');

                    // Twice (expect no duplicates)
                    await callRule(addProviderToBootstrapApplication(mainFilePath, 'provideA()', 'provide/A'), tree);
                    expect(tree.readContent(mainFilePath)).not.toContainTimes(impt, 1);
                    expect(tree.readContent(mainFilePath)).not.toContainTimes('provideA()', 1);
                    expect(tree.readContent(configFilePath)).toContainTimes(impt, 1);
                    expect(tree.readContent(configFilePath)).toContainTimes('provideA()', 1);
                });

                it('rule: remove provider in bootstrapApplication', async () => {
                    const project = await getProjectFromWorkspace(tree, appTest1.name);
                    const mainFilePath = project.pathFromSourceRoot('main.ts');
                    const configFilePath = project.pathFromSourceRoot('app/app.config.ts');
                    const impt = 'import { provideA } from \'provide/A';

                    // Before
                    await callRule(addProviderToBootstrapApplication(mainFilePath, 'provideA()', 'provide/A'), tree);
                    expect(tree.readContent(configFilePath)).toContain(impt);
                    expect(tree.readContent(configFilePath)).toContain('provideA()');

                    // After
                    await callRule(removeProviderFromBootstrapApplication(mainFilePath, 'provideA'), tree);
                    expect(tree.readContent(mainFilePath)).not.toContain(impt);
                    expect(tree.readContent(mainFilePath)).not.toContain('provideA()');
                    expect(tree.readContent(configFilePath)).toContain(impt);
                    expect(tree.readContent(configFilePath)).not.toContain('provideA()');

                    // Twice (expect no duplicates)
                    await callRule(removeProviderFromBootstrapApplication(mainFilePath, 'provideA'), tree);
                    expect(tree.readContent(mainFilePath)).not.toContainTimes(impt, 1);
                    expect(tree.readContent(mainFilePath)).toContainTimes('provideA()', 0);
                    expect(tree.readContent(configFilePath)).toContainTimes(impt, 1);
                    expect(tree.readContent(configFilePath)).toContainTimes('provideA()', 0);
                });
            }

            it('helper: getAngularVersion', () => {
                const version = getAngularVersion();
                expect(version).toEqual(expect.objectContaining({
                    full: expect.any(String) as unknown as string,
                    patch: expect.any(String) as unknown as string,
                    minor: expect.any(String) as unknown as string,
                    major: expect.any(String) as unknown as string,
                }));
            });

            it('helper: getProjectOutputPath', () => {
                expect(getProjectOutputPath(tree, appTest1.name)).toEqual(`dist/${appTest1.name}`);
                expect(getProjectOutputPath(tree, appTest2.name)).toEqual(`dist/${appTest2.name}`);
                expect(getProjectOutputPath(tree, libTest.name)).toEqual(`dist/${libTest.name}`);
            });

            it('helper: getProjectMainFilePath', () => {
                if (useWorkspace) {
                    expect(getProjectMainFilePath(tree, appTest1.name)).toEqual(`projects/${appTest1.name}/src/main.ts`);
                    expect(getProjectMainFilePath(tree, appTest2.name)).toEqual(`projects/${appTest2.name}/src/main.ts`);
                } else {
                    expect(getProjectMainFilePath(tree, appTest1.name)).toEqual('src/main.ts');
                    expect(getProjectMainFilePath(tree, appTest2.name)).toBeUndefined();
                }
                expect(getProjectMainFilePath(tree, libTest.name)).toBeUndefined();
            });

            it('helper: getProjectFromWorkspace', async () => {
                await getProjectFromWorkspace(tree, appTest1.name);
                if (useWorkspace) {
                    await getProjectFromWorkspace(tree, appTest2.name);
                } else {
                    await expect(getProjectFromWorkspace(tree, appTest2.name))
                        .rejects.toThrow(`Project "${appTest2.name}" was not found in the current workspace.`);
                }
                await getProjectFromWorkspace(tree, libTest.name);
                await expect(getProjectFromWorkspace(tree, 'non-existing-name'))
                    .rejects.toThrow('Project "non-existing-name" was not found in the current workspace.');
            });

            it('helper: isProjectStandalone', () => {
                expect(isProjectStandalone(tree, appTest1.name)).toEqual(useStandalone);
                if (useWorkspace) {
                    expect(isProjectStandalone(tree, appTest2.name)).toEqual(useStandalone);
                }
                expect(isProjectStandalone(tree, libTest.name), 'Library should not be standalone').toBe(false);
            });
        });
    });
});
