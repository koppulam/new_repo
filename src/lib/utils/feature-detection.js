'use strict';

/**
 * Triggers all the featuresDetection functions on DOM ready
 * @returns {void}
 */
function featuresDetection() {
}

/**
 * Triggers all the functions that are required on resize
 * @returns {void}
 */
function triggerMethodsOnResize() {
}

/**
 * @description onPageLoad Triggers all the functions that are required on page load.
 * @returns {void}
 */
function onPageLoad() {
    featuresDetection();
}

/**
 * @description onWindowLoad Triggers all the functions that are required on window load.
 * @returns {void}
 */
function onWindowLoad() {

}

/**
 * Triggers fallback functions on DOM ready event
 * @param  {Object} function callback
 */
jQuery(document).ready(onPageLoad);

/**
 * Triggers functions on window resize
 * @param  {Object} function callback
 */
jQuery(window).on('resize', triggerMethodsOnResize);

/**
 * Triggers functions on window onload
 * @param  {Object} function callback
 */
jQuery(window).on('load', onWindowLoad);
