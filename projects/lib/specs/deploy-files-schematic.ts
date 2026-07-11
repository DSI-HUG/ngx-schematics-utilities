import type { Rule } from '@angular-devkit/schematics';

import { deployFiles, schematic } from '../src';

export const deployFilesSchematic = (options: { templateOptions: Record<string, unknown>; source: string; destination: string }): Rule =>
    schematic('deployFilesSchematic', [
        deployFiles(options.templateOptions, options.source, options.destination),
    ]);
