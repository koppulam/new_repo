/**
 * @module footer-policies
 * @version 1.0.0
 * @since Mon Oct 08 2018
 */

// dependencies
import matchMedia from 'lib/dom/match-media';
import './footer-policies.hbs';
import './footer-policies.scss';

const compRegisterRef = require('lib/component-register');

const { registerComponent } = compRegisterRef;

const $ = require('jquery');

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__footer-policies';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'footer-policies';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createFooterpoliciesInstance() {
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
     * left items
     */
    let $listItemsBtn;

    /**
     * left list items
     */
    let $leftListItems;

    /**
     * left items links
     */
    let $listItemsLink;

    /**
     * right container
     */
    let $rightContainer;

    /**
     * list heading
     */
    let $listHeading;

    /**
     * list description
     */
    let $listDescription;

    /**
     * Right half
     */
    let $rightHalf;

    /**
     * Left half
     */
    let $leftHalf;

    /**
     * back button
     */
    let $backButton;

    /**
     * Right list items
     */
    let $rightListItems;

    /**
     * Policies heading
     */
    let $policiesHeading;

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
        $listItemsBtn = $element.find('.footer-policies__left-list-item-btn');
        $listItemsLink = $element.find('.footer-policies__left-list-item-link');
        $leftListItems = $element.find('.footer-policies__left-list-item');
        $rightHalf = $element.find('.footer-policies__right');
        $leftHalf = $element.find('.footer-policies__left');
        $rightContainer = $element.find('.footer-policies__right-container');
        $listHeading = $element.find('.footer-policies__right-list-heading');
        $listDescription = $element.find('.footer-policies__right-list-description');
        $backButton = $element.find('.footer-policies__right-container-back');
        $rightListItems = $element.find('.footer-policies__right-list-item');
        $policiesHeading = $element.find('.footer-policies__heading');
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {}

    /**
     * Click handler for main list
     * @param {Object} e event
     * @returns {void}
     */
    function mainListClickHandler(e) {
        const $target = $(e.currentTarget);
        const listIndex = $listItemsBtn.index($target);

        $rightContainer.addClass('hide').filter(`:nth("${listIndex}")`).removeClass('hide');

        $leftListItems.attr('aria-selected', 'false');
        $('.selected').removeClass('selected');
        $target.parent().addClass('selected').attr('aria-selected', 'true');
        $target.parent().addClass('selected');
        $leftHalf.addClass('hidden');
        $rightHalf.addClass('shown');
    }

    /**
     * Click handler for sub list
     * @param {Object} e event
     * @returns {void}
     */
    function subListClickHandler(e) {
        const $target = $(e.currentTarget);
        const listIndex = $listHeading.index($target);

        if ($target.hasClass('isOpen')) {
            $target.removeClass('isOpen');
            $listDescription.filter(`:nth("${listIndex}")`).addClass('hide');
            $target.find('.icon-dropdown-up').removeClass('icon-dropdown-up').addClass('icon-dropdown-down');
            $target.attr('aria-expanded', 'false');
        } else {
            $target.addClass('isOpen');
            $listDescription.addClass('hide').filter(`:nth("${listIndex}")`).removeClass('hide');
            $element.find('.icon-dropdown-up').removeClass('icon-dropdown-up').addClass('icon-dropdown-down');
            $target.find('.icon-dropdown-down').removeClass('icon-dropdown-down').addClass('icon-dropdown-up');
            $target.attr('aria-expanded', 'true');
        }
    }

    /**
     * Click handler for back button
     * @param {Object} e event
     * @returns {void}
     */
    function backButtonClick() {
        $rightHalf.removeClass('shown');
        $leftHalf.removeClass('hidden');
        $policiesHeading.show();
    }

    /**
     * Append listeners to the element.
     * @returns {void}
     */
    function addListeners() {
        $listHeading.on('click', subListClickHandler);
        $backButton.on('click', backButtonClick);
        if ($listItemsBtn.length > 0) {
            $listItemsBtn.on('click', mainListClickHandler);
            let url = window.location.href;

            url = url.substring(url.indexOf('#') + 1).replace(/%20/g, ' ').replace('.html', '').replace('/', '');

            if (url) {
                const linkMatched = $(`a[href='#${url}']`);

                if (linkMatched.length > 0) {
                    linkMatched.click();
                } else {
                    const selectedBtn = $listItemsBtn.filter('.selected');

                    if (selectedBtn.length > 0) {
                        selectedBtn.click();
                    } else if (!window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches) {
                        $listItemsBtn.filter(':nth(0)').click();
                    }
                }
            } else if (!window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches) {
                $listItemsBtn.filter(':nth(0)').click();
            }
        } else if ($listItemsLink.length > 0 && $rightListItems.length === 0) {
            $backButton.click();
        } else if ($listItemsLink.length === 0 || $listItemsLink.length === 1) {
            $backButton.hide();
        }

        if ($listHeading.length !== 0 && window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches) {
            $policiesHeading.hide();
        }
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

registerComponent(componentReference, createFooterpoliciesInstance);
