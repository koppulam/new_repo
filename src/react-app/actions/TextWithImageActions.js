import ApiUtils from 'lib/api';
import TEXTWITHIMAGE from 'constants/TextWithImageConstants';
import { transformSkuCatData, getReorderedProducts } from 'lib/utils/format-data';

/**
 * @description Get SKU response.
 * @param {Object} request request config.
 * @param {Function} setProductImages callBack method.
 * @param {Function} onFailure callBack method.
 * @returns {void}
 */
export const getSkuData = (request, setProductImages, onFailure) => (dispatch) => {
    ApiUtils.makeAjaxRequest(
        request.skuRequest,
        data => {
            const skuData = { skuResponse: data };
            let products = transformSkuCatData(skuData, true);

            products = getReorderedProducts(request.skuRequest.payload.Sku, products);
            dispatch({
                type: TEXTWITHIMAGE.SKU_SUCCESS,
                payload: {
                    products
                }
            });
            setProductImages(products);
        },
        err => {
            dispatch({
                type: TEXTWITHIMAGE.SKU_FAILURE
            });
            onFailure();
        }
    );
};

export const setSkuUnavailable = () => (dispatch) => {
    dispatch({
        type: TEXTWITHIMAGE.IS_SKU_UNAVAILABLE
    });
};
