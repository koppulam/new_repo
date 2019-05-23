/**
 * @module hero-component
 * @version 1.0.0
 * @since Thu Aug 30 2018
 */

// dependencies
import './hero-component.hbs';
import './hero-component.scss';

const LazyLoad = require('vanilla-lazyload');

const compRegisterRef = require('lib/component-register');

const { registerComponent } = compRegisterRef;

const $ = require('jquery');

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__hero-component';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'hero-component';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createHerocomponentInstance() {
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
     * hero images
     */
    let $heroImages = {};

    /**
     * Left arrows
     */
    let $leftArrow = {};

    /**
     * Right arrows
     */
    let $rightArrow = {};

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
     * Adjust arrow positions.
     * @returns {void}
     */
    function adjustArrowPositions() {
        if ($heroImages.length > 0) {
            const imageHeight = $heroImages[0].offsetHeight;

            $leftArrow = $element.find('.slick-prev');
            $rightArrow = $element.find('.slick-next');
            $leftArrow.css('bottom', `calc(100% - ${imageHeight + 1}px)`);
            $rightArrow.css('bottom', `calc(100% - ${imageHeight + 1}px)`);
        }
    }

    /**
    * Initialize lazy load
    * @returns {void}
    */
    function initializeLazyLoad() {
        window.lazyLoad = new LazyLoad({
            elements_selector: 'img.lazy-load',
            callback_load: (e) => {
                adjustArrowPositions();
            }
        });
    }

    /**
     * Initialize any DOM elements which can be found within the hbs file for
     * this component.
     * @returns {void}
     */
    function initDOMReferences() {
        initializeLazyLoad();
        $element = $(instance.element);
        $heroImages = $element.find('.text-with-image img');
        $leftArrow = $element.find('.slick-prev');
        $rightArrow = $element.find('.slick-next');
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {
        // adjustArrowPositions();
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
        $element.on('init', () => {
            adjustArrowPositions();
        });
        $(window).on('resize', () => {
            setTimeout(() => {
                adjustArrowPositions();
            }, 100);
        });
        $(window).on('load', () => {
            setTimeout(() => {
                adjustArrowPositions();
            }, 100);
        });
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

registerComponent(componentReference, createHerocomponentInstance);