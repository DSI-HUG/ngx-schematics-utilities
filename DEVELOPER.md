# Development

This document describes how you can lint, test, build and publish this project.

## Prerequisite

Before you can start you must install and configure the following products on your development machine:

* [Node.js][nodejs]
* [Git][git]

You will then need to clone this project and install the required dependencies:

```sh
git clone <repository_url> <dir_name>
cd <dir_name>
npm install
```

## Linting/verifying source code

Check that the code is properly formatted and adheres to coding style.

```sh
npm run lint -w projects/lib
```

## Unit testing

Ensure that each unit of the library performs as expected.

```sh
npm run test -w projects/lib
```

## Testing locally

You can test the library while developing it, as follow:

```sh
npm run start -w projects/lib
```

And then:

```sh
npm run start -w projects/tests
```

## Building the library

The library will be built in the `./dist` directory.

```sh
npm run build -w projects/lib
```

## Publishing to NPM repository

This project comes with automatic continuous delivery (CD) using *GitHub Actions*.

1. Bump the library version in `./projects/lib/package.json`
2. Push the changes
3. Create a new [GitHub release](https://github.com/dsi-hug/ngx-schematics-utilities/releases/new)
4. Watch the results in: [Actions](https://github.com/dsi-hug/ngx-schematics-utilities/actions)

## Developing the documentation

```sh
npm run start --prefix=projects/docs
```

## Publishing the documentation to GitHub Pages

This project comes with automatic continuous delivery (CD) using *GitHub Actions*.

1. Make any changes under `./projects/docs/`
2. Push the changes
3. Watch the results in: [Actions](https://github.com/dsi-hug/ngx-schematics-utilities/actions)



[git]: https://git-scm.com/
[nodejs]: https://nodejs.org/
