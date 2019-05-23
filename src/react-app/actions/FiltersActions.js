import FC from 'constants/FiltersConstants';
import ApiUtils from 'lib/api';
import * as objectPath from 'object-path';
import sortBy from 'lodash/sortBy';
import includes from 'lodash/includes';
import cloneDeep from 'lodash/cloneDeep';

import * as matchMedia from 'lib/dom/match-media';
import { findFirst } from 'lib/dom/dom-util';
import { setProductsAnalyticsData, setFiltersAnalyticsData } from 'lib/utils/analytics-util';

import { getProductFromSearch } from 'lib/utils/format-data';
import {
    getSelectedFilterObjects,
    getCategoryDimension,
    getHeadlineText,
    getEngagementHeadlineText,
    getCoreHeadlineText,
    sortDimension,
    removeValueFromArray,
    getNextUrl,
    updateQueryStringParameter,
    getUrlParameter,
    handleUrlState,
    getFilterPriorityMap
} from 'lib/utils/filters';

/**
 * @description Update document title with heading text.
 * @param {string} heading heading based on the applied filters.
 * @returns {object} void
 */
export const setTitle = (heading) => {
    if (heading && heading.length > 0) {
        document.title = heading;
    }
};

/**
 * @description Redirects search page ....
 * @param {string} type type of filter
 * @param {string} redirectDesktopUrl redirectDesktopUrl
 * @param {string} redirectMobileUrl redirectMobileUrl
 * @returns {object} void
 */
const redirectSearchPage = (type, redirectDesktopUrl, redirectMobileUrl) => {
    if (type === 'SEARCH') {
        const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;

        if (isDesktop && redirectDesktopUrl) {
            window.location = redirectDesktopUrl;
        } else if (redirectMobileUrl) {
            window.location = redirectMobileUrl;
        }
    }
};

/**
 * @description Extracts selected filters from dimensions
 * @param {object} dimensions dimensions from result
 * @returns {object} void
 */
const getSelectedFiltersFromDimensions = (dimensions) => {
    const selectedFiltersObj = [];

    dimensions.forEach((dimension) => {
        dimension.dimensionValues.forEach((dimensionValue) => {
            if (dimensionValue.selected === 'YES') {
                selectedFiltersObj.push({
                    id: dimensionValue.id,
                    dimensionId: dimension.endecaDimensionId
                });
            }
            if (dimensionValue.childDimensionValues) {
                dimensionValue.childDimensionValues.forEach((childDimension) => {
                    if (childDimension.selected === 'YES') {
                        selectedFiltersObj.push({
                            id: childDimension.id,
                            dimensionId: dimension.endecaDimensionId
                        });
                    }
                });
            }
        });
    });
    return selectedFiltersObj;
};
/**
 * @description Constructs browsegrid url based on response, filtermap and priority map
 * @param {object} pricesObj pricesObj from result
 * @param {object} dimensions dimensions from result
 * @param {object} appliedfilters appliedfilters
 * @param {object} sortOption sortOption
 * @param {string} defaultDimensionId categoryId
 * @returns {object} void
 */
const constructBrowseGridUrl = (pricesObj, dimensions, appliedfilters, sortOption, defaultDimensionId) => {
    const appliedFilterObj = getSelectedFilterObjects(appliedfilters);
    const priorityMap = getFilterPriorityMap();
    const baseUrl = cloneDeep(objectPath.get(window, 'tiffany.authoredContent.baseUrl', ''));
    const splitUrl = baseUrl.split('/shop').length > 1 ? baseUrl.split('/shop')[1].split('/').filter(uid => !!uid) : [];

    appliedFilterObj.forEach((filter) => {
        const priorityTemp = priorityMap.filter((priority) => {
            return String(priority).toLowerCase() === String(filter.filterType).toLowerCase();
        });

        if (priorityTemp.length === 0) {
            dimensions.forEach((dimension) => {
                dimension.dimensionValues.forEach((dimensionValue) => {
                    if (dimensionValue.childDimensionValues) {
                        const childDimension = dimensionValue.childDimensionValues.filter((child) => {
                            return String(child.id).toLowerCase() === String(filter.filterDimensionId).toLowerCase();
                        });

                        if (childDimension.length > 0) {
                            const filterType = getSelectedFilterObjects([dimensionValue.id]);

                            if (filterType) {
                                filter.filterType = filterType[0].filterType;
                            }
                        }
                    }
                });
            });

            if (pricesObj && (pricesObj.minPrice || pricesObj.maxPrice) && String(filter.filterDimensionId) === String('custom')) {
                filter.filterUrlId = `price-${pricesObj.minPrice ? pricesObj.minPrice : 0}-${pricesObj.maxPrice}`;
            }
        }
    });

    let url = '';

    /*
        Priority map has main categories list.
        Sort selected filters based on priority map categories
        and then sort based on filter order within filters of each category.
    */
    url += getFilterPriorityMap().map(filterType => {
        return appliedFilterObj
            .filter(selectedFilter => (((selectedFilter.filterType).toLowerCase() === filterType.toLowerCase()) && (splitUrl.filter(uid => selectedFilter.filterUrlId === uid).length === 0) && !(defaultDimensionId && selectedFilter.filterDimensionId && parseInt(selectedFilter.filterDimensionId, 10) === parseInt(defaultDimensionId, 10))))
            .sort((filter1, filter2) => {
                if (Number(filter1.filterOrder) < Number(filter2.filterOrder)) {
                    return -1;
                }
                if (Number(filter1.filterOrder) > Number(filter2.filterOrder)) {
                    return 1;
                }
                return 0;
            });
    }).filter(sortedGroupFilters => sortedGroupFilters.length > 0)
        .map(sortedGroupFilters => {
            if (sortedGroupFilters.length > 1) {
                return sortedGroupFilters.reduce((prev, current) => {
                    if (typeof prev === 'object') {
                        return `${prev.filterUrlId}/${current.filterUrlId}`;
                    }
                    return `${prev}/${current.filterUrlId}`;
                });
            }
            return sortedGroupFilters[0].filterUrlId;
        })
        .reduce((prev, current) => {
            return current !== '' && prev !== '' ? `${prev}/${current}` : current;
        }, '');
    url = url ? `/${url}` : '';
    if (sortOption) {
        url = `${url}/${sortOption.sortUrlKey}`;
    }
    return `${baseUrl}${url}/`;
};

/**
 * @description gets the data with applied filters and search/browse criteria
 * @param {object} getOptions { type, offset, appliedfilters, sortOption, customPrices, removeCustomFilter }
 * {string} type - Search/Browse Type
 * {number} offset - Where to Start From
 * {object} appliedfilters - filters that are applied to current grid
 * {object} sortOption - selected sort option
 * {object} customPrices - custom price values
 * {boolean} removeCustomFilter - flag for remove custom filter
 * @returns {object} Action tyepa nd payload
 */
export const getData = (getOptions) => (dispatch, getState) => {
    const {
        type,
        offset,
        appliedfilters,
        sortOption,
        customPrices,
        removeCustomFilter,
        isPagination,
        isSort,
        init,
        sortObject,
        isAuthormode,
        isPop
    } = getOptions;
    let request;
    let selectedFilters = [];
    const currentState = getState();
    let catDimensionId;
    let isCollectionSelected = false;
    const collectionObj = currentState.aem.ENDECA_FILTER_DIMENSIONS_ORDER.filter(dimension => Number(dimension.value) === FC.ENDECA_DIMENSIONIDS.DESIGNERS_COLLECTIONS); // This will give the name of designers and collections main category
    const search = window.location.search.substring(1);
    const queryParams = search && JSON.parse(`{"${decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`);
    let customPriceObj = customPrices;
    const gridHeader = findFirst('.browse-grid-header');
    const { filtersData, collectionsSplitLength } = currentState.filters;
    let { isCustomFilter } = currentState.filters;
    const pageNumber = getUrlParameter('page');
    let navigationFilters = [];

    if (isPagination) {
        const newUrl = getNextUrl('page');
        const historyObj = {
            filters: window.history.state,
            url: newUrl
        };

        handleUrlState(historyObj, true);
    }

    switch (type) {
        case 'SEARCH':
            request = JSON.parse(JSON.stringify(currentState.aem.searchConfig.request));
            request.payload.navigationFilters = appliedfilters || currentState.filters.navigationFilters || currentState.filters.searchFilters;
            request.payload.searchTerms = queryParams.q;
            break;
        case 'BROWSE':
            request = JSON.parse(JSON.stringify(currentState.aem.browseConfig.request));
            request.payload.navigationFilters = appliedfilters || currentState.filters.navigationFilters || currentState.filters.browseFilters;
            catDimensionId = getCategoryDimension(request.payload.categoryid);
            break;
        case 'BRIDAL':
            request = JSON.parse(JSON.stringify(currentState.aem.engagementConfig.request));
            request.payload.navigationFilters = appliedfilters || currentState.filters.navigationFilters || currentState.filters.browseFilters;
            catDimensionId = getCategoryDimension(request.payload.categoryid);
            break;
        default:
            break;
    }

    if (isCustomFilter) {
        const pricesList = filtersData.filter(filter => filter.endecaDimensionId === FC.ENDECA_DIMENSIONIDS.PRICE_RANGES)[0];
        const selectedPricesList = pricesList && pricesList.dimensionValues.filter((price) => {
            return includes(appliedfilters, price.id);
        });

        if ((selectedPricesList && selectedPricesList.length) || removeCustomFilter) {
            isCustomFilter = false;
        }
        // Remove custoer filters when user sekects price filter from list or remove customer filter or clear all filters
        if ((includes(appliedfilters, 'custom') && !customPrices) || includes(appliedfilters, 'clear') || (selectedPricesList && selectedPricesList.length)) {
            delete request.payload.lowerPriceLimit;
            delete request.payload.upperPriceLimit;
        }
    }

    if (!isCustomFilter || removeCustomFilter || (isPop && appliedfilters.indexOf('custom') === -1)) {
        if (!(isPop && appliedfilters.indexOf('custom') !== -1)) {
            delete request.payload.lowerPriceLimit;
            delete request.payload.upperPriceLimit;
        }
    }

    // this will check to load last few items
    if (offset && currentState.filters.total && (offset + request.payload.recordsCountPerPage) > currentState.filters.total) {
        request.payload.recordsCountPerPage = currentState.filters.total - offset;
    }
    request.payload.recordsOffsetNumber = offset;
    if (type !== 'BRIDAL') {
        request.payload.sortTypeID = sortOption ? sortOption.value : currentState.sortOptions.selectedOption.value;
    }

    if (isCustomFilter || (customPrices && (customPrices.min || customPrices.max)) || (isPop && appliedfilters.indexOf('custom') !== -1)) {
        const priceValues = customPrices || currentState.filters.enteredCustomPrices;

        request.payload.lowerPriceLimit = isCustomFilter && !customPrices ? currentState.filters.minPrice.toString().replace(/\D/g, '') : priceValues.min.toString().replace(/\D/g, '');
        request.payload.upperPriceLimit = isCustomFilter && !customPrices ? currentState.filters.maxPrice.toString().replace(/\D/g, '') : priceValues.max.toString().replace(/\D/g, '');
    }

    if (sortOption) {
        request.payload.recordsCountPerPage = currentState.filters.productsLength || request.payload.recordsCountPerPage;
    }
    if (request.payload.navigationFilters.indexOf(request.payload.assortmentID) !== -1) {
        request.payload.navigationFilters.splice(request.payload.navigationFilters.indexOf(request.payload.assortmentID), 1);
    }

    if (catDimensionId) {
        const catDimensionIndex = request.payload.navigationFilters.filter((catfilerid) => {
            return String(catfilerid) === String(catDimensionId);
        });

        if (!catDimensionIndex.length) {
            request.payload.navigationFilters.push(catDimensionId);
        }
    }

    selectedFilters = getSelectedFilterObjects(request.payload.navigationFilters);
    if (collectionObj.length) {
        isCollectionSelected = !!(selectedFilters.filter(selFilter => selFilter.filterType === collectionObj[0].name).length);
    }

    if (pageNumber && !offset && !isSort) {
        request.payload.recordsCountPerPage *= parseInt(pageNumber, 10);
    }

    if (offset === 0) {
        currentState.filters.productsLength = 0; // This will reset the Producst for the current request
    }
    // Remove custom key from navigation filter
    if (request.payload.navigationFilters.indexOf('custom') !== -1) {
        request.payload.navigationFilters = removeValueFromArray(request.payload.navigationFilters, 'custom');
    }
    request.payload.navigationFilters = request.payload.navigationFilters.map((filter) => {
        return parseInt(filter, 10);
    });

    navigationFilters = cloneDeep(request.payload.navigationFilters);

    request.payload.navigationFilters.push(request.payload.assortmentID);

    if (isPop && appliedfilters.indexOf('custom') === -1) {
        delete request.payload.lowerPriceLimit;
        delete request.payload.upperPriceLimit;
    }

    ApiUtils.makeAjaxRequest(
        request,
        res => {
            redirectSearchPage(type, objectPath.get(res, 'resultDto.redirectDesktopUrl'), objectPath.get(res, 'resultDto.redirectMobileUrl'));

            let filters = objectPath.get(res, 'resultDto.dimensions', []);
            const resProducts = objectPath.get(res, 'resultDto.products', []);
            const total = objectPath.get(res, 'resultDto.numofRecords', 0);
            const maxPrice = objectPath.get(res, 'resultDto.maxPrice', '');
            let products = resProducts.map(product => {
                return getProductFromSearch(product);
            });
            const focusProduct = products;
            const selectedFiltersObjectWithEnd = getSelectedFiltersFromDimensions(filters);
            const selectedFiltersObj = getSelectedFilterObjects(selectedFiltersObjectWithEnd.map(filterEnd => filterEnd.id), selectedFiltersObjectWithEnd);

            const pricesObj = {
                minPrice: request.payload.lowerPriceLimit,
                maxPrice: request.payload.upperPriceLimit
            };

            if (request.payload.lowerPriceLimit || request.payload.upperPriceLimit) {
                navigationFilters.push('custom');
            }

            if (!isAuthormode) {
                const url = constructBrowseGridUrl(pricesObj, filters, navigationFilters, sortObject, objectPath.get(request, 'defaultDimensionId', false));
                const newUrl = `${url}${window.location.search}`;
                const historyObj = {
                    init,
                    filters: navigationFilters,
                    url: newUrl
                };

                let currentPageNumber = getUrlParameter('page');

                currentPageNumber = currentPageNumber ? parseInt(currentPageNumber, 10) : 1;

                // if current page is not 1 show prev link
                if (currentPageNumber && currentPageNumber !== 1) {
                    historyObj.prevUrl = currentPageNumber ? updateQueryStringParameter(newUrl, 'page', (parseInt(currentPageNumber, 10) - 1)) : newUrl;
                }

                // If all products are loaded donot show next link
                if ((currentState.filters.productsLength + resProducts.length) < total) {
                    historyObj.nextUrl = currentPageNumber ? updateQueryStringParameter(newUrl, 'page', (parseInt(currentPageNumber, 10) + 1)) : updateQueryStringParameter(newUrl, 'page', 2);
                }
                handleUrlState(historyObj, true);
            }

            /* Sequential filter selection logic starts here */
            let { isSequential, sequentialMin, sequentialMax } = false;

            // Don't have custom prices object in request payload
            if (!customPrices) {
                let prices = filters.filter(filter => filter.endecaDimensionId === FC.ENDECA_DIMENSIONIDS.PRICE_RANGES)[0];

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
            /* Sequential filter selection logic ends here */

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

            if (type !== 'BRIDAL') {
                /* Desiners & Collections Logic starts here */
                // filter collections object
                let collections = filters.filter(filter => filter.endecaDimensionId === FC.ENDECA_DIMENSIONIDS.COLLECTIONS)[0];

                // filter collections dimensions object
                collections = collections ? collections.dimensionValues || [] : [];

                // filter Designers object
                let designers = filters.filter(filter => filter.endecaDimensionId === FC.ENDECA_DIMENSIONIDS.DESIGNERS_COLLECTIONS)[0];

                // pick first 10 desiners
                if (designers && designers.dimensionValues && designers.dimensionValues.length > 10) {
                    designers = designers.dimensionValues.splice(0, 10);
                } else {
                    designers = designers ? designers.dimensionValues || [] : [];
                }
                // pick first 16 collections
                if (collections.length > collectionsSplitLength) {
                    collections = collections.splice(0, collectionsSplitLength);
                }

                // add isCollection to collection data
                collections = collections.map(collection => {
                    collection.isCollection = true;
                    return collection;
                });

                // Remove Collections objects from designers
                filters = filters.filter(filter => filter.endecaDimensionId !== FC.ENDECA_DIMENSIONIDS.COLLECTIONS);
                filters.map(filter => {
                    if (filter.endecaDimensionId === FC.ENDECA_DIMENSIONIDS.DESIGNERS_COLLECTIONS) {
                        if (isCollectionSelected) {
                            filter.dimensionValues = [...designers, ...collections];
                        } else {
                            filter.dimensionValues = designers;
                        }
                    }
                    return filter;
                });
            }
            const h1Toggle = objectPath.get(currentState.aem, 'engagementConfig.h1Toggle');
            const h1Strategy = objectPath.get(window, 'tiffany.authoredContent.engagementH1Strategy');
            const coreH1Toggle = objectPath.get(currentState.aem, 'browseConfig.h1Toggle');
            const coreH1Strategy = objectPath.get(window, 'tiffany.authoredContent.coreH1Strategy');
            const corePageTitleSuffix = objectPath.get(window, 'tiffany.authoredContent.browseConfig.pageTitleSuffix');
            const coreH1ToggleValues = ['HERO_BANNER', 'FULL_WIDTH', 'HEADLINE'];
            const isCollectionBrowseGrid = objectPath.get(window, 'tiffany.authoredContent.browseConfig.isCollectionBrowseGrid');
            let browseGridHeading = '';
            let headLine = '';
            let coreBrowseGridHeading = '';
            let coreHeadLine = '';
            let pageHeadlineText = '';
            const heroBannerText = objectPath.get(currentState.aem, 'heroBannerHeading');
            const setBgHeadingText = h1Toggle === 'FILTER_TEXT' ? '' : heroBannerText;

            if (type === 'BRIDAL' && h1Strategy) {
                browseGridHeading = objectPath.get(currentState.aem, 'engagementConfig.browseGridHeading', '');
                headLine = getEngagementHeadlineText(filters, browseGridHeading);
                pageHeadlineText = headLine && headLine !== FC.NO_FILTERS ? headLine : browseGridHeading;
                setTitle(`${pageHeadlineText} ${corePageTitleSuffix}`);
            } else if (type === 'BROWSE' && coreH1Strategy) {
                coreBrowseGridHeading = objectPath.get(currentState.aem, 'browseConfig.browseGridHeading', '');
                coreHeadLine = getCoreHeadlineText(filters, coreBrowseGridHeading);
                if (!isCollectionBrowseGrid) {
                    pageHeadlineText = coreHeadLine && coreHeadLine !== FC.NO_FILTERS ? coreHeadLine : coreBrowseGridHeading;
                    setTitle(`${pageHeadlineText} ${corePageTitleSuffix}`);
                }
            } else {
                browseGridHeading = objectPath.get(currentState.aem, 'browseConfig.browseGridHeading');
                headLine = getHeadlineText(filters, browseGridHeading);
            }

            if ((typeof headLine === 'object' && Object.keys(headLine).length > 0) || (typeof headLine === 'string' && headLine.length > 0)) {
                if (h1Toggle) {
                    if (type === 'BRIDAL' && h1Toggle.toUpperCase() !== 'FILTER_TEXT') {
                        const customEvent = new CustomEvent('updateHeader', { detail: headLine !== FC.NO_FILTERS ? headLine : heroBannerText });

                        if (gridHeader && headLine.length > 0) {
                            gridHeader.dispatchEvent(customEvent);
                        }
                    }

                    dispatch({
                        type: 'UPDATE_HEADER',
                        payload: headLine !== FC.NO_FILTERS ? headLine : setBgHeadingText
                    });
                }
            }

            if ((typeof coreHeadLine === 'object' && Object.keys(coreHeadLine).length > 0) || (typeof coreHeadLine === 'string' && coreHeadLine.length > 0)) {
                if (coreH1Toggle && !isCollectionBrowseGrid) {
                    if (type === 'BROWSE' && coreH1ToggleValues.indexOf(coreH1Toggle.toUpperCase()) >= 0) {
                        const browseGridHeadingTag = findFirst('.browse-grid-header');

                        if (browseGridHeadingTag && coreHeadLine.length > 0) {
                            browseGridHeadingTag.innerHTML = coreHeadLine !== FC.NO_FILTERS ? coreHeadLine : heroBannerText;
                        }
                    }

                    dispatch({
                        type: 'UPDATE_HEADER',
                        payload: coreHeadLine !== FC.NO_FILTERS ? coreHeadLine : setBgHeadingText
                    });
                }
            }

            // is sequential price selection and Dont has custom prices
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

            // if there is only one filter under CATEGORIES
            filters.map(filterData => {
                if (filterData.endecaDimensionId === 1 && filterData.dimensionValues.length === 1) {
                    const filter = filterData.dimensionValues[0];

                    filterData.name = filter.name;
                    filterData.id = filter.id;
                    filterData.dimensionValues = filter && filter.childDimensionValues ? filter.childDimensionValues : [];
                    filterData.singleCategoryFilter = true;
                    filterData.dimensionValueTypeText = filter.dimensionValueTypeText || '';
                }
                return filterData;
            });

            setFiltersAnalyticsData({
                appliedfilters, filters, sortOption, type, queryParams, total, pricesObj, navigationFilters, init, catDimensionId
            });

            if (offset === 0) {
                setProductsAnalyticsData(resProducts, type);
            } else {
                products = [...currentState.filters.rawProducts, ...products];
            }
            let finalMin = isCustomFilter && !customPrices && !(isPop && appliedfilters.indexOf('custom') === -1) ? currentState.filters.minPrice : '';
            let finalMax = isCustomFilter && !customPrices && !(isPop && appliedfilters.indexOf('custom') === -1) ? currentState.filters.maxPrice : '';

            if (isPop && appliedfilters.indexOf('custom') !== -1) {
                finalMin = request.payload.lowerPriceLimit;
                finalMax = request.payload.upperPriceLimit;
            }

            dispatch({
                type: FC.FILTERS_DATA,
                payload: {
                    filters,
                    products,
                    total,
                    type,
                    selectedFilters: selectedFiltersObj,
                    catDimensionId,
                    isCustomFilter: customPrices ? true : ((isCustomFilter && !(isPop && appliedfilters.indexOf('custom') === -1)) || (isPop && appliedfilters.indexOf('custom') !== -1)),
                    enteredCustomPrices: customPrices || currentState.filters.enteredCustomPrices,
                    minPrice: customPriceObj && customPriceObj.min ? Math.round(customPriceObj.min) : finalMin,
                    maxPrice: customPriceObj && customPriceObj.max ? Math.round(customPriceObj.max) : finalMax,
                    aem: currentState.aem,
                    navigationFilters: request.payload.navigationFilters, // This will keep a track of current applied filters
                    productsLength: currentState.filters.productsLength + resProducts.length, // This is the actual rpduct tiles length excluding marketing tiles
                    searchTerms: request.payload.searchTerms || '',
                    spillover: currentState.filters.spillover,
                    focusProduct: [focusProduct]
                }
            });
        },
        err => {
            console.log('err', err);
            dispatch({
                type: FC.FILTERS_FAILED
            });
        }
    );
    return {
        type: ''
    };
};

/**
 * @description Update filters function Once single action to handle them all
 * @param {object} filterOptions - { filters, init, type, sortOption, customPrices, removeCustomFilter }
 * {object} filters - Array of applied fiter Id's
 * {boolean} init - if is initialization
 * {string} type - Type of grid
 * {object} sortOption - Selected Sort options
 * {object} customPrices - custom prices
 * {boolean} removeCustomFilter - remove custom filter flag
 * @returns {object} Action type and payload
 */
export const updateFilters = (filterOptions) => (dispatch, getState) => {
    const {
        filters, // source - request.payload.navigationFilters / FC.navigationFilters
        init,
        type,
        sortOption,
        customPrices,
        removeCustomFilter,
        isSort,
        isPop
    } = filterOptions;
    const currentState = getState();
    const isAuthormode = (window.history && objectPath.get(window, 'tiffany.isAuthormode', false));
    const sortSelection = type !== 'BRIDAL' ? sortOption || currentState.sortOptions.selectedOption : '';
    const hasSortUrl = window.location.pathname.indexOf(encodeURI(sortSelection.sortUrlKey)) > -1;
    const sortObject = hasSortUrl || isSort ? sortSelection : '';

    const getOptions = {
        type: type || currentState.filters.type,
        offset: 0,
        appliedfilters: filters,
        sortOption,
        customPrices,
        removeCustomFilter,
        isSort,
        init,
        isAuthormode,
        sortObject,
        isPop
    };

    dispatch(getData(getOptions));
    return {
        type: ''
    };
};

/**
 * @deprecated
 * @description get on product selected/focus
 * @param {Boolean} val represent showSortoptions.
 * @returns {void}
 */
export const isSortOpen = (val) => (dispatch) => {
    dispatch({
        type: FC.SHOW_SORT_OPTIONS,
        payload: val
    });
};

/**
 * @description get selected filters list
 * @param {Array} list represent array of selected filters.
 * @returns {void}
 */
export const updateSelectedFilters = (list) => (dispatch) => {
    dispatch({
        type: FC.UPDATED_SELECTED_FILTERS,
        payload: list
    });
};

/**
 * @description supresses the marketing tile based on component name and config
 * @param {string} componentName Component name
 * @param {string} configName Components config name
 * @returns {object} returnds action creator
 */
export const suppressMarketingTile = (componentName, configName) => {
    return {
        type: FC.SUPRESS_MARKETING_TILE,
        payload: {
            componentName,
            configName
        }
    };
};
