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

### `rule`

Executes a rule.

```ts {6-8,12-14}
import { rule, schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    rule((): Rule => {
        ...
    })),

    // Using chainable
    workspace()
      .rule((): Rule => {
        ...
      })
      .toRule()
  ]);
```

### `log`

Outputs a message to the console.

:::note Note
By default, the Angular schematic's logger will misplace messages with breaking indentations.<br/>
This method makes sure that messages are always displayed at the beginning of the current console line.
:::

```ts {6,10}
import { log, schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    log('My log message'),

    // Using chainable
    workspace()
      .log('My other log message\n')
      .toRule()
  ]);
```

### `logInfo`

Outputs a message to the console, prefixed by the word "INFO" printed in blue.

```ts {6,10}
import { logInfo, schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    logInfo('My info message'),

    // Using chainable
    workspace()
      .logInfo('My other info message\n')
      .toRule()
  ]);
```

### `logWarning`

Outputs a message to the console, prefixed by the word "WARNING" printed in yellow.

```ts {6,10}
import { logWarning, schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    logWarning('My warn message'),

    // Using chainable
    workspace()
      .logWarning('My other warn message\n')
      .toRule()
  ]);
```

### `logError`

Outputs a message to the console, prefixed by the word "ERROR" printed in red.

```ts {6,10}
import { logError, schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    logError('My error message'),

    // Using chainable
    workspace()
      .logError('My other error message\n')
      .toRule()
  ]);
```

### `logAction`

Outputs a message to the console, prefixed by the word "ACTION" printed in green.

```ts {6,10}
import { logAction, schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    logAction('My action message'),

    // Using chainable
    workspace()
      .logAction('My other action message\n')
      .toRule()
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

```ts {7,10,14}
import { spawn, schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    // Display an animated spinner along with the command and its arguments
    spawn('ng', ['add', '@angular/material', '--skip-confirmation']),

    // Display the command outputs directly to the console
    spawn('npx', ['-p', 'package-name', 'some-command'], true)

    // Using chainable
    workspace()
      .spawn('ls', ['-l'])
      .toRule()
  ]);
```

### `runAtEnd`

Executes a rule at the very end of the schematic.<br/>
Beware that most of the other helper rules won't work here (especially those that manipulate the tree).<br/>
Because, at that time, the Angular schematic has already finished running.

```ts {6-8,12}
import { runAtEnd, logAction, schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    runAtEnd((): Rule => {
        ...
    })),

    // Using chainable
    workspace()
      .runAtEnd(logAction('Have a look at `./package.json` file and make modifications as needed.'))
      .toRule()
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
        async (): Rule => {
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
