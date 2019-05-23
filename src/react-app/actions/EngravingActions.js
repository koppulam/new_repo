import ApiUtils from 'lib/api';
import * as objectPath from 'object-path';

import EC from 'constants/EngravingConstants';

/**
 * @description Do all page level actions here
 * @param {String} groupSku group sku for which engravings have to be fetched
 * @param {String} sku sku for which engravings have to be fetched
 * @param {Boolean} isBYO flag to check if broduct is BYO or not
 * @param {Boolean} editingEngraving boolean to check if engraving is triggered for editing a already engraved charm/product
 * @param {String} initialOne 1st characer in initials
 * @param {String} initialTwo 2nd characer in initials
 * @param {String} initialThree 3rd characer in initials
 * @param {String} itemServiceTypeId item service ID for edited engraving
 * @param {String} styleCode style code for edited engraving
 * @param {String} groupId selected category code for edited engraving
 * @returns {void}
 */
export const getProductEngravings = (groupSku = '', sku = '', isBYO = false, editingEngraving = false, initialOne = '', initialTwo = '', initialThree = '', itemServiceTypeId = '', styleCode = '', groupId = '') => (dispatch) => {
    const request = JSON.parse(JSON.stringify(objectPath.get(window, 'tiffany.authoredContent.engraving.productEngravings', false)));
    const skuIdentifier = 'SELECTEDSKU';
    const groupSkuIdentifier = 'GRP_SKU';
    const isBYOIdentifier = 'IS_BYO';
    const localeIdentifier = 'LOCALE';
    const regionIdentifier = 'REGION';
    const eStoreIdentifier = '?isestore=true';

    // If sku and group sku provided are empty
    if (!groupSku && !sku) {
        console.warn('Engraving: No sku and groupsku details provided to fetch data');
        dispatch({
            type: EC.UPDATE_ENGRAVING_STATUS,
            payload: {
                showEngraving: false,
                message: objectPath.get(window, 'tiffany.labels.engraving.noSkuMessage', '')
            }
        });

        return;
    }

    if (request) {
        // Replace is BYO and sku first
        request.url = request.url
            .replace(skuIdentifier, sku)
            .replace(regionIdentifier, objectPath.get(window, 'tiffany.regionCode', 'us'))
            .replace(localeIdentifier, objectPath.get(window, 'tiffany.locale', 'en_US'));

        // If engraving object doesnt have a group sku
        if (sku && groupSku === '') {
            request.url = request.url.replace(`${groupSkuIdentifier}.`, '').replace(isBYOIdentifier, isBYO.toString());
        } else {
            // if sku and group sku both are present
            if (isBYO) {
                console.warn('is-byo flag is provided as true when sku and group sku are provided. Setting it to false manually');
            }
            request.url = request.url.replace(groupSkuIdentifier, groupSku).replace(isBYOIdentifier, 'false');
        }

        request.url = `${request.url}${objectPath.get(window, 'tiffany.authoredContent.isEstore', false) ? eStoreIdentifier : ''}`;

        ApiUtils.makeAjaxRequest(
            request,
            res => {
                // On success, fetch eligible engravings from response
                // Hit the API and create the configurator object for engraving a product
                const { eligibleEngravings } = res;
                const editConfiguration = objectPath.get(res, 'customActions.calls.0.updateCartConfig', false);

                // EligibleEngravings config and editEngraving config should be preset else showing same message for both
                if (!eligibleEngravings || !editConfiguration) {
                    dispatch({
                        type: EC.PRODUCT_ENGRAVING_FAILED,
                        payload: {
                            details: {
                                sku,
                                groupSku
                            },
                            payload: request.payload
                        }
                    });

                    dispatch({
                        type: EC.UPDATE_ENGRAVING_STATUS,
                        payload: {
                            showEngraving: false,
                            message: objectPath.get(window, 'tiffany.labels.engraving.productErrorMessage', '')
                        }
                    });

                    return;
                }

                ApiUtils.makeAjaxRequest(
                    eligibleEngravings,
                    response => {
                        // populate sku data
                        dispatch({
                            type: EC.PRODUCT_AVAILABLE_ENGRAVING_FETCHED,
                            payload: {
                                details: {
                                    sku,
                                    groupSku
                                },
                                productEngravings: res,
                                priceDetails: objectPath.get(response, 'resultDto', {}),
                                editConfiguration
                            }
                        });

                        // Create configurator for the product
                        dispatch({
                            type: EC.CREATE_ENGRAVING_DATA,
                            payload: {
                                sku,
                                groupSku
                            },
                            providedDetails: {
                                initialOne,
                                initialTwo,
                                initialThree,
                                itemServiceTypeId,
                                styleCode,
                                groupId
                            }
                        });

                        dispatch({
                            type: EC.UPDATE_ENGRAVING_STATUS,
                            payload: {
                                showEngraving: true
                            }
                        });
                    },
                    err => {
                        // Error while fetching details from eligible engraving API
                        dispatch({
                            type: EC.PRODUCT_AVAILABLE_ENGRAVING_FAILED,
                            payload: {
                                details: {
                                    sku,
                                    groupSku
                                },
                                payload: eligibleEngravings.payload
                            }
                        });

                        dispatch({
                            type: EC.UPDATE_ENGRAVING_STATUS,
                            payload: {
                                showEngraving: false,
                                message: objectPath.get(window, 'tiffany.labels.engraving.eligibleErrorMessage', '')
                            }
                        });
                    }
                );
            },
            err => {
                dispatch({
                    type: EC.PRODUCT_ENGRAVING_FAILED,
                    payload: {
                        details: {
                            sku,
                            groupSku
                        },
                        payload: request.payload
                    }
                });

                dispatch({
                    type: EC.UPDATE_ENGRAVING_STATUS,
                    payload: {
                        showEngraving: false,
                        message: objectPath.get(window, 'tiffany.labels.engraving.productErrorMessage', '')
                    }
                });
            }
        );
    } else {
        console.warn('NO CONFIG FOR PRODUCT ENGRAVINGS AVAILABLE ON WINDOW OBJECT');
    }
};

/**
 * @description Do all page level actions here
 * @returns {void}
 */
export const getSiteEngravings = () => (dispatch) => {
    const request = objectPath.get(window, 'tiffany.authoredContent.engraving.siteEngravings', false);

    if (request) {
        ApiUtils.makeAjaxRequest(
            request,
            res => {
                dispatch({
                    type: EC.SITE_ENGRAVINGS_FETCHED,
                    payload: res
                });
            },
            err => {
                dispatch({
                    type: EC.SITE_ENGRAVINGS_FAILED,
                    payload: request.payload || {}
                });
                dispatch({
                    type: EC.HIDE_ENGRAVING_COMPONENT,
                    payload: request.payload || {}
                });
            }
        );
    } else {
        dispatch({
            type: EC.SITE_ENGRAVINGS_FAILED,
            payload: 'Request object for site engravings is not available'
        });
    }
};

/**
 * @description Do all page level actions here
 * @param {String} groupSku group sku for which engravings have to be taken into consideration
 * @param {String} sku sku for which engravings have to be  taken into consideration
 * @param {Boolean} editingEngraving boolean to check if engraving is triggered for editing a already engraved charm/product
 * @param {String} initialOne 1st characer in initials
 * @param {String} initialTwo 2nd characer in initials
 * @param {String} initialThree 3rd characer in initials
 * @param {String} itemServiceTypeId item service ID for edited engraving
 * @param {String} styleCode style code for edited engraving
 * @param {String} groupId selected category code for edited engraving
 * @returns {void}
 */
export const createEngravingData = (groupSku = '', sku = '', editingEngraving = false, initialOne = '', initialTwo = '', initialThree = '', itemServiceTypeId = '', styleCode = '', groupId = '') => (dispatch) => {
    dispatch({
        type: EC.CREATE_ENGRAVING_DATA,
        payload: {
            groupSku,
            sku
        },
        providedDetails: {
            initialOne,
            initialTwo,
            initialThree,
            itemServiceTypeId,
            styleCode,
            groupId
        }
    });

    dispatch({
        type: EC.UPDATE_ENGRAVING_STATUS,
        payload: {
            showEngraving: true
        }
    });
};

/**
 * @description Method to update subvarient based on the parametes sent
 * @param {Object} config can consist of single or multiple properties to be updated
 * @returns {void}
 */
export const updateVariant = (config) => (dispatch, getState) => {
    dispatch({
        type: EC.UPDATE_VARIANT,
        payload: {
            ...config
        }
    });

    // Checking if the variant is not from custom.
    // For custom engraving there is no need for us to dispatch the following events
    if (Object.keys(config).indexOf('customEngravingIndex') === -1) {
        // Set font styles based on change in category
        if (Object.keys(config).indexOf('itemServiceTypeId') !== -1 || Object.keys(config).indexOf('groupId') !== -1) {
            dispatch({
                type: EC.SET_SELECTED_CATEGORY
            });

            dispatch({
                type: EC.SET_URL_FRAGMENT
            });
        }

        dispatch({
            type: EC.UPDATE_FONT_STYLES
        });
    }

    // Sets the Preview Url based on above ations
    dispatch({
        type: EC.UPDATE_URL_CONFIG
    });
};

export const resetEngraving = () => (dispatch, getState) => {
    dispatch({
        type: EC.RESET_ENGRAVING,
        inProgress: true,
        isClosing: true
    });
};

export const setEngravingSelection = (screenConfig) => (dispatch, getState) => {
    const stateBeforeConfirmation = getState();

    dispatch({
        type: EC.RESET_ENGRAVING,
        inProgress: objectPath.get(stateBeforeConfirmation, 'engraving.screenConfig.component', '') === 'HOME',
        onConfirmationPage: screenConfig.onConfirmationPage
    });

    dispatch({
        type: EC.UPDATE_SELECTED_ENGRAVING,
        payload: {
            screenConfig
        }
    });

    dispatch({
        type: EC.UPDATE_VARIANT_DEFAULTS
    });

    const currentState = getState();

    dispatch(updateVariant(currentState.engraving.variant));
};
