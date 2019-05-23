import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import objectPath from 'object-path';
import { connect } from 'react-redux';
import { currencyFormatter } from 'lib/utils/currency-formatter';

import AddToCart from 'components/containers/ProductModifiers/AddToCart';
import EngravingFooter from './EngravingFooter';


/**
 * @description Custom Engraving component
 * @class Engravingconfirmation
 */
class EngravingConfirmation extends Component {
    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentDidMount = () => {
        this.props.enableFocus();
    }

    /**
     * @description Method to be triggered on clicking custom button on engraving
     * @returns {void}
     */
    customAction = () => {
        this.props.customClosingAction();
        this.props.closeModal();
    }

    /**
     * @description method to reset redux and call show the home page again
     * @returns {void}
     */
    startOver = () => {
        this.props.resetEngravings(() => {
            this.props.backHandler({ component: 'HOME', startEngraving: true, fromScreen: 'CONFIRMATION' });
        });
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            hasCustomAction,
            editingEngraving,
            addToCartConfig,
            labelsProvided,
            editConfig
        } = this.props;
        const heading = objectPath.get(labelsProvided, 'confirmationHeading', '');
        const isHeadingRTE = objectPath.get(labelsProvided, 'isConfirmationHeadingRTE', false);
        const back = objectPath.get(labelsProvided, 'backToEdit', '');
        const reset = objectPath.get(labelsProvided, 'startOver', '');
        const customLabel = this.props.customBtnLabel || objectPath.get(labelsProvided, 'customButtonLabel', '');
        const customAriaLabel = this.props.customButtonAriaLabel || objectPath.get(labelsProvided, 'customButtonAriaLabel', '');
        const addtoBagLabel = objectPath.get(labelsProvided, 'addToBag', '');
        const editLabel = objectPath.get(labelsProvided, 'editEngraving', {
            ariaLabel: 'Editing engraving',
            label: 'Edit Engraving'
        });
        const isdeliveryReturnsOpened = objectPath.get(labelsProvided, 'showDRInConfirmation', false);

        if (Object.keys(addToCartConfig).length === 0 && Object.keys(editConfig).length === 0) {
            console.warn('Add to bag config is missing in engraving configurations');
        }
        return (
            <div className="engraving-confirmation tf-g tf-g__wrap">
                <Fragment>
                    <div className="engraving-confirmation__content col__full">
                        {isHeadingRTE ?
                            <div
                                className="engraving-confirmation__content_heading tiffany-rte"
                                dangerouslySetInnerHTML={{ __html: heading }}
                            />
                            :
                            <h3
                                className="engraving-confirmation__content_heading"
                            >
                                {heading}
                            </h3>
                        }
                        <div className="engraving-confirmation__content_option">
                            <button type="button" className="cta" onClick={() => this.props.backHandler({ ...this.props.screenConfig.historyConfig, fromScreen: 'CONFIRMATION' })}>
                                <span className="cta-content" tabIndex="-1">
                                    <span className="icon-dropdown-left" />
                                    <span>{back}</span>
                                </span>
                            </button>
                        </div>
                        <div className="engraving-confirmation__content_option">
                            <button type="button" className="cta" onClick={this.startOver}>
                                <span className="cta-content" tabIndex="-1">
                                    <span className="icon-dropdown-left" />
                                    <span>{reset}</span>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="engraving-confirmation__bottom-wrapper col__full">
                        {
                            hasCustomAction && !this.props.hasCustomActionPrice &&
                            <button
                                type="button"
                                className={`engraving-confirmation__bottom-wrapper_custom-btn col__full btn-primary ${this.props.customClass}`}
                                onClick={this.customAction}
                                aria-label={customAriaLabel}
                            >
                                {customLabel}
                            </button>
                        }
                        {
                            hasCustomAction && this.props.hasCustomActionPrice &&
                            <button
                                type="button"
                                className={`engraving-confirmation__bottom-wrapper_custom-btn-price col__full tf-g tf-g__between btn-primary ${this.props.customClass}`}
                                onClick={this.customAction}
                                aria-label={customAriaLabel}
                            >
                                <span>{`${currencyFormatter(this.props.productBasePrice)} + ${currencyFormatter(this.props.variant.unitPrice)}`}</span>
                                <span>{customLabel}</span>
                            </button>
                        }
                        {
                            // Showing add to cart button only when we do not have custom actions
                            editingEngraving &&
                            !hasCustomAction &&
                            Object.keys(editConfig).length !== 0 &&
                            <AddToCart
                                addtocartconfig={editConfig}
                                successCallBack={this.props.closeModal}
                                showSplitUp
                                isEditEngraving
                                priceOverwrite={[this.props.productBasePrice, this.props.variant.unitPrice]}
                                buttonText={editLabel.label}
                                shoppingBagItemId={this.props.shoppingBagItemId}
                            />
                        }
                        {
                            // Showing add to cart button only when we do not have custom actions
                            !hasCustomAction &&
                            !editingEngraving &&
                            Object.keys(addToCartConfig).length !== 0 &&
                            <AddToCart
                                addtocartconfig={addToCartConfig}
                                successCallBack={this.props.closeModal}
                                priceOverwrite={[this.props.productPrice, (this.props.variant.unitPrice * this.props.variant.servicingQuantity)]}
                                showSplitUp
                                isEngraving
                                buttonText={addtoBagLabel}
                            />
                        }
                        <EngravingFooter isdeliveryReturnsOpened={isdeliveryReturnsOpened} />
                    </div>
                </Fragment>
            </div>
        );
    }
}

EngravingConfirmation.propTypes = {
    screenConfig: PropTypes.object,
    editConfig: PropTypes.object.isRequired,
    backHandler: PropTypes.func.isRequired,
    resetEngravings: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    addToCartConfig: PropTypes.object,
    variant: PropTypes.object,
    labelsProvided: PropTypes.object,
    hasCustomAction: PropTypes.bool,
    editingEngraving: PropTypes.bool,
    customBtnLabel: PropTypes.string,
    customButtonAriaLabel: PropTypes.string,
    customClosingAction: PropTypes.func,
    customClass: PropTypes.string,
    shoppingBagItemId: PropTypes.string,
    productBasePrice: PropTypes.number,
    productPrice: PropTypes.number,
    enableFocus: PropTypes.func,
    hasCustomActionPrice: PropTypes.bool
};

EngravingConfirmation.defaultProps = {
    screenConfig: {},
    hasCustomAction: false,
    editingEngraving: false,
    customBtnLabel: '',
    customClosingAction: () => { },
    customButtonAriaLabel: '',
    customClass: '',
    addToCartConfig: {},
    labelsProvided: {},
    variant: {},
    productBasePrice: 0,
    productPrice: 0,
    shoppingBagItemId: '',
    enableFocus: () => { },
    hasCustomActionPrice: false
};

const mapStateToProps = (state) => {
    return {
        screenConfig: objectPath.get(state, 'engraving.screenConfig', {
            historyConfig: 'HOME'
        }),
        engraving: objectPath.get(state, 'engraving.configurator.availableEngravings', []),
        labelsProvided: objectPath.get(state, 'authoredLabels.engraving', {}),
        addToCartConfig: objectPath.get(state, 'aem.addToCartConfig', {}),
        editConfig: objectPath.get(state, 'engraving.configurator.editConfiguration', {}),
        variant: objectPath.get(state, 'engraving.variant', {
            unitPrice: 0
        }),
        productPrice: objectPath.get(state, 'productDetails.productData.price', [0])[0]
    };
};

export default connect(mapStateToProps)(EngravingConfirmation);
