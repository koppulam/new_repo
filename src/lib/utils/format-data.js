'use strict';

import PRODUCT_CONSTANTS from 'constants/ProductConstants';
import * as objectPath from 'object-path';
import sortBy from 'lodash/sortBy';
import find from 'lodash/find';
import arrangeItems from 'lib/utils/ie-grid-pollyfill';

/**
 * @description Will append the correct protocol
 * @param {string} url The URl string
 * @returns {string} the formatted URL
 */
export function getUrlWithProtocol(url) {
    let u = url;

    if (u.indexOf('http:') !== -1) {
        // is http protocol
        u = u.replace('http:', window.location.protocol);
    } else if (u.indexOf('https:') !== -1) {
        // is https protocol
        u = u.replace('https:', window.location.protocol);
    } else {
        // no protocol
        u = window.location.protocol + u;
    }
    return u;
}

/**
 * @description Formats the URL for product object
 * @param {Object} imageData image data needed to construct image url.
 * @param {boolean} isLarge return largeImage for ByoPreview.
 * @param {boolean} presetOverride flag to ovveride preset
 * @returns {string} Returns a URL constructed with filename.
 * @todo Make changes to this once we have the correct props needed
 */
export function getImageURL(imageData, isLarge, presetOverride) {
    let url;
    const imageFormatURL = objectPath.get(window, 'tiffany.apiUrl.browseGridProductImageUrl', 'http://media.tiffany.com/is/image/Tiffany/EcomBrowseM/reader-tote-<ImageName>.jpg');

    if (imageData && imageData.imageUrl) {
        url = imageData.imageUrl;
    } else {
        url = imageFormatURL;
    }
    url = getUrlWithProtocol(url);
    url = isLarge ? url.replace('<Preset>', objectPath.get(window, 'tiffany.authoredContent.byoConfig.byoImagePreset', 'ByoPreview')) :
        url.replace('<Preset>', presetOverride ? objectPath.get(window, 'tiffany.authoredContent.marketingImagePreset', 'EcomBrowseL') : objectPath.get(window, 'tiffany.authoredContent.imagePreset', 'EcomBrowseM'));
    url = url.replace('<ImagePrefix>', imageData.imagePrefix);
    url = url.replace('<ImageName>', imageData.imageName);
    url = url.replace('&op_usm=<MediaPreset>', ''); // use getMediaPresets later
    url = url.replace('&$cropN=<MediaCrop>', ''); // use crop later

    return url;
}

/**
 * @description Formats the URL for product object
 * @param {string} url image replacable URL
 * @param {string} preset image preset
 * @param {string} imagePrefix image imagePrefix
 * @param {string} mediaTypeID image mediaTypeID
 * @param {array} mediaObjects image data needed to construct image url.
 * @param {string} queryParam image query param for transparent images
 * @returns {string} Returns a URL constructed with filename.
 * @todo Make changes to this once we have the correct props needed
 */
export function getFixtureImageURL(url, preset, imagePrefix, mediaTypeID, mediaObjects, queryParam) {
    let imageUrl = url;
    let mediaObject = {};

    if (mediaTypeID instanceof Array) {
        [mediaObject] = mediaObjects.filter(mediaObj => {
            return mediaTypeID.indexOf(String(mediaObj.mediaTypeID)) !== -1;
        });
    } else {
        [mediaObject] = mediaObjects.filter(mediaObj => {
            return String(mediaObj.mediaTypeID) === String(mediaTypeID);
        });
    }


    imageUrl = getUrlWithProtocol(imageUrl);
    imageUrl = imageUrl.replace('<Preset>', preset);
    imageUrl = imageUrl.replace('<ImagePrefix>', imagePrefix);
    imageUrl = imageUrl.replace('<ImageName>', objectPath.get(mediaObject, 'mediaFileName', ''));
    imageUrl = imageUrl.replace('op_usm=<MediaPreset>', ''); // use getMediaPresets later
    imageUrl = imageUrl.replace('&$cropN=<MediaCrop>', ''); // use crop later
    imageUrl += queryParam;
    // imageUrl = imageUrl.replace('/Tiffany/', '/TiffanyDev/');
    return imageUrl;
}

/**
 * @description Formats the URL for product object
 * @param {string} imagePrefix image imagePrefix
 * @param {string} url imageUrl replacable URL
 * @param {string} preset image preset
 * @param {string} queryParam image query param for transparent images
 * @returns {string} Returns a URL constructed with filename.
 * @todo Make changes to this once we have the correct props needed
 */
export function getBYOCanvasFixtureImageURL(imagePrefix, url, preset, queryParam) {
    let imageUrl = url;

    imageUrl = getUrlWithProtocol(imageUrl);
    imageUrl = imageUrl.replace('<Preset>', preset);
    imageUrl = imageUrl.replace('<ImagePrefix>', imagePrefix);
    imageUrl = imageUrl.replace('op_usm=<MediaPreset>', ''); // use getMediaPresets later
    imageUrl = imageUrl.replace('&$cropN=<MediaCrop>', ''); // use crop later
    imageUrl += queryParam;
    // imageUrl = imageUrl.replace('/Tiffany/', '/TiffanyDev/');
    return imageUrl;
}

/**
 * @description Formats the URL for product object
 * @param {Object} itemMedia image data needed to construct image url.
 * @returns {string} Returns a URL constructed with filename.
 * @todo Make changes to this once we have the correct props needed
 */
export function getFlyoutImageUrl(itemMedia) {
    let url = itemMedia.imageUrlFormat ? itemMedia.imageUrlFormat : 'http://media.tiffany.com/is/image/Tiffany/<Preset>/<ImagePrefix>-<ImageName>.jpg?&op_usm=<MediaPreset>&defaultImage=NoImageAvailableInternal&&';

    url = getUrlWithProtocol(url);
    url = url.replace('<Preset>', objectPath.get(window, 'tiffany.authoredContent.shoppingBagFlyoutConfig.imagePreset', 'EcomInlineM'));
    url = url.replace('<ImagePrefix>', itemMedia.imagePrefix);
    url = url.replace('&$cropN=<MediaCrop>', ''); // use crop later

    if (itemMedia.mediaPreset) {
        const preset = `${itemMedia.mediaPreset[0].unSharpMaskAmount},${itemMedia.mediaPreset[0].unSharpMaskRadius},${itemMedia.mediaPreset[0].unSharpMaskThreshold}`;

        url = url.replace('<MediaPreset>', preset);
    } else {
        url = url.replace('&op_usm=<MediaPreset>', '');
    }


    let imageNameObj = find(itemMedia.itemMedia, (item) => {
        if (item.mediaTypeID === 1092 && item.displayOrder === 1) {
            return item;
        }

        return false;
    });

    if (!imageNameObj) {
        imageNameObj = find(itemMedia.itemMedia, (item) => {
            if (item.mediaTypeID === 1093 && item.displayOrder === 1) {
                return item;
            }

            return false;
        });
    }

    if (!imageNameObj) {
        imageNameObj = find(itemMedia.itemMedia, (item) => {
            if (item.mediaTypeID === 1098 && item.displayOrder === 1) {
                return item;
            }

            return false;
        });
    }

    if (!imageNameObj) {
        url = url.replace('<ImageName>', '');
    } else {
        url = url.replace('<ImageName>', imageNameObj.mediaFileName);
    }

    return url;
}

/**
 * @description Formats the URL for product object
 * @param {Object} imageData image data needed to construct image url.
 * @param {boolean} isLarge isLarge isLarge
 * @returns {string} Returns a URL constructed with filename.
 * @todo Make changes to this once we have the correct props needed
 */
export function getBYOImageURL(imageData, isLarge) {
    let imageUrlFormat = objectPath.get(imageData, 'itemMedia.imageUrlFormat', '');
    const mediaTypeID = objectPath.get(window, 'tiffany.authoredContent.mediaTypeIdOrder', ['1092', '1093', '1098']);
    const mediaObjects = objectPath.get(imageData, 'itemMedia.itemMedia', []);
    let mediaObject = {};

    if (mediaTypeID instanceof Array) {
        [mediaObject] = mediaObjects.filter(mediaObj => {
            return mediaTypeID.indexOf(String(mediaObj.mediaTypeID)) !== -1;
        });
    } else {
        [mediaObject] = mediaObjects.filter(mediaObj => {
            return String(mediaObj.mediaTypeID) === String(mediaTypeID);
        });
    }

    imageUrlFormat = getUrlWithProtocol(imageUrlFormat);
    imageUrlFormat = isLarge ? imageUrlFormat.replace('<Preset>', objectPath.get(window, 'itemMedia.charmImagePreset', '2X'))
        : imageUrlFormat.replace('<Preset>', 'EcomBrowseM' || objectPath.get(imageData, 'itemMedia.imagePreset', 'EcomBrowseM'));
    imageUrlFormat = imageUrlFormat.replace('<ImagePrefix>', objectPath.get(imageData, 'itemMedia.imagePrefix', 'tiffanyandco'));
    imageUrlFormat = imageUrlFormat.replace('<ImageName>', objectPath.get(mediaObject, 'mediaFileName', objectPath.get(imageData, 'itemMedia.itemMedia.0.mediaFileName', '')));
    imageUrlFormat = imageUrlFormat.replace('&op_usm=<MediaPreset>', ''); // use getMediaPresets later
    imageUrlFormat = imageUrlFormat.replace('&$cropN=<MediaCrop>', ''); // use crop later

    return imageUrlFormat;
}

/**
 * @description Formats the URL for product object
 * @param {Object} imageData image data needed to construct image url.
 * @param {boolean} isLarge isLarge isLarge
 * @returns {string} Returns a URL constructed with filename.
 * @todo Make changes to this once we have the correct props needed
 */
export function getBYOCharmImageURL(imageData, isLarge) {
    let imageUrlFormat = objectPath.get(window, 'tiffany.authoredContent.byoConfig.byoImageData.charm.url', '');
    const mediaTypeID = objectPath.get(window, 'tiffany.authoredContent.mediaTypeIdOrder', ['1092', '1093', '1098']);
    const mediaObjects = objectPath.get(imageData, 'itemMedia.itemMedia', []);
    let mediaObject = {};

    if (mediaTypeID instanceof Array) {
        [mediaObject] = mediaObjects.filter(mediaObj => {
            return mediaTypeID.indexOf(String(mediaObj.mediaTypeID)) !== -1;
        });
    } else {
        [mediaObject] = mediaObjects.filter(mediaObj => {
            return String(mediaObj.mediaTypeID) === String(mediaTypeID);
        });
    }

    imageUrlFormat = getUrlWithProtocol(imageUrlFormat);
    imageUrlFormat = isLarge ? imageUrlFormat.replace('<Preset>', objectPath.get(window, 'tiffany.authoredContent.byoConfig.byoImagePreset', 'ByoPreview'))
        : imageUrlFormat.replace('<Preset>', 'EcomBrowseM' || objectPath.get(imageData, 'itemMedia.imagePreset', 'EcomBrowseM'));
    imageUrlFormat = imageUrlFormat.replace('<ImagePrefix>-', '');
    imageUrlFormat = imageUrlFormat.replace('<ImageName>', objectPath.get(mediaObject, 'mediaFileName', objectPath.get(imageData, 'itemMedia.itemMedia.0.mediaFileName', '')));
    imageUrlFormat = imageUrlFormat.replace('op_usm=<MediaPreset>', ''); // use getMediaPresets later
    imageUrlFormat = imageUrlFormat.replace('&$cropN=<MediaCrop>', ''); // use crop later

    return imageUrlFormat;
}

/**
 * @description Formats the URL for product object
 * @param {Object} imageData image data needed to construct image url.
 * @param {boolean} isLarge isLarge isLarge
 * @returns {string} Returns a URL constructed with filename.
 * @todo Make changes to this once we have the correct props needed
 */
export function getBYOCanvasImageURL(imageData, isLarge) {
    let imageUrlFormat = objectPath.get(window, 'tiffany.authoredContent.byoConfig.byoImageData.url', '');

    imageUrlFormat = getUrlWithProtocol(imageUrlFormat);
    imageUrlFormat = isLarge ? imageUrlFormat.replace('<Preset>', objectPath.get(window, 'itemMedia.charmImagePreset', '2X'))
        : imageUrlFormat.replace('<Preset>', 'EcomBrowseM' || objectPath.get(window, 'itemMedia.imagePreset', 'EcomBrowseM'));
    imageUrlFormat = imageUrlFormat.replace('<ImagePrefix>', objectPath.get(imageData, 'imgURL', ''));
    imageUrlFormat = imageUrlFormat.replace('op_usm=<MediaPreset>', ''); // use getMediaPresets later
    imageUrlFormat = imageUrlFormat.replace('&$cropN=<MediaCrop>', ''); // use crop later

    return imageUrlFormat;
}

/**
 * @description getMediaTypeName returns the object based on key.
 * @param {Object} itemMedia service response
 * @param {string} type type Check for mediaTypeName
 * @returns {Object} Retruns an object based on type.
 */
export function getMediaTypeName(itemMedia, type) {
    return itemMedia.find(element => {
        return (element.mediaTypeName.toUpperCase() === type);
    });
}

/**
 * @description getMediaPresets returns string based on key.
 * @param {Object} mediaPreset service response
 * @returns {String} Returns an object based on type.
 */
export function getMediaPresets(mediaPreset) {
    return mediaPreset.unSharpMaskAmount + ',' + mediaPreset.unSharpMaskRadius + ',' + mediaPreset.unSharpMaskThreshold;
}

/**
 * @description Get the MediaFileName based on MediaTypeName skuStraightOn if not skuAlternateView.
 * @param {Object} imageMedia itemMedia of SKU data returned from service.
 * @returns {Object} Returns mediaFileName from the service.
 */
export function getMediaFileName(imageMedia) {
    const itemMedia = objectPath.get(imageMedia, 'itemMedia', []);
    let fileName = '';
    const mediaConst = PRODUCT_CONSTANTS.MEDIA;
    const straightOnItem = getMediaTypeName(itemMedia, mediaConst.STRAIGHT_ON);
    const alternateViewItem = getMediaTypeName(itemMedia, mediaConst.ALTERNATE_VIEW);

    if (straightOnItem) {
        fileName = straightOnItem.mediaFileName;
    } else {
        fileName = alternateViewItem.mediaFileName;
    }

    return fileName;
}

/**
 * @description Transform a sku response object into valid product tile data
 * @param {Object} skuData SKU data returned from service
 * @returns {Object} Retruns a transformed product object from input
 * @todo Make changes to this once we have the correct props needed
 */
export function getProductFromSKU(skuData) {
    if (objectPath.get(skuData, 'itemMedia.itemMedia', []).length > 0) {
        const imageData = {
            imageUrl: objectPath.get(skuData, 'itemMedia.imageUrlFormat', false),
            imagePreset: objectPath.get(skuData, 'itemMedia.imagePreset', false),
            imagePrefix: objectPath.get(skuData, 'itemMedia.imagePrefix', false),
            imageName: getMediaFileName(objectPath.get(skuData, 'itemMedia', [])),
            imagePresets: getMediaPresets(objectPath.get(skuData, 'itemMedia.mediaPreset.0', []))
        };
        const itemExperience = objectPath.get(skuData, 'itemExperiences', {});
        const product = {
            name: objectPath.get(skuData, 'item.title', ''),
            price: objectPath.get(skuData, 'itemRuleResult.showPrice', true) ? objectPath.get(skuData, 'itemPrice.price', '') : '',
            isNew: objectPath.get(skuData, 'item.isNew', false),
            image: getImageURL(imageData, false, skuData.presetOverride),
            url: objectPath.get(skuData, 'item.friendlyURL', '#'),
            sku: objectPath.get(skuData, 'item.sku', ''),
            isGroup: objectPath.get(skuData, 'item.isGroup', false),
            isPurchasable: objectPath.get(skuData, 'item.isPurchasable'),
            isLowInventory: objectPath.get(skuData, 'item.isLowInventory'),
            isIRExperience: objectPath.get(itemExperience, 'isIRExperience', false),
            isGroup: objectPath.get(skuData, 'isGroup', false)
        };

        return product;
    }
    return false;
}

/**
 * @description Transform a group returned in sku response object into valid product tile data
 * @param {Object} groupData GROUP data returned from service
 * @returns {Object} Retruns a transformed product object from input
 * @todo Make changes to this once we have the correct props needed
 */
export function getProductFromGROUP(groupData) {
    if (objectPath.get(groupData, 'itemMedia.itemMedia', []).length > 0) {
        const imageData = {
            imageUrl: objectPath.get(groupData, 'itemMedia.imageUrlFormat', false),
            imagePreset: objectPath.get(groupData, 'itemMedia.imagePreset', false),
            imagePrefix: objectPath.get(groupData, 'itemMedia.imagePrefix', false),
            imageName: getMediaFileName(objectPath.get(groupData, 'itemMedia', [])),
            imagePresets: getMediaPresets(objectPath.get(groupData, 'itemMedia.mediaPreset.0', []))
        };
        const itemExperiences = objectPath.get(groupData, 'itemExperiences', {});
        const product = {
            name: objectPath.get(groupData, 'group.group.title', ''),
            price: objectPath.get(groupData, 'itemRuleResult.showPrice', true) ? objectPath.get(groupData, 'group.group.price', ''): '',
            isNew: objectPath.get(groupData, 'group.group.isNew', false),
            image: getImageURL(imageData),
            url: objectPath.get(groupData, 'group.friendlyURL', '#'),
            sku: objectPath.get(groupData, 'group.group.sku', ''),
            selectedSku: objectPath.get(groupData, 'group.group.selectedSku', false),
            isPurchasable: objectPath.get(groupData, 'group.group.isPurchasable'),
            isLowInventory: objectPath.get(groupData, 'group.group.isLowInventory'),
            isIRExperience: objectPath.get(itemExperiences, 'isIRExperience', false),
            isGroup: objectPath.get(groupData, 'isGroup', false)
        };

        return product;
    }
    return false;
}

/**
 * @description Transform a category response object into valid product tile data
 * @param {Object} searchData Category data returned from service
 * @returns {Object} Retruns a transformed product object from input
 * @todo Make changes to this once we have the correct props needed
 */
export function getProductFromSearch(searchData) {
    const url = window.tiffany.authoredContent.onHoverProductTileConfig.imageUrl;
    const itemMedia = objectPath.get(searchData, 'prodImageUrlSet');
    const product = {
        name: objectPath.get(searchData, 'name', ''),
        nameSplit: objectPath.get(searchData, 'titleSplit', []),
        class: objectPath.get(searchData, 'class', ''),
        department: objectPath.get(searchData, 'department', ''),
        mipsDescription: objectPath.get(searchData, 'mipsDescription', ''),
        price: objectPath.get(searchData, 'price', ''),
        isNew: objectPath.get(searchData, 'isNewProduct', false),
        image: getImageURL({ imageName: searchData.imageURL }),
        url: objectPath.get(searchData, 'friendlyUrl', '#'),
        sku: objectPath.get(searchData, 'sku', ''),
        selectedSku: !objectPath.get(searchData, 'isIRExperience', false) ? objectPath.get(searchData, 'defaultSku', false) : '',
        style: objectPath.get(searchData, 'style', ''),
        onlineStatus: objectPath.get(searchData, 'isAvailableOnline'),
        isGroup: objectPath.get(searchData, 'isGroup', false),
        isPurchasable: objectPath.get(searchData, 'isPurchasable', true),
        isEngravable: objectPath.get(searchData, 'isServiceable', false),
        isAvailable: !objectPath.get(searchData, 'isLowInventory', false),
        isLowInventory: objectPath.get(searchData, 'isLowInventory', false),
        shortDescription: objectPath.get(searchData, 'name', objectPath.get(searchData, 'title', '')),
        images: getItemMediaSortUrlMappings({ itemMedia, imagePrefix: searchData.imageURL }, url),
        itemMedia,
        isIRExperience: objectPath.get(searchData, 'isIRExperience', false),
        itemMasterNumber: objectPath.get(searchData, 'itemMasterNumber', '')
    };

    return product;
}

/**
 * @description Transform a category response object into valid product tile data
 * @param {Object} byoData Category data returned from service
 * @returns {Object} Retruns a transformed product object from input
 * @todo Make changes to this once we have the correct props needed
 */
export function getProductFromByo(byoData) {
    // To Do imageLargeURL,imageChainURL to be replaced with new once preset is available
    const product = {
        name: objectPath.get(byoData, 'title', ''),
        shortDescription: objectPath.get(byoData, 'name', ''),
        price: objectPath.get(byoData, 'price', ''),
        isNew: objectPath.get(byoData, 'isNewProduct', false),
        image: getImageURL({ imageName: byoData.imageURL }),
        nameSplit: objectPath.get(byoData, 'titleSplit', []),
        imageLarge: getImageURL({ imageName: byoData.imageURL }, true),
        altText: objectPath.get(byoData, 'title', ''),
        url: objectPath.get(byoData, 'friendlyUrl', '#'),
        sku: objectPath.get(byoData, 'sku', ''),
        selectedSku: objectPath.get(byoData, 'defaultSku', false) ? objectPath.get(byoData, 'defaultSku', false) : objectPath.get(byoData, 'selectedSku', false),
        isPurchasable: objectPath.get(byoData, 'isPurchasable', true),
        isAvailable: !objectPath.get(byoData, 'isLowInventory', false),
        isLowInventory: objectPath.get(byoData, 'isLowInventory', false),
        mountTypes: objectPath.get(byoData, 'mountTypes', []),
        itemMediaStitchPosition: objectPath.get(byoData, 'itemMediaStitchPosition', false),
        crop: objectPath.get(byoData, 'crop', false),
        fixtureItemMedia: objectPath.get(byoData, 'fixtureItemMedia', false),
        sharpenL: objectPath.get(byoData, 'sharpenL', false),
        sharpen: objectPath.get(byoData, 'sharpen', false),
        isGroup: objectPath.get(byoData, 'isGroup', false),
        isEngravable: objectPath.get(byoData, 'isServiceable', false),
        prodImageUrlSet: objectPath.get(byoData, 'prodImageUrlSet', false),
        imagePath: objectPath.get(byoData, 'imageURL', false),
        mediaStichPositions: objectPath.get(byoData, 'mediaStichPositions', []),
        title: objectPath.get(byoData, 'title', '')
    };

    return product;
}

/**
 * @description Transform a category response object into valid product tile data
 * @param {Object} catData Category data returned from service
 * @returns {Object} Retruns a transformed product object from input
 * @todo Make changes to this once we have the correct props needed
 */
export function getProductFromCat(catData) {
    const itemExperience = objectPath.get(catData, 'itemExperiences', {});
    const product = {
        name: objectPath.get(catData, 'title', ''),
        price: objectPath.get(catData, 'price', ''),
        isNew: objectPath.get(catData, 'isNewProduct', false),
        image: getImageURL({ imageName: catData.imageURL }),
        url: objectPath.get(catData, 'friendlyUrl', '#'),
        sku: objectPath.get(catData, 'sku', ''),
        isGroup: objectPath.get(catData, 'isGroup', ''),
        selectedSku: objectPath.get(catData, 'defaultSku', false),
        isPurchasable: objectPath.get(catData, 'isPurchasable'),
        isAvailable: objectPath.get(catData, 'isAvailable'),
        isLowInventory: objectPath.get(catData, 'isLowInventory'),
        isIRExperience: objectPath.get(itemExperience, 'isIRExperience', false),
        isGroup: objectPath.get(catData, 'isGroup', false)
    };

    return product;
}

/**
 * @description getGroupItemCompleteProducts response data and transform it.
 * @param {Object} data groupItem data returned from service
 * @param {string} type Type defines whether its a Group/ItemComplete
 * @param {string} url Specifies the URL from the author page.
 * @returns {Object} Retruns a transformed product object based on the service response.
 */
export function getGroupItemCompleteProducts(data, type, url) {
    const itemCompleteProds = objectPath.get(data, 'item', {});
    const groupProds = objectPath.get(data, 'group', {});
    const groupCompleteProds = objectPath.get(data, 'group.group', {});
    const itemMediaChanged = objectPath.get(data, 'itemMedia', {});
    const groupConst = PRODUCT_CONSTANTS.TYPE.GROUP_COMPLETE;
    const response = (type === groupConst) ? groupCompleteProds : itemCompleteProds;
    const friendlyURL = (type === groupConst) ? objectPath.get(groupProds, 'friendlyURL', '#') : objectPath.get(itemCompleteProds, 'friendlyURL', '#');
    const itemMedia = objectPath.get(data, 'itemMedia');
    const product = {
        shortDescription: objectPath.get(response, 'shortDescription', objectPath.get(response, 'title', '')),
        price: objectPath.get(response, 'price', ''),
        images: getItemMediaUrlMappings(itemMediaChanged, url),
        url: friendlyURL,
        sku: objectPath.get(response, 'sku', ''),
        selectedSku: objectPath.get(response, 'defaultSku', false),
        isPurchasable: objectPath.get(response, 'isPurchasable'),
        isLowInventory: objectPath.get(response, 'isLowInventory'),
        isServiceable: objectPath.get(response, 'isServiceable'),
        title: objectPath.get(response, 'title', ''),
        itemMedia,
        categoryID: itemCompleteProds.canonicalCategoryId,
        masterCategoryID: itemCompleteProds.canonicalMasterCategoryId
    };

    return product;
}

/**
 * @description getGroupItemCompleteProducts response data and transform it.
 * @param {Object} data groupItem data returned from service
 * @param {string} url Specifies the URL from the author page.
 * @returns {Object} Retruns a transformed product object based on the service response.
 */
export function getByoItemData(data, url) {
    const itemMedia = objectPath.get(data, 'prodImageUrlSet', false);

    const itemMediaArr = itemMedia.map((i) => {
        i.mediaFileName = i.url;
        return i;
    });
    const product = {
        shortDescription: objectPath.get(data, 'shortDescription', objectPath.get(data, 'title', '')),
        price: objectPath.get(data, 'price', ''),
        images: getItemMediaSortUrlMappings({ itemMedia, imagePrefix: data.imageURL }, url),
        url: objectPath.get(data, 'friendlyURL', ''),
        sku: objectPath.get(data, 'sku', ''),
        selectedSku: objectPath.get(data, 'defaultSku', false),
        isPurchasable: objectPath.get(data, 'isPurchasable'),
        isLowInventory: objectPath.get(data, 'isLowInventory'),
        isServiceable: objectPath.get(data, 'isServiceable'),
        title: objectPath.get(data, 'title', ''),
        itemMedia: {
            itemMedia: itemMediaArr,
            imageUrlFormat: objectPath.get(window, 'tiffany.authoredContent.byoConfig.byoImageData.charm.url', false),
            imagePrefix: objectPath.get(data, 'imagePath', false)
        }
    };

    return product;
}

/**
 * @description getBYOItemCompleteProductsToTray response data and transform it.
 * @param {Object} data groupItem data returned from service
 * @param {string} type Type defines whether its a Group/ItemComplete
 * @param {string} url Specifies the URL from the author page.
 * @returns {Object} Retruns a transformed product object based on the service response.
 */
export function getBYOItemCompleteProductsToTray(data, type, url) {
    const response = objectPath.get(data, 'item', {});
    const itemMediaChanged = objectPath.get(data, 'itemMedia', {});
    const friendlyURL = objectPath.get(response, 'friendlyURL', '#');
    const itemMedia = objectPath.get(data, 'itemMedia');
    const customMountType = objectPath.get(data, 'customMountType', []);
    const mountTypes = [];

    customMountType.map((item) => {
        return mountTypes.push(item.customMountTypeID);
    });

    const product = {
        shortDescription: objectPath.get(response, 'shortDescription', objectPath.get(response, 'title', '')),
        price: objectPath.get(response, 'price', ''),
        images: getItemMediaUrlMappings(itemMediaChanged, url),
        url: friendlyURL,
        sku: objectPath.get(response, 'sku', ''),
        selectedSku: objectPath.get(response, 'defaultSku', false),
        isPurchasable: objectPath.get(response, 'isPurchasable'),
        isLowInventory: objectPath.get(response, 'isLowInventory'),
        isServiceable: objectPath.get(response, 'isServiceable'),
        hasEngraving: objectPath.get(response, 'isServiceable'),
        hasVariation: !!(objectPath.get(response, 'isServiceable', false)),
        title: objectPath.get(response, 'title', ''),
        imageURL: getBYOImageURL(data),
        itemMedia,
        mountTypes
    };

    return product;
}

/**
 * @description getBYOCanvasData response data and transform it.
 * @param {Object} data groupItem data returned from service
 * @returns {Object} Retruns a transformed product object based on the service response.
 */
export function getBYOCanvasData(data) {
    let itemMediaStitchPositions = [];
    let fixture = {};
    const charms = {};
    const imageUrl = objectPath.get(window, 'tiffany.authoredContent.byoConfig.byoImageData.url', '');
    const preset = objectPath.get(window, 'tiffany.authoredContent.byoConfig.fixtureImagePreset', 0);
    const queryParam = objectPath.get(window, 'tiffany.authoredContent.byoConfig.fixtureImageQueryParam', '');
    const mediaPreset = objectPath.get(window, 'tiffany.authoredContent.byoConfig.charmImagePreset', 0);
    const charmQueryParam = objectPath.get(window, 'tiffany.authoredContent.byoConfig.charmImageQueryParam', '');
    const claspParam = objectPath.get(window, 'tiffany.authoredContent.byoConfig.charmImageClaspQueryParam', '');
    const colpoParam = objectPath.get(window, 'tiffany.authoredContent.byoConfig.colpoImageClaspQueryParam', '');

    data.items.items.forEach((i) => {
        if (i.seqNum > 0) {
            const seq = i.seqNum - 1;

            charms[seq] = i;
            charms[seq].imageURL = getBYOCanvasImageURL(charms[seq]);
            charms[seq].transparentURL = getBYOCanvasFixtureImageURL(charms[seq].addonItemMedia, imageUrl, mediaPreset, charmQueryParam);
            charms[seq].claspURL = getBYOCanvasFixtureImageURL(charms[seq].addonItemMedia, imageUrl, mediaPreset, charmQueryParam) + claspParam;
            charms[seq].colpoTransparentURL = getBYOCanvasFixtureImageURL(charms[seq].addonClaspItemMedia, imageUrl, mediaPreset, charmQueryParam);
            charms[seq].colpoClaspURL = getBYOCanvasFixtureImageURL(charms[seq].addonClaspItemMedia, imageUrl, mediaPreset, charmQueryParam) + colpoParam;
            charms[seq].hasVariation = !!charms[seq].groupSku;
            charms[seq].hasEngraving = !!charms[seq].isServiceable;
            charms[seq].title = charms[seq].title2 ? `${charms[seq].title}:${charms[seq].title2}` : charms[seq].title;
            if (charms[seq].groupSku) {
                charms[seq].selectedSku = charms[seq].sku;
                charms[seq].sku = charms[seq].groupSku;
            }
            if (charms[seq].servicing) {
                charms[seq].selectedEngraving = {};
                charms[seq].selectedEngraving.isTrueType = !!charms[seq].servicing.isTrueType;
                charms[seq].selectedEngraving.itemServiceTypeId = charms[seq].servicing.itemServiceTypeId;
                charms[seq].selectedEngraving.unitPrice = charms[seq].servicing.price;
                charms[seq].selectedEngraving.itemServiceTypeId = charms[seq].servicing.itemServiceTypeID;
                if (charms[seq].servicing.text) {
                    charms[seq].selectedEngraving.initialOne = charms[seq].servicing.text[0] || '';
                    charms[seq].selectedEngraving.initialTwo = charms[seq].servicing.text[1] || '';
                    charms[seq].selectedEngraving.initialThree = charms[seq].servicing.text[2] || '';
                }
            }
        } else {
            fixture = i;
            fixture.itemTypeID = i.itemTypeId;
            if (fixture.groupSku) {
                fixture.memberSku = fixture.sku;
                fixture.sku = fixture.groupSku;
            }
        }
    });

    itemMediaStitchPositions = fixture.mediaStitchPositionsList.map(position => {
        return [position.xcoordinates, position.ycoordinates];
    });
    fixture.image = getBYOCanvasImageURL(fixture);
    fixture.shortDescription = fixture.name;
    fixture.size = fixture.linkText;
    fixture.imageLarge = getBYOCanvasImageURL(fixture, true);
    fixture.fixturePositions = itemMediaStitchPositions;
    fixture.maxCharmsAllowed = itemMediaStitchPositions.length;
    fixture.imageURL = getBYOCanvasFixtureImageURL(fixture.fixtureItemMedia, imageUrl, preset, queryParam);
    fixture.isPurchasable = !!objectPath.get(data, 'itemRuleResult.showAddToShoppingBag', false);
    const product = {
        ...data,
        fixture,
        charms
    };

    return product;
}

/**
 * @description getBYOItemCompleteChainToTray response data and transform it.
 * @param {Object} data groupItem data returned from service
 * @param {Object} sku sku data returned from service
 * @param {String} size size
 * @param {Object} memberSku memberSku data returned from service
 * @returns {Object} Retruns a transformed product object based on the service response.
 */
export function getBYOItemCompleteChainToTray(data, sku, size, memberSku) {
    const response = objectPath.get(data, 'item', {});
    const friendlyURL = objectPath.get(response, 'friendlyURL', '#');
    const customMountType = objectPath.get(data, 'customMountType', []);
    const mountTypes = [];

    customMountType.map((item) => {
        return mountTypes.push(item.customMountTypeID);
    });

    const product = {
        shortDescription: objectPath.get(response, 'shortDescription', ''),
        mountTypes,
        defaultSku: memberSku,
        url: friendlyURL,
        friendlyUrl: friendlyURL,
        image: getBYOImageURL(data),
        imageLarge: getBYOImageURL(data, true),
        name: objectPath.get(response, 'title', ''),
        title: objectPath.get(response, 'title', ''),
        price: objectPath.get(response, 'price', ''),
        sku,
        formattedPrice: objectPath.get(response, 'price', ''),
        altText: objectPath.get(response, 'title', ''),
        selectedSku: memberSku,
        mediaStichPositions: objectPath.get(response, 'itemMediaStitchPositions', false),
        size,
        groupItems: objectPath.get(response, 'groupItems', false),
        isPurchasable: objectPath.get(response, 'isPurchasable', false)
    };

    return product;
}

/**
 * @description getBYOGroupCompleteProductsToTray response data and transform it.
 * @param {Object} data groupItem data returned from service
 * @param {string} membersku Type defines whether its a Group/ItemComplete
 * @param {string} type Type defines whether its a Group/ItemComplete
 * @param {string} url Specifies the URL from the author page.
 * @returns {Object} Retruns a transformed product object based on the service response.
 */
export function getBYOGroupCompleteProductsToTray(data, membersku, type, url) {
    const response = objectPath.get(data, 'group', {});
    const { group } = response;
    const groupItem = response.groupItems.find((item) => { return item.memberSku === membersku.toString(); });
    const friendlyURL = objectPath.get(groupItem, 'friendlyURL', '#');
    const itemMedia = objectPath.get(groupItem, 'itemMedia');
    const customMountType = objectPath.get(data, 'customMountType', []);
    const mountTypes = [];

    customMountType.map((item) => {
        return mountTypes.push(item.customMountTypeID);
    });

    const product = {
        shortDescription: objectPath.get(group, 'shortDescription', objectPath.get(response, 'title', '')),
        price: objectPath.get(group, 'price', ''),
        images: getItemMediaUrlMappings(data.itemMedia, url),
        url: friendlyURL,
        sku: objectPath.get(group, 'sku', ''),
        selectedSku: objectPath.get(group, 'selectedSku', false),
        isPurchasable: objectPath.get(group, 'isPurchasable'),
        isLowInventory: objectPath.get(group, 'isLowInventory'),
        isServiceable: objectPath.get(group, 'isServiceable'),
        hasEngraving: objectPath.get(group, 'isServiceable'),
        hasVariation: !!(objectPath.get(group, 'isServiceable', false)),
        title: objectPath.get(group, 'title', ''),
        imageURL: getBYOImageURL(groupItem),
        groupItems: response.groupItems,
        selectedVariation: groupItem,
        itemMedia,
        type: objectPath.get(response, 'groupAttributes.groupDropDownLabel', ''),
        mountTypes
    };

    return product;
}

/**
 * @description getByoGroupItemCompleteProducts response data and transform it.
 * @param {Object} data groupItem data returned from service
 * @param {string} type Type defines whether its a Group/ItemComplete
 * @param {string} url Specifies the URL from the author page.
 * @returns {Object} Retruns a transformed product object based on the service response.
 */
export function getByoGroupItemCompleteProducts(data, type, url) {
    const group = objectPath.get(data, 'group', {});
    const groupAttributes = objectPath.get(data, 'groupAttributes', {});
    const groupItems = objectPath.get(data, 'groupItems', {});
    const selectedSku = objectPath.get(group, 'selectedSku', false);
    const isGroup = objectPath.get(group, 'isGroup', false);
    const filteredGroupItems = groupItems.filter((item) => {
        return item.memberSku.toString() === selectedSku.toString();
    });
    const sortedGroupItems = sortBy(groupItems, ['displayOrder']);
    const itemMedia = objectPath.get(filteredGroupItems[0], 'itemMedia', {});
    const title = objectPath.get(group, 'title', '');
    const groupName = groupAttributes.groupDropDownLabel || '';
    const product = {
        shortDescription: objectPath.get(group, 'shortDescription', title),
        price: objectPath.get(group, 'price', ''),
        images: getItemMediaSortUrlMappings(itemMedia, url),
        url: objectPath.get(data, 'friendlyURL', '#'),
        sku: objectPath.get(group, 'sku', ''),
        isPurchasable: objectPath.get(group, 'isPurchasable'),
        isServiceable: objectPath.get(group, 'isServiceable'),
        selectedSku,
        isGroup,
        title,
        groupName,
        groupItems: sortedGroupItems,
        categoryID: group.canonicalCategoryId,
        masterCategoryID: group.canonicalMasterCategoryId
    };
    return product;
}

/**
 * @description getGroupItemImageURL Update the url with the placeholder data.
 * @param {string} url Specifies the URL from the author page.
 * @param {Object} mapDetails Object to update the placeholder data in the url.
 * @returns {Object} Retruns a url with appropriate mapped data.
 */
export function getGroupItemImageURL(url, mapDetails) {
    let imgUrl = url;

    imgUrl = imgUrl.indexOf('http:') !== -1 ? imgUrl.replace('http:', window.location.protocol) : window.location.protocol + imgUrl;
    mapDetails.forEach((item, index) => {
        const check = '<' + item.key + '>';
        imgUrl = imgUrl.replace(check, item.value);
    });
    return imgUrl;
}

/**
 * @description getItemMediaUrlMappings Get the transformed imagelist.
 * @param {Object} data Object from the service api.
 * * @param {string} url Specifies the URL from the author page.
 * @returns {Object} Retruns a url with appropriate mapped data.
 */
export function getItemMediaUrlMappings(data, url) {
    const imagesList = [];
    const itemMedia = objectPath.get(data, 'itemMedia', {});
    const itemMediaLen = itemMedia.length;
    const imagePrefix = objectPath.get(data, 'imagePrefix', '');

    // Sort the MediaItem List
    itemMedia && itemMedia.length > 0 && itemMedia.sort(function (item1, item2) {
        return item1.mediaTypeID - item2.mediaTypeID;
    });
    if (itemMediaLen > 0) {
        itemMedia.forEach((item, index) => {
            const imgUrlText = updateImageList(item, imagePrefix, url);
            imagesList.push(imgUrlText);
        });
    }
    return imagesList;
}

/**
 * @description getItemMediaSortUrlMappings Get the transformed imagelist.
 * @param {Object} data Object from the service api.
 * * @param {string} url Specifies the URL from the author page.
 * @returns {Object} Retruns a url with appropriate mapped data.
 */
export function getItemMediaSortUrlMappings(data, url) {
    const imagesList = [];
    const itemMedia = objectPath.get(data, 'itemMedia', []);
    const mediatypeOrder = objectPath.get(window, 'tiffany.authoredContent.mediaTypeIdOrder', ['1092', '1093', '1098']);

    const itemSortMedia = itemMedia.filter((item) => {
        return mediatypeOrder.indexOf(item.mediaTypeID.toString()) > -1;
    });
    const itemMediaLen = itemSortMedia.length;
    const imagePrefix = objectPath.get(data, 'imagePrefix', '');

    // Sort the MediaItem List
    itemSortMedia && itemSortMedia.length > 0 && itemSortMedia.sort(function (item1, item2) {
        return item1.mediaTypeID - item2.mediaTypeID;
    });
    if (itemMediaLen > 0) {
        itemSortMedia.forEach((item, index) => {
            const imgUrlText = updateImageList(item, imagePrefix, url);
            imagesList.push(imgUrlText);
        });
    }
    return imagesList;
}

/**
 * @description updateImageList methods gather the imageObject
 * @param {Object} item item returned from service
 * @param {string} imagePrefix imagePrefix captured from the service.
 * @param {string} url captured from props of the component.
 * @returns {Object} Retruns a transformed imageObject.
 */
export function updateImageList(item, imagePrefix, url) {
    const mappingList = [];

    mappingList.push({ key: 'ImagePrefix', value: imagePrefix });
    const itemMediaUrl = objectPath.get(item, 'url', '');
    const imageName = objectPath.get(item, 'mediaFileName', itemMediaUrl);

    mappingList.push({ key: 'ImageName', value: imageName });
    const imgUrl = getGroupItemImageURL(url, mappingList);

    return imgUrl;
}

/**
 * @description getProductDetails filters the object with placeholder data
 * @param {Object} productObj containing all the object data
 * @returns {Object} Returns the object with required placeholder data
 */
export function getProductDetailsObj(productObj) {
    const productDetails = {};

    const group = objectPath.get(productObj, 'resultDto.group.group', {});

    let title = objectPath.get(group, 'title', '');
    const titlesplit = objectPath.get(group, 'titleSplit', []);
    let eyebrowtext = '';

    if (titlesplit.length === 2) {
        eyebrowtext = titlesplit[0];
        title = titlesplit[1];
    } else if (titlesplit.length === 1) {
        title = titlesplit[0];
    }

    productDetails.eyebrowtext = eyebrowtext;
    productDetails.title = title;
    productDetails.specifications = objectPath.get(group, 'specifications', []);
    productDetails.style = objectPath.get(group, 'style', '');
    productDetails.caratWeight = objectPath.get(group, 'caratWeight', '');
    productDetails.minCaratWeight = objectPath.get(group, 'minCaratWeight', 0);
    productDetails.maxCaratWeight = objectPath.get(group, 'maxCaratWeight', 0);
    productDetails.lowerPriceLimit = objectPath.get(group, 'lowerPriceLimit', 0);
    productDetails.upperPriceLimit = objectPath.get(group, 'upperPriceLimit', 0);
    productDetails.diamondColor = objectPath.get(group, 'diamondColor', []);
    productDetails.diamondClarity = objectPath.get(group, 'diamondClarity', []);
    productDetails.diamondCut = objectPath.get(group, 'diamondCut', []);
    productDetails.longDescription = objectPath.get(group, 'longDescription', '');
    productDetails.additionalInfo = objectPath.get(group, 'additionalInfo', '');
    productDetails.minPrice = objectPath.get(group, 'minPrice', '');
    productDetails.sku = objectPath.get(group, 'sku', '');
    productDetails.selectedSku = objectPath.get(group, 'selectedSku', false);
    productDetails.lineListedItems = objectPath.get(productObj, 'resultDto.lineListedItems', []);
    productDetails.showChooseDiamond = objectPath.get(group, 'showChooseDiamond', false);
    productDetails.isAvaialbleOnline = objectPath.get(group, 'isAvaialbleOnline', false);

    return productDetails;
}


/**
 * @description Transform a given response object into product
 * @param {Object} data data returned from service
 * @param {string} type image appropriate type of input data
 * @param {string} url captured from props of the component.
 * @returns {Object} Retruns a transformed product object from input
 */
export function getProduct(data, type, url) {
    switch (type) {
        case PRODUCT_CONSTANTS.TYPE.SKU:
            return getProductFromSKU(data);
            break;
        case PRODUCT_CONSTANTS.TYPE.GROUP:
            return getProductFromGROUP(data);
            break;
        case PRODUCT_CONSTANTS.TYPE.CATEGORY:
            return getProductFromCat(data);
        case PRODUCT_CONSTANTS.TYPE.GROUP_COMPLETE:
            return getGroupItemCompleteProducts(data, PRODUCT_CONSTANTS.TYPE.GROUP_COMPLETE, url);
        case PRODUCT_CONSTANTS.TYPE.BYO_GROUP_COMPLETE:
            return getByoGroupItemCompleteProducts(data, PRODUCT_CONSTANTS.TYPE.BYO_GROUP_COMPLETE, url);
        case PRODUCT_CONSTANTS.TYPE.ITEM_COMPLETE:
            return getGroupItemCompleteProducts(data, PRODUCT_CONSTANTS.TYPE.ITEM_COMPLETE, url);
    }
}

/**
 * Find click url for rich relavance products
 * @param {array} richProducts richProducts
 * @param {object} product product
 */
export function clickUrlForRichProducts(richProducts, product) {
    if (richProducts.length > 0) {
        const recommendProduct = richProducts.find(rec => {
            return rec.id.toString() === product.sku.toString();
        });

        if (recommendProduct && recommendProduct.clickTrackingURL) {
            product.clickURL = recommendProduct.clickTrackingURL;
        }
    }
    return product;
}

/**
 * @description Transforms SKU and Category data into Product array
 * @param {object} data Response from service call
 * @param {boolean} presetOverride flag to override preset
 * @returns {array} Array of Products
 */
export function transformSkuCatData(data, presetOverride = false) {
    const products = [];
    const rrProducts = objectPath.get(data, 'rrProducts', []);

    // Transforming SKU data
    objectPath.get(data, 'skuResponse.resultDto.items', []).forEach(element => {
        element.presetOverride = presetOverride;
        let product = getProduct(element, PRODUCT_CONSTANTS.TYPE.SKU);

        if (product) {
            product = clickUrlForRichProducts(rrProducts, product);
            products.push(product);
        }
    });
    // Transforming Group data
    objectPath.get(data, 'skuResponse.resultDto.groups', []).forEach(element => {
        let product = getProduct(element, PRODUCT_CONSTANTS.TYPE.GROUP);

        if (product) {
            product = clickUrlForRichProducts(rrProducts, product);
            products.push(product);
        }
    });
    // Transforming Category Data
    objectPath.get(data, 'catResponse.resultDto.products', []).forEach(element => {
        let product = getProduct(element, PRODUCT_CONSTANTS.TYPE.CATEGORY);

        if (product) {
            product = clickUrlForRichProducts(rrProducts, product);
            products.push(product);
        }
    });
    return products;
}

/**
 * @description Re-orders products based on sku input
 * @param {array} orderedKeys arrays of SKU's to check for order
 * @param {object} data Response from service call
 * @returns {array} Array of Products
 */
export function getReorderedProducts(orderedKeys, data) {
    const products = [];

    orderedKeys.forEach(orderKey => {
        data.forEach(item => {
            if (orderKey.toString() === item.sku.toString()) {
                products.push(item);
            }
        });
    });

    return products.length > 0 ? products : data;
}

/**
* @description Transforms GROUP_COMPLETE and ITEM_COMPLETE data into Product array
* @param {object} data Response from service call
* @param {string} type Defines type of the service.
* @param {string} imgUrl stateObject configured captured from component.
* @returns {array} Array of Products
*/
export function transformGroupItemData(data, type, imgUrl) {
    let response = objectPath.get(data, 'resultDto', []);
    const products = getProduct(response, type, imgUrl);
    return products;
}

/**
 * function to determining the number of colums in the grid
 * @param {Object} mediaVariables media object
 * @return {Number} number of columns
 */
export function gridColumns(mediaVariables) {
    if (window.matchMedia(mediaVariables.mobile).matches) {
        return 2;
    } else if (window.matchMedia(mediaVariables.belowDesktopTablet).matches) {
        return 3;
    } else {
        return 4;
    }
}

/**
 * @deprecated
 * @description Formats the Grid to array of arrays
 * @param {Array} products Products
 * @returns {Array} products
 */
export function formatGridArray(products) {
    let childArrIndex = 0;
    // const formattedProducts = [];
    let brokenIndex = 0;
    const borkenGrid = [];

    products.forEach((tile, index) => {
        if (tile.showBlankSpaces && borkenGrid[childArrIndex]) {
            borkenGrid[childArrIndex].push(tile);
            brokenIndex = tile.slot;
            childArrIndex += 1;
        } else if (tile.showBlankSpaces && !borkenGrid[childArrIndex]) {
            borkenGrid[childArrIndex] = [tile];
            childArrIndex += 1;
        } else if (borkenGrid[childArrIndex]) {
            tile.slot -= brokenIndex;
            borkenGrid[childArrIndex].push(tile);
        } else if (!borkenGrid[childArrIndex]) {
            tile.slot -= brokenIndex;
            borkenGrid[childArrIndex] = [tile];
        }
    });
    return borkenGrid;
}

/**
 * @deprecated
 * @description Breaks dynamic tiles
 * @param {*} dynamicContentTiles Dynamic Tiles
 * @returns {Array} broken grid array
 */
export function breakDynamicTiles(dynamicContentTiles) {
    let childArrIndex = 0;
    const borkenGrid = [];
    let brokenIndex = 0;

    dynamicContentTiles.sort((a, b) => {
        if (a.slot < b.slot) {
            return -1;
        } else if (a.slot > b.slot) {
            return 1;
        }
        return 0;
    }).forEach((tile, index) => {
        if (tile.showBlankSpaces && borkenGrid[childArrIndex]) {
            borkenGrid[childArrIndex].push(tile);
            brokenIndex = tile.slot;
            childArrIndex += 1;
        } else if (tile.showBlankSpaces && !borkenGrid[childArrIndex]) {
            borkenGrid[childArrIndex] = [tile];
            childArrIndex += 1;
        } else if (borkenGrid[childArrIndex]) {
            tile.slot -= brokenIndex;
            borkenGrid[childArrIndex].push(tile);
        } else if (!borkenGrid[childArrIndex]) {
            tile.slot -= brokenIndex;
            borkenGrid[childArrIndex] = [tile];
        }
    });
    // console.log('breakDynamicTiles',borkenGrid);
    return borkenGrid;
}

/**
 * function to determining the layout and number of colums for marketing tile
 * @param {Object} products media object
 * @param {Object} mediaVariables media object
 * @param {Object} dynamicContent media dynamic config content
 * @returns {Object} number of products
 */
export function marketingTileslayout(products, mediaVariables, dynamicContent) {
    const totalColumns = gridColumns(mediaVariables); // total number of columns for this breakpoint
    const productsArray = JSON.parse(JSON.stringify(products));
    let layout = '1x1';
    let gridElements = [];
    let currentColsAvailable = 4;
    let numOfRequiredProducts = 0;
    let occupiedSlots = 0;
    let rowIndex = 0;
    const expansionRows = {};
    const numOfCols = gridColumns(mediaVariables);

    dynamicContent.sort((a, b) => {
        if (a.slot < b.slot) {
            return -1;
        } else if (a.slot > b.slot) {
            return 1;
        }
        return 0;
    }).forEach(mTile => {
        if (Object.keys(mTile).length > 0) {
            const gridElementSorted = JSON.parse(JSON.stringify(gridElements)).filter(ele => typeof ele.slot === 'number');
            const lastMtile = gridElementSorted[gridElementSorted.length - 1];

            layout = mTile.layout.split('x').map(layoutProp => Number(layoutProp));
            if (gridElements.length === 0) { // if the elements are empty
                gridElements = [...productsArray.splice(0, mTile.slot - 1 || 0)]; // copy all the products to grid that should come before the slot
            } else if (lastMtile && typeof lastMtile.index === 'number') { // this is a mTile
                // check how many products are included after it
                const numOfProductsAfterlastMTile = (gridElements.length - lastMtile.index);

                // check how many products are required between last tile and current tile
                const numberOfTilesRequiredInBetween = (Number(mTile.slot) - lastMtile.slot - 1);

                if (numOfProductsAfterlastMTile > numberOfTilesRequiredInBetween && numberOfTilesRequiredInBetween > 0) {
                    // cut down excess and push back to products array
                    const excessProds = numOfProductsAfterlastMTile - numberOfTilesRequiredInBetween;
                    let slicedprods = 0;

                    // const indexTobeRemove = [];

                    while (slicedprods !== excessProds) {
                        const element = gridElements[gridElements.length - 1];

                        if ((gridElements.length - 1) >= lastMtile.index && !element.slot) {
                            slicedprods += 1;
                            gridElements.splice(gridElements.length - 1, 1);
                            productsArray.splice(0, 0, element);
                        }
                    }
                } else if (numberOfTilesRequiredInBetween > 0) {
                    // gets ome from products array and push into grid
                    const reqProds = numberOfTilesRequiredInBetween - numOfProductsAfterlastMTile;

                    gridElements = [...gridElements, ...productsArray.splice(0, reqProds)];
                }
            }

            occupiedSlots = (gridElements.map(ele => ele.size || 1).reduce((total, size) => total + size, 0) % totalColumns);
            currentColsAvailable = occupiedSlots === 0 ? totalColumns : totalColumns - occupiedSlots;

            rowIndex = Math.ceil(gridElements.map(ele => ele.size || 1).reduce((total, size) => total + size, 0) / totalColumns) - 1;
            rowIndex = rowIndex < 0 ? 0 : rowIndex;

            expansionRows[rowIndex] ? occupiedSlots += expansionRows[rowIndex] : '';
            expansionRows[rowIndex] ? currentColsAvailable -= expansionRows[rowIndex] : '';

            const mTileExpansionRows = layout[1] - 1;

            let rowsIndex = 0;

            while (rowsIndex < mTileExpansionRows) {
                expansionRows[rowIndex + 1] = layout[1];
                rowsIndex += 1;
            }

            if (currentColsAvailable < layout[0]) { // No we cant insert the marketing tile
                // check if it needs empty or we can fill with product tiles
                if (mTile.showBlankSpaces) {
                    for (let x = 0; x < currentColsAvailable; x += 1) {
                        gridElements.push({ layout: '1x1' });
                    }
                } else {
                    gridElements = [...gridElements, ...productsArray.splice(0, currentColsAvailable)];
                }

                const tempreqProds = (((totalColumns - layout[0]) * layout[1]) - occupiedSlots);

                numOfRequiredProducts = tempreqProds > 0 ? tempreqProds + totalColumns : totalColumns;
                if (productsArray.length >= numOfRequiredProducts) {
                    mTile.size = layout[0] * layout[1];
                    mTile.index = gridElements.length ? gridElements.length + 1 : 1;
                    gridElements.push(mTile);
                    gridElements = [...gridElements, ...productsArray.splice(0, numOfRequiredProducts)];
                } else if (productsArray.length <= numOfRequiredProducts && gridElements.length === mTile.slot - 1) {
                    mTile.size = layout[0] * layout[1];
                    mTile.index = gridElements.length ? gridElements.length + 1 : 1;
                    gridElements.push(mTile);
                }
            } else { // Yes we can insert the marketing tile
                const tempreqProds = (((totalColumns - layout[0]) * layout[1]) - occupiedSlots);

                numOfRequiredProducts = tempreqProds > 0 ? tempreqProds + totalColumns : totalColumns;
                if (productsArray.length >= numOfRequiredProducts) {
                    mTile.size = layout[0] * layout[1];
                    mTile.index = gridElements.length ? gridElements.length + 1 : 1;
                    gridElements.push(mTile);
                    gridElements = [...gridElements, ...productsArray.splice(0, numOfRequiredProducts)];
                } else if (productsArray.length <= numOfRequiredProducts && gridElements.length === mTile.slot - 1) {
                    mTile.size = layout[0] * layout[1];
                    mTile.index = gridElements.length ? gridElements.length + 1 : 1;
                    gridElements.push(mTile);
                }
            }
        }
    });

    let processedProducts = [...gridElements, ...productsArray];
    const processedItems = arrangeItems(processedProducts, 1, 1, true, numOfCols);

    if (processedItems) {
        processedProducts = processedItems.items;
    }

    return processedProducts;
}

/**
 * @deprecated
 * @description function to determining the layout and number of colums for marketing tile
 * @param {Object} products media object
 * @param {Object} mediaVariables media object
 * @param {Object} dynamicContent media dynamic config content
 * @returns {Object} number of products
 */
export function marketingTileslayoutOld(products, mediaVariables, dynamicContent) {
    let productsCopy = JSON.parse(JSON.stringify(products));
    const numOfCols = gridColumns(mediaVariables);
    let layout = '1x1';
    let gridElements = [];
    let colsLeft = 0;
    let currentColsAvailable = 0;
    let numOfRequiredProducts = 0;
    // let numOfProductsAfterSlot = 0; // check for product tiles inserted by the previous maerketing tile

    dynamicContent.sort((a, b) => {
        if (a.slot < b.slot) {
            return -1;
        } else if (a.slot > b.slot) {
            return 1;
        }
        return 0;
    }).forEach((marketingTile, index) => {
        if (!productsCopy.length) {
            return;
        }
        const gridElementCopy = JSON.parse(JSON.stringify(gridElements));

        gridElementCopy.sort((x, y) => {
            if (x.slot < y.slot) {
                return -1;
            } else if (x.slot > y.slot) {
                return 1;
            }
            return 0;
        });

        if (gridElements[gridElements.length - 1] && gridElements[gridElements.length - 1].slot) {
            // this is a marketing tile
            gridElements = [...gridElements, ...productsCopy.splice(0, Math.abs(gridElements[gridElements.length - 1].slot - marketingTile.slot) - 1 || 0)];
        } else if (gridElementCopy[0] && typeof gridElementCopy[0].index === 'number') {
            // const numOfProductsAfterlastMTile = (gridElementCopy.length - gridElementCopy[0].index) + 1;
            const numOfProductsAfterlastMTile = (gridElementCopy.length - gridElementCopy[0].index);

            gridElements = [...gridElements, ...productsCopy.splice(0, Math.abs(((gridElementCopy[0].slot - numOfProductsAfterlastMTile) - marketingTile.slot)) - 1 || 0)]; // gridElementCopy[0].index
        } else if (gridElements.length === 0) {
            gridElements = [...gridElements, ...productsCopy.splice(0, marketingTile.slot - 1 || 0)];
        }

        // check if the insertion index has any product tiles
        if (gridElements[marketingTile.slot - 1] && !gridElements[marketingTile.slot - 1].layout) {
            // the place where this marketing tile has to sit has product tiles
            // Move them to accomodat the mtile
            productsCopy = [...gridElements.splice(marketingTile.slot - 1, gridElements.length), ...productsCopy];
        }

        if (marketingTile.layout) {
            layout = marketingTile.layout.split('x');
        }
        currentColsAvailable = numOfCols - (gridElements.map(ele => ele.size || 1).reduce((total, size) => total + size, 0) % numOfCols); // the current position

        // Check if the marketing tile can fit here
        if (currentColsAvailable <= Number(layout[0])) {
            // No the Marketing tile cant fit
            if (marketingTile.showBlankSpaces) {
                for (let x = 0; x < currentColsAvailable; x += 1) {
                    gridElements.push({ layout: '1x1' });
                }
            } else {
                gridElements = [...gridElements, ...productsCopy.splice(0, currentColsAvailable)];
            }

            // check if enough products are available for surrounding the marketing tile
            colsLeft = (layout[0] * layout[1]) - numOfCols;

            // if (colsLeft < 0) {
            //     numOfRequiredProducts = Math.abs(colsLeft);
            // } else if (colsLeft > 0) {
            //     numOfRequiredProducts = (layout[1] * colsLeft);
            // }
            // numOfRequiredProducts = (layout[1] * colsLeft) + layout[0];

            // 4/3/2 - 4/3/2 * x

            numOfRequiredProducts = ((numOfCols - Number(layout[0])) * layout[1]) - (colsLeft - currentColsAvailable);
            if (productsCopy.length > numOfRequiredProducts) {
                marketingTile.size = layout[0] * layout[1];
                marketingTile.index = gridElements.length;
                gridElements.push(marketingTile);
                gridElements = [...gridElements, ...productsCopy.splice(0, numOfRequiredProducts)];
            } else {
                // dont push the marketing tile
            }
        } else {
            // we can fit marketing tile
            // Check how many products are required after this tile
            colsLeft = currentColsAvailable - (layout[0]);

            // numOfRequiredProducts = (layout[1] * colsLeft) + layout[0];
            // numOfRequiredProducts = (layout[1] * colsLeft);
            numOfRequiredProducts = ((numOfCols - Number(layout[0])) * layout[1]) - (colsLeft - currentColsAvailable);

            if (products.length > numOfRequiredProducts) {
                marketingTile.size = layout[0] * layout[1];
                marketingTile.index = gridElements.length;
                gridElements.push(marketingTile);
                gridElements = [...gridElements, ...productsCopy.splice(0, numOfRequiredProducts)];
            }
        }
        // console.log(gridElements);
    });
    // console.log(gridElements);
    return [...gridElements, ...productsCopy];
}

/**
 * @deprecated
 * @description function to // determining the layout and number of colums for marketing tile
 * @param {Object} products media object
 * @param {Object} mediaVariables media object
 * @param {Object} dynamicContent media dynamic config content
 * @returns {Object} number of products
 */
export function marketingTileslayoutOlder(products, mediaVariables, dynamicContent) {
    let layout = '1x1';
    let slotsFilled = products.length;
    let totalTiles = products.length;

    // determining the number of colums in the grid
    // Cols per row based on device.
    const numOfCols = gridColumns(mediaVariables);

    dynamicContent.forEach((item, index) => {
        let numSurrTiles = 0;
        let currColIndex = 0;
        let minTilesRequired = 0;

        // If slots less than products then only perform the check.
        if (item.slot <= products.length) {
            // Layout exists then split it.
            if (item.layout) {
                layout = item.layout.split('x');
            }

            // calculating number of slots being used by the Tile
            // If layout[0] is greather than noOfCols consider noOfCols or else layout[0]
            layout[0] = (layout[0] > numOfCols) ? numOfCols : layout[0]; // Ex: 4

            // multiply layout values.
            const tileSpace = layout[0] * layout[1]; // Ex:2

            if (!products[item.slot - 1].sku) {
                slotsFilled += tileSpace - 1;
            }

            numSurrTiles = (numOfCols - layout[0]) * layout[1];
            currColIndex = (slotsFilled % numOfCols) + 1;

            if (numOfCols - (currColIndex + layout[0]) <= 0) {
                currColIndex = 1;
            }

            minTilesRequired = (numSurrTiles - currColIndex);
            const tilesTillSlot = products.slice(0, item.slot - 1);
            let slotCount = 0;
            let mkTileExists = false;

            tilesTillSlot.forEach(prodItem => {
                let tileLayout = 1;

                if (item.layout) {
                    const spiltLayout = item.layout.split('x');

                    spiltLayout[0] = spiltLayout[0] > numOfCols ? numOfCols : spiltLayout[0]; // Ex: 4

                    tileLayout = layout[0] * layout[1]; // Ex:2
                }

                if (prodItem.sku) {
                    slotCount += 1;
                } else if (item.layout) {
                    slotCount += tileLayout;
                    mkTileExists = true;
                }
            });

            if (products[item.slot - 1].sku && (totalTiles >= item.slot + minTilesRequired)) { // checking if it is Product tile --> insert the Marketing Tile
                const calcSlot = mkTileExists ? slotCount - 1 : slotCount + 1;
                const remianingCols = calcSlot % numOfCols; //  1%4 =1 2%4=2 3%4=3 4%4=0
                let emptyItems = 0;

                // Check if remianingCols position (i.e.2,3rd position in a row)
                if (remianingCols > 1) {
                    if (remianingCols < tileSpace) { // Ex: 3 < 4
                        if (remianingCols % 2 === 0) {
                            emptyItems = remianingCols + 1;
                        } else {
                            emptyItems = remianingCols - 1;
                        }
                    }
                } else if (remianingCols === 0) {
                    if ((remianingCols + 1) < tileSpace) {
                        emptyItems = remianingCols + 1;
                    }
                }

                const updatedSlot = (item.slot + emptyItems);
                const slotNum = item.showBlankSpaces ? updatedSlot - 1 : item.slot - 1;

                // If showBlankSpaces toggle has been set to true
                if (item.showBlankSpaces) {
                    for (let k = emptyItems; k > 0; k -= 1) {
                        products.splice(slotNum - k, 0, { layout: '1x1' });
                    }
                }
                products.splice((slotNum) < 0 ? 0 : slotNum, 0, item);
                totalTiles += 1;
                slotsFilled += tileSpace;
            }
        }
    });

    return formatGridArray(products);
}

/**
 * @deprecated
 * function to // determining the layout and number of colums for marketing tile
 * @param {Object} products media object
 * @param {Object} mediaVariables media object
 * @param {Object} brokenDynamicTiles media dynamic config content
 * @param {Number} length broken mtiles length
 * @param {Number} index Where to start from
 * @returns {Object} number of products
 */
export function marketingTileslayoutOldest(products, mediaVariables, brokenDynamicTiles, length, index = 0) {
    // let brokenProducts = products;
    const transformedarray = JSON.parse(JSON.stringify(marketingTileslayoutEach(brokenProducts, mediaVariables, JSON.parse(JSON.stringify(brokenDynamicTiles[index])))));
    let lastmTileindex = 0;

    transformedarray.forEach((tile, tileindex) => {
        if (tile.layout) {
            lastmTileindex = tileindex + 1;
        }
    });

    console.log(lastmTileindex, transformedarray);

    return transformedarray;

    // brokenProducts = transformedarray.splice(lastmTileindex - 1);

    // if (index === length - 1) {
    //     return transformedarray;
    // }

    // const nextindex = index + 1;

    // return marketingTileslayout(brokenProducts, mediaVariables, brokenDynamicTiles, length, nextindex);
}

/**
 * @description return the array of image sources for Carousel
 * @param {any} itemMedia Item Media Object
 * @returns {Array} Array of sources
 */
export function getBeautifulChoiceCarouselImages(itemMedia) {
    let images = [];
    let imageFormatURL = getUrlWithProtocol(objectPath.get(itemMedia, 'imageUrlFormat', ''));
    const mediaObjects = objectPath.get(itemMedia, 'itemMedia', []);

    imageFormatURL = imageFormatURL.replace('<Preset>', objectPath.get(window, 'tiffany.authoredContent.engagementpdp.labels.beautifulChoice.cardImgPreset', 'EcomBrowseM'));
    imageFormatURL = imageFormatURL.replace('<ImagePrefix>', objectPath.get(itemMedia, 'imagePrefix', ''));

    images = mediaObjects.map(mediaObject => {
        const mediaFileName = objectPath.get(mediaObject, 'mediaFileName', '');
        const imageUrl = imageFormatURL.replace('<ImageName>', mediaFileName);
        let replacedUrl = imageUrl;

        replacedUrl = replacedUrl.replace('&op_usm=<MediaPreset>', '');
        replacedUrl = replacedUrl.replace('&$cropN=<MediaCrop>', '');

        return {
            url: replacedUrl,
            containerId: mediaFileName,
            asset: imageUrl ? imageUrl.replace(/^.*:\/\//i, '') : ''
        };
    });
    return images;
}


/**
 * @description getCaratValue To get carat weight
 * @returns {void}
 */
export function getCaratValue(caratMapping, caratWeight, bridalSku) {
    let caratValue = '';

    if (bridalSku) {
        caratMapping.forEach(item => {
            const isSkuAvailable = item.sku ? item.sku.indexOf(bridalSku) : -1;
            const pattern = objectPath.get(item, 'pattern', []);

            if (isSkuAvailable >= 0) {
                pattern.forEach(patternItem => {
                    const caratRange = patternItem.range ? patternItem.range.split('-') : null;

                    if (caratRange && caratWeight >= parseFloat(caratRange[0], 10) && caratWeight <= parseFloat(caratRange[1], 10)) {
                        caratValue = patternItem.text.replace('{}', caratWeight);
                    }
                });
            }
        });
    }

    return caratValue;
}
