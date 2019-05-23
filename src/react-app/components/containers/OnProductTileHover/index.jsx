// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import * as objectPath from 'object-path';
import classNames from 'classnames';
// Components
import Picture from 'components/common/Picture';
import WishList from 'components/containers/WishList';

import { getOnHoverProductDetails } from 'actions/OnHoverActions';
import { openNotifyFlyout } from 'actions/IStatusFlyoutAction';
import { currencyFormatter } from 'lib/utils/currency-formatter';

import PRODUCT_CONSTANTS from 'constants/ProductConstants';
import HOVER from 'constants/OnHoverConstants';

// import './index.scss';

/**
 * Product Carousel Component
 */
class OnProductTileHover extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.aem[this.props.config],
            product: {}
        };
        this.hoverContainer = React.createRef();
    }

    /**
     * @param {onject} m Images array captured from the service call.
     * @returns {void}
     */
    componentDidMount() {
        const { tileData } = this.props;

        if (tileData && Object.keys(tileData).length <= 0) {
            if (this.controller) {
                this.controller.abort();
            }
            this.controller = new AbortController();
            const checkSkuType = /[a-zA-Z]/.test(this.props.sku);
            const { imageUrl } = this.state.config;
            const requestPayload = objectPath.get(this.state.config, 'productPayload', {});
            const groupText = PRODUCT_CONSTANTS.TYPE.GROUP_COMPLETE;
            const itemText = PRODUCT_CONSTANTS.TYPE.ITEM_COMPLETE;
            let options = {};

            requestPayload.Sku = this.props.sku;

            if (checkSkuType) {
                // Invoke Group Complete
                const groupComplete = JSON.parse(JSON.stringify(this.props.aem.groupCompleteServiceConfig));

                groupComplete.payload = requestPayload;
                options = {
                    type: groupText,
                    imageUrl
                };
                this.invokeItemGroupComplete(groupComplete, options, this.controller.signal);
            } else {
                // Invoke Item Complete
                const itemComplete = JSON.parse(JSON.stringify(this.props.aem.itemCompleteServiceConfig));

                itemComplete.payload = requestPayload;

                options = {
                    type: itemText,
                    imageUrl
                };
                this.invokeItemGroupComplete(itemComplete, options, this.controller.signal);
            }
        }
        this.hoverContainer.current.focus();
    }

    /**
     * @description invokeItemGroupComplete images object
     * @param {array} request request payload to invoke the service api
     * @param {array} options options which holds the type to differentiate the transformation.
     * @param {abort} signal abort the controller
     * @returns {void}
     */
    invokeItemGroupComplete = (request, options, signal) => {
        const products = objectPath.get(this.props.onHoverProducts, 'productsList', []);
        let isTileHovered = false;
        let productsIndex;

        if (products && products.length > 0) {
            products.forEach((element, index) => {
                if (element && element.products.sku === this.props.sku) {
                    productsIndex = index;
                    isTileHovered = true;
                }
            });
            this.setState({ product: {} });
            this.props.dispatch({
                type: HOVER.CLEAR_ON_HOVER
            });
            if (isTileHovered) {
                this.setState({ product: products[productsIndex].products });
            } else {
                this.props.dispatch(getOnHoverProductDetails(request, options, signal));
            }
        } else {
            this.props.dispatch(getOnHoverProductDetails(request, options, signal));
        }
    }

    /**
     * @description transformImagesObject images object
     * @param {array} imgList Images array captured from the service call.
     * @param {array} products Contains the stateObject products to get url.
     * @returns {void}
     */
    transformImgList = (imgList, products) => {
        const images = [];

        if (imgList && imgList.length > 0) {
            imgList.forEach((element, index) => {
                images.push({
                    id: index,
                    defaultSrc: element,
                    isLazyLoad: false,
                    altText: objectPath.get(products, 'title', ''),
                    customClass: 'image-section',
                    url: objectPath.get(products, 'url', '')
                });
            });
        }

        return images;
    }

    /**
     * notifyWhenAvailable, open notify me flyout.
     * @returns {void}
     */
    notifyWhenAvailable = () => {
        const payload = {};
        let products = {};
        const { tileData } = this.props;

        if (tileData && Object.keys(tileData).length > 0) {
            products = tileData;
        } else {
            const productState = Object.keys(this.state.product).length > 0;
            const onHoverProds = objectPath.get(this.props.onHoverProducts, 'product', {});

            products = productState ? this.state.product : onHoverProds;
        }
        const description = objectPath.get(products, 'shortDescription', '');

        payload.productImages = [];
        payload.productImageDefaultURL = objectPath.get(products, 'images.0', '');
        payload.productName = description;
        payload.productPrice = products.price;
        payload.sku = objectPath.get(products, 'sku', '');
        payload.groupSku = objectPath.get(products, 'groupSku', '');
        payload.parentGroupSku = objectPath.get(products, 'parentGroupSku', '');

        this.props.dispatch(openNotifyFlyout(payload));
        this.props.onMouseLeave();
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        let products = {};
        const data = this.props.tileData;

        if (data && Object.keys(data).length > 0) {
            products = data;
        } else {
            const productState = Object.keys(this.state.product).length > 0;
            const onHoverProds = objectPath.get(this.props.onHoverProducts, 'product', {});

            products = productState ? this.state.product : onHoverProds;
        }
        const prodStateObject = objectPath.get(products, 'images', []);
        const imagesList = this.transformImgList(prodStateObject, products);
        const description = objectPath.get(products, 'shortDescription', '');
        const viewDetailsText = objectPath.get(this.state, 'config.viewDetailsText', 'view Details');
        const notifyMeButtonLabel = objectPath.get(this.props.aem, 'productNotPurchasableConfig.notifyMeButtonText', 'Notify me when available');

        const settings = {
            dots: false,
            infinite: false,
            speed: 600,
            slidesToShow: 1,
            slidesToScroll: 1,
            swipeToSlide: false,
            initialSlide: 0,
            arrows: true,
            centerPadding: 0,
            variableWidth: false,
            autoplay: true,
            autoPlaySpeed: 2000

        };
        const onHoverItemsLen = imagesList.length;
        const showPrice = products.isIRExperience !== true && (products.price && products.price > 0);
        const { isWishlistOpen } = this.props.flyout;

        return (
            <div ref={this.hoverContainer}>
                {
                    !isWishlistOpen && onHoverItemsLen > 0 &&
                    <article className="hover-container" onMouseLeave={this.props.onMouseLeave}>
                        <div className="hover-container__item">
                            {
                                onHoverItemsLen > 1 &&
                                <Slider {...settings}>
                                    {
                                        imagesList.map((item, index) => {
                                            return (
                                                <a
                                                    key={index.toString()}
                                                    className="hover-container__item__slide-picture"
                                                    href={item.url}
                                                >
                                                    <Picture
                                                        defaultSrc={item.defaultSrc}
                                                        isLazyLoad={item.isLazyLoad}
                                                        altText={item.altText}
                                                        customClass={item.customClass}
                                                    />
                                                </a>);
                                        })
                                    }
                                </Slider>
                            }
                            {
                                onHoverItemsLen === 1 &&
                                <a
                                    href={imagesList[0].url}
                                    tabIndex="-1"
                                >
                                    <Picture
                                        defaultSrc={imagesList[0].defaultSrc}
                                        isLazyLoad={imagesList[0].isLazyLoad}
                                        altText={imagesList[0].altText}
                                        customClass={imagesList[0].customClass}
                                    />
                                </a>
                            }
                            <div className="hover-container__item_container">
                                <div className="hover-container__item__description">
                                    {description}
                                </div>
                                <div className="hover-container__item__customizable">
                                    <WishList
                                        sku={this.props.sku}
                                        isgroup={this.props.isGroup}
                                        groupsku={this.props.groupSku}
                                    />
                                </div>
                            </div>
                            {
                                !products.isLowInventory &&
                                <a href={products.url} className="btn hover-container__item_view-details" onBlur={this.props.onProductBlur}>
                                    <div className="btn-content hover-container__item_view-details_btn">
                                        <div className="hover-container__item_view-details_btn_text">
                                            {
                                                showPrice &&
                                                <span className="hover-container__item_view-details_btn_text_price">{currencyFormatter(products.price)}</span>
                                            }
                                            <span
                                                className={
                                                    classNames(
                                                        {
                                                            'hover-container__item_view-details_btn_text_details-text': showPrice,
                                                            'hover-container__item_view-details_btn_text_no-price': !showPrice
                                                        }
                                                    )
                                                }
                                            >
                                                {viewDetailsText}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            }
                            {
                                products.isLowInventory &&
                                <button type="button" className="btn hover-container__item_view-details" onClick={this.notifyWhenAvailable} onBlur={this.props.onProductBlur}>
                                    <div className="cta-content hover-container__item_view-details_btn">
                                        <div className="hover-container__item_view-details_btn_text">
                                            {
                                                (products.isIRExperience !== true && showPrice) &&
                                                <span className="hover-container__item_view-details_btn_text_price">{currencyFormatter(products.price)}</span>
                                            }
                                            <span
                                                className={
                                                    classNames(
                                                        {
                                                            'hover-container__item_view-details_btn_text_details-text': showPrice,
                                                            'hover-container__item_view-details_btn_text_no-price': !showPrice
                                                        }
                                                    )
                                                }
                                            >
                                                {notifyMeButtonLabel}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            }
                        </div>
                    </article>
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        labels: state.authoredLabels,
        onHoverProducts: state.onHoverProducts,
        flyout: state.flyout
    };
};

OnProductTileHover.defaultProps = {
    isGroup: 'false',
    groupSku: ''
};

OnProductTileHover.propTypes = {
    sku: PropTypes.any.isRequired,
    config: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired,
    isSavedProduct: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onProductBlur: PropTypes.func.isRequired,
    onHoverProducts: PropTypes.object.isRequired,
    isGroup: PropTypes.string,
    groupSku: PropTypes.string,
    flyout: PropTypes.any.isRequired
};

export default connect(mapStateToProps)(OnProductTileHover);
