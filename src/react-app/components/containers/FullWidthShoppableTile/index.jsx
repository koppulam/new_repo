import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import MediaQuery from 'react-responsive';
import * as objectPath from 'object-path';
import hsStickyUtil from 'lib/utils/hcstick-util';
import Waypoint from 'react-waypoint';

// Services
import { getSkuData, getCatData } from 'services';
import { transformSkuCatData, getReorderedProducts } from 'lib/utils/format-data';

// Components
import ProductTile from 'components/containers/ProductTile';
import TextWithImageMarketingCarousel from 'components/containers/TextWithImageMarketingCarousel';

// Constants
import PRODUCT_CONSTANTS from 'constants/ProductConstants';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

// Styles
import styleVariables from 'lib/utils/breakpoints';
// import './index.scss';

// const HcSticky = require('hc-sticky');

/**
 * FullWidthShoppableTile Component
 */
class FullWidthShoppableTile extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.aem[this.props.config],
            products: [],
            isAuthormode: objectPath.get(window, 'tiffany.isAuthormode', false),
            bottomOffset: NaN
        };
        this.container = React.createRef();
        this.tileContainer = React.createRef();
    }

    /**
     * @returns {void}
     */
    componentDidMount() {
        let config;

        if (this.props.type === PRODUCT_CONSTANTS.TYPE.SKU) {
            const skuRequest = JSON.parse(JSON.stringify(this.props.aem.skuServiceConfig));

            skuRequest.payload = this.state.config.skuConfig;

            config = {
                type: this.props.type,
                skuRequest
            };
        } else {
            const catRequest = JSON.parse(JSON.stringify(this.props.aem.categoryServiceConfig));

            catRequest.payload = this.state.config.categoryConfig;

            config = {
                type: this.props.type,
                catRequest
            };
        }
        this.fetchData(config);
    }

    /**
     * @description Returns Marketing tile or Product tile conditionally based on availability of slot.
     * @param {object} productItem The product item from the state.
     * @param {number} position of the tile.
     * @returns {object} React.Component
     */
    getTile = (productItem, position) => {
        return productItem.sku ?
            <ProductTile
                name={productItem.name}
                image={productItem.image}
                isNew={productItem.isNew}
                sku={productItem.selectedSku ? productItem.selectedSku : productItem.sku}
                productSku={productItem.selectedSku ? productItem.selectedSku : productItem.sku}
                groupSku={productItem.selectedSku ? productItem.sku : ''}
                price={productItem.price}
                url={productItem.url}
                isGroup={productItem.isGroup}
                isLazyLoad={false}
                isHoverable
                position={position}
                isFullWidthShoppableTile
            />
            : null;
    }

    /**
     * @description Display product tiles if isLowInventory is false.
     * @param {object} productTiles products tiles captured from the service
     * @returns {void}
     */
    setProductsTiles = (productTiles) => {
        const products = [];

        productTiles.forEach((item) => {
            if ((item.isLowInventory === false) && (products.length < 10)) {
                products.push(item);
            }
        });
        this.setState({ products });
    }

    /**
     * @description Resolves data for the provided component config
     * @param {object} config The config object of SKU and catgeories requests
     * @returns {void}
     */
    fetchData = (config) => {
        const stickySettings = {
            element: '.full-width-shoppable-component.hcStickyComponent',
            disableOnWidth: parseInt(styleVariables.tabletBreakPoint, 10)
        };

        if (config.type === PRODUCT_CONSTANTS.TYPE.SKU) {
            getSkuData(config.skuRequest).then(res => {
                // Transforming SKU data
                let products = transformSkuCatData({ skuResponse: res });

                products = getReorderedProducts(objectPath.get(config, 'skuRequest.payload.Sku', []), products);

                this.setProductsTiles(products);
                if (!this.state.isAuthormode) {
                    hsStickyUtil(stickySettings);
                }
            }).catch(err => {

            });
        } else {
            getCatData(config.catRequest).then(res => {
                // Transforming Category Data
                const products = transformSkuCatData({ catResponse: res });

                this.setProductsTiles(products);
                if (!this.state.isAuthormode) {
                    hsStickyUtil(stickySettings);
                }
            }).catch(err => {

            });
        }
    }

    /**
     * @description This function displays the products tiles.
     * @returns {array} React.component
     */
    displayProductTiles = () => {
        const tiles = [];

        this.state.products.forEach((item, index) => {
            tiles.push(
                <div
                    key={index.toString()}
                    className="shoppable-product-tile"
                    data-interaction-context=""
                    data-interaction-type={AnalyticsConstants.MARKETING_TILE}
                    data-interaction-name={AnalyticsConstants.PRODUCT_TILE}
                >
                    {this.getTile(item, index)}
                </div>
            );
        });

        return tiles;
    }

    /**
     * @description sticky behaviour handler
     * @param {object} e Event object
     * @returns {void}
     */
    handleWaypointEnter = (e) => {
        if (e.previousPosition && e.previousPosition === 'inside' && e.currentPosition === 'above') {
            // set the bottom stick styles
            this.imageRef.getWrappedInstance().setBottomStyles();
        } else if (e.previousPosition === 'above' && e.currentPosition === 'inside') {
            // remove the bottom stick styles and add the top styles
            this.imageRef.getWrappedInstance().setTopStyles();
        }
    }

    /**
     * @description Calculate height of sticky elements
     * @returns {number} stickyElementsHeight
     */
    stickyElementsHeightCalculator = () => {
        const collapseElements = ['.stick.header__nav-container', '.filters-component', '.selected-filters__container_list-item'];
        let stickyElementsHeight = 0;

        collapseElements.forEach((selector, index) => {
            const selectorElement = document.querySelector(selector);

            if (selectorElement) {
                stickyElementsHeight += selectorElement.offsetHeight;
            } else {
                stickyElementsHeight += 0;
            }
        });

        return stickyElementsHeight;
    }

    /**
     * Lifcycle hook for
     * @returns {void}
     */
    render() {
        const mKTilePosition = objectPath.get(this.state, 'config.marketingTilePosition', '');
        const textWithImg = objectPath.get(this.state, 'config.shoppableTextWithImageConfig', {});
        const productsData = objectPath.get(this.state, 'products', []);
        const productsCheck = (productsData && productsData.length > 0);
        const settings = {
            dots: false,
            infinite: false,
            variableWidth: false,
            speed: 600,
            slidesToShow: 2,
            slidesToScroll: 2,
            swipeToSlide: false,
            initialSlide: 0,
            useTransform: false,
            accessibility: false,
            responsive: [
                {
                    breakpoint: parseInt(styleVariables.tabletBreakPoint, 10),
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        arrows: true
                    }
                },
                {
                    breakpoint: parseInt(styleVariables.mobileBreakPoint, 10),
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        arrows: false
                    }
                }
            ]
        };

        return (
            <article className="full-width-shoppable-tile" ref={this.tileContainer}>
                <div className="full-width-shoppable-component">
                    <div className="full-width-shoppable-tile__horizontal-line" />
                    <div className="full-width-shoppable-tile__container">
                        {mKTilePosition && (mKTilePosition.toUpperCase() === 'LEFT') &&
                            <div className="full-width-shoppable-tile__container__tile">
                                <div className="left-element" ref={this.container}>
                                    {
                                        textWithImg &&
                                        <TextWithImageMarketingCarousel
                                            config={this.state.config.key ? this.state.config.key : textWithImg}
                                            handleWaypointEnter={this.handleWaypointEnter}
                                            setBottomWaypoint={height => { this.setState({ bottomOffset: height }); }}
                                            ref={element => { if (element) { this.imageRef = element; } }}
                                            makeLeftSticky
                                        />
                                    }
                                </div>
                            </div>
                        }
                        <div className="full-width-shoppable-tile__container__tile">
                            <div className="right-element">
                                <MediaQuery query={styleVariables.desktopAndAbove}>
                                    <div className="full-width-shoppable-tile__container__grid right-full-element">
                                        {this.displayProductTiles()}
                                    </div>
                                    {
                                        <Waypoint
                                            fireOnRapidScroll
                                            onEnter={this.handleWaypointEnter}
                                            onLeave={this.handleWaypointEnter}
                                            topOffset={`${this.state.bottomOffset}px`}
                                        />
                                    }
                                </MediaQuery>
                                <MediaQuery query={styleVariables.tabletAndBelow}>
                                    {
                                        productsCheck ?
                                            <Slider {...settings}>
                                                {
                                                    productsData.map((item, index) => (
                                                        <ProductTile
                                                            key={index.toString()}
                                                            name={item.name}
                                                            image={item.image}
                                                            isNew={item.isNew}
                                                            sku={item.selectedSku ? item.selectedSku : item.sku}
                                                            productSku={item.selectedSku ? item.selectedSku : item.sku}
                                                            groupSku={item.selectedSku ? item.sku : ''}
                                                            price={item.price}
                                                            url={item.url}
                                                            isGroup={item.isGroup}
                                                            isIRExperience={item.isIRExperience}
                                                            position={index.toString()}
                                                        />))
                                                }
                                            </Slider> : null
                                    }
                                </MediaQuery>
                            </div>
                        </div>
                        {mKTilePosition && (mKTilePosition.toUpperCase() === 'RIGHT') &&
                            <div className="full-width-shoppable-tile__container__tile">
                                <div className="left-element" ref={this.container}>
                                    <TextWithImageMarketingCarousel
                                        config={this.state.config.key ? this.state.config.key : textWithImg}
                                        handleWaypointEnter={this.handleWaypointEnter}
                                        setBottomWaypoint={height => { this.setState({ bottomOffset: height }); }}
                                        ref={element => { if (element) { this.imageRef = element; } }}
                                        makeLeftSticky
                                    />
                                </div>
                            </div>
                        }
                    </div>
                    <div className="full-width-shoppable-tile__horizontal-line" />
                </div>
            </article>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem
    };
};


FullWidthShoppableTile.propTypes = {
    config: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired
};

export default connect(mapStateToProps)(FullWidthShoppableTile);
