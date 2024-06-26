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

### `ensureIsAngularApplication`

Ensures that a project is actually an Angular application or throws an exception otherwise.

```ts {6}
import { ensureIsAngularApplication, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    ensureIsAngularApplication('ProjectName')
  ]);
```

### `ensureIsAngularLibrary`

Ensures that a project is actually an Angular library or throws an exception otherwise.

```ts {6}
import { ensureIsAngularLibrary, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
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

```ts {6}
import { addAngularJsonAsset, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addAngularJsonAsset('src/manifest.webmanifest', 'ProjectName')
  ]);
```

### `removeAngularJsonAsset`

Removes an asset from a project `build` and `test` sections of the `angular.json` file.

```ts {6}
import { removeAngularJsonAsset, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeAngularJsonAsset('src/manifest.webmanifest', 'ProjectName')
  ]);
```

### `addAngularJsonStyle`

Adds a new style to a project `build` and `test` sections of the `angular.json` file.

```ts {6}
import { addAngularJsonStyle, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addAngularJsonStyle('src/assets/my-styles.css', 'ProjectName')
  ]);
```

### `removeAngularJsonStyle`

Removes a style from a project `build` and `test` sections of the `angular.json` file.

```ts {6}
import { removeAngularJsonStyle, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeAngularJsonStyle('src/assets/my-styles.css', 'ProjectName')
  ]);
```

### `addAngularJsonScript`

Adds a new script to a project `build` and `test` sections of the `angular.json` file.

```ts {6}
import { addAngularJsonScript, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addAngularJsonScript('src/my-script.js', 'ProjectName')
  ]);
```

### `removeAngularJsonScript`

Removes a script from a project `build` and `test` sections of the `angular.json` file.

```ts {6}
import { removeAngularJsonScript, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeAngularJsonScript('src/my-script.js', 'ProjectName')
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

### `addProviderToBootstrapApplication`

Inserts a provider (ex. provideRouter) into a bootstrapApplication's providers and also imports that provider.

```ts {8,11-19}
import { addProviderToBootstrapApplication, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';
import { tags } from '@angular-devkit/core';

export default (options: any): Rule =>
  schematic('my-schematic', [
    // Add simple module
    addProviderToBootstrapApplication('src/main.ts', 'provideAnimations()', '@angular/platform-browser/animations'),

    // Add module to `importProvidersFrom`
    addProviderToBootstrapApplication('src/main.ts', 'MyModule', 'path/to/my/module', true),

    // Add module with parameters
    addProviderToBootstrapApplication(
      'src/main.ts',
      tags.stripIndent`
        provideRouter(appRoutes,
          withDebugTracing()
        )
      `,
      '@angular/router'
    )
  ]);
```

### `removeProviderFromBootstrapApplication`

Removes a provider (ex. provideRouter) from a bootstrapApplication's providers.

:::tip Tip
Use [#removeImportFromFile](/apis/file#removeimportfromfile) to also remove the import.
:::

```ts {6}
import { removeProviderFromBootstrapApplication, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeProviderFromBootstrapApplication('src/main.ts', 'provideRouter')
  ]);
```

## Helpers

### `getProjectOutputPath`

Gets a project output path as defined in the `angular.json` file.

```ts {6}
import { getProjectOutputPath, schematic } from '@hug/ngx-schematics-utilities';
import { Rule, Tree } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  (tree: Tree): Rule => {
    const projectOutputPath = getProjectOutputPath(tree, 'ProjectName');
    return schematic('my-schematic', [
      ...
    ]);
  };
```

### `getProjectMainFilePath`

Gets a project main file path as defined in the `angular.json` file.

```ts {6}
import { getProjectMainFilePath, schematic } from '@hug/ngx-schematics-utilities';
import { Rule, Tree } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  (tree: Tree): Rule => {
    const projectMainPath = getProjectMainFilePath(tree, 'ProjectName');
    return schematic('my-schematic', [
      ...
    ]);
  };
```

### `getProjectMainConfigFilePath`

Gets a standalone project main config file path.

```ts {6}
import { getProjectMainConfigFilePath, schematic } from '@hug/ngx-schematics-utilities';
import { Rule, Tree } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  (tree: Tree): Rule => {
    const projectMainPath = getProjectMainConfigFilePath(tree, 'ProjectName');
    return schematic('my-schematic', [
      ...
    ]);
  };
```

### `getProjectFromWorkspace`

Gets a project definition object from the current Angular workspace.

```ts {6}
import { getProjectFromWorkspace, schematic } from '@hug/ngx-schematics-utilities';
import { Rule, Tree } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  async (tree: Tree): Promise<Rule> => {
    const project = await getProjectFromWorkspace(tree, 'ProjectName');
    return schematic('my-schematic', [
      ...
    ]);
  };
```

### `isProjectStandalone`

Checks if a project if of type standalone.

```ts {6}
import { isProjectStandalone, schematic } from '@hug/ngx-schematics-utilities';
import { Rule, Tree } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  (tree: Tree): Rule => {
    const isStandalone = isProjectStandalone(tree, 'ProjectName');
    return schematic('my-schematic', [
      ...
    ]);
  };
```
