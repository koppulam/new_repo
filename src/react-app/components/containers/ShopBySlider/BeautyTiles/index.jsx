// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import MediaQuery from 'react-responsive';
import * as objectPath from 'object-path';
import find from 'lodash/find';

import ProductTile from 'components/containers/ProductTile';
import ContentTile from 'components/common/ContentTile';
import Picture from 'components/common/Picture';
import ShopBySlider from 'components/containers/ShopBySlider/ShopBySlider';
import arrangeItems from 'lib/utils/ie-grid-pollyfill';
import { transformSkuCatData, gridColumns } from 'lib/utils/format-data';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

// Constants
import PRODUCT_CONSTANTS from 'constants/ProductConstants';

// Services
import { getSkuData, getCatData } from 'services';

// Styles
import styleVariables from 'lib/utils/breakpoints';
// import './index.scss';

/**
 * BeautyTiles component
 */
class BeautyTiles extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        const config = this.props.aem[this.props.config];
        const content = objectPath.get(config, 'content', {});

        this.state = {
            config,
            content,
            currentClassificationIndex: 0,
            currentSubClassificationIndex: 0,
            currentClassificationObject: objectPath.get(config, 'content.0', {}),
            currentSubClassificationObject: objectPath.get(config, 'content.0.subClassification.0'),
            defaultSubClassification: false,
            showReadMore: false
        };
    }

    /**
     * @returns {void}
     */
    componentDidMount() {
        this.loadDefaultSubclassifcation(0);
    }

    /**
     * Show more products
     * @returns {void}
     */
    showMoreProducts = () => {
        const { currentSubClassificationObject } = this.state;

        if (currentSubClassificationObject.products.length > 5) {
            currentSubClassificationObject.displayableProducts = currentSubClassificationObject.products;
            currentSubClassificationObject.showMoreLink = false;
            currentSubClassificationObject.showFewerLink = true;
            this.setState({
                ...this.state,
                currentSubClassificationObject
            });
        }
    }

    /**
     * Show more products
     * @returns {void}
     */
    showFewerProducts = () => {
        const { currentSubClassificationObject } = this.state;

        currentSubClassificationObject.displayableProducts = currentSubClassificationObject.products.slice(0, 6);
        currentSubClassificationObject.showMoreLink = true;
        currentSubClassificationObject.showFewerLink = false;
        this.setState({
            ...this.state,
            currentSubClassificationObject
        });
    }

    /**
     * @param {number} classificationIndex classificationIndex
     * @returns {void}
     */
    loadDefaultSubclassifcation = (classificationIndex) => {
        const firstClassification = this.state.content[classificationIndex];
        const defaultSubClassificationObject = firstClassification.subClassification.find(subClassification => {
            return subClassification.isDefault;
        });
        const defaultSubClassification = firstClassification.subClassification.indexOf(defaultSubClassificationObject);

        if (defaultSubClassification !== -1) {
            this.setState({
                ...this.state,
                currentSubClassificationObject: this.state.content[classificationIndex].subClassification[defaultSubClassification]
            }, () => {
                this.loadSubclassificationProducts(classificationIndex, defaultSubClassification);
            });
        } else {
            this.setState({
                ...this.state,
                currentSubClassificationObject: this.state.content[classificationIndex].subClassification[0]
            }, () => {
                this.loadSubclassificationProducts(classificationIndex, 0);
            });
        }
    }

    /**
     * Subclassification Selected
     * @param {number} classificationIndex classificationIndex
     * @param {number} subClassificationIndex subClassificationIndex
     * @returns {void}
    */
    subClassificationSelected = (classificationIndex, subClassificationIndex) => {
        this.setState({
            ...this.state,
            currentClassificationIndex: classificationIndex,
            currentSubClassificationIndex: subClassificationIndex,
            currentClassificationObject: this.state.content[classificationIndex],
            currentSubClassificationObject: this.state.content[classificationIndex].subClassification[subClassificationIndex]
        }, () => {
            const { content } = this.state;

            if (!content[classificationIndex].subClassification[subClassificationIndex].products) {
                this.loadSubclassificationProducts(classificationIndex, subClassificationIndex);
            }
        });
    }

    /**
     * classification Selected
     * @param {number} classificationIndex classificationIndex
     * @returns {void}
    */
    classificationSelected = (classificationIndex) => {
        this.setState({
            ...this.state,
            currentClassificationIndex: classificationIndex,
            currentClassificationObject: this.state.content[classificationIndex]
        }, () => {
            this.loadDefaultSubclassifcation(classificationIndex);
        });
    }

    /**
     * Load subclassification products
     * @param {number} classificationIndex classificationIndex
     * @param {number} subClassificationIndex subClassificationIndex
     * @returns {void}
    */
    loadSubclassificationProducts(classificationIndex, subClassificationIndex) {
        let requstObj;
        let serviceFunction;
        let responseObjKey;
        const subClassification = this.state.currentSubClassificationObject;

        if (subClassification.displayType.toLowerCase() === PRODUCT_CONSTANTS.TYPE.SKU.toLowerCase()) {
            const { skuConfig } = subClassification;
            const skuList = [];

            // original sku list
            skuConfig.skuList = skuConfig.Sku;

            skuConfig.Sku.forEach((sku) => {
                if (sku.skuId) {
                    skuList.push(sku.skuId);
                }
                if (sku.alternateSkuId) {
                    skuList.push(sku.alternateSkuId);
                }
            });
            skuConfig.Sku = skuList;

            requstObj = JSON.parse(JSON.stringify(this.props.aem.skuServiceConfig));
            requstObj.payload = skuConfig;
            serviceFunction = getSkuData;
            responseObjKey = 'skuResponse';
        } else {
            requstObj = JSON.parse(JSON.stringify(this.props.aem.categoryServiceConfig));
            requstObj.payload = subClassification.categoryConfig;
            serviceFunction = getCatData;
            responseObjKey = 'catResponse';
        }
        const config = {
            type: subClassification.displayType,
            requstObj
        };

        serviceFunction(config.requstObj).then(res => {
            // Transforming data
            const transformObj = {};

            transformObj[responseObjKey] = res;
            let products = transformSkuCatData(transformObj);

            const { skuConfig } = subClassification;

            if (skuConfig) {
                const productsList = [];

                skuConfig.skuList.forEach((sku, skuIndex) => {
                    let skuFound = this.filterProducts(products, sku.skuId);

                    if (!skuFound && sku.alternateSkuId) {
                        skuFound = this.filterProducts(products, sku.alternateSkuId);
                    }

                    if (!skuFound) {
                        if (skuIndex !== 0 && skuConfig.skuList[skuIndex - 1] && skuConfig.skuList[skuIndex - 1].alternateSkuId) {
                            skuFound = this.filterProducts(products, skuConfig.skuList[skuIndex - 1].alternateSkuId);
                        }
                        if (!skuFound) {
                            if (skuIndex !== (skuConfig.skuList.length - 1) && skuConfig.skuList[skuIndex + 1] && skuConfig.skuList[skuIndex + 1].alternateSkuId) {
                                skuFound = this.filterProducts(products, skuConfig.skuList[skuIndex + 1].alternateSkuId);
                            }
                        }
                    }

                    if (skuFound) {
                        productsList.push(skuFound);
                    }
                });
                products = productsList;
            }

            products.map((product) => {
                product.layout = '1x1';
                return product;
            });

            const beautyTilePos = objectPath.get(subClassification, 'beautyTile.beautyTilePos', 1) - 1;
            let beautyTileObj = objectPath.get(subClassification, 'beautyTile', {});

            beautyTileObj.beautyTile = true;
            beautyTileObj.layout = '2x2';

            const productsToShow = objectPath.get(subClassification, 'productsToShow', 5);

            products = products.slice(0, productsToShow);

            subClassification.showMoreLink = (products.length > 5);
            subClassification.showFewerLink = false;
            subClassification.showRedirectLink = (products.length <= 5 && subClassification.showMoreProductsDesktopFlag);
            subClassification.showRedirectLinkinMobile = subClassification.showMoreProductsMobileFlag;

            const numOfCols = gridColumns(styleVariables);

            products.unshift(beautyTileObj);

            const productItems = arrangeItems(products, 1, 1, true, numOfCols - 1);

            if (productItems) {
                products = productItems.items;
            }

            products = products.map((product) => {
                if (product.col && product.row) {
                    product.style = {
                        msGridColumn: product.col,
                        msGridRow: product.row
                    };
                }
                return product;
            });

            beautyTileObj = products.shift();

            products.splice(beautyTilePos <= 0 ? 0 : beautyTilePos, 0, beautyTileObj);

            subClassification.products = products;

            if (beautyTilePos <= 5) {
                subClassification.displayableProducts = products.slice(0, 6);
            } else {
                subClassification.displayableProducts = products.slice(0, 5);
            }

            const { content } = this.state;

            content[classificationIndex].subClassification[subClassificationIndex] = subClassification;

            this.setState(
                {
                    ...this.state,
                    content,
                    currentSubClassificationObject: subClassification,
                    currentClassificationIndex: classificationIndex,
                    currentSubClassificationIndex: subClassificationIndex,
                    currentClassificationObject: this.state.content[classificationIndex]
                }
            );
        }).catch(err => {
        });
    }

    /**
     * @param {Array} products array
     * @param {number} sku sku
     * @returns {product} object
     */
    filterProducts(products, sku) {
        return find(products, (product) => {
            return (product.sku && sku.toString() === product.sku.toString() && product.isLowInventory === false);
        });
    }

    /**
     * Lifcycle hook for
     * @returns {void}
     */
    render() {
        const currentSubClassificationObject = objectPath.get(this.state, 'currentSubClassificationObject', {});
        const currentProducts = objectPath.get(currentSubClassificationObject, 'products', []);
        const displayableProducts = objectPath.get(currentSubClassificationObject, 'displayableProducts', []);
        const paddingBottom = objectPath.get(currentSubClassificationObject, 'paddingBottom', 'padding-bottom-56');
        const containerClass = `beauty-tile container ${paddingBottom}`;

        const settings = {
            dots: false,
            infinite: false,
            initialSlide: 0,
            arrows: false,
            centerMode: false,
            useTransform: false,
            swipeToSlide: false,
            variableWidth: false,
            responsive: [
                {
                    breakpoint: parseInt(styleVariables.tabletBreakPoint, 10),
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        variableWidth: false
                    }
                },
                {
                    breakpoint: parseInt(styleVariables.mobileBreakPoint, 10),
                    settings: {
                        slidesToShow: 1.1,
                        slidesToScroll: 1,
                        variableWidth: false
                    }
                }
            ]
        };

        return (
            <article
                className={containerClass}
            >
                {(currentSubClassificationObject && currentSubClassificationObject.beautyTile) &&
                    <div>
                        <MediaQuery query={styleVariables.desktopAndAbove}>
                            <div className="beauty-tile__main-container">
                                <div className="beauty-tile__right">
                                    <ShopBySlider
                                        config={this.props.config}
                                        subClassificationSelected={this.subClassificationSelected}
                                        classificationSelected={this.classificationSelected}
                                    />
                                </div>

                                <div className="beauty-tile__left">
                                    <div className="layout_2x2 beauty-tile__beauty-tile" style={currentSubClassificationObject.beautyTile.style}>
                                        <a href={currentSubClassificationObject.beautyTile.tileUrl} target={currentSubClassificationObject.beautyTile.ctaTarget}>
                                            <ContentTile
                                                heading={currentSubClassificationObject.beautyTile.title}
                                                description={currentSubClassificationObject.beautyTile.description}
                                                ctaLink={currentSubClassificationObject.beautyTile.tileUrl}
                                                ctaTarget={currentSubClassificationObject.beautyTile.ctaTarget}
                                                ctaText={currentSubClassificationObject.beautyTile.ctaText}
                                                textColor={currentSubClassificationObject.beautyTile.colorStyle}
                                            />
                                            {
                                                currentSubClassificationObject.beautyTile
                                                &&
                                                <Picture
                                                    customClass="beauty-tile__beauty-tile-img"
                                                    sources={currentSubClassificationObject.beautyTile.sources}
                                                    defaultSrc={currentSubClassificationObject.beautyTile.defaultSrc}
                                                    altText={currentSubClassificationObject.beautyTile.altText}
                                                    isLazyLoad={currentSubClassificationObject.beautyTile.isLazyLoad}
                                                />
                                            }
                                        </a>
                                    </div>
                                    {
                                        displayableProducts && displayableProducts.length > 0 &&
                                        displayableProducts.map((productItem, index) => {
                                            return (
                                                !productItem.beautyTile &&
                                                <div
                                                    className="layout_1x1"
                                                    style={productItem.style}
                                                    data-sku={productItem.selectedSku ? productItem.selectedSku : productItem.sku}
                                                    data-grid-position={index + 1}
                                                    data-product-item-master={productItem.itemMaster}
                                                    data-grid-type={productItem.isNew ? AnalyticsConstants.INTERACTION_NEW : AnalyticsConstants.INTERACTION_STANDARD}
                                                    data-product-sku={productItem.productSku ? productItem.productSku : productItem.sku}
                                                    data-product-group-sku={productItem.isGroup ? productItem.sku : ''}
                                                >
                                                    <ProductTile
                                                        name={productItem.name}
                                                        image={productItem.image}
                                                        isNew={productItem.isNew}
                                                        sku={productItem.selectedSku ? productItem.selectedSku : productItem.sku}
                                                        productSku={productItem.selectedSku ? productItem.selectedSku : productItem.sku}
                                                        price={productItem.price}
                                                        url={productItem.url}
                                                        isGroup={productItem.isGroup}
                                                        isLazyLoad={false}
                                                        groupSku={productItem.isGroup ? productItem.sku : ''}
                                                        position={index.toString()}
                                                    />
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                            <div className="beauty-tile__read-more">
                                {
                                    currentSubClassificationObject.showMoreLink
                                    &&
                                    <button
                                        type="button"
                                        className="beauty-tile__read-more-btn cta"
                                        onClick={this.showMoreProducts}
                                        aria-label={currentSubClassificationObject.showMoreLinkLabel}
                                        data-interaction-context=""
                                        data-interaction-type={AnalyticsConstants.LOAD_MORE}
                                        data-interaction-name=""
                                    >
                                        <span className="cta-content">
                                            {currentSubClassificationObject.showMoreLinkLabel}
                                            <span
                                                className="icon-dropdown-down"
                                            />
                                        </span>
                                    </button>
                                }
                                {
                                    currentSubClassificationObject.showFewerLink
                                    &&
                                    <button
                                        type="button"
                                        className="beauty-tile__read-more-btn cta"
                                        onClick={this.showFewerProducts}
                                        aria-label={currentSubClassificationObject.showFewerLinkLabel}
                                    >
                                        <span className="cta-content">
                                            {currentSubClassificationObject.showFewerLinkLabel}
                                            <span
                                                className="icon-dropdown-up"
                                            />
                                        </span>
                                    </button>
                                }
                                {
                                    currentSubClassificationObject.showRedirectLink
                                    &&
                                    <a
                                        className="beauty-tile__read-more-btn cta"
                                        href={currentSubClassificationObject.showMoreLinkUrl}
                                        target={currentSubClassificationObject.showMoreTarget}
                                        data-interaction-context=""
                                        data-interaction-type={AnalyticsConstants.LOAD_MORE}
                                        data-interaction-name=""
                                    >
                                        <span className="cta-content">
                                            {currentSubClassificationObject.showMoreLinkLabel}
                                            <span
                                                className="icon-dropdown-right"
                                            />
                                        </span>
                                    </a>
                                }
                            </div>
                        </MediaQuery>
                        <MediaQuery query={styleVariables.tabletAndBelow}>
                            {
                                <div>
                                    <ShopBySlider
                                        config={this.props.config}
                                        subClassificationSelected={this.subClassificationSelected}
                                        classificationSelected={this.classificationSelected}
                                    />
                                    {
                                        currentProducts && currentProducts.length > 0 &&
                                        <Slider className="product-carousel__body_holder" {...settings}>
                                            {
                                                currentProducts.map((productItem, index) => {
                                                    return (
                                                        !productItem.beautyTile ?
                                                            <ProductTile
                                                                name={productItem.name}
                                                                image={productItem.image}
                                                                isNew={productItem.isNew}
                                                                sku={productItem.selectedSku ? productItem.selectedSku : productItem.sku}
                                                                productSku={productItem.selectedSku ? productItem.selectedSku : productItem.sku}
                                                                price={productItem.price}
                                                                url={productItem.url}
                                                                isGroup={productItem.isGroup}
                                                                isLazyLoad={false}
                                                                groupSku={productItem.isGroup ? productItem.sku : ''}
                                                                position={index.toString()}
                                                            />
                                                            :
                                                            <div>
                                                                <Picture
                                                                    sources={productItem.sources}
                                                                    defaultSrc={productItem.defaultSrc}
                                                                    altText={productItem.altText}
                                                                    isLazyLoad={productItem.isLazyLoad}
                                                                />
                                                                <ContentTile
                                                                    heading={productItem.title}
                                                                    description={productItem.description}
                                                                    ctaLink={productItem.tileUrl}
                                                                    ctaTarget={productItem.ctaTarget}
                                                                    ctaText={productItem.ctaText}
                                                                />
                                                            </div>
                                                    );
                                                })
                                            }
                                        </Slider>
                                    }
                                    {
                                        currentSubClassificationObject.showRedirectLinkinMobile
                                        &&
                                        <div
                                            className="beauty-tile__read-more"
                                        >
                                            <a
                                                className="beauty-tile__read-more-btn cta"
                                                href={currentSubClassificationObject.showMoreLinkUrl}
                                                target={currentSubClassificationObject.showMoreTarget}
                                                data-interaction-context=""
                                                data-interaction-type={AnalyticsConstants.LOAD_MORE}
                                                data-interaction-name=""
                                            >
                                                <span className="cta-content">
                                                    {currentSubClassificationObject.showMoreLinkLabel}
                                                    <MediaQuery query={styleVariables.desktopAndBelow}>
                                                        <span
                                                            className="icon-Right"
                                                        />
                                                    </MediaQuery>
                                                    <MediaQuery query={styleVariables.desktopAndAbove}>
                                                        <span
                                                            className="icon-dropdown-down"
                                                        />
                                                    </MediaQuery>
                                                </span>
                                            </a>
                                        </div>
                                    }
                                </div>
                            }
                        </MediaQuery>
                    </div>
                }
            </article>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        aem: state.aem
    };
};

BeautyTiles.propTypes = {
    aem: PropTypes.object.isRequired,
    config: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(BeautyTiles);
