// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Style
// import './index.scss';

/**
 * Buy Online now and pick up in store Component
 */
class Bops extends React.Component {
    /**
     * @returns {object} Element
     */
    render() {
        const { bopsConfig } = this.props.pdpConfig;
        const htmlCallout = {
            interactionContext: '',
            interactionType: 'tab-activity',
            interactionName: 'buy-online-pick-up-in-store'
        };

        return (
            <div className="bops__container">
                {
                    bopsConfig.bopsRTE ?
                        <div
                            className="bops__container_detail"
                            dangerouslySetInnerHTML={{ __html: bopsConfig.bopsRTE }}
                        />
                        :
                        <p>
                            { bopsConfig.defaultBOPSLabel }
                        </p>
                }
                <a
                    href={bopsConfig.learnMoreUrl}
                    tabIndex={0}
                    target={bopsConfig.target ? bopsConfig.target : false}
                    className="bops__container_learnmore"
                    data-interaction-context={htmlCallout.interactionContext}
                    data-interaction-type={htmlCallout.interactionType}
                    data-interaction-name={htmlCallout.interactionName}
                >
                    <span className="cta-content" tabIndex={-1}>
                        <span className="cta-text">
                            {bopsConfig.learnMoreLabel}
                        </span>
                    </span>
                    <i className="icon-dropdown-right" />
                </a>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        pdpConfig: state.productDetails.pdpConfig
    };
};

Bops.propTypes = {
    pdpConfig: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Bops);
