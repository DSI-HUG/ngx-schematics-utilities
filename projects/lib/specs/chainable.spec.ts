import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { join } from 'path';

import {
    application, ApplicationDefinition, ChainableApplicationContext, ChainableLibraryContext, ChainableWorkspaceContext,
    createOrUpdateFile, deleteFiles, getProjectFromWorkspace, library, workspace
} from '../src';
import { appTest1, appTest2, callRule, getCleanAppTree, libTest } from './common.spec';
import { customMatchers } from './jasmine.matchers';

[false, true].forEach(useStandalone => {
    [false, true].forEach(useWorkspace => {
        describe(`chainable - (using${useStandalone ? ' standalone' : ''}${useWorkspace ? ' workspace' : ' flat'} project)`, () => {
            let tree: UnitTestTree;
            let projectDef: ApplicationDefinition;

            beforeEach(async () => {
                jasmine.addMatchers(customMatchers);
                tree = await getCleanAppTree(useWorkspace, useStandalone);
                projectDef = await getProjectFromWorkspace(tree, appTest1.name);
            });

            it('should throw if not an Angular workspace', async () => {
                tree.delete('angular.json');
                const test$ = callRule(workspace().toRule(), tree);
                await expectAsync(test$)
                    .toBeRejectedWithError('Unable to locate a workspace file, are you missing an `angular.json` or `.angular.json` file ?.');
            });

            it('should throw if not an Angular application', async () => {
                const test$ = callRule(application(libTest.name).toRule(), tree);
                await expectAsync(test$).toBeRejectedWithError('Project is not an Angular application.');
            });

            it('should throw if not an Angular library', async () => {
                const test$ = callRule(library(appTest1.name).toRule(), tree);
                await expectAsync(test$).toBeRejectedWithError('Project is not an Angular library.');
            });

            it('should throw if no project could be found', () => {
                const error = 'Project cannot be determined and no --project option was provided.';
                const options = { project: undefined as unknown as string };
                expect(() => application(options.project)).withContext('application').toThrowError(error);
                expect(() => library(options.project)).withContext('library').toThrowError(error);
            });

            it('should get application context info', async () => {
                const rule = application(appTest1.name)
                    .rule((context: ChainableApplicationContext) => {
                        expect(context.project).toBeDefined();
                        expect(context.project.name).toBe(appTest1.name);
                        expect(context.project.isStandalone).toBe(useStandalone);
                        expect(context.project.mainFilePath).toBeDefined();
                        if (useStandalone) {
                            expect(context.project.mainConfigFilePath).toBeDefined();
                        } else {
                            expect(context.project.mainConfigFilePath).toBeNull();
                        }
                        expect(context.project.outputPath).toBeDefined();
                        expect(context.project.assetsPath).not.toBeNull();
                        expect(context.project.pathFromRoot).toBeDefined();
                        expect(context.project.pathFromSourceRoot).toBeDefined();
                        expect(context.workspace).toBeDefined();
                        expect(context.tree).toBeDefined();
                        expect(context.schematicContext).toBeDefined();
                    }).toRule();
                await callRule(rule, tree);
            });

            it('should get library context info', async () => {
                const rule = library(libTest.name)
                    .rule((context: ChainableLibraryContext) => {
                        expect(context.project).toBeDefined();
                        expect(context.project.name).toBe(libTest.name);
                        expect(context.project.pathFromRoot).toBeDefined();
                        expect(context.project.pathFromSourceRoot).toBeDefined();
                        expect(context.workspace).toBeDefined();
                        expect(context.tree).toBeDefined();
                        expect(context.schematicContext).toBeDefined();
                    }).toRule();
                await callRule(rule, tree);
            });

            it('should get workspace context info', async () => {
                const rule = workspace()
                    .rule((context: ChainableWorkspaceContext) => {
                        expect(context.workspace).toBeDefined();
                        expect(context.tree).toBeDefined();
                        expect(context.schematicContext).toBeDefined();
                    }).toRule();
                await callRule(rule, tree);
            });

            it('should get default project context info', async () => {
                const rule = application(appTest1.name)
                    .rule(({ project }: ChainableApplicationContext) => {
                        expect(project?.name).toEqual(appTest1.name);
                        expect(join(project?.root)).toEqual(join(appTest1.projectRoot!));
                        expect(join(project.sourceRoot!)).toEqual(join(appTest1.projectRoot ? appTest1.projectRoot : '', 'src'));
                    }).toRule();
                await callRule(rule, tree);
            });

            if (useWorkspace) {
                it('should get specific project context info', async () => {
                    const rule = application(appTest2.name)
                        .rule(({ project }: ChainableApplicationContext) => {
                            expect(project?.name).toEqual(appTest2.name);
                            expect(join(project?.root)).toEqual(join(appTest2.projectRoot!));
                            expect(join(project.sourceRoot!)).toEqual(join(appTest2.projectRoot ? appTest2.projectRoot : '', 'src'));
                        }).toRule();
                    await callRule(rule, tree);
                });
            }

            it('should get specific library context info', async () => {
                const rule = library(libTest.name)
                    .rule(({ project }: ChainableLibraryContext) => {
                        expect(project?.name).toEqual(libTest.name);
                        expect(project?.root).toEqual(`projects/${libTest.name}`);
                        expect(project?.sourceRoot).toEqual(`projects/${libTest.name}/src`);

                    }).toRule();
                await callRule(rule, tree);
            });

            it('should return a single rule', () => {
                const rule = application(appTest1.name)
                    .deleteFiles([])
                    .modifyJsonFile('angular.json', [], '')
                    .toRule();
                expect(Array.isArray(rule)).toBeFalsy();
            });

            it('should return an array of rules', () => {
                const rule = application(appTest1.name)
                    .deleteFiles([])
                    .modifyJsonFile('angular.json', [], '')
                    .toRules();
                expect(Array.isArray(rule)).toBeTruthy();
                expect(rule.length).toBeGreaterThan(0);
            });

            it('should update tree in between chainables', async () => {
                const fileFromRoot = join(projectDef.root, 'src/main.ts');

                expect(tree.exists(fileFromRoot)).toBeTruthy();

                const rule = application(appTest1.name)
                    .rule(() => expect(tree.exists(fileFromRoot)).toBeTruthy())
                    .deleteFiles(['__MAIN__'])
                    .rule(() => expect(tree.exists(fileFromRoot)).toBeFalsy())
                    .toRule();
                await callRule(rule, tree);

                expect(tree.exists(fileFromRoot)).toBeFalsy();
            });

            it('should transpile __SRC__', async () => {
                const truePath = join(projectDef.root, 'src/test.ts');
                expect(tree.exists(truePath)).toBeFalsy();
                const rule = application(appTest1.name)
                    .createOrUpdateFile('__SRC__/test.ts', 'Test')
                    .toRule();
                await callRule(rule, tree);
                expect(tree.exists(truePath)).toBeTruthy();
            });

            it('should transpile __OUTPUT__', async () => {
                const truePath = `dist/${appTest1.name}/test.ts`;
                expect(tree.exists(truePath)).toBeFalsy();
                const rule = application(appTest1.name)
                    .createOrUpdateFile('__OUTPUT__/test.ts', 'Test')
                    .toRule();
                await callRule(rule, tree);
                expect(tree.exists(truePath)).toBeTruthy();
            });

            it('should transpile __ASSETS__', async () => {
                const truePath = join(projectDef.root, 'public/test.txt');
                expect(tree.exists(truePath)).toBeFalsy();
                const rule = application(appTest1.name)
                    .createOrUpdateFile('__ASSETS__/test.txt', 'Test')
                    .toRule();
                await callRule(rule, tree);
                expect(tree.exists(truePath)).toBeTruthy();
            });

            it('should transpile __MAIN__', async () => {
                const truePath = join(projectDef.root, 'src/main.ts');
                expect(tree.exists(truePath)).toBeTruthy();
                expect(tree.readContent(truePath)).not.toEqual('Test');
                const rule = application(appTest1.name)
                    .createOrUpdateFile('__MAIN__', 'Test')
                    .toRule();
                await callRule(rule, tree);
                expect(tree.readContent(truePath)).toEqual('Test');
            });

            if (useStandalone) {
                it('should transpile __CONFIG__', async () => {
                    const truePath = join(projectDef.root, 'src/app/app.config.ts');
                    expect(tree.exists(truePath)).toBeTruthy();
                    expect(tree.readContent(truePath)).not.toEqual('Test');
                    const rule = application(appTest1.name)
                        .createOrUpdateFile('__CONFIG__', 'Test')
                        .toRule();
                    await callRule(rule, tree);
                    expect(tree.readContent(truePath)).toEqual('Test');
                });
            }

            it('customRule:sync: allow return rule', async () => {
                const file = 'test.md';
                const fileFromRoot = join(projectDef.root, file);

                expect(tree.exists(fileFromRoot)).toBeFalsy();

                const rule = application(appTest1.name)
                    .rule(() => expect(tree.exists(fileFromRoot)).toBeFalsy())
                    .rule(({ project }) => createOrUpdateFile(project.pathFromRoot(file), 'hello world'))
                    .rule(() => expect(tree.exists(fileFromRoot)).toBeTruthy())
                    .toRule();
                await callRule(rule, tree);

                expect(tree.exists(fileFromRoot)).toBeTruthy();
            });

            it('customRule:async: allow return rule', async () => {
                const file = 'src/main.ts';
                const fileFromRoot = join(projectDef.root, file);

                expect(tree.exists(fileFromRoot)).toBeTruthy();

                const rule = workspace()
                    .rule(() => expect(tree.exists(fileFromRoot)).toBeTruthy())
                    .rule(async () => {
                        const projectRoot = (await getProjectFromWorkspace(tree, projectDef.name)).root;
                        return deleteFiles([join(projectRoot, file)]);
                    })
                    .rule(() => expect(tree.exists(fileFromRoot)).toBeFalsy())
                    .toRule();
                await callRule(rule, tree);

                expect(tree.exists(fileFromRoot)).toBeFalsy();
            });

            it('customRule:sync: allow return void', async () => {
                const rule = workspace()
                    .rule(() => {
                    //
                    })
                    .toRule();
                await callRule(rule, tree);
            });

            it('customRule:async: allow return void', async () => {
                const rule = workspace()
                    .rule(async () => {
                        await Promise.resolve();
                    })
                    .toRule();
                await callRule(rule, tree);
            });

            it('projectContext: pathFromProjectRoot', async () => {
                const file = 'main.ts';
                const sourceFile = `src/${file}`;
                const fileFromRoot = join(projectDef.root, sourceFile);

                const rule = application(appTest1.name)
                    .rule(context => expect(context.project.pathFromRoot(sourceFile)).toEqual(fileFromRoot))
                    .toRule();
                await callRule(rule, tree);
            });

            it('projectContext: pathFromProjectSourceRoot', async () => {
                const file = 'main.ts';
                const sourceFile = `src/${file}`;
                const fileFromRoot = join(projectDef.root, sourceFile);

                const rule = application(appTest1.name)
                    .rule(context => expect(context.project.pathFromSourceRoot(file)).toEqual(fileFromRoot))
                    .toRule();
                await callRule(rule, tree);
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
                    const rule = application(appTest1.name).isAngularVersion(range, spyObject.callback).toRule();
                    await callRule(rule, tree);
                    expect(spyObject.callback).toHaveBeenCalled();
                }

                spy.calls.reset();

                // eslint-disable-next-line no-loops/no-loops
                for (const range of [`> ${ngVersion}`, `< ${ngVersion}`]) {
                    const rule = application(appTest1.name).isAngularVersion(range, spyObject.callback).toRule();
                    await callRule(rule, tree);
                    expect(spyObject.callback).not.toHaveBeenCalled();
                }
            });
        });
    });
});
