/**
 * Helps validate if a property is either 'false' or false. Used for inconsistent
 * json response data.
 *
 * @module util
 * @version 1.0.0
 * @since Thu Jul 14 2016
 */
'use strict';

/**
 * @description Validates if `value` is either `'false'` or `false` or undefined or 'undefined' or null or 'null'
 * @param  {*} value The value to check.
 * @returns {Boolean}
 */
function isFalse(value) {
    return value === 'false'
    || value === false
    || value === 'null'
    || value === null
    || value === undefined
    || value === 'undefined'
    || value === '';
}

module.exports = isFalse;
