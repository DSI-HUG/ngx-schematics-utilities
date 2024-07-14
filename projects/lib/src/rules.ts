import {
    chain, Rule, SchematicContext, TaskId, Tree, UnsuccessfulWorkflowExecution, callRule
} from '@angular-devkit/schematics';
import { FileSystemEngineHostBase } from '@angular-devkit/schematics/tools';
import {
    bgBlue, bgGreen, bgMagenta, bgRed, bgYellow, black, blue, cyan, gray, green, magenta, red, white, yellow
} from '@colors/colors/safe';
import { spawn as childProcessSpawn } from 'child_process';

interface BufferOutput {
    stream: NodeJS.WriteStream;
    data: Buffer;
}

type SchematicContextExtended = SchematicContext & {
    _scheduledTasks?: Record<string, TaskId>
    readonly engine: SchematicContext['engine'] & { _host: FileSystemEngineHostBase }
}

/**
 * Outputs a message to the console.
 * By default, the Angular schematic's logger will misplace messages with breaking indentations.
 * This method makes sure that messages are always displayed at the beginning of the current console line.
 * @param {string} message Message to display.
 * @returns {Rule}
 */
export const log = (message: string): Rule =>
    (_tree: Tree, context: SchematicContext): Rule =>
        (): void => {
            // Avoid indentation by placing the cursor back at the beginning of the current line
            context.logger.info(`\r${message}`);
        };

/**
 * Executes a set of rules by outputing first the name of the associated schematic to the console.
 * The schematic name will be prefixed by the word "SCHEMATIC" printed in magenta and given options can
 * follow inlined, stringified and printed in gray if verbose mode is activated.
 * @param {string} name Name of the schematic to display.
 * @param {Rule[]} rules Set of rules to execute.
 * @param {unknown} [options] Schematic's options to display.
 * @returns {Rule}
 */
export const schematic = (name: string, rules: Rule[], options?: unknown): Rule => {
    const opts = process.argv.includes('--verbose') ? JSON.stringify(options) : undefined;
    return chain([
        log(''),
        log(`${magenta(`${black(bgMagenta(' SCHEMATIC '))} 🚀 ${white('[')} ${magenta(name)}${(opts) ? gray(`, ${opts}`) : ''} ${white(']')}`)}`),
        log(''),
        ...rules,
        runAtEnd(chain([log(''), log(`${green('>')} ${black(bgGreen(' DONE '))}\n`)]))
    ]);
};

/**
 * Outputs a message to the console, prefixed by the word "INFO" printed in blue.
 * @param {string} message Message to display.
 * @returns {Rule}
 */
export const logInfo = (message: string): Rule =>
    log(`${blue('>')} ${black(bgBlue(' INFO '))} ${blue(message)}\n`);

/**
 * Outputs a message to the console, prefixed by the word "WARNING" printed in yellow.
 * @param {string} message Message to display.
 * @returns {Rule}
 */
export const logWarning = (message: string): Rule =>
    log(`${yellow('>')} ${black(bgYellow(' WARNING '))} ${yellow(message)}\n`);

/**
 * Outputs a message to the console, prefixed by the word "ERROR" printed in red.
 * @param {string} message Message to display.
 * @returns {Rule}
 */
export const logError = (message: string): Rule =>
    log(`${red('>')} ${black(bgRed(' ERROR '))} ${red(message)}\n`);

/**
 * Outputs a message to the console, prefixed by the word "ACTION" printed in yellow.
 * @param {string} message Message to display.
 * @returns {Rule}
 */
export const logAction = (message: string): Rule =>
    log(`${yellow('>')} ${black(bgYellow(' ACTION '))} ${yellow(message)}\n`);

/**
 * Spawns a new process using the given command and arguments.
 * By default, the output will not be redirected to the console unless otherwise specified by the `showOutput`
 * parameter or the `--verbose` current schematic process argument.
 * When the output is not redirected to the console, an animated spinner will be displayed to the console to
 * indicates the current process activity, as well as the command and its options displayed inlined and printed
 * in cyan.
 * @param {string} command The command to run.
 * @param {string[]} args List of string arguments to apply to the command.
 * @param {boolean} [showOutput=false] Whether the process output should be redirected to the console or not.
 * @returns {Rule}
 */
export const spawn = (command: string, args: string[], showOutput = false): Rule =>
    async (): Promise<void> => {
        const ora = (await import('ora')).default;
        return new Promise((resolve, reject) => {
            const bufferedOutput: BufferOutput[] = [];
            const verbose = showOutput || process.argv.includes('--verbose');
            const cmdText = `${command} ${args.join(' ')}`;

            const spinner = ora({ text: cyan(cmdText) });
            if (!verbose) {
                spinner.start();
            }

            const childProcess = childProcessSpawn(command, args, {
                stdio: (verbose) ? 'inherit' : 'pipe',
                shell: true
            });
            childProcess.once('disconnect', resolve);
            childProcess.once('error', error => reject(error));
            childProcess.on('close', (code: number) => {
                if (code === 0) {
                    if (!verbose) {
                        spinner.succeed(cyan(cmdText));
                        spinner.stop();
                    }
                    return resolve();
                } else {
                    if (!verbose) {
                        spinner.fail(red(`${cmdText}\n`));
                        bufferedOutput.forEach(({ stream, data }) => stream.write(data));
                    }
                    return reject(new UnsuccessfulWorkflowExecution());
                }
            });
            if (!verbose) {
                childProcess.stdout?.on('data', (data: Buffer) =>
                    bufferedOutput.push({ stream: process.stdout, data: data })
                );
                childProcess.stderr?.on('data', (data: Buffer) =>
                    bufferedOutput.push({ stream: process.stderr, data: data })
                );
            }
        });
    };

/**
 * Executes a rule at the very end of the schematic.
 * Beware that most of the other helper rules won't work here (especially those that manipulate the tree).
 * Because, at that time, the Angular schematic has already finished running.
 * @param {Rule} rule The rule to execute.
 * @returns {Rule}
 */
export const runAtEnd = (rule: Rule): Rule =>
    (tree: Tree, context: SchematicContext): void => {
        const _context = context as SchematicContextExtended;
        _context._scheduledTasks ??= {};

        // Register the task
        const name = `__task_${Object.keys(_context._scheduledTasks).length}__`;
        if (!_context._scheduledTasks[name]) {
            _context.engine._host.registerTaskExecutor({
                // @ts-expect-error: `callRule` returns Observable<Tree> where Observable<void> is expected, but that's acceptable
                name, create: async () => Promise.resolve(() => callRule(rule, tree, context))
            });
        } else {
            throw new Error(`Task with name '${name}' already registered.`);
        }

        // Schedule the task
        _context._scheduledTasks[name] = _context.addTask(
            { toConfiguration: () => ({ name }) },
            Object.values(_context._scheduledTasks)
        );
    };
