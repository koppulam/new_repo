// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import classNames from 'classnames';

// Components
import Picture from 'components/common/Picture';
import ContentTile from 'components/common/ContentTile';

/**
 * TextWithImage Component
 */
class TextWithImage extends React.Component {
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
    * @description getPicture method is used to return the picture component.
    * @param {object} image The image object contains the config object related to image.
    * @returns {void}
    */
    getPicture = (image) => {
        return (<Picture
            {...image}
        />);
    }

    /**
    * @description contentTile method is used to return the ContentTile component.
    * @param {object} contentTile The text object contains the config object related to ContentTile.
    * @returns {void}
    */
    getContentTile = (contentTile) => {
        return (<ContentTile
            {...contentTile}
        />);
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const config = objectPath.get(this.state, 'config', {});
        const textPosition = objectPath.get(this.state, 'config.textPosition', '');
        const image = objectPath.get(this.state, 'config.image', {});
        const contentTile = objectPath.get(this.state, 'config.contentTile', {});
        const position = textPosition ? textPosition.toUpperCase() : '';

        return (
            <article className="text-with-image-component">
                {
                    position === 'RIGHT' &&

                    <div className={
                        classNames(`container--2 content-band--60x40 content-with-image ${config.paddingClass ? config.paddingClass : ''}`,
                            {
                                'text-inset': config.textInset,
                                'text-inset-mobile': config.textInsetMobile,
                                'text-inset-bg': config.textInsetBg
                            })
                    }
                    >
                        <div className="band-item image">
                            {this.getPicture(image)}
                        </div>
                        <div className="band-item content">
                            {this.getContentTile(contentTile)}
                        </div>
                    </div>
                }
                {
                    position === 'LEFT' &&

                    <div className={
                        classNames(`container--2 content-band--40x60 content-with-image ${config.paddingClass ? config.paddingClass : ''}`,
                            {
                                'text-inset': config.textInset,
                                'text-inset-mobile': config.textInsetMobile,
                                'text-inset-bg': config.textInsetBg
                            })
                    }
                    >
                        <div className="band-item content">
                            {this.getContentTile(contentTile)}
                        </div>
                        <div className="band-item image">
                            {this.getPicture(image)}
                        </div>
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

TextWithImage.propTypes = {
    config: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired
};

export default connect(mapStateToProps)(TextWithImage);
