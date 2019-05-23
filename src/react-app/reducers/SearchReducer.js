import SRH from 'constants/SearchConstants';

export const initialState = {
    searchResults: []
};

/**
 * Render Component.
 * @param {object} previousState default previousState data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
export default function searchResultsReducer(previousState = initialState, action) {
    switch (action.type) {
        case SRH.SEARCH_RESULTS:
            return { ...previousState, searchResults: action.payload };
        default:
            return previousState;
    }
}
