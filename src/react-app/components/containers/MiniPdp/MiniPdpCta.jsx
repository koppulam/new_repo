// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import replace from 'lodash/replace';

import { openMiniModalAction, toggleMiniPdpAction } from 'actions/MiniPdpModalAction';

// Style
import './index.scss';

/**
 * Mini PDP
 */
class MiniPdpCta extends React.Component {
    /**
     * @param {Object} evt event
     * @returns {void}
     */
    openMiniPdpModal = (evt) => {
        const { request } = this.props.aem && this.props.aem.miniPdpConfig;
        const { miniPdp } = this.props;
        const { skuId, groupId } = this.props;
        const { products } = miniPdp;
        const productId = groupId ? `${groupId}_${skuId}` : skuId;
        let url = (groupId === true || groupId === undefined || groupId === '') ? replace(request.url, 'group-GRP.', '') : replace(request.url, 'GRP', groupId);

        url = (skuId === true || skuId === undefined || skuId === '') ? replace(url, '.sku-SKU', '') : replace(url, 'SKU', skuId);

        const reqObj = {
            ...request,
            url
        };

        if (productId && products && !products[productId]) {
            this.props.dispatch(openMiniModalAction(reqObj, productId));
        } else {
            this.props.dispatch(toggleMiniPdpAction(productId));
        }
    }


    /**
     * @returns {object} Element
     */
    render() {
        const { ctaText } = this.props;

        return (
            <div className="mini-pdp">
                {
                    ctaText &&
                    <button type="button" onClick={this.openMiniPdpModal} className="mini-pdp__cta cta">
                        {ctaText}
                    </button>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        miniPdp: state.miniPdp,
        aem: state.aem,
        products: state.miniPdp.products
    };
};

MiniPdpCta.propTypes = {
    dispatch: PropTypes.func.isRequired,
    miniPdp: PropTypes.any,
    aem: PropTypes.any.isRequired,
    ctaText: PropTypes.string,
    skuId: PropTypes.any,
    groupId: PropTypes.any
};

MiniPdpCta.defaultProps = {
    miniPdp: {},
    ctaText: '',
    skuId: '',
    groupId: ''
};

export default connect(mapStateToProps)(MiniPdpCta);
