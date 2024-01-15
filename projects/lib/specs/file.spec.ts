import { Rule } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { JSONFile } from '@schematics/angular/utility/json-file';
import { join } from 'path';

import {
    addImportToFile, createOrUpdateFile, deleteFiles, deployFiles, downloadFile, getProjectFromWorkspace, modifyImportInFile,
    modifyJsonFile, removeFromJsonFile, removeImportFromFile, renameFile, replaceInFile, schematic
} from '../src';
import { appTest1, callRule, getCleanAppTree, runner } from './common.spec';
import { customMatchers } from './jasmine.matchers';

export const deployFilesSchematic = (options: { templateOptions: Record<string, unknown>; source: string; destination: string }): Rule =>
    schematic('deployFilesSchematic', [
        deployFiles(options.templateOptions, options.source, options.destination)
    ]);

[false, true].forEach(useStandalone => {
    [false, true].forEach(useWorkspace => {
        describe(`file - (using${useStandalone ? ' standalone' : ''}${useWorkspace ? ' workspace' : ' flat'} project)`, () => {
            let tree: UnitTestTree;
            let nbFiles: number;

            beforeEach(async () => {
                jasmine.addMatchers(customMatchers);
                tree = await getCleanAppTree(useWorkspace, useStandalone);
                nbFiles = tree.files.length;
            });

            it('rule: deployFiles - missing template options', async () => {
                const options = { source: './files' };
                /** use `runner.runSchematic` as `callRule` isn't working in this case */
                const test$ = runner.runSchematic('deployFilesSchematic', options, tree);
                await expectAsync(test$).toBeRejectedWithError('myParam is not defined');
            });

            it('rule: deployFiles - with template options', async () => {
                const options = { templateOptions: { myParam: 'MyParam' }, source: './files' };
                /** use `runner.runSchematic` as `callRule` isn't working in this case */
                await runner.runSchematic('deployFilesSchematic', options, tree);
                expect(tree.exists('./test-file')).toBeTruthy();
                expect(tree.readContent('./test-file').replace('\r\n', '\n')).toEqual('MyParam\n');
                expect(tree.files.length).toEqual(nbFiles + 1);
            });

            it('rule: deployFiles - with non existing source', async () => {
                const options = { source: './nonExistingFolder' };
                /** use `runner.runSchematic` as `callRule` isn't working in this case */
                const test$ = runner.runSchematic('deployFilesSchematic', options, tree);
                await expectAsync(test$).toBeResolved();
                expect(tree.exists('./test-file')).toBeFalsy();
                expect(tree.files.length).toEqual(nbFiles);
            });

            it('rule: deployFiles - to another destination', async () => {
                const options = { templateOptions: { myParam: 'MyParam' }, destination: './otherFolder', source: './files' };
                /** use `runner.runSchematic` as `callRule` isn't working in this case */
                await runner.runSchematic('deployFilesSchematic', options, tree);
                expect(tree.exists('./test-file')).toBeFalsy();
                expect(tree.exists('./otherFolder/test-file')).toBeTruthy();
                expect(tree.files.length).toEqual(nbFiles + 1);
            });

            it('rule: deployFiles - with existing destination', async () => {
                const filePath = './test-folder/test-file';

                await callRule(createOrUpdateFile(filePath, 'my data'), tree);
                expect(tree.exists(filePath)).toBeTruthy();
                expect(tree.readContent(filePath).replace('\r\n', '\n')).not.toEqual('MyParam\n');

                /** use `runner.runSchematic` as `callRule` isn't working in this case */
                const options = { templateOptions: { myParam: 'MyParam' }, destination: './test-folder', source: './files' };
                await runner.runSchematic('deployFilesSchematic', options, tree);
                expect(tree.readContent(filePath).replace('\r\n', '\n')).toEqual('MyParam\n');
                expect(tree.files.length).toEqual(nbFiles + 1);
            });

            it('rule: deleteFiles - with existing files', async () => {
                const files = ['./README.md', 'package.json'];

                // Before
                files.forEach(file => expect(tree.exists(file)).toBeTruthy());
                expect(tree.files.length).toEqual(nbFiles);

                // After
                const rule = deleteFiles(files);
                await callRule(rule, tree);
                files.forEach(file => expect(tree.exists(file)).toBeFalsy());
                expect(tree.files.length).toEqual(nbFiles - files.length);
            });

            it('rule: deleteFiles - with non existing file', async () => {
                const files = ['nonExistingFile'];

                // Before
                files.forEach(file => expect(tree.exists(file)).toBeFalsy());
                expect(tree.files.length).toEqual(nbFiles);

                // After
                const rule = deleteFiles(files);
                const test$ = callRule(rule, tree);
                await expectAsync(test$).toBeResolved();
                files.forEach(file => expect(tree.exists(file)).toBeFalsy());
                expect(tree.files.length).toEqual(nbFiles);
            });

            it('rule: renameFile - with existing files', async () => {
                const project = await getProjectFromWorkspace(tree, appTest1.name);
                const files = [
                    { from: './README.md', to: './README2' },
                    { from: 'package.json', to: 'package2.json' },
                    { from: project.pathFromSourceRoot('index.html'), to: '/test/index2.html' }
                ];
                // Before
                files.forEach(file => {
                    expect(tree.exists(file.from)).toBeTruthy();
                    expect(tree.exists(file.to)).toBeFalsy();
                });
                expect(tree.files.length).toEqual(nbFiles);

                // After
                // eslint-disable-next-line no-loops/no-loops
                for (const file of files) {
                    const rule = renameFile(file.from, file.to);
                    const test$ = callRule(rule, tree);
                    await expectAsync(test$).toBeResolved();
                    expect(tree.exists(file.from)).toBeFalsy();
                    expect(tree.exists(file.to)).toBeTruthy();
                }
                expect(tree.files.length).toEqual(nbFiles);
            });

            it('rule: renameFile - with non existing file', async () => {
                const file = { from: 'old.file', to: 'new.file' };

                // Before
                expect(tree.exists(file.from)).toBeFalsy();
                expect(tree.exists(file.to)).toBeFalsy();
                expect(tree.files.length).toEqual(nbFiles);

                // After
                const rule = renameFile(file.from, file.to);
                const test$ = callRule(rule, tree);
                await expectAsync(test$).toBeResolved();
                expect(tree.exists(file.from)).toBeFalsy();
                expect(tree.exists(file.to)).toBeFalsy();
                expect(tree.files.length).toEqual(nbFiles);
            });

            it('rule: renameFile - with existing destination', async () => {
                const file = { from: 'angular.json', to: 'package.json' };

                // Before
                expect(tree.exists(file.from)).toBeTruthy();
                expect(tree.exists(file.to)).toBeTruthy();

                // After
                const rule = renameFile(file.from, file.to);
                const test$ = callRule(rule, tree);
                await expectAsync(test$).toBeRejectedWithError('Path "/package.json" already exist.');
            });

            it('rule: createOrUpdateFile - create file', async () => {
                const options = { filePath: './test/my-new-file.ts', data: 'My new file content' };
                const rule = createOrUpdateFile(options.filePath, options.data);
                await callRule(rule, tree);
                expect(tree.exists(options.filePath)).toBeTruthy();
                expect(tree.readContent(options.filePath)).toEqual(options.data);
                expect(tree.files.length).toEqual(nbFiles + 1);
            });

            it('rule: createOrUpdateFile - update file', async () => {
                const options = { filePath: './README.md', data: 'My new content' };

                // Before
                expect(tree.exists(options.filePath)).toBeTruthy();
                expect(tree.readContent(options.filePath)).not.toEqual(options.data);

                // After
                const rule = createOrUpdateFile(options.filePath, options.data);
                await callRule(rule, tree);
                expect(tree.readContent(options.filePath)).toEqual(options.data);
                expect(tree.files.length).toEqual(nbFiles);
            });

            it('rule: downloadFile - existing source', async () => {
                const rule = downloadFile(
                    'https://raw.githubusercontent.com/DSI-HUG/ngx-sentry/master/.eslintrc.json',
                    './test.json'
                );
                await callRule(rule, tree);
                expect(tree.exists('./test.json')).toBeTruthy();

                const content = `{
            "root": true,
            "extends": [
                "@hug/eslint-config/moderate"
            ]
        }`.replace((/ {2}|\r\n|\n|\r/gm), '');
                expect(tree.readContent('./test.json').replace((/ {2}|\r\n|\n|\r/gm), '')).toEqual(content);
            });

            it('rule: downloadFile - non existing source', async () => {
                const rule = downloadFile('nonExistingFile', './test.json');
                const test$ = callRule(rule, tree);
                await expectAsync(test$).toBeRejected();
            });

            it('rule: replaceInFile', async () => {
                const options = { filePath: '.editorconfig', searchValue: 'indent_size = 2', replaceValue: 'indent_size = 4' };

                // Before
                expect(tree.exists(options.filePath)).toBeTruthy();
                expect(tree.readContent(options.filePath)).toContain(options.searchValue);

                // After
                const rule = replaceInFile(options.filePath, options.searchValue, options.replaceValue);
                await callRule(rule, tree);
                expect(tree.readContent(options.filePath)).toContain(options.replaceValue);
                expect(tree.files.length).toEqual(nbFiles);
            });

            it('rule: addImportToFile - es import', async () => {
                const project = await getProjectFromWorkspace(tree, appTest1.name);
                const options = { filePath: join(project.root, 'src/main.ts'), symbolName: 'Test', fileName: './src/test' };
                const impt = `import { ${options.symbolName} } from '${options.fileName}`;

                // Before
                expect(tree.readContent(options.filePath)).not.toContain(impt);

                // After
                const rule = addImportToFile(options.filePath, options.symbolName, options.fileName);
                await callRule(rule, tree);
                expect(tree.readContent(options.filePath)).toContain(impt);
                expect(tree.files.length).toEqual(nbFiles);
            });

            it('rule: addImportToFile - default import', async () => {
                const project = await getProjectFromWorkspace(tree, appTest1.name);
                const options = { filePath: join(project.root, 'src/main.ts'), symbolName: 'packageJson', fileName: 'package.json', isDefault: true };
                const impt = `import ${options.symbolName} from '${options.fileName}`;

                // Before
                expect(tree.readContent(options.filePath)).not.toContain(impt);

                // After
                const rule = addImportToFile(options.filePath, options.symbolName, options.fileName, options.isDefault);
                await callRule(rule, tree);
                expect(tree.readContent(options.filePath)).toContain(impt);
                expect(tree.files.length).toEqual(nbFiles);
            });

            it('rule: modifyImportInFile', async () => {
                const project = await getProjectFromWorkspace(tree, appTest1.name);
                const options = {
                    filePath: join(project.root, 'src/main.ts'),
                    symbolName: (useStandalone) ? 'AppComponent' : 'AppModule',
                    newSymbolName: 'NewName',
                    fileName: (useStandalone) ? './app/app.component' : './app/app.module'
                };
                const impt = `import { ${options.symbolName} } from '${options.fileName}';`;
                const newImpt = `import { ${options.newSymbolName} } from '${options.fileName}';`;

                // Before
                expect(tree.readContent(options.filePath)).toContain(impt);
                expect(tree.readContent(options.filePath)).not.toContain(newImpt);

                // After
                const rule = modifyImportInFile(options.filePath, options.symbolName, options.newSymbolName, options.fileName);
                await callRule(rule, tree);
                expect(tree.readContent(options.filePath)).not.toContain(impt);
                expect(tree.readContent(options.filePath)).toContain(newImpt);
                expect(tree.files.length).toEqual(nbFiles);
            });

            it('rule: removeImportFromFile', async () => {
                const project = await getProjectFromWorkspace(tree, appTest1.name);
                const options = {
                    filePath: join(project.root, 'src/main.ts'),
                    symbolName: (useStandalone) ? 'AppComponent' : 'AppModule',
                    fileName: (useStandalone) ? './app/app.component' : './app/app.module'
                };
                const impt = `import { ${options.symbolName} } from '${options.fileName}';`;

                // Before
                expect(tree.readContent(options.filePath)).toContain(impt);

                // After
                const rule = removeImportFromFile(options.filePath, options.symbolName, options.fileName);
                await callRule(rule, tree);
                expect(tree.readContent(options.filePath)).not.toContain(impt);
                expect(tree.files.length).toEqual(nbFiles);
            });

            it('rule: modifyJsonFile - add', async () => {
                const options = { filePath: 'tsconfig.json', jsonPath: ['compilerOptions', 'emitDecoratorMetadata'], value: true };

                // Before
                let jsonFile = new JSONFile(tree, options.filePath);
                expect(jsonFile.get(options.jsonPath)).toBeUndefined();

                // After
                const rule = modifyJsonFile(options.filePath, options.jsonPath, options.value);
                await callRule(rule, tree);
                jsonFile = new JSONFile(tree, options.filePath);
                expect(jsonFile.get(options.jsonPath)).toEqual(options.value);
                expect(tree.files.length).toEqual(nbFiles);
            });

            it('rule: modifyJsonFile - update', async () => {
                const options = { filePath: 'tsconfig.json', jsonPath: ['compilerOptions', 'strict'], value: false };

                // Before
                let jsonFile = new JSONFile(tree, options.filePath);
                expect(jsonFile.get(options.jsonPath)).toBeTrue();

                // After
                const rule = modifyJsonFile(options.filePath, options.jsonPath, options.value);
                await callRule(rule, tree);
                jsonFile = new JSONFile(tree, options.filePath);
                expect(jsonFile.get(options.jsonPath)).toEqual(options.value);
                expect(tree.files.length).toEqual(nbFiles);
            });

            it('rule: modifyJsonFile - remove', async () => {
                const options = { filePath: 'tsconfig.json', jsonPath: ['compilerOptions', 'strict'], value: undefined };

                // Before
                let jsonFile = new JSONFile(tree, options.filePath);
                expect(jsonFile.get(options.jsonPath)).toBeTrue();

                // After
                const rule = modifyJsonFile(options.filePath, options.jsonPath, options.value);
                await callRule(rule, tree);
                jsonFile = new JSONFile(tree, options.filePath);
                expect(jsonFile.get(options.jsonPath)).toBeUndefined();
                expect(tree.files.length).toEqual(nbFiles);
            });

            it('rule: removeFromJsonFile', async () => {
                const options = { filePath: 'tsconfig.json', jsonPath: ['compilerOptions', 'strict'] };

                // Before
                let jsonFile = new JSONFile(tree, options.filePath);
                expect(jsonFile.get(options.jsonPath)).toBeTrue();

                // After
                const rule = removeFromJsonFile(options.filePath, options.jsonPath);
                await callRule(rule, tree);
                jsonFile = new JSONFile(tree, options.filePath);
                expect(jsonFile.get(options.jsonPath)).toBeUndefined();
                expect(tree.files.length).toEqual(nbFiles);
            });
        });
    });
});
