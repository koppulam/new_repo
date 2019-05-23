import * as objectPath from 'object-path';
import FC from 'constants/FlyoutConstants';
import WC from 'constants/WishlistConstants';
import AEM_CONSTANTS from 'constants/AemConstants';
import * as cookieUtil from 'lib/utils/cookies';
import isEqual from 'lodash/isEqual';
import { enableBodyScroll, disableBodyScroll } from 'lib/no-scroll';

const wishListCountCookie = objectPath.get(window, 'tiffany.authoredContent.wishlistCookieName', 'saveditemscnt');
const shoppingBagCountCookie = objectPath.get(window, 'tiffany.authoredContent.bagCookieName', 'shoppingbagcnt');
const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');
const webCustomerId = cookieUtil.getCookies(cookieName);

const initialState = {
    itemsList: [],
    savedItems: [],
    customSavedItems: [],
    customItemsList: [],
    accountData: null,
    wishListInitialized: !!webCustomerId,
    bagInitialized: !!webCustomerId,
    customWishListInitialized: !!webCustomerId,
    flyoutType: '',
    flyoutInitCallDone: false,
    flyoutInitShoppingCallDone: false,
    shoppingBagCount: Number(cookieUtil.getCookies(shoppingBagCountCookie)) || 0
};

try {
    initialState.customItemsList = JSON.parse(cookieUtil.getCookies('customBagItemsReduce', { encode: true }));
    initialState.bagInitialized = true;
} catch (err) {
    initialState.customItemsList = [];
    initialState.bagInitialized = true;
}

try {
    initialState.savedItems = JSON.parse(cookieUtil.getCookies('savedItemsReduce', { encode: true }));
    initialState.wishListInitialized = true;
} catch (err) {
    initialState.savedItems = [];
    initialState.wishListInitialized = true;
}

try {
    initialState.customSavedItems = JSON.parse(cookieUtil.getCookies('customSavedItemsReduce', { encode: true }));
    initialState.customWishListInitialized = true;
} catch (err) {
    initialState.customSavedItems = [];
    initialState.customWishListInitialized = true;
}

// try {
//     const engagmentReduce = JSON.parse(cookieUtil.getCookies('engagmentReduce', { encode: true }));

//     initialState.itemsList = {
//         items: []
//     };
//     initialState.itemsList.items = engagmentReduce.map(item => { return { item }; });
//     initialState.flyoutInitShoppingCallDone = true;
// } catch (err) {
//     initialState.itemsList = [];
//     initialState.flyoutInitShoppingCallDone = true;
// }

const scrollDisablers = [];

/**
 * Render Component.
 * @param {object} previousState default previousState data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
export default function flyoutReducer(previousState = initialState, action) {
    const items = objectPath.get(action.payload, 'itemsList', []);
    const savedItems = objectPath.get(action.payload, 'savedItems', []);
    const customItems = objectPath.get(action.payload, 'itemsList.customItems', []);
    const accountData = objectPath.get(action.payload, 'accountData');
    const wishlistItems = objectPath.get(action.payload, 'resultDto');
    const bagInitialized = previousState.bagInitialized || true;

    switch (action.type) {
        case FC.SET_WISHLIST_FLYOUT:
            return {
                ...previousState,
                isWishlistOpen: !previousState.isWishlistOpen
            };
        case FC.RESET_SHOPPING_BAG_INITIALZE:
            return {
                ...previousState,
                bagInitialized: false
            };
        case FC.RESET_WISHLIST_INITIALZE:
            return {
                ...previousState,
                wishListInitialized: false
            };
        case FC.BAG_COUNT_FETCHED:
            return {
                ...previousState,
                shoppingBagCount: action.count
            };
        case FC.SHOPPING_BAG_FETCHED: {
            let shoppingBagCount = 0;

            if (items.items) {
                const quantity = items.items.map(item => item.quantity).reduce((a, b) => a + b, 0);

                shoppingBagCount = quantity + customItems.length;
            } else {
                shoppingBagCount = customItems.length;
            }
            cookieUtil.setCookie('customBagItemsReduce', JSON.stringify(customItems.map(item => { return { designId: item.designId }; })), { secure: true, encode: true });
            cookieUtil.setCookie(shoppingBagCountCookie, String(shoppingBagCount), { secure: true });
            return {
                ...previousState,
                itemsList: items,
                customItemsList: customItems,
                bagInitialized,
                shoppingBagCount,
                flyoutInitShoppingCallDone: true
            };
        }
        case FC.SHOPPING_BAG_FETCH_FAILED:
            cookieUtil.setCookie('customBagItemsReduce', JSON.stringify([]), { secure: true, encode: true });
            cookieUtil.setCookie(shoppingBagCountCookie, '0', { secure: true });
            return {
                ...previousState,
                itemsList: [],
                customItemsList: [],
                bagInitialized,
                shoppingBagCount: 0,
                flyoutInitShoppingCallDone: true
            };
        case FC.SHOPPING_BAG_CUSTOM_ITEM_REMOVED:
            cookieUtil.setCookie(shoppingBagCountCookie, String(customItems.length + previousState.itemsList.items.length), { secure: true });
            return { ...previousState, customItemsList: customItems };
        case FC.WISHLIST_FETCHED_COMPLETE:
            cookieUtil.setCookie('savedItemsReduce', JSON.stringify(savedItems.map(item => { return { isVisible: item.isVisible }; })), { secure: true, encode: true });
            cookieUtil.setCookie(wishListCountCookie, String(savedItems.length + previousState.customSavedItems.length), { secure: true });
            return {
                ...previousState,
                savedItems,
                wishListInitialized: true,
                flyoutInitCallDone: true
            };
        case FC.WISHLIST_FETCH_FAILED:
            cookieUtil.setCookie('savedItemsReduce', JSON.stringify([]), { encode: true, secure: true });
            cookieUtil.setCookie(wishListCountCookie, String(previousState.customSavedItems.length), { secure: true });
            return {
                ...previousState,
                savedItems: [],
                wishListInitialized: true,
                flyoutInitCallDone: true
            };
        case WC.WISHLIST_FETCHED:
            cookieUtil.setCookie('savedItemsReduce', JSON.stringify(wishlistItems.map(item => { return { isVisible: item.isVisible, listItemIDs: item.listItemIDs }; })), { secure: true, encode: true });
            cookieUtil.setCookie(wishListCountCookie, String(wishlistItems.length + previousState.customSavedItems.length), { secure: true });
            return {
                ...previousState,
                savedItems: wishlistItems,
                wishListInitialized: true,
                flyoutInitCallDone: true
            };
        case WC.WISHLIST_DELETE: {
            const deleteListId = action.payload;
            const updatedItems = previousState.savedItems.filter(item => {
                return !isEqual(item.listItemIDs, deleteListId);
            });

            cookieUtil.setCookie('savedItemsReduce', JSON.stringify(updatedItems.map(item => { return { isVisible: item.isVisible, listItemIDs: item.listItemIDs }; })), { secure: true, encode: true });
            cookieUtil.setCookie(wishListCountCookie, String(updatedItems.length + previousState.customSavedItems.length), { secure: true });
            return { ...previousState, savedItems: updatedItems, wishListInitialized: true };
        }
        case FC.WISHLIST_ITEM_REMOVED:
            cookieUtil.setCookie('savedItemsReduce', JSON.stringify(savedItems.map(item => { return { isVisible: item.isVisible }; })), { secure: true, encode: true });
            cookieUtil.setCookie(wishListCountCookie, String(savedItems.length + previousState.customSavedItems.length), { secure: true });
            return { ...previousState, savedItems };
        case FC.ACCOUNT_DETAILS_FETCHED:
            return { ...previousState, accountData };
        case FC.CUSTOM_WISHLIST_FETCHED:
            cookieUtil.setCookie('customSavedItemsReduce', JSON.stringify((action.payload || []).map(item => { return { designID: item.designID, isVisible: item.isVisible }; })), { secure: true, encode: true });
            cookieUtil.setCookie(wishListCountCookie, String(previousState.savedItems.length + (action.payload || []).length), { secure: true });
            return { ...previousState, customSavedItems: action.payload || [], customWishListInitialized: true };
        case FC.CUSTOM_WISHLIST_FAILED:
            cookieUtil.setCookie('customSavedItemsReduce', JSON.stringify([]), { secure: true, encode: true });
            cookieUtil.setCookie(wishListCountCookie, String(previousState.savedItems.length), { secure: true });
            return { ...previousState, customSavedItems: [], customWishListInitialized: true };
        case FC.UPDATE_FLYOUT_HOLDER:
            if (action.payload) {
                disableBodyScroll(action.payload, true);
                if (scrollDisablers.indexOf(action.payload) === -1) {
                    scrollDisablers.push(action.payload);
                }
            } else if (scrollDisablers.indexOf(window.tiffany.bodyScrollDisabledBy) !== -1) {
                enableBodyScroll(window.tiffany.bodyScrollDisabledBy, false);
            }

            if (action.payload !== previousState.flyoutType) {
                return { ...previousState, flyoutType: action.payload };
            }
            return previousState;
        case FC.INIT_PROCESS_TRIGGERED:
            return { ...previousState, flyoutInitCallDone: true };
        case AEM_CONSTANTS.INVALID_COOKIE_RESET: {
            // cookieUtil.setCookie('customSavedItemsReduce', JSON.stringify([]), { secure: true, encode: true });
            // cookieUtil.setCookie(wishListCountCookie, String(previousState.savedItems.length), { secure: true });
            // cookieUtil.setCookie('savedItemsReduce', JSON.stringify([]), { encode: true, secure: true });
            // cookieUtil.setCookie(wishListCountCookie, String(previousState.customSavedItems.length), { secure: true });
            // cookieUtil.setCookie('customBagItemsReduce', JSON.stringify([]), { secure: true, encode: true });
            // cookieUtil.setCookie(shoppingBagCountCookie, '0', { secure: true });
            return {
                ...previousState,
                itemsList: [],
                customItemsList: [],
                savedItems: [],
                customSavedItems: [],
                shoppingBagCount: 0,
                flyoutInitShoppingCallDone: true
            };
        }
        case FC.CUSTOM_WISHLIST_REMOVED:
        default:
            return previousState;
    }
}
