// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';

/**
 * SaveCreation Component
 */
class SaveCreation extends React.Component {
    /**
     * Lifcycle hook
     * @returns {void}
     */
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const saveCreationLabels = this.props.isReset ? objectPath.get(window, 'tiffany.labels.byo.resetCreation', {}) : objectPath.get(window, 'tiffany.labels.byo.saveCreation', {});

        return (
            <div className="start-creation">
                <div className="start-creation__content">
                    <div className="start-creation__body">
                        <p className="start-creation__heading">{saveCreationLabels.heading}</p>
                        <p className="start-creation__description">{saveCreationLabels.text}</p>
                    </div>
                </div>
                <div className="start-creation__buttons">
                    <button type="button" className="start-creation__buttons_cancel" onClick={this.props.saveCreationClose}>{saveCreationLabels.cancelButton}</button>
                    <button type="button" className="start-creation__buttons_ok" onClick={this.props.saveCreation}>{saveCreationLabels.startButton}</button>
                </div>
                <button type="button" className="start-creation__close close-modal" onClick={this.props.closeModal} aria-label={saveCreationLabels.close}>
                    <span className="icon-Close" role="img" alt={saveCreationLabels.close} />
                </button>
            </div>
        );
    }
}

SaveCreation.propTypes = {
    saveCreationClose: PropTypes.func,
    saveCreation: PropTypes.func,
    closeModal: PropTypes.func,
    isReset: PropTypes.bool
};

SaveCreation.defaultProps = {
    saveCreationClose: () => {},
    saveCreation: () => {},
    closeModal: () => {},
    isReset: false
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        labels: state.authoredLabels,
        byo: state.byo
    };
};

export default connect(mapStateToProps)(SaveCreation);
