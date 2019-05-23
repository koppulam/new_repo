/**
 * @module dom
 * @version 1.0.0
 * @since Sun Jun 19 2016
 */
'use strict';

var getKeyCode = require('lib/dom/keyboard/get-key-code');

/**
 * Validates that either `event.which` or `event.keyCode` is matching `code`.
 *
 * @param  {object}  event
 * @param  {number}  code
 * @param  {object}  options
 * @param  {boolean} options.prevent
 * @return {boolean}
 */
exports.is = handler(function(event, code) {
    return getKeyCode(event) === code;
});

/**
 * Validates if the key code of the event is equal to the code for down array.
 *
 * @param {object}  event
 * @param {object}  options
 * @param {boolean} options.prevent
 * @return {boolean}
 */
exports.isArrowDown = handler(function(event) {
    return exports.is(event, 40);
});

/**
* Validates if the key code of the event is equal to the code for up array.
 *
 * @param {object}  event
 * @param {object}  options
 * @param {boolean} options.prevent
 * @return {boolean}
 */
exports.isArrowUp = handler(function(event) {
    return exports.is(event, 38);
});

/**
 * Validates if the key code of the event is an esc code.
 *
 * @param {object}  event
 * @param {object}  options
 * @param {boolean} options.prevent
 * @return {boolean}
 */
exports.isEsc = handler(function(event) {
    return exports.is(event, 27);
});

/**
 * Validates if the key code of the event is either a spacebar or enter code.
 *
 * @param {object}  event
 * @param {object}  options
 * @param {boolean} options.prevent
 * @return {boolean}
 */
exports.isEnter = handler(function(event) {
    return exports.is(event, 13);
});

/**
 * Validates if the key code of the event is the spacebar.
 *
 * @param {object}  event
 * @param {object}  options
 * @param {boolean} options.prevent
 * @return {boolean}
 */
exports.isSpace = handler(function(event) {
    return exports.is(event, 32);
});

/**
 * Validates if the key code of the event is either a spacebar or enter code.
 *
 * @param {object}  event
 * @param {object}  options
 * @param {boolean} options.prevent
 * @return {boolean}
 */
exports.isSpaceOrEnter = handler(function(event) {
    return exports.isEnter(event) || exports.isSpace(event);
});

/**
 * Validates if the key code of the event is the tab key.
 *
 * @param {object}  event
 * @param {object}  options
 * @param {boolean} options.prevent
 * @return {boolean}
 */
exports.isTab = handler(function(event) {
    return exports.is(event, 9);
});

/**
 * A default handler method that first deals with the validation, then goes
 * over to any options that might have bene specified.
 *
 * @param  {Function} fn The validation method.
 * @return {Function}
 */
function handler(fn) {
    return function(event) {
        if (!fn.apply(undefined, arguments)) {
            return false;
        }
        var options = arguments[2] || arguments[1];
        if (options && options.prevent) {
            event.preventDefault();
        }
        return true;
    };
}
