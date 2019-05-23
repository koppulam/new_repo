
import * as objectPath from 'object-path';
import CONSTANTS from 'constants/InterceptorConstants';


/**
 * @description Will add a URL to current request queue
 * @param {Object} req Request object
 * @returns {Object} Action Obbject
 */
export const add = (req) => (dispatch, getState) => {
    const getWishlistRequest = objectPath.get(window, 'tiffany.authoredContent.wishlistConfig.get', {});
    const addWishlistRequest = objectPath.get(window, 'tiffany.authoredContent.wishlistConfig.add', {});
    const removeWishlistRequest = objectPath.get(window, 'tiffany.authoredContent.wishlistConfig.delete', {});

    const shoppingBagFlyoutConfig = objectPath.get(window, 'tiffany.authoredContent.shoppingBagFlyoutConfig', {});
    const wishlistFlyoutConfig = objectPath.get(window, 'tiffany.authoredContent.wishlistFlyoutConfig', {});
    const { listFetchRequest, removeRequest, customDesignRemoveRequest } = shoppingBagFlyoutConfig;
    const { customDesignsFetchRequest, addToBagRequest } = wishlistFlyoutConfig;
    const wishlistRemoveRequest = wishlistFlyoutConfig.removeRequest;
    const wishlistCustomDesignRemoveRequest = wishlistFlyoutConfig.customDesignRemoveRequest;
    const {
        skuEcomAddGroupTypeOneEndPoint, skuEcomAddGroupTypeTwoEndPoint, skuEcomAddRequest, addDesignToBag
    } = addToBagRequest;
    const {
        byoAddToBagRequest, getByoRequest, saveByoRequest, byoCanvasAction, byoSaveDropHintRequest
    } = objectPath.get(window, 'tiffany.authoredContent.byoConfig', {});
    const { addToCartConfig, sessionConfig } = objectPath.get(window, 'tiffany.authoredContent', {});

    const excludeRequests = [
        listFetchRequest ? listFetchRequest.url : '',
        getWishlistRequest ? getWishlistRequest.url : '',
        customDesignsFetchRequest ? customDesignsFetchRequest.url : '',
        addWishlistRequest ? addWishlistRequest.url : '',
        removeWishlistRequest ? removeWishlistRequest.url : '',
        removeRequest ? removeRequest.url : '',
        getByoRequest ? getByoRequest.url : '',
        customDesignRemoveRequest ? customDesignRemoveRequest.url : '',
        byoAddToBagRequest ? byoAddToBagRequest.url : '',
        addToCartConfig ? addToCartConfig.url : '',
        addDesignToBag ? addDesignToBag.url : '',
        skuEcomAddGroupTypeOneEndPoint ? skuEcomAddGroupTypeOneEndPoint.url : '',
        skuEcomAddGroupTypeTwoEndPoint ? skuEcomAddGroupTypeTwoEndPoint.url : '',
        skuEcomAddRequest ? skuEcomAddRequest.url : '',
        saveByoRequest ? saveByoRequest.url : '',
        wishlistRemoveRequest ? wishlistRemoveRequest.url : '',
        wishlistCustomDesignRemoveRequest ? wishlistCustomDesignRemoveRequest.url : '',
        byoCanvasAction && byoCanvasAction.dropaHint && byoCanvasAction.dropaHint.designDataPattern ? byoCanvasAction.dropaHint.designDataPattern : '',
        byoSaveDropHintRequest ? byoSaveDropHintRequest.url : '',
        sessionConfig ? sessionConfig.url : ''
    ];

    const isReqExists = excludeRequests.filter(currentUrl => (currentUrl ? req.url.indexOf(currentUrl) !== -1 : false));

    if (isReqExists && isReqExists.length) {
        return {};
    }

    dispatch({
        type: CONSTANTS.ADD,
        payload: req.url
    });
    return {};
};

/**
 * @description Will add a URL to current request queue
 * @param {Object} response response object
 * @returns {Object} Action Obbject
 */
export const remove = (response) => (dispatch, getState) => {
    const getWishlistRequest = objectPath.get(window, 'tiffany.authoredContent.wishlistConfig.get', {});
    const addWishlistRequest = objectPath.get(window, 'tiffany.authoredContent.wishlistConfig.add', {});
    const removeWishlistRequest = objectPath.get(window, 'tiffany.authoredContent.wishlistConfig.delete', {});

    const shoppingBagFlyoutConfig = objectPath.get(window, 'tiffany.authoredContent.shoppingBagFlyoutConfig', {});
    const wishlistFlyoutConfig = objectPath.get(window, 'tiffany.authoredContent.wishlistFlyoutConfig', {});
    const { listFetchRequest, removeRequest, customDesignRemoveRequest } = shoppingBagFlyoutConfig;
    const { customDesignsFetchRequest, addToBagRequest } = wishlistFlyoutConfig;
    const wishlistRemoveRequest = wishlistFlyoutConfig.removeRequest;
    const wishlistCustomDesignRemoveRequest = wishlistFlyoutConfig.customDesignRemoveRequest;
    const {
        skuEcomAddGroupTypeOneEndPoint, skuEcomAddGroupTypeTwoEndPoint, skuEcomAddRequest, addDesignToBag
    } = addToBagRequest;
    const {
        byoAddToBagRequest, getByoRequest, saveByoRequest, byoCanvasAction, byoSaveDropHintRequest
    } = objectPath.get(window, 'tiffany.authoredContent.byoConfig', {});
    const { addToCartConfig, sessionConfig } = objectPath.get(window, 'tiffany.authoredContent', {});

    const excludeRequests = [
        listFetchRequest ? listFetchRequest.url : '',
        getWishlistRequest ? getWishlistRequest.url : '',
        customDesignsFetchRequest ? customDesignsFetchRequest.url : '',
        addWishlistRequest ? addWishlistRequest.url : '',
        removeWishlistRequest ? removeWishlistRequest.url : '',
        removeRequest ? removeRequest.url : '',
        getByoRequest ? getByoRequest.url : '',
        customDesignRemoveRequest ? customDesignRemoveRequest.url : '',
        byoAddToBagRequest ? byoAddToBagRequest.url : '',
        addToCartConfig ? addToCartConfig.url : '',
        addDesignToBag ? addDesignToBag.url : '',
        skuEcomAddGroupTypeOneEndPoint ? skuEcomAddGroupTypeOneEndPoint.url : '',
        skuEcomAddGroupTypeTwoEndPoint ? skuEcomAddGroupTypeTwoEndPoint.url : '',
        skuEcomAddRequest ? skuEcomAddRequest.url : '',
        saveByoRequest ? saveByoRequest.url : '',
        wishlistRemoveRequest ? wishlistRemoveRequest.url : '',
        wishlistCustomDesignRemoveRequest ? wishlistCustomDesignRemoveRequest.url : '',
        byoCanvasAction && byoCanvasAction.dropaHint && byoCanvasAction.dropaHint.designDataPattern ? byoCanvasAction.dropaHint.designDataPattern : '',
        byoSaveDropHintRequest ? byoSaveDropHintRequest.url : '',
        sessionConfig ? sessionConfig.url : ''
    ];

    const isReqExists = response.url ? excludeRequests.filter(currentUrl => (currentUrl ? response.url.indexOf(currentUrl) !== -1 : false)) : false;

    if (isReqExists && isReqExists.length) {
        return {};
    }

    dispatch({
        type: CONSTANTS.REMOVE,
        payload: response.url
    });
    return {};
};

/**
 * @description Will add a URL to current request queue
 * @param {boolean} enabled enabled
 * @returns {Object} Action Obbject
 */
export const toggle = (enabled) => {
    return {
        type: CONSTANTS.TOGGLE,
        payload: {
            enabled
        }
    };
};
