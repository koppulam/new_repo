import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { checkAndSetToken } from 'actions/ApplicationActions';

import ErrorBoundary from 'components/common/ErrorBoundary';

/**
 * Component declaration.
 */
class ApplicationLayout extends React.Component {
    /**
     * set token.
     * @returns {void}
     */
    componentDidMount() {
        this.props.dispatch(checkAndSetToken());
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        return (
            <BrowserRouter>
                <div className="application-layout">
                    <ErrorBoundary />
                </div>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return state;
};

ApplicationLayout.propTypes = {
    dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(ApplicationLayout);
