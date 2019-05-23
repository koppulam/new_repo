// Packages
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import * as objectPath from 'object-path';
import { connect } from 'react-redux';
import * as cookieUtil from 'lib/utils/cookies';
import * as isFalse from 'lib/utils/is-false';
import matchMedia from 'lib/dom/match-media';
import {
    findFirst,
    addClass,
    removeClass,
    hasClass
} from 'lib/dom/dom-util';
import { currencyFormatter } from 'lib/utils/currency-formatter';
import {
    updateFlyoutHolder,
    fetchWishlist,
    fetchCustomDesignWishlist,
    triggerInitProcessFetch,
    fetchShoppingBag,
    setFlyoutState
} from 'actions/FlyoutActions';
import { setInitialCartAnalytics, formatStringForTracking } from 'lib/utils/analytics-util';
import classNames from 'classnames';
import iconData from 'lib/icon-util/icon-animations.json';
import Lottie from 'react-lottie';
import IC from 'constants/IconsConstants';
import HtmlCONSTANTS from 'constants/HtmlCalloutConstants';
import CustomScrollBar from 'components/common/CustomScrollBar';
import { toggle } from 'actions/InterceptorActions';

// Components
import FlyoutItems from 'components/common/FlyoutItems';

// import './index.scss';

/**
 * @description Flyout component for header
 * @class HeaderFlyout
 */
class HeaderFlyout extends React.Component {
    /**
     * @description constructor
     * @param {object} props props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.currentScroll = React.createRef();
        this.flyoutContainer = React.createRef();
        this.flyoutBackdrop = React.createRef();
        this.rightContainerFlyout = React.createRef();
        this.flyoutContent = React.createRef();
        this.totalQuantity = React.createRef();
        this.handleScroll = this.handleScroll.bind(this, this.flyoutContainer, this.flyoutBackdrop);
        const loginCookie = objectPath.get(window, 'tiffany.authoredContent.loginCookieName', 'loggedincust');

        this.state = {
            items: [],
            customItems: [],
            savedItems: [],
            customSavedItems: [],
            isLoggedOut: isFalse(cookieUtil.getCookies(loginCookie)),
            accountData: null,
            checkoutAnimation: false,
            segments: null,
            isStopped: true,
            isStoppedWishlist: true,
            isSaved: true,
            bagQuantity: 0,
            bagCustomDesignQuantity: 0,
            isMouseOver: false,
            ipadLandscape: false
        };

        this.mouseEnterHandler = this.mouseEnterHandler.bind(this);
        this.mouseEnterHandlerWishlist = this.mouseEnterHandlerWishlist.bind(this);
    }

    /**
     * @description component did mount
     * @returns {void}
     */
    componentDidMount() {
        const globalBannerEle = findFirst('.global-banner');
        const chooseCountryBanner = findFirst('.choose-country');

        window.addEventListener('orientationchange', this.setDeviceOrientation);

        if (globalBannerEle || chooseCountryBanner) {
            window.addEventListener('mouseover', this.handleScroll);
            window.addEventListener('scroll', this.handleScroll);
        }

        setTimeout(() => {
            this.handleScroll(this.flyoutContainer);
        }, 1000);

        if (this.props.type === 'shoppingbag') {
            const quantityIncreased = this.props.flyout.shoppingBagCount > (this.state.bagQuantity + this.state.bagCustomDesignQuantity);

            if (quantityIncreased) {
                this.setState({
                    isMouseOver: false,
                    segments: [1],
                    isStopped: false
                });
            }
        } else if (this.props.type === 'wishlist') {
            let savedItems = [];

            if (this.props && this.props.flyout.savedItems && this.props.flyout.savedItems.length > 0) {
                savedItems = objectPath.get(this.props, 'flyout.savedItems', []);
            }

            let customItems = JSON.parse(JSON.stringify(objectPath.get(this.props, 'flyout.customSavedItems', []))).map((item) => {
                item.isVisible = true;
                return item;
            }) || [];

            savedItems = savedItems.filter(item => Object.keys(item).length) || [];
            customItems = customItems.filter(item => Object.keys(item).length) || [];
            if (savedItems.length === 0 && customItems.length > 0) {
                this.setState({ isSaved: false });
            } else {
                this.setState({ isSaved: true });
            }

            if ((savedItems.length > this.state.savedItems.length) || (customItems.length > this.state.customSavedItems.length)) {
                this.setState({
                    isWishlistAdded: true,
                    isMouseOver: false,
                    segments: [1],
                    isStoppedWishlist: false
                });
            }

            this.setState({
                items: savedItems,
                customItems,
                savedItems,
                customSavedItems: customItems
            });
        } else {
            const { accountData } = this.props;

            this.setState({ accountData });
        }
    }


    /**
     * @description fetch the shopping bad data
     * @param {object} nextProps nextProps
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps && this.props !== nextProps) {
            let bagQuantity = 0;
            let bagCustomDesignQuantity = 0;

            if (this.props.type === 'shoppingbag') {
                const customDesignsTitle = objectPath.get(this.props.aem, 'shoppingBagFlyoutConfig.customDesignsTitle', '');
                let items = JSON.parse(JSON.stringify(objectPath.get(nextProps, 'flyout.itemsList.items', []))).filter((item) => {
                    if (!!item.item === true) {
                        bagQuantity += item.quantity;
                        return true;
                    }
                    return false;
                }) || [];

                let customItems = JSON.parse(JSON.stringify(objectPath.get(nextProps, 'flyout.customItemsList', []))).map((item) => {
                    item.title = customDesignsTitle;
                    item.designID = item.designId;
                    bagCustomDesignQuantity += item.quantity;
                    return item;
                }) || [];

                items = items.filter(item => Object.keys(item).length) || [];
                customItems = customItems.filter(item => Object.keys(item).length) || [];
                if (items.length === 0 && customItems.length > 0) {
                    this.setState({ isSaved: false });
                } else {
                    this.setState({ isSaved: true });
                }
                const quantityIncreased = (bagQuantity + bagCustomDesignQuantity) > (this.state.bagQuantity + this.state.bagCustomDesignQuantity);

                if (quantityIncreased) {
                    this.setState({
                        isMouseOver: false,
                        segments: [1],
                        isStopped: false
                    });
                }

                if ((items.length > this.state.items.length || customItems.length > this.state.customItems.length || quantityIncreased) && objectPath.get(nextProps, 'flyout.bagInitialized', true) && !this.props.aem.isExternalShoppingPage) {
                    addClass(this.rightContainerFlyout.current, 'item-add-anim');
                    setTimeout(() => {
                        addClass(this.flyoutContent.current, 'item-add-anim');
                    });
                    setTimeout(() => {
                        removeClass(this.flyoutContent.current, 'item-add-anim');
                        removeClass(this.rightContainerFlyout.current, 'item-add-anim');
                        this.props.dispatch(toggle(true));
                    }, this.props.animtimer || '2000');
                    this.props.dispatch(toggle(true));
                }

                this.setState({
                    items, customItems, bagQuantity, bagCustomDesignQuantity
                });
            } else if (this.props.type === 'wishlist' && this.props.flyout !== nextProps.flyout) {
                let savedItems = [];

                if (nextProps && nextProps.flyout.savedItems && nextProps.flyout.savedItems.length > 0) {
                    savedItems = objectPath.get(nextProps, 'flyout.savedItems', []);
                }

                let customItems = JSON.parse(JSON.stringify(objectPath.get(nextProps, 'flyout.customSavedItems', []))).map((item) => {
                    item.isVisible = true;
                    return item;
                }) || [];

                savedItems = savedItems.filter(item => Object.keys(item).length) || [];
                customItems = customItems.filter(item => Object.keys(item).length) || [];
                if (savedItems.length === 0 && customItems.length > 0) {
                    this.setState({ isSaved: false });
                } else {
                    this.setState({ isSaved: true });
                }

                if ((savedItems.length > this.state.savedItems.length) || (customItems.length > this.state.customSavedItems.length)) {
                    this.setState({
                        isWishlistAdded: true,
                        isMouseOver: false,
                        segments: [1],
                        isStoppedWishlist: false
                    });
                }

                if ((savedItems.length > this.state.items.length || customItems.length > this.state.customItems.length) && (objectPath.get(nextProps, 'flyout.wishListInitialized', true) && objectPath.get(nextProps, 'flyout.customWishListInitialized', true)) && !this.props.aem.isExternalShoppingPage) {
                    addClass(this.rightContainerFlyout.current, 'item-add-anim');
                    addClass(this.flyoutContent.current, 'item-add-anim');
                    this.props.dispatch(setFlyoutState());
                    setTimeout(() => {
                        removeClass(this.flyoutContent.current, 'item-add-anim');
                        removeClass(this.rightContainerFlyout.current, 'item-add-anim');
                        this.props.dispatch(toggle(true));
                        this.props.dispatch(setFlyoutState());
                    }, this.props.animtimer || '2000');
                }

                this.setState({
                    items: savedItems,
                    customItems,
                    savedItems,
                    customSavedItems: customItems
                });
            } else {
                const { accountData } = nextProps;

                this.setState({ accountData, isLoggedOut: isFalse(objectPath.get(accountData, 'userName', false)) });
            }
        }
    }

    /**
     * @description fetch the shopping bad data
     * @returns {void}
     */
    componentDidUpdate() {
        const bagItem = findFirst('.right-container > .right-container_item:last-child');
        const totalQuantity = findFirst('.total-quantity');

        if (this.flyoutContainer.current) {
            this.flyoutContainer.current.addEventListener('transitionend', this.transitionHandler);
        }

        if (totalQuantity && bagItem) {
            const quantityWidth = totalQuantity.getBoundingClientRect().width;

            bagItem.style.marginRight = `${quantityWidth}px`;
        } else if (bagItem) {
            bagItem.style.marginRight = 0;
        }
    }

    /**
     * @description component will unmount
     * @returns {void}
     */
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    /**
     * @description create shopping bag and wishlist
     * @returns {object} shopping bag / wishlist template
     */
    getWishlistShoppingBag() {
        let labels;
        const { isLoggedOut } = this.state;
        const isCartEmpty = this.state.items.length === 0 && this.state.customItems.length === 0 && this.props.flyout.shoppingBagCount === 0;
        const isWishListEmpty = this.props.customSavedItems.length === 0 && this.props.savedItems.length === 0;
        const quantity = this.state.bagQuantity + this.state.bagCustomDesignQuantity;
        const shippingText = objectPath.get(this.props, 'itemsList.shippingMessage.shippingTypeDisplayName', '');
        const addToWishlistAlertText = objectPath.get(this.props.labels, 'productAddedtoWishlist', 'Product added to wishlist');
        const defaultOptionsShoppingBag = {
            loop: false,
            autoplay: false,
            animationData: ((this.state.items.length !== 0 && this.state.customItems.length !== 0) || this.props.flyout.shoppingBagCount > 0) ? iconData['shoppingbag-item'] : iconData['shoppingbag-empty'],
            rendererSettings: {
                preserveAspectRatio: IC.SLICE_ASPECT
            }
        };
        const defaultOptionsWishlist = {
            loop: false,
            autoplay: false,
            segments: null,
            animationData: (this.state.items.length === 0 && this.state.customItems.length === 0) ? iconData['wishlist-empty'] : iconData['wishlist-item'],
            rendererSettings: {
                preserveAspectRatio: IC.SLICE_ASPECT
            }
        };
        const eventListeners = [{
            eventName: IC.ANIMATION_COMPLETE,
            callback: this.completeAnimationHandler
        }];

        if (this.props.type === 'shoppingbag') {
            const cartProducts = objectPath.get(window, 'dataLayer.ecommerce.cart.products', false);

            if (!cartProducts) {
                setInitialCartAnalytics(this.state.items);
            }

            labels = objectPath.get(window, 'tiffany.labels.shoppingBagFlyout', {});
            labels.bagSignInDataNavName = formatStringForTracking(labels.bagSignInDataNavName);
            labels.bagViewAllDataNavName = formatStringForTracking(labels.bagViewAllDataNavName);
            labels.bagCheckoutDataNavName = formatStringForTracking(labels.bagCheckoutDataNavName);
        } else if (this.props.type === 'wishlist') {
            labels = objectPath.get(window, 'tiffany.labels.wishlistFlyout', {});
            labels.wishViewAllDataNavName = labels.wishViewAllDataNavName ? formatStringForTracking(labels.wishViewAllDataNavName) : 'view-all';
            labels.wishlistSignInDataNavName = formatStringForTracking(labels.wishlistSignInDataNavName);
            labels.wishlistCustomerItemsDataIntName = formatStringForTracking(labels.wishlistCustomerItemsDataIntName);
        }

        const htmlCalloutConstants = {
            header: HtmlCONSTANTS.HEADER,
            navType: HtmlCONSTANTS.NAVTYPE[this.props.type],
            navName: this.props.navname
        };

        return (
            <div>
                <a
                    href={this.props.link}
                    title={this.props.label}
                    rel="noopener noreferrer"
                    tabIndex={0}
                    className={this.props.type === 'shoppingbag' ? 'shoppingbag' : 'wishlist'}
                    target={this.props.newtab ? '_blank' : false}
                    data-nav-context={htmlCalloutConstants.header}
                    data-nav-type={htmlCalloutConstants.navType}
                    data-nav-name={htmlCalloutConstants.navName}
                    onFocus={this.props.type === 'wishlist' ? this.mouseEnterHandlerWishlist : this.mouseEnterHandlerShoppingBag}
                    onBlur={this.props.type === 'wishlist' ? this.mouseLeaveHandlerWishlist : this.mouseLeaveHandlerShoppingBag}
                    onMouseEnter={this.props.type === 'wishlist' ? this.mouseEnterHandlerWishlist : this.mouseEnterHandlerShoppingBag}
                    onMouseLeave={this.props.type === 'wishlist' ? this.mouseLeaveHandlerWishlist : this.mouseLeaveHandlerShoppingBag}
                >
                    <div
                        className="cta-content account"
                        tabIndex={-1}
                    >
                        <Lottie
                            isStopped={this.props.type === 'shoppingbag' ? this.state.isStopped : this.state.isStoppedWishlist}
                            options={this.props.type === 'shoppingbag' ? defaultOptionsShoppingBag : defaultOptionsWishlist}
                            segments={this.state.segments}
                            eventListeners={eventListeners}
                        />
                        {this.props.type === 'shoppingbag' &&
                            <div ref={this.totalQuantity} className="total-quantity">
                                {(quantity > 0 || this.props.flyout.shoppingBagCount > 0) ?
                                    quantity || this.props.flyout.shoppingBagCount : ''
                                }
                            </div>
                        }
                    </div>
                </a>
                <div
                    className={
                        classNames('flyout-container', {
                            active: (this.props.flyout.flyoutType === this.props.type)
                        })
                    }
                    ref={this.flyoutContainer}
                    onMouseEnter={this.mouseEnterHandler}
                >

                    {this.state.isWishlistAdded &&
                        <p role="alert" className="wishlist-status" aria-label={addToWishlistAlertText} />
                    }
                    <CustomScrollBar ref={this.currentScroll}>
                        {isCartEmpty && this.props.type === 'shoppingbag' &&
                            <div>
                                <h3 className="flyout-items__heading">{labels.noCartItemsTitle}</h3>
                                <div className="flyout-items__description" dangerouslySetInnerHTML={{ __html: labels.cartDescription }} />
                            </div>
                        }
                        {isWishListEmpty && this.props.type === 'wishlist' &&
                            <div className="top-content">
                                <h3 className="flyout-items__heading">{labels.wishlistTitle}</h3>
                                <div className="flyout-items__description" dangerouslySetInnerHTML={{ __html: labels.wishlistDescription }} />
                            </div>
                        }
                        {isLoggedOut &&
                            <div className="signin-message">
                                {
                                    isCartEmpty && this.props.type === 'shoppingbag' &&
                                    <div className="cta-link">
                                        <p>{labels.cartMessage}</p>
                                        <a
                                            className="cta"
                                            href={labels.ctaUrl1}
                                            tabIndex={0}
                                            target={labels.ctaTarget1}
                                            data-nav-context="header"
                                            data-nav-type="shopping-bag"
                                            data-nav-name={labels.bagSignInDataNavName}
                                        >
                                            <span className="cta-content">
                                                <span className="cta-text" tabIndex="-1">
                                                    {labels.ctaText1}
                                                    <span className="icon-Right" />
                                                </span>
                                            </span>
                                        </a>
                                    </div>
                                }
                                {
                                    isWishListEmpty && this.props.type === 'wishlist' &&
                                    <div className="cta-link">
                                        <p>{labels.wishlistMessage}</p>
                                        <a
                                            className="cta"
                                            href={labels.ctaUrl}
                                            tabIndex={0}
                                            target={labels.ctaTarget}
                                            data-nav-context="header"
                                            data-nav-type="saved-items"
                                            data-nav-name={labels.wishlistSignInDataNavName}
                                        >
                                            <span className="cta-content">
                                                <span className="cta-text" tabIndex="-1">
                                                    {labels.ctaText}
                                                </span>
                                                <span className="icon-Right" />
                                            </span>
                                        </a>
                                    </div>
                                }
                                {!isCartEmpty && this.props.type === 'shoppingbag' &&
                                    <div className="cta-link">
                                        <p>{labels.cartItemsTitle}</p>
                                        <a
                                            className="cta"
                                            href={labels.ctaUrl2}
                                            tabIndex={0}
                                            target={labels.ctaTarget2}
                                            data-nav-context="header"
                                            data-nav-type="shopping-bag"
                                            data-nav-name={labels.bagSignInDataNavName}
                                        >
                                            <span className="cta-content">
                                                <span className="cta-text" tabIndex="-1">
                                                    {labels.ctaText2}
                                                </span>
                                                <span className="icon-dropdown-right" />
                                            </span>
                                        </a>
                                    </div>
                                }
                                {!isWishListEmpty && this.props.type === 'wishlist' &&
                                    <div className="cta-link">
                                        <p>{labels.wishlistMessage}</p>
                                        <a
                                            className="cta"
                                            href={labels.ctaUrl}
                                            tabIndex={0}
                                            target={labels.ctaTarget}
                                            data-nav-context="header"
                                            data-nav-type="saved-items"
                                            data-nav-name={labels.wishlistSignInDataNavName}
                                        >
                                            <span className="cta-content">
                                                <span className="cta-text" tabIndex="-1">
                                                    {labels.ctaText}
                                                </span>
                                                <span className="icon-dropdown-right" />
                                            </span>
                                        </a>
                                    </div>
                                }
                            </div>
                        }
                        {this.props.type === 'wishlist' && !isWishListEmpty &&
                            <div className="item-categories">
                                <div className="item-categories_container" role="tablist" aria-orientation="horizontal">

                                    {this.state.items.length > 0 &&
                                        <div
                                            className={
                                                classNames('saved-items', 'cta', {
                                                    selected: this.state.isSaved
                                                })
                                            }
                                            data-interaction-context="header"
                                            data-interaction-type="saved-items"
                                            data-interaction-name={labels.wishlistCustomerItemsDataIntName}
                                            onClick={() => { this.setState({ isSaved: true }); }}
                                            onKeyPress={() => { this.setState({ isSaved: true }); }}
                                            role="tab"
                                            aria-selected={this.state.isSaved}
                                            tabIndex={0}
                                            id="tab-saved-items"
                                            aria-controls="tab-saved-items-content"
                                        >
                                            {labels.savedItems}
                                        </div>
                                    }

                                    {this.state.customItems.length > 0 &&
                                        <div
                                            className={
                                                classNames('custom-designs', 'cta', {
                                                    selected: !this.state.isSaved
                                                })
                                            }
                                            data-interaction-context="header"
                                            data-interaction-type="saved-items"
                                            data-interaction-name={labels.wishlistCustomDesignDataIntName}
                                            onClick={() => { this.setState({ isSaved: false }); }}
                                            onKeyPress={() => { this.setState({ isSaved: false }); }}
                                            role="tab"
                                            tabIndex={0}
                                            aria-selected={!this.state.isSaved}
                                            id="tab-custom-designs"
                                            aria-controls="tab-custom-designs-content"
                                        >
                                            {labels.customDesigns}
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                        {!isCartEmpty &&
                            <div className="bag-items">
                                <div
                                    role="tabpanel"
                                    id="tab-saved-items-content"
                                    aria-labelledby="tab-saved-items"
                                >
                                    {
                                        this.state.isSaved && this.state.items.map((item, index) => {
                                            const key = `${this.props.type}-${item.sku}-${index}`;

                                            return <FlyoutItems customClass={`flyout-bag-items bag-item--${index}`} labels={labels} product={item} key={key} type={this.props.type} dispatch={this.props.dispatch} />;
                                        })
                                    }
                                </div>

                                <div
                                    role="tabpanel"
                                    id="tab-custom-items-content"
                                    aria-controls="tab-custom-items"
                                >
                                    {
                                        ((!this.state.isSaved || this.state.items.length === 0) || this.props.type === 'shoppingbag') && this.state.customItems.map((item, index) => {
                                            const key = index.toString();

                                            return <FlyoutItems customClass={`flyout-bag-items bag-item--${index}`} labels={labels} product={item} key={key} type={this.props.type} dispatch={this.props.dispatch} isCustom />;
                                        })
                                    }
                                </div>
                            </div>
                        }
                        <div className="complimentary-shipping">
                            {
                                !isCartEmpty && this.props.type === 'shoppingbag' &&
                                <h4 className="complimentary-shipping-message">{shippingText}</h4>
                            }
                            {
                                !isWishListEmpty &&
                                this.props.type === 'wishlist' &&
                                <div className="cta-link complimentary-shipping-options-link">
                                    <a
                                        className="cta"
                                        href={labels.ctaUrl2}
                                        tabIndex={0}
                                        target={labels.ctaTarget2}
                                        data-nav-context="header"
                                        data-nav-type="saved-items"
                                        data-nav-name={labels.wishViewAllDataNavName}
                                    >
                                        <span className="cta-content">
                                            <span className="cta-text" tabIndex="-1">
                                                {labels.ctaText2}
                                            </span>
                                        </span>
                                        <span className="icon-dropdown-right" />
                                    </a>
                                </div>
                            }
                        </div>
                        {!isCartEmpty && this.props.type === 'shoppingbag' &&
                            <div className="bag-details">
                                <a
                                    className="cta"
                                    href={labels.shoppingBagUrl}
                                    tabIndex={0}
                                    target={labels.shoppingBagTarget}
                                    data-nav-context="header"
                                    data-nav-type="shopping-bag"
                                    data-nav-name={labels.bagViewAllDataNavName}
                                >
                                    <span className="cta-content-2 cta-content">
                                        <span className="cta-text" tabIndex={-1}>
                                            {labels.shoppingBag}
                                        </span>
                                    </span>
                                    <span className="icon-dropdown-right" />
                                </a>
                                <div className="total">
                                    <button
                                        type="button"
                                        className={
                                            classNames('checkout-button primary-btn', {
                                                'active-btn': this.state.checkoutAnimation
                                            })
                                        }
                                        onClick={this.redirectToCheckout}
                                    >
                                        <div className="checkout-button_curtain" />
                                        <div className="primary-btn_content" tabIndex={-1} data-nav-context="header" data-nav-type="shopping-bag" data-nav-name={labels.bagCheckoutDataNavName}>
                                            <span className="cta-text-1" tabIndex={-1}>
                                                {labels.subtotalLabel}
                                                <span className="total-amount">{currencyFormatter(this.calculateTotalPrice(this.state.items, this.state.customItems))}</span>
                                            </span>
                                            <span className="cta-text-2" tabIndex={-1}>
                                                {labels.checkOut}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        }
                    </CustomScrollBar>
                </div>
            </div>
        );
    }

    /**
     * @description create login/Account flyout
     * @returns {object} login/Account template
     */
    getLoginContent() {
        const { isLoggedOut } = this.state;
        const labels = objectPath.get(window, 'tiffany.labels.loginFlyout', {});
        const myAccountLabels = objectPath.get(window, 'tiffany.labels.myAccountFlyout', {});
        const defaultOptionsAccount = {
            loop: false,
            autoplay: false,
            animationData: iconData['my-account'],
            rendererSettings: {
                preserveAspectRatio: IC.SLICE_ASPECT
            }
        };
        const eventListeners = [{
            eventName: IC.ANIMATION_COMPLETE,
            callback: this.completeAnimationHandler
        }];

        const htmlCalloutConstants = {
            header: HtmlCONSTANTS.HEADER,
            navType: HtmlCONSTANTS.NAVTYPE[this.props.type],
            navName: this.props.navname
        };

        myAccountLabels.accountSignInDataNavName = formatStringForTracking(myAccountLabels.accountSignInDataNavName);
        myAccountLabels.accountCreateAccDataNavName = formatStringForTracking(myAccountLabels.accountCreateAccDataNavName);
        myAccountLabels.accountOrderHistDataNavName = formatStringForTracking(myAccountLabels.accountOrderHistDataNavName);
        myAccountLabels.accountPersonalInfoDataNavName = formatStringForTracking(myAccountLabels.accountPersonalInfoDataNavName);
        myAccountLabels.accountLoginInfoDataNavName = formatStringForTracking(myAccountLabels.accountLoginInfoDataNavName);
        myAccountLabels.accountEmailPrefDataNavName = formatStringForTracking(myAccountLabels.accountEmailPrefDataNavName);
        myAccountLabels.accountAddrBookDataNavName = formatStringForTracking(myAccountLabels.accountAddrBookDataNavName);
        myAccountLabels.accountChangePrefStoreDataNavName = formatStringForTracking(myAccountLabels.accountChangePrefStoreDataNavName);

        return (
            <div>
                <a
                    href={this.props.link}
                    title={this.props.label}
                    className="user-account"
                    tabIndex={0}
                    target={this.props.newtab ? '_blank' : false}
                    onFocus={this.mouseEnterHandlerAccount}
                    onBlur={this.mouseLeaveHandlerAccount}
                    onMouseEnter={this.mouseEnterHandlerAccount}
                    onMouseLeave={this.mouseLeaveHandlerAccount}
                    data-nav-context={htmlCalloutConstants.header}
                    data-nav-type={htmlCalloutConstants.navType}
                    data-nav-name={htmlCalloutConstants.navName}
                >
                    <div className="cta-content account" tabIndex={-1}>
                        <div className="right-container_item">
                            <Lottie
                                isStopped={this.state.isStopped}
                                options={defaultOptionsAccount}
                                segments={this.state.segments}
                                eventListeners={eventListeners}
                            />
                        </div>
                        <div className="account-text">
                            {isLoggedOut ? this.props.text : `${myAccountLabels.prefixHeadlineText} ${objectPath.get(this.state, 'accountData.userName', 'User')}`}
                        </div>
                    </div>
                </a>
                <div
                    className={
                        classNames('flyout-container', {
                            active: (this.props.flyout.flyoutType === this.props.type)
                        })
                    }
                    ref={this.flyoutContainer}
                    onMouseEnter={this.mouseEnterHandler}
                >
                    <CustomScrollBar ref={this.currentScroll}>
                        {(isLoggedOut || isFalse(objectPath.get(this.state, 'accountData.userName', false))) &&
                            <Fragment>
                                <div>
                                    <h3 className="flyout-items__heading">{labels.title}</h3>
                                    <div className="flyout-items__description" dangerouslySetInnerHTML={{ __html: labels.description }} />
                                </div>
                                <div className="account-cta-links">
                                    {labels.signupText &&
                                        <a
                                            className="cta"
                                            href={labels.signupUrl}
                                            tabIndex={0}
                                            target={labels.signupTarget}
                                            data-nav-context="header"
                                            data-nav-type="account"
                                            data-nav-name={myAccountLabels.accountCreateAccDataNavName}
                                        >
                                            <span className="cta-content">
                                                <span className="cta-text" tabIndex="-1">{labels.signupText}</span>
                                                <span className="icon-Right" />
                                            </span>
                                        </a>
                                    }
                                    {labels.loginText &&
                                        <a
                                            className="cta"
                                            href={labels.loginUrl}
                                            tabIndex={0}
                                            target={labels.loginTarget}
                                            data-nav-context="header"
                                            data-nav-type="account"
                                            data-nav-name={myAccountLabels.accountSignInDataNavName}
                                        >
                                            <span className="cta-content">
                                                <span className="cta-text" tabIndex="-1">{labels.loginText}</span>
                                                <span className="icon-Right" />
                                            </span>
                                        </a>

                                    }
                                </div>
                            </Fragment>
                        }
                        {!isLoggedOut && this.state.accountData &&
                            <div>
                                <div>
                                    <p
                                        className="flyout-items__heading"
                                        role="heading"
                                        aria-level="3"
                                    >
                                        {myAccountLabels.prefixHeadlineText}
                                        &nbsp;
                                        {this.state.accountData.userName}
                                        &nbsp;
                                        {myAccountLabels.suffixHeadlineText}
                                    </p>
                                </div>
                                <div className="account-cta-links">
                                    {myAccountLabels.onlineOrdersHistoryLabel &&
                                        <a
                                            className="cta"
                                            href={myAccountLabels.onlineOrdersCtaUrl}
                                            tabIndex={0}
                                            target={myAccountLabels.onlineOrdersCtaTarget}
                                            data-nav-context="header"
                                            data-nav-type="account"
                                            data-nav-name={myAccountLabels.accountOrderHistDataNavName}

                                        >
                                            <span className="cta-content">
                                                <span className="cta-text" tabIndex="-1">{myAccountLabels.onlineOrdersHistoryLabel}</span>
                                            </span>
                                            <span className="icon-dropdown-right" />
                                        </a>
                                    }
                                    {myAccountLabels.personalInfoLabel &&
                                        <a
                                            className="cta"
                                            href={myAccountLabels.personalInfoCtaUrl}
                                            tabIndex={0}
                                            target={myAccountLabels.personalInfoCtaTarget}
                                            data-nav-context="header"
                                            data-nav-type="account"
                                            data-nav-name={myAccountLabels.accountPersonalInfoDataNavName}
                                        >
                                            <span className="cta-content">
                                                <span className="cta-text" tabIndex="-1">{myAccountLabels.personalInfoLabel}</span>
                                            </span>
                                            <span className="icon-dropdown-right" />
                                        </a>
                                    }
                                    {myAccountLabels.loginInfoLabel &&
                                        <a
                                            className="cta"
                                            href={myAccountLabels.loginInfoCtaUrl}
                                            tabIndex={0}
                                            target={myAccountLabels.loginInfoCtaTarget}
                                            data-nav-context="header"
                                            data-nav-type="account"
                                            data-nav-name={myAccountLabels.accountLoginInfoDataNavName}
                                        >
                                            <span className="cta-content">
                                                <span className="cta-text" tabIndex="-1">{myAccountLabels.loginInfoLabel}</span>
                                            </span>
                                            <span className="icon-dropdown-right" />
                                        </a>
                                    }
                                    {myAccountLabels.emailPreferenceLabel &&
                                        <a
                                            className="cta"
                                            href={myAccountLabels.emailPreferenceCtaUrl}
                                            tabIndex={0}
                                            target={myAccountLabels.emailPreferenceCtaTarget}
                                            data-nav-context="header"
                                            data-nav-type="account"
                                            data-nav-name={myAccountLabels.accountEmailPrefDataNavName}
                                        >
                                            <span className="cta-content">
                                                <span className="cta-text" tabIndex="-1">{myAccountLabels.emailPreferenceLabel}</span>
                                            </span>
                                            <span className="icon-dropdown-right" />
                                        </a>
                                    }
                                    {myAccountLabels.addressBookLabel &&
                                        <a
                                            className="cta"
                                            href={myAccountLabels.addressBookCtaUrl}
                                            tabIndex={0}
                                            target={myAccountLabels.addressBookCtaTarget}
                                            data-nav-context="header"
                                            data-nav-type="account"
                                            data-nav-name={myAccountLabels.accountAddrBookDataNavName}
                                        >
                                            <span className="cta-content">
                                                <span className="cta-text" tabIndex="-1">{myAccountLabels.addressBookLabel}</span>
                                            </span>
                                            <span className="icon-dropdown-right" />
                                        </a>
                                    }
                                    {myAccountLabels.signOutLabel &&
                                        <a
                                            className="cta"
                                            href={myAccountLabels.signOutUrl}
                                            tabIndex={0}
                                        >
                                            <span className="cta-content">
                                                <span className="cta-text" tabIndex="-1">{myAccountLabels.signOutLabel}</span>
                                            </span>
                                            <span className="icon-dropdown-right" />
                                        </a>
                                    }
                                </div>
                                {
                                    (this.state.accountData.storeName && myAccountLabels.preferredStoreLabel && myAccountLabels.preferredStoreLabel.trim().length > 0) &&
                                    <div className="flyout-store-details">
                                        <p className="preferred-store-label">{myAccountLabels.preferredStoreLabel}</p>
                                        <p className="store-name" data-nav-context="header" data-nav-type="account" data-nav-name={myAccountLabels.accountChangePrefStoreDataNavName}>{this.state.accountData.storeName}</p>
                                    </div>
                                }
                            </div>
                        }
                    </CustomScrollBar>
                </div>
            </div>
        );
    }

    /**
     * @description transition handler for container
     * @returns {void}
     */
    transitionHandler = () => {
        const scrollInstance = objectPath.get(this.currentScroll.current, 'customScroll.current');

        if (scrollInstance) {
            scrollInstance.updateScroll();
        }
    }

    /**
     * @description method to dispach on mouse leave event
     * @returns {void}
     */
    leftFlyout = () => {
        const isDesktopAndBelow = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;
        const flyout = findFirst('.expand-overlay');

        if (flyout) {
            removeClass(flyout, 'expand-overlay');
        }
        if (!isDesktopAndBelow) {
            this.props.dispatch(updateFlyoutHolder(''));
        }
    }

    /**
     * @description create shopping bag and wishlist
     * @returns {void}
     */
    redirectToCheckout = () => {
        this.setState({
            checkoutAnimation: true
        });
        setTimeout(() => {
            document.location.href = objectPath.get(window, 'tiffany.labels.shoppingBagFlyout.checkoutUrl', '');
        }, 600);
    }

    /**
     * @description this function sets device orientation
     * @returns {void}
     */
    setDeviceOrientation = () => {
        const isIpadLandscape = window.matchMedia(matchMedia.BREAKPOINTS.IPAD_LANDSCAPE).matches;
        const body = findFirst('body');

        if (hasClass(body, 'ipad') && isIpadLandscape) {
            this.setState({ ipadLandscape: true });
        } else {
            this.setState({ ipadLandscape: false });
        }
    }

    /**
     * @returns {void}
     */
    shoppingBagAnimation = () => {
        this.setState({
            isMouseOver: false,
            segments: [1],
            isStopped: false
        });
    }

    /**
     * @returns {void}
     */
    mouseEnterHandler = () => {
        const isDesktopAndBelow = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;

        if ((!isDesktopAndBelow || this.state.ipadLandscape) && ((!this.props.flyout.flyoutType && this.props.flyout.flyoutType !== this.props.type) || this.props.flyout.flyoutType)) {
            this.props.dispatch(updateFlyoutHolder(this.props.type));
        }
    }

    /**
     * @param {Object} event mouse enter event
     * @returns {void}
     */
    mouseEnterHandlerShoppingBag = (event) => {
        this.props.dispatch(toggle(false));
        const isDesktopAndBelow = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;

        if (!isDesktopAndBelow) {
            this.setState({
                isMouseOver: true,
                segments: [1],
                isStopped: false
            });
        }

        if ((!isDesktopAndBelow || this.state.ipadLandscape) && (this.props.flyout.flyoutType !== this.props.type || this.props.flyout.flyoutType)) {
            this.props.dispatch(updateFlyoutHolder(this.props.type));
        }

        if (!isDesktopAndBelow && this.props.type === 'shoppingbag') {
            event.preventDefault();
            if (this.props.aem.preventFlyoutHover && !this.props.flyout.flyoutInitShoppingCallDone) {
                this.props.dispatch(fetchShoppingBag());
                this.props.dispatch(triggerInitProcessFetch(true));
            } else if (!this.props.aem.preventFlyoutHover) {
                this.props.dispatch(fetchShoppingBag());
                this.props.dispatch(triggerInitProcessFetch(true));
            }
        }
    }

    /**
     * @returns {void}
     */
    mouseLeaveHandlerShoppingBag = () => {
        this.setState({
            isMouseOver: false,
            segments: [1],
            isStopped: true
        });
    }

    /**
     * @param {Object} event mouse enter event
     * @returns {void}
     */
    mouseEnterHandlerWishlist = (event) => {
        const isDesktopAndBelow = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;

        if (!isDesktopAndBelow) {
            this.setState({
                isMouseOver: true,
                segments: [1],
                isStoppedWishlist: false
            });
        }

        if ((!isDesktopAndBelow || this.state.ipadLandscape) && (this.props.flyout.flyoutType !== this.props.type || this.props.flyout.flyoutType)) {
            this.props.dispatch(updateFlyoutHolder(this.props.type));
        }

        if (!isDesktopAndBelow && this.props.type === 'wishlist') {
            event.preventDefault();
            if (this.props.aem.preventFlyoutHover && !this.props.flyout.flyoutInitCallDone) {
                this.props.dispatch(fetchWishlist());
                this.props.dispatch(fetchCustomDesignWishlist());
                this.props.dispatch(triggerInitProcessFetch());
            } else if (!this.props.aem.preventFlyoutHover) {
                this.props.dispatch(fetchWishlist());
                this.props.dispatch(fetchCustomDesignWishlist());
                this.props.dispatch(triggerInitProcessFetch());
            }
        }
    }

    /**
     * @returns {void}
     */
    mouseLeaveHandlerWishlist = () => {
        const isDesktopAndBelow = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;

        if (!isDesktopAndBelow) {
            this.setState({
                isMouseOver: false,
                segments: [1],
                isStoppedWishlist: true
            });
        }
    }

    /**
     * @returns {void}
     */
    mouseEnterHandlerAccount = () => {
        const animationData = iconData['my-account'];
        const isDesktopAndBelow = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;

        if (!isDesktopAndBelow) {
            this.setState({
                isMouseOver: true,
                segments: [1, animationData.op],
                isStopped: false
            });
        }

        if ((!isDesktopAndBelow || this.state.ipadLandscape) && (this.props.flyout.flyoutType !== this.props.type || this.props.flyout.flyoutType)) {
            this.props.dispatch(updateFlyoutHolder(this.props.type));
        }
    }

    /**
     * @returns {void}
     */
    mouseLeaveHandlerAccount = () => {
        this.setState({
            isMouseOver: false,
            segments: [1],
            isStopped: true
        });
    }

    /**
     * @returns {void}
     */
    completeAnimationHandler = () => {
        if (!this.state.isMouseOver) {
            if (this.props.type !== 'wishlist') {
                this.setState({
                    segments: [1],
                    isStopped: true
                });
            } else {
                this.setState({
                    segments: [1],
                    isStoppedWishlist: true
                });
            }
        }
    }

    /**
     * @description calculate total bag price
     * @param {array} items items
     * @param {array} customItems customItems
     * @returns {string} price
     */
    calculateTotalPrice(items, customItems) {
        let totalPrice = 0;

        items.forEach(item => {
            if (item.subTotalPrice) {
                totalPrice += objectPath.get(item, 'subTotalPrice', 0);
            } else {
                totalPrice += objectPath.get(item, 'itemPrice.price', 0);
            }
        });

        customItems.forEach(item => {
            if (item.price) {
                totalPrice += objectPath.get(item, 'price', 0);
            } else {
                totalPrice += objectPath.get(item, 'itemPrice.price', 0);
            }
        });

        return totalPrice;
    }

    /**
     * @description handle flyout top position
     * @param {object} flyoutContainer flyoutContainer
     * @returns {void}
     */
    handleScroll(flyoutContainer) {
        if (this.flyoutContainer && findFirst('header .header__nav-container')) {
            const rect = findFirst('header .header__nav-container').getBoundingClientRect();

            flyoutContainer.current.style.top = `${rect.bottom}px`;
            this.flyoutBackdrop.current.style.top = `${rect.bottom}px`;
        }
    }

    /**
     * @description React Render
     * @returns {void}
     */
    render() {
        const isWishlistOrShoppingBag = this.props.type === 'shoppingbag' || this.props.type === 'wishlist';
        const flyoutOpenClass = `${this.props.type}-flyout-open`;

        return (
            <article className="flyout">
                <div
                    className={classNames(`flyout-content ${flyoutOpenClass}`, {
                        active: (this.props.flyout.flyoutType === this.props.type)
                    })}
                    ref={this.flyoutContent}
                    onMouseEnter={this.mouseEnterHandler}
                >
                    {isWishlistOrShoppingBag && this.getWishlistShoppingBag()}
                    {!isWishlistOrShoppingBag && this.getLoginContent()}
                    <div
                        className="right-container-flyout"
                        ref={this.rightContainerFlyout}
                        onMouseLeave={this.leftFlyout}
                    >
                        <div role="button" tabIndex="0" onKeyDown={this.leftFlyout} className="flyout-non-mask_top" onMouseEnter={this.leftFlyout} onClick={this.leftFlyout} />
                    </div>
                    {
                        this.props.flyout.flyoutType &&
                        <Fragment>
                            <div className="flyout-non-mask_bottom" role="button" tabIndex="0" onKeyDown={this.leftFlyout} onMouseEnter={this.leftFlyout} onClick={this.leftFlyout} />
                            <div
                                role="button"
                                tabIndex="0"
                                className="flyout-non-mask"
                                onMouseEnter={this.leftFlyout}
                                onMouseOver={this.leftFlyout}
                                onFocus={this.leftFlyout}
                                onKeyDown={this.leftFlyout}
                                onClick={this.leftFlyout}
                            />
                        </Fragment>
                    }
                </div>
                <div className="flyout-backdrop" ref={this.flyoutBackdrop} />
            </article>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        flyout: state.flyout,
        itemsList: state.flyout.itemsList,
        customItemsList: state.flyout.customItemsList,
        savedItems: state.flyout.savedItems,
        accountData: state.flyout.accountData,
        customSavedItems: state.flyout.customSavedItems,
        aem: state.aem,
        labels: state.authoredLabels,
        isAddedToWishlist: state.wishlist.isAddtoWishlist
    };
};

HeaderFlyout.propTypes = {
    dispatch: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    text: PropTypes.string,
    link: PropTypes.string.isRequired,
    newtab: PropTypes.any,
    accountData: PropTypes.any,
    aem: PropTypes.any.isRequired,
    type: PropTypes.string.isRequired,
    animtimer: PropTypes.string.isRequired,
    flyout: PropTypes.object,
    labels: PropTypes.any.isRequired,
    navname: PropTypes.string
};

HeaderFlyout.defaultProps = {
    newtab: '',
    text: '',
    accountData: null,
    flyout: {},
    navname: ''
};


export default connect(mapStateToProps)(HeaderFlyout);
