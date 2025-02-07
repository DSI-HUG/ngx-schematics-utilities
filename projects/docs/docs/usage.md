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

```ts {6-14}
import { schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    workspace()
      .spawn('ng', ['add', '@angular/material', '--skip-confirmation'])
      .addPackageJsonDevDependencies(['eslint'])
      .packageInstallTask()
      .logInfo('Doing some cool stuff')
      .isAngularVersion('<= 11', (): Rule => {
        ...
      })
      .toRule(),
  ], options);
```

#### `Application`

Allow you to act at a *project* level and make sure the specified project is an *application*.

:::tip
`__SRC__` will be interpolated with **sourceRoot** specified in the project's **angular.json** file.<br/>
`__OUTPUT__` will be interpolated with **outputPath** specified in the project's **angular.json** file.<br/>
`__ASSETS__` will be interpolated with **assetsPath** *(if found, either /public or /src/assets)*.<br/>
`__MAIN__` will be interpolated with **browser** or **main** specified in the project's **angular.json** file.<br/>
`__CONFIG__` will be interpolated with the project's **config** file path *(for standalone only)*.
:::

```ts {6-14}
import { application, ChainableApplicationContext, createOrUpdateFile, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    application(options.project)
      .deployFiles(options)
      .addProviderToBootstrapApplication('__MAIN__', 'provideAnimations()', '@angular/platform-browser/animations'),
      .addImportToFile('__SRC__/file.ts', 'environment', './environments/environment')
      .deleteFiles(['karma.conf.js'])
      .rule(({ project }: ChainableApplicationContext) => {
        return createOrUpdateFile(project.pathFromRoot('README.md'), project.name);
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
      .downloadFile('https://my-cdn.com/icons/icon.png', '__SRC__/assets/icons/icon.png')
      .toRule()
  ], options);
```

### Individual usage

:::caution Caution
When used this way all the paths will be relative to the root of the workspace.<br/>
You will have to make sure any modifications on a project are made in a generic way.<br/>
To help you with that, the [getProjectFromWorkspace()](/apis/angular#getprojectfromworkspace) helper is a good start.
:::

```ts {6,8,10,12-16,18-19}
import { addImportToFile, addPackageJsonDevDependencies, getProjectFromWorkspace, modifyJsonFile, packageInstallTask, schematic, rule, renameFile } from '@hug/ngx-schematics-utilities';
import { Rule, Tree, chain, noop } from '@angular-devkit/schematics';

export default async (options: any): Rule => {
  async (tree: Tree): Promise<Rule> => {
    const project = await getProjectFromWorkspace(tree, options.project);
    return schematic('my-schematic', [
      modifyJsonFile('tsconfig.json', ['compilerOptions', 'strict'], true),

      addImportToFile(project.pathFromSourceRoot('main.ts'), 'environment', './environments/environment'),

      rule((tree, context): Rule => {
        ... return renameFile('old-file', 'new-file');
        ... return chain([]);
        ... return noop();
      }),

      addPackageJsonDevDependencies(['eslint']),
      packageInstallTask()
    ], options);
  }
}
```
