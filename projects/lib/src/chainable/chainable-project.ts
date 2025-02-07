import { JsonObject } from '@angular-devkit/core';
import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { ProjectType } from '@schematics/angular/utility/workspace-models';
import { join } from 'path';

import {
    addAngularJsonAsset, addAngularJsonScript, addAngularJsonStyle, addDeclarationToNgModule, addExportToNgModule,
    addImportToNgModule, addProviderToBootstrapApplication, addProviderToNgModule, addRouteDeclarationToNgModule,
    ensureIsAngularApplication, ensureIsAngularLibrary, ensureProjectIsDefined, getProjectFromWorkspace,
    removeAngularJsonAsset, removeAngularJsonScript, removeAngularJsonStyle, removeDeclarationFromNgModule,
    removeExportFromNgModule, removeImportFromNgModule, removeProviderFromBootstrapApplication, removeProviderFromNgModule
} from '../angular';
import { Chainable, ChainableType } from './chainable';
import { ChainableWorkspaceContext } from './chainable-workspace';

class ChainableProject<P extends ApplicationDefinition | LibraryDefinition, C extends ChainableWorkspaceContext> extends Chainable<C> {
    protected _project?: P;

    constructor(
        protected override chainableType: ChainableType,
        protected projectName: string
    ) {
        super(chainableType);

        // Sanity checks
        ensureProjectIsDefined(projectName);
        switch (this.chainableType) {
            case ChainableType.APPLICATION:
                this.addRuleToChain(() => ensureIsAngularApplication(this.projectName));
                break;
            case ChainableType.LIBRARY:
                this.addRuleToChain(() => ensureIsAngularLibrary(this.projectName));
                break;
            default:
                throw new SchematicsException(`Context type "${this.chainableType}" is not supported.`);
        }

        // Make sure the second thing we do in the chain (ie. after the super) is to get a reference to the project
        this.addRuleToChain(() => async (tree: Tree): Promise<void> => {
            this._project = await getProjectFromWorkspace<P>(tree, this.projectName);
        });
    }

    /**
     * @see {@link addDeclarationToNgModule}
     */
    public addDeclarationToNgModule(filePath: string, classifiedName: string, importPath: string): this {
        return this.addRuleToChain(() => addDeclarationToNgModule(this.pathFromRoot(filePath), classifiedName, importPath));
    }

    /**
     * @see {@link removeDeclarationFromNgModule}
     * @returns {this}
     */
    public removeDeclarationFromNgModule(filePath: string, classifiedName: string): this {
        return this.addRuleToChain(() => removeDeclarationFromNgModule(this.pathFromRoot(filePath), classifiedName));
    }

    /**
     * @see {@link addImportToNgModule}
     * @returns {this}
     */
    public addImportToNgModule(filePath: string, classifiedName: string, importPath: string): this {
        return this.addRuleToChain(() => addImportToNgModule(this.pathFromRoot(filePath), classifiedName, importPath));
    }

    /**
     * @see {@link removeImportFromNgModule}
     * @returns {this}
     */
    public removeImportFromNgModule(filePath: string, classifiedName: string): this {
        return this.addRuleToChain(() => removeImportFromNgModule(this.pathFromRoot(filePath), classifiedName));
    }

    /**
     * @see {@link addExportToNgModule}
     * @returns {this}
     */
    public addExportToNgModule(filePath: string, classifiedName: string, importPath: string): this {
        return this.addRuleToChain(() => addExportToNgModule(this.pathFromRoot(filePath), classifiedName, importPath));
    }

    /**
     * @see {@link removeExportFromNgModule}
     * @returns {this}
     */
    public removeExportFromNgModule(filePath: string, classifiedName: string): this {
        return this.addRuleToChain(() => removeExportFromNgModule(this.pathFromRoot(filePath), classifiedName));
    }

    /**
     * @see {@link addProviderToNgModule}
     * @returns {this}
     */
    public addProviderToNgModule(filePath: string, classifiedName: string, importPath: string): this {
        return this.addRuleToChain(() => addProviderToNgModule(this.pathFromRoot(filePath), classifiedName, importPath));
    }

    /**
     * @see {@link removeProviderFromNgModule}
     * @returns {this}
     */
    public removeProviderFromNgModule(filePath: string, classifiedName: string): this {
        return this.addRuleToChain(() => removeProviderFromNgModule(this.pathFromRoot(filePath), classifiedName));
    }

    /**
     * @see {@link addRouteDeclarationToNgModule}
     * @returns {this}
     */
    public addRouteDeclarationToNgModule(filePath: string, routeLiteral: string): this {
        return this.addRuleToChain(() => addRouteDeclarationToNgModule(this.pathFromRoot(filePath), routeLiteral));
    }

    /**
     * @see {@link addProviderToBootstrapApplication}
     * @returns {this}
     */
    public addProviderToBootstrapApplication(filePath: string, providerName: string, importPath: string, useImportProvidersFrom = false, indent = 2): this {
        return this.addRuleToChain(() => addProviderToBootstrapApplication(this.pathFromRoot(filePath), providerName, importPath, useImportProvidersFrom, indent));
    }

    /**
     * @see {@link removeProviderFromBootstrapApplication}
     * @returns {this}
     */
    public removeProviderFromBootstrapApplication(filePath: string, providerName: string): this {
        return this.addRuleToChain(() => removeProviderFromBootstrapApplication(this.pathFromRoot(filePath), providerName));
    }

    /**
     * @see {@link addAngularJsonAsset}
     * @returns {this}
     */
    public addAngularJsonAsset(value: JsonObject | string): this {
        return this.addRuleToChain(() => addAngularJsonAsset(value, this.projectName));
    }

    /**
     * @see {@link removeAngularJsonAsset}
     * @returns {this}
     */
    public removeAngularJsonAsset(value: JsonObject | string): this {
        return this.addRuleToChain(() => removeAngularJsonAsset(value, this.projectName));
    }

    /**
     * @see {@link addAngularJsonStyle}
     * @returns {this}
     */
    public addAngularJsonStyle(value: JsonObject | string): this {
        return this.addRuleToChain(() => addAngularJsonStyle(value, this.projectName));
    }

    /**
     * @see {@link removeAngularJsonStyle}
     * @returns {this}
     */
    public removeAngularJsonStyle(value: JsonObject | string): this {
        return this.addRuleToChain(() => removeAngularJsonStyle(value, this.projectName));
    }

    /**
     * @see {@link addAngularJsonScript}
     * @returns {this}
     */
    public addAngularJsonScript(value: JsonObject | string): this {
        return this.addRuleToChain(() => addAngularJsonScript(value, this.projectName));
    }

    /**
     * @see {@link removeAngularJsonScript}
     * @returns {this}
     */
    public removeAngularJsonScript(value: JsonObject | string): this {
        return this.addRuleToChain(() => removeAngularJsonScript(value, this.projectName));
    }

    // --- OVERRIDE(s) ---

    protected override getContext(): C {
        return {
            ...super.getContext(),
            project: this._project!
        };
    }

    protected override pathFromRoot(path: string): string {
        if (path.startsWith('__SRC__')) {
            return path.replace('__SRC__', this._project?.sourceRoot ?? 'src');
        } else if (this._project?.extensions['projectType'] === ProjectType.Application) {
            const p = this._project as ApplicationDefinition;
            if (path.startsWith('__OUTPUT__')) {
                return path.replace('__OUTPUT__', p.outputPath ?? 'dist');
            } else if (path.startsWith('__ASSETS__')) {
                return path.replace('__ASSETS__', p.assetsPath ?? 'public');
            } else if (path === '__MAIN__') {
                return p.mainFilePath ?? path;
            } else if (path === '__CONFIG__') {
                return p.mainConfigFilePath ?? path;
            }
        }
        return join(this._project?.root ?? '', path);
    }
}

export interface LibraryDefinition extends ProjectDefinition {
    name: string;
    pathFromRoot: (path: string) => string;
    pathFromSourceRoot: (path: string) => string;
}

export interface ApplicationDefinition extends LibraryDefinition {
    isStandalone: boolean;
    mainFilePath: string;
    mainConfigFilePath: string | null;
    outputPath: string;
    assetsPath: string | null;
}

export interface ChainableApplicationContext extends ChainableWorkspaceContext {
    project: ApplicationDefinition;
}
export class ChainableApplication extends ChainableProject<ApplicationDefinition, ChainableApplicationContext> {}
export const application = (projectName: string): ChainableApplication => new ChainableApplication(ChainableType.APPLICATION, projectName);

export interface ChainableLibraryContext extends ChainableWorkspaceContext {
    project: LibraryDefinition;
}
export class ChainableLibrary extends ChainableProject<LibraryDefinition, ChainableLibraryContext> {}
export const library = (projectName: string): ChainableLibrary => new ChainableLibrary(ChainableType.LIBRARY, projectName);
