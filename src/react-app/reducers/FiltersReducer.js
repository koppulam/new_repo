import FC from 'constants/FiltersConstants';
import BYO from 'constants/BYOConstants';
import objectPath from 'object-path';
import styleVariables from 'lib/utils/breakpoints';
import { marketingTileslayout } from 'lib/utils/format-data';

const initialState = {
    filtersData: [],
    products: [],
    rawProducts: [],
    browseFilters: objectPath.get(window, 'tiffany.authoredContent.browseConfig.request.payload.navigationFilters', []),
    searchFilters: objectPath.get(window, 'tiffany.authoredContent.searchConfig.request.payload.navigationFilters', []),
    byoFilters: objectPath.get(window, 'tiffany.authoredContent.byoConfig.gridRequest.payload.navigationFilters', []),
    total: NaN,
    isCustomFilter: false,
    type: '',
    selectedFilters: [],
    productsLength: 0,
    navigationFilters: [],
    searchTerms: '',
    catDimensionId: '',
    browseHeading: '',
    collectionsSplitLength: 16,
    hasColectionChildFilters: false,
    isFilterSelected: false,
    gridCallInitialized: false,
    isSortOpen: false,
    selectedFilterIds: []
};

const sortDimension = (dimension1, dimension2) => {
    if (Number(dimension1.displayOrder) < Number(dimension2.displayOrder)) {
        return -1;
    }
    if (Number(dimension1.displayOrder) > Number(dimension2.displayOrder)) {
        return 1;
    }
    return 0;
};

/**
 * @description checkForSelectedFilters check filters based on considering the URLUniqueId.
 * @param {Number} defDimId Contains Default dimession Id.
 * @param {array} filters selected filters.
 * @returns {Array} Returns an array of selectedFilters.
 */
const checkForSelectedFilters = (defDimId, filters) => {
    let result = filters;

    if (result && result.length > 0) {
        result = result.filter(filterItem => !(defDimId && filterItem.filterDimensionId && parseInt(filterItem.filterDimensionId, 10) === parseInt(defDimId, 10)));
    }

    return result;
};

/**
 * @description getDimensionId Get default dimensionId based on type.
 * @param {String} type Specifies type whether its an Engageemnt or core browse grid.
 * @returns {Number} Returns deafult dimesnionId.
 */
const getDimensionId = (type) => {
    let defaultDimId = false;
    const browseGridType = type ? type.toUpperCase() : '';

    if (browseGridType === 'BROWSE') {
        defaultDimId = objectPath.get(window, 'tiffany.authoredContent.browseConfig.request.defaultDimensionId', false);
    } else if (browseGridType === 'BRIDAL') {
        defaultDimId = objectPath.get(window, 'tiffany.authoredContent.engagementConfig.request.defaultDimensionId', false);
    }

    return defaultDimId;
};

/**
 * Render Component.
 * @param {object} state default state data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
export default function filterReducer(state = initialState, action) {
    let filters = [];

    // sort filters based on displayOrder
    if (action.payload && action.payload.filters) {
        filters = action.payload.filters.map(filter => {
            filter.dimensionValues.sort(sortDimension);
            filter.dimensionValues.map(dimension => {
                if (dimension.childDimensionValues) {
                    dimension.childDimensionValues.sort(sortDimension);
                }
                return dimension;
            });
            return filter;
        });
    }

    let products;
    const rawProducts = [];
    const dynamicContent = objectPath.get(action, 'payload.aem.dynamicMarketingContentConfig.content', []);

    switch (action.type) {
        case FC.FILTERS_DATA: {
            action.payload.products.forEach(item => {
                if (!item.layout) {
                    rawProducts.push(item);
                }
            });
            const productsLength = rawProducts.length;
            const mkTileConfig = objectPath.get(window.tiffany.authoredContent, 'dynamicMarketingContentConfig.marketingTilesFallOff', false);
            const selectedFilters = objectPath.get(action.payload, 'selectedFilters', []);
            const defaultDimId = getDimensionId(action.payload.type);
            const checkForFilters = checkForSelectedFilters(defaultDimId, selectedFilters);
            const marketingTileFallOff = checkForFilters.length > 0 && mkTileConfig;

            products = marketingTileslayout(JSON.parse(JSON.stringify(rawProducts)), styleVariables, marketingTileFallOff ? [] : dynamicContent);

            return {
                ...state,
                filtersData: filters, // resultDto.dimensions
                products,
                total: action.payload.total,
                type: action.payload.type,
                selectedFilters: action.payload.selectedFilters,
                isCustomFilter: action.payload.isCustomFilter,
                enteredCustomPrices: action.payload.enteredCustomPrices,
                minPrice: action.payload.minPrice,
                maxPrice: action.payload.maxPrice,
                productsLength,
                navigationFilters: action.payload.navigationFilters, // request.payload.navigationFilters
                searchTerms: action.payload.searchTerms,
                catDimensionId: action.payload.catDimensionId,
                focusProduct: action.payload.focusProduct,
                rawProducts,
                gridCallInitialized: true
            };
        }
        case FC.FILTERS_RESULTS_RESET:
            return {
                ...state,
                products: [],
                total: NaN,
                productsLength: 0,
                navigationFilters: [],
                searchTerms: '',
                gridCallInitialized: false
            };
        case BYO.START_OVER:
            return {
                ...state,
                products: [],
                total: NaN,
                productsLength: 0,
                navigationFilters: [],
                searchTerms: '',
                isCustomFilter: false,
                minPrice: '',
                maxPrice: '',
                gridCallInitialized: true
            };
        case 'UPDATE_HEADER':
            return {
                ...state,
                browseHeading: action.payload
            };
        case FC.BYO_FILTERS_FAILED: {
            return {
                ...state,
                total: action.payload.total,
                gridCallInitialized: true
            };
        }
        case FC.FILTERS_FAILED: {
            return {
                ...state,
                gridCallInitialized: true
            };
        }
        case FC.SHOW_SORT_OPTIONS: {
            return {
                ...state,
                isSortOpen: action.payload
            };
        }
        case FC.IS_FILTER_SELECTED: {
            return {
                ...state,
                isFilterSelected: action.payload,
                gridCallInitialized: true
            };
        }
        case FC.UPDATED_SELECTED_FILTERS: {
            return {
                ...state,
                selectedFilterIds: action.payload
            };
        }
        case FC.SUPRESS_MARKETING_TILE: {
            const { configName, componentName, type } = action.paylaod;
            const selectedFilters = objectPath.get(state, 'selectedFilters', []);
            const defaultDimId = getDimensionId(type);
            const checkForFilters = checkForSelectedFilters(defaultDimId, selectedFilters);
            const mkTileConfig = objectPath.get(window.tiffany.authoredContent, 'dynamicMarketingContentConfig.marketingTilesFallOff', false);
            const marketingTileFallOff = checkForFilters.length > 0 && mkTileConfig;
            let tileindex = null;

            dynamicContent.forEach((tile, index) => {
                if (tile.component === componentName && configName === tile.key) {
                    tileindex = index;
                }
            });
            if (tileindex !== null) {
                dynamicContent.splice(tileindex, 1);
            }
            return {
                ...state,
                products: marketingTileslayout(JSON.parse(JSON.stringify(state.rawProducts)), styleVariables, marketingTileFallOff ? [] : dynamicContent)
            };
        }
        default:
            return state;
    }
}
