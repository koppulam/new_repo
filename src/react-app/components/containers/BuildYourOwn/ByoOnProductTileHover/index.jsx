// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import * as objectPath from 'object-path';
import styleVariables from 'lib/utils/breakpoints';

// Components
import Picture from 'components/common/Picture';
import WishList from 'components/containers/WishList';

import { getOnHoverProductDetails } from 'actions/OnHoverActions';
import { addCharm, OnByoHoverProductDetails } from 'actions/BYOActions';
import { disableBodyScroll } from 'lib/no-scroll';
import PRODUCT_CONSTANTS from 'constants/ProductConstants';
// import HOVER from 'constants/OnHoverConstants';
import { getFixtureImageURL } from 'lib/utils/format-data';
import { currencyFormatter } from 'lib/utils/currency-formatter';

// import './index.scss';

import SelectVariation from '../SelectVariation';

/**
 * Product Carousel Component
 */
class ByoOnProductTileHover extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.aem[this.props.config],
            product: {},
            showVariations: !window.matchMedia(styleVariables.desktopAndAbove).matches,
            variationType: '',
            hasVariations: false,
            addCharmToTray: null
        };
        this.hoverContainer = React.createRef();
    }

    /**
     * @param {onject} m Images array captured from the service call.
     * @returns {void}
     */
    componentDidMount() {
        if (this.controller) {
            this.controller.abort();
        }
        this.controller = new AbortController();
        const { imageUrl } = this.state.config;
        const requestPayload = objectPath.get(this.state.config, 'productPayload', {});
        const groupText = PRODUCT_CONSTANTS.TYPE.BYO_GROUP_COMPLETE;
        const itemText = PRODUCT_CONSTANTS.TYPE.ITEM_COMPLETE;
        const mediaTypeID = objectPath.get(this.props.aem, 'byoConfig.charmMediaTypeId', 0);
        const colpoMediaTypeID = objectPath.get(this.props.aem, 'byoConfig.colpoMediaTypeId', 0);
        const mediaPreset = objectPath.get(this.props.aem, 'byoConfig.charmImagePreset', 0);
        const queryParam = objectPath.get(this.props.aem, 'byoConfig.charmImageQueryParam', '');
        const claspParam = objectPath.get(this.props.aem, 'byoConfig.charmImageClaspQueryParam', '');
        const colpoParam = objectPath.get(this.props.aem, 'byoConfig.colpoImageClaspQueryParam', '');
        const isDesktop = window.matchMedia(styleVariables.desktopAndAbove).matches;
        let options = {};

        requestPayload.Sku = this.props.sku;

        if (this.props.index === this.props.onHoverProducts.selectedProduct && this.props.onHoverProducts.product && Object.keys(this.props.onHoverProducts.product).length > 0 && !this.props.isGroup && !isDesktop) {
            const { parentTileProps, labels } = this.props;
            const onHoverProds = objectPath.get(this.props.onHoverProducts, 'product.products', objectPath.get(this.props.onHoverProducts, 'product', {}));
            let charm = onHoverProds;
            const variationType = objectPath.get(charm, 'groupName', '').toLowerCase().split(' ').join('_');
            const hasVariations = !!(charm.groupItems && charm.groupItems.length > 0 && objectPath.get(labels, 'byo.variations', {})[variationType]);

            if ((!hasVariations && !isDesktop) || (!hasVariations && this.props.keyBoardEnter)) {
                if (!charm.itemMedia) {
                    return;
                }
                charm.imageURL = parentTileProps.image;
                charm = {
                    ...charm,
                    ...parentTileProps,
                    transparentURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, mediaTypeID, charm.itemMedia.itemMedia, queryParam),
                    claspURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, mediaTypeID, charm.itemMedia.itemMedia, queryParam) + claspParam,
                    colpoTransparentURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, colpoMediaTypeID, charm.itemMedia.itemMedia, queryParam),
                    colpoClaspURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, colpoMediaTypeID, charm.itemMedia.itemMedia, queryParam) + colpoParam
                };
                this.props.dispatch(addCharm(charm));
                if (!isDesktop) {
                    this.props.actionButtonHandler();
                }
            }
        } else if (this.props.isGroup) {
            // Invoke Group Complete
            const groupComplete = JSON.parse(JSON.stringify(this.props.aem.byoConfig.groupRequest));

            groupComplete.payload = requestPayload;
            options = {
                type: groupText,
                imageUrl
            };
            this.invokeItemGroupComplete(groupComplete, options, this.controller.signal);
            if (!isDesktop) {
                disableBodyScroll('size-modal');
            }
        } else {
            // Invoke Item Complete
            const itemComplete = JSON.parse(JSON.stringify(this.props.aem.itemCompleteServiceConfig));

            itemComplete.payload = requestPayload;

            options = {
                type: itemText,
                imageUrl
            };
            this.byoItemCompleteHover(options);
        }
    }

    /**
     * @description lifecycle hook
     * @param {any} nextProps Next Props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        const mediaTypeID = objectPath.get(nextProps.aem, 'byoConfig.charmMediaTypeId', 0);
        const colpoMediaTypeID = objectPath.get(nextProps.aem, 'byoConfig.colpoMediaTypeId', 0);
        const mediaPreset = objectPath.get(nextProps.aem, 'byoConfig.charmImagePreset', 0);
        const queryParam = objectPath.get(nextProps.aem, 'byoConfig.charmImageQueryParam', '');
        const claspParam = objectPath.get(nextProps.aem, 'byoConfig.charmImageClaspQueryParam', '');
        const colpoParam = objectPath.get(nextProps.aem, 'byoConfig.colpoImageClaspQueryParam', '');

        if ((nextProps.onHoverProducts.product !== this.props.onHoverProducts.product || nextProps.keyBoardEnter !== this.props.keyBoardEnter) && nextProps.index === nextProps.onHoverProducts.selectedProduct) {
            if ((nextProps.onHoverProducts.product && Object.keys(nextProps.onHoverProducts.product).length > 0)) {
                const isDesktop = window.matchMedia(styleVariables.desktopAndAbove).matches;
                const { parentTileProps, labels } = this.props;
                const onHoverProds = objectPath.get(nextProps.onHoverProducts, 'product.products', objectPath.get(nextProps.onHoverProducts, 'product', {}));
                let charm = onHoverProds;
                const variationType = objectPath.get(charm, 'groupName', '').toLowerCase().split(' ').join('_');
                const hasVariations = !!(charm.groupItems && charm.groupItems.length > 0 && objectPath.get(labels, 'byo.variations', {})[variationType]);

                this.setState({ hasVariations, variationType, product: onHoverProds });
                if (((!hasVariations && !isDesktop) || (!hasVariations && nextProps.keyBoardEnter)) && (nextProps.keyBoardEnter !== this.props.keyBoardEnter || !isDesktop)) {
                    if (!charm.itemMedia) {
                        return;
                    }
                    charm.imageURL = parentTileProps.image;
                    charm = {
                        ...charm,
                        ...parentTileProps,
                        transparentURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, mediaTypeID, charm.itemMedia.itemMedia, queryParam),
                        claspURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, mediaTypeID, charm.itemMedia.itemMedia, queryParam) + claspParam,
                        colpoTransparentURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, colpoMediaTypeID, charm.itemMedia.itemMedia, queryParam),
                        colpoClaspURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, colpoMediaTypeID, charm.itemMedia.itemMedia, queryParam) + colpoParam
                    };
                    this.props.dispatch(addCharm(charm));
                    if (!isDesktop) {
                        this.props.actionButtonHandler();
                    }
                }
            }
        }
    }

    /**
     * @description invokeItemGroupComplete images object
     * @param {object} options config
     * @returns {void}
     */
    byoItemCompleteHover = (options) => {
        const products = objectPath.get(this.props.onHoverProducts, 'productsList', []);
        let isTileHovered = false;
        let productsIndex;

        if (products && products.length > 0) {
            products.forEach((element, index) => {
                if (element.index === this.props.index) {
                    productsIndex = index;
                    isTileHovered = true;
                }
            });
            this.setState({ product: {} });
            if (isTileHovered) {
                this.setState({ product: products[productsIndex].products });
            } else {
                this.props.dispatch(OnByoHoverProductDetails(options, this.props.index));
            }
        } else {
            this.props.dispatch(OnByoHoverProductDetails(options, this.props.index));
        }
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
                if (element.index === this.props.index) {
                    productsIndex = index;
                    isTileHovered = true;
                }
            });
            this.setState({ product: {} });
            if (isTileHovered) {
                const product = products[productsIndex].products;

                this.setState({ product, variationType: product && product.groupName ? product.groupName.toLowerCase().split(' ').join('_') : '' });
            } else {
                this.props.dispatch(getOnHoverProductDetails(request, options, signal, this.props.index, true));
            }
        } else {
            this.props.dispatch(getOnHoverProductDetails(request, options, signal, this.props.index, true));
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
     * @description add charm to tray
     * @param {bool} addCharmOnVariationSelect addCharmOnVariationSelect
     * @returns {void}
     */
    addCharm = (addCharmOnVariationSelect) => {
        const { parentTileProps, labels, aem } = this.props;
        const productState = Object.keys(this.state.product).length > 0;
        const onHoverProds = objectPath.get(this.props.onHoverProducts, 'product', {});
        let charm = productState ? this.state.product : onHoverProds;
        const hasVariations = charm.groupItems && charm.groupItems.length;
        const mediaTypeID = objectPath.get(aem, 'byoConfig.charmMediaTypeId', 0);
        const colpoMediaTypeID = objectPath.get(aem, 'byoConfig.colpoMediaTypeId', 0);
        const mediaPreset = objectPath.get(aem, 'byoConfig.charmImagePreset', 0);
        const queryParam = objectPath.get(aem, 'byoConfig.charmImageQueryParam', '');
        const claspParam = objectPath.get(aem, 'byoConfig.charmImageClaspQueryParam', '');
        const colpoParam = objectPath.get(aem, 'byoConfig.colpoImageClaspQueryParam', '');

        if (hasVariations && charm.groupName) {
            const variationType = charm.groupName.toLowerCase().split(' ').join('_');

            if (objectPath.get(labels, 'byo.variations', {})[variationType]) {
                this.setState({
                    variationType
                });
                if (!addCharmOnVariationSelect) {
                    this.setState({ showVariations: !this.state.showVariations });
                } else {
                    this.setState({ showVariations: true });
                }
            } else {
                if (!charm.itemMedia) {
                    return;
                }
                charm.imageURL = parentTileProps.image;
                charm = {
                    ...charm,
                    ...parentTileProps,
                    transparentURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, mediaTypeID, charm.itemMedia.itemMedia, queryParam),
                    claspURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, mediaTypeID, charm.itemMedia.itemMedia, queryParam) + claspParam,
                    colpoTransparentURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, colpoMediaTypeID, charm.itemMedia.itemMedia, queryParam),
                    colpoClaspURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, colpoMediaTypeID, charm.itemMedia.itemMedia, queryParam) + colpoParam
                };
                this.props.dispatch(addCharm(charm));
                this.props.actionButtonHandler();
            }
        } else {
            if (!charm.itemMedia) {
                return;
            }
            charm.imageURL = parentTileProps.image;
            charm = {
                ...charm,
                ...parentTileProps,
                transparentURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, mediaTypeID, charm.itemMedia.itemMedia, queryParam),
                claspURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, mediaTypeID, charm.itemMedia.itemMedia, queryParam) + claspParam,
                colpoTransparentURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, colpoMediaTypeID, charm.itemMedia.itemMedia, queryParam),
                colpoClaspURL: getFixtureImageURL(charm.itemMedia.imageUrlFormat, mediaPreset, charm.itemMedia.imagePrefix, colpoMediaTypeID, charm.itemMedia.itemMedia, queryParam) + claspParam
            };
            this.props.dispatch(addCharm(charm));
            if (!addCharmOnVariationSelect) {
                this.props.actionButtonHandler();
            }
            this.setState({ addCharmToTray: `${charm.title} ${objectPath.get(this.props.labels, 'byo.addCharmToTray', '')}` });
        }
    }

    /**
     * @description dispatches charm to tray with variation
     * @param {bool} validated if is valid
     * @param {object} selectedVariation selected variation
     * @param {bool} restictAddCharm add charm on selected variation
     * @returns {void}
     */
    variationSelected = (validated, selectedVariation, restictAddCharm = true) => {
        const { parentTileProps, aem } = this.props;
        const productState = Object.keys(this.state.product).length > 0;
        const onHoverProds = objectPath.get(this.props.onHoverProducts, 'product', {});
        let charm = productState ? this.state.product : onHoverProds;
        const mediaTypeID = objectPath.get(aem, 'byoConfig.charmMediaTypeId', 0);
        const colpoMediaTypeID = objectPath.get(aem, 'byoConfig.colpoMediaTypeId', 0);
        const mediaPreset = objectPath.get(aem, 'byoConfig.charmImagePreset', 0);
        const queryParam = objectPath.get(aem, 'byoConfig.charmImageQueryParam', '');
        const claspParam = objectPath.get(aem, 'byoConfig.charmImageClaspQueryParam', '');
        const colpoParam = objectPath.get(aem, 'byoConfig.colpoImageClaspQueryParam', '');

        charm = JSON.parse(JSON.stringify(charm));
        charm.imageURL = selectedVariation.imageURL;
        if (!selectedVariation.itemMedia) {
            return;
        }
        charm = {
            ...charm,
            ...parentTileProps,
            price: selectedVariation.price,
            transparentURL: getFixtureImageURL(selectedVariation.itemMedia.imageUrlFormat, mediaPreset, selectedVariation.itemMedia.imagePrefix, mediaTypeID, selectedVariation.itemMedia.itemMedia, queryParam),
            claspURL: getFixtureImageURL(selectedVariation.itemMedia.imageUrlFormat, mediaPreset, selectedVariation.itemMedia.imagePrefix, mediaTypeID, selectedVariation.itemMedia.itemMedia, queryParam) + claspParam,
            colpoTransparentURL: getFixtureImageURL(selectedVariation.itemMedia.imageUrlFormat, mediaPreset, selectedVariation.itemMedia.imagePrefix, colpoMediaTypeID, selectedVariation.itemMedia.itemMedia, queryParam),
            colpoClaspURL: getFixtureImageURL(selectedVariation.itemMedia.imageUrlFormat, mediaPreset, selectedVariation.itemMedia.imagePrefix, colpoMediaTypeID, selectedVariation.itemMedia.itemMedia, queryParam) + colpoParam
        };
        if (validated) {
            this.props.dispatch(addCharm(charm, {
                type: this.state.variationType,
                selectedVariation
            }));
            if (restictAddCharm) {
                this.props.actionButtonHandler();
            }
        }
        this.setState({ addCharmToTray: `${selectedVariation.linkText} ${objectPath.get(this.props.labels, 'byo.addCharmToTray', '')}` });
    }

    /**
     * @description dispatches charm to tray with variation
     * @param {bool} validated if is valid
     * @param {object} selectedVariation selected variation
     * @returns {void}
     */
    addVariationOnSelect = (validated, selectedVariation) => {
        this.variationSelected(validated, selectedVariation, false);
    }

    /**
     * @description handles back action on variation
     * @returns {void}
     */
    variationBackHandler = () => {
        this.setState({ showVariations: false });
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const productState = Object.keys(this.state.product).length > 0;
        const onHoverProds = objectPath.get(this.props.onHoverProducts, 'product', {});
        const products = productState ? this.state.product : onHoverProds;
        const variationType = objectPath.get(products, 'groupName', '').toLowerCase().split(' ').join('_');
        const prodStateObject = objectPath.get(products, 'images', []);
        const imagesList = this.transformImgList(prodStateObject, products);
        const description = objectPath.get(products, 'shortDescription', '');
        const settings = {
            dots: false,
            infinite: false,
            speed: 600,
            slidesToShow: 1,
            slidesToScroll: 1,
            swipeToSlide: false,
            pauseOnHover: false,
            initialSlide: 0,
            arrows: true,
            centerPadding: 0,
            variableWidth: false,
            autoplay: true,
            autoPlaySpeed: 2000,
            accessibility: false

        };
        const onHoverItemsLen = imagesList.length;
        const hasVariations = products.groupItems && products.groupItems.length;
        let addCharmText = '';

        if (hasVariations) {
            const type = products.groupName.toLowerCase().split(' ').join('_');

            addCharmText = objectPath.get(window, `tiffany.labels.byo.variations.${type}.continueBtnText`, objectPath.get(this.state, 'config.addCharm', 'Add Charm'));
        } else {
            addCharmText = objectPath.get(this.state, 'config.addCharm', 'Add Charm');
        }
        const isGroup = this.props.isGroup.toString();

        const html = (
            <div className="byo-hover-container" onMouseLeave={this.props.onMouseLeave}>
                {
                    (onHoverItemsLen > 0 && this.props.index === this.props.onHoverProducts.selectedProduct) &&
                    <article className="hover-container byo-hover-container" ref={this.hoverContainer}>
                        {
                            !this.state.showVariations &&
                            <div className="hover-container__item">
                                <div className="hover-container__item_main-content">
                                    {
                                        onHoverItemsLen > 0 &&
                                        <Slider {...settings}>
                                            {
                                                imagesList.map((item, index) => {
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={index.toString()}
                                                            className="hover-container__item__slide-picture"
                                                            onClick={this.addCharm}
                                                        >
                                                            <Picture
                                                                defaultSrc={item.defaultSrc}
                                                                isLazyLoad={item.isLazyLoad}
                                                                altText={item.altText}
                                                                customClass={item.customClass}
                                                            />
                                                        </button>
                                                    );
                                                })
                                            }
                                        </Slider>
                                    }
                                    <div className="hover-container__item__description">
                                        {
                                            description &&
                                                <p className="hover-container__item__description_text">{description}</p>
                                        }
                                        <WishList
                                            sku={this.props.productSku}
                                            isgroup={isGroup}
                                            groupsku={this.props.groupSku}
                                        />
                                    </div>
                                </div>
                                {
                                    products.isPurchasable &&
                                    <div className="hover-container__item_button" onBlur={this.props.onProductBlur}>
                                        <button
                                            type="button"
                                            className="select-size__button"
                                            onClick={this.addCharm}
                                        >
                                            <span className="select-size__button_currency">{currencyFormatter(products.price)}</span>
                                            <span className="select-size__button_text">{addCharmText}</span>
                                        </button>
                                    </div>
                                }
                            </div>
                        }
                        {
                            this.state.showVariations &&
                            <SelectVariation
                                variationType={this.state.variationType || variationType}
                                productDetails={{ productDetails: [products] }}
                                clickHandler={this.variationSelected}
                                backText={products.title}
                                addOnVariation
                                addVariationOnSelect={this.addVariationOnSelect}
                                backHandler={this.variationBackHandler}
                                onProductBlur={this.props.onProductBlur}
                                containerHeight={(this.hoverContainer && this.hoverContainer.current) ? this.hoverContainer.current.clientHeight : 0}
                            />
                        }
                        {this.props.showClose && <button type="button" className="close-modal icon-Close" aria-label="click to close" />}
                        {
                            this.state.addCharmToTray &&
                            <p
                                className="select-size_status-msg"
                                aria-live="assertive"
                            >{this.state.addCharmToTray}
                            </p>
                        }
                    </article>
                }
            </div>
        );

        return html;
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        labels: state.authoredLabels,
        onHoverProducts: state.onHoverProducts,
        byo: state.byo
    };
};

ByoOnProductTileHover.propTypes = {
    sku: PropTypes.any.isRequired,
    isGroup: PropTypes.bool.isRequired,
    config: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired,
    labels: PropTypes.any.isRequired,
    isSavedProduct: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onHoverProducts: PropTypes.object.isRequired,
    showClose: PropTypes.bool,
    actionButtonHandler: PropTypes.func,
    parentTileProps: PropTypes.any.isRequired,
    index: PropTypes.any.isRequired,
    keyBoardEnter: PropTypes.any,
    keyBoardFocus: PropTypes.bool,
    onProductBlur: PropTypes.func,
    groupSku: PropTypes.string,
    productSku: PropTypes.string
};

ByoOnProductTileHover.defaultProps = {
    showClose: false,
    actionButtonHandler: () => { },
    keyBoardEnter: false,
    keyBoardFocus: false,
    onProductBlur: () => { },
    groupSku: '',
    productSku: ''
};

export default connect(mapStateToProps)(ByoOnProductTileHover);
