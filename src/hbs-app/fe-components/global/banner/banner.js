/**
 * @module banner
 * @version 1.0.0
 * @since Thu Aug 09 2018
 */

// dependencies
import * as objectPath from 'object-path';
import { initIcon } from 'lib/icon-util';
import $ from 'jquery';
import 'slick-carousel';

import getKeyCode from 'lib/utils/KeyCodes';

import ApiUtils from 'lib/api';
import {
    findFirst,
    addClass,
    hasClass,
    removeClass
} from 'lib/dom/dom-util';
import * as cookieUtil from 'lib/utils/cookies';
import './banner.hbs';
import './banner.scss';

const compRegisterRef = require('lib/component-register');

const { registerComponent } = compRegisterRef;

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__banner';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'global-banner';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createBannerInstance() {
    /**
     * Component instance.
     * @type {Object}
     */
    const instance = {};

    /**
     * Set if ADA is needed
     * @type {Boolean}
     */
    let isADA = false;

    let $countryBanner;

    /**
     * Configuration for Carousel
     */
    const carouselOptions = {
        lazyLoadSrcAttr: 'data-src',
        lazyLoad: 'ondemand',
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        mobileFirst: true,
        accessibility: isADA,
        arrows: true,
        adaptiveHeight: true
    };

    /**
     * By setting `instance.domRefs` the baseComponent will replace the value
     * of each keys in `instance.domRefs.first` with single elements found
     * in `instance.element`. Same for `instance.domRefs.all`, but each key
     * will have an array of elements.
     *
     * `first` example: The value of `childEl` will be a `HTMLElement`
     * `all` example: The value of `rows` will be an `Array` of `HTMLElement`
     * @type {Object}
     */
    instance.domRefs = {
        definition: styleDefinition,
        first: {
            bannerBody: '__body',
            prev: '__prev',
            next: '__next',
            closeBtn: '__close'
        }
    };

    /** @type {Object} */
    const singleRefs = instance.domRefs.first;

    /** @type {Object} */
    // const listRefs = instance.domRefs.all;

    /**
     * `created` is called before `attached`. Can be used to pass data to
     * childrens `params` property.
     */
    // instance.created = () => {
    //   forEach(instance.children, updateChildParams);
    // };

    /**
     * Update the `instance.params` for `childInstance`.
     *
     * @param {object} childInstance
     */
    // function updateChildParams(childInstance) {
    //   childInstance.receiveNewParams({
    //     id: instance.attribute.id,
    //     updateId: onIdChanged
    //   });
    // }

    /**
     * The `instance.params` object was changed from parent calling `instance.receiveNewParams`.
     * Properties and callback functions can be dealt with or passed down to
     * child components.
     */
    // instance.onNewParamsReceived = () => {
    //   forEach(instance.children, child => {
    //     child.receiveNewParams({
    //       updateId: instance.params.updateId
    //     });
    //   });
    // };

    /**
     * Initialize any DOM elements which can be found within the hbs file for
     * this component.
     * @returns {void}
     */
    function initDOMReferences() {
        // myEl = domUtil.findFirst('.'
        //  .concat(exports.styleDefinition)
        //  .concat('__my-el'),
        //  instance.element
        //  );
        $countryBanner = $('.choose-country');
    }

    /**
     * Carousel Init method
     * @param {object} ele carousel element
     * @param {object} options carousel configuration
     * @returns {void}
     */
    function carouselInit(ele, options) {
        isADA = true;
        instance.prevSlide = initIcon(singleRefs.prev);
        instance.nextSlide = initIcon(singleRefs.next);

        $(ele).slick(options);
    }

    /**
     * Initialize slick carousel.
     * @returns {void}
     */
    function initCarousel() {
        singleRefs.carousel = findFirst('.'
            .concat(styleDefinition)
            .concat('__holder'), instance.element);

        carouselInit(singleRefs.carousel, carouselOptions);
    }

    /**
     * Close global banner on click of close icon
     * @param {object} data event data
     * @returns {void}
     */
    function closeGlobalBanner() {
        cookieUtil.setCookie('globalBannerVisited', true, { secure: true });
        addClass(instance.element, 'global-banner--hide');
    }
    /**
     * @description slick slide next handler
     * @returns {void}
     */
    function slickSlideNext() {
        $(singleRefs.carousel).slick('slickNext');
    }

    /**
     * @description Menu click handler
     * @param {object} anim Animation object
     * @param {event} e click event
     * @returns {void}
     */
    function nextSlideHandler(anim, e) {
        e.stopPropagation();
        anim.playSegments([0, 10], true);
        if (e.type === 'keypress') {
            const type = getKeyCode(e.keyCode, e.shiftKey);

            if (type === 'ENTER' || type === 'SPACE') {
                instance.nextSlide.anim.addEventListener('complete', slickSlideNext);
            }
        } else {
            instance.nextSlide.anim.addEventListener('complete', slickSlideNext);
        }
    }

    /**
     * @description slick slide previous handler
     * @returns {void}
     */
    function slickSlidePrev() {
        $(singleRefs.carousel).slick('slickPrev');
    }
    /**
     * @description Menu click handler
     * @param {object} anim Animation object
     * @param {event} e click event
     * @returns {void}
     */
    function prevSlideHandler(anim, e) {
        e.stopPropagation();
        anim.playSegments([0, 10], true);
        if (e.type === 'keypress') {
            const type = getKeyCode(e.keyCode, e.shiftKey);

            if (type === 'ENTER' || type === 'SPACE') {
                instance.prevSlide.anim.addEventListener('complete', slickSlidePrev);
            }
        } else {
            instance.prevSlide.anim.addEventListener('complete', slickSlidePrev);
        }
    }

    /**
     * Append listeners to the element.
     * @returns {void}
     */
    function addListeners() {
        // TODO remove inline comments, just example code.
        // To attach an event, use one of the following methods.
        // No need remove the listener in `instance.detached`
        // instance.addEventListener('click', onClick); //attached to `instance.element`
        // instance.addEventListener('click', onClick, myEl); //attached to `myEl`
        instance.addEventListener('click', closeGlobalBanner, singleRefs.closeBtn);
        if (instance && instance.prevSlide) {
            instance.addEventListener('click', prevSlideHandler.bind(this, instance.prevSlide.anim), singleRefs.prev);
        }
        if (instance && instance.nextSlide) {
            instance.addEventListener('click', nextSlideHandler.bind(this, instance.nextSlide.anim), singleRefs.next);
        }
    }

    /**
     * populate the scheduled data recieved from response
     * @param {array} bannerData banner data
     * @returns {void}
     */
    function populateBannerData(bannerData) {
        bannerData.forEach((message) => {
            const messageContainer = document.createElement('div');

            addClass(messageContainer, styleDefinition
                .concat('__body-text'));

            addClass(messageContainer, `global-banner--${message.alignClass}`);
            addClass(messageContainer, 'tiffany-rte');

            messageContainer.setAttribute('data-nav-context', 'header');
            messageContainer.setAttribute('data-nav-type', 'promo');
            messageContainer.setAttribute('data-nav-name', message.navName);

            messageContainer.innerHTML = message.text;
            singleRefs.bannerBody.insertBefore(messageContainer, singleRefs.closeBtn);
        });

        if (cookieUtil.getCookies('globalBannerVisited') || bannerData.length === 0) {
            addClass(instance.element, 'hide');
        } else if (bannerData.length > 1) {
            singleRefs.bannerBody.removeChild(singleRefs.closeBtn);
            initCarousel();
        }

        addListeners();
    }

    /**
     * fetch banner data
     * @returns {void}
     */
    function getBannerData() {
        const bannerConfigRequest = objectPath.get(window, 'tiffany.authoredContent.globalBannerConfig.bannerRequest');

        if (/\.html$/.test(bannerConfigRequest.url) && !/\.json.html$/.test(bannerConfigRequest.url)) {
            bannerConfigRequest.url = bannerConfigRequest.url.replace(/\.html$/, '.json');
        } else if (!/\.html$/.test(bannerConfigRequest.url) && !/\.json$/.test(bannerConfigRequest.url)) {
            bannerConfigRequest.url += '.json';
        }

        ApiUtils.makeAjaxRequest(
            bannerConfigRequest,
            res => {
                const bannerData = objectPath.get(res, 'bannerData', []);

                if (res.bannerData.length > 1) {
                    addClass(singleRefs.bannerBody, 'global-banner__holder');
                } else {
                    instance.element.removeChild(singleRefs.prev);
                    instance.element.removeChild(singleRefs.next);
                }

                const headerEle = findFirst('header');

                if (hasClass(headerEle, 'splash') || hasClass(headerEle, 'splash-desktop')) {
                    addClass(instance.element, 'global-banner--hide');
                    const bannerInterval = setInterval(() => {
                        if (!hasClass(headerEle, 'splash') || hasClass(headerEle, 'splash-desktop')) {
                            removeClass(instance.element, 'global-banner--hide');
                            populateBannerData(bannerData);
                            clearInterval(bannerInterval);
                        }
                    }, 1000);
                } else {
                    populateBannerData(bannerData);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {
        if (!$countryBanner.length) {
            removeClass(instance.element, 'hide');
        }
        getBannerData();
    }

    /**
     * Dealloc variables and removes any added listeners.
     * @returns {void}
     */
    function dispose() { }

    /**
     * The DOM Element was added to the DOM.
     * @returns {void}
     */
    instance.attached = () => {
        initDOMReferences();
        init();
    };

    /**
     * The DOM Element was removed from the DOM.
     * Dealloc variables and removes any added listeners that was NOT added
     * through `instance.addEventListener`.
     * @returns {void}
     */
    instance.detached = () => {
        // console.log('detached!', instance.element);
        dispose();
    };

    return instance;
}

registerComponent(componentReference, createBannerInstance);
