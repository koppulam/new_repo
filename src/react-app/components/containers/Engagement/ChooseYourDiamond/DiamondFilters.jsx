//  Packages
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as objectPath from 'object-path';
import map from 'lodash/map';
import $ from 'jquery';
import 'ion-rangeslider';

import {
    hasClass,
    toggleClass,
    removeClass,
    findFirst,
    addClass
} from 'lib/dom/dom-util';
import classNames from 'classnames';
import ReactTooltip from 'lib/utils/react-tooltip';
import InformationText from 'components/common/InformationText';
import MediaQuery from 'react-responsive';
import styleVariables from 'lib/utils/breakpoints';
import { currencyFormatter } from 'lib/utils/currency-formatter';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import { isEnter, isSpaceOrEnter } from 'lib/dom/keyboard/key-code';

// Components
import {
    getDiamondCards,
    updateCurrentValues,
    undoFilters,
    resetFilters
} from 'actions/ChooseDiamondActions';
import Picture from 'components/common/Picture';

/**
 * Component to select diamond on Engagement Page
 */
class DiamondFilters extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.state = {
            config: this.props.aem[this.props.config],
            assortmentId: objectPath.get(this.props.aem, 'engagementpdp.diamondSelectionConfig.payload.assortmentID', ''),
            requestPayLoad: JSON.parse(JSON.stringify(objectPath.get(this.props.aem, 'engagementpdp.diamondSelectionConfig', {}))),
            typingInPriceMin: false,
            typingInPriceMax: false,
            priceRangeError: false,
            caratRangeError: false,
            inputsInEdit: false,
            minPrice: parseFloat(objectPath.get(this.props.groupComplete, 'lowerPriceLimit', 0)),
            maxPrice: parseFloat(objectPath.get(this.props.groupComplete, 'upperPriceLimit', 0)),
            minCarat: parseFloat(objectPath.get(this.props.groupComplete, 'minCaratWeight', 0)),
            maxCarat: parseFloat(objectPath.get(this.props.groupComplete, 'maxCaratWeight', 0)),
            forced1BVariation: objectPath.get(this.props.aem, 'engagementpdp.forced1BVariation', false)
        };

        this.minCaratInput = React.createRef();
        this.maxCaratInput = React.createRef();
        this.minPriceInput = React.createRef();
        this.maxPriceInput = React.createRef();
        this.currencyFormat = objectPath.get(this.props.aem, 'currencyConfig.currency', '');
        this.customCurrencyFormat = objectPath.get(this.props.aem, 'currencyConfig.customCurrency', '');
    }

    /**
     * @description On props changed life cycle event
     * @param {object} nextProps updated params
     * @returns {void}
     */
    componentDidMount() {
        const thisProps = this.props;
        const thisState = this;
        const isDesktop = window.matchMedia(styleVariables.desktopTabletAbove).matches;
        const caratMaxLabel = findFirst('.diamond-filter_container_list_carat_desc_inputs_max_label');
        const caratMinLabel = findFirst('.diamond-filter_container_list_carat_desc_inputs_min_label');
        const priceMaxLabel = findFirst('.diamond-filter_container_list_price_desc_inputs_max_label');
        const priceMinLabel = findFirst('.diamond-filter_container_list_price_desc_inputs_min_label');
        const lowerPriceLimit = parseFloat(objectPath.get(this.props.groupComplete, 'lowerPriceLimit', 500));
        const upperPriceLimit = parseFloat(objectPath.get(this.props.groupComplete, 'upperPriceLimit', 700));
        const minCarat = parseFloat(objectPath.get(this.props.groupComplete, 'minCaratWeight', 0.5));
        const maxCarat = parseFloat(objectPath.get(this.props.groupComplete, 'maxCaratWeight', 2.5));
        let defaultMinCaratPosition = parseFloat(objectPath.get(this.props.aem, 'engagementpdp.defaultMinCaratPosition', 0));
        let defaultMaxCaratPosition = parseFloat(objectPath.get(this.props.aem, 'engagementpdp.defaultMaxCaratPosition', 0));

        if (lowerPriceLimit === upperPriceLimit) {
            $('#price-slider').ionRangeSlider({
                keyboard: false,
                min: lowerPriceLimit - 100,
                max: upperPriceLimit + 100,
                from: lowerPriceLimit,
                to: upperPriceLimit,
                type: 'double',
                step: 100,
                hide_from_to: true,
                hide_min_max: true,
                block: true
            });
            $('#price-min,#price-max').prop('readonly', true);
        } else {
            $('#price-slider').ionRangeSlider({
                keyboard: false,
                min: objectPath.get(this.props.groupComplete, 'lowerPriceLimit', 500),
                max: objectPath.get(this.props.groupComplete, 'upperPriceLimit', 700),
                type: 'double',
                step: objectPath.get(this.props.aem, 'engagementpdp.priceSliderStep', 100),
                hide_from_to: true,
                hide_min_max: true,
                onStart() {
                    thisState.updateSlidersTabIndex();
                },
                onFinish(sliderObj) {
                    if (sliderObj.from === sliderObj.to) {
                        thisState.setState({ priceRangeError: true });
                    } else {
                        thisState.setState({ priceRangeError: false });
                        if (thisProps.diamondFilters.currentMinPrice !== sliderObj.from) {
                            addClass(priceMinLabel, 'active');
                            thisProps.dispatch(updateCurrentValues({ currentMinPrice: sliderObj.from }));
                        }
                        if (thisProps.diamondFilters.currentMaxPrice !== sliderObj.to) {
                            addClass(priceMaxLabel, 'active');
                            thisProps.dispatch(updateCurrentValues({ currentMaxPrice: sliderObj.to }));
                        }
                    }
                },
                onChange() {
                    thisState.updateSlidersTabIndex();
                }
            });
        }

        if (minCarat === maxCarat) {
            defaultMinCaratPosition = minCarat;
            defaultMaxCaratPosition = maxCarat;

            $('#carat-slider').ionRangeSlider({
                keyboard: false,
                min: minCarat - 0.5,
                max: maxCarat + 0.5,
                from: minCarat,
                to: maxCarat,
                type: 'double',
                step: 0.1,
                hide_from_to: true,
                hide_min_max: true,
                block: true
            });
            $('#carat-min,#carat-max').prop('readonly', true);
        } else {
            $('#carat-slider').ionRangeSlider({
                keyboard: false,
                min: objectPath.get(this.props.groupComplete, 'minCaratWeight', 0.5),
                max: objectPath.get(this.props.groupComplete, 'maxCaratWeight', 2.5),
                from: objectPath.get(this.props.aem, 'engagementpdp.defaultMinCaratPosition', 1),
                to: objectPath.get(this.props.aem, 'engagementpdp.defaultMaxCaratPosition', 2),
                type: 'double',
                step: objectPath.get(this.props.aem, 'engagementpdp.caratSliderStep', 0.01),
                hide_from_to: true,
                hide_min_max: true,
                onStart() {
                    thisState.updateSlidersTabIndex();
                },
                onFinish(sliderObj) {
                    if (sliderObj.from === sliderObj.to) {
                        thisState.setState({ caratRangeError: true });
                    } else {
                        thisState.setState({ caratRangeError: false });
                        if ((thisProps.diamondFilters.currentMinCarat !== sliderObj.from) || (thisProps.diamondFilters.currentMaxCarat !== sliderObj.to)) {
                            addClass(caratMinLabel, 'active');
                            addClass(caratMaxLabel, 'active');
                            thisProps.dispatch(updateCurrentValues({ currentMinCarat: sliderObj.from, currentMaxCarat: sliderObj.to }));
                        }
                    }
                },
                onChange() {
                    thisState.updateSlidersTabIndex();
                }
            });
        }

        if (isDesktop || this.props.diamondFilters.previousPayload.length === 1) {
            this.props.dispatch(updateCurrentValues({
                currentMinCarat: defaultMinCaratPosition,
                currentMaxCarat: defaultMaxCaratPosition,
                currentMinPrice: lowerPriceLimit,
                currentMaxPrice: upperPriceLimit
            }));
        }

        if (!isDesktop) {
            this.updateSliders();
        }
    }

    /**
     * @description On props changed life cycle event
     * @param {object} nextProps updated params
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        const getCards = (this.props.diamondFilters.currentMinCarat !== nextProps.diamondFilters.currentMinCarat)
            || (this.props.diamondFilters.currentMaxCarat !== nextProps.diamondFilters.currentMaxCarat)
            || (this.props.diamondFilters.currentMinPrice !== nextProps.diamondFilters.currentMinPrice)
            || (this.props.diamondFilters.currentMaxPrice !== nextProps.diamondFilters.currentMaxPrice)
            || (this.props.diamondFilters.navigationFilters.toString() !== nextProps.diamondFilters.navigationFilters.toString())
            || (this.props.diamondFilters.isAvailableOnline !== nextProps.diamondFilters.isAvailableOnline);

        const updatedValues = {};

        if (this.props.diamondFilters.currentPayload !== nextProps.diamondFilters.currentPayload) {
            this.setState({
                requestPayLoad: JSON.parse(JSON.stringify(nextProps.diamondFilters.currentPayload))
            });
        }

        if (this.props.diamondFilters.isAvailableOnline !== nextProps.diamondFilters.isAvailableOnline) {
            updatedValues.isAvailableOnline = nextProps.diamondFilters.isAvailableOnline;
        }

        if (this.props.diamondFilters.currentMinCarat !== nextProps.diamondFilters.currentMinCarat) {
            this.updateCaratSliderMin(nextProps.diamondFilters.currentMinCarat);
            updatedValues.minCaratWeight = nextProps.diamondFilters.currentMinCarat;
        }
        if (this.props.diamondFilters.currentMaxCarat !== nextProps.diamondFilters.currentMaxCarat) {
            this.updateCaratSliderMax(nextProps.diamondFilters.currentMaxCarat);
            updatedValues.maxCaratWeight = nextProps.diamondFilters.currentMaxCarat;
        }
        if (this.props.diamondFilters.currentMinPrice !== nextProps.diamondFilters.currentMinPrice) {
            this.updatePriceSliderMin(nextProps.diamondFilters.currentMinPrice);
            updatedValues.lowerPriceLimit = nextProps.diamondFilters.currentMinPrice.toString();
        }
        if (this.props.diamondFilters.currentMaxPrice !== nextProps.diamondFilters.currentMaxPrice) {
            this.updatePriceSliderMax(nextProps.diamondFilters.currentMaxPrice);
            updatedValues.upperPriceLimit = nextProps.diamondFilters.currentMaxPrice.toString();
        }

        if (this.props.diamondFilters.navigationFilters.toString() !== nextProps.diamondFilters.navigationFilters.toString()) {
            updatedValues.navigationFilters = nextProps.diamondFilters.navigationFilters;
        }

        if (this.props.diamondFilters !== nextProps.diamondFilters && this.props.diamondFilters.filtersReset !== nextProps.diamondFilters.filtersReset && nextProps.diamondFilters.filtersReset) {
            this.resetSliders();
            this.props.dispatch(getDiamondCards(JSON.parse(JSON.stringify(nextProps.diamondFilters.defaultPayload)), false));
        }

        if (this.props.diamondFilters !== nextProps.diamondFilters && this.props.diamondFilters.filtersUndone !== nextProps.diamondFilters.filtersUndone && nextProps.diamondFilters.filtersUndone) {
            this.undoSliders(nextProps);
        }

        if (getCards && !this.state.inputsInEdit && !nextProps.diamondFilters.filtersUndone && !nextProps.diamondFilters.filtersReset && !nextProps.diamondFilters.stopFetch) {
            map(updatedValues, (key, value) => {
                this.updateRequestPayLoad(value, key, true);
            });
            this.fetchDiamondFilterstData();
        }
    }

    /**
     * @description function to get the respective dimension id of clarity and color
     * @param {filtersArray} filtersArray containing all the dimensions
     * @param {filterKey}  filterKey for which the dimensionID is required
     * @param {filterType} filterType for which the dimensionID is required
     * @returns {filterDimensionId} returns the filterDimensionId for the key passed
     */
    getDimensionID = (filtersArray, filterKey, filterType) => {
        let dimensionID = '';

        const filterMap = filtersArray.filter(
            filter => filter.filterUrlId.toLowerCase() === filterKey.toLowerCase() && filter.filterType.toLowerCase() === filterType.toLowerCase()
        );

        if (filterMap && filterMap.length > 0) {
            dimensionID = filterMap[0].filterDimensionId;
        }
        return dimensionID;
    }

    /**
     * @description function to return only price(2000) formatted price ($2000)
     * @param {string} formattedPrice from the input
     * @returns {number} returns the price from formatted price
     */
    getPriceFromFormattedPrice = (formattedPrice) => {
        let price = formattedPrice;
        const currencyIndex = formattedPrice.indexOf(this.customCurrencyFormat);

        if (currencyIndex === 0) {
            price = formattedPrice.substring(this.customCurrencyFormat.length);
        } else if (currencyIndex > 0) {
            price = formattedPrice.substring(0, currencyIndex);
        }
        return price;
    }

    /**
     * @description function to update the sliders tabindex for sliders
     * @returns {void}
     */
    updateSlidersTabIndex = () => {
        setTimeout(() => {
            $('span.irs-line').attr('tabindex', -1);
        }, 10);
    }

    /**
     * @description function to update the sliders for mobile modals
     * @returns {void}
     */
    updateSliders = () => {
        this.updatePriceSliderMax(this.props.diamondFilters.currentMaxPrice);
        this.updatePriceSliderMin(this.props.diamondFilters.currentMinPrice);
        this.updateCaratSliderMax(this.props.diamondFilters.currentMaxCarat);
        this.updateCaratSliderMin(this.props.diamondFilters.currentMinCarat);
    }

    /**
     * @description function to allow only numbers in the input filed
     * @param {object} event object
     * @param {String} inputIdentifier Identifier to check which input is being used currently
     * @returns {*} prevent action
     */
    handleInputValidation = (event, inputIdentifier) => {
        const charCode = (event.which) ? event.which : event.keyCode;

        if (!(charCode === 13 || charCode === 46 || charCode === 36 || (charCode > 47 && charCode < 58))) {
            event.preventDefault();
        } else if (isEnter(event)) {
            const inputEntered = this.isNumberValid(event.target.value) ? event.target.value : '';

            if (inputEntered === '.') {
                if (inputIdentifier === 'price-min' || inputIdentifier === 'price-max') {
                    this.setState({ priceRangeError: true });
                } else if (inputIdentifier === 'carat-min' || inputIdentifier === 'carat-max') {
                    this.setState({ caratRangeError: true });
                }
            } else if (inputEntered !== '.' && inputEntered.length > 0) {
                if (inputIdentifier === 'price-min') {
                    if (!this.isValidMinPrice(parseFloat(inputEntered))) {
                        this.setState({ priceRangeError: true });
                    } else {
                        this.props.dispatch(updateCurrentValues({ currentMinPrice: inputEntered }));
                        this.setState({ priceRangeError: false },
                            () => {
                                this.applyFilters();
                            });
                    }
                } else if (inputIdentifier === 'price-max') {
                    if (!this.isValidMaxPrice(parseFloat(inputEntered))) {
                        this.setState({ priceRangeError: true });
                    } else {
                        this.props.dispatch(updateCurrentValues({ currentMaxPrice: inputEntered }));
                        this.setState({ priceRangeError: false },
                            () => {
                                this.applyFilters();
                            });
                    }
                } else if (inputIdentifier === 'carat-min') {
                    if (!this.isValidMinCarat(parseFloat(inputEntered))) {
                        this.setState({ caratRangeError: true });
                    } else {
                        this.props.dispatch(updateCurrentValues({ currentMinCarat: inputEntered }));
                        this.setState({ caratRangeError: false },
                            () => {
                                this.applyFilters();
                            });
                    }
                } else if (inputIdentifier === 'carat-max') {
                    if (!this.isValidMaxCarat(parseFloat(inputEntered))) {
                        this.setState({ caratRangeError: true });
                    } else {
                        this.props.dispatch(updateCurrentValues({ currentMaxCarat: inputEntered }));
                        this.setState({ caratRangeError: false },
                            () => {
                                this.applyFilters();
                            });
                    }
                }
            }
        }
    }

    /**
     * @description function to reset the price slider when reset
     * @returns {void}
     */
    resetSliders = () => {
        const valuesToReset = {};
        const caratMaxLabel = findFirst('.diamond-filter_container_list_carat_desc_inputs_max_label');
        const caratMinLabel = findFirst('.diamond-filter_container_list_carat_desc_inputs_min_label');
        const priceMaxLabel = findFirst('.diamond-filter_container_list_price_desc_inputs_max_label');
        const priceMinLabel = findFirst('.diamond-filter_container_list_price_desc_inputs_min_label');

        valuesToReset.currentMinPrice = parseFloat(objectPath.get(this.props.groupComplete, 'lowerPriceLimit', 0));
        valuesToReset.currentMaxPrice = parseFloat(objectPath.get(this.props.groupComplete, 'upperPriceLimit', 0));
        valuesToReset.currentMinCarat = parseFloat(objectPath.get(this.props.aem, 'engagementpdp.defaultMinCaratPosition', 0));
        valuesToReset.currentMaxCarat = parseFloat(objectPath.get(this.props.aem, 'engagementpdp.defaultMaxCaratPosition', 0));
        valuesToReset.navigationFilters = [this.state.assortmentId];
        valuesToReset.isAvailableOnline = false;
        this.props.dispatch(updateCurrentValues(valuesToReset, true));

        [...document.getElementsByClassName('filter_spec')].forEach(
            (element, index, array) => {
                removeClass(element, 'active');
            }
        );

        // adds the active class to the labels to make them scroll up
        addClass(priceMinLabel, 'active');
        addClass(priceMaxLabel, 'active');
        addClass(caratMinLabel, 'active');
        addClass(caratMaxLabel, 'active');

        this.removeErrorStates();
    }

    /**
     * @description function to remove error states of sliders
     * @returns {void}
     */
    removeErrorStates = () => {
        this.setState({
            priceRangeError: false,
            caratRangeError: false
        });
    }


    /**
     * @description function to undo sliders
     * @param {nextProps} nextProps of the component
     * @returns {void}
     */
    undoSliders = (nextProps) => {
        const valuesToUndo = {};

        if (parseFloat(this.props.diamondFilters.currentMaxCarat) !== parseFloat(nextProps.diamondFilters.currentPayload.payload.maxCaratWeight)) {
            valuesToUndo.currentMaxCarat = parseFloat(nextProps.diamondFilters.currentPayload.payload.maxCaratWeight);
        }

        if (parseFloat(this.props.diamondFilters.currentMinCarat) !== parseFloat(nextProps.diamondFilters.currentPayload.payload.minCaratWeight)) {
            valuesToUndo.currentMinCarat = parseFloat(nextProps.diamondFilters.currentPayload.payload.minCaratWeight);
        }

        if (parseFloat(this.props.diamondFilters.currentMinPrice) !== parseFloat(nextProps.diamondFilters.currentPayload.payload.lowerPriceLimit)) {
            valuesToUndo.currentMinPrice = nextProps.diamondFilters.currentPayload.payload.lowerPriceLimit ? parseFloat(nextProps.diamondFilters.currentPayload.payload.lowerPriceLimit) : parseFloat(objectPath.get(this.props.groupComplete, 'lowerPriceLimit', 0));
        }

        if (parseFloat(this.props.diamondFilters.currentMaxPrice) !== parseFloat(nextProps.diamondFilters.currentPayload.payload.upperPriceLimit)) {
            valuesToUndo.currentMaxPrice = nextProps.diamondFilters.currentPayload.payload.upperPriceLimit ? parseFloat(nextProps.diamondFilters.currentPayload.payload.upperPriceLimit) : parseFloat(objectPath.get(this.props.groupComplete, 'upperPriceLimit', 0));
        }

        if ((this.props.diamondFilters.navigationFilters).toString() !== (nextProps.diamondFilters.currentPayload.payload.navigationFilters).toString()) {
            valuesToUndo.navigationFilters = nextProps.diamondFilters.currentPayload.payload.navigationFilters ? nextProps.diamondFilters.currentPayload.payload.navigationFilters : [this.state.assortmentId];
        }

        this.props.dispatch(updateCurrentValues(valuesToUndo, true));

        const previousNavigationFilters = objectPath.get(nextProps.diamondFilters, 'currentPayload.payload.navigationFilters', []);

        [...document.getElementsByClassName('filter_spec')].forEach(
            (element, index, array) => {
                const { dimensionid } = element.dataset;

                if (previousNavigationFilters.indexOf(dimensionid) === -1) {
                    removeClass(element, 'active');
                }
            }
        );
        this.removeErrorStates();
    }

    /**
     * @description Method to toggle state variable, determines to show formatted value or not
     * @param {element} element triggering the action from the user
     * @param {String} inputIdentifier Identifier to check which input is being used currently
     * @param {action} action Identifier to check which input is on focus/blur
     * @returns {void}
     */
    toggleCurrencyFormat = (element, inputIdentifier, action) => {
        this.updateSlidersTabIndex();
        if (inputIdentifier === 'price-min') {
            if (action === 'focus') {
                this.setState({ inputsInEdit: true });
                this.setState({ typingInPriceMin: !this.state.typingInPriceMin });
            } else if (action === 'blur') {
                const updatedInput = parseFloat(element.target.value);

                this.setState({ inputsInEdit: false },
                    () => {
                        const maxPriceInput = (this.getPriceFromFormattedPrice(this.maxPriceInput.value)).replace(',', '');

                        if (!this.isValidMinPrice(updatedInput) || !this.isValidMaxPrice(parseFloat(maxPriceInput))) {
                            this.setState({ priceRangeError: true });
                        } else {
                            this.setState({ priceRangeError: false });
                            this.props.dispatch(updateCurrentValues({ currentMinPrice: updatedInput }));
                        }
                        this.setState({ typingInPriceMin: !this.state.typingInPriceMin });
                    });
            }
        } else if (inputIdentifier === 'price-max') {
            if (action === 'focus') {
                this.setState({ inputsInEdit: true });
                this.setState({ typingInPriceMax: !this.state.typingInPriceMax });
            } else if (action === 'blur') {
                const updatedInput = parseFloat(element.target.value);

                this.setState({ inputsInEdit: false },
                    () => {
                        const minPriceInput = (this.getPriceFromFormattedPrice(this.minPriceInput.value)).replace(',', '');

                        if (!this.isValidMaxPrice(updatedInput) || !this.isValidMinPrice(parseFloat(minPriceInput))) {
                            this.setState({ priceRangeError: true });
                        } else {
                            this.setState({ priceRangeError: false });
                            this.props.dispatch(updateCurrentValues({ currentMaxPrice: updatedInput }));
                        }
                        this.setState({ typingInPriceMax: !this.state.typingInPriceMax });
                    });
            }
        }
    }

    /**
     * @description addAssortmentID
     * @param {navigationArray} navigationArray containing navigation filters
     * @returns {navigationArray} with updated assortment ID
     */
    addAssortmentID = (navigationArray) => {
        if (navigationArray.indexOf(this.state.assortmentId) === -1) {
            navigationArray.push(this.state.assortmentId);
        }
        return navigationArray;
    }

    /**
     * @description function to reload the price slider
     * @param {currentMaxPrice} currentMaxPrice  of the price slider
     * @returns {void}
     */
    updatePriceSliderMax = (currentMaxPrice) => {
        const priceSlider = $('#price-slider').data('ionRangeSlider');

        if (priceSlider) {
            priceSlider.update({
                to: currentMaxPrice
            });
        }
    }

    /**
     * @description function to reload the price slider
     * @param {currentMinPrice} currentMinPrice  of the price slider
     * @returns {void}
     */
    updatePriceSliderMin = (currentMinPrice) => {
        const priceSlider = $('#price-slider').data('ionRangeSlider');

        if (priceSlider) {
            priceSlider.update({
                from: currentMinPrice
            });
        }
    }


    /**
     * @description function to reload the carat slider
     * @param {currentMinValue} currentMinValue value of the carat slider
     * @returns {void}
     */
    updateCaratSliderMin = (currentMinValue) => {
        const caratSlider = $('#carat-slider').data('ionRangeSlider');

        if (caratSlider) {
            caratSlider.update({
                from: currentMinValue
            });
        }
    }

    /**
     * @description function to reload the carat slider
     * @param {currentMaxValue} currentMaxValue value of the carat slider
     * @returns {void}
     */
    updateCaratSliderMax = (currentMaxValue) => {
        const caratSlider = $('#carat-slider').data('ionRangeSlider');

        if (caratSlider) {
            caratSlider.update({
                to: currentMaxValue
            });
        }
    }

    /**
     * @description function to load the previous results
     * @returns {void}
     */
    undoFilters = () => {
        this.props.dispatch(undoFilters());
    }

    /**
     * @param {Object} request pay load
     * @returns {void}
     */
    fetchDiamondFilterstData = () => {
        const isDesktop = window.matchMedia(styleVariables.desktopTabletAbove).matches;

        if (isDesktop && !this.state.priceRangeError && !this.state.caratRangeError) {
            this.props.dispatch(getDiamondCards(this.state.requestPayLoad, false));
        }
    }

    /**
     * @description function to reset the filters
     * @returns {void}
     */
    resetFilters = () => {
        $('.filter_spec').removeClass('active');

        let updatedNavigationFilters = this.props.diamondFilters.navigationFilters.slice();

        updatedNavigationFilters = [this.state.assortmentId];
        this.props.dispatch(updateCurrentValues({ navigationFilters: updatedNavigationFilters }));

        this.props.dispatch(resetFilters());
    }

    /**
     * @description Toggle the selection of diamonds available online
     * @param {event} event of the checbox
     * @returns {void}
     */
    availableOnlineKeyDown = (event) => {
        if (isSpaceOrEnter(event)) {
            this.props.dispatch(updateCurrentValues({ isAvailableOnline: !this.props.diamondFilters.isAvailableOnline }));
        }
    }

    /**
     * @description Toggle the selection of diamonds available online
     * @param {event} event of the checbox
     * @returns {void}
     */
    toggleOnlineAvailability = (event) => {
        if (event.target.checked) {
            this.props.dispatch(updateCurrentValues({ isAvailableOnline: true }));
        } else {
            this.props.dispatch(updateCurrentValues({ isAvailableOnline: false }));
        }
    }

    /**
     * @description Toggle the selection of clarity
     * @param {element} element triggering the event
     * @returns {void}
     */
    toggleClaritySelection = (element) => {
        const { filter, dimensionid } = element.currentTarget.dataset;
        let currentClarities = this.props.diamondFilters.claritiesSelected.slice();
        let navigationFilterIds = this.props.diamondFilters.navigationFilters.slice();

        if (!hasClass(element.target, 'active')) {
            currentClarities.push(filter);
            if (dimensionid.length > 0) {
                navigationFilterIds.push(dimensionid);
            }
        } else {
            currentClarities = currentClarities.filter(clarity => clarity !== filter);
            navigationFilterIds = navigationFilterIds.filter(thisDimesionID => thisDimesionID !== dimensionid);
        }

        navigationFilterIds = this.addAssortmentID(navigationFilterIds);
        toggleClass(element.target, 'active');
        this.updateRequestPayLoad('navigationFilters', navigationFilterIds, true);
        this.props.dispatch(updateCurrentValues({
            navigationFilters: navigationFilterIds,
            claritiesSelected: currentClarities
        }));
    }

    /**
     * @description Toggle the selection of color
     * @param {element} element triggering the event
     * @returns {void}
     */
    toggleColorSelection = (element) => {
        const { color, dimensionid } = element.currentTarget.dataset;
        let newselectedColors = this.props.diamondFilters.selectedColors.slice();
        let navigationFilterIds = this.props.diamondFilters.navigationFilters.slice();

        if (!hasClass(element.target, 'active')) {
            newselectedColors.push(color);
            if (dimensionid.length > 0) {
                navigationFilterIds.push(dimensionid);
            }
            this.props.dispatch(updateCurrentValues({ selectedColors: newselectedColors }));
        } else {
            newselectedColors = newselectedColors.filter(thisColor => thisColor !== color);
            navigationFilterIds = navigationFilterIds.filter(thisDimesionID => thisDimesionID !== dimensionid);
        }
        toggleClass(element.target, 'active');
        navigationFilterIds = this.addAssortmentID(navigationFilterIds);
        this.updateRequestPayLoad('navigationFilters', navigationFilterIds, true);
        this.props.dispatch(updateCurrentValues({
            navigationFilters: navigationFilterIds,
            selectedColors: newselectedColors
        }));
    }

    /**
     * @description function to validate max carat value
     * @param {number} maxCarat value
     * @returns {boolean} returns if the value is valid
     */
    isValidMaxCarat = maxCarat => {
        return (typeof maxCarat === 'number' &&
                !Number.isNaN(maxCarat) &&
                maxCarat > parseFloat(this.props.diamondFilters.currentMinCarat) &&
                maxCarat !== parseFloat(this.props.diamondFilters.currentMinCarat) &&
                maxCarat > parseFloat(this.state.minCarat) &&
                maxCarat <= parseFloat(this.state.maxCarat));
    }

    /**
     * @description function to validate min carat value
     * @param {number} minCarat value
     * @returns {boolean} returns if the value is valid
     */
    isValidMinCarat = minCarat => {
        return (typeof minCarat === 'number' &&
                !Number.isNaN(minCarat) &&
                minCarat < parseFloat(this.props.diamondFilters.currentMaxCarat) &&
                minCarat !== parseFloat(this.props.diamondFilters.currentMaxCarat) &&
                minCarat >= parseFloat(this.state.minCarat) &&
                minCarat < parseFloat(this.state.maxCarat));
    }

    /**
     * @description function to validate min price value
     * @param {number} minPrice value
     * @returns {boolean} returns if the value is valid
     */
    isValidMinPrice = minPrice => {
        return (typeof minPrice === 'number' &&
                !Number.isNaN(minPrice) &&
                minPrice < parseFloat(this.props.diamondFilters.currentMaxPrice) &&
                minPrice !== parseFloat(this.props.diamondFilters.currentMaxPrice) &&
                minPrice >= parseFloat(this.state.minPrice) &&
                minPrice < parseFloat(this.state.maxPrice));
    }

    /**
     * @description function to validate max price value
     * @param {number} maxPrice value
     * @returns {boolean} returns if the value is valid
     */
    isValidMaxPrice = maxPrice => {
        return (typeof maxPrice === 'number' &&
                !Number.isNaN(maxPrice) &&
                maxPrice > parseFloat(this.props.diamondFilters.currentMinPrice) &&
                maxPrice !== parseFloat(this.props.diamondFilters.currentMinPrice) &&
                maxPrice > parseFloat(this.state.minPrice) &&
                maxPrice <= parseFloat(this.state.maxPrice));
    }

    /**
     *
     * @param {event} event triggered  by the input
     * @param {field} field name of the input triggering the event
     * @param {action} action to differentiate focus/blur
     * @returns {void}
     */
    caratFieldChanged = (event, field, action) => {
        this.updateSlidersTabIndex();
        if (field === 'carat-min') {
            if (action === 'focus') {
                this.setState({ inputsInEdit: true });
            } else if (action === 'blur') {
                const updatedInput = parseFloat(event.target.value);

                this.setState({ inputsInEdit: false },
                    () => {
                        if (!this.isValidMinCarat(updatedInput) || !this.isValidMaxCarat(parseFloat(this.maxCaratInput.value))) {
                            this.setState({ caratRangeError: true });
                        } else {
                            this.setState({ caratRangeError: false });
                            this.props.dispatch(updateCurrentValues({ currentMinCarat: updatedInput }));
                        }
                    });
            }
        } else if (field === 'carat-max') {
            if (action === 'focus') {
                this.setState({ inputsInEdit: true });
            } else if (action === 'blur') {
                const updatedInput = parseFloat(event.target.value);

                this.setState({ inputsInEdit: false },
                    () => {
                        if (!this.isValidMaxCarat(updatedInput) || !this.isValidMinCarat(parseFloat(this.minCaratInput.value))) {
                            this.setState({ caratRangeError: true });
                        } else {
                            this.setState({ caratRangeError: false });
                            this.props.dispatch(updateCurrentValues({ currentMaxCarat: updatedInput }));
                        }
                    });
            }
        }
    }

    /**
     * @description function to trigger the apply filters in devices
     * @returns {void}
     */
    applyFilters = () => {
        const { requestPayLoad } = this.state;

        requestPayLoad.payload.lowerPriceLimit = this.props.diamondFilters.currentMinPrice;
        requestPayLoad.payload.upperPriceLimit = this.props.diamondFilters.currentMaxPrice;
        requestPayLoad.payload.minCaratWeight = this.props.diamondFilters.currentMinCarat;
        requestPayLoad.payload.maxCaratWeight = this.props.diamondFilters.currentMaxCarat;
        requestPayLoad.payload.isAvailableOnline = this.props.diamondFilters.isAvailableOnline ? true : '';
        requestPayLoad.payload.navigationFilters = this.addAssortmentID(this.props.diamondFilters.navigationFilters);

        if (!this.state.priceRangeError && !this.state.caratRangeError) {
            this.props.dispatch(getDiamondCards(requestPayLoad, false));
            this.props.dispatch(updateCurrentValues({ modalOpen: false }));
        }
    }

    /**
     * @description function to handle minCaratInputChanged
     * @param {event} event trigeering the event
     * @returns {void}
     */
    minCaratChanged = (event) => {
        const currentMinCarat = this.isNumberValid(event.target.value) ? event.target.value : '';

        this.props.dispatch(updateCurrentValues({ currentMinCarat }));
    }

    /**
     * @description function to handle max carat input
     * @param {event} event trigeering the event
     * @returns {void}
     */
    maxCaratChanged = (event) => {
        const currentMaxCarat = this.isNumberValid(event.target.value) ? event.target.value : '';

        this.props.dispatch(updateCurrentValues({ currentMaxCarat }));
    }

    /**
     * @description function to handle min price changed
     * @param {event} event trigeering the event
     * @returns {void}
     */
    minPriceChanged = (event) => {
        const currentMinPrice = this.isNumberValid(event.target.value) ? event.target.value : '';

        this.props.dispatch(updateCurrentValues({ currentMinPrice }));
    }

    /**
     * @description to validate the input entered by the user
     * @param {value} value entered by the user
     * @returns {boolean} boolean value if true/false
     */
    isNumberValid = (value) => {
        if (value === '.') {
            return true;
        }

        const pattern = /\d+\.?\d*/;

        return pattern.test(value);
    }

    /**
     * @description function to handle max price input change
     * @param {event} event trigeering the event
     * @returns {void}
     */
    maxPriceChanged = (event) => {
        const currentMaxPrice = this.isNumberValid(event.target.value) ? event.target.value : '';

        this.props.dispatch(updateCurrentValues({ currentMaxPrice }));
    }

    /**
     * @description function used to toggle the modal
     * @returns {void}
     */
    toggleModal = () => {
        this.props.dispatch(updateCurrentValues({ modalOpen: false }));
    }

    /**
     * @description updates the request payload
     * @param {param} param to be updated
     * @param {object} value of  the param
     * @param {bool} stopFetch stop fetch
     * @returns {void}
     */
    updateRequestPayLoad(param, value, stopFetch) {
        const { requestPayLoad } = this.state;

        if (value !== null && value.toString().length > 0) {
            if (param === 'isAvailableOnline' && value === false) {
                requestPayLoad.payload[param] = '';
            } else {
                requestPayLoad.payload[param] = value;
            }

            this.setState({ requestPayLoad });
            if (!stopFetch) {
                this.fetchDiamondFilterstData();
            }
        }
    }

    /**
     * @description renders the clarity filters
     * @param {filtersMapArray} filtersMapArray contains the list of the clarity
     * @returns {Object} HTML instance of the object
     */
    renderClarityList = (filtersMapArray) => {
        const clarityArray = objectPath.get(this.props.diamondFilters, 'updatedClarities', []);
        const ListOfClarities = objectPath.get(this.props.aem, 'engagementpdp.listOfClarities', []);
        const activeClarities = [...this.props.diamondFilters.claritiesSelected];

        return (
            ListOfClarities.map((option, index) => (
                <li
                    key={option}
                    className="clarity-option"
                >
                    <button
                        type="button"
                        onClick={(e) => this.toggleClaritySelection(e)}
                        data-id={index}
                        data-filter={option}
                        data-dimensionid={this.getDimensionID(filtersMapArray, option, 'DIAMOND CLARITY')}
                        disabled={clarityArray.indexOf(option) === -1 ? 'disabled' : ''}
                        aria-pressed={activeClarities.indexOf(option) !== -1 ? 'true' : 'false'}
                        className={
                            classNames(`filter_spec clarity_spec-${index}`,
                                {
                                    active: activeClarities.indexOf(option) !== -1
                                })
                        }
                    >
                        {option}
                    </button>
                </li>
            ))
        );
    }


    /**
     * @description renders the colors filters
     * @param {filtersMapArray} filtersMapArray contains the list of the colors
     * @returns {Object} HTML instance of the object
    //  */
    renderColors = (filtersMapArray) => {
        const availableColors = objectPath.get(this.props.diamondFilters, 'updatedColors', []);
        const ListOfColors = objectPath.get(this.props.aem, 'engagementpdp.listOfColors', []);
        const activeColors = [...this.props.diamondFilters.selectedColors];

        return (
            ListOfColors.map((option, index) => (
                <li
                    key={option}
                    className="color-option"
                >
                    <button
                        type="button"
                        onClick={(e) => this.toggleColorSelection(e)}
                        data-id={index}
                        data-color={option}
                        data-dimensionid={this.getDimensionID(filtersMapArray, option, 'DIAMOND COLOR')}
                        disabled={availableColors.indexOf(option) === -1 ? 'disabled' : ''}
                        aria-pressed={activeColors.indexOf(option) !== -1 ? 'true' : 'false'}
                        className={
                            classNames(`filter_spec color-${index}`,
                                {
                                    active: activeColors.indexOf(option) !== -1
                                })
                        }
                    >
                        {option}
                    </button>
                </li>
            ))
        );
    }

    /**
     * Render Component
     * @returns {Object} html instance
     */
    render() {
        const toolTips = objectPath.get(this.state.config, 'toolTips', {});
        const labels = objectPath.get(this.state.config, 'labels', {});
        const showAvailableOnline = objectPath.get(this.props.groupComplete, 'showAvailableOnlineFilter', null);
        const filtersMap = objectPath.get(window, 'tiffany.authoredContent.filtersMap', []);
        const diamondCut = objectPath.get(this.props.groupComplete, 'diamondCut.0', 'Excellent');
        const isDesktop = window.matchMedia(styleVariables.desktopTabletAbove).matches;
        const dataPlace = isDesktop ? 'top' : 'right';
        const filtersMapArray = filtersMap.filter(filter => {
            return filter.filterType.toLowerCase() === 'DIAMOND COLOR'.toLowerCase() || filter.filterType.toLowerCase() === 'DIAMOND CLARITY'.toLowerCase();
        });
        const { desktopAndBelow } = styleVariables;

        return (
            <div className="diamond-filter">
                <div className="diamond-filter_container">
                    <div className="diamond-filter_container_list">
                        <MediaQuery query={desktopAndBelow}>
                            <div className="diamond-filter_container_list_modal_close">
                                <button
                                    type="button"
                                    onClick={this.toggleModal}
                                    className="diamond-filter_container_list_modal_close_btn"
                                >
                                    <Picture
                                        defaultSrc={objectPath.get(labels, 'modalCloseIcon', './icons/close.svg')}
                                        altText={objectPath.get(labels, 'modalCloseIconAltText', 'close modal')}
                                        customClass="close modal"
                                        isLazyLoad={false}
                                    />
                                </button>
                            </div>
                        </MediaQuery>
                        <div className="diamond-filter_container_list_cut">
                            <div className="diamond-filter_container_list_cut_head">

                                <h3 className="diamond-filter_container_list_cut_head_title">{objectPath.get(labels, 'cutLabel', '')}</h3>
                                {
                                    toolTips.diamondCutText &&
                                    <div className="diamond-filter_container_list_cut_head_tooltip">
                                        <span
                                            role="button"
                                            data-tip=""
                                            data-for="diamondCutToolTip"
                                            data-type="light"
                                            data-place={dataPlace}
                                            data-class="filter-tooltip"
                                            data-border="true"
                                            data-event="click focus"
                                            id="diamondCutToolTipId"
                                            className="diamond-filter_container_list_cut_head_tooltip_button"
                                            tabIndex="0"
                                        >
                                            <Picture
                                                defaultSrc={objectPath.get(labels, 'toolTipIcon', './icons/information.svg')}
                                                altText={objectPath.get(labels, 'toolTipAltText', 'tooltip')}
                                                customClass="tooltip-image"
                                                isLazyLoad={false}
                                            />
                                        </span>
                                        <ReactTooltip
                                            className="filter_tooltip"
                                            id="diamondCutToolTip"
                                            effect="solid"
                                            globalEventOff="click focus"
                                            isCapture
                                        >
                                            <div aria-describedby="diamondCutToolTipId">
                                                <InformationText config={objectPath.get(toolTips, 'diamondCutText', '')} />
                                            </div>
                                        </ReactTooltip>
                                    </div>
                                }

                            </div>
                            <div className="diamond-filter_container_list_cut_desc">
                                <Picture
                                    defaultSrc={objectPath.get(labels, 'diamondIcon', './icons/diamondexpert.svg')}
                                    altText={objectPath.get(labels, 'diamondIconAlt', 'diamond')}
                                    isLazyLoad={false}
                                    customClass="tooltip-image"
                                />
                                <p className="diamond-filter_container_list_cut_desc_title">{diamondCut}</p>
                            </div>
                        </div>
                        <div className="diamond-filter_container_list_carat">
                            <div className="diamond-filter_container_list_carat_head">
                                <h3
                                    className="diamond-filter_container_list_carat_head_title"
                                    id="carat-heading"
                                >
                                    {objectPath.get(labels, 'caratWeightLabel', '')}
                                </h3>
                                {
                                    toolTips.diamondCaratText &&
                                    <div className="diamond-filter_container_list_carat_head_tooltip">
                                        <span
                                            role="button"
                                            data-tip=""
                                            data-for="diamondCaratToolTip"
                                            data-type="light"
                                            data-event="click focus"
                                            data-place={dataPlace}
                                            data-class="filter-tooltip"
                                            data-border="true"
                                            id="diamondCaratToolTipId"
                                            className="diamond-filter_container_list_cut_head_tooltip_button"
                                            tabIndex="0"
                                        >
                                            <Picture
                                                defaultSrc={objectPath.get(labels, 'toolTipIcon', './icons/information.svg')}
                                                altText={objectPath.get(labels, 'toolTipAltText', 'tooltip')}
                                                customClass="tooltip-image"
                                                isLazyLoad={false}
                                            />
                                        </span>
                                        <ReactTooltip
                                            className="filter_tooltip"
                                            id="diamondCaratToolTip"
                                            effect="solid"
                                            globalEventOff="click focus"
                                            isCapture
                                        >
                                            <div aria-describedby="diamondCaratToolTipId">
                                                <InformationText config={objectPath.get(toolTips, 'diamondCaratText', '')} />
                                            </div>
                                        </ReactTooltip>
                                    </div>
                                }
                                <div role="status" aria-live="polite">
                                    {
                                        this.state.caratRangeError &&
                                        <span className="slider-error">{objectPath.get(labels, 'caratErrorMsg', 'Select different carat range')}</span>
                                    }
                                </div>
                            </div>
                            <div className="diamond-filter_container_list_carat_desc">
                                <p className="diamond-filter_container_list_carat_desc_qty-labels">
                                    <span className="diamond-filter_container_list_carat_desc_qty-labels_min">{objectPath.get(labels, 'minLabel', '')}</span>
                                    <span className="diamond-filter_container_list_carat_desc_qty-labels_max">{objectPath.get(labels, 'maxLabel', '')}</span>
                                </p>
                                <div className="diamond-filter_container_list_carat_desc_slider mobile-fix">
                                    <input
                                        type="text"
                                        defaultValue=""
                                        id="carat-slider"
                                        name="carat-slider"
                                        tabIndex="-1"
                                        aria-label={objectPath.get(labels, 'caratSliderAriaLabel', 'Carat slider')}
                                    />
                                </div>
                                <div className="diamond-filter_container_list_carat_desc_inputs slider-inputs tf-g tf-g__middle tf-g__center" role="group" aria-labelledby="carat-heading">
                                    <div className="diamond-filter_container_list_carat_desc_inputs_min slider-inputs-min material-input col__full">
                                        <label
                                            htmlFor="carat-min"
                                            className="diamond-filter_container_list_carat_desc_inputs_min_label active"
                                            ref={(el) => { this.caratMinLabel = el; }}
                                        >
                                            {objectPath.get(labels, 'minLabel', '')}
                                        </label>
                                        <input
                                            type="text"
                                            id="carat-min"
                                            value={this.props.diamondFilters.currentMinCarat}
                                            onBlur={(el) => this.caratFieldChanged(el, 'carat-min', 'blur')}
                                            onFocus={(el) => this.caratFieldChanged(el, 'carat-min', 'focus')}
                                            onKeyPress={(event) => this.handleInputValidation(event, 'carat-min')}
                                            className="diamond-filter_container_list_carat_desc_inputs_min_input col__full tf-g__center"
                                            onChange={(el) => this.minCaratChanged(el)}
                                            ref={element => { if (element) { this.minCaratInput = element; } }}
                                        />
                                    </div>
                                    <p className="diamond-filter_container_list_carat_desc_inputs_divider slider-inputs_label">{objectPath.get(labels, 'toLabel', '')}</p>
                                    <div className="diamond-filter_container_list_carat_desc_inputs_max slider-inputs-max material-input col__full">
                                        <label
                                            htmlFor="carat-max"
                                            className="diamond-filter_container_list_carat_desc_inputs_max_label active"
                                            ref={(el) => { this.caratMaxLabel = el; }}
                                        >
                                            {labels.maxLabel}
                                        </label>
                                        <input
                                            type="text"
                                            id="carat-max"
                                            value={this.props.diamondFilters.currentMaxCarat}
                                            onBlur={(el) => this.caratFieldChanged(el, 'carat-max', 'blur')}
                                            onFocus={(el) => this.caratFieldChanged(el, 'carat-max', 'focus')}
                                            onKeyPress={(event) => this.handleInputValidation(event, 'carat-max')}
                                            className="diamond-filter_container_list_carat_desc_inputs_max_input col__full tf-g__center"
                                            onChange={(el) => this.maxCaratChanged(el)}
                                            ref={element => { if (element) { this.maxCaratInput = element; } }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="diamond-filter_container_list_color">
                            <div className="diamond-filter_container_list_color_head">
                                <h3 className="diamond-filter_container_list_color_head_title">{objectPath.get(labels, 'colorLabel', '')}</h3>
                                {
                                    toolTips.diamondColorText &&
                                    <div className="diamond-filter_container_list_color_head_tooltip">
                                        <span
                                            role="button"
                                            data-tip=""
                                            data-for="diamondColorToolTip"
                                            data-type="light"
                                            data-event="click focus"
                                            data-place={dataPlace}
                                            data-class="filter-tooltip"
                                            data-border="true"
                                            id="diamondCaratToolTipId"
                                            tabIndex="0"
                                            className="diamond-filter_container_list_color_head_tooltip_button"
                                        >
                                            <Picture
                                                defaultSrc={objectPath.get(labels, 'toolTipIcon', './icons/information.svg')}
                                                altText={objectPath.get(labels, 'toolTipAltText', 'tooltip')}
                                                customClass="tooltip-image"
                                                isLazyLoad={false}
                                            />
                                        </span>
                                        <ReactTooltip
                                            className="filter_tooltip"
                                            id="diamondColorToolTip"
                                            effect="solid"
                                            globalEventOff="click focus"
                                            isCapture
                                        >
                                            <div aria-describedby="diamondColorToolTipId">
                                                <InformationText config={objectPath.get(toolTips, 'diamondColorText', '')} />
                                            </div>
                                        </ReactTooltip>
                                    </div>
                                }
                            </div>
                            <div className="diamond-filter_container_list_color_desc">
                                <ul className="diamond-filter_container_list_color_desc_list">
                                    {this.renderColors(filtersMapArray)}
                                </ul>
                            </div>
                        </div>
                        <div className="diamond-filter_container_list_clarity">
                            <div className="diamond-filter_container_list_clarity_head">
                                <h3 className="diamond-filter_container_list_clarity_head_title">{objectPath.get(labels, 'clarityLabel', '')}</h3>
                                {
                                    toolTips.diamondClarityText &&
                                    <div className="diamond-filter_container_list_clarity_head_tooltip">
                                        <span
                                            role="button"
                                            data-tip=""
                                            data-for="diamondClarityToolTip"
                                            data-type="light"
                                            data-event="click focus"
                                            data-place={dataPlace}
                                            data-class="filter-tooltip"
                                            data-border="true"
                                            id="diamondClarityToolTipId"
                                            tabIndex="0"
                                            className="diamond-filter_container_list_clarity_head_tooltip_button"
                                        >
                                            <Picture
                                                defaultSrc={objectPath.get(labels, 'toolTipIcon', './icons/information.svg')}
                                                altText={objectPath.get(labels, 'toolTipAltText', 'tooltip')}
                                                customClass="tooltip-image"
                                                isLazyLoad={false}
                                            />
                                        </span>
                                        <ReactTooltip
                                            className="filter_tooltip"
                                            id="diamondClarityToolTip"
                                            effect="solid"
                                            globalEventOff="click focus"
                                            isCapture
                                        >
                                            <div aria-describedby="diamondClarityToolTipId">
                                                <InformationText config={objectPath.get(toolTips, 'diamondClarityText', '')} />
                                            </div>
                                        </ReactTooltip>
                                    </div>
                                }
                            </div>
                            <div className="diamond-filter_container_list_clarity_desc">
                                <ul className="diamond-filter_container_list_clarity_desc_list">
                                    {this.renderClarityList(filtersMapArray)}
                                </ul>
                            </div>
                        </div>
                        <div className="diamond-filter_container_list_price">
                            <div className="diamond-filter_container_list_price_head">
                                <h3 className="diamond-filter_container_list_price_head_title" id="price-heading">{objectPath.get(labels, 'priceLabel', '')}</h3>

                                {
                                    toolTips.diamondPriceText &&
                                    <div className="diamond-filter_container_list_price_head_tooltip">
                                        <span
                                            role="button"
                                            data-tip=""
                                            data-for="diamondPriceToolTip"
                                            data-type="light"
                                            data-event="click focus"
                                            data-place={dataPlace}
                                            data-class="filter-tooltip"
                                            data-border="true"
                                            id="diamondPriceToolTipId"
                                            tabIndex="0"
                                            className="diamond-filter_container_list_clarity_tooltip_button"
                                        >
                                            <Picture
                                                defaultSrc={objectPath.get(labels, 'toolTipIcon', './icons/information.svg')}
                                                altText={objectPath.get(labels, 'toolTipAltText', 'tooltip')}
                                                customClass="tooltip-image"
                                                isLazyLoad={false}
                                            />
                                        </span>
                                        <ReactTooltip
                                            className="filter_tooltip"
                                            id="diamondPriceToolTip"
                                            effect="solid"
                                            globalEventOff="click"
                                            isCapture
                                        >
                                            <div aria-describedby="diamondPriceToolTipId">
                                                <InformationText config={objectPath.get(toolTips, 'diamondPriceText', '')} />
                                            </div>
                                        </ReactTooltip>
                                    </div>
                                }
                                <div role="status" aria-live="polite">
                                    {
                                        this.state.priceRangeError &&
                                        <span className="slider-error">{objectPath.get(labels, 'priceErrorMsg', 'Select different price')}</span>
                                    }
                                </div>
                            </div>
                            <div className="diamond-filter_container_list_price_desc">
                                <p className="diamond-filter_container_list_price_desc_qty-labels">
                                    <span className="diamond-filter_container_list_price_desc_qty-labels_min">{objectPath.get(labels, 'minLabel', '')}</span>
                                    <span className="diamond-filter_container_list_price_desc_qty-labels_max">{objectPath.get(labels, 'maxLabel', '')}</span>
                                </p>

                                <div className="diamond-filter_container_list_price_desc_slider mobile-fix">
                                    <input
                                        type="text"
                                        defaultValue=""
                                        id="price-slider"
                                        name="price-slider"
                                        tabIndex="-1"
                                        aria-label={objectPath.get(labels, 'priceSliderAriaLabel', 'Price slider')}
                                    />
                                </div>
                                <div className="diamond-filter_container_list_price_desc_inputs slider-inputs tf-g__middle tf-g__center" role="group" aria-labelledby="price-heading">
                                    <div className="diamond-filter_container_list_price_desc_inputs_min slider-inputs-min material-input col__full">
                                        <label
                                            htmlFor="price-min"
                                            className="diamond-filter_container_list_price_desc_inputs_min_label active"
                                            ref={(el) => { this.priceMinLabel = el; }}
                                        >
                                            {this.currencyFormat} {labels.minLabel}
                                        </label>
                                        <input
                                            type="text"
                                            id="price-min"
                                            onFocus={(event) => { this.toggleCurrencyFormat(event, 'price-min', 'focus'); }}
                                            onBlur={(event) => { this.toggleCurrencyFormat(event, 'price-min', 'blur'); }}
                                            onKeyPress={(event) => this.handleInputValidation(event, 'price-min')}
                                            value={this.state.typingInPriceMin ? this.props.diamondFilters.currentMinPrice : currencyFormatter(this.props.diamondFilters.currentMinPrice)}
                                            className="diamond-filter_container_list_price_desc_inputs_min_input col__full tf-g__start"
                                            onChange={(el) => this.minPriceChanged(el)}
                                            ref={element => { if (element) { this.minPriceInput = element; } }}
                                        />
                                    </div>
                                    <p className="diamond-filter_container_list_price_desc_inputs_divider slider-inputs_label">{objectPath.get(labels, 'toLabel', '')}</p>
                                    <div className="diamond-filter_container_list_price_desc_inputs_max slider-inputs-max material-input col__full">
                                        <label
                                            htmlFor="price-max"
                                            className="diamond-filter_container_list_price_desc_inputs_max_label active"
                                            ref={(el) => { this.priceMaxLabel = el; }}
                                        >
                                            {this.currencyFormat} {objectPath.get(labels, 'maxLabel', '')}
                                        </label>
                                        <input
                                            type="text"
                                            id="price-max"
                                            onFocus={(event) => { this.toggleCurrencyFormat(event, 'price-max', 'focus'); }}
                                            onBlur={(event) => { this.toggleCurrencyFormat(event, 'price-max', 'blur'); }}
                                            onKeyPress={(event) => this.handleInputValidation(event, 'price-max')}
                                            value={this.state.typingInPriceMax ? this.props.diamondFilters.currentMaxPrice : currencyFormatter(this.props.diamondFilters.currentMaxPrice)}
                                            onChange={(el) => this.maxPriceChanged(el)}
                                            ref={element => { if (element) { this.maxPriceInput = element; } }}
                                            className="diamond-filter_container_list_price_desc_inputs_max_input col__full tf-g__start"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            (showAvailableOnline && !this.state.forced1BVariation) &&
                            <div className="diamond-filter_container_list_availability">
                                <h3 className="diamond-filter_container_list_availability_txt">{objectPath.get(labels, 'avialableOnlineText', '')}</h3>
                                <label htmlFor="available_online" className="btn-toggle diamond-filter_container_list_availability_label">
                                    <input
                                        type="checkbox"
                                        className={
                                            classNames('available_online',
                                                {
                                                    checked: this.props.diamondFilters.isAvailableOnline
                                                })
                                        }
                                        id="available_online"
                                        checked={this.props.diamondFilters.isAvailableOnline ? 'checked' : ''}
                                        onClick={(event) => this.toggleOnlineAvailability(event)}
                                    />
                                    <span
                                        className="btn-switch"
                                        tabIndex="0"
                                        role="checkbox"
                                        aria-checked={this.props.diamondFilters.isAvailableOnline || false}
                                        aria-label={objectPath.get(labels, 'avialableOnlineText', '')}
                                        onKeyDown={(event) => this.availableOnlineKeyDown(event)}
                                    />
                                </label>
                            </div>
                        }
                        {
                            this.props.diamondFilters.previousPayload.length > 1 &&
                            <div className="diamond-filter_container_list_reset">
                                <button
                                    className="diamond-filter_container_list_reset_btn"
                                    type="button"
                                    onClick={this.resetFilters}
                                    data-interaction-context={AnalyticsConstants.DIAMOND_SEL}
                                    data-interaction-type={AnalyticsConstants.RESET}
                                    data-interaction-name={AnalyticsConstants.RESET}
                                >
                                    {this.state.config.labels.resetText}
                                </button>
                            </div>
                        }
                        <MediaQuery query={desktopAndBelow}>
                            <div className="diamond-filter_container_list_apply">
                                <button
                                    className="diamond-filter_container_list_apply_btn"
                                    type="button"
                                    onClick={this.applyFilters}
                                >
                                    {labels.applyFiltersLabel}
                                </button>
                            </div>
                        </MediaQuery>
                    </div>
                </div>
            </div>
        );
    }
}

DiamondFilters.propTypes = {
    config: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired,
    groupComplete: PropTypes.object.isRequired,
    diamondFilters: PropTypes.object.isRequired
};


const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        ...state.diamondFilters.filters,
        diamondFilters: state.diamondFilters,
        groupComplete: objectPath.get(state.aem, 'engagementpdp.groupCompleteResponse', {})
    };
};

export default connect(mapStateToProps)(DiamondFilters);
