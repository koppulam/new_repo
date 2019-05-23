import SC from 'constants/ShippingConstants';

/**
 * @description - Update the flyout odal open states
 * @param {*} flyoutState - selected modal
 * @returns {object} Action tyep and payload
 */
const updateShippingFlyoutState = (flyoutState) => (dispatch, getState) => {
    dispatch({
        type: SC.UPDATE_SHIPPING_FLYOUT,
        payload: flyoutState
    });
};

export default updateShippingFlyoutState;
