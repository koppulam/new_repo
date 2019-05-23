import matchMedia from 'lib/dom/match-media';
import * as objectPath from 'object-path';
const SYMBOLS_IDENTIFIER = 'SYMBOLS_COMPONENT';
const MONOGRAM_SERVICE_ID = 150;
const FONT_CONFIG = objectPath.get(window, 'tiffany.authoredContent.engraving.fontsConfig', {});

/**
 * Utility for common functionalities across engraving feature
 */
/**
 * @description Method to check if user inputs are valid
 * @param {Boolean} editingEngraving boolean to check if engraving is triggered for editing a already engraved charm/product
 * @param {String} initialsOne 1st characer in initials provided by user
 * @param {String} initialsTwo 2nd characer in initials provided by user
 * @param {String} initialsThree 3rd characer in initials provided by user
 * @param {String} itemServiceTypeId item service ID for edited engraving provided by user
 * @param {String} styleCode style code for edited engraving provided by user
 * @param {String} groupId selected category code for edited engraving provided by user
 * @returns {void}
 */
export const providedInputsAreValid = (editingEngraving = false, initialsOne = '', initialsTwo = '', initialsThree = '', itemServiceTypeId = '', styleCode = '', groupId = '') => {
    let isValid = true;
    const SYMBOL_CONFIG = objectPath.get(window, 'tiffany.authoredContent.engravingMap', [])
        .filter(category => {
            if (category.component === SYMBOLS_IDENTIFIER) {
                return category;
            }
        })[0];
    const IS_SYMBOL_ENGRAVING = isNaN(parseInt(itemServiceTypeId, 10)) ? false : (parseInt(itemServiceTypeId, 10) === objectPath(SYMBOL_CONFIG, 'categories.0.serviceTypeId', 11));

    if (editingEngraving) {
        if (initialsOne && initialsTwo && initialsThree && itemServiceTypeId && styleCode) {
            if (isNaN(itemServiceTypeId) || isNaN(styleCode)) {
                if (IS_SYMBOL_ENGRAVING) {
                    if (groupId) {
                        console.warn('Group ID is not provided for symbol engraving');
                        isValid = false;
                    }
                    if (isNaN(groupId)) {
                        console.warn('Group ID has to be a proper number');
                        isValid = false;
                    }
                } else {
                    console.warn('itemServiceTypeId or styleCode or groupId is not a proper input');
                    isValid = false;
                }
            }
        } else {
            console.warn('User provided inputs are not valid');
            isValid = false;
        }

        return isValid;
    }

    return isValid;
};

/**
 * @description THis method is used to create the reference key that we use in engraving reducer
 * @param {String} groupSku group sku of profduct
 * @param {String} sku sku of product
 * @returns {String} key formed out of groupsku and sku
 */
export const createReferenceKey = (groupSku, sku) => {
    let key = '';

    if (!groupSku) {
        key = sku;
    } else {
        key = `${groupSku}-${sku}`;
    }

    return key;
};

/**
 * @description Costruct URL based on inputs
 * @param {Object} options site Engravings
 * @returns {void}
 */
export const constructUrl = (options) => {
    const isMobile = window.matchMedia(matchMedia.BREAKPOINTS.MOBILE).matches;
    const preset = !isMobile ? options.preset : options.presetMobile;
    const mapObj = {
        '<imageName>': options.imageName,
        '<styleCode>': options.styleCode,
        '<StyleName>': options.styleName,
        '<itemServiceTypeId>': options.itemServiceTypeId,
        '<initial1>': encodeURIComponent(options.initialOne),
        '<initial2>': encodeURIComponent(options.initialTwo),
        '<initial3>': encodeURIComponent(options.initialThree),
        '<preset>': preset
    };
    const placeholderString = /<imageName>|<styleCode>|<StyleName>|<itemServiceTypeId>|<initial1>|<initial2>|<initial3>|<preset>/gi;
    let previewUrl = '';

    options.previewUrl = options.previewUrl || '';
    previewUrl = options.previewUrl.replace(placeholderString, (matched) => {
        return mapObj[matched];
    });

    return previewUrl;
};

/**
 * @description validates and give proper input value
 * @param {String} inputText text to check for
 * @param {Number} serviceType servicetype id selected
 * @param {Boolean} trueType if style code has true type
 * @returns {String} validated value
 */
export const validateInput = (inputText, serviceType, trueType = false) => {
    if (!inputText) {
        return '';
    }

    let charToAllow;

    if (parseInt(serviceType, 10) === MONOGRAM_SERVICE_ID) {
        charToAllow = new RegExp(/^[a-zA-Z]+$/g);
    } else if (trueType) {
        charToAllow = new RegExp(/^[a-zA-Z0-9!.@#$%&*(")_+|:<,>?='-]+$/g);
    } else {
        charToAllow = new RegExp(/^[a-zA-Z0-9]+$/g);
    }

    return inputText.match(charToAllow) ? inputText : '';
}

/**
 * @description Sets initial variant for engraving
 * @param {Object} defaultVariant Default Value for Variant
 * @param {Object} providedVariant variant provided by user
 * @returns {Object} variant to be used initially
 */
export const setUpVariant = (defaultVariant, providedVariant) => {
    return {
        ...defaultVariant,
        ...providedVariant,
        initialOne: validateInput(providedVariant.initialOne, providedVariant.itemServiceTypeId, providedVariant.isTrueType),
        initialTwo: validateInput(providedVariant.initialTwo, providedVariant.itemServiceTypeId, providedVariant.isTrueType),
        initialThree: validateInput(providedVariant.initialThree, providedVariant.itemServiceTypeId, providedVariant.isTrueType),
        itemServiceTypeId: parseInt(providedVariant.itemServiceTypeId, 10),
        styleCode: parseInt(providedVariant.styleCode, 10),
        groupId: parseInt(providedVariant.groupId, 10)
    }
}

/**
 * @description updating initial1 and initial2 based on font config
 * @param {String} initialOne initial 1 in variant
 * @param {String} initialTwo initial 2 in variant
 * @param {Number} type type of engraving selected
 * @param {Number} fontCode font style selected
 * @returns {Object} initials one and inintils 2
 */
export const inputUpdater = (initialOne, initialTwo, type, fontCode) => {
    if (type !== FONT_CONFIG.exceptionFor) {
        const selectedFont = FONT_CONFIG.styles.filter(style => style.code === fontCode)[0];

        if (selectedFont) {
            initialOne = initialOne ? `${initialOne}${decodeURIComponent(selectedFont.delimiter)}` : '';
            initialTwo = initialTwo ? `${initialTwo}${decodeURIComponent(selectedFont.delimiter)}` : '';
        }
    }

    return {
        initialOne,
        initialTwo
    };
}
