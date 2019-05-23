// Packages
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import objectPath from 'object-path';

import { findFirst, addClass } from 'lib/dom/dom-util';

/**
 * Concierge Cta Component
 */
class ConciergeCta extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.conciergeButton = React.createRef();
    }

    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentDidMount() {
        const showContactCta = objectPath.get(window, 'tiffany.authoredContent.conciergeFlyoutConfig.showContactCta', false);
        const iOSdevice = navigator.userAgent.match(/iPhone|iPad|iPod/i);
        const backToTop = findFirst('.back-to-top');
        const conciergeCta = findFirst('.concierge-cta');

        if (showContactCta && iOSdevice) {
            addClass(backToTop, 'back-btn-ios');
            addClass(conciergeCta, 'concierge-cta-ios');
        }
    }

    /**
    * @description On props changed life cycle event
    * @param {object} newProps updated params
    * @returns {void}
    */
    componentWillReceiveProps = (newProps) => {
        if (this.props.showFlyout !== newProps.showFlyout) {
            if (this.props.showFlyout && this.conciergeButton.current) {
                this.conciergeButton.current.focus();
            }
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const { toggleConciergeFlyout } = this.props;
        const ctaText = objectPath.get(window, 'tiffany.authoredContent.conciergeFlyoutConfig.ctaTextLabel', 'contact');
        const ctaIcon = objectPath.get(window, 'tiffany.authoredContent.conciergeFlyoutConfig.ctaIcon');
        const htmlCallout = {
            dataNavContext: 'sticky-right',
            dataNavType: 'concierge',
            dataNavName: ''
        };

        return (
            <div
                className="concierge-cta"
                role="button"
                tabIndex={0}
                onClick={toggleConciergeFlyout}
                onKeyPress={toggleConciergeFlyout}
                data-nav-context={htmlCallout.dataNavContext}
                data-nav-type={htmlCallout.dataNavType}
                data-nav-name={htmlCallout.dataNavName}
                ref={this.conciergeButton}
            >
                <img
                    className="concierge-cta__icon"
                    src={ctaIcon}
                    alt="Contact CTA"
                />
                <span className="concierge-cta__text">{ctaText}</span>
            </div>
        );
    }
}

ConciergeCta.propTypes = {
    toggleConciergeFlyout: PropTypes.func.isRequired,
    showFlyout: PropTypes.bool.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        showFlyout: state.conciergeFlyout.showFlyout
    };
};

export default connect(mapStateToProps)(ConciergeCta);
