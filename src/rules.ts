import { chain, Rule, SchematicContext, Tree, UnsuccessfulWorkflowExecution } from '@angular-devkit/schematics';
import { spawn as childProcessSpawn } from 'child_process';
import { blue, cyan, gray, magenta, red, white, yellow } from 'colors/safe';
import ora from 'ora';

interface BufferOutput {
    stream: NodeJS.WriteStream;
    data: Buffer;
}

export const log = (message: string): Rule =>
    (_tree: Tree, context: SchematicContext): Rule =>
        (): void => {
            // Avoid indentation by placing the cursor back at the beginning of the current line
            context.logger.info(`\r${message}`);
        };

export const info = (message: string): Rule =>
    log(`${blue('ℹ')} ${message}`);

export const warn = (message: string): Rule =>
    log(`${yellow('WARNING')} ${white(message)}`);

export const action = (message: string): Rule =>
    log(`${yellow('ACTION')} ${yellow(message)}`);

export const schematic = (name: string, rules: Rule[], options?: unknown): Rule =>
    chain([
        log(magenta(`🚀 SCHEMATIC ${white('[')} ${magenta(name)}${(options) ? gray(`, ${JSON.stringify(options)}`) : ''} ${white(']')}`)),
        ...rules
    ]);

export const spawn = (command: string, args: string[], showOutput = false): Rule =>
    (): Promise<void> =>
        new Promise((resolve, reject) => {
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
