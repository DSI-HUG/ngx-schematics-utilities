<h1 align="center">
    @hug/ngx-schematics-utilities
</h1>

<!-- edit:
<p align="center">
    <br>
    <a href="https://www.hug.ch/">
        <img src="https://www.hug.ch/sites/all/themes/interhug/img/logos/logo-hug.svg" alt="hug-logo" height="54px" />
    </a>
    <br><br>
    <i>Description of the library</i>
    <br><br>
</p>
-->

<p align="center">
    <a href="https://www.npmjs.com/package/@hug/ngx-schematics-utilities">
        <img src="https://img.shields.io/npm/v/@hug/ngx-schematics-utilities.svg?color=blue&logo=npm" alt="npm version" />
    </a>
    <a href="https://npmcharts.com/compare/@hug/ngx-schematics-utilities?minimal=true">
        <img src="https://img.shields.io/npm/dw/@hug/ngx-schematics-utilities.svg?color=blue&logo=npm" alt="npm donwloads" />
    </a>
    <a href="https://github.com/DSI-HUG/ngx-schematics-utilities/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/license-GPLv3-ff69b4.svg" alt="license GPLv3" />
    </a>
</p>

<p align="center">
    <a href="https://github.com/DSI-HUG/ngx-schematics-utilities/actions?query=workflow:CI%20tests">
        <img src="https://github.com/DSI-HUG/ngx-schematics-utilities/workflows/CI%20tests/badge.svg" alt="build status" />
    </a>
    <a href="https://david-dm.org/DSI-HUG/ngx-schematics-utilities">
        <img src="https://img.shields.io/david/DSI-HUG/ngx-schematics-utilities.svg" alt="dependency status" />
    </a>
    <a href="https://david-dm.org/DSI-HUG/ngx-schematics-utilities?type=peer">
        <img src="https://img.shields.io/david/peer/DSI-HUG/ngx-schematics-utilities.svg" alt="peerDependency status" />
    </a>
    <a href="https://github.com/DSI-HUG/ngx-schematics-utilities/blob/master/CONTRIBUTING.md#-submitting-a-pull-request-pr">
        <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome" />
    </a>
</p>

<hr>

## Installation

Schematics are generators that transform an existing filesystem. It can create files, refactor existing files, or move files around.

This library has helpers and conventions for making tools that uses the Schematics as backend to run generators.


To set up an Angular project with this library use the Angular CLI's installation [schematic][schematics]:

```sh
$ ng add @hug/ngx-schematics-utilities
```

<!-- edit:
The `ng add` command will install the library and ask the following questions to determine which features to include:

1. lorem ipsum
2. lorem ipsum

The `ng add` command will additionally perform the following configurations:

* lorem ipsum
* lorem ipsum
-->


## Usage

<!-- edit: -->

# Rules
- ensureIsAngularProject
- isAngularVersion
- addAngularJsonAssets
- addDeclarationToNgModule
- addImportToNgModule
- addExportToNgModule
- addProviderToNgModule
- addRouteDeclarationToNgModule
- downloadFile
- deployFiles
- deleteFiles
- replaceInFile
- removeInJson
- modifyJson
- createOrUpdateFile
- addImportToFile
- updateImportInFile
- removePackageJsonDependencies
- removePackageJsonDevDependencies
- removePackageJsonPeerDependencies
- addPackageJsonDependencies
- addPackageJsonDevDependencies
- addPackageJsonPeerDependencies
- packageInstallTask
- log
- info
- warn
- action
- schematic
- spawn

# Helpers
- getDefaultProjectName
- getDefaultProjectOutputPath
- serializeToJson
- getTsSourceFile
- commitChanges
- removeSymbolFromNgModuleMetadata
- getJsonFromUrl
- getDataFromUrl
- getSchematicSchemaOptions

## Development

See the [developer docs][developer].


## Contributing

#### Want to Help?

Want to file a bug, contribute some code or improve documentation? Excellent!

But please read up first on the guidelines for [contributing][contributing], and learn about submission process, coding rules and more.

#### Code of Conduct

Please read and follow the [Code of Conduct][codeofconduct], and help us keep this project open and inclusive.


## Credits

This library was made with [@hug/ngx-lib-and-schematics-starter][starter].

[![love@hug](https://img.shields.io/badge/@hug-%E2%9D%A4%EF%B8%8Flove-magenta)][dsi-hug]




[schematics]: https://angular.io/guide/schematics-for-libraries
[developer]: https://github.com/DSI-HUG/ngx-schematics-utilities/blob/master/DEVELOPER.md
[contributing]: https://github.com/DSI-HUG/ngx-schematics-utilities/blob/master/CONTRIBUTING.md
[codeofconduct]: https://github.com/DSI-HUG/ngx-schematics-utilities/blob/master/CODE_OF_CONDUCT.md
[starter]: https://github.com/DSI-HUG/ngx-lib-and-schematics-starter
[dsi-hug]: https://github.com/DSI-HUG
