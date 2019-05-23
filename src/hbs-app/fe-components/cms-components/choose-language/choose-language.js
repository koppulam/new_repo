/**
 * @module choose-language
 * @version 1.0.0
 * @since Mon Oct 29 2018
 */

import { setCookie } from 'lib/utils/cookies';
import * as objectPath from 'object-path';

// dependencies
import './choose-language.hbs';
import './choose-language.scss';

const compRegisterRef = require('lib/component-register');
const getDataAttributes = require('lib/dom/get-data-attributes');
const $ = require('jquery');

const {
    registerComponent
} = compRegisterRef;

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__choose-language';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'choose-language';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createChooselanguageInstance() {
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
        // first: {
        //     listItem: '__languges_list a'
        // },
        all: {
            row: '__languges_list button'
        }
    };

    /** @type {Object} */
    // const singleRefs = instance.domRefs.first;

    /** @type {Object} */
    const listRefs = instance.domRefs.all;

    /** @type {Element} pickaStore container */
    let $listItem = {};

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
        $listItem = $(listRefs.row);
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {}

    /**
     * Close click handler - Hide all the content
     * @param {event} event object
     * @returns {void}
     */
    function chooseYourLanguage(event) {
        event.preventDefault();
        const caDomain = objectPath.get(window, 'tiffany.caDomain', '.tiffany.ca');
        const attrs = getDataAttributes(event.target);
        const expiryDays = objectPath.get(window, 'tiffany.authoredContent.selLanCookExpDate', 20);

        setCookie('selectedLanguage', attrs.language, { domain: caDomain, secure: true, expires: expiryDays }); // To DO: Domain name needs to fetch from AEM config

        if (attrs.url === '/') {
            attrs.url = objectPath.get(window, 'location.origin', '/');
        }

        window.open(attrs.url, '_self');
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
        $listItem.on('click', chooseYourLanguage);
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

registerComponent(componentReference, createChooselanguageInstance);
