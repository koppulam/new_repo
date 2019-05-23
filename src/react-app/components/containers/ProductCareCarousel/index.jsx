// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import * as objectPath from 'object-path';

import { getSkuCatData, getRichRelData } from 'services';
import { transformSkuCatData, getReorderedProducts } from 'lib/utils/format-data';

import styleVariables from 'lib/utils/breakpoints';

import { formatStringForTracking } from 'lib/utils/analytics-util';

// Components
import ProductTile from 'components/containers/ProductTile';
import SlickArrow from 'components/common/SlickArrows';

import PRODUCT_CONSTANTS from 'constants/ProductConstants';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import { toggle } from 'actions/InterceptorActions';


/**
 * Product Care Carousel Component
 */
class ProductCareCarousel extends React.Component {
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

        if (this.props.type === 'SKU_CAT') {
            const skuRequest = JSON.parse(JSON.stringify(this.props.aem.skuServiceConfig));

            skuRequest.payload = this.state.config.skuConfig;
            const catRequest = JSON.parse(JSON.stringify(this.props.aem.categoryServiceConfig));

            catRequest.payload = this.state.config.categoryConfig;
            config = {
                type: this.props.type,
                skuRequest,
                catRequest
            };
        } else {
            const skuRequest = JSON.parse(JSON.stringify(this.props.aem.skuServiceConfig));

            skuRequest.payload = this.state.config.skuConfig;
            const richRequest = {
                url: this.state.config.richURL,
                queryParams: this.state.config.queryParams,
                noClientHeaders: this.state.config.noClientHeaders
            };

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
     * @description This sets the data or hides the entire component
     * @param {array} products the transformed products returned from service
     * @param {string} recommendationsType recommendationsType used for analytics
     * @returns {void}
     */
    setContent = (products, recommendationsType) => {
        if (products.length >= 2) {
            this.setState({
                products,
                recommendationsType
            });
            this.props.dataFetched();
        }
    }

    /**
     * @description Rsolves data for the provided component config
     * @param {object} config The config object of SKU and catgeories requests
     * @returns {void}
     */
    fetchData = (config) => {
        if (config.type === PRODUCT_CONSTANTS.CAROUSEL_TYPE.SKU_CAT) {
            getSkuCatData(config).then(res => {
                let products = transformSkuCatData(res);

                products = getReorderedProducts(objectPath.get(config, 'skuRequest.payload.Sku', []), products);
                this.setContent(products, AnalyticsConstants.RECOMMENDATION_AUTHORED);
            }).catch(err => {
                this.setContent([], AnalyticsConstants.RECOMMENDATION_AUTHORED);
            });
        } else {
            getRichRelData(config).then(res => {
                let products = transformSkuCatData(res);

                products = getReorderedProducts(objectPath.get(res, 'skuOrder', []), products);
                this.setContent(products, AnalyticsConstants.RICHRELEVANCE);
            }).catch(err => {
                this.setContent([], AnalyticsConstants.RICHRELEVANCE);
            });
        }
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
            slidesToShow: 2,
            slidesToScroll: 2,
            arrows: true,
            tileType: 'product-carousel',
            nextArrow: <SlickArrow
                isleftArrow={false}
            />,
            prevArrow: <SlickArrow isleftArrow />,
            useTransform: false,
            swipeToSlide: false,
            variableWidth: false,
            accessibility: false,
            responsive: [
                {
                    breakpoint: parseInt(styleVariables.tabletBreakPoint, 10),
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        arrows: false,
                        variableWidth: false,
                        tileType: 'product-carousel'
                    }
                },
                {
                    breakpoint: parseInt(styleVariables.mobileBreakPoint, 10),
                    settings: {
                        slidesToShow: this.state.config.slideToShow || 1.1,
                        slidesToScroll: 1,
                        arrows: false,
                        variableWidth: false,
                        tileType: 'product-carousel'
                    }
                }
            ]
        };

        return (
            <div className="product-care__carousel-holder">
                {
                    Object.keys(this.state.products).length > 0 &&
                    <Slider {...settings}>
                        {
                            this.state.products.map((item, index) => (
                                <div
                                    data-interaction-context=""
                                    data-interaction-type={this.state.recommendationsType}
                                    data-interaction-name={formatStringForTracking(item.name)}
                                    data-rranalytics={item.clickURL}
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
                                </div>))
                        }
                    </Slider>
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem
    };
};

ProductCareCarousel.propTypes = {
    config: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    aem: PropTypes.any.isRequired,
    dataFetched: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(ProductCareCarousel);
