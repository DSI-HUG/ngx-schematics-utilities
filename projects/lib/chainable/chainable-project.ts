import { JsonValue } from '@angular-devkit/core';
import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { join } from 'path';

import {
    addAngularJsonAsset, addDeclarationToNgModule, addExportToNgModule, addImportToNgModule, addProviderToNgModule,
    addRouteDeclarationToNgModule, ensureIsAngularLibrary, ensureIsAngularProject, getProjectFromWorkspace,
    ProjectDefinition, removeDeclarationFromNgModule, removeExportFromNgModule, removeImportFromNgModule,
    removeProviderFromNgModule
} from '../angular';
import { Chainable, ChainableContext, ChainableType } from './chainable';

export interface ChainableProjectContext extends ChainableContext {
    project: ProjectDefinition;
}

export class ChainableProject extends Chainable<ChainableProjectContext> {
    protected _project?: ProjectDefinition;

    constructor(
        protected chainableType: ChainableType,
        protected projectName?: string
    ) {
        super(chainableType);

        // Sanity checks
        switch (this.chainableType) {
            case ChainableType.APPLICATION:
                this.addRuleToChain(() => ensureIsAngularProject(this.projectName));
                break;
            case ChainableType.LIBRARY:
                this.addRuleToChain(() => ensureIsAngularLibrary(this.projectName));
                break;
            default:
                throw new SchematicsException(`Context type "${this.chainableType}" is not supported.`);
        }

        // Make sure the second thing we do in the chain (ie. after the super) is to get a reference to the project
        this.addRuleToChain(() => async (tree: Tree): Promise<void> => {
            this._project = await getProjectFromWorkspace(tree, this.projectName);
        });
    }

    /**
     * {@link addDeclarationToNgModule See addDeclarationToNgModule}
     * @returns {this}
     */
    public addDeclarationToNgModule(filePath: string, classifiedName: string, importPath: string): this {
        return this.addRuleToChain(() => addDeclarationToNgModule(this.pathFromRoot(filePath), classifiedName, importPath));
    }

    /**
     * {@link removeDeclarationFromNgModule See removeDeclarationFromNgModule}
     * @returns {this}
     */
    public removeDeclarationFromNgModule(filePath: string, classifiedName: string): this {
        return this.addRuleToChain(() => removeDeclarationFromNgModule(this.pathFromRoot(filePath), classifiedName));
    }

    /**
     * {@link addImportToNgModule See addImportToNgModule}
     * @returns {this}
     */
    public addImportToNgModule(filePath: string, classifiedName: string, importPath: string): this {
        return this.addRuleToChain(() => addImportToNgModule(this.pathFromRoot(filePath), classifiedName, importPath));
    }

    /**
     * {@link removeImportFromNgModule See removeImportFromNgModule}
     * @returns {this}
     */
    public removeImportFromNgModule(filePath: string, classifiedName: string): this {
        return this.addRuleToChain(() => removeImportFromNgModule(this.pathFromRoot(filePath), classifiedName));
    }

    /**
     * {@link addExportToNgModule See addExportToNgModule}
     * @returns {this}
     */
    public addExportToNgModule(filePath: string, classifiedName: string, importPath: string): this {
        return this.addRuleToChain(() => addExportToNgModule(this.pathFromRoot(filePath), classifiedName, importPath));
    }

    /**
     * {@link removeExportFromNgModule See removeExportFromNgModule}
     * @returns {this}
     */
    public removeExportFromNgModule(filePath: string, classifiedName: string): this {
        return this.addRuleToChain(() => removeExportFromNgModule(this.pathFromRoot(filePath), classifiedName));
    }

    /**
     * {@link addProviderToNgModule See addProviderToNgModule}
     * @returns {this}
     */
    public addProviderToNgModule(filePath: string, classifiedName: string, importPath: string): this {
        return this.addRuleToChain(() => addProviderToNgModule(this.pathFromRoot(filePath), classifiedName, importPath));
    }

    /**
     * {@link removeProviderFromNgModule See removeProviderFromNgModule}
     * @returns {this}
     */
    public removeProviderFromNgModule(filePath: string, classifiedName: string): this {
        return this.addRuleToChain(() => removeProviderFromNgModule(this.pathFromRoot(filePath), classifiedName));
    }

    /**
     * {@link addRouteDeclarationToNgModule See addRouteDeclarationToNgModule}
     * @returns {this}
     */
    public addRouteDeclarationToNgModule(filePath: string, routeLiteral: string): this {
        return this.addRuleToChain(() => addRouteDeclarationToNgModule(this.pathFromRoot(filePath), routeLiteral));
    }

    /**
     * {@link addAngularJsonAsset See addAngularJsonAsset}
     * @returns {this}
     */
    public addAngularJsonAsset(value: JsonValue): this {
        return this.addRuleToChain(() => addAngularJsonAsset(value, this._project?.name));
    }

    /**
     * {@link removeAngularJsonAsset See removeAngularJsonAsset}
     * @returns {this}
     */
    public removeAngularJsonAsset(value: JsonValue): this {
        return this.addRuleToChain(() => addAngularJsonAsset(value, this._project?.name));
    }

    // --- OVERRIDE(s) ---

    protected override getContext(): ChainableProjectContext {
        return {
            ...super.getContext(),
            project: this._project as ProjectDefinition
        };
    }

    protected override pathFromRoot(path: string): string {
        if (path.startsWith('__SRC__')) {
            return path.replace('__SRC__', this._project?.sourceRoot ?? 'src');
        }
        return join(this._project?.root ?? '', path);
    }
}

export const application = (projectName?: string): ChainableProject => new ChainableProject(ChainableType.APPLICATION, projectName);

export const library = (projectName?: string): ChainableProject => new ChainableProject(ChainableType.LIBRARY, projectName);
