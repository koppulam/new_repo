// Packages
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as objectPath from 'object-path';

import WishList from 'components/containers/WishList';
import DropAHint from 'components/containers/DropAHint';
import ShippingFlyout from 'components/containers/ShippingFlyout';
import { currencyFormatter } from 'lib/utils/currency-formatter';
import DiamondCarouselCard from 'components/containers/Engagement/ChooseYourDiamond/DiamondCarouselCard';
import MediaQuery from 'react-responsive';
import styleVariables from 'lib/utils/breakpoints';
import updateSelectedFlyoutModal from 'actions/ConciergeActions';
import { AddToBag, updateSizeInCart } from 'actions/ChooseDiamondActions';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import ShippingCta from 'components/containers/ShippingFlyout/ShippingCta.jsx';
import TiffanyChatWrapper from 'components/common/TiffanyChatWrapper';
import RingSize from './RingSize.jsx';
import AddToCart from '../AddToCart';

// import './index.scss';

/**
 * Product Description Component for Engagement
 */
class BeautifulChoice extends React.Component {
    /**
     * @description Constructor
     * @param {*} props Props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        const { diamondFilters } = this.props;
        const diamondDetails = objectPath.get(diamondFilters, 'selectedDiamond', null);
        const selectedSku = objectPath.get(diamondDetails, 'group.group.selectedSku', '');
        const isSavedProduct = this.props.wishlist.skuId.indexOf(selectedSku) >= 0;
        const isInWishList = objectPath.get(diamondDetails, 'isInWishList', false) || isSavedProduct;
        const isAvailableOnline = objectPath.get(diamondDetails, 'isAvailableOnline', null);
        const show1B = !isAvailableOnline || objectPath.get(this.props.aem, 'engagementpdp.forced1BVariation', false);

        this.state = {
            isInBag: objectPath.get(props, 'diamondFilters.selectedDiamond.isInBag', false),
            showAddtoBag: ((!show1B && !objectPath.get(props, 'diamondFilters.selectedDiamond.isInBag', false)) || (show1B && !isInWishList))
        };
        this.desktopWishList = React.createRef();
        this.mobileWishList = React.createRef();
        this.desktopDropaHint = React.createRef();
        this.mobileDropaHint = React.createRef();
        this.setDesktopDropaHint = this.setDesktopDropaHint.bind(this);
        this.setMobileDropaHint = this.setMobileDropaHint.bind(this);
    }

    /**
     * @description onadd for add to card button
     * @returns {void}
     */
    onAdd = () => {
        const { diamondFilters } = this.props;
        const diamondDetails = objectPath.get(diamondFilters, 'selectedDiamond', null);
        const isAvailableOnline = objectPath.get(diamondDetails, 'isAvailableOnline', null);
        const show1B = !isAvailableOnline || objectPath.get(this.props.aem, 'engagementpdp.forced1BVariation', false);

        if (!show1B) {
            this.props.dispatch(AddToBag());
        } else if (this.desktopWishList.current !== null) { // Explicity checking against null
            this.desktopWishList.getWrappedInstance().handleFavoriteClick();
        } else if (this.mobileWishList.current !== null) {
            this.mobileWishList.getWrappedInstance().handleFavoriteClick();
        }
    }

    /**
     * @returns {HTML} options
     */
    getContactOptions = () => {
        const { labels } = this.props;
        const contactOptions = objectPath.get(labels, 'beautifulChoice.contactOptions', []);
        const helpText = objectPath.get(labels, 'beautifulChoice.helpText', '');

        return (
            <div className="diamond-selection-modal_details-holder_help">
                {
                    helpText &&
                    <p className="diamond-selection-modal_details-holder_help-text">
                        {helpText}
                    </p>
                }
                {
                    contactOptions.length > 0 &&
                    contactOptions.map((option, index) => {
                        if (option.isChat) {
                            return (
                                <Fragment key={index.toString()}>
                                    {
                                        option.showChat &&
                                        <div className="diamond-selection-modal_details-holder_help_options chat-holder">
                                            <TiffanyChatWrapper
                                                chatWidgetID={option.chatWidgetID}
                                                customClass="diamond-overlay-chat-wrapper"
                                                context={AnalyticsConstants.CHAT_BEAUTIFUL_CHOICE_CONTEXT}
                                                type={AnalyticsConstants.CHAT_BEAUTIFUL_CHOICE_TYPE}
                                                name={objectPath.get(option, 'ctaLabel', option.ctaText)}
                                            />
                                        </div>
                                    }
                                </Fragment>
                            );
                        }
                        if (option.isEmail) {
                            return (
                                <p className="diamond-selection-modal_details-holder_help_options" key={index.toString()}>
                                    <button
                                        type="button"
                                        className="diamond-selection-modal_details-holder_help_options_link cta"
                                        onClick={() => {
                                            this.props.dispatch(updateSelectedFlyoutModal({ flyoutState: 'INITIAL', showFlyout: true, emailSent: false }));
                                        }}
                                        data-interaction-context={AnalyticsConstants.DIAMOND_SEL}
                                        data-interaction-type={AnalyticsConstants.TAB}
                                        data-interaction-name={objectPath.get(option, 'ctaLabel', option.ctaText)}
                                    >
                                        <img alt={option.alt} src={option.icon} />
                                        <span className="cta-content hover-cta">
                                            <span className="cta-text" tabIndex="-1">{option.ctaText}</span>
                                            <i className="icon-dropdown-right" />
                                        </span>
                                    </button>
                                </p>
                            );
                        }
                        if (option.ctaText) {
                            return (
                                <p className="diamond-selection-modal_details-holder_help_options" key={index.toString()}>
                                    <a
                                        className="diamond-selection-modal_details-holder_help_options_link"
                                        href={option.ctaUrl}
                                        data-interaction-context={AnalyticsConstants.DIAMOND_SEL}
                                        data-interaction-type={AnalyticsConstants.TAB}
                                        data-interaction-name={objectPath.get(option, 'ctaLabel', option.ctaText)}
                                    >
                                        <img alt={option.alt} src={option.icon} />
                                        <span className="cta-content" tabIndex="-1">
                                            <span className="cta-text">
                                                {option.ctaText}
                                            </span>
                                            <i className="icon-dropdown-right" />
                                        </span>
                                    </a>
                                </p>
                            );
                        }
                        return null;
                    })
                }
            </div>
        );
    }

    /**
     * @description sets the desktop drop a hint ref
     * @param {any} ref Reference of the component
     * @returns {void}
     */
    setDesktopDropaHint = (ref) => {
        if (ref) {
            this.desktopDropaHint = ref;
            if (this.state.dropaHintOpened) {
                this.desktopDropaHint.getWrappedInstance().openWithValues(this.state.dropahintvalues);
            }
        }
    }

    /**
     * @description sets the mobile drop a hint ref
     * @param {any} ref Reference of the component
     * @returns {void}
     */
    setMobileDropaHint = (ref) => {
        if (ref) {
            this.mobileDropaHint = ref;
            if (this.state.dropaHintOpened) {
                this.mobileDropaHint.getWrappedInstance().openWithValues(this.state.dropahintvalues);
            }
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const { diamondFilters, labels } = this.props;
        const diamondDetails = objectPath.get(diamondFilters, 'selectedDiamond', null);
        const addedToBag = objectPath.get(diamondDetails, 'isInBag', false);
        const sku = objectPath.get(diamondDetails, 'group.group.sku', '');
        const selectedSku = objectPath.get(diamondDetails, 'group.group.selectedSku', '');
        const isSavedProduct = this.props.wishlist.skuId.indexOf(selectedSku) >= 0;
        const isInWishList = objectPath.get(diamondDetails, 'isInWishList', false) || isSavedProduct;
        const isAvailableOnline = objectPath.get(diamondDetails, 'isAvailableOnline', null);
        const show1B = !isAvailableOnline || objectPath.get(this.props.aem, 'engagementpdp.forced1BVariation', false);
        const hideAction = (!show1B && addedToBag) || (show1B && isInWishList);
        const addToBagText = !show1B ? objectPath.get(labels, 'beautifulChoice.addToBag', '') : objectPath.get(labels, 'beautifulChoice.wishlistSaveText', '');
        const onAdd = this.onAdd.bind(this);
        const modifiers = objectPath.get(labels, 'beautifulChoice.modifiers', {});
        const addToBag = {
            price: currencyFormatter(objectPath.get(diamondDetails, 'group.group.price', 0)),
            addToBagActive: true,
            addToBagActiveTextForMobile: addToBagText,
            addToBagHoverLabel: addToBagText,
            buttonText: addToBagText,
            isInBag: addedToBag,
            isInWishList,
            onAdd,
            congratsText: !show1B ? objectPath.get(labels, 'beautifulChoice.addToBagSuccessA', '') : objectPath.get(labels, 'beautifulChoice.addToBagSuccessB', ''),
            show1B
        };
        const wishlistSku = selectedSku || '';
        const groupSku = sku;
        const beautifulChoiceDesc = objectPath.get(labels, 'beautifulChoice.descriptionText', '');
        const isGroupTwo = parseInt(objectPath.get(diamondDetails, 'group.groupAttributes.groupTypeID', 1), 10) === 2;
        const engagementpdpConfig = JSON.parse(JSON.stringify(objectPath.get(this.props, 'aem.engagementpdpConfig', false)));
        const hideDropAHint = objectPath.get(this.props.aem, 'hideDropAHint', false);

        if (engagementpdpConfig) {
            objectPath.set(engagementpdpConfig, 'dropHint.thumbnails.images.1.defaultSrc', objectPath.get(diamondDetails, 'images.0.url', ''));
            objectPath.set(engagementpdpConfig, 'dropHint.thumbnails.images.1.preview.defaultSrc', objectPath.get(diamondDetails, 'images.0.url', ''));
        }

        return (
            <article className="beautiful-choice">
                <div className={classNames('diamond-selection-modal')}>
                    <MediaQuery query={styleVariables.desktopAndBelow}>
                        <h3 className="diamond-selection-modal_details-holder_heading">{objectPath.get(labels, 'beautifulChoice.heading', '')}</h3>
                        <div className="diamond-selection-modal_details-holder_actions">
                            {
                                !hideDropAHint &&
                                <DropAHint
                                    engFlag
                                    ref={this.setDesktopDropaHint}
                                    config={engagementpdpConfig}
                                    onOpen={() => {
                                        this.setState({ dropaHintOpened: true });
                                    }}
                                    onUnMount={() => {
                                        this.setState({ dropaHintOpened: false });
                                    }}
                                    onStateChange={(dropahintvalues) => {
                                        this.setState({ dropahintvalues });
                                    }}
                                />
                            }
                            <WishList ref={element => { if (element) { this.desktopWishList = element; } }} isgroup={selectedSku ? 'false' : 'true'} sku={wishlistSku} groupsku={groupSku} isGroupTwo={isGroupTwo} />
                        </div>
                        {
                            show1B && beautifulChoiceDesc &&
                            <p className="diamond-selection-modal_details-holder_desc">{beautifulChoiceDesc}</p>
                        }
                    </MediaQuery>
                    <div className={classNames('diamond-selection-modal_card-holder')}>
                        <DiamondCarouselCard beautifulChoice={objectPath.get(labels, 'beautifulChoice', '')} config={objectPath.get(labels, 'beautifulChoice.previewConfig', '')} />
                    </div>
                    <div className={classNames('diamond-selection-modal_details-holder', { has1B: show1B })}>
                        <div className="diamond-selection-modal_details-holder_wrapper">
                            <MediaQuery query={styleVariables.desktopAndAbove}>
                                <h3 className="diamond-selection-modal_details-holder_heading">{objectPath.get(labels, 'beautifulChoice.heading', '')}</h3>
                                <div className="diamond-selection-modal_details-holder_actions">
                                    {
                                        !hideDropAHint &&
                                        <DropAHint
                                            engFlag
                                            ref={this.setMobileDropaHint}
                                            config={engagementpdpConfig}
                                            onOpen={() => {
                                                this.setState({ dropaHintOpened: true });
                                            }}
                                            onUnMount={() => {
                                                this.setState({ dropaHintOpened: false });
                                            }}
                                            onStateChange={(dropahintvalues) => {
                                                this.setState({ dropahintvalues });
                                            }}
                                        />
                                    }
                                    <WishList ref={element => { if (element) { this.desktopWishList = element; } }} isgroup={selectedSku ? 'false' : 'true'} sku={wishlistSku} groupsku={groupSku} isGroupTwo={isGroupTwo} />
                                </div>
                            </MediaQuery>
                            {
                                show1B &&
                                <Fragment>
                                    <MediaQuery query={styleVariables.desktopAndAbove}>
                                        {
                                            beautifulChoiceDesc &&
                                            <p className="diamond-selection-modal_details-holder_desc">{beautifulChoiceDesc}</p>
                                        }
                                    </MediaQuery>
                                    {this.getContactOptions()}
                                </Fragment>
                            }
                            {
                                !show1B &&
                                <RingSize
                                    selectedVariation={diamondDetails.size}
                                    data={modifiers}
                                    isPDP="false"
                                    customClass="engagement"
                                    shoppingBagId={objectPath.get(this.props, 'diamondFilters.selectedDiamond.shoppingBagItemID', '')}
                                    onChange={(selectedSize) => {
                                        if (diamondDetails.size && diamondDetails.shoppingBagItemID) {
                                            const { shoppingBagItemID } = diamondDetails;
                                            const selectedsku = objectPath.get(diamondDetails, 'group.group.selectedSku', '');
                                            const itemServiceTypeId = objectPath.get(diamondDetails, 'itemServices.itemServicingOptions.0.itemServiceTypeId', '');
                                            const style = objectPath.get(diamondDetails, 'group.group.style', '');
                                            const serviceQuantity = objectPath.get(diamondDetails, 'itemServices.itemServicingOptions.0.servicingQuantity', '');

                                            this.props.dispatch(updateSizeInCart(shoppingBagItemID, selectedsku, itemServiceTypeId, style, selectedSize, serviceQuantity));
                                        }
                                    }}
                                />
                            }
                        </div>
                        <div className="diamond-selection-modal_details-holder_wrapper">
                            {
                                (this.state.isInBag || hideAction) &&
                                <p className="diamond-selection-modal_details-holder_info">
                                    <span>{currencyFormatter(objectPath.get(diamondDetails, 'group.group.price', 0))}</span>
                                    <span>{!show1B ? objectPath.get(labels, 'beautifulChoice.addedToBag', '') : objectPath.get(labels, 'beautifulChoice.wishlistSavedText', '')}</span>
                                </p>
                            }
                            {
                                this.state.showAddtoBag &&
                                <AddToCart {...addToBag} />
                            }
                            <div
                                className="diamond-selection-modal_details-holder_payment"
                                data-interaction-context="love-engagement:diamond-selector"
                                data-interaction-type={AnalyticsConstants.TAB}
                                data-interaction-name={objectPath.get(this.props.paymentsandReturnsFlyoutConfig, 'paymentPlansLabel', 'payment-plans')}
                            >
                                {
                                    objectPath.get(labels, 'beautifulChoice.paymentPlansPreText', '').length > 0 &&
                                    <span className="diamond-selection-modal_details-holder_payment_pretext">
                                        {objectPath.get(labels, 'beautifulChoice.paymentPlansPreText', '')}
                                    </span>
                                }
                                <ShippingCta config="paymentsandReturnsFlyoutConfig" noChevron="false" />
                                <span className="diamond-selection-modal_details-holder_payment_posttext">
                                    {objectPath.get(labels, 'beautifulChoice.paymentPlansPostText', '')}
                                </span>
                                <ShippingFlyout config="paymentsandReturnsFlyoutConfig" />
                            </div>
                        </div>
                        {
                            !show1B &&
                            this.getContactOptions()
                        }
                    </div>
                </div>
            </article>
        );
    }
}

BeautifulChoice.propTypes = {
    dispatch: PropTypes.func.isRequired,
    diamondFilters: PropTypes.any.isRequired,
    wishlist: PropTypes.object.isRequired,
    labels: PropTypes.any.isRequired,
    aem: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        diamondFilters: state.diamondFilters,
        wishlist: state.wishlist
    };
};

export default connect(mapStateToProps)(BeautifulChoice);
