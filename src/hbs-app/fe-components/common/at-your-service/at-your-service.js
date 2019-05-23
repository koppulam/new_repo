/**
 * @module at-your-service
 * @version 1.0.0
 * @since Sun Oct 28 2018
 */

// dependencies
import './at-your-service.hbs';
import './at-your-service.scss';
import { findFirst } from 'lib/dom/dom-util';

const compRegisterRef = require('lib/component-register');

const { registerComponent } = compRegisterRef;

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__at-your-service';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'at-your-service';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createAtyourserviceInstance() {
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
    // instance.domRefs = {
    //   definition: styleDefinition,
    //   first: {
    //     childEl: '__child'
    //   },
    //   all: {
    //     rows: '__row'
    //   }
    // };

    /** @type {Object} */
    // const singleRefs = instance.domRefs.first;

    /** @type {Object} */
    let chatServiceElem;

    // Observer for mutations
    const observer = new MutationObserver(mutationListner);

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
        chatServiceElem = findFirst('#at-your-service-chat');
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {}


    /**
     * @callback
     * @description Listner for all the mutations
     * @param {array} mutationList list of all mutations that occurs on document
     * @returns {void}
     */
    function mutationListner() {
        const lpmContainer = findFirst('.LPMcontainer.LPMoverlay', chatServiceElem);

        if (lpmContainer) {
            const dataAttributes = lpmContainer.attributes;
            
            if (dataAttributes.tabindex.nodeValue === '0') {
                lpmContainer.setAttribute('tabindex', '-1');
                lpmContainer.setAttribute('aria-hiddren', 'true');
                observer.disconnect();
            }
        }
    }

    // mutation options for which the observer listens
    const config = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
    };

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

        // starting the observer
        observer.observe(chatServiceElem, config);
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

registerComponent(componentReference, createAtyourserviceInstance);
