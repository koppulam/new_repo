import ApiUtils from 'lib/api';
import * as objectPath from 'object-path';
import SC from 'constants/StoresConstants';
import find from 'lodash/find';
import { setAnalyticsData } from 'lib/utils/analytics-util';
import store from 'react-app/store';

/**
 * @default typeahead
 * @returns {void}
 */
const getFullStores = () => (dispatch) => {
    const storesApiUrl = objectPath.get(window, 'tiffany.authoredContent.storesConfig.listApiConfig');

    ApiUtils.makeAjaxRequest(
        storesApiUrl,
        res => {
            dispatch({
                type: SC.STORES_UPDATED,
                payload: {
                    storesList: res.resultDto
                }
            });
        },
        err => {
            console.log(err);
        }
    );
};

export const visibleStores = (stores) => (dispatch) => {
    dispatch({
        type: SC.STORES_UPDATED,
        payload: {
            visibleStoresList: stores
        }
    });
};

export const updateStoresSearchData = (searchData) => (dispatch) => {
    const stores = {
        keyword: searchData.selectedRegion,
        distance: searchData.selectedDistance,
        services: searchData.selectedServices
    };

    if (searchData.selectedServices.length === searchData.allowedServices.length) {
        stores.services = [searchData.viewAllStoresLabel];
    }

    setAnalyticsData('stores', stores);
    dispatch({
        type: SC.STORES_SEARCH_DATA_UPDATED,
        payload: {
            ...searchData
        }
    });
};

export const getSearchedStores = (request, selectedServices = []) => {
    return new Promise((resolve, reject) => {
        ApiUtils.makeAjaxRequest(
            request,
            res => {
                let results = res.resultDto;
                const state = store.getState();
                const allServices = objectPath.get(state, 'aem.storeLocatorSearchBar.allowedServices', []);

                if (selectedServices.length > 0 && selectedServices.length !== allServices.length) {
                    results = results.filter((storeResults) => {
                        const { storeServices = [] } = storeResults;
                        let serviceFound = false;

                        for (let serviceIndex = 0; serviceIndex < storeServices.length; serviceIndex += 1) {
                            if (selectedServices.indexOf(storeServices[serviceIndex].storeServiceTypeDisplayName) !== -1) {
                                serviceFound = true;
                            }
                        }
                        return serviceFound;
                    });
                }
                resolve(results);
            },
            err => {
                console.log(err);
                reject(err);
            }
        );
    });
};

export const getPreferredStore = (request) => (dispatch) => {
    ApiUtils.makeAjaxRequest(
        request,
        res => {
            dispatch({
                type: SC.STORES_UPDATED,
                payload: {
                    preferredStore: res.resultDto
                }
            });
        },
        err => {
            console.log(err);
        }
    );
};

export const getRegions = (regionsConfig) => (dispatch) => {
    ApiUtils.makeAjaxRequest(
        regionsConfig,
        res => {
            dispatch({
                type: SC.STORES_UPDATED,
                payload: {
                    regionsList: res.resultDto
                }
            });
        },
        err => {
            console.log(err);
        }
    );
};

export const getUpcomingEvents = (upcomingEventsApiConfig, filteredStores, storesList) => (dispatch) => {
    ApiUtils.makeAjaxRequest(
        upcomingEventsApiConfig,
        res => {
            if (res.length >= 3) {
                const results = res;
                const processedStores = [];

                for (let resIndex = 0; resIndex < results.length; resIndex += 1) {
                    const stores = filteredStores[results[resIndex].storeId];
                    const storeName = objectPath.get(stores, 'store.storeName');

                    if (storeName) {
                        results[resIndex].storeName = storeName;
                        processedStores.push(results[resIndex]);
                    } else {
                        const storeinfo = find(storesList, (storeObj) => { return storeObj.store.storeId === results[resIndex].storeId; });

                        if (storeinfo) {
                            results[resIndex].storeName = objectPath.get(storeinfo, 'store.storeName', '');
                            processedStores.push(results[resIndex]);
                        }
                    }
                }
                dispatch({
                    type: SC.STORES_UPDATED,
                    payload: {
                        upcomingEvents: processedStores
                    }
                });
            } else {
                dispatch({
                    type: SC.STORES_UPDATED,
                    payload: {
                        upcomingEvents: []
                    }
                });
            }
        },
        err => {
            console.log(err);
        }
    );
};

export const dispatchNoSearchResultsData = (noResultsData) => (dispatch) => {
    dispatch({
        type: SC.STORES_SEARCH_NO_RESULTS_DATA,
        payload: {
            ...noResultsData
        }
    });
};

export default getFullStores;
