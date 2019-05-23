// Packages
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import * as cookieUtil from 'lib/utils/cookies';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import styleVariables from 'lib/utils/breakpoints';
import ApiUtils from 'lib/api';
import { addClass, removeClass, findFirst } from 'lib/dom/dom-util';
import { triggerAnalyticsEvent, setAnalyticsData, triggerDropAHintAnalytics } from 'lib/utils/analytics-util';
import CustomScrollBar from 'components/common/CustomScrollBar';

import * as matchMedia from 'lib/dom/match-media';

import AnalyticsConstants from 'constants/HtmlCalloutConstants';

import Lottie from 'react-lottie';
import iconData from 'lib/icon-util/icon-animations.json';
import IC from 'constants/IconsConstants';

import $ from 'jquery';
import 'parsleyjs';
import TiffanyRecaptcha from 'components/common/TiffanyRecaptcha';

// Components
import TiffanyModal from 'components/common/TiffanyModal';
import Picture from 'components/common/Picture';

// import './index.scss';

/**
 * Drop a hint Component
 */
class DropAHint extends React.Component {
    /**
     * @param {*} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.initialState = {
            openDropHint: false,
            yourName: '',
            yourMail: '',
            recepientName: '',
            recepientMail: '',
            preview: {
                defaultSrc: '',
                isLazyLoad: true,
                altText: ''
            },
            thumbnailIndex: 1,
            showConfirmation: false,
            isStopped: true,
            segments: []
        };

        // initial state will be used as a reset after ajax call is a success
        this.state = this.initialState;

        this.triggerElement = React.createRef();
        this.recepientNameField = React.createRef();
        this.recepientMailField = React.createRef();
        this.nameField = React.createRef();
        this.mailField = React.createRef();
        this.recaptchaElement = React.createRef();
        this.emailRegex = new RegExp(/^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/);
        this.maxLength = 16;
        this.modalOptions = {
            overlay: true,
            className: `modal DAH-modal has-input-elements drop-a-hint ${this.props.customClass}`,
            closeClass: 'close-modal',
            overlayClass: 'ash-overlay',
            blockMobileScrollability: true,
            blockDesktopScrollability: true,
            modalFocus: true,
            closeonTapOutside: {
                isClose: true,
                modalContainerClass: 'modal-content'
            }
        };
        this.RECEPIENT_IDENTIFIER = 'RECIPIENT_NAME';
        this.SENDER_IDENTIFIER = 'SENDER_NAME';
        this.blank = '<span class="blank"></span>';
        this.openWithValues = this.openWithValues.bind(this);
    }

    /**
     * life cycle hook
     * @param {Object} nextProps nextProps
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (typeof this.props.config === 'object' && this.props.showByoDropAHint && typeof nextProps.dropAHintConfig === 'object'
            && Object.keys(this.props.dropAHintConfig).length !== Object.keys(nextProps.dropAHintConfig).length && Object.keys(nextProps.dropAHintConfig).length > 0) {
            this.openModal();
        }
    }

    /**
     * life cycle hook
     * @param {Object} nextProps nextProps
     * @param {Object} nextState nextState
     * @returns {void}
     */
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.yourName !== this.state.yourName
            || nextState.yourMail !== this.state.yourMail
            || nextState.recepientName !== this.state.recepientName
            || nextState.recepientMail !== this.state.recepientMail
            || nextState.focusedElement !== this.state.focusedElement) {
            const newState = {
                yourName: nextState.yourName,
                yourMail: nextState.yourMail,
                recepientName: nextState.recepientName,
                recepientMail: nextState.recepientMail,
                focusedElement: nextState.focusedElement
            };

            this.props.onStateChange(newState);
        }
        return true;
    }

    /**
     * life cycle hook
     * @returns {void}
     */
    componentWillUnmount() {
        if (!this.state.openDropHint) {
            this.props.onUnMount();
        }
    }

    /**
     * @description method to select thiumbnail
     * @param {Number} index index of the thumbnail that is pressed
     * @returns {void}
     */
    selectThunmbnail = (index) => {
        this.setState({ thumbnailIndex: index }, () => {
            this.setPreview();
        });
    }

    /**
     * @description changes property to open inline modal
     * @returns {void}
     */
    openModal = () => {
        this.props.onOpen();
        this.setState({ openDropHint: true }, () => {
            this.setPreview();
        });

        const elem = findFirst('button.drop-a-hint-icon.label-btn');

        addClass(elem, 'active');
    }

    /**
     * @description onchange method for recipient first name field
     * @param {Object} event change event object
     * @returns {void}
     */
    recepientNameChange = (event) => {
        const maxlength = event.target.getAttribute('maxlength');

        if (maxlength && event.target.value && event.target.value.length > maxlength) {
            event.preventDefault();
        } else {
            this.setState({ recepientName: event.target.value }, () => {
                this.setPreview();
            });
        }

        if (event.target.value) {
            $(event.target).addClass('touched');
        } else {
            $(event.target).removeClass('touched');
        }
    }

    /**
     * @description onchange method for recipient email field
     * @param {Object} event change event object
     * @returns {void}
     */
    recepientMailChange = (event) => {
        this.setState({ recepientMail: event.target.value });
        if (event.target.value) {
            $(event.target).addClass('touched');
        } else {
            $(event.target).removeClass('touched');
        }
    }

    /**
     * @description onchange method for first name field
     * @param {Object} event change event object
     * @returns {void}
     */
    yourNameChange = (event) => {
        const maxlength = event.target.getAttribute('maxlength');

        if (maxlength && event.target.value && event.target.value.length > maxlength) {
            event.preventDefault();
        } else {
            this.setState({ yourName: event.target.value }, () => {
                this.setPreview();
            });
        }
        if (event.target.value) {
            $(event.target).addClass('touched');
        } else {
            $(event.target).removeClass('touched');
        }
    }

    /**
     * @description onchange method for email field
     * @param {Object} event change event object
     * @returns {void}
     */
    yourMailChange = (event) => {
        this.setState({ yourMail: event.target.value });
        if (event.target.value) {
            $(event.target).addClass('touched');
        } else {
            $(event.target).removeClass('touched');
        }
    }

    /**
     * @description method to validate form
     * @returns {Boolean} returns true if form is valid and viceversa
     */
    isFormValid = () => {
        // validating recepient name
        this.recepientNameInstance.validate();
        // validating recepient email
        this.recepientMailInstance.validate();
        // validating name
        this.nameFieldInstance.validate();
        // validating email
        this.mailInstance.validate();

        const errors = objectPath.get(window, 'dataLayer.page.errors', []);
        let errCode = '';

        if (!this.recepientNameInstance.isValid()) {
            errCode = AnalyticsConstants.RCPNAME_ERROR;
            errors.push(errCode);
            triggerAnalyticsEvent(AnalyticsConstants.INLINE_ERROR, { errorCode: errCode });
        }
        if (!this.recepientMailInstance.isValid()) {
            errCode = AnalyticsConstants.RCPEMAIL_ERROR;
            errors.push(errCode);
            triggerAnalyticsEvent(AnalyticsConstants.INLINE_ERROR, { errorCode: errCode });
        }
        if (!this.nameFieldInstance.isValid()) {
            errCode = AnalyticsConstants.NAME_ERROR;
            errors.push(errCode);
            triggerAnalyticsEvent(AnalyticsConstants.INLINE_ERROR, { errorCode: errCode });
        }
        if (!this.mailInstance.isValid()) {
            errCode = AnalyticsConstants.MAIL_ERROR;
            errors.push(errCode);
            triggerAnalyticsEvent(AnalyticsConstants.INLINE_ERROR, { errorCode: errCode });
        }

        setAnalyticsData('page.errors', errors);
        return this.recepientNameInstance.isValid() && this.recepientMailInstance.isValid() && this.nameFieldInstance.isValid() && this.mailInstance.isValid();
    }

    /**
     * @description save drop a hint success
     * @returns {void}
     */
    saveDropHintSuccess = () => {
        // Setting state values that will close the inline modal and show toast message
        this.setState({
            showConfirmation: true
        }, () => {
            // If mobile, the screen has to scroll to the top of modal so that user looks at the success message.
            const isMobile = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;

            if (isMobile) {
                // Cannot use scroll to here as it scrolls body, html not a container
                $('.DAH-modal .modal-content').animate({
                    scrollTop: 0
                }, 600);
            }
        });
        const sendMailConfig = objectPath.get(this.props.dropAHintConfig, 'dropHint.cta', { payload: {} });

        triggerDropAHintAnalytics(objectPath.set(sendMailConfig, 'payload.isByo', false));
    }

    /**
     * @description save drop a hint success
     * @param {String} token token after success of recaptcha
     * @returns {void}
     */
    sendByoDropAHint = (token) => {
        const sendMailConfig = objectPath.get(this.props.dropAHintConfig, 'dropHint.cta', { payload: {} });
        const locale = objectPath.get(window, 'tiffany.locale', 'en_US');
        const regionCode = objectPath.get(window, 'tiffany.regionCode', 'us');
        const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');
        const imageDetails = objectPath.get(this.props.dropAHintConfig, 'dropHint.thumbnails.images', [])[this.state.thumbnailIndex];

        // if We arive at this point then state already has below values and are valid
        // so we need not do a null check
        objectPath.set(sendMailConfig, 'type', 'text/plain');
        objectPath.set(sendMailConfig, 'payload.senderName', this.state.yourName);
        objectPath.set(sendMailConfig, 'payload.senderEmail', this.state.yourMail);
        objectPath.set(sendMailConfig, 'payload.recipientName', this.state.recepientName);
        objectPath.set(sendMailConfig, 'payload.recipientEmail', this.state.recepientMail);
        if (imageDetails) {
            objectPath.set(sendMailConfig, 'payload.imageUrl', imageDetails.defaultSrc);
        }
        objectPath.set(sendMailConfig, 'payload.webCustomerId', cookieUtil.getCookies(cookieName) || '');
        objectPath.set(sendMailConfig, 'payload.designId', this.props.byo.designID);
        objectPath.set(sendMailConfig, 'payload.viewHintUrl', `${window.location.href}?isDropAHint=true`);
        objectPath.set(sendMailConfig, 'payload.isByo', true);
        objectPath.set(sendMailConfig, 'payload.locale', locale);
        objectPath.set(sendMailConfig, 'payload.regionCode', regionCode);
        objectPath.set(sendMailConfig, 'payload.isEngagement', false);
        objectPath.set(sendMailConfig, 'payload.token', token);

        ApiUtils.makeAjaxRequest(
            sendMailConfig,
            addHintResponse => {
                this.saveDropHintSuccess();
            },
            addHintError => {
                this.recaptchaElement.reset();
            }
        );
    }

    /**
     * @description this method makes API calls to backend and send emails and does necessary actions
     * @param {String} token token after success of recaptcha
     * @returns {void}
     */
    sendEmailDetails = (token) => {
        if (this.props.isByo) {
            this.sendByoDropAHint(token);
            return;
        }
        const sendMailConfig = objectPath.get(this.props.dropAHintConfig, 'dropHint.cta', { payload: {} });
        const locale = objectPath.get(window, 'tiffany.locale', 'en_US');
        const regionCode = objectPath.get(window, 'tiffany.regionCode', 'us');
        const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');
        const currentDate = new Date();

        // if We arive at this point then state already has below values and are valid
        // so we need not do a null check
        objectPath.set(sendMailConfig, 'type', 'text/plain');
        objectPath.set(sendMailConfig, 'payload.senderName', this.state.yourName);
        objectPath.set(sendMailConfig, 'payload.senderEmail', this.state.yourMail);
        objectPath.set(sendMailConfig, 'payload.recipientName', this.state.recepientName);
        objectPath.set(sendMailConfig, 'payload.recipientEmail', this.state.recepientMail);
        objectPath.set(sendMailConfig, 'payload.locale', locale);
        objectPath.set(sendMailConfig, 'payload.regionCode', regionCode);
        objectPath.set(sendMailConfig, 'payload.viewHintUrl', window.location.href);
        objectPath.set(sendMailConfig, 'payload.webCustomerId', cookieUtil.getCookies(cookieName) || '');
        objectPath.set(sendMailConfig, 'payload.isByo', false);
        objectPath.set(sendMailConfig, 'payload.token', token);
        objectPath.set(sendMailConfig, 'payload.currentDate', currentDate.toString());

        const imageDetails = objectPath.get(this.props.dropAHintConfig, 'dropHint.thumbnails.images', [])[this.state.thumbnailIndex];

        if (imageDetails) {
            objectPath.set(sendMailConfig, 'payload.imageUrl', imageDetails.defaultSrc);
        }

        if (this.props.engFlag) {
            objectPath.set(sendMailConfig, 'payload.isEngagement', true);
        } else {
            objectPath.set(sendMailConfig, 'payload.isEngagement', false);
        }

        ApiUtils.makeAjaxRequest(
            sendMailConfig,
            addHintResponse => {
                const saveHintConfig = objectPath.get(this.props.dropAHintConfig, 'dropHint.saveHintConfig', { payload: {} });

                objectPath.set(saveHintConfig, 'payload.DropAHintListCode', objectPath.get(addHintResponse, 'resultDto.dropAHintListCode', ''));
                objectPath.set(saveHintConfig, 'payload.webCustomerId', cookieUtil.getCookies(cookieName) || '');

                ApiUtils.makeAjaxRequest(
                    saveHintConfig,
                    saveHintResponse => {
                        this.saveDropHintSuccess();
                    },
                    saveHintError => {
                        this.recaptchaElement.reset();
                    }
                );
            },
            addHintError => {
                this.recaptchaElement.reset();
            }
        );
    }

    /**
     * @description method to validate and send email
     * @param {Event} event onchange handler
     * @returns {void}
     */
    sendEmail = (event) => {
        if (!this.props.aem.autocompleteServlet || this.props.aem.autocompleteServlet === '') {
            event.preventDefault();
        }
        if (this.isFormValid()) {
            this.reCaptchaVerification();
        } else {
            findFirst('.parsley-error-list.drop-a-hint li').focus();
        }
    }

    /**
     * @description method to call recaptcha
     * @returns {void}
     */
    reCaptchaVerification = () => {
        this.recaptchaElement.execute();
    }

    /**
     * @description callback for recaptcha
     * @param {string} token that will be returned
     * @returns {void}
     */
    recaptchCallback = (token) => {
        if (token) {
            this.sendEmailDetails(token);
        } else {
            this.recaptchaElement.reset();
            console.warn('Recaptcha Failure');
        }
    }

    /**
     * @description mouse leave handler
     * @returns {void}
     */
    mouseLeaveHandler = () => {
        this.setState({
            isStopped: true
        });
    }

    /**
     * @description mouse enter handler
     * @returns {void}
     */
    mouseEnterHandler = () => {
        this.setState({
            isStopped: false
        });
    }

    /**
     * @description changes property to close inline modal
     * @returns {void}
     */
    onModalClose = () => {
        const elem = findFirst('button.drop-a-hint-icon.active');

        removeClass(elem, 'active');

        this.setState({
            openDropHint: false,
            yourName: '',
            yourMail: '',
            recepientName: '',
            recepientMail: '',
            showConfirmation: false
        }, () => {
            if (this.props.isByo) {
                this.props.triggerExternally(false);
            }

            if (this.triggerElement && this.triggerElement.current) {
                this.triggerElement.current.focus();
            }
        });
    }

    /**
     * @description opens modal with values
     * @param {Object} values values
     * @returns {void}
     */
    openWithValues = (values) => {
        this.setState({
            openDropHint: true,
            ...values,
            openedFromRotation: true
        });
    }

    /**
     * @description set preview based on the image selected
     * @returns {void}
     */
    setPreview = () => {
        const { preview } = objectPath.get(this.props.dropAHintConfig, 'dropHint.thumbnails.images', [])[this.state.thumbnailIndex];
        const description = objectPath.get(this.props.dropAHintConfig, 'dropHint.thumbnails.hint', '')
            .replace(this.RECEPIENT_IDENTIFIER, this.state.recepientName || this.blank)
            .replace(this.SENDER_IDENTIFIER, this.state.yourName || this.blank);

        this.setState({ preview, description });
    }

    /**
     * @description life cycle method to update form validator on every update
     * @returns {void}
     */
    inlineModalInit = () => {
        const parsleySettings = {
            errorClass: 'parsley-error',
            successClass: 'field-success',
            errorsWrapper: '<ul class="parsley-error-list drop-a-hint"></ul>',
            errorTemplate: '<li class="drop-a-hint__right-wrapper_input-group_input_error" role="alert"></li>'
        };

        if (this.recepientNameField.current) {
            this.recepientNameInstance = $(this.recepientNameField.current).parsley(parsleySettings);
        }
        if (this.recepientMailField.current) {
            this.recepientMailInstance = $(this.recepientMailField.current).parsley(parsleySettings);
        }
        if (this.nameField.current) {
            this.nameFieldInstance = $(this.nameField.current).parsley(parsleySettings);
        }
        if (this.mailField.current) {
            this.mailInstance = $(this.mailField.current).parsley(parsleySettings);
        }
    }

    /**
     * life cycle hook
     * @returns {void}
     */
    componenetDidMount() {
        if (this.state.openedFromRotation) {
            if (this.state.focusedElement) {
                switch (this.state.focusedElement) {
                    case 'RecipientName':
                        this.recepientNameField.current.focus();
                        break;
                    case 'RecipientMail':
                        this.recepientMailField.current.focus();
                        break;
                    case 'YourName':
                        this.nameField.current.focus();
                        break;
                    case 'YourMail':
                        this.mailField.current.focus();
                        break;
                    default:
                        break;
                }
            }
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const ariaLabels = objectPath.get(this.props.dropAHintConfig, 'dropHint.ariaLabels', {});
        const thumbnails = objectPath.get(this.props.dropAHintConfig, 'dropHint.thumbnails', []);
        const fields = objectPath.get(this.props.dropAHintConfig, 'dropHint.fields', {});
        const captchaConfig = objectPath.get(this.props.dropAHintConfig, 'dropHint.captcha', {});
        const dropAHintLabel = this.props.dropahintlabel;
        const autocompleteServlet = objectPath.get(this.props.aem, 'autocompleteServlet', '');
        const confirmationConfig = objectPath.get(this.props.dropAHintConfig,
            'dropHint.confirmation', {});
        const defaultOptions = {
            loop: false,
            autoplay: false,
            animationData: iconData['drop-hint'],
            rendererSettings: {
                preserveAspectRatio: IC.SLICE_ASPECT
            }
        };
        const { src, altText } = objectPath.get(this.props, 'aem.icons.close', {});

        return (
            <div className="drop-a-hint">
                {!this.props.isByo &&
                    <button
                        type="button"
                        className={classNames(
                            'drop-a-hint-icon',
                            { 'label-btn': dropAHintLabel }
                        )}

                        onMouseLeave={this.mouseLeaveHandler}
                        onMouseEnter={this.mouseEnterHandler}
                        onClick={this.openModal}
                        ref={this.triggerElement}
                        aria-label={objectPath.get(this.props.dropAHintConfig, 'dropHint.ariaLabelText', '')}
                    >
                        {
                            !dropAHintLabel &&
                            <Lottie
                                isStopped={this.state.isStopped}
                                options={defaultOptions}
                            />
                        }
                        {
                            dropAHintLabel &&
                            <span className="cta-content">
                                <span className="drop-a-hint__btn_label cta-text" tabIndex={-1}>
                                    {dropAHintLabel}
                                    <span className="icon-dropdown-right" />
                                </span>
                            </span>
                        }
                    </button>
                }
                <TiffanyModal
                    visible={this.state.openDropHint}
                    options={this.modalOptions}
                    onOpen={this.inlineModalInit}
                    onClose={this.onModalClose}
                >
                    <CustomScrollBar disableInMobile>
                        <div className={
                            classNames('content-band--60x40',
                                {
                                    'confirmation-screen': this.state.showConfirmation
                                })
                        }
                        >
                            <MediaQuery query={styleVariables.desktopAndBelow}>
                                <div className="band-item screen-ref">
                                    {
                                        this.state.showConfirmation &&
                                        <div className="drop-a-hint__confirmation-wrapper">
                                            <p className="drop-a-hint__confirmation-wrapper_info" role="alert">{confirmationConfig.text}</p>
                                            {
                                                !this.props.engFlag &&
                                                <a
                                                    className="drop-a-hint__confirmation-wrapper_link cta"
                                                    href={objectPath.get(confirmationConfig, 'showAll.link', '/')}
                                                    target={objectPath.get(confirmationConfig, 'showAll.target', '_new')}
                                                >
                                                    <span className="cta-content">
                                                        <span className="cta-text" tabIndex={-1}>
                                                            {objectPath.get(confirmationConfig, 'showAll.text', '')}
                                                            <span className="icon-dropdown-right" />
                                                        </span>
                                                    </span>
                                                </a>
                                            }
                                        </div>
                                    }
                                    {
                                        !this.state.showConfirmation &&
                                        <form className="drop-a-hint__right-wrapper">
                                            <h3 className="drop-a-hint__right-wrapper_heading">
                                                {objectPath.get(this.props.dropAHintConfig, 'dropHint.heading', '')}
                                            </h3>
                                            <div className="drop-a-hint__right-wrapper_input-group">
                                                <button type="button" aria-hidden="true" className="button-hidden" />
                                                <div className="drop-a-hint__right-wrapper_input-group_input material-input">
                                                    <input
                                                        name="Recipient Name"
                                                        id="RecipientName"
                                                        type="text"
                                                        autoComplete="none"
                                                        value={this.state.recepientName}
                                                        maxLength={objectPath.get(fields, 'recipientFirstName.maxLength', this.maxLength)}
                                                        onChange={this.recepientNameChange}
                                                        required
                                                        data-parsley-required-message={objectPath.get(fields, 'recipientFirstName.mandatoryMessage', '')}
                                                        ref={this.recepientNameField}
                                                        onFocus={() => { this.setState({ focusedElement: 'RecipientName' }); }}
                                                    />
                                                    <label
                                                        htmlFor="RecipientName"
                                                        className={
                                                            classNames({
                                                                active: this.state.recepientName && this.state.recepientName.length > 0
                                                            })
                                                        }
                                                    >
                                                        {objectPath.get(fields, 'recipientFirstName.placeholder', '')}
                                                    </label>
                                                </div>
                                                <div className="drop-a-hint__right-wrapper_input-group_input material-input">
                                                    <input
                                                        name="RecipientMail"
                                                        id="RecipientMail"
                                                        type="text"
                                                        autoComplete="none"
                                                        value={this.state.recepientMail}
                                                        onChange={this.recepientMailChange}
                                                        required
                                                        data-parsley-pattern={this.emailRegex}
                                                        data-parsley-required-message={objectPath.get(fields, 'recipientMail.mandatoryMessage', '')}
                                                        data-parsley-pattern-message={objectPath.get(fields, 'recipientMail.missMatchMessage', '')}
                                                        ref={this.recepientMailField}
                                                        onFocus={() => { this.setState({ focusedElement: 'RecipientMail' }); }}
                                                    />
                                                    <label
                                                        htmlFor="RecipientMail"
                                                        className={
                                                            classNames({
                                                                active: this.state.recepientMail && this.state.recepientMail.length > 0
                                                            })
                                                        }
                                                    >
                                                        {objectPath.get(fields, 'recipientMail.placeholder', '')}
                                                    </label>
                                                </div>
                                                <div className="drop-a-hint__right-wrapper_input-group_input material-input">
                                                    <input
                                                        name="YourName"
                                                        id="YourName"
                                                        type="text"
                                                        autoComplete="given-name"
                                                        value={this.state.yourName}
                                                        maxLength={objectPath.get(fields, 'firstName.maxLength', this.maxLength)}
                                                        onChange={this.yourNameChange}
                                                        required
                                                        data-parsley-required-message={objectPath.get(fields, 'firstName.mandatoryMessage', '')}
                                                        ref={this.nameField}
                                                        onFocus={() => { this.setState({ focusedElement: 'YourName' }); }}
                                                    />
                                                    <label
                                                        htmlFor="YourName"
                                                        className={
                                                            classNames({
                                                                active: this.state.yourName && this.state.yourName.length > 0
                                                            })
                                                        }
                                                    >
                                                        {objectPath.get(fields, 'firstName.placeholder', '')}
                                                    </label>
                                                </div>
                                                <div className="drop-a-hint__right-wrapper_input-group_input material-input">
                                                    <input
                                                        name="YourMail"
                                                        id="YourMail"
                                                        type="text"
                                                        autoComplete="email"
                                                        value={this.state.yourMail}
                                                        onChange={this.yourMailChange}
                                                        required
                                                        data-parsley-pattern={this.emailRegex}
                                                        data-parsley-required-message={objectPath.get(fields, 'mail.mandatoryMessage', '')}
                                                        data-parsley-pattern-message={objectPath.get(fields, 'mail.missMatchMessage', '')}
                                                        ref={this.mailField}
                                                        onFocus={() => { this.setState({ focusedElement: 'YourMail' }); }}
                                                    />
                                                    <label
                                                        htmlFor="YourMail"
                                                        className={
                                                            classNames({
                                                                active: this.state.yourMail && this.state.yourMail.length > 0
                                                            })
                                                        }
                                                    >
                                                        {objectPath.get(fields, 'mail.placeholder', '')}
                                                    </label>
                                                </div>
                                            </div>
                                        </form>
                                    }
                                </div>
                            </MediaQuery>
                            <div className="band-item">
                                <div className="drop-a-hint__preview-holder">
                                    <div className="drop-a-hint__preview-holder_thumbnails">
                                        {
                                            thumbnails.images && thumbnails.images.length > 0 &&
                                            thumbnails.images.map((thumb, index) => (
                                                <button
                                                    type="button"
                                                    className={
                                                        classNames('drop-a-hint__preview-holder_thumbnails_icons',
                                                            {
                                                                'btn--outline': (this.state.thumbnailIndex === index)
                                                            })
                                                    }
                                                    key={index.toString()}
                                                    onClick={() => { this.selectThunmbnail(index); }}
                                                    aria-label={thumb.ariaLabel || ''}
                                                    aria-pressed={this.state.thumbnailIndex === index}
                                                >
                                                    <Picture
                                                        defaultSrc={thumb.defaultSrc}
                                                        altText={thumb.altText}
                                                        isLazyLoad={thumb.isLazyLoad}
                                                    />
                                                </button>
                                            ))
                                        }
                                    </div>
                                    <div className="drop-a-hint__preview-holder_preview">
                                        {
                                            this.state.preview &&
                                            <div className="preview-wrapper">
                                                <Picture
                                                    defaultSrc={this.state.preview.defaultSrc}
                                                    altText={this.state.preview.altText}
                                                    isLazyLoad={this.state.preview.isLazyLoad}
                                                    hiddenOnError
                                                    customClass="thumnail-preview"
                                                />
                                                {thumbnails.isHintRTE ?
                                                    <div
                                                        className="preview-wrapper_desc"
                                                        role="button"
                                                        tabIndex="0"
                                                        dangerouslySetInnerHTML={{ __html: this.state.description }}
                                                    />
                                                    :
                                                    <p className="preview-wrapper__desc">
                                                        {this.state.description}
                                                    </p>
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>
                                {
                                    !this.state.showConfirmation &&
                                    <MediaQuery query={styleVariables.desktopAndBelow}>
                                        <TiffanyRecaptcha
                                            ref={element => {
                                                if (element) {
                                                    this.recaptchaElement = element;
                                                }
                                            }}
                                            callback={this.recaptchCallback}
                                            siteKey={objectPath.get(this.props.aem, 'captchaConfig.siteKey', '')}
                                        >
                                            <button
                                                type="submit"
                                                className="drop-a-hint__right-wrapper_submit g-recaptcha"
                                                onClick={this.sendEmail}
                                            >
                                                {objectPath.get(this.props.dropAHintConfig, 'dropHint.cta.text', '')}
                                            </button>
                                        </TiffanyRecaptcha>
                                        <div className="drop-a-hint__right-wrapper_captcha">
                                            <div className="icon">
                                                <Picture
                                                    defaultSrc={objectPath.get(captchaConfig, 'icon.defaultSrc', '')}
                                                    altText={objectPath.get(captchaConfig, 'icon.altText', '')}
                                                    isLazyLoad
                                                />
                                            </div>
                                            <div className="content">
                                                <span className="label">{objectPath.get(captchaConfig, 'heading', '')}</span>
                                                <div className="links">
                                                    {
                                                        captchaConfig.ctas &&
                                                        captchaConfig.ctas.length > 0 &&
                                                        captchaConfig.ctas.map((cta, index) => {
                                                            if (index < captchaConfig.maxCta) {
                                                                return (
                                                                    <a className="cta" href={cta.link} target={cta.target} key={index.toString()}>
                                                                        <span className="cta-content">
                                                                            <span className="cta-text" tabIndex={-1}>
                                                                                {cta.text}
                                                                                <span className="icon-dropdown-right" />
                                                                            </span>
                                                                        </span>
                                                                    </a>
                                                                );
                                                            }
                                                            return null;
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </MediaQuery>
                                }
                            </div>
                            <MediaQuery query={styleVariables.desktopAndAbove}>
                                <div className="band-item screen-ref">
                                    {
                                        this.state.showConfirmation &&
                                        <div className="drop-a-hint__confirmation-wrapper">
                                            <p className="drop-a-hint__confirmation-wrapper_info" role="alert">{confirmationConfig.text}</p>
                                            {
                                                !this.props.engFlag &&
                                                <a
                                                    className="drop-a-hint__confirmation-wrapper_link cta"
                                                    href={objectPath.get(confirmationConfig, 'showAll.link', '/')}
                                                    target={objectPath.get(confirmationConfig, 'showAll.target', '_new')}
                                                >
                                                    <span className="cta-content">
                                                        <span className="cta-text" tabIndex={-1}>
                                                            {objectPath.get(confirmationConfig, 'showAll.text', '')}
                                                            <span className="icon-dropdown-right" />
                                                        </span>
                                                    </span>
                                                </a>
                                            }
                                        </div>
                                    }
                                    {
                                        !this.state.showConfirmation &&
                                        <Fragment>
                                            {autocompleteServlet && autocompleteServlet !== '' &&
                                                <iframe title="form iframe" id="formAutocomplete" name="formAutocomplete" className="hide-iframe">Form Iframe</iframe>
                                            }
                                            <form
                                                {
                                                ...(autocompleteServlet && autocompleteServlet !== '') ?
                                                    {
                                                        target: 'formAutocomplete',
                                                        method: 'POST',
                                                        action: autocompleteServlet
                                                    } : {}
                                                }
                                                className="drop-a-hint__right-wrapper"
                                            >
                                                <h3 className="drop-a-hint__right-wrapper_heading">
                                                    {objectPath.get(this.props.dropAHintConfig, 'dropHint.heading', '')}
                                                </h3>
                                                <div className="drop-a-hint__right-wrapper_input-group">
                                                    <div className="drop-a-hint__right-wrapper_input-group_input material-input">
                                                        <input
                                                            name="Recipient Name"
                                                            id="RecipientName"
                                                            type="text"
                                                            autoComplete="none"
                                                            value={this.state.recepientName}
                                                            maxLength={objectPath.get(fields, 'recipientFirstName.maxLength', this.maxLength)}
                                                            onChange={this.recepientNameChange}
                                                            required
                                                            data-parsley-required-message={objectPath.get(fields, 'recipientFirstName.mandatoryMessage', '')}
                                                            ref={this.recepientNameField}
                                                            onFocus={() => { this.setState({ focusedElement: 'RecipientName' }); }}
                                                        />
                                                        <label
                                                            htmlFor="RecipientName"
                                                            className={
                                                                classNames({
                                                                    active: this.state.recepientName && this.state.recepientName.length > 0
                                                                })
                                                            }
                                                        >
                                                            {objectPath.get(fields, 'recipientFirstName.placeholder', '')}
                                                        </label>
                                                    </div>
                                                    <div className="drop-a-hint__right-wrapper_input-group_input material-input">
                                                        <input
                                                            name="RecipientMail"
                                                            id="RecipientMail"
                                                            type="text"
                                                            autoComplete="none"
                                                            value={this.state.recepientMail}
                                                            onChange={this.recepientMailChange}
                                                            required
                                                            data-parsley-pattern={this.emailRegex}
                                                            data-parsley-required-message={objectPath.get(fields, 'recipientMail.mandatoryMessage', '')}
                                                            data-parsley-pattern-message={objectPath.get(fields, 'recipientMail.missMatchMessage', '')}
                                                            ref={this.recepientMailField}
                                                            onFocus={() => { this.setState({ focusedElement: 'RecipientMail' }); }}
                                                        />
                                                        <label
                                                            htmlFor="RecipientMail"
                                                            className={
                                                                classNames({
                                                                    active: this.state.recepientMail && this.state.recepientMail.length > 0
                                                                })
                                                            }
                                                        >
                                                            {objectPath.get(fields, 'recipientMail.placeholder', '')}
                                                        </label>
                                                    </div>
                                                    <div className="drop-a-hint__right-wrapper_input-group_input material-input">
                                                        <input
                                                            name="YourName"
                                                            id="YourName"
                                                            type="text"
                                                            autoComplete="given-name"
                                                            value={this.state.yourName}
                                                            maxLength={objectPath.get(fields, 'firstName.maxLength', this.maxLength)}
                                                            onChange={this.yourNameChange}
                                                            required
                                                            data-parsley-required-message={objectPath.get(fields, 'firstName.mandatoryMessage', '')}
                                                            ref={this.nameField}
                                                            onFocus={() => { this.setState({ focusedElement: 'YourName' }); }}
                                                        />
                                                        <label
                                                            htmlFor="YourName"
                                                            className={
                                                                classNames({
                                                                    active: this.state.yourName && this.state.yourName.length > 0
                                                                })
                                                            }
                                                        >
                                                            {objectPath.get(fields, 'firstName.placeholder', '')}
                                                        </label>
                                                    </div>
                                                    <div className="drop-a-hint__right-wrapper_input-group_input material-input">
                                                        <input
                                                            name="YourMail"
                                                            id="YourMail"
                                                            type="text"
                                                            autoComplete="email"
                                                            value={this.state.yourMail}
                                                            onChange={this.yourMailChange}
                                                            required
                                                            data-parsley-pattern={this.emailRegex}
                                                            data-parsley-required-message={objectPath.get(fields, 'mail.mandatoryMessage', '')}
                                                            data-parsley-pattern-message={objectPath.get(fields, 'mail.missMatchMessage', '')}
                                                            ref={this.mailField}
                                                            onFocus={() => { this.setState({ focusedElement: 'YourMail' }); }}
                                                        />
                                                        <label
                                                            htmlFor="YourMail"
                                                            className={
                                                                classNames({
                                                                    active: this.state.yourMail && this.state.yourMail.length > 0
                                                                })
                                                            }
                                                        >
                                                            {objectPath.get(fields, 'mail.placeholder', '')}
                                                        </label>
                                                    </div>
                                                </div>
                                                <TiffanyRecaptcha
                                                    ref={element => {
                                                        if (element) {
                                                            this.recaptchaElement = element;
                                                        }
                                                    }}
                                                    callback={this.recaptchCallback}
                                                    siteKey={objectPath.get(this.props.aem, 'captchaConfig.siteKey', '')}
                                                >
                                                    <button
                                                        type="submit"
                                                        className="drop-a-hint__right-wrapper_submit g-recaptcha"
                                                        onClick={this.sendEmail}
                                                    >
                                                        {objectPath.get(this.props.dropAHintConfig, 'dropHint.cta.text', '')}
                                                    </button>
                                                </TiffanyRecaptcha>
                                                <div className="drop-a-hint__right-wrapper_captcha">
                                                    <div className="icon">
                                                        <Picture
                                                            defaultSrc={objectPath.get(captchaConfig, 'icon.defaultSrc', '')}
                                                            altText={objectPath.get(captchaConfig, 'icon.altText', '')}
                                                            isLazyLoad
                                                        />
                                                    </div>
                                                    <div className="content">
                                                        <span className="label">{objectPath.get(captchaConfig, 'heading', '')}</span>
                                                        <div className="links">
                                                            {
                                                                captchaConfig.ctas &&
                                                                captchaConfig.ctas.length > 0 &&
                                                                captchaConfig.ctas.map((cta, index) => {
                                                                    if (index < captchaConfig.maxCta) {
                                                                        return (
                                                                            <a className="cta" href={cta.link} target={cta.target} key={index.toString()}>
                                                                                <span className="cta-content">
                                                                                    <span className="cta-text" tabIndex={-1}>
                                                                                        {cta.text}
                                                                                        <span className="icon-dropdown-right" />
                                                                                    </span>
                                                                                </span>
                                                                            </a>
                                                                        );
                                                                    }
                                                                    return null;
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </Fragment>
                                    }
                                </div>
                            </MediaQuery>
                        </div>
                    </CustomScrollBar>
                    <button
                        type="button"
                        className="close-modal"
                        aria-label={ariaLabels.closeAriaLabel}
                        onClick={this.onModalClose}
                    >
                        <img src={src} alt={altText} />
                    </button>
                </TiffanyModal>
            </div>
        );
    }
}

DropAHint.propTypes = {
    dropAHintConfig: PropTypes.object,
    dropahintlabel: PropTypes.string,
    aem: PropTypes.object.isRequired,
    isByo: PropTypes.bool,
    customClass: PropTypes.string,
    config: PropTypes.any,
    byo: PropTypes.object,
    showByoDropAHint: PropTypes.bool,
    triggerExternally: PropTypes.func,
    engFlag: PropTypes.bool,
    onOpen: PropTypes.func,
    onUnMount: PropTypes.func,
    onStateChange: PropTypes.func
};

DropAHint.defaultProps = {
    dropAHintConfig: {},
    engFlag: false,
    dropahintlabel: '',
    isByo: false,
    customClass: '',
    config: '',
    byo: {},
    showByoDropAHint: false,
    triggerExternally: () => { },
    onOpen: () => { },
    onUnMount: () => { },
    onStateChange: () => { }
};

const mapStateToProps = (state, ownProps) => {
    const dropHintConfig = ((typeof ownProps.config === 'object') ? ownProps.config : state.aem[ownProps.config]);

    return {
        aem: state.aem,
        authoredLabels: state.authoredLabels,
        dropAHintConfig: !ownProps.config ? state.productDetails.pdpConfig : dropHintConfig,
        byo: state.byo
    };
};

export default connect(mapStateToProps, null, null, { withRef: true })(DropAHint);
