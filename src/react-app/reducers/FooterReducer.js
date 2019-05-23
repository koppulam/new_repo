import SC from 'constants/FooterConstants';

const initialState = {
    flyoutData: '',
    isFlyoutOpen: false
};

/**
 * Render Component.
 * @param {object} state default state data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
export default function footerReducer(state = initialState, action) {
    switch (action.type) {
        case SC.UPDATE_FOOTER_FLYOUT:
            return {
                ...state,
                flyoutData: action.payload.res,
                isFlyoutOpen: true
            };
        case SC.CLOSE_FOOTER_FLYOUT:
            return {
                ...state,
                flyoutData: '',
                isFlyoutOpen: false
            };
        default:
            return state;
    }
}
