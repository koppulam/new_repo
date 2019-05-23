// Packages
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactTooltip from 'lib/utils/react-tooltip';
import { scrollTo } from 'lib/utils/scroll-to-content';
import {
    findFirst,
    addClass,
    removeClass,
    hasClass
} from 'lib/dom/dom-util';
import { updatePageTitle } from 'lib/utils/meta-tag';
import matchMedia from 'lib/dom/match-media';
import updateSelectedFlyoutModal from 'actions/ConciergeActions';
import InformationText from 'components/common/InformationText';
import classNames from 'classnames';
import * as objectPath from 'object-path';
import isEqual from 'lodash/isEqual';
import * as cookieUtil from 'lib/utils/cookies';
import { formatStringForTracking, resetCaratInAnalytics } from 'lib/utils/analytics-util';
import { disableBodyScroll, enableBodyScroll } from 'lib/no-scroll';
import ProductVariations from 'components/containers/ProductModifiers/ProductVariations';
// Components
import Picture from 'components/common/Picture';
import { getProductDetails } from 'actions/EngagementProductActions';
import { fetchShoppingBagSystem } from 'actions/FlyoutActions';
import {
    resetBeautifulChoice,
    AddToBag,
    toggleFiltersSection,
    updateSizeInCart,
    resetSelectedCard,
    initWishListFromCookie
} from 'actions/ChooseDiamondActions';
import WishList from 'components/containers/WishList';
import DropAHint from 'components/containers/DropAHint';
import CONST from 'constants/EngagementConstants';
import { currencyFormatter } from 'lib/utils/currency-formatter';
import TiffanyInlineModal from 'components/common/TiffanyInlineModal';
import TiffanyModal from 'components/common/TiffanyModal';
import RingSize from 'components/containers/Engagement/BeautifulChoice/RingSize';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import BeautifulChoice from 'components/containers/Engagement/BeautifulChoice';
import ShippingFlyout from 'components/containers/ShippingFlyout';
import ShippingCta from 'components/containers/ShippingFlyout/ShippingCta.jsx';
import ProductSocialSharing from 'components/containers/ProductSocialSharing';
import ReadMore from 'components/common/ReadMore';

import RingUnavailable from './RingUnavailable';
import ChangeMetalColor from './ChangeMetalColor';
import AddToCart from '../AddToCart';

// Utils
// import './index.scss';

// Import jQuery for toggle
const $ = require('jquery');

/**
 * Product Description Component for Engagement
 */
class EngagementPdp extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.state = {
            engagementConfig: this.props.aem[this.props.config],
            showReadMore: true,
            isMetalAvailabilityOpen: null,
            isOpenOnload: false,
            longDescription: '',
            showModal: false,
            showNoRing: !objectPath.get(this.props, 'diamondFilters.isRingAvailable', true),
            hideCountryOfOrigin: objectPath.get(this.props.aem, 'engagementpdp.hideCountryOfOrigin', false),
            isWishListInit: false,
            isBagLoaded: false,
            showChangeMetalModal: false,
            url: '/',
            target: '_blank',
            strUpto: 195,
            isShareDropdownOpen: false,
            showAddToCart: false
        };
        this.desktopWishList = React.createRef();
        this.actionContainer = React.createRef();
        this.onModalClose = this.onModalClose.bind(this);
        this.pricedFromTooltip = React.createRef();
        // this.onScroll = this.onScroll.bind(this);
        this.certificationToolTip = React.createRef();
        this.countryOfOriginToolTip = React.createRef();
        this.readMoreRef = React.createRef();
        this.afterReadMoreToggle = this.afterReadMoreToggle.bind(this);
    }

    /**
     * @description componentWillMount life cycle
     * @returns {void}
     */
    componentWillMount() {
        if (!this.props.flyout.flyoutInitCallDone) {
            this.props.dispatch(initWishListFromCookie());
        }
        const shoppingBagCookie = cookieUtil.getCookies('engagmentReduce', { encode: true });

        if (!shoppingBagCookie) {
            this.props.dispatch(fetchShoppingBagSystem());
        } else {
            this.props.dispatch(fetchShoppingBagSystem(shoppingBagCookie));
        }
    }

    /**
     * @description componentDidMount adding listeners
     * @returns {void}
     */
    componentDidMount() {
        // this.onScroll();
        // window.addEventListener('scroll', this.onScroll);
        if (this.props.flyout.wishListInitialized) {
            if (!this.state.isWishListInit) {
                this.setState({ isWishListInit: true }, () => {
                    this.setAddToCart(this.props);
                });
            }
        }
        if (this.props.flyout.bagInitialized) {
            if (!this.state.isBagLoaded) {
                this.setState({ isBagLoaded: true }, () => {
                    this.setAddToCart(this.props);
                });
            }
        }
    }

    /**
     * @description Lifecycle Hook
     * @param {any} nextProps Next Props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        const isAvailableOnline = objectPath.get(nextProps, 'diamondFilters.selectedDiamond.isAvailableOnline', objectPath.get(nextProps.diamondFilters.groupCompleteResponse, 'isAvailableOnline', null));
        const show1B = !isAvailableOnline || objectPath.get(this.props.aem, 'engagementpdp.forced1BVariation', false);

        if (nextProps.diamondFilters.selectedDiamond && this.props.diamondFilters.selectedDiamond && (nextProps.diamondFilters.selectedDiamond.isInBag !== this.props.diamondFilters.selectedDiamond.isInBag || nextProps.diamondFilters.selectedDiamond.isInWishList !== this.props.diamondFilters.selectedDiamond.isInWishList)) {
            if (nextProps.diamondFilters.selectedDiamond.isInBag !== this.props.diamondFilters.selectedDiamond.isInBag && !nextProps.diamondFilters.selectedDiamond.isInBag) {
                this.setState({ showAddToCart: true });
            }
            if (nextProps.diamondFilters.selectedDiamond.isInWishList !== this.props.diamondFilters.selectedDiamond.isInWishList && !nextProps.diamondFilters.selectedDiamond.isInWishList) {
                this.setState({ showAddToCart: true });
            }
        }
        if (nextProps.diamondFilters.groupCompleteResponse && this.props.diamondFilters.groupCompleteResponse && (nextProps.diamondFilters.groupCompleteResponse.isInBag !== this.props.diamondFilters.groupCompleteResponse.isInBag || nextProps.diamondFilters.groupCompleteResponse.isInWishList !== this.props.diamondFilters.groupCompleteResponse.isInWishList)) {
            if (nextProps.diamondFilters.groupCompleteResponse.isInBag !== this.props.diamondFilters.groupCompleteResponse.isInBag && !nextProps.diamondFilters.groupCompleteResponse.isInBag) {
                this.setState({ showAddToCart: true });
            }
            if (nextProps.diamondFilters.groupCompleteResponse.isInWishList !== this.props.diamondFilters.groupCompleteResponse.isInWishList && !nextProps.diamondFilters.groupCompleteResponse.isInWishList) {
                this.setState({ showAddToCart: true, historyLength: window.history.length });
            }
        }
        if (nextProps.diamondFilters.selectedDiamond && nextProps.diamondFilters.openModal && !this.state.showModal && (nextProps.diamondFilters.selectedCard !== null) && (!isEqual(nextProps.diamondFilters.selectedDiamond, this.props.diamondFilters.selectedDiamond) || isEqual(String(nextProps.diamondFilters.selectedDiamond.group.group.selectedSku), String(this.props.diamondFilters.groupCompleteResponse.selectedSku)))) {
            this.setState({ showModal: true });
        }
        if ((nextProps.diamondFilters.selectedDiamond && this.props.diamondFilters.selectedDiamond) && (objectPath.get(nextProps, 'diamondFilters.selectedDiamond.isInBag') !== objectPath.get(this.props, 'diamondFilters.selectedDiamond.isInBag')) && isEqual(nextProps.diamondFilters.selectedDiamond.group.group.selectedSku, this.props.diamondFilters.selectedDiamond.group.group.selectedSku)) {
            setTimeout(() => {
                this.setState({ showModal: false });
            }, 4000);
        }
        if ((nextProps.diamondFilters.selectedDiamond && this.props.diamondFilters.selectedDiamond) && (show1B && objectPath.get(nextProps, 'diamondFilters.selectedDiamond.isInWishList') !== objectPath.get(this.props, 'diamondFilters.selectedDiamond.isInWishList')) && isEqual(nextProps.diamondFilters.selectedDiamond.group.group.selectedSku, this.props.diamondFilters.selectedDiamond.group.group.selectedSku)) {
            setTimeout(() => {
                this.setState({ showModal: false });
            }, 4000);
        }
        if (nextProps.flyout.wishListInitialized !== this.props.flyout.wishListInitialized && nextProps.flyout.wishListInitialized) {
            if (!this.state.isWishListInit) {
                this.setState({ isWishListInit: true }, () => {
                    if (this.props.diamondFilters.groupCompleteResponse.selectedSku && this.props.diamondFilters.groupCompleteResponse.selectedSku === nextProps.diamondFilters.groupCompleteResponse.selectedSku && this.props.diamondFilters.groupCompleteResponse.isInWishList === nextProps.diamondFilters.groupCompleteResponse.isInWishList && ((nextProps.diamondFilters.selectedDiamond && nextProps.diamondFilters.groupCompleteResponse.selectedSku !== nextProps.diamondFilters.selectedDiamond.group.group.selectedSku) || !nextProps.diamondFilters.selectedDiamond)) {
                        this.setAddToCart(nextProps);
                    }
                });
            }
        }
        if (nextProps.flyout.bagInitialized !== this.props.flyout.bagInitialized && nextProps.flyout.bagInitialized) {
            if (!this.state.isBagLoaded) {
                this.setState({ isBagLoaded: true }, () => {
                    if (this.props.diamondFilters.groupCompleteResponse.selectedSku && this.props.diamondFilters.groupCompleteResponse.selectedSku === nextProps.diamondFilters.groupCompleteResponse.selectedSku && this.props.diamondFilters.groupCompleteResponse.isInBag === nextProps.diamondFilters.groupCompleteResponse.isInBag && ((nextProps.diamondFilters.selectedDiamond && nextProps.diamondFilters.groupCompleteResponse.selectedSku !== nextProps.diamondFilters.selectedDiamond.group.group.selectedSku) || !nextProps.diamondFilters.selectedDiamond)) {
                        this.setAddToCart(nextProps);
                    }
                });
            }
        }
    }


    /**
     * @description onadd for add to card button
     * @returns {void}
     */
    onAdd = () => {
        const { diamondFilters } = this.props;
        const diamondDetails = objectPath.get(diamondFilters, 'selectedDiamond', null);
        const isAvailableOnline = objectPath.get(diamondDetails, 'isAvailableOnline', objectPath.get(this.props, 'diamondFilters.groupCompleteResponse.isAvailableOnline', false));
        const show1B = !isAvailableOnline || objectPath.get(this.props.aem, 'engagementpdp.forced1BVariation', false);

        if (!show1B) {
            this.props.dispatch(AddToBag());
        } else if (this.desktopWishList.current !== null) { // Explicity checking against null
            this.desktopWishList.getWrappedInstance().handleFavoriteClick();
        }
    }

    /**
     * @description On modal close action beautiful choice
     * @returns {void}
     */
    onModalClose = () => {
        this.setState({ showModal: false });

        if (hasClass(findFirst('body'), 'preserve-sticky')) {
            removeClass(findFirst('body'), 'preserve-sticky');
        }

        removeClass(findFirst('body'), 'diamond-selection-body');
        this.props.dispatch(resetSelectedCard());
        if ((!this.props.diamondFilters.groupCompleteResponse.selectedSku && !this.props.diamondFilters.selectedDiamond) || (this.props.diamondFilters.selectedDiamond && this.props.diamondFilters.groupCompleteResponse && String(this.props.diamondFilters.groupCompleteResponse.selectedSku) !== String(this.props.diamondFilters.selectedDiamond.group.group.selectedSku))) {
            this.props.dispatch(resetBeautifulChoice());
            if (this.state.historyLength === window.history.length) {
                window.history.back();
            }
            return;
        }
        this.setState({ showAddToCart: false });
    }

    /**
     * @description function triggered on scroll
     * @returns {void}
     */
    onScroll() {
        let anchorEle;

        if (this.actionContainer.current) {
            anchorEle = this.actionContainer.current.previousElementSibling;
            const anchorRect = anchorEle ? anchorEle.getBoundingClientRect() : {};
            const actionsRect = this.actionContainer.current.getBoundingClientRect();

            if (anchorRect.bottom + actionsRect.height >= window.innerHeight) {
                addClass(this.actionContainer.current, 'engagement-buttons-sticky');
            } else {
                removeClass(this.actionContainer.current, 'engagement-buttons-sticky');
            }
        }
    }

    /**
     * @description Lifecycle Hook
     * @param {any} nextProps Next Props
     * @returns {void}
     */
    setAddToCart(nextProps) {
        if (this.props.flyout.wishListInitialized && this.props.flyout.bagInitialized) {
            // set the show add to bag state here
            let pdpResponse = {};

            if (nextProps.diamondFilters.selectedDiamond && (nextProps.diamondFilters.selectedDiamond.isInBag || nextProps.diamondFilters.selectedDiamond.isInWishList)) {
                const diamondDetails = nextProps.diamondFilters.selectedDiamond;
                const groupDetails = diamondDetails.group.group;
                let eyebrowtext = '';
                let title = '';
                const lineListedItems = [];

                if (groupDetails.titleSplit && groupDetails.titleSplit.length > 0) {
                    if (groupDetails.titleSplit.length > 1) {
                        [eyebrowtext, title] = groupDetails.titleSplit;
                    } else {
                        eyebrowtext = '';
                        [title] = groupDetails.titleSplit;
                    }
                }

                if (diamondDetails.lineListedItems && diamondDetails.lineListedItems.length > 0) {
                    diamondDetails.lineListedItems.forEach(item => {
                        lineListedItems.push({
                            linkText: item.linkText,
                            listEntryDisplayOrder: item.listEntryDisplayOrder,
                            canonicalURL: item.friendlyURL
                        });
                    });
                }

                pdpResponse = {
                    eyebrowtext,
                    title,
                    specifications: objectPath.get(groupDetails, 'specifications', ''),
                    style: objectPath.get(groupDetails, 'style', false),
                    caratWeight: objectPath.get(groupDetails, 'caratWeight', false),
                    countryOfOrigin: objectPath.get(groupDetails, 'countryOfOrigin', false),
                    minCaratWeight: objectPath.get(groupDetails, 'minCaratWeight', false),
                    maxCaratWeight: objectPath.get(groupDetails, 'maxCaratWeight', false),
                    lowerPriceLimit: objectPath.get(nextProps, 'diamondFilters.groupCompleteResponse.lowerPriceLimit', 0),
                    upperPriceLimit: objectPath.get(nextProps, 'diamondFilters.groupCompleteResponse.upperPriceLimit', 0),
                    diamondColor: objectPath.get(groupDetails, 'diamondColor', []),
                    diamondClarity: objectPath.get(groupDetails, 'diamondClarity', []),
                    diamondCut: objectPath.get(groupDetails, 'diamondCut', ['Excellent']),
                    longDescription: objectPath.get(groupDetails, 'longDescription', []),
                    additionalInfo: objectPath.get(groupDetails, 'additionalInfo', ''),
                    minPrice: objectPath.get(groupDetails, 'minPrice', false),
                    sku: objectPath.get(groupDetails, 'sku', ''),
                    selectedSku: objectPath.get(groupDetails, 'selectedSku', ''),
                    lineListedItems,
                    showChooseDiamond: objectPath.get(nextProps, 'diamondFilters.groupCompleteResponse.showChooseDiamond', false),
                    isAvailableOnline: objectPath.get(nextProps, 'diamondFilters.selected.isAvailableOnline', false),
                    isInBag: objectPath.get(nextProps, 'diamondFilters.selectedDiamond.isInBag', false),
                    isInWishList: objectPath.get(nextProps, 'diamondFilters.selectedDiamond.isInWishList', false)
                };
            } else {
                pdpResponse = objectPath.get(nextProps, 'diamondFilters.groupCompleteResponse', {});
            }
            const { diamondFilters } = nextProps;
            const diamondDetails = objectPath.get(diamondFilters, 'selectedDiamond', pdpResponse);
            const addedToBag = objectPath.get(diamondDetails, 'isInBag', false);
            const isInWishList = objectPath.get(diamondDetails, 'isInWishList', false);
            const isAvailableOnline = objectPath.get(diamondDetails, 'isAvailableOnline', null);
            const show1B = !isAvailableOnline || objectPath.get(nextProps.aem, 'engagementpdp.forced1BVariation', false);

            this.setState({
                showAddToCartInit: true,
                showAddToCart: (((!show1B && !addedToBag) || (show1B && !isInWishList)))
            });
        }
    }

    /**
     * @description setButtons of the pdp page
     * @param {Object} config  config window object.
     * @param {Object} productDetails  productDetails from the API.
     * @returns {void}
     */
    setButtons = (config, productDetails) => {
        const labels = objectPath.get(config, 'labels', {});
        const showChooseDiamond = objectPath.get(productDetails, 'showChooseDiamond', null);
        const hideContactDiamondExpert = objectPath.get(productDetails, 'hideContactDiamondExpert', false);
        const selectedSku = objectPath.get(productDetails, 'selectedSku', false);
        // const { diamondFilters } = this.props;
        const diamondDetails = productDetails;
        const addedToBag = objectPath.get(diamondDetails, 'isInBag', false);
        const isInWishList = objectPath.get(diamondDetails, 'isInWishList', false);
        const isAvailableOnline = objectPath.get(diamondDetails, 'isAvailableOnline', null);
        const isSavedProduct = this.props.wishlist.skuId.indexOf(String(selectedSku)) >= 0;
        const hideAction = (isAvailableOnline && addedToBag) || (!isAvailableOnline && isSavedProduct);
        const show1B = !isAvailableOnline || objectPath.get(this.props.aem, 'engagementpdp.forced1BVariation', false);
        const addToBagText = !show1B ? objectPath.get(labels, 'beautifulChoice.addToBag', '') : objectPath.get(labels, 'beautifulChoice.wishlistSaveText', '');
        const onAdd = this.onAdd.bind(this);
        const priceData = currencyFormatter(objectPath.get(diamondDetails, 'price', objectPath.get(diamondDetails, 'group.group.price', 0)));
        const addToBag = {
            price: priceData,
            addToBagActive: true,
            addToBagActiveTextForMobile: addToBagText,
            addToBagHoverLabel: addToBagText,
            buttonText: addToBagText,
            isInBag: addedToBag,
            isInWishList: isInWishList || isSavedProduct,
            onAdd,
            congratsText: !show1B ? objectPath.get(labels, 'beautifulChoice.addToBagSuccessA', '') : objectPath.get(labels, 'beautifulChoice.addToBagSuccessB', ''),
            show1B,
            fromEnPage: true // <addToCart launched from Engagegment page.
        };

        return (
            <Fragment>
                <div className="product-description_buttons" ref={this.actionContainer}>
                    {(!selectedSku && showChooseDiamond === true) && (
                        <button
                            type="button"
                            onClick={this.scrollToDiamonds}
                            className="product-description_buttons_choose-diamond"
                            data-interaction-context=""
                            data-interaction-type={AnalyticsConstants.CTA}
                            data-interaction-name={formatStringForTracking(objectPath.get(this.props.engagementpdp, 'labels.chooseDiamondLabel', 'choose-diamond'))}
                        >
                            {labels.chooseDiamondLabel}
                        </button>
                    )}
                    {(this.props.flyout.wishListInitialized && this.props.flyout.bagInitialized && !!selectedSku && showChooseDiamond) &&
                        <Fragment>
                            {
                                (hideAction) &&
                                <p className="product-description_buttons_details-holder_info">
                                    <span>{priceData}</span>
                                    <span>{!show1B ? objectPath.get(labels, 'beautifulChoice.addedToBag', '') : objectPath.get(labels, 'beautifulChoice.wishlistSavedText', '')}</span>
                                </p>
                            }
                            {this.state.showAddToCart && <AddToCart {...addToBag} />}
                        </Fragment>
                    }
                    {
                        !hideContactDiamondExpert &&
                        <button
                            type="button"
                            className="product-description_buttons_contact-expert"
                            data-interaction-context=""
                            data-interaction-type={selectedSku ? AnalyticsConstants.TAB : AnalyticsConstants.CTA}
                            data-interaction-name={formatStringForTracking(objectPath.get(this.props.engagementpdp, 'labels.diamondExpertLabel', 'diamond-expert'))}
                            onClick={() => {
                                this.contactDaimondExpert(showChooseDiamond, config);
                            }}
                        >
                            {labels.contactExpertLabel}
                        </button>
                    }
                </div>
                {
                    selectedSku &&
                    showChooseDiamond &&
                    <div
                        className="product-description_buttons_details-holder_payment"
                        data-interaction-context=""
                        data-interaction-type={AnalyticsConstants.TAB}
                        data-interaction-name={formatStringForTracking(objectPath.get(this.props.paymentsandReturnsFlyoutConfig, 'paymentPlansLabel', 'payment-plans'))}
                    >
                        {
                            objectPath.get(labels, 'beautifulChoice.paymentPlansPreText', '').length > 0 &&
                            <span className="product-description_buttons_details-holder_payment_pretext">
                                {objectPath.get(labels, 'beautifulChoice.paymentPlansPreText', '')}
                            </span>
                        }
                        <ShippingCta config="paymentsandReturnsFlyoutConfig" noChevron="false" />
                        <span className="product-description_buttons_details-holder_payment_posttext">
                            {objectPath.get(labels, 'beautifulChoice.paymentPlansPostText', '')}
                        </span>
                        {objectPath.get(labels, 'beautifulChoice.paymentPlansPostText', '')}
                        <ShippingFlyout config="paymentsandReturnsFlyoutConfig" />
                    </div>
                }
            </Fragment>
        );
    };

    /**
     * @description Display specifications
     * @param {Object} spec  Specifications from API response.
     * @returns {void}
     */
    setSpecification = (spec) => {
        let splitSpec = (typeof spec === 'string') ? spec.split(';') : '';

        splitSpec = splitSpec.filter(item => {
            return item !== '';
        });

        return splitSpec.map((element, index) => {
            return (
                index < CONST.SPECIFICATION_LIMIT &&
                <li
                    className="product-description_romance-copy_specifications_item"
                    key={index.toString()}
                >
                    {element}
                </li>
            );
        });
    };

    /**
     * @description setMetalText of the pdp page
     * @param {Object} pdpObj  productDetails from the API.
     * @param {Object} label  label from the aem authored.
     * @param {boolean} isLayout2 isLayout2 flag to check for Layout2
     * @returns {void}
     */
    setMetalText = (pdpObj, label, isLayout2) => {
        const { lineListedItems, selectedSku } = pdpObj;

        return lineListedItems.map((element, index) => {
            return (
                <li
                    className="metal-availability__container_options_item"
                    key={index.toString()}
                >
                    {
                        !selectedSku &&

                        <a
                            href={element.canonicalURL}
                            rel="noopener noreferrer"
                            target={label.metalAvailabilityTarget}
                            className="metal-availability__container_options_item-wrap cta"
                        >
                            <span
                                className="cta-content"
                            >
                                <span
                                    className="cta-text"
                                    tabIndex={-1}
                                >{element.linkText}<span className="icon-dropdown-right" />
                                </span>
                            </span>
                        </a>
                    }
                    {
                        selectedSku &&
                        <button
                            type="button"
                            className="metal-availability__container_options_item-wrap cta"
                            onClick={
                                () => {
                                    this.toggleMetalColorModal(element.canonicalURL, label.metalAvailabilityTarget, isLayout2);
                                }
                            }
                        >
                            <span
                                className="cta-content"
                            >
                                <span
                                    className="cta-text"
                                    tabIndex={-1}
                                >{element.linkText}<span className="icon-dropdown-right" />
                                </span>
                            </span>
                        </button>
                    }
                </li>
            );
        });
    }

    /**
     * @description setMetalAvailabilityItems of the pdp page
     * @param {Object} productDetails  productDetails from the API.
     * @param {Object} labels  labels from the aem authored.
     * @param {boolean} isLayout2 isLayout2 flag to check for Layout2
     * @param {Boolean} isOpen  isOpen represents whether to open the drawer on page load or not.
     * @returns {void}
     */
    setMetalAvailabilityItems = (productDetails, labels, isLayout2, isOpen) => {
        const lineListItems = objectPath.get(productDetails, 'lineListedItems', []);
        const config = objectPath.get(this.props.aem, this.props.config, {});
        const moreWaysLabel = objectPath.get(config, 'labels.moreWaysLabel', 'Moreways');
        let isDrawerOpen = false;

        // Consider the Layout status on page load.
        if (this.state.isMetalAvailabilityOpen === null && !this.state.isOpenOnload) {
            isDrawerOpen = isOpen;
        }

        if (lineListItems.length > 0) {
            productDetails.lineListedItems.sort((item1, item2) => {
                return item1.listEntryDisplayOrder - item2.listEntryDisplayOrder;
            });
        }

        return (lineListItems.length > 0) ?
            (
                <div className="product-description_metal-availability">
                    <div className="metal-availability__container">
                        <button
                            type="button"
                            aria-label={moreWaysLabel}
                            aria-haspopup="true"
                            className={classNames('metal-availability__container_button', {
                                'dropdown-open': isDrawerOpen || this.state.isMetalAvailabilityOpen
                            })}
                            onClick={() => {
                                this.toggleMetalDropdown(isDrawerOpen);
                            }}
                        >
                            {moreWaysLabel}
                            <span
                                src={this.props.dropdownSrc}
                                alt={this.props.dropdownAltText}
                                className={
                                    classNames({
                                        'icon-dropdown-down': !this.state.isMetalAvailabilityOpen,
                                        'icon-dropdown-up': isDrawerOpen || this.state.isMetalAvailabilityOpen
                                    })
                                }
                            />
                        </button>
                        <div
                            className={classNames('metal-availability__container_content', {
                                show: isDrawerOpen
                            })}
                        >
                            {
                                labels.metalAvailabilityText &&
                                <p className="metal-availability__container_toptext">{labels.metalAvailabilityText}</p>
                            }
                            <ul className="metal-availability__container_options">
                                {this.setMetalText(productDetails, labels, isLayout2)}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : null;
    }

    /**
     * @description setPdpContent Set content of top section.
     * @param {Object} productDetails  productDetails from the API.
     * @param {Object} config  config from the window object.
     * @returns {void}
     */
    setPdpContent = (productDetails, config) => {
        const labels = objectPath.get(config, 'labels', {});
        const engFlag = true;
        const eyebrowQueryParams = `?q=${productDetails.eyebrowtext}`;
        const wishlistSku = productDetails.selectedSku ? productDetails.selectedSku : '';
        const groupSku = productDetails.sku;
        const hideDropAHint = objectPath.get(this.props.aem, 'hideDropAHint', false);

        return (
            <div className="product-description__content">
                <div className="product-description__content_iconsContainer">
                    <div className="product-description__content_iconsContainer_eyebrowcontainer">
                        {productDetails.eyebrowtext && (
                            <a
                                className="product-description__content_eyebrow"
                                href={`${config.eyebrowCtaLink}${eyebrowQueryParams}`}
                                target={config.eyebrowCtaTarget}
                                tabIndex={0}
                            >
                                <span className="cta-content">
                                    <span className="cta-text" tabIndex={-1}>
                                        {productDetails.eyebrowtext}
                                    </span>
                                </span>
                            </a>
                        )}
                    </div>
                </div>
                {productDetails.title && (
                    <h1 className="product-description__content_title">{productDetails.title}</h1>
                )}
                {
                    productDetails.style &&
                    <div className="product-description_style">
                        <span className="product-description_style_label">{labels.styleLabel}</span>
                        <span className="product-description_style_model">{productDetails.style}</span>
                    </div>
                }
                <div className="product-description__content_iconsContainer_actions-bar">
                    {
                        !hideDropAHint &&
                        <div className="product-description__content_iconsContainer_actions-bar_dropahint">
                            <DropAHint config="engagementpdpConfig" engFlag={engFlag} />
                        </div>
                    }
                    <div className="product-description__content_iconsContainer_actions-bar_wishlist">
                        <WishList ref={element => { if (element) { this.desktopWishList = element; } }} sku={wishlistSku} groupsku={groupSku} />
                    </div>
                </div>
            </div>
        );
    };

    /**
     * @description ChangeMetalColorModal of the engagement pdp page.
     * @param {String} url  canonicalURL is a herf formed from the API.
     * @param {String} target  target is a target authored.
     * @param {boolean} isLayout2 isLayout2 flag to check if it is Layout2
     * @returns {void}
     */
    toggleMetalColorModal = (url, target, isLayout2) => {
        if (!isLayout2) {
            this.setState({ showChangeMetalModal: true, url, target });
        } else if (target === '_blank') {
            window.open(url, target);
        } else {
            window.location = url;
        }
    }

    /**
     * @description closeModal of the changemetalcolor modal.
     * @returns {void}
     */
    closeModal = () => {
        this.setState({ showChangeMetalModal: false });
    }

    /**
     * @description Based on API response invoke the concierge overlay,Redirect user to an authored URL.
     * @param {boolean} status  Status represents parameter showChooseDaimond from the API response.
     * @param {Object} config  Configuration authored window object.
     * @returns {void}
     */
    contactDaimondExpert = (status, config) => {
        const diamondExpertLink = objectPath.get(config, 'diamondExpertLink', null);

        if (status === false && diamondExpertLink) {
            window.open(diamondExpertLink, config.diamondExpertTarget);
        } else {
            this.toggleConciergeFlyout();
        }
    };

    /**
     * @param {Object} request pay load
     * @returns {void}
     */
    fetchProductData = request => {
        this.props.dispatch(getProductDetails(request));
    };

    /**
     * @description scrolls to the top of page on click
     * @returns {void}
     */
    scrollToDiamonds = () => {
        scrollTo('.choose-your-diamond', null, -(findFirst('.header__nav-container').offsetHeight));
    };

    /**
     * @description Function to handle load more and close
     * @param {Object} event to handle click event
     * @returns {void}
     */
    toggleLoadMore = event => {
        const specifications = findFirst('.product-description_romance-copy_specifications');

        if (!this.state.showReadMore && specifications) {
            $('.product-description_romance-copy_specifications').slideToggle('fast', 'linear', () => {
                this.readMoreRef.current.toggle();
            });
        } else {
            this.readMoreRef.current.toggle();
        }
    };

    /**
     * @description Function to handle load more and close
     * @param {Boolean} isOpen represents metalAvailability drawer status.
     * @returns {void}
     */
    toggleMetalDropdown = (isOpen) => {
        const metalDropdown = '.metal-availability__container_content';
        let status = this.state.isMetalAvailabilityOpen;

        if (isOpen) {
            this.setState({ isOpenOnload: true });
        } else {
            status = !status;
        }

        $(metalDropdown).slideToggle();

        this.setState({
            isMetalAvailabilityOpen: status
        });
    };


    /**
     * @description function to trigger concierge modal
     * @returns {void}
     */
    toggleConciergeFlyout = () => {
        const showConciergeFlyout = this.props.showFlyout;

        if (!showConciergeFlyout) {
            disableBodyScroll('INITIAL', true);
        } else {
            enableBodyScroll('INITIAL', false);
        }
        this.updateSelectedFlyoutModal({
            flyoutState: 'INITIAL',
            showFlyout: !this.props.showFlyout
        });
    };

    /**
     * @description function to trigger social share accordian
     * @returns {void}
     */
    toggleShareDrawer = () => {
        this.setState({
            isShareDropdownOpen: !this.state.isShareDropdownOpen
        });
    }

    /**
     * @description function to trigger weibo share modal
     * @param {Object} event to handle click event
     * @param {Object} link to handle social link url
     * @returns {void}
     */
    toggleWeiboModal = (event, link) => {
        event.preventDefault();
        const location = Location;
        const productDesc = objectPath.get(this.props.aem, 'engagementpdp.socialSharingConfig.productDesc', '');
        const productImage = objectPath.get(this.props.aem, 'engagementProductPreviewDetails.images.0.defaultSrc', '');
        const weiboURL = link.weiboURL || '';
        const shareURL = window.location.href;
        const url = `${weiboURL}?title=${productDesc}&url=${shareURL}&pic=${productImage}'`;
        const weiboModal = function weiboModalHandler() {
            if (!window.open(url, 'weibo', 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=635,height=455')) location.href = 'url&url=1';
        };

        if (/Firefox/.test(navigator.userAgent)) {
            setTimeout(weiboModal, 0);
        } else {
            weiboModal();
        }
    }


    /**
     * @description update the flyout selected state
     * @param {string} selectedState  Selcted flyout
     * @returns {void}
     */
    updateSelectedFlyoutModal = selectedState => {
        this.props.dispatch(updateSelectedFlyoutModal(selectedState));
    };

    /**
     * @description showRomanceCopy of the pdp page
     * @param {Object} productDetails  productDetails from the API.
     * @param {Object} labels labels
     * @returns {void}
     */
    showRomanceCopy = (productDetails, labels) => {
        return (
            <div className="product-description_romance-copy">
                <div role="heading" aria-level="2" className="product-description__container_detail_title">
                    {labels.description}
                </div>
                <ReadMore
                    ref={this.readMoreRef}
                    className={classNames('product-description_romance-copy_text', {
                        close: this.state.showReadMore
                    })}
                    text={objectPath.get(productDetails, 'longDescription', '')}
                    lengthToShow={this.state.strUpto}
                    animationTime={0.4}
                    animationEnd={this.afterReadMoreToggle}
                />
                {/* <p
                    className={classNames('product-description_romance-copy_text', {
                        close: this.state.showReadMore
                    })}
                >
                    {this.props.engagementPdp.romanceCopy || shortDesc}
                </p> */}
                {productDetails.specifications && (
                    <ul
                        className={classNames(
                            'product-description_romance-copy_specifications close'
                        )}
                    >
                        {this.setSpecification(productDetails.specifications)}
                    </ul>
                )}
            </div>
        );
    };

    /**
     * @description checkForDescLength Check for description length.
     * @param {Object} productDetails  productDetails from the API.
     * @returns {void}
     */
    checkForDescription = productDetails => {
        const description = objectPath.get(productDetails, 'longDescription', '');

        return description.length > this.state.strUpto;
    };

    /**
     * @description showReadMore Handle the scenario to showMore
     * @param {Object} productDetails  productDetails from the API.
     * @param {Object} labels labels from the config window object.
     * @returns {void}
     */
    showReadMore = (productDetails, labels) => {
        const showReadMore = this.checkForDescription(productDetails);

        return (
            <div className="product-description_cta">
                {showReadMore && (
                    <button
                        type="button"
                        className="product-description_load-more cta"
                        id="product-description_load-more_engagement"
                        aria-expanded={!this.state.showReadMore}
                        onClick={this.toggleLoadMore.bind(this)}
                    >
                        <span className="cta-content">
                            <span className="cta-text" tabIndex="{-1}">
                                {this.state.showReadMore ? labels.readMoreLabel : labels.closeLabel}
                            </span>
                            <span
                                className={
                                    this.state.showReadMore ? 'icon-dropdown-down' : 'icon-dropdown-up'
                                }
                            />
                        </span>
                    </button>
                )}
            </div>
        );
    };

    /**
     * @description showPrice dislay the price.
     * @param {Object} price  productDetails  minPrice from the API.
     * @param {Object} labels labels from the config window object.
     * @returns {void}
     */
    showPrice = (price, labels) => {
        const showChooseDiamond = objectPath.get(this.props.aem, 'engagementpdp.groupCompleteResponse.showChooseDiamond', true);
        const priceText = objectPath.get(labels, 'priceText', '');
        const additionalInfo = objectPath.get(this.props.aem, 'engagementpdp.groupCompleteResponse.additionalInfo', '');

        return (price > 0 && showChooseDiamond) ?
            (
                <div className="product-description_price">
                    <span className="product-description_price_label">
                        {priceText}
                        &nbsp;
                        {currencyFormatter(price)}
                    </span>
                </div>
            ) :
            (
                <div
                    className={
                        classNames('product-description_price',
                            {
                                hide: !(additionalInfo && additionalInfo.length > 0)
                            })
                    }
                >
                    <span className="product-description_price_label">
                        {priceText}
                        &nbsp;
                        {additionalInfo}
                    </span>
                </div>
            );
    }

    /**
     * @description sredirects to group url
     * @returns {void}
     */
    redirectPage = () => {
        window.location.href = window.location.origin + objectPath.get(this.props.aem, 'engagementpdp.ringNotAvailable.groupUrl', '');
    }

    /**
     * @description resets carat value in analytics
     * @returns {void}
     */
    setCaratInAnalytics = () => {
        resetCaratInAnalytics();
        this.onModalClose();
    }

    /**
     * @description Function to handle load more after text animates
     * @returns {void}
     */
    afterReadMoreToggle = () => {
        if (this.state.showReadMore) {
            $('.product-description_romance-copy_specifications').slideToggle('fast', 'linear');
            this.setState({ showReadMore: !this.state.showReadMore });
        } else {
            this.setState({ showReadMore: !this.state.showReadMore });
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        let pdpResponse = {};
        const { isShareDropdownOpen } = this.state;

        if (this.props.diamondFilters.selectedDiamond && (this.props.diamondFilters.selectedDiamond.isInBag || this.props.diamondFilters.selectedDiamond.isInWishList)) {
            const diamondDetails = this.props.diamondFilters.selectedDiamond;
            const groupDetails = diamondDetails.group.group;
            let eyebrowtext = '';
            let title = '';
            const lineListedItems = [];

            if (groupDetails.titleSplit && groupDetails.titleSplit.length > 0) {
                if (groupDetails.titleSplit.length > 1) {
                    [eyebrowtext, title] = groupDetails.titleSplit;
                } else {
                    eyebrowtext = '';
                    [title] = groupDetails.titleSplit;
                }
            }

            if (diamondDetails.lineListedItems && diamondDetails.lineListedItems.length > 0) {
                diamondDetails.lineListedItems.forEach(item => {
                    lineListedItems.push({
                        linkText: item.linkText,
                        listEntryDisplayOrder: item.listEntryDisplayOrder,
                        canonicalURL: item.friendlyURL
                    });
                });
            }

            pdpResponse = {
                eyebrowtext,
                title,
                specifications: objectPath.get(groupDetails, 'specifications', ''),
                style: objectPath.get(groupDetails, 'style', false),
                size: objectPath.get(diamondDetails, 'size', false),
                caratWeight: objectPath.get(groupDetails, 'caratWeight', false),
                countryOfOrigin: objectPath.get(groupDetails, 'diamondProvenance.0', false),
                minCaratWeight: objectPath.get(groupDetails, 'minCaratWeight', false),
                maxCaratWeight: objectPath.get(groupDetails, 'maxCaratWeight', false),
                lowerPriceLimit: objectPath.get(this.props, 'diamondFilters.groupCompleteResponse.lowerPriceLimit', 0),
                upperPriceLimit: objectPath.get(this.props, 'diamondFilters.groupCompleteResponse.upperPriceLimit', 0),
                diamondColor: objectPath.get(groupDetails, 'diamondColor', []),
                diamondClarity: objectPath.get(groupDetails, 'diamondClarity', []),
                diamondCut: objectPath.get(groupDetails, 'diamondCut', ['Excellent']),
                longDescription: objectPath.get(groupDetails, 'longDescription', []),
                additionalInfo: objectPath.get(groupDetails, 'additionalInfo', ''),
                minPrice: objectPath.get(groupDetails, 'minPrice', false),
                price: objectPath.get(groupDetails, 'price', false),
                sku: objectPath.get(groupDetails, 'sku', ''),
                selectedSku: objectPath.get(groupDetails, 'selectedSku', ''),
                lineListedItems,
                showChooseDiamond: objectPath.get(this.props, 'diamondFilters.groupCompleteResponse.showChooseDiamond', false),
                isAvailableOnline: objectPath.get(diamondDetails, 'isAvailableOnline', false),
                isInBag: objectPath.get(this.props, 'diamondFilters.selectedDiamond.isInBag', false),
                isInWishList: objectPath.get(this.props, 'diamondFilters.selectedDiamond.isInWishList', false)
            };
        } else {
            pdpResponse = objectPath.get(this.props, 'diamondFilters.groupCompleteResponse', {});
        }
        if (pdpResponse.title && pdpResponse.title !== document.title) {
            updatePageTitle(pdpResponse.title);
        }
        const showChooseDiamond = objectPath.get(pdpResponse, 'showChooseDiamond', false);
        const responseLength = pdpResponse && Object.keys(pdpResponse).length > 0;
        const config = objectPath.get(this.state, 'engagementConfig', {});
        const labels = objectPath.get(config, 'labels', {});
        const price = objectPath.get(pdpResponse, 'minPrice', 0);
        const toolTips = objectPath.get(config, 'toolTips', {});
        const beautifulChoiceToolTips = objectPath.get(labels, 'beautifulChoice.toolTips', {});
        const selectedSkuAvailable = String(objectPath.get(pdpResponse, 'selectedSku', '')).length > 0;
        const modifiers = objectPath.get(labels, 'beautifulChoice.modifiers', {});
        const caratModifierCheck = objectPath.get(config, 'showCaratModifier', false);
        const countryOfOriginPresent = objectPath.get(pdpResponse, 'countryOfOrigin', '').length > 0;
        const diamondPricedFromRTEAuthored = objectPath.get(toolTips, 'diamondPricedFromRTE.informationTextRTE', '').toString().length > 0;
        const beautifulchoiceRTEAuthored = objectPath.get(beautifulChoiceToolTips, 'beautifulchoiceRTE.informationTextRTE', '').toString().length > 0;
        const countryOfOriginRTEAuthored = objectPath.get(beautifulChoiceToolTips, 'countryOfOriginRTE.informationTextRTE', '').toString().length > 0;
        const ringOptions = {
            overlay: true,
            className: 'ring-unavailable-modal',
            closeClass: 'close-modal',
            overlayClass: 'clasp-overlay',
            blockMobileScrollability: true,
            blockDesktopScrollability: true,
            modalFocus: true,
            showClosebtn: true,
            closeonTapOutside: {
                isClose: true,
                modalContainerClass: 'ring-unavailable'
            }
        };
        const changeMetalOpts = {
            overlay: true,
            className: 'full-screen change-metal-modal',
            closeClass: 'close-modal',
            overlayClass: 'clasp-overlay',
            blockMobileScrollability: true,
            blockDesktopScrollability: true
        };

        const socialSharingConfig = objectPath.get(this.props.aem, 'engagementpdp.socialSharingConfig', {});
        const layout1A = objectPath.get(pdpResponse, 'isAvailableOnline', false);
        const layout1B = !layout1A || objectPath.get(this.props.aem, 'engagementpdp.forced1BVariation', false);
        const layout2 = objectPath.get(pdpResponse, 'showChooseDiamond', false);
        const selectedSku = objectPath.get(pdpResponse, 'selectedSku', '');
        let showDrawer = false;

        if ((layout1A || layout1B || layout2) && !selectedSku) {
            showDrawer = true;
        }

        const priceDiv = findFirst('.product-description_price');
        const priceDivExists = hasClass(priceDiv, 'hide');
        const priceInfTxt = objectPath.get(labels, 'priceInformationText', '');

        return responseLength ? (
            <article className="product-description engagement">
                <div className="product-description__container">
                    {this.setPdpContent(pdpResponse, config)}
                    {
                        !selectedSkuAvailable &&
                        this.showPrice(price, labels)
                    }
                    {
                        (!selectedSkuAvailable && priceDiv && !priceDivExists && priceInfTxt && priceInfTxt.length > 0) &&
                        <div className="product-description_informaton">
                            <p className="product-description_informaton_text">
                                <span className="product-description_informaton_text-label">{priceInfTxt}</span>
                                {
                                    toolTips.diamondPricedFromRTE &&
                                    diamondPricedFromRTEAuthored &&
                                    <div className="product-description_informaton_tooltip">
                                        <span
                                            role="button"
                                            data-tip=""
                                            data-for="diamondFromPriceToolTip"
                                            data-type="light"
                                            data-event="click focus"
                                            data-place="top"
                                            data-class="price-from-tooltip"
                                            data-border="true"
                                            id="diamondFromPriceToolTipId"
                                            tabIndex="0"
                                            className="tooltip-element"
                                        >
                                            <Picture
                                                defaultSrc={objectPath.get(labels, 'toolTipIcon', './icons/information.svg')}
                                                altText={objectPath.get(labels, 'toolTipAltText', 'tooltip')}
                                                customClass="tooltip-image"
                                                isLazyLoad={false}
                                            />
                                        </span>
                                        <ReactTooltip
                                            className="price-from-tooltip"
                                            id="diamondFromPriceToolTip"
                                            effect="solid"
                                            globalEventOff="click focus"
                                            isCapture
                                        >
                                            <div aria-describedby="diamondFromPriceToolTip">
                                                <InformationText config={objectPath.get(toolTips, 'diamondPricedFromRTE', '')} />
                                            </div>
                                        </ReactTooltip>
                                    </div>
                                }
                            </p>
                        </div>
                    }
                    {
                        (selectedSkuAvailable && showChooseDiamond) &&
                        <Fragment>
                            <div className="diamond-carousel-card__certification-holder">
                                <div className="diamond-carousel-card__certification-holder_diamond-icon">
                                    <Picture isLazyLoad={false} defaultSrc={objectPath.get(labels, 'beautifulChoice.certificationDiamondIcon', '')} altText={objectPath.get(labels, 'beautifulChoice.certificationDiamondIconAltText', '')} />
                                </div>
                                <p className="diamond-carousel-card__certification-holder_certification-text">
                                    {objectPath.get(labels, 'beautifulChoice.certification', '')}
                                </p>
                                <div className="diamond-carousel-card__certification-holder_certification-tooltip">
                                    {
                                        beautifulChoiceToolTips.beautifulchoiceRTE &&
                                        beautifulchoiceRTEAuthored &&
                                        <span className="diamond-carousel-card__certification-holder_certification-tooltip_cntr">
                                            <span
                                                role="button"
                                                data-tip=""
                                                data-for="certificattionToolTip"
                                                data-type="light"
                                                data-event="click focus"
                                                data-place="top"
                                                data-class="certification-tooltip"
                                                data-border="true"
                                                id="certificattionToolTipId"
                                                className="tooltip-element"
                                                tabIndex="0"
                                            >
                                                <Picture
                                                    isLazyLoad={false}
                                                    customClass="tooltip-image"
                                                    defaultSrc={objectPath.get(labels, 'beautifulChoice.certifiedTooltipIcon', '')}
                                                    altText={objectPath.get(labels, 'beautifulChoice.certifiedTooltipIconAlt', '')}
                                                />
                                            </span>
                                            <ReactTooltip
                                                className="certification-tooltip"
                                                id="certificattionToolTip"
                                                effect="solid"
                                                globalEventOff="click focus"
                                                isCapture
                                            >
                                                <div aria-describedby="certification tool tip">
                                                    <InformationText config={objectPath.get(beautifulChoiceToolTips, 'beautifulchoiceRTE', '')} />
                                                </div>
                                            </ReactTooltip>
                                        </span>
                                    }
                                </div>
                                <div
                                    className="diamond-carousel-card__certification-holder_certification-edit"
                                    onClick={() => {
                                        scrollTo('.your-diamond-selection');
                                        this.props.dispatch(toggleFiltersSection(true));
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            scrollTo('.your-diamond-selection');
                                            this.props.dispatch(toggleFiltersSection(true));
                                        }
                                    }}
                                    role="button"
                                    tabIndex="0"
                                >
                                    <Picture
                                        defaultSrc={objectPath.get(labels, 'editDiamondIcon', './icons/edit.svg')}
                                        altText={objectPath.get(labels, 'editDiamondAltText', 'Edit your selection')}
                                        isLazyLoad={false}
                                    />
                                </div>
                            </div>
                            <div className="diamond-carousel-card__carousel-properties">
                                {
                                    objectPath.get(pdpResponse, 'caratWeight', '') &&
                                    <div className="diamond-carousel-card__carousel-properties_property">
                                        <p className="diamond-carousel-card__carousel-properties_property_value">
                                            {objectPath.get(pdpResponse, 'caratWeight', '')}
                                        </p>
                                        <p className="diamond-carousel-card__carousel-properties_property_heading">
                                            {objectPath.get(labels, 'beautifulChoice.carat', '')}
                                        </p>
                                    </div>
                                }
                                {
                                    objectPath.get(pdpResponse, 'diamondColor.0', '') &&
                                    <div className="diamond-carousel-card__carousel-properties_property">
                                        <p className="diamond-carousel-card__carousel-properties_property_value">
                                            {objectPath.get(pdpResponse, 'diamondColor.0', '')}
                                        </p>
                                        <p className="diamond-carousel-card__carousel-properties_property_heading">
                                            {objectPath.get(labels, 'beautifulChoice.color', '')}
                                        </p>
                                    </div>
                                }
                                {
                                    objectPath.get(pdpResponse, 'diamondClarity.0', '') &&
                                    <div className="diamond-carousel-card__carousel-properties_property">
                                        <p className="diamond-carousel-card__carousel-properties_property_value">
                                            {objectPath.get(pdpResponse, 'diamondClarity.0', '')}
                                        </p>
                                        <p className="diamond-carousel-card__carousel-properties_property_heading">
                                            {objectPath.get(labels, 'beautifulChoice.clarity', '')}
                                        </p>
                                    </div>
                                }
                                <div className="diamond-carousel-card__carousel-properties_property">
                                    <p className="diamond-carousel-card__carousel-properties_property_value">
                                        {objectPath.get(labels, 'beautifulChoice.excellentcut', 'Excellent')}
                                    </p>
                                    <p className="diamond-carousel-card__carousel-properties_property_heading">
                                        {objectPath.get(labels, 'beautifulChoice.cut', '')}
                                    </p>
                                </div>
                            </div>
                            {
                                !this.state.hideCountryOfOrigin && countryOfOriginPresent &&
                                <div className="diamond-carousel-card__carousel-origin-holder">
                                    <p className="diamond-carousel-card__carousel-origin-holder_value">
                                        {objectPath.get(pdpResponse, 'countryOfOrigin', '')}
                                    </p>
                                    <div className="diamond-carousel-card__carousel-origin-holder_heading">
                                        <p>{objectPath.get(labels, 'beautifulChoice.originCountry', '')}</p>
                                        {
                                            beautifulChoiceToolTips.countryOfOriginRTE &&
                                            countryOfOriginRTEAuthored &&
                                            <div className="diamond-carousel-card__carousel-origin-holder_heading_tooltip">
                                                <span
                                                    role="button"
                                                    data-tip=""
                                                    data-for="productCountryOfOriginToolTip"
                                                    data-type="light"
                                                    data-event="click focus"
                                                    data-place="top"
                                                    data-class="country-of-origin"
                                                    data-border="true"
                                                    id="productCountryOfOriginToolTipId"
                                                    className="tooltip-element"
                                                    tabIndex="0"
                                                >
                                                    <Picture
                                                        isLazyLoad={false}
                                                        customClass="tooltip-image"
                                                        defaultSrc={objectPath.get(labels, 'beautifulChoice.certifiedTooltipIcon', '')}
                                                        altText={objectPath.get(labels, 'beautifulChoice.certifiedTooltipIconAlt', '')}
                                                    />
                                                </span>
                                                <ReactTooltip
                                                    className="country-of-origin"
                                                    id="productCountryOfOriginToolTip"
                                                    effect="solid"
                                                    globalEventOff="click focus"
                                                    isCapture
                                                >
                                                    <div aria-describedby="country of origin tool tip">
                                                        <InformationText config={objectPath.get(beautifulChoiceToolTips, 'countryOfOriginRTE', '')} />
                                                    </div>
                                                </ReactTooltip>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }
                            {
                                pdpResponse.isAvailableOnline &&
                                <RingSize
                                    data={modifiers}
                                    selectedVariation={pdpResponse.size}
                                    isPDP="true"
                                    customClass="engagement"
                                    shoppingBagId={objectPath.get(this.props, 'diamondFilters.selectedDiamond.shoppingBagItemID', objectPath.get(this.props, 'diamondFilters.groupCompleteResponse.shoppingBagItemID', ''))}
                                    onChange={(selectedSize) => {
                                        const responseshoppingBagItemID = objectPath.get(this.props, 'diamondFilters.selectedDiamond.shoppingBagItemID', objectPath.get(this.props, 'diamondFilters.groupCompleteResponse.shoppingBagItemID', ''));

                                        if (responseshoppingBagItemID) {
                                            const selectedsku = objectPath.get(pdpResponse, 'group.group.selectedSku', objectPath.get(this.props.diamondFilters.groupCompleteResponse, 'selectedSku', ''));
                                            const itemServiceTypeId = objectPath.get(this.props.diamondFilters.selectedDiamond, 'itemServices.itemServicingOptions.0.itemServiceTypeId', objectPath.get(this.props.diamondFilters.groupCompleteResponse, 'itemServiceTypeId', ''));
                                            const style = objectPath.get(this.props.diamondFilters.selectedDiamond, 'group.group.style', objectPath.get(this.props.diamondFilters.groupCompleteResponse, 'style', ''));
                                            const serviceQuantity = objectPath.get(this.props.diamondFilters.selectedDiamond, 'itemServices.itemServicingOptions.0.servicingQuantity', objectPath.get(this.props.diamondFilters.groupCompleteResponse, 'servicingQuantity', ''));

                                            this.props.dispatch(updateSizeInCart(responseshoppingBagItemID, selectedsku, itemServiceTypeId, style, selectedSize, serviceQuantity));
                                        }
                                    }}
                                />
                            }
                        </Fragment>
                    }
                    {
                        (showChooseDiamond === false && caratModifierCheck) &&
                        <ProductVariations config="engagementCaratModifier" isEngagement customClass="engagement-pdp-modifier" />
                    }
                    {this.setMetalAvailabilityItems(pdpResponse, labels, !showChooseDiamond, showDrawer)}

                    {
                        (socialSharingConfig.isChina && socialSharingConfig.socialSharingLinks.length > 0) &&
                        <div className="product-description__social-sharing">
                            <div
                                className="product-description__social-sharing_container"
                                onClick={this.toggleShareDrawer}
                                onKeyPress={this.toggleShareDrawer}
                                role="button"
                                tabIndex="-1"
                            >
                                <button
                                    className={
                                        classNames('product-description__social-sharing_container_accordian cta',
                                            {
                                                open: isShareDropdownOpen
                                            })
                                    }
                                    onClick={this.toggleShareDrawer}
                                    onKeyPress={this.toggleShareDrawer}
                                    type="button"
                                >
                                    <span className=" cta-content hover-cta">
                                        {labels.chinaShareText}
                                    </span>
                                </button>
                                <span className={
                                    classNames('product-description__social-sharing_container_arrow',
                                        {
                                            'icon-dropdown-down': !isShareDropdownOpen,
                                            'icon-dropdown-up': isShareDropdownOpen
                                        })
                                }
                                />
                            </div>
                            {
                                isShareDropdownOpen &&
                                <div className="product-description__social-sharing_wrapper">
                                    {socialSharingConfig.socialSharingLinks && socialSharingConfig.socialSharingLinks.length > 0 && socialSharingConfig.socialSharingLinks.map((link) => {
                                        return (link.isWeChat ?
                                            <ProductSocialSharing
                                                productSharingConfig={socialSharingConfig.productSharingConfig}
                                                productImageConfig={socialSharingConfig.engagementProductPreviewDetails}
                                                eyebrowText={socialSharingConfig.eyebrowCtaText}
                                                productName={socialSharingConfig.productTitle}
                                                eyebrowTextUrl={socialSharingConfig.eyebrowTextURL}
                                                eyebrowTextTarget={socialSharingConfig.eyebrowTextTarget}
                                                buttonImage={link.icon}
                                                altLabel={link.label}
                                                dataNavName={link.dataNavName}
                                            /> :
                                            <a href="/" aria-label={link.label} title={link.label} tabIndex="0" className="cta product-description__social-sharing_weibo" onClick={e => this.toggleWeiboModal(e, link)}>
                                                <span tabIndex="-1" className="cta-content hover-cta">
                                                    <img src={link.icon} alt={link.label} />
                                                </span>
                                            </a>);
                                    })
                                    }
                                </div>
                            }
                        </div>
                    }
                </div>

                {this.setButtons(config, pdpResponse)}
                {this.showRomanceCopy(pdpResponse, labels)}
                {this.showReadMore(pdpResponse, labels)}
                <TiffanyInlineModal
                    enablePopState
                    showModal={this.state.showModal}
                    holder="tiffany-aem"
                    closeAriaLabel="Close"
                    leftArrowAriaLabel="Back"
                    blockScrollInDesktop
                    blockScrollInMobile
                    focusElement={false}
                    customClass="diamond-selection"
                    childComponentInit={() => {
                        const globalBanner = findFirst('.global-banner');
                        const chooseCountry = findFirst('.app-js__choose-country');
                        const diamondSelection = findFirst('.diamond-selection');
                        const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;

                        if (globalBanner && !hasClass(globalBanner, 'hide') && findFirst('header .header__nav-container') && diamondSelection && isDesktop) {
                            const rect = findFirst('header .header__nav-container').getBoundingClientRect();
                            const globalRect = globalBanner.getBoundingClientRect();

                            diamondSelection.style.top = `${rect.height + globalRect.height}px`;
                        }
                        if (chooseCountry && !hasClass(chooseCountry, 'hide') && findFirst('header .header__nav-container') && diamondSelection && isDesktop) {
                            const rect = findFirst('header .header__nav-container').getBoundingClientRect();
                            const countryRect = chooseCountry.getBoundingClientRect();

                            diamondSelection.style.top = `${rect.height + countryRect.height}px`;
                        }

                        addClass(findFirst('body'), 'diamond-selection-body');
                    }}
                    transitionProps={{
                        timeout: 1000,
                        classNames: {
                            enter: 'beautiful-choice-modal-animation_enter',
                            enterActive: 'beautiful-choice-modal-animation_enter-active',
                            enterDone: 'beautiful-choice-modal-animation_enter-done',
                            exit: 'beautiful-choice-modal-animation_exit',
                            exitActive: 'beautiful-choice-modal-animation_exit-active',
                            exitDone: 'beautiful-choice-modal-animation_exit-done'
                        }
                    }}
                    resetInitiator={this.setCaratInAnalytics}
                >
                    <BeautifulChoice labels={labels} />
                </TiffanyInlineModal>
                {
                    this.state.showNoRing &&
                    <TiffanyModal
                        visible={this.state.showNoRing}
                        options={ringOptions}
                        onClose={this.redirectPage}
                    >
                        <RingUnavailable redirectCallback={this.redirectPage} />
                    </TiffanyModal>
                }
                {
                    this.state.showChangeMetalModal &&
                    <TiffanyModal
                        visible={this.state.showChangeMetalModal}
                        options={changeMetalOpts}
                        onClose={this.closeModal}
                    >
                        <ChangeMetalColor closeModal={this.closeModal} url={this.state.url} target={this.state.target} />
                    </TiffanyModal>
                }
            </article>
        ) : null;
    }
}

EngagementPdp.propTypes = {
    config: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    aem: PropTypes.any.isRequired,
    engagementPdp: PropTypes.object.isRequired,
    showFlyout: PropTypes.bool.isRequired,
    diamondFilters: PropTypes.any.isRequired,
    wishlist: PropTypes.object.isRequired,
    flyout: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        showFlyout: state.conciergeFlyout.showFlyout,
        engagementPdp: state.engagementPdp,
        diamondFilters: state.diamondFilters,
        wishlist: state.wishlist,
        flyout: state.flyout
    };
};

export default connect(mapStateToProps)(EngagementPdp);
