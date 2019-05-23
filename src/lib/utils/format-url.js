export const replaceHttp = value => value.replace(/http:|https:/gi, '');

/**
 * @description Will append the correct protocol
 * @param {string} url The URl string
 * @returns {string} the formatted URL
 */
export function getUrlWithProtocol(url) {
    let u = url;

    if (u.indexOf('http:') !== -1) {
        // is http protocol
        u = u.replace('http:', window.location.protocol);
    } else if (u.indexOf('https:') !== -1) {
        // is https protocol
        u = u.replace('https:', window.location.protocol);
    } else {
        // no protocol
        u = window.location.protocol + u;
    }
    return u;
}