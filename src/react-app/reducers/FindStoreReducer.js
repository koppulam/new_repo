import FC from 'constants/FindStoreConstants';

export const initialState = {
    changeStoreStatus: false,
    storeDetailStatus: null,
    storeDetails: {},
    searchResults: [],
    foundStores: [],
    addressDetails: '',
    selectedRadius: '',
    isError: false,
    setLocation: false,
    locationBlocked: false
};

/**
 * Render Component.
 * @param {object} previousState default previousState data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
export default function findStoreReducer(previousState = initialState, action) {
    switch (action.type) {
        case FC.SET_GEO_LOCATION_BLOCKED:
            if (action.payload === 'toggle') {
                return { ...previousState, locationBlocked: !previousState.locationBlocked };
            }
            return { ...previousState, locationBlocked: action.payload };

        case FC.CHANGE_STORE_STATUS:
            return { ...previousState, changeStoreStatus: action.payload };
        case FC.STORE_DETAIL_STATUS:
            return { ...previousState, storeDetailStatus: action.payload };
        case FC.STORE_DETAIL:
            return {
                ...previousState, storeDetails: action.payload, isError: false, setLocation: false
            };
        case FC.STORE_SEARCH:
            return { ...previousState, searchResults: action.payload, isError: false };
        case FC.STORE_SEARCH_SUCCESS:
            return { ...previousState, foundStores: action.payload };
        case FC.STORE_SEARCHED_FOR:
            return { ...previousState, addressDetails: action.payload };
        case FC.RADIUS_CHOOSED:
            return { ...previousState, selectedRadius: action.payload };
        case FC.SET_SELECTED_REGION:
            return { ...previousState, selectedRegion: action.payload };
        case FC.STORE_SEARCH_API_FAILURE:
            return { ...previousState, isError: action.payload };
        case FC.SET_GEO_LOCATION:
            return { ...previousState, setLocation: action.payload };
        default:
            return previousState;
    }
}
