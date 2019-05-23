import GC from 'constants/GiftCardConstants';
import * as objectPath from 'object-path';

export const initialState = {
    checkBalanceIsOpen: false,
    termsIsOpen: false,
    isMobileModal: false,
    showBalance: false,
    balance: 0,
    mismatchError: false
};

/**
 * Render Component.
 * @param {object} previousState default previousState data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
export default function searchResultsReducer(previousState = initialState, action) {
    const cardBalance = objectPath.get(action, 'payload.resultDto.giftCardBalance', '-1');

    switch (action.type) {
        case GC.TOGGLE_CHECK_BALANCE:
            return {
                ...previousState,
                checkBalanceIsOpen: !previousState.checkBalanceIsOpen,
                isMobileModal: action.payload.isMobile
            };
        case GC.CHECK_CARD_BALANCE_SUCCESS:
            if (cardBalance === '-1') {
                return {
                    ...previousState,
                    showBalance: false,
                    balance: -1,
                    mismatchError: true
                };
            }
            return {
                ...previousState,
                showBalance: true,
                balance: cardBalance,
                mismatchError: false
            };
        case GC.RESET_GIFTCARD_BALANCE:
            return {
                ...previousState,
                showBalance: false,
                balance: 0,
                mismatchError: false
            };
        default:
            return previousState;
    }
}
