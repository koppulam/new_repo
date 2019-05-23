/**
 * @module stores-filter
 * @version 1.0.0
 * @since Mon Aug 13 2018
 */

import getKeyCode from 'lib/utils/KeyCodes';

// dependencies
import './stores-filter.hbs';
import './stores-filter.scss';
import { setDropdownWidth } from 'lib/utils/feature-detection';

const compRegisterRef = require('lib/component-register');

const { registerComponent } = compRegisterRef;

const $ = require('jquery');

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__stores-filter';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'stores-filter';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createStoresfilterInstance() {
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
     * drop down trigger button
     */
    let $regionDropDownTrigger = {};

    /**
     * drop down trigger button
     */
    let $regionDropDownContent = {};

    /**
     * drop down trigger button
     */
    let $stateDropDownTrigger = {};

    /**
     * drop down trigger button
     */
    let $stateDropDownContent = {};

    /**
     * states drop down list
     */
    let $stateDropDownList = {};

    /**
     * states drop down for mobile
     */
    let $stateSelectBox = {};

    /**
     * countries drop down for mobile
     */
    let $countriesSelectBox = {};

    /**
     * Stores count
     */
    let $storesCount = {};

    /**
     * List of items
     */
    let $list = {};

    /**
     * Filters background overlay
     */
    let $storesFilterOverlay = {};

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
    //     definition: styleDefinition,
    //     first: {
    //         childEl: '__child'
    //     },
    //     all: {
    //         rows: '__row'
    //     }
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
        $regionDropDownTrigger = $element.find('.stores-filter__regions-button');
        $regionDropDownContent = $element.find('.stores-filter__regions-dropdown');
        $stateDropDownTrigger = $element.find('.stores-filter__states-button');
        $stateDropDownContent = $element.find('.stores-filter__states-dropdown');
        $stateDropDownList = $element.find('.stores-filter__states-dropdown a');
        $stateSelectBox = $element.find('.stores-filter__states-select');
        $countriesSelectBox = $element.find('.stores-filter__regions-select');
        $storesCount = $element.find('.stores-filter__store-count span');
        $list = $element.find('.stores-filter__regions-content-dropdown-list li');
        $storesFilterOverlay = $element.find('.stores-filter__overlay');
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function calculateStateWidth() {
        const statesList = $stateDropDownContent.find('li');
        const statesWidth = (statesList.length / 8) * 150;

        $stateDropDownContent.css('width', `${statesWidth}px`);

        const regionRects = $regionDropDownTrigger.offset();
        const stateRects = $stateDropDownTrigger.offset();

        $regionDropDownContent.css('padding-left', `${regionRects.left}px`);
        $stateDropDownContent.css('padding-left', `${stateRects.left}px`);

        const currentTop = $element.offset().top;
        const bodyHeight = $(document).height();
        const overlayHeight = (bodyHeight - currentTop) - 50;

        $storesFilterOverlay.css('height', `${overlayHeight}px`);
    }

    /**
     * Set Region label
     * @returns {void}
     */
    function setDefaultRegionLabel() {
        const $container = $regionDropDownContent.parent('.stores-filter__regions');

        if ($container.hasClass('is-open')) {
            $regionDropDownTrigger.text($regionDropDownTrigger.attr('data-defaultregionlabel'));
        } else {
            const currentRegion = $regionDropDownContent.find('.current a');
            const currentText = (currentRegion.length > 0) ? currentRegion.text() : $regionDropDownTrigger.attr('data-defaultregionlabel');

            $regionDropDownTrigger.text(currentText);
        }

        const countryValue = $countriesSelectBox.val();
        const countrySelected = $countriesSelectBox.find('option[selected="selected"]').val();

        if (countrySelected && countryValue !== countrySelected) {
            $countriesSelectBox.val(countrySelected);
        }

        calculateStateWidth();
    }

    /**
     * Set Region label
     * @returns {void}
     */
    function setDefaultStateLabel() {
        const $container = $stateDropDownContent.parent('.stores-filter__regions');
        const currentState = $stateDropDownContent.find('.current a');

        if (!$container.hasClass('is-open') && !(currentState && currentState.attr('data-stateid').toLowerCase() === 'all')) {
            $stateDropDownTrigger.text(currentState.text());
        } else {
            const currentRegion = $regionDropDownContent.find('.current a');

            if (currentRegion) {
                $stateDropDownTrigger.text(currentRegion.attr('data-statelabel'));
            }
        }
    }

    /**
     * Sets region trigger buttons width so that it won't move the state dropdown on open
     * @returns {void}
     */
    function setRegionTriggerWidth() {
        const widthSet = $regionDropDownTrigger.data('widthset');

        if (!widthSet) {
            const regionsWidth = $regionDropDownTrigger.width();

            $regionDropDownTrigger.css('min-width', regionsWidth);
            $regionDropDownTrigger.data('widthset', true);
        }
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {
        setDefaultRegionLabel();
        setDefaultStateLabel();
        calculateStateWidth();
        setTimeout(() => {
            setDropdownWidth($stateSelectBox, 'stores-filter__states-select');
            setDropdownWidth($countriesSelectBox, 'stores-filter__regions-select');
        });
    }

    /**
     * Toggle arrows drop down
     * @param {object} container container
     * @returns {void}
     */
    function toggleArrows(container) {
        const $button = container.find('.stores-filter__regions-trigger');
        const sibling = container.siblings('.stores-filter__regions');
        const $siblingBtn = sibling.find('.stores-filter__regions-trigger');

        if (container.hasClass('is-open')) {
            $button.addClass('icon-upArrow').removeClass('icon-downArrow');
        } else {
            $button.removeClass('icon-upArrow').addClass('icon-downArrow');
        }

        if (sibling.hasClass('is-open')) {
            $siblingBtn.addClass('icon-upArrow').removeClass('icon-downArrow');
        } else {
            $siblingBtn.removeClass('icon-upArrow').addClass('icon-downArrow');
        }
    }

    /**
     * Toggle regions drop down
     * @param {object} event event
     * @returns {void}
     */
    function toggleRegions(event) {
        const $target = $(event.target);
        const $container = $target.parent('.stores-filter__regions');

        setDefaultRegionLabel();
        $container.toggleClass('is-open');
        if ($container.hasClass('is-open')) {
            $target.attr('aria-expanded', 'true');
            calculateStateWidth();
            $storesFilterOverlay.show();
        } else {
            $target.attr('aria-expanded', 'false');
            $storesFilterOverlay.hide();
        }
        toggleArrows($container);
    }
    /**
     * Toggle regions drop down
     * @param {object} event event
     * @returns {void}
     */
    function toggleRegionsDropDown(event) {
        setRegionTriggerWidth();
        toggleRegions(event);
        $stateDropDownContent.parent('.stores-filter__regions').removeClass('is-open');
        $stateDropDownContent.addClass('hide');
        $regionDropDownContent.toggleClass('hide');
    }

    /**
     * Toggle regions drop down
     * @param {object} event event
     * @returns {void}
     */
    function toggleStatesDropDown(event) {
        toggleRegions(event);
        $regionDropDownContent.parent('.stores-filter__regions').removeClass('is-open');
        $regionDropDownContent.addClass('hide');
        $stateDropDownContent.toggleClass('hide');
    }

    /**
     * Toggle regions drop down
     * @param {object} event event
     * @returns {void}
     */
    function filterStates(event) {
        event.preventDefault();
        let stateid;
        const currentTarget = $(event.currentTarget);

        if (event.currentTarget.tagName.toUpperCase() === 'SELECT') {
            setDropdownWidth(currentTarget, 'stores-filter__states-select');
            stateid = currentTarget.val();
        } else {
            stateid = currentTarget.data('stateid');
            $stateDropDownContent.find('.current').removeClass('current');
            currentTarget.parent('li').addClass('current');
        }

        if (stateid === 'all') {
            $('.store-list__state-list-container').removeClass('hide');
            $storesCount.text($('.store-list__store-item').length);
        } else if (stateid) {
            $('.store-list__state-list-container').addClass('hide');
            const visibleStores = $(`.store-list__state-list-container[data-stateid='${stateid}']`);

            $storesCount.text(visibleStores.find('.store-list__store-item').length);
            visibleStores.removeClass('hide');
            $stateDropDownContent.addClass('hide');
        }
    }

    /**
     * Toggle regions drop down
     * @param {object} event event
     * @returns {void}
     */
    function toggleDropDowns(event) {
        const {
            target
        } = event.originalEvent;

        if (target) {
            const currentTarget = $(target);

            if (!currentTarget.hasClass('stores-filter__regions-trigger')) {
                const $container = $regionDropDownContent.parent('.stores-filter__regions');

                $regionDropDownContent.addClass('hide');
                $stateDropDownContent.addClass('hide');
                $regionDropDownContent.parent('.stores-filter__regions').removeClass('is-open');
                $stateDropDownContent.parent('.stores-filter__regions').removeClass('is-open');
                toggleArrows($container);
                $storesFilterOverlay.hide();
            }
        }
        setDefaultRegionLabel();
        setDefaultStateLabel();
    }

    /**
     * Riderects page to other countries
     * @param {object} event event
     * @returns {void}
     */
    function redirectToCountry(event) {
        window.location = $(event.currentTarget).val();
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
        $regionDropDownTrigger.on('click', toggleRegionsDropDown);
        $stateDropDownTrigger.on('click', toggleStatesDropDown);
        $stateDropDownList.on('click', filterStates);
        $stateDropDownList.on('focus', () => {
            setTimeout(() => {
                setDropdownWidth($($stateSelectBox), 'stores-filter__states-select');
            });
        });
        $stateSelectBox.on('change', filterStates);
        $countriesSelectBox.on('change', redirectToCountry);
        $list.on('keypress', handleKeyPress);
        $(window).on('click', toggleDropDowns);
        $(window).on('resize', calculateStateWidth);
    }

    /**
     * init ada for dropdowns
     * @returns {void}
     */
    function initAdaForDropDowns() {
        $regionDropDownTrigger.attr('aria-expanded', 'false');
        $stateDropDownTrigger.attr('aria-expanded', 'false');
    }

    /**
     * Dealloc variables and removes any added listeners.
     * @returns {void}
     */
    function dispose() {
        $(window).off('click', toggleDropDowns);
        $(window).off('resize', calculateStateWidth);
    }

    /**
     * The DOM Element was added to the DOM.
     * @returns {void}
     */
    instance.attached = () => {
        initDOMReferences();
        init();
        addListeners();
        initAdaForDropDowns();
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

registerComponent(componentReference, createStoresfilterInstance);
