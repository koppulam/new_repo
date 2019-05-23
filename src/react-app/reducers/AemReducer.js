import initAemData from 'react-app/mock/aem';
import AEM_CONSTANTS from 'constants/AemConstants';
import * as objectPath from 'object-path';

initAemData();

const initialState = objectPath.get(window, 'tiffany.authoredContent', {});

if (initialState.dynamicMarketingContentConfig) {
    initialState.dynamicMarketingContentConfig.content.forEach(tile => {
        if (tile.tileConfig) {
            initialState[tile.key] = tile.tileConfig;
            const config = objectPath.get(tile, 'tileConfig.tileConfig', false);

            if (config) {
                initialState[tile.tileConfig.key] = config;
            }
        }
    });
}

/**
* @description Change all URLs in AEM data
* @param {object} object AEM object
* @returns {void};
*/
function changeURL(object) {
    Object.keys(object).forEach(key => {
        if (typeof object[key] === 'string' && (key === 'url' || key === 'richURL' || key === 'enabledStoresURL' || key === 'availabilitybystores')) {
            const urlKey = object[key];

            if (objectPath.get(window, `tiffany.apiUrl.${urlKey}`, false)) {
                object[key] = window.tiffany.apiUrl[object[key]];
            }
        } else if (object[key] && typeof object[key] === 'object') {
            return changeURL(object[key]);
        }
        return null;
    });
    return object;
}
window.tiffany.authoredContent = changeURL(objectPath.get(window, 'tiffany.authoredContent', {}));
window.tiffany.pdpConfig = changeURL(objectPath.get(window, 'tiffany.pdpConfig', {}));

/**
 * AEM Reducer.
 * @param {object} previousState previous state data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
export default function aemReducer(previousState = initialState, action) {
    switch (action) {
        case AEM_CONSTANTS.SET_SHOPPING_BAG_FLAG:
            return { ...previousState, isExternalShoppingPage: true };
        default:
            return previousState;
    }
}
