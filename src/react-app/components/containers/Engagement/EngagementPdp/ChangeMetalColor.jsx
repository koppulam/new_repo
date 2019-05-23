// Packages
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as objectPath from 'object-path';
import ContentTile from 'components/common/ContentTile';

/**
 * Ring not available Component for Engagement
 */
class ChangeMetalColor extends React.Component {
    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const config = objectPath.get(this.props.aem, 'engagementpdp.changeMetalColorConfig', {});
        const closeAriaLabel = objectPath.get(window.tiffany, 'labels.closeBtnAraiLabel', 'click to close');

        return config ?
            <article className="change-metal-color">
                <button type="button" className="close-modal icon-Close" aria-label={closeAriaLabel} onClick={this.props.closeModal} />
                <ContentTile
                    heading={config.heading}
                    description={config.description}
                    ctaLink={this.props.url}
                    ctaTarget={this.props.target}
                    ctaText={config.ctaText}
                    ctaOneStyle={config.ctaOneStyle}
                />
                <div className="change-metal-color_cta">
                    <button type="button" className="change-metal-color_cta_cancel cta" onClick={this.props.closeModal}>
                        <span className="cta-content">
                            <span className="cta-text" tabIndex={-1}>
                                {config.cancelCtaText}
                            </span>
                        </span>
                    </button>
                </div>
            </article> : null;
    }
}

ChangeMetalColor.propTypes = {
    aem: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    url: PropTypes.string,
    target: PropTypes.string
};

ChangeMetalColor.defaultProps = {
    url: '/',
    target: ''
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem
    };
};

export default connect(mapStateToProps)(ChangeMetalColor);
