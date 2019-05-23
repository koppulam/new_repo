/**
 * Validates the visibility of an element.
 *
 * @module dom
 * @version 1.0.0
 * @since Thu Jan 14 2016
 */
'use strict';

/**
 * Validates if the element is visible. Will validate visibility of every parent.
 *
 * @param  {DOMElement} el
 * @returns {boolean} Returns `true` if all elements in `el` scope are visible.
 */
function isVisible(el) {
    return el.offsetParent !== null;
}

module.exports = isVisible;
