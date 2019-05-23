// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import Slider from 'react-slick';
import * as objectPath from 'object-path';

import ContentTile from 'components/common/ContentTile';
import Picture from 'components/common/Picture';
import SlickArrow from 'components/common/SlickArrows';

import styleVariables from 'lib/utils/breakpoints';
// import './index.scss';

/**
 * Marketing Carousel Component
 */
class MarketingCarousel extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.aem[this.props.config]
        };
    }

    /**
       * Render Component.
       * @returns {object} html instance
       */
    render() {
        const ipadMinBreakPoint = parseInt(styleVariables.ipadBreakPoint, 10) + 1;
        const belowIpadBreakPoint = parseInt(styleVariables.ipadBreakPoint, 10);
        const rte = objectPath.get(this.state, 'config.content.rte');
        const settings = {
            dots: false,
            infinite: false,
            speed: 600,
            slidesToShow: 1.1,
            slidesToScroll: 1,
            swipeToSlide: false,
            initialSlide: 0,
            arrows: false,
            finalPadding: 10,
            tileType: 'marketing-tile',
            useTransform: false,
            variableWidth: false,
            nextArrow: <SlickArrow isleftArrow={false} />,
            prevArrow: <SlickArrow isleftArrow />,
            accessibility: false
        };

        return (
            <article
                className="marketing-carousel mobile-padding"
                {...(this.props.parallax ?
                    {
                        'data-aos': 'fade-up'
                    }
                    : {})}
            >
                <MediaQuery query={`(min-device-width: ${ipadMinBreakPoint}px)`}>
                    <div className="marketing-carousel__body">
                        {
                            objectPath.has(this.state, 'config.content.images') &&
                            this.state.config.content.images.map((item, index) => {
                                return (
                                    <div key={index.toString()} className="marketing-carousel__body_image">
                                        {(rte === true) && (index === 0) ?
                                            <ContentTile
                                                heading={this.state.config.content.heading}
                                                description={this.state.config.content.description}
                                                ctaText={this.state.config.content.ctaText}
                                                ctaLink={this.state.config.content.ctaLink}
                                                ctaTarget={this.state.config.content.ctaTarget}

                                            /> : null}

                                        {(rte === false) && (index !== 0) ?
                                            <ContentTile
                                                heading={this.state.config.content.heading}
                                                description={this.state.config.content.description}
                                                ctaText={this.state.config.content.ctaText}
                                                ctaLink={this.state.config.content.ctaLink}
                                                ctaTarget={this.state.config.content.ctaTarget}

                                            /> : null}

                                        <Picture
                                            sources={item.sources}
                                            defaultSrc={item.defaultSrc}
                                            isLazyLoad={item.isLazyLoad}
                                            altText={item.altText}
                                            customClass={item.customClass}
                                        />
                                    </div>
                                );
                            })
                        }
                    </div>
                </MediaQuery>

                <MediaQuery query={`(max-device-width: ${belowIpadBreakPoint}px)`}>
                    <Slider className="marketing-carousel__body" {...settings}>
                        {objectPath.has(this.state, 'config.content.images') &&
                            this.state.config.content.images.map((item, index) => {
                                return (
                                    <div key={index.toString()} className="marketing-carousel__body_image">
                                        <Picture
                                            sources={item.sources}
                                            defaultSrc={item.defaultSrc}
                                            isLazyLoad={item.isLazyLoad}
                                            altText={item.altText}
                                            customClass={item.customClass}
                                        />
                                    </div>
                                );
                            })}
                    </Slider>
                    <div className="marketing-carousel__rte">
                        <ContentTile
                            heading={this.state.config.content.heading}
                            description={this.state.config.content.description}
                            ctaText={this.state.config.content.ctaText}
                            ctaLink={this.state.config.content.ctaLink}
                            ctaTarget={this.state.config.content.ctaTarget}

                        />
                    </div>
                </MediaQuery>
            </article>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem
    };
};

MarketingCarousel.propTypes = {
    config: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired,
    parallax: PropTypes.any
};

MarketingCarousel.defaultProps = {
    parallax: false
};

export default connect(mapStateToProps)(MarketingCarousel);
