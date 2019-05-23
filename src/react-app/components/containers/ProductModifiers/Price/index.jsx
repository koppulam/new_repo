// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { currencyFormatter } from 'lib/utils/currency-formatter';
// import './index.scss';

/**
 * Price component
 */
class Price extends React.Component {
    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const emptyPrice = '';

        return (
            <p className="pdp-price-details">
                <span>
                    {
                        currencyFormatter(
                            (this.props.price && this.props.price.length > 0) ?
                                this.props.price.reduce((accumulator, currentValue) => accumulator + currentValue) :
                                emptyPrice
                        )
                    }
                </span>
            </p>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        price: state.productDetails.productData.price,
        pdpConfig: state.productDetails.pdpConfig
    };
};

Price.propTypes = {
    price: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(Price);
