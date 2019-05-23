// Packages
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import classNames from 'classnames';
import {
    addClass,
    removeClass,
    findFirst,
    closest
} from 'lib/dom/dom-util';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import { formatStringForTracking } from 'lib/utils/analytics-util';

import Picture from 'components/common/Picture';
// import './index.scss';

/**
 * Product Preview Carousel Component
 */
class ProductSocialSharing extends React.Component {
    /**
     * @param {*} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };
    }

    /**
     * @description called on click or enter
     * @returns {void}
     */
    toggleFlyout = () => {
        const { isOpen } = this.state;
        const element = findFirst('body');

        this.setState({
            isOpen: !isOpen
        });
        if (!isOpen) {
            addClass(element, 'overflow-hidden');
            addClass(element, 'scrollbars-padding');
        } else {
            removeClass(element, 'overflow-hidden');
            removeClass(element, 'scrollbars-padding');
        }
    }

    /**
     * @param {e} e click event
     * @returns {void}
     */
    windowClickHandler = (e) => {
        const { isOpen } = this.state;

        if (isOpen) {
            const closestElem = closest(e.target, 'header');

            if (closestElem) {
                this.toggleFlyout();
            }
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            eyebrowTextUrl,
            eyebrowTextTarget,
            eyebrowText,
            productName,
            buttonImage,
            altLabel,
            productSharingConfig,
            productImageConfig
        } = this.props;
        const configData = objectPath.get(this.props.aem, productSharingConfig, {});
        const productImageConfigData = objectPath.get(this.props.aem, `${productImageConfig}.images`, []);
        const {
            isOpen
        } = this.state;

        return (
            <Fragment>
                <button
                    type="button"
                    aria-label={altLabel}
                    title={altLabel}
                    className="product-description__social-sharing_wechat cta"
                    onClick={this.toggleFlyout}
                    data-interaction-context=""
                    data-interaction-type={AnalyticsConstants.SOCIALSHARE}
                    data-interaction-name={formatStringForTracking(objectPath.get(this.props.productSharingConfig, 'properties.weChatDataInteractionName_tif_nt', altLabel))}
                >
                    <span className="cta-content hover-cta">
                        <img src={buttonImage} alt={altLabel} tabIndex="-1" />
                    </span>
                </button>
                <div
                    className={classNames('product-social-flyout', {
                        'product-flyout-shown': isOpen
                    })}
                >
                    <button type="button" className="product-social-flyout_close icon-Close" tabIndex={-1} onClick={this.toggleFlyout} />
                    <a href={eyebrowTextUrl} target={eyebrowTextTarget} className="product-social-flyout__eyebrow-text">{eyebrowText}</a>
                    <span className="product-social-flyout__product-name">{productName}</span>
                    <Picture
                        {...productImageConfigData[0]}
                    />
                    <div className="product-social-flyout__qrcode">
                        <span className="product-social-flyout__qrcode_title">{configData.qrCodeTitle}</span>
                        <div className="product-social-flyout__qrcode_image">
                            <img
                                src={configData.qrCodeImage}
                                alt={configData.qrCodeTitle}
                                customClass="product-social-flyout__image"
                            />
                        </div>
                        <span className="product-social-flyout__qrcode_desc">{configData.qrCodeDesc}</span>
                    </div>
                </div>
                {
                    isOpen &&
                    <div
                        role="button"
                        tabIndex={0}
                        className={classNames('product-flyout__overlay', {
                            'overlay-shown': isOpen
                        })}
                        onClick={this.toggleFlyout}
                        onKeyUp={() => { }}
                    />
                }
            </Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem
    };
};

ProductSocialSharing.propTypes = {
    aem: PropTypes.object.isRequired,
    eyebrowText: PropTypes.string.isRequired,
    eyebrowTextUrl: PropTypes.string.isRequired,
    eyebrowTextTarget: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    buttonImage: PropTypes.string.isRequired,
    altLabel: PropTypes.string.isRequired,
    productImageConfig: PropTypes.string.isRequired,
    productSharingConfig: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(ProductSocialSharing);
