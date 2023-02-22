import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { commitChanges, getProjectFromWorkspace, getTsSourceFile } from '@hug/ngx-schematics-utilities';
import { addProviderToStandaloneApplication, removeProviderFromStandaloneApplication } from '@hug/ngx-schematics-utilities/ast-utils';
import { sep } from 'path';

import { appTest1, getCleanAppTree } from './common.spec';
import { customMatchers } from './jasmine.matchers';

const MAIN_TS = `
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';

%%PLACE_HOLDER%%
`;

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
    state1: 'bootstrapApplication(AppComponent);',
    state2: 'bootstrapApplication(AppComponent, {\n' +
    '  providers: [\n' +
    '    provideA()\n' +
    '  ]\n' +
    '});'
}, {
    providerName: 'provideB()',
    indent: 4,
    state1: 'bootstrapApplication(AppComponent, {\n' +
    '    providers: [\n' +
    '        provideA()\n' +
    '    ]\n' +
    '});',
    state2: 'bootstrapApplication(AppComponent, {\n' +
    '    providers: [\n' +
    '        provideB(),\n' +
    '        provideA()\n' +
    '    ]\n' +
    '});'
}, {
    providerName: 'provideB()',
    state1: 'bootstrapApplication(AppComponent, {\n' +
    '  providers: [\n' +
    '    provideA()\n' +
    '  ]\n' +
    '});',
    state2: 'bootstrapApplication(AppComponent, {\n' +
    '  providers: [\n' +
    '    provideB(),\n' +
    '    provideA()\n' +
    '  ]\n' +
    '});'
}, {
    providerName: 'provideB(ARG1, ARG2, { test: \'test\' })',
    realProviderName: 'provideB',
    state1: 'bootstrapApplication(AppComponent, {\n' +
    '  providers: [\n' +
    '    provideA()\n' +
    '  ]\n' +
    '});',
    state2: 'bootstrapApplication(AppComponent, {\n' +
    '  providers: [\n' +
    '    provideB(ARG1, ARG2, { test: \'test\' }),\n' +
    '    provideA()\n' +
    '  ]\n' +
    '});'
}, {
    providerName: 'provideRouter(appRoutes,\n' +
    '  withDebugTracing()\n' +
    ')',
    realProviderName: 'provideRouter',
    state1: 'bootstrapApplication(AppComponent, {\n' +
    '  providers: [\n' +
    '    provideA()\n' +
    '  ]\n' +
    '});',
    state2: 'bootstrapApplication(AppComponent, {\n' +
    '  providers: [\n' +
    '    provideRouter(appRoutes,\n' +
    '      withDebugTracing()\n' +
    '    ),\n' +
    '    provideA()\n' +
    '  ]\n' +
    '});'
}, {
    providerName: 'provideB',
    useImportProvidersFrom: true,
    state1: 'bootstrapApplication(AppComponent, {\n' +
    '  providers: [\n' +
    '    provideA()\n' +
    '  ]\n' +
    '});',
    state2: 'bootstrapApplication(AppComponent, {\n' +
    '  providers: [\n' +
    '    importProvidersFrom(provideB),\n' +
    '    provideA()\n' +
    '  ]\n' +
    '});'
}, {
    providerName: 'provideC',
    useImportProvidersFrom: true,
    state1: 'bootstrapApplication(AppComponent, {\n' +
    '  providers: [\n' +
    '    provideA(),\n' +
    '    importProvidersFrom(provideB)\n' +
    '  ]\n' +
    '});',
    state2: 'bootstrapApplication(AppComponent, {\n' +
    '  providers: [\n' +
    '    provideA(),\n' +
    '    importProvidersFrom(provideC, provideB)\n' +
    '  ]\n' +
    '});'
}];

const REMOVE_USE_CASES: UseCase[] = [{
    providerName: 'provideA()',
    state1: 'bootstrapApplication(AppComponent, {\n' +
    '  providers: [\n' +
    '  ]\n' +
    '});',
    state2: 'bootstrapApplication(AppComponent, {\n' +
    '  providers: [\n' +
    '    provideA()\n' +
    '  ]\n' +
    '});'
}, ...ADD_USE_CASES.slice(1)];

describe('ast-utils', () => {
    let tree: UnitTestTree;

    beforeEach(async () => {
        jasmine.addMatchers(customMatchers);
        tree = await getCleanAppTree();
    });

    it('addProviderToStandaloneApplication: not found', async () => {
        const project = await getProjectFromWorkspace(tree, appTest1.name);
        const filePath = project.pathFromSourceRoot('main.ts');

        // Before
        expect(tree.readContent(filePath)).not.toContain('bootstrapApplication');

        // After
        const sourceFile = getTsSourceFile(tree, filePath);
        expect(() => addProviderToStandaloneApplication(sourceFile, filePath, 'providerA'))
            .toThrowError(`Could not find bootstrapApplication() in src${sep}main.ts.`);
    });

    ADD_USE_CASES.forEach((useCase, index) => {
        it(`addProviderToStandaloneApplication: use case ${index}`, async () => {
            const project = await getProjectFromWorkspace(tree, appTest1.name);
            const filePath = project.pathFromSourceRoot('main.ts');

            tree.overwrite(filePath, MAIN_TS.replace('%%PLACE_HOLDER%%', useCase.state1));

            // Before
            expect(tree.readContent(filePath)).toContain(useCase.state1);

            // After
            const sourceFile = getTsSourceFile(tree, filePath);
            const change = addProviderToStandaloneApplication(
                sourceFile, filePath, useCase.providerName, useCase.useImportProvidersFrom, useCase.indent
            );
            commitChanges(tree, filePath, [change]);
            expect(tree.readContent(filePath)).toContain(useCase.state2);
        });
    });

    REMOVE_USE_CASES.forEach((useCase, index) => {
        it(`removeProviderFromStandaloneApplication: use case ${index}`, async () => {
            const project = await getProjectFromWorkspace(tree, appTest1.name);
            const filePath = project.pathFromSourceRoot('main.ts');

            tree.overwrite(filePath, MAIN_TS.replace('%%PLACE_HOLDER%%', useCase.state2));

            // Before
            expect(tree.readContent(filePath)).toContain(useCase.state2);

            // After
            const sourceFile = getTsSourceFile(tree, filePath);
            const changes = removeProviderFromStandaloneApplication(sourceFile, filePath, useCase.realProviderName ?? useCase.providerName);
            commitChanges(tree, filePath, changes);
            expect(tree.readContent(filePath)).toContain(useCase.state1);
        });
    });
});
