// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import isEmpty from 'lodash/isEmpty';

import AnalyticsConstants from 'constants/HtmlCalloutConstants';

// import './index.scss';

/**
 * CallSalesService component
 */
class InformationText extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        const {
            config,
            aem
        } = this.props;

        if (typeof config === 'string') {
            const isMatch = config.match(/pdpConfig./g);
            const key = isMatch ? objectPath.get(window.tiffany, config, '') : config;

            this.state = {
                config: aem[key] ? aem[key] : key
            };
        } else {
            this.state = {
                config: props.config
            };
        }
    }

    /**
     * Lifcycle hook for
     * @returns {void}
     */
    componentDidMount() {
        if (this.telephoneNumDOM) {
            const telephoneNumDOM = this.telephoneNumDOM.getElementsByClassName('text-phnumber');
            const { config } = this.state;

            if (telephoneNumDOM.length > 0) {
                const telephoneNumberTag = document.createElement('a');
                const phoneNumber = objectPath.get(config, 'telephoneNumber', '');
                const telephoneNumber = document.createTextNode(`${phoneNumber}`);
                const phoneContainer = document.createElement('span');

                phoneContainer.setAttribute('class', 'cta-content');
                phoneContainer.setAttribute('tabindex', '-1');
                phoneContainer.appendChild(telephoneNumber);

                telephoneNumberTag.setAttribute('href', `tel:+ ${phoneNumber}`);
                telephoneNumberTag.setAttribute('tabindex', '0');
                telephoneNumberTag.setAttribute('class', 'cta');
                telephoneNumberTag.appendChild(phoneContainer);
                telephoneNumberTag.setAttribute('data-interaction-context', '');
                telephoneNumberTag.setAttribute('data-interaction-type', AnalyticsConstants.PHONE);
                telephoneNumberTag.setAttribute('data-interaction-name', phoneNumber);
                telephoneNumDOM[0].innerHTML = '';
                telephoneNumDOM[0].appendChild(telephoneNumberTag);
            }
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            config
        } = this.state;
        const informationTextRTE = (config && config.informationTextRTE) ? config.informationTextRTE : config;
        const isEmptyInforText = isEmpty(informationTextRTE);

        return (
            isEmptyInforText ? null :
                <div className="information-text-component">
                    <div ref={el => { this.telephoneNumDOM = el; }} dangerouslySetInnerHTML={{ __html: informationTextRTE }} />
                </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem
    };
};


InformationText.propTypes = {
    config: PropTypes.any.isRequired,
    aem: PropTypes.any.isRequired
};

export default connect(mapStateToProps)(InformationText);
