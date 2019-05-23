import React from 'react';
import PropTypes from 'prop-types';

import JSRecaptcha from 'lib/utils/recaptcha';
import uuid from 'uuid/v4';

/**
 * @description React component to show modal with dynamic content
 */
class TiffanyRecaptcha extends React.Component {
    /**
     * @param {*} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.recaptchaInstance = null;
        this.state = {
            recaptchaHolderId: uuid()
        };
    }

    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentDidMount() {
        this.recaptchaInstance = new JSRecaptcha(this.state.recaptchaHolderId, this.props.siteKey, null, null, this.callBack);
        this.recaptchaInstance.render();
    }

    /**
     * @description fetches the recaptcha response
     * @returns {string} retuns a response
     */
    getResponse() {
        return this.recaptchaInstance.getResponse();
    }

    /**
     * @description Callback function for js recaptcha to call after execution
     * @param {string} token to be used for server verifications
     * @returns {void}
     */
    callBack = (token) => {
        this.props.callback(token);
    }

    /**
     * @description will execute on parent call
     * @returns {void}
     */
    execute = () => {
        this.recaptchaInstance.execute();
    }

    /**
     * @description will reset widget on parent call
     * @returns {void}
     */
    reset = () => {
        this.recaptchaInstance.reset();
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        return (
            <React.Fragment>
                {this.props.children}
                <div id={this.state.recaptchaHolderId} className="recaptcha-holder" />
            </React.Fragment>
        );
    }
}

TiffanyRecaptcha.propTypes = {
    callback: PropTypes.func,
    siteKey: PropTypes.string.isRequired,
    children: PropTypes.any
};

TiffanyRecaptcha.defaultProps = {
    callback: () => { },
    children: null
};

export default TiffanyRecaptcha;
