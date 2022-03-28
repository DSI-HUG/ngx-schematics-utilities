/* eslint-disable array-element-newline */

import colors from '@colors/colors/safe.js';
import { exec } from 'child_process';
import cpy from 'cpy';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { resolve as pathResolve } from 'path';

const { green, magenta } = colors;
const DIST_PATH = './dist';

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

const copyAssets = async () => {
    await cpy('README.md', DIST_PATH, { flat: true });
    await cpy('LICENSE', DIST_PATH, { flat: true });
    await cpy('package.json', DIST_PATH, { flat: true });
};

const customizePackageJson = async () => {
    const pkgJsonPath = pathResolve(DIST_PATH, 'package.json');
    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, { encoding: 'utf8' }));
    Object.keys(pkgJson.scripts).forEach(key => {
        if (key !== 'postinstall') {
            delete pkgJson.scripts[key];
        }
    });
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
