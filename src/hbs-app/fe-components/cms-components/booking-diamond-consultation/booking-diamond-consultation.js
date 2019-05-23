/**
 * @module booking-diamond-consultation
 * @version 1.0.0
 * @since Fri Oct 26 2018
 */

import ApiUtils from 'lib/api';

import * as objectPath from 'object-path';
import { restrictUserScalability, releaseUserScalability } from 'lib/utils/meta-tag';

// dependencies
import './booking-diamond-consultation.hbs';
import './booking-diamond-consultation.scss';

const compRegisterRef = require('lib/component-register');

const { registerComponent } = compRegisterRef;

const $ = require('jquery');

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__booking-diamond-consultation';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'booking-diamond-consultation';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createBookingdiamondconsultationInstance() {
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
     * Country drop down
     */
    let $countryDropDown;

    /**
     * State drop down
     */
    let $stateDropDown;

    /**
     * Stores drop down
     */
    let $storesDropDown;

    /**
     * Stores Form
     */
    let $storesForm;

    /**
     * Stores Form submit button
     */
    let $storesSubmitButton;

    /**
     * States list
     */
    let statesList = [];

    /**
     * Store element
     */
    let $storeSelectField;

    /**
     * State element
     */
    let $stateSelectField;

    /**
     * Redirect url
     */
    let $redirectUrl;

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
        $countryDropDown = $element.find('.booking-diamond-form_regions-select');
        $stateDropDown = $element.find('.booking-diamond-form_regions-state-select');
        $storesDropDown = $element.find('.booking-diamond-form_regions-store-select');
        $storesForm = $element.find('.booking-diamond-form');
        $storesSubmitButton = $element.find('.booking-diamond-form_buttons_store-visit');
        $stateSelectField = $element.find('.booking-diamond-form_state-select');
        $storeSelectField = $element.find('.booking-diamond-form_store-select');
        $redirectUrl = $element.find('.booking-diamond-form_redirect-url');
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {
        restrictUserScalability();
    }

    /**
     * Stores change
     * @param {Object} event event
     * @returns {void}
     */
    function storesChangeEvent() {
        const storeId = $storesDropDown.val();

        if (storeId !== '0' && storeId) {
            $storesSubmitButton.removeAttr('disabled');
            $storeSelectField.find('.booking-diamond-form_label').removeClass('hide');
        } else {
            $storesSubmitButton.attr('disabled', 'disabled');
            $storeSelectField.find('.booking-diamond-form_label').addClass('hide');
        }
    }

    /**
     * Country drop down change event
     * @param {Object} event event
     * @returns {void}
     */
    function countryChangeEvent(event) {
        const $target = $(event.target);
        const selectedCountry = $target.find('option:selected') ? $target.find('option:selected') : $target.find('option:first');
        const countryName = selectedCountry.text();
        const stateLabel = selectedCountry.data('statelabel');
        const siteId = $target.val();

        $stateDropDown.val(0);
        $storesDropDown.val(0);
        $stateDropDown.html('');
        $storesDropDown.html('');
        $storeSelectField.addClass('hide');
        $stateSelectField.addClass('hide');
        storesChangeEvent();

        if (parseInt(siteId, 10) !== 0) {
            const listbycountryConfig = objectPath.get(window, 'tiffany.authoredContent.listbycountryConfig');

            listbycountryConfig.payload = {};

            objectPath.set(listbycountryConfig, 'payload.siteId', siteId);
            objectPath.set(listbycountryConfig, 'payload.country', countryName);

            ApiUtils.makeAjaxRequest(
                listbycountryConfig,
                res => {
                    if (res.resultDto && res.resultDto.length > 0) {
                        statesList = res.resultDto;

                        const statesLength = statesList.length;

                        statesList = statesList.sort((currentOption, nextOption) => {
                            const currentName = currentOption.groupingWebDisplayText.toUpperCase(); // ignore upper and lowercase
                            const nextName = nextOption.groupingWebDisplayText.toUpperCase(); // ignore upper and lowercase

                            if (currentName < nextName) {
                                return -1;
                            }
                            if (currentName > nextName) {
                                return 1;
                            }
                            // names must be equal
                            return 0;
                        });

                        $('.label-state-select').text(stateLabel).addClass('hide');
                        let stateHtml = `<option value=0>${stateLabel}</option>`;

                        for (let stateIndex = 0; stateIndex < statesLength; stateIndex += 1) {
                            if (statesList[stateIndex] && statesList[stateIndex].groupingWebDisplayText) {
                                let { stores } = statesList[stateIndex];

                                if (stores && stores.length) {
                                    stores = stores.filter(store => {
                                        let storeServiceOnline = false;
                                        const storeServices = objectPath.get(store, 'storeServices', []);

                                        if (storeServices.length > 0) {
                                            const onlineServices = storeServices.filter(service => {
                                                return service.storeServiceTypeId === 2; // filter online stores
                                            });

                                            if (onlineServices && onlineServices.length > 0) {
                                                storeServiceOnline = true;
                                            }
                                        }
                                        return storeServiceOnline;
                                    });

                                    if (stores.length > 0) {
                                        stateHtml += `<option value='${stateIndex + 1}'>${statesList[stateIndex].groupingWebDisplayText}</option>`;
                                        statesList[stateIndex].stores = stores;
                                    }
                                }
                            }
                        }

                        $stateDropDown.html(stateHtml);
                        $stateDropDown.change();
                        $stateSelectField.removeClass('hide');
                    }
                },
                err => {
                }
            );
        }
    }

    /**
     * State drop down change event
     * @param {Object} event event
     * @returns {void}
     */
    function stateChangeEvent(event) {
        const $target = $(event.target);
        const stateid = $target.val();

        $storesDropDown.val(0);
        $storesDropDown.html('');
        $storeSelectField.addClass('hide');

        if (parseInt(stateid, 10) !== 0) {
            const storesLabelText = $storeSelectField.find('.booking-diamond-form_label').text();
            const selectedStateObj = statesList[parseInt(stateid, 10) - 1];
            const storesList = objectPath.get(selectedStateObj, 'stores', []);
            const storesLength = storesList.length;

            $('.label-state-select').removeClass('hide');
            $storeSelectField.find('.booking-diamond-form_label').addClass('hide');
            let storesHtml = `<option value=0>${storesLabelText}</option>`;

            for (let storeIndex = 0; storeIndex < storesLength; storeIndex += 1) {
                if (storesList[storeIndex] && storesList[storeIndex].store && storesList[storeIndex].store.storeId) {
                    storesHtml += `<option value='${storesList[storeIndex].store.storeId}'>${storesList[storeIndex].store.storeName}</option>`;
                }
            }
            $storesDropDown.html(storesHtml);
            $storeSelectField.removeClass('hide');
        } else {
            $('.label-state-select').addClass('hide');
        }
        storesChangeEvent();
    }

    /**
     * Stores form submit
     * @param {Object} event event
     * @returns {void}
     */
    function storeFormSubmit(event) {
        const selectedStore = $storesDropDown.val();
        const url = $redirectUrl.val();
        const target = $redirectUrl.data('target');

        if (selectedStore) {
            if (target === '_self') {
                window.location = `${url}?storeid=${selectedStore}`;
            } else if (target === '_blank') {
                window.open(`${url}?storeid=${selectedStore}`);
            } else {
                window.location = `${url}?storeid=${selectedStore}`;
            }
        }
    }

    /**
     * Append listeners to the element.
     * @returns {void}
     */
    function addListeners() {
        $countryDropDown.on('change', countryChangeEvent);
        $stateDropDown.on('change', stateChangeEvent);
        $storesDropDown.on('change', storesChangeEvent);
        $storesSubmitButton.on('click', storeFormSubmit);
        $storesForm.on('submit', storeFormSubmit);
        $countryDropDown.trigger('change');
    }

    /**
     * Dealloc variables and removes any added listeners.
     * @returns {void}
     */
    function dispose() {
        releaseUserScalability();
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

registerComponent(componentReference, createBookingdiamondconsultationInstance);
