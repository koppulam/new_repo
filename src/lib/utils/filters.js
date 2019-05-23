import * as objectPath from 'object-path';
import forIn from 'lodash/forIn';
import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';
import cloneDeep from 'lodash/cloneDeep';
import { findAll, findFirst } from 'lib/dom/dom-util';
import * as cookieUtil from 'lib/utils/cookies';
import FC from 'constants/FiltersConstants';

/**
 * @description - return X, Y positions of window
 * @returns {object} return oject of X, Y
 */
export const getScrollPosition = () => {
    const doc = document.documentElement;
    const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    const top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

    return {
        __scrollX: left,
        __scrollY: top
    };
};

let timeoutHandle = null;
const tryToScrollTo = (scrollTarget) => {
    const { body } = document;
    const html = document.documentElement;
    const TRY_TO_SCROLL_INTERVAL_MS = 50;

    // Stop any previous calls to "tryToScrollTo".
    clearTimeout(timeoutHandle);

    const documentWidth = Math.max(body.scrollWidth, body.offsetWidth,
        html.clientWidth, html.scrollWidth, html.offsetWidth);
    const documentHeight = Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);

    if (documentWidth - window.innerWidth >= scrollTarget.x &&
        documentHeight - window.innerHeight >= scrollTarget.y ||
        Date.now() > scrollTarget.latestTimeToTry) {
        window.scrollTo(scrollTarget.x, scrollTarget.y);
    } else {
        timeoutHandle = setTimeout(() => tryToScrollTo(scrollTarget),
            TRY_TO_SCROLL_INTERVAL_MS);
    }
};

// Try scrolling to the previous scroll position on popstate
export const scrollOnPageLoad = (scrollPosition = { __scrollX: 0, __scrollY: 0 }) => {
    const SCROLL_RESTORATION_TIMEOUT_MS = 3000;

    if (scrollPosition &&
        Number.isFinite(scrollPosition.__scrollX) &&
        Number.isFinite(scrollPosition.__scrollY)) {
        setTimeout(() => tryToScrollTo({
            x: scrollPosition.__scrollX,
            y: scrollPosition.__scrollY,
            latestTimeToTry: Date.now() + SCROLL_RESTORATION_TIMEOUT_MS,
        }));
    }
};

/**
 * @description - Return the value based on check
 * @param {number} dimension1 first dimension to sort
 * @param {number} dimension2 second dimension to sort
 * @returns {number} flag number
 */
export const sortDimension = (dimension1, dimension2) => {
    if (Number(dimension1.displayOrder) < Number(dimension2.displayOrder)) {
        return -1;
    } else if (Number(dimension1.displayOrder) > Number(dimension2.displayOrder)) {
        return 1;
    }
    return 0;
};

/**
 * Remove key from a flat array
 * @param {object} navigationFilters navigationFilters array
 * @param {string} value value
 * @returns {object} returns filtered array
 */
export const removeValueFromArray = (navigationFilters, value) => {
    return navigationFilters.filter((filterObj) => {
        return filterObj !== value;
    });
};

/**
 * @description - decode URI string and return given query key value
 * @param {string} name key name
 * @returns {string} return value of given key
 */
export const getUrlParameter = (name) => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);

    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

/**
 * @description - update given query key value and return updated URL
 * @param {string} uri url string
 * @param {string} key query string key name
 * @param {string} value querystring key value to replace
 * @returns {string} return updated URL
 */
export const updateQueryStringParameter = (uri, key, value) => {
    const regex = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';

    if (uri.match(regex)) {
        return uri.replace(regex, `$1${key}=${value}$2`);
    }
    return `${uri}${separator}${key}=${value}`;
};

/**
 * @description - return next pagination URL in the given pattern
 * @param {string} key query string key name
 * @returns {string} return next URL for pagination
 */
export const getNextUrl = (key) => {
    const pageNumber = getUrlParameter(key);

    return pageNumber ? updateQueryStringParameter(location.href, key, (parseInt(pageNumber, 10) + 1)) : updateQueryStringParameter(location.href, key, 2);
};

export const getPrevUrl = (key) => {
    const pageNumber = getUrlParameter(key);

    return pageNumber ? updateQueryStringParameter(location.href, key, (parseInt(pageNumber, 10) - 1)) : location.href;
}

/**
 * @description - update/replace the history state
 * @param {object} historyObj contains required data of history api(init, filters, url)
 * @param {Boolean} isBrowseGrid is browse grid page
 * @returns {void}
 */
export const handleUrlState = (historyObj, isBrowseGrid) => {
    const {
        init,
        filters,
        url,
        prevUrl,
        nextUrl
    } = historyObj;

    if (init) {
        window.history.replaceState({ filters }, null, url);
    } else {
        window.history.pushState({ filters }, null, url);
    }
    if (isBrowseGrid) {
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        
        const pageNumber = getUrlParameter('page');
        let hrefUpdated =  document.location.href;

        if (pageNumber) {
            hrefUpdated = hrefUpdated.replace(document.location.search, '');
        }
        if (canonicalLink) {
            canonicalLink.href = hrefUpdated;
        }

        const nextUrlLink = document.querySelector('link[rel="next"]');
        const prevUrlLink = document.querySelector('link[rel="prev"]');

        if (nextUrl) {
            if (nextUrlLink) {
                nextUrlLink.href = nextUrl;
            } else {
                let nextUrlElem = document.createElement('link');

                nextUrlElem.rel = 'next';
                nextUrlElem.href = nextUrl;
                document.getElementsByTagName('head')[0].appendChild(nextUrlElem);
            }
        } else if (nextUrlLink) {
            nextUrlLink.parentNode.removeChild(nextUrlLink);
        }

        if (prevUrl) {
            if (prevUrlLink) {
                prevUrlLink.href = prevUrl;
            } else {
                let prevUrlElem = document.createElement('link');

                prevUrlElem.rel = 'prev';
                prevUrlElem.href = prevUrl;
                document.getElementsByTagName('head')[0].appendChild(prevUrlElem);
            }
        } else if (prevUrlLink) {
            prevUrlLink.parentNode.removeChild(prevUrlLink);
        }
    }
};

/**
 * @description update canonical tag href value
 * @param {string} href new url to update
 * @returns {void}
 */
export const updateCanonicalTag = (href) => {
    const element = findFirst('link[rel="canonical"]');

    if (element) {
        const pageNumber = getUrlParameter('page');
        let hrefUpdated =  document.location.href;

        if (pageNumber) {
            hrefUpdated = hrefUpdated.replace(document.location.search, '');
        }
        element.href = hrefUpdated;
    }
};

/**
 * @description - return child filters for given subfilter id
 * @param {*} filtersData parent filters data
 * @param {*} filterId sub filter is
 * @param {*} endecaDimensionId filters endecaDimensionId
 * @returns {object} child filter id's
 */
export const getChildFilters = (filtersData, filterId, endecaDimensionId) => {
    const categoryFilters = filtersData.filter((filter) => {
        return String(filter.endecaDimensionId) === String(endecaDimensionId) && filter.dimensionValues;
    });

    const subFilters = categoryFilters.length && categoryFilters[0].dimensionValues && categoryFilters[0].dimensionValues.filter((subFilter) => {
        return String(subFilter.id) === String(filterId);
    });

    const childFiltersId = subFilters.length && subFilters[0].childDimensionValues && subFilters[0].childDimensionValues.map((childFilter) => {
        return String(childFilter.id);
    });

    return typeof childFiltersId !== 'object' ? [] : childFiltersId;
};

/**
 * @description getFilterPriorityMap
 * @returns {array} Priority map
 */
export function getFilterPriorityMap() {
    return cloneDeep(objectPath.get(window, 'tiffany.authoredContent.filterPriorityMap', ['CUSTOM PRICE', 'PRICE RANGES', 'GEMSTONES', 'MATERIALS', 'DESIGNERS & COLLECTIONS', 'COLLECTIONS', 'GEMSTONECOLOR', 'UNMAPPED CATEGORIES', 'CATEGORIES']));
}

/**
 * @description Get selected filter objects
 * @param {array} filters filter ids
 * @param {Array} selectedFiltersObjectWithEnd selected Filters Object With EndecaDimensionId
 * @returns {array} selected filters objects from global map
 */
export function getSelectedFilterObjects(filters, selectedFiltersObjectWithEnd) {
    const filterMap = cloneDeep(objectPath.get(window, 'tiffany.authoredContent.filtersMap', []));

    return filters.map((filterId) => {
        const filterMapArray = filterMap.filter(filterObj => String(filterObj.filterDimensionId) === String(filterId));

        if (filterMapArray && filterMapArray.length) {
            if (selectedFiltersObjectWithEnd) {
                const filteredObj = selectedFiltersObjectWithEnd.filter(x => x.id === filterId);

                if (filteredObj && filteredObj.length) {
                    filterMapArray[0].endecaId = filteredObj[0].dimensionId;
                }
            }
            return filterMapArray[0];
        }
        return null;
    }).filter(filterObj => filterObj);
}

export function updateCustomPriceFilterMap(customPrices) {
    const filterMap = objectPath.get(window, 'tiffany.authoredContent.filtersMap', []);

    filterMap.forEach((filter, index) => {
        if (filter.filterDimensionId === 'custom') {
            if (customPrices.min === '') {
                customPrices.min = 0;
            }
            filterMap[index].filterUrlId = `price-${customPrices.min}-${customPrices.max}`;
        }
    });
}
/**
 * @description Filters Url map
 * @param {string} filterId filterDimensionID
 * @returns {Object} selected filter object from global map
 */
export function getFilterUrlMap(filterId) {
    const filterMap = cloneDeep(objectPath.get(window, 'tiffany.authoredContent.filtersMap', []));

    return filterMap.filter(currentFilter => String(currentFilter.filterDimensionId) === String(filterId))[0];
}

/**
 * @description Get Dimension id by category id
 * @param {string} id category id
 * @returns {string} category dimensionid
 */
export function getCategoryDimension(id) {
    const filterMap = objectPath.get(window, 'tiffany.authoredContent.filtersMap', []);

    return filterMap.filter(filterObj => String(filterObj.filterCategoryId) === String(id))[0].filterDimensionId;
}


/**
 * @description Get headline text based on prioritymaps
 * @param {String} separatorStr Duplicate separator text
 * @param {String} patternStr Pattern selected filter string.
 * @param {String} separator separator authored seprator text.
 * @returns {string} pattern text.
 */
export function removeDuplicateSeprator(separatorStr, patternStr, separator) {
    let updatedstr = patternStr;

    // Duplicate separators.
    if (updatedstr.match(separatorStr)) {
        // Replace if seprators are adjacent to each other with/without space.
        updatedstr = updatedstr.replace(separatorStr, separator);
    }

    return updatedstr;
}

/**
 * @description Get headline text based on prioritymaps
 * @param {Object} separator Separtor Authored sepratoe text
 * @param {Object} pattern Pattern selected filter string.
 * @returns {string} pattern text.
 */
export function setPattern(separator, pattern) {
    let patternStr = pattern.trim();

    // Replace multiple white spaces inside a string.
    patternStr = patternStr.replace(/  +/g, ' ');

    // Authored pattern with space.
    patternStr = removeDuplicateSeprator(`${separator} ${separator}`, patternStr, separator);
    // Authored pattern without space.
    patternStr = removeDuplicateSeprator(`${separator}${separator}`, patternStr, separator);

    if (patternStr.substring(0, 1) === separator) {
        patternStr = patternStr.slice(1, patternStr.length);
    }

    if (patternStr.substring(patternStr.length - 1, patternStr.length) === separator) {
        patternStr = patternStr.slice(0, (patternStr.length - 1));
    }

    return patternStr;
}

/**
 * @description Get headline text based on prioritymaps
 * @param {Object} patternMatchingMap Container selected filters with endicaDimensionId:FilterName.
 * @returns {string} Head line text.
 */
export function getUpdatedHeading(patternMatchingMap) {
    const patternMatchingMapConfig = objectPath.get(window, 'tiffany.authoredContent.engagementPatternMatchingMap', {});
    let headLineTextPattern = objectPath.get(window, 'tiffany.authoredContent.engagementHeadLineTextPattern', '');
    const separator = objectPath.get(window, 'tiffany.authoredContent.engagementFilterSeparator', '');

    for (let key in patternMatchingMapConfig) {
		if (patternMatchingMapConfig.hasOwnProperty(key)) {
			const replaceKey = '{' + key + '}';
            let pattern = patternMatchingMapConfig[key].replace(/{(.*?)}/g, patternMatchingMap[key]);

            pattern= `${separator} ${pattern} ${separator}`;

			if (headLineTextPattern && headLineTextPattern.length > 0) {
				if (patternMatchingMap[key]) {
					headLineTextPattern = headLineTextPattern.replace(replaceKey, patternMatchingMapConfig[key]);
                    headLineTextPattern = headLineTextPattern.replace(patternMatchingMapConfig[key], pattern);
				} else {
                    headLineTextPattern = headLineTextPattern.replace(replaceKey, '');
                }
			}
		}
    }

    if (separator && separator.length > 0) {
        headLineTextPattern = setPattern(separator, headLineTextPattern);
    }

    return headLineTextPattern;
}

/**
 * @description Get headline text based on prioritymaps
 * @param {Object} patternMatchingMap Container selected filters with endicaDimensionId:FilterName.
 * @returns {string} Head line text.
 */
export function getCoreUpdatedHeading(patternMatchingMap) {
    const patternMatchingMapConfig = objectPath.get(window, 'tiffany.authoredContent.corePatternMatchingMap', {});
    let headLineTextPattern = objectPath.get(window, 'tiffany.authoredContent.coreHeadLineTextPattern', '');
    const separator = objectPath.get(window, 'tiffany.authoredContent.coreFilterSeparator', '');

    for (let key in patternMatchingMapConfig) {
        if (patternMatchingMapConfig.hasOwnProperty(key)) {
            const replaceKey = '{' + key + '}';
            let pattern = patternMatchingMapConfig[key].replace(/{(.*?)}/g, patternMatchingMap[key]);

            pattern = `${separator} ${pattern} ${separator}`;

            if (headLineTextPattern && headLineTextPattern.length > 0) {
                if (patternMatchingMap[key]) {
                    headLineTextPattern = headLineTextPattern.replace(replaceKey, patternMatchingMapConfig[key]);
                    headLineTextPattern = headLineTextPattern.replace(patternMatchingMapConfig[key], pattern);
                } else {
                    headLineTextPattern = headLineTextPattern.replace(replaceKey, '');
                }
            }
        }
    }

    if (separator && separator.length > 0) {
        headLineTextPattern = setPattern(separator, headLineTextPattern);
    }

    return headLineTextPattern;
}

/**
 * @description checkForCategories Method check for Category filter.
 * @param {Object} data Which holds and endeca dimesnionId, name etc..
 * @returns {Boolean} Returns a boolean.
 */
export function checkForCategories(data) {
    let flag = false;

    if (data && data.endecaDimensionId === FC.ENDECA_DIMENSIONIDS.CATEGORIES) {
        flag = true;
    }

    return flag;
}

/**
 * @description Get SelectedFilters based on config and selected filters.
 * @param {Object} config authored content data
 * @param {Object} filters Filters data from API Call.
 * @param {Object} defaultDimensionId defaultDimensionId from API Call.
 * @returns {Array} Returns an object with selectedFilters and endicaDimesnionId.
 */
export function getSelectedFilters(config = [], filters = [], defaultDimensionId = false) {
    let configuredFilters = config;

    configuredFilters = configuredFilters.map(endecaDimensionObj => {
        const response = {};

        response.endecaDimensionId = endecaDimensionObj.value;
        const correspondingFilters = filters.filter(filterItem => filterItem.endecaDimensionId === endecaDimensionObj.value)[0];
        // Check for filter type categories.
        const isCategories = checkForCategories(correspondingFilters);

        // In case of categories even through selected is not available get childFilters for selefcted values.
        if (correspondingFilters) {
            let selected = correspondingFilters.dimensionValues.filter(item => ((item.selected === 'YES' && !(defaultDimensionId && item.id && parseInt(item.id, 10) === parseInt(defaultDimensionId, 10))) || (!item.selected && item.childDimensionValues && isCategories))).map(selectedFil => {
                selectedFil.endecaDimensionId = endecaDimensionObj.value;
                return selectedFil;
            });

            selected.forEach(selecFilter => {
                // Added check to exclude child filters.
                if (!selecFilter.selected && selecFilter.childDimensionValues) {
                    const childDim = selecFilter.childDimensionValues
                        .filter(i => i.selected === 'YES')
                        .map(selectedChildFil => {
                            selectedChildFil.endecaDimensionId = endecaDimensionObj.value;
                            return selectedChildFil;
                        });

                    if (childDim.length === 0) { // Child filter not selected
                        selected = [];
                    }

                    if (!(isCategories && childDim.length > 0)) {
                        selected = selected.concat(childDim);
                    }
                }
            });
            response.selectedFilters = selected;
        } else {
            response.selectedFilters = [];
        }
        return response;
    });

    return configuredFilters;
}

/**
 * @description Get Headline Text
 * @param {Object} filters list of filters.
 * @param {String} browseGridHeading browse grid heading authored.
 * @param {Objectr} choosedFilters choosedFilters selected/Choosen filters.
 * @returns {string} category dimensionid
 */
export function getEngagementHeadlineText(filters = [], browseGridHeading = undefined) {
    let configuredFilters = objectPath.get(window, 'tiffany.authoredContent.ENDECA_FILTER_DIMENSIONS_ORDER', []);
    let heading = '';
    const engDefaultDimensionId = objectPath.get(window, 'tiffany.authoredContent.engagementConfig.request.defaultDimensionId', false);

    configuredFilters = getSelectedFilters(configuredFilters, filters, engDefaultDimensionId);
    configuredFilters = configuredFilters.filter(item => item.selectedFilters.length > 0);

    let patternMatchingMap = {};
    const selectedFilters = [];
    let sortedFilters = [];

    configuredFilters.forEach(item => {
        sortedFilters = (item.selectedFilters).sort((item1, item2) => {
            return item1.displayOrder - item2.displayOrder;
        });
        // Sort it based on display order and capture the first item from the category.
        selectedFilters[item.endecaDimensionId] = sortedFilters[0].name;
    });


    // If selected filters contains gemstone pick gemstone only.
    if (selectedFilters[FC.ENDECA_DIMENSIONIDS.GEMSTONES]) {
        patternMatchingMap[FC.ENDECA_DIMENSIONIDS.GEMSTONES] = selectedFilters[FC.ENDECA_DIMENSIONIDS.GEMSTONES];
    } else {
        patternMatchingMap = getPriotirizedFilters(selectedFilters);
    }

    if (configuredFilters.length === 0) {
        heading = FC.NO_FILTERS;
    } else if (configuredFilters.length >= 1) {
        heading = getUpdatedHeading(patternMatchingMap);
    }

    return heading;
}

/**
 * @description Get filters based on prioritymaps
 * @param {Object} filters filters
 * @param {String} choosedFilters selected filters.
 * @param {String} type type
 * @returns {string} category dimensionid
 */
export function getPriotirizedFilters(filters, choosedFilters, type = '') {
    const filterPriorityMap = objectPath.get(window, 'tiffany.authoredContent.filterPriorityMap', []);
    const dimensionOrder = objectPath.get(window, 'tiffany.authoredContent.ENDECA_FILTER_DIMENSIONS_ORDER', []);
    const h1Strategy = (type === 'BROWSE') ? objectPath.get(window, 'tiffany.authoredContent.coreH1Strategy', '') : objectPath.get(window, 'tiffany.authoredContent.engagementH1Strategy', '');
    const priorityFilterName = [];
    const filtersOrdered = {};
    let sortedFilters = {};

    filterPriorityMap.forEach((map) => {
        dimensionOrder.forEach((order) => {
            if (map.toUpperCase() === (order.name).toUpperCase()) {
                priorityFilterName.push(order.value);
            }
        });
    });

    if (filters && filters.length > 0) {
        priorityFilterName.forEach((filterName) => {
            if (filters[filterName]) {
                filtersOrdered[filterName] = filters[filterName];
            }
        });
    }

    if (filtersOrdered && Object.keys(filtersOrdered).length > 0) {
        if (h1Strategy && h1Strategy.toLowerCase() === 'single') {
            for (let item in filtersOrdered) {
                if (Object.keys(sortedFilters).length < 1) {
                    sortedFilters[item] = filtersOrdered[item];
                }
            }
        } else if (h1Strategy && h1Strategy.toLowerCase() === 'multiple') {
            for (let item in filtersOrdered) {
                if (Object.keys(sortedFilters).length < 2) {
                    sortedFilters[item] = filtersOrdered[item];
                }
            }
        } else {
            sortedFilters = {};
        }
    }

    return sortedFilters;
}

/**
 * @description Get Headline Text
 * @param {Object} filters list of filters.
 * @param {String} browseGridHeading browse grid heading authored.
 * @param {Objectr} choosedFilters choosedFilters selected/Choosen filters.
 * @returns {string} category dimensionid
 */
export function getCoreHeadlineText(filters = [], browseGridHeading = undefined) {
    let configuredFilters = objectPath.get(window, 'tiffany.authoredContent.ENDECA_FILTER_DIMENSIONS_ORDER', []);
    let heading = '';
    const coreDefaultDimensionId = objectPath.get(window, 'tiffany.authoredContent.browseConfig.request.defaultDimensionId', false);

    configuredFilters = getSelectedFilters(configuredFilters, filters, coreDefaultDimensionId);
    configuredFilters = configuredFilters.filter(item => item.selectedFilters.length > 0);

    let patternMatchingMap = {};
    const selectedFilters = [];
    let sortedFilters = [];

    configuredFilters.forEach(item => {
        sortedFilters = (item.selectedFilters).sort((item1, item2) => {
            return item1.displayOrder - item2.displayOrder;
        });
        // Sort it based on display order and capture the first item from the category.
        if (item.endecaDimensionId !== FC.ENDECA_DIMENSIONIDS.PRICE_RANGES && item.endecaDimensionId !== FC.ENDECA_DIMENSIONIDS.CATEGORIES) {
            selectedFilters[item.endecaDimensionId] = sortedFilters[0].name;
        }

        if (item.endecaDimensionId === FC.ENDECA_DIMENSIONIDS.CATEGORIES) {
            if (sortedFilters.length >= 1) {
                // As it is already sorted based on displayOrder pick the first one as priority for categories.
                selectedFilters[item.endecaDimensionId] = sortedFilters[0].name;
            }
        }
    });

    patternMatchingMap = getPriotirizedFilters(selectedFilters, '', 'BROWSE');

    if (configuredFilters.length === 0) {
        heading = FC.NO_FILTERS;
    } else if (configuredFilters.length >= 1) {
        heading = getCoreUpdatedHeading(patternMatchingMap);
    }

    return heading;
}

/**
 * @description Get Headline Text
 * @param {Object} filters filters
 * @param {String} browseGridHeading browse grid heading authored
 * @returns {string} category dimensionid
 */
export function getHeadlineText(filters, browseGridHeading) {
    let listDimensions = objectPath.get(window, 'tiffany.authoredContent.ENDECA_FILTER_DIMENSIONS_ORDER');
    let finalSelectedFilters = [];

    listDimensions = listDimensions.map(endecaDimensionObj => {
        let response = {};

        response.endecaDimensionId = endecaDimensionObj.value;
        const correspondingFilters = filters.filter(filter => filter.endecaDimensionId === endecaDimensionObj.value)[0];

        if (correspondingFilters) {
            let selected = correspondingFilters.dimensionValues.filter(filter => filter.selected === 'YES').map(x => {
                x.endecaDimensionId = endecaDimensionObj.value;
                return x;
            });

            selected.forEach(selecFilter => {
                if (selecFilter.childDimensionValues) {
                    selected = selected
                        .concat(
                            selecFilter.childDimensionValues
                                .filter(filterObj => filterObj.selected === 'YES')
                        )
                        .map(x => {
                            x.endecaDimensionId = endecaDimensionObj.value;
                            return x;
                        });
                }
            });
            finalSelectedFilters = finalSelectedFilters.concat(selected);
            response.selectedFilters = selected;
        } else {
            response.selectedFilters = [];
        }
        return response;
    });
    finalSelectedFilters = finalSelectedFilters.filter(x => x.endecaDimensionId !== FC.ENDECA_DIMENSIONIDS.PRICE_RANGES && x.endecaDimensionId !== FC.ENDECA_DIMENSIONIDS.GEMSTONECOLOR);
    listDimensions = filter(listDimensions, { selectedFilters: [{ selected: 'YES' }] })
        .filter(dim => dim.endecaDimensionId !== FC.ENDECA_DIMENSIONIDS.GEMSTONECOLOR && dim.endecaDimensionId !== FC.ENDECA_DIMENSIONIDS.PRICE_RANGES);
    if (listDimensions.length === 0) {
        return browseGridHeading;
    }
    // Pick first two
    finalSelectedFilters.splice(2);
    if (finalSelectedFilters.length === 1) {
        const firstFilterValue = finalSelectedFilters[0];
        const singlePatters = objectPath.get(window, 'tiffany.authoredContent.browseConfig.headingPattern.single', []);
        const pattern = singlePatters.filter(obj => obj.endecaDimensionId === firstFilterValue.endecaDimensionId)[0];

        if (pattern && pattern.format) {
            return pattern.format
                .replace('{filter}', firstFilterValue.name)
                .replace('{browseHeading}', browseGridHeading);
        }
        return browseGridHeading;
    }
    if (finalSelectedFilters.length === 2) {
        const multiplePatterns = objectPath.get(window, 'tiffany.authoredContent.browseConfig.headingPattern.multiple', []);
        // contains material and gemstone
        const groupedSelectedFilters = groupBy(finalSelectedFilters, x => x.endecaDimensionId);

        if (groupedSelectedFilters[FC.ENDECA_DIMENSIONIDS.MATERIALS] && groupedSelectedFilters[FC.ENDECA_DIMENSIONIDS.GEMSTONES]) {
            const selectedPattern = multiplePatterns.filter(obj => obj.type === 'material-gemstone')[0];

            if (selectedPattern) {
                return selectedPattern.format
                    .replace('{material}', groupedSelectedFilters[FC.ENDECA_DIMENSIONIDS.MATERIALS][0].name)
                    .replace('{gemstone}', groupedSelectedFilters[FC.ENDECA_DIMENSIONIDS.GEMSTONES][0].name)
                    .replace('{browseHeading}', browseGridHeading);
            }
        }

        // Category selection
        if (groupedSelectedFilters[1]) {
            const selectedPattern = multiplePatterns.filter(obj => obj.type === 'category-any')[0];
            const filterObj = finalSelectedFilters.filter(x => x.endecaDimensionId !== FC.ENDECA_DIMENSIONIDS.CATEGORIES);
            const filterName = filterObj.length ? filterObj[0].name : '';

            if (selectedPattern) {
                return selectedPattern.format
                    .replace('{category}', groupedSelectedFilters[FC.ENDECA_DIMENSIONIDS.CATEGORIES][0].name)
                    .replace('{filter}', filterName)
                    .replace('{browseHeading}', browseGridHeading);
            }
        }
        // designer and collection selection
        if (groupedSelectedFilters[FC.ENDECA_DIMENSIONIDS.DESIGNERS_COLLECTIONS]) {
            const selectedPattern = multiplePatterns.filter(obj => obj.type === 'collection-any')[0];
            const filterObj = finalSelectedFilters.filter(x => x.endecaDimensionId !== FC.ENDECA_DIMENSIONIDS.DESIGNERS_COLLECTIONS);
            const filterName = filterObj.length ? filterObj[0].name : '';

            if (selectedPattern) {
                return selectedPattern.format
                    .replace('{collection}', groupedSelectedFilters[FC.ENDECA_DIMENSIONIDS.DESIGNERS_COLLECTIONS][0].name)
                    .replace('{filter}', filterName)
                    .replace('{browseHeading}', browseGridHeading);
            }
        }
    } else {
        return false;
    }
    return false;
}

/**
 * @description Will return the URL for given filters
 * @param {array} filters Array of filter id's (no need of order) - source - request.payload.navigationFilters
 * @param {array} sortOption array
 * @returns {string} Url that is constructed according to teh priority map
 */
export function getUrlFromFilters(filters, sortOption) {
    // get filter object(from filters map) for each filter id that we get in navigationFilters.
    const selectedFilters = getSelectedFilterObjects(filters);
    const baseUrl = cloneDeep(objectPath.get(window, 'tiffany.authoredContent.baseUrl', ''));
    const splitUrl = baseUrl.split('/shop').length > 1 ? baseUrl.split('/shop')[1] : '';
    let url = '';

   /*
        Priority map has main categories list.
        Sort selected filters based on priority map categories
        and then sort based on filter order within filters of each category.
    */
    url += getFilterPriorityMap().map(filterType => {
        return selectedFilters
            .filter(selectedFilter => (((selectedFilter.filterType).toLowerCase() === filterType.toLowerCase()) && (splitUrl.indexOf(selectedFilter.filterUrlId) === -1)))
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
}

/**
 * @description Check if noindex nofollow for anchors
 * @param {Object} filters selected filters
 * @param {Object} currentFilterId currentFilterId
 * @param {Strign} currentGroupName currentGroupName
 * @param {String} filterType filterType
 * @param {Boolean} isCustomFilter
 * @returns {Boolean} true if selcted filters contain price/category/ certain selection (multiple subcategory selected on a category)
 */
export function isRobotTag(filters, currentFilterId, currentGroupName, filterType, isCustomFilter) {
    const groupedFilters = filters && groupBy(filters, (filterObj) => {
        return filterObj.filterType;
    });

    Object.filtersSize = function(obj) {
        let size = 0, key;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    const toggleMetaRobotTag = function(action) {
        if (action === 'add') {
            const element = findFirst('link[rel="canonical"]');
            const indexElement = findFirst('meta[content="INDEX, FOLLOW"]');

            if (element) {
                element.parentNode.removeChild(element);
            }
            if (indexElement) {
                indexElement.parentNode.removeChild(indexElement);
            }

            if (!findAll('meta[content="NOINDEX, NOFOLLOW"]').length) {
                let metaRobot = document.createElement('meta');
                metaRobot.name = 'ROBOTS';
                metaRobot.content = 'NOINDEX, NOFOLLOW';
                document.getElementsByTagName('head')[0].appendChild(metaRobot);
            }
        } else if (action === 'remove') {
            const element = findFirst('meta[content="NOINDEX, NOFOLLOW"]');
            if (element) {
                element.parentNode.removeChild(element);
            }

            // if no canonical add it
            if (!findAll('link[rel="canonical"]').length) {
                let canonical = document.createElement('link');

                canonical.rel = 'canonical';
                const pageNumber = getUrlParameter('page');
                let hrefUpdated =  document.location.href;

                if (pageNumber) {
                    hrefUpdated = hrefUpdated.replace(document.location.search, '');
                }
                canonical.href = hrefUpdated;
                
                document.getElementsByTagName('head')[0].appendChild(canonical);
            }
        }
    }

    toggleMetaRobotTag('remove');

    if (objectPath.get(window, 'tiffany.authoredContent.noIndex')) {
        toggleMetaRobotTag('add');
        return true;
    }

    if (groupedFilters['PRICE RANGES'] && groupedFilters['PRICE RANGES'].length > 0) {
        toggleMetaRobotTag('add');
        return true;
    }
    if (groupedFilters['CATEGORIES'] && groupedFilters['CATEGORIES'].length > 0) {
        toggleMetaRobotTag('add');
        return true;
    }

    const isCategorySelected = filters.filter(x => x.endecaId === 1);

    if (isCategorySelected && isCategorySelected.length) {
        toggleMetaRobotTag('add');
        return true;
    }

    if (isCustomFilter) {
        toggleMetaRobotTag('add');
        return true;
    }

    let isFilterCertain = false;

    const checkSubFiltersLength = function(selection) {
        forIn(filters, (filter) => {
            if (filters.length === 1 && filter && parseInt(filter.filterDimensionId, 10) !== parseInt(currentFilterId, 10)) {
                if (selection === 'singleDimension' && currentGroupName && filter.filterType && filter.filterType.toLowerCase() === currentGroupName.toLowerCase()) {
                    isFilterCertain = true;
                }
            }
            if (filters.length === 2) {
                isFilterCertain = true;

                if(selection === 'singleDimension' || (groupedFilters['GEMSTONES'] && filterType === 'BRIDAL')) {
                    toggleMetaRobotTag('add');
                }
            }
            if (filters.length >= 3) {
                isFilterCertain = true;
                toggleMetaRobotTag('add');
            }
        });
        return isFilterCertain;
    }

    // Get the length of filters object
    const filtersLength = Object.filtersSize(groupedFilters);

    if (filterType === 'BROWSE' && filtersLength && objectPath.get(window, 'tiffany.authoredContent.browseConfig.isCollectionBrowseGrid')) {
        toggleMetaRobotTag('add');
        return true;
    }

    if (filterType === 'BRIDAL' && filtersLength === 1 && groupedFilters['GEMSTONES'] && groupedFilters['GEMSTONES'].length === 1) {
        return true;
    }

    if (filtersLength === 1) {
        return checkSubFiltersLength('singleDimension');
    }
    return checkSubFiltersLength('multiDimension');
}

/**
 * @description Find and return config object for given grid type
 * @param {string} parentObject parent object
 * @param {string} type type of browse grid
 * @returns {object} returns object of conf
 */
export const getConfigObject = (parentObject, type) => {
    let filters;

    switch (type) {
        case 'SEARCH':
            filters = cloneDeep(objectPath.get(parentObject, 'searchConfig.request.payload', {}));
            break;
        case 'BROWSE':
            filters = cloneDeep(objectPath.get(parentObject, 'browseConfig.request.payload', {}));
            break;
        case 'BRIDAL':
            filters = cloneDeep(objectPath.get(parentObject, 'engagementConfig.request.payload', {}));
            break;
        default:
            filters = {};
            break;
    }
    return cloneDeep(filters);
};

/**
 * @description Find and return config object for given filter dimensions
 * @param {object} parentObject aem object
 * @param {string} endecaDimensionId endecaDimensionId
 * @returns {object} returns object of conf
 */
export const getFilterImageConfig = (parentObject, endecaDimensionId) => {
    let imageObject;

    switch (Number(endecaDimensionId)) {
        case FC.ENDECA_DIMENSIONIDS.DESIGNERS_COLLECTIONS: // Collections (Designers & collections)
            imageObject = objectPath.get(parentObject, 'designerCollections', {});
            break;
        case FC.ENDECA_DIMENSIONIDS.MATERIALS: // Material
            imageObject = objectPath.get(parentObject, 'material', {});
            break;
        case FC.ENDECA_DIMENSIONIDS.GEMSTONECOLOR: // Gemstone Color
            imageObject = objectPath.get(parentObject, 'color', {});
            break;
        case FC.ENDECA_DIMENSIONIDS.SETTING: // Setting
            imageObject = objectPath.get(parentObject, 'settings', {});
            break;
        case FC.ENDECA_DIMENSIONIDS.DIAMONSHAPE: // Diamond Shape
            imageObject = objectPath.get(parentObject, 'diamond', {});
            break;
        case FC.ENDECA_DIMENSIONIDS.BANDS: // Bands Style
            imageObject = objectPath.get(parentObject, 'bands', {});
            break;
        default:
            imageObject = {};
            break;
    }
    return imageObject;
};
