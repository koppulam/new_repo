/**
 * Cookie utilities to SET, GET and DELETE cookie
 * Extends "JS-COOKIE" package
 *
 * @module Cookies
 * @version 1.0.0
 * @since Thu Jun 07 2018
 */

'use strict';

import * as Cookies from 'js-cookie';
import * as objectPath from 'object-path';

/**
 * @description Function to set cookie
 * @param   {String} name cookie name as a parameter.
 * @param   {String} value cookie value as a parameter.
 * @param   {Object} options options to set domain,secure,expiration etc...
 * @param   {Boolean} setDate Check to set expiration date.
 * @returns  {String} returns passed in cookie value
 */
export const setCookie = (name, value, options, setDate) => {
    if (name && value && options) {
        let newvalue = value;
        const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');

        if (options && options.encode) {
            newvalue = btoa(value);
        }
        // set expiry date to 'mysid2' cookie with configured value
        if (setDate && cookieName === name) {
            const expiryYears = objectPath.get(window, 'tiffany.authoredContent.expiryYears', 20); // 20 years
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const day = currentDate.getDate();
            const futureDate = new Date(year + parseInt(expiryYears, 10), month, day);
            const timeDiff = Math.abs(futureDate.getTime() - currentDate.getTime());
            const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            options.expires = diffDays;
            Cookies.set('sid2Timestamp', currentDate, { secure: true, expires: diffDays });
        }

        Cookies.set(name, newvalue, options);
        return;
    }

    if (name && value) {
        let newvalue = value;

        if (options && options.encode) {
            newvalue = btoa(value);
        }

        Cookies.set(name, newvalue);
    }
};

/**
 * Function to get cookies
 * @param   {String} name
 * @return  {Array} returns  cookies
 */
export const getCookies = (name, options) => {
    if (name) {
        if (options && options.encode) {
            try {
                return atob(Cookies.get(name));
            } catch (err) {
                return Cookies.get(name);
            }
        }
        return Cookies.get(name);
    }

    return Cookies.get();
};

/**
 * Function to remove cookie
 * @param   {String} name
 * @param   {Object} options
 */
export const removeCookie = (name, options) => {
    if (name && options) {
        Cookies.remove(name, options);
        return;
    }

    if (name) {
        Cookies.remove(name);
    }
};

/**
 * Function to check validity of cookie
 */
export const checkCustomerCookieValidity = () => {
    const sidTimeCookie = Cookies.get('sid2Timestamp');
    const cronJobTimeInDays = objectPath.get(window, 'tiffany.authoredContent.cronJobTimeInDays', 30);
    const wishListCountCookie = objectPath.get(window, 'tiffany.authoredContent.wishlistCookieName', 'saveditemscnt');
    const shoppingBagCountCookie = objectPath.get(window, 'tiffany.authoredContent.bagCookieName', 'shoppingbagcnt');
    const currentDate = new Date();
    const timestampDate = new Date(sidTimeCookie);
    const timeDiff = Math.abs(currentDate.getTime() - timestampDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (parseInt(diffDays, 10) > parseInt(cronJobTimeInDays, 10)) {
        removeSidCookies();

    }
};

/**
 * Function to remove sid related cookies
 */
export const removeSidCookies = () => {
    removeCookie(objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2'));
    removeCookie('sid2Timestamp');
    removeCookie('customBagItemsReduce');
    removeCookie('savedItemsReduce');
    removeCookie('customSavedItemsReduce');
    removeCookie('engagmentReduce');
    removeCookie('wishlistreduced');
    removeCookie(objectPath.get(window, 'tiffany.authoredContent.wishlistCookieName', 'saveditemscnt'));
    removeCookie(objectPath.get(window, 'tiffany.authoredContent.bagCookieName', 'shoppingbagcnt'));
    removeCookie(objectPath.get(window, 'tiffany.authoredContent.preferredStoreConfig.cookieName', 'preferredStore'));
};
