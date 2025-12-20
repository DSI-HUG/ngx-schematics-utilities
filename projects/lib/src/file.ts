import { type JsonValue, normalize, strings } from '@angular-devkit/core';
import {
    apply, applyTemplates, MergeStrategy, mergeWith, move, type Rule, SchematicsException, type Tree, url,
} from '@angular-devkit/schematics';
import {
    createSourceFile, isStringLiteral, ScriptTarget, type SourceFile, SyntaxKind,
} from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes, insertImport } from '@schematics/angular/utility/ast-utils';
import { applyToUpdateRecorder, type Change, RemoveChange, ReplaceChange } from '@schematics/angular/utility/change';
import { type InsertionIndex, JSONFile, type JSONPath } from '@schematics/angular/utility/json-file';

import { getDataFromUrl } from './request';

// --- RULES(s) ----

/**
 * Deploys assets files and optionally applies computation to them.
 * @param {Record<string, string>} [templateOptions={}] A set of options to be applied on each `.template` file to deploy.
 * @param {string} [source="./files"] The path to the folder containing the files to deploy.
 * @param {string} [destination=""] The path to the destination folder of the deploy operation.
 * @param {MergeStrategy} [strategy=MergeStrategy.Overwrite] The merge strategy to apply on the files to deploy.
 * @returns {Rule}
 */
export const deployFiles = (templateOptions = {}, source = './files', destination = '', strategy = MergeStrategy.Overwrite): Rule =>
    mergeWith(
        apply(url(source), [
            applyTemplates({
                utils: strings,
                ...templateOptions,
            }),
            move(normalize(destination)),
        ]),
        strategy,
    );

/**
 * Deletes a collection of files or folders
 * @param {string[]} paths A set of file or folder paths to delete.
 * @param {boolean} [force=false] Force deletion (required for folders).
 * @returns {Rule}
 */
export const deleteFiles = (paths: string[], force = false): Rule =>
    (tree: Tree): void => {
        paths.forEach(path => {
            if (force) {
                try {
                    tree.delete(path);
                } catch { /* swallow errors*/ }
            } else if (tree.exists(path)) {
                tree.delete(path);
            }
        });
    };

/**
 * Rename a file
 * @param {string} from The path of the file to rename.
 * @param {string} to The new path of the file to rename.
 * @returns {Rule}
 */
export const renameFile = (from: string, to: string): Rule =>
    (tree: Tree): void => {
        if (tree.exists(from)) {
            tree.rename(from, to);
        }
    };

/**
 * Creates or updates a file.
 * @param {string} filePath The path of the file to create or modify.
 * @param {unknown} data The data to be written to the file.
 * @returns {Rule}
 */
export const createOrUpdateFile = (filePath: string, data: unknown): Rule =>
    (tree: Tree): void => {
        if (!tree.exists(filePath)) {
            tree.create(filePath, (typeof data === 'string') ? data : serializeToJson(data));
        } else {
            const actualData = tree.read(filePath)?.toString('utf-8');
            const newData = (typeof data === 'string') ? data : serializeToJson(data);
            if (actualData !== newData) {
                tree.overwrite(filePath, newData);
            }
        }
    };

/**
 * Downloads a file.
 * @param {string|URL} source The path or url to the filename to download.
 * @param {string} destination The path to the destination filename of the download operation.
 * @param {boolean} [replace=false] Whether or not to overwrite the destination file if it already exists.
 * @param {number} [retries=3] The number of times to retry the request in case of failure.
 * @param {number} [backoff=300] The delay (in milliseconds) between retries.
 * @returns {Rule}
 */
export const downloadFile = (source: string | URL, destination: string, replace = false, retries = 3, backoff = 300): Rule =>
    async (tree: Tree): Promise<void> => {
        if (!tree.exists(destination) || replace) {
            const data = await getDataFromUrl(source, retries, backoff);
            if (!tree.exists(destination)) {
                tree.create(destination, data);
            } else {
                tree.overwrite(destination, data);
            }
        }
    };

/**
 * Replaces text in a file, using a regular expression or a search string.
 * @param {string} filePath The path of the file to modify.
 * @param {string|RegExp} searchValue A string or RegExp to search for.
 * @param {string} replaceValue A string containing the text to replace for every successful match of searchValue.
 * @returns {Rule}
 */
export const replaceInFile = (filePath: string, searchValue: string | RegExp, replaceValue: string): Rule =>
    (tree: Tree): void => {
        if (tree.exists(filePath)) {
            const content = tree.read(filePath)?.toString('utf-8') ?? '';
            const newContent = content.replace(searchValue, replaceValue);
            if (content !== newContent) {
                tree.overwrite(filePath, newContent);
            }
        }
    };

/**
 * Adds an import to a file.
 * @param {string} filePath The path of the file to modify.
 * @param {string} symbolName The name of the item to import.
 * @param {string} fileName The path of the file containing the item to import.
 * @param {boolean} [isDefault] If true, the import will follow the style for importing default exports.
 * @returns {Rule}
 */
export const addImportToFile = (filePath: string, symbolName: string, fileName: string, isDefault?: boolean): Rule =>
    (tree: Tree): void => {
        const sourceFile = getTsSourceFile(tree, filePath);
        const changes = insertImport(sourceFile, '', symbolName, fileName, isDefault);
        commitChanges(tree, filePath, [changes]);
    };


/**
 * Modifies or removes an import inside a file.
 * @param {string} filePath The path of the file to modify.
 * @param {string} symbolName The name of the item to update or remove.
 * @param {string|undefined} newSymbolName The new name of the item or `undefined` if it is to be removed.
 * @param {string} fileName The path of the file containing the item to update or remove.
 * @returns {Rule}
 */
export const modifyImportInFile = (filePath: string, symbolName: string, newSymbolName: string | undefined, fileName: string): Rule =>
    (tree: Tree): void => {
        const changes: Change[] = [];
        const sourceFile = getTsSourceFile(tree, filePath);

        const allImports = findNodes(sourceFile, SyntaxKind.ImportDeclaration);
        const relevantImports = allImports.filter(node => {
            const importFiles = node
                .getChildren()
                .filter(isStringLiteral)
                .map(n => n.text);
            return importFiles.filter(file => file === fileName).length === 1;
        });

        relevantImports.forEach(relevantImport => {
            const names = findNodes(relevantImport, SyntaxKind.Identifier);
            const symbolNameNodeIndex = names.findIndex(name => name.getText() === symbolName);
            if (symbolNameNodeIndex !== -1) {
                const symbolNameNode = names[symbolNameNodeIndex];
                if (newSymbolName) {
                    // Rename the name in the import statement
                    changes.push(new ReplaceChange(filePath, symbolNameNode.getStart(), symbolName, newSymbolName));
                } else if (names.length === 1) {
                    // Remove the whole import statement
                    changes.push(new RemoveChange(filePath, relevantImport.getFullStart(), relevantImport.getFullText()));
                } else {
                    // Remove only the name from the import statement
                    const newNames = names.filter(name => name.getText() !== symbolName).map(name => name.getText());
                    const newRelevantImport = `import { ${newNames.join(', ')} } from '${fileName}';`;
                    changes.push(new ReplaceChange(filePath, relevantImport.getStart(), relevantImport.getText(), newRelevantImport));
                }
            }
        });

        commitChanges(tree, filePath, changes);
    };

/**
 * Removes an import inside a file.
 * @param {string} filePath The path of the file to modify.
 * @param {string} symbolName The name of the item to remove.
 * @param {string} fileName The path of the file containing the item to remove.
 * @returns {Rule}
 */
export const removeImportFromFile = (filePath: string, symbolName: string, fileName: string): Rule =>
    modifyImportInFile(filePath, symbolName, undefined, fileName);

/**
 * Adds or modifies an element in a JSON file.
 * @param {string} filePath The path of the file to modify.
 * @param {JSONPath} jsonPath A path to the element to modify in the JSON structure (separated by dot notation).
 * @param {JsonValue|undefined} value The new value to assign to the element.
 * @param {InsertionIndex|false} [insertInOrder] Manage the insertion order.
 * @returns {Rule}
 */
export const modifyJsonFile = (filePath: string, jsonPath: JSONPath, value: JsonValue | undefined, insertInOrder?: InsertionIndex | false): Rule =>
    (tree: Tree): void => {
        if (tree.exists(filePath)) {
            const jsonFile = new JSONFile(tree, filePath);
            if ((jsonPath.length === 0) && (JSON.stringify(JSON.parse(jsonFile.content)) === JSON.stringify(value))) {
                return;
            } else if (JSON.stringify(jsonFile.get(jsonPath)) === JSON.stringify(value)) {
                return;
            } else {
                jsonFile.modify(jsonPath, value, insertInOrder);
            }
        }
    };

/**
 * Removes an element inside a JSON file.
 * @param {string} filePath The path of the file to modify.
 * @param {JSONPath} jsonPath A path to the element to remove in the JSON structure (separated by dot notation).
 * @returns {Rule}
 */
export const removeFromJsonFile = (filePath: string, jsonPath: JSONPath): Rule =>
    (tree: Tree): void => {
        if (tree.exists(filePath)) {
            const jsonFile = new JSONFile(tree, filePath);
            if (jsonFile.get(jsonPath) !== undefined) {
                jsonFile.remove(jsonPath);
            }
        }
    };

// --- HELPER(s) ----

/**
 * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
 * Uses a default indentation of 2.
 * @param {unknown} value A JavaScript value, usually an object or array, to be converted.
 * @returns {string}
 */
export const serializeToJson = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;

/**
 * Gets the source of a TypeScript file.
 * @param {Tree} tree The current schematic's project tree.
 * @param {string} filePath The path of the file to get the source from.
 * @returns {Rule}
 */
export const getTsSourceFile = (tree: Tree, filePath: string): SourceFile => {
    const buffer = tree.read(filePath);
    if (!buffer) {
        throw new SchematicsException(`File ${filePath} does not exist.`);
    }
    return createSourceFile(filePath, buffer.toString('utf-8'), ScriptTarget.Latest, true);
};

/**
 * Applies changes on a file inside the current schematic's project tree.
 * @param {Tree} tree The current schematic's project tree.
 * @param {string} filePath The path of the file to apply the changes to.
 * @param {Change[]} changes The changes to apply to the file.
 * @returns {void}
 */
export const commitChanges = (tree: Tree, filePath: string, changes: Change[]): void => {
    const recorder = tree.beginUpdate(filePath);
    applyToUpdateRecorder(recorder, changes);
    tree.commitUpdate(recorder);
};
