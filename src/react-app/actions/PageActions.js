// import * as cookieUtil from 'lib/utils/cookies';
import * as objectPath from 'object-path';
import { getWishlist, resetWishlistInitialize } from 'actions/WishlistActions';
import setShoppingBagPage from 'actions/AemActions';

import SC from 'constants/StoresConstants';
import { getSiteEngravings, getProductEngravings } from 'actions/EngravingActions';
import { getProductDetails } from 'actions/ProductDetailsActions';
import getFullStores from 'actions/StoresActions';
import { createWebCustomerId } from 'services';
import { triggerAnalyticsEvent } from 'lib/utils/analytics-util';

import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import * as cookieUtil from 'lib/utils/cookies';

import {
    fetchShoppingBag,
    fetchShoppingBagCount,
    fetchWishlist,
    fetchAccountDetails,
    fetchCustomDesignWishlist
} from 'actions/FlyoutActions';

/**
 * @description Set session id
 * @param {Function} dispatch redux dispatch
 * @returns {void}
 */
export function setSession() {
    const sessionRequest = objectPath.get(window, 'tiffany.authoredContent.sessionConfig');

    return createWebCustomerId(sessionRequest);
}

/**
 * @description Do all page level actions here
 * @param {Function} dispatch redux dispatch
 * @param {Function} getState redux getState
 * @returns {void}
 */
const triggerPageActions = () => (dispatch, getState) => {
    const currentState = getState();
    const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');
    const webCustomerId = cookieUtil.getCookies(cookieName);

    if (webCustomerId) {
        cookieUtil.checkCustomerCookieValidity();
    }

    // Fetch site engravings if the page is either PDP or BYO
    if (objectPath.get(currentState, 'aem.isEngravingExposed', false) || objectPath.get(currentState, 'productDetails.pdpConfig.isServiceable', false) || objectPath.get(currentState, 'aem.byoConfig', false)) {
        dispatch(getSiteEngravings());
        // dispatch getProductEngravings only for PDP page
        if (objectPath.get(currentState, 'productDetails.pdpConfig.isServiceable', false)) {
            const groupSku = objectPath.get(currentState, 'productDetails.pdpConfig.sku', '');
            const isGroup = objectPath.get(currentState, 'productDetails.pdpConfig.isGroup', false);
            const sku = objectPath.get(currentState, `productDetails.pdpConfig.${isGroup ? 'groupDefaultItemSku' : 'selectedSku'}`, '');

            dispatch(getProductEngravings(groupSku, sku, false));
        }
    }

    if (objectPath.get(window, 'tiffany.pdpConfig.isPdpPage', false)) {
        const priceConfig = objectPath.get(window.tiffany, 'authoredContent.productDetailsConfig');

        if (priceConfig) {
            const selectedSku = objectPath.get(window.tiffany, 'pdpConfig.selectedSku', '');
            const isGroup = objectPath.get(currentState, 'productDetails.pdpConfig.isGroup', false);
            const hasSelectedSku = objectPath.get(currentState, 'productDetails.pdpConfig.hasSelectedSku', false);
            const updatedPriceConfig = {
                method: priceConfig.method,
                payload: {
                    ...priceConfig.payload
                }
            };

            if (isGroup) {
                if (hasSelectedSku) {
                    objectPath.set(updatedPriceConfig, 'payload.selectedSku', objectPath.get(window.tiffany, 'pdpConfig.selectedSku', ''));
                }
                objectPath.set(updatedPriceConfig, 'payload.sku', objectPath.get(window.tiffany, 'pdpConfig.sku', ''));
                objectPath.set(updatedPriceConfig, 'url', objectPath.get(window.tiffany, `apiUrl.${priceConfig.groupUrl}`, ''));
            } else {
                objectPath.set(updatedPriceConfig, 'payload.sku', selectedSku);
                objectPath.set(updatedPriceConfig, 'url', priceConfig.url);
            }
            dispatch(getProductDetails(updatedPriceConfig));
        } else {
            triggerAnalyticsEvent(AnalyticsConstants.PAGE_LOADED, {});
        }
    }
    if (objectPath.get(window, 'tiffany.authoredContent.storesConfig.isStoresPage', false)) {
        dispatch(getFullStores({
            action: {
                type: SC.STORES_FETCHED
            }
        }));
    }

    const wishListCountCookie = objectPath.get(window, 'tiffany.authoredContent.wishlistCookieName', 'saveditemscnt');
    const wishListCount = cookieUtil.getCookies(wishListCountCookie);

    const shoppingBagCountCookie = objectPath.get(window, 'tiffany.authoredContent.bagCookieName', 'shoppingbagcnt');
    const shoppingBagCount = cookieUtil.getCookies(shoppingBagCountCookie);

    if (!wishListCount && webCustomerId) {
        dispatch(resetWishlistInitialize());
        dispatch(getWishlist());
    }
    if (!shoppingBagCount && webCustomerId) {
        dispatch(resetWishlistInitialize());
        dispatch(fetchShoppingBagCount());
    }
    if (webCustomerId) {
        dispatch(fetchAccountDetails());
    }
};

export const registerActionListeners = () => (dispatch, getState) => {
    window.addEventListener('refreshLists', () => {
        dispatch(setShoppingBagPage());
        dispatch(getWishlist());
        dispatch(fetchShoppingBag());
    });
    window.addEventListener('refreshShoppingBag', () => {
        dispatch(fetchShoppingBag());
    });
    window.addEventListener('refreshWishlist', () => {
        dispatch(fetchWishlist());
        dispatch(fetchCustomDesignWishlist());
    });
    window.addEventListener('refreshPrefferedStoreList', () => {
        dispatch(fetchAccountDetails());
    });
};

export const createCustomerId = (dispatch) => {
    setSession(dispatch);
};

export default triggerPageActions;
