import CONSTANTS from 'constants/MiniPDPConstants';
import * as objectPath from 'object-path';

export const initialState = {
    products: {
    },
    isMiniPdpOpen: false
};

/**
 * Render Component.
 * @param {object} previousState default previousState data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
export default function MiniPdpReducer(previousState = initialState, action) {
    const productData = objectPath.get(action, 'payload.res');
    const productId = objectPath.get(action, 'payload.productId');

    switch (action.type) {
        case CONSTANTS.TOGGLE_MINI_PDP:
            if (objectPath.get(action, 'payload.open')) {
                return {
                    ...previousState,
                    isMiniPdpOpen: true,
                    productId
                };
            }
            return {
                ...previousState,
                isMiniPdpOpen: !previousState.isMiniPdpOpen,
                productId
            };
        case CONSTANTS.SET_MINI_PDP_DATA:
            if (!previousState.products[productId]) {
                previousState.products[productId] = productData;
                return {
                    ...previousState,
                    isMiniPdpOpen: true,
                    productId
                };
            }
            return {
                ...previousState,
                isMiniPdpOpen: true,
                productId
            };
        default:
            return previousState;
    }
}
