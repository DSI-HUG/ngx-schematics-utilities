---
title: File
---

## Rules

### `deployFiles`

Deploys assets files and optionally applies computation to them.

```ts {7,10,13,16}
import { deployFiles, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    // By default: deploy schematic `./files` folder into project root folder
    deployFiles(),

    // Use defaults but also apply computation to `*.template` files
    deployFiles(options),

    // Use a different source folder
    deployFiles(undefined, './my-files'),

    // Use a different destination folder
    deployFiles(undefined, './files', './my-dest-folder'),
  ]);
```

### `deleteFiles`

Deletes a collection of files or folders

```ts {6-9,12}
import { deleteFiles, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    deleteFiles([
      'src/assets/.gitkeep',
      'src/app/app.component.spec.ts'
    ]),

    // Folder deletion needs to be forced
    deleteFiles(['src'], true)
  ]);
```

### `createOrUpdateFile`

Creates or updates a file.

```ts {6}
import { createOrUpdateFile, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    createOrUpdateFile('README.md', 'My readme content')
  ]);
```

### `downloadFile`

Downloads a file.

```ts {9-12}
import { downloadFile, schematic } from '@hug/ngx-schematics-utilities';
import { chain, Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    (): Rule => {
      const sizes = ['72', '96', '128', '144', '152', '192', '384', '512'];
      return chain(
        sizes.map(size => downloadFile(
          `https://my-cdn.com/icons/icon-${size}x${size}.png`,
          `src/assets/icons/icon-${size}x${size}.png`
        ))
      );
    }
  ]);
```

### `replaceInFile`

Replaces text in a file, using a regular expression or a search string.

```ts {6}
import { replaceInFile, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    replaceInFile('.editorconfig', /(indent_size = )(.*)/gm, '$14')
  ]);
```

### `addImportToFile`

Adds an import to a file.

```ts {7,10}
import { addImportToFile, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    // ES format : `import { environment } from './environments/environment';`
    addImportToFile('src/main.ts', 'environment', './environments/environment'),

    // Default format : `import packageJson from 'package.json';`
    addImportToFile('src/main.ts', 'packageJson', 'package.json', true)
  ]);
```

### `modifyImportInFile`

Modifies or removes an import inside a file.

```ts {7,10}
import { modifyImportInFile, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    // Rename an import
    modifyImportInFile('src/main.ts', 'name', 'newName', 'src/my-file');

    // Remove an import
    modifyImportInFile('src/main.ts', 'environment', undefined, 'src/environments/environment');
  ]);
```

### `removeImportFromFile`

Removes an import inside a file.

```ts {6}
import { modifyImportInFile, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeImportFromFile('src/main.ts', 'environment', 'src/environments/environment');
  ]);
```

### `modifyJsonFile`

Adds, modifies or removes an element in a JSON file.

```ts {7,10,13}
import { modifyJsonFile, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    // Add or update an element
    modifyJsonFile('tsconfig.json', ['compilerOptions', 'emitDecoratorMetadata'], true),

    // Remove an element
    modifyJsonFile('tsconfig.json', ['compilerOptions', 'strict'], undefined),

    // Add an element at the beginning
    modifyJsonFile('tsconfig.json', ['extends'], './my-tsconfig.json', () => 0)
  ]);
```

### `removeFromJsonFile`

Removes an element inside a JSON file.

```ts {6}
import { removeFromJsonFile, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeFromJsonFile('package.json', ['scripts', 'start'])
  ]);
```

## Helpers

### `serializeToJson`

Converts a JavaScript value to a JavaScript Object Notation (JSON) string.

:::note Note
Uses a default indentation of 2.
:::

```ts {8}
import { serializeToJson, schematic } from '@hug/ngx-schematics-utilities';
import { chain, Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    (): Rule => {
      const data = { key: 'value' };
      const str = serializeToJson(data);
      ...
    }
  ]);
```

### `getTsSourceFile`

Gets the source of a TypeScript file.

```ts {6}
import { getTsSourceFile, schematic } from '@hug/ngx-schematics-utilities';
import { Rule, Tree } from '@angular-devkit/schematics';

export const myRule = (filePath: string): Rule =>
  (tree: Tree): void => {
    const sourceFile = getTsSourceFile(tree, filePath);
    ...
  };
```

### `commitChanges`

Applies changes on a file inside the current schematic's project tree.

```ts {7}
import { commitChanges } from '@hug/ngx-schematics-utilities';
import { Rule, Tree } from '@angular-devkit/schematics';

export const myRule = (filePath: string): Rule =>
  (tree: Tree): void => {
    ...
    commitChanges(tree, filePath, changes);
  };
```
