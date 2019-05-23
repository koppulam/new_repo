import CONSTANTS from 'constants/EngagementConstants';

export const initialState = {
    product: {},
    romanceCopy: ''
};

/**
 * Engagement Reducer.
 * @param {object} previousState previous state data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
export default function engagementReducer(previousState = initialState, action) {
    switch (action.type) {
        case CONSTANTS.PRODUCT_DETAILS_SUCCESS:
            return {
                ...previousState,
                product: action.payload.product
            };
        case CONSTANTS.ROMANCE_COPY:
            return {
                ...previousState,
                romanceCopy: action.payload.description
            };
        default:
            return previousState;
    }
}
