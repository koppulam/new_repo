import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import find from 'lodash/find';
import * as objectPath from 'object-path';
import CustomScrollBar from 'components/common/CustomScrollBar';

import { updateVariant } from 'actions/EngravingActions';
import { currencyFormatter } from 'lib/utils/currency-formatter';
import { validateInput } from 'lib/utils/engraving';
import { setAnalyticsData, triggerAnalyticsEvent, formatStringForTracking } from 'lib/utils/analytics-util';
import matchMedia from 'lib/dom/match-media';

import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import styleVariables from 'lib/utils/breakpoints';
import { findFirst } from 'lib/dom/dom-util';

// Components
import Picture from 'components/common/Picture';

// import './index.scss';

/**
 * @description Engraving Initials component
 * @class InitialEngravings
 */
class InitialEngravings extends React.Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.defaultPlaceholders = {
            initialOne: objectPath.get(props, 'authoredLabels.engraving.initials.placeHolderOne', 'a'),
            initialTwo: objectPath.get(props, 'authoredLabels.engraving.initials.placeHolderTwo', 'b'),
            initialThree: objectPath.get(props, 'authoredLabels.engraving.initials.placeHolderThree', 'c')
        };

        this.inputs = [{
            placeHolder: this.defaultPlaceholders.initialOne,
            elem: {},
            state: 'initialOne',
            labelPath: 'engraving.initials.inpLabelOne',
            FallbackLabel: 'Enter initial one'
        },
        {
            placeHolder: this.defaultPlaceholders.initialTwo,
            elem: {},
            state: 'initialTwo',
            labelPath: 'engraving.initials.inpLabelTwo',
            FallbackLabel: 'Enter initial two'
        },
        {
            placeHolder: this.defaultPlaceholders.initialThree,
            elem: {},
            state: 'initialThree',
            labelPath: 'engraving.initials.inpLabelThree',
            FallbackLabel: 'Enter initial three'
        }];

        this.state = {
            initialOne: objectPath.get(props, 'variant.initialOne', ''),
            initialTwo: objectPath.get(props, 'variant.initialTwo', ''),
            initialThree: objectPath.get(props, 'variant.initialThree', ''),
            selectedEngravingTypeName: '',
            selectedEngravingTypeId: objectPath.get(props, 'variant.itemServiceTypeId', 1),
            nextBtnDisabled: true,
            showErrorMessage: false,
            errorMessage: '',
            errorInputIndex: null,
            monogramSelected: props.variant.itemServiceTypeId === props.monogramServiceID
        };
    }

    /**
     * Lifcycle hook
     * @returns {void}
     */
    componentDidMount() {
        this.props.enableFocus(this.setDefaultSelectedState);
        const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.BELOW_DESKTOP_TABLET).matches;

        if (!isDesktop) {
            findFirst('.tiffany-inline-modal--close, .engraving__close').focus();
        }
    }

    /**
     * function to set default state for initials
     * @returns {void}
     */
    setDefaultSelectedState = () => {
        this.updateAnalyticsData();
        const isDesktop = !window.matchMedia(matchMedia.BREAKPOINTS.BELOW_DESKTOP_TABLET).matches;

        if (this.inputs[0] && isDesktop) {
            this.inputs[0].elem.focus();
        }
        this.toggleNextButtonState();
    }

    /**
     * function to set initials entered by user
     * @param {event} event object from the input
     * @param {object} inputIndex of initial
     * @returns {void}
     */
    setInitials = (event, inputIndex) => {
        const { variant } = this.props;
        const input = this.inputs[inputIndex];
        const maxlength = this.props.maxInputCharacters;

        if (maxlength && input.elem.value && input.elem.value.length > maxlength) {
            event.preventDefault();
        } else {
            const validateStatus = this.validateInput(input.elem.value);

            if (validateStatus) {
                this.setState({
                    [input.state]: variant.isTrueType ? input.elem.value : input.elem.value.toUpperCase()
                }, () => {
                    // Initials values should go back to placeholdes on image and font styles when there are no inputs available
                    const inputValues = {};

                    this.inputs.forEach((inputRef) => {
                        inputValues[inputRef.state] = inputRef.elem.value || '';
                    });

                    this.props.dispatch(updateVariant(inputValues));
                    if (input.elem.value !== '' && this.inputs[inputIndex + 1]) {
                        this.inputs[inputIndex + 1].elem.focus();
                    }
                    this.setState({
                        errorInputIndex: null,
                        showErrorMessage: false,
                        errorMessage: ''
                    });
                    this.toggleNextButtonState();
                });
            } else {
                input.elem.value = '';
                this.setState({
                    errorInputIndex: inputIndex,
                    showErrorMessage: true
                });
            }
        }
    }

    /**
     * function to set font style code
     * @param {number} styleCode style code of the tile selected
     * @param {boolean} isTrueType is the font style True type
     * @returns {void}
     */
    setFontStyle = (styleCode, isTrueType = false) => {
        if (this.state.nextBtnDisabled) {
            return;
        }
        if (styleCode) {
            let {
                initialOne,
                initialTwo,
                initialThree
            } = this.props.variant;
            const { itemServiceTypeId } = this.props.variant;

            initialOne = validateInput(initialOne, itemServiceTypeId, isTrueType);
            initialTwo = validateInput(initialTwo, itemServiceTypeId, isTrueType);
            initialThree = validateInput(initialThree, itemServiceTypeId, isTrueType);

            this.setState({
                initialOne,
                initialTwo,
                initialThree
            }, () => {
                this.props.dispatch(updateVariant({
                    styleCode: parseInt(styleCode, 10),
                    initialOne,
                    initialTwo,
                    initialThree,
                    isTrueType
                }));
                this.handleOverwritingInputs(isTrueType);
            });
        }
    }

    /**
     * @description method to maintain checked state of hand engraving even if monogram is selected
     * @param {Number} currentID id of the radio button
     * @returns {Boolean} should hand engraving be selected
     */
    checkForMonogram = (currentID) => {
        return parseInt(this.props.monogramLinkedTo, 10) === parseInt(currentID, 10) && parseInt(this.state.selectedEngravingTypeId, 10) === parseInt(this.props.monogramServiceID, 10);
    };

    /**
     * function to set input values based on the font selected
     * @param {Boolean} isTrueType boolean to determine font's truetype
     * @returns {void}
     */
    handleOverwritingInputs = (isTrueType) => {
        if (!isTrueType) {
            this.setState({
                initialOne: this.validateInput(this.state.initialOne) ? this.state.initialOne.toUpperCase() : '',
                initialTwo: this.validateInput(this.state.initialTwo) ? this.state.initialTwo.toUpperCase() : '',
                initialThree: this.validateInput(this.state.initialThree) ? this.state.initialThree.toUpperCase() : ''
            });
            this.toggleNextButtonState();
        }
    }

    /**
     * function to validate user input
     * @param {object} inputText user input
     * @returns {boolean} valid status
     */
    validateInput = (inputText) => {
        const { variant } = this.props;

        if (!inputText) {
            return true;
        }

        let charToAllow;

        if (parseInt(this.state.selectedEngravingTypeId, 10) === this.props.monogramServiceID) {
            charToAllow = new RegExp(/^[a-zA-Z]+$/g);
        } else if (variant.isTrueType) {
            charToAllow = new RegExp(/^[a-zA-Z0-9!.@#$%&*(")_+|:<,>?='-]+$/g);
        } else {
            charToAllow = new RegExp(/^[a-zA-Z0-9]+$/g);
        }

        const errors = objectPath.get(window, 'dataLayer.page.errors', []);
        let errCode = '';

        if (inputText.match(charToAllow)) {
            return true;
        }
        if (parseInt(this.state.selectedEngravingTypeId, 10) === this.props.monogramServiceID) {
            errCode = AnalyticsConstants.MONOENGRV_ERR;
            errors.push(errCode);
            this.setState({ errorMessage: objectPath.get(this.props, 'authoredLabels.engraving.initials.nonMonogramCharacters', '') });
        } else {
            errCode = AnalyticsConstants.ENGRV_ERR;
            errors.push(errCode);
            this.setState({ errorMessage: objectPath.get(this.props, 'authoredLabels.engraving.initials.invalidCharacters', '') });
        }

        setAnalyticsData('page.errors', errors);
        triggerAnalyticsEvent(AnalyticsConstants.INLINE_ERROR, { errorCode: errCode });
        return false;
    }

    /**
     * @description method triggered on monogram checkbox toggle
     * @param {object} fallBackConfig if monogram is deselected
     * @returns {void}
     */
    toggleMonogramEngraving = (fallBackConfig) => {
        this.setState({ monogramSelected: !this.state.monogramSelected }, () => {
            // TODO: select proper config in reducer
            let configToBeSet = {};

            if (this.state.monogramSelected) {
                configToBeSet = this.props.monogramConfig;
            } else {
                configToBeSet = fallBackConfig;
            }
            this.toggleEngravingType(configToBeSet);
        });
    }

    /**
     * function to toggle next button disable state
     * @returns {void}
     */
    toggleNextButtonState = () => {
        // If Monogram then all fields should have values
        if (parseInt(this.state.selectedEngravingTypeId, 10) === this.props.monogramServiceID) {
            if (this.state.initialOne && this.state.initialTwo && this.state.initialThree) {
                this.setState({ nextBtnDisabled: false });
            } else {
                this.setState({ nextBtnDisabled: true });
            }
        } else if ((this.state.initialOne || this.state.initialTwo || this.state.initialThree)) {
            this.setState({ nextBtnDisabled: false });
        } else {
            this.setState({ nextBtnDisabled: true });
        }
    }

    /**
     * function to toggle mobile filter state
     * @param {object} category of engraving type
     * @returns {void}
     */
    toggleEngravingType = (category) => {
        let {
            initialOne,
            initialTwo,
            initialThree
        } = this.props.variant;
        const isTrueType = objectPath.get(category, 'details.styleGroups.0.styles.0.isTrueType');
        const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.BELOW_DESKTOP_TABLET).matches;

        initialOne = validateInput(initialOne, category.serviceTypeId, isTrueType);
        initialTwo = validateInput(initialTwo, category.serviceTypeId, isTrueType);
        initialThree = validateInput(initialThree, category.serviceTypeId, isTrueType);

        if (!isTrueType) {
            initialOne = initialOne ? initialOne.toUpperCase() : '';
            initialTwo = initialTwo ? initialTwo.toUpperCase() : '';
            initialThree = initialThree ? initialThree.toUpperCase() : '';
        }

        this.props.dispatch(updateVariant({
            itemServiceTypeId: category.serviceTypeId,
            initialOne,
            initialTwo,
            initialThree
        }));

        this.setState({
            selectedEngravingTypeId: category.serviceTypeId,
            selectedEngravingTypeName: category.label,
            errorInputIndex: null,
            showErrorMessage: false,
            errorMessage: '',
            initialOne,
            initialTwo,
            initialThree,
            isTrueType
        }, () => {
            this.toggleNextButtonState();

            // If new service ID is not monogram then unchecking the checkbox
            if (parseInt(this.state.selectedEngravingTypeId, 10) !== parseInt(this.props.monogramServiceID, 10)) {
                this.setState({
                    monogramSelected: false
                });
            }

            if (this.inputs[0] && !this.inputs[0].elem.value && isDesktop) {
                this.inputs[0].elem.focus();
            }
            this.updateAnalyticsData();
        });
    }

    /**
     * Set analytics data
     * @returns {void}
     */
    updateAnalyticsData() {
        // setting analytics data
        const productObj = objectPath.get(window, 'dataLayer.product', {});
        let selectedEngraving = find(this.props.categories, (type) => {
            return parseInt(this.state.selectedEngravingTypeId, 10) === parseInt(type.serviceTypeId, 10);
        });

        if (parseInt(this.state.selectedEngravingTypeId, 10) === parseInt(this.props.monogramServiceID, 10)) {
            selectedEngraving = this.props.monogramConfig;
        }
        let unitPrice = objectPath.get(selectedEngraving, 'pricing.unitPrice', 0);

        unitPrice = parseFloat(Math.round(unitPrice * 100) / 100).toFixed(2);
        const analyticsObject = {
            step: AnalyticsConstants.ENGRAVING_CONFIGURE,
            style: AnalyticsConstants.ENGRAVING_INITIALS,
            type: formatStringForTracking(selectedEngraving.label),
            price: unitPrice,
            back: false,
            product: productObj
        };

        const existingAnalytics = objectPath.get(window, 'dataLayer.personalization', {});

        if (existingAnalytics &&
            (existingAnalytics.step === AnalyticsConstants.ENGRAVING_CONFIRM ||
                (existingAnalytics.step === AnalyticsConstants.ENGRAVING_CONFIGURE && existingAnalytics.back === true
                ))) {
            analyticsObject.back = true;
        }

        setAnalyticsData(AnalyticsConstants.ENGRAVING_PERSONALIZATION, analyticsObject);
        triggerAnalyticsEvent(AnalyticsConstants.ENGRAVING_UPDATE_PERSONALIZATION, {});
    }

    /**
     * @param {*} initialsEngraving actual initial types
     * @returns {object} html structure
     */
    renderEngravingType = (initialsEngraving) => {
        const { selectedEngravingTypeId } = this.state;
        const { monogramConfig } = this.props;

        return (
            initialsEngraving && initialsEngraving.length > 0 &&
            initialsEngraving
                .map((type, index) => (
                    <div className="type-wrapper__type" key={type.serviceTypeId}>
                        <div className="type-wrapper__type_heading">
                            <div
                                className="type-wrapper__type_heading_text display__inline-block custom-radio-wrapper"
                                aria-checked={parseInt(selectedEngravingTypeId, 10) === parseInt(type.serviceTypeId, 10)}
                                aria-label={type.label}
                                tabIndex="0"
                                onClick={() => this.toggleEngravingType(type)}
                                onKeyPress={() => this.toggleEngravingType(type)}
                                role="radio"
                                aria-setsize={initialsEngraving.length}
                                aria-posinset={index + 1}
                            >
                                <div
                                    className={
                                        classNames('custom-radio-wrapper__radio display__inline-block vertical-align__middle ',
                                            {
                                                checked: parseInt(selectedEngravingTypeId, 10) === parseInt(type.serviceTypeId, 10) || this.checkForMonogram(type.serviceTypeId)
                                            })
                                    }
                                >
                                    <span className="blue-dot display__block" />
                                </div>
                                {type.label}
                            </div>
                            <span className="type-wrapper__type_heading_price">{currencyFormatter(type.pricing.unitPrice * type.pricing.servicingQuantity)}</span>
                        </div>
                        {type.isRte ?
                            <div
                                className={
                                    classNames('type-wrapper__type_description tiffany-rte',
                                        {
                                            hide: parseInt(selectedEngravingTypeId, 10) !== parseInt(type.serviceTypeId, 10) && !this.checkForMonogram(type.serviceTypeId)
                                        })
                                }
                                dangerouslySetInnerHTML={{ __html: type.description }}
                            />
                            :
                            <p
                                className={
                                    classNames('type-wrapper__type_description',
                                        {
                                            hide: parseInt(selectedEngravingTypeId, 10) !== parseInt(type.serviceTypeId, 10) && !this.checkForMonogram(type.serviceTypeId)
                                        })
                                }
                            >
                                {type.description}
                            </p>
                        }
                        {
                            this.props.hasMonograming &&
                            parseInt(this.props.monogramLinkedTo, 10) === parseInt(type.serviceTypeId, 10) &&
                            (parseInt(this.props.monogramLinkedTo, 10) === parseInt(selectedEngravingTypeId, 10) || parseInt(this.props.monogramServiceID, 10) === parseInt(selectedEngravingTypeId, 10)) &&
                            <div className="monograming">
                                <label
                                    htmlFor="monogramSelected"
                                    className="custom-checkbox"
                                    role="checkbox"
                                    aria-checked={this.state.monogramSelected}
                                    aria-label={monogramConfig.styleDescription}
                                >
                                    <input
                                        id="monogramSelected"
                                        className="custom-checkbox__input hide-from__screen"
                                        value=""
                                        type="checkbox"
                                        checked={this.state.monogramSelected}
                                        onChange={() => this.toggleMonogramEngraving(type)}
                                    />
                                    <div className="custom-checkbox__text">
                                        <div className="monograming__wrapper tf-g">
                                            <MediaQuery query={styleVariables.desktopAndAbove}>
                                                <Picture
                                                    {...monogramConfig.previewConfig}
                                                    customClass="monograming__wrapper_thumbnail tf-g"
                                                    isLazyLoad
                                                />
                                            </MediaQuery>
                                            {monogramConfig.isRte ?
                                                <div
                                                    className="type-wrapper__type_description tiffany-rte"
                                                    dangerouslySetInnerHTML={{ __html: monogramConfig.description }}
                                                />
                                                :
                                                <p
                                                    className="type-wrapper__type_description"
                                                >
                                                    {monogramConfig.description}
                                                </p>
                                            }
                                        </div>
                                    </div>
                                </label>
                            </div>
                        }
                    </div>
                ))
        );
    }

    /**
    * @returns {object} html structure
    */
    renderEngravingText = () => {
        return (
            <div className="engraving-initials__body_section">
                <p className="engraving-initials__body_section_title" id="engraving-initials-text">
                    {objectPath.get(this.props.authoredLabels, 'engraving.initialsInputHeading', '')}
                </p>
                <div
                    className="tf-g"
                    role="group"
                    aria-labelledby="engraving-initials-text"
                >
                    <div className="engraving-initials__body_section_body text-wrapper col__full">
                        {
                            this.inputs.map((input, index) => (
                                <div className="text-wrapper__holder tf-g tf-g__middle tf-g__center tf-g__col" key={index.toString()}>
                                    <input
                                        type="text"
                                        className={
                                            classNames('text-wrapper__holder_text col__full vertical-align__bottom',
                                                {
                                                    large: (parseInt(this.state.selectedEngravingTypeId, 10) === this.props.monogramServiceID && index === this.props.additionStyleIndex),
                                                    error: this.state.errorInputIndex === index
                                                })
                                        }
                                        placeholder={input.placeHolder}
                                        ref={(inputElem) => { input.elem = inputElem; }}
                                        maxLength={this.props.maxInputCharacters}
                                        onChange={(event) => this.setInitials(event, index)}
                                        value={this.state[input.state]}
                                        aria-label={objectPath.get(this.props.authoredLabels, input.labelPath, input.FallbackLabel)}
                                    />
                                </div>
                            ))
                        }
                    </div>
                    <div className="engraving-initials__body_section_body text-wrapper col__full">
                        {
                            this.inputs.map((input, index) => (
                                <p className="text-wrapper__holder tf-g tf-g__middle tf-g__center tf-g__col text-wrapper__holder_label" key={index.toString()}>
                                    {objectPath.get(this.props.authoredLabels, input.labelPath, input.FallbackLabel)}
                                </p>
                            ))
                        }
                    </div>
                </div>
                {
                    this.state.showErrorMessage &&
                    <p className="error-message-holder" role="alert">
                        {this.state.errorMessage}
                    </p>
                }
            </div>
        );
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const { nextBtnDisabled } = this.state;
        const { variant } = this.props;
        const {
            desktopAndAbove,
            desktopAndBelow
        } = styleVariables;


        return (
            <div className="engraving-initials">
                <div className="engraving-initials__body">
                    <div className="engraving-initials__body_section">
                        <p className="engraving-initials__body_section_title" id="engraving-initials-type">
                            {objectPath.get(this.props.authoredLabels, 'engraving.engravingTypeHeading', '')}
                        </p>
                        <div
                            className="engraving-initials__body_section_body type-wrapper"
                            role="radiogroup"
                            aria-labelledby="engraving-initials-type"
                        >
                            {this.renderEngravingType(this.props.categories)}
                        </div>
                    </div>

                    {this.renderEngravingText()}

                    <div className="engraving-initials__body_section font-section">
                        <p className="engraving-initials__body_section_title" id={`${this.state.selectedEngravingTypeName.replace(/\s+/g, '-').toLowerCase()}-font-styles`}>
                            {objectPath.get(this.props.authoredLabels, 'engraving.stylesHeading', '')}
                        </p>
                        {
                            this.state.selectedEngravingTypeId !== '' &&
                            <div
                                className="engraving-initials__body_section_body font-wrapper grid-layout show-flex__desktop-and-below"
                                role="radiogroup"
                                aria-labelledby={`${this.state.selectedEngravingTypeName.replace(/\s+/g, '-').toLowerCase()}-font-styles`}
                            >
                                <MediaQuery query={desktopAndBelow}>
                                    <CustomScrollBar iosEnable>
                                        {
                                            this.props.availableStyles.map((tile, index) => (
                                                <div className="font-wrapper--sm">
                                                    <div
                                                        className={
                                                            classNames('font-wrapper__font initial-engraving tf-g tf-g__col tf-g__middle btn',
                                                                {
                                                                    selected: parseInt(variant.styleCode, 10) === parseInt(tile.styleCode, 10)
                                                                })
                                                        }
                                                        disabled={nextBtnDisabled}
                                                        tabIndex="0"
                                                        onClick={() => this.setFontStyle(tile.styleCode, tile.isTrueType)}
                                                        onKeyPress={() => this.setFontStyle(tile.styleCode, tile.isTrueType)}
                                                        key={index.toString()}
                                                        role="radio"
                                                        aria-checked={parseInt(variant.styleCode, 10) === parseInt(tile.styleCode, 10)}
                                                        aria-label={tile.styleDescription}
                                                    >
                                                        <Picture {...tile} customClass="font-wrapper__font-preview" />
                                                    </div>
                                                    <div className="font-wrapper__font_name_text--sm"> {tile.styleDescription} </div>
                                                </div>
                                            ))
                                        }
                                    </CustomScrollBar>
                                </MediaQuery>
                                <MediaQuery query={desktopAndAbove}>
                                    {
                                        this.props.availableStyles.map((tile, index) => (
                                            <div
                                                className={
                                                    classNames('font-wrapper__font initial-engraving tf-g tf-g__col tf-g__middle btn',
                                                        {
                                                            selected: parseInt(variant.styleCode, 10) === parseInt(tile.styleCode, 10)
                                                        })
                                                }
                                                disabled={nextBtnDisabled}
                                                tabIndex="0"
                                                onClick={() => this.setFontStyle(tile.styleCode, tile.isTrueType)}
                                                onKeyPress={() => this.setFontStyle(tile.styleCode, tile.isTrueType)}
                                                key={index.toString()}
                                                role="radio"
                                                aria-checked={parseInt(variant.styleCode, 10) === parseInt(tile.styleCode, 10)}
                                                aria-label={tile.styleDescription}
                                            >
                                                <Picture {...tile} customClass="font-wrapper__font-preview" />
                                                <div className="font-wrapper__font_name tf-g tf-g__middle tf-g__center col__full">
                                                    <div className="font-wrapper__font_name_text"> {tile.styleDescription} </div>
                                                </div>
                                            </div>

                                        ))
                                    }
                                </MediaQuery>
                            </div>
                        }
                    </div>
                </div>

                <div className="engraving-initials__actions tf-g col__full gutter">
                    <button type="button" className="engraving-initials__actions_back btn btn--outline tf-g--flex-equal" onClick={() => this.props.backHandler({ component: 'HOME', startEngraving: true })}>
                        {objectPath.get(this.props.authoredLabels, 'engraving.backBtn', '')}
                    </button>

                    <button
                        type="button"
                        className={
                            classNames('engraving-initials__actions_next btn btn-primary tf-g--flex-equal',
                                {
                                    disabled: nextBtnDisabled
                                })
                        }
                        disabled={nextBtnDisabled}
                        onClick={() => this.props.backHandler({ historyConfig: this.props.screenConfig, component: 'CONFIRMATION', onConfirmationPage: true })}
                    >
                        {objectPath.get(this.props.authoredLabels, 'engraving.nextBtn', '')}
                    </button>
                </div>
            </div>
        );
    }
}

InitialEngravings.propTypes = {
    dispatch: PropTypes.func.isRequired,
    variant: PropTypes.object.isRequired,
    availableStyles: PropTypes.array.isRequired,
    authoredLabels: PropTypes.object,
    screenConfig: PropTypes.object,
    categories: PropTypes.array.isRequired,
    backHandler: PropTypes.func.isRequired,
    monogramServiceID: PropTypes.number,
    maxInputCharacters: PropTypes.number,
    additionStyleIndex: PropTypes.number,
    monogramLinkedTo: PropTypes.number.isRequired,
    hasMonograming: PropTypes.bool.isRequired,
    monogramConfig: PropTypes.object.isRequired,
    enableFocus: PropTypes.func
};

InitialEngravings.defaultProps = {
    authoredLabels: {},
    screenConfig: {},
    monogramServiceID: 150,
    additionStyleIndex: 1,
    maxInputCharacters: 1,
    enableFocus: () => { }
};

const mapStateToProps = (state) => {
    return {
        authoredLabels: state.authoredLabels,
        screenConfig: state.engraving.screenConfig,
        availableStyles: objectPath.get(state, 'engraving.configurator.availableStyles', []),
        variant: objectPath.get(state, 'engraving.variant', {}),
        monogramLinkedTo: objectPath.get(state, 'aem.engraving.engravingDefaults.monogramLinkedTo', 15),
        hasMonograming: objectPath.get(state, 'engraving.configurator.hasMonograming', false),
        monogramConfig: objectPath.get(state, 'engraving.configurator.monogramConfig', false)
    };
};

export default connect(mapStateToProps, null, null, { withRef: true })(InitialEngravings);
