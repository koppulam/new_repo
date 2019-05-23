import WC from 'constants/WishlistConstants';
import FC from 'constants/FlyoutConstants';
import AEM_CONSTANTS from 'constants/AemConstants';

import * as objectPath from 'object-path';
import * as cookieUtil from 'lib/utils/cookies';

let initialState;

try {
    initialState = JSON.parse(cookieUtil.getCookies('wishlistreduced', { encode: true }));
} catch (err) {
    initialState = {
        skuId: [],
        isAddtoWishlist: false,
        groupTypeList: [],
        listId: {}
    };
}

/**
 * Extracts sku id's from wishlist and appends to payload
 * @param {object} state default state data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
export default function wishlistReducer(state = initialState, action) {
    switch (action.type) {
        case FC.WISHLIST_FETCHED_COMPLETE:
        case FC.WISHLIST_ITEM_REMOVED: {
            const response = {};
            const wishlist = action.payload.savedItems;
            const groupTypeList = [];

            if (wishlist.length > 0) {
                const skuId = [];

                response.listId = {};

                wishlist.forEach(item => {
                    if (item.groupType && parseInt(item.groupType, 10) === 2 && item.parentGroupSKU) {
                        skuId.push(item.parentGroupSKU.toString().trim());
                        groupTypeList.push(item.parentGroupSKU.toString().trim());
                        response.listId[item.parentGroupSKU.toString().trim()] = item.listItemIDs;
                    } else if (item.isGroup && !(item.sku && item.sku !== 0) && parseInt(item.groupType, 10) !== 2) {
                        skuId.push(item.groupSku.toString().trim());
                        response.listId[item.groupSku.toString().trim()] = item.listItemIDs;
                    } else {
                        skuId.push(item.sku.toString());
                        response.listId[item.sku.toString()] = item.listItemIDs;
                    }
                });

                objectPath.set(response, 'skuId', skuId);
            } else {
                objectPath.set(response, 'skuId', []);
            }

            objectPath.set(response, 'groupTypeList', groupTypeList);
            cookieUtil.setCookie('wishlistreduced', JSON.stringify(response), { secure: true, encode: true });
            return response;
        }
        case WC.WISHLIST_FETCHED: {
            const response = {};
            const wishlist = action.payload.resultDto || [];
            const groupTypeList = [];

            if (wishlist.length > 0) {
                const skuId = [];

                response.listId = {};

                wishlist.forEach(item => {
                    if (item.groupType && parseInt(item.groupType, 10) === 2 && item.parentGroupSKU) {
                        skuId.push(item.parentGroupSKU.toString().trim());
                        groupTypeList.push(item.parentGroupSKU.toString().trim());
                        response.listId[item.parentGroupSKU.toString().trim()] = item.listItemIDs;
                    } else if (item.isGroup && !(item.sku && item.sku !== 0) && parseInt(item.groupType, 10) !== 2) {
                        skuId.push(item.groupSku.toString().trim());
                        response.listId[item.groupSku.toString().trim()] = item.listItemIDs;
                    } else {
                        skuId.push(item.sku.toString());
                        response.listId[item.sku.toString()] = item.listItemIDs;
                    }
                });

                objectPath.set(response, 'skuId', skuId);
            } else {
                objectPath.set(response, 'skuId', []);
            }

            objectPath.set(response, 'groupTypeList', groupTypeList);
            cookieUtil.setCookie('wishlistreduced', JSON.stringify(response), { secure: true, encode: true });
            return response;
        }
        case WC.WISHLIST_DELETE: {
            const deleteListId = action.payload;
            let { skuId = [], groupTypeList = [] } = JSON.parse(JSON.stringify(state));
            const { listId = {} } = JSON.parse(JSON.stringify(state));
            let deleteSku;

            Object.keys(listId).forEach(key => {
                if (listId[key].length && deleteListId.length && listId[key][0] === deleteListId[0]) {
                    deleteSku = key;
                }
            });

            skuId = skuId.filter(sku => { return sku && deleteSku && sku.toString() !== deleteSku.toString(); });
            groupTypeList = groupTypeList.filter(sku => { return sku && deleteSku && sku.toString() !== deleteSku.toString(); });
            cookieUtil.setCookie('wishlistreduced', JSON.stringify({ skuId, groupTypeList, listId }), { secure: true, encode: true });
            return { ...state, skuId, groupTypeList };
        }
        case AEM_CONSTANTS.INVALID_COOKIE_RESET:
        case WC.WISHLIST_FAILED:
            cookieUtil.setCookie('wishlistreduced', JSON.stringify({
                skuId: [],
                groupTypeList: [],
                listId: {}
            }), { secure: true, encode: true });
            return {
                skuId: [],
                groupTypeList: [],
                listId: {}
            };

        default:
            return state;
    }
}
