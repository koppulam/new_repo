// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import MediaQuery from 'react-responsive';
import ProductTile from 'components/containers/ProductTile';
import { formatStringForTracking } from 'lib/utils/analytics-util';

import styleVariables from 'lib/utils/breakpoints';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
// import './index.scss';

/**
 * Product Bundle Scroll Component
 */
class ProductBundleScroll extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.pdpConfig[this.props.config]
        };
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const ipadMinBreakPoint = parseInt(styleVariables.ipadBreakPoint, 10) + 1;
        const belowIpadBreakPoint = parseInt(styleVariables.ipadBreakPoint, 10);
        const settings = {
            dots: false,
            infinite: false,
            speed: 600,
            slidesToShow: 3,
            slidesToScroll: 3,
            swipeToSlide: true,
            centerMode: false,
            initialSlide: 0,
            arrows: true,
            responsive: [
                {
                    breakpoint: parseInt(styleVariables.tabletBreakPoint, 10),
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        arrows: false,
                        variableWidth: false
                    }
                },
                {
                    breakpoint: parseInt(styleVariables.mobileBreakPoint, 10),
                    settings: {
                        slidesToShow: 1.1,
                        slidesToScroll: 1,
                        arrows: false,
                        variableWidth: false
                    }
                }
            ]
        };

        return (
            this.state.config && this.state.config.image && this.state.config.image.length > 0 ?
                <article className="product-bundle-scroll">
                    <MediaQuery query={`(min-device-width: ${ipadMinBreakPoint}px)`}>
                        <h2 className="product-bundle-scroll__heading">
                            {this.state.config.heading}
                        </h2>
                        <div className="product-bundle-scroll__body">
                            {
                                this.state.config.image.map((item, index) => {
                                    return (
                                        <div key={index.toString()} className="product-bundle-scroll__body_image">
                                            <div className="product-bundle-scroll__content_body_image">
                                                <div
                                                    data-interaction-context=""
                                                    data-interaction-type={AnalyticsConstants.BUY_SEPARATELY}
                                                    data-interaction-name={formatStringForTracking(item.name)}
                                                >
                                                    <ProductTile
                                                        key={index.toString()}
                                                        name={item.name}
                                                        image={item.image}
                                                        isNew={item.isNew}
                                                        price={item.price}
                                                        sku={item.selectedSku ? item.selectedSku : item.sku}
                                                        productSku={item.selectedSku ? item.selectedSku : item.sku}
                                                        groupSku={item.selectedSku ? item.sku : ''}
                                                        url={item.url}
                                                        isGroup={item.isGroup}
                                                        position={index.toString()}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </MediaQuery>

                    <MediaQuery query={`(max-device-width: ${belowIpadBreakPoint}px)`}>
                        <h2 className="product-bundle-scroll__heading">
                            {this.state.config.heading}
                        </h2>
                        <Slider className="product-bundle-scroll__body" {...settings}>
                            {
                                this.state.config.image.map((item, index) => {
                                    return (
                                        <div
                                            key={index.toString()}
                                            className="product-bundle-scroll__body_image"
                                            data-interaction-context=""
                                            data-interaction-type={AnalyticsConstants.BUY_SEPARATELY}
                                            data-interaction-name={formatStringForTracking(item.name)}
                                        >
                                            <ProductTile
                                                key={index.toString()}
                                                name={item.name}
                                                image={item.image}
                                                isNew={item.isNew}
                                                price={item.price}
                                                sku={item.selectedSku ? item.selectedSku : item.sku}
                                                productSku={item.selectedSku ? item.selectedSku : item.sku}
                                                groupSku={item.selectedSku ? item.sku : ''}
                                                url={item.url}
                                                isGroup={item.isGroup}
                                                position={index.toString()}
                                            />
                                        </div>
                                    );
                                })
                            }
                        </Slider>
                    </MediaQuery>
                </article> : null
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        pdpConfig: state.productDetails.pdpConfig
    };
};

ProductBundleScroll.propTypes = {
    config: PropTypes.string.isRequired,
    pdpConfig: PropTypes.any.isRequired
};

export default connect(mapStateToProps)(ProductBundleScroll);
