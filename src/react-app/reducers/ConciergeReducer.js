import CC from 'constants/ConciergeConstants';

const initialState = {
    flyoutState: 'INITIAL',
    showFlyout: false,
    emailSent: false,
    isConcierge: true
};

/**
 * Render Component.
 * @param {object} state default state data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
const conciergeReducer = (state = initialState, action) => {
    switch (action.type) {
        case CC.UPDATE_SELECTED_FLYOUT:
            return {
                ...state,
                emailSent: action.payload.emailSent,
                flyoutState: action.payload.flyoutState,
                showFlyout: action.payload.showFlyout,
                isConcierge: action.payload.isConcierge
            };
        case CC.EMAIL_SENT:
            return {
                ...state,
                emailSent: action.payload.emailSent,
                flyoutState: action.payload.flyoutState,
                showFlyout: action.payload.showFlyout
            };
        default:
            return state;
    }
};

export default conciergeReducer;
