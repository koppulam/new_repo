// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import MediaQuery from 'react-responsive';
import { get } from 'object-path';
import classNames from 'classnames';

// Service
import { getRichRel, getSkuData } from 'services';

// Components
import ProductTile from 'components/containers/ProductTile';

import MarketingTile from 'components/common/MarketingTile';

import ContentTile from 'components/common/ContentTile';

import { formatStringForTracking } from 'lib/utils/analytics-util';

import { transformSkuCatData, getReorderedProducts } from 'lib/utils/format-data';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

import styleVariables from 'lib/utils/breakpoints';
import { toggle } from 'actions/InterceptorActions';
// import './index.scss';

/**
 * Circle Carousel Component
 */
class CircleCarousel extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.aem[this.props.config],
            products: [],
            heading: '',
            tabIndexArr: [0, 0, 0, 0, 0]
        };
        this.contentEl = React.createRef();
        this.endDivRef = React.createRef();
        this.startDivRef = React.createRef();
    }

    /**
     * Lifcycle hook for
     * @returns {void}
     */
    async componentDidMount() {
        this.props.dispatch(toggle(false));
        const skuRequest = JSON.parse(JSON.stringify(this.props.aem.skuServiceConfig));

        skuRequest.payload = this.state.config.skuConfig;
        const richRequest = {
            url: this.state.config.richrelevance.richURL,
            queryParams: this.state.config.richrelevance.queryParams,
            noClientHeaders: this.state.config.richrelevance.noClientHeaders
        };
        const config = {
            skuRequest,
            richRequest
        };

        this.fetchData(config);
    }

    /**
     * Lifcycle hook for
     * @returns {void}
     */
    componentDidUpdate() {
        this.props.dispatch(toggle(true));
    }

    /**
     * Handles key down event for start div of component
     * @param {object} event The config object of SKU and catgeories requests
     * @returns {object} html instance
     */
    onStartDivKeyDown = (event) => {
        if (event.keyCode === 9 && !event.shiftKey) {
            this.enableTabIndex();
            this.contentEl.current.focus();
        }
    }

    /**
     * @description Form an array based on marketing tile and sku data based on available slot.
     * @param {array} prodTiles Transformed SKU Response from service call
     * @returns {array} Array of Products
     */
    setCarouselTiles = (prodTiles) => {
        let updatedResponse = [];
        const mTiles = this.state.config.marketingTiles || [];
        const slots = get(this.state, 'config.noOfSlots', 6);
        const arraySize = slots - mTiles.length;

        // prodtiles are returned from RR. Always mTiles takes precedence.
        // arraySize = Deduct mTiles from no.of slots.
        // Adjust prodTiles to arraySize if its greater than available slots after mTiles filled in.
        if (prodTiles.length >= arraySize) {
            updatedResponse = prodTiles.slice(0, arraySize);
        } else {
            updatedResponse = prodTiles;
        }

        // Push mTiles into updatedResponse at their respective slots
        if (mTiles.length > 0) {
            mTiles.forEach(item => {
                updatedResponse.splice(item.slot - 1, 0, item);
            });
        }
        this.setState({ products: updatedResponse.length > 0 ? updatedResponse : mTiles });
    }

    /**
     * @description Get header text information from rich relevance response
     * @param {array} richData Response returned from richRelevance
     * @returns {void}
     */
    setHeaderText = (richData) => {
        const heading = get(richData, ['placements', '0', 'strategyMessage']);

        this.setState({ heading });
    }

    /**
     * @description Returns Marketing tile or Product tile conditionally based on availability of slot.
     * @param {object} productItem The product item from the state.
     * @param {number} position of the tile.
     * @param {number} tabIndex of the tile.
     * @param {number} refName of the tile.
     * @returns {object} React.Component
     */
    getTile = (productItem, position, tabIndex, refName) => {
        return (
            <span
                data-interaction-context=""
                data-interaction-type={AnalyticsConstants.RICHRELEVANCE}
                data-interaction-name={formatStringForTracking(productItem.name)}
                data-rranalytics={productItem.clickURL}
                role="button"
                tabIndex={-1}
                ref={el => { this[refName] = el; }}
                data-index={position}
            >
                {
                    productItem.slot ?
                        <MarketingTile
                            defaultSrc={productItem.defaultSrc}
                            altText={productItem.altText}
                            ctaLink={productItem.link_url}
                            ctaUrl={productItem.ctaUrl}
                            ctaText={productItem.ctaText}
                            ctaTarget={productItem.ctaTarget}
                            imageTarget={productItem.imageTarget}
                            isLazyLoad={this.props.aem.richRelevanceMarketCarouselLazyLoad}
                            tabIndexVal={tabIndex}
                        />
                        :
                        <ProductTile
                            name={productItem.name}
                            image={productItem.image}
                            isNew={productItem.isNew}
                            sku={productItem.selectedSku ? productItem.selectedSku : productItem.sku}
                            productSku={productItem.selectedSku ? productItem.selectedSku : productItem.sku}
                            isGroup={productItem.isGroup}
                            groupSku={productItem.selectedSku ? productItem.sku : ''}
                            price={productItem.price}
                            url={productItem.url}
                            isLazyLoad={this.props.aem.richRelevanceMarketCarouselLazyLoad}
                            position={position}
                            tabIndexVal={tabIndex}
                        />
                }
            </span>
        );
    }

    /**
     * @description Get carousal slides with product tiles based on slot existance in the item.
     * @param {*} products products form state
     * @returns {void}
     */
    getSlides = (products) => {
        const slides = [];

        products.forEach((item, index) => {
            if (!item.slot) {
                slides.push(
                    <ProductTile
                        key={index.toString()}
                        name={item.name}
                        image={item.image}
                        isNew={item.isNew}
                        sku={item.selectedSku ? item.selectedSku : item.sku}
                        productSku={item.selectedSku ? item.selectedSku : item.sku}
                        price={item.price}
                        url={item.url}
                        isGroup={item.isGroup}
                        groupSku={item.selectedSku ? item.sku : ''}
                        position={index.toString()}
                        isLazyLoad={this.props.aem.richRelevanceMarketCarouselLazyLoad}
                    />
                );
            }
            return null;
        });
        return slides;
    }

    /**
     * Handles key down event for content tile
     * @param {object} event javascript event object
     * @returns {object} html instance
     */
    handleContentTileKeydown = (event) => {
        if (event.keyCode === 9 && event.shiftKey) {
            this.resetTabIndexArr();
            this.startDivRef.current.focus();
        }
    }

    /**
     * @description Handles key down event for last element of first tile
     * @param {number} event javascript event object
     * @returns {object} React.Component
     */
    handleTileKeydown = (event) => {
        if (event.keyCode === 9 && !event.shiftKey) {
            this.endDivRef.current.focus();
            this.resetTabIndexArr();
        }
    }

    /**
     * @description Handles key down event for last div of component
     * @param {number} event javascript event object
     * @returns {object} React.Component
     */
    handleLastDivKeydown = (event) => {
        if (event.keyCode === 9 && event.shiftKey) {
            event.preventDefault();
            this.enableTabIndex();
            this.lastFocusableElem.focus();
        }
    }

    /**
     * @description Rsolves data for the provided component config
     * @param {object} config The config object of SKU and catgeories requests
     * @returns {void}
     */
    fetchData = (config) => {
        const skus = [];

        getRichRel(config).then(res => {
            const response = (res && res.res) || {};
            const placements = get(response, ['placements', '0']);

            if (placements) {
                placements.recommendedProducts.forEach(product => {
                    skus.push(product.id);
                });
            }
            config.skuRequest.payload.Sku = skus;
            getSkuData(config.skuRequest).then(data => {
                const skuData = { skuResponse: data, rrProducts: placements.recommendedProducts };

                let products = transformSkuCatData(skuData);

                products = getReorderedProducts(get(res, 'skuOrder', []), products);
                this.setCarouselTiles(products);
                this.setHeaderText(response);
            }).catch(err => {

            });
        }).catch(err => {

        });
    }

    /**
     * enable tab index array with values
     * @returns {object} html instance
     */
    enableTabIndex = () => {
        const tabIndexArr = [0, 1, 2, 3, 4];

        this.setState({ tabIndexArr });
    }

    /**
     * fill tab index array with 0s
     * @returns {object} html instance
     */
    resetTabIndexArr = () => {
        const tabIndexArr = [0, 0, 0, 0, 0];

        this.setState({ tabIndexArr });
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const settings = {
            dots: false,
            infinite: false,
            speed: 600,
            slidesToShow: 3,
            slidesToScroll: 3,
            swipeToSlide: false,
            initialSlide: 0,
            tileType: 'product-carousel',
            useTransform: false,
            accessibility: false,
            responsive: [
                {
                    breakpoint: parseInt(styleVariables.mobileBreakPoint, 10),
                    settings: {
                        slidesToShow: !get(this.state, 'config.mobileSlidesShowCount', 1.1) ? 1.1 : get(this.state, 'config.mobileSlidesShowCount', 1.1),
                        slidesToScroll: !get(this.state, 'config.mobileSlidesScrollCount', 1) ? 1 : get(this.state, 'config.mobileSlidesScrollCount', 1),
                        arrows: get(this.state, 'config.mobileShowArrows', false),
                        centerMode: false,
                        centerPadding: 0,
                        finalPadding: 10,
                        swipeToSlide: false,
                        tileType: 'product-carousel'
                    }
                }
            ]
        };
        const renderComponent = this.state.products.length >= this.state.config.noOfSlots;

        return (
            renderComponent ?
                <article
                    className="circle-component"
                    {...(this.props.parallax ?
                        {
                            'data-aos': 'fade-up'
                        }
                        : {})}
                >
                    {/* <div
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                        tabIndex="0"
                        role="button"
                        onKeyDown={this.onStartDivKeyDown}
                        ref={this.startDivRef}
                    /> */}
                    <MediaQuery query={styleVariables.desktopMin}>
                        {
                            <div className="circle-component__row">
                                <div
                                    className="circle-component__row_col col-left"
                                    {...(this.props.parallax ?
                                        {
                                            'data-aos': 'fade-up', 'data-aos-delay': '500'
                                        }
                                        : {})}
                                >
                                    {this.getTile(this.state.products[0], 1, this.state.tabIndexArr[2], 'tileEl1')}
                                    {this.getTile(this.state.products[5], 6, this.state.tabIndexArr[4], 'tileEl6')}
                                </div>
                                <div
                                    className="circle-component__row_col col-center"
                                    {...(this.props.parallax ?
                                        {
                                            'data-aos': 'fade-up'
                                        }
                                        : {})}
                                >
                                    {this.getTile(this.state.products[1], 2, this.state.tabIndexArr[2])}
                                    <div
                                        className={
                                            classNames('circle-component-content', {
                                                'circle-component-content-headline': !this.state.config.content.description
                                            })
                                        }
                                        ref={this.contentEl}
                                    // onKeyDown={this.handleContentTileKeydown}
                                    >
                                        <ContentTile
                                            heading={this.state.heading}
                                            description={this.state.config.content.description}
                                            ctaLink={this.state.config.content.ctaUrl}
                                            ctaTarget={this.state.config.content.ctaTarget}
                                            ctaText={this.state.config.content.ctaText}
                                            tabIndexVal={this.state.tabIndexArr[1]}
                                        />
                                    </div>
                                    {this.getTile(this.state.products[4], 5, this.state.tabIndexArr[3])}
                                </div>
                                <div
                                    className="circle-component__row_col col-right"
                                    {...(this.props.parallax ?
                                        {
                                            'data-aos': 'fade-up', 'data-aos-delay': '500'
                                        }
                                        : {})}
                                >
                                    {this.getTile(this.state.products[2], 3, this.state.tabIndexArr[2])}
                                    {this.getTile(this.state.products[3], 4, this.state.tabIndexArr[2])}
                                </div>
                            </div>
                        }
                    </MediaQuery>
                    {/* <div
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                        tabIndex="0"
                        role="button"
                        ref={this.endDivRef}
                        onKeyDown={this.handleLastDivKeydown}
                    /> */}
                    <MediaQuery query={styleVariables.tabletMax}>
                        <ContentTile
                            heading={this.state.heading}
                            description={this.state.config.content.description}
                            ctaLink={this.state.config.content.ctaUrl}
                            ctaTarget={this.state.config.content.ctaTarget}
                            ctaText={this.state.config.content.ctaText}
                        />
                        <Slider className="circle-carousel__body_holder" {...settings}>
                            {this.getSlides(this.state.products)}
                        </Slider>
                    </MediaQuery>
                </article> : null
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem
    };
};

CircleCarousel.propTypes = {
    parallax: PropTypes.any,
    config: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    aem: PropTypes.any.isRequired
};

CircleCarousel.defaultProps = {
    parallax: false
};

export default connect(mapStateToProps)(CircleCarousel);
