---
title: Angular
---

## Rules

### `ensureIsAngularWorkspace`

Ensures that the workspace, where the schematic is currently running on, is actually an Angular workspace or throws an exception otherwise.

:::note Note
The test is done by ensuring the existence of an `angular.json` file.
:::

```ts {6,9}
import { ensureIsAngularWorkspace, schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    ensureIsAngularWorkspace(),

    // Using chainable (test is implicit)
    workspace()
      .toRule()
  ]);
```

### `ensureIsAngularApplication`

Ensures that a project is actually an Angular application or throws an exception otherwise.

```ts {6,9}
import { ensureIsAngularApplication, schematic, application } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    ensureIsAngularApplication('ProjectName'),

    // Using chainable (test is implicit)
    application(options.project)
      .toRule()
  ]);
```

### `ensureIsAngularLibrary`

Ensures that a project is actually an Angular library or throws an exception otherwise.

```ts {6,9}
import { ensureIsAngularLibrary, schematic, library } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    ensureIsAngularLibrary('ProjectName'),

    // Using chainable (test is implicit)
    library(options.project)
      .toRule()
  ]);
```

### `isAngularVersion`

Executes a rule only if the current Angular version installed in the project satisfies a given range.

```ts {6-8,12-14}
import { isAngularVersion, schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    isAngularVersion('<= 11', (): Rule => {
      ...
    }),

    // Using chainable
    workspace()
      .isAngularVersion('<= 11', (): Rule => {
        ...
      })
      .toRule()
  ]);
```

### `addAngularJsonAsset`

Adds a new asset to a project `build` and `test` sections of the `angular.json` file.

```ts {6,10}
import { addAngularJsonAsset, schematic, application } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addAngularJsonAsset('src/manifest.webmanifest', 'ProjectName'),

    // Using chainable
    application(options.project)
      .addAngularJsonAsset('__SRC__/manifest.webmanifest', 'ProjectName')
      .toRule()
  ]);
```

### `removeAngularJsonAsset`

Removes an asset from a project `build` and `test` sections of the `angular.json` file.

```ts {6,10}
import { removeAngularJsonAsset, schematic, application } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeAngularJsonAsset('src/manifest.webmanifest', 'ProjectName'),

    // Using chainable
    application(options.project)
      .removeAngularJsonAsset('__SRC__/manifest.webmanifest', 'ProjectName')
      .toRule()
  ]);
```

### `addAngularJsonStyle`

Adds a new style to a project `build` and `test` sections of the `angular.json` file.

```ts {6,10}
import { addAngularJsonStyle, schematic, application } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addAngularJsonStyle('src/assets/my-styles.css', 'ProjectName'),

    // Using chainable
    application(options.project)
      .addAngularJsonStyle('__SRC__/assets/my-styles.css', 'ProjectName')
      .toRule()
  ]);
```

### `removeAngularJsonStyle`

Removes a style from a project `build` and `test` sections of the `angular.json` file.

```ts {6,10}
import { removeAngularJsonStyle, schematic, application } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeAngularJsonStyle('src/assets/my-styles.css', 'ProjectName'),

    // Using chainable
    application(options.project)
      .removeAngularJsonStyle('__SRC__/assets/my-styles.css', 'ProjectName')
      .toRule()
  ]);
```

### `addAngularJsonScript`

Adds a new script to a project `build` and `test` sections of the `angular.json` file.

```ts {6,10}
import { addAngularJsonScript, schematic, application } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addAngularJsonScript('src/my-script.js', 'ProjectName'),

    // Using chainable
    application(options.project)
      .addAngularJsonScript('__SRC__/my-script.js', 'ProjectName')
      .toRule()
  ]);
```

### `removeAngularJsonScript`

Removes a script from a project `build` and `test` sections of the `angular.json` file.

```ts {6,10}
import { removeAngularJsonScript, schematic, application } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeAngularJsonScript('src/my-script.js', 'ProjectName'),

    // Using chainable
    application(options.project)
      .removeAngularJsonScript('__SRC__/my-script.js', 'ProjectName')
      .toRule()
  ]);
```

### `addDeclarationToNgModule`

Inserts a declaration (ex. Component, Pipe, Directive) into an NgModule declarations and also imports that declaration.

```ts {6,10}
import { addDeclarationToNgModule, schematic, application } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addDeclarationToNgModule('src/app/app.module.ts', 'TestComponent', './components/test'),

    // Using chainable
    application(options.project)
      .addDeclarationToNgModule('__SRC__/app/app.module.ts', 'TestComponent', './components/test')
      .toRule()
  ]);
```

### `removeDeclarationFromNgModule`

Removes a declaration (ex. Component, Pipe, Directive) from an NgModule declarations.

:::tip Tip
Use [#removeImportFromFile](/apis/file#removeimportfromfile) to also remove the import.
:::

```ts {6,10}
import { removeDeclarationFromNgModule, schematic, application } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeDeclarationFromNgModule('src/app/app.module.ts', 'AppComponent'),

    // Using chainable
    application(options.project)
      .removeDeclarationFromNgModule('__SRC__/app/app.module.ts', 'AppComponent')
      .toRule()
  ]);
```

### `addImportToNgModule`

Inserts an import (ex. NgModule) into an NgModule imports and also imports that import.

```ts {8,11-19,23}
import { addImportToNgModule, schematic, application } from '@hug/ngx-schematics-utilities';
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
    ),

    // Using chainable
    application(options.project)
      .addImportToNgModule('__SRC__/app/app.module.ts', 'HttpClientModule', '@angular/common/http')
      .toRule()
  ]);
```

### `removeImportFromNgModule`

Removes an import (ex. NgModule) from an NgModule imports.

:::tip Tip
Use [#removeImportFromFile](/apis/file#removeimportfromfile) to also remove the import.
:::

```ts {6,10}
import { removeImportFromNgModule, schematic, application } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeImportFromNgModule('src/app/app.module.ts', 'TestModule'),

    // Using chainable
    application(options.project)
      .removeImportFromNgModule('__SRC__/app/app.module.ts', 'TestModule')
      .toRule()
  ]);
```

### `addExportToNgModule`

Inserts an export (ex. Component, Pipe, Directive) into an NgModule exports and also imports that export.

```ts {6,10}
import { addExportToNgModule, schematic, application } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addExportToNgModule('src/app/app.module.ts', 'TestComponent', './components/test'),

    // Using chainable
    application(options.project)
      .addExportToNgModule('__SRC__/app/app.module.ts', 'TestComponent', './components/test')
      .toRule()
  ]);
```

### `removeExportFromNgModule`

Removes an export (ex. Component, Pipe, Directive) from an NgModule exports.

:::tip Tip
Use [#removeImportFromFile](/apis/file#removeimportfromfile) to also remove the import.
:::

```ts {6,10}
import { removeExportFromNgModule, schematic, application } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeExportFromNgModule('src/app/app.module.ts', 'TestComponent'),

    // Using chainable
    application(options.project)
      .removeExportFromNgModule('__SRC__/app/app.module.ts', 'TestComponent')
      .toRule()
  ]);
```

### `addProviderToNgModule`

Inserts a provider (ex. Service) into an NgModule providers and also imports that provider.

```ts {6,10}
import { addExportToNgModule, schematic, application } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addProviderToNgModule('src/app/app.module.ts', 'TestService', './services/test'),

    // Using chainable
    application(options.project)
      .addProviderToNgModule('__SRC__/app/app.module.ts', 'TestService', './services/test')
      .toRule()
  ]);
```

### `removeProviderFromNgModule`

Removes a provider (ex. Service) from an NgModule providers.

:::tip Tip
Use [#removeImportFromFile](/apis/file#removeimportfromfile) to also remove the import.
:::

```ts {6,10}
import { removeProviderFromNgModule, schematic, application } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeProviderFromNgModule('src/app/app.module.ts', 'TestService'),

    // Using chainable
    application(options.project)
      .removeProviderFromNgModule('__SRC__/app/app.module.ts', 'TestService')
      .toRule()
  ]);
```

### `addRouteDeclarationToNgModule`

Inserts a route declaration to a router module (i.e. as a RouterModule declaration).

```ts {10,14,18}
import { addRouteDeclarationToNgModule, addImportToFile, schematic, application } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule => {
  const componentRoute = "{ path: 'home', component: HomeComponent }";
  const lazyRoute = "{ path: 'user', loadChildren: '() => import('./pages/user/user.module').then(m => m.UserModule)'; }";

  return schematic('my-schematic', [
    // Add component route
    addRouteDeclarationToNgModule('src/app/app-routing.module.ts', componentRoute),
    addImportToFile('src/app/app-routing.module.ts', 'HomeComponent', './pages/home/home.component'),

    // Add lazy route
    addRouteDeclarationToNgModule('src/app/app-routing.module.ts', lazyRoute),

    // Using chainable
    application(options.project)
      .addRouteDeclarationToNgModule('__SRC__/app/app-routing.module.ts', componentRoute)
      .toRule()
  ]);
}
```

## Rules (standalone)

:::note Note
The following rules are only working with standalone projects.
:::

### `addProviderToBootstrapApplication`

Inserts a provider (ex. provideRouter) into a bootstrapApplication's providers and also imports that provider.

```ts {8,11,14-22,26}
import { addProviderToBootstrapApplication, schematic, application } from '@hug/ngx-schematics-utilities';
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
    ),

    // Using chainable
    application(options.project)
      .addProviderToBootstrapApplication('__MAIN__', 'provideAnimations()', '@angular/platform-browser/animations')
      .toRule()
  ]);
```

### `removeProviderFromBootstrapApplication`

Removes a provider (ex. provideRouter) from a bootstrapApplication's providers.

:::tip Tip
Use [#removeImportFromFile](/apis/file#removeimportfromfile) to also remove the import.
:::

```ts {6,10}
import { removeProviderFromBootstrapApplication, schematic, application } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removeProviderFromBootstrapApplication('src/main.ts', 'provideRouter'),

    // Using chainable
    application(options.project)
      .removeProviderFromBootstrapApplication('__MAIN__', 'provideRouter')
      .toRule()
  ]);
```

## Helpers

### `getAngularVersion`

Gets the version of Angular currently used in the project.

```ts {6}
import { getAngularVersion, schematic } from '@hug/ngx-schematics-utilities';
import { Rule, Tree } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  async (tree: Tree): Promise<Rule> => {
    const ngVersion = await getAngularVersion();
    return schematic('my-schematic', [
      ...
    ]);
  };
```

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

## Helpers (standalone)

:::note Note
The following helpers are only working with standalone projects.
:::

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
