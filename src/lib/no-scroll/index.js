import domUtil from 'lib/dom/dom-util';

const $ = require('jquery');
const scrollGapClass = 'reserve-scroll-bar-gap';
const preserveSticky = 'preserve-sticky';
let scrollTop = 0;

/* eslint-disable */
export function addNoScroll(domTarget = 'body') {
    const bodyRef = domUtil.findFirst(domTarget, null);
    domUtil.addClass(bodyRef, 'no-scroll');
}

export function removeNoScroll(domTarget = 'body') {
    const bodyRef = domUtil.findFirst(domTarget, null);
    domUtil.removeClass(bodyRef, 'no-scroll');
}

// Using JS no-scroll as if we we add no-scroll, it is causing page width change
function noscroll() {
    window.scrollTo(0, 0);
}

// https: davidwells.io/snippets/disable-scrolling-with-javascript/
export function addJSNoScroll() {
    window.addEventListener('scroll', noscroll);
}

export function removeJSNoScroll() {
    window.removeEventListener('scroll', noscroll);
}

export function disableBodyScroll(disabledBy, reserveScrollBarGap = false) {
    if (!window.tiffany.bodyScrollIsDisabled) {
        window.tiffany.bodyScrollIsDisabled = true;
        window.tiffany.bodyScrollDisabledBy = disabledBy;
        domUtil.addClass(domUtil.findFirst('body', null), 'restrict-body-scroll');

        if (reserveScrollBarGap) {
            const globalBanner = domUtil.findFirst('.global-banner', null);
            const chooseCountry = domUtil.findFirst('.choose-country', null);
            let globalBannerRect;
            let chooseCountryBannerRect;
            if (globalBanner) {
                globalBannerRect = globalBanner.getBoundingClientRect();
            }
            if (chooseCountry) {
                chooseCountryBannerRect = chooseCountry.getBoundingClientRect();
            }

            if ((document.documentElement.scrollTop || window.pageYOffset) > ((globalBannerRect) ? globalBannerRect.height : 0 || (chooseCountryBannerRect) ? chooseCountryBannerRect.height : 0)) {
                $('body').addClass(preserveSticky)
            }
            scrollTop = document.documentElement.scrollTop || window.pageYOffset;
            $('body').css('top', -(document.documentElement.scrollTop || window.pageYOffset) + 'px').addClass(scrollGapClass);
        }
    }
}

export function enableBodyScroll(enabledBy, reserveScrollBarGap = true) {
    const isSafari = domUtil.hasClass(domUtil.findFirst('body'), 'safari');
    const isIpad = domUtil.hasClass(domUtil.findFirst('body'), 'iPad');

    if (window.tiffany.bodyScrollDisabledBy === enabledBy) {
        document.body.style.overflow = 'inherit';
        window.tiffany.bodyScrollIsDisabled = false;
        domUtil.removeClass(domUtil.findFirst('body', null), 'restrict-body-scroll');

        if (!reserveScrollBarGap) {
            $('body').removeClass(`${scrollGapClass} + ' ' + ${preserveSticky}`).removeAttr('style');
            if (isIpad || isSafari) {
                document.body.scrollTop = scrollTop;
            } else {
                document.documentElement.scrollTop = scrollTop;
            }
            scrollTop = 0;
        }
    }
}

/**
 * @description: This method takes care of disabling tab focus on custom scroll bar
 * @param {any} container can be html element or selector of container
 */
export function disableFocusOnCustomScrollBar(container) {
    // Waiting for react component to update
    setTimeout(() => {
        if ($(container)) {
            $(container).find('.ps__thumb-y, .ps__thumb-x').attr('tabindex', -1);
        }
    }, 100);
}

/**
 * @description function to stop vertical scroll
 * @param {string} className html element
 * @returns {void}
 */
export function stopVerticalScroll(className) {

    const _overlay = domUtil.findFirst(`.${className}`);

    let _clientY = null; // remember Y position on touch start

    _overlay.addEventListener('touchstart', function (event) {

        if (event.targetTouches.length === 1) {

            // detect single touch

            _clientY = event.targetTouches[0].clientY;

        }

    }, false);

    _overlay.addEventListener('touchmove', function (event) {

        if (event.targetTouches.length === 1) {

            // detect single touch

            disableRubberBand(event);

        }

    }, false);

    function disableRubberBand(event) {

        const clientY = event.targetTouches[0].clientY - _clientY;

        if (_overlay.scrollTop === 0 && clientY > 0) {

            // element is at the top of its scroll

            event.preventDefault();

        }

        if (isOverlayTotallyScrolled() && clientY < 0) {

            //element is at the top of its scroll

            event.preventDefault();

        }

    }

    function isOverlayTotallyScrolled() {

        // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions

        return _overlay.scrollHeight - _overlay.scrollTop <= _overlay.clientHeight;

    }
}
