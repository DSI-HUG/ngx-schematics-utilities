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
     * {@link addPackageJsonDependencies See addPackageJsonDependencies}
     * @returns {this}
     */
    public addPackageJsonDependencies(deps: (string | PackageItem)[]): this {
        return this.addRuleToChain(() => addPackageJsonDependencies(deps));
    }

    /**
     * {@link addPackageJsonDevDependencies See addPackageJsonDevDependencies}
     * @returns {this}
     */
    public addPackageJsonDevDependencies(deps: (string | PackageItem)[]): this {
        return this.addRuleToChain(() => addPackageJsonDevDependencies(deps));
    }

    /**
     * {@link addPackageJsonPeerDependencies See addPackageJsonPeerDependencies}
     * @returns {this}
     */
    public addPackageJsonPeerDependencies(deps: (string | PackageItem)[]): this {
        return this.addRuleToChain(() => addPackageJsonPeerDependencies(deps));
    }

    /**
     * {@link removePackageJsonDependencies See removePackageJsonDependencies}
     * @returns {this}
     */
    public removePackageJsonDependencies(deps: (string | PackageItem)[]): this {
        return this.addRuleToChain(() => removePackageJsonDependencies(deps));
    }

    /**
     * {@link removePackageJsonDevDependencies See removePackageJsonDevDependencies}
     * @returns {this}
     */
    public removePackageJsonDevDependencies(deps: (string | PackageItem)[]): this {
        return this.addRuleToChain(() => removePackageJsonDevDependencies(deps));
    }

    /**
     * {@link removePackageJsonPeerDependencies See removePackageJsonPeerDependencies}
     * @returns {this}
     */
    public removePackageJsonPeerDependencies(deps: (string | PackageItem)[]): this {
        return this.addRuleToChain(() => removePackageJsonPeerDependencies(deps));
    }

    /**
     * {@link packageInstallTask See packageInstallTask}
     * @returns {this}
     */
    public packageInstallTask(callback?: (taskId?: TaskId) => void, force = false): this {
        return this.addRuleToChain(() => packageInstallTask(callback, force));
    }

    /**
     * {@link addAngularJsonAsset See addAngularJsonAsset}
     * @returns {this}
     */
    public addAngularJsonAsset(value: JsonObject | string, projectName: string): this {
        return this.addRuleToChain(() => addAngularJsonAsset(value, projectName));
    }

    /**
     * {@link removeAngularJsonAsset See removeAngularJsonAsset}
     * @returns {this}
     */
    public removeAngularJsonAsset(value: JsonObject | string, projectName: string): this {
        return this.addRuleToChain(() => removeAngularJsonAsset(value, projectName));
    }

    /**
     * {@link addAngularJsonStyle See addAngularJsonStyle}
     * @returns {this}
     */
    public addAngularJsonStyle(value: JsonObject | string, projectName: string): this {
        return this.addRuleToChain(() => addAngularJsonStyle(value, projectName));
    }

    /**
     * {@link removeAngularJsonStyle See removeAngularJsonStyle}
     * @returns {this}
     */
    public removeAngularJsonStyle(value: JsonObject | string, projectName: string): this {
        return this.addRuleToChain(() => removeAngularJsonStyle(value, projectName));
    }

    /**
     * {@link addAngularJsonScript See addAngularJsonScript}
     * @returns {this}
     */
    public addAngularJsonScript(value: JsonObject | string, projectName: string): this {
        return this.addRuleToChain(() => addAngularJsonScript(value, projectName));
    }

    /**
     * {@link removeAngularJsonScript See removeAngularJsonScript}
     * @returns {this}
     */
    public removeAngularJsonScript(value: JsonObject | string, projectName: string): this {
        return this.addRuleToChain(() => removeAngularJsonScript(value, projectName));
    }
}

export const workspace = (): ChainableWorkspace => new ChainableWorkspace(ChainableType.WORKSPACE);
