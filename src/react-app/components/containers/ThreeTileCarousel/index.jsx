// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import classNames from 'classnames';
import * as objectPath from 'object-path';
import matchMedia from 'lib/dom/match-media';
import ContentTile from 'components/common/ContentTile';
import Picture from 'components/common/Picture';

import styleVariables from 'lib/utils/breakpoints';
// import './index.scss';

/**
 * ThreeTileCarousel Component
 */
class ThreeTileCarousel extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            customCta: false,
            config: this.props.aem[this.props.config]
        };
        this.sliderRef = React.createRef();
    }

    /**
     * Onresize update the slick arrow styles.
     * @returns {void}
     */
    componentDidMount() {
        this.updateSlickArrowPosition();
        window.addEventListener('resize', this.updateSlickArrowPosition);
    }

    /**
     * Onresize update the slick arrow styles.
     * @returns {void}
     */
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateSlickArrowPosition);
    }

    /**
     * Set Tiles with picture and text.
     * @param {Object} tileConfig Object to display the tile.
     * @param {Boolean} stackInMobile Boolean resembles Stack in mobile
     * @returns {void} html instance
     */
    setTiles = (tileConfig, stackInMobile) => {
        let custCounter = 0;

        return tileConfig.images.map((item, index) => {
            if (item.isCustomCta) {
                custCounter += 1;

                if (custCounter === tileConfig.images.length && !this.state.customCta) {
                    this.refreshCustState(true);
                }
            }
            return (
                <div
                    key={index.toString()}
                    className={
                        classNames('three-tile-carousel__content_body',
                            {
                                'custom-cta-wrapper': item.isCustomCta,
                                'stacked-tiles': stackInMobile
                            })
                    }
                >
                    <div className="three-tile-carousel__content_body_image">
                        <a className="cta" href={item.contentTile.ctaLink} target={item.contentTile.ctaTarget} tabIndex={0} onClick={(e) => this.openLinks(e, item.contentTile)}>
                            <div className="cta-content button_cta_text" tabIndex={-1}>
                                {this.getPictureTile(item)}
                            </div>
                        </a>
                    </div>
                    {
                        item.contentTile &&
                        this.getContentTile(item.contentTile)
                    }
                </div>
            );
        });
    }

    /**
     * image load handler
     * @returns {void}
     */
    imageLoadHandler = () => {
        this.updateSlickArrowPosition();
    }

    /**
     * Set picture tiles based on the item object.
     * @param {Object} item Object to set picture tile.
     * @returns {void} html instance
     */
    getPictureTile = (item) => {
        return (
            <Picture
                sources={item.sources}
                defaultSrc={item.defaultSrc}
                isLazyLoad={item.isLazyLoad}
                altText={item.altText}
                customClass="threeTileCarousel"
                onLoadHandler={this.imageLoadHandler}
            />
        );
    }

    /**
     * Get Content tiles based on the item object.
     * @param {Object} content Object to set Content tile.
     * @returns {void} html instance
     */
    getContentTile = (content) => {
        return (
            <ContentTile
                heading={content.heading}
                description={content.description}
                ctaLink={content.ctaLink}
                ctaTarget={content.ctaTarget}
                ctaText={content.ctaText}
                leftPos={content.leftPos}
                topPos={content.topPos}
                mobileLeftPos={content.mobileLeftPos}
                mobileTopPos={content.mobileTopPos}
                textColor={content.textColor}
                isInset={content.isInset}
                isRte={content.isRte}
            />
        );
    }

    /**
     * Update Slick arrow position styles dynamically.
     * @returns {void}
     */
    updateSlickArrowPosition = () => {
        if (this.sliderRef && this.sliderRef.current) {
            const image = this.sliderRef.current.querySelector('div.threeTileCarousel picture');

            if (image) {
                const imageHeight = image.offsetHeight - 55; // 55 button height
                const slickPrev = this.sliderRef.current.getElementsByClassName('slick-prev');
                const slickNext = this.sliderRef.current.getElementsByClassName('slick-next');

                if (slickPrev.length > 0 && slickNext.length > 0) {
                    slickNext[0].style.top = `${imageHeight}px`;
                    slickPrev[0].style.top = `${imageHeight}px`;
                }
            }
        }
    }

    /**
     * Render Component.
     * @param {Object} event Click event
     * @param {Object} cta CTA details
     * @returns {void} html instance
     */
    openLinks = (event, cta) => {
        event.preventDefault();

        if (cta.ctaTarget === '_blank') {
            window.open(cta.ctaLink, cta.ctaTarget);
        } else {
            window.location = cta.ctaLink;
        }
    };

    /**
     * @description sets isCustomCta Flag
     * @param {boolean} flag flag
     * @returns {void}
     */
    refreshCustState = flag => this.setState({ customCta: flag });

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
            arrows: true,
            useTransform: false,
            centerMode: false,
            tileType: 'marketing-tile',
            variableWidth: false,
            accessibility: false,
            responsive: [
                {
                    breakpoint: parseInt(styleVariables.ipadBreakPoint, 10),
                    settings: {
                        slidesToShow: 2.2,
                        slidesToScroll: 2,
                        arrows: false,
                        finalPadding: 20,
                        tileType: 'marketing-tile',
                        variableHeight: true
                    }
                },
                {
                    breakpoint: parseInt(styleVariables.mobileBreakPoint, 10),
                    settings: {
                        slidesToShow: 1.1,
                        slidesToScroll: 1,
                        arrows: false,
                        finalPadding: 10,
                        tileType: 'marketing-tile',
                        variableHeight: true
                    }
                }
            ],
            onInit: () => {
                this.updateSlickArrowPosition();
            },
            onReInit: () => {
                this.updateSlickArrowPosition();
            }
        };
        const tileConfig = objectPath.get(this.state, 'config', {});
        const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;
        const stackInMobile = !isDesktop && tileConfig.stackInMobile;

        return (
            <article
                id={tileConfig.id}
                className={
                    classNames('three-tile-carousel',
                        {
                            [`${tileConfig.paddingBottom}`]: tileConfig.paddingBottom
                        })
                }
                {...(this.props.parallax ?
                    { 'data-aos': 'fade-up' }
                    : {})}
            >
                {
                    tileConfig.isHeading &&
                    <div className="three-tile-carousel__heading">
                        <ContentTile
                            heading={tileConfig.heading}
                            description={tileConfig.description}
                            isRte={tileConfig.isRte}
                        />
                    </div>
                }
                {
                    Object.keys(tileConfig.images).length >= 0 &&
                    <div
                        className={
                            classNames('three-tile-carousel__content',
                                {
                                    'custom-slider-cta': this.state.customCta
                                })
                        }
                        ref={this.sliderRef}
                    >
                        {
                            !stackInMobile &&

                            <Slider {...settings}>
                                {this.setTiles(tileConfig)}
                            </Slider>
                        }

                        {
                            stackInMobile &&
                                this.setTiles(tileConfig, stackInMobile)
                        }
                    </div>
                }
            </article>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem
    };
};

ThreeTileCarousel.propTypes = {
    parallax: PropTypes.any,
    config: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired
};

ThreeTileCarousel.defaultProps = {
    parallax: false
};

export default connect(mapStateToProps)(ThreeTileCarousel);
