// Packages
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as objectPath from 'object-path';

/**
 * Ring not available Component for Engagement
 */
class RingUnavailable extends React.Component {
    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const labels = objectPath.get(this.props.aem, 'engagementpdp.ringNotAvailable', false);

        return labels ? (
            <article className="ring-unavailable">
                <h3 className="ring-unavailable_heading">{labels.statusText}</h3>
                <p className="ring-unavailable_desc">{labels.description}</p>
                <button
                    type="button"
                    className="ring-unavailable_btn"
                    onClick={this.props.redirectCallback}
                >
                    <span className="cta-content">
                        <span className="cta-text" tabIndex="-1">{labels.ctaText}</span>
                    </span>
                    <i className="icon-dropdown-right" />
                </button>
                <button type="button" className="close-modal icon-Close" aria-label="click to close" onClick={this.props.redirectCallback} />
            </article>
        ) : null;
    }
}

RingUnavailable.propTypes = {
    aem: PropTypes.object.isRequired,
    redirectCallback: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem
    };
};

export default connect(mapStateToProps)(RingUnavailable);
