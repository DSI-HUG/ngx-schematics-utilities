# Development

This document describes how you can test, build and publish the library and schematics.

## Prerequisite

Before you can build and test this library you must install and configure the following products on your development machine:

* [Git][git]
* [Node.js][nodejs]

You will then need to install the required dependencies:

```sh
$ cd <library-path>
$ npm install -g @angular-devkit/schematics-cli
$ npm install
```

## Testing locally

The library and schematics can be tested on an Angular project while being developed.

The whole process is already automated for you so you can focus only on the development.

This includes:

* Ouputting the library and schematics to the `./dist` folder
* Creating a dummy Angular project in `./tmp`
* Symlinking the library with the dummy project
* Watching for library and/or schematics changes

**Testing**

1. Choose whether or not you want to use schematics in your library

   * Open `./build.js`
   * Enable/disable the option `USE_SCHEMATICS`

2. Start testing

   ```sh
   $ cd <library-path>
   $ npm start
   ```

3. Run and test the schematics against the demo Angular project

   ```sh
   $ cd ./tmp/demo-app
   $ ng add @hug/ngx-schematics-utilities
   ```

4. Run and test the library against the demo Angular project

   ```sh
   $ cd ./tmp/demo-app
   $ ng serve
   ```

**Tips** - ***you can use git to watch the effective changes made by the schematics:***

1. Run the schematics and check the changes

   ```sh
   $ ng add @hug/ngx-schematics-utilities
   $ git status
   ```

2. Reset changes

   ```sh
   $ git reset --hard && git clean -fd
   ```

3. Modify the library and/or the schematics and test them again

## Unit testing

Unit tests can be executed on the library itself or on the schematics.

```sh
$ npm run test:lib
$ npm run test:schematics
```

## Linting/verifying source code

Check that the code is properly formatted and adheres to coding style.

```sh
$ npm run lint
```

## Building the library

> The library will be built in the `./dist` directory.

> Schematics will be embedded within the library under `./dist/schematics`.

```sh
$ npm run build
```

## Publishing to NPM repository

This project comes with automatic continuous delivery (CD) using *GitHub Actions*.

1. Bump the library version in `./package.json`
2. Push the changes
3. Create a new: [GitHub release](https://github.com/DSI-HUG/ngx-schematics-utilities/releases/new)
4. Watch the results in: [Actions](https://github.com/DSI-HUG/ngx-schematics-utilities/actions)



[git]: https://git-scm.com/
[nodejs]: https://nodejs.org/
