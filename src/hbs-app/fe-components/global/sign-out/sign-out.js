/**
 * @module sign-out
 * @version 1.0.0
 * @since Mon Nov 26 2018
 */

// dependencies
import objectPath from 'object-path';
import { getSalesServiceCookie } from 'lib/utils/salesService-util';
import { removeClass } from 'lib/dom/dom-util/index';

import './sign-out.hbs';
import './sign-out.scss';

const compRegisterRef = require('lib/component-register');

const { registerComponent } = compRegisterRef;

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__sign-out';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'sign-out';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createSignoutInstance() {
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
            cta: '__container_cta',
            container: '__container'
        },
        all: {
            rows: '__row'
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
    }

    /**
     * @returns {void}
     */
    function removeSalesServiceCookies() {
        const cookies = document.cookie.split(';');

        cookies.forEach((cookie) => {
            const equals = cookie.indexOf('=');
            const name = equals > -1 ? cookie.substr(0, equals) : cookie;
            const cookieName = objectPath.get(window, 'tiffany.authoredContent.salesServiceCookieName', 'salesSrvSite');
            const cookiePath = objectPath.get(window, 'tiffany.authoredContent.salesServiceCookiePath', '/');
            const cookieDomain = objectPath.get(window, 'tiffany.authoredContent.salesServiceCookieDomain', '.tiffany.com');

            if (name.trim() === cookieName) {
                document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${cookiePath}; domain=${cookieDomain};`;
            }
        });
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {
        const saleserviceCookie = getSalesServiceCookie();

        if (saleserviceCookie) {
            removeClass(singleRefs.container, 'hide');
        }
    }

    /**
     * Append listeners to the element.
     * @returns {void}
     */
    function addListeners() {
        instance.addEventListener('click', removeSalesServiceCookies, singleRefs.cta);
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

registerComponent(componentReference, createSignoutInstance);
