// Packages
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import objectPath from 'object-path';
import updateShippingFlyoutState from 'actions/ShippingActions';
import { addClass } from 'lib/dom/dom-util';
import { enableBodyScroll, disableBodyScroll } from 'lib/no-scroll';
import getKeyCode from 'lib/utils/KeyCodes';

// import './index.scss';

/**
 * Shipping-returns Cta Component
 */
class ShippingCta extends React.Component {
    /**
     * @description on keyprrss
     * @param {object} e event object
     * @returns {void}
     */
    onKeyPress = (e) => {
        e.stopPropagation();
        const code = e.which ? e.which : e.keyCode;
        const type = getKeyCode(code, e.shiftKey);

        if (type === 'ENTER' || type === 'SPACE') {
            this.toggleShippingFlyout(e);
        }
    }

    /**
     * @param {e} e object
     * @param {*} index filter subList index
     * @returns {void}
     */
    toggleShippingFlyout = (e) => {
        const { showShippingFlyout } = this.props;
        const shippingFlyoutElem = e.currentTarget;

        if (!showShippingFlyout) {
            disableBodyScroll('SHIPPING FLYOUT', true);
            addClass(shippingFlyoutElem, 'active');
        } else {
            enableBodyScroll('SHIPPING FLYOUT', false);
        }
        this.props.dispatch(updateShippingFlyoutState({
            showShippingFlyout: !this.props.showShippingFlyout,
            flyoutContentType: objectPath.get(this.props, 'config', 'shipping')
        }));
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const flyoutConfig = objectPath.get(this.props, 'config', 'shipping');
        let ctaText = '';

        if (flyoutConfig === 'shipping') {
            ctaText = objectPath.get(window, 'tiffany.authoredContent.shippingFlyoutConfig.ctaTextLabel', 'Call to Action');
        } else {
            ctaText = objectPath.get(this.props.aem, `${flyoutConfig}.ctaTextLabel`, 'call to action');
        }

        return (
            <span
                className="shipping-cta pdp-shipping-cta"
                onClick={this.toggleShippingFlyout}
                onKeyPress={this.onKeyPress}
                role="button"
                tabIndex={0}
            >
                <span className="cta-content" tabIndex="-1">
                    <span className="cta-text">
                        {ctaText}
                    </span>
                    {
                        this.props.noChevron === true &&
                        <i className="icon-dropdown-right" />
                    }
                </span>
            </span>
        );
    }
}

ShippingCta.propTypes = {
    aem: PropTypes.object.isRequired,
    showShippingFlyout: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    noChevron: PropTypes.bool
};

ShippingCta.defaultProps = {
    noChevron: true
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        showShippingFlyout: state.shippingReducer.showShippingFlyout
    };
};

export default connect(mapStateToProps)(ShippingCta);
