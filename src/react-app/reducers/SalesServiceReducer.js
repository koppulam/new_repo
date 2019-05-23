import SS from 'constants/SalesServiceConstants';

const initialState = {
    productSupplementalInfo: {},
    distributionInventory: [],
    retailStoreInventory: [],
    onOrderStatus: [],
    columnHeadings: [],
    noRetailStores: false,
    noOnOrderStatusResults: false,
    allStores: [],
    noDistributionInventoryResults: false
};

/**
 * @param {Object} previousState previous state
 * @param {Object} action action
 * @returns {Object} updated state
 */
export default function salesServiceReducer(previousState = initialState, action) {
    switch (action.type) {
        case SS.SALES_SERVICE_SUCCESS:
            return {
                ...previousState,
                productSupplementalInfo: action.payload.response
            };
        case SS.DISTRIBUTION_INVENTORY_SUCCESS:
            return {
                ...previousState,
                distributionInventory: action.payload.response,
                noDistributionInventoryResults: action.payload.response ? action.payload.response.length === 0 : true
            };
        case SS.ON_ORDER_STATUS_SUCCESS:
            return {
                ...previousState,
                onOrderStatus: action.payload.response,
                noOnOrderStatusResults: action.payload.response ? action.payload.response.length === 0 : true
            };
        case SS.COLUMN_HEADINGS:
            return {
                ...previousState,
                columnHeadings: action.payload
            };
        case SS.ALL_STORES:
            return {
                ...previousState,
                allStores: action.payload.response
            };
        case SS.STORES_RETAIL_INVENTORY:
            return {
                ...previousState,
                retailStoreInventory: action.payload.response,
                noRetailStores: action.payload.response ? action.payload.response.length === 0 : true
            };
        case SS.STORES_RETAIL_INVENTORY_FAILED:
            return {
                ...previousState,
                retailStoreInventory: [],
                noRetailStores: true
            };
        case SS.RESET_RETAIL_STORE_RESULTS:
            return {
                ...previousState,
                retailStoreInventory: [],
                noRetailStores: false
            };
        default:
            return previousState;
    }
}
