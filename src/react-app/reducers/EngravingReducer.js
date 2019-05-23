import EC from 'constants/EngravingConstants';
import * as objectPath from 'object-path';
import orderBy from 'lodash/orderBy';
import {
    createReferenceKey,
    constructUrl,
    setUpVariant,
    inputUpdater
} from 'lib/utils/engraving';
import { replaceHttp } from 'lib/utils/format-url';
import { currencyFormatter } from 'lib/utils/currency-formatter';

const SCREEN_IDENTIFIERS = {
    INITIALS: 'INITIALS_COMPONENT',
    SYMBOLS: 'SYMBOLS_COMPONENT',
    CUSTOM: 'CUSTOM_COMPONENT'
};
const MONOGRAM_PRICE_IDENTIFIER = 'PRICE_GOES_HERE';
const DEAULT_PLACEHOLDERS = {
    initialOne: objectPath.get(window, 'tiffany.labels.engraving.initials.placeHolderOne', 'a'),
    initialTwo: objectPath.get(window, 'tiffany.labels.engraving.initials.placeHolderTwo', 'b'),
    initialThree: objectPath.get(window, 'tiffany.labels.engraving.initials.placeHolderThree', 'c')
};
const MONOGRAM_SERVICE_TYPE_ID = objectPath.get(window, 'tiffany.authoredContent.engraving.engravingDefaults.monogramServiceID', 150);
const variantFallbacks = objectPath.get(window, 'tiffany.authoredContent.engraving.engravingDefaults', {
    initials: {
        itemServiceTypeId: 1,
        styleCode: 290
    },
    symbols: {
        itemServiceTypeId: 11,
        styleCode: 751,
        groupId: 4
    },
    monogramServiceID: 150,
    monogramLinkedTo: 15
});
const defaultVariant = {
    initialOne: '',
    initialThree: '',
    initialTwo: '',
    itemServiceTypeId: -1,
    styleCode: -1,
    groupId: -1,
    isTrueType: false,
    customEngravingIndex: -1,
    unitPrice: -1,
    servicingQuantity: 0
};
const defaultUrlConfig = {
    altText: '',
    defaultSrc: '',
    isLazyLoad: false,
    hiddenOnError: true
};
const defaultUrlFragment = {
    preStyleCode: '',
    preItemService: '',
    preInitialsOne: '',
    preInitialsTwo: '',
    preInitialsThree: '',
    beforePreset: '',
    rest: '',
    preset: '',
    styleName: ''
};
const initialState = {
    rawData: {
        siteEngraving: [],
        skuData: {}
    },
    configurator: {
        hasMonograming: false,
        userProvidedData: {},
        startEngraving: false,
        urlFragment: {
            ...defaultUrlFragment
        },
        previewOnLoad: {
            altText: '',
            defaultSrc: '',
            isLazyLoad: false,
            hiddenOnError: true
        },
        previewEngraved: {
            altText: '',
            defaultSrc: '',
            isLazyLoad: false,
            hiddenOnError: true
        },
        availableStyles: [],
        urlConfig: {
            ...defaultUrlConfig
        },
        selectedCategory: {
            serviceTypeId: -1,
            groupDescription: ''
        },
        engravingStatus: false,
        engravingMessage: objectPath.get(window, 'tiffany.labels.engraving.initialMessage', ''),
        monogramConfig: {},
        hasSymbolObject: false
    },
    screenConfig: {
        component: 'HOME'
    },
    variant: {
        ...defaultVariant
    },
    showEngravingComponent: false
};

/**
 * Extracts sku id's from wishlist and appends to payload
 * @param {object} state default state data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
export default function engravingReducer(state = initialState, action) {
    switch (action.type) {
        case EC.HIDE_ENGRAVING_COMPONENT: {
            return {
                ...state,
                showEngravingComponent: false
            };
        }
        case EC.RESET_ENGRAVING: {
            const variant = action.inProgress ? defaultVariant : state.variant;
            const updatedPreview = action.onConfirmationPage ? state.configurator.previewEngraved : defaultUrlConfig;
            let {
                previewOnLoad,
                hasMonograming,
                monogramConfig,
                userProvidedData,
                availableEngravings,
                engravingStatus
            } = state.configurator;

            if (action.isClosing) {
                hasMonograming = false;
                monogramConfig = {};
                previewOnLoad = defaultUrlConfig;
                userProvidedData = {};
                availableEngravings = [];
                engravingStatus = false;
            }

            return {
                ...state,
                configurator: {
                    ...state.configurator,
                    availableEngravings,
                    urlFragment: defaultUrlFragment,
                    previewOnLoad,
                    hasMonograming,
                    monogramConfig,
                    previewEngraved: updatedPreview,
                    availableStyles: [],
                    urlConfig: defaultUrlConfig,
                    selectedCategory: {
                        serviceTypeId: -1,
                        groupDescription: ''
                    },
                    userProvidedData,
                    engravingStatus,
                    startEngraving: action.inProgress
                },
                screenConfig: {
                    component: 'HOME'
                },
                variant
            };
        }
        case EC.UPDATE_ENGRAVING_STATUS: {
            const { message = '', showEngraving } = action.payload;

            return {
                ...state,
                configurator: {
                    ...state.configurator,
                    engravingStatus: showEngraving,
                    // Not showing any engraving message
                    engravingMessage: '',
                    message
                }
            };
        }
        case EC.SITE_ENGRAVINGS_FETCHED: {
            // Adds site engraving data to reducer
            return {
                ...state,
                rawData: {
                    ...state.rawData,
                    siteEngraving: action.payload.resultDto
                },
                showEngravingComponent: true
            };
        }
        case EC.PRODUCT_AVAILABLE_ENGRAVING_FETCHED: {
            // add a new key to exisiting raw data
            // Forming Key
            const { sku, groupSku } = action.payload.details;
            const productDetails = {};
            const key = createReferenceKey(groupSku, sku);

            productDetails[key] = action.payload.productEngravings;
            productDetails[key].priceDetails = action.payload.priceDetails;
            productDetails[key].editConfiguration = action.payload.editConfiguration;

            return {
                ...state,
                rawData: {
                    ...state.rawData,
                    skuData: {
                        ...state.rawData.skuData,
                        ...productDetails
                    }
                }
            };
        }
        case EC.PRODUCT_ENGRAVING_FAILED: {
            const { sku, groupSku } = action.payload.details;

            console.warn(`Unable to fetch Product engravings for${groupSku === '' ? '' : ` combination of group sku - ${groupSku} and`} sku - ${sku}`);
            return state;
        }
        case EC.CREATE_ENGRAVING_DATA: {
            const { sku, groupSku } = action.payload;
            const { skuData } = state.rawData;
            const { providedDetails } = action;
            const key = createReferenceKey(groupSku, sku);
            let variant = {};
            const productDetails = skuData[key];
            const engravingMap = JSON.parse(JSON.stringify(objectPath.get(window, 'tiffany.authoredContent.engraving.engravingMap', [])));
            const custom = objectPath.get(window, 'tiffany.labels.engraving.custom', false);
            const hasCustomEngraving = objectPath.get(window, 'tiffany.authoredContent.engraving.hasCustomEngraving', false);
            const siteEngravings = objectPath.get(state, 'rawData.siteEngraving', []);
            const eligibleEngravings = objectPath.get(productDetails, 'priceDetails.itemServicingOptions', []);
            const previewConf = objectPath.get(productDetails, 'priceDetails.itemEngravingImagePreview', {});
            const editConfiguration = objectPath.get(productDetails, 'editConfiguration', {});
            const hasSymbolObject = objectPath.get(productDetails, 'priceDetails.itemEngravingImagePreview.hasSymbolObject', false);

            // checking if monogram is present in product eligible engravings. If product is not eligible for mongraming will be undefined
            const checkForMonogram = eligibleEngravings.filter(price => (parseInt(price.itemServiceTypeId, 10) === parseInt(MONOGRAM_SERVICE_TYPE_ID, 10)))[0];
            let updatedResponse = [];
            let monogramConfig = {};
            let hasMonograming = false;

            updatedResponse = engravingMap.map(engraving => {
                engraving.categories = orderBy(engraving.categories, 'orderBy', 'asc').map(category => {
                    const eligibleEngraving = eligibleEngravings.filter(price => (parseInt(price.itemServiceTypeId, 10) === parseInt(category.serviceTypeId, 10)))[0];

                    if (checkForMonogram && (parseInt(category.serviceTypeId, 10) === parseInt(MONOGRAM_SERVICE_TYPE_ID, 10))) {
                        hasMonograming = true;
                        monogramConfig = {
                            ...category,
                            details: siteEngravings.filter(singleEngraving => (parseInt(singleEngraving.serviceTypeCode, 10) === parseInt(category.serviceTypeId, 10)))[0],
                            pricing: eligibleEngraving
                        };

                        // Hand engraving price has to be deducted from monograming price here.
                        const handEngravingPrice = objectPath.get(eligibleEngravings.filter(price => (parseInt(price.itemServiceTypeId, 10) === parseInt(variantFallbacks.monogramLinkedTo, 10))), '0.unitPrice', 0);
                        const monogramDifferentialPrice = monogramConfig.pricing.unitPrice - handEngravingPrice;

                        // Setting up the unit price in description here
                        monogramConfig = {
                            ...monogramConfig,
                            description: monogramConfig.description.replace(MONOGRAM_PRICE_IDENTIFIER, currencyFormatter(monogramDifferentialPrice * monogramConfig.pricing.servicingQuantity))
                        };
                        return {};
                    }
                    if (eligibleEngraving && Object.keys(eligibleEngraving).length > 0) {
                        return {
                            ...category,
                            details: siteEngravings.filter(singleEngraving => (parseInt(singleEngraving.serviceTypeCode, 10) === parseInt(category.serviceTypeId, 10)))[0],
                            pricing: eligibleEngraving
                        };
                    }
                    return {};
                }).filter((updatedcategory) => Object.keys(updatedcategory).length > 0);
                return engraving;
            });

            // If the updatedResponse length is 0, engraving should not be desplayed
            if (!updatedResponse.length) {
                console.warn(`Initials or Symbols for product with ${groupSku !== '' ? `group sku ${groupSku} and` : ''} sku ${sku} are not avaialable but isServicable is True`);
                return state;
            }

            // Check if custom engraving config is present
            if (hasCustomEngraving) {
                if (!custom) {
                    console.warn('tiffany.labels is missing config for \'Custom Engraving\'');
                    return state;
                }
            }

            // flush not eligible things
            updatedResponse = updatedResponse.filter(res => res.categories.length > 0);
            if (hasCustomEngraving) {
                // Once custom is pushed to response, check the response length.
                updatedResponse.push(custom);
            }
            updatedResponse = orderBy(updatedResponse, 'orderBy', 'asc');

            // get and set variant
            // get true type only if engraving is not symbols else directly set the variant
            if (parseInt(providedDetails.itemServiceTypeId, 10) !== variantFallbacks.symbols.itemServiceTypeId) {
                // filtering category from raw data/siteEngravings
                const category = siteEngravings.filter(eng => eng.serviceTypeCode === parseInt(providedDetails.itemServiceTypeId, 10))[0];

                if (category) {
                    const style = objectPath.get(category, 'styleGroups.0.styles', [])
                        .filter(sty => sty.styleCode === parseInt(providedDetails.styleCode, 10))[0] || {};

                    providedDetails.isTrueType = style.isTrueType;
                }
            }
            variant = setUpVariant(defaultVariant, providedDetails);

            return {
                ...state,
                configurator: {
                    ...state.configurator,
                    startEngraving: false,
                    availableEngravings: updatedResponse,
                    defaultPreview: previewConf,
                    previewOnLoad: objectPath.get(productDetails, 'previewConfig', {}),
                    editConfiguration,
                    hasMonograming,
                    monogramConfig,
                    // Considering user provided details only if there is itemServiveTypeId
                    userProvidedData: providedDetails.itemServiceTypeId ? {
                        ...providedDetails,
                        itemServiceTypeId: parseInt(providedDetails.itemServiceTypeId, 10),
                        styleCode: parseInt(providedDetails.styleCode, 10),
                        groupId: parseInt(providedDetails.groupId, 10)
                    } : {},
                    hasSymbolObject
                },
                variant
            };
        }
        case EC.UPDATE_VARIANT:
            return {
                ...state,
                variant: {
                    ...state.variant,
                    ...action.payload
                }
            };
        case EC.UPDATE_VARIANT_DEFAULTS: {
            const {
                screenConfig,
                variant,
                configurator
            } = state;
            const {
                startEngraving,
                hasMonograming,
                monogramConfig
            } = configurator;
            let newVariant = {};

            switch (state.screenConfig.component) {
                case SCREEN_IDENTIFIERS.INITIALS: {
                    let variation = Object.keys(configurator.userProvidedData).length > 0 ? configurator.userProvidedData : {};
                    const initialsFallBack = variantFallbacks.initials;

                    // if startEngraving is true, user is on confirmation page so setting to defaults
                    if (startEngraving) {
                        variation = Object.keys(variation).length > 0 ? variation : initialsFallBack;
                    } else {
                        variation = variant;
                    }

                    // check if category ID provided is available in screen configuration.
                    const { categories = [] } = screenConfig;
                    let selectedCategory = categories.filter(eachCategory => parseInt(eachCategory.serviceTypeId, 10) === parseInt(variation.itemServiceTypeId, 10));

                    if (hasMonograming && variation.itemServiceTypeId === variantFallbacks.monogramServiceID) {
                        selectedCategory = [monogramConfig];
                    }

                    if (selectedCategory.length === 0) {
                        // Category with provided itemServiceTypeId is not present so setting 1st category as default
                        console.warn(`AEM configuration itemServiceTypeId under initials ${variation.itemServiceTypeId} for initials in defaults is missing`);
                        selectedCategory = categories;
                    }

                    if (selectedCategory.length === 0) {
                        console.warn('There are no categories present for initials from service. API Error');
                        return state;
                    }

                    // If we reach this point there is some category present in selectedcategory
                    const itemServiceTypeId = selectedCategory[0].serviceTypeId;
                    const styles = objectPath.get(selectedCategory[0], 'details.styleGroups.0.styles', [{ styleCode: 1 }]);
                    const selectedStyles = styles.filter(eachStyle => parseInt(eachStyle.styleCode, 10) === parseInt(variation.styleCode, 10));
                    let stylesToFetchFrom = [];

                    if (selectedStyles.length === 0) {
                        console.warn(`Unable to find style code ${variation.styleCode} under given servicing type`);
                        console.warn('fetching first font style code from available options');
                        stylesToFetchFrom = styles;
                    } else {
                        stylesToFetchFrom = selectedStyles;
                    }

                    newVariant = {
                        ...variation,
                        itemServiceTypeId,
                        styleCode: stylesToFetchFrom[0].styleCode,
                        isTrueType: stylesToFetchFrom[0].isTrueType
                    };

                    delete newVariant.customEngravingIndex;
                    return {
                        ...state,
                        variant: newVariant
                    };
                }
                case SCREEN_IDENTIFIERS.SYMBOLS: {
                    let selectedGroupId = '';
                    let variation = Object.keys(configurator.userProvidedData).length > 0 ? configurator.userProvidedData : {};
                    const symbolsFallback = variantFallbacks.symbols;

                    // if startEngraving is true, user is on confirmation page so setting to defaults
                    if (startEngraving) {
                        variation = Object.keys(variation).length > 0 ? variation : symbolsFallback;
                    } else {
                        variation = variant;
                    }

                    // check if category ID provided is available in screen configuration.
                    // Ideally we need not check for category as there will always be only one category in symbols.
                    // Addind filter only for future
                    const { categories = [] } = screenConfig;
                    let selectedCategory = categories.filter(eachCategory => parseInt(eachCategory.serviceTypeId, 10) === parseInt(variation.itemServiceTypeId, 10));

                    if (selectedCategory.length === 0) {
                        // Category with provided itemServiceTypeId is not present so setting 1st category as default
                        console.warn(`AEM configuration itemServiceTypeId under symbols ${variation.itemServiceTypeId} for symbols in defaults is missing`);
                        selectedCategory = categories;
                    }

                    if (selectedCategory.length === 0) {
                        console.warn('There are no categories present for symbols from service. API Error');
                        return state;
                    }

                    const availableStyleGroups = objectPath.get(selectedCategory[0], 'details.styleGroups', []);
                    let selectedGroup = availableStyleGroups.filter(eachStyleGroup => parseInt(eachStyleGroup.groupId, 10) === parseInt(variation.groupId, 10));

                    // Check if group is present else populate with default
                    if (selectedGroup.length === 0) {
                        selectedGroup = availableStyleGroups;
                    }

                    if (selectedGroup.length === 0) {
                        console.warn('There are no group present for symbols from service. API Error');
                        return state;
                    }

                    // If we reach this point there is some category and some groupId present
                    const itemServiceTypeId = selectedCategory[0].serviceTypeId;

                    selectedGroupId = selectedGroup[0].groupId;
                    const styles = objectPath.get(selectedGroup[0], 'styles', [{
                        styleCode: 368,
                        styleNameLowerCase: 'aries'
                    }]);
                    const selectedStyles = styles.filter(eachStyle => parseInt(eachStyle.styleCode, 10) === parseInt(variation.styleCode, 10));
                    let stylesToFetchFrom = [];
                    const servicingQuantity = parseInt(objectPath.get(selectedCategory[0], 'pricing.servicingQuantity', 1), 10);

                    if (selectedStyles.length === 0) {
                        console.warn(`Unable to find style code ${variation.styleCode} under given servicing type`);
                        console.warn('fetching first font style code from available options');
                        stylesToFetchFrom = styles;
                    } else {
                        stylesToFetchFrom = selectedStyles;
                    }

                    newVariant = {
                        ...variation,
                        itemServiceTypeId,
                        servicingQuantity,
                        groupId: selectedGroupId,
                        styleCode: stylesToFetchFrom[0].styleCode,
                        isTrueType: stylesToFetchFrom[0].isTrueType
                    };

                    delete newVariant.customEngravingIndex;
                    return {
                        ...state,
                        variant: newVariant
                    };
                }
                default:
                    return state;
            }
        }
        case EC.SET_SELECTED_CATEGORY: {
            const { screenConfig, variant } = state;
            const { selectedCategory, hasMonograming, monogramConfig } = state.configurator;

            switch (state.screenConfig.component) {
                case SCREEN_IDENTIFIERS.INITIALS: {
                    if (variant.itemServiceTypeId !== selectedCategory.serviceTypeId) {
                        let [newSelectedCategory] = screenConfig.categories.filter(eachCategory => parseInt(eachCategory.serviceTypeId, 10) === parseInt(variant.itemServiceTypeId, 10));

                        if (hasMonograming && variant.itemServiceTypeId === variantFallbacks.monogramServiceID) {
                            newSelectedCategory = monogramConfig;
                        }
                        const unitPrice = parseInt(objectPath.get(newSelectedCategory, 'pricing.unitPrice', -1), 10);
                        const servicingQuantity = parseInt(objectPath.get(newSelectedCategory, 'pricing.servicingQuantity', 1), 10);

                        if (unitPrice === -1) {
                            console.warn('Unit price for selected quantity is not available. Setting to default');
                        }

                        // Fetch all the available styles and check if the currently selected style code is present in available styles.
                        // If not present then select first style by default
                        const availableStyles = objectPath.get(newSelectedCategory, 'details.styleGroups.0.styles', []);
                        let selectedFont = availableStyles.filter(eachStyle => eachStyle.styleCode === variant.styleCode);

                        // if selectedFont is a empty array that means that currently selected stylecode is not available
                        if (selectedFont.length === 0) {
                            // setting availableStyles to selectedFont
                            selectedFont = availableStyles;
                        }

                        // Always fetching 1st font style code and updating variant.
                        return {
                            ...state,
                            configurator: {
                                ...state.configurator,
                                selectedCategory: newSelectedCategory
                            },
                            variant: {
                                ...state.variant,
                                servicingQuantity,
                                styleCode: selectedFont[0].styleCode,
                                unitPrice
                            }
                        };
                    }
                    return state;
                }
                case SCREEN_IDENTIFIERS.SYMBOLS: {
                    const [newSelectedCategory] = screenConfig.categories.filter(eachCategory => parseInt(eachCategory.serviceTypeId, 10) === parseInt(variant.itemServiceTypeId, 10));
                    const availableGrops = objectPath.get(newSelectedCategory, 'details.styleGroups', []);
                    const [newGroup] = availableGrops.filter(group => parseInt(group.groupId, 10) === parseInt(variant.groupId, 10));
                    const unitPrice = parseInt(objectPath.get(newSelectedCategory, 'pricing.unitPrice', -1), 10);
                    const servicingQuantity = parseInt(objectPath.get(newSelectedCategory, 'pricing.servicingQuantity', 1), 10);

                    if (unitPrice === -1) {
                        console.warn('Unit price for selected quantity is not available. Setting to default');
                    }

                    return {
                        ...state,
                        configurator: {
                            ...state.configurator,
                            selectedCategory: newGroup
                        },
                        variant: {
                            ...state.variant,
                            servicingQuantity,
                            unitPrice
                        }
                    };
                }
                // No case for Custom engraving as there will not be any fonts needed
                default:
                    return state;
            }
        }
        case EC.SET_URL_FRAGMENT: {
            switch (state.screenConfig.component) {
                case SCREEN_IDENTIFIERS.INITIALS: {
                    const imageURL = objectPath.get(state, 'configurator.selectedCategory.details.styleGroups.0.groupStyleImageUrl', '');
                    const imageName = objectPath.get(state, 'configurator.selectedCategory.details.styleGroups.0.groupStyleImageName', '');
                    const preset = objectPath.get(state, 'configurator.selectedCategory.details.styleGroups.0.groupStyleImagePreset', '');
                    const [baseUrl, preStyleCode, preItemService, preInitialsOne, preInitialsTwo, preInitialsThree, beforePreset, rest] = [imageURL.split('<imageName>')[0], ...[imageURL.split('<imageName>')[1].split('<styleCode>')[0], ...[imageURL.split('<styleCode>')[1].split('<itemServiceTypeId>')[0], ...[imageURL.split('<itemServiceTypeId>')[1].split('<initial1>')[0], ...[imageURL.split('<initial1>')[1].split('<initial2>')[0], ...[imageURL.split('<initial2>')[1].split('<initial3>')[0], ...[imageURL.split('<initial3>')[1].split('<preset>')[0], imageURL.split('<preset>')[1]]]]]]]];
                    const urlFragment = {
                        preStyleCode: `${replaceHttp(baseUrl)}${imageName}${preStyleCode}`,
                        preItemService,
                        preInitialsOne,
                        preInitialsTwo,
                        preInitialsThree,
                        beforePreset,
                        rest,
                        preset
                    };

                    return {
                        ...state,
                        configurator: {
                            ...state.configurator,
                            urlFragment
                        }
                    };
                }
                case SCREEN_IDENTIFIERS.SYMBOLS: {
                    const { configurator, variant } = state;
                    const { selectedCategory, defaultPreview, hasSymbolObject } = configurator;
                    let [selectedFont] = selectedCategory.styles.filter(style => parseInt(style.styleCode, 10) === parseInt(variant.styleCode, 10));

                    if (!selectedFont) {
                        [selectedFont] = selectedCategory.styles;
                    }
                    const { styleCode } = selectedFont;
                    const urlFragment = {
                        previewUrl: replaceHttp(hasSymbolObject ? selectedCategory.groupStyleSymbolImageUrl : selectedCategory.groupStyleImageUrl),
                        imageName: defaultPreview.servicingImageName,
                        styleName: selectedFont.styleNameLowerCase,
                        preset: defaultPreview.preset,
                        presetMobile: defaultPreview.presetMobile,
                        fontUrl: replaceHttp(selectedCategory.groupStyleImageUrl)
                    };

                    return {
                        ...state,
                        configurator: {
                            ...state.configurator,
                            urlFragment: {
                                ...state.configurator.urlFragment,
                                ...urlFragment
                            }
                        },
                        variant: {
                            ...state.variant,
                            styleCode
                        }
                    };
                }
                default:
                    return state;
            }
        }
        case EC.UPDATE_FONT_STYLES:
            switch (state.screenConfig.component) {
                case SCREEN_IDENTIFIERS.INITIALS: {
                    const { variant, configurator } = state;
                    const styles = objectPath.get(configurator.selectedCategory, 'details.styleGroups.0.styles', []);
                    const {
                        preStyleCode,
                        preItemService,
                        preInitialsOne,
                        preInitialsTwo,
                        preInitialsThree,
                        beforePreset,
                        rest,
                        preset
                    } = configurator.urlFragment;

                    variant.initialOne = variant.initialOne || '';
                    variant.initialTwo = variant.initialTwo || '';
                    variant.initialThree = variant.initialThree || '';
                    const availableStyles = orderBy(styles, 'styleDisplayOrder', 'asc').map((eachStyle) => {
                        const baseUrl = `${preStyleCode}${eachStyle.styleCode}${preItemService}${variant.itemServiceTypeId}`;
                        let { initialOne, initialTwo, initialThree } = DEAULT_PLACEHOLDERS;

                        if (!(variant.initialOne === '' && variant.initialTwo === '' && variant.initialThree === '')) {
                            [initialOne = '', initialTwo = '', initialThree = ''] = [variant.initialOne, variant.initialTwo, variant.initialThree];
                        }

                        if (!eachStyle.isTrueType) {
                            initialOne = initialOne.toUpperCase();
                            initialTwo = initialTwo.toUpperCase();
                            initialThree = initialThree.toUpperCase();
                        }

                        const formaterInputs = inputUpdater(initialOne, initialTwo, variant.itemServiceTypeId, eachStyle.styleCode);

                        /* eslint-disable */
                        initialOne = formaterInputs.initialOne;
                        initialTwo = formaterInputs.initialTwo;
                        const initialsUrl = `${decodeURIComponent(preInitialsOne)}${encodeURIComponent(initialOne)}${preInitialsTwo}${encodeURIComponent(initialTwo)}${preInitialsThree}${encodeURIComponent(initialThree)}${beforePreset}${preset}${rest}`;

                        return {
                            ...eachStyle,
                            defaultSrc: `${replaceHttp(decodeURIComponent(baseUrl))}${initialsUrl}`,
                            altText: eachStyle.styleDescription,
                            isLazyLoad: false
                        };
                    });

                    let selectedFontStyle = availableStyles.filter(eachStyle => parseInt(eachStyle.styleCode, 10) === parseInt(variant.styleCode, 10));

                    if (selectedFontStyle.length === 0) {
                        selectedFontStyle = availableStyles;
                    }

                    if (!selectedFontStyle[0].isTrueType) {
                        variant.initialOne = variant.initialOne ? variant.initialOne.toUpperCase() : '';
                        variant.initialTwo = variant.initialTwo ? variant.initialTwo.toUpperCase() : '';
                        variant.initialThree = variant.initialThree ? variant.initialThree.toUpperCase() : '';
                    }

                    return {
                        ...state,
                        configurator: {
                            ...state.configurator,
                            availableStyles
                        },
                        variant: {
                            ...variant,
                            isTrueType: selectedFontStyle[0].isTrueType
                        }
                    };
                }
                case SCREEN_IDENTIFIERS.SYMBOLS: {
                    const { variant } = state;
                    const { urlFragment, selectedCategory } = state.configurator;
                    const selectionObj = {
                        ...urlFragment,
                        itemServiceTypeId: objectPath.get(state, 'screenConfig.categories.0.serviceTypeId', 11)
                    };

                    // Replacing font URL so that this will not effect options available on symbols
                    selectionObj.previewUrl = selectionObj.fontUrl;
                    const availableStyles = orderBy(selectedCategory.styles, 'styleDisplayOrder', 'asc').map((eachStyle) => {
                        return {
                            ...eachStyle,
                            defaultSrc: constructUrl({
                                ...selectionObj,
                                styleName: eachStyle.styleNameLowerCase,
                                imageName: selectedCategory.groupStyleImageName
                            }),
                            altText: eachStyle.styleDescription,
                            isLazyLoad: false
                        };
                    });
                    let selectedFontStyle = availableStyles.filter(eachStyle => parseInt(eachStyle.styleCode, 10) === parseInt(variant.styleCode, 10));

                    if (selectedFontStyle.length === 0) {
                        selectedFontStyle = availableStyles;
                    }

                    return {
                        ...state,
                        configurator: {
                            ...state.configurator,
                            availableStyles
                        },
                        variant: {
                            ...state.variant,
                            isTrueType: selectedFontStyle[0].isTrueType
                        }
                    };
                }
                // No case for Custom engraving as there will not be any fonts needed
                default:
                    return state;
            }
        case EC.UPDATE_SELECTED_ENGRAVING:
            return {
                ...state,
                ...action.payload
            };
        case EC.UPDATE_URL_CONFIG:
            switch (state.screenConfig.component) {
                case SCREEN_IDENTIFIERS.INITIALS: {
                    const { variant, configurator } = state;
                    const { defaultPreview } = configurator;
                    let selectionObj = {
                        ...variant,
                        imageName: defaultPreview.servicingImageName,
                        preset: defaultPreview.preset,
                        presetMobile: defaultPreview.presetMobile,
                        previewUrl: replaceHttp(defaultPreview.previewImageUrl)
                    };
                    let { initialOne, initialTwo, initialThree } = variant;

                    if (!variant.isTrueType) {
                        initialOne = initialOne.toUpperCase();
                        initialTwo = initialTwo.toUpperCase();
                        initialThree = initialThree.toUpperCase();
                    }

                    selectionObj = {
                        ...selectionObj,
                        initialOne,
                        initialTwo,
                        initialThree
                    };

                    // Setting preview to placeholders if all values in inputs are cleared
                    if (selectionObj.initialOne === '' && selectionObj.initialTwo === '' && selectionObj.initialThree === '') {
                        selectionObj = {
                            ...selectionObj,
                            ...DEAULT_PLACEHOLDERS
                        };
                    }

                    selectionObj = {
                        ...selectionObj,
                        ...inputUpdater(selectionObj.initialOne, selectionObj.initialTwo, variant.itemServiceTypeId, variant.styleCode)
                    }

                    const previewEngraved = {
                        defaultSrc: constructUrl(selectionObj),
                        altText: 'the preview of the engraving'
                    };

                    return {
                        ...state,
                        configurator: {
                            ...state.configurator,
                            previewEngraved: {
                                ...state.configurator.previewEngraved,
                                ...previewEngraved
                            }
                        }
                    };
                }
                case SCREEN_IDENTIFIERS.SYMBOLS: {
                    const { variant, configurator } = state;
                    const { selectedCategory, urlFragment } = configurator;
                    let [selectedFont] = selectedCategory.styles.filter(style => parseInt(style.styleCode, 10) === parseInt(variant.styleCode, 10));

                    if (!selectedFont) {
                        [selectedFont] = selectedCategory.styles;
                    }
                    const { styleCode } = selectedFont;
                    const selectionObj = {
                        ...variant,
                        ...urlFragment,
                        styleName: selectedFont.styleNameLowerCase || ''
                    };
                    const previewEngraved = {
                        defaultSrc: constructUrl(selectionObj),
                        altText: 'the preview of the engraving'
                    };

                    return {
                        ...state,
                        configurator: {
                            ...state.configurator,
                            previewEngraved: {
                                ...state.configurator.previewEngraved,
                                ...previewEngraved
                            }
                        },
                        variant: {
                            ...state.variant,
                            styleCode
                        }
                    };
                }
                case SCREEN_IDENTIFIERS.CUSTOM: {
                    const { screenConfig, variant } = state;

                    if (variant.customEngravingIndex === -1) {
                        console.warn('No index found to show preview');
                        return state;
                    }

                    if (screenConfig.options.length < variant.customEngravingIndex) {
                        console.warn('Options out of bond. You are trying to select preview which doesnt exits');
                        return state;
                    }

                    const previewEngraved = objectPath.get(screenConfig, `options.${variant.customEngravingIndex}.preview`, defaultUrlConfig);

                    return {
                        ...state,
                        configurator: {
                            ...state.configurator,
                            previewEngraved: {
                                ...state.configurator.previewEngraved,
                                ...previewEngraved
                            }
                        }
                    };
                }
                default:
                    return state;
            }
        case EC.SITE_ENGRAVINGS_FAILED:
            console.warn('AEM siteEngravings Config error. \nPayload sent for siteEngravings:');
            console.warn(action.payload);
            return state;
        case EC.PRODUCT_AVAILABLE_ENGRAVING_FAILED:
            console.warn('AEM eligibleEngravings Config error. \nPayload sent for eligibleEngravings:');
            console.warn(action.payload);
            return state;
        default:
            return state;
    }
}
