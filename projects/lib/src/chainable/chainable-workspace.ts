import { JsonObject } from '@angular-devkit/core';
import { TaskId } from '@angular-devkit/schematics';

import {
    addAngularJsonAsset, addAngularJsonScript, addAngularJsonStyle, removeAngularJsonAsset, removeAngularJsonScript,
    removeAngularJsonStyle
} from '../angular';
import {
    addPackageJsonDependencies, addPackageJsonDevDependencies, addPackageJsonPeerDependencies, packageInstallTask,
    PackageItem, removePackageJsonDependencies, removePackageJsonDevDependencies, removePackageJsonPeerDependencies
} from '../package-json';
import { Chainable, ChainableType } from './chainable';

export class ChainableWorkspace extends Chainable {
    /**
     * @see {@link addPackageJsonDependencies}
     * @returns {this}
     */
    public addPackageJsonDependencies(deps: (string | PackageItem)[]): this {
        return this.addRuleToChain(() => addPackageJsonDependencies(deps));
    }

    /**
     * @see {@link addPackageJsonDevDependencies}
     * @returns {this}
     */
    public addPackageJsonDevDependencies(deps: (string | PackageItem)[]): this {
        return this.addRuleToChain(() => addPackageJsonDevDependencies(deps));
    }

    /**
     * @see {@link addPackageJsonPeerDependencies}
     * @returns {this}
     */
    public addPackageJsonPeerDependencies(deps: (string | PackageItem)[]): this {
        return this.addRuleToChain(() => addPackageJsonPeerDependencies(deps));
    }

    /**
     * @see {@link removePackageJsonDependencies}
     * @returns {this}
     */
    public removePackageJsonDependencies(deps: (string | PackageItem)[]): this {
        return this.addRuleToChain(() => removePackageJsonDependencies(deps));
    }

    /**
     * @see {@link removePackageJsonDevDependencies}
     * @returns {this}
     */
    public removePackageJsonDevDependencies(deps: (string | PackageItem)[]): this {
        return this.addRuleToChain(() => removePackageJsonDevDependencies(deps));
    }

    /**
     * @see {@link removePackageJsonPeerDependencies}
     * @returns {this}
     */
    public removePackageJsonPeerDependencies(deps: (string | PackageItem)[]): this {
        return this.addRuleToChain(() => removePackageJsonPeerDependencies(deps));
    }

    /**
     * @see {@link packageInstallTask}
     * @returns {this}
     */
    public packageInstallTask(callback?: (taskId?: TaskId) => void, force = false): this {
        return this.addRuleToChain(() => packageInstallTask(callback, force));
    }

    /**
     * @see {@link addAngularJsonAsset}
     * @returns {this}
     */
    public addAngularJsonAsset(value: JsonObject | string, projectName: string): this {
        return this.addRuleToChain(() => addAngularJsonAsset(value, projectName));
    }

    /**
     * @see {@link removeAngularJsonAsset}
     * @returns {this}
     */
    public removeAngularJsonAsset(value: JsonObject | string, projectName: string): this {
        return this.addRuleToChain(() => removeAngularJsonAsset(value, projectName));
    }

    /**
     * @see {@link addAngularJsonStyle}
     * @returns {this}
     */
    public addAngularJsonStyle(value: JsonObject | string, projectName: string): this {
        return this.addRuleToChain(() => addAngularJsonStyle(value, projectName));
    }

    /**
     * @see {@link removeAngularJsonStyle}
     * @returns {this}
     */
    public removeAngularJsonStyle(value: JsonObject | string, projectName: string): this {
        return this.addRuleToChain(() => removeAngularJsonStyle(value, projectName));
    }

    /**
     * @see {@link addAngularJsonScript}
     * @returns {this}
     */
    public addAngularJsonScript(value: JsonObject | string, projectName: string): this {
        return this.addRuleToChain(() => addAngularJsonScript(value, projectName));
    }

    /**
     * @see {@link removeAngularJsonScript}
     * @returns {this}
     */
    public removeAngularJsonScript(value: JsonObject | string, projectName: string): this {
        return this.addRuleToChain(() => removeAngularJsonScript(value, projectName));
    }
}

export const workspace = (): ChainableWorkspace => new ChainableWorkspace(ChainableType.WORKSPACE);
