import ApiUtils from 'lib/api';
import * as objectPath from 'object-path';
import * as cookieUtil from 'lib/utils/cookies';
/**
 * @description Check for Sku in SKUConfig in authored object.
 * @param {Object} request request contains sku request payload.
 * @returns {void}
 */
export function checkForSku(request) {
    const config = objectPath.get(request, 'payload', {});
    const skuList = objectPath.get(config, 'Sku', []);

    return skuList.filter(item => {
        return item !== (undefined || null || '');
    });
}

/**
 * @description Resolves the SKU service with provided request and returns data
 * @param {object} request The SKU service request object
 * @returns {object} promise that resolves sku service and returns response
 */
export function getSkuData(request) {
    return new Promise((resolve, reject) => {
        if (checkForSku(request).length > 0) {
            ApiUtils.makeAjaxRequest(request, res => {
                resolve(res);
            }, err => {
                resolve({});
            });
        } else {
            resolve({});
        }
    });
}

/**
 * @description Resolves the Category service with provided request and returns data
 * @param {object} request The Category service request object
 * @returns {object} promise that resolves Category service and returns response
 */
export function getCatData(request) {
    return new Promise((resolve, reject) => {
        ApiUtils.makeAjaxRequest(request, res => {
            resolve(res);
        }, err => {
            resolve({});
        });
    });
}

/**
 * @description Gets the SKU and Category data for carousel
 * @param {Object} data Any optional data that needs to be passed to the action
 * @returns {Object} a Promise that resolved data
 */
export function getSkuCatData(data) {
    return new Promise((resolve, reject) => {
        let skuResponse;

        getSkuData(data.skuRequest).then(res => {
            skuResponse = res;
            return getCatData(data.catRequest);
        }).then(res => {
            const catResponse = res;

            resolve({ skuResponse, catResponse });
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * @description updateQueryParams update sessionId and userId of richrelevance call.
 * @param {Object} request request contains sku request payload.
 * @returns {void}
 */
export function updateQueryParams(request) {
    const cookieSessionName = objectPath.get(window.tiffany, 'authoredContent.richRelevanceSessionId', 'rr_session_id');
    const cookieUserName = objectPath.get(window.tiffany, 'authoredContent.richRelevanceUserId', 'mysid2');

    const activeGroupPattern = objectPath.get(window.tiffany, 'authoredContent.activeGroupPattern', ',3,');
    const activeGroupVal = window.OptanonActiveGroups;

    if (activeGroupVal && activeGroupVal.match(activeGroupPattern)) {
        const sessionId = cookieUtil.getCookies(cookieSessionName) || '';
        const userId = cookieUtil.getCookies(cookieUserName) || '';

        objectPath.set(request.richRequest, 'queryParams.sessionId', sessionId);
        objectPath.set(request.richRequest, 'queryParams.userId', userId);
    }

    return request;
}

/**
 * @description Gets the Rich Relevance data for carousel
 * @param {Object} data Any data that needs to be passed to the action
 * @returns {Object} a Promise that resolved data
 */
export function getRichRelData(data) {
    return new Promise((resolve, reject) => {
        const skus = [];
        const request = updateQueryParams(data);

        ApiUtils.makeAjaxRequest(request.richRequest, res => {
            const placements = objectPath.get(res, 'placements', []);

            if (placements.length > 0 && placements[0].recommendedProducts && placements[0].recommendedProducts.length > 0) {
                res.placements[0].recommendedProducts.forEach(product => {
                    skus.push(product.id);
                });
            } else {
                const err = 'Rich relevance doesnt contain recommended products';

                reject(err);
            }
            request.skuRequest.payload.Sku = skus;
            getSkuData(request.skuRequest).then(skuResponse => {
                resolve({
                    skuResponse,
                    title: objectPath.get(res, 'placements.0.strategyMessage', ''),
                    skuOrder: skus,
                    rrProducts: objectPath.get(res, 'placements.0.recommendedProducts', [])
                });
            }).catch(err => {
                reject(err);
            });
        }, err => {
            reject(err);
        });
    });
}

/**
 * @description Gets the Rich Relevance raw data
 * @param {Object} richRequest request object for rich relevance
 * @returns {Object} a Promise that resolves rich relevance response
 */
export function getRichRel(richRequest) {
    return new Promise((resolve, reject) => {
        const request = updateQueryParams(richRequest);

        ApiUtils.makeAjaxRequest(request.richRequest, res => {
            resolve({ res });
        }, err => {
            reject(err);
        });
    });
}

/**
 * @description Get product data
 * @param {Object} input request object
 * @returns {Object} a Promise that resolves Product details
 */
export function getProductManager(input) {
    return new Promise((resolve, reject) => {
        ApiUtils.makeAjaxRequest(input, res => {
            resolve({ res });
        }, err => {
            reject(err);
        });
    });
}

/**
 * @description Get product to cart
 * @param {Object} input request object
 * @returns {Object} a Promise that resolves Product details
 */
export function addProductToCart(input) {
    return new Promise((resolve, reject) => {
        ApiUtils.makeAjaxRequest(input, res => {
            resolve({ res });
        }, err => {
            reject(err);
        });
    });
}

/**
 * @description get Web customerId
 * @param {Object} sessionRequest session request object
 * @returns {Object} a promise that resolves customerID details
 */
export function createWebCustomerId(sessionRequest) {
    return new Promise((resolve, reject) => {
        ApiUtils.makeAjaxRequest(
            sessionRequest,
            res => {
                resolve(objectPath.get(res, 'resultDto.webCustomerId'));
            }
        );
    });
}

/**
 * @description Gets the search results for a search term
 * @param {object} request Search request object
 * @returns {object} Promise that will resolve/reject the search request
 */
export function getSearchResults(request) {
    return new Promise((resolve, reject) => {
        ApiUtils.makeAjaxRequest(
            request,
            res => {
                resolve({
                    products: objectPath.get(res, 'resultDto.products'),
                    numRecords: objectPath.get(res, 'resultDto.numofRecords'),
                    filters: objectPath.get(res, 'resultDto.dimensions')
                });
            },
            err => {
                reject(err);
            }
        );
    });
}
