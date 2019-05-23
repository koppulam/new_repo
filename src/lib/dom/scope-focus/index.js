/**
 * When the user tabs to the next selectable element, it will remain within the
 * DOM scope. When first initialized, the first selectable element will be
 * focused.
 *
 * @module dom
 * @version 1.0.0
 * @since Thu Sep 1 2016
 */

'use strict';

// dependencies
const filter = require('lodash.filter');
const keyCode = require('lib/dom/keyboard/key-code');
const isChildOf = require('lib/dom/is-child-of');
const isVisible = require('lib/dom/is-visible');
// const $ = require('jquery');

/**
 * The limited DOM scope.
 * @type {HTMLElement}
 */
let currentTarget = null;

/**
 * The limited DOM scope.
 * @type {HTMLElement}
 */
let firstTarget = null;

/**
 * All selectable child elements within `currentTarget`.
 * @type {NodeList}
 */
let selectableEls = null;

/**
 * The current focued element within `selectableEls`.
 * @type {HTMLElement}
 */
let currentFocused = null;

/**
 * Return a list of focusable elements, which are visible within the scope.
 *
 * @returns {Array}
 */
function getVisibleElements() {
    return filter(selectableEls, isVisible);
}

/**
 * Update `currentFocused` element.
 *
 * @param  {HTMLElement | undefined} opt_el opt ele
 * @returns {void}
 */
function updateCurrentFocus(opt_el) {
    currentFocused = opt_el || document.activeElement;
}

/**
 * Focus either the first or last element in the scope depending on which was
 * last focused.
 * @returns {void}
 */
function focusNewTarget() {
    // Grab visible everytime since the view can change, for ex the sign in modal
    // has "Sign In" and "Create Account" toggler.

    const elList = getVisibleElements();

    if (elList.length < 1) {
        return;
    }

    const first = elList[0];
    const last = elList[elList.length - 1];

    if (currentFocused === first) {
        updateCurrentFocus(last);
    } else if (currentFocused === last) {
        updateCurrentFocus(first);
    }

    if (document.activeElement && document.activeElement.classList.contains('button-hidden')) {
        updateCurrentFocus(first);
    }

    currentFocused.focus();
}

/**
 *  @description If the current active element is within our scope, update `currentFocused`.
 * Otherwise find a new target within the scope to focus.
 * @returns {void}
 */
function validateFocuedTarget() {
    if (isChildOf(currentTarget, document.activeElement) && !document.activeElement.classList.contains('button-hidden')) {
        updateCurrentFocus();
        return;
    }
    focusNewTarget();
}

/**
 * If the key is the tab, update the focused target.
 *
 * @param  {object} event event
 * @returns {void}
 */
function onKeyUp(event) {
    if (keyCode.isTab(event)) {
        event.preventDefault();
        validateFocuedTarget();
    }
}

/**
 * Focus the current element.
 * @returns {void}
 */
function focusFirstTarget() {
    if (currentFocused) {
        currentFocused.focus();
    }
}

/**
 * Find all focusable elements within the scope and focus the first one.
 * @param {Function} callBack callback to be called after setting focus
 * @returns {void}
 */
function findAnfocusFirstTarget(callBack = () => { }) {
    selectableEls = currentTarget.querySelectorAll('video, select, textarea, area, a, input:not([type=hidden]), button, [tabindex="0"]');
    if (selectableEls.length < 1) {
        return;
    }
    updateCurrentFocus(firstTarget || selectableEls[0]);
    setTimeout(() => {
        focusFirstTarget();
        callBack();
    }, 100);
}

/**
 * Start the DOM listeners.
 * @returns {void}
 */
function addListeners() {
    document.addEventListener('keyup', onKeyUp);
}

/**
 * Set the new limited scope we want to stay within.
 *
 * @param {HTMLElement} el The new DOM scope.
 * @param {HTMLElement} firstEL first element
 * @param {Function} callBack callBack function
 * @returns {void}
 */
exports.setScopeLimit = function setScopeLimit(el, firstEl, callBack = () => { }) {
    currentTarget = el;
    firstTarget = firstEl;
    addListeners();
    findAnfocusFirstTarget(callBack);
};

/**
 * Dispose all elements and listeners.
 * @returns {void}
 */
exports.dispose = function dispose() {
    currentTarget = null;
    selectableEls = null;
    currentFocused = null;
    document.removeEventListener('keyup', onKeyUp);
};
