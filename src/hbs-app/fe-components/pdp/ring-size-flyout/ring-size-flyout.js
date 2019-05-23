/**
 * @module ring-size-flyout
 * @version 1.0.0
 * @since Mon Nov 05 2018
 */

// dependencies
import './ring-size-flyout.hbs';
import './ring-size-flyout.scss';
import { disableBodyScroll, enableBodyScroll } from 'lib/no-scroll';
import { initScrollBar, updateScrollBar } from 'lib/dom/custom-scrollbar';

const compRegisterRef = require('lib/component-register');
const scopeFocus = require('lib/dom/scope-focus');


const { registerComponent } = compRegisterRef;

const $ = require('jquery');

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__ring-size-flyout';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'ring-size-flyout';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createRingsizeflyoutInstance() {
    /**
     * Component instance.
     * @type {Object}
     */
    const instance = {};
    let sizeGuideScrollInstance;

    let $element;

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
            flyoutOverlay: '__overlay'
        },
        all: {
            // rows: '__row'
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
     * Custom Scroll Bar
     * @returns {void}
     */
    function customScroll() {
        const sizeGuideScroll = $('.size-guide__container.custom-scroll');

        if (sizeGuideScrollInstance) {
            updateScrollBar(sizeGuideScrollInstance);
        } else {
            sizeGuideScrollInstance = initScrollBar($(sizeGuideScroll)[0]);
        }
    }

    /**
     * close and open the whole comoponent based on the
     * flag from this component or any parent components
     * @param {Boolean} isVisible false
     * @returns {void}
    */
    instance.toggleFlyout = (isVisible) => {
        let headerRect = $('header .header__nav-container');
        const $modalEle = $element.find('.size-guide__container');
        const btn = document.createElement('button');
        const isModal = $modalEle && $modalEle.length > 0;

        btn.setAttribute('class', 'button-hidden');
        btn.setAttribute('aria-hidden', 'true');
        if (headerRect.length) {
            headerRect = headerRect[0].getBoundingClientRect();
            headerRect = headerRect.bottom;
        }

        if (isVisible) {
            $('.ring-size-flyout .size-guide__container, .ring-size-flyout .ring-size-flyout__overlay').css({
                top: headerRect
            });
            customScroll();
            $(singleRefs.flyoutOverlay).attr('tabindex', 0);
            $element.removeClass('close-flyout');
            disableBodyScroll('INITIAL', true);
            if (isModal) {
                scopeFocus.setScopeLimit($modalEle[0]);
                $modalEle.append(btn);
            }
            return;
        }
        $(singleRefs.flyoutOverlay).attr('tabindex', -1);
        if (isModal) {
            scopeFocus.dispose();
            $modalEle.find('.button-hidden').remove();
        }
        $element.addClass('close-flyout');
        enableBodyScroll('INITIAL', false);
    };

    /**
     * Initialize any DOM elements which can be found within the hbs file for
     * this component.
     * @returns {void}
     */
    function initDOMReferences() {
        $element = $(instance.element);
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {
        $(singleRefs.flyoutOverlay).attr('tabindex', -1);
        customScroll();
    }

    /**
     * Update browse grid header with filters
     * @param {object} e event e
     * @returns {void}
     */
    function toggleSizeFlyoutHandler(e) {
        const isOpen = (e.detail !== 'close');

        instance.toggleFlyout(isOpen);
        customScroll();
    }

    /**
     * Update browse grid header with filters
     * @param {object} data event data
     * @returns {void}
     */
    function closeSizeFlyout() {
        const customEvent = new CustomEvent('toggleSizeFlyout', {
            detail: 'close'
        });

        window.dispatchEvent(customEvent);
    }

    /**
     * Append listeners to the element.
     * @returns {void}
     */
    function addListeners() {
        window.addEventListener('toggleSizeFlyout', toggleSizeFlyoutHandler);
        instance.addEventListener('click', closeSizeFlyout, singleRefs.flyoutOverlay);
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

registerComponent(componentReference, createRingsizeflyoutInstance);
