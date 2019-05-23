/**
 * @module free_shipping_returns
 * @version 1.0.0
 * @since Mon Jun 04 2018
 */

// dependencies
import './free_shipping_returns.hbs';
import './free_shipping_returns.scss';

const compRegisterRef = require('lib/component-register');

const { registerComponent } = compRegisterRef;

const $ = require('jquery');

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__free_shipping_returns';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'free_shipping_returns';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createFreeshippingreturnsInstance() {
    /**
     * Component instance.
     * @type {Object}
     */
    const instance = {};

    /**
     * @type {DOM}
     */
    let $element;

    /**
     * @type {DOM}
     */
    let $hideBtn;

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
            // hideBtn: 'show-more'
        }
    };

    /**
     * this method hides the component
     * @returns {void}
     */
    instance.hideComponent = () => {
        if (instance.params.hideContent) {
            instance.params.hideContent();
        }
        $element.addClass('hide');
    };

    /**
     * this method shows the component
     * @returns {void}
     */
    instance.showComponent = () => {
        $element.toggleClass('hide');
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
        $element = $(instance.element);
        $hideBtn = $element.find('.show-more');
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {}

    /**
     * Append listeners to the element.
     * @returns {void}
     */
    function addListeners() {
        // TODO remove inline comments, just example code.
        // To attach an event, use one of the following methods.
        // No need remove the listener in `instance.detached`
        // instance.addEventListener('click', onClick); //attached to `instance.element`
        // instance.addEventListener('click', instance.hideComponent, $hideBtn[0]);
        $hideBtn.on('click', instance.hideComponent);
    }

    /**
     * Dealloc variables and removes any added listeners.
     * @returns {void}
     */
    function dispose() {
        $hideBtn.off('click');
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

registerComponent(componentReference, createFreeshippingreturnsInstance);
