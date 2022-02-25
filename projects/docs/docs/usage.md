---
title: Usage
---

Each api rules can be used in a [**chainable**](#chainable-usage) or [**individual**](#individual-usage) way.

### Chainable usage

#### `Workspace`

Allow you to act at the *workspace* level.

```ts {6-10}
import { schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    workspace()
      .spawn('ng', ['add', '@angular/material', '--skip-confirmation'])
      .addPackageJsonDevDependencies(['eslint'])
      .packageInstallTask()
      .toRule()
  ], options);
```

#### `Application`

Allow you to act at a *project* level and make sure the specified project is an *application*.

:::tip
- `application()` will use the **defaultProject** specified in the **angular.json** file.
- `application(option.project)` can be used to specify a project from the command line.
- `__SRC__` will be interpolated with the project **sourceRoot** specified in the **angular.json** file.
:::

```ts {6-14}
import { application, ChainableProjectContext, createOrUpdateFile, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    application(options.project)
      .addImportToFile('__SRC__/main.ts', 'environment', './environments/environment')
      .rule(({ project }: ChainableProjectContext) => {
        return createOrUpdateFile(project.pathFromRoot('README.md'), project.name);
      })
      .isAngularVersion('<= 11', () => {
        ...
      })
      .toRule()
  ], options);
```

#### `Library`

Allow you to act at a *project* level and make sure the specified project is a *library*.

:::tip
- `library()` will use the **defaultProject** specified in the **angular.json** file.
- `library(option.project)` can be used to specify a project from the command line.
- `__SRC__` will be interpolated with the project **sourceRoot** specified in the **angular.json** file.
:::

```ts {6-8}
import { library, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    library(options.project)
      .downloadFile('https://my-cdn.com/icons/iconx.png', '__SRC__/assets/icons/icon.png')
      .toRule()
  ], options);
```

### Individual usage

:::caution Caution
When used this way all the paths will be relative to the root of the workspace.<br/>
You will have to make sure any modifications on a project are made in a generic way.
:::

```ts {7,9,11-13,15-16}
import { addImportToFile, addPackageJsonDevDependencies, getProjectFromWorkspace, modifyJsonFile, packageInstallTask, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default async (options: any): Rule => {
  const project = await getProjectFromWorkspace(options.project);
  return schematic('my-schematic', [
    modifyJsonFile('tsconfig.json', ['compilerOptions', 'strict'], true),

    addImportToFile(project.pathFromSourceRoot('main.ts'), 'environment', './environments/environment'),

    (): Rule => {
      ...
    },

    addPackageJsonDevDependencies(['eslint']),
    packageInstallTask()
  ], options);
}
```
