import { UnitTestTree } from '@angular-devkit/schematics/testing';
import {
    application, ChainableContext, ChainableProjectContext, createOrUpdateFile, deleteFiles, getProjectFromWorkspace,
    library, ProjectDefinition, workspace
} from '@hug/ngx-schematics-utilities';
import { join } from 'path';

import { appTest1, appTest2, getCleanAppTree, libTest, runner } from './common.spec';
import { customMatchers } from './jasmine.matchers';

[false, true].forEach(useWorkspace => {
    describe(`chainable - (${useWorkspace ? 'using workspace project' : 'using flat project'})`, () => {
        let tree: UnitTestTree;
        let projectDef: ProjectDefinition;

        beforeEach(async () => {
            jasmine.addMatchers(customMatchers);
            tree = await getCleanAppTree(useWorkspace);
            projectDef = await getProjectFromWorkspace(tree, appTest1.name);
        });

        it('should throw if not an Angular workspace', async () => {
            tree.delete('angular.json');
            const test$ = runner.callRule(workspace().toRule(), tree).toPromise();
            await expectAsync(test$)
                .toBeRejectedWithError('Unable to locate a workspace file, are you missing an `angular.json` or `.angular.json` file ?.');
        });

        it('should throw if not an Angular application', async () => {
            const test$ = runner.callRule(application(libTest.name).toRule(), tree).toPromise();
            await expectAsync(test$).toBeRejectedWithError('Project is not an Angular project.');
        });

        it('should throw if not an Angular library', async () => {
            const test$ = runner.callRule(library(appTest1.name).toRule(), tree).toPromise();
            await expectAsync(test$).toBeRejectedWithError('Project is not an Angular library.');
        });

        it('should throw if no project could be found', () => {
            const error = 'Project cannot be determined and no --project option was provided.';
            const options = { project: undefined as unknown as string };
            expect(() => application(options.project)).withContext('application').toThrowError(error);
            expect(() => library(options.project)).withContext('library').toThrowError(error);
        });

        it('should get project context info', async () => {
            const rule = application(appTest1.name)
                .rule((context: ChainableProjectContext) => {
                    expect(context.project).toBeDefined();
                    expect(context.project.name).toBeDefined();
                    expect(context.project.pathFromRoot).toBeDefined();
                    expect(context.project.pathFromSourceRoot).toBeDefined();
                    expect(context.workspace).toBeDefined();
                    expect(context.tree).toBeDefined();
                    expect(context.schematicContext).toBeDefined();
                }).toRule();
            await runner.callRule(rule, tree).toPromise();
        });

        it('should get workspace context info', async () => {
            const rule = workspace()
                .rule((context: ChainableContext) => {
                    expect(context.workspace).toBeDefined();
                    expect(context.tree).toBeDefined();
                    expect(context.schematicContext).toBeDefined();
                }).toRule();
            await runner.callRule(rule, tree).toPromise();
        });

        it('should get default project context info', async () => {
            const rule = application(appTest1.name)
                .rule(({ project }: ChainableProjectContext) => {
                    expect(project?.name).toEqual(appTest1.name);
                    expect(join(project?.root)).toEqual(join(appTest1.projectRoot as string));
                    expect(join(project?.sourceRoot as string)).toEqual(join(appTest1.projectRoot ? appTest1.projectRoot : '', 'src'));
                }).toRule();
            await runner.callRule(rule, tree).toPromise();
        });

        if (useWorkspace) {
            it('should get specific project context info', async () => {
                const rule = application(appTest2.name)
                    .rule(({ project }: ChainableProjectContext) => {
                        expect(project?.name).toEqual(appTest2.name);
                        expect(join(project?.root)).toEqual(join(appTest2.projectRoot as string));
                        expect(join(project?.sourceRoot as string)).toEqual(join(appTest2.projectRoot ? appTest2.projectRoot : '', 'src'));
                    }).toRule();
                await runner.callRule(rule, tree).toPromise();
            });
        }

        it('should get specific library context info', async () => {
            const rule = library(libTest.name)
                .rule(({ project }: ChainableProjectContext) => {
                    expect(project?.name).toEqual(libTest.name);
                    expect(project?.root).toEqual(`projects/${libTest.name}`);
                    expect(project?.sourceRoot).toEqual(`projects/${libTest.name}/src`);

                }).toRule();
            await runner.callRule(rule, tree).toPromise();
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
                .deleteFiles(['__SRC__/main.ts'])
                .rule(() => expect(tree.exists(fileFromRoot)).toBeFalsy())
                .toRule();
            await runner.callRule(rule, tree).toPromise();

            expect(tree.exists(fileFromRoot)).toBeFalsy();
        });

        it('should transpile __SRC__', async () => {
            const fileFromRoot = join(projectDef.root, 'src/main.ts');

            expect(tree.exists(fileFromRoot)).toBeTruthy();

            const rule = application(appTest1.name)
                .rule(() => expect(tree.exists(fileFromRoot)).toBeTruthy())
                .deleteFiles(['__SRC__/main.ts'])
                .rule(() => expect(tree.exists(fileFromRoot)).toBeFalsy())
                .toRule();
            await runner.callRule(rule, tree).toPromise();

            expect(tree.exists(fileFromRoot)).toBeFalsy();
        });

        it('customRule:sync: allow return rule', async () => {
            const file = 'test.md';
            const fileFromRoot = join(projectDef.root, file);

            expect(tree.exists(fileFromRoot)).toBeFalsy();

            const rule = application(appTest1.name)
                .rule(() => expect(tree.exists(fileFromRoot)).toBeFalsy())
                .rule(({ project }) => createOrUpdateFile(project.pathFromRoot(file), 'hello world'))
                .rule(() => expect(tree.exists(fileFromRoot)).toBeTruthy())
                .toRule();
            await runner.callRule(rule, tree).toPromise();

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
            await runner.callRule(rule, tree).toPromise();

            expect(tree.exists(fileFromRoot)).toBeFalsy();
        });

        it('customRule:sync: allow return void', async () => {
            const rule = workspace()
                .rule(() => {
                    //
                })
                .toRule();
            await runner.callRule(rule, tree).toPromise();
        });

        it('customRule:async: allow return void', async () => {
            const rule = workspace()
                .rule(async () => {
                    await Promise.resolve();
                })
                .toRule();
            await runner.callRule(rule, tree).toPromise();
        });

        it('projectContext: pathFromProjectRoot', async () => {
            const file = 'main.ts';
            const sourceFile = `src/${file}`;
            const fileFromRoot = join(projectDef.root, sourceFile);

            const rule = application(appTest1.name)
                .rule(context => expect(context.project.pathFromRoot(sourceFile)).toEqual(fileFromRoot))
                .toRule();
            await runner.callRule(rule, tree).toPromise();
        });

        it('projectContext: pathFromProjectSourceRoot', async () => {
            const file = 'main.ts';
            const sourceFile = `src/${file}`;
            const fileFromRoot = join(projectDef.root, sourceFile);

            const rule = application(appTest1.name)
                .rule(context => expect(context.project.pathFromSourceRoot(file)).toEqual(fileFromRoot))
                .toRule();
            await runner.callRule(rule, tree).toPromise();
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
                await runner.callRule(rule, tree).toPromise();
                expect(spyObject.callback).toHaveBeenCalled();
            }

            spy.calls.reset();

            // eslint-disable-next-line no-loops/no-loops
            for (const range of [`> ${ngVersion}`, `< ${ngVersion}`]) {
                const rule = application(appTest1.name).isAngularVersion(range, spyObject.callback).toRule();
                await runner.callRule(rule, tree).toPromise();
                expect(spyObject.callback).not.toHaveBeenCalled();
            }
        });
    });
});
