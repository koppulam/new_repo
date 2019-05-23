// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import classNames from 'classnames';
import * as objectPath from 'object-path';

// Components
import Picture from 'components/common/Picture';

/**
 * Product Carousel Component
 */
class ClaspMessage extends React.Component {
    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const claspLabels = objectPath.get(window, 'tiffany.labels.byo.clasp', {});
        const {
            notification,
            rte,
            cancel,
            acknowledge,
            closeText
        } = claspLabels;

        return (
            <div className="clasp-message">
                <div className="clasp-message__content">
                    <div className="clasp-message__body">
                        <p className="clasp-message__note">{notification}</p>
                        <div className="clasp-message__description" dangerouslySetInnerHTML={{ __html: rte.colpoClaspMessage }} />
                    </div>
                    {
                        Object.keys(this.props.byo.claspDetails).length > 0 &&
                        <div className="clasp-message__image">
                            <div className="clasp-message__image_container">
                                <Picture
                                    sources={[]}
                                    defaultSrc={this.props.byo.claspDetails.imageUrl}
                                    altText={this.props.byo.claspDetails.imageAlt}
                                    isLazyLoad={false}
                                />
                            </div>
                            <div className="clasp-message__image_details">
                                <p className="clasp-message__image_details_title">{this.props.byo.claspDetails.title}</p>
                                <p className="clasp-message__image_details_price">{this.props.byo.claspDetails.price}</p>
                            </div>
                        </div>
                    }
                </div>
                <div className="clasp-message__buttons">
                    <button type="button" className="clasp-message__buttons_cancel" aria-label={cancel} onClick={this.props.colpoCloseHandler}>{cancel}</button>
                    <button type="button" className="clasp-message__buttons_ok" aria-label={acknowledge} onClick={this.props.acknowledgeClasp}>{acknowledge}</button>
                </div>
                <button type="button" className="clasp-message__close close-modal" onClick={this.props.colpoCloseHandler} aria-label={closeText}>
                    <span className="icon-Close" role="img" alt={closeText} />
                </button>
            </div>
        );
    }
}

ClaspMessage.propTypes = {
    byo: PropTypes.object.isRequired,
    colpoCloseHandler: PropTypes.func,
    acknowledgeClasp: PropTypes.func
};

ClaspMessage.defaultProps = {
    colpoCloseHandler: () => {},
    acknowledgeClasp: () => {}
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        labels: state.authoredLabels,
        byo: state.byo
    };
};

export default connect(mapStateToProps)(ClaspMessage);
