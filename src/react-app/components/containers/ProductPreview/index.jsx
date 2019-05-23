// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import * as objectPath from 'object-path';
import { findFirst } from 'lib/dom/dom-util';

// Components
import Picture from 'components/common/Picture';
import ImageZoom from 'components/common/ImageZoom';
import SlickArrow from 'components/common/SlickArrows';

import { getCaratValue } from 'lib/utils/format-data';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import { triggerAnalyticsEvent } from 'lib/utils/analytics-util';
import styleVariables from 'lib/utils/breakpoints';
// import './index.scss';

const HcSticky = require('hc-sticky');

/**
 * Product Preview Carousel Component
 */
class ProductPreview extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        const productSku = objectPath.get(window.tiffany, 'pdpConfig.selectedSku', false);
        // const selectedDiamond = objectPath.get(props.diamondFilters, 'selectedDiamond', false);
        const {
            productId, miniPdp, config, aem, isMiniPdp
        } = this.props;
        let setConfig = aem[config];

        if (isMiniPdp && productId && config) {
            const { products } = miniPdp;

            setConfig = products[productId] ? products[productId][config] : aem[config];
        }

        this.state = {
            config: setConfig,
            sku: productSku,
            caratWeight: '',
            bridalSku: ''
        };
        this.stickyComponents = [];
        this.container = React.createRef();
    }

    /**
     * @returns {void}
     */
    componentDidMount() {
        this.updateProductDetails();
        if (this.container.current) {
            this.stickyPreview = new HcSticky(this.container.current, {
                stickTo: this.container.current.parentNode.parentNode.parentNode.parentNode,
                top: 64,
                responsive: {
                    899: {
                        disable: true
                    }
                }
            });
        }
    }

    /**
     * @description Lifecycle hook
     * @param {object} nextProps Next Props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.diamondFilters.selectedDiamond && this.props.diamondFilters.selectedDiamond && (nextProps.diamondFilters.selectedDiamond.isInBag !== this.props.diamondFilters.selectedDiamond.isInBag)) {
            const images = [];

            nextProps.diamondFilters.selectedDiamond.images.forEach(image => {
                images.push({
                    defaultSrc: image,
                    altText: 'Image',
                    isLazyLoad: true,
                    largeImage: { src: image },
                    smallImage: { src: image }
                });
            });
            this.setState({
                config: {
                    images
                }
            });
        }

        if (nextProps.productId !== this.props.productId) {
            const {
                productId, miniPdp, config, aem, isMiniPdp
            } = nextProps;
            let setConfig = aem[config];

            if (isMiniPdp && productId && config) {
                const { products } = miniPdp;

                setConfig = products[productId] ? products[productId][config] : aem[config];
            }
            this.setState({
                config: setConfig
            });
        }
    }

    /**
     * @description updateProductDetails To update the props
     * @param {Object} props product data
     * @returns {void}
     */
    updateProductDetails = () => {
        this.setState({
            caratWeight: objectPath.get(this.props.engagementPdp, 'caratWeight', ''),
            bridalSku: objectPath.get(this.props.engagementPdp, 'sku', '')
        });
    }

    /**
     * @description To trigger analytics
     * @param {Object} swipeDirection event
     * @returns {void}
     */
    triggerAnalytics = (swipeDirection) => {
        const productPrevContainer = findFirst('.product-preview__container');
        const activeSlide = findFirst('.slick-active', productPrevContainer);
        let mediaTypeId = AnalyticsConstants.STRAIGHT_ON;
        const previewImages = objectPath.get(this.state, 'config.images');
        const index = parseInt(activeSlide.getAttribute('data-index'), 10);
        let analyticsObj = {};

        if (swipeDirection === 'right') {
            if (previewImages[index - 1]) {
                if (previewImages[index - 1].mediaTypeID === this.props.seeItOnMediaTypeID) {
                    mediaTypeId = AnalyticsConstants.SEE_IT_ON;
                } else if (previewImages[index - 1].mediaTypeID === this.props.altViewsMediaTypeID) {
                    mediaTypeId = AnalyticsConstants.ALTERNATE_VIEWS;
                } else {
                    mediaTypeId = AnalyticsConstants.STRAIGHT_ON;
                }
                analyticsObj = {
                    name: previewImages[index - 1].altText,
                    filename: previewImages[index - 1].mediaFileName,
                    type: mediaTypeId
                };
            }
        }
        if (swipeDirection === 'left') {
            if (previewImages[index + 1]) {
                if (previewImages[index + 1].mediaTypeID === this.props.seeItOnMediaTypeID) {
                    mediaTypeId = AnalyticsConstants.SEE_IT_ON;
                } else if (previewImages[index + 1].mediaTypeID === this.props.altViewsMediaTypeID) {
                    mediaTypeId = AnalyticsConstants.ALTERNATE_VIEWS;
                } else {
                    mediaTypeId = AnalyticsConstants.STRAIGHT_ON;
                }
                analyticsObj = {
                    name: previewImages[index + 1].altText,
                    filename: previewImages[index + 1].mediaFileName,
                    type: mediaTypeId
                };
            }
        }
        if (analyticsObj.filename) {
            triggerAnalyticsEvent(AnalyticsConstants.UPDATED_PRODUCT_SLIDER, analyticsObj);
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const previewImages = objectPath.get(this.state, 'config.images');
        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 0,
            nextArrow: <SlickArrow isleftArrow={false} pdpFlag previewImages={previewImages} />,
            prevArrow: <SlickArrow isleftArrow pdpFlag previewImages={previewImages} />,
            onSwipe: (e) => {
                this.triggerAnalytics(e);
            },
            responsive: [
                {
                    breakpoint: parseInt(styleVariables.pdpTabletBreakPoint, 10),
                    settings: {
                        arrows: false,
                        variableHeight: true,
                        dots: true,
                        onSwipe: (e) => {
                            this.triggerAnalytics(e);
                        }
                    }
                }
            ]
        };
        const logo = objectPath.get(this.state, 'config.logo');
        const caratDetails = getCaratValue(objectPath.get(this.state, 'config.caratMapping', []), this.state.caratWeight, this.state.bridalSku);

        return (
            <div className="product-preview left-element">
                <article className="product-preview__container" ref={this.container}>
                    {
                        previewImages &&
                        previewImages.length > 0 &&
                        <div className={`product-preview__carousel-holder ${previewImages.length === 1 ? 'single-image-1' : ''}`}>
                            <Slider {...settings}>
                                {
                                    previewImages.map((image, index) => (
                                        <div className="product-preview-image" key={index.toString()}>
                                            <ImageZoom
                                                key={index.toString()}
                                                {...image}
                                            />
                                        </div>
                                    ))
                                }
                            </Slider>
                            {
                                caratDetails &&
                                <div className="product-preview__holder">
                                    <button type="button" className="product-preview__carat-weight">
                                        {caratDetails}
                                    </button>
                                </div>
                            }
                        </div>
                    }
                    {
                        (logo && Object.keys(logo).length > 0) &&
                        <div className="product-preview__logo">
                            <a
                                className="product-preview__logo_link"
                                href={logo.logoRedirect}
                            >
                                <Picture
                                    sources={logo.sources}
                                    defaultSrc={logo.defaultSrc}
                                    altText={logo.altText}
                                    isLazyLoad={logo.isLazyLoad}
                                />
                            </a>
                        </div>
                    }

                </article>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        labels: state.authoredLabels,
        engagementPdp: objectPath.get(state.aem, 'engagementpdp.groupCompleteResponse', {}),
        diamondFilters: state.diamondFilters,
        miniPdp: state.miniPdp
    };
};

ProductPreview.propTypes = {
    config: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired,
    engagementPdp: PropTypes.object.isRequired,
    type: PropTypes.string,
    diamondFilters: PropTypes.object.isRequired,
    isMiniPdp: PropTypes.bool,
    seeItOnMediaTypeID: PropTypes.number,
    altViewsMediaTypeID: PropTypes.number
};

ProductPreview.defaultProps = {
    type: '',
    isMiniPdp: false,
    seeItOnMediaTypeID: 1098,
    altViewsMediaTypeID: 1093
};

export default connect(mapStateToProps)(ProductPreview);
