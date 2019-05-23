/**
 * @module product-size
 * @version 1.0.0
 * @since Mon Jun 04 2018
 */

// dependencies
import './product-size.hbs';
import './product-size.scss';

const compRegisterRef = require('lib/component-register');

const { registerComponent } = compRegisterRef;

const matchMedia = require('lib/dom/match-media');

const $ = require('jquery');

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__product-size';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'product-size';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createProductsizeInstance() {
    /**
     * Component instance.
     * @type {Object}
     */
    const instance = {};

    /**
     * Const for MOBILE
     * @type {String}
     */
    const CONST_MOBILE = 'MOBILE';

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
            sizeContainer: '__modifier'
        }
    };

    /** @type {Object} */
    const singleRefs = instance.domRefs.first;

    /** @type {Element} Size selector info element  */
    let $sizeSelector;


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
     * destory  select view on ipad and below ot init otherwise
     * @returns {void}
     */
    function initSizeSelect() {
        if (!matchMedia.matchesBreakpoint(CONST_MOBILE)) {
            $sizeSelector.niceSelect();
        } else {
            $sizeSelector.niceSelect('destroy');
        }
    }

    /**
     * Initialize any DOM elements which can be found within the hbs file for
     * this component.
     * @returns {void}
     */
    function initDOMReferences() {
        $sizeSelector = $(singleRefs.sizeContainer).find('select');
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {
        initSizeSelect();
    }

    /**
     * Append listeners to the element.
     * @returns {void}
     */
    function addListeners() {
        matchMedia.addListener(matchMedia.BREAKPOINTS.MOBILE, initSizeSelect);
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

registerComponent(componentReference, createProductsizeInstance);
