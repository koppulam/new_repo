import FC from 'constants/FiltersConstants';
import ApiUtils from 'lib/api';
import * as objectPath from 'object-path';
import sortBy from 'lodash/sortBy';
import includes from 'lodash/includes';

import * as cookieUtil from 'lib/utils/cookies';
import { sortDimension, removeValueFromArray } from 'lib/utils/filters';
import { getProductFromByo } from 'lib/utils/format-data';
import { setProductsAnalyticsData, setFiltersAnalyticsData } from 'lib/utils/analytics-util';

/**
 * @description gets the data with applied filters and byo browse criteria
 * @param {object} getOptions { offset, appliedfilters, sortOption, customPrices, removeCustomFilter }
 * {string} type - Search/Browse Type
 * {number} offset - Where to Start From
 * {object} appliedfilters - filters that are applied to current grid
 * {object} sortOption - selected sort option
 * {object} customPrices - custom price values
 * {string} removeCustomFilter - flag for remove custom filter
 * @returns {object} Action tyepa nd payload
 */
export const getData = (getOptions) => (dispatch, getState) => {
    const {
        offset,
        appliedfilters,
        sortOption,
        customPrices,
        removeCustomFilter
    } = getOptions;
    let selectedFilters = [];
    const currentState = getState();
    let customPriceObj = customPrices;
    const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');
    const webCustomerId = cookieUtil.getCookies(cookieName) || '';
    const request = JSON.parse(JSON.stringify(currentState.aem.byoConfig.gridRequest));
    const { filtersData } = currentState.filters;
    let { isCustomFilter } = currentState.filters;

    request.payload.navigationFilters = appliedfilters || currentState.filters.navigationFilters || currentState.filters.byoFilters;

    if (isCustomFilter) {
        const pricesList = filtersData.filter(filter => filter.endecaDimensionId === 4)[0];
        const selectedPricesList = pricesList && pricesList.dimensionValues.filter((price) => {
            return includes(appliedfilters, (price.id).toString());
        });

        if ((selectedPricesList && selectedPricesList.length) || removeCustomFilter) {
            isCustomFilter = false;
        }
        // Remove custom key from navigation filter
        request.payload.navigationFilters = removeValueFromArray(request.payload.navigationFilters, 'custom');
    }
    request.payload.sessionId = webCustomerId;
    // this will check to load last few items
    if (offset && currentState.filters.total && (offset + request.payload.recordsCountPerPage) > currentState.filters.total) {
        request.payload.recordsCountPerPage = currentState.filters.total - (offset);
    }
    request.payload.recordsOffsetNumber = offset;
    request.payload.sortTypeID = sortOption ? sortOption.value : currentState.sortOptions.selectedOption.value;

    if (isCustomFilter || (customPrices && (customPrices.min || customPrices.max))) {
        request.payload.lowerPriceLimit = isCustomFilter && !customPrices ? currentState.filters.minPrice.toString().replace(/\D/g, '') : customPrices.min.toString().replace(/\D/g, '');
        request.payload.upperPriceLimit = isCustomFilter && !customPrices ? currentState.filters.maxPrice.toString().replace(/\D/g, '') : customPrices.max.toString().replace(/\D/g, '');
        request.payload.navigationFilters = removeValueFromArray(request.payload.navigationFilters, 'custom');
    }

    if (sortOption) {
        request.payload.recordsCountPerPage = currentState.filters.productsLength || request.payload.recordsCountPerPage;
    }
    if (request.payload.navigationFilters.indexOf(request.payload.assortmentID) !== -1) {
        request.payload.navigationFilters.splice(request.payload.navigationFilters.indexOf(request.payload.assortmentID), 1);
    }

    selectedFilters = request.payload.navigationFilters;
    if (currentState.byo.selectedFixture.mountTypes) {
        currentState.byo.selectedFixture.mountTypes.forEach((val, index) => {
            currentState.byo.selectedFixture.mountTypes[index] = Number(val);
        });
        request.payload.ByoMountTypeList = currentState.byo.selectedFixture.mountTypes;
    }
    if (offset === 0) {
        dispatch({ type: FC.FILTERS_RESULTS_RESET });
        currentState.filters.productsLength = 0; // This will reset the Producst for the current request
    }

    if (request.payload.navigationFilters.indexOf((request.payload.assortmentID).toString()) === -1) {
        request.payload.navigationFilters.push(request.payload.assortmentID);
    }

    ApiUtils.makeAjaxRequest(
        request,
        res => {
            let filters = objectPath.get(res, 'resultDto.dimensions', []);
            const resProducts = objectPath.get(res, 'resultDto.products', []);
            const total = objectPath.get(res, 'resultDto.numofRecords', 0);
            const maxPrice = objectPath.get(res, 'resultDto.maxPrice', '');
            let products = resProducts.map(product => {
                return getProductFromByo(product);
            });

            // Sort filter dimensions objet on asc order
            filters.map(filter => {
                filter.dimensionValues.sort(sortDimension);
                filter.dimensionValues.map(dimension => {
                    if (dimension.childDimensionValues) {
                        dimension.childDimensionValues.sort(sortDimension);
                    }
                    return dimension;
                });
                return filter;
            });

            // Sequential filter selection logic starts here
            let { isSequential, sequentialMin, sequentialMax } = false;

            // Don't have custom prices object in request payload
            if (!customPrices) {
                let prices = filters.filter(filter => filter.endecaDimensionId === 4)[0];

                prices = prices && prices.dimensionValues && sortBy(prices.dimensionValues, 'displayOrder');
                const selectedPrices = prices && prices.filter((price) => {
                    return price.selected === 'YES';
                });
                const sortedPrices = sortBy(selectedPrices, 'displayOrder');

                if (sortedPrices.length === 1) {
                    isSequential = true;
                }

                sortedPrices.forEach((price, index) => {
                    if (sortedPrices[index + 1] && (!index || isSequential)) {
                        isSequential = parseInt(price.displayOrder, 10) + 1 === parseInt(sortedPrices[index + 1].displayOrder, 10);
                    }
                    if (!index) {
                        sequentialMin = price.minPrice ? price.minPrice : '0';
                    }
                    if (!sortedPrices[index + 1]) {
                        sequentialMax = price.maxPrice ? price.maxPrice : maxPrice;
                    }
                });
            }
            // Sequential filter selection logic ends here

            // is sequential price selection and Don't has custom prices
            if (isSequential && !customPriceObj) {
                customPriceObj = {
                    min: sequentialMin,
                    max: sequentialMax
                };
            }

            // Is not sequential price selection and has custom prices
            if (!isSequential && customPriceObj) {
                if (!customPriceObj.min) {
                    customPriceObj.min = 0;
                }
                if (!customPriceObj.max) {
                    customPriceObj.max = maxPrice;
                }
            }

            // Filter result to remove collections, gemstones, category
            filters = filters.filter(filter => (filter.endecaDimensionId !== 2 && filter.endecaDimensionId !== 3));

            const type = 'byo';
            const queryParams = '';

            if (offset === 0) {
                setProductsAnalyticsData(resProducts, type);
            } else {
                products = [...currentState.filters.rawProducts, ...products];
            }

            // Final min, max values based on filter selection
            const finalMin = isCustomFilter && !customPrices ? currentState.filters.minPrice : '';
            const finalMax = isCustomFilter && !customPrices ? currentState.filters.maxPrice : '';

            const themeConfig = objectPath.get(window, 'tiffany.authoredContent.byoThemeFilterConfig', false);
            const themeMapConfig = objectPath.get(window, 'tiffany.authoredContent.byoThemeFiltersMap', false);

            if (themeConfig && themeMapConfig) {
                filters.map(filterData => {
                    if (filterData.endecaDimensionId === 1) {
                        const theme = filterData.dimensionValues.filter((data) => parseInt(data.id, 10) === parseInt(themeConfig.id, 10));

                        filterData.dimensionValues = theme[0] && theme[0].childDimensionValues ? theme[0].childDimensionValues : [];

                        if (filterData.dimensionValues.length) {
                            const reducedFilters = filterData.dimensionValues.filter(dValue => {
                                return !!themeMapConfig[Number(dValue.id)];
                            });

                            reducedFilters.forEach(dValue => {
                                dValue.name = themeMapConfig[Number(dValue.id)];
                            });

                            filterData.dimensionValues = reducedFilters;
                        }
                    }
                    return filterData;
                });
            }

            setFiltersAnalyticsData({
                appliedfilters, filters, sortOption, type, queryParams, total
            });

            dispatch({
                type: FC.FILTERS_DATA,
                payload: {
                    filters,
                    products,
                    total,
                    selectedFilters,
                    isCustomFilter: customPrices ? true : isCustomFilter,
                    minPrice: customPriceObj && customPriceObj.min ? Math.round(customPriceObj.min) : finalMin,
                    maxPrice: customPriceObj && customPriceObj.max ? Math.round(customPriceObj.max) : finalMax,
                    aem: currentState.aem,
                    navigationFilters: request.payload.navigationFilters, // This will keep a track of current applied filters
                    productsLength: currentState.filters.productsLength + resProducts.length, // This is the actual rpduct tiles length excluding marketing tiles
                    spillover: currentState.filters.spillover
                }
            });
        },
        err => {
            console.log('err', err);
            dispatch({
                type: FC.BYO_FILTERS_FAILED,
                payload: {
                    total: 0
                }
            });
        }
    );
};

/**
 * @description Update filters function Once single action to handle them all
 * @param {object} filterOptions - { filters, sortOption, customPrices, removeCustomFilter }
 * {object} filters - Array of applied fiter Id's
 * {boolean} init - if is initialization
 * {object} sortOption - Selected Sort options
 * {object} customPrices - custom prices
 * {boolean} removeCustomFilter - remove custom filter flag
 * @returns {object} Action type and payload
 */
export const updateFilters = (filterOptions) => (dispatch, getState) => {
    const {
        filters,
        sortOption,
        customPrices,
        removeCustomFilter
    } = filterOptions;
    const getOptions = {
        offset: 0,
        appliedfilters: filters,
        sortOption,
        customPrices,
        removeCustomFilter
    };

    dispatch(getData(getOptions));
};

/**
 * @deprecated
 * @description get on product selected/focus
 * @param {Boolean} val represent showSortoptions.
 * @returns {void}
 */
export const setByoSortRelevance = (val) => (dispatch) => {
    dispatch({
        type: FC.SHOW_SORT_OPTIONS,
        payload: val
    });
};
