// Packages
import React from 'react';
import PropTypes from 'prop-types';

// import './index.scss';

/**
 * TiffanyChatWrapper component
 */
class TiffanyChatWrapper extends React.Component {
    /**
     * @description React life cycle method
     * @returns {Boolean} component should never update so returning false
     */
    shouldComponentUpdate() {
        return false;
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            chatWidgetID,
            customClass
        } = this.props;

        return (
            <div
                id={chatWidgetID}
                className={`chat-wrapper ${customClass}`}
            />
        );
    }
}

TiffanyChatWrapper.propTypes = {
    chatWidgetID: PropTypes.string.isRequired,
    customClass: PropTypes.string.isRequired
};

export default TiffanyChatWrapper;
