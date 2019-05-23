// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import classNames from 'classnames';

// Components
import ContentTile from 'components/common/ContentTile';
import Picture from 'components/common/Picture';

// import './index.scss';

/**
 * MarketingContentPictureTile Component
 */
class MarketingContentPictureTile extends React.Component {
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
     * @description Returns Picture tile with/without authorable URL and target.
     * @param {object} item It specifies the configuration of the picture tile.
     * @returns {object} React.Component
     */
    setPictureTile = (item) => {
        const ctaLink = objectPath.get(item, 'image.ctaLink', null);
        const ctaTarget = objectPath.get(item, 'image.ctaTarget', '');

        if (item.image) {
            const img = objectPath.get(item, 'image', {});

            return (ctaLink) ?
                <a
                    className={classNames('browse-grid-2x1-cta cta',
                        {
                            'hide-image': img.hideImageInMobile
                        })}
                    href={ctaLink}
                    target={ctaTarget}
                >
                    <Picture
                        sources={img.sources}
                        defaultSrc={img.defaultSrc}
                        altText={img.altText}
                        customClass={img.customClass}
                        isLazyLoad={img.isLazyLoad}
                    />
                </a> :
                <Picture
                    sources={img.sources}
                    defaultSrc={img.defaultSrc}
                    altText={img.altText}
                    customClass={img.customClass}
                    isLazyLoad={img.isLazyLoad}
                />;
        }
        return null;
    }

    /**
    * @description Returns Picture tile with/without authorable URL and target.
    * @param {object} config It specifies the configuration of the content, picture tile.
    * @returns {object} React.Component
    */
    setTextWithImage = (config) => {
        return (config) ?
            <div>
                {this.setPictureTile(config)}
                <ContentTile {...config.contentTile} />
            </div> : null;
    }

    /**
     * @description Returns Content tile or Picture tile conditionally based on the given type.
     * @param {Object} config It specifies the configuration object.
     * @returns {object} React.Component
     */
    setBrowseGridTile = (config) => {
        const type = this.props.type ? ((this.props.type).toUpperCase()) : '';
        let tile = '';

        if (type === 'IMAGE') {
            tile = this.setPictureTile(config);
        } else if (type === 'CONTENT_TILE') {
            tile = <ContentTile {...config.contentTile} />;
        } else if (type === 'TEXT_WITH_IMAGE') {
            tile = this.setTextWithImage(config);
        }

        return tile;
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const configuration = objectPath.get(this.state, 'config', {});

        return (
            <article className={classNames('marketing-content-picture-tile',
                {
                    [`${configuration.paddingBottom}`]: configuration.paddingBottom,
                    [`${configuration.paddingTop}`]: configuration.paddingTop,
                    [`${configuration.mobilePaddingBottom}`]: configuration.mobilePaddingBottom
                })}
            >
                {
                    Object.keys(configuration).length > 0 &&
                    this.setBrowseGridTile(configuration)
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

MarketingContentPictureTile.propTypes = {
    config: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired
};

export default connect(mapStateToProps)(MarketingContentPictureTile);
