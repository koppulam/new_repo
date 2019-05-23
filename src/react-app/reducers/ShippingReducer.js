import SC from 'constants/ShippingConstants';

const initialState = {
    showShippingFlyout: false,
    flyoutContentType: 'shipping'
};

/**
 * Render Component.
 * @param {object} state default state data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
const shippingReducer = (state = initialState, action) => {
    switch (action.type) {
        case SC.UPDATE_SHIPPING_FLYOUT:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};

export default shippingReducer;
