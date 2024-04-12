import { JsonValue } from '@angular-devkit/core';
import { WorkspaceDefinition } from '@angular-devkit/core/src/workspace';
import { chain, MergeStrategy, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { InsertionIndex, JSONPath } from '@schematics/angular/utility/json-file';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { ensureIsAngularWorkspace, isAngularVersion } from '../angular';
import {
    addImportToFile, createOrUpdateFile, deleteFiles, deployFiles, downloadFile, modifyImportInFile, modifyJsonFile,
    removeFromJsonFile, removeImportFromFile, renameFile, replaceInFile
} from '../file';
import { log, logAction, logError, logInfo, logWarning, spawn } from '../rules';

export enum ChainableType {
    WORKSPACE,
    APPLICATION,
    LIBRARY
}

export type ChainableRule<T> = (context: T) => Promise<Rule | void> | Rule | void;

export class Chainable<T> {
    /*
     * We need an array of lazy loaded rules because we have to make sure that a rule has everything she needs.
     * (ex: access to project, tree, workspace, etc.)
     */
    protected _rules: (() => Rule)[] = [];

    protected _tree?: Tree;
    protected _schematicContext?: SchematicContext;
    protected _workspace?: WorkspaceDefinition;

    constructor(
        protected chainableType: ChainableType
    ) {
        this.init();
    }

    /**
     * @see {@link deployFiles}
     * @returns {this}
     */
    public deployFiles(templateOptions = {}, source = './files', destination = '', strategy = MergeStrategy.Overwrite): this {
        return this.addRuleToChain(() => deployFiles(templateOptions, source, this.pathFromRoot(destination), strategy));
    }

    /**
     * @see {@link deleteFiles}
     * @returns {this}
     */
    public deleteFiles(files: string[], force = false): this {
        return this.addRuleToChain(() => deleteFiles(files.map(file => this.pathFromRoot(file)), force));
    }

    /**
     * @see {@link renameFile}
     * @returns {this}
     */
    public renameFile(from: string, to: string): this {
        return this.addRuleToChain(() => renameFile(this.pathFromRoot(from), this.pathFromRoot(to)));
    }

    /**
     * @see {@link createOrUpdateFile}
     * @returns {this}
     */
    public createOrUpdateFile(filePath: string, data: unknown): this {
        return this.addRuleToChain(() => createOrUpdateFile(this.pathFromRoot(filePath), data));
    }

    /**
     * @see {@link downloadFile}
     * @returns {this}
     */
    public downloadFile(source: string | URL, destination: string, replace = false): this {
        return this.addRuleToChain(() => downloadFile(source, this.pathFromRoot(destination), replace));
    }

    /**
     * @see {@link replaceInFile}
     * @returns {this}
     */
    public replaceInFile(filePath: string, searchValue: string | RegExp, replaceValue: string): this {
        return this.addRuleToChain(() => replaceInFile(this.pathFromRoot(filePath), searchValue, replaceValue));
    }

    /**
     * @see {@link addImportToFile}
     * @returns {this}
     */
    public addImportToFile(filePath: string, symbolName: string, fileName: string, isDefault?: boolean): this {
        return this.addRuleToChain(() => addImportToFile(this.pathFromRoot(filePath), symbolName, fileName, isDefault));
    }

    /**
     * @see {@link modifyImportInFile}
     * @returns {this}
     */
    public modifyImportInFile(filePath: string, symbolName: string, newSymbolName: string | undefined, fileName: string): this {
        return this.addRuleToChain(() => modifyImportInFile(this.pathFromRoot(filePath), symbolName, newSymbolName, fileName));
    }

    /**
     * @see {@link removeImportFromFile}
     * @returns {this}
     */
    public removeImportFromFile(filePath: string, symbolName: string, fileName: string): this {
        return this.addRuleToChain(() => removeImportFromFile(this.pathFromRoot(filePath), symbolName, fileName));
    }

    /**
     * @see {@link modifyJsonFile}
     * @returns {this}
     */
    public modifyJsonFile(filePath: string, jsonPath: JSONPath, value: JsonValue | undefined, insertInOrder?: InsertionIndex | false): this {
        return this.addRuleToChain(() => modifyJsonFile(this.pathFromRoot(filePath), jsonPath, value, insertInOrder));
    }

    /**
     * @see {@link removeFromJsonFile}
     * @returns {this}
     */
    public removeFromJsonFile(filePath: string, jsonPath: JSONPath): this {
        return this.addRuleToChain(() => removeFromJsonFile(this.pathFromRoot(filePath), jsonPath));
    }

    /**
     * @see {@link isAngularVersion}
     * @returns {this}
     */
    public isAngularVersion(range: string, rule: ChainableRule<T>): this {
        return this.addRuleToChain(() => isAngularVersion(range, () => rule(this.getContext())));
    }

    /**
     * @see {@link log}
     * @returns {this}
     */
    public log(message: string): this {
        return this.addRuleToChain(() => log(message));
    }

    /**
     * @see {@link logInfo}
     * @returns {this}
     */
    public logInfo(message: string): this {
        return this.addRuleToChain(() => logInfo(message));
    }

    /**
     * @see {@link logWarning}
     * @returns {this}
     */
    public logWarning(message: string): this {
        return this.addRuleToChain(() => logWarning(message));
    }

    /**
     * @see {@link logError}
     * @returns {this}
     */
    public logError(message: string): this {
        return this.addRuleToChain(() => logError(message));
    }

    /**
     * @see {@link logAction}
     * @returns {this}
     */
    public logAction(message: string): this {
        return this.addRuleToChain(() => logAction(message));
    }

    /**
     * @see {@link spawn}
     * @returns {this}
     */
    public spawn(command: string, args: string[], showOutput = false): this {
        return this.addRuleToChain(() => spawn(command, args, showOutput));
    }

    /**
     * Runs a custom rule within the chainable context.
     * @param {ChainableRule<T>} rule The custom rule to be run.
     * @returns {this}
     */
    public rule(rule: ChainableRule<T>): this {
        return this.addRuleToChain(() => () => rule(this.getContext()));
    }

    /**
     * Transforms the chainable context into an array of rules.
     * @returns {Rule[]}
     */
    public toRules(): Rule[] {
        return this._rules;
    }

    /**
     * Transforms the chainable context into a single rule.
     * @returns {Rule}
     */
    public toRule(): Rule {
        return chain(this._rules);
    }

    // --- HELPER(s) ---

    protected addRuleToChain(rule: () => Rule): this {
        this._rules.push(rule);
        return this;
    }

    protected getContext(): T {
        return {
            tree: this._tree!,
            schematicContext: this._schematicContext!,
            workspace: this._workspace!
        } as T;
    }

    protected pathFromRoot(path: string): string {
        return path;
    }

    protected init(): void {
        // Sanity checks
        this.addRuleToChain(ensureIsAngularWorkspace);

        // Make sure the first thing we do in the chain is to get all the needed references
        this.addRuleToChain(() => async (tree: Tree, schematicContext: SchematicContext) => {
            this._tree = tree;
            this._schematicContext = schematicContext;
            this._workspace = await getWorkspace(tree);
        });
    }
}
