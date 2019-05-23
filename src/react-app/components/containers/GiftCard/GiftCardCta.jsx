// Packages
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { findFirst, addClass, removeClass } from 'lib/dom/dom-util';
import { scrollTo } from 'lib/utils/scroll-to-content';
import * as matchMedia from 'lib/dom/match-media';

// components
import GiftCardBalanceModal from 'components/containers/GiftCard/GiftCardBalanceModal';
import TiffanyInlineModal from 'components/common/TiffanyInlineModal';

import { resetCheckBalance } from 'actions/GiftCardActions';
// import './index.scss';

/**
 * GiftCard CTA Component
 */
class GiftCardCta extends React.Component {
    /**
     * @param {*} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.state = {
            checkBalanceIsOpen: false
        };
        this.triggerElement = React.createRef();
    }

    /**
     * @returns {void}
     */
    hideAvailabilityButtons = () => {
        const buttonContainer = findFirst('.product-description__buttons');

        addClass(buttonContainer, 'hide');
        addClass(findFirst('.check-balance-modal-holder'), 'check-balance__modal-open');
    }

    /**
     * @returns {void}
     */
    showAvailabilityButtons = () => {
        const buttonContainer = findFirst('.product-description__buttons');

        this.setState({
            checkBalanceIsOpen: false
        });
        removeClass(buttonContainer, 'hide');
        removeClass(findFirst('.check-balance-modal-holder'), 'check-balance__modal-open');
        this.props.dispatch(resetCheckBalance());
    }

    /**
     * @returns {void}
     */
    openGiftCardCheckBalanceModal = () => {
        const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;

        this.setState({
            checkBalanceIsOpen: true
        });

        if (isDesktop) {
            scrollTo('.pdp-container');
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const { giftCardCheckBalanceLabel } = this.props.pdpConfig.giftCardConfig;
        const { giftCardConfig } = this.props.pdpConfig;

        return (
            <React.Fragment>
                <button
                    type="button"
                    aria-label={giftCardCheckBalanceLabel}
                    className="check-balance__cta cta"
                    onClick={this.openGiftCardCheckBalanceModal}
                    ref={this.triggerElement}
                >
                    <span className="cta-content hover-cta" tabIndex="-1">
                        <span className="cta-text">
                            {giftCardCheckBalanceLabel}
                        </span>
                        <i className="icon-dropdown-down" />
                    </span>
                </button>
                <TiffanyInlineModal
                    showModal={this.state.checkBalanceIsOpen}
                    holder="product-description__container"
                    customClass="check-balance has-input-elements"
                    showLeftArrow
                    triggerElement={this.triggerElement.current}
                    closeAriaLabel={giftCardConfig.closeAriaLabel}
                    leftArrowAriaLabel={giftCardConfig.closeAriaLabel}
                    childComponentInit={this.hideAvailabilityButtons}
                    resetInitiator={this.showAvailabilityButtons}
                    focusElement={false}
                    containerClass="check-balance-modal-holder"
                >
                    <GiftCardBalanceModal />
                </TiffanyInlineModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        checkBalanceIsOpen: state.giftCard.checkBalanceIsOpen,
        pdpConfig: state.productDetails.pdpConfig
    };
};

GiftCardCta.propTypes = {
    pdpConfig: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(GiftCardCta);
