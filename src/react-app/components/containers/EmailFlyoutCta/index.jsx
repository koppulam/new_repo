// Packages
import React from 'react';
import PropTypes from 'prop-types';
// import objectPath from 'object-path';
import { connect } from 'react-redux';
import { disableBodyScroll, enableBodyScroll } from 'lib/no-scroll';
import updateSelectedFlyoutModal from 'actions/ConciergeActions';
import * as objectPath from 'object-path';

// import './index.scss';

/**
 * @description Flyout component for shipping and returns
 * @class ShippingFlyout
 */
class EmailFlyoutCta extends React.Component {
    /**
     * @description function to toggle the flyout
     * @returns {void}
     */
    toggleConciergeFlyout = () => {
        const showConciergeFlyout = this.props.showFlyout;

        if (!showConciergeFlyout) {
            disableBodyScroll('EMAIL', true);
        } else {
            enableBodyScroll('EMAIL', false);
        }
        this.updateSelectedFlyoutModal({
            flyoutState: 'EMAIL',
            showFlyout: !this.props.showFlyout,
            isConcierge: false
        });
    };

    /**
     * @description update the flyout selected state
     * @param {Object} selectedState  Selcted flyout
     * @returns {void}
     */
    updateSelectedFlyoutModal = selectedState => {
        this.props.dispatch(updateSelectedFlyoutModal(selectedState));
    };

    /**
    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const emailLabel = objectPath.get(this.props, 'emailLabel', 'Email');
        let emailImgConfig = {};

        if (this.props.config.length > 0) {
            emailImgConfig = this.props.aem[this.props.config];
        }

        return (
            <div>
                {
                    Object.keys(emailImgConfig).length > 0 ?
                        <div>
                            <div className="at-your-service__container_services_category_icon">
                                <button
                                    type="button"
                                    className="email-cta_image display__block at-your-service__container_services_category_icon_link"
                                    onClick={this.toggleConciergeFlyout}
                                    data-interaction-context=""
                                    data-interaction-type="love-engagement:service"
                                    data-interaction-name={objectPath.get(emailImgConfig, 'emailInteractionName', 'Email')}
                                >
                                    <span className="at-your-service__container_services_category_icon_link">
                                        <img className="product-tile__body_icon-img" src={objectPath.get(emailImgConfig, 'imageIcon', '')} alt={objectPath.get(emailImgConfig, 'imageIconAlt', '')} />
                                    </span>
                                </button>
                            </div>

                            <button
                                type="button"
                                className="email-cta"
                                onClick={this.toggleConciergeFlyout}
                                data-interaction-context=""
                                data-interaction-type="love-engagement:service"
                                data-interaction-name={objectPath.get(emailImgConfig, 'emailInteractionName', 'Email')}
                            >
                                <span className="cta-content" tabIndex="-1">
                                    <span className="cta-text">
                                        {objectPath.get(emailImgConfig, 'emailLabel', '')}
                                    </span>
                                </span>
                                <i className="icon-dropdown-right" />
                            </button>
                        </div>
                        :
                        <div>
                            <button
                                type="button"
                                className="email-cta"
                                onClick={this.toggleConciergeFlyout}
                                data-interaction-context=""
                                data-interaction-type="love-engagement:service"
                                data-interaction-name={objectPath.get(this.props, 'emailLabel', 'Email')}
                            >
                                <span className="cta-content" tabIndex="-1">
                                    <span className="cta-text">
                                        {emailLabel}
                                    </span>
                                </span>
                                <i className="icon-dropdown-right" />
                            </button>
                        </div>
                }
            </div>
        );
    }
}

EmailFlyoutCta.propTypes = {
    aem: PropTypes.object.isRequired,
    showFlyout: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    config: PropTypes.string
};

EmailFlyoutCta.defaultProps = {
    config: ''
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        showFlyout: state.conciergeFlyout.showFlyout
    };
};

export default connect(mapStateToProps)(EmailFlyoutCta);
