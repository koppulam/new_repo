import objectPath from 'object-path';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import remove from 'lodash/remove';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import cloneDeep from 'lodash/cloneDeep';
import store from 'react-app/store';

/**
 * Set analytics data
 * @param {String} input string
 * @returns {void}
 */
export function formatStringForTracking(input) {
    if (input) {
        let name = input.replace(/[^0-9A-Za-z\s-]+/g, '');

        name = name.replace(/\s\s+/g, ' ');
        name = name.replace(/\s/g, '-');
        return name.toLowerCase();
    }
    return input;
}

/**
 * Set analytics data
 * @param {String} objectToBeSet objectToBeSet
 * @param {Object} data data object
 * @returns {void}
 */
export function setAnalyticsData(objectToBeSet, data) {
    if (!window.dataLayer) {
        window.dataLayer = {};
    }

    objectPath.set(window.dataLayer, objectToBeSet, cloneDeep(data));
}

/**
 * Trigger analytics event
 * @param {String} event event to be triggered
 * @param {String} param param to be passed
 * @returns {void}
 */
export function triggerAnalyticsEvent(event, param) {
    if (window._satellite) {
        window._satellite.track(event, cloneDeep(param));
    }
}

/**
 * Find dimension
 * @param {Object} dimension event to be triggered
 * @param {String} appliedfilter param to be passed
 * @returns {void}
 */
export function findDimension(dimension, appliedfilter) {
    let dimensionObj;

    if (parseInt(dimension.id, 10) === parseInt(appliedfilter, 10)) {
        dimensionObj = dimension;
    } else if (dimension.childDimensionValues) {
        dimension.childDimensionValues.forEach((childDimension) => {
            if (parseInt(childDimension.id, 10) === parseInt(appliedfilter, 10)) {
                dimensionObj = childDimension;
            }
        });
    }

    return dimensionObj;
}

/**
 * Find dimension
 * @param {Object} filterProperties filterProperties
 * @returns {void}
 */
export function setFiltersAnalyticsData(filterProperties) {
    let filtersData = [];
    const existingFiltersData = objectPath.get(window, 'dataLayer.search.filters', []);
    const existingFitlersLength = existingFiltersData.length;
    let newFilter;
    const {
        appliedfilters,
        filters,
        sortOption,
        type,
        queryParams,
        total,
        pricesObj,
        navigationFilters,
        init,
        catDimensionId
    } = filterProperties;

    if (appliedfilters && appliedfilters.length) {
        if (existingFiltersData.length > 0) {
            appliedfilters.forEach((appliedfilter) => {
                if (!catDimensionId || appliedfilter.toString() !== catDimensionId.toString()) {
                    filters.forEach((filter) => {
                        let filterData;

                        filter.dimensionValues.forEach((dimension) => {
                            if (!filterData) {
                                filterData = findDimension(dimension, appliedfilter);
                            }
                        });

                        if (filterData) {
                            const existingFilterFound = existingFiltersData.filter((existingFilter) => {
                                return existingFilter.value === filterData.urluniqueId;
                            });

                            if (existingFilterFound.length === 0) {
                                newFilter = {
                                    name: formatStringForTracking(filter.groupName),
                                    value: filterData.urluniqueId,
                                    order: ((existingFiltersData[existingFiltersData.length - 1] || {}).order + 1 || 1),
                                    type: 'filter',
                                    id: filterData.id
                                };

                                existingFiltersData.push(newFilter);
                            }
                        }
                    });
                }
            });
            filtersData = existingFiltersData;
        } else {
            appliedfilters.forEach((filterObj) => {
                if (!catDimensionId || filterObj.toString() !== catDimensionId.toString()) {
                    filters.forEach((filter) => {
                        filter.dimensionValues.forEach((dimension) => {
                            const dimensionObj = findDimension(dimension, filterObj);

                            if (dimensionObj && dimensionObj.urluniqueId) {
                                newFilter = {
                                    name: formatStringForTracking(filter.groupName),
                                    value: dimensionObj.urluniqueId,
                                    order: (init) ? 0 : 1,
                                    type: 'filter',
                                    id: dimensionObj.id
                                };

                                filtersData.push(newFilter);
                            }
                        });
                    });
                }
            });
        }
    }

    let finalFiltersData = [];
    let removedFilter;

    if (filtersData && filtersData.length) {
        filtersData.forEach((filter) => {
            const foundFilter = appliedfilters.find((appfilter) => {
                return parseInt(appfilter, 10) === parseInt(filter.id, 10);
            });

            if (foundFilter) {
                finalFiltersData.push(filter);
            } else {
                removedFilter = filter;
            }
        });
    }

    if (navigationFilters && pricesObj) {
        const customFilterIndex = navigationFilters.indexOf('custom');

        if (customFilterIndex !== -1) {
            const customValue = `price-${pricesObj.minPrice}-${pricesObj.maxPrice}`;

            const customFilterObject = {
                name: 'custom',
                value: customValue,
                order: existingFiltersData.length,
                type: 'filter',
                id: 'custom'
            };

            finalFiltersData.push(customFilterObject);
        }
    }

    finalFiltersData = uniqBy(finalFiltersData, 'value');

    const searchObj = {
        resultsCount: total,
        filters: finalFiltersData
    };

    if (sortOption && sortOption.sortUrlKey) {
        const sortMethod = sortOption.sortUrlKey.replace('sort-', '');

        searchObj.sortMethod = sortMethod;
    }
    if (type === 'SEARCH' && queryParams.q) {
        searchObj.keyword = queryParams.q;
    }

    const existingSortMethod = objectPath.get(window, 'dataLayer.search.sortMethod', '');
    const existingSearchObj = objectPath.get(window, 'dataLayer.search', '');

    setAnalyticsData('search', searchObj);

    if (!init) {
        if (existingSearchObj !== '' && sortOption && sortOption.sortUrlKey && existingSortMethod !== searchObj.sortMethod) {
            triggerAnalyticsEvent(AnalyticsConstants.UPDATE_SORT, { sortMethod: sortOption.sortUrlKey });
        }
        if (existingFitlersLength < finalFiltersData.length) {
            triggerAnalyticsEvent(AnalyticsConstants.ADD_FILTER, { filter: newFilter });
        } else if (removedFilter) {
            triggerAnalyticsEvent(AnalyticsConstants.REMOVE_FILTER, { filter: removedFilter });
        }
    }
}

/**
 * Transform product object
 * @param {Array} product product
 * @param {stirng} type type of search
 * @returns {void}
 */
export function transformProductObject(product, type) {
    if (product.name !== undefined && product.name !== null && product.name !== '') {
        product.name = formatStringForTracking(product.name);
    } else {
        product.name = '';
    }

    const productInfo = {
        categoryID: objectPath.get(product, 'categoryID', ''),
        categoryName: objectPath.get(product, 'categoryName', ''),
        class: objectPath.get(product, 'class', ''),
        department: objectPath.get(product, 'department', ''),
        designerAndCollections: objectPath.get(product, 'designerAndCollections', ''),
        gemstone: objectPath.get(product, 'gemstone', ''),
        gemstoneColor: objectPath.get(product, 'gemstoneColor', ''),
        groupType: objectPath.get(product, 'groupType', ''),
        isByoEligible: objectPath.get(product, 'isByoEligible', ''),
        isEngraveable: objectPath.get(product, 'isEngraveable', ''),
        isGroup: objectPath.get(product, 'isGroup', ''),
        isNew: objectPath.get(product, 'isNew', ''),
        localizedName: objectPath.get(product, 'localizedName', ''),
        masterCategoryID: objectPath.get(product, 'masterCategoryID', ''),
        masterCategoryName: objectPath.get(product, 'masterCategoryName', ''),
        material: objectPath.get(product, 'material', ''),
        mips: objectPath.get(product, 'mipsDescription', ''),
        name: objectPath.get(product, 'name', ''),
        onlineStatus: objectPath.get(product, 'isPurchasable', ''),
        parentGroupSku: objectPath.get(product, 'parentGroupSku', ''),
        price: objectPath.get(product, 'price', ''),
        quantity: objectPath.get(product, 'quantity', 1),
        style: objectPath.get(product, 'style', ''),
        stockStatus: (product.isAvailableOnline) ? AnalyticsConstants.INSTOCK : AnalyticsConstants.NOT_SOLD_ONLINE,
        inStoreStatus: objectPath.get(product, 'inStoreStatus', '')
    };

    if (product.sku) {
        product.sku = product.sku.toString();
    }
    if (product.sku && product.sku.indexOf('GRP') > -1) {
        productInfo.groupSku = product.sku;
        productInfo.sku = (product.defaultSku) ? product.defaultSku : (product.selectedSku) ? product.selectedSku : product.sku;
    } else if (product.isGroup || product.groupSku) {
        productInfo.groupSku = product.groupSku;
        productInfo.sku = product.sku;
    } else {
        productInfo.groupSku = '';
        productInfo.sku = product.sku;
    }

    if (type === 'BRIDAL') {
        productInfo['color'] = product.color;
        productInfo['gender'] = product.gender;
        productInfo['isOnlineExclusive'] = product.onlineExclusive;
        productInfo['engagementRingExperience'] = '';
        productInfo['diamondClarity'] = product.diamondClarity;
        productInfo['diamondColor'] = product.diamondColor;
        productInfo['diamondShape'] = product.diamondShape;
        productInfo['carats'] = product.caratWeight;
        productInfo['setting'] = product.setting;
        productInfo['itemMaster'] = product.itemMasterNumber;
    }

    return productInfo;
}

/**
 * Find dimension
 * @param {Array} products products
 * @param {stirng} type type of search
 * @returns {void}
 */
export function setProductsAnalyticsData(products, type) {
    const productsData = [];

    for (let productIndex = 0; productIndex < products.length && productIndex < 15; productIndex += 1) {
        const productInfo = transformProductObject(products[productIndex], type);

        productInfo.position = productIndex + 1;
        productsData.push(productInfo);
    }
    const existingProducts = objectPath.get(window, 'dataLayer.products', []);

    if (existingProducts.length === 0) {
        triggerAnalyticsEvent(AnalyticsConstants.PAGE_LOADED, {});
    }
    setAnalyticsData('products', productsData);
}

/**
 * page Not found check
 * @returns {void}
 */
export function pageNotFoundCheck() {
    const errors = objectPath.get(window, 'dataLayer.page.errors', []);
    const pageNotFound = AnalyticsConstants.PAGE_NOT_FOUND;

    if (errors.indexOf(pageNotFound) !== -1) {
        triggerAnalyticsEvent(AnalyticsConstants.INLINE_ERROR, { erroCode: AnalyticsConstants.PAGE_NOT_FOUND });
    }

    errors.forEach((error) => {
        if (error.toString().trim() === '500') {
            triggerAnalyticsEvent(AnalyticsConstants.INLINE_ERROR, { erroCode: '500' });
        }
    });
}

/**
 * Set analytics error
 * @param {object} error error
 * @returns {void}
 */
export function setAnalyticsError(error) {
    const errors = objectPath.get(window, 'dataLayer.page.errors', []);

    errors.push(error);
    setAnalyticsData('page.errors', errors);
    triggerAnalyticsEvent(AnalyticsConstants.INLINE_ERROR, { errorCode: error });
}

/**
 * Set analytics cart data
 * @param {object} product object
 * @returns {void}
 */
export function setCartAnalytics(product) {
    const cartProducts = objectPath.get(window, 'dataLayer.ecommerce.cart.products', []);

    const prodIndex = findIndex(cartProducts, (productObj) => {
        if (!productObj.sku || !product.sku) return false;
        return productObj.sku.toString() === product.sku.toString();
    });

    if (prodIndex !== -1) {
        cartProducts[prodIndex].quantity += product.quantity;
        cartProducts[prodIndex].totalPrice = cartProducts[prodIndex].quantity * product.price;
    } else {
        product.totalPrice = product.quantity * product.price;
        cartProducts.push(transformProductObject(product));
    }

    setAnalyticsData('ecommerce.cart.products', cartProducts);

    triggerAnalyticsEvent(AnalyticsConstants.ADD_TO_CART, { product, shippingMethod: AnalyticsConstants.SHIP_TO_ME });
}

/**
 * Set analytics cart data
 * @param {object} product object
 * @returns {void}
 */
export function removeCartAnalytics(product) {
    const savedproducts = cloneDeep(objectPath.get(window, 'dataLayer.ecommerce.cart.products', []));

    const savedIndex = findIndex(savedproducts, (productItem) => {
        return productItem.sku.toString() === product.sku.toString();
    });

    if (savedIndex > -1 && savedproducts[savedIndex].quantity > 1) {
        savedproducts[savedIndex].quantity -= 1;
    } else {
        remove(savedproducts, (productItem) => {
            return productItem.sku.toString() === product.sku.toString();
        });
    }
    setAnalyticsData('ecommerce.cart.products', savedproducts);
    triggerAnalyticsEvent(AnalyticsConstants.REMOVE_FROM_CART, { product : transformProductObject(product) });
}

/**
 * Remove analytics saveditems
 * @param {object} product object
 * @returns {void}
 */
export function removeSavedItemsAnalytics(product) {
    let removedProduct;
    try {
        const savedproducts = objectPath.get(window, 'dataLayer.ecommerce.savedItems.products', []);

        removedProduct = remove(savedproducts, (productItem) => {
            if (!productItem.sku) return false;
            return productItem.sku.toString() === product.sku.toString() || (productItem.groupSku && productItem.groupSku.toString() === product.sku.toString());
        });
        setAnalyticsData('ecommerce.savedItems.products', savedproducts);
    } finally {
        if (removedProduct && removedProduct.length > 0) {
            const removedProductsFormatted = [];
            removedProduct.forEach((item) => {
                removedProductsFormatted.push(transformProductObject(item));
            });
            triggerAnalyticsEvent(AnalyticsConstants.REMOVE_SAVED_ITEM, { products : removedProductsFormatted});
        } else {
            triggerAnalyticsEvent(AnalyticsConstants.REMOVE_SAVED_ITEM, { product : transformProductObject(product)});
        }

    }
}

/**
 * Remove analytics saveditems
 * @param {object} product object
 * @returns {void}
 */
export function removeByoSavedItemsAnalytics(product) {
    const savedproducts = objectPath.get(window, 'dataLayer.ecommerce.savedItems.products', []);

    const removedProducts = remove(savedproducts, (productItem) => {
        if (!productItem.designID) return false;
        return productItem.designID.toString() === product.designID.toString();
    });

    setAnalyticsData('ecommerce.savedItems.products', savedproducts);
    if (removedProducts && removedProducts.length > 0) {
        const removedProductsFormatted = [];
        removedProducts.forEach((item) => {
            removedProductsFormatted.push(transformProductObject(item));
        });
        triggerAnalyticsEvent(AnalyticsConstants.REMOVE_SAVED_ITEM, { products : removedProductsFormatted });
    } else {
        triggerAnalyticsEvent(AnalyticsConstants.REMOVE_SAVED_ITEM, { product : transformProductObject(product) });
    }
}

/**
 * Set initial analytics cart data
 * @param {object} products array
 * @returns {void}
 */
export function setInitialCartAnalytics(products) {
    const cartExistingProducts = objectPath.get(window, 'dataLayer.ecommerce.cart.products', []);
    const cartProducts = objectPath.get(products, 'items', []);
    const finalProducts = [];

    if (cartExistingProducts.length === 0 && cartProducts.length > 0) {
        cartProducts.forEach((product) => {
            const transformedProduct = transformProductObject(product.item);

            transformedProduct.quantity = product.quantity;
            transformedProduct.totalPrice = product.quantity * product.item.price;
            finalProducts.push(transformedProduct);
        });
        setAnalyticsData('ecommerce.cart.products', finalProducts);
    }
}

/**
 * Set initial analytics wishlist
 * @param {object} products array
 * @returns {void}
 */
export function setInitialWishlistAnalytics(products) {
    const cartExistingProducts = objectPath.get(window, 'dataLayer.ecommerce.savedItems.products', []);
    const finalProducts = [];

    if (cartExistingProducts.length === 0 && products.length > 0) {
        products.forEach((product) => {
            const transformedProduct = transformProductObject(product);

            transformedProduct.quantity = product.quantity;
            transformedProduct.totalPrice = product.quantity * product.price;
            finalProducts.push(transformedProduct);
        });
        setAnalyticsData('ecommerce.savedItems.products', finalProducts);
    }
}

/**
 * Sets selected Diamond analytics
 * @param {object} caratWeight caratweight
 * @returns {void}
 */
export function selectDiamondAnalytics(caratWeight) {
    const productObj = objectPath.get(window, 'dataLayer.product', []);

    productObj.initialCaretWeight = productObj.carats;
    productObj.carats = caratWeight;
    triggerAnalyticsEvent(AnalyticsConstants.VIEW_DIAMOND, { product: productObj });
}

/**
 * Reset carat
 * @returns {void}
 */
export function resetCaratInAnalytics() {
    const productObj = objectPath.get(window, 'dataLayer.product', []);

    productObj.carats = productObj.initialCaretWeight;
}

/**
 * Set stock status analytics
 * @param {string} status status
 * @returns {void}
 */
export function setStockStatusAnalytics(status) {
    const productObj = objectPath.get(window, 'dataLayer.product', {});

    if (status) {
        productObj.stockStatus = AnalyticsConstants.INSTOCK;
    } else {
        productObj.stockStatus = AnalyticsConstants.NOT_SOLD_ONLINE;
    }

    setAnalyticsData('product', productObj);
}

/**
 * Add wishlist analytics
 * @param {object} products products
 * @param {string} designID designID
 * @returns {void}
 */
export function addByoWishlistAnalytics(products, designID) {
    const cartExistingProducts = objectPath.get(window, 'dataLayer.ecommerce.savedItems.products', []);
    const newProducts = [];

    products.forEach((product) => {
        product.isAvailableOnline = true;
        const newProduct = transformProductObject(product);

        if (designID) {
            newProduct.designID = designID;
        }
        if (newProduct.sku) {
            cartExistingProducts.push(newProduct);
            newProducts.push(newProduct);
        }
    });
    setAnalyticsData('ecommerce.savedItems.products', cartExistingProducts);
    triggerAnalyticsEvent(AnalyticsConstants.ADD_SAVED_ITEM, { products: newProducts });
}


/**
 * Update tray and chain analytics
 * @param {object} state state
 * @returns {void}
 */
export function updateTrayChainAnalytics(state) {
    const inTrayCharms = objectPath.get(state, 'charmsTray', []);
    const onChainCharms = objectPath.get(state, 'charmsOnFixture', {});
    const inTrayTransformed = [];
    const onChainTransformed = [];
    const currentStore = store.getState();

    if (inTrayCharms.length > 0) {
        inTrayCharms.forEach((charm) => {
            charm.isAvailableOnline = true;
            const transformedCharm = transformProductObject(charm);

            transformedCharm.categoryID = objectPath.get(currentStore, 'aem.byoConfig.charmsCategory.categoryId', '');
            transformedCharm.categoryName = objectPath.get(currentStore, 'aem.byoConfig.charmsCategory.categoryName', '');
            inTrayTransformed.push(transformedCharm);
        });
    }

    // onChainCharms is an object :(
    for (let charmKey in onChainCharms) {
        if (onChainCharms.hasOwnProperty(charmKey)) {
            onChainCharms[charmKey].isAvailableOnline = true;
            const transformedCharm = transformProductObject(onChainCharms[charmKey]);

            transformedCharm.categoryID = objectPath.get(currentStore, 'aem.byoConfig.charmsCategory.categoryId', '');
            transformedCharm.categoryName = objectPath.get(currentStore, 'aem.byoConfig.charmsCategory.categoryName', '');
            onChainTransformed.push(transformedCharm);
        }
    }

    const byoData = objectPath.get(window, 'dataLayer.byo', {});

    byoData.inTray = inTrayTransformed;
    byoData.onChain = onChainTransformed;
    setAnalyticsData('byo', byoData);
}

/**
 * Add Charm to tray analytics
 * @param {object} charm charm
 * @param {object} newState newState
 * @returns {void}
 */
export function addCharmToTrayAnalytics(charm, newState) {
    const byoStep = objectPath.get(window, 'dataLayer.byo', {});

    if (byoStep.step !== AnalyticsConstants.BYO_START && byoStep.step !== AnalyticsConstants.BYO_TRAY) {
        byoStep.back = true;
    } else {
        byoStep.back = false;
    }
    byoStep.step = AnalyticsConstants.BYO_TRAY;

    setAnalyticsData('byo', byoStep);
    updateTrayChainAnalytics(newState);

    if (charm) {
        charm.isAvailableOnline = true;
        triggerAnalyticsEvent(AnalyticsConstants.ADD_TO_TRAY, { product: transformProductObject(charm) });
    }
}

/**
 * remove charm analytics
 * @param {object} charm charm
 * @param {object} newState new state
 * @returns {void}
 */
export function removeCharmFromFixtureAnalytics(charm, newState) {
    const byoData = objectPath.get(window, 'dataLayer.byo', []);

    byoData.back = true;

    setAnalyticsData('byo', byoData);
    updateTrayChainAnalytics(newState);
    charm.isAvailableOnline = true;
    triggerAnalyticsEvent(AnalyticsConstants.REMOVE_FROM_CHAIN, { product: transformProductObject(charm) });
}

/**
 * Add wishlist to analytics - from <wishlist> component
 * @param {object} sku sku
 * @returns {void}
 */
export function addWishlistAnalytics(sku) {
    const savedproducts = objectPath.get(window, 'dataLayer.ecommerce.savedItems.products', []);
    let productObj = objectPath.get(window, 'dataLayer.product', {});

    const currentStore = store.getState();

    if (!(productObj && productObj.sku)) {
        const rawProducts = objectPath.get(currentStore, 'filters.rawProducts', []);

        const foundProducts = rawProducts.filter((product) => {
            return sku.toString() === product.sku.toString() || sku.toString() === product.selectedSku.toString()
        });

        if (foundProducts && foundProducts.length > 0) {
            productObj = transformProductObject(foundProducts[0]);
        }
    }

    if (productObj.quantity && productObj.price) {
        productObj.totalPrice = productObj.quantity * productObj.price;
    }

    savedproducts.push(productObj);

    setAnalyticsData('ecommerce.savedItems.products', savedproducts);
    triggerAnalyticsEvent(AnalyticsConstants.ADD_SAVED_ITEM, { product: productObj });
}

/**
 * drop a hint analytics
 * @param {boolean} isByo isByo
 */
export function triggerDropAHintAnalytics(isByo) {
    let productObj = objectPath.get(window, 'dataLayer.product', {});
    if (isByo) {
        const currentStore = store.getState();

        productObj = objectPath.get(currentStore, 'byo.selectedFixture', {});
    }
    triggerAnalyticsEvent(AnalyticsConstants.DROP_HINT, { product: transformProductObject(productObj) });
}

/**
 * Byo add to bag analytics
 */
export function byoAddtoBagAnalytics(designID, addToBag) {
    const byoStep = objectPath.get(window, 'dataLayer.byo', {});

    byoStep.back = false;
    byoStep.step = AnalyticsConstants.BYO_CONFIRM;

    setAnalyticsData('byo', byoStep);
    triggerAnalyticsEvent(AnalyticsConstants.UPDATED_BYO, {});

    const cartProducts = objectPath.get(window, 'dataLayer.ecommerce.cart.products', []);
    const cartNewProducts = [];

    byoStep.chain.designID = designID;
    cartProducts.push(byoStep.chain);
    cartNewProducts.push(byoStep.chain);

    if (byoStep.onChain && byoStep.onChain.length > 0) {
        byoStep.onChain.forEach((charm) => {
            charm.isAvailableOnline = true;
            charm.designID = designID;
            cartProducts.push(charm);
            cartNewProducts.push(charm);
        });
    }

    if (addToBag) {
        setAnalyticsData('ecommerce.cart.products', cartProducts);
        triggerAnalyticsEvent(AnalyticsConstants.ADD_TO_CART, { products: cartNewProducts, shippingMethod: AnalyticsConstants.SHIP_TO_ME });
    } else {
        addByoWishlistAnalytics(cartNewProducts, designID);
    }
}

/**
 * Remove custom designs from Cart
 * @param {string} designID designId
 */
export function removeByoCartAnalytics(designID) {
    const cartproducts = objectPath.get(window, 'dataLayer.ecommerce.cart.products', []);

    const removedProducts = remove(cartproducts, (productItem) => {
        if (!productItem.designID) return false;
        return productItem.designID.toString() === designID.toString();
    });

    setAnalyticsData('ecommerce.cart.products', cartproducts);

    if (removedProducts && removedProducts.length > 0) {
        const removedProductsFormatted = [];
        removedProducts.forEach((item) => {
            removedProductsFormatted.push(transformProductObject(item));
        });
        triggerAnalyticsEvent(AnalyticsConstants.REMOVE_FROM_CART, { products : removedProductsFormatted });
    } else {
        triggerAnalyticsEvent(AnalyticsConstants.REMOVE_FROM_CART, { product : transformProductObject({sku: designID}) });
    }
}

/**
 * Update product price
 * @returns {void}
 */
export function updateProductPriceAnalytics(pricesObj) {
    const price = objectPath.get(pricesObj, 'price', '');

    if (price) {
        setAnalyticsData('product.price', price);
    }
    triggerAnalyticsEvent(AnalyticsConstants.PAGE_LOADED, {});
}

/**
 * Update diamond Filters Analytics
 * @returns {void}
 */
export function updateDiamondFilterAnalytics(state) {
    const addFilters = [];
    const currentState = (state.diamondFilters) ? state.diamondFilters : state;

    addFilters.push({
        name: 'minPrice',
        value: currentState.currentMinPrice
    });

    addFilters.push({
        name: 'maxPrice',
        value: currentState.currentMaxPrice
    });

    addFilters.push({
        name: 'minCaratWeight',
        value: currentState.currentMinCarat
    });

    addFilters.push({
        name: 'maxCaratWeight',
        value: currentState.currentMaxCarat
    });

    addFilters.push({
        name: 'clarity',
        value: currentState.claritiesSelected
    });

    addFilters.push({
        name: 'color',
        value: currentState.selectedColors
    });

    setAnalyticsData('loveEngagement.diamondSelector.filters', addFilters);
}
