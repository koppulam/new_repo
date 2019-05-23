import ISFC from 'constants/IStatusFlyoutConstants';

export const initialState = {
    productFlyoutOpenState: false,
    isFlyoutSubmitted: false,
    flyoutData: {
        productImages: [],
        productImageDefaultURL: '',
        productName: '',
        productPrice: '',
        isLazyLoad: false,
        groupSku: '',
        parentGroupSku: '',
        sku: ''
    }
};

/**
 * Render Component.
 * @param {object} previousState default previousState data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
export default function iStatusFlyoutReducer(previousState = initialState, action) {
    switch (action.type) {
        case ISFC.TOGGLE_NOTIFY_ME:
            return {
                productFlyoutOpenState: !previousState.productFlyoutOpenState,
                isFlyoutSubmitted: false,
                flyoutData: {
                    ...previousState.flyoutData,
                    ...action.payload
                }
            };
        case ISFC.SUBMITTED_NOTIFY_ME:
            return {
                ...previousState,
                isFlyoutSubmitted: true
            };
        default:
            return previousState;
    }
}
