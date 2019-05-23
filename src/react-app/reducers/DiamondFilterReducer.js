// @flow

import CONSTANTS from 'constants/ChooseDiamondConstants';
import WC from 'constants/WishlistConstants';
import FC from 'constants/FlyoutConstants';
import AEM_CONSTANTS from 'constants/AemConstants';
import orderBy from 'lodash/orderBy';
import * as objectPath from 'object-path';
import type { EngagementGroupCompleteResponse, SelectedDiamond, Sku } from 'types/engagement';
import { getBeautifulChoiceCarouselImages } from 'lib/utils/format-data';
import * as cookieUtil from 'lib/utils/cookies';
import { updateDiamondFilterAnalytics } from 'lib/utils/analytics-util';

type BeautifulPayload = { response: EngagementGroupCompleteResponse, isAvailableOnline: boolean };

type State = {
    selectedDiamond?: SelectedDiamond,
    filters: any,
    cards: any,
    moreCardSku: string,
    moreCardIndex: number,
    initialCall: boolean,
    filtersReceived: boolean,
    defaultFilters: any,
    previousPayload: Array<any>,
    filtersReset: boolean,
    currentMinCarat: number,
    currentMaxCarat: number,
    currentMinPrice: number,
    currentMaxPrice: number,
    modalOpen: boolean,
    currentPayload: any,
    defaultPayload: any,
    filtersUndone: boolean,
    stopFetch: boolean,
    loadedDiamonds: { [key: Sku]: EngagementGroupCompleteResponse },
    addedToBag: boolean,
    isRingAvailable: boolean,
    groupCompleteResponse: any,
    showFiltersSection: boolean,
    openModal: boolean,
    selectedDiamondSize: number,
    showRingSizeChangeMessage: boolean,
    selectedCard: any,
    childCardsOpen: boolean
};

export const initialState: State = {
    filters: {},
    cards: {},
    moreCardSku: '',
    moreCardIndex: 0,
    initialCall: true,
    filtersReceived: false,
    defaultFilters: {},
    previousPayload: [],
    filtersReset: false,
    currentMinCarat: 0,
    currentMaxCarat: 0,
    currentMinPrice: 0,
    currentMaxPrice: 0,
    navigationFilters: [],
    updatedColors: [],
    updatedClarities: [],
    selectedColors: [],
    claritiesSelected: [],
    isAvailableOnline: '',
    modalOpen: false,
    currentPayload: {},
    defaultPayload: {},
    filtersUndone: false,
    stopFetch: false,
    selectedDiamond: undefined,
    loadedDiamonds: {},
    addedToBag: false,
    selectedDiamondSize: 6,
    isRingAvailable: JSON.parse(JSON.stringify(objectPath.get(window, 'tiffany.authoredContent.engagementpdp.ringNotAvailable.isRingAvailable', true))),
    groupCompleteResponse: JSON.parse(JSON.stringify(objectPath.get(window, 'tiffany.authoredContent.engagementpdp.groupCompleteResponse', {}))),
    showFiltersSection: !objectPath.get(window, 'tiffany.authoredContent.engagementpdp.groupCompleteResponse.selectedSku', false),
    openModal: false,
    show1B: JSON.parse(JSON.stringify(objectPath.get(window, 'tiffany.authoredContent.engagementpdp.forced1BVariation', false))),
    showRingSizeChangeMessage: false,
    selectedCard: null,
    childCardsOpen: false
};

/**
 * Diamond filter Reducer.
 * @param {object} previousState previous state data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
export default function diamondFilterReducer(previousState: any = initialState, action: any) {
    const newState: State = JSON.parse(JSON.stringify(previousState));

    switch (action.type) {
        case CONSTANTS.RING_SIZE_UPDATED: {
            newState.showRingSizeChangeMessage = true;
            if (newState.selectedDiamond && String(action.payload.sku) === String(newState.selectedDiamond.group.group.selectedSku)) {
                newState.selectedDiamond.size = action.payload.size;
            }
            if (newState.loadedDiamonds[action.payload.sku]) {
                newState.loadedDiamonds[action.payload.sku].resultDto.size = action.payload.size;
            }
            if (newState.groupCompleteResponse.selectedSku && String(action.payload.sku) === String(newState.groupCompleteResponse.selectedSku)) {
                newState.groupCompleteResponse.size = action.payload.size;
            }
            return newState;
        }
        case CONSTANTS.RESET_RING_SIZE_MESSAGE: {
            newState.showRingSizeChangeMessage = false;
            return newState;
        }
        case CONSTANTS.GET_DIAMOND_CARDS:
        case CONSTANTS.GET_DIAMOND_CARDS_FAILED: {
            const res = objectPath.get(action.payload, 'currentRes.resultDto', {});
            const dimensions = objectPath.get(res, 'dimensions', []);

            newState.updatedColors = [];
            newState.updatedClarities = [];

            dimensions.forEach(dimension => {
                const dimensionValues = objectPath.get(dimension, 'dimensionValues', []);

                if (dimension.groupName && dimension.groupName.toLowerCase() === 'Diamond Color'.toLowerCase()) {
                    dimensionValues.forEach(dimensionValue => {
                        newState.updatedColors.push(dimensionValue.name);
                    });
                } else if (dimension.groupName && dimension.groupName.toLowerCase() === 'Diamond Clarity'.toLowerCase()) {
                    dimensionValues.forEach(dimensionValue => {
                        newState.updatedClarities.push(dimensionValue.name);
                    });
                }
            });
            const mergedProducts = [];
            let parentSku = '';
            let parentIndex = 0;

            newState.stopFetch = false;
            if (action.payload.undo) {
                newState.previousPayload.pop();
            } else {
                newState.previousPayload.push(JSON.parse(JSON.stringify(newState.currentPayload)));
            }

            if (objectPath.get(action.payload, 'undo', false)) {
                newState.filtersUndone = true;
            } else {
                newState.filtersUndone = false;
            }

            newState.currentPayload = JSON.parse(JSON.stringify(objectPath.get(action.payload, 'currentPayload', {})));
            if (newState.initialCall) {
                newState.previousPayload = [];
                newState.previousPayload.push(JSON.parse(JSON.stringify(newState.currentPayload)));
                newState.defaultPayload = JSON.parse(JSON.stringify(newState.currentPayload));
                newState.currentPayload.payload.upperPriceLimit = newState.currentMaxPrice.toString();
                newState.currentPayload.payload.lowerPriceLimit = newState.currentMinPrice.toString();
                newState.currentPayload.payload.isAvailableOnline = '';
                newState.initialCall = false;
            }

            newState.filtersReset = false;
            newState.filtersReceived = false;
            newState.cards = res;
            if (res.numofRecords > 0) {
                orderBy(newState.cards.productCardBuckets, 'displayOrder', 'asc');
            }

            if (Object.keys(newState.cards).length > 0) {
                newState.cards.productCardBuckets.forEach(data => {
                    const hasChildren = data.productCards.length > 1;

                    data.productCards.forEach((product, index) => {
                        if (index === 0) {
                            parentSku = product.sku;
                            product.hasChildren = hasChildren;
                        } else {
                            product.parentSku = parentSku;
                        }
                        product.parentIndex = parentIndex;
                        mergedProducts.push(product);
                    });

                    parentIndex += 1;
                });
            }
            newState.cards.mergedProducts = mergedProducts;

            return {
                ...previousState,
                ...newState
            };
        }
        case CONSTANTS.SET_MORE_CARD:
            if (!action.payload.clear) {
                newState.moreCardSku = action.payload.sku;
                newState.moreCardIndex = action.payload.parentIndex;
            } else {
                newState.moreCardSku = '';
                newState.moreCardIndex = 0;
            }

            return {
                ...previousState,
                ...newState
            };
        case CONSTANTS.UPDATE_CURRENT_DIAMOND_FILTERS: {
            let stopFetch = false;

            if (action.payload.stopFetch) {
                stopFetch = true;
            } else {
                stopFetch = false;
            }
            updateDiamondFilterAnalytics({
                ...previousState,
                ...action.payload.updatedObj
            });
            return {
                ...previousState,
                ...action.payload.updatedObj,
                filtersUndone: false,
                filtersReset: false,
                stopFetch
            };
        }

        case CONSTANTS.UPDATE_DIAMOND_FILTERS:
            newState.filtersReceived = true;
            newState.filters = action.payload;
            newState.defaultFilters = action.payload;

            return {
                ...previousState,
                ...newState
            };
        case CONSTANTS.RESET_DIAMOND_FILTERS:
            newState.filtersReset = true;
            newState.filtersReceived = true;
            newState.filters = previousState.defaultFilters;
            newState.previousPayload = [];
            newState.moreCardSku = '';
            newState.moreCardIndex = 0;

            updateDiamondFilterAnalytics(newState);

            return {
                ...previousState,
                ...newState
            };
        case CONSTANTS.SET_BEAUTIFUL_CHOICE: {
            const thispayload: BeautifulPayload = action.payload;
            const { response, isAvailableOnline } = thispayload;
            const selectedDiamond: SelectedDiamond = {
                ...response.resultDto,
                images: getBeautifulChoiceCarouselImages(objectPath.get(response, 'resultDto.itemMedia', {})),
                isInBag: action.payload.isInBag,
                isInWishList: action.payload.isInWishList,
                shoppingBagItemID: action.payload.shoppingBagItemID,
                size: action.payload.size
            };

            thispayload.response.resultDto.isInBag = action.payload.isInBag;
            thispayload.response.resultDto.isInWishList = action.payload.isInWishList;

            newState.selectedDiamond = selectedDiamond;
            newState.selectedDiamond.isAvailableOnline = isAvailableOnline;
            newState.openModal = true;
            newState.loadedDiamonds[String(selectedDiamond.group.group.selectedSku)] = thispayload.response;
            newState.selectedCard = action.payload.selectedCard;
            return newState;
        }
        case CONSTANTS.SET_SIZE_ELECTION: {
            if (newState.selectedDiamond) {
                newState.selectedDiamond.size = action.payload;
                newState.openModal = false;
            } else if (!newState.selectedDiamond) {
                newState.selectedDiamondSize = action.payload;
            }
            return newState;
        }
        case CONSTANTS.DIAMOND_ADDED: {
            if (newState.selectedDiamond) {
                newState.selectedDiamond.size = action.payload || newState.selectedDiamond.size;
                newState.selectedDiamond.isInBag = true;
                newState.loadedDiamonds[newState.selectedDiamond.group.group.selectedSku].resultDto.isInBag = true;
                newState.groupCompleteResponse.selectedSku = newState.selectedDiamond.group.group.selectedSku;
                newState.groupCompleteResponse.isAvailableOnline = newState.selectedDiamond.isAvailableOnline;
                newState.showFiltersSection = false;
                const groupDetails = newState.selectedDiamond.group.group;
                let title = '';
                let eyebrowtext = '';

                if (groupDetails.titleSplit && groupDetails.titleSplit.length > 0) {
                    if (groupDetails.titleSplit.length > 1) {
                        [eyebrowtext, title] = groupDetails.titleSplit;
                    } else {
                        eyebrowtext = '';
                        [title] = groupDetails.titleSplit;
                    }
                }

                newState.groupCompleteResponse = {
                    ...newState.groupCompleteResponse,
                    eyebrowtext,
                    title,
                    specifications: objectPath.get(groupDetails, 'specifications', ''),
                    style: objectPath.get(groupDetails, 'style', false),
                    caratWeight: objectPath.get(groupDetails, 'caratWeight', false),
                    diamondShape: objectPath.get(groupDetails, 'diamondShape', []),
                    diamondColor: objectPath.get(groupDetails, 'diamondColor', []),
                    diamondClarity: objectPath.get(groupDetails, 'diamondClarity', []),
                    diamondCut: objectPath.get(groupDetails, 'diamondCut', []),
                    longDescription: objectPath.get(groupDetails, 'longDescription', []),
                    additionalInfo: objectPath.get(groupDetails, 'additionalInfo', ''),
                    sku: objectPath.get(groupDetails, 'sku', ''),
                    countryOfOrigin: objectPath.get(groupDetails, 'diamondProvenance.0', false),
                    price: objectPath.get(groupDetails, 'price', false),
                    showChooseDiamond: newState.selectedDiamond.group.group.showChooseDiamond,
                    minCaratWeight: objectPath.get(groupDetails, 'minCaratWeight', false),
                    maxCaratWeight: objectPath.get(groupDetails, 'maxCaratWeight', false),
                    minPrice: objectPath.get(groupDetails, 'minPrice', false)
                };
            }
            return newState;
        }
        case CONSTANTS.RESET_BEAUTIFUL_CHOICE: {
            delete newState.selectedDiamond;
            // DO NOT DELETE
            // if (newState.groupCompleteResponse.selectedSku) {
            //     const selectedDiamond: SelectedDiamond = {
            //         ...newState.loadedDiamonds[newState.groupCompleteResponse.selectedSku].resultDto,
            //         images: getBeautifulChoiceCarouselImages(objectPath.get(newState.loadedDiamonds[newState.groupCompleteResponse.selectedSku], 'resultDto.itemMedia', {})),
            //         isInBag: newState.groupCompleteResponse.isInBag,
            //         isInWishList: newState.groupCompleteResponse.isInWishList
            //     };

            //     newState.selectedDiamond = selectedDiamond;
            // }
            newState.openModal = false;
            return newState;
        }
        case CONSTANTS.RESET_SELECTED_DIAMOND_CARD: {
            newState.selectedCard = null;
            return newState;
        }
        case CONSTANTS.TOGGLE_FILTERS_SECTION: {
            newState.showFiltersSection = action.payload.isEditClicked || !newState.showFiltersSection;
            return newState;
        }
        case WC.WISHLIST_FAILED: {
            if (newState.groupCompleteResponse && newState.groupCompleteResponse.selectedSku) {
                newState.groupCompleteResponse.isInWishList = false;
            }
            if (newState.selectedDiamond) {
                newState.selectedDiamond.isInWishList = false;
            }
            Object.keys(newState.loadedDiamonds).forEach(key => {
                newState.loadedDiamonds[key].resultDto.isInWishList = false;
            });
            return newState;
        }
        case FC.WISHLIST_FETCHED_COMPLETE:
        case WC.WISHLIST_FETCHED: {
            const wishlist = (action.payload && (action.payload.resultDto || action.payload.savedItems)) || [];

            newState.groupCompleteResponse.isInWishList = false;
            if (wishlist.length > 0) {
                wishlist.forEach(item => {
                    if (newState.selectedDiamond && String(item.sku) === String(newState.selectedDiamond.group.group.selectedSku)) {
                        const groupDetails = newState.selectedDiamond.group.group;
                        let eyebrowtext = '';
                        let title = '';

                        if (groupDetails.titleSplit && groupDetails.titleSplit.length > 0) {
                            if (groupDetails.titleSplit.length > 1) {
                                [eyebrowtext, title] = groupDetails.titleSplit;
                            } else {
                                eyebrowtext = '';
                                [title] = groupDetails.titleSplit;
                            }
                        }

                        if (!newState.selectedDiamond.isAvailableOnline || newState.show1B) {
                            newState.groupCompleteResponse.selectedSku = item.sku;
                            newState.groupCompleteResponse.isAvailableOnline = false;
                            newState.showFiltersSection = false;
                            newState.groupCompleteResponse.isInWishList = true;
                            newState.groupCompleteResponse.isInBag = newState.selectedDiamond.isInBag;
                            newState.groupCompleteResponse = {
                                ...newState.groupCompleteResponse,
                                eyebrowtext,
                                title,
                                specifications: objectPath.get(groupDetails, 'specifications', ''),
                                style: objectPath.get(groupDetails, 'style', false),
                                caratWeight: objectPath.get(groupDetails, 'caratWeight', false),
                                diamondShape: objectPath.get(groupDetails, 'diamondShape', []),
                                diamondColor: objectPath.get(groupDetails, 'diamondColor', []),
                                diamondClarity: objectPath.get(groupDetails, 'diamondClarity', []),
                                diamondCut: objectPath.get(groupDetails, 'diamondCut', []),
                                longDescription: objectPath.get(groupDetails, 'longDescription', []),
                                additionalInfo: objectPath.get(groupDetails, 'additionalInfo', ''),
                                sku: objectPath.get(groupDetails, 'sku', ''),
                                countryOfOrigin: objectPath.get(groupDetails, 'diamondProvenance.0', false),
                                price: objectPath.get(groupDetails, 'price', false),
                                showChooseDiamond: newState.selectedDiamond.group.group.showChooseDiamond,
                                minCaratWeight: objectPath.get(groupDetails, 'minCaratWeight', false),
                                maxCaratWeight: objectPath.get(groupDetails, 'maxCaratWeight', false),
                                minPrice: objectPath.get(groupDetails, 'minPrice', false)
                            };
                        }
                        newState.selectedDiamond.isInWishList = true;
                    }
                    if (newState.loadedDiamonds[item.sku]) {
                        newState.loadedDiamonds[item.sku].resultDto.isInWishList = true;
                    }
                    if (newState.groupCompleteResponse.selectedSku && String(item.sku) === String(newState.groupCompleteResponse.selectedSku)) {
                        newState.groupCompleteResponse.isInWishList = true;
                    }
                });
            }
            return newState;
        }
        case CONSTANTS.SET_WISHLIST: {
            const wishlist = action.payload.skuId;

            newState.groupCompleteResponse.isInWishList = false;
            if (wishlist.length > 0) {
                wishlist.forEach(item => {
                    if (newState.selectedDiamond && String(item) === String(newState.selectedDiamond.group.group.selectedSku)) {
                        const groupDetails = newState.selectedDiamond.group.group;
                        let eyebrowtext = '';
                        let title = '';

                        if (groupDetails.titleSplit && groupDetails.titleSplit.length > 0) {
                            if (groupDetails.titleSplit.length > 1) {
                                [eyebrowtext, title] = groupDetails.titleSplit;
                            } else {
                                eyebrowtext = '';
                                [title] = groupDetails.titleSplit;
                            }
                        }

                        if (!newState.selectedDiamond.isAvailableOnline || newState.show1B) {
                            newState.groupCompleteResponse.selectedSku = item;
                            newState.groupCompleteResponse.isAvailableOnline = false;
                            newState.showFiltersSection = false;
                            newState.groupCompleteResponse.isInWishList = true;
                            newState.groupCompleteResponse.isInBag = newState.selectedDiamond.isInBag;
                            newState.groupCompleteResponse = {
                                ...newState.groupCompleteResponse,
                                eyebrowtext,
                                title,
                                specifications: objectPath.get(groupDetails, 'specifications', ''),
                                style: objectPath.get(groupDetails, 'style', false),
                                caratWeight: objectPath.get(groupDetails, 'caratWeight', false),
                                diamondShape: objectPath.get(groupDetails, 'diamondShape', []),
                                diamondColor: objectPath.get(groupDetails, 'diamondColor', []),
                                diamondClarity: objectPath.get(groupDetails, 'diamondClarity', []),
                                diamondCut: objectPath.get(groupDetails, 'diamondCut', []),
                                longDescription: objectPath.get(groupDetails, 'longDescription', []),
                                additionalInfo: objectPath.get(groupDetails, 'additionalInfo', ''),
                                sku: objectPath.get(groupDetails, 'sku', ''),
                                countryOfOrigin: objectPath.get(groupDetails, 'diamondProvenance.0', false),
                                price: objectPath.get(groupDetails, 'price', false),
                                showChooseDiamond: newState.selectedDiamond.group.group.showChooseDiamond,
                                minCaratWeight: objectPath.get(groupDetails, 'minCaratWeight', false),
                                maxCaratWeight: objectPath.get(groupDetails, 'maxCaratWeight', false),
                                minPrice: objectPath.get(groupDetails, 'minPrice', false)
                            };
                        }
                        newState.selectedDiamond.isInWishList = true;
                    }
                    if (newState.loadedDiamonds[item]) {
                        newState.loadedDiamonds[item].resultDto.isInWishList = true;
                    }
                    if (newState.groupCompleteResponse.selectedSku && String(item) === String(newState.groupCompleteResponse.selectedSku)) {
                        newState.groupCompleteResponse.isInWishList = true;
                    }
                });
            }
            return newState;
        }
        case FC.SHOPPING_BAG_FETCHED: {
            const items = objectPath.get(action.payload, 'itemsList.items', []);

            cookieUtil.setCookie('engagmentReduce', JSON.stringify(items.map(item => { return { sku: item.item.sku, shoppingBagItemID: item.shoppingBagItemID, servicing: item.servicing }; })), { secure: true, encode: true });
            newState.groupCompleteResponse.isInBag = false;

            if (items.length > 0) {
                items.forEach(item => {
                    if (newState.selectedDiamond && String(item.item.sku) === String(newState.selectedDiamond.group.group.selectedSku)) {
                        newState.selectedDiamond.isInBag = true;
                        newState.selectedDiamond.shoppingBagItemID = item.shoppingBagItemID;
                        newState.selectedDiamond.size = item.servicing ? item.servicing.text : action.payload.aem.engagementpdp.groupCompleteResponse.defaultRingSize;
                    }
                    if (newState.loadedDiamonds[item.item.sku]) {
                        newState.loadedDiamonds[item.item.sku].resultDto.isInBag = true;
                        newState.loadedDiamonds[item.item.sku].resultDto.shoppingBagItemID = item.shoppingBagItemID;
                        newState.loadedDiamonds[item.item.sku].resultDto.size = item.servicing ? item.servicing.text : action.payload.aem.engagementpdp.groupCompleteResponse.defaultRingSize;
                    }
                    if (newState.groupCompleteResponse.selectedSku && String(item.item.sku) === String(newState.groupCompleteResponse.selectedSku)) {
                        newState.groupCompleteResponse.isInBag = true;
                        newState.groupCompleteResponse.shoppingBagItemID = item.shoppingBagItemID;
                        newState.groupCompleteResponse.size = item.servicing ? item.servicing.text : action.payload.aem.engagementpdp.groupCompleteResponse.defaultRingSize;
                    }
                });
            }
            return newState;
        }
        case FC.INIT_SHOPPING_SYSTEM: {
            const items = objectPath.get(action.payload, 'items', []);

            newState.groupCompleteResponse.isInBag = false;

            if (items.length > 0) {
                items.forEach(item => {
                    if (newState.selectedDiamond && String(item.sku) === String(newState.selectedDiamond.group.group.selectedSku)) {
                        newState.selectedDiamond.isInBag = true;
                        newState.selectedDiamond.shoppingBagItemID = item.shoppingBagItemID;
                        newState.selectedDiamond.size = item.servicing ? item.servicing.text : action.payload.aem.engagementpdp.groupCompleteResponse.defaultRingSize;
                    }
                    if (newState.loadedDiamonds[item.sku]) {
                        newState.loadedDiamonds[item.sku].resultDto.isInBag = true;
                        newState.loadedDiamonds[item.sku].resultDto.shoppingBagItemID = item.shoppingBagItemID;
                        newState.loadedDiamonds[item.sku].resultDto.size = item.servicing ? item.servicing.text : action.payload.aem.engagementpdp.groupCompleteResponse.defaultRingSize;
                    }
                    if (newState.groupCompleteResponse.selectedSku && String(item.sku) === String(newState.groupCompleteResponse.selectedSku)) {
                        newState.groupCompleteResponse.isInBag = true;
                        newState.groupCompleteResponse.shoppingBagItemID = item.shoppingBagItemID;
                        newState.groupCompleteResponse.size = item.servicing ? item.servicing.text : action.payload.aem.engagementpdp.groupCompleteResponse.defaultRingSize;
                    }
                });
            }
            return newState;
        }
        case AEM_CONSTANTS.INVALID_COOKIE_RESET: {
            cookieUtil.setCookie('engagmentReduce', JSON.stringify([]), { secure: true, encode: true });
            if (newState.groupCompleteResponse && newState.groupCompleteResponse.selectedSku) {
                newState.groupCompleteResponse.isInBag = false;
            }
            if (newState.selectedDiamond) {
                newState.selectedDiamond.isInBag = false;
            }
            Object.keys(newState.loadedDiamonds).forEach(key => {
                newState.loadedDiamonds[key].resultDto.isInBag = false;
            });
            if (newState.groupCompleteResponse && newState.groupCompleteResponse.selectedSku) {
                newState.groupCompleteResponse.isInWishList = false;
            }
            if (newState.selectedDiamond) {
                newState.selectedDiamond.isInWishList = false;
            }
            Object.keys(newState.loadedDiamonds).forEach(key => {
                newState.loadedDiamonds[key].resultDto.isInWishList = false;
            });
            return newState;
        }
        case FC.SHOPPING_BAG_FETCH_FAILED: {
            cookieUtil.setCookie('engagmentReduce', JSON.stringify([]), { secure: true, encode: true });
            if (newState.groupCompleteResponse && newState.groupCompleteResponse.selectedSku) {
                newState.groupCompleteResponse.isInBag = false;
            }
            if (newState.selectedDiamond) {
                newState.selectedDiamond.isInBag = false;
            }
            Object.keys(newState.loadedDiamonds).forEach(key => {
                newState.loadedDiamonds[key].resultDto.isInBag = false;
            });
            return newState;
        }
        default:
            return previousState;
    }
}
