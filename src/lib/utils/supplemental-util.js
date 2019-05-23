import * as objectPath from 'object-path';

/**
 * @description getClassificationData method forms and object structure with config and response.
 * @param {object} response API response of productsupplementalinfossystemapi.
 * @param {object} config author configired data.
 * @returns {void}
 */
const getClassificationData = (response, config) => {
    const data = objectPath.get(response, 'productSuppInfo', {});

    return [
        {
            key: config.productType,
            value: `${data.productCode}-${data.productName}`
        },
        {
            key: config.family,
            value: `${data.primaryConsumerFamilyCode}-${data.primaryConsumerFamilyDesc}`
        },
        {
            key: config.businessPillar,
            value: `${data.primaryConsumerFamilySelectionCode}-${data.primaryConsumerFamilySelectionDesc}`
        },
        {
            key: config.pattern,
            value: `${data.patternCode}-${data.patternName}`
        },
        {
            key: config.department,
            value: `${data.departmentCode}-${data.departmentDesc}`
        },
        {
            key: config.class,
            value: `${data.classCode}-${data.classDesc}`
        },
        {
            key: config.style,
            value: `${data.styleCode}-${data.styleDesc}`
        },
        {
            key: config.color,
            value: `${data.colorCode}-${data.colorDesc}`
        },
        {
            key: config.countryOfOrigin,
            value: `${data.countryofOriginCode}-${data.countryofOriginName}`
        },
        {
            key: config.primaryVendor,
            value: data.primaryVendorCode
        },
        {
            key: config.cites,
            value: data.cites
        },
        {
            key: config.discountableFlag,
            value: data.discountableFlag
        }
    ];
};

export default getClassificationData;
