/**
 * A helper function to bind listeners to media queries.
 *
 * @module dom.match-media
 * @version 1.0.0
 * @since Thu Dec 10 2015
 */
'use strict';

var values = require('lodash/values');

function matchMedia() {
    /**
     * Instance being returned
     * @type {Object}
     */
    var instance = {};

    /**
     * Key-Value map of breakpoints and corresponding MediaQueryList objects
     * @type {Object}
     */
    var mediaQueryListMap = {};

    /**
     * Mobile: Small
     * min: 320 portrait
     * max: 600 landscape
     * Tablet: Medium
     * 601 - 800 portrait
     * Tablet landscape / Desktop: Large
     * 801 - 1200
     * Desktop: xLarge
     * 1201 - 1600
     */

    /**
     * Breakpoints that components can register listeners against
     * @type {Object}
     */
    var BREAKPOINTS = {
        'LANDSCAPE': 'only screen and (orientation: landscape)',
        'PORTRAIT': 'only screen and (orientation: portrait)',
        'MOBILE': 'only screen and (max-width: 37.5em)',
        'IPAD_AND_ABOVE': 'only screen and (min-width: 48em)',
        'IPAD_AND_BELOW': 'only screen and (max-width: 47.938em)',
        'TABLET_AND_BELOW': 'only screen and (max-width: 50em)',
        'TABLET': 'only screen and (min-width: 37.5625em) and (max-width: 50em)',
        'TABLET_AND_ABOVE': 'only screen and (min-width: 37.5625em)',
        'DESKTOP_AND_BELOW': 'only screen and (max-width: 56.25em)',
        'DESKTOP': 'only screen and (min-width: 50.0625em) and (max-width: 75em)',
        'DESKTOP_AND_ABOVE': 'only screen and (min-width: 56.25em)',
        'DESKTOP_AND_TABLET_MAX': 'only screen and (min-width: 56.20em) and (max-width: 82.875em)',
        'XLARGE_AND_ABOVE': 'only screen and (min-width: 75.0625em)',
        'RETINA': 'only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx)',
        'BETWEEN_DESKTOP_TABLET': 'only screen and (min-width: 50em) and (max-width: 61.875em)',
        'BELOW_DESKTOP_TABLET': 'only screen and (max-width: 64em)',
        'BELOW_EXACT_DESKTOP_TABLET': 'only screen and (max-width: 63.938em)'
    };

    Object.defineProperty(instance, 'BREAKPOINTS', {
        value: BREAKPOINTS,
        enumerable: true
    });


    /**
     * Checks if the breakpoint in the map.
     *
     * @return {Boolean} breakpoint exists in the map or not
     */
    var hasBreakpoint = function (breakpoint) {
        var breakpoints = values(BREAKPOINTS);
        return breakpoints.indexOf(breakpoint) !== -1;
    };

    /**
     * Attaches listener for the specified breakpoint.
     *
     * @param {String}      breakpoint  breakpoint to attach listener to.
     * @param {Function}    listener   listener function to be called when media query matches.
     */
    instance.addListener = function (breakpoint, listener) {
        if (!hasBreakpoint(breakpoint) || typeof listener !== 'function') {
            return false;
        }
        var queryList = mediaQueryListMap[breakpoint];
        /* istanbul ignore if */
        if (!queryList) {
            return false;
        }
        /* istanbul ignore next */
        queryList.addListener(function (mql) {
            listener(mql.matches);
        });
        return true;
    };

    /**
     * Removes listener from the specified breakpoint.
     *
     * @param {String}   breakpoint     breakpoint to remove the listener from.
     * @param {Function} listener       listener function to be called when media query matches.
     */
    instance.removeListener = function (breakpoint, listener) {
        if (!hasBreakpoint(breakpoint) || typeof listener !== 'function') {
            return false;
        }
        var queryList = mediaQueryListMap[breakpoint];
        /* istanbul ignore if */
        if (!queryList) {
            return false;
        }
        queryList.removeListener(listener);
        return true;
    };

    /**
     * Checks if the breakpoint matches.
     *
     * @param  {String} breakpoint breakpoint to check.
     * @return {Boolean}           breakpoint matches or not.
     */
    instance.matches = function (breakpoint) {
        if (!hasBreakpoint(breakpoint)) {
            return false;
        }
        return mediaQueryListMap[breakpoint].matches;
    };

    /**
     * Checks if the breakpoint matches.
     *
     * @param  {String} breakpointKey key in BREAKPOINTS
     * @return {Boolean}              breakpoint matches or not
     */
    instance.matchesBreakpoint = function (breakpointKey) {
        return !!(BREAKPOINTS[breakpointKey] && instance.matches(BREAKPOINTS[breakpointKey]));
    };

    //Creating the map of MediaQueryList objects
    for (var key in BREAKPOINTS) {
        /* istanbul ignore else */
        if (BREAKPOINTS.hasOwnProperty(key)) {
            var breakpoint = BREAKPOINTS[key];
            mediaQueryListMap[breakpoint] = window.matchMedia(breakpoint);
        }
    }

    return instance;
}

/**
 * @exports MatchMedia Singleton
 */
module.exports = matchMedia();
