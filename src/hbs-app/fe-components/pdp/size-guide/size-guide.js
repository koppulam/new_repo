/**
 * @module size-guide
 * @version 1.0.0
 * @since Wed Oct 24 2018
 */

// dependencies
import './size-guide.hbs';
import './size-guide.scss';

// const domUtil = require('lib/dom/dom-util');

const compRegisterRef = require('lib/component-register');

const {
    registerComponent
} = compRegisterRef;

const $ = require('jquery');

// const forEach = require('lodash.foreach');

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__size-guide';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'size-guide';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createSizeguideInstance() {
    /**
     * Component instance.
     * @type {Object}
     */
    const instance = {};

    /**
     * jQuery instance of element
     */
    let $element;

    /**
     * jQuery instance of pointer element
     */
    let $pointer;

    /**
     * jQUery instance of content div
     */
    let $content;

    /**
     * jQUery instance of drop down
     */
    let $dropDown;

    /**
     * jQUery instance of drop down container
     */
    let $dropDownContainer;

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
            // openBtn: '__open',
            heading: '__container_heading',
            closeBtn: '__container_close',
            dropDownContainer: '__container_mobileitemlist',
            dropDown: '__container_mobileitemlist_items'
            // container: '__container',
            // headingselect: '__container_mobileitemlist_items'
        },
        all: {
            // headings: '__container_itemlist_items_item_link',
            // contents: '__content'
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
        $element = $(instance.element);
        $pointer = $element.find('[data-pointer]');
        $content = $element.find('[data-content]');
        $dropDownContainer = $(singleRefs.dropDownContainer);
        $dropDown = $(singleRefs.dropDown);
    }

    /**
     * Reset dropdown value
     * @returns {void}
     */
    function resetDropdownValue() {
        $dropDown.find('option[selected]').prop('selected', true).trigger('change');
        $dropDownContainer.css('visibility', 'visible');
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {
        $element.find('.size-flyout').find(singleRefs.container).addClass('hide');
        resetDropdownValue();
    }

    /**
     * Update heaing of rize size based on selecting the tab
     * @param {String} heading is event
     * @returns {void}
     */
    function updateHeading(heading) {
        $(singleRefs.heading).text(heading);
    }

    /**
     * swithTabContent based of value from tab pointer or mobile select
     * @param {String} type is event
     * @returns {void}
     */
    function swithTabContent(type) {
        $content.addClass('hide');
        $content.each((index, elem) => {
            const $this = $(elem);

            if ($this.data('content') === type) {
                $this.removeClass('hide').addClass('active');
                updateHeading($this.data('heading'));
            }
        });
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
     * On pointer Click
     * @param {e} e is event
     * @returns {void}
     */
    function changeTabContent(e) {
        if ($pointer.find('a').hasClass('is-model')) {
            e.preventDefault();
            const $target = $(e.target);
            const type = $target.val() ? $target.val() : $target.closest('li').data('pointer');

            if (!$target.val()) {
                $pointer.find('a').removeClass('active').attr('aria-selected', 'false');
                $pointer.each((index, elem) => {
                    const $this = $(elem);

                    if ($this.data('pointer') === type) {
                        $this.find('a').addClass('active').attr('aria-selected', 'true');
                    }
                });
            }
            swithTabContent(type);
        } else {
            const $optionTarget = $(e.target);

            const targetlink = $optionTarget.find('option:selected').data('page');

            window.location.href = targetlink;
        }
    }

    /**
     * Append listeners to the element.
     * @returns {void}
     */
    function addListeners() {
        $pointer.find('a').on('click', changeTabContent);
        instance.addEventListener('click', closeSizeFlyout, singleRefs.closeBtn);
        instance.addEventListener('change', changeTabContent, singleRefs.headingselect);
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

registerComponent(componentReference, createSizeguideInstance);
