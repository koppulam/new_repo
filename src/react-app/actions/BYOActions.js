// @flow

import * as cookieUtil from 'lib/utils/cookies';
import ApiUtils from 'lib/api';
import * as objectPath from 'object-path';
import CONSTANTS from 'constants/BYOConstants';

import queryString from 'query-string';
import {
    getBYOItemCompleteProductsToTray,
    getBYOGroupCompleteProductsToTray,
    getFixtureImageURL,
    getBYOItemCompleteChainToTray,
    getBYOCanvasData,
    getByoItemData
} from 'lib/utils/format-data';
import PRODUCT_CONSTANTS from 'constants/ProductConstants';
import HOVER from 'constants/OnHoverConstants';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import pick from 'lodash/pick';
import intersection from 'lodash/intersection';
import { addToWishlist } from 'actions/WishlistActions';
import {
    addByoWishlistAnalytics,
    byoAddtoBagAnalytics
} from 'lib/utils/analytics-util';
import { fetchShoppingBag } from 'actions/FlyoutActions';
import { findFirst } from 'lib/dom/dom-util';
import type { ByoSaveDesignRequest, ByoSaveDesignUrlRequest, AddToBagRequest } from 'types/request';
import { setSession } from 'actions/PageActions';
import cloneDeep from 'lodash/cloneDeep';
import { toggle } from './InterceptorActions';

const customEventTrigger = require('lib/events/custom-event-trigger');

const toggleMetaRobotTag = (isNIOINDEX) => {
    const metaRobot = document.createElement('meta');
    const noIndexElement = findFirst('meta[content="NOINDEX, NOFOLLOW"]');
    const indexElement = findFirst('meta[content="INDEX, FOLLOW"]');

    if (isNIOINDEX) {
        if (indexElement) {
            indexElement.parentNode.removeChild(indexElement);
        }
        if (noIndexElement) {
            return;
        }
        metaRobot.name = 'ROBOTS';
        metaRobot.content = 'NOINDEX, NOFOLLOW';
        document.getElementsByTagName('head')[0].appendChild(metaRobot);
    } else {
        if (noIndexElement) {
            noIndexElement.parentNode.removeChild(noIndexElement);
        }
        if (indexElement) {
            return;
        }
        metaRobot.name = 'ROBOTS';
        metaRobot.content = 'INDEX, FOLLOW';
        document.getElementsByTagName('head')[0].appendChild(metaRobot);
    }
};

export const addToBag = (designID: string) => (dispatch: Function, getState: Function) => {
    const currentState: any = getState();
    const request: AddToBagRequest = currentState.aem.byoConfig.byoAddToBagRequest;
    const cookieName = objectPath.get(currentState, 'aem.sessionCookieName', 'mysid2');
    // const designID = objectPath.get(currentState, 'byo.designID', false);
    const webCustomerID = cookieUtil.getCookies(cookieName) || '';

    request.payload.webCustomerId = webCustomerID;
    request.payload.designID = designID;

    ApiUtils.makeAjaxRequest(
        request,
        (res: any) => {
            dispatch(fetchShoppingBag(true));
            dispatch({
                type: CONSTANTS.BYO_ADD_TO_BAG,
                payload: {
                    res
                }
            });
        },
        err => {
            dispatch({
                type: CONSTANTS.BYO_GROUP_COMPLETE_FAILED
            });
        }
    );
    return true;
};

export const AddToBagSilhouette = () => (dispatch: Function, getState: Function) => {
    const currentState = getState();
    const addToBagConfig = JSON.parse(JSON.stringify(objectPath.get(currentState, 'aem.wishlistFlyoutConfig.addToBagRequest', {})));
    const cookieName = objectPath.get(currentState, 'aem.sessionCookieName', 'mysid2');
    const payloads = [];
    let webCustomerID = cookieUtil.getCookies(cookieName) || '';
    let cookiePromise;
    let requests;

    if (!webCustomerID) {
        cookiePromise = setSession();
    } else {
        cookiePromise = new Promise((resolve, reject) => {
            resolve();
        });
    }

    cookiePromise.then((cookie) => {
        if (cookie) {
            cookieUtil.setCookie(cookieName, cookie, { secure: true }, true);
            webCustomerID = cookie;
        }
        currentState.byo.drawerData.forEach(item => {
            let payload = {};

            if (item.fixtureIndex !== undefined) {
                if (item.selectedSku) {
                    payload = objectPath.get(addToBagConfig, 'skuEcomAddGroupTypeOneEndPoint', {});
                    payload = JSON.parse(JSON.stringify(payload));
                    payload.payload.groupSku = item.sku;
                    payload.payload.sku = item.selectedSku;
                    payload.payload.webCustomerId = webCustomerID;
                } else {
                    payload = objectPath.get(addToBagConfig, 'skuEcomAddRequest', {});
                    payload = JSON.parse(JSON.stringify(payload));
                    payload.payload.sku = item.sku;
                    payload.payload.webCustomerId = webCustomerID;
                }

                if (item.selectedEngraving) {
                    payload.payload.itemServicing = {
                        itemServiceTypeID: item.selectedEngraving.itemServiceTypeId,
                        style: item.selectedEngraving.styleCode,
                        text: `${item.selectedEngraving.initialOne}${item.selectedEngraving.initialTwo}${item.selectedEngraving.initialThree}`,
                        serviceQuantity: 1
                    };
                }
                payload.payload.orderOriginationId = '1';
                payload.payload.partialShip = false;
                payload.payload.quantity = 1;
                const payloadIndex = findIndex(payloads, (o) => { return o.payload.sku === payload.payload.sku; });

                if (payloadIndex !== -1) {
                    payloads[payloadIndex].payload.quantity += 1;
                } else {
                    payloads.push(payload);
                }
            }
        });
        requests = payloads.map(payload => {
            return new Promise((resolve, reject) => {
                ApiUtils.makeAjaxRequest(
                    payload,
                    (res: any) => {
                        resolve(res);
                    },
                    err => {
                        reject(err);
                    }
                );
            });
        });
        Promise.all(requests)
            .then((responses: any[]) => {
                dispatch({
                    type: CONSTANTS.BYO_ADD_TO_BAG
                });
                dispatch(fetchShoppingBag(true));
            })
            .catch(err => {
                // No error handler
            });
    });
};

export const AddToWishListSilhouette = () => (dispatch: Function, getState: Function) => {
    const currentState = getState();
    const addData = objectPath.get(currentState, 'aem.wishlistConfig.add', {});
    const result = uniqBy(currentState.byo.drawerData, (elem) => {
        return JSON.stringify(pick(elem, ['sku', 'selectedSku']));
    });
    const cookieName = objectPath.get(currentState, 'aem.sessionCookieName', 'mysid2');
    const webCustomerID = cookieUtil.getCookies(cookieName) || '';

    let cookiePromise;

    if (!webCustomerID) {
        cookiePromise = setSession();
    } else {
        cookiePromise = new Promise((resolve, reject) => {
            resolve();
        });
    }
    cookiePromise.then((cookie) => {
        if (cookie) {
            cookieUtil.setCookie(cookieName, cookie, { secure: true }, true);
        }
        result.forEach(item => {
            if (item.fixtureIndex !== undefined) {
                if (item.selectedSku) {
                    objectPath.set(addData, 'payload.sku', item.selectedSku);
                    objectPath.set(addData, 'payload.groupSku', item.sku);
                } else {
                    objectPath.set(addData, 'payload.sku', item.sku);
                }
                dispatch(addToWishlist(addData));
                addByoWishlistAnalytics([item]);
            }
        });
        dispatch({
            type: CONSTANTS.BYO_WISHLIST_SILHOUETTE
        });
    });
};

export const getDrawer = (saveResponse: any, hasNameParam: boolean) => (dispatch: Function, getState: Function) => {
    const currentState = getState();
    const request = JSON.parse(JSON.stringify(objectPath.get(currentState, 'aem.byoConfig.getByoRequest', {})));
    const designID = objectPath.get(saveResponse, 'resultDto.designID', '');
    const urlUniqueID = objectPath.get(saveResponse, 'urlUniqueID', '');
    const cookieName = objectPath.get(currentState, 'aem.sessionCookieName', 'mysid2');
    const webCustomerID = cookieUtil.getCookies(cookieName) || '';

    if (designID) {
        request.payload.designID = designID;
    } else {
        delete request.payload.designID;
    }

    if (urlUniqueID) {
        request.payload.urlUniqueID = urlUniqueID;
    } else {
        delete request.payload.urlUniqueID;
    }

    request.payload.webCustomerId = webCustomerID;

    ApiUtils.makeAjaxRequest(
        request,
        res => {
            if (!hasNameParam) {
                dispatch({
                    type: CONSTANTS.SAVE_BYO_SUCCESS,
                    payload: {
                        res,
                        designID
                    }
                });
            } else {
                dispatch({
                    type: CONSTANTS.GET_BYO_CREATION,
                    payload: {
                        res,
                        designID,
                        urlUniqueID
                    }
                });
            }
        },
        err => {
            dispatch({
                type: CONSTANTS.SAVE_BYO_ERROR
            });
        }
    );
    return {
        type: ''
    };
};

export const saveDrawer = () => (dispatch: Function, getState: Function) => {
    const currentState = getState();
    const cookieName = objectPath.get(currentState, 'aem.sessionCookieName', 'mysid2');
    const request = JSON.parse(JSON.stringify(objectPath.get(currentState, 'aem.byoConfig.saveByoRequest', {})));
    const designID = objectPath.get(currentState, 'byo.designID', false);
    const webCustomerID = cookieUtil.getCookies(cookieName) || '';
    const isClaspRequired = objectPath.get(currentState, 'byo.isClaspEnabled', false);
    const claspSku = objectPath.get(currentState, 'byo.claspDetails.sku', false);
    const claspPrice: number = objectPath.get(currentState, 'byo.claspDetails.rawPrice', 0.00);
    const itemTypeId = objectPath.get(currentState, 'aem.byoConfig.gridRequest.payload.ByoItemType', '');
    const mountTypeId = objectPath.get(window, 'tiffany.authoredContent.byoConfig.claspMountTypeId', '');

    if (!designID) {
        delete request.payload.designID;
    } else {
        request.payload.designID = designID;
    }
    request.payload.webCustomerId = webCustomerID;
    if (currentState.byo.drawerData.length > 0) {
        let total: number = 0.00;

        currentState.byo.drawerData.forEach(item => {
            const Item = {};

            if (!item.isSilhouette && item.fixturePositions) {
                Item.SKU = item.selectedSku || objectPath.get(item, 'sku', '');
                Item.GroupSku = item.sku;
                Item.ItemTypeId = item.itemTypeID;
                Item.SeqNum = 0;
                total += Number(item.price);
            } else if (item.fixtureIndex !== undefined) {
                Item.ItemTypeId = itemTypeId;
                Item.SeqNum = Number(item.fixtureIndex) + 1;

                if (item.selectedSku) {
                    Item.SKU = item.selectedSku;
                    Item.GroupSku = item.sku;
                } else {
                    Item.SKU = item.sku;
                }
                total += Number(item.price);

                if (isClaspRequired && claspSku) {
                    Item.MountSKU = claspSku;
                    Item.MountTypeId = parseInt(mountTypeId, 0);
                    total += Number(claspPrice);
                }
                if (item.selectedEngraving) {
                    total += Number(objectPath.get(item, 'selectedEngraving.unitPrice', 0));
                }
            }

            request.payload.Items.Items.push(Item);
        });
        dispatch({
            type: CONSTANTS.SET_DRAWER_PRICE,
            payload: total
        });
    }
    return {
        type: ''
    };
};

export const saveDesignAsURL = (name: string, designId: ?string) => (dispatch: Function, getState: Function) => {
    const currentState: Object = getState();
    const designID: string = objectPath.get(currentState, 'byo.designID', '');
    const request: ByoSaveDesignUrlRequest = JSON.parse(JSON.stringify(objectPath.get(currentState, 'aem.byoConfig.saveByoUniqueUrl', {})));

    request.payload.designID = designId || designID;
    request.payload.designName = name;
    ApiUtils.makeAjaxRequest(
        request,
        res => {
            dispatch({
                type: CONSTANTS.SET_BYO_UNIQUE_URL,
                payload: objectPath.get(res, 'resultDto.urlUniqueID', '')
            });
        },
        err => {
            dispatch({
                type: CONSTANTS.SAVE_BYO_UNIQUE_URL_FAILURE
            });
        }
    );
    return {
        type: ''
    };
};


export const byoDropAHintReq = (designId: string) => (dispatch: Function, getState: Function) => {
    const currentState: Object = getState();
    const byoSaveDropHintRequest = cloneDeep(objectPath.get(currentState, 'aem.byoConfig.byoCanvasAction.dropaHint.designData', {}));

    byoSaveDropHintRequest.url = byoSaveDropHintRequest.url.replace('{{designId}}', designId);
    byoSaveDropHintRequest.url = byoSaveDropHintRequest.url.replace('{{regionCode}}', window.tiffany.regionCode);
    byoSaveDropHintRequest.url = byoSaveDropHintRequest.url.replace('{{locale}}', window.tiffany.locale);

    ApiUtils.makeAjaxRequest(
        byoSaveDropHintRequest,
        res => {
            dispatch({
                type: CONSTANTS.BYO_DROP_A_HINT_RESPONSE,
                payload: res
            });
        },
        err => {
            dispatch({
                type: CONSTANTS.BYO_DROP_A_HINT_RESPONSE_ERROR
            });
        }
    );
};

export const saveDesign = (name: string = '', addTobag: boolean = false, isDropHintSave: boolean = false) => (dispatch: Function, getState: Function) => {
    const currentState: Object = getState();
    const cookieName: string = objectPath.get(currentState, 'aem.sessionCookieName', 'mysid2');
    const request: ByoSaveDesignRequest = JSON.parse(JSON.stringify(objectPath.get(currentState, 'aem.byoConfig.saveByoRequest', {})));
    const designID: string = objectPath.get(currentState, 'byo.designID', '');
    const webCustomerID: string = cookieUtil.getCookies(cookieName) || '';
    const isClaspRequired: boolean = objectPath.get(currentState, 'byo.isClaspEnabled', false);
    const claspSku: string | boolean = objectPath.get(currentState, 'byo.claspDetails.sku', false);
    const itemTypeId = objectPath.get(currentState, 'aem.byoConfig.gridRequest.payload.ByoItemType', '');
    const mountTypeId = objectPath.get(window, 'tiffany.authoredContent.byoConfig.claspMountTypeId', '');
    const selectedChainMountTypes = objectPath.get(currentState, 'byo.selectedFixture.mountTypes', []);

    if (!designID) {
        delete request.payload.designID;
    } else {
        request.payload.designID = designID;
    }
    request.payload.webCustomerId = webCustomerID;
    if (currentState.byo.drawerData.length > 0) {
        currentState.byo.drawerData.forEach(item => {
            const Item = {};

            if (!item.isSilhouette && item.fixturePositions) {
                Item.SKU = item.memberSku || objectPath.get(item, 'sku', '');
                Item.GroupSku = item.sku;
                Item.ItemTypeId = item.itemTypeID;
                Item.SeqNum = 0;
            } else if (item.fixtureIndex !== undefined) {
                Item.ItemTypeId = itemTypeId;
                Item.SeqNum = Number(item.fixtureIndex) + 1;

                if (item.selectedSku) {
                    Item.SKU = item.selectedSku;
                    Item.GroupSku = item.sku;
                } else {
                    Item.SKU = item.sku;
                }

                if (item.hasEngraving && item.selectedEngraving) {
                    let text = '';

                    if (item.selectedEngraving.initialOne) {
                        text += item.selectedEngraving.initialOne;
                    }
                    if (item.selectedEngraving.initialTwo) {
                        text += item.selectedEngraving.initialTwo;
                    }
                    if (item.selectedEngraving.initialThree) {
                        text += item.selectedEngraving.initialThree;
                    }

                    Item.servicing = {
                        itemServiceTypeID: item.selectedEngraving.itemServiceTypeId,
                        text,
                        price: objectPath.get(item, 'selectedEngraving.unitPrice', 0),
                        styleId: item.selectedEngraving.styleCode
                    };
                    Item.isServiceable = 'true';
                    Item.isEngravable = true;
                }

                if (isClaspRequired && claspSku) {
                    Item.MountSKU = claspSku;
                    Item.MountTypeId = parseInt(mountTypeId, 0);
                }

                const commonMountTypes = intersection(item.mountTypes, selectedChainMountTypes);

                if (commonMountTypes && commonMountTypes.length > 0) {
                    Item.MountTypeId = commonMountTypes[0] !== mountTypeId ? commonMountTypes[0] : commonMountTypes[1] || mountTypeId;
                }
            }

            request.payload.Items.Items.push(Item);
        });
    }
    dispatch(toggle(false));
    ApiUtils.makeAjaxRequest(
        request,
        res => {
            toggleMetaRobotTag(true);
            if (!res.resultDto.designID) {
                res.resultDto.designID = designID;
            }
            dispatch(getDrawer(res, false));
            if (addTobag && !currentState.addedToBag) {
                dispatch(addToBag(res.resultDto.designID));
            }
            if (name) {
                dispatch(saveDesignAsURL(name, res.resultDto.designID));
            }
            if (isDropHintSave) {
                dispatch(byoDropAHintReq(res.resultDto.designID));
            }
            dispatch(toggle(true));
            customEventTrigger(window, 'refreshWishlist');
            byoAddtoBagAnalytics(res.resultDto.designID, addTobag);
        },
        err => {
            dispatch({
                type: CONSTANTS.SAVE_BYO_ERROR
            });
            dispatch(toggle(true));
        }
    );
    return {
        type: ''
    };
};

export const addCharmToFixture = (charm: any, index: number, trayIndex: number, fixtureIndex: number, movedUsingAnchor: boolean) => {
    return {
        type: CONSTANTS.ADD_CHARM_TO_FIXTURE,
        payload: {
            charm,
            index,
            trayIndex,
            fixtureIndex,
            movedUsingAnchor
        }
    };
};

export const removeCharmFromTray = (charm: any, index: number) => {
    return {
        type: CONSTANTS.REMOVE_CHARM,
        payload: {
            charm,
            index
        }
    };
};

/**
 * @description Swaps charms on Canvas
 * @param {any} charm Charm that has been dropped
 * @param {numnber} index Index of existing charm to be swapped
 * @param {numnber} movedIndex Index of existing charm to be swapped
 * @returns {void}
 */
export const swapCharmOnFixture = (charm: any, index: number, movedIndex: number) => {
    return {
        type: CONSTANTS.SWAP_CHARMS,
        payload: {
            charm,
            index,
            movedIndex
        }
    };
};

/**
 * @description Moves charms on Canvas to nearnest index or moves back to Tray
 * @param {any} charm Charm that has been dropped
 * @param {numnber} index Index of existing charm to be swapped
 * @param {numnber} trayIndex trayIndex
 * @returns {void}
 */
export const moveCharmToNearestOnFixture = (charm: any, index: number, trayIndex: number) => {
    return {
        type: CONSTANTS.MOVE_NEAREST_CHARMS,
        payload: {
            charm,
            index,
            trayIndex
        }
    };
};

export const toggleCanvas = (toggleCan: boolean) => (dispatch: Function) => {
    dispatch({
        type: CONSTANTS.TOGGLE_CANVAS,
        payload: toggleCan
    });
};

export const chooseFixture = (fixture: any) => {
    return {
        type: CONSTANTS.ADD_FIXTURE,
        payload: fixture
    };
};

export const isBraceletSelected = (status: any) => {
    return {
        type: CONSTANTS.IS_BRACELET,
        payload: status
    };
};

export const editCharmSelected = (status: any, ref: any) => {
    return {
        type: CONSTANTS.IS_EDIT_CHARM,
        payload: {
            status, ref
        }
    };
};

export const selectedcharmOnFixture = (index: number) => {
    return {
        type: CONSTANTS.CHARM_INDEX_FIXTURE,
        payload: index
    };
};

export const showGrid = (show: boolean, selectionDetails: any) => (dispatch: Function) => {
    if (show) {
        dispatch({
            type: CONSTANTS.SHOW_BROWSE_GRID,
            payload: !selectionDetails.fixtureDetails ? {} : {
                ...selectionDetails.fixtureDetails,
                shortDescription: objectPath.get(selectionDetails, 'sizes.shortDescription', objectPath.get(selectionDetails, 'fixtureDetails.shortDescription', '')),
                size: objectPath.get(selectionDetails, 'sizes.linkText', false),
                memberSku: objectPath.get(selectionDetails, 'sizes.memberSku', false)
            }
        });

        if (selectionDetails.fixtureDetails && Object.keys(selectionDetails.fixtureDetails).length > 0) {
            const mediaStichPositions = objectPath.get(selectionDetails, 'fixtureDetails.mediaStichPositions', []);
            const itemMediaSource = objectPath.get(selectionDetails, 'fixtureDetails.prodImageUrlSet', []);
            const itemMediaArr = itemMediaSource.map((i) => {
                i.mediaFileName = i.url;
                return i;
            });
            const itemMedia = {
                itemMedia: itemMediaArr,
                imageUrlFormat: objectPath.get(window, 'tiffany.authoredContent.byoConfig.byoImageData.charm.url', false),
                imagePrefix: objectPath.get(selectionDetails, 'fixtureDetails.imagePath', false)
            };
            const itemMediaStitchPositions = mediaStichPositions.map((i) => {
                i.sequenceNumber = i.seqNum;
                i.xcoordinates = i.xCoords;
                i.ycoordinates = i.yCoords;
                return i;
            });
            const res = {
                resultDto: {
                    itemMediaStitchPositions,
                    itemMedia
                }
            };

            dispatch({
                type: CONSTANTS.FIXTURE_COMPLETE_SUCCESS,
                payload: {
                    res
                }
            });
        }
    }
    return {
        type: CONSTANTS.HIDE_BROWSE_GRID,
        payload: {}
    };
};

export const getSelectedMaterialProducts = (request: any, index: number, isFilterSelection: boolean) => (dispatch: Function) => {
    ApiUtils.makeAjaxRequest(
        request,
        res => {
            dispatch({
                type: CONSTANTS.SELECT_MATERIALS_SUCCESS,
                payload: {
                    res,
                    index,
                    isFilterSelection
                }
            });
        },
        err => {
            dispatch({
                type: CONSTANTS.SELECT_MATERIALS_FAILED
            });
        }
    );
};

export const getByoGroup = (request: any, isSelectedMaterial: any, isComplete: boolean = false) => (dispatch: Function) => {
    ApiUtils.makeAjaxRequest(
        request,
        res => {
            dispatch({
                type: CONSTANTS.BYO_GROUP_SUCCESS,
                payload: {
                    res,
                    isSelectedMaterial,
                    isComplete
                }
            });
        },
        err => {
            dispatch({
                type: CONSTANTS.BYO_GROUP_FAILED
            });
        }
    );
    return true;
};

export const getByoGroupComplete = (request: any) => (dispatch: Function) => {
    ApiUtils.makeAjaxRequest(
        request,
        res => {
            dispatch({
                type: CONSTANTS.BYO_GROUP_COMPLETE_SUCCESS,
                payload: {
                    res
                }
            });
        },
        err => {
            dispatch({
                type: CONSTANTS.BYO_GROUP_COMPLETE_FAILED
            });
        }
    );
    return true;
};

export const getClaspDetails = (request: any) => (dispatch: Function) => {
    ApiUtils.makeAjaxRequest(
        request,
        res => {
            dispatch({
                type: CONSTANTS.CLASP_SUCCESS,
                payload: {
                    res
                }
            });
        },
        err => {
            dispatch({
                type: CONSTANTS.CLASP_FAILED
            });
        }
    );
};

export const setPreviewWidth = (width: number) => {
    return {
        type: CONSTANTS.SET_P_LAYER_WIDTH,
        payload: width / 4
    };
};

export const changeClaspEnabled = (status: any) => {
    return {
        type: CONSTANTS.IS_CLASP_ENABLED,
        payload: status
    };
};

/**
 * @description Will add charm to the tray
 * @param {Object} charm The charm object
 * @param {Object} [variation = false] The variation object
 * @param {*} [engraving = false] The personalization/engraving object
 * @returns {Object} The Action Object
 */
export const addCharm = (charm: any, variation: any = false) => {
    const {
        mountTypes,
        crop,
        imageURL,
        transparentURL,
        claspURL,
        colpoTransparentURL,
        colpoClaspURL,
        name,
        price,
        sharpen,
        sharpenL,
        sku,
        title,
        isPurchasable,
        isLowInventory,
        isEngravable,
        itemTypeID,
        groupItems
    } = charm;
    let selectedSku = '';

    if (variation) {
        selectedSku = objectPath.get(variation, 'selectedVariation.memberSku', '');
    } else {
        selectedSku = objectPath.get(charm, 'defaultSku', false) ? objectPath.get(charm, 'defaultSku', false) : objectPath.get(charm, 'selectedSku', false);
    }

    return {
        type: CONSTANTS.ADD_CHARM,
        payload: {
            mountTypes,
            crop,
            imageURL,
            transparentURL,
            claspURL,
            name,
            price,
            sharpen,
            sharpenL,
            sku,
            selectedSku,
            title,
            isPurchasable,
            isLowInventory,
            itemTypeID,
            hasVariation: !!variation,
            hasEngraving: !!isEngravable,
            variation,
            colpoTransparentURL,
            colpoClaspURL,
            groupItems,
            time: new Date().getTime()
        }
    };
};

/**
 * @description Will add charm to the tray
 * @param {Object} charm The charm object
 * @param {*} [engraving = false] The personalization/engraving object
 * @returns {Object} The Action Object
 */
export const editCharm = (charm: any) => {
    const {
        mountTypes,
        crop,
        imageURL,
        transparentURL,
        claspURL,
        colpoTransparentURL,
        colpoClaspURL,
        name,
        price,
        sharpen,
        sharpenL,
        sku,
        title,
        isPurchasable,
        isLowInventory,
        isEngravable,
        hasEngraving,
        itemTypeID,
        groupItems
    } = charm;

    let selectedSku = '';

    if (charm.variation) {
        selectedSku = objectPath.get(charm.variation, 'selectedVariation.memberSku', '');
    } else {
        selectedSku = objectPath.get(charm, 'defaultSku', false) ? objectPath.get(charm, 'defaultSku', false) : objectPath.get(charm, 'selectedSku', false);
    }

    return {
        type: CONSTANTS.EDIT_CHARM,
        payload: {
            mountTypes,
            crop,
            imageURL,
            transparentURL,
            claspURL,
            colpoTransparentURL,
            colpoClaspURL,
            name,
            price,
            sharpen,
            sharpenL,
            sku,
            title,
            isPurchasable,
            isLowInventory,
            itemTypeID,
            hasVariation: true,
            hasEngraving: hasEngraving || !!isEngravable,
            variation: charm.variation,
            groupItems,
            selectedSku,
            time: new Date().getTime()
        }
    };
};

export const getFixtureComplete = (request: any) => (dispatch: Function) => {
    ApiUtils.makeAjaxRequest(
        request,
        res => {
            dispatch({
                type: CONSTANTS.FIXTURE_COMPLETE_SUCCESS,
                payload: {
                    res
                }
            });
        },
        err => {
            dispatch({
                type: CONSTANTS.FIXTURE_COMPLETE_FAILED
            });
        }
    );
    return true;
};

export const removeCharmFromFixture = (fixtureIndex: number) => {
    return {
        type: CONSTANTS.REMOVE_CHARM_ON_FIXTURE,
        payload: fixtureIndex
    };
};

export const removeFixture = () => (dispatch: Function) => {
    dispatch({
        type: CONSTANTS.REMOVE_FIXTURE
    });
};

export const addChainModal = (status: any, ref: any) => {
    return {
        type: CONSTANTS.ADD_CHAIN,
        payload: {
            status, ref
        }
    };
};

export const setCharmMoveIndex = (index: number) => {
    return {
        type: CONSTANTS.MOVE_CHARM_INDEX,
        payload: index
    };
};

export const clearCharmMoveIndex = () => {
    return {
        type: CONSTANTS.CLEAR_MOVE_CHARM_INDEX
    };
};

export const getCharmVariation = (groupCompleteRequest: any, membersku: any, fixtureIndex: any) => (dispatch: Function) => {
    ApiUtils.makeAjaxRequest(groupCompleteRequest, res => {
        const response = objectPath.get(res, 'resultDto', {});
        const groupItem = response.groupItems.find((item) => { return item.memberSku === membersku.toString(); });

        dispatch({
            type: CONSTANTS.BYO_ADD_GROUP_TO_CHARM,
            payload: {
                fixtureIndex,
                groupItems: response.groupItems,
                selectedVariation: groupItem,
                type: response.groupAttributes.groupDropDownLabel ? response.groupAttributes.groupDropDownLabel.toLowerCase().split(' ').join('_') : ''
            }
        });
    }, err => {
    });
};


const getDesignData = (uniqueID, isUrlUniqueId, dispatch) => {
    const request = JSON.parse(JSON.stringify(objectPath.get(window, 'tiffany.authoredContent.byoConfig.getByoRequest', {})));
    const requestPayload = JSON.parse(JSON.stringify(objectPath.get(window, 'tiffany.authoredContent.onHoverProductTileConfig.productPayload', {})));
    const groupComplete = JSON.parse(JSON.stringify(objectPath.get(window, 'tiffany.authoredContent.byoConfig.groupRequest', {})));

    if (isUrlUniqueId) {
        request.payload.urlUniqueID = uniqueID;
        delete request.payload.designID;
    } else {
        request.payload.designID = uniqueID;
        delete request.payload.urlUniqueID;
    }

    ApiUtils.makeAjaxRequest(
        request,
        res => {
            const products = getBYOCanvasData(res.resultDto);

            Object.keys(products.charms).forEach(key => {
                if (products.charms[key].groupSku) {
                    const charm = products.charms[key];

                    requestPayload.Sku = charm.groupSku;
                    groupComplete.payload = requestPayload;
                    dispatch(getCharmVariation(groupComplete, charm.sku, key));
                }
            });
            const fixture = objectPath.get(products, 'fixture', {});
            const charms = objectPath.get(products, 'charms', []);
            const braceletProductTypeDescription = objectPath.get(window, 'tiffany.authoredContent.byoConfig.productTypeDescription', false);

            if (fixture.productTypeDescription === braceletProductTypeDescription) {
                dispatch({
                    type: CONSTANTS.IS_BRACELET,
                    payload: true
                });
            }

            if (Object.keys(charms).length && charms[Object.keys(charms)[0]].isClaspingRing) {
                dispatch({
                    type: CONSTANTS.IS_CLASP_ENABLED,
                    payload: true
                });
            }

            dispatch({
                type: CONSTANTS.GET_BYO_CREATION,
                payload: products
            });
        },
        err => {
            dispatch({
                type: CONSTANTS.SAVE_BYO_ERROR
            });
        }
    );
    return {
        type: ''
    };
};

const itemComplete = (sku: any, dispatch: Function) => {
    const requestPayload = objectPath.get(window, 'tiffany.authoredContent.onHoverProductTileConfig.productPayload', {});
    const imageURL = objectPath.get(window, 'tiffany.authoredContent.onHoverProductTileConfig.imageUrl', {});
    const mediaTypeID = objectPath.get(window, 'tiffany.authoredContent.byoConfig.charmMediaTypeId', 0);
    const colpoMediaTypeID = objectPath.get(window, 'tiffany.authoredContent.byoConfig.colpoMediaTypeId', 0);
    const mediaPreset = objectPath.get(window, 'tiffany.authoredContent.byoConfig.charmImagePreset', 0);
    const queryParam = objectPath.get(window, 'tiffany.authoredContent.byoConfig.charmImageQueryParam', '');
    const claspParam = objectPath.get(window, 'tiffany.authoredContent.byoConfig.charmImageClaspQueryParam', '');
    const colpoParam = objectPath.get(window, 'tiffany.authoredContent.byoConfig.colpoImageClaspQueryParam', '');
    const itemCompleteReq = objectPath.get(window, 'tiffany.authoredContent.itemCompleteServiceConfig', {});

    requestPayload.Sku = sku;
    itemCompleteReq.payload = requestPayload;

    ApiUtils.makeAjaxRequest(itemCompleteReq, res => {
        let charm = getBYOItemCompleteProductsToTray(res.resultDto, PRODUCT_CONSTANTS.TYPE.ITEM_COMPLETE, imageURL);

        charm = {
            ...charm,
            transparentURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, mediaTypeID, charm.itemMedia.itemMedia, queryParam),
            claspURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, mediaTypeID, charm.itemMedia.itemMedia, queryParam) + claspParam,
            colpoTransparentURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, colpoMediaTypeID, charm.itemMedia.itemMedia, queryParam),
            colpoClaspURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, colpoMediaTypeID, charm.itemMedia.itemMedia, queryParam) + colpoParam
        };

        dispatch(addCharm(charm, false));
    }, err => {
    });
};

const groupComplete = (sku: any, membersku: any, dispatch: Function) => {
    const requestPayload = objectPath.get(window, 'tiffany.authoredContent.onHoverProductTileConfig.productPayload', {});
    const imageURL = objectPath.get(window, 'tiffany.authoredContent.onHoverProductTileConfig.imageUrl', {});
    const mediaTypeID = objectPath.get(window, 'tiffany.authoredContent.byoConfig.charmMediaTypeId', 0);
    const colpoMediaTypeID = objectPath.get(window, 'tiffany.authoredContent.byoConfig.colpoMediaTypeId', 0);
    const mediaPreset = objectPath.get(window, 'tiffany.authoredContent.byoConfig.charmImagePreset', 0);
    const queryParam = objectPath.get(window, 'tiffany.authoredContent.byoConfig.charmImageQueryParam', '');
    const claspParam = objectPath.get(window, 'tiffany.authoredContent.byoConfig.charmImageClaspQueryParam', '');
    const colpoParam = objectPath.get(window, 'tiffany.authoredContent.byoConfig.colpoImageClaspQueryParam', '');
    const groupCompleteReq = objectPath.get(window, 'tiffany.authoredContent.groupCompleteServiceConfig', {});

    requestPayload.Sku = sku;
    groupCompleteReq.payload = requestPayload;

    ApiUtils.makeAjaxRequest(groupCompleteReq, res => {
        let charm = getBYOGroupCompleteProductsToTray(res.resultDto, membersku, PRODUCT_CONSTANTS.TYPE.GROUP_COMPLETE, imageURL);

        charm = {
            ...charm,
            transparentURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, mediaTypeID, charm.itemMedia.itemMedia, queryParam),
            claspURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, mediaTypeID, charm.itemMedia.itemMedia, queryParam) + claspParam,
            colpoTransparentURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, colpoMediaTypeID, charm.itemMedia.itemMedia, queryParam),
            colpoClaspURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, colpoMediaTypeID, charm.itemMedia.itemMedia, queryParam) + colpoParam
        };

        const variation = {
            selectedVariation: charm.selectedVariation,
            type: charm.type ? charm.type.toLowerCase().split(' ').join('_') : ''
        };

        dispatch({
            type: HOVER.BYO_GROUP_COMPLETE_SUCCESS,
            payload: {
                products: charm
            }
        });

        dispatch(addCharm(charm, variation));
    }, err => {
    });
};

const chainItemComplete = (params, dispatch) => {
    const requestPayload = objectPath.get(window, 'tiffany.authoredContent.onHoverProductTileConfig.productPayload', {});
    const itemCompleteReq = objectPath.get(window, 'tiffany.authoredContent.itemCompleteServiceConfig', {});

    if (params.membersku) {
        requestPayload.Sku = params.membersku;
    } else {
        requestPayload.Sku = params.sku;
    }
    itemCompleteReq.payload = requestPayload;

    ApiUtils.makeAjaxRequest(itemCompleteReq, res => {
        let products = getBYOItemCompleteChainToTray(res.resultDto, params.sku, params.size, params.membersku);

        products = {
            ...products,
            isGroup: true,
            isSilhouette: false
        };

        dispatch({
            type: CONSTANTS.SHOW_BROWSE_GRID,
            payload: products
        });
        dispatch({
            type: CONSTANTS.FIXTURE_COMPLETE_SUCCESS,
            payload: {
                res
            }
        });
    }, err => {
    });
};

export const acknowledgeByoAHint = () => (dispatch: Function, getState: Function) => {
    const currentState: any = getState();
    const byoDropHintSaveConfig = objectPath.get(currentState, 'aem.byoConfig.byoSaveDropHintRequest', { payload: {} });
    const cookieName = objectPath.get(currentState, 'aem.sessionCookieName', 'mysid2');
    const webCustomerID = cookieUtil.getCookies(cookieName) || '';

    byoDropHintSaveConfig.payload.webCustomerId = webCustomerID;
    byoDropHintSaveConfig.payload.designID = objectPath.get(currentState, 'aem.byoConfig.designId', '');

    ApiUtils.makeAjaxRequest(byoDropHintSaveConfig, res => {
        dispatch({
            type: CONSTANTS.DROP_HINT_RECEIVED
        });
    }, err => {
    });
};

export const byoLanding = () => (dispatch: Function) => {
    const params = queryString.parse(window.location.search);
    const chainItemMedia = objectPath.get(window, 'tiffany.authoredContent.byoConfig.chainItemTypeId', 1);
    const charmItemMedia = objectPath.get(window, 'tiffany.authoredContent.byoConfig.charmItemTypeId', 2);
    const designId = objectPath.get(window, 'tiffany.authoredContent.byoConfig.designId', false);
    const urlUniqueId = objectPath.get(window, 'tiffany.authoredContent.byoConfig.urlUniqueId', false);
    const uniqueId = !designId ? urlUniqueId : designId;
    const claspRequest = objectPath.get(window, 'tiffany.authoredContent.byoConfig.claspRequest', false);

    if (params.sku || uniqueId) {
        dispatch(getClaspDetails(claspRequest));
        dispatch({
            type: CONSTANTS.BYO_CUSTOM_LANDING
        });
        if (params.isDropAHint && params.isDropAHint === 'true') {
            dispatch(acknowledgeByoAHint());
        }
        if (params.itemTypeID === chainItemMedia.toString()) {
            chainItemComplete(params, dispatch);
            if (params.isBracelet && Boolean(params.isBracelet)) {
                dispatch({
                    type: CONSTANTS.IS_BRACELET,
                    payload: true
                });
            }
        } else if (params.itemTypeID === charmItemMedia.toString()) {
            dispatch(showGrid(true, {}));
            if (params.sku.match(/GRP/)) {
                groupComplete(params.sku, params.membersku, dispatch);
            } else {
                itemComplete(params.sku, dispatch);
            }
        } else if (uniqueId) {
            getDesignData(uniqueId, !!urlUniqueId, dispatch);
        }
    } else {
        dispatch({
            type: CONSTANTS.BYO_DEFAULT_LANDING
        });
    }
};

export const chainAvailability = (available: Boolean) => (dispatch: Function) => {
    dispatch({
        type: CONSTANTS.SELECT_MATERIALS_VISIBLE,
        payload: !available
    });
};

export const startOver = () => {
    return {
        type: CONSTANTS.START_OVER
    };
};

export const ctxClicked = () => {
    return {
        type: CONSTANTS.CTX_CLICKED
    };
};

export const setCharmEngravingIndex = (index: number) => {
    return {
        type: CONSTANTS.SET_ENGRAVING_INDEX,
        index
    };
};

export const clearCharmEngravingIndex = () => {
    return {
        type: CONSTANTS.CLEAR_ENGRAVING_INDEX
    };
};

export const saveEngraving = (selectedEngraving: any) => (dispatch: Function, getState: Function) => {
    dispatch({
        type: CONSTANTS.SAVE_ENGRAVING_BYO,
        selectedEngraving
    });
};

export const clearDropAHint = () => (dispatch: Function, getState: Function) => {
    dispatch({
        type: CONSTANTS.CLEAR_DROP_A_HINT
    });
};

export const OnByoHoverProductDetails = (options: Object, index: any) => (dispatch: Function, getState: Function) => {
    const currentState: any = getState();
    const product = objectPath.get(currentState, `filters.products.${index}`, {});
    const products = getByoItemData(product, options.imageUrl);

    dispatch({
        type: HOVER.ITEM_GROUP_COMPLETE_SUCCESS,
        payload: {
            products,
            index
        }
    });
};

export const toggleMaxCharm = (flag: boolean) => (dispatch: Function) => {
    if (flag) {
        dispatch({
            type: CONSTANTS.SHOW_MAX_CHARM
        });
        return;
    }
    dispatch({
        type: CONSTANTS.HIDE_MAX_CHARM
    });
};
