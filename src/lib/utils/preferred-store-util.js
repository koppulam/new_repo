import ApiUtils from 'lib/api';
import * as cookieUtil from 'lib/utils/cookies';
import * as objectPath from 'object-path';

import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import { triggerAnalyticsEvent } from './analytics-util';

/**
 * @param {Boolean} isCreateEnabled true if webcustomer id is to be created
 * @returns {object} promise event
 */
function getWebCustomerId(isCreateEnabled) {
    const WebCustomerId = cookieUtil.getCookies('mysid2');

    if (!WebCustomerId) {
        if (isCreateEnabled) {
            return new Promise((resolve, reject) => {
                const creatWebCustomerConfig = objectPath.get(window, 'tiffany.authoredContent.sessionConfig');

                ApiUtils.makeAjaxRequest(
                    creatWebCustomerConfig,
                    res => {
                        if (res.resultDto && res.resultDto.webCustomerId) {
                            cookieUtil.setCookie('mysid2', res.resultDto.webCustomerId, { encode: true, secure: true }, true);
                            resolve(res.resultDto.webCustomerId);
                        } else {
                            reject(res);
                        }
                    },
                    err => {
                        reject(err);
                        console.log(err);
                    }
                );
            });
        }
        return new Promise((resolve, reject) => {
            resolve(null);
        });
    }
    return new Promise((resolve, reject) => {
        resolve(WebCustomerId);
    });
}

/**
 * @param {string} MipsStoreNumber MipsStoreNumber
 * @returns {void}
 */
export function addPreferredStore(MipsStoreNumber) {
    return new Promise((resolve, reject) => {
        const setStoreConfig = objectPath.get(window, 'tiffany.authoredContent.preferredStoreConfig.setStoreConfig');
        let webCustomerId = cookieUtil.getCookies('mysid2') || '';

        objectPath.set(setStoreConfig, 'payload.webCustomerId', webCustomerId);
        objectPath.set(setStoreConfig, 'payload.MipsStoreNumber', MipsStoreNumber);

        ApiUtils.makeAjaxRequest(
            setStoreConfig,
            res => {
                triggerAnalyticsEvent(AnalyticsConstants.SET_PREFERRED_STORE, { storeID: MipsStoreNumber });
                if (res.resultDto && res.resultDto.preferredStoreAddStatus === 'Success') {
                    const prefferedStoreCookieName = objectPath.get(window, 'tiffany.authoredContent.preferredStoreConfig.cookieName', 'preferredStore');
                    webCustomerId = cookieUtil.getCookies('mysid2') || '';

                    cookieUtil.setCookie(prefferedStoreCookieName, JSON.stringify({ mips: MipsStoreNumber, webCustomerId}), { encode: true, secure: true }, true);
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            err => {
                reject(err);
            }
        );
    });
}


/**
 * @param {object} storeId storeId
 * @returns {object} promise event
 */
export function getPreferredStore() {
    return new Promise((resolve, reject) => {
        const webCustomerId = cookieUtil.getCookies('mysid2');

        if (webCustomerId) {
            const prefferedStoreCookieName = objectPath.get(window, 'tiffany.authoredContent.preferredStoreConfig.cookieName', 'preferredStore');
            const cookieRes = cookieUtil.getCookies(prefferedStoreCookieName, { encode: true });
            let prefferedStoreCookie;

            if (cookieRes) {
                prefferedStoreCookie = JSON.parse(cookieRes);
            }

            if (prefferedStoreCookie && prefferedStoreCookie.mips && prefferedStoreCookie.webCustomerId === webCustomerId) {
                resolve(prefferedStoreCookie.mips);
            } else {
                const getStoreConfig = objectPath.get(window, 'tiffany.authoredContent.preferredStoreConfig.getStoreConfig');

                objectPath.set(getStoreConfig, 'payload.webCustomerId', webCustomerId);

                ApiUtils.makeAjaxRequest(
                    getStoreConfig,
                    res => {
                        const prefNo = objectPath.get(res, 'resultDto.customerPreferredStoreNo');

                        if (prefNo) {
                            cookieUtil.setCookie(prefferedStoreCookieName, JSON.stringify({ mips: prefNo, webCustomerId }), { encode: true, secure: true });
                            resolve(prefNo);
                        } else {
                            reject(res);
                        }
                    },
                    err => {
                        reject(err);
                        console.log(err);
                    }
                );
            }
        } else {
            const errorMsg = 'no preffered store';

            reject(errorMsg);
        }
    });
}


/**
 * @param {object} storeId storeId
 * @returns {object} promise event
 */
export function checkPreferredStore(storeId) {
    return new Promise((resolve, reject) => {
        const webCustomerId = cookieUtil.getCookies('mysid2');

        if (webCustomerId) {
            return getPreferredStore().then((res) => {
                if (res === storeId) {
                    resolve(true);
                } else {
                    reject(res);
                }
            }, (err) => {
                reject(err);
            });
        } else {
            const errorMsg = 'no preffered store';

            reject(errorMsg);
        }
    });
}
