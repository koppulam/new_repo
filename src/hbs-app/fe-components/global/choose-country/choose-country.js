/**
 * @module choose-country
 * @version 1.0.0
 * @since Wed Aug 29 2018
 */

// dependencies
import getKeyCode from 'lib/utils/KeyCodes';
import { removeClass, addClass, closest } from 'lib/dom/dom-util';
import * as cookieUtil from 'lib/utils/cookies';
import * as objectPath from 'object-path';
import { hasClass, findFirst } from 'lib/dom/dom-util/index';
import $ from 'jquery';
import 'slick-carousel';
import './choose-country.hbs';
import './choose-country.scss';


const compRegisterRef = require('lib/component-register');

const { registerComponent } = compRegisterRef;

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__choose-country';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'choose-country';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createChoosecountryInstance() {
    /**
     * Component instance.
     * @type {Object}
     */
    const instance = {};

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
            closeBtn: '--close'
        }
    };

    /** @type {Object} */
    const singleRefs = instance.domRefs.first;

    /** @type {Object} jQuery element */
    let $element;
    let $globalBanner;

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
        $element = $(instance.element);
        $globalBanner = $('.global-banner');
    }

    /**
     * @description shows banner if the user is visiting US site from outside US
     * @param {string} countryCode country name
     * @returns {void}
     */
    function showBanner(countryCode) {
        if (countryCode && countryCode.toLowerCase() !== 'us') {
            removeClass(instance.element, 'hide');
        } else {
            addClass(instance.element, 'hide');
            if ($globalBanner.length) {
                removeClass($globalBanner[0], 'hide');
                $('.global-banner__holder').slick('refresh');
            }
        }
    }

    /**
     * @description shows banner if the user is visiting US site from outside US
     * @returns {void}
     */
    function locateUser() {
        if (!cookieUtil.getCookies('siteIdForModules')) {
            const countryCode = cookieUtil.getCookies(objectPath.get(window, 'geoHeader.geoLocationCookieName', 'geo-location-cookie'));
            const headerEle = findFirst('header');

            if (hasClass(headerEle, 'splash') || hasClass(headerEle, 'splash-desktop')) {
                const bannerInterval = setInterval(() => {
                    if (!hasClass(headerEle, 'splash') || hasClass(headerEle, 'splash-desktop')) {
                        showBanner(countryCode);
                        clearInterval(bannerInterval);
                    }
                }, 1000);
            } else {
                showBanner(countryCode);
            }
        } else {
            addClass(instance.element, 'hide');
            if ($globalBanner.length) {
                removeClass($globalBanner[0], 'hide');
                $('.global-banner__holder').slick('refresh');
            }
        }
    }

    /**
     * @description hides the choose country banner
     * @returns {void}
     */
    function onClose() {
        addClass(instance.element, 'hide');
    }

    /**
     * @description on dropdown open/close
     * @param {object} evt event
     * @param {object} ele $element
     * @returns {void}
     */
    function onChange(evt) {
        const ischecked = $(evt.target).is(':checked');

        if (!ischecked) {
            $('.css-dropdown__trigger', $element).prop('checked', false);
            removeClass(instance.element, 'dropdown-open');
        } else {
            addClass(instance.element, 'dropdown-open');
        }
    }

    /**
    * Updates footer column layout width to avoid overlapping
    * @returns {void}
    */
    function updateWidthOnResize() {
        $('.choose-country__bottom-wrapper ul').each(function updateWidth(index) {
            const lastChild = $(this).children().last();
            const newWidth = lastChild.position().left - $(this).position().left + lastChild.outerWidth(true);

            $(this).width(newWidth);
        });
    }

    /**
     * @description on dropdown open/close
     * @returns {void}
     * @param {object} event event
     */
    function onRegionClick(event) {
        if (event.type === 'click' || (event.type === 'keypress' && (getKeyCode(event.keyCode, event.shiftKey) === 'ENTER'))) {
            const elem = $('#choose-country');
            const countryLabel = $('#choose-country-label');
            const ischecked = elem.prop('checked') === true;

            if (!ischecked) {
                elem.prop('checked', true);
                addClass(instance.element, 'dropdown-open');
                countryLabel.attr('aria-expanded', 'true');
                updateWidthOnResize();
                $(window).on('resize', updateWidthOnResize);
            } else {
                elem.prop('checked', false);
                removeClass(instance.element, 'dropdown-open');
                countryLabel.attr('aria-expanded', 'false');
                $(window).on('resize', updateWidthOnResize);
            }
        }
    }

    /**
     * @description store the user selected region in cookie
     * @param {object} evt event
     * @returns {void}
     */
    function onLinkClick(evt) {
        evt.preventDefault();

        const linkEle = closest(evt.target, 'cta', 'cta');

        const link = linkEle.href;
        const target = linkEle.target === '_blank' ? '_blank' : '_self';
        const siteId = linkEle.getAttribute('data-site-id');

        if (siteId) {
            cookieUtil.setCookie('siteIdForModules', siteId, { secure: true });
            onClose();
        }

        window.open(link, target);
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {
        locateUser();
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
        instance.addEventListener('click', onClose, singleRefs.closeBtn);
        $('a', $element).on('click', onLinkClick);
        $('#choose-country').on('change', onChange.bind($element));
        $('#choose-country-label').on('click', onRegionClick.bind(this));
        $('#choose-country-label').on('keypress', onRegionClick.bind(this));
    }

    /**
     * Dealloc variables and removes any added listeners.
     * @returns {void}
     */
    function dispose() {
        $('a', $element).off('click', onLinkClick);
        $('#choose-country').off('change', onChange);
    }

    /**
     * The DOM Element was added to the DOM.
     * @returns {void}
     */
    instance.attached = () => {
        initDOMReferences();
        init();
        addListeners();
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

registerComponent(componentReference, createChoosecountryInstance);
