import * as cookieUtil from 'lib/utils/cookies';
import ApiUtils from 'lib/api';
import * as objectPath from 'object-path';
import {
    setInitialWishlistAnalytics,
    addWishlistAnalytics
} from 'lib/utils/analytics-util';
import WC from 'constants/WishlistConstants';
import FC from 'constants/FlyoutConstants';

export const wishlistProcessFetch = (webCustomerId) => {
    const wishlistRequest = objectPath.get(window, 'tiffany.authoredContent.wishlistConfig.get');

    return new Promise((resolve, reject) => {
        wishlistRequest.isWishListCall = true;
        if (wishlistRequest) {
            objectPath.set(wishlistRequest, 'payload.webCustomerId', webCustomerId || '');
            try {
                ApiUtils.makeAjaxRequest(
                    wishlistRequest,
                    res => {
                        resolve(res);
                        setInitialWishlistAnalytics(res.resultDto);
                    },
                    err => {
                        resolve({});
                    }
                );
            } catch (error) {
                resolve({});
            }
        }
    });
};

export const customWishlistProcessFetch = (webCustomerId, isRemove) => {
    const customDesignsFetchRequest = objectPath.get(window, 'tiffany.authoredContent.wishlistFlyoutConfig.customDesignsFetchRequest');

    return new Promise((resolve, reject) => {
        if (customDesignsFetchRequest && !isRemove) {
            objectPath.set(customDesignsFetchRequest, 'payload.webCustomerId', webCustomerId || '');
            try {
                ApiUtils.makeAjaxRequest(
                    customDesignsFetchRequest,
                    res => {
                        resolve(res);
                    },
                    err => {
                        resolve({});
                    }
                );
            } catch (error) {
                resolve({});
            }
        }
    });
};

/**
 * @description Reset wishlist
 * @returns {void}
 */
export const resetWishlistInitialize = () => (dispatch) => {
    dispatch({
        type: FC.RESET_WISHLIST_INITIALZE
    });
};

/**
 * @description Reset wishlist
 * @returns {void}
 */
export const resetBagInitialize = () => (dispatch) => {
    dispatch({
        type: FC.RESET_SHOPPING_BAG_INITIALZE
    });
};

/**
 * @description Do all page level actions here
 * @param {boolean} isRemove is wishlist removed
 * @param {Object} dispatch redux dispatch
 * @returns {void}
 */
export const getWishlist = (isRemove) => (dispatch) => {
    const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');
    const webCustomerId = cookieUtil.getCookies(cookieName) || '';
    const wishListCountCookie = objectPath.get(window, 'tiffany.authoredContent.wishlistCookieName', 'saveditemscnt');
    let wishListCount = 0;

    wishlistProcessFetch(webCustomerId)
        .then(wishlistres => {
            wishListCount = wishlistres.resultDto ? wishlistres.resultDto.length : 0;
            if (Object.keys(wishlistres).length > 0) {
                dispatch({
                    type: WC.WISHLIST_FETCHED,
                    payload: wishlistres
                });
            } else {
                dispatch({
                    type: WC.WISHLIST_FAILED
                });
            }
            return customWishlistProcessFetch(webCustomerId, isRemove);
        })
        .then(customwishlistres => {
            wishListCount += customwishlistres.resultDto ? customwishlistres.resultDto.length : 0;
            if (customwishlistres) {
                dispatch({
                    type: WC.CUSTOM_WISHLIST_FETCHED,
                    payload: customwishlistres.resultDto
                });
            } else {
                dispatch({
                    type: WC.CUSTOM_WISHLIST_FAILED
                });
            }
            cookieUtil.setCookie(wishListCountCookie, String(wishListCount), { secure: true });
        })
        .catch(err => {
            // Error needs to be implemented
        });
};

/**
 * @description Fetches data from system api for wishlist
 * @param {String} webCustomerId webCustomerId
 * @returns {Promise} Promise
 */
export const wishListSystemFetch = (webCustomerId) => {
    return new Promise((resolve, reject) => {
        const wishlistSystemRequest = objectPath.get(window, 'tiffany.authoredContent.wishlistSystemConfig');

        wishlistSystemRequest.isWishListCall = true;
        try {
            if (wishlistSystemRequest) {
                objectPath.set(wishlistSystemRequest, 'payload.webCustomerId', webCustomerId || '');
                ApiUtils.makeAjaxRequest(
                    wishlistSystemRequest,
                    res => {
                        resolve(res);
                        setInitialWishlistAnalytics(res.resultDto);
                    },
                    err => {
                        resolve(null);
                    }
                );
            }
        } catch (error) {
            resolve(null);
        }
    });
};

/**
 * @description Fetches data from system api for custom wishlist items
 * @param {String} webCustomerId webCustomerId
 * @returns {Promise} Promise
 */
export const customWishListSystemFetch = (webCustomerId) => {
    return new Promise((resolve, reject) => {
        const customDesignsSystemRequest = objectPath.get(window, 'tiffany.authoredContent.customDesignsSystemRequest');

        try {
            if (customDesignsSystemRequest) {
                objectPath.set(customDesignsSystemRequest, 'payload.webCustomerId', webCustomerId || '');
                ApiUtils.makeAjaxRequest(
                    customDesignsSystemRequest,
                    res => {
                        resolve(res);
                    },
                    err => {
                        resolve(null);
                    }
                );
            }
        } catch (error) {
            resolve(null);
        }
    });
};

/**
 * @description Fecthes the wishlist from system API
 * @returns {void}
 */
export const getWishListFromSystem = () => (dispatch) => {
    const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');
    const webCustomerId = cookieUtil.getCookies(cookieName) || '';
    const wishListCountCookie = objectPath.get(window, 'tiffany.authoredContent.wishlistCookieName', 'saveditemscnt');
    let wishListCount = 0;

    wishListSystemFetch(webCustomerId)
        .then(wishListData => {
            if (wishListData) {
                wishListCount = wishListData.resultDto ? wishListData.resultDto.length : 0;
                dispatch({
                    type: WC.WISHLIST_FETCHED,
                    payload: wishListData
                });
            } else {
                dispatch({
                    type: WC.CUSTOM_WISHLIST_FAILED
                });
            }
            return customWishListSystemFetch(webCustomerId);
        })
        .then(customWishListData => {
            if (customWishListData) {
                wishListCount += customWishListData.resultDto ? customWishListData.resultDto.length : 0;
                dispatch({
                    type: FC.CUSTOM_WISHLIST_FETCHED,
                    payload: customWishListData.resultDto
                });
            } else {
                dispatch({
                    type: FC.CUSTOM_WISHLIST_FAILED
                });
            }
            cookieUtil.setCookie(wishListCountCookie, String(wishListCount), { secure: true });
        })
        .catch(err => {
            // Error needs to be implemented
        });
};

/**
 * @description Do all page level actions here
 * @param {Object} data request object
 * @param {Object} dispatch redux dispatch
 * @returns {void}
 */
export const addToWishlist = (data) => (dispatch) => {
    const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');
    const webCustomerId = cookieUtil.getCookies(cookieName) || '';

    if (data) {
        objectPath.set(data, 'payload.webCustomerId', webCustomerId);
        ApiUtils.makeAjaxRequest(
            data,
            res => {
                // Setting analytics
                addWishlistAnalytics(data.payload.sku || data.payload.groupSku);
                getWishlist(true)(dispatch);
            },
            err => { }
        );
    }
};

/**
 * @description Remove product from wishlist
 * @param {Object} data request object
 * @param {Object} addData request object
 * @param {Object} dispatch redux dispatch
 * @returns {void}
 */
export const removeFromWishlist = (data, addData) => (dispatch) => {
    const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');
    const webCustomerId = cookieUtil.getCookies(cookieName) || '';

    objectPath.set(data, 'payload.webCustomerId', webCustomerId);
    ApiUtils.makeAjaxRequest(
        data,
        res => {
            dispatch({
                type: WC.WISHLIST_DELETE,
                payload: objectPath.get(data, 'payload.listItemIDs', [])
            });
        },
        err => { }
    );
    return {
        type: ''
    };
};
