import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { sep } from 'path';

import { getProjectFromWorkspace } from '../src';
import { addProviderToStandaloneApplication, removeProviderFromStandaloneApplication } from '../src/ast-utils';
import { appTest1, getCleanAppTree } from './common.spec';
import { customMatchers } from './jasmine.matchers';

interface UseCase {
    providerName: string;
    realProviderName?: string;
    state1: string;
    state2: string;
    useImportProvidersFrom?: boolean;
    indent?: number;
}

const ADD_USE_CASES: UseCase[] = [{
    providerName: 'provideA()',
    state1: '{}',
    state2: '{\n' +
    '  providers: [\n' +
    '    provideA()\n' +
    '  ]\n' +
    '}'
}, {
    providerName: 'provideA()',
    state1: '',
    state2: '{\n' +
    '  providers: [\n' +
    '    provideA()\n' +
    '  ]\n' +
    '}'
}, {
    providerName: 'provideB()',
    indent: 4,
    state1: '{\n' +
    '    providers: [\n' +
    '        provideA()\n' +
    '    ]\n' +
    '}',
    state2: '{\n' +
    '    providers: [\n' +
    '        provideB(),\n' +
    '        provideA()\n' +
    '    ]\n' +
    '}'
}, {
    providerName: 'provideB()',
    state1: '{\n' +
    '  providers: [\n' +
    '    provideA()\n' +
    '  ]\n' +
    '}',
    state2: '{\n' +
    '  providers: [\n' +
    '    provideB(),\n' +
    '    provideA()\n' +
    '  ]\n' +
    '}'
}, {
    providerName: 'provideB(ARG1, ARG2, { test: \'test\' })',
    realProviderName: 'provideB',
    state1: '{\n' +
    '  providers: [\n' +
    '    provideA()\n' +
    '  ]\n' +
    '}',
    state2: '{\n' +
    '  providers: [\n' +
    '    provideB(ARG1, ARG2, { test: \'test\' }),\n' +
    '    provideA()\n' +
    '  ]\n' +
    '}'
}, {
    providerName: 'provideRouter(appRoutes,\n' +
    '  withDebugTracing()\n' +
    ')',
    realProviderName: 'provideRouter',
    state1: '{\n' +
    '  providers: [\n' +
    '    provideA()\n' +
    '  ]\n' +
    '}',
    state2: '{\n' +
    '  providers: [\n' +
    '    provideRouter(appRoutes,\n' +
    '      withDebugTracing()\n' +
    '    ),\n' +
    '    provideA()\n' +
    '  ]\n' +
    '}'
}, {
    providerName: 'provideB',
    useImportProvidersFrom: true,
    state1: '{\n' +
    '  providers: [\n' +
    '    provideA()\n' +
    '  ]\n' +
    '}',
    state2: '{\n' +
    '  providers: [\n' +
    '    importProvidersFrom(provideB),\n' +
    '    provideA()\n' +
    '  ]\n' +
    '}'
}, {
    providerName: 'provideC',
    useImportProvidersFrom: true,
    state1: '{\n' +
    '  providers: [\n' +
    '    provideA(),\n' +
    '    importProvidersFrom(provideB)\n' +
    '  ]\n' +
    '}',
    state2: '{\n' +
    '  providers: [\n' +
    '    provideA(),\n' +
    '    importProvidersFrom(provideC, provideB)\n' +
    '  ]\n' +
    '}'
}];

const REMOVE_USE_CASES: UseCase[] = [{
    providerName: 'provideA()',
    state1: '{\n' +
    '  providers: [\n' +
    '  ]\n' +
    '}',
    state2: '{\n' +
    '  providers: [\n' +
    '    provideA()\n' +
    '  ]\n' +
    '}'
}, ...ADD_USE_CASES.slice(1)];

describe('ast-utils - using standalone project', () => {
    let tree: UnitTestTree;

    beforeEach(async () => {
        jasmine.addMatchers(customMatchers);
        tree = await getCleanAppTree(false, true);
    });

    it('addProviderToStandaloneApplication: not found', async () => {
        const notStandaloneTree = await getCleanAppTree(false, false);
        const project = await getProjectFromWorkspace(notStandaloneTree, appTest1.name);
        const filePath = project.pathFromSourceRoot('main.ts');

        // Before
        expect(notStandaloneTree.readContent(filePath)).not.toContain('bootstrapApplication');

        // After
        expect(() => addProviderToStandaloneApplication(notStandaloneTree, filePath, 'providerA'))
            .toThrowError(`Could not find bootstrapApplication call in src${sep}main.ts`);
    });

    ADD_USE_CASES.forEach((useCase, index) => {
        it(`addProviderToStandaloneApplication: use case ${index} - object`, async () => {
            const project = await getProjectFromWorkspace(tree, appTest1.name);
            const mainFilePath = project.pathFromSourceRoot('main.ts');

            tree.overwrite(mainFilePath, tree.readContent(mainFilePath).replace(
                ', appConfig',
                (useCase.state1 !== '') ? `, ${useCase.state1}` : ''
            ));

            // Before
            expect(tree.readContent(mainFilePath)).toContain(
                `bootstrapApplication(App${(useCase.state1 !== '') ? `, ${useCase.state1}` : ''})`
            );

            // After
            addProviderToStandaloneApplication(
                tree, mainFilePath, useCase.providerName, useCase.useImportProvidersFrom, useCase.indent
            );
            expect(tree.readContent(mainFilePath)).toContain(`bootstrapApplication(App, ${useCase.state2})`);
        });

        it(`addProviderToStandaloneApplication: use case ${index} (appConfig)`, async () => {
            const project = await getProjectFromWorkspace(tree, appTest1.name);
            const mainFilePath = project.pathFromSourceRoot('main.ts');
            const configFilePath = project.pathFromSourceRoot('app/app.config.ts');

            tree.overwrite(configFilePath, tree.readContent(configFilePath).replace(
                /ApplicationConfig = {.*};$/gms,
                `ApplicationConfig = ${(useCase.state1 !== '') ? useCase.state1 : '{}'};`
            ));

            // Before
            expect(tree.readContent(configFilePath)).toContain(
                `ApplicationConfig = ${(useCase.state1 !== '') ? useCase.state1 : '{}'};`
            );

            // After
            addProviderToStandaloneApplication(
                tree, mainFilePath, useCase.providerName, useCase.useImportProvidersFrom, useCase.indent
            );
            expect(tree.readContent(configFilePath)).toContain(`ApplicationConfig = ${useCase.state2};`);
        });
    });

    REMOVE_USE_CASES.forEach((useCase, index) => {
        it(`removeProviderFromStandaloneApplication: use case ${index}`, async () => {
            const project = await getProjectFromWorkspace(tree, appTest1.name);
            const mainFilePath = project.pathFromSourceRoot('main.ts');

            tree.overwrite(mainFilePath, tree.readContent(mainFilePath).replace(
                ', appConfig',
                (useCase.state2 !== '') ? `, ${useCase.state2}` : ''
            ));

            // Before
            expect(tree.readContent(mainFilePath)).toContain(
                `bootstrapApplication(App${(useCase.state2 !== '') ? `, ${useCase.state2}` : ''})`
            );

            // After
            removeProviderFromStandaloneApplication(tree, mainFilePath, useCase.realProviderName ?? useCase.providerName);
            expect(tree.readContent(mainFilePath)).toContain(
                `bootstrapApplication(App, ${(useCase.state1 !== '') ? useCase.state1 : '{\n  providers: [\n  ]\n})'}`
            );
        });

        it(`removeProviderFromStandaloneApplication: use case ${index} (appConfig)`, async () => {
            const project = await getProjectFromWorkspace(tree, appTest1.name);
            const mainFilePath = project.pathFromSourceRoot('main.ts');
            const configFilePath = project.pathFromSourceRoot('app/app.config.ts');

            tree.overwrite(configFilePath, tree.readContent(configFilePath).replace(
                /ApplicationConfig = {.*};$/gms,
                `ApplicationConfig = ${(useCase.state2 !== '') ? useCase.state2 : '{}'};`
            ));

            // Before
            expect(tree.readContent(configFilePath)).toContain(
                `ApplicationConfig = ${(useCase.state2 !== '') ? useCase.state2 : '{}'};`
            );

            // After
            removeProviderFromStandaloneApplication(tree, mainFilePath, useCase.realProviderName ?? useCase.providerName);
            expect(tree.readContent(configFilePath)).toContain(
                `ApplicationConfig = ${(useCase.state1 !== '') ? useCase.state1 : '{\n  providers: [\n  ]\n}'};`
            );
        });
    });
});
