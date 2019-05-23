import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import MediaQuery from 'react-responsive';
import * as objectPath from 'object-path';
import classNames from 'classnames';
import arrangeItems from 'lib/utils/ie-grid-pollyfill';

// Services
import { getSkuData, getCatData } from 'services';

// Components
import ProductTile from 'components/containers/ProductTile';
import Picture from 'components/common/Picture';
import { transformSkuCatData, gridColumns, getReorderedProducts } from 'lib/utils/format-data';
import SlickArrow from 'components/common/SlickArrows';

// Constants
import PRODUCT_CONSTANTS from 'constants/ProductConstants';
import CONSTANTS from 'constants/HtmlCalloutConstants';

// Styles
import styleVariables from 'lib/utils/breakpoints';
// import './index.scss';

/**
 * Marketing product tiles Component
 */
class MarketingProductTiles extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.aem[this.props.config],
            products: [],
            displayableProducts: [],
            count: 0,
            marketingTileCount: 0,
            showMore: true
        };
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
     * @description onShowMore on clicking the showMore Button
     * @param {object} e Event
     * @returns {void}
     */
    onShowMore = (e) => {
        e.preventDefault();
        this.updateProducts();
    }

    /**
     * @description Returns Marketing tile or Product tile conditionally based on availability of slot.
     * @param {object} productItem The product item from the state.
     * @param {number} position of the tile.
     * @returns {object} React.Component
     */
    getTile = (productItem, position) => {
        return productItem.sku ?
            <span
                className="col__full"
                data-interaction-context=""
                data-interaction-type={CONSTANTS.MARKETING_TILE}
                data-interaction-name={CONSTANTS.PRODUCT_TILE}
            >
                <ProductTile
                    name={productItem.name}
                    image={productItem.image}
                    isNew={productItem.isNew}
                    sku={productItem.selectedSku ? productItem.selectedSku : productItem.sku}
                    productSku={productItem.selectedSku ? productItem.selectedSku : productItem.sku}
                    price={productItem.price}
                    url={productItem.url}
                    isLazyLoad={false}
                    isGroup={productItem.isGroup}
                    groupSku={productItem.selectedSku ? productItem.sku : ''}
                    isIRExperience={productItem.isIRExperience}
                    position={position}
                />
            </span>
            :
            <Picture
                sources={productItem.sources}
                defaultSrc={productItem.defaultSrc}
                altText={productItem.altText}
                isLazyLoad={!this.props.parallax ? productItem.isLazyLoad : false}
                customClass="marketing-tile-image"
            />;
    }

    /**
     * @description setDisplayableProducts
     * @param {object} newProds newProds tiles captured from the service
     * @returns {void}
     */
    setDisplayableProducts = (newProds) => {
        if (newProds && newProds.length > 0) {
            let displayableProducts = [...this.state.displayableProducts, ...newProds];
            const numOfCols = gridColumns(styleVariables);
            const processedItems = arrangeItems(displayableProducts, 1, 1, true, numOfCols);

            if (processedItems) {
                displayableProducts = processedItems.items;
            }
            this.setState({ displayableProducts });
        }
    }

    /**
     * @description Display product tiles if  isLowInventory Flag is false.
     * @param {object} productTiles products tiles captured from the service
     * @returns {void}
     */
    setProductsTiles = (productTiles) => {
        let products = productTiles.filter((item) => {
            return (item.isLowInventory === false);
        });
        const numOfCols = gridColumns(styleVariables);
        const processedItems = arrangeItems(products, 1, 1, true, numOfCols);

        if (processedItems) {
            products = processedItems.items;
        }

        this.setState({ products, displayableProducts: [] }, () => {
            this.updateProducts();
        });
    }

    /**
     * @description Set product tile and picture tiles based on response
     * @param {Array} productTiles productTiles captured from API response.
     * @returns {void}
     */
    setCarouselElements = (productTiles) => {
        const carouselItems = productTiles;
        const itemLen = carouselItems ? carouselItems.length : 0;
        const MKTiles = objectPath.get(this.state, 'config.marketingTiles', []);
        const prodTilesOpts = objectPath.get(this.state, 'config.productTilesConfig', {});
        const MKtilesLength = (MKTiles && MKTiles.length > 0);
        const prodTilesCount = objectPath.get(prodTilesOpts, 'totalProductTiles', 36);
        const itemsPerFirstRow = objectPath.get(prodTilesOpts, 'itemsPerFirstRow', 4);
        const itemPerRow = objectPath.get(prodTilesOpts, 'itemPerRow', 8);
        const mkTile1Pos = itemsPerFirstRow + itemPerRow + 2;
        const mkTile2Pos = itemsPerFirstRow + (3 * itemPerRow) + 1;
        const firstMkCheck = itemsPerFirstRow + (2 * itemPerRow);
        const secondMKCheck = firstMkCheck + (2 * itemPerRow);
        const secondMKTileExists = (itemLen >= secondMKCheck || itemLen >= (secondMKCheck - 2));
        const checkFirstTilePos = itemLen > mkTile1Pos;
        const checkSecTilePos = itemLen > mkTile2Pos;

        if (MKTiles && MKtilesLength) {
            // Set first marketing tile after displaying after 20 products(4 on intial load + 8(2)).
            if (itemLen >= firstMkCheck) {
                // Display at 12 position i.e., 4 + 8 + 2.
                if (MKTiles[0] && Object.keys(MKTiles[0]).length > 0 && checkFirstTilePos) {
                    carouselItems.splice(mkTile1Pos, 0, MKTiles[0]);
                }

                // Set second marketing total 36 products exists.(4 on intial load + 8(4)).
                if (itemLen >= prodTilesCount && checkSecTilePos && secondMKTileExists) {
                    // Display at 29 position i.e., 4 + 8(3)+ 1.
                    if (MKTiles[1] && Object.keys(MKTiles[1]).length > 0) {
                        carouselItems.splice(mkTile2Pos, 0, MKTiles[1]);
                    }
                }
            }
        }
        return carouselItems.map((item, index) => (
            this.getTile(item, index.toString())
        ));
    }

    /**
     * @description This function displays the products tiles.
     * @returns {array} React.component
     */
    displayProductTiles = () => {
        const tiles = [];

        this.state.displayableProducts.forEach((item, index) => {
            const gridLayout = objectPath.get(item, 'browseGridLayout', '2x2');
            const className = item.sku ? PRODUCT_CONSTANTS.BROWSE_GRID.PRODUCT_TILE_LAYOUT : PRODUCT_CONSTANTS.BROWSE_GRID.LAYOUT + gridLayout;

            let style;

            if (item.col && item.row) {
                style = {
                    msGridColumn: item.col,
                    msGridRow: item.row
                };
            }

            tiles.push(
                <div key={index.toString()} className={className} style={style}>
                    {this.getTile(item, index.toString())}
                </div>
            );
        });
        return tiles;
    }

    /**
     * @description Constructs the Products list to display.
     * @returns {void}
     */
    updateProducts = () => {
        this.setState({ count: this.state.count + 1 });
        const opts = objectPath.get(this.state, 'config.productTilesConfig', {});
        let start = this.state.displayableProducts.length;

        // Consider marketingtiles in displaying products
        start = this.state.marketingTileCount ? (start - this.state.marketingTileCount) : start;
        const itemPerRow = objectPath.get(opts, 'itemPerRow', 8);
        const itemsPerFirstRow = objectPath.get(opts, 'itemsPerFirstRow', 4);
        let end = start ? (start + itemPerRow) : itemsPerFirstRow;
        const MKtilesEndLength = this.state.marketingTileCount;
        const totalTiles = parseInt(objectPath.get(opts, 'totalProductTiles', 36), 10) + MKtilesEndLength;

        if (end > totalTiles) {
            end = totalTiles;
        }
        const newProds = this.state.products.slice(start, end);
        const MKTiles = objectPath.get(this.state, 'config.marketingTiles', []);
        const MKtilesLength = (MKTiles && MKTiles.length > 0);
        const evenCount = this.state.count > 0 && this.state.count % 2 === 0;
        const showMore = !(newProds.length < 8 && start > 0);
        const itemCheck = ((this.state.marketingTileCount) % 2 === 1) ? 6 : itemPerRow;
        const prodTilesReachBottom = newProds.length >= itemCheck;

        this.setState({ showMore });
        // On showmore click,and marketing tiles has been authored before the following check.
        if (evenCount && MKtilesLength && prodTilesReachBottom) {
            this.setState({ marketingTileCount: this.state.marketingTileCount + 1 }, () => {
                const mkTileCount = this.state.marketingTileCount;
                const mkTileIndex = this.state.config.marketingTiles[mkTileCount - 1];

                // If marketing tiles exists
                if (mkTileCount > 0 && mkTileIndex) {
                    if (mkTileCount % 2 === 1) {
                        // In case of 1st(Ex:Odd) Marketing tile include it on LEFT side.
                        newProds.splice(2, 0, mkTileIndex);
                    } else {
                        // In case of 2nd(Ex:Even) Marketing tile include it on RIGHT side.
                        newProds.unshift(mkTileIndex);
                    }
                }
                this.setDisplayableProducts(newProds);
            });
        } else {
            this.setDisplayableProducts(newProds);
        }
    }

    /**
     * @description Resolves data for the provided component config
     * @param {object} config The config object of SKU and catgeories requests
     * @returns {void}
     */
    fetchData = (config) => {
        if (config.type === PRODUCT_CONSTANTS.TYPE.SKU) {
            this.recommendationsType = 'recommendations:authored';

            getSkuData(config.skuRequest).then(res => {
                // Transforming SKU data
                let products = transformSkuCatData({ skuResponse: res });

                products = getReorderedProducts(objectPath.get(config, 'skuRequest.payload.Sku', []), products);
                this.setProductsTiles(products);
            }).catch(err => {

            });
        } else {
            this.recommendationsType = 'recommendations:target';

            getCatData(config.catRequest).then(res => {
                // Transforming Category Data
                const products = transformSkuCatData({ catResponse: res });

                this.setProductsTiles(products);
            }).catch(err => {

            });
        }
    }

    /**
     * Lifcycle hook for
     * @returns {void}
     */
    render() {
        const { desktopPaddingBottom, mobilePaddingBottom } = this.state.config;
        const prodTilesOpts = this.state.config.productTilesConfig;
        const productsData = objectPath.get(this.state, 'products', []);
        const prodTilesCount = objectPath.get(prodTilesOpts, 'totalProductTiles', 36);
        const productTiles = productsData.slice(0, prodTilesCount);
        const productsCheck = (productsData && productsData.length > 0);
        const productsFirstRow = (productsData && (productsData.length > prodTilesOpts.itemsPerFirstRow));
        const displayableProds = objectPath.get(this.state, 'displayableProducts', []);
        const prodTilesDiff = productsData.length - displayableProds.length;
        const displayableProdLen = (displayableProds.length < parseInt(prodTilesCount, 10));
        const displayableProdRows = (displayableProdLen && prodTilesDiff > 0);
        const ctaText = objectPath.get(this.state, 'config.ctaOptions.ctaText', 'Show more');
        const settings = {
            dots: false,
            infinite: false,
            speed: 600,
            slidesToShow: 2,
            slidesToScroll: 2,
            swipeToSlide: false,
            initialSlide: 0,
            useTransform: false,
            variableWidth: false,
            nextArrow: <SlickArrow isleftArrow={false} />,
            prevArrow: <SlickArrow isleftArrow />,
            accessibility: false,
            responsive: [
                {
                    breakpoint: parseInt(styleVariables.tabletBreakPoint, 10),
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        centerMode: false
                    }
                },
                {
                    breakpoint: parseInt(styleVariables.mobileBreakPoint, 10),
                    settings: {
                        slidesToShow: parseFloat(!objectPath.get(this.state, 'config.mobileSlidesShowCount', 1.1) ? 1.1 : objectPath.get(this.state, 'config.mobileSlidesShowCount', 1.1), 10),
                        slidesToScroll: parseInt(!objectPath.get(this.state, 'config.mobileSlidesScrollCount', 1) ? 1 : objectPath.get(this.state, 'config.mobileSlidesScrollCount', 1), 10),
                        arrows: objectPath.get(this.state, 'config.mobileShowArrows', false),
                        finalPadding: 10
                    }
                }
            ]
        };

        return (
            <article
                className={
                    classNames('marketing-product-tiles',
                        {
                            [`${desktopPaddingBottom}`]: desktopPaddingBottom,
                            [`${mobilePaddingBottom}`]: mobilePaddingBottom
                        })
                }
                data-interaction-context=""
                data-interaction-type="marketing-tile"
                data-interaction-name="product-tile"
                {...(this.props.parallax ?
                    { 'data-aos': 'fade-up' }
                    : {})}
            >
                <MediaQuery query={styleVariables.desktopAndAbove}>
                    <div
                        className="browse-grid"
                    >
                        {this.displayProductTiles()}
                    </div>
                    {(productsFirstRow && displayableProdRows && this.state.showMore) &&
                        <div className="marketing-product-tiles_show-more">
                            <a
                                className="cta"
                                href="/"
                                onClick={this.onShowMore}
                                tabIndex={0}
                                data-interaction-context=""
                                data-interaction-type={CONSTANTS.LOAD_MORE}
                                data-interaction-name=""
                            >
                                <span className="cta-content">
                                    <span className="cta-text" tabIndex={-1}>
                                        {ctaText}
                                    </span>
                                    <span className="icon-dropdown-right" />
                                </span>
                            </a>
                        </div>}
                </MediaQuery>
                <MediaQuery query={styleVariables.desktopAndBelow}>
                    <div className="product-carousel__body_holder">
                        {
                            productsCheck ?
                                <Slider {...settings}>
                                    {this.setCarouselElements(productTiles)}
                                </Slider> : null
                        }
                    </div>
                </MediaQuery>
            </article>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        productTiles: state.productTiles,
        aem: state.aem
    };
};


MarketingProductTiles.propTypes = {
    parallax: PropTypes.any,
    config: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    aem: PropTypes.any.isRequired
};

MarketingProductTiles.defaultProps = {
    parallax: false
};

export default connect(mapStateToProps)(MarketingProductTiles);
