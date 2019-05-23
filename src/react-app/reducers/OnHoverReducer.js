import HOVER from 'constants/OnHoverConstants';
import FC from 'constants/FiltersConstants';

const initialState = {
    productsList: [],
    product: {},
    selectedProduct: null
};

/**
 * @param {Object} previousState previous state
 * @param {Object} action action
 * @returns {Object} updated state
 */
export default function onHoverReducer(previousState = initialState, action) {
    switch (action.type) {
        case HOVER.ITEM_GROUP_COMPLETE_SUCCESS:
            return {
                ...previousState,
                productsList: [...previousState.productsList, action.payload],
                product: action.payload.products,
                selectedProduct: action.payload.index
            };
        case HOVER.BYO_GROUP_COMPLETE_SUCCESS:
            return {
                ...previousState,
                productsList: [...previousState.productsList, action.payload]
            };
        case HOVER.CLEAR_ON_HOVER:
            return {
                ...previousState,
                product: {},
                selectedProduct: null
            };
        case HOVER.PRODUCT_SELECTED: {
            const product = previousState.productsList.filter(prod => prod.index === action.payload)[0] || {};

            return {
                ...previousState,
                product,
                selectedProduct: action.payload
            };
        }
        case FC.FILTERS_DATA: {
            return {
                productsList: [],
                product: {},
                selectedProduct: null
            };
        }
        default:
            return previousState;
    }
}
