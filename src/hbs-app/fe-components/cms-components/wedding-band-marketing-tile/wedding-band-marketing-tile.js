/**
 * @module wedding-band-marketing-tile
 * @version 1.0.0
 * @since Sun May 27 2018
 */

// dependencies
import getKeyCode from 'lib/utils/KeyCodes';
import './wedding-band-marketing-tile.hbs';
import './wedding-band-marketing-tile.scss';

const compRegisterRef = require('lib/component-register');

const { registerComponent } = compRegisterRef;

const $ = require('jquery');

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__wedding-band-marketing-tile';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'wedding-band-marketing-tile';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createWeddingBandMarketingTileInstance() {
    /**
     * Component instance.
     * @type {Object}
     */
    const instance = {};

    /**
     * Configuration for Carousel
     */
    const carouselOptions = {
        lazyLoadSrcAttr: 'data-src',
        lazyLoad: 'ondemand',
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        mobileFirst: true,
        accessibility: true,
        arrows: false
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
        all: {
            skuImageItem: '_sku-image_container_item',
            heroImageItem: '_hero-image_item'
        },
        first: {
            carousel: '_mobile-hero-images'
        }
    };

    /** @type {Object} */
    const singleRefs = instance.domRefs.first;

    /** @type {Object} */
    const listRefs = instance.domRefs.all;

    /** @type {Element} Jquery Element sku Image Item element */
    let $skuImageItem;

    /** @type {Element} Jquery Element sku Image Item element */
    let $heroImageItem;

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
        $skuImageItem = $(listRefs.skuImageItem);
        $heroImageItem = $(listRefs.heroImageItem);
    }

    /**
     * Initialize slick carousel.
     * @returns {void}
     */
    function initCarousel() {
        $(singleRefs.carousel).slick(carouselOptions);
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {
        initCarousel();
    }

    /**
     * @description UpdateHeroContainer update hero container items based on selected sku image.
     * @param {Number} record record count of the selected item.
     * @returns {void}
     */
    function UpdateHeroContainer(record) {
        $heroImageItem.each((index, item) => {
            const selectedItem = $(item);

            if (record === index) {
                selectedItem.removeClass('hide');
            } else if (!$(item).hasClass('hide')) {
                selectedItem.addClass('hide');
            }
        });
    }

    /**
     * @description UpdateSkuContainer update SKU container items based on selected sku image.
     * @param {Number} record record count of the selected item.
     * @returns {void}
     */
    function UpdateSkuContainer(record) {
        $skuImageItem.each((index, item) => {
            const ctalink = $(item).children()[1];

            if (record === index) {
                $(ctalink).removeClass('hide');
            } else if (!$(ctalink).hasClass('hide')) {
                $(ctalink).addClass('hide');
            }
        });
    }

    /**
     * Pick a store click scroll bottom
     * @param {event} e object
     * @returns {void}
     */
    function skuImageItemClick(e) {
        const selectedSkuImage = $(this);
        const skuImageClass = selectedSkuImage.attr('class').split(' ');
        const splitSkuItem = skuImageClass[0] ? skuImageClass[0].split('_') : '';
        const record = parseInt(splitSkuItem[1], 10);

        $('.active-sku-image').removeClass('active-sku-image').attr('aria-selected', 'false');

        // Add the active class to the link we clicked
        selectedSkuImage.addClass('active-sku-image').attr('aria-selected', 'true');

        UpdateHeroContainer(record);
        UpdateSkuContainer(record);

        // e.preventDefault();
    }

    /**
     * @param {e} e event key press
     * @returns {void}
     */
    function handleKeyPress(e) {
        const charCode = e.which ? e.which : e.keyCode;
        const type = getKeyCode(charCode);

        if (type === 'ENTER') {
            e.target.click();
        }
    }

    /**
     * Append listeners to the element.
     * @returns {void}
     */
    function addListeners() {
        $skuImageItem.on('click', skuImageItemClick);
        $skuImageItem.on('keypress', handleKeyPress);
    }

    /**
     * Dealloc variables and removes any added listeners.
     * @returns {void}
     */
    function dispose() {
        $skuImageItem.off('click');
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

registerComponent(componentReference, createWeddingBandMarketingTileInstance);
