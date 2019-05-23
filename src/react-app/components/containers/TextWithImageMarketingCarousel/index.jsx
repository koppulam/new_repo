// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import * as objectPath from 'object-path';
import classNames from 'classnames';
import { getSkuData } from 'actions/TextWithImageActions';
import MediaQuery from 'react-responsive';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

// Components
import Picture from 'components/common/Picture';
import ContentTile from 'components/common/ContentTile';

import styleVariables from 'lib/utils/breakpoints';
import { findFirst } from 'lib/dom/dom-util/index';
import Waypoint from 'react-waypoint';
// import './index.scss';

/**
 * TextWithImageMarketingCarousel component
 */
class TextWithImageMarketingCarousel extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.aem[this.props.config],
            products: [],
            slides: [],
            isSkuUnavailable: false,
            stickyStyle: {}
        };
        this.contentItem = React.createRef();
        this.pictureContainerRef = React.createRef();
    }

    /**
    * Lifcycle hook for
    * @returns {void}
    */
    async componentDidMount() {
        const skuConfig = objectPath.get(this.state, 'config.skuConfig', {});

        if (Object.keys(skuConfig).length > 0) {
            const skuRequest = JSON.parse(JSON.stringify(this.props.aem.skuServiceConfig));

            skuRequest.payload = this.state.config.skuConfig;

            const config = {
                skuRequest
            };

            if (this.checkForSku(skuConfig).length > 0) {
                this.props.dispatch(getSkuData(config, this.setProductImages, this.onFailure));
            }
        }

        this.setPositionInTablet();
        window.addEventListener('resize', () => {
            this.setPositionInTablet();
        });
        this.setState({
            stickyPosition: this.stickyElementsHeightCalculator()
        });
    }

    /**
     * Onresize update the content tile text positioning.
     * @returns {void}
     */
    componentWillUnmount() {
        this.setPositionInTablet();
        window.addEventListener('resize', () => {
            this.setPositionInTablet();
        });
    }

    /**
     * @description Check for Sku in SKUConfig in authored object.
     * @param {Object} config config contains sku request payload.
     * @returns {void}
     */
    checkForSku = (config) => {
        const skuList = objectPath.get(config, 'Sku', []);

        return skuList.filter(item => {
            return item !== (undefined || null || '');
        });
    }

    /**
     * @description On API failure remove the component from the DOM.
     * @returns {void}
     */
    onFailure = () => {
        this.hideComponent();
    }

    /**
     * @description Set left  & top positioning on Ipad.
     * @returns {void}
     */
    setPositionInTablet = () => {
        const contentTile = objectPath.get(this.state.config, 'contentTile', {});
        const left = objectPath.get(contentTile, 'leftPos', '');
        const top = objectPath.get(contentTile, 'topPos', '');

        if (this.marketingCarousel) {
            const adjustPosition = this.marketingCarousel.getElementsByClassName('adjust-position');
            const ipadAbove = window.matchMedia(styleVariables.ipadAbove).matches;

            if (ipadAbove) {
                for (let i = 0; i < adjustPosition.length; i += 1) {
                    adjustPosition[i].style.top = top;
                    adjustPosition[i].style.left = left;
                    adjustPosition[i].style.width = '100%';
                }
            }
        }
    }

    /**
     * @description Get carousal slides with product tiles based on slot existance in the item.
     * @param {*} products products form state
     * @returns {void}
     */
    getImage = (products) => {
        const slides = [];
        const contentTile = objectPath.get(this.state.config, 'contentTile', {});
        const leftPos = objectPath.get(contentTile, 'leftPos', '');
        const topPos = objectPath.get(contentTile, 'topPos', '');
        const itemClass = (leftPos || topPos) ? 'carousel-item-wrapper' : '';
        const isTextOnTop = (leftPos || topPos);

        products.forEach((item, index) => {
            if (!item.slot) {
                slides.push(
                    <div className={itemClass} key={index.toString()}>
                        {
                            (!isTextOnTop && index <= 0) &&
                            <MediaQuery query={styleVariables.ipadAbove}>
                                <div className="content-item" ref={this.contentItem}>
                                    <ContentTile
                                        {...this.state.config.contentTile}
                                    />
                                </div>
                            </MediaQuery>
                        }
                        <a href={index > 0 ? item.url : this.state.config.contentTile.ctaLink} target={this.state.config.contentTile.ctaTarget} title={item.name} tabIndex={0}>
                            <Picture
                                {...item}
                            />
                        </a>
                        {
                            (isTextOnTop && index <= 0) &&
                            <MediaQuery query={styleVariables.ipadAbove}>
                                <div className="content-item" ref={this.contentItem}>
                                    <ContentTile
                                        {...this.state.config.contentTile}
                                    />
                                </div>
                            </MediaQuery>
                        }
                    </div>
                );
            }
            return null;
        });
        return slides;
    }

    /**
     * @description From the service response create an array for picture component.
     * @param {array} items This is a response for SKU service API.
     * @returns {void}
     */
    setProductImages = (items) => {
        const image = objectPath.get(this.state, 'config.image', {});
        const skuConfig = objectPath.get(this.state, 'config.skuConfig', {});
        const sku = objectPath.get(skuConfig, 'Sku', []);
        const products = [];

        if (items && items.length > 0) {
            items.forEach(element => {
                if (element.isLowInventory === false) {
                    products.push({
                        defaultSrc: element.image,
                        isLazyLoadf: false,
                        altText: element.name,
                        customClass: image.customClass,
                        url: element.url
                    });
                }
            });
            if (products.length > 0) {
                products.unshift(image);
            }
        }
        if (sku && sku.length > 0 && products.length <= 0) {
            this.hideComponent();
        }

        const slides = this.getImage(products);

        this.setState({ slides, products });
    }

    /**
     * @description On API failure remove the component from the DOM.
     * @returns {void}
     */
    hideComponent = () => {
        this.setState({ isSkuUnavailable: true });
        this.props.reRenderCallback('tiffany-text-with-image-carousel', this.props.config);
    }

    /**
     * @description sticky behaviour handler
     * @param {object} e Event object
     * @returns {void}
     */
    handleWaypointEnter = (e) => {
        if (e.previousPosition && e.previousPosition === 'inside' && e.currentPosition === 'above') {
            this.setState({
                stickyPosition: this.stickyElementsHeightCalculator(),
                stickyStyle: {
                    position: 'fixed',
                    top: this.stickyElementsHeightCalculator(),
                    width: this.width
                }
            });
            this.props.setBottomWaypoint(this.height + this.stickyElementsHeightCalculator());
        } else if (e.previousPosition === 'above' && e.currentPosition === 'inside') {
            this.setState({
                stickyStyle: {}
            });
        }
    }

    /**
     * @description sets the bottom style for sticky image
     * @returns {void}
     */
    setBottomStyles = () => {
        this.setState({
            stickyStyle: {
                bottom: 0,
                position: 'absolute',
                top: 'initial',
                width: 'auto'
            }
        });
    }

    /**
     * @description sets the top style for sticky image
     * @returns {void}
     */
    setTopStyles = () => {
        this.setState({
            stickyPosition: this.stickyElementsHeightCalculator(),
            stickyStyle: {
                position: 'fixed',
                top: this.stickyElementsHeightCalculator(),
                width: this.width
            }
        });
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
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const config = objectPath.get(this.state, 'config', {});
        const productsLen = Object.keys(this.state.products).length;
        const desktopAndAbove = window.matchMedia(styleVariables.desktopAndAbove).matches;
        const settings = {
            dots: false,
            infinite: false,
            speed: 600,
            slidesToShow: 1,
            slidesToScroll: 1,
            swipeToSlide: false,
            initialSlide: 0,
            variableWidth: false,
            tileType: 'marketing-tile',
            useTransform: false,
            afterChange: index => {
                const slideChangeAlertlabel = objectPath.get(this.state, 'config.slideChangeAlertlabel', 'Slide Changed');
                const alertEle = findFirst('.aria-alert');

                alertEle.innerHTML = slideChangeAlertlabel;
            },
            responsive: [
                {
                    breakpoint: parseInt(styleVariables.tabletBreakPoint, 10),
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: true,
                        centerMode: false,
                        tileType: 'marketing-tile'
                    }
                }
            ]
        };

        return (
            <article
                className={
                    classNames('text-with-image-marketing-carousel',
                        {
                            hide: this.state.isSkuUnavailable,
                            [`${config.paddingBottom}`]: config.paddingBottom,
                            [`${config.mobilePaddingBottom}`]: config.mobilePaddingBottom
                        })
                }
                ref={el => { this.marketingCarousel = el; }}
            >
                <div className="hide-from__screen aria-alert" role="alert" />
                {Object.keys(this.state.config).length > 0 &&
                    <div className="item">
                        <div className="image-item">
                            {
                                productsLen > 1 &&
                                <div>
                                    <span
                                        data-interaction-context=""
                                        data-interaction-type={AnalyticsConstants.MARKETING_TILE}
                                        data-interaction-name={AnalyticsConstants.PRODUCT_TILE}
                                    >
                                        <Slider {...settings}>
                                            {this.state.slides}
                                        </Slider>
                                    </span>
                                    <MediaQuery query={styleVariables.ipadBelow}>
                                        <div className="content-item" ref={this.contentItem}>
                                            <ContentTile
                                                {...this.state.config.contentTile}
                                            />
                                        </div>
                                    </MediaQuery>
                                </div>
                            }
                            {
                                productsLen <= 1 &&
                                <div>
                                    <MediaQuery query={styleVariables.ipadAbove}>
                                        <div className="content-item" ref={this.contentItem}>
                                            <ContentTile
                                                {...this.state.config.contentTile}
                                            />
                                        </div>
                                    </MediaQuery>
                                    {
                                        (this.props.makeLeftSticky) &&
                                        <Waypoint
                                            fireOnRapidScroll
                                            onEnter={this.handleWaypointEnter}
                                            onLeave={this.handleWaypointEnter}
                                            topOffset={`${this.state.stickyPosition}px`}
                                        />
                                    }
                                    <div
                                        style={desktopAndAbove ? this.state.stickyStyle : {}}
                                        ref={pictureContainerRef => {
                                            if (pictureContainerRef) {
                                                this.pictureContainerRef = pictureContainerRef;
                                                this.width = this.pictureContainerRef.getBoundingClientRect().width;
                                            }
                                        }}
                                        aria-label={objectPath.get(window, 'tiffany.labels.nextProductLabel', 'Tab to go to next product')}
                                    >
                                        <Picture
                                            onLoadHandler={e => {
                                                const { target: { width, height } } = e;

                                                this.width = width;
                                                this.height = height;
                                            }}
                                            {...config.image}
                                        />
                                    </div>
                                    <MediaQuery query={styleVariables.ipadBelow}>
                                        <div className="content-item" ref={this.contentItem}>
                                            <ContentTile
                                                {...this.state.config.contentTile}
                                            />
                                        </div>
                                    </MediaQuery>
                                </div>
                            }
                        </div>
                    </div>
                }
            </article>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        skuResponse: state.textWithImage.skuResponse,
        isSkuUnavailable: state.textWithImage.isSkuUnavailable
    };
};

TextWithImageMarketingCarousel.propTypes = {
    config: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired,
    skuResponse: PropTypes.array.isRequired,
    isSkuUnavailable: PropTypes.bool.isRequired,
    reRenderCallback: PropTypes.func,
    handleWaypointEnter: PropTypes.func,
    setBottomWaypoint: PropTypes.func,
    makeLeftSticky: PropTypes.bool
};

TextWithImageMarketingCarousel.defaultProps = {
    handleWaypointEnter: () => { },
    reRenderCallback: () => { },
    setBottomWaypoint: () => { },
    makeLeftSticky: false
};

export default connect(mapStateToProps, null, null, { withRef: true })(TextWithImageMarketingCarousel);
