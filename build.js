/* eslint-disable array-element-newline */
const { existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } = require('fs');
const { resolve: pathResolve } = require('path');
const { exec } = require('child_process');
const { green, magenta } = require('colors/safe');
const cpy = require('cpy');

const DIST_PATH = './dist';
const LIB_ASSETS = [
    'README.md',
    'LICENSE',
    'package.json'
];

const log = str => console.log(magenta(str));

const execCmd = (cmd, opts) => new Promise((resolve, reject) => {
    exec(cmd, opts, (err, stdout, stderr) => {
        if (err) {
            console.error(stdout, stderr);
            return reject(err);
        }
        return resolve(stdout);
    });
});

const cleanDir = path => new Promise(resolve => {
    const exists = existsSync(path);
    if (exists) {
        rmSync(path, { recursive: true });
    }
    // Gives time to rmSync to unlock the file on Windows
    setTimeout(() => {
        mkdirSync(path, { recursive: true });
        resolve();
    }, exists ? 1000 : 0);
});

const copyAssets = () => cpy(
    LIB_ASSETS,
    DIST_PATH,
    {
        expandDirectories: true,
        parents: true
    }
);

const customizePackageJson = async () => {
    const pkgJsonPath = pathResolve(DIST_PATH, 'package.json');
    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, { encoding: 'utf8' }));
    delete pkgJson.scripts;
    delete pkgJson.devDependencies;
    writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 4), { encoding: 'utf8' });
};

const build = async () => {
    log('> Cleaning..');
    await cleanDir(DIST_PATH);

    log('> Building..');
    await execCmd('tsc -p tsconfig.json');

    log('> Copying assets..');
    await copyAssets();

    log('> Customizing package.json..');
    await customizePackageJson();

    log(`> ${green('Done!')}\n`);
};

(async () => {
    try {
        await build();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
