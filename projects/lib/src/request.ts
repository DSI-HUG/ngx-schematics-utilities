import { JsonObject } from '@angular-devkit/core';
import { IncomingMessage } from 'http';
import { get } from 'https';

/**
 * Returns the response data of a given url as a buffer object.
 * @async
 * @param {string|URL} url The url where to get the data from.
 * @param {number} [retries=3] The number of times to retry the request in case of failure.
 * @param {number} [backoff=300] The delay (in milliseconds) between retries.
 * @returns {Promise<Buffer>} A `Buffer` object.
 */
export const getDataFromUrl = async (url: string | URL, retries = 3, backoff = 300): Promise<Buffer> =>
    new Promise((resolve, reject) => {
        const { hostname, pathname } = (typeof url === 'string') ? new URL(url) : url;
        // eslint-disable-next-line consistent-return
        const req = get({ hostname, path: pathname }, (res: IncomingMessage) => {
            if (res.statusCode === 200) {
                const rawData: Uint8Array[] = [];
                res.on('data', (chunk: Uint8Array) => rawData.push(chunk));
                res.once('end', () => {
                    res.removeAllListeners();
                    try {
                        resolve(Buffer.concat(rawData));
                    } catch (err) {
                        reject((err instanceof Error) ? err : new Error(String(err)));
                    }
                });
            } else if (retries > 0) {
                setTimeout(() => void getDataFromUrl(url, retries - 1, backoff * 2), backoff);
            } else {
                res.removeAllListeners();
                res.resume(); // consume response data to free up memory
                reject(new Error(`Request error (${String(res.statusCode)}): https://${hostname}${pathname}`));
            }
        });
        const abort = (error: Error | string): void => {
            if (retries > 0) {
                setTimeout(() => void getDataFromUrl(url, retries - 1, backoff * 2), backoff);
            } else {
                req.removeAllListeners();
                req.destroy();
                reject((error instanceof Error) ? error : new Error(String(error)));
            }
        };
        req.once('timeout', () => abort(`Request timed out: https://${hostname}/${pathname}`));
        req.once('error', err => abort(err));
    });

/**
 * Returns the response data of a given url as a JSON object.
 * @async
 * @param {string|URL} url The url where to get the data from.
 * @param {number} [retries=3] The number of times to retry the request in case of failure.
 * @param {number} [backoff=300] The delay (in milliseconds) between retries.
 * @returns {Promise<JsonObject>} A `JsonObject` object.
 */
export const getJsonFromUrl = async (url: string | URL, retries = 3, backoff = 300): Promise<JsonObject> => {
    const data = await getDataFromUrl(url, retries, backoff);
    return JSON.parse(data.toString('utf-8')) as JsonObject;
};
