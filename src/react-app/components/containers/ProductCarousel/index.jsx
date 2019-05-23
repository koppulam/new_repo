// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import * as objectPath from 'object-path';
import { formatStringForTracking } from 'lib/utils/analytics-util';
import { getSkuData, getCatData, getRichRelData } from 'services';
import { transformSkuCatData, getReorderedProducts } from 'lib/utils/format-data';

// Components
import ProductTile from 'components/containers/ProductTile';
import SlickArrow from 'components/common/SlickArrows';

import PRODUCT_CONSTANTS from 'constants/ProductConstants';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

import styleVariables from 'lib/utils/breakpoints';
import { toggle } from 'actions/InterceptorActions';
// import './index.scss';

/**
 * Product Carousel Component
 */
class ProductCarousel extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.aem[this.props.config],
            products: [],
            recommendationsType: ''
        };
    }

    /**
     * Lifcycle hook for
     * @returns {void}
     */
    async componentDidMount() {
        this.props.dispatch(toggle(false));
        let config;
        let request;

        if (this.props.type === PRODUCT_CONSTANTS.TYPE.SKU) {
            request = JSON.parse(JSON.stringify(this.props.aem.skuServiceConfig));

            request.payload = this.state.config.skuConfig;
            config = {
                type: this.props.type,
                request
            };
        } else if (this.props.type === PRODUCT_CONSTANTS.TYPE.CATEGORY) {
            request = JSON.parse(JSON.stringify(this.props.aem.categoryServiceConfig));

            request.payload = this.state.config.categoryConfig;
            config = {
                type: this.props.type,
                request
            };
        } else {
            const skuRequest = JSON.parse(JSON.stringify(this.props.aem.skuServiceConfig));

            const richRequest = {
                url: this.state.config.richURL,
                queryParams: this.state.config.queryParams,
                noClientHeaders: this.state.config.noClientHeaders
            };

            skuRequest.payload = this.state.config.skuConfig;
            config = {
                type: this.props.type,
                skuRequest,
                richRequest
            };
        }
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
     * image load handler
     * @returns {void}
     */
    onImageLoadHandler() {
        if (window.aos) {
            window.aos.refresh();
        }
    }

    /**
     * @description checkForLowInventory Filters the products with isLowInventory false
     * @param {object} productList response object from API/Rich Relevance
     * @returns {void}
     */
    checkForLowInventory = (productList) => {
        let updatedProds = [];

        updatedProds = productList.filter((item) => {
            return (item.isLowInventory === false);
        });

        return updatedProds;
    }

    /**
     * @description Rsolves data for the provided component config
     * @param {object} config The config object of SKU and catgeories requests
     * @returns {void}
     */
    fetchData = (config) => {
        if (config.type === PRODUCT_CONSTANTS.TYPE.SKU) {
            getSkuData(config.request).then(res => {
                let products = transformSkuCatData({ skuResponse: res });

                products = getReorderedProducts(objectPath.get(config, 'request.payload.Sku', []), products);
                products = this.checkForLowInventory(products);
                this.setState({
                    products,
                    recommendationsType: AnalyticsConstants.RECOMMENDATION_AUTHORED
                });
            }).catch(err => {

            });
        } else if (config.type === PRODUCT_CONSTANTS.TYPE.CATEGORY) {
            getCatData(config.request).then(res => {
                let products = transformSkuCatData({ catResponse: res });

                products = this.checkForLowInventory(products);
                this.setState({
                    products,
                    recommendationsType: AnalyticsConstants.RECOMMENDATION_TARGET
                });
            }).catch(err => {

            });
        } else {
            getRichRelData(config).then(res => {
                let products = transformSkuCatData(res);

                products = getReorderedProducts(objectPath.get(res, 'skuOrder', []), products);
                products = this.checkForLowInventory(products);

                this.setState({
                    products,
                    config: { ...this.state.config, title: res.title || this.state.config.title },
                    recommendationsType: AnalyticsConstants.RICHRELEVANCE
                });
            }).catch(err => {

            });
        }
    }

    /**
     * @description checkForLowInventory Filters the products with isLowInventory false
     * @param {object} productList response object from API/Rich Relevance
     * @returns {void}
     */
    checkForLowInventory = (productList) => {
        let updatedProds = [];

        updatedProds = productList.filter((item) => {
            return (item.isLowInventory === false);
        });
        return updatedProds;
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const settings = {
            dots: false,
            infinite: false,
            variableWidth: false,
            speed: 600,
            slidesToShow: 4,
            slidesToScroll: 4,
            swipeToSlide: false,
            initialSlide: 0,
            useTransform: false,
            tileType: 'product-carousel',
            nextArrow: <SlickArrow
                isleftArrow={false}
            />,
            prevArrow: <SlickArrow
                isleftArrow
            />,
            accessibility: false,
            responsive: [
                {
                    breakpoint: parseInt(styleVariables.tabletBreakPoint, 10),
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        centerMode: false,
                        tileType: 'product-carousel'
                    }
                },
                {
                    breakpoint: parseInt(styleVariables.mobileBreakPoint, 10),
                    settings: {
                        slidesToShow: !objectPath.get(this.state, 'config.mobileSlidesShowCount', 1.1) ? 1.1 : objectPath.get(this.state, 'config.mobileSlidesShowCount', 1.1),
                        slidesToScroll: !objectPath.get(this.state, 'config.mobileSlidesScrollCount', 1) ? 1 : objectPath.get(this.state, 'config.mobileSlidesScrollCount', 1),
                        arrows: objectPath.get(this.state, 'config.mobileShowArrows', false),
                        centerMode: false,
                        finalPadding: 10,
                        tileType: 'product-carousel'
                    }
                }
            ]
        };

        return (
            Object.keys(this.state.products).length > 0 ?
                <article
                    className="product-carousel container-centered"
                    {...(this.props.parallax ?
                        { 'data-aos': 'fade-up' }
                        : {})}
                >
                    <h2 className="product-carousel__heading">{this.state.config.title}</h2>
                    <div className="product-carousel__body">
                        <div className="product-carousel__body_bg" />
                        <Slider className="product-carousel__body_holder" {...settings}>
                            {
                                this.state.products.map((item, index) => {
                                    return (
                                        <div
                                            key={index.toString()}
                                            data-interaction-context=""
                                            data-interaction-type={this.state.recommendationsType}
                                            data-interaction-name={formatStringForTracking(item.name)}
                                            data-rranalytics={item.clickURL}
                                        >
                                            <ProductTile
                                                name={item.name}
                                                image={item.image}
                                                isNew={item.isNew}
                                                sku={item.selectedSku ? item.selectedSku : item.sku}
                                                productSku={item.selectedSku ? item.selectedSku : item.sku}
                                                price={item.price}
                                                url={item.url}
                                                isGroup={item.isGroup}
                                                groupSku={item.selectedSku ? item.sku : ''}
                                                isIRExperience={item.isIRExperience}
                                                onLoadHandler={this.onImageLoadHandler}
                                                position={index.toString()}
                                            />
                                        </div>
                                    );
                                })
                            }
                        </Slider>
                    </div>
                </article> : null
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem
    };
};

ProductCarousel.propTypes = {
    parallax: PropTypes.any,
    config: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    aem: PropTypes.any.isRequired
};

ProductCarousel.defaultProps = {
    parallax: false
};

export default connect(mapStateToProps)(ProductCarousel);
