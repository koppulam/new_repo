import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import objectPath from 'object-path';
import { connect } from 'react-redux';

import EngravingFooter from './EngravingFooter';

/**
 * @description Custom Engraving component
 * @class EngravingCustomization
 */
class EngravingCustomization extends Component {
    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentDidMount = () => {
        this.props.enableFocus();
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const heading = objectPath.get(this.props.labelsProvided, 'heading', false);
        const isdeliveryReturnsOpened = objectPath.get(this.props.labelsProvided, 'showDRAcrossEngraving', false);

        return (
            <div className="engraving-customization tf-g tf-g__wrap">
                <Fragment>
                    <div className="engraving-customization__content col__full">
                        <h3 className="engraving-customization__content_heading">{heading}</h3>
                        {
                            this.props.engraving.map((option, index) => (
                                <div className="engraving-customization__content_option" key={index.toString()}>
                                    <button
                                        type="button"
                                        className="cta"
                                        onClick={() => this.props.setEngraving({ ...option })}
                                        aria-label={option.label}
                                    >
                                        <span className="cta-content">
                                            <span className="cta-text" tabIndex="-1">{option.label}</span>
                                        </span>
                                        <span className="icon-dropdown-right-arrow" />
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                    <EngravingFooter isdeliveryReturnsOpened={isdeliveryReturnsOpened} />
                </Fragment>
            </div>
        );
    }
}

EngravingCustomization.propTypes = {
    engraving: PropTypes.array.isRequired,
    setEngraving: PropTypes.func.isRequired,
    enableFocus: PropTypes.func,
    labelsProvided: PropTypes.object
};

EngravingCustomization.defaultProps = {
    enableFocus: () => { },
    labelsProvided: {}
};

const mapStateToProps = (state) => {
    return {
        engraving: objectPath.get(state, 'engraving.configurator.availableEngravings', []),
        labelsProvided: objectPath.get(state, 'authoredLabels.engraving', {})
    };
};

export default connect(mapStateToProps)(EngravingCustomization);
