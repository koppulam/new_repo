// Packages
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import styleVariables from 'lib/utils/breakpoints';
import classNames from 'classnames';
import { findFirst } from 'lib/dom/dom-util';

import StoreDetail from 'components/containers/ProductAvailability/StoreDetail';
import TiffanyInlineModal from 'components/common/TiffanyInlineModal';

// import './index.scss';

/**
 * Component declaration.
 */
class PdpModal extends Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            modalCloseInit: false,
            initEle: null
        };
    }

    /**
     * @description modal close init
     * @returns {void}
     */
    closeInit = () => {
        this.setState({ modalCloseInit: true });
    }

    /**
     * @description button ref
     * @returns {void}
     */
    storeModalInit = () => {
        const storebutton = findFirst('.find-in-store');

        if (storebutton) {
            this.setState({ initEle: storebutton });
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        return (
            <MediaQuery query={styleVariables.desktopAndAbove}>
                <div className={classNames('pdp__modal', {
                    'is-open': this.props.isOpen
                })
                }
                >
                    <TiffanyInlineModal
                        showModal={this.props.isOpen}
                        holder="pdp__modal"
                        focusElement={false}
                        childComponentInit={this.storeModalInit}
                        triggerElement={this.state.initEle}
                        hideClose
                        closeInit={this.state.modalCloseInit}
                    >
                        <StoreDetail bops={this.props.bops} closeInit={this.closeInit} />
                    </TiffanyInlineModal>
                </div>
            </MediaQuery>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isOpen: state.giftCard.checkBalanceIsOpen || ((state.findStore.storeDetailStatus || state.findStore.changeStoreStatus) && !state.giftCard.isMobileModal)
    };
};

PdpModal.propTypes = {
    bops: PropTypes.any.isRequired,
    isOpen: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(PdpModal);
