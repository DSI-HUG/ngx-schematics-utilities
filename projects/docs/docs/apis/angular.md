---
title: Angular
---

## Rules

### `ensureIsAngularWorkspace`

Ensures that the workspace, where the schematic is currently running on, is actually an Angular workspace or throws an exception otherwise.

:::note Note
The test is done by ensuring the existence of an `angular.json` file.
:::

```ts {6}
import { ensureIsAngularWorkspace, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    ensureIsAngularWorkspace()
  ]);
```

### `ensureIsAngularProject`

Ensures that a project is actually an Angular project or throws an exception otherwise.

```ts {7,10}
import { ensureIsAngularProject, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    // By default: uses the default project name specified in the `angular.json` file
    ensureIsAngularProject(),

    // Use a specific project name
    ensureIsAngularProject('ProjectName')
  ]);
```

### `ensureIsAngularLibrary`

Ensures that a project is actually an Angular library or throws an exception otherwise.

```ts {7,10}
import { ensureIsAngularLibrary, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    // By default: uses the default project name specified in the `angular.json` file
    ensureIsAngularLibrary(),

    // Use a specific project name
    ensureIsAngularLibrary('ProjectName')
  ]);
```

### `isAngularVersion`

Executes a rule only if the current Angular version installed in the project satisfies a given range.

```ts {6-8}
import { isAngularVersion, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    isAngularVersion('<= 11', (): Rule => {
      ...
    })
  ]);
```

### `addAngularJsonAsset`

Adds a new asset to a project `build` and `test` sections of the `angular.json` file.

```ts {7,10}
import { addAngularJsonAsset, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    // By default: uses the default project name specified in the `angular.json` file
    addAngularJsonAsset('src/manifest.webmanifest'),

    // Use a specific project name
    addAngularJsonAsset('src/manifest.webmanifest', 'ProjectName')
  ]);
```

### `removeAngularJsonAsset`

Removes an asset from a project `build` and `test` sections of the `angular.json` file.

```ts {7,10}
import { removeAngularJsonAsset, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    // By default: uses the default project name specified in the `angular.json` file
    removeAngularJsonAsset('src/manifest.webmanifest'),

    // Use a specific project name
    removeAngularJsonAsset('src/manifest.webmanifest', 'ProjectName')
  ]);
```

### `addDeclarationToNgModule`

Inserts a declaration (ex. Component, Pipe, Directive) into an NgModule declarations and also imports that declaration.

```ts {6}
import { addDeclarationToNgModule, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addDeclarationToNgModule('src/app/app.module.ts', 'TestComponent', './components/test')
  ]);
```

### `removeDeclarationFromNgModule`

Removes a declaration (ex. Component, Pipe, Directive) from an NgModule declarations.

:::tip Tip
Use [#removeImportFromFile](/apis/file#removeimportfromfile) to also remove the import.
:::

```ts {6}
import { removeDeclarationFromNgModule, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeDeclarationFromNgModule('src/app/app.module.ts', 'AppComponent')
  ]);
```

### `addImportToNgModule`

Inserts an import (ex. NgModule) into an NgModule imports and also imports that import.

```ts {8,11-19}
import { addImportToNgModule, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';
import { tags } from '@angular-devkit/core';

export default (options: any): Rule =>
  schematic('my-schematic', [
    // Import simple module
    addImportToNgModule('src/app/app.module.ts', 'HttpClientModule', '@angular/common/http'),

    // Import forRoot module
    addImportToNgModule(
      'src/app/app.module.ts',
      tags.stripIndent`
        TestModule.forRoot({
          enabled: environment.production
        })
      `,
      'src/common/test'
    )
  ]);
```

### `removeImportFromNgModule`

Removes an import (ex. NgModule) from an NgModule imports.

:::tip Tip
Use [#removeImportFromFile](/apis/file#removeimportfromfile) to also remove the import.
:::

```ts {6}
import { removeImportFromNgModule, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeImportFromNgModule('src/app/app.module.ts', 'TestModule')
  ]);
```

### `addExportToNgModule`

Inserts an export (ex. Component, Pipe, Directive) into an NgModule exports and also imports that export.

```ts {6}
import { addExportToNgModule, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addExportToNgModule('src/app/app.module.ts', 'TestComponent', './components/test')
  ]);
```

### `removeExportFromNgModule`

Removes an export (ex. Component, Pipe, Directive) from an NgModule exports.

:::tip Tip
Use [#removeImportFromFile](/apis/file#removeimportfromfile) to also remove the import.
:::

```ts {6}
import { removeExportFromNgModule, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeExportFromNgModule('src/app/app.module.ts', 'TestComponent')
  ]);
```

### `addProviderToNgModule`

Inserts a provider (ex. Service) into an NgModule providers and also imports that provider.

```ts {6}
import { addExportToNgModule, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addProviderToNgModule('src/app/app.module.ts', 'TestService', './services/test')
  ]);
```

### `removeProviderFromNgModule`

Removes a provider (ex. Service) from an NgModule providers.

:::tip Tip
Use [#removeImportFromFile](/apis/file#removeimportfromfile) to also remove the import.
:::

```ts {6}
import { removeProviderFromNgModule, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeProviderFromNgModule('src/app/app.module.ts', 'TestService')
  ]);
```

### `addRouteDeclarationToNgModule`

Inserts a route declaration to a router module (i.e. as a RouterModule declaration).

```ts {10,14}
import { addRouteDeclarationToNgModule, addImportToFile, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule => {
  const componentRoute = "{ path: 'home', component: HomeComponent }";
  const lazyRoute = "{ path: 'user', loadChildren: '() => import('./pages/user/user.module').then(m => m.UserModule)'; }";

  return schematic('my-schematic', [
    // Add component route
    addRouteDeclarationToNgModule('src/app/app-routing.module.ts', componentRoute),
    addImportToFile('src/app/app-routing.module.ts', 'HomeComponent', './pages/home/home.component'),

    // Add lazy route
    addRouteDeclarationToNgModule('src/app/app-routing.module.ts', lazyRoute)
  ]);
}
```

## Helpers

### `getDefaultProjectName`

Gets the default project name defined in the `angular.json` file.

```ts {6}
import { getDefaultProjectName } from '@hug/ngx-schematics-utilities';
import { Rule, Tree } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  (tree: Tree): Rule => {
    const projectName = getDefaultProjectName(tree);
    return schematic('my-schematic', [
      ...
    ]);
  };
```

### `getProjectOutputPath`

Gets a project output path as defined in the `angular.json` file.

```ts {7,10}
import { getProjectOutputPath } from '@hug/ngx-schematics-utilities';
import { Rule, Tree } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  (tree: Tree): Rule => {
    // By default: uses the default project name specified in the `angular.json` file
    const defaultProjectOutputPath = getProjectOutputPath(tree);

    // Use a specific project name
    const projectOutputPath = getProjectOutputPath(tree, 'ProjectName');

    return schematic('my-schematic', [
      ...
    ]);
  };
```

### `getProjectFromWorkspace`

Gets a project definition object from the current Angular workspace.

```ts {6}
import { getProjectFromWorkspace } from '@hug/ngx-schematics-utilities';
import { Rule, Tree } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  async (tree: Tree): Rule => {
    const project = await getProjectFromWorkspace(tree);
    return schematic('my-schematic', [
      ...
    ]);
  };
```
