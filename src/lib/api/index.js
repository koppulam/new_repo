import es6Promise from 'es6-promise';
import * as objectPath from 'object-path';
import queryString from 'query-string';
import { findFirst } from 'lib/dom/dom-util';
import 'whatwg-fetch';

es6Promise.polyfill();

// removed for EDGE broser compatability
// if (window && window.navigator && (/Edge\//).test(navigator.userAgent)) {
//     window.fetch = undefined; // ensure the polyfill runs
// }

// import fetch from 'isomorphic-fetch';

/**
 * @class APIUTIL
 */
export default class ApiUtils {
    /**
     * @returns {void}
     */
    static handleUnAuthorizedUser() {
        // sessionStorage.removeItem('jwt');
        // window.location.href = `/${APP_PUBLIC_PATH}/signIn`;
    }

    /**
     * @description Error handler for api calls
     * @param {*} response response object
     * @param {*} text response text
     * @returns {Promise} Returns a promise
     */
    static handleErrors(response, text) {
        return new Promise((resolve, reject) => {
            text.then(val => {
                switch (response.status) {
                    case 401:
                        this.handleUnAuthorizedUser();
                        reject({ message: 'Error Occured!', val });
                        break;
                    case 400:
                        reject(val);
                        break;
                    case 404:
                    case 504:
                    case 500:
                        reject({ message: 'Error Occured!', val });
                        break;
                    default:
                        break;
                }
                resolve(val);
            });
        });
    }

    /* eslint-disable lines-between-class-members */
    /**
     * @description Common utility function to send ajax requests
     * @param {object} options options
     * @param {function} onSuccess onSuccess callback
     * @param {function} onFail onFail callback
     * @param {any} signal signal controller
     * @returns {object} Fetch
     */
    static makeAjaxRequest(options, onSuccess, onFail, signal) {
        /* eslint-disable no-param-reassign */

        // if (options.url.charAt(0) !== '/') {
        //     // https://webmasters.stackexchange.com/questions/56840/what-is-the-purpose-of-leading-slash-in-html-urls
        //     options.url = `/${options.url}`;
        // }

        if (options.queryParams) {
            const queryParamsString = queryString.stringify(options.queryParams, {
                encode: false
            });

            options.url = `${options.url}?${queryParamsString}`;
        }

        const clientId = objectPath.get(window, 'tiffany.authoredContent.requestAuthHeaders.clientkey', '');
        const secret = objectPath.get(window, 'tiffany.authoredContent.requestAuthHeaders.secretkey', '');
        const mimeType = options.type === 'html' ? ' text/html' : 'application/json';
        const headersWithoutClientId = new Headers({
            Accept: mimeType,
            'Content-Type': mimeType
        });
        const headersWithClientId = new Headers({
            Accept: mimeType,
            'Content-Type': mimeType,
            'X-IBM-Client-Id': clientId ? window.atob(clientId) : clientId,
            'X-IBM-Client-Secret': secret ? window.atob(secret) : secret
            // Authorization: sessionStorage.getItem('jwt') || 'NoTokenFound'
        });
        const reqOptions = {
            method: options.method || 'GET',
            // credentials: 'include', // Send back JSESSION-ID to server
            headers: options.noClientHeaders ? headersWithoutClientId : headersWithClientId,
            body: JSON.stringify(options.payload),
            signal
        };

        if (options.method === 'GET') delete reqOptions.body;
        const request = new Request(options.url, reqOptions);

        return fetch(request)
            .then(resp => {
                return this.handleErrors(resp, resp.text ? resp.text() : new Promise(resolve => { resolve(''); })());
            })
            .then(textResponse => {
                try {
                    const jsonResponse = JSON.parse(textResponse);

                    return new Promise((resolve, reject) => {
                        resolve(jsonResponse);
                    });
                } catch (error) {
                    return new Promise((resolve, reject) => {
                        resolve(textResponse || {});
                    });
                }
            })
            .then(formattedResponse => {
                if (typeof onSuccess === 'function') {
                    onSuccess(formattedResponse);
                }
                return formattedResponse;
            })
            .catch(err => {
                if (err instanceof Error) {
                    if (err.message === 'COOKIE_RESET' && options.url !== window.tiffany.apiUrl.dropHintUrl) {
                        this.makeAjaxRequest(options, onSuccess, onFail, signal);
                    } else if (err.message === 'COOKIE_RESET' && options.url === window.tiffany.apiUrl.dropHintUrl) {
                        // for DAH
                        onFail(err);
                        findFirst('.drop-a-hint__right-wrapper_submit').click();
                    }
                }
                if (typeof err === 'string') {
                    err = JSON.parse(err);
                }
                if (typeof onFail === 'function' && !(err instanceof Error)) {
                    onFail(err);
                }
                return err;
            });
    }
}
