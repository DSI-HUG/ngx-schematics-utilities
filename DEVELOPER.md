# Development

This document describes how you can test, build and publish the library.

## Prerequisite

Before you can build and test this library you must install and configure the following products on your development machine:

* [Git][git]
* [Node.js][nodejs]

You will then need to install the required dependencies:

```sh
cd <library-path>
npm install -g @angular-devkit/schematics-cli
npm install
```

## Unit testing

Unit tests can be executed with the following command:

```sh
npm run test
```

## Linting/verifying source code

Check that the code is properly formatted and adheres to coding style.

```sh
npm run lint
```

## Building the library

> The library will be built in the `./dist` directory.

```sh
npm run build:lib
```

## Building the documentation

> The document will be built in the `./projects/docs/build` directory.

```sh
npm run build:docs
```

## Publishing the documentation to GitHub Pages

This project comes with automatic continuous delivery (CD) using *GitHub Actions*.

1. Make any changes in the `./projects/docs` directory
2. Push the changes
3. Watch the results in: [Actions](https://github.com/DSI-HUG/ngx-schematics-utilities/actions)


## Publishing the library to NPM repository

This project comes with automatic continuous delivery (CD) using *GitHub Actions*.

1. Bump the library version in `./package.json`
2. Push the changes
3. Create a new: [GitHub release](https://github.com/DSI-HUG/ngx-schematics-utilities/releases/new)
4. Watch the results in: [Actions](https://github.com/DSI-HUG/ngx-schematics-utilities/actions)



[git]: https://git-scm.com/
[nodejs]: https://nodejs.org/
