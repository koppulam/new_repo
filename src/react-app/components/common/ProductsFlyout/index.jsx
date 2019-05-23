// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import MediaQuery from 'react-responsive';
import classNames from 'classnames';
import $ from 'jquery';
import 'parsleyjs';
import {
    findFirst,
    closest
} from 'lib/dom/dom-util';
import scopeFocus from 'lib/dom/scope-focus';
import { disableBodyScroll, enableBodyScroll } from 'lib/no-scroll';

import { openNotifyFlyout, submitNotifyFlyout } from 'actions/IStatusFlyoutAction';

import styleVariables from 'lib/utils/breakpoints';
import { currencyFormatter } from 'lib/utils/currency-formatter';
import CustomScrollBar from 'components/common/CustomScrollBar';

// components
import InformationText from 'components/common/InformationText';
import Picture from 'components/common/Picture';

import './index.scss';
/**
 * @description flyout item component
 * @class FlyoutItems
 */
class ProductsFlyout extends React.Component {
    /**
     * @param {*} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        window.addEventListener('click', this.windowClickHandler);

        this.state = {
            emailAddress: ''
        };
        this.ProductFlyout = React.createRef();
        this.productFlyoutOverlay = React.createRef();
        this.handleScroll = this.handleScroll.bind(this, this.ProductFlyout, this.productFlyoutOverlay);
    }

    /**
     * @returns {void}
     */
    componentDidMount() {
        const globalBannerEle = findFirst('.global-banner');

        this.updateParsley();
        if (globalBannerEle) {
            window.addEventListener('scroll', this.handleScroll);
        }

        setTimeout(() => {
            this.handleScroll(this.flyoutContainer);
        }, 1000);
    }

    /**
     * @description lifecycle hook
     * @param {any} nextProps Next Props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        const {
            iStatusFlyout
        } = this.props;

        if (nextProps.iStatusFlyout.productFlyoutOpenState) {
            disableBodyScroll('PRODUCT FLYOUT', true);
        } else {
            enableBodyScroll('PRODUCT FLYOUT', false);
        }

        if (nextProps.iStatusFlyout.productFlyoutOpenState !== iStatusFlyout.productFlyoutOpenState) {
            if (nextProps.iStatusFlyout.productFlyoutOpenState) {
                scopeFocus.setScopeLimit(this.ProductFlyout.current);
            } else {
                scopeFocus.dispose();
            }
        }
    }

    /**
     * @returns {void}
     */
    componentDidUpdate() {
        this.updateParsley();
    }

    /**
     * @description component will unmount
     * @returns {void}
     */
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('click', this.windowClickHandler);
    }

    /**
     * @param {e} e click event
     * @returns {void}
     */
    windowClickHandler = (e) => {
        const { iStatusFlyout } = this.props;
        const isOpen = iStatusFlyout.productFlyoutOpenState;

        if (isOpen) {
            const closestElem = closest(e.target, 'header');

            if (closestElem) {
                this.closeFlyout();
            }
        }
    }

    /**
     * @description onchange method for recipient email field
     * @param {Object} event change event object
     * @returns {void}
     */
    mailAddressChange = (event) => {
        this.setState({
            emailAddress: event.target.value
        });
    }

    /**
     * Set Card number to state
     * @returns {void}
     */
    updateParsley = () => {
        const parsleySettings = {
            classHandler: (field) => {
                return field.$element;
            },
            errorsWrapper: '<ul class="product-flyout-errors parsley-error-list"></ul>',
            errorTemplate: '<li tabindex="-1" role="alert" class="product-flyout__container_email_error"></li>'
        };

        if (this.emailEle) {
            this.emailInstance = $(this.emailEle).parsley(parsleySettings);
        }
    }

    /**
     * @description called on click or enter
     * @returns {void}
     */
    closeFlyout = () => {
        const { dispatch } = this.props;

        if (this.emailEle) {
            $(this.emailEle).parsley().reset();
        }
        dispatch(openNotifyFlyout());
    }

    /**
     * @description called on click or enter
     * @returns {void}
     */
    submitEmail = () => {
        const isEmailValid = this.validateEmail();
        const {
            iStatusFlyout,
            dispatch,
            aem
        } = this.props;
        const { emailAddress } = this.state;

        if (isEmailValid) {
            const configData = objectPath.get(aem, 'productNotPurchasableConfig', {});
            const request = {};

            request.payload = configData.iStatusNotificationPayloadBean;
            request.url = configData.istatusNotificationUrl;
            request.method = configData.istatusMethod;

            request.payload.emailAddress = emailAddress;
            request.payload.groupSku = objectPath.get(iStatusFlyout, 'flyoutData.groupSku', '');
            request.payload.parentGroupSku = objectPath.get(iStatusFlyout, 'flyoutData.parentGroupSku', '');
            request.payload.sku = objectPath.get(iStatusFlyout, 'flyoutData.sku', '');
            request.payload.requestedPageName = objectPath.get(iStatusFlyout, 'flyoutData.sku', '');

            dispatch(submitNotifyFlyout(request));
        } else {
            $('.product-flyout-errors.parsley-error-list li').first().focus();
        }
    }

    /**
     * @description Card validation
     * @returns {boolean} isValid card number
     */
    validateEmail = () => {
        this.emailInstance.validate();
        return this.emailInstance.isValid();
    }

    /**
     * @description handle flyout top position
     * @param {object} flyoutContainer flyoutContainer
     * @returns {void}
     */
    handleScroll(flyoutContainer) {
        if (this.ProductFlyout && this.productFlyoutOverlay) {
            const rect = findFirst('header .header__nav-container').getBoundingClientRect();

            if (this.ProductFlyout.current && this.productFlyoutOverlay.current) {
                this.ProductFlyout.current.style.top = `${rect.bottom}px`;
                this.productFlyoutOverlay.current.style.top = `${rect.bottom}px`;
            }
        }
    }

    /**
     * @returns {void}
     */
    render() {
        const {
            aem,
            iStatusFlyout
        } = this.props;
        const { emailAddress } = this.state;
        const configData = objectPath.get(aem, 'productNotPurchasableConfig', {});
        const emailDescriptionRTE = {
            informationTextRTE: configData.emailDescriptionRTE
        };
        const isOpen = iStatusFlyout.productFlyoutOpenState;
        const isSubmitted = iStatusFlyout.isFlyoutSubmitted;
        const productData = iStatusFlyout.flyoutData;

        return (
            <div
                className={classNames('product-flyout', {
                    'product-flyout-shown': isOpen,
                    hide: !isOpen
                })}
            >
                {
                    <div
                        role="button"
                        tabIndex={0}
                        className={classNames('product-flyout__overlay', {
                            'overlay-shown': isOpen
                        })}
                        onClick={this.closeFlyout}
                        onKeyUp={() => { }}
                        ref={this.productFlyoutOverlay}
                    />
                }
                <div
                    className={classNames('product-flyout__container', {
                        'product-flyout-shown': isOpen
                    })}
                    ref={this.ProductFlyout}
                    role="dialog"
                    aria-modal
                >
                    <CustomScrollBar>
                        <MediaQuery query={styleVariables.desktopAndAbove}>
                            <div className="product-flyout__container_props tf-g">
                                <Picture
                                    sources={productData.productImages}
                                    defaultSrc={productData.productImageDefaultURL}
                                    altText={productData.productName}
                                    isLazyLoad={productData.isLazyLoad}
                                    customClass="product-flyout__container_props_image"
                                />
                                <div className="product-flyout__container_props_details">
                                    <p className="product-flyout__container_props_details_name">{productData.productName}</p>
                                    <p className="product-flyout__container_props_details_price">{currencyFormatter(productData.productPrice)}</p>
                                </div>
                            </div>
                        </MediaQuery>
                        {
                            !isSubmitted
                                ? (
                                    <div>
                                        <div className="product-flyout__container_description">
                                            <span className="product-flyout__container_description_text">
                                                {configData.textBeforeProductName}
                                            </span>
                                            <span className="product-flyout__container_description_name product-flyout__container_description_text">{productData.productName}</span>
                                            <span className="product-flyout__container_description_text">{configData.textAfterProductName}</span>
                                        </div>
                                        <form className="product-flyout__container_email">
                                            <div className="product-flyout__container_email_description">
                                                {configData.emailDescriptionRTE
                                                    && (
                                                        <InformationText config={emailDescriptionRTE} />
                                                    )
                                                }
                                            </div>
                                            <div className="product-flyout__container_email_input material-input">
                                                <input
                                                    className="input"
                                                    name="NotifyEmail"
                                                    id="NotifyEmail"
                                                    type="email"
                                                    autoComplete="email"
                                                    value={emailAddress}
                                                    onChange={this.mailAddressChange}
                                                    required
                                                    aria-required="true"
                                                    data-parsley-error-message={configData.invalidMailError}
                                                    ref={(el) => { this.emailEle = el; }}
                                                />
                                                <label
                                                    htmlFor="NotifyEmail"
                                                    className={classNames('input-label', {
                                                        active: emailAddress
                                                    })}
                                                >
                                                    {configData.emailInputPlaceholder}
                                                </label>
                                            </div>
                                            <div className="product-flyout__container_submit col__full tf-g__center">
                                                <button
                                                    type="button"
                                                    className={classNames('product-flyout__container_submit_button col__full tf-g__center', {
                                                        'buttonActive btn-primary': emailAddress
                                                    })}
                                                    onClick={() => {
                                                        if (emailAddress.length > 0) {
                                                            this.submitEmail();
                                                        }
                                                    }
                                                    }
                                                >
                                                    <span className="cta-content">
                                                        {configData.submitButtonLabel}
                                                    </span>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )
                                : (
                                    <div>
                                        <div className="product-flyout__container_description submitted">
                                            <span className="product-flyout__container_description_text">{configData.confirmTextBeforeProductName}</span>
                                            <span className="product-flyout__container_description_name product-flyout__container_description_text">{productData.productName}</span>
                                            <span className="product-flyout__container_description_text">{configData.confirmTextAfterProductName}</span>
                                        </div>
                                    </div>
                                )
                        }
                        <button type="button" className="product-flyout__container_close icon-Close" onClick={this.closeFlyout} />
                    </CustomScrollBar>
                </div>
                <button className="button-hidden" aria-hidden="true" type="button" tabIndex={isOpen ? 0 : -1} />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        iStatusFlyout: state.iStatusFlyout,
        aem: state.aem
    };
};

ProductsFlyout.propTypes = {
    iStatusFlyout: PropTypes.object,
    aem: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

ProductsFlyout.defaultProps = {
    iStatusFlyout: {
        productFlyoutOpenState: false,
        isSubmitted: false
    }
};

export default connect(mapStateToProps)(ProductsFlyout);
