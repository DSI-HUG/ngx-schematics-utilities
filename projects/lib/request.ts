import { JsonObject } from '@angular-devkit/core';
import { IncomingMessage } from 'http';
import { get } from 'https';

/**
 * Returns the response data of a given url as a buffer object.
 * @async
 * @param {string|URL} url The url where to get the data from.
 * @returns {Promise<Buffer>} A `Buffer` object.
 */
export const getDataFromUrl = async (url: string | URL): Promise<Buffer> =>
    new Promise((resolve, reject) => {
        const { hostname, pathname } = (typeof url === 'string') ? new URL(url) : url;
        // eslint-disable-next-line consistent-return
        const req = get({ hostname, path: pathname }, (res: IncomingMessage) => {
            if (res.statusCode === 200) {
                const rawData: Uint8Array[] = [];
                res.on('data', (chunk: Uint8Array) => rawData.push(chunk));
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

/**
 * Returns the response data of a given url as a JSON object.
 * @async
 * @param {string|URL} url The url where to get the data from.
 * @returns {Promise<JsonObject>} A `JsonObject` object.
 */
export const getJsonFromUrl = async (url: string | URL): Promise<JsonObject> => {
    const data = await getDataFromUrl(url);
    return JSON.parse(data.toString('utf-8')) as JsonObject;
};
