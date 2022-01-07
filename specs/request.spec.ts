import { getDataFromUrl, getJsonFromUrl } from '@hug/ngx-schematics-utilities';

describe('request', () => {
    it('helper: getDataFromUrl - existing url', async () => {
        const data = await getDataFromUrl('https://raw.githubusercontent.com/DSI-HUG/ngx-sentry/master/.eslintrc.json');
        const result = `{
            "root": true,
            "extends": [
                "@hug/eslint-config/moderate"
            ]
        }`;
        expect(data.toString().replace((/ {2}|\r\n|\n|\r/gm), '')).toEqual(result.replace((/ {2}|\r\n|\n|\r/gm), ''));
    });

    it('helper: getDataFromUrl - non existing url', async () => {
        const test$ = getDataFromUrl('non existing url');
        await expectAsync(test$).toBeRejected();
    });

    it('helper: getJsonFromUrl - existing url', async () => {
        const json = await getJsonFromUrl('https://cdn.jsdelivr.net/npm/@angular/core@latest/package.json');
        expect(json.name).toEqual('@angular/core');
    });

    it('helper: getJsonFromUrl - non existing url', async () => {
        const test$ = getJsonFromUrl('non existing url');
        await expectAsync(test$).toBeRejected();
    });
});
