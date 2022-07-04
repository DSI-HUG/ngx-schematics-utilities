---
title: Usage
---

Each api rules can be used in a [**chainable**](#chainable-usage) or [**individual**](#individual-usage) way.

:::tip
Currently, `ng add` does not provide a way to choose which project you want a schematic to be used on.<br/>
To provide such an option you will have to declare the following `project` property, inside your `schema.json` file:
```json
"project": {
  "type": "string",
  "description": "The name of the project.",
  "$default": {
    "$source": "projectName"
  }
}
```
Users will then be able to provide a `project` along your schematic installation:<br/>
*(and if they do not, the default provider will populate the project option based on the inferred project from the cwd)*
```sh
ng add YourSchematic --project ProjectName
```
:::

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
`__SRC__` will be interpolated with the project **sourceRoot** specified in the **angular.json** file.
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
`__SRC__` will be interpolated with the project **sourceRoot** specified in the **angular.json** file.
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
You will have to make sure any modifications on a project are made in a generic way.<br/>
To help you with that, the [getProjectFromWorkspace()](/apis/angular#getprojectfromworkspace) helper is a good start.
:::

```ts {6,8,10,12-14,16-17}
import { addImportToFile, addPackageJsonDevDependencies, getProjectFromWorkspace, modifyJsonFile, packageInstallTask, schematic } from '@hug/ngx-schematics-utilities';
import { Rule, Tree } from '@angular-devkit/schematics';

export default async (options: any): Rule => {
  async (tree: Tree): Promise<Rule> => {
    const project = await getProjectFromWorkspace(tree, options.project);
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
}
```
