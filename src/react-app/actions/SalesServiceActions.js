import ApiUtils from 'lib/api';
import SS from 'constants/SalesServiceConstants';
import _ from 'lodash';
import * as objectPath from 'object-path';
import { sortStoresBasedOnDistance } from 'lib/utils/store-util';

/**
 * @description get productSuppInfo from productsupplementalinfossystemapi
 * @param {Object} request request to get product detail
 * @param {Object} option objects based on API ex:item/Group complete
 * @param {abort} signal abort
 * @param {Object} index redux dispatch
 * @returns {void}
 */
export const getProductSupplementalInfo = request => dispatch => {
    ApiUtils.makeAjaxRequest(
        request,
        res => {
            dispatch({
                type: SS.SALES_SERVICE_SUCCESS,
                payload: {
                    response: res.resultDto
                }
            });
        },
        err => { }
    );
};

/**
 * @description get retail store inventory information
 * @param {Object} request request to get inventory detail
 * @returns {void}
 */
export const getDistributionInventory = request => dispatch => {
    ApiUtils.makeAjaxRequest(
        request,
        res => {
            dispatch({
                type: SS.DISTRIBUTION_INVENTORY_SUCCESS,
                payload: {
                    response: res.resultDto
                }
            });
        }
    );
};

/**
 * @description get Order status
 * @param {Object} request request to get order status
 * @param {Function} getState method to get state
 * @returns {void}
 */
export const getOnOrderStatus = request => (dispatch, getState) => {
    ApiUtils.makeAjaxRequest(
        request,
        res => {
            let formattedResponse = [];
            const state = getState();
            const { storeNameMap } = state.aem.salesServiceCenter;

            if (res && res.resultDto) {
                formattedResponse = _(res.resultDto)
                    .groupBy(x => x.poLocation)
                    .map((value, key) => ({ poLocation: key, data: value, poName: storeNameMap[key] }))
                    .value();

                dispatch({
                    type: SS.ON_ORDER_STATUS_SUCCESS,
                    payload: {
                        response: formattedResponse
                    }
                });
            }
        }
    );
};

/**
 * @description set column headings
 * @param {Object} columns columns to be shown
 * @returns {void}
 */
export const setColumnHeading = columns => dispatch => {
    dispatch({
        type: SS.COLUMN_HEADINGS,
        payload: columns
    });
};

/**
 * @description get All stores and corresponding inventory
 * @param {Object} request request to get all stores
 * @param {Function} getState method to get state
 * @returns {void}
 */
export const getAllStores = request => (dispatch, getState) => {
    ApiUtils.makeAjaxRequest(
        request,
        res => {
            if (res && res.resultDto) {
                const state = getState();
                const retailInvRequest = objectPath.get(state, 'aem.salesServiceCenter.retailStore.getRetailInventoryRequest');
                let storeIds;
                const allStores = res.resultDto.map(store => {
                    if (store.store.mipsstoreNumber && store.store.mipsstoreNumber.trim()) {
                        return store;
                    }
                    return null;
                }).filter(store => store);

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(position => {
                        const sortStores = sortStoresBasedOnDistance(position.coords.latitude, position.coords.longitude, allStores);

                        storeIds = sortStores.map(store => store.store.mipsstoreNumber);
                    }, () => {
                        storeIds = allStores.map(store => store.store.mipsstoreNumber);
                    });
                } else {
                    storeIds = allStores.map(store => store.store.mipsstoreNumber);
                }
                dispatch({
                    type: SS.ALL_STORES,
                    payload: {
                        response: allStores
                    }
                });
                if (!storeIds) {
                    storeIds = allStores.map(store => store.store.mipsstoreNumber);
                }
                retailInvRequest.payload.storeNumbers = storeIds;
                ApiUtils.makeAjaxRequest(
                    retailInvRequest,
                    response => {
                        let formattedResponse = response.resultDto.map(inventory => {
                            const storeDetail = allStores.filter(x => (x.store.mipsstoreNumber === inventory.storeNumber));

                            if (storeDetail.length) {
                                inventory.storeName = storeDetail[0].store.storeName;
                                inventory.storeOrder = storeIds.indexOf(inventory.storeNumber);
                            }
                            return inventory;
                        });

                        formattedResponse = formattedResponse.sort((store1, store2) => store1.storeOrder - store2.storeOrder);
                        dispatch({
                            type: SS.STORES_RETAIL_INVENTORY,
                            payload: {
                                response: formattedResponse
                            }
                        });
                    },
                    error => {
                        console.log(error);
                        dispatch({
                            type: SS.STORES_RETAIL_INVENTORY_FAILED,
                            payload: {
                                response: []
                            }
                        });
                    }
                );
            }
        }
    );
};

/**
 * @description failed retail stores
 * @param {Function} dispatch method to get state
 * @returns {void}
 */
export const setRetailStoresFailure = () => (dispatch) => {
    dispatch({
        type: SS.STORES_RETAIL_INVENTORY_FAILED,
        payload: {
            response: []
        }
    });
};

/**
 * @description Get store retail inventory details
 * @param {Object} request request to get all stores
 * @param {Function} dispatch request to get all stores
 * @param {Function} getState method to get state
 * @returns {void}
 */
export const getStoreRetailInv = (request) => (dispatch, getState) => {
    ApiUtils.makeAjaxRequest(
        request,
        response => {
            dispatch({
                type: SS.RESET_RETAIL_STORE_RESULTS
            });
            const stores = getState().salesService.allStores;
            let formattedResponse = response.resultDto.map(inventory => {
                const storeDetail = stores.filter(x => x.store.mipsstoreNumber.toString() === inventory.storeNumber);

                if (storeDetail.length) {
                    inventory.storeName = storeDetail[0].store.storeName;
                    inventory.storeOrder = request.payload.storeNumbers.indexOf(inventory.storeNumber);
                }
                return inventory;
            });

            formattedResponse = formattedResponse.sort((store1, store2) => store1.storeOrder - store2.storeOrder);
            dispatch({
                type: SS.STORES_RETAIL_INVENTORY,
                payload: {
                    response: formattedResponse
                }
            });
        },
        () => {
            dispatch(setRetailStoresFailure());
        }
    );
};
