import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/**
 * @description Component that will wrap all react componnets toa void errors
 * @class ErrorBoundary
 */
class ErrorBoundary extends React.Component {
    /**
     * @description The component constructor
     * @param {object} props Defaultprops
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    /**
     * @description lifecycle hook
     * @returns {void}
     */
    shouldComponentUpdate() {
        return true;
    }

    /**
     * @description lifecycle hook method to handle errros
     * @returns {void}
     */
    componentDidCatch() {
        this.setState({ hasError: true });
    }

    /**
     * @returns {*} component to render
     */
    render() {
        const { children } = this.props;
        const { hasError } = this.state;

        return hasError ? null : children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.any.isRequired
};

const mapStateToProps = (state) => {
    return {
    };
};

export default connect(mapStateToProps)(ErrorBoundary);
