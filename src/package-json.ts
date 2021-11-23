import { Rule, SchematicContext, SchematicsException, TaskId, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import latestVersion from '@badisi/latest-version';
import { JSONFile } from '@schematics/angular/utility/json-file';

interface KeyValueItem {
    key: string;
    value?: string;
}

let packageJsonDepsModified = false;

const modifyPackageJson = (tree: Tree, path: string, items: KeyValueItem[], remove = false): void => {
    const pkgJson = new JSONFile(tree, 'package.json');
    if (!pkgJson) {
        throw new SchematicsException('Could not find a `package.json` file at the root of your project.');
    }
    items.forEach((item: KeyValueItem) => {
        if (remove && pkgJson.get([path, item.key])) {
            packageJsonDepsModified = true;
            pkgJson.remove([path, item.key]);
        } else if (pkgJson.get([path, item.key]) !== item.value) {
            packageJsonDepsModified = true;
            pkgJson.modify([path, item.key], item.value);
        }
    });
};

const modifyDeps = async (tree: Tree, type: 'dependencies' | 'devDependencies' | 'peerDependencies', deps: string[] | KeyValueItem[], remove = false): Promise<void> => {
    const jsonValues: KeyValueItem[] = [];
    // eslint-disable-next-line no-loops/no-loops
    for (const dep of deps) {
        if (typeof dep === 'string') {
            if (remove) {
                jsonValues.push({ key: dep });
            } else {
                const pkgVersions = await latestVersion(dep);
                jsonValues.push({ key: dep, value: (pkgVersions.latest) ? `^${pkgVersions.latest}` : 'latest' });
            }
        } else {
            jsonValues.push(dep);
        }
    }
    modifyPackageJson(tree, type, jsonValues, remove);
};

// --- REMOVE DEPS ---

export const removePackageJsonDependencies = (deps: string[] | KeyValueItem[]): Rule =>
    (tree: Tree): Promise<void> => modifyDeps(tree, 'dependencies', deps, true);

export const removePackageJsonDevDependencies = (deps: string[] | KeyValueItem[]): Rule =>
    (tree: Tree): Promise<void> => modifyDeps(tree, 'devDependencies', deps, true);

export const removePackageJsonPeerDependencies = (deps: string[] | KeyValueItem[]): Rule =>
    (tree: Tree): Promise<void> => modifyDeps(tree, 'peerDependencies', deps, true);

// --- ADD DEPS ---

export const addPackageJsonDependencies = (deps: string[] | KeyValueItem[]): Rule =>
    (tree: Tree): Promise<void> => modifyDeps(tree, 'dependencies', deps);

export const addPackageJsonDevDependencies = (deps: string[] | KeyValueItem[]): Rule =>
    (tree: Tree): Promise<void> => modifyDeps(tree, 'devDependencies', deps);

export const addPackageJsonPeerDependencies = (deps: string[] | KeyValueItem[]): Rule =>
    (tree: Tree): Promise<void> => modifyDeps(tree, 'peerDependencies', deps);

// --- INSTALL DEPS ---

export const packageInstallTask = (callback?: (taskId: TaskId | undefined) => void, force = false): Rule =>
    (_tree: Tree, context: SchematicContext): void => {
        let taskId;
        if (packageJsonDepsModified || force) {
            packageJsonDepsModified = false;
            taskId = context.addTask(new NodePackageInstallTask());
        }
        if (callback) {
            callback(taskId);
        }
    };
