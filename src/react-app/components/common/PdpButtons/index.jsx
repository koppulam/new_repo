import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';

import AddToCart from 'components/containers/ProductModifiers/AddToCart';
import ClickToPay from 'components/containers/ProductModifiers/ClickToPay';

// import './index.scss';
/**
 *  Pdp buttons  Component
 */
class PdpButtons extends React.Component {
    /**
     * @description component life cycle
     * @returns {void}
    */
    componentShouldUpdate() {
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            aem,
            addtocartconfig,
            priceConfig,
            clickToPayConfig
        } = this.props;
        const isClickToPay = objectPath.get(aem, 'isClickToPay', false);

        return (
            <Fragment>
                <div className="product-description_buttons_container">
                    <AddToCart
                        addtocartconfig={addtocartconfig}
                        priceConfig={priceConfig}
                        animtimer="5000"
                    />
                    {isClickToPay
                        && (
                            <ClickToPay
                                clickToPayConfig={clickToPayConfig}
                            />
                        )
                    }
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        aem: state.aem
    };
};

PdpButtons.propTypes = {
    aem: PropTypes.object.isRequired,
    clickToPayConfig: PropTypes.any.isRequired,
    priceConfig: PropTypes.any.isRequired,
    addtocartconfig: PropTypes.any.isRequired
};

export default connect(mapStateToProps)(PdpButtons);
