// Packages
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as objectPath from 'object-path';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import MediaQuery from 'react-responsive';
import isEqual from 'lodash/isEqual';
import { scrollTo } from 'lib/utils/scroll-to-content';
import CustomScrollBar from 'components/common/CustomScrollBar';

import styleVariables from 'lib/utils/breakpoints';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

import {
    removeCharmFromFixture,
    removeFixture,
    addChainModal,
    editCharmSelected,
    selectedcharmOnFixture,
    saveDesign,
    ctxClicked,
    setCharmEngravingIndex,
    AddToBagSilhouette,
    AddToWishListSilhouette,
    saveDrawer
} from 'actions/BYOActions';

// Components
import Picture from 'components/common/Picture';
import WishList from 'components/containers/WishList';
import { currencyFormatter } from 'lib/utils/currency-formatter';

// Style
// import './index.scss';

/**
 * Buy Online now and pick up in store Component
 */
class Drawer extends React.Component {
    /**
     * @constructor
     * @param {*} props component props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            showDrawer: false,
            showDrawerButton: false,
            disableNameSaveBtn: true,
            saveInpVal: '',
            isDesignSaved: false
        };
    }

    /**
     * @description Life cycle hook
     * @returns {void}
     */
    componentDidMount() {
        setTimeout(() => {
            this.setState({ showDrawerButton: this.props.byo.byoEditMode });
        }, 1000);
    }

    /**
     * @description Life cycle hook
     * @param {any} nextProps Next Props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.byo.byoEditMode !== this.props.byo.byoEditMode) {
            if (!nextProps.byo.byoEditMode) {
                this.setState({ showDrawerButton: nextProps.byo.byoEditMode });
            } else {
                this.clearTimeOut = setTimeout(() => {
                    this.setState({ showDrawerButton: nextProps.byo.byoEditMode });
                }, 1000);
            }
        }

        if (!isEqual(nextProps.byo.urlUniqueID, this.props.byo.urlUniqueID)) {
            const appendPath = objectPath.get(window, 'tiffany.authoredContent.byoConfig.baseBYOUrl', '/');
            const curatedByoUrl = objectPath.get(window, 'tiffany.authoredContent.byoConfig.curatedByoUrl', '/');

            this.setState({
                saveInpVal: curatedByoUrl + nextProps.byo.urlUniqueID
            });
            window.history.pushState(null, true, appendPath + nextProps.byo.urlUniqueID);
        }

        if (!isEqual(nextProps.byo.designID, this.props.byo.designID)) {
            if (nextProps.byo.designID) {
                const appendPath = objectPath.get(window, 'tiffany.authoredContent.byoConfig.baseBYOUrl', '/');
                const designIdIdentifier = objectPath.get(window, 'tiffany.authoredContent.byoConfig.designIdIdentifier', '');

                window.history.pushState(null, true, appendPath + designIdIdentifier + nextProps.byo.designID);
            } else {
                this.setState({ isDesignSaved: false });
            }
        }

        if (!isEqual(nextProps.customItemsList, this.props.customItemsList)) {
            let isSaved = false;

            if (nextProps.customItemsList.length > 0) {
                nextProps.customItemsList.forEach((item) => {
                    if (item.designID === this.props.byo.designID) {
                        isSaved = true;
                    }
                });
            }
            this.setState({ isDesignSaved: isSaved });
        }
    }

    /**
     * @description show/hide drawer
     * @returns {void}
     */
    toggleDrawer = () => {
        this.setState({
            showDrawer: !this.state.showDrawer
        }, () => {
            if (this.state.showDrawer) {
                scrollTo('body');
            }
            this.props.drawerOpened(this.state.showDrawer);
        });
    }

    /**
     * @description validates design name input
     * @param {Event} e Event object
     * @returns {void}
     */
    validateInput = (e) => {
        if (e.currentTarget && e.currentTarget.value.length) {
            this.setState({
                disableNameSaveBtn: false,
                saveInpVal: e.currentTarget.value
            });
        } else {
            this.setState({
                disableNameSaveBtn: true,
                saveInpVal: ''
            });
        }
    }

    /**
     * @description proceed to bag
     * @param {Boolean} isPriceHidden isPriceHidden
     * @returns {void}
     */
    proceedToBag = (isPriceHidden) => {
        if (isPriceHidden) {
            if (!this.state.isDesignSaved) {
                if (this.props.byo.selectedFixture.isSilhouette) {
                    this.props.dispatch(AddToWishListSilhouette());
                } else {
                    this.props.dispatch(saveDesign('', false));
                }
            }
        } else if (this.props.byo.selectedFixture.isSilhouette) {
            this.props.dispatch(AddToBagSilhouette());
        } else {
            this.props.dispatch(saveDesign('', true));
        }
    }

    /**
     * @returns {object} Element
     */
    render() {
        const {
            drawerHeading,
            closeDrawerText,
            drawerBackToTray,
            addToBag,
            updateBag,
            slideUpIconAltText,
            closeDrawerLabel,
            openDrawerLabel,
            slideDownIconAltText,
            removeItemLabel,
            personalize,
            edit,
            saveDesignName,
            variations,
            showDetails,
            saveToWishList,
            priceLabel
        } = objectPath.get(window, 'tiffany.labels.byo.drawer', {});
        const drawerData = objectPath.get(this.props.byo, 'drawerData', []);
        const chainLabel = this.props.byo.selectedFixture.isSilhouette ? objectPath.get(window, 'tiffany.labels.byo.drawer.addChain', 'Add Chain') : objectPath.get(window, 'tiffany.labels.byo.drawer.changeChain', 'Change Chain');
        const isClaspRequired = this.props.byo.isClaspEnabled && drawerData.length > 1;
        const claspData = objectPath.get(this.props.byo, 'claspDetails', {});
        const claspLength = drawerData.length - 1;
        const totalPrice = currencyFormatter(objectPath.get(this.props.byo, 'saveData.price', '0'));
        const showSaveDesignName = objectPath.get(window, 'tiffany.authoredContent.byoConfig.isCurationAllowed', false);
        const hideDesignName = objectPath.get(this.props.byo, 'selectedFixture.isSilhouette', false) && !objectPath.get(this.props.byo, 'drawerData', []).length === 0;
        const hasUrlUniqueId = objectPath.get(this.props.byo, 'urlUniqueID', false);
        const saveNameBtnText = hasUrlUniqueId ? objectPath.get(saveDesignName, 'buttonSavedText', 'Saved') : objectPath.get(saveDesignName, 'buttonSaveText', 'Save');
        const htmlCallout = {
            interactionContext: '',
            interactionType: AnalyticsConstants.CHARM,
            interactionNameEdit: AnalyticsConstants.EDIT,
            interactionNamePersonalize: AnalyticsConstants.PERSONALIZE
        };
        const isPriceVisible = (this.props.byo.selectedFixture.isPurchasable || this.props.byo.selectedFixture.isSilhouette) && objectPath.get(this.props.aem, 'byoConfig.isEcommEnabled', false);
        const sizeText = objectPath.get(window, 'tiffany.labels.byo.variations.sizeText', '');

        return (
            <div
                className={classNames('drawer',
                    {
                        opened: this.state.showDrawer,
                        hide: !this.props.byo.byoEditMode
                    })
                }
            >
                <div
                    className={classNames('drawer-container',
                        {
                            opened: this.state.showDrawer
                        })
                    }
                >
                    <div
                        className="drawer__modal"
                    >
                        <CustomScrollBar>
                            <div className="drawer__modal_top-section">
                                <h3 className="drawer__modal_top-section_heading">{drawerHeading}</h3>
                                <MediaQuery query={styleVariables.desktopTabletAbove}>
                                    <button
                                        type="button"
                                        className="drawer__modal_top-section_close"
                                        onClick={this.toggleDrawer}
                                        aria-label={this.state.showDrawer ? closeDrawerLabel : openDrawerLabel}
                                    >
                                        {closeDrawerText}
                                    </button>
                                </MediaQuery>
                                <MediaQuery query={styleVariables.belowDesktopTablet}>
                                    <button
                                        type="button"
                                        className="drawer__modal_top-section_close"
                                        onClick={this.toggleDrawer}
                                        aria-label={this.state.showDrawer ? closeDrawerLabel : openDrawerLabel}
                                    >
                                        {drawerBackToTray}
                                    </button>
                                </MediaQuery>
                            </div>
                            {
                                showSaveDesignName &&
                                !hideDesignName &&
                                <div className="drawer__modal_items save-design">
                                    <div className="drawer__modal_items_image">
                                        <div className="drawer__modal_items_image_container">
                                            <label className="drawer__modal_items_image_container_label" htmlFor="saveDesign">{saveDesignName.heading}</label>
                                            <input
                                                className="drawer__modal_items_image_container_input"
                                                id="saveDesign"
                                                type="text"
                                                placeholder={saveDesignName.placeholder}
                                                onChange={this.validateInput}
                                                value={this.state.saveInpVal}
                                            />
                                        </div>
                                        <div className="drawer__modal_items_image_details">
                                            <button
                                                type="button"
                                                className="drawer__modal_items_image_details_btn"
                                                onClick={() => this.props.dispatch(saveDesign(this.state.saveInpVal))}
                                                disabled={this.state.disableNameSaveBtn || hasUrlUniqueId}
                                            >
                                                <span className="cta-content">
                                                    <span className="cta-text" tabIndex={-1}>{saveNameBtnText}</span>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                drawerData.length > 0 &&
                                drawerData.map((item, index) => {
                                    const isSilhouette = (index === 0 && this.props.byo.selectedFixture.isSilhouette);
                                    const hasFixtureVariation = (index === 0 && !this.props.byo.selectedFixture.isSilhouette && objectPath.get(item, sizeText, false));
                                    const selectedVariation = hasFixtureVariation ? objectPath.get(item, sizeText, false) : objectPath.get(item, 'variation.selectedVariation.linkText', false);
                                    const hasCharmVariation = objectPath.get(item, 'variation.type', false);
                                    const variationName = hasFixtureVariation ? variations[sizeText].name : (hasCharmVariation && variations[objectPath.get(item, 'variation.type', '').toLowerCase()].name);

                                    return (
                                        <div className="drawer__modal_items" key={index.toString()}>
                                            <div className="drawer__modal_items_image">
                                                <div className="drawer__modal_items_image_container">
                                                    <Picture
                                                        sources={[]}
                                                        defaultSrc={item.image ? item.image : item.imageURL}
                                                        altText={item.altText}
                                                        isLazyLoad={false}
                                                    />
                                                </div>
                                                <div className="drawer__modal_items_image_details">
                                                    <div className="wrapper">
                                                        <p className="drawer__modal_items_image_details_title">
                                                            {item.title ? item.title : item.name}
                                                            {
                                                                !isSilhouette &&
                                                                <span
                                                                    className="icon-Close"
                                                                    role="button"
                                                                    tabIndex={0}
                                                                    aria-label={removeItemLabel}
                                                                    onClick={() => {
                                                                        if (index === 0) {
                                                                            this.props.dispatch(removeFixture());
                                                                            this.props.dispatch(saveDrawer());
                                                                        } else {
                                                                            this.props.dispatch(removeCharmFromFixture(item.fixtureIndex));
                                                                        }
                                                                    }}
                                                                    onKeyPress={() => {
                                                                        if (index === 0) {
                                                                            this.props.dispatch(removeFixture());
                                                                            this.props.dispatch(saveDrawer());
                                                                        } else {
                                                                            this.props.dispatch(removeCharmFromFixture(item.fixtureIndex));
                                                                        }
                                                                    }}
                                                                />
                                                            }
                                                        </p>
                                                        {
                                                            selectedVariation &&
                                                            <p className="drawer__modal_items_image_details_size">
                                                                {variationName}
                                                                {selectedVariation}
                                                            </p>
                                                        }
                                                        <p className="drawer__modal_items_image_details_price">
                                                            {/* eslint-disable-next-line */}
                                                            {currencyFormatter(item.price)}{item.selectedEngraving ? ` + ${currencyFormatter(objectPath.get(item, 'selectedEngraving.unitPrice', 0))}` : ''}
                                                        </p>
                                                    </div>
                                                    {
                                                        (!isSilhouette || item.hasVariation || item.hasEngraving) &&
                                                        <div className="drawer__modal_items_image_details_actions">
                                                            <div className="cta-actions">
                                                                {
                                                                    !isSilhouette &&
                                                                    <WishList
                                                                        sku={item.hasVariation ? item.selectedSku : item.defaultSku || item.sku}
                                                                    />
                                                                }
                                                                <div className="drawer__modal_items_image_details_actions-container">
                                                                    {
                                                                        item.hasVariation &&
                                                                        <button
                                                                            type="button"
                                                                            className={`cta drawer__modal_items_image_details_actions${index}`}
                                                                            onClick={(e) => {
                                                                                this.props.dispatch(editCharmSelected(true, `drawer__modal_items_image_details_actions${index}`));
                                                                                this.props.dispatch(selectedcharmOnFixture(item.fixtureIndex));
                                                                            }}
                                                                            data-interaction-context={htmlCallout.interactionContext}
                                                                            data-interaction-type={htmlCallout.interactionType}
                                                                            data-interaction-name={htmlCallout.interactionNameEdit}
                                                                        >
                                                                            <span className="cta-content">
                                                                                <span className="cta-text" tabIndex={-1}>{edit}</span>
                                                                            </span>
                                                                            <span className="icon-dropdown-right-arrow" role="img" alt={edit} />
                                                                        </button>
                                                                    }
                                                                    {
                                                                        item.hasEngraving &&
                                                                        <button
                                                                            type="button"
                                                                            className="cta"
                                                                            data-interaction-context={htmlCallout.interactionContext}
                                                                            data-interaction-type={htmlCallout.interactionType}
                                                                            data-interaction-name={htmlCallout.interactionNamePersonalize}
                                                                            onClick={() => {
                                                                                this.props.dispatch(setCharmEngravingIndex(item.fixtureIndex));
                                                                                this.props.dispatch(ctxClicked());
                                                                            }}
                                                                        >
                                                                            <span className="cta-content">
                                                                                <span className="cta-text" tabIndex={-1}>{personalize}</span>
                                                                            </span>
                                                                            <span className="icon-dropdown-right-arrow" role="img" alt={personalize} />
                                                                        </button>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        index === 0 &&
                                                        <button
                                                            type="button"
                                                            className="drawer__modal_items_image_details_chain"
                                                            onClick={() => this.props.dispatch(addChainModal(true, 'drawer__modal_items_image_details_chain'))}
                                                        >
                                                            <span className="cta-content">
                                                                <span className="cta-text" tabIndex={-1}>{chainLabel}</span>
                                                            </span>
                                                            <span className="icon-Add" role="img" alt={chainLabel} />
                                                        </button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            {
                                isClaspRequired &&
                                Object.keys(claspData).length > 0 &&
                                <div className="drawer__modal_items">
                                    <div className="drawer__modal_items_image">
                                        <div className="drawer__modal_items_image_container">
                                            <Picture
                                                sources={[]}
                                                defaultSrc={claspData.imageUrl}
                                                altText={claspData.imageAlt}
                                                isLazyLoad={false}
                                            />
                                        </div>
                                        <div className="drawer__modal_items_image_details">
                                            {/* eslint-disable-next-line */}
                                            <p className="drawer__modal_items_image_details_title">{claspData.title} <span className="count">{claspLength}</span></p>
                                            <p className="drawer__modal_items_image_details_price">{claspData.price}</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        </CustomScrollBar>
                    </div>
                </div>
                <CSSTransition
                    in={this.state.showDrawerButton}
                    timeout={1500}
                    classNames={{
                        enter: 'drawer_button_animation__enter',
                        enterActive: 'drawer_button_animation__enter_active',
                        enterDone: 'drawer_button_animation__enter_complete',
                        exit: 'drawer_button_animation__exit',
                        exitActive: 'drawer_button_animation__exit_active',
                        exitDone: 'drawer_button_animation__exit_complete'
                    }}
                    mountOnEnter
                >
                    <div className="drawer__actions">
                        <button
                            type="button"
                            className="drawer__actions_price"
                            onClick={this.toggleDrawer}
                            aria-label={`${priceLabel} ${totalPrice} ${this.state.showDrawer ? closeDrawerLabel : openDrawerLabel}`}
                        >
                            <span
                                className={classNames(
                                    {
                                        'icon-Down': this.state.showDrawer,
                                        'icon-Up': !this.state.showDrawer
                                    }
                                )}
                                role="img"
                                aria-label={this.state.showDrawer ? slideUpIconAltText : slideDownIconAltText}
                            />
                            {
                                isPriceVisible ?
                                    <span aria-label={`${priceLabel} ${totalPrice}`}>{totalPrice}</span>
                                    :
                                    showDetails
                            }
                        </button>
                        {isPriceVisible ?
                            <button
                                type="button"
                                className="drawer__actions_add-to-bag"
                                onClick={() => {
                                    this.proceedToBag();
                                }}
                                disabled={(this.props.byo.selectedFixture.isSilhouette && Object.keys(this.props.byo.charmsOnFixture).length === 0)}
                            >
                                {this.props.customBagItemsList.filter(item => item.designId === this.props.byo.designID).length > 0 ? updateBag : addToBag}
                            </button> :
                            <button
                                type="button"
                                className="drawer__actions_add-to-bag"
                                onClick={() => this.proceedToBag(!isPriceVisible)}
                                disabled={this.state.isDesignSaved}
                            >
                                {saveToWishList}
                            </button>
                        }
                    </div>
                </CSSTransition>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        byo: state.byo,
        aem: state.aem,
        customItemsList: state.flyout.customSavedItems,
        customBagItemsList: state.flyout.customItemsList
    };
};

Drawer.defaultProps = {
    customItemsList: [],
    customBagItemsList: [],
    drawerOpened: () => { }
};

Drawer.propTypes = {
    dispatch: PropTypes.func.isRequired,
    byo: PropTypes.any.isRequired,
    aem: PropTypes.any.isRequired,
    customItemsList: PropTypes.any,
    customBagItemsList: PropTypes.any,
    drawerOpened: PropTypes.func
};

export default connect(mapStateToProps)(Drawer);
