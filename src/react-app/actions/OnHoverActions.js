import ApiUtils from 'lib/api';
import { transformGroupItemData } from 'lib/utils/format-data';
import HOVER from 'constants/OnHoverConstants';
import { toggle } from 'actions/InterceptorActions';

/**
 * @description get item/Group complete product details based on sku
 * @param {Object} request request to get product detail
 * @param {Object} option objects based on API ex:item/Group complete
 * @param {abort} signal abort
 * @param {Object} index redux dispatch
 * @param {bool} isByo isByo
 * @returns {void}
 */
export const getOnHoverProductDetails = (request, option, signal, index, isByo) => (dispatch) => {
    if (isByo) {
        dispatch(toggle(false));
    }
    ApiUtils.makeAjaxRequest(request, res => {
        if (isByo) {
            dispatch(toggle(true));
        }
        const products = transformGroupItemData(res, option.type, option.imageUrl);

        dispatch({
            type: HOVER.ITEM_GROUP_COMPLETE_SUCCESS,
            payload: {
                products,
                index
            }
        });
    }, err => {
    }, signal);
};

/**
 * @deprecated
 * @description get on product selected/focus
 * @param {number} index redux dispatch
 * @returns {void}
 */
export const selectedProduct = (index) => (dispatch) => {
    dispatch({
        type: HOVER.PRODUCT_SELECTED,
        payload: index
    });
};
