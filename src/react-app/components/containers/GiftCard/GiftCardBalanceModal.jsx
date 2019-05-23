// Packages
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import PropTypes from 'prop-types';
import $ from 'jquery';
import 'parsleyjs';

import getKeyCode from 'lib/utils/KeyCodes';
import { findFirst } from 'lib/dom/dom-util';

import InformationText from 'components/common/InformationText';
import { closePdpModal } from 'actions/PdpModalAction';
import { getCardBalanceAction, resetCheckBalance } from 'actions/GiftCardActions';
import PDPMODAL from 'constants/PdpModalConstants';
import { setAnalyticsData, triggerAnalyticsEvent } from 'lib/utils/analytics-util';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

// import './index.scss';

/**
 * GiftCard Modal Component
 */
class GiftCardBalanceModal extends React.Component {
    /**
     * @description Check balance
     * @param {Object} props Properties
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.defaultState = {
            cardNumber: '',
            pin: '',
            errors: {
                mismatch: ''
            },
            isCheckBalanceConfimration: false
        };
        this.state = this.defaultState;
    }

    /**
     * @returns {void}
     */
    componentDidMount() {
        this.updateParsley();
    }

    /**
     * @returns {void}
     */
    componentDidUpdate() {
        this.updateParsley();
        if (this.props.mismatchError) {
            const mismatchError = $('.mismatch_error');
            const errors = objectPath.get(window, 'dataLayer.page.errors', []);
            const errCode = AnalyticsConstants.MISMATCH_ERROR;

            if (mismatchError.length) {
                mismatchError[0].focus();
            }
            errors.push(errCode);
            setAnalyticsData('page.errors', errors);
            triggerAnalyticsEvent(AnalyticsConstants.INLINE_ERROR, { errorCode: errCode });
        }
    }

    /**
     * @returns {void}
     */
    componentWillUnmount() {
        this.setState(this.defaultState);
    }

    /**
     * Set Pin to state
     * @param {Object} e blur event
     * @returns {void}
     */
    setPin = (e) => {
        if (e.target.value.length <= 8) {
            this.setState({
                ...this.state,
                pin: e.target.value
            });
        }
    }

    /**
     * Set Card number to state
     * @param {Object} e blur event
     * @returns {void}
     */
    setCardNumber = (e) => {
        if (e.target.value.length <= 16) {
            this.setState({
                ...this.state,
                cardNumber: e.target.value
            });
        }
    }

    /**
     * Set Card number to state
     * @returns {void}
     */
    updateParsley = () => {
        const parsleySettings = {
            classHandler: (field) => {
                const $parent = field.$element.closest('.check-balance__group');

                if ($parent.length) {
                    return $parent;
                }
                return field.$element;
            },
            errorsWrapper: '<ul class="parsley-error-list"></ul>',
            errorTemplate: '<li tabindex="-1" role="alert" class="check-balance__card_error"></li>'
        };

        if (this.cardNumEle) {
            this.cardInstance = $(this.cardNumEle).parsley(parsleySettings);
        }
        if (this.pinElem) {
            parsleySettings.errorTemplate = '<li tabindex="-1" role="alert" class="check-balance__pin_error"></li>';
            this.pinInstance = $(this.pinElem).parsley(parsleySettings);
        }
    }

    /**
     * @description Card validation
     * @returns {boolean} isValid card number
     */
    validateCardNumber = () => {
        this.cardInstance.validate();
        const errors = objectPath.get(window, 'dataLayer.page.errors', []);

        if (!this.cardInstance.isValid()) {
            const errCode = AnalyticsConstants.CARDNO_ERROR;

            errors.push(errCode);
            setAnalyticsData('page.errors', errors);
            triggerAnalyticsEvent(AnalyticsConstants.INLINE_ERROR, { errorCode: errCode });
        }
        return this.cardInstance.isValid();
    }

    /**
     * @description Card validation
     * @returns {boolean} isValid card number
     */
    validatePin = () => {
        this.pinInstance.validate();
        const errors = objectPath.get(window, 'dataLayer.page.errors', []);

        if (!this.pinInstance.isValid()) {
            const errCode = AnalyticsConstants.PINNO_ERROR;

            errors.push(errCode);
            setAnalyticsData('page.errors', errors);
            triggerAnalyticsEvent(AnalyticsConstants.INLINE_ERROR, { errorCode: errCode });
        }
        return this.pinInstance.isValid();
    }

    /**
     * @description Check balance
     * @param {Object} event event object
     * @returns {void}
     */
    validateCardDetails = (event) => {
        event.preventDefault();

        const isCardNumValid = this.validateCardNumber();
        const isPinValid = this.validatePin();
        const { giftCardConfig } = this.props.pdpConfig;
        const request = objectPath.get(giftCardConfig, 'checkBalance.request', {});

        if (request.payload) {
            request.payload.cardNumber = this.state.cardNumber;
            request.payload.pin = this.state.pin;
        }
        if (isCardNumValid && isPinValid) {
            this.props.dispatch(getCardBalanceAction(request));
        } else {
            findFirst('.parsley-error-list li').focus();
        }
    }

    /**
     * Clear details
     * @returns {void}
     */
    clearCheckBalance = () => {
        this.setState(this.defaultState);
    }

    /**
     * Close Modal
     * @returns {void}
     */
    closeCheckBalance = () => {
        this.clearCheckBalance();
        this.props.dispatch(closePdpModal({
            type: PDPMODAL.CHECK_BALANCE,
            container: '.product-description__container'
        }));
    }

    /**
     * @param {Object} e event
     * @returns {void}
     */
    keyboardCloseCheckBalance = (e) => {
        const charCode = (e.which) ? e.which : e.keyCode;
        const type = getKeyCode(charCode);

        this.clearCheckBalance();
        if (type === 'ENTER') {
            this.props.dispatch(closePdpModal({
                type: PDPMODAL.CHECK_BALANCE,
                container: '.product-description__container',
                cta: '.check-balance__cta'
            }));
        }
    }

    /**
     * @returns {void}
     */
    checkAnotherCardHandler = () => {
        this.setState(this.defaultState);
        this.props.dispatch(resetCheckBalance());
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const { giftCardConfig } = this.props.pdpConfig;
        const { checkBalance } = giftCardConfig;

        if (this.props && !this.props.showBalance) {
            return (
                <Fragment>
                    <button type="button" aria-hidden="true" className="button-hidden" />
                    <form className="check-balance__container">
                        <div>
                            <h3 className="check-balance__heading">{giftCardConfig.giftCardCheckBalanceLabel}</h3>
                        </div>
                        <div className="check-balance__group card material-input">
                            <input
                                className="check-balance__card"
                                name="card"
                                id="card"
                                type="text"
                                value={this.state.cardNumber}
                                onChange={this.setCardNumber}
                                required
                                maxLength={16}
                                data-parsley-maxlength-message=""
                                data-parsley-required-message={giftCardConfig.validations.required.cardNumber}
                                ref={(el) => { this.cardNumEle = el; }}
                            />
                            <label htmlFor="card">{giftCardConfig.cardNumberLabel}</label>
                        </div>
                        <div className="check-balance__group material-input">
                            <input
                                className="check-balance__pin"
                                name="pin"
                                id="pin"
                                type="password"
                                value={this.state.pin}
                                onChange={this.setPin}
                                maxLength={8}
                                required
                                ref={(el) => { this.pinElem = el; }}
                                data-parsley-maxlength-message=""
                                data-parsley-required-message={giftCardConfig.validations.required.pin}
                            />
                            <label htmlFor="pin">{giftCardConfig.pinLabel}</label>
                        </div>
                        <div className="check-balance__disclaimer">
                            <InformationText config={giftCardConfig.disclaimer} />
                        </div>
                        {
                            this.props.mismatchError &&
                            <p role="alert" className="check-balance__submit_error mismatch_error">
                                {objectPath.get(giftCardConfig, 'validations.server.mismatch', '')}
                            </p>
                        }
                        <button className="check-balance__submit secondary-btn" type="submit" onClick={this.validateCardDetails}>
                            <span className="secondary-btn_content" tabIndex="-1">{giftCardConfig.checkBalanceCTA}</span>
                        </button>
                    </form>
                </Fragment>
            );
        }
        return (
            <div className="show-balance check-balance__container">
                <h5 className="show-balance__heading">{checkBalance.headlineText}</h5>
                <div className="show-balance__group-container">
                    <div className="show-balance__group">
                        <label className="show-balance__label" htmlFor="card">{giftCardConfig.cardNumberLabel}</label>
                        <input
                            className="show-balance__input"
                            name="card"
                            id="card"
                            type="text"
                            disabled
                            value={this.state.cardNumber}
                        />
                    </div>
                    <div className="show-balance__group">
                        <label className="show-balance__label" htmlFor="balance">{checkBalance.remainingBalance}</label>
                        <input
                            className="show-balance__input"
                            name="balance"
                            id="balance"
                            type="text"
                            disabled
                            value={this.props.balance}
                        />
                    </div>
                </div>
                <button type="button" className="btn" onClick={this.checkAnotherCardHandler}>
                    <span className="cta-content" tabIndex="-1">
                        <span className="cta-text">
                            {checkBalance.checkAnotherBalance}
                        </span>
                    </span>
                    <i className="icon-Right" />
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        pdpConfig: state.productDetails.pdpConfig,
        showBalance: state.giftCard.showBalance,
        mismatchError: state.giftCard.mismatchError,
        balance: state.giftCard.balance
    };
};

GiftCardBalanceModal.propTypes = {
    dispatch: PropTypes.func.isRequired,
    pdpConfig: PropTypes.object.isRequired,
    showBalance: PropTypes.bool,
    balance: PropTypes.any.isRequired,
    mismatchError: PropTypes.bool
};

GiftCardBalanceModal.defaultProps = {
    showBalance: false,
    mismatchError: false
};

export default connect(mapStateToProps)(GiftCardBalanceModal);
