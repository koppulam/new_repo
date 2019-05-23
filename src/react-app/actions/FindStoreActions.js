import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import FC from 'constants/FindStoreConstants';
import * as objectPath from 'object-path';
import ApiUtils from 'lib/api';
import * as cookieUtil from 'lib/utils/cookies';
import { getPreferredStore } from 'lib/utils/preferred-store-util';
import { setAnalyticsError, setAnalyticsData } from 'lib/utils/analytics-util';

const forEach = require('lodash/forEach');

let storeLocations = [];
let storesWithInventory;
let dataWithInventory;

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

const calculateDistanceFormula = (lat1, lon1, lat2, lon2) => {
    const R = 6378137; // Radius of the earth in meters
    const c = deg2rad(lat1);
    const a = deg2rad(lon1);
    const d = deg2rad(lat2);
    const b = deg2rad(lon2);

    // eslint-disable-next-line no-restricted-properties
    return ((2 * Math.asin(Math.sqrt(Math.pow(Math.sin((c - d) / 2), 2) + (Math.cos(c) * Math.cos(d) * Math.pow(Math.sin((a - b) / 2), 2))))) * R);
};

/**
 * @param {number} lat1 latitude
 * @param {number} lng1 longitude
 * @param {number} lat2 latitude
 * @param {number} lng2 longitude
 * @returns {number} distance
 */
const calculateDistance = (lat1, lng1, lat2, lng2) => {
    if (window.google) {
        const googleFun = window.google;
        const latlng1 = new googleFun.maps.LatLng(lat1, lng1);
        const latlng2 = new googleFun.maps.LatLng(lat2, lng2);

        // Calculate distance in Meters
        return googleFun.maps.geometry.spherical.computeDistanceBetween(latlng1, latlng2);
    }

    return calculateDistanceFormula(lat1, lng1, lat2, lng2);
};

/**
 * @param {number} distance Convert distance in meters to miles.
 * @returns {string} distance in Miles.
 */
const convertDistance = (distance) => {
    const isKm = objectPath.get(window, 'tiffany.isDistanceInKm', false);
    const modifiedDistance = isKm ? Math.ceil(distance * 0.001) : Math.ceil(distance * 0.000621371);

    return modifiedDistance;
};

/**
 * @param {number} lat latitude
 * @param {number} lng longitude
 * @returns {void}
 */
const updateStoreDistances = (lat, lng) => {
    let distance;
    let tempLat;
    let tempLng;

    for (let i = 0; i < storeLocations.length; i += 1) {
        tempLat = Number(storeLocations[i].geoCodeLattitude);
        tempLng = Number(storeLocations[i].geoCodeLongitude);
        distance = calculateDistance(lat, lng, tempLat, tempLng);
        storeLocations[i].Distance = distance;
        storeLocations[i].DistanceConverted = convertDistance(distance);
    }
};

/**
 * @param {any} a param1
 * @param {any} b param2
 * @returns {any} sorted
 */
const sortByDistance = (a, b) => {
    return a.Distance - b.Distance;
};

/**
 * @param {number} radius radius in number
 * @returns {string} distance or km
 */
const getRadius = (radius) => {
    // default distance in kms
    const storeRadius = radius * 1609.34;

    return storeRadius;
};

/**
 * @description Convert Meters into miles.
 * @param {number} meter radius in meters
 * @returns {string} Distance in miles.
 */
const convertToMiles = (meter) => {
    // Convert Meters into miles
    const miles = convertDistance(meter);
    const measurement = miles > 1 ? objectPath.get(window, 'tiffany.labels.distancePlural', 'miles') : objectPath.get(window, 'tiffany.labels.distanceSingular', 'mile');

    return `${miles} ${measurement}`;
};

/**
 * @description Set Geo Location
 * @param {boolean} status status to set Loction.
 * @param {Object} dispatch change store
 * @returns {void}
 */
const setLoction = (status, dispatch) => {
    dispatch({
        type: FC.SET_GEO_LOCATION,
        payload: status
    });
};

/**
 * @description set Location as blocked
 * @param {boolean} status status to set Loction.
 * @param {Object} dispatch change store
 * @returns {void}
 */
const setLocationBlocked = (status, dispatch) => {
    dispatch({
        type: FC.SET_GEO_LOCATION_BLOCKED,
        payload: status
    });
};

/**
 * @param {number} lat latitude
 * @param {number} lng longitude
 * @param {number} requiredRadius requiredRadius
 * @param {object} storesList storesList
 * @returns {object} list of stores
 */
const searchLatLng = (lat, lng, requiredRadius, storesList) => {
    const foundStores = [];
    let distance;
    let tempLat;
    let tempLng;
    let tempStores = [];
    let i;
    const storeRadius = objectPath.get(window, 'tiffany.pdpConfig.searchDefaultRadius', 50);
    const radius = (requiredRadius && requiredRadius !== undefined) ? getRadius(requiredRadius) : getRadius(storeRadius);

    const stores = (storesList && storesList.length > 0) ? storesList : storeLocations;

    for (i = 0; i < stores.length; i += 1) {
        tempLat = Number(stores[i].geoCodeLattitude || stores[i].store.geoCodeLattitude);
        tempLng = Number(stores[i].geoCodeLongitude || stores[i].store.geoCodeLongitude);
        distance = calculateDistance(lat, lng, tempLat, tempLng);
        stores[i].Distance = distance;
        stores[i].DistanceConverted = convertDistance(distance);
        stores[i].distanceInMiles = convertToMiles(distance);
        if (distance <= radius) {
            stores[i].matchType = 'latlng';
            tempStores.push({
                Distance: distance,
                Store: stores[i]
            });
        }
    }
    tempStores = tempStores.sort(sortByDistance);
    for (i = 0; i < tempStores.length; i += 1) {
        foundStores.push(tempStores[i].Store);
    }

    return foundStores;
};

/**
 * @param {Array} sourceArray1 sempty array
 * @param {Array} sourceArray2 geocoded results
 * @param {Array} lat latittude
 * @param {Array} lng longitude
 * @returns {Array} combined sorted results
 */
const combineAndSortResults = (sourceArray1, sourceArray2, lat, lng) => {
    let found;
    let tempLat;
    let tempLng;
    let sortedsourceArray1;
    let sortedsourceArray2;

    if (lat != null && lng != null) {
        for (let i = 0; i < sourceArray1.length; i += 1) {
            tempLat = Number(sourceArray1[i].geoCodeLattitude);
            tempLng = Number(sourceArray1[i].geoCodeLongitude);
            sourceArray1[i].Distance = calculateDistance(lat, lng, tempLat, tempLng);
            sourceArray1[i].DistanceConverted = convertDistance(sourceArray1[i].Distance);
        }
        for (let i = 0; i < sourceArray2.length; i += 1) {
            tempLat = Number(sourceArray2[i].geoCodeLattitude);
            tempLng = Number(sourceArray2[i].geoCodeLongitude);
            sourceArray2[i].Distance = calculateDistance(lat, lng, tempLat, tempLng);
            sourceArray2[i].DistanceConverted = convertDistance(sourceArray2[i].Distance);
        }

        sortedsourceArray1 = sourceArray1.sort(sortByDistance);
        sortedsourceArray2 = sourceArray2.sort(sortByDistance);
    }
    for (let i = 0; i < sortedsourceArray2.length; i += 1) {
        found = false;
        for (let j = 0; j < sortedsourceArray1.length; j += 1) {
            if (sortedsourceArray2[j] === sortedsourceArray1[i]) {
                found = true;
            }
        }
        if (found === false) {
            sortedsourceArray1.push(sortedsourceArray2[i]);
        }
    }
    sortedsourceArray1 = sortedsourceArray1.sort(sortByDistance);
    return sortedsourceArray1;
};

/**
 * @param {Number} index index
 * @param {string} mip mibstorenumber
 * @param {Array} inventoryStores inventory stores array
 * @returns {void}
 */
const checkInventoryInStoreByMip = (index, mip, inventoryStores) => {
    forEach(inventoryStores, (store) => {
        if (store.mipsStoreNumber === mip) {
            storesWithInventory[index].availableInStore = store.availableInStore;
            storesWithInventory[index].limitedAvailabilityInStore = store.limitedAvailabilityInStore;
            storesWithInventory[index].outOfStockInStore = store.outOfStockInStore;
            storesWithInventory[index].isBOPSEnabled = store.isBOPSEnabled;
            storesWithInventory[index].storePickUpMsgKey = store.storePickUpMsgKey;
        }
    });
};

/**
 * @param {Array} stores array of stores
 * @param {Array} data array
 * @returns {Array} filterStoresWithAvailability
 */
const filterStoresOnAvailability = (stores, data) => {
    forEach(stores, (item, index) => {
        const mip = item.mipsStoreNumber;

        checkInventoryInStoreByMip(index, mip, data.skuAvailabilityStatusByStore);
    });
    return storesWithInventory;
};

/**
 * @param {Array} results stored
 * @param {String} type prop type to dispatch
 * @param {any} dispatch redux dispatcher
 *  @param {boolean} storeFlag to set instoreStatus
 * @param {boolean} isPreferredstore to know if it is preferred store
 * @returns {void}
 */
const getSkuInventoryInfo = (results, type, dispatch, storeFlag, isPreferredstore) => {
    let storeListArray = [];
    const request = objectPath.get(window, 'tiffany.pdpConfig.store.availabileStores.get', {});
    const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');

    for (let i = 0; i < results.length; i += 1) {
        const mipsNum = results[i].mipsStoreNumber || '';

        if (mipsNum && mipsNum.trim().length > 0) {
            storeListArray.push(mipsNum);
        }
    }
    objectPath.set(request, 'payload.webCustomerId', cookieUtil.getCookies(cookieName));
    storeListArray = storeListArray.length > 0 ? storeListArray.join(',') : '';
    objectPath.set(request, 'payload.mipsStoreList', storeListArray);

    ApiUtils.makeAjaxRequest(
        request,
        res => {
            storesWithInventory = results;
            dataWithInventory = res.resultDto;
            const filteredStore = filterStoresOnAvailability(storesWithInventory, dataWithInventory);

            const storeResults = (type === FC.STORE_DETAIL) ? filteredStore[0] : filteredStore;

            if (storeFlag === true) {
                const prefStore = dataWithInventory.skuAvailabilityStatusByStore;
                const productObj = objectPath.get(window, 'dataLayer.product', {});
                let inStoreStatus = '';

                if (prefStore[0].availableInStore === true) {
                    inStoreStatus = AnalyticsConstants.AVALIBALE;
                } else if (prefStore[0].limitedAvailabilityInStore === true) {
                    inStoreStatus = AnalyticsConstants.LIMITED_AVALIABILITY;
                } else if (prefStore[0].outOfStockInStore === true) {
                    inStoreStatus = AnalyticsConstants.CALL_TO_CONFIRM;
                }
                productObj.inStoreStatus = inStoreStatus;
                setAnalyticsData('product', productObj);
            }

            if (isPreferredstore) {
                storeResults.isPreferredStore = true;
            }
            dispatch({
                type,
                payload: storeResults
            });
        },
        err => {
            dispatch({
                type: FC.STORE_SEARCH_API_FAILURE,
                payload: true
            });
        }
    );
};

/**
 * @description reset to false
 * @param {object} dispatch dispatch
 * @returns {void}
 */
export const resetStoreDetailStatus = (dispatch) => {
    dispatch({
        type: FC.STORE_DETAIL_STATUS,
        payload: false
    });
    setLoction(false, dispatch);
};

/**
 * @param {any} dispatch redux dispatcher
 * @param {object} position geolocation
 * @returns {void}
 */
const findStoresByCurrentLocation = (dispatch, position) => {
    const lng = position.coords.longitude;
    const lat = position.coords.latitude;
    let geocodeResults = [];
    let sortedResults = [];

    updateStoreDistances(lat, lng);
    geocodeResults = searchLatLng(lat, lng);
    sortedResults = combineAndSortResults([], geocodeResults, lat, lng);

    setLoction(false, dispatch);
    if (sortedResults && sortedResults.length > 0) {
        getSkuInventoryInfo(sortedResults, FC.STORE_DETAIL, dispatch, false);
    } else {
        resetStoreDetailStatus(dispatch);
        setLocationBlocked('toggle', dispatch);
    }
};

/**
 * Country drop down change event
 * @param {Number} siteId siteId
 * @param {String} countryName countryname
 * @returns {void}
 */
export const fetchStoresForCountry = (siteId, countryName) => {
    return new Promise((resolve, reject) => {
        if (parseInt(siteId, 10) !== 0) {
            const listbycountryConfig = objectPath.get(window, 'tiffany.authoredContent.listbycountryConfig', {});

            listbycountryConfig.payload = {};

            objectPath.set(listbycountryConfig, 'payload.siteId', siteId);
            objectPath.set(listbycountryConfig, 'payload.country', countryName);

            ApiUtils.makeAjaxRequest(
                listbycountryConfig,
                res => {
                    if (res.resultDto && res.resultDto.length > 0) {
                        const statesList = res.resultDto;
                        const storesList = [];

                        if (statesList.length > 0) {
                            statesList.forEach(state => {
                                state.stores.forEach(store => {
                                    store.store.mipsStoreNumber = store.store.mipsstoreNumber;
                                    storesList.push(store.store);
                                });
                            });
                        }

                        resolve(storesList);
                    } else {
                        reject(
                            this.setState({
                                noResponse: true
                            })
                        );
                    }
                },
                err => {
                    reject(err);
                    console.log(err);
                }
            );
        }
    });
};

/**
 * @param {any} dispatch redux dispatcher
 * @returns {void}
 */
const loadLocations = (dispatch) => {
    const request = objectPath.get(window, 'tiffany.pdpConfig.store.storesList.get', {});

    if (Object.keys(request).length > 0) {
        ApiUtils.makeAjaxRequest(
            request,
            res => {
                storeLocations = res.resultDto;
                getPreferredStore().then(prefferedResult => {
                    if (prefferedResult) {
                        const preferredStore = storeLocations.filter(x => x.mipsStoreNumber === prefferedResult);

                        if (preferredStore && preferredStore.length) {
                            setLoction(false, dispatch);
                            getSkuInventoryInfo(preferredStore, FC.STORE_DETAIL, dispatch, true, true);
                        } else {
                            setLoction(true, dispatch);
                        }
                    } else {
                        setLoction(true, dispatch);
                    }
                }, () => {
                    setLoction(true, dispatch);
                    setLocationBlocked(true, dispatch);
                });
            },
            err => {
            }
        );
    }
};

/**
 * @description get nearest store
 * @param {Function} performChangeStoreAction callBack method.
 * @returns {void}
 */
export const setStoreLocation = (performChangeStoreAction) => (dispatch) => {
    navigator.geolocation.getCurrentPosition((position) => {
        findStoresByCurrentLocation(dispatch, position);
    }, () => {
        resetStoreDetailStatus(dispatch);
    });
};

/**
 * @description get nearest store
 * @returns {void}
 */
export const findStore = () => (dispatch) => {
    loadLocations(dispatch);
};

/**
 * @description get store details based on given address
 * @param {number} lat latitude
 * @param {number} lng longitude
 * @param {number} radius Store radius
 * @param {array} storesList storesList
 * @returns {void}
 */
export const storeSearchCountry = (lat, lng, radius, storesList) => (dispatch) => {
    const foundStores = searchLatLng(lat, lng, radius, storesList);
    const sortedStores = combineAndSortResults([], foundStores, lat, lng);

    dispatch({
        type: FC.STORE_SEARCH_SUCCESS,
        payload: sortedStores
    });

    if (sortedStores && sortedStores.length > 0) {
        getSkuInventoryInfo(sortedStores, FC.STORE_SEARCH, dispatch, false);
    } else {
        setAnalyticsError(AnalyticsConstants.NOSTORESFOUND);
    }
};

/**
 * @description get store details based on given address
 * @param {number} lat latitude
 * @param {number} lng longitude
 * @param {number} radius Store radius
 * @returns {void}
 */
export const storeSearch = (lat, lng, radius) => (dispatch) => {
    const foundStores = searchLatLng(lat, lng, radius);
    const sortedStores = combineAndSortResults([], foundStores, lat, lng);

    dispatch({
        type: FC.STORE_SEARCH_SUCCESS,
        payload: sortedStores
    });

    if (sortedStores && sortedStores.length > 0) {
        getSkuInventoryInfo(sortedStores, FC.STORE_SEARCH, dispatch);
    }
};

/**
 * @description Track Change store modal status
 * @param {boolean} status change store
 * @returns {void}
 */
export const changeStoreStatus = (status) => (dispatch) => {
    dispatch({
        type: FC.CHANGE_STORE_STATUS,
        payload: status
    });
};

/**
 * @description Track Change store modal status
 * @param {boolean} status change store
 * @returns {void}
 */
export const storeDetailStatus = (status) => (dispatch) => {
    dispatch({
        type: FC.STORE_DETAIL_STATUS,
        payload: status
    });
};

export const searchLatLngWrapper = (lat, lng, fullStoresList, radius) => {
    return searchLatLng(lat, lng, radius, fullStoresList);
};

export const setStoreDetails = (storeDetails) => (dispatch) => {
    dispatch({
        type: FC.STORE_DETAIL,
        payload: storeDetails
    });
};

/**
 * @description update address searched for in the text box
 * @param {String} addressProvided addressProvided
 * @returns {void}
 */
export const updateSearchAddress = (addressProvided) => (dispatch) => {
    dispatch({
        type: FC.STORE_SEARCHED_FOR,
        payload: addressProvided
    });
};

/**
 * @description update radius selected in the dropdown
 * @param {String} radius Radius choosed from the dropdown.
 * @returns {void}
 */
export const setRadius = (radius) => (dispatch) => {
    dispatch({
        type: FC.RADIUS_CHOOSED,
        payload: radius
    });
};

/**
 * @description update region selected in the dropdown
 * @param {Object} selectedRegion selected region from dropdown.
 * @returns {void}
 */
export const setSelectedRegion = ({ selectedRegion }) => (dispatch) => {
    dispatch({
        type: FC.SET_SELECTED_REGION,
        payload: selectedRegion
    });
};
