import SC from 'constants/StoresConstants';

const initialState = {
    storesList: [],
    visibleStoresList: [],
    regionsList: [],
    foundStores: [],
    preferredStore: {},
    upcomingEvents: [],
    storeSearchData: {},
    searchResponseList: [],
    noSearchResponceList: [],
    storesNearBySearched: false
};

/**
 * Performs store related operations
 * @param {object} state default state data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
export default function storesReducer(state = initialState, action) {
    switch (action.type) {
        case SC.STORES_UPDATED: {
            return {
                ...state,
                ...action.payload
            };
        }
        case SC.STORES_SEARCH_DATA_UPDATED: {
            return {
                ...state,
                storeSearchData: action.payload
            };
        }
        case SC.STORES_SEARCH_RESPONSE_DATA: {
            return {
                ...state,
                ...action.payload
            };
        }
        case SC.STORES_SEARCH_NO_RESULTS_DATA: {
            return {
                ...state,
                ...action.payload
            };
        }
        default:
            return state;
    }
}
