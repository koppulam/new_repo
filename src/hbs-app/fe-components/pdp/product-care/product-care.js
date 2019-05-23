/**
 * @module product-care
 * @version 1.0.0
 * @since Wed May 30 2018
 */

// dependencies
import styleVariables from 'lib/utils/breakpoints';
import './product-care.hbs';
import './product-care.scss';
import $ from 'jquery';
import 'slick-carousel';

const compRegisterRef = require('lib/component-register');

const { registerComponent } = compRegisterRef;
const matchMedia = require('lib/dom/match-media');

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__product-care';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'product-care';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createProductcareInstance() {
    /**
     * Component instance.
     * @type {Object}
     */
    const instance = {};

    /**
     * Set if ADA is needed
     * @type {Boolean}
     */
    let isADA = false;

    /**
     * Configuration for Carousel
     */
    const carouselOptions = {
        lazyLoadSrcAttr: 'data-src',
        lazyLoad: 'ondemand',
        dots: false,
        infinite: false,
        speed: 600,
        slidesToShow: 1.3,
        slidesToScroll: 1,
        mobileFirst: true,
        centerMode: false,
        arrows: false,
        accessibility: isADA,
        responsive: [
            {
                breakpoint: styleVariables.ipadBreakPoint,
                settings: 'unslick'
            }
        ]
    };


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
            carousel: '__carousel-holder'
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
     * Carousel Init method
     * @param {object} ele carousel element
     * @param {object} options carousel configuration
     * @returns {void}
     */
    function carouselInit(ele, options) {
        isADA = true;
        $(ele).slick(options);
    }

    /**
     * Initialize slick carousel.
     * @returns {void}
     */
    function initCarousel() {
        carouselInit(singleRefs.carousel, carouselOptions);
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {
        initCarousel();
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
        matchMedia.addListener(matchMedia.BREAKPOINTS.IPAD_AND_BELOW, initCarousel);
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

registerComponent(componentReference, createProductcareInstance);
