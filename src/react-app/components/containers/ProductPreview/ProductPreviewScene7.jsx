// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import * as objectPath from 'object-path';
import { findFirst, findAll } from 'lib/dom/dom-util';
import SlickArrow from 'components/common/SlickArrows';
import ImageZoom from 'components/common/ImageZoom';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import { triggerAnalyticsEvent } from 'lib/utils/analytics-util';
import { getCaratValue } from 'lib/utils/format-data';

// Components
import Picture from 'components/common/Picture';

// _actions
import styleVariables from 'lib/utils/breakpoints';
// import './index.scss';

const HcSticky = require('hc-sticky');
const $ = require('jquery');

/**
 * Product Preview Carousel Component
 */
class ProductPreviewScene7 extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        const productSku = objectPath.get(window.tiffany, 'pdpConfig.selectedSku', false);
        const {
            isMiniPdp, miniPdp, aem, config, productId
        } = this.props;

        this.state = {
            config: isMiniPdp && miniPdp.products && miniPdp.products[productId] ? miniPdp.products[productId][config] : aem[config],
            sku: productSku,
            enableADA: true,
            caratWeight: '',
            bridalSku: ''
        };

        this.container = React.createRef();
    }

    /**
     * @description initializes the scene7 components
     * @returns {void}
     */
    componentDidMount() {
        const previewImages = objectPath.get(this.state, 'config.images', []);

        this.updateProductDetails();
        previewImages.forEach((image) => {
            const id = image.scene7ViewerConfig.containerId;
            const cont = document.getElementById(id);

            // $(`#${id}`).hide();
            if (cont && window.s7viewers) {
                if (image.scene7ViewerConfig) {
                    const zoomViewer = new window.s7viewers.FlyoutViewer(image.scene7ViewerConfig);

                    zoomViewer.setHandlers({
                        initComplete: () => {
                            const container = `#${id}_container`;

                            $(container).css('height', 'calc(100vh - 64px)');
                            const staticImgs = findAll('.s7staticimage img', cont);

                            staticImgs.forEach(staticImage => {
                                staticImage.setAttribute('alt', image.altText);
                            });
                        },
                        trackEvent: (...args) => {
                            const zoomImgContainer = findAll('.s7flyoutzoom img', cont);

                            zoomImgContainer.forEach(zoomImg => {
                                zoomImg.setAttribute('alt', image.altText);
                            });
                        }
                    });
                    zoomViewer.init();
                }
            }
        });

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
                const params = this.setScene7Params(image);

                images.push({
                    defaultSrc: image.url,
                    altText: 'Image',
                    isLazyLoad: true,
                    largeImage: { src: image.url },
                    smallImage: { src: image.url },
                    scene7ViewerConfig: {
                        containerId: image.containerId,
                        params
                    }
                });
            });
            this.setState({
                config: {
                    images,
                    caratMapping: objectPath.get(this.state, 'config.caratMapping', [])
                }
            });
        }

        if (nextProps.diamondFilters.selectedDiamond && this.props.diamondFilters.selectedDiamond) {
            this.updateProductDetails(nextProps);
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
     * @param {Object} prevProps Previous props
     * @returns {void}
     */
    componentDidUpdate(prevProps) {
        if (prevProps.productId !== this.props.productId) {
            const previewImages = objectPath.get(this.state, 'config.images');

            previewImages.forEach((image) => {
                const id = image.scene7ViewerConfig.containerId;
                const cont = document.getElementById(id);

                cont.innerHTML = '';
                if (cont && window.s7viewers) {
                    if (image.scene7ViewerConfig) {
                        const zoomViewer = new window.s7viewers.FlyoutViewer(image.scene7ViewerConfig);

                        zoomViewer.init();
                    }
                }
            });
        }
    }

    /**
     * @description setScene7Params Method to return scene7 params.
     * @param {Object} image Image object contains list of items.
     * @returns {void}
     */
    setScene7Params = (image) => {
        let params = {};
        const scene7Config = objectPath.get(this.state, 'config.images', []);

        if (scene7Config && scene7Config.length > 0) {
            let s7Conf = objectPath.get(scene7Config[0], 'scene7ViewerConfig', {});

            s7Conf = objectPath.get(s7Conf, 'params', {});

            params = {
                imagereload: objectPath.get(s7Conf, 'imagereload', ''),
                zoomfactor: objectPath.get(s7Conf, 'zoomfactor', ''),
                asset: image.asset.replace(objectPath.get(s7Conf, 'serverurl', ''), ''),
                contenturl: objectPath.get(s7Conf, 'contenturl', ''),
                config: objectPath.get(s7Conf, 'config', ''),
                serverurl: objectPath.get(s7Conf, 'serverurl', ''),
                stageSize: objectPath.get(s7Conf, 'stageSize', ''),
                tip: objectPath.get(s7Conf, 'tip', '')
            };
        }

        return params;
    }

    /**
     * @description Method to turn on and off ADA in slick carousel
     * @param {Boolean} enableADA boolean to identify to set of remove ADA
     * @returns {void}
     */
    setADA = (enableADA) => {
        // If ADA status and identifier are same then no action has to be performed
        if (enableADA !== this.state.enableADA) {
            this.setState({
                enableADA
            });
        }
    }

    /**
     * @description updateProductDetails To update the props
     * @param {Object} props product data
     * @returns {void}
     */
    updateProductDetails = (props) => {
        const diamondProps = (props && props.diamondFilters) || this.props.diamondFilters;
        const selectedDiamond = objectPath.get(diamondProps, 'selectedDiamond', {});
        const group = objectPath.get(selectedDiamond, 'group.group', {});
        let caratWeight = objectPath.get(this.props.engagementPdp, 'caratWeight', '');
        let bridalSku = objectPath.get(this.props.engagementPdp, 'sku', '');

        if (group && Object.keys(group).length > 0) {
            caratWeight = objectPath.get(group, 'caratWeight', '');
            bridalSku = objectPath.get(group, 'sku', '');
        }

        this.setState({
            caratWeight,
            bridalSku
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
            accessibility: this.state.enableADA,
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 0,
            nextArrow: <SlickArrow
                isleftArrow={false}
                pdpFlag
                previewImages={previewImages}
                onFocus={() => { this.setADA(true); }}
                onBlur={() => { this.setADA(false); }}
            />,
            prevArrow: <SlickArrow
                isleftArrow
                pdpFlag
                previewImages={previewImages}
                onBlur={() => { this.setADA(false); }}
                onFocus={() => { this.setADA(true); }}
            />,
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
        const watermark = objectPath.get(this.state, 'config.watermarkConfig', {});
        const isEstore = objectPath.get(this.props.aem, 'isEstore', false);
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
                                        <div className="preview-holder" key={index.toString()}>
                                            <div
                                                className="inline-zoom show__desktop-and-above"
                                                id={image.scene7ViewerConfig.containerId}
                                                key={index.toString().concat('scene7')}
                                                role="img"
                                                aria-label={image.altText}
                                            />

                                            <div className="product-preview-image show__desktop-and-below" key={index.toString()}>
                                                <ImageZoom
                                                    key={index.toString().concat('mobileZoom')}
                                                    {...image}
                                                />
                                            </div>
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
                            {
                                (isEstore && (watermark && Object.keys(watermark).length > 0)) &&
                                <div className="product-preview__watermark">
                                    <h3 className="product-preview__watermark-header">{watermark.header}</h3>
                                    <p className="product-preview__watermark-desc">{watermark.description}</p>
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
        miniPdp: state.miniPdp,
        engagementPdp: objectPath.get(state.aem, 'engagementpdp.groupCompleteResponse', {}),
        diamondFilters: state.diamondFilters
    };
};

ProductPreviewScene7.propTypes = {
    config: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired,
    isMiniPdp: PropTypes.bool,
    miniPdp: PropTypes.any.isRequired,
    productId: PropTypes.string,
    engagementPdp: PropTypes.object.isRequired,
    type: PropTypes.string,
    diamondFilters: PropTypes.object.isRequired
};

ProductPreviewScene7.defaultProps = {
    isMiniPdp: false,
    productId: '',
    type: ''
};

export default connect(mapStateToProps)(ProductPreviewScene7);
