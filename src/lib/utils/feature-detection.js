'use strict';

const objectFitImages = require('object-fit-images');

// import focusWithin from 'focus-within';

import styleVariables from 'lib/utils/breakpoints';
// import { toggleStickyCart } from 'lib/utils/sticky-cart';
// import { initStickyView, enableStickyView } from 'lib/utils/sticky-view-util';
import 'slick-carousel';
import { pageNotFoundCheck } from 'lib/utils/analytics-util';
import initCustomEvents from 'lib/events/custom-event-init';
import * as objectPath from 'object-path';
import * as cookieUtil from 'lib/utils/cookies';
import detectIE from 'lib/utils/detect-ie-util';
import fetch from 'isomorphic-fetch';
import detectBrowser from 'lib/utils/browser-detection-util';
import { restrictUserScalability, releaseUserScalability } from 'lib/utils/meta-tag';
import { initScrollBar } from 'lib/dom/custom-scrollbar';

const browserInfo = detectBrowser();
const $ = require('jquery');
const LazyLoad = require('vanilla-lazyload');
const Blaze = require('blazy');
const picturefill = require('picturefill');
const matchMedia = require('lib/dom/match-media');
const getDataAttributes = require('lib/dom/get-data-attributes');
const parser = require('ua-parser-js');
const aos = require('aos');
const analyticsEvents = require('lib/utils/analytics-util');
const { triggerAnalyticsEvent } = analyticsEvents;
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import ApiUtils from 'lib/api';

/**
 * @description handles the sticky nav on window scroll
 * @returns {void}
 */
function handleStickyNavOnScroll() {
    const $body = $('body');
    const bannerHeight = $('.global-banner').height() ? $('.global-banner').height() : 0;
    const countryBannerHeight = $('.choose-country').height() ? $('.choose-country').height() : 0;
    const computedHeight = bannerHeight + countryBannerHeight;

    if ((computedHeight !== 0 && window.pageYOffset >= bannerHeight + countryBannerHeight) || (computedHeight === 0 && window.pageYOffset > 0) || ($('body').hasClass('preserve-sticky'))) {
        $body.addClass('fixed-header');
    } else {
        $body.removeClass('fixed-header');
    }
}

/**
 * scroll to top of page.
 * @returns {void}
 */
function initScrollToTop() {

    // add window scroll listener
    $(window).on('scroll', () => {
        handleStickyNavOnScroll();
    });
}

/**
 * Set Dropdown width
 * @param {object} dropElement dom element
 * @param {string} dropClass class to be used
 * @returns {void}
 */
export function setDropdownWidth(dropElement, dropClass) {
    const tempDiv = $(`<select class='${dropClass} temp-select-width' style='visibility: hidden;position:fixed;left: 0;'>
                    <option selected>${dropElement.find('option:selected').text()}</option>
                </select>`);

    dropElement.after(tempDiv);
    dropElement.css({ width: tempDiv.outerWidth() });
    tempDiv.remove();
}

/**
 * sets text position for hero banners.
 * @returns {void}
 */
export function setTextPosition() {
    $('.adjust-position, .adjust-position-mobile, .foreground-image').each(function () {
        const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;
        const $this = $(this);
        const imagePositions = getDataAttributes($this[0]);

        if (isDesktop) {
            $this.css({
                'top': imagePositions.posTop,
                'left': imagePositions.posLeft
            });
            if (imagePositions && imagePositions.colWidth) {
                $this.css({
                    'width': imagePositions.colWidth
                });
            } else {
                $this.css({
                    'width': ''
                });
            }
        } else {
            $this.css({
                'top': imagePositions.mobilePosTop,
                'left': imagePositions.mobilePosLeft,
                'width': '100%'
            });
        }
        $this.addClass('show');
    });
}

/**
 * Initialize the sticky nav
 */
function initializeStickyNav() {
    const $stickyNav = $('.sticky-nav');
    const $body = $('body');
    if (!$stickyNav.length) {
        $body.removeClass('with-sticky-nav');
        return;
    }
    $stickyNav.find('.sticky-nav__container').StickyNav();
    $body.addClass('with-sticky-nav');
}

/**
 * Initialize Browser Detection
 */
function initBrowserDetection() {
    const agent = new parser().getResult();

    $('body').addClass(agent.os.name.toLowerCase().split(' ').join('-'));
    $('body').addClass(agent.os.version.toLowerCase().split(' ').join('-'));
    $('body').addClass(agent.device.model);

    switch (agent.browser.name) {
        case 'IE':
            $('body').addClass('ie');
            break;
        case 'Chrome':
            $('body').addClass('chrome');
            break;
        case 'Firefox':
            $('body').addClass('firefox');
            break;
        case 'Safari':
            $('body').addClass('safari');
            break;
        default:
            break;
    }
    initCustomScroll();
}

/**
* @description Slider updated event
* @param {object} event event
* @param {object} slick slick object
* @param {number} currentSlide currentSlide
* @returns {void};
*/
function sliderUpdated(event, slick) {
    const currentSlideNum = slick.currentSlide;
    const currentSlideObj = slick.$slides ? slick.$slides[currentSlideNum] : null;

    if (currentSlideObj) {
        const videoTag = currentSlideObj.getElementsByTagName('video');

        const $body = $('body');

        if ((browserInfo.os.name === 'Windows' || browserInfo.os.name === 'Macintosh') && (!($body.hasClass('ie')))) {
            currentSlideObj.focus({
                preventScroll: true
            });
        }
        if (videoTag && videoTag.length > 0) {
            if (videoTag[0].hasAttribute('autoplay')) {
                videoTag[0].play();
            }
        }
    }
}

/**
* @description Slider init event
* @param {object} event event
* @param {object} slick slick object
* @returns {void};
*/
function sliderInitiated(event, slick) {
    sliderUpdated(event, slick);
    sliderArrowsUpdate(event, slick, 0, 0);
}

/**
* @description Before Slider update event
* @param {object} event event
* @param {object} slick slick object
* @param {number} currentSlide currentSlide
* @param {number} nextSlide nextSlide
* @returns {void};
*/
function sliderArrowsUpdate(event, slick, currentSlide, nextSlide) {
    if (slick && event && event.target) {
        const totalSlides = slick.slideCount;
        const target = $(event.target);

        if (nextSlide === 0) {
            target.removeClass('prev-arrow-visible');
            target.removeClass('both-arrows-visible');
            target.addClass('next-arrow-visible');
        } else if (nextSlide === totalSlides - 1) {
            target.removeClass('next-arrow-visible');
            target.removeClass('both-arrows-visible');
            target.addClass('prev-arrow-visible');
        } else {
            target.removeClass('prev-arrow-visible');
            target.removeClass('next-arrow-visible');
            target.addClass('both-arrows-visible');
        }
    }
}

/**
 * Initialize Slick carousel
 * @returns {void}
 */
function slickCarouselInit() {
    $('body').find('[data-marketing-carousel]')
        .each(function() {
            const autoplay = $(this).data('autoplay');
            const autoplaySpeed = parseInt($(this).data('autoplayspeed'), 10) * 1000;
            const tabletBreakPoint = parseInt(styleVariables.tabletBreakPoint, 10);
            const mobileBreakPoint = parseInt(styleVariables.mobileBreakPoint, 10);

            let slidetoshow = $(this).data('slidetoshow');

            slidetoshow = slidetoshow || 1.05;

            $(this).on('afterChange', sliderUpdated);
            $(this).on('init', sliderInitiated);
            $(this).on('beforeChange', sliderArrowsUpdate);

            setTimeout(() => {
                $(this).slick({
                    lazyLoadSrcAttr: 'data-src',
                    lazyLoad: 'ondemand',
                    slidesToShow: 1,
                    dots: false,
                    infinite: false,
                    autoplay,
                    autoplaySpeed,
                    responsive: [
                        {
                            breakpoint: tabletBreakPoint,
                            settings: {
                                slidesToShow: slidetoshow,
                                slidesToScroll: 1
                            },
                            dots: false
                        },
                        {
                            breakpoint: mobileBreakPoint,
                            settings: {
                                slidesToShow: slidetoshow,
                                slidesToScroll: 1
                            }
                        }
                    ]
                });
            });
        });
}

/**
 * Initialize Product Fulfillment Slick carousel
 * @returns {void}
 */
function slickPDPCarouselInit() {
    const pdpSlickBreakPoint = parseInt(styleVariables.ipadBelow);

    $('body').find('[data-pdp-carousel]')
        .each(function (i, elem) {

            const autoplay = $(elem).data('autoplay');
            const autoplaySpeed = parseInt($(elem).data('autoplayspeed'), 10) * 1000;
            const disabledindesktop = $(this).data('disabledindesktop');
            const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;

            $(elem).on('afterChange', sliderUpdated);
            $(elem).on('init', sliderUpdated);

            if (disabledindesktop) {
                if (!isDesktop) {
                    $(elem).not('.slick-initialized').slick({
                        lazyLoadSrcAttr: 'data-src',
                        lazyLoad: 'ondemand',
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true,
                        infinite: false,
                        arrows: false,
                        autoplay,
                        autoplaySpeed,
                        mobileFirst: true,
                        responsive: [{
                            breakpoint: pdpSlickBreakPoint,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                dots: true,
                                arrows: false
                            }
                        }]
                    });
                } else {
                    if ($(elem).hasClass('slick-initialized')) {
                        $(elem).slick("unslick");
                    }
                }
            } else {
                $(elem).slick({
                    lazyLoadSrcAttr: 'data-src',
                    lazyLoad: 'ondemand',
                    slidesToShow: 1,
                    dots: true,
                    infinite: false,
                    arrows: false,
                    autoplay,
                    autoplaySpeed,
                    responsive: [{
                        breakpoint: pdpSlickBreakPoint,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            dots: true,
                            arrows: false
                        }
                    }]
                });
            }
        });
}

/**
* This calls when there is a change in youtube player like start / end.
* @param {event} event event obj
* @returns {void}
*/
function playerStateChange(event) {
    switch (event.data) {
        case 0: // on video end
            triggerAnalyticsEvent(AnalyticsConstants.COMPLETE_VIDEO, {
                name: $(event.target.a).attr('src')
            });
            break;
        case -1: // on video start
            triggerAnalyticsEvent(AnalyticsConstants.START_VIDEO, {
                name: $(event.target.a).attr('src')
            });
            break;
        default:
            break;
    }
}

/**
* Creates objects for respective youtube iframe.
* @returns {void}
*/
function onYouTubeIframeAPIReady(ele) {
    const player = [];
    const eleId = $(ele).attr('id');


    if (eleId) {
        if (window.YT) {
            player[eleId] = new window.YT.Player(eleId, {
                events: {
                    onStateChange: playerStateChange
                }
            });
        }
    }
}

/**
 * Initialize lazy load
 */
function initializeLazyLoad() {
    window.lazyLoad = new LazyLoad({
        load_delay: 100
    });
    window.blazeLoad = new Blaze({
        selector: 'video.load-lazily, iframe.load-lazily',
        success: function (ele) {
            if ($(ele).hasClass('youtube')) {
                onYouTubeIframeAPIReady($(ele));
            }
        }
    });
}

// const initStickyCart = () => {
//     if ($('.pdp-container') && $('.pdp-container').length) {
//         if (window.matchMedia(matchMedia.BREAKPOINTS.TABLET_AND_BELOW).matches) {
//             toggleStickyCart(true);
//         } else {
//             toggleStickyCart(false);
//         }
//     }
// };

// const initSticky = () => {
//     initStickyView()
// }

/**
 * @description function to toggle the class when the cta is active
 */
function toogleCtaActiveStatus() {

    $(document).on('mousedown', 'a', function () {
        $(this).addClass('link-active');
    });
    $(document).on('mouseleave', 'a', function () {
        $(this).removeClass('link-active');
    });

}

/**
 * Initialize skrollr events
 * @returns {void}
 */
export function skrollrInit() {
    if (typeof skrollr !== 'undefined') {
        if (skrollrInitRef) {
            skrollrInitRef.destroy();
        }
        skrollrInitRef = skrollr.init({
            mobileCheck: () => { return false }
        });
    }
}

/**
 * Initialize custom scroll
 * @returns {void}
 */
function initCustomScroll() {
    const $scroll = $('.custom-scroll');

    if ($scroll.length) {
        $scroll.each(function () {
            initScrollBar($(this)[0]);
            $(this).find('.ps__thumb-y').attr('tabindex', -1);
        });
    }
}

/**
 * initialize the Parallax
 * @returns {void}
 */
function aosInit() {
    window.aos = aos;
    const parallaxConfig = objectPath.get(window, 'tiffany.authoredContent.parallaxConfig', { duration: 1500, offset: 300 });

    aos.init({
        once: true,
        duration: parallaxConfig.duration,
        offset: parallaxConfig.offset
    });
}

/**
 * @description method that restricts page zoom on focusing inputs
 * @returns {void}
 */
// const handleInputs = () => {
//     const inputs = 'input, select, textarea';

//     $('body').on('focus', inputs, () => {
//         restrictUserScalability();
//     });

//     $('body').on('blur', inputs, () => {
//         releaseUserScalability();
//     });
// };

const splashAnimation = () => {
    const header = $('.header');
    const leftCont = $('.left-container');
    const rightCont = $('.right-container');
    const centerCont = $('.center-container');
    const splashCont = $('.splash-container');

    const headerDesktop = $('.header.splash-desktop');
    const siteVisited = JSON.parse(cookieUtil.getCookies('siteVisited') || 'false');
    const isChooseLangPage = objectPath.get(window, 'tiffany.authoredContent.isChooseYourLang', false);

    if (header) {
        setTimeout(() => {
            $(splashCont).addClass('start-splash');
            $(centerCont).addClass('start-splash');
            $(leftCont).addClass('start-splash');
            $(rightCont).addClass('start-splash');
        }, 1200);

        setTimeout(() => {
            $(leftCont).removeClass('splash');
            $(centerCont).removeClass('splash');
            $(rightCont).removeClass('splash');
            $(splashCont).removeClass('splash');
            $(leftCont).removeClass('splash-desktop');
            $(centerCont).removeClass('splash-desktop');
            $(rightCont).removeClass('splash-desktop');
            $(splashCont).removeClass('splash-desktop');
            $(leftCont).removeClass('start-splash');
            $(centerCont).removeClass('start-splash');
            $(rightCont).removeClass('start-splash');
            $(splashCont).removeClass('start-splash');
            $(header).removeClass('splash');
            cookieUtil.setCookie('siteVisited', 'true', { secure: true });
        }, 3500);
    } else if (headerDesktop && window.innerWidth > 899 && !siteVisited) {
        $(headerDesktop).addClass('start-splash');
        setTimeout(() => {
            $(headerDesktop).removeClass('splash');
            $(headerDesktop).removeClass('splash-desktop');
            $(headerDesktop).removeClass('start-splash');
            if (!isChooseLangPage) {
                cookieUtil.setCookie('siteVisited', 'true', { secure: true });
            }
        }, 3500);
    }
};

/**
 * Triggers all the featuresDetection functions on DOM ready
 * @returns {void}
 */
function featuresDetection() {
    objectFitImages(null, { watchMQ: true });
    // focusWithin(document);
    initBrowserDetection();
    initializeLazyLoad();
    initScrollToTop();
    setTextPosition();
    initializeStickyNav();
    slickCarouselInit();
    initCustomEvents();
    slickPDPCarouselInit();
    // initStickyCart();
    // initSticky();
    toogleCtaActiveStatus();
    skrollrInit();
    pageNotFoundCheck();
    aosInit();
    splashAnimation();
    // handleInputs();
}

/**
 * Triggers all the functions that are required on resize
 * @returns {void}
 */
function triggerMethodsOnResize() {
    initializeLazyLoad();
    setTextPosition();
    // enableStickyView();
    slickPDPCarouselInit();
}

/**
 * @description eStoreAuthenticaton E-store Authentication redirection.
 * @returns {void}
 */
function eStoreAuthenticaton() {
    const eStoreValidationUrl = objectPath.get(window.tiffany, 'apiUrl.eStoreValidationUrl', '/customer/account/signin.aspx/EstoreValidateFormsAuthentication');
    const eStoreLoginUrl = objectPath.get(window.tiffany, 'apiUrl.eStoreLoginUrl', '/internal/estore/estoresignin.aspx');
    const isIE = (detectIE() && detectIE() < 16);

    fetch(eStoreValidationUrl).then((data) => {
        const authformId = $(data).find('#authform');

        if (data.redirected || (isIE && authformId.length > 0)) {
            window.location.href = eStoreLoginUrl;
        }
    });
}

/**
 * @description onPageLoad Triggers all the functions that are required on page load.
 * @returns {void}
 */
function onPageLoad() {
    const estoreFlag = objectPath.get(window.tiffany, 'authoredContent.isEstore', false);

    featuresDetection();

    if (estoreFlag) {
        eStoreAuthenticaton();
    }

    // verify user session
    const userSessionCookieName = objectPath.get(window.tiffany, 'apiUrl.userSessionRefresh.cookieName');
    const userSessionValue = userSessionCookieName ? cookieUtil.getCookies(userSessionCookieName) : null;

    if (userSessionValue && userSessionValue.toString() === '1') {
        const sessionApiUrl = objectPath.get(window.tiffany, 'apiUrl.userSessionRefresh.endPoint');

        ApiUtils.makeAjaxRequest({
            url: sessionApiUrl,
            method: 'POST',
            payload: {}
        });
    }
}

/**
 * @description onWindowLoad Triggers all the functions that are required on window load.
 * @returns {void}
 */
function onWindowLoad() {
    skrollrInit();
    if ($('.youtube') && $('.youtube').length) {
        $('.youtube').each(function anonymous() {
            if (!($(this).hasClass('load-lazily'))) {
                onYouTubeIframeAPIReady($(this));
            }
        });
    }
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
