
/**
* @description Change all URLs in AEM data
* @param {object} object AEM object
* @returns {void};
*/
export const changeURL = (object) => {
    Object.keys(object).map(key => {
        if (typeof object[key] === 'string' &&
            (
                key === 'url' ||
                key === 'richURL' ||
                key === 'enabledStoresURL' ||
                key === 'availabilitybystores' ||
                key === 'secretkey' ||
                key === 'clientkey'
            )
        ) {
            if (window.tiffany.apiUrl[object[key]]) {
                object[key] = window.tiffany.apiUrl[object[key]];
            }
        } else if (object[key] && typeof object[key] === 'object') {
            return changeURL(object[key]);
        }
        return null;
    });
    return object;
}