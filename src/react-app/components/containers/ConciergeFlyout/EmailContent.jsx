// Packages
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import objectPath from 'object-path';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import styleVariables from 'lib/utils/breakpoints';
import { triggerAnalyticsEvent } from 'lib/utils/analytics-util';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import { sendConciergeEmail } from 'actions/ConciergeActions';
import CustomDropDown from 'components/common/CustomDropDown';
import Textarea from 'react-textarea-autosize';
import { setDropdownWidth } from 'lib/utils/feature-detection';

import $ from 'jquery';
import 'parsleyjs';

import scopeFocus from 'lib/dom/scope-focus';
import matchMedia from 'lib/dom/match-media';
import { disableBodyScroll, enableBodyScroll } from 'lib/no-scroll';
import {
    findFirst,
    addClass,
    removeClass,
    hasClass
} from 'lib/dom/dom-util';
/**
 * Email Content Component
 */
class EmailContent extends React.Component {
    /**
     * @param {*} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        let formFields = objectPath.get(this.props, 'labels.formFields', []);
        const emailTemplate = '';

        formFields = formFields.filter((field) => {
            return field.hide !== true;
        }).sort((field1, field2) => {
            if (field1.order < field2.order) {
                return -1;
            }
            if (field1.order > field2.order) {
                return 1;
            }
            return 0;
        });

        this.state = {
            selectedSubjectIndex: 0,
            isDropDownOpen: false,
            isSubmitted: false,
            isFormFilled: false,
            activeButton: false,
            selectedDropdownValues: [],
            selectedRadioValues: [],
            formFields: JSON.parse(JSON.stringify(formFields)), // cloning the object
            emailTemplate
        };

        this.mailField = React.createRef();
        this.handleSubmit.bind(this);
    }

    /**
     * @description validate form fields
     * @returns {void}
     */
    componentDidMount() {
        this.initValidation();
        scopeFocus.setScopeLimit(this.props.flyOutRef.current);
        setDropdownWidth($(this.subjectDropdown), 'sortby-wrapper__sortby-options');
    }

    /**
     * @description validate the email sent
     * @param {object} nextProps nextProps
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps && this.props !== nextProps) {
            if (nextProps.emailSent) {
                this.setState({
                    isSubmitted: true
                });
                triggerAnalyticsEvent(AnalyticsConstants.SEND_EMAIL, { type: AnalyticsConstants.CONCIERGE });
            }
        }
    }

    /**
     * function to toggle subject dropdown
     * @param {DocumentEvent} event selected index value
     * @param {number} itemIndex item index value
     * @returns {void}
     */
    onRadioChanged = (event, itemIndex) => {
        const selectedRadios = this.state.selectedRadioValues;

        selectedRadios[itemIndex] = event.currentTarget.value;
        this.setState({
            selectedRadioValues: selectedRadios
        });

        this.handleInput(event);
    }


    /**
     * function to toggle subject dropdown
     * @returns {void}
     */
    toggleSubjectDropDown = () => {
        this.setState({
            isDropDownOpen: !this.state.isDropDownOpen
        });
    }

    /**
     * function to toggle subject dropdown
     * @param {number} index selected index value
     * @returns {void}
     */
    selectSubject = (index) => {
        this.setState({
            selectedSubjectIndex: index,
            isDropDownOpen: styleVariables.belowDesktopTablet ? false : !this.state.isDropDownOpen
        });
    }

    /**
     * function to toggle subject dropdown
     * @param {number} selectedIndex selected index value
     * @param {number} itemIndex item index value
     * @returns {void}
     */
    selectDropdownValue = (selectedIndex, itemIndex) => {
        const selectedDropdowns = this.state.selectedDropdownValues;
        const dropValues = this.state.formFields[itemIndex].dropValues || [];

        selectedDropdowns[itemIndex] = dropValues[selectedIndex];
        this.setState({
            selectedDropdownValues: selectedDropdowns
        });

        this.handleInput();
    }

    /**
     * handle email cancle
     * @returns {void}
     */
    handleCancel = () => {
        if (this.props.isConcierge) {
            this.props.updateSelectedFlyoutModal({ flyoutState: 'INITIAL', showFlyout: true, emailSent: false });
        } else {
            this.toggleConciergeFlyout();
        }
    }

    /**
     * handle email submission
     * @param {object} e event
     * @returns {void}
     */
    handleSubmit = (e) => {
        this.initValidation();
        e.preventDefault();
        this.mailFieldInstance.validate();
        const subjectList = objectPath.get(this.props, 'labels.subjectList', []);

        if (this.mailFieldInstance.isValid()) {
            const fromEmail = this.state.formFields.filter((formField) => {
                return formField.autocompleteName === 'email';
            });
            let fromEmailValue = objectPath.get(fromEmail, '0.value', '');

            fromEmailValue = fromEmailValue ? fromEmailValue.trim() : fromEmailValue;

            this.props.dispatch(sendConciergeEmail(subjectList[this.state.selectedSubjectIndex], this.state.emailTemplate, fromEmailValue));
        }
        this.setState({ activeButton: true });
    }

    /**
     * handle input
     * @param  {object} e event
     * @returns {void}
     */
    handleInput = (e) => {
        let noOfInputs = 0;
        let emailTemplate = objectPath.get(this.props, 'labels.emailTemplate', '');
        const { formFields } = this.state;

        formFields.forEach((item, i) => {
            if (e && e.target.name === item.fieldName) {
                formFields[i].value = e.target.value;
            }

            switch (item.type) {
                case 'dropdown':
                    if (item.optional || (this.state.selectedDropdownValues[i] && this.state.selectedDropdownValues[i] !== item.fieldName)) {
                        noOfInputs += 1;
                        emailTemplate = emailTemplate.replace(new RegExp(`{{%${item.fieldName}}}`, 'g'), this.state.selectedDropdownValues[i]);
                    }
                    break;
                case 'radio':
                    if (item.optional || (this.state.selectedRadioValues[i] && typeof this.state.selectedRadioValues[i] === 'string')) {
                        noOfInputs += 1;
                        emailTemplate = emailTemplate.replace(new RegExp(`{{%${item.fieldName}}}`, 'g'), this.state.selectedRadioValues[i]);
                    }
                    break;
                default:
                    if (item.optional || (item.value && item.value !== '')) {
                        noOfInputs += 1;
                        emailTemplate = emailTemplate.replace(new RegExp(`{{%${item.fieldName}}}`, 'g'), formFields[i].value);
                    }
            }
        });

        const isFormFilled = noOfInputs === this.state.formFields.length;

        this.setState({ formFields, isFormFilled, emailTemplate });
    }

    /**
     * @param {object} e html event
     * @returns {void}
     */
    toggleConciergeFlyout = (e) => {
        if (e && e.type === 'keypress') {
            e.preventDefault();
        }
        const showConciergeFlyout = this.props.showFlyout;
        const headerStickyElem = findFirst('.header__nav-container');
        const isMobile = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;

        if (!showConciergeFlyout) {
            disableBodyScroll(this.props.flyoutState, true);
            if (isMobile) {
                addClass(headerStickyElem, 'hide');
            }
        } else {
            enableBodyScroll(this.props.flyoutState, false);
            if (isMobile) {
                removeClass(headerStickyElem, 'hide');
            }
        }
        this.props.updateSelectedFlyoutModal({
            flyoutState: 'INITIAL',
            showFlyout: !this.props.showFlyout,
            emailSent: false,
            isConcierge: true
        });
    }

    /**
     * @description add class when input focus in ios
     * @returns {void}
     */
    handleOverflow = () => {
        const flyout = findFirst('.concierge-flyout__body');

        if (flyout) {
            if (hasClass(flyout, 'hide-overflow')) {
                removeClass(flyout, 'hide-overflow');
            } else {
                addClass(flyout, 'hide-overflow');
            }
        }
    };

    /**
     * @description init email validation
     * @returns {void}
     */
    initValidation() {
        const parsleySettings = {
            errorClass: 'parsley-error',
            successClass: 'field-success',
            errorsWrapper: '<ul class="parsley-error-list"></ul>',
            errorTemplate: '<li role="alert"></li>'
        };

        this.emailRegex = new RegExp(this.props.emailRegex);
        if (this.mailField.current && this.mailField.current.value) {
            this.mailField.current.value = this.mailField.current.value.trim();
            this.mailFieldInstance = $(this.mailField.current).parsley(parsleySettings);
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const heading = objectPath.get(this.props, 'labels.emailus', 'Email us');
        const description = objectPath.get(this.props, 'labels.description', 'For questions or assistance, please complete the following form.');
        const {
            belowDesktopTablet,
            desktopTabletAbove
        } = styleVariables;
        const subjectList = objectPath.get(this.props, 'labels.subjectList', []);
        const subjectListHide = objectPath.get(this.props, 'labels.subjectListHide', []);
        const errorMessage = objectPath.get(this.props, 'labels.ErrorMessage', []);
        const cancelBtn = objectPath.get(this.props, 'labels.cancelBtn', 'Cancel');
        const sendBtn = objectPath.get(this.props, 'labels.sendBtn', 'Send');
        const closeBtn = objectPath.get(this.props, 'labels.closeBtn', 'Close');
        const confirmationHeading = objectPath.get(this.props, 'labels.confirmationHeading', 'Thank you for your inquiry');
        const confirmationMessage = objectPath.get(this.props, 'labels.confirmationMessage', 'Your email/store request was successfully submitted. A Tiffany representative will contact you in the next 24 hours.');
        const countryCode = objectPath.get(this.props, 'labels.countryCode', '');
        const backBtn = objectPath.get(this.props, 'labels.backBtn', 'Back');
        const subjectListOptions = subjectList.map((val, i) => {
            return {
                value: val,
                index: i,
                displayName: val.name
            };
        });

        return (
            <form className={
                classNames('email-content',
                    {
                        'ie-height-fix': this.state.isDropDownOpen
                    })
            }
            >
                <h3 className="email-content__heading">{this.state.isSubmitted ? confirmationHeading : heading}</h3>
                <p className="email-content__description" dangerouslySetInnerHTML={{ __html: this.state.isSubmitted ? confirmationMessage : description }} />
                {this.state.isSubmitted &&
                    <div className="close-btn">
                        <button
                            className="btn btn-primary"
                            type="submit"
                            onClick={() => this.handleCancel()}
                            onKeyPress={() => this.handleCancel()}
                            onKeyUp={() => { }}
                        >
                            {closeBtn}
                        </button>
                    </div>
                }
                {!this.state.isSubmitted &&
                    <div className="email-content__enquiery">
                        {
                            !subjectListHide && subjectList && subjectList.length > 0 &&
                            <Fragment>
                                <MediaQuery query={belowDesktopTablet}>
                                    <select
                                        className="sortby-wrapper__sortby-options"
                                        id="subject"
                                        onChange={(event) => {
                                            setDropdownWidth($(event.currentTarget), 'sortby-wrapper__sortby-options');
                                        }}
                                        onFocus={(event) => {
                                            setTimeout(() => {
                                                setDropdownWidth($(this.subjectDropdown), 'sortby-wrapper__sortby-options');
                                            });
                                        }}
                                        ref={el => { this.subjectDropdown = el; }}
                                    >
                                        {
                                            subjectList && subjectList.map((item, index) => {
                                                return (
                                                    (item && item.name && item.name.length > 0) ?
                                                        <option
                                                            key={item.name}
                                                            value={item.name}
                                                            selected={index === this.state.selectedSubjectIndex}
                                                            onClick={() => this.selectSubject(index)}
                                                            onKeyPress={() => this.selectSubject(index)}
                                                        >
                                                            {item.name}
                                                        </option> : null
                                                );
                                            })
                                        }
                                    </select>
                                    <span className="icon-dropdown-down" />
                                </MediaQuery>
                                <MediaQuery query={desktopTabletAbove}>
                                    <div className="email-content__enquiery_subject">
                                        <CustomDropDown
                                            options={subjectListOptions}
                                            descriptionfield="displayName"
                                            keyfield="index"
                                            onselect={(selectedIndex) => this.selectSubject(selectedIndex)}
                                            closeOnMouseLeave
                                            defaultSelectedIndex={0}
                                            ontoggeled={this.toggleSubjectDropDown}
                                        />
                                    </div>
                                </MediaQuery>
                            </Fragment>
                        }
                        <div
                            className={
                                classNames({
                                    hide: this.state.isDropDownOpen
                                })
                            }
                        >
                            {
                                this.state.formFields.map((item, index) => {
                                    const key = item.fieldName;
                                    const dropdownValues = item.dropValues ? item.dropValues.map((dropValue) => {
                                        return {
                                            value: dropValue,
                                            key: dropValue
                                        };
                                    }) : [];
                                    const radioValues = item.radioValues || [];
                                    const showTi = true;

                                    return (

                                        <Fragment key={key}>
                                            {
                                                item.type === 'text' &&
                                                <div className="material-input">
                                                    {key.toLowerCase() === 'message' &&
                                                    <Textarea type="text" name={key} id={key} aria-label={item.placeHolder} autoComplete={item.autocompleteName} onInput={this.handleInput} rows={2} onFocus={this.handleOverflow} onBlur={this.handleOverflow} />

                                                    }
                                                    {key.toLowerCase() !== 'message' &&
                                                        <input
                                                            type={item.autocompleteName === 'tel' ? 'tel' : 'text'}
                                                            name={key}
                                                            id={key}
                                                            aria-label={item.placeHolder + (item.autocompleteName === 'tel' ? countryCode : '')}
                                                            autoComplete={item.autocompleteName}
                                                            onInput={this.handleInput}
                                                            onFocus={this.handleOverflow}
                                                            onBlur={this.handleOverflow}
                                                            className={
                                                                classNames(
                                                                    {
                                                                        'phone-number': item.autocompleteName === 'tel',
                                                                        'no-country-code': !(countryCode && countryCode.length > 0)
                                                                    }
                                                                )
                                                            }
                                                            {...(key.toLowerCase() === 'email' ?
                                                                { ref: this.mailField, pattern: this.emailRegex, 'data-parsley-pattern-message': errorMessage }
                                                                : {})}
                                                        />
                                                    }
                                                    <label htmlFor={key}>{item.placeHolder}</label>
                                                    {
                                                        (item.autocompleteName === 'tel' && countryCode && countryCode.length > 0) &&
                                                        <span className="country-code">{countryCode}</span>
                                                    }
                                                </div>
                                            }
                                            {
                                                item.type === 'dropdown' &&
                                                <div className="email-content__dropdown">
                                                    <CustomDropDown
                                                        title={item.fieldName}
                                                        options={dropdownValues}
                                                        descriptionfield="value"
                                                        showtitle={showTi}
                                                        keyfield="key"
                                                        onselect={(selectedIndex) => { this.selectDropdownValue(selectedIndex, index); }}
                                                        closeOnMouseLeave
                                                    />
                                                </div>
                                            }
                                            {
                                                item.type === 'radio' &&
                                                <div className="email-content__radio" role="radiogroup">
                                                    {
                                                        radioValues.map((radioItem, radioIndex) => {
                                                            return (
                                                                <div className="email-content__radio_item" key={radioItem}>
                                                                    <input
                                                                        type="radio"
                                                                        value={radioItem}
                                                                        className="email-content__radio_item_button"
                                                                        name={item.fieldName}
                                                                        onChange={(event) => this.onRadioChanged(event, index)}
                                                                        id={`concierge-email-${item.fieldName}-${radioItem}`}
                                                                        {...((radioIndex > 0 && !item.value) ? { tabIndex: '-1' } : {})}
                                                                    />
                                                                    <label htmlFor={`concierge-email-${item.fieldName}-${radioItem}`}>{radioItem}</label>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            }
                                        </Fragment>
                                    );
                                })
                            }
                        </div>
                    </div>
                }
                {!this.state.isSubmitted &&
                    <div className="actions">
                        <button
                            className="actions_back"
                            type="button"
                            onClick={() => {
                                this.handleCancel();
                            }}
                            onKeyPress={() => {
                                this.handleCancel();
                            }
                            }
                        >
                            <span className="btn-txt">{cancelBtn}</span>
                        </button>
                        <button
                            type="submit"
                            className={
                                classNames('actions_send', {
                                    'active-btn': this.state.activeButton
                                })
                            }
                            onClick={this.handleSubmit}
                            onKeyPress={this.handleSubmit}
                            disabled={!this.state.isFormFilled}
                        >
                            <span className="btn-txt">{sendBtn}</span>
                        </button>
                    </div>
                }
                <MediaQuery query={desktopTabletAbove}>
                    {
                        this.props.isConcierge &&
                        <div
                            className="icon-Right"
                            role="button"
                            aria-label={backBtn}
                            tabIndex={0}
                            onClick={() => this.props.updateSelectedFlyoutModal({ flyoutState: 'INITIAL', showFlyout: true, emailSent: false })}
                            onKeyPress={() => this.props.updateSelectedFlyoutModal({ flyoutState: 'INITIAL', showFlyout: true, emailSent: false })}
                        />
                    }
                    {
                        !this.props.isConcierge &&
                        <button
                            type="button"
                            className="concierge-flyout--close"
                            aria-label="Click to close concierge flyout"
                            onClick={this.toggleConciergeFlyout}
                            onKeyPress={this.toggleConciergeFlyout}
                        >
                            <img src={this.props.closeSrc} alt={this.props.closeAltText} />
                        </button>
                    }
                </MediaQuery>
                <MediaQuery query={belowDesktopTablet}>
                    {
                        this.props.isConcierge &&
                        <div
                            className="icon-Left"
                            role="button"
                            aria-label={backBtn}
                            tabIndex={0}
                            onClick={() => this.props.updateSelectedFlyoutModal({ flyoutState: 'INITIAL', showFlyout: true, emailSent: false })}
                            onKeyPress={() => this.props.updateSelectedFlyoutModal({ flyoutState: 'INITIAL', showFlyout: true, emailSent: false })}
                        />
                    }
                    {
                        !this.props.isConcierge &&
                        <button
                            type="button"
                            className="concierge-flyout--close"
                            aria-label="Click to close concierge flyout"
                            onClick={this.toggleConciergeFlyout}
                            onKeyPress={this.toggleConciergeFlyout}
                        >
                            <img src={this.props.closeSrc} alt={this.props.closeAltText} />
                        </button>
                    }
                </MediaQuery>
            </form>
        );
    }
}

EmailContent.propTypes = {
    dispatch: PropTypes.func.isRequired,
    updateSelectedFlyoutModal: PropTypes.func.isRequired,
    emailSent: PropTypes.bool.isRequired,
    flyOutRef: PropTypes.any,
    closeSrc: PropTypes.string.isRequired,
    closeAltText: PropTypes.string.isRequired
};

EmailContent.defaultProps = {
    flyOutRef: {}
};

const mapStateToProps = (state, ownProps) => {
    return {
        labels: state.authoredLabels.concierge.email,
        emailSent: state.conciergeFlyout.emailSent,
        flyoutState: state.conciergeFlyout.flyoutState,
        showFlyout: state.conciergeFlyout.showFlyout,
        isConcierge: state.conciergeFlyout.isConcierge,
        closeSrc: objectPath.get(state, 'aem.icons.close.src', ''),
        closeAltText: objectPath.get(state, 'aem.icons.close.altText', '')
    };
};

export default connect(mapStateToProps)(EmailContent);
