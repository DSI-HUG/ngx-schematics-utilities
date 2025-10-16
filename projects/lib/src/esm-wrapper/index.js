/**
 * As of 2025:
 *  - Angular schematics are still required to be written in CommonJS.
 *  - Packages "@angular/core" and "ora" are now ESM-only.
 *  - Node <= 22 do not handle mixing ESM and CJS well.
 *
 * Example: importing ESM from CJS usually throw the following error:
 *  - "require() of ES Module xxx.mjs not supported. Instead change the require of xxx.mjs to a dynamic import() which is available in all CommonJS modules."
 *
 * But in this case using dynamic imports is not working because:
 *  - TSC is always rewriting dynamic imports to require imports (unless `tsconfig.json` is set to "module": "ESNext" but we wan't to avoid that because schenatics are still CJS).
 *
 * So the trick to support Node <= 22 is to use a wrapper file and import the ESM modules from there:
 *  - Using JS instead of MJS will make Node actually import the file (instead of throwing the ES Module error).
 *  - Using a separate file will make TSC not rewrite the import to require.
 */

const getAngularVersionFromEsm = async () => (await import('@angular/core')).VERSION;
const getOraFromEsm = async options => (await import('ora')).default(options);

module.exports = {
    getAngularVersionFromEsm,
    getOraFromEsm
};
