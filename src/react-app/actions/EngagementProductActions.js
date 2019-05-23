import ApiUtils from 'lib/api';
import CONSTANTS from 'constants/EngagementConstants';
import { getProductDetailsObj } from 'lib/utils/format-data';


/**
 * @description getProductDetails Invoke API and get products.
 * @param {Object} request payload for the product details
 * @param {Object} dispatch object
 * @returns {void}
 */
export const getProductDetails = (request) => (dispatch) => {
    ApiUtils.makeAjaxRequest(request, response => {
        const product = getProductDetailsObj(response);

        dispatch({
            type: CONSTANTS.PRODUCT_DETAILS_SUCCESS,
            payload: { product }
        });

        // dispatch({
        //     type: DFC.UPDATE_DIAMOND_FILTERS,
        //     payload: {
        //         maxPrice: product.upperPriceLimit,
        //         minPrice: product.lowerPriceLimit,
        //         currentMaxPrice: product.upperPriceLimit,
        //         currentMinPrice: product.lowerPriceLimit,
        //         minCarat: product.minCaratWeight,
        //         maxCarat: product.maxCaratWeight,
        //         diamondColor: product.diamondColor,
        //         diamondClarity: product.diamondClarity,
        //         diamondCut: product.diamondCut,
        //         currentMinCarat: objectPath.get(window, 'tiffany.authoredContent.engagementpdp.defaultMinCaratPosition', 0),
        //         currentMaxCarat: objectPath.get(window, 'tiffany.authoredContent.engagementpdp.defaultMaxCaratPosition', 1),
        //         showChooseDiamond: product.showChooseDiamond,
        //         isAvaialbleOnline: product.isAvaialbleOnline
        //     }
        // });
    }, err => {
    });
};

/**
 * @description setRomanceCopy Set Romance copy text.
 * @param {String} description payload for the product details.
 * @param {Object} dispatch object
 * @returns {void}
 */
export const setRomanceCopy = (description) => (dispatch) => {
    dispatch({
        type: CONSTANTS.ROMANCE_COPY,
        payload: { description }
    });
};
