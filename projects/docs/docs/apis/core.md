---
title: Core
---

## Rules

### `schematic`

Executes a set of rules by outputing first the name of the associated schematic to the console.

:::note Note
The schematic name will be prefixed by the word "SCHEMATIC" printed in magenta and given options can follow inlined, stringified and printed in gray if verbose mode is activated.
:::

```ts {5-7}
import { schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    ...
  ]);
```

### `log`

Outputs a message to the console.

:::note Note
By default, the Angular schematic's logger will misplace messages with breaking indentations.<br/>
This method makes sure that messages are always displayed at the beginning of the current console line.
:::

```ts {6}
import { log, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    log('My log message')
  ]);
```

### `logInfo`

Outputs a message to the console, prefixed by the word "INFO" printed in blue.

```ts {6}
import { logInfo, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    logInfo('My info message')
  ]);
```

### `logWarning`

Outputs a message to the console, prefixed by the word "WARNING" printed in yellow.

```ts {6}
import { logWarning, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    logWarning('My warn message')
  ]);
```

### `logError`

Outputs a message to the console, prefixed by the word "ERROR" printed in red.

```ts {6}
import { logError, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    logError('My error message')
  ]);
```

### `logAction`

Outputs a message to the console, prefixed by the word "ACTION" printed in green.

```ts {6}
import { logAction, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    logAction('My action message')
  ]);
```

### `spawn`

Spawns a new process using the given command and arguments.

:::note Note
By default, the output will not be redirected to the console unless otherwise specified by the `showOutput`
parameter or the `--verbose` current schematic process argument.

When the output is not redirected to the console, an animated spinner will be displayed to the console to
indicates the current process activity, as well as the command and its options displayed inlined and printed
in cyan.
:::

```ts {7,10}
import { spawn, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    // Display an animated spinner along with the command and its arguments
    spawn('ng', ['add', '@angular/material', '--skip-confirmation']),

    // Display the command outputs directly to the console
    spawn('npx', ['-p', 'package-name', 'some-command'], true)
  ]);
```

## Helpers

### `getSchematicSchemaOptions`

Returns all the options of a specific local or external schematic's schema.

```ts {9,12,15,18}
import { getSchematicSchemaOptions, schematic } from '@hug/ngx-schematics-utilities';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  (tree: Tree, context: SchematicContext): Rule =>
    schematic('my-schematic', [
        async(): Rule => {
            // Get the `ng-add` schema of the current running schematic
            const opts1 = await getSchematicSchemaOptions(context);

            // Get the `schematic-name` schema of the current running schematic
            const opts2 = await getSchematicSchemaOptions(context, 'schematic-name'));

            // Get the `ng-add` schema of the local package `@angular/material`
            const opts3 = await getSchematicSchemaOptions(context, 'ng-add', '@angular/material'));

            // Get the `sentry` schema of the external package `@hug/ngx-sentry` on npm
            const opts4 = await getSchematicSchemaOptions(context, 'sentry', '@hug/ngx-sentry', true));
            ...
        }
    ]);
```

### `getSchematicSchemaDefaultOptions`

Returns all the default options of a specific local or external schematic's schema.

```ts {9,12,15,18}
import { getSchematicSchemaDefaultOptions, schematic } from '@hug/ngx-schematics-utilities';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  (tree: Tree, context: SchematicContext): Rule =>
    schematic('my-schematic', [
        async (): Rule => {
            // Get the default options from the `ng-add` schema of the current running schematic
            const opts1 = await getSchematicSchemaDefaultOptions(context);

            // Get the default options from the `schematic-name` schema of the current running schematic
            const opts2 = await getSchematicSchemaDefaultOptions(context, 'schematic-name'));

            // Get the default options from the `ng-add` schema of the local package `@angular/material`
            const opts3 = await getSchematicSchemaDefaultOptions(context, 'ng-add', '@angular/material'));

            // Get the default options from the `sentry` schema of the external package `@hug/ngx-sentry` on npm
            const opts4 = await getSchematicSchemaDefaultOptions(context, 'sentry', '@hug/ngx-sentry', true));
            ...
        }
    ]);
```
