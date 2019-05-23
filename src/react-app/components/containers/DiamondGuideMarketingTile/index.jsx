// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import classNames from 'classnames';
import Slider from 'react-slick';
import MediaQuery from 'react-responsive';

// Components
import ContentTile from 'components/common/ContentTile';
import Picture from 'components/common/Picture';

import { triggerAnalyticsEvent } from 'lib/utils/analytics-util';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

import DG from 'constants/DiamondGuideConstants';

// Styles
import styleVariables from 'lib/utils/breakpoints';
// import './index.scss';

/**
 * DiamondGuideMarketingTile Component.
 */
class DiamondGuideMarketingTile extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.aem[this.props.config]
        };
        this.tileSliderRef = {};
    }

    /**
     * @description Set slider for content and image.
     * @param {array} config Specifies the tile config.
     * @param {string} tileName Specifies the tile type tile1/tile2.
     * @returns {array} Array of Products
     */
    setTile = (config, tileName) => {
        return (
            config.map((item, index) => {
                const hasbackgroundImage = item.backgroundImage && item.backgroundImage.defaultSrc;
                const hasforegroundTileImage = item.foregroundTileImage && item.foregroundTileImage.defaultSrc;

                return (
                    <div
                        className="tile-wrapper"
                        key={index.toString()}
                        data-heading={item.contentTile && item.contentTile.heading}
                    >
                        <div className="picture-wrapper">
                            { hasbackgroundImage && <Picture {...item.backgroundImage} /> }
                            {
                                tileName === 'tile2' && hasforegroundTileImage &&
                                <Picture {...item.foregroundTileImage} />
                            }
                            { item.contentTile && <ContentTile {...item.contentTile} /> }
                        </div>
                    </div>
                );
            })
        );
    }

    /**
     * @description Set slider for content and image.
     * @param {string} tileType Specifies the tile type tile1/tile2.
     * @param {object} position Specifies the position object.
     * @returns {array} Array of Products
     */
    setSlider = (tileType, position) => {
        const config = objectPath.get(this.state, 'config', {});
        const tile1Config = objectPath.get(config, 'tile1Config', []);
        const tile2Config = objectPath.get(config, 'tile2Config', []);
        const tile = tileType ? tileType.toLowerCase() : '';
        const settings = {
            dots: false,
            infinite: false,
            speed: 600,
            slidesToShow: 1,
            slidesToScroll: 1,
            swipeToSlide: false,
            initialSlide: 0,
            useTransform: false,
            variableWidth: false,
            accessibility: false,
            responsive: [
                {
                    breakpoint: parseInt(styleVariables.tabletBreakPoint, 10),
                    settings: {
                        slidesToShow: 1.1,
                        slidesToScroll: 1,
                        arrows: false
                    }
                }
            ],
            afterChange: (index) => {
                const childrenTitle = objectPath.get(this.tileSliderRef, `current.props.children.${index}.props.data-heading`, '');

                triggerAnalyticsEvent(AnalyticsConstants.UPDATED_MARKETING_SLIDER, { name: childrenTitle, type: AnalyticsConstants.FOURC });
            }
        };

        if (tile === DG.TILE1) {
            if (tile1Config.length > 1) {
                return (
                    <Slider {...settings} ref={this.tileSliderRef}>
                        {this.setTile(tile1Config, DG.TILE1)}
                    </Slider>
                );
            }
            if (tile1Config.length === 1) {
                return (
                    this.setTile(tile1Config, DG.TILE1)
                );
            }
        } else if (tile === DG.TILE2) {
            if (tile2Config.length > 1) {
                return (
                    <Slider {...settings} ref={this.tileSliderRef}>
                        {this.setTile(tile2Config, DG.TILE2)}
                    </Slider>
                );
            }
            if (tile2Config.length === 1) {
                return (
                    this.setTile(tile2Config, DG.TILE2)
                );
            }
        }

        return null;
    }

    /**
     * @description Set slider for content and image.
     * @param {string} tile Specifies the tile type tile1/tile2.
     * @param {object} position Specifies the position object.
     * @returns {array} Array of Products
     */
    setDiamondTile = (tile, position) => {
        const className = `diamond-guide_${tile}`;

        return (
            <div
                className={
                    classNames(className,
                        {
                            [`position-${position[tile]}`]: position[tile]
                        })
                }
            >
                {this.setSlider(tile.toUpperCase(), position)}
            </div>
        );
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const config = objectPath.get(this.state, 'config', {});
        const tile1Config = objectPath.get(config, 'tile1Config', []);
        const tile2Config = objectPath.get(config, 'tile2Config', []);
        const position = objectPath.get(config, 'position', {});
        const tile1 = position.tile1 ? position.tile1.toUpperCase() : 'LEFT';
        const tile2 = position.tile2 ? position.tile2.toUpperCase() : 'RIGHT';

        return (
            <article className="diamond-guide">
                <MediaQuery query={styleVariables.desktopAndAbove}>
                    {
                        tile1 === DG.LEFT &&
                        this.setDiamondTile(DG.TILE1, position)
                    }
                    {
                        tile2 === DG.LEFT &&
                        this.setDiamondTile(DG.TILE2, position)
                    }
                    {
                        tile1 === DG.RIGHT &&
                        this.setDiamondTile(DG.TILE1, position)
                    }
                    {
                        tile2 === DG.RIGHT &&
                        this.setDiamondTile(DG.TILE2, position)
                    }
                </MediaQuery>
                <MediaQuery query={styleVariables.desktopAndBelow}>
                    {
                        tile1Config.length === 1 &&
                        this.setDiamondTile(DG.TILE1, position)
                    }
                    {
                        tile2Config.length === 1 &&
                        this.setDiamondTile(DG.TILE2, position)
                    }
                    {
                        tile1Config.length > 1 &&
                        this.setDiamondTile(DG.TILE1, position)
                    }
                    {
                        tile2Config.length > 1 &&
                        this.setDiamondTile(DG.TILE2, position)
                    }
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

DiamondGuideMarketingTile.propTypes = {
    config: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired
};

export default connect(mapStateToProps)(DiamondGuideMarketingTile);
