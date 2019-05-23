/**
 * @module text-with-cta
 * @version 1.0.0
 * @since Tue Jun 05 2018
 */

// dependencies
import './text-with-cta.hbs';
import './text-with-cta.scss';


const compRegisterRef = require('lib/component-register');

const first = require('lodash/first');

const forEach = require('lodash/forEach');

const $ = require('jquery');

const freeShipping = require('./../free_shipping_returns/free_shipping_returns');

const { registerComponent } = compRegisterRef;

// const loadLocations = require('lib/utils/find-a-store');

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__text-with-cta';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'text-with-cta';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createTextwithctaInstance() {
    /**
     * Component instance.
     * @type {Object}
     */
    const instance = {};

    /**
     * Instance of free shipping components
     * @type {Object}
     */
    let freeShippingInstance;

    /**
     * Find Store Container
     * @type {DOM}
     */
    let $findStoreContainer;

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
            learnMore: '__column_learn-more',
            buy: '__buy-pickup',
            sizeGuide: '__column_sizeguide'
        }
    };

    /** @type {Object} */
    const singleRefs = instance.domRefs.first;

    /** @type {Object} */
    // const listRefs = instance.domRefs.all;

    /**
     * Update the class name of anchor tag
     * @returns {void}
     */
    function onShowContentEvent() {
        $(singleRefs.learnMore).removeClass('open');
    }

    /**
     * Update the `instance.params` for `childInstance`.
     * @param {object} childInstance child components references
     * @returns {void}
     */
    function updateChildParams(childInstance) {
        childInstance.receiveNewParams({
            hideContent: onShowContentEvent
        });
    }

    /**
     * `created` is called before `attached`. Can be used to pass data to
     * childrens `params` property.
     * @returns {void}
     */
    instance.created = () => {
        forEach(instance.children, updateChildParams);
    };

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
        $findStoreContainer = $(singleRefs.buy);
    }

    /**
     * Address Details
     * @param {Object} address address object
     * @returns {void}
     */
    function updateAddressDetails() {
        const address = window.findAStoreAddress;

        if (!address) {
            return;
        }
        const { city } = address;
        const street = address.address1;

        $findStoreContainer.find('.city').html(city);
        $findStoreContainer.find('.street').html(street);
    }

    /**
     * Initialize findStoreInit
     * @returns {void}
     */
    // function findStoreInit() {
    //     if (!$findStoreContainer) {
    //         return;
    //     }
    //     loadLocations();
    // }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {
        freeShippingInstance = first(instance.getInstancesOf(freeShipping.componentReference));
        // findStoreInit();
    }

    /**
     * Show size guide modal when size guide link is clicked
     * @returns {void}
     */
    function onSizeGuideClick() {
        const customEvent = new CustomEvent('toggleSizeFlyout', {
            detail: 'open'
        });

        window.dispatchEvent(customEvent);
        if ($('.size-guide__container').length > 0) {
            $('.size-guide__container').eq(0).dispatchEvent(customEvent);
        }
    }

    /**
     * Show content when learn more is clicked
     * @returns {void}
     * @param {Object} e event
     */
    function onLearnMoreClick(e) {
        e.preventDefault();
        $(e.target).toggleClass('open');
        if (freeShippingInstance) {
            freeShippingInstance.showComponent();
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
        instance.addEventListener('click', onLearnMoreClick, singleRefs.learnMore);
        instance.addEventListener('click', onSizeGuideClick, singleRefs.sizeGuide);
        window.addEventListener('onGeoLocationResponse', updateAddressDetails);
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

registerComponent(componentReference, createTextwithctaInstance);
