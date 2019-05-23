import TEXTWITHIMAGE from 'constants/TextWithImageConstants';

const initialState = {
    skuResponse: [],
    isSkuUnavailable: false
};

/**
 * @param {Object} previousState previous state
 * @param {Object} action action
 * @returns {Object} updated state
 */
export default function onHoverReducer(previousState = initialState, action) {
    switch (action.type) {
        case TEXTWITHIMAGE.SKU_SUCCESS:
            return {
                ...previousState,
                skuResponse: action.payload.products
            };
        case TEXTWITHIMAGE.SKU_FAILURE:
            return {
                ...previousState,
                skuResponse: [],
                isSkuUnavailable: true
            };
        case TEXTWITHIMAGE.IS_SKU_UNAVAILABLE:
            return {
                ...previousState,
                isSkuUnavailable: true
            };
        default:
            return previousState;
    }
}
