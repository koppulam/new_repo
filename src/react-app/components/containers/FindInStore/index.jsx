// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';

// import './index.scss';

/**
 * FindInStore component
 */
class FindInStore extends React.Component {
    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const findInStoreLabel = objectPath.get(window, 'tiffany.labels.findInStoreLabel', 'Find in Store');
        const ctaText = objectPath.get(this.props.pdpConfig, 'findInStoreConfig.ctaText', findInStoreLabel);

        return (
            <div className="find-in-store-component">
                <button
                    type="button"
                    className="find-in-store-component__button"
                >
                    <span className="find-in-store-component__button__text">{ctaText}</span>
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        pdpConfig: state.productDetails.pdpConfig
    };
};

FindInStore.propTypes = {
    pdpConfig: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(FindInStore);
