/**
 * @module store-information
 * @version 1.0.0
 * @since Thu Aug 02 2018
 */

// dependencies
import * as objectPath from 'object-path';
import { addPreferredStore, checkPreferredStore } from 'lib/utils/preferred-store-util';
import { getSalesServiceCookie } from 'lib/utils/salesService-util';

import './store-information.hbs';
import './store-information.scss';


const { calculateDistance } = require('lib/utils/google-address.js');

const compRegisterRef = require('lib/component-register');

const { registerComponent } = compRegisterRef;

const $ = require('jquery');

const customEventTrigger = require('lib/events/custom-event-trigger');

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__store-information';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'store-information';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createStoreinformationInstance() {
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
     * Set as my store link
     */
    let $setMyStore;

    /**
     * Near by stores links
     */
    let $nearByStores;

    /**
     * Near by stores container
     */
    let $nearByContainer;

    /**
     * Set my store star icon
     */
    let $starIcon;

    /**
     * MIPS element
     */
    let $mipsElem;
    /**

    /**
     * By setting `instance.domRefs` the baseComponent will replace the value
     * of each keys in `instance.domRefs.first` with single elements found
     * in `instance.element`. Same for `instance.domRefs.all`, but each key
     * will have an array of elements.
     *
     * `first` example: The value of `childEl` will be a `HTMLElement`
     * `all` example: The value of `rows` will be an `Array` of `HTMLElement`
    //  * @type {Object}
    //  */
    // instance.domRefs = {
    //     definition: styleDefinition,
    //     first: {
    //         savedStore: 'icon-saved-store_default'
    //     }
    //     //   all: {
    //     //     rows: '__row'
    //     //   }
    // };

    // /** @type {Object} */
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
        $setMyStore = $element.find('.store-information__info_img_link');
        $nearByStores = $element.find('.nearby.cta');
        $nearByContainer = $element.find('.store-information__stores-nearby');
        $starIcon = $element.find('.store-information__info_img_link_icon');
        $mipsElem = $element.find('.store-information__mips');
    }

    /**
     * Add aria labels as required
     * @param {Boolean} isSelected store
     * @returns {void}
     */
    function radioAriaLabel(isSelected) {
        const $button = $starIcon.closest('.cta');

        if (isSelected) {
            $button.attr('aria-pressed', 'true');
        } else {
            $button.attr('aria-pressed', 'false');
        }
    }

    /**
     * Check nearby stores.
     * @returns {void}
     */
    function nearbyStores() {
        let nearbyDistance = objectPath.get(window, 'storeInformationConfig.nearbyDistance', 50);

        nearbyDistance = parseInt(nearbyDistance, 10) * 1.60934; // miles to km

        $nearByStores.each((index, element) => {
            const $this = $(element);
            const lat = $this.data('currentlat');
            const lng = $this.data('currentlang');
            const mainlat = $this.data('lat');
            const mainlng = $this.data('lang');

            const distance = calculateDistance(lat, lng, mainlat, mainlng) * 0.001; // meters to km

            if (distance <= nearbyDistance) {
                $this.removeClass('hide');
                $nearByContainer.removeClass('hide');
            }
        });
    }

    /**
     * Check nearby stores.
     * @returns {void}
     */
    function checkPrefferredStore() {
        const MipsStoreNumber = $setMyStore.attr('data-mipsStoreNumber');

        radioAriaLabel(false);
        checkPreferredStore(MipsStoreNumber).then((res) => {
            if (res) {
                $starIcon.addClass('current-store').removeClass('icon-saved-store_default');
                radioAriaLabel(true);
                const savedIcon = objectPath.get(window, 'tiffany.authoredContent.icons.savedStoreSaved', {});

                $starIcon.html(`<img src="${savedIcon.src}" altText="${savedIcon.altText}" />`);
            }
        });
    }

    /**
     * Check if Sales Service
     * @returns {void}
     */
    function checkSalesService() {
        const salesServiceVal = getSalesServiceCookie();

        // If sales service show MIPS
        if (salesServiceVal) {
            $mipsElem.removeClass('hide');
        }
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {
        nearbyStores();
        checkPrefferredStore();
        checkSalesService();
    }

    /**
     * Append event on click of set preferred store button
     * @param {Object} e event
     * @returns {void}
     */
    function clickSetMyStore() {
        if (!$starIcon.hasClass('current-store')) {
            const MipsStoreNumber = $setMyStore.attr('data-mipsStoreNumber');

            addPreferredStore(MipsStoreNumber).then((res) => {
                if (res) {
                    const savedIcon = objectPath.get(window, 'tiffany.authoredContent.icons.savedStoreSaved', {});

                    $starIcon.html(`<img src="${savedIcon.src}" altText="${savedIcon.altText}" />`);

                    $starIcon.addClass('current-store').removeClass('icon-saved-store_default');
                    radioAriaLabel(true);
                    customEventTrigger(window, 'refreshPrefferedStoreList');
                }
            });
        } else {
            addPreferredStore('').then((res) => {
                if (res) {
                    const savedIcon = objectPath.get(window, 'tiffany.authoredContent.icons.savedStoreDefault', {});

                    $starIcon.html(`<img src="${savedIcon.src}" altText="${savedIcon.altText}" />`);

                    $starIcon.removeClass('current-store');
                    radioAriaLabel(false);
                    customEventTrigger(window, 'refreshPrefferedStoreList');
                }
            });
        }
    }

    /**
     * Append listeners to the element.
     * @returns {void}
     */
    function addListeners() {
        $setMyStore.on('click', clickSetMyStore);
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

registerComponent(componentReference, createStoreinformationInstance);
