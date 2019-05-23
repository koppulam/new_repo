import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import classNames from 'classnames';
import { findFirst } from 'lib/dom/dom-util';
import { setCartAnalytics } from 'lib/utils/analytics-util';

import { addToCart } from 'actions/ProductDetailsActions';
import { currencyFormatter } from 'lib/utils/currency-formatter';
import styleVariables from 'lib/utils/breakpoints';

// import './index.scss';

/**
 *  AddToCart Component
 */
class AddToCart extends React.Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.addtobag_btn = React.createRef();
        if (!this.props.isMiniPdp) {
            const {
                isEngraving, isEditEngraving, addtocartconfig, aem
            } = this.props;

            this.state = {
                addToBagAnimation: false,
                addToCartConfig: JSON.parse(JSON.stringify(isEngraving || isEditEngraving ? addtocartconfig : aem[addtocartconfig])),
                isDisabled: false
            };
        } else {
            let configObject = null;
            const { miniPdp, productId, addtocartconfig } = this.props;

            if (addtocartconfig && productId) {
                configObject = miniPdp.products && miniPdp.products[productId] && miniPdp.products[productId][addtocartconfig];
            } else {
                configObject = {};
            }
            this.state = {
                addToBagAnimation: false,
                addToCartConfig: JSON.parse(JSON.stringify(configObject)),
                isDisabled: false
            };
        }
    }

    /**
     * Add to cart - adds active class to button on click
     * @param {Object} event add to cart handler
     * @returns {void}
     */
    addToCartHandler = (event) => {
        event.preventDefault();
        if (this.state.isDisabled) {
            return;
        }

        // if add to bag is success and mobile on click again take to shopping bag
        if (this.state.addToBagSuccess) {
            window.location.href = objectPath.get(this.props.aem, 'shoppingBagUrl');
            return;
        }

        this.setState({ isDisabled: true });

        const { addToCartConfig } = this.state;
        const { engraving, shoppingBagItemId, isMiniPdp } = this.props;
        const selectedQuantity = isMiniPdp ? 1 : this.props.selectedQuantity;
        const productConfig = isMiniPdp ? this.props.config : this.props.pdpConfig;

        if (this.props.isEditEngraving) {
            objectPath.set(addToCartConfig, 'payload.ShoppingBagItemId', shoppingBagItemId);
            objectPath.set(addToCartConfig, 'payload.ItemServicing.itemServiceTypeID', engraving.itemServiceTypeId);
            objectPath.set(addToCartConfig, 'payload.ItemServicing.style', engraving.styleCode);
            objectPath.set(addToCartConfig, 'payload.ItemServicing.text', `${engraving.initialOne}${engraving.initialTwo}${engraving.initialThree}`);
            objectPath.set(addToCartConfig, 'payload.ItemServicing.serviceQuantity', engraving.servicingQuantity || 1);
        } else if (objectPath.get('addToCartConfig.payload') && productConfig) {
            const { payload: { sku: slectedSku } } = addToCartConfig;

            objectPath.set(addToCartConfig, 'payload.quantity', selectedQuantity);
            objectPath.set(addToCartConfig, 'payload.categoryID', parseInt(productConfig.categoryID, 10));
            objectPath.set(addToCartConfig, 'payload.masterCategoryID', parseInt(productConfig.masterCategoryID, 10));
            objectPath.set(addToCartConfig, 'payload.partialShip', productConfig.partialShip === 'true');
            objectPath.set(addToCartConfig, 'payload.orderOriginationId', parseInt(productConfig.orderOriginationId, 10));

            // If the call is a group type 2 call then
            // send sku only if sku and group sku are present
            if (addToCartConfig.groupTwoIdentifier) {
                // Dont add sku if these group sku and sku are not provided
                if (objectPath.get(addToCartConfig, 'payload.sku', false) && objectPath.get(addToCartConfig, 'payload.groupSku', false)) {
                    objectPath.set(addToCartConfig, 'payload.sku', (slectedSku && slectedSku !== '') ? parseInt(slectedSku, 10) : parseInt(productConfig.selectedSku, 10));
                }
            } else {
                objectPath.set(addToCartConfig, 'payload.sku', (slectedSku && slectedSku !== '') ? parseInt(slectedSku, 10) : parseInt(productConfig.selectedSku, 10));
            }

            if (this.props.isEngraving) {
                const {
                    itemServiceTypeId = 1,
                    styleCode = 290,
                    initialOne = '',
                    initialTwo = '',
                    initialThree = '',
                    servicingQuantity = 1
                } = this.props.engraving;

                objectPath.set(addToCartConfig, 'payload.itemServicing.itemServiceTypeID', itemServiceTypeId);
                objectPath.set(addToCartConfig, 'payload.itemServicing.style', styleCode);
                objectPath.set(addToCartConfig, 'payload.itemServicing.text', `${initialOne}${initialTwo}${initialThree}`);
                objectPath.set(addToCartConfig, 'payload.itemServicing.serviceQuantity', servicingQuantity);
            }
        }

        this.props.dispatch(addToCart(addToCartConfig, resp => {
            const addProduct = objectPath.get(window, 'dataLayer.product', {});

            this.setState({
                addToBagAnimation: true,
                isDisabled: false
            });
            addProduct.quantity = selectedQuantity;
            this.setState({ isDisabled: false });

            setCartAnalytics(addProduct);

            this.setState({ addToBagAnimation: true, addToBagSuccess: true });
            const isDesktop = window.matchMedia(styleVariables.desktopAndAbove).matches;

            setTimeout(() => {
                if (isDesktop) {
                    this.setState({
                        isDisabled: false,
                        addToBagAnimation: false,
                        addToBagSuccess: false
                    });
                } else {
                    this.setState({
                        isDisabled: false,
                        addToBagAnimation: false
                    });
                }
            }, this.props.animtimer);
            this.props.successCallBack(resp);

            // Check if this is exposed engraving flow
            if (objectPath.get(this.props, 'aem.isEngravingExposed', false)) {
                window.location.reload();
            }
        }, err => {
            this.setState({ isDisabled: false });
            console.warn('add to bag ajax failure');
            console.warn(err);
            if (!this.props.isEditEngraving || !this.props.isEngraving) {
                if (err && err.validationErrors && err.validationErrors.ProductMaxQuantityLimitError) {
                    findFirst('.quantity__error').focus();
                }
            }
            this.props.errorCallBack(err);
        }));
    }

    /**
     * @description Renders text to be shown on button
     * @param {BBoolean} isMobile boolean to identify if its mobile
     * @returns {object} html instance
     */
    textToShowOnButton = (isMobile) => {
        const {
            buttonText,
            labels,
            addToBagActiveTextForMobile,
            addToBagActive,
            addToBagHoverLabel
        } = this.props;

        if (this.state.addToBagSuccess) {
            return (
                <span>
                    {
                        buttonText ||
                        (
                            isMobile
                                ?
                                (addToBagActiveTextForMobile || labels.addToBagActiveTextForMobile)
                                :
                                addToBagActive || labels.addToBagActive
                        ) ||
                        'Add to bag'
                    }
                </span>
            );
        }

        if (this.state.addToBagAnimation) {
            return (
                <span>
                    {
                        buttonText ||
                        (
                            isMobile
                                ?
                                (addToBagActiveTextForMobile || labels.addToBagActiveTextForMobile)
                                :
                                addToBagActive || labels.addToBagActive
                        ) ||
                        'Add to bag'
                    }
                </span>
            );
        }
        return (
            <div>
                <span>
                    {
                        buttonText ||
                        labels.addToBag ||
                        'Add to bag'
                    }
                </span>
                <span>
                    {
                        buttonText ||
                        addToBagHoverLabel ||
                        labels.addToBagHoverLabel ||
                        labels.addToBag ||
                        'Add to bag'
                    }
                </span>
            </div>
        );
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            priceOverwrite,
            price,
            isMiniPdp,
            productId,
            miniPdp,
            isClickToPay,
            pdpConfig
        } = this.props;
        let priceToShow = 0;

        if (isMiniPdp) {
            if (miniPdp.products && miniPdp.products[productId]) {
                priceToShow = miniPdp.products[productId].price;
            }
        } else {
            priceToShow = priceOverwrite.length ? priceOverwrite : price;
        }

        pdpConfig.emptyPrice = '';

        return (
            <Fragment>
                <div
                    className={
                        classNames({
                            'product-description__addtobag': !isClickToPay,
                            'product-description__clicktopay': isClickToPay
                        })
                    }
                >
                    <button
                        type="button"
                        disabled={this.state.isDisabled}
                        className={
                            classNames('product-description__addtobag_btn', {
                                'active-btn': this.state.addToBagAnimation,
                                'click-to-pay': isClickToPay
                            })
                        }
                        onClick={this.addToCartHandler}
                        ref={this.addtobag_btn}
                    >
                        <div className="product-description__addtobag_btn_curtain" />
                        <div className="product-description__addtobag_btn_text-static">
                            <span className="product-description__addtobag_btn_text-static_price-wrapper">
                                {
                                    this.props.showSplitUp &&
                                    priceToShow &&
                                    priceToShow.length &&
                                    priceToShow.map((priceValue, index) => (
                                        <span
                                            key={index.toString()}
                                            className="product-description__addtobag_btn_text-static_price-wrapper_price"
                                        >
                                            {priceValue ? currencyFormatter(priceValue) : pdpConfig.emptyPrice}
                                        </span>
                                    ))
                                }
                                {
                                    // only to show 0 when price array is empty :(
                                    this.props.showSplitUp &&
                                    priceToShow &&
                                    priceToShow.length === 0 &&
                                    <span className="product-description__addtobag_btn_text-static_price-wrapper_price">{pdpConfig.emptyPrice}</span>
                                }
                                {
                                    !this.props.showSplitUp &&
                                    <span className="product-description__addtobag_btn_text-static_price-wrapper_price">
                                        {
                                            (priceToShow && priceToShow.length > 0) ?
                                                currencyFormatter(priceToShow.reduce((accumulator, currentValue) => accumulator + currentValue)) :
                                                pdpConfig.emptyPrice
                                        }
                                    </span>
                                }
                            </span>
                            <MediaQuery query={styleVariables.desktopAndAbove}>
                                <div className="product-description__addtobag_btn_text-static_addtobagtext">
                                    {
                                        this.textToShowOnButton()
                                    }
                                </div>
                            </MediaQuery>
                            <MediaQuery query={styleVariables.desktopAndBelow}>
                                <div className="product-description__addtobag_btn_text-static_addtobagtext">
                                    {
                                        this.textToShowOnButton('isMobile')
                                    }
                                </div>
                            </MediaQuery>
                        </div>
                    </button>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        selectedQuantity: state.productDetails.selectedQuantity,
        pdpConfig: state.productDetails.pdpConfig,
        labels: state.authoredLabels,
        price: state.productDetails.productData.price,
        engraving: state.engraving.variant || {
            itemServiceTypeId: 1,
            styleCode: 290,
            initialOne: '',
            initialTwo: '',
            initialThree: '',
            servicingQuantity: 1
        },
        miniPdp: state.miniPdp
    };
};

AddToCart.propTypes = {
    price: PropTypes.array.isRequired,
    addToBagActive: PropTypes.bool,
    addToBagActiveTextForMobile: PropTypes.string,
    addToBagHoverLabel: PropTypes.string,
    aem: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    selectedQuantity: PropTypes.number.isRequired,
    addtocartconfig: PropTypes.any.isRequired,
    pdpConfig: PropTypes.shape({
        selectedSku: PropTypes.string.isRequired,
        categoryID: PropTypes.number.isRequired,
        masterCategoryID: PropTypes.number.isRequired,
        orderOriginationId: PropTypes.number.isRequired,
        partialShip: PropTypes.bool.isRequired
    }).isRequired,
    labels: PropTypes.object.isRequired,
    priceOverwrite: PropTypes.array,
    showSplitUp: PropTypes.bool,
    isEngraving: PropTypes.bool,
    isClickToPay: PropTypes.bool,
    isEditEngraving: PropTypes.bool,
    engraving: PropTypes.object,
    errorCallBack: PropTypes.func,
    successCallBack: PropTypes.func,
    buttonText: PropTypes.string,
    shoppingBagItemId: PropTypes.string,
    isMiniPdp: PropTypes.bool,
    miniPdp: PropTypes.object.isRequired,
    animtimer: PropTypes.any,
    productId: PropTypes.string,
    config: PropTypes.any
};

AddToCart.defaultProps = {
    showSplitUp: false,
    isEngraving: false,
    isClickToPay: false,
    isEditEngraving: false,
    engraving: {},
    errorCallBack: () => { },
    successCallBack: () => { },
    buttonText: '',
    priceOverwrite: [],
    addToBagHoverLabel: '',
    shoppingBagItemId: '',
    isMiniPdp: false,
    addToBagActive: false,
    addToBagActiveTextForMobile: '',
    productId: '',
    animtimer: 5000,
    config: {}
};

export default connect(mapStateToProps)(AddToCart);
