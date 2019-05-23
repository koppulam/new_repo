/**
 * @module link-list
 * @version 1.0.0
 * @since Sun May 27 2018
 */

// dependencies
import { addClass, findAll, closest } from 'lib/dom/dom-util/index';
import { getSalesServiceCookie } from 'lib/utils/salesService-util';
import * as objectPath from 'object-path';
import * as cookieUtil from 'lib/utils/cookies';

import './link-list.hbs';
import './link-list.scss';

const compRegisterRef = require('lib/component-register');
const getDataAttributes = require('lib/dom/get-data-attributes');

const { registerComponent } = compRegisterRef;

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__link-list';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'link-list';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createLinklistInstance() {
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
            childEl: '__child'
        },
        all: {
            links: '__container_links'
        }
    };

    /** @type {Object} */
    // const singleRefs = instance.domRefs.first;

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
    }

    /**
     * @description navigateToLink on list item click navigate to respective target.
     * @param {event} e object
     * @returns {void}
     */
    function navigateToLink(e) {
        e.preventDefault();

        const linkElem = closest(e.target, 'cta', 'cta');

        const canadaEnglishCookieName = objectPath.get(window, 'tiffany.authoredContent.canadaEnglishCookieName', 'selectedLanguage');
        const canadaEnglishCookieValue = objectPath.get(window, 'tiffany.authoredContent.canadaEnglishCookieValue', '');
        const canadaEnglishDomain = objectPath.get(window, 'tiffany.authoredContent.canadaEnglishDomain', '');
        const caDomain = objectPath.get(window, 'tiffany.caDomain', '.tiffany.ca');
        const expiryDays = objectPath.get(window, 'tiffany.authoredContent.selLanCookExpDate', 20); // 20 Days

        if (linkElem) {
            const href = linkElem.getAttribute('href');
            const target = linkElem.getAttribute('target');
            const urlMatches = href.match(canadaEnglishDomain);
            const isCookieAvailable = cookieUtil.getCookies(canadaEnglishCookieName);

            if (urlMatches && urlMatches.length > 0 && isCookieAvailable) {
                cookieUtil.setCookie(canadaEnglishCookieName, canadaEnglishCookieValue, { domain: caDomain, secure: true, expires: expiryDays });
            }

            if (target === '_blank') {
                window.open(href, target);
            } else if (target === '_self') {
                window.location = href;
            } else {
                window.open(href, target);
            }
        }
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {
        instance.domRefs.all.links.forEach(linkElem => {
            const { navNonEcom } = getDataAttributes(linkElem);
            const salesServiceCookie = getSalesServiceCookie();
            const redirectUrl = objectPath.get(window, 'tiffany.authoredContent.salesServiceRedirectUrl');
            const countryWrapper = closest(linkElem, 'choose-country__bottom-wrapper');

            if (countryWrapper) {
                instance.addEventListener('click', navigateToLink, linkElem);
            }

            if (navNonEcom === 'true' && salesServiceCookie) {
                addClass(linkElem, 'hide');
                return;
            }

            if (navNonEcom === 'false' && salesServiceCookie) {
                const { hostname } = window.location;
                const salesServiceDefaultHost = objectPath.get(window, 'tiffany.authoredContent.salesServiceDefaultHost');

                if (hostname === salesServiceDefaultHost) {
                    const anchorElem = findAll('a', linkElem);
                    const closetsChoose = closest(linkElem, 'choose-country__container');

                    if (anchorElem && anchorElem.length && closetsChoose) {
                        const anchorHref = anchorElem[0].getAttribute('href');

                        anchorElem[0].setAttribute('href', `${redirectUrl}?countryDropDown=${anchorHref}`);
                    }
                }
            }
        });
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
    }

    /**
     * Dealloc variables and removes any added listeners.
     * @returns {void}
     */
    function dispose() {}

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

registerComponent(componentReference, createLinklistInstance);
