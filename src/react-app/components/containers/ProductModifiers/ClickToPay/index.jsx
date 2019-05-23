import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';

import AddToCart from 'components/containers/ProductModifiers/AddToCart';

/**
 *  AddToCart Component
 */
class ClickToPay extends React.Component {
    /**
     * redirect to checkout page
     * @returns {void}
     */
    redirectToCheckout = () => {
        const url = objectPath.get(this.props.aem[this.props.clickToPayConfig], 'clickToPayURL', '');

        if (typeof url !== 'undefined') {
            window.location.href = url;
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const clickToPayConfig = objectPath.get(this.props.aem, this.props.clickToPayConfig, { });
        const { addToCartConfig } = this.props;

        return (
            <AddToCart
                addtocartconfig={addToCartConfig}
                successCallBack={this.redirectToCheckout}
                buttonText={clickToPayConfig.clickToPayText}
                isClickToPay
            />
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem
    };
};

ClickToPay.defaultProps = {
    clickToPayConfig: 'clickToPayConfig',
    addToCartConfig: 'addToCartConfig'
};

ClickToPay.propTypes = {
    aem: PropTypes.object.isRequired,
    clickToPayConfig: PropTypes.string,
    addToCartConfig: PropTypes.string
};


export default connect(mapStateToProps)(ClickToPay);
