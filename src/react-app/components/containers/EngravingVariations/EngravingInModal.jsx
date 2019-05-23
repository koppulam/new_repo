import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import objectPath from 'object-path';
import CustomScrollBar from 'components/common/CustomScrollBar';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

// Components
import TiffanyModal from 'components/common/TiffanyModal';
import Engraving from 'components/containers/Engraving';
import {
    findFirst,
    addClass,
    removeClass,
    hasClass
} from 'lib/dom/dom-util';

// import './index.scss';

/**
 * @description This component is generic to have engraving inside a tiffany modal.
 *              This component contains Engraving and Tiffany Modal integrated together so we will have to pass
 *              configurations for bothe the elements combined together
 * @class EngravingInModal
 */
class EngravingInModal extends React.Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.state = {
            showEngravingModal: props.isByo
        };

        const EMPTY_MODAL_PROPS = {
            overlay: true,
            className: '',
            closeClass: '',
            overlayClass: '',
            restrictBackgroundScroll: true,
            closeonTapOutside: false
        };
        const providedModalConfig = {
            ...EMPTY_MODAL_PROPS,
            overlay: this.props.hasOverlay,
            className: this.props.modalClass,
            closeClass: this.props.modalCloseClass,
            overlayClass: this.props.hasOverlay ? this.props.overlayClass.split(' ').join('') : '',
            restrictBackgroundScroll: this.props.restrictBackground,
            closeonTapOutside: this.props.closeonTapOutside
        };

        this.modalOptions = {
            overlay: providedModalConfig.overlay,
            className: `modal engraving has-input-elements engraving-in-modal ${providedModalConfig.className}`,
            closeClass: `close-modal ${providedModalConfig.closeClass}`,
            overlayClass: `${providedModalConfig.overlayClass !== '' ? providedModalConfig.overlayClass : 'ash-overlay'}`,
            blockMobileScrollability: providedModalConfig.restrictBackgroundScroll,
            blockDesktopScrollability: providedModalConfig.restrictBackgroundScroll,
            modalFocus: true,
            exitFocusRef: 'engravable-product__btn'
        };

        if (providedModalConfig.closeonTapOutside) {
            this.modalOptions.closeonTapOutside = {
                isClose: true,
                modalContainerClass: 'modal-content'
            };
        }
    }

    /**
     * @description Method to toggle engraving modal
     * @param {Boolean} showEngravingModal identifier to show/hide modal
     * @returns {void}
     */
    toggleModal(showEngravingModal = false) {
        this.setState({ showEngravingModal });
        if (!showEngravingModal) {
            this.props.onClose();
        }

        if (objectPath.get(this.props.aem, 'isEngravingExposed', false) && hasClass(findFirst('body'), 'ios')) {
            if (showEngravingModal) {
                addClass(findFirst('html'), 'tiffany-aem');
            } else {
                removeClass(findFirst('html'), 'tiffany-aem');
            }
        }
    }

    /**
     * @description Renders the Engraving Modal
     * @returns {HTML} html
     */
    renderModal() {
        return (
            <TiffanyModal
                visible={this.state.showEngravingModal}
                options={this.modalOptions}
                onClose={() => { this.toggleModal(false); }}
            >
                <Fragment>
                    <CustomScrollBar iosEnable>
                        {
                            !this.props.hasCustomAction &&
                            !this.props.editingEngraving &&
                            <Engraving
                                closeEngraving={() => { this.toggleModal(false); }}
                                sku={this.props.sku}
                                groupSku={this.props.groupSku}
                                hasSelfClose
                                hasCustomActionPrice={this.props.hasCustomActionPrice}
                                productBasePrice={this.props.productBasePrice}
                            />
                        }
                        {
                            this.props.hasCustomAction &&
                            !this.props.editingEngraving &&
                            <Engraving
                                closeEngraving={() => { this.toggleModal(false); }}
                                sku={this.props.sku}
                                groupSku={this.props.groupSku}
                                hasCustomAction
                                customBtnLabel={this.props.customBtnLabel}
                                customClosingAction={this.props.customClosingAction}
                                customActionButtonClass={this.props.customActionButtonClass}
                                hasSelfClose
                                hasCustomActionPrice={this.props.hasCustomActionPrice}
                                productBasePrice={this.props.productBasePrice}
                            />
                        }
                        {
                            this.props.editingEngraving &&
                            <Engraving
                                closeEngraving={() => { this.toggleModal(false); }}
                                sku={this.props.sku}
                                groupSku={this.props.groupSku}
                                editingEngraving
                                hasCustomAction={this.props.hasCustomAction}
                                customClosingAction={this.props.customClosingAction}
                                customBtnLabel={this.props.customBtnLabel}
                                hasSelfClose
                                initialOne={this.props.initialOne}
                                initialTwo={this.props.initialTwo}
                                initialThree={this.props.initialThree}
                                itemServiceTypeId={this.props.itemServiceTypeId}
                                styleCode={this.props.styleCode}
                                groupId={this.props.groupId}
                                productBasePrice={this.props.productBasePrice}
                                shoppingBagItemId={this.props.shoppingBagItemId}
                                hasCustomActionPrice={this.props.hasCustomActionPrice}
                            />
                        }
                    </CustomScrollBar>
                </Fragment>
            </TiffanyModal>
        );
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        if (objectPath.get(this.props.engraving, 'rawData.siteEngraving', []).length > 0) {
            return (
                <Fragment>
                    {!this.props.isByo &&
                        <div className={`engravable-product ${this.props.customButtonClass}`}>
                            {
                                this.props.buttonType.toLowerCase() === 'cta' &&
                                <button
                                    type="button"
                                    className="engravable-product__btn cta"
                                    onClick={() => { this.toggleModal(true); }}
                                    data-interaction-context=""
                                    data-interaction-type={AnalyticsConstants.ENGRAVING_TYPE}
                                    data-interaction-name={this.props.interactionName}
                                >
                                    <span className="cta-content" tabIndex={-1}>
                                        <span className="engravable-product__btn_label cta-text">
                                            {this.props.buttonLabel}
                                        </span>
                                    </span>
                                </button>
                            }
                            {
                                this.props.buttonType.toLowerCase() === 'button' &&
                                <button
                                    type="button"
                                    className="engravable-product__btn btn"
                                    onClick={() => { this.toggleModal(true); }}
                                    data-interaction-context=""
                                    data-interaction-type={AnalyticsConstants.ENGRAVING_TYPE}
                                    data-interaction-name={this.props.interactionName}
                                >
                                    {this.props.buttonLabel}
                                </button>
                            }
                        </div>
                    }
                    {this.renderModal()}
                </Fragment>
            );
        }
        return null;
    }
}

EngravingInModal.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    aem: PropTypes.object.isRequired,
    sku: PropTypes.string.isRequired,
    engraving: PropTypes.any.isRequired,
    groupSku: PropTypes.string,
    customButtonClass: PropTypes.string,
    buttonType: PropTypes.string,
    hasOverlay: PropTypes.bool,
    modalClass: PropTypes.string,
    modalCloseClass: PropTypes.string,
    overlayClass: PropTypes.string,
    restrictBackground: PropTypes.bool,
    closeonTapOutside: PropTypes.bool,
    hasCustomAction: PropTypes.bool,
    editingEngraving: PropTypes.bool,
    customClosingAction: PropTypes.func,
    customBtnLabel: PropTypes.string,
    isByo: PropTypes.bool,
    customActionButtonClass: PropTypes.string,
    initialOne: PropTypes.string,
    initialTwo: PropTypes.string,
    initialThree: PropTypes.string,
    itemServiceTypeId: PropTypes.string,
    styleCode: PropTypes.string,
    groupId: PropTypes.string,
    productBasePrice: PropTypes.string,
    shoppingBagItemId: PropTypes.string,
    onClose: PropTypes.func,
    hasCustomActionPrice: PropTypes.bool,
    interactionName: PropTypes.string.isRequired
};

EngravingInModal.defaultProps = {
    customButtonClass: '',
    groupSku: '',
    buttonType: 'cta',
    hasOverlay: true,
    modalClass: '',
    modalCloseClass: '',
    overlayClass: '',
    restrictBackground: true,
    closeonTapOutside: true,
    hasCustomAction: false,
    editingEngraving: false,
    customClosingAction: () => { },
    customBtnLabel: '',
    isByo: false,
    customActionButtonClass: '',
    initialOne: '',
    initialTwo: '',
    initialThree: '',
    itemServiceTypeId: '',
    styleCode: '',
    groupId: '',
    onClose: () => { },
    productBasePrice: '0',
    shoppingBagItemId: '',
    hasCustomActionPrice: false
};

const mapStateToProps = (state) => {
    return {
        aem: state.aem,
        engraving: state.engraving,
        interactionName: objectPath.get(state, 'aem.engraving.interactionName', '')
    };
};

export default connect(mapStateToProps)(EngravingInModal);
