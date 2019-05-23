import CONSTANTS from 'constants/BYOConstants';
import FC from 'constants/FlyoutConstants';
import AEM_CONSTANTS from 'constants/AemConstants';
import * as objectPath from 'object-path';
import { getProductFromByo, getFixtureImageURL } from 'lib/utils/format-data';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';

import { addCharmToTrayAnalytics, updateTrayChainAnalytics, removeCharmFromFixtureAnalytics } from 'lib/utils/analytics-util';

const silhoutte = objectPath.get(window, 'tiffany.authoredContent.byoConfig.silhoutte');
const designId = objectPath.get(window, 'tiffany.authoredContent.byoConfig.designId', undefined);

const initialState = {
    isTrayReady: false,
    selectedFixture: silhoutte,
    silhoutteConst: silhoutte,
    charmsTray: [],
    charmsOnFixture: {},
    selectedMaterials: [],
    byoGroupDetails: [],
    claspDetails: {},
    isBracelet: false,
    byoEditMode: false,
    previewWidth: null,
    showBrowseGrid: null,
    selectedCharmMountTypes: [],
    selectedMaterialSku: false,
    isClaspEnabled: false,
    drawerData: [],
    saveData: null,
    showAddChain: false,
    addChainRef: null,
    showEditCharm: false,
    editCharmRef: null,
    charmIndexOnFix: null,
    selectedCharmMoveIndex: null,
    byoSelectMaterialItemComplete: null,
    urlUniqueID: false,
    isSelectedMaterialFailed: false,
    isSavedToWish: false,
    isCtxClicked: false,
    addedToBag: false,
    currentEngravingCharm: null,
    currentEngravingIndex: null,
    dropHint: {},
    designID: designId,
    showMaxCharmMessage: false
};

/**
 * @description Will update drawer object
 * @param {*} newState the new state object
 * @returns {any} new state
 */
function updateDrawer(newState) {
    const charmsOnFixture = [];

    Object.keys(newState.charmsOnFixture).forEach(key => {
        if (newState.charmsOnFixture[key]) {
            const charm = newState.charmsOnFixture[key];

            charm.fixtureIndex = key;
            charmsOnFixture.push(charm);
        }
    });
    newState.drawerData = [newState.selectedFixture].concat(charmsOnFixture);
    updateTrayChainAnalytics(newState);
    return newState;
}

/**
 * @description BYO reducer
 * @param {*} state Redux state for reducer
 * @param {*} action The action that triggered the reducer
 * @returns {*} new state
 * @todo Remove the check for max charms
 */
export default function index(state = initialState, action) {
    // let fixturePositions = [];
    const newState = JSON.parse(JSON.stringify(state));

    switch (action.type) {
        case CONSTANTS.ADD_CHARM: {
            let updatedMountTypes = newState.selectedCharmMountTypes;

            if (state.selectedCharmMountTypes.length > 0) {
                action.payload.mountTypes.forEach(mountType => {
                    if (!state.selectedCharmMountTypes.indexOf(mountType) > -1) {
                        updatedMountTypes.push(mountType);
                        newState.selectedMaterials = [];
                    }
                });
                updatedMountTypes = uniqBy(updatedMountTypes);
            } else {
                updatedMountTypes = action.payload.mountTypes;
                newState.selectedMaterials = [];
            }

            newState.charmsTray = [action.payload, ...state.charmsTray];
            newState.selectedCharmMountTypes = updatedMountTypes;
            addCharmToTrayAnalytics(action.payload, newState);

            return updateDrawer(newState);
        }
        case CONSTANTS.EDIT_CHARM: {
            let updatedMountTypes = newState.selectedCharmMountTypes;
            const charmIndex = newState.charmIndexOnFix;

            if (state.selectedCharmMountTypes.length > 0) {
                action.payload.mountTypes.forEach(mountType => {
                    if (!state.selectedCharmMountTypes.indexOf(mountType) > -1) {
                        updatedMountTypes.push(mountType);
                        newState.selectedMaterials = [];
                    }
                });
                updatedMountTypes = uniqBy(updatedMountTypes);
            } else {
                updatedMountTypes = action.payload.mountTypes;
                newState.selectedMaterials = [];
            }
            newState.charmsOnFixture[charmIndex] = action.payload;
            newState.selectedCharmMountTypes = updatedMountTypes;

            return updateDrawer(newState);
        }
        case CONSTANTS.CLEAR_CHARMS:
            newState.charmsTray = [];

            return updateDrawer(newState);
        case CONSTANTS.REMOVE_CHARM:
            newState.charmsTray.splice(action.payload.index, 1);
            if (!newState.charmsTray.length > 0) {
                newState.selectedCharmMountTypes = [];
                newState.selectedMaterials = [];
            }
            return {
                ...newState,
                charmsTray: newState.charmsTray
            };
        case CONSTANTS.ADD_FIXTURE:
            newState.selectedFixture = {
                ...action.payload
            };
            return updateDrawer(newState);
        case CONSTANTS.REMOVE_FIXTURE:
            newState.selectedFixture = silhoutte;
            newState.isClaspEnabled = false;
            return updateDrawer(newState);
        case CONSTANTS.IS_CLASP_ENABLED:
            newState.isClaspEnabled = action.payload;
            return newState;
        case CONSTANTS.CHARM_INDEX_FIXTURE:
            newState.charmIndexOnFix = action.payload;
            return newState;
        case CONSTANTS.ADD_CHARM_TO_FIXTURE:
            // Object.keys(newState.charmsOnFixture).forEach(key => {
            //     if (newState.charmsOnFixture[key].sku === action.payload.charm.sku) {
            //         delete newState.charmsOnFixture[key];
            //     }
            // });
            newState.charmsOnFixture[action.payload.index] = action.payload.charm;
            // newState.charmsTray = newState.charmsTray.filter(charm => charm.sku !== action.payload.charm.sku);
            if (action.payload.trayIndex !== undefined) {
                newState.charmsTray.splice(action.payload.trayIndex, 1);
            } else if (action.payload.fixtureIndex !== undefined) {
                delete newState.charmsOnFixture[action.payload.fixtureIndex];
            }
            if (action.payload.movedUsingAnchor) {
                newState.selectedCharmMoveIndex = null;
            }
            return updateDrawer(newState);
        case CONSTANTS.SWAP_CHARMS:
            newState.charmTobeReplaced = JSON.parse(JSON.stringify(newState.charmsOnFixture[action.payload.index]));
            // Object.keys(newState.charmsOnFixture).forEach(key => {
            //     if (newState.charmsOnFixture[key].sku === action.payload.charm.sku) {
            //         newState.movedCharmIndex = key;
            //     }
            // });
            newState.charmsOnFixture[action.payload.movedIndex] = newState.charmTobeReplaced;
            newState.charmsOnFixture[action.payload.index] = action.payload.charm;
            // newState.movedCharmIndex = undefined;
            newState.selectedCharmMoveIndex = null;
            delete newState.charmTobeReplaced;
            return updateDrawer(newState);
        case CONSTANTS.MOVE_NEAREST_CHARMS: {
            const availablePositions = [];
            const currentIndex = action.payload.index;
            let closest;

            for (let x = 0; x < newState.selectedFixture.maxCharmsAllowed; x += 1) {
                if (!newState.charmsOnFixture[x]) {
                    availablePositions.push(x);
                }
            }

            if (availablePositions.length > 0) {
                closest = availablePositions.reduce((prev, curr) => {
                    return (Math.abs(curr - currentIndex) < Math.abs(prev - currentIndex) ? curr : prev);
                });
            }

            const droppedCharm = action.payload.charm;
            const currentCharm = JSON.parse(JSON.stringify(newState.charmsOnFixture[currentIndex]));

            newState.charmsOnFixture[currentIndex] = droppedCharm;
            newState.charmsTray.splice(action.payload.trayIndex, 1);
            if (closest !== undefined) {
                newState.charmsOnFixture[closest] = currentCharm;
            } else {
                newState.charmsTray = [currentCharm, ...newState.charmsTray];
            }
            // newState.charmsTray = newState.charmsTray.filter(charm => charm.sku !== action.payload.charm.sku);
            return updateDrawer(newState);
        }
        case CONSTANTS.SELECT_MATERIALS_SUCCESS: {
            const selectedBtnIndex = action.payload.index;
            const resProducts = objectPath.get(action.payload, 'res.resultDto.products', []);
            const products = resProducts.map(product => {
                const transformedProduct = getProductFromByo(product);

                return {
                    ...product,
                    ...transformedProduct
                };
            });
            const materialFilters = objectPath.get(action.payload, 'res.resultDto.dimensions', []).map(filterDimension => {
                if (filterDimension.endecaDimensionId === objectPath.get(window, 'tiffany.authoredContent.byoConfig.materialDimensionId', 5)) {
                    return filterDimension;
                }
                return {};
            }).filter((updatedDimension) => Object.keys(updatedDimension).length > 0);
            const materials = state.selectedMaterials;

            materials[selectedBtnIndex] = {
                products,
                materialFilters,
                index: selectedBtnIndex,
                isFilterSelection: action.payload.isFilterSelection
            };
            return {
                ...state,
                isSelectedMaterialFailed: false,
                selectedMaterials: materials
            };
        }
        case CONSTANTS.TOGGLE_CANVAS:
            return {
                ...state,
                byoEditMode: action.payload
            };
        case CONSTANTS.IS_BRACELET:
            return {
                ...state,
                isBracelet: action.payload
            };
        case CONSTANTS.IS_EDIT_CHARM:
            return {
                ...state,
                editCharmRef: (action.payload.status ? action.payload.ref : null),
                showEditCharm: action.payload.status
            };
        case CONSTANTS.BYO_GROUP_SUCCESS: {
            if (!action.payload.isComplete) {
                const response = action.payload.res.resultDto;

                if (response.groupItems) {
                    const updatedItems = orderBy(response.groupItems, 'displayOrder', 'asc').filter((item) => !item.isLowInventory);

                    response.groupItems = updatedItems;
                }
                newState.byoGroupDetails = newState.byoGroupDetails.concat([response]);

                if (action.payload.isSelectedMaterial) {
                    newState.selectedMaterialSku = objectPath.get(response, 'group.sku', false);
                }
                newState.byoSelectMaterialItemComplete = null;
            } else {
                const response = action.payload.res.resultDto;

                newState.byoSelectMaterialItemComplete = response;
            }
            return newState;
        }
        case CONSTANTS.SET_P_LAYER_WIDTH:
            return {
                ...state,
                previewWidth: action.payload
            };
        case CONSTANTS.CLASP_SUCCESS:
            return {
                ...state,
                claspDetails: action.payload.res
            };
        case CONSTANTS.SHOW_BROWSE_GRID: {
            newState.showBrowseGrid = true;
            newState.selectedMaterialSku = false;
            newState.previewWidth = 0;
            newState.selectedMaterials = [];
            if (Object.keys(action.payload).length > 0) {
                newState.selectedFixture = action.payload;
            }
            return updateDrawer(newState);
        }
        case CONSTANTS.HIDE_BROWSE_GRID:
            return {
                ...state,
                showBrowseGrid: false
            };
        case CONSTANTS.ADD_CHAIN:
            newState.addChainRef = (action.payload.status ? action.payload.ref : null);
            newState.showAddChain = action.payload.status;
            return updateDrawer(newState);
        case CONSTANTS.FIXTURE_COMPLETE_SUCCESS: {
            const itemMediaStitchPositions = objectPath.get(action.payload.res, 'resultDto.itemMediaStitchPositions', []);
            const imagePrefix = objectPath.get(action.payload.res, 'resultDto.itemMedia.imagePrefix', []);
            const imageUrlFormat = objectPath.get(action.payload.res, 'resultDto.itemMedia.imageUrlFormat', []);
            const itemMedia = objectPath.get(action.payload.res, 'resultDto.itemMedia.itemMedia', []);
            const mediaTypeID = objectPath.get(window, 'tiffany.authoredContent.byoConfig.fixtureMediaTypeId', 0);
            const mediaPreset = objectPath.get(window, 'tiffany.authoredContent.byoConfig.fixtureImagePreset', 0);
            const queryParam = objectPath.get(window, 'tiffany.authoredContent.byoConfig.fixtureImageQueryParam', '');
            const item = objectPath.get(action.payload.res, 'item', {});

            itemMediaStitchPositions.sort((a, b) => {
                if (a.mediaId < b.mediaId) {
                    return -1;
                }
                if (a.mediaId > b.mediaId) {
                    return 1;
                }
                return 0;
            });
            if (itemMediaStitchPositions.length > 6) {
                itemMediaStitchPositions.splice(6, itemMediaStitchPositions.length - 1);
            }
            itemMediaStitchPositions.sort((a, b) => {
                if (a.sequenceNumber < b.sequenceNumber) {
                    return -1;
                }
                if (a.sequenceNumber > b.sequenceNumber) {
                    return 1;
                }
                return 0;
            });
            const fixturePositions = itemMediaStitchPositions.map(position => {
                return [position.xcoordinates, position.ycoordinates];
            });

            newState.selectedFixture.imageURL = getFixtureImageURL(imageUrlFormat, mediaPreset, imagePrefix, mediaTypeID, itemMedia, queryParam);
            newState.selectedFixture.fixturePositions = fixturePositions;
            newState.selectedFixture.maxCharmsAllowed = fixturePositions.length;
            if (item.isPurchasable !== undefined) {
                newState.selectedFixture.isPurchasable = item.isPurchasable;
            }

            const maxCharms = newState.selectedFixture.maxCharmsAllowed;
            const charmsOnFixture = Object.keys(newState.charmsOnFixture);

            // fallback charms into tray if hotspots of newly selected chain are less
            if (charmsOnFixture.length > maxCharms) {
                charmsOnFixture.forEach(key => {
                    if (newState.charmsOnFixture[key]) {
                        newState.charmsTray = [newState.charmsOnFixture[key], ...newState.charmsTray];
                    }
                });
                newState.charmsOnFixture = {};
                return updateDrawer(newState);
            }
            if ((charmsOnFixture.length > 0) && (charmsOnFixture.length <= maxCharms)) {
                const tempCharmsOnFixture = {};

                charmsOnFixture.forEach(indexOfCharm => {
                    if (newState.charmsOnFixture[indexOfCharm]) {
                        for (let x = 0; x < maxCharms; x += 1) {
                            if (!tempCharmsOnFixture[x]) {
                                tempCharmsOnFixture[x] = newState.charmsOnFixture[indexOfCharm];
                                break;
                            }
                        }
                    }
                });
                newState.charmsOnFixture = tempCharmsOnFixture;
                return updateDrawer(newState);
            }
            return updateDrawer(newState);
        }
        case CONSTANTS.REMOVE_CHARM_ON_FIXTURE:
            newState.charmsTray = [newState.charmsOnFixture[action.payload], ...newState.charmsTray];
            removeCharmFromFixtureAnalytics(newState.charmsOnFixture[action.payload], newState);
            delete newState.charmsOnFixture[action.payload];
            return updateDrawer(newState);
        case CONSTANTS.SAVE_BYO_SUCCESS:
            newState.isSavedToWish = true;
            newState.designID = objectPath.get(action.payload, 'designID', false);
            newState.saveData = objectPath.get(action.payload, 'res.resultDto', false);
            return updateDrawer(newState);
        case CONSTANTS.MOVE_CHARM_INDEX:
            newState.selectedCharmMoveIndex = action.payload;
            return updateDrawer(newState);
        case CONSTANTS.CLEAR_MOVE_CHARM_INDEX:
            newState.selectedCharmMoveIndex = null;
            return newState;
        case CONSTANTS.SET_DRAWER_PRICE:
            newState.isSavedToWish = false;
            newState.saveData = { price: action.payload, itemPrice: action.payload };
            return newState;
        case CONSTANTS.SET_BYO_UNIQUE_URL:
            newState.urlUniqueID = action.payload;
            return newState;
        case CONSTANTS.SELECT_MATERIALS_FAILED:
            newState.isSelectedMaterialFailed = true;
            return newState;
        case CONSTANTS.SELECT_MATERIALS_VISIBLE:
            newState.isSelectedMaterialFailed = action.payload;
            return newState;
        case CONSTANTS.GET_BYO_CREATION: {
            const { charms } = action.payload;
            const selectedMountTypes = [];

            Object.keys(charms).forEach(key => {
                charms[key].mountTypes.forEach((i) => {
                    if (selectedMountTypes.indexOf(i) === -1) {
                        selectedMountTypes.push(i);
                    }
                });
            });

            newState.byoEditMode = true;
            newState.selectedFixture = action.payload.fixture;
            newState.charmsOnFixture = charms;
            newState.saveData = { price: action.payload.price, itemPrice: action.payload.itemPrice };
            newState.drawerData = action.payload.items.items;
            newState.selectedCharmMountTypes = selectedMountTypes;
            newState.previewWidth = 0;

            return updateDrawer(newState);
        }
        case AEM_CONSTANTS.INVALID_COOKIE_RESET: {
            return { ...newState, designID: undefined, isSavedToWish: false };
        }
        case CONSTANTS.START_OVER:
            return {
                isTrayReady: false,
                selectedFixture: silhoutte,
                silhoutteConst: silhoutte,
                charmsTray: [],
                charmsOnFixture: {},
                selectedMaterials: [],
                byoGroupDetails: [],
                claspDetails: {},
                isBracelet: false,
                byoEditMode: false,
                previewWidth: null,
                showBrowseGrid: false,
                selectedCharmMountTypes: [],
                selectedMaterialSku: false,
                isClaspEnabled: false,
                drawerData: [],
                saveData: null,
                showAddChain: false,
                addChainRef: null,
                showEditCharm: false,
                editCharmRef: null,
                charmIndexOnFix: null,
                selectedCharmMoveIndex: null,
                byoSelectMaterialItemComplete: null,
                urlUniqueID: false,
                isSelectedMaterialFailed: false,
                isSavedToWish: false
            };
        case CONSTANTS.CTX_CLICKED:
            newState.isCtxClicked = true;
            return newState;
        case CONSTANTS.BYO_DEFAULT_LANDING:
            newState.showBrowseGrid = false;
            return newState;
        case CONSTANTS.BYO_CUSTOM_LANDING:
            newState.showBrowseGrid = true;
            return newState;
        case CONSTANTS.BYO_ADD_TO_BAG:
            newState.addedToBag = true;
            return newState;
        case CONSTANTS.SET_ENGRAVING_INDEX:
            newState.currentEngravingCharm = newState.charmsOnFixture[action.index];
            newState.currentEngravingIndex = action.index;
            return newState;
        case CONSTANTS.SAVE_ENGRAVING_BYO:
            newState.charmsOnFixture[newState.currentEngravingIndex].selectedEngraving = action.selectedEngraving;
            newState.charmsOnFixture[newState.currentEngravingIndex].time = new Date().getTime();
            newState.currentEngravingCharm = null;
            newState.currentEngravingIndex = null;
            return updateDrawer(newState);
        case CONSTANTS.BYO_ADD_GROUP_TO_CHARM: {
            const fixture = state.charmsOnFixture[action.payload.fixtureIndex];

            fixture.groupItems = action.payload.groupItems;
            fixture.variation = {
                selectedVariation: action.payload.selectedVariation,
                type: action.payload.type
            };
            newState.charmsOnFixture[action.payload.fixtureIndex] = fixture;
            return updateDrawer(newState);
        }
        case CONSTANTS.BYO_DROP_A_HINT_RESPONSE: {
            newState.dropHint = action.payload;
            return newState;
        }
        case CONSTANTS.CLEAR_DROP_A_HINT: {
            newState.dropHint = {};
            return newState;
        }
        case CONSTANTS.CLEAR_ENGRAVING_INDEX:
            newState.currentEngravingCharm = null;
            newState.currentEngravingIndex = null;
            return updateDrawer(newState);
        case CONSTANTS.BYO_WISHLIST_SILHOUETTE:
            newState.isSavedToWish = true;
            return updateDrawer(newState);
        case FC.CUSTOM_WISHLIST_REMOVED: {
            const designID = objectPath.get(action.payload, 'designID', false);

            if (designID && newState.designID === designID) {
                newState.isSavedToWish = false;
            }
            return updateDrawer(newState);
        }
        case CONSTANTS.SHOW_MAX_CHARM:
            newState.showMaxCharmMessage = true;
            return newState;
        case CONSTANTS.HIDE_MAX_CHARM:
            newState.showMaxCharmMessage = false;
            return newState;
        case CONSTANTS.DROP_HINT_RECEIVED:
        case CONSTANTS.BYO_DROP_A_HINT_RESPONSE_ERROR:
        case CONSTANTS.BYO_GROUP_FAILED:
        case CONSTANTS.BYO_GROUP_COMPLETE_SUCCESS:
        case CONSTANTS.BYO_GROUP_COMPLETE_FAILED:
        default:
            return state;
    }
}
