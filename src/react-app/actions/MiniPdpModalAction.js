import CONSTANTS from 'constants/MiniPDPConstants';
import ApiUtils from 'lib/api';
import { changeURL } from 'lib/utils/replace-url';
import * as objectPath from 'object-path';

/**
 * @description open notify flyout
 * @param {Object} payload payload object
 * @param {Object} productId productId object
 * @param {Object} dispatch redux dispatch
 * @param {Object} getState redux getState
 * @returns {void}
 */
export const openMiniModalAction = (payload, productId) => (dispatch) => {
    ApiUtils.makeAjaxRequest(
        payload,
        res => {
            const fromatttedresponse = JSON.parse(JSON.stringify(res));

            if (fromatttedresponse && fromatttedresponse.productDetailsConfig) {
                const isGroup = objectPath.get(res, 'pdpConfig.isGroup', false);

                if (isGroup) {
                    fromatttedresponse.productDetailsConfig.url = fromatttedresponse.productDetailsConfig.groupUrl;
                }
                const resWithUrl = changeURL(fromatttedresponse);
                const selectedSku = objectPath.get(res, 'pdpConfig.selectedSku', '');
                const priceConfig = resWithUrl.productDetailsConfig;
                const updatedPriceConfig = {
                    url: priceConfig.url,
                    method: priceConfig.method,
                    payload: {
                        ...priceConfig.payload
                    }
                };

                if (isGroup) {
                    objectPath.set(updatedPriceConfig, 'payload.sku', objectPath.get(res, 'pdpConfig.sku', ''));
                } else {
                    objectPath.set(updatedPriceConfig, 'payload.sku', selectedSku);
                }

                ApiUtils.makeAjaxRequest(updatedPriceConfig, response => {
                    if (response && response.resultDto) {
                        resWithUrl.price = [];
                        resWithUrl.price.push(response.resultDto.price);
                    }
                    dispatch({
                        type: CONSTANTS.SET_MINI_PDP_DATA,
                        payload: {
                            res: resWithUrl,
                            productId
                        }
                    });
                });
            }
        },
        err => {
            // Error handling
        }
    );
};

/**
 * @description toggle PDP mini modal
 * @param {Object} productId productId object
 * @param {Boolean} open open object
 * @param {Object} dispatch redux dispatch
 * @returns {void}
 */
export const toggleMiniPdpAction = (productId, open) => (dispatch) => {
    dispatch({
        type: CONSTANTS.TOGGLE_MINI_PDP,
        payload: {
            productId,
            open
        }
    });
};
