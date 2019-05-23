// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import * as objectPath from 'object-path';

import { getSkuData, getCatData, getRichRelData } from 'services';
import { transformSkuCatData, getReorderedProducts } from 'lib/utils/format-data';

import { formatStringForTracking } from 'lib/utils/analytics-util';

// Components
import ProductTile from 'components/containers/ProductTile';

import PRODUCT_CONSTANTS from 'constants/ProductConstants';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

import styleVariables from 'lib/utils/breakpoints';
// import './index.scss';

/**
 * Most Popular Products Carousel Component
 */
class PopularProductCarousel extends React.Component {
    /**
  * @param {*} props super props
  * @returns {void}
  */
    constructor(props) {
        super(props);
        const typeId = this.props.aem[this.props.config].popularProductConfigType;

        this.state = {
            config: this.props.aem[this.props.config],
            type: this.props.aem[typeId],
            products: [],
            recommendationsType: ''
        };
    }

    /**
    * Lifcycle hook for
    * @returns {void}
    */
    async componentDidMount() {
        let config;
        let request;

        if (this.state.type === PRODUCT_CONSTANTS.TYPE.SKU) {
            request = JSON.parse(JSON.stringify(this.props.aem.skuServiceConfig));

            request.payload = this.state.config.skuConfig;
            config = {
                type: this.state.type,
                request
            };
        } else if (this.state.type === PRODUCT_CONSTANTS.TYPE.CATEGORY) {
            request = JSON.parse(JSON.stringify(this.props.aem.categoryServiceConfig));

            request.payload = this.state.config.categoryConfig;
            config = {
                type: this.state.type,
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
                type: this.state.type,
                skuRequest,
                richRequest
            };
        }
        this.fetchData(config);
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
     * @returns {object} Element
     */
    render() {
        const settings = {
            dots: false,
            infinite: false,
            speed: 600,
            slidesToShow: 4,
            slidesToScroll: 4,
            swipeToSlide: false,
            initialSlide: 0,
            variableWidth: false,
            useTransform: false,
            tileType: 'product-carousel',
            accessibility: false,
            responsive: [
                {
                    breakpoint: parseInt(styleVariables.tabletBreakPoint, 10),
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        centerMode: false,
                        variableWidth: false,
                        tileType: 'product-carousel'
                    }
                },
                {
                    breakpoint: parseInt(styleVariables.mobileBreakPoint, 10),
                    settings: {
                        slidesToShow: 2.2,
                        slidesToScroll: 2,
                        centerMode: false,
                        arrows: false,
                        centerPadding: 0,
                        variableWidth: false,
                        tileType: 'product-carousel'
                    }
                }
            ]
        };

        return (
            <div>
                <article
                    className="most-popular-product-carousel"
                    {...(this.props.parallax ?
                        { 'data-aos': 'fade-up' }
                        : {})}
                >
                    <h3 className="most-popular-product-carousel__heading">{this.state.config.title}</h3>
                    <div className="most-popular-product-carousel__body">
                        <div className="most-popular-product-carousel__body_bg" />
                        {
                            Object.keys(this.state.products).length > 0 &&
                            <Slider className="most-popular-product-carousel__body_holder" {...settings}>
                                {
                                    this.state.products.map((item, index) => {
                                        return (
                                            <div
                                                data-interaction-context=""
                                                data-interaction-type={this.state.recommendationsType}
                                                data-interaction-name={formatStringForTracking(item.name)}
                                            >
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
                                                    isIRExperience={item.isIRExperience}
                                                    position={index.toString()}
                                                />
                                            </div>
                                        );
                                    })
                                }
                            </Slider>}
                    </div>
                </article>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        aem: state.aem
    };
};

PopularProductCarousel.propTypes = {
    aem: PropTypes.object.isRequired,
    config: PropTypes.string.isRequired,
    parallax: PropTypes.any
};

PopularProductCarousel.defaultProps = {
    parallax: false
};

export default connect(mapStateToProps)(PopularProductCarousel);
