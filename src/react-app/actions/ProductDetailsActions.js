import { getProductManager, addProductToCart, createWebCustomerId } from 'services';
import PRODUCT from 'constants/ProductConstants';

import * as cookieUtil from 'lib/utils/cookies';
import * as objectPath from 'object-path';
import { updateProductPriceAnalytics } from 'lib/utils/analytics-util';

const customEventTrigger = require('lib/events/custom-event-trigger');


/**
 * @description get product details based on sku
 * @param {Object} request request to get product detail
 * @param {Object} dispatch redux dispatch
 * @param {Object} getState redux getState
 * @returns {void}
 */
export const getProductDetails = request => (dispatch, getState) => {
    getProductManager(request)
        .then(data => {
            const resultDto = objectPath.get(data, 'res.resultDto');

            if (resultDto) {
                dispatch({
                    type: PRODUCT.FETCH_PRODUCT_PRICE_SUCCESS,
                    payload: resultDto
                });
                updateProductPriceAnalytics(resultDto);
            }
        }, () => {
            const state = getState();
            const priceObj = {
                price: objectPath.get(state, 'productDetails.pdpConfig.price')
            };

            dispatch({
                type: PRODUCT.FETCH_PRODUCT_PRICE_SUCCESS,
                payload: priceObj
            });

            updateProductPriceAnalytics(priceObj);
        });
};

/**
 * @description update selected product quantity
 * @param {Object} quantity request to get product detail
 * @param {Object} dispatch redux dispatch
 * @param {Object} getState redux getState
 * @returns {void}
 */
export const updateSelectedQuantity = (quantity) => (dispatch, getState) => {
    dispatch({
        type: PRODUCT.UPDATE_SELECTED_PRODUCT_QUANTITY,
        payload: quantity
    });
};

/**
 * @description update selected product price
 * @param {Object} actionDetails details that specify to add or remove a perticular quantity
 * @param {Object} dispatch redux dispatch
 * @param {Object} getState redux getState
 * @returns {void}
 */
export const updateProductPrice = (actionDetails) => (dispatch, getState) => dispatch({
    type: PRODUCT.UPDATE_PRODUCT_PRICE,
    payload: actionDetails
});

/**
 * @description Get product to cart Handler calls service
 * @param {Object} request request object
 * @param {function} successCB success Callback
 * @param {function} failureCB failure Callback
 * @param {Object} dispatch redux dispatch
 * @returns {Object} a Promise that resolves Product details
 */
function addToCartHandler(request, successCB = () => { }, failureCB = () => { }, dispatch) {
    addProductToCart(request)
        .then(() => {
            successCB();
            customEventTrigger(window, 'refreshShoppingBag');
            dispatch({
                type: PRODUCT.ADD_TO_BAG_SUCCESS
            });
        })
        .catch((err) => {
            if (err && err.validationErrors && err.validationErrors.ProductMaxQuantityLimitError) {
                dispatch({
                    type: PRODUCT.ADD_TO_BAG_MAX_QUANTITY_FAILURE
                });
            }
            failureCB(err);
        });
}

/**
 * @description Check for session and add product to cart
 * @param {Object} request request to get product detail
 * @param {function} successCB success Callback
 * @param {function} failureCB failure Callback
 * @param {Object} dispatch redux dispatch
 * @param {Object} getState redux getState
 * @returns {void}
 */
export const addToCart = (request, successCB = () => { }, failureCB = () => { }) => (dispatch, getState) => {
    const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');
    const webCustomerId = cookieUtil.getCookies(cookieName);
    const sessionRequest = objectPath.get(window, 'tiffany.authoredContent.sessionConfig');

    if (!webCustomerId && sessionRequest) {
        createWebCustomerId(sessionRequest)
            .then(cstId => {
                cookieUtil.setCookie(cookieName, cstId, { secure: true }, true);
                objectPath.set(request, 'payload.webCustomerId', cstId);
                addToCartHandler(request, successCB, failureCB, dispatch);
            })
            .catch((err) => {
                failureCB(err);
            });
    } else if (webCustomerId) {
        objectPath.set(request, 'payload.webCustomerId', webCustomerId);
        addToCartHandler(request, successCB, failureCB, dispatch);
    }
};
