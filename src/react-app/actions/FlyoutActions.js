import ApiUtils from 'lib/api';
import * as objectPath from 'object-path';
import FC from 'constants/FlyoutConstants';
import WC from 'constants/WishlistConstants';
import * as cookieUtil from 'lib/utils/cookies';
import {
    setCartAnalytics,
    removeCartAnalytics,
    removeSavedItemsAnalytics,
    removeByoSavedItemsAnalytics,
    setInitialCartAnalytics,
    removeByoCartAnalytics
} from '../../lib/utils/analytics-util';

const customEventTrigger = require('lib/events/custom-event-trigger');

/**
 * @default Flyout
 * @param {boolean} isRemove item removed from bag?
 * @returns {void}
 */
export const fetchShoppingBag = (isRemove) => (dispatch, getState) => {
    const aem = objectPath.get(window, 'tiffany.authoredContent', {});
    const shoppingBagFlyoutConfig = objectPath.get(window, 'tiffany.authoredContent.shoppingBagFlyoutConfig', {});
    const request = shoppingBagFlyoutConfig.listFetchRequest;

    request.payload.webCustomerId = cookieUtil.getCookies(shoppingBagFlyoutConfig.cookieName) || '';
    request.isBagCall = true;

    ApiUtils.makeAjaxRequest(
        request,
        res => {
            dispatch({
                type: FC.SHOPPING_BAG_FETCHED,
                payload: {
                    itemsList: res.resultDto,
                    aem
                }
            });
            setInitialCartAnalytics(res.resultDto);
        },
        err => {
            dispatch({
                type: FC.SHOPPING_BAG_FETCH_FAILED
            });
        }
    );
};

/**
 * @description Fetches shopping bag count data
 * @returns {void}
 */
export const fetchShoppingBagCount = () => (dispatch, getState) => {
    const shoppingBagCountRequest = objectPath.get(window, 'tiffany.authoredContent.shoppingBagCountRequest', {});
    const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');
    const webCustomerId = cookieUtil.getCookies(cookieName) || '';
    const shoppingBagCountCookie = objectPath.get(window, 'tiffany.authoredContent.bagCookieName', 'shoppingbagcnt');

    shoppingBagCountRequest.payload.webCustomerId = webCustomerId;
    shoppingBagCountRequest.isBagCall = true;

    ApiUtils.makeAjaxRequest(
        shoppingBagCountRequest,
        res => {
            cookieUtil.setCookie(shoppingBagCountCookie, res.resultDto.totalItemCount, { secure: true });
            dispatch({
                type: FC.BAG_COUNT_FETCHED,
                count: res.resultDto.totalItemCount
            });
        },
        err => {
            cookieUtil.setCookie(shoppingBagCountCookie, '0', { secure: true });
            dispatch({
                type: FC.BAG_COUNT_FETCHED,
                count: 0
            });
        }
    );
};

/**
 * @description Fetches shopping bag system data
 * @param {string} cookie Existing cookie
 * @returns {void}
 */
export const fetchShoppingBagSystem = (cookie) => (dispatch, getState) => {
    const aem = objectPath.get(window, 'tiffany.authoredContent', {});

    if (cookie) {
        dispatch({
            type: FC.INIT_SHOPPING_SYSTEM,
            payload: {
                items: JSON.parse(cookie),
                aem
            }
        });
        return;
    }

    const shoppingBagSystemRequest = objectPath.get(aem, 'shoppingBagSystemRequest', {});
    const cookieName = objectPath.get(aem, 'sessionCookieName', 'mysid2');
    const webCustomerId = cookieUtil.getCookies(cookieName) || '';

    shoppingBagSystemRequest.payload.webCustomerId = webCustomerId;
    shoppingBagSystemRequest.isBagCall = true;

    ApiUtils.makeAjaxRequest(
        shoppingBagSystemRequest,
        res => {
            const cookieData = res.resultDto.map(item => { return { sku: item.sku, shoppingBagItemID: item.shoppingBagItemID, servicing: item.servicing }; });

            cookieUtil.setCookie('engagmentReduce', JSON.stringify(cookieData), { secure: true, encode: true });
            dispatch({
                type: FC.INIT_SHOPPING_SYSTEM,
                payload: {
                    items: cookieData,
                    aem
                }
            });
        },
        err => {
            cookieUtil.setCookie('engagmentReduce', JSON.stringify([]), { secure: true, encode: true });
            dispatch({
                type: FC.INIT_SHOPPING_SYSTEM,
                payload: {
                    items: [],
                    aem
                }
            });
        }
    );
};

export const removeCustomItemFromWishlist = (designID) => (dispatch, getState) => {
    const currentState = getState();
    const customDesignRemoveRequest = JSON.parse(JSON.stringify(objectPath.get(currentState, 'aem.wishlistFlyoutConfig.customDesignRemoveRequest', {})));

    customDesignRemoveRequest.payload.designID = designID;
    ApiUtils.makeAjaxRequest(
        customDesignRemoveRequest,
        res => {
            customEventTrigger(window, 'refreshWishlist');
            dispatch({
                type: FC.CUSTOM_WISHLIST_REMOVED,
                payload: {
                    designID
                }
            });
            removeByoSavedItemsAnalytics({ designID });
        },
        err => {
            customEventTrigger(window, 'refreshWishlist');
            dispatch({
                type: FC.CUSTOM_WISHLIST_REMOVED,
                payload: {
                    designID
                }
            });
            removeByoSavedItemsAnalytics({ designID });
        }
    );
};

export const removeItemFromShoppingBag = (item) => (dispatch, getState) => {
    const shoppingBagFlyoutConfig = objectPath.get(window, 'tiffany.authoredContent.shoppingBagFlyoutConfig');
    const request = shoppingBagFlyoutConfig.removeRequest;

    // request.payload.shoppingBagItemID = item.shoppingBagItemID;

    request.payload.sku = item.sku;
    // request.payload.siteId = item.item.siteId; commented as a fix for BUG-2258 to avoid duplicate siteId
    request.payload.webCustomerId = cookieUtil.getCookies(shoppingBagFlyoutConfig.cookieName) || '';

    ApiUtils.makeAjaxRequest(
        request,
        res => {
            dispatch(fetchShoppingBag(true));


            removeCartAnalytics(item);
        },
        err => {
            console.log(err);
        }
    );
};

export const removeCustomItemFromShoppingBag = (item) => (dispatch, getState) => {
    const currentState = getState();
    const shoppingBagFlyoutConfig = JSON.parse(JSON.stringify(objectPath.get(currentState, 'aem.shoppingBagFlyoutConfig', {})));
    const request = shoppingBagFlyoutConfig.customDesignRemoveRequest;

    request.payload.designID = item.designId;
    request.payload.webCustomerId = cookieUtil.getCookies(shoppingBagFlyoutConfig.cookieName) || '';

    ApiUtils.makeAjaxRequest(
        request,
        res => {
            dispatch(fetchShoppingBag(true));
            removeByoCartAnalytics(item.designId);
        },
        err => {
            console.log(err);
        }
    );
};

/**
 * @default Flyout
 * @returns {void}
 */
export const fetchWishlist = () => (dispatch) => {
    const wishlistFlyoutConfig = objectPath.get(window, 'tiffany.authoredContent.wishlistFlyoutConfig', {});
    const request = wishlistFlyoutConfig.listFetchRequest;

    request.payload.webCustomerId = cookieUtil.getCookies(wishlistFlyoutConfig.cookieName) || '';

    ApiUtils.makeAjaxRequest(
        request,
        res => {
            dispatch({
                type: FC.WISHLIST_FETCHED_COMPLETE,
                payload: {
                    savedItems: res.resultDto
                }
            });
        },
        err => {
            dispatch({
                type: FC.WISHLIST_FETCH_FAILED
            });
        }
    );
};

/**
 * @default Flyout
 * @returns {void}
 */
export const fetchCustomDesignWishlist = () => (dispatch) => {
    const wishlistFlyoutConfig = objectPath.get(window, 'tiffany.authoredContent.wishlistFlyoutConfig');
    const request = wishlistFlyoutConfig.customDesignsFetchRequest;

    request.payload.webCustomerId = cookieUtil.getCookies(wishlistFlyoutConfig.cookieName) || '';

    ApiUtils.makeAjaxRequest(
        request,
        res => {
            dispatch({
                type: FC.CUSTOM_WISHLIST_FETCHED,
                payload: res.resultDto
            });
        },
        err => {
            dispatch({
                type: FC.CUSTOM_WISHLIST_FAILED
            });
        }
    );
};

export const removeItemFromWishlist = (item) => (dispatch, getState) => {
    const wishlistFlyoutConfig = objectPath.get(window, 'tiffany.authoredContent.wishlistFlyoutConfig');
    const request = wishlistFlyoutConfig.removeRequest;
    // const currentState = getState();

    request.payload.listItemIDs = item.listItemIDs;
    request.payload.siteId = item.siteId;
    request.payload.webCustomerId = cookieUtil.getCookies(wishlistFlyoutConfig.cookieName) || '';

    ApiUtils.makeAjaxRequest(
        request,
        res => {
            dispatch({
                type: WC.WISHLIST_DELETE,
                payload: objectPath.get(request, 'payload.listItemIDs', [])
            });
        },
        err => {
        }
    );
};

export const wishlistAddDesignToBag = (designID) => (dispatch) => {
    const wishlistFlyoutConfig = objectPath.get(window, 'tiffany.authoredContent.wishlistFlyoutConfig');
    const addDesignToBagRequest = objectPath.get(window, 'tiffany.authoredContent.wishlistFlyoutConfig.addToBagRequest.addDesignToBag', {});

    addDesignToBagRequest.payload.webCustomerId = cookieUtil.getCookies(wishlistFlyoutConfig.cookieName) || '';
    addDesignToBagRequest.payload.designID = designID;
    ApiUtils.makeAjaxRequest(
        addDesignToBagRequest,
        res => {
            customEventTrigger(window, 'refreshWishlist');
            dispatch(removeCustomItemFromWishlist(designID));
            dispatch(fetchShoppingBag(true));
        },
        err => {
            console.log(err);
        }
    );
};

/**
 * @default Flyout
 * @returns {void}
 * @param {object} item item
 */
export const wishlistAddToBag = (item) => (dispatch) => {
    const wishlistFlyoutConfig = objectPath.get(window, 'tiffany.authoredContent.wishlistFlyoutConfig');
    let request;

    if (item.groupSku && item.parentGroupSKU) {
        request = objectPath.get(wishlistFlyoutConfig, 'addToBagRequest.skuEcomAddGroupTypeTwoEndPoint', {});
    } else if (item.groupSku && !item.parentGroupSKU) {
        request = objectPath.get(wishlistFlyoutConfig, 'addToBagRequest.skuEcomAddGroupTypeOneEndPoint', {});
    } else {
        request = objectPath.get(wishlistFlyoutConfig, 'addToBagRequest.skuEcomAddRequest', {});
    }

    const {
        groupSku,
        parentGroupSKU,
        orderOriginationId,
        sku,
        quantity,
        partialShip,
        categoryID,
        masterCategoryID,
        siteId,
        assortmentId
    } = item;

    request.payload = {
        ...request.payload,
        groupSku,
        parentGroupSKU,
        orderOriginationId,
        sku,
        quantity,
        partialShip,
        categoryID,
        masterCategoryID,
        siteId,
        assortmentId
    };

    // deleting undefined keys
    Object.keys(request.payload).forEach(key => request.payload[key] === undefined && delete request.payload[key]);

    request.payload.webCustomerId = cookieUtil.getCookies(wishlistFlyoutConfig.cookieName) || '';

    if (!orderOriginationId) {
        request.payload.orderOriginationId = 1;
    }

    ApiUtils.makeAjaxRequest(
        request,
        res => {
            dispatch(removeItemFromWishlist(item));
            dispatch(fetchShoppingBag(true));
            setCartAnalytics(item);
            removeSavedItemsAnalytics(item);
        },
        err => {
            console.log(err);
        }
    );
};

export const fetchAccountDetails = (item) => (dispatch) => {
    const myAccountConfig = objectPath.get(window, 'tiffany.authoredContent.myAccountConfig');
    const request = myAccountConfig;
    const loggedInUserCookie = cookieUtil.getCookies(objectPath.get(window, 'tiffany.authoredContent.loginCookieName', 'loggedincust'));


    try {
        JSON.parse(loggedInUserCookie);
        request.payload.cookieVal = loggedInUserCookie || null;
        ApiUtils.makeAjaxRequest(
            request,
            res => {
                dispatch({
                    type: FC.ACCOUNT_DETAILS_FETCHED,
                    payload: {
                        accountData: res
                    }
                });
            },
            err => {
                console.log(err);
            }
        );
    } catch (error) {
        dispatch({
            type: FC.ACCOUNT_DETAILS_FETCHED,
            payload: {
                accountData: null
            }
        });
    }
};

/**
 * @description method to update flyout holder - which component has opened header flyout
 * @param {type} type defines what is the flyout opened for
 * @returns {void}
 */
export const updateFlyoutHolder = (type = '') => (dispatch) => {
    dispatch({
        type: FC.UPDATE_FLYOUT_HOLDER,
        payload: type
    });
};

/**
 * @description Action for init process call
 * @param {boolean} isShopping Shopping bag call flag
 * @returns {void}
 */
export const triggerInitProcessFetch = (isShopping) => (dispatch) => {
    if (!isShopping) {
        dispatch({
            type: FC.INIT_PROCESS_TRIGGERED
        });
    } else {
        dispatch({
            type: FC.INIT_SHOPPING_TRIGGERED
        });
    }
};

export const setFlyoutState = () => (dispatch) => {
    dispatch({
        type: FC.SET_WISHLIST_FLYOUT
    });
};

export default fetchShoppingBag;
