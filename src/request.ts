import { JsonObject } from '@angular-devkit/core';
import { IncomingMessage } from 'http';
import { get } from 'https';

export const getDataFromUrl = async (url: string): Promise<Buffer> =>
    new Promise((resolve, reject) => {
        const { hostname, pathname } = new URL(url);
        // eslint-disable-next-line consistent-return
        const req = get({ hostname, path: pathname }, (res: IncomingMessage) => {
            if (res.statusCode === 200) {
                const rawData: Uint8Array[] = [];
                res.on('data', chunk => rawData.push(chunk));
                res.once('end', () => {
                    res.setTimeout(0);
                    res.removeAllListeners();
                    try {
                        return resolve(Buffer.concat(rawData));
                    } catch (err) {
                        return reject(err);
                    }
                });
            } else {
                res.removeAllListeners();
                res.resume(); // consume response data to free up memory
                return reject(`Request error (${String(res.statusCode)}): https://${hostname}/${pathname}`);
            }
        });
        const abort = (error: Error | string): void => {
            req.removeAllListeners();
            req.destroy();
            return reject(error);
        };
        req.once('timeout', () => abort(`Request timed out: https://${hostname}/${pathname}`));
        req.once('error', err => abort(err));
    });

export const getJsonFromUrl = async (url: string): Promise<JsonObject> => {
    const data = await getDataFromUrl(url);
    return JSON.parse(data.toString('utf-8')) as JsonObject;
};
