import PRODUCT from 'constants/ProductConstants';
import * as objectPath from 'object-path';

export const initialState = {
    metaData: {
        isLoading: false
    },
    productData: {
        price: []
    },
    selectedQuantity: 1,
    addToBag: false,
    maxQuantityError: false,
    pdpConfig: objectPath.get(window, 'tiffany.pdpConfig', {})
};

/**
 *
 * @param {Object} previousState previous state
 * @param {Object} action action
 * @returns {Object} updated state
 */
export default function productDetailsReducer(previousState = initialState, action) {
    // previousState.maxQuantityError = false;
    switch (action.type) {
        case PRODUCT.UPDATE_PRODUCT_PRICE: {
            const { productData: { price } } = previousState;

            if (!action.payload.price) {
                console.warn('Update price: price to update is missing or wrong');
                return previousState;
            }

            if (action.payload.action === '' || (action.payload.action !== 'add' && action.payload.action !== 'remove')) {
                console.warn('Update price: action is missing or wrong');
                return previousState;
            }

            if (action.payload.action === 'remove') {
                if (price.indexOf(action.payload.price) !== -1) {
                    price.splice(price.indexOf(action.payload.price), 1);
                }
                return {
                    ...previousState,
                    productData: {
                        price: [...price]
                    }
                };
            }
            return {
                ...previousState,
                productData: {
                    price: [...price, action.payload.price]
                }
            };
        }
        case PRODUCT.FETCH_PRODUCT_PRICE_SUCCESS:
            return {
                ...previousState,
                productData: {
                    price: [action.payload.price]
                }
            };
        case PRODUCT.ADD_TO_BAG_SUCCESS:
            return {
                ...previousState,
                addToBag: true,
                maxQuantityError: false
            };
        case PRODUCT.ADD_TO_BAG_MAX_QUANTITY_FAILURE:
            return {
                ...previousState,
                maxQuantityError: true
            };
        case PRODUCT.UPDATE_SELECTED_PRODUCT_QUANTITY:
            return {
                ...previousState,
                selectedQuantity: action.payload,
                maxQuantityError: false
            };
        default:
            return previousState;
    }
}
