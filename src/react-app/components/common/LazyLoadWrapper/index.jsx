// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';

import { toggle } from 'actions/InterceptorActions';

/**
 * LazyLoad component
 */
class LazyLoadWrapper extends React.Component {
    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            offset,
            children,
            height
        } = this.props;

        return (
            <LazyLoad
                offset={offset}
                height={height}
                once
                willUpdate={() => {
                    this.props.dispatch(toggle(false));
                }}
                didUpdate={() => {
                    this.props.dispatch(toggle(true));
                }}
            >
                {children}
            </LazyLoad>
        );
    }
}

LazyLoadWrapper.propTypes = {
    offset: PropTypes.any, // offset before entering viewport at which component starts to load
    height: PropTypes.any, // placeholder min height
    children: PropTypes.any.isRequired
};

LazyLoadWrapper.defaultProps = {
    offset: '300',
    height: '100'
};

const mapStateToProps = (state) => {
    return {
    };
};

export default connect(mapStateToProps)(LazyLoadWrapper);
