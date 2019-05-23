/**
 * @module store-marketing-tile
 * @version 1.0.0
 * @since Thu Aug 02 2018
 */

// dependencies
import './store-marketing-tile.hbs';
import './store-marketing-tile.scss';

const compRegisterRef = require('lib/component-register');

const { registerComponent } = compRegisterRef;

const $ = require('jquery');

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__store-marketing-tile';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'store-marketing-tile';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createStoremarketingtileInstance() {
    /**
     * Component instance.
     * @type {Object}
     */
    const instance = {};
    /**
     * Jquery of instance.element
     */
    let $element;

    /**
     * Jquery element of reservation buttons
     */
    let $reservationBtns;

    /**
     * Variable to store reservation id
     */
    let reservationVenueId;

    /**
     * Variable to store apiKey
     */
    let resyApiKey;

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
        $reservationBtns = $element.find('.reservation-btn');
        reservationVenueId = $element.data('venue-id');
        resyApiKey = $element.data('resy-api-key');
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {}

    /**
     * Append event on click of reservation button
     * @param {Object} e event
     * @returns {void}
     */
    function clickReservation(e) {
        e.preventDefault();
        if (typeof resyWidget !== 'undefined') {
            resyWidget.config({
                venueId: reservationVenueId,
                apiKey: resyApiKey,
                replace: true
            });
            resyWidget.openModal();
        }
    }

    /**
     * Append listeners to the element.
     * @returns {void}
     */
    function addListeners() {
        $reservationBtns.on('click', clickReservation);
    }

    /**
     * Dealloc variables and removes any added listeners.
     * @returns {void}
     */
    function dispose() {
        $reservationBtns.off();
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

registerComponent(componentReference, createStoremarketingtileInstance);
