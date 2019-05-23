// @flow

import ApiUtils from 'lib/api';
import * as cookieUtil from 'lib/utils/cookies';
import CONSTANTS from 'constants/ChooseDiamondConstants';

import * as objectPath from 'object-path';
import type { EngagementGroupCompleteResponse, Sku } from 'types/engagement';
import { fetchShoppingBag } from 'actions/FlyoutActions';
import { handleUrlState } from 'lib/utils/filters';
import { setCartAnalytics } from 'lib/utils/analytics-util';
import { toggle } from './InterceptorActions';

/**
 * @param {updatedObj} updatedObj payload for updating
 * @param {boolean} stopFetch stop api call
 * @param {Object} dispatch object
 * @returns {void}
 */
export const updateCurrentValues = (updatedObj: any, stopFetch: any = false) => (dispatch: Function) => {
    dispatch({
        type: CONSTANTS.UPDATE_CURRENT_DIAMOND_FILTERS,
        payload: {
            updatedObj,
            stopFetch
        }
    });
};

/**
 * @param {request} request of the cards
 * @param {boolean} undo bool
 * @returns {void}
 */
export const getDiamondCards = (request: any, undo: any) => (dispatch: Function, getState: Function) => {
    let payload = {};
    const currentState = getState();
    const previousStatePayload = objectPath.get(currentState, 'diamondFilters.previousPayload', []);
    const previousPayloadLength = previousStatePayload.length;
    const doUndo = undo && previousPayloadLength > 0;
    const groupComplete = objectPath.get(currentState, 'aem.engagementpdp.groupCompleteResponse', {});

    if (doUndo) {
        payload = previousPayloadLength === 2 ? previousStatePayload[previousPayloadLength - 2] : previousStatePayload[previousPayloadLength - 1];
    } else if (!undo) {
        payload = request;
    }

    if (currentState.diamondFilters.initialCall && payload.payload) {
        payload = JSON.parse(JSON.stringify(payload));
        payload.payload.upperPriceLimit = '';
        payload.payload.lowerPriceLimit = '';
    }

    if (payload.payload.upperPriceLimit === '' && payload.payload.lowerPriceLimit) {
        payload.payload.upperPriceLimit = groupComplete.upperPriceLimit;
    }
    if (payload.payload.lowerPriceLimit === '' && payload.payload.upperPriceLimit) {
        payload.payload.lowerPriceLimit = groupComplete.lowerPriceLimit;
    }
    if (doUndo) {
        // If undo and current state is isAvailableOnline and previous state is not isAvailableOnline
        if (payload.payload.isAvailableOnline === '') {
            dispatch(updateCurrentValues({ isAvailableOnline: false }, true));
        } else if (payload.payload.isAvailableOnline === true) {
            dispatch(updateCurrentValues({ isAvailableOnline: true }, true));
        }
    }

    if (Object.keys(payload).length > 0) {
        ApiUtils.makeAjaxRequest(payload, response => {
            dispatch({
                type: CONSTANTS.GET_DIAMOND_CARDS,
                payload: {
                    currentRes: response,
                    currentPayload: payload,
                    undo
                }
            });
        }, err => {
            dispatch({
                type: CONSTANTS.GET_DIAMOND_CARDS_FAILED,
                payload: {
                    currentPayload: payload,
                    undo
                }
            });
        });
    }
};

/**
 * @param {updatedFilter} updatedFilter payload for updating the min carat
 * @param {Object} dispatch object
 * @returns {void}
 */
export const updateFilters = (updatedFilter: any) => (dispatch: Function) => {
    dispatch({
        type: CONSTANTS.DIAMOND_FILTERS_UPDATED,
        payload: updatedFilter
    });
};

/**
 * @param {updatedFilter} updatedFilter payload for updating the min carat
 * @param {Object} dispatch object
 * @returns {void}
 */
export const resetFilters = () => (dispatch: Function) => {
    dispatch({
        type: CONSTANTS.RESET_DIAMOND_FILTERS
    });
};

/**
 * @param {updatedFilter} updatedFilter payload for updating the min carat
 * @param {Object} dispatch object
 * @returns {void}
 */
export const undoFilters = () => (dispatch: Function) => {
    dispatch(getDiamondCards({}, true));
};

/**
 * @param {card} card payload for card
 * @param {Object} dispatch object
 * @returns {void}
 */

export const setMoreCardSelection = (card: any) => (dispatch: Function) => {
    dispatch({
        type: CONSTANTS.SET_MORE_CARD,
        payload: card
    });
};


/**
 * @param {Object} dispatch object
 * @returns {void}
 */
export const resetRingSizeMessage = () => (dispatch: Function) => {
    dispatch({
        type: CONSTANTS.RESET_RING_SIZE_MESSAGE
    });
};

/**
 * @param {card} card payload for card
 * @param {Object} dispatch object
 * @returns {void}
 */

export const setBeautifulChoice = (request: any, isAvailableOnline: any, selectedCard: any) => (dispatch: Function, getState: Function) => {
    const currentState = getState();
    const loadedDiamonds: { [key: Sku]: EngagementGroupCompleteResponse } = objectPath.get(currentState, 'diamondFilters.loadedDiamonds', {});

    dispatch(toggle(true));
    if (!loadedDiamonds[String(request.payload.selectedSku)]) {
        ApiUtils.makeAjaxRequest(request, (response: EngagementGroupCompleteResponse) => {
            const bagItem = objectPath.get(objectPath.get(currentState, 'flyout.itemsList.items', []).filter(item => String(item.item.sku) === String(response.resultDto.group.group.selectedSku)), '0', false);
            const isInBag = !!bagItem;
            const isInWishList = !!objectPath.get(objectPath.get(currentState, 'flyout.savedItems', []).filter(item => String(item.sku) === String(response.resultDto.group.group.selectedSku)), '0', false);

            dispatch({
                type: CONSTANTS.SET_BEAUTIFUL_CHOICE,
                payload: {
                    response,
                    isAvailableOnline,
                    isInBag,
                    isInWishList,
                    shoppingBagItemID: bagItem ? bagItem.shoppingBagItemID : '',
                    size: bagItem && bagItem.servicing ? bagItem.servicing.text : '',
                    selectedCard
                }
            });
            handleUrlState({
                init: false,
                url: response.resultDto.group.friendlyURL
            });
        }, err => {
            dispatch({
                type: CONSTANTS.SET_BEAUTIFUL_CHOICE_FAILED,
                payload: {}
            });
        });
    } else {
        dispatch({
            type: CONSTANTS.SET_BEAUTIFUL_CHOICE,
            payload: {
                response: loadedDiamonds[request.payload.selectedSku],
                isAvailableOnline,
                isInBag: loadedDiamonds[request.payload.selectedSku].resultDto.isInBag,
                isInWishList: loadedDiamonds[request.payload.selectedSku].resultDto.isInWishList,
                shoppingBagItemID: loadedDiamonds[request.payload.selectedSku].resultDto.shoppingBagItemID || '',
                size: loadedDiamonds[request.payload.selectedSku].resultDto.size || '',
                selectedCard
            }
        });
        handleUrlState({
            init: false,
            url: loadedDiamonds[request.payload.selectedSku].resultDto.group.friendlyURL
        });
    }
};

/**
 * @param {card} card payload for card
 * @param {Object} dispatch object
 * @returns {void}
 */

export const resetBeautifulChoice = () => (dispatch: Function, getState: Function) => {
    dispatch({
        type: CONSTANTS.RESET_BEAUTIFUL_CHOICE
    });
};

/**
 * @description reset selected card
 * @returns {void}
 */
export const resetSelectedCard = () => (dispatch: Function, getState: Function) => {
    dispatch({
        type: CONSTANTS.RESET_SELECTED_DIAMOND_CARD
    });
};

export const AddToBag = () => (dispatch: Function, getState: Function) => {
    const currentState = getState();
    const addToBagConfig = JSON.parse(JSON.stringify(objectPath.get(currentState, 'aem.wishlistFlyoutConfig.addToBagRequest', {})));
    const cookieName = objectPath.get(currentState, 'aem.sessionCookieName', 'mysid2');
    const webCustomerID = cookieUtil.getCookies(cookieName) || '';
    const selectedDiamond = objectPath.get(currentState, 'diamondFilters.selectedDiamond', objectPath.get(currentState, 'diamondFilters.groupCompleteResponse', {}));
    const size = objectPath.get(selectedDiamond, 'size', objectPath.get(currentState, 'diamondFilters.selectedDiamondSize', ''));

    let payload = objectPath.get(addToBagConfig, 'skuEcomAddGroupTypeOneEndPoint', {});

    payload = JSON.parse(JSON.stringify(payload));
    payload.payload.groupSku = objectPath.get(selectedDiamond, 'group.group.sku', objectPath.get(selectedDiamond, 'sku', ''));
    payload.payload.sku = objectPath.get(selectedDiamond, 'group.group.selectedSku', objectPath.get(selectedDiamond, 'selectedSku', ''));
    payload.payload.webCustomerId = webCustomerID;
    delete payload.payload.WebCustomerID;
    payload.payload.orderOriginationId = 1;
    payload.payload.quantity = 1;
    payload.payload.ItemServicing = {
        itemServiceTypeID: objectPath.get(currentState, 'diamondFilters.groupCompleteResponse.itemServiceTypeId', ''),
        ServiceQuantity: objectPath.get(currentState, 'diamondFilters.groupCompleteResponse.servicingQuantity', ''),
        text: size
    };
    if (String(objectPath.get(currentState, 'diamondFilters.groupCompleteResponse.defaultRingSize', '')) === String(size)) {
        delete payload.payload.ItemServicing;
    }
    dispatch(toggle(false));
    ApiUtils.makeAjaxRequest(
        payload,
        (res: any) => {
            dispatch({
                type: CONSTANTS.DIAMOND_ADDED
            });
            dispatch(fetchShoppingBag(true));
            dispatch(toggle(true));
            try {
                const productObj = objectPath.get(window, 'dataLayer.product', {});

                setCartAnalytics(productObj);
            } catch (e) {
                console.log(e);
            }
        },
        err => {
            // Error handler
        }
    );
};

export const updateSizeInCart = (shoppingBagItemId: string, sku: string, serviceType: string, style: string, size: string, serviceQuantity: string) => (dispatch: Function, getState: Function) => {
    const currentState = getState();
    const updateRingSizeConfig = JSON.parse(JSON.stringify(objectPath.get(currentState, 'aem.engagementpdp.updateRingSizeConfig', {})));
    const cookieName = objectPath.get(currentState, 'aem.sessionCookieName', 'mysid2');
    const webCustomerID = cookieUtil.getCookies(cookieName) || '';

    updateRingSizeConfig.payload.WebCustomerId = webCustomerID;
    updateRingSizeConfig.payload.ShoppingBagItemId = shoppingBagItemId;
    updateRingSizeConfig.payload.Sku = sku;
    updateRingSizeConfig.payload.ItemServicing.text = size;
    if (String(objectPath.get(currentState, 'diamondFilters.groupCompleteResponse.defaultRingSize', '')) === String(size)) {
        delete updateRingSizeConfig.payload.ItemServicing;
    }
    ApiUtils.makeAjaxRequest(
        updateRingSizeConfig,
        (res: any) => {
            dispatch({
                type: CONSTANTS.RING_SIZE_UPDATED,
                payload: {
                    sku,
                    size
                }
            });
        },
        err => {
            // Error handler
        }
    );
};

/**
 * @param {number} size size
 * @param {Object} dispatch object
 * @returns {void}
 */

export const setSizeSelection = (size: any) => (dispatch: Function) => {
    dispatch({
        type: CONSTANTS.SET_SIZE_ELECTION,
        payload: size
    });
};

/**
 * @param {boolean} isEditClicked is edit button clicked
 * @param {Object} dispatch object
 * @returns {void}
 */
export const toggleFiltersSection = (isEditClicked) => (dispatch: Function) => {
    dispatch({
        type: CONSTANTS.TOGGLE_FILTERS_SECTION,
        payload: {
            isEditClicked
        }
    });
};

export const initWishListFromCookie = () => (dispatch, getState) => {
    const { skuId } = getState().wishlist;

    dispatch({
        type: CONSTANTS.SET_WISHLIST,
        payload: {
            skuId
        }
    });
};
