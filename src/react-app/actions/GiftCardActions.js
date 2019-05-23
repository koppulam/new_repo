import GC from 'constants/GiftCardConstants';
import ApiUtils from 'lib/api';

/**
 * @description submit notify flyout
 * @param {Object} payload payload object
 * @param {Object} dispatch redux dispatch
 * @returns {void}
 */
export const getCardBalanceAction = (payload) => (dispatch) => {
    ApiUtils.makeAjaxRequest(
        payload,
        res => {
            dispatch({
                type: GC.CHECK_CARD_BALANCE_SUCCESS,
                payload: res
            });
        },
        err => {
            // failure cases for implememtaion
        }
    );
};

export const resetCheckBalance = () => (dispatch) => {
    dispatch({
        type: GC.RESET_GIFTCARD_BALANCE
    });
};
