<h1 align="center">
    @hug/ngx-schematics-utilities
</h1>

<p align="center">
    <br/>
    <a href="https://www.hug.ch">
        <img src="https://cdn.hug.ch/svgs/hug/hug-logo-horizontal.svg" alt="hug-logo" height="54px" />
    </a>
    <br/><br/>
    <i>Useful utilities for Angular Schematics</i>
    <br/><br/>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/@hug/ngx-schematics-utilities">
        <img src="https://img.shields.io/npm/v/@hug/ngx-schematics-utilities.svg?color=blue&logo=npm" alt="npm version" />
    </a>
    <a href="https://npmcharts.com/compare/@hug/ngx-schematics-utilities?minimal=true">
        <img src="https://img.shields.io/npm/dw/@hug/ngx-schematics-utilities.svg?color=blue&logo=npm" alt="npm donwloads" />
    </a>
    <a href="https://github.com/dsi-hug/ngx-schematics-utilities/blob/main/LICENSE">
        <img src="https://img.shields.io/badge/license-GPLv3-ff69b4.svg" alt="license GPLv3" />
    </a>
    <a href="https://dsi-hug.github.io/ngx-schematics-utilities">
        <img src="https://img.shields.io/badge/docs-site-blue" alt="docs-site" />
    </a>
</p>

<p align="center">
    <a href="https://github.com/dsi-hug/ngx-schematics-utilities/actions/workflows/ci_tests.yml">
        <img src="https://github.com/dsi-hug/ngx-schematics-utilities/actions/workflows/ci_tests.yml/badge.svg" alt="build status" />
    </a>
    <a href="https://github.com/dsi-hug/ngx-schematics-utilities/blob/main/CONTRIBUTING.md#-submitting-a-pull-request-pr">
        <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome" />
    </a>
</p>

<hr/>

#### Schematics

> Schematics are generators that transform an existing filesystem.<br />
> They can create files, refactor existing files, or move files around.

[More info][schematics]


## Getting started

This library provide a large set of utilities that can be used while developing a schematic for Angular.

👉 Learn about it on the [docs site][docs-site].

#### Example

```ts
export default (options: MySchematicOptions): Rule =>
  schematic('my-schematic', [
    modifyJsonFile('tsconfig.json', ['compilerOptions', 'strict'], true),

    workspace()
      .spawn('ng', ['add', '@angular/material', '--skip-confirmation'])
      .addPackageJsonDevDependencies(['eslint'])
      .packageInstallTask()
      .isAngularVersion('<= 11', () => {
        ...
      })
      .toRule(),

    application(options.project)
      .deployFiles(options)
      .addImportToFile('__SRC__/main.ts', 'environment', './environments/environment')
      .deleteFiles(['karma.conf.js'])
      .rule(({ project }: ChainableProjectContext) => {
        return createOrUpdateFile(project.pathFromRoot('README.md'), project.name);
      })
      .toRule()

  ], options);
```


## Development

See the [developer docs][developer].


## Contributing

#### > Want to Help?

Want to file a bug, contribute some code or improve documentation? Excellent!

But please read up first on the guidelines for [contributing][contributing], and learn about submission process, coding rules and more.

#### > Code of Conduct

Please read and follow the [Code of Conduct][codeofconduct], and help us keep this project open and inclusive.


## Credits

Copyright (C) 2023 [HUG - Hôpitaux Universitaires Genève][dsi-hug]

[![love@hug](https://img.shields.io/badge/@hug-%E2%9D%A4%EF%B8%8Flove-magenta)][dsi-hug]




[developer]: https://github.com/dsi-hug/ngx-schematics-utilities/blob/main/DEVELOPER.md
[contributing]: https://github.com/dsi-hug/ngx-schematics-utilities/blob/main/CONTRIBUTING.md
[codeofconduct]: https://github.com/dsi-hug/ngx-schematics-utilities/blob/main/CODE_OF_CONDUCT.md
[dsi-hug]: https://github.com/dsi-hug
[schematics]: https://angular.io/guide/schematics
[docs-site]: https://dsi-hug.github.io/ngx-schematics-utilities
