import $ from 'jquery';

const matchMedia = require('lib/dom/match-media');
const stickyElements = ['.product-in-store', '.product-description_buttons', '.product-description_buttons_container', '.product-action-component'];
const stickyComponent = '.pdp-container';
const classToAdd = 'stick-element';
const stickyGutter = '.sticky-gutter';
const bufferHeight = 5;

/**
 * @description get gutter height
 * @param {boolean} elementsToCalculate elementsToCalculate
 * @param {sting} bufferHeight bufferHeight
 * @returns {void}
 */
export const getHeight = (elementsToCalculate, bufferHeight = 0) => {
    let gutterHeight = bufferHeight;

    elementsToCalculate.forEach((element) => {
        gutterHeight += (($(element).outerHeight()) ? $(element).outerHeight() : 0);
    });
    return gutterHeight;
}

/**
 * @description toggle sticky view
 * @param {boolean} makeSticky makeSticky
 * @param {boolean} disableSticky disableSticky
 * @returns {void}
 */
export function toggleStickyView(makeSticky, disableSticky) {
    let gutterHeight = 0;
    const isDestopTabletMax = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_TABLET_MAX).matches;

    if (!$(stickyComponent).hasClass('disable-sticky') || disableSticky === false) {
        if (makeSticky) {
            stickyElements.forEach((element) => {
                const eleClientRects = $(element).position();

                if (eleClientRects) {
                    const rightElementWidth = $('.product-description').width();

                    $(element).addClass(classToAdd);
                    $(element).css("width", `${rightElementWidth}px`);

                    if ($('.product-in-store') && $('.product-in-store').length && (element != '.product-in-store' || element != '.product-description_buttons') ) {
                        let elementHeight = $(element).height();
                        $('.product-in-store').css({ 'bottom': `${elementHeight}px` });
                    }
                }
            });

            if ($('.product-in-store') && $('.product-in-store').length ) {
                let stickyButtons = ['.product-description_buttons_container', '.product-action-component'];

                $(stickyButtons.join(', ')).css({ 'border': 'none', 'padding-top': '0' });
            }

            gutterHeight = getHeight(stickyElements, bufferHeight);

            $(stickyGutter).css({ height: `${gutterHeight}px` });
            if (isDestopTabletMax) {
                $('.concierge-cta').css({ 'bottom': `${gutterHeight}px` });
            } else {
                $('.concierge-cta').removeAttr('style');
            }
        } else {
                stickyElements.forEach((element) => {
                    $(element).removeClass(classToAdd);
                    $(element).removeAttr('style');
                });
                $(stickyGutter).removeAttr('style');
                $('.concierge-cta').removeAttr('style');
        }
    }
    if (disableSticky) {
        $(stickyComponent).addClass('disable-sticky');
    } else {
        $(stickyComponent).removeClass('disable-sticky');
    }
}

/**
 * @description checks pdp container in viewport and enables sticky view
 * @returns {void}
 */
export const enableStickyView = () => {
    const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;
    const pdpContainer = ($('.pdp-container') && $('.pdp-container').length > 0) ? $('.pdp-container')[0].getBoundingClientRect() : false;
    const windowHeight = $(window).height();

    if (isDesktop && pdpContainer) {
        if (Math.ceil(pdpContainer.bottom) > windowHeight) {
            toggleStickyView(true, false);
         } else {
            toggleStickyView(false, true);
         }
    }
}

/**
 * @description init sticky view
 * @returns {void}
 */

export const initStickyView = () => {
    const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;

    if (isDesktop) {
        if ($('.pdp-container') && $('.pdp-container').length > 0) {
            const images = $(stickyComponent).find('.left-element img');

            if (images.length > 0) {
                setTimeout(() => {
                    enableStickyView();
                });
            } else {
                enableStickyView();
            }
        }
    }
}

/**
 * Sticky Elements Height Calculator
 * @returns {void}
 */
export function stickyElementsHeightCalculator() {
    const collapseElements = ['.choose-country__banner', '.global-banner__body, .banner__holder', '.stick.header__nav-container', '.sticky-nav.app-js__sticky-nav'];
    let stickyElementsHeight = 0;

    collapseElements.forEach(function (selector, index) {
        if ($(selector).length && $(selector).is(':visible')) {
            stickyElementsHeight += $(selector).outerHeight();
        } else {
            stickyElementsHeight += 0;
        }
    });

    return stickyElementsHeight;
}
