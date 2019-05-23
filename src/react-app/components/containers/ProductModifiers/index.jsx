import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import { getProductDetails } from 'actions/ProductDetailsActions';
import { scrollTo } from 'lib/utils/scroll-to-content';

// Component import
import AddToCart from './AddToCart';
import ProductQuantity from './ProductQuantity';

// import './index.scss';

/**
 * Product Modifiers Container Component ->
 * Contians
 * 1. size selector
 * 2. Quantity selector
 * 3. Add to cart
 */
class ProductModifiers extends React.Component {
    /**
     * Lifcycle hook for
     * @returns {void}
     */
    async componentDidMount() {
        const priceConfig = objectPath.get(this.props.aem, this.props.priceconfig);

        if (priceConfig) {
            objectPath.set(priceConfig, 'payload.sku', this.props.pdpConfig.selectedSku);
            this.props.dispatch(getProductDetails(priceConfig));
        }
    }

    /**
     * Scroll to find a store section
     * @returns {void}
     * @param {event} event anchor click event
     */
    scrollToFindaStore = (event) => {
        event.preventDefault();
        scrollTo('.buy-pickup');
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        return (
            <div className="description_form">
                <form className="pdp_form">
                    {objectPath.get('this.props.pdpConfig.maxQuantity') &&
                        <ProductQuantity
                            maxQuantity={this.props.pdpConfig.maxQuantity}
                        />
                    }
                    <div>
                        <button type="button" className="pdf_form__findStore" onClick={this.scrollToFindaStore}>
                            <span className="pdf_form__findStore_label"> Find in store </span>
                            <span className="icon-dropdown-up" />
                        </button>
                        <AddToCart
                            addToCartConfig={this.props.addtocartconfig}
                            price={this.props.price}
                        />
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        price: state.productDetails.productData.price,
        pdpConfig: state.productDetails.pdpConfig
    };
};

ProductModifiers.propTypes = {
    aem: PropTypes.any.isRequired,
    maxQuantity: PropTypes.number,
    price: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    pdpConfig: PropTypes.object.isRequired,
    priceconfig: PropTypes.string.isRequired,
    addtocartconfig: PropTypes.string.isRequired
};

ProductModifiers.defaultProps = {
    maxQuantity: null
};

export default connect(mapStateToProps)(ProductModifiers);
