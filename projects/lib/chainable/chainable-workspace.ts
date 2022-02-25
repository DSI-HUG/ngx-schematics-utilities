import { TaskId } from '@angular-devkit/schematics';

import { addAngularJsonAsset } from '../angular';
import {
    addPackageJsonDependencies, addPackageJsonDevDependencies, addPackageJsonPeerDependencies,
    KeyValueItem, packageInstallTask, removePackageJsonDependencies, removePackageJsonDevDependencies,
    removePackageJsonPeerDependencies
} from '../package-json';
import { Chainable, ChainableType } from './chainable';

export class ChainableWorkspace extends Chainable {
    /**
     * {@link addPackageJsonDependencies See addPackageJsonDependencies}
     * @returns {this}
     */
    public addPackageJsonDependencies(deps: (string | KeyValueItem)[]): this {
        return this.addRuleToChain(() => addPackageJsonDependencies(deps));
    }

    /**
     * {@link addPackageJsonDevDependencies See addPackageJsonDevDependencies}
     * @returns {this}
     */
    public addPackageJsonDevDependencies(deps: (string | KeyValueItem)[]): this {
        return this.addRuleToChain(() => addPackageJsonDevDependencies(deps));
    }

    /**
     * {@link addPackageJsonPeerDependencies See addPackageJsonPeerDependencies}
     * @returns {this}
     */
    public addPackageJsonPeerDependencies(deps: (string | KeyValueItem)[]): this {
        return this.addRuleToChain(() => addPackageJsonPeerDependencies(deps));
    }

    /**
     * {@link removePackageJsonDependencies See removePackageJsonDependencies}
     * @returns {this}
     */
    public removePackageJsonDependencies(deps: (string | KeyValueItem)[]): this {
        return this.addRuleToChain(() => removePackageJsonDependencies(deps));
    }

    /**
     * {@link removePackageJsonDevDependencies See removePackageJsonDevDependencies}
     * @returns {this}
     */
    public removePackageJsonDevDependencies(deps: (string | KeyValueItem)[]): this {
        return this.addRuleToChain(() => removePackageJsonDevDependencies(deps));
    }

    /**
     * {@link removePackageJsonPeerDependencies See removePackageJsonPeerDependencies}
     * @returns {this}
     */
    public removePackageJsonPeerDependencies(deps: (string | KeyValueItem)[]): this {
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
    public addAngularJsonAsset(value: string, projectName?: string): this {
        return this.addRuleToChain(() => addAngularJsonAsset(value, projectName));
    }

    /**
     * {@link removeAngularJsonAsset See removeAngularJsonAsset}
     * @returns {this}
     */
    public removeAngularJsonAsset(value: string, projectName?: string): this {
        return this.addRuleToChain(() => addAngularJsonAsset(value, projectName));
    }
}

export const workspace = (): ChainableWorkspace => new ChainableWorkspace(ChainableType.WORKSPACE);
