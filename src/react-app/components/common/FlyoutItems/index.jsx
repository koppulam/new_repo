// Packages
import React from 'react';
import PropTypes from 'prop-types';
import * as objectPath from 'object-path';
import getKeyCode from 'lib/utils/KeyCodes';
import classNames from 'classnames';
import { findFirst, addClass } from 'lib/dom/dom-util';
import {
    removeItemFromShoppingBag,
    removeItemFromWishlist,
    wishlistAddToBag,
    removeCustomItemFromWishlist,
    wishlistAddDesignToBag,
    removeCustomItemFromShoppingBag
} from 'actions/FlyoutActions';
import { connect } from 'react-redux';
import { getFlyoutImageUrl } from 'lib/utils/format-data';
import { currencyFormatter } from 'lib/utils/currency-formatter';

import { formatStringForTracking, removeSavedItemsAnalytics } from 'lib/utils/analytics-util';

// Components
import Picture from 'components/common/Picture';

// import './index.scss';

/**
 * @description flyout item component
 * @class FlyoutItems
 */
class FlyoutItems extends React.Component {
    /**
     * @description constructor
     * @param {object} props props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.onRemove = this.onRemove.bind(this);
        this.onAddToBagClick = this.onAddToBagClick.bind(this);
    }

    /**
     * @description called on click or enter
     * @param {object} evt event
     * @returns {void}
     */
    onRemove(evt) {
        if (evt.type === 'keypress') {
            const type = getKeyCode(evt.which || evt.keyCode, evt.shiftKey);

            if (type === 'ENTER' || type === 'SPACE') {
                this.removeProductFromShoppingBag();
            }
        } else {
            this.removeProductFromShoppingBag();
        }
    }

    /**
     * @description called on click or enter
     * @param {object} evt event
     * @returns {void}
     */
    onAddToBagClick(evt) {
        if (evt.type === 'keypress') {
            const type = getKeyCode(evt.which || evt.keyCode, evt.shiftKey);

            if (type === 'ENTER' || type === 'SPACE') {
                this.addToBag();
            }
        } else {
            this.addToBag();
        }
    }

    /**
     * @description get price
     * @returns {void}
     */
    getPrice = () => {
        return objectPath.get(this.props, 'product.item.price', objectPath.get(this.props, 'product.price', 0));
    }

    /**
     * @description removes item from shopping bag
     * @returns {void}
     */
    removeProductFromShoppingBag() {
        const flyoutOpenClass = `${this.props.type}-flyout-open`;
        const flyout = findFirst(`.flyout-content.${flyoutOpenClass}`);

        if (flyout) {
            addClass(flyout, 'expand-overlay');
        }
        if (this.props.type === 'shoppingbag') {
            if (this.props.isCustom) {
                this.props.dispatch(removeCustomItemFromShoppingBag(this.props.product));
            } else {
                this.props.dispatch(removeItemFromShoppingBag(this.props.product));
            }
        } else if (this.props.isCustom) {
            this.props.dispatch(removeCustomItemFromWishlist(this.props.product.designID));
        } else {
            this.props.dispatch(removeItemFromWishlist(this.props.product));

            removeSavedItemsAnalytics(this.props.product);
        }
    }

    /**
     * @description removes item from shopping bag
     * @returns {void}
     */
    addToBag() {
        if (this.props.isCustom) {
            this.props.dispatch(wishlistAddDesignToBag(this.props.product.designID));
        } else {
            this.props.dispatch(wishlistAddToBag(this.props.product));
        }
    }

    /**
     * @returns {void}
     */
    render() {
        const bagViewDetailsDataNavName = objectPath.get(window, 'tiffany.labels.shoppingBagFlyout.bagViewDetailsDataNavName', '');
        const wishlistViewDetailsDataNavName = objectPath.get(this.props.authoredLabels, 'wishlistFlyout.wishlistViewDetailsDataNavName', 'view-details');
        const friendlyURL = this.props.product.item ? this.props.product.item.friendlyURL : (objectPath.get(this.props, 'labels.customDesignsCTALink', '') + this.props.product.designID);
        let byoCompositeImageUrl = objectPath.get(this.props.product, 'byoCompositeImageUrl', '');
        const isIRExperience = objectPath.get(this.props.product, 'isIRExperience', false);
        const isEcomSite = objectPath.get(this.props.aem, 'isEcomSite', true);
        const wishlistTyp = this.props.type === 'wishlist';
        const isPurchasable = objectPath.get(this.props, 'product.isPurchasable');
        const isLowInventory = objectPath.get(this.props, 'product.isLowInventory');
        const showViewDetails = wishlistTyp && isIRExperience;
        const viewDetailsCta = objectPath.get(this.props.labels, 'wishlistFlyoutViewDetails', 'view Details');
        const viewDetailsTarget = objectPath.get(this.props.labels, 'wishlistFlyoutViewDetailsTarget', '_new');
        const addTobagVisible = (wishlistTyp && isEcomSite && isPurchasable && !isIRExperience && !isLowInventory);
        const groupSku = objectPath.get(this.props.product, 'groupSku', '');
        const sku = objectPath.get(this.props.product, 'sku', 0);
        const checkForGroupSku = groupSku.length > 0;
        const checkForSku = sku === 0;
        const showPrice = !(isIRExperience && checkForGroupSku && checkForSku) && objectPath.get(this.props, 'product.itemRuleResult.showPrice', true);
        const priceDetail = showPrice ? currencyFormatter(this.props.product.subTotalPrice !== undefined ? this.props.product.subTotalPrice / this.props.product.quantity : this.getPrice()) : '';

        if (this.props.type === 'shoppingbag') {
            byoCompositeImageUrl = objectPath.get(this.props.product, 'itemMedia', '');
        }

        if ((this.props.type === 'shoppingbag' && !(this.props.product.item || this.props.isCustom)) || (this.props.type === 'wishlist' && !this.props.product.isVisible)) {
            return null;
        }
        return (
            <article className={`flyout-items ${this.props.customClass}`}>
                {(this.props.product.title || this.props.product.byoCompositeImageUrl || this.props.product.item || this.props.product.items) &&
                    <div className="flyout-items_product tf-g--no-wrap tf-g__no-wrap">
                        <div className="first-col">
                            <a
                                href={this.props.product.friendlyURL ? this.props.product.friendlyURL : friendlyURL}
                                title={`${this.props.product.title ? this.props.product.title : objectPath.get(this.props, 'product.item.title', objectPath.get(this.props, 'product.items.items.0.title', ''))}${this.props.isCustom ? ` ${objectPath.get(this.props.authoredLabels, 'customDesignCharmsTitle', '')}` : ''} ${showPrice ? priceDetail : ''} ${this.props.type === 'shoppingbag' ? `${this.props.labels.quantity} ${this.props.product.quantity}` : ''}`}
                                data-nav-context="header"
                                data-nav-type={this.props.type === 'shoppingbag' ? 'shopping-bag' : 'saved-items'}
                                data-nav-name={this.props.type === 'shoppingbag' ? formatStringForTracking(bagViewDetailsDataNavName) : formatStringForTracking(wishlistViewDetailsDataNavName)}
                                className="first-col-image"
                            >
                                {(this.props.product.itemMedia || this.props.product.itemMediaCollection || this.props.isCustom) &&
                                    <Picture
                                        defaultSrc={this.props.isCustom ? byoCompositeImageUrl : getFlyoutImageUrl(this.props.product.itemMedia ? this.props.product.itemMedia : this.props.product.itemMediaCollection)}
                                        altText={this.props.product.title ? this.props.product.title : objectPath.get(this.props, 'product.item.title', '')}
                                        customClass="product-image"
                                        isLazyLoad
                                    />
                                }
                            </a>
                        </div>
                        <div className="second-col tf-g tf-g__col tf-g__between">
                            <div className="pull-up tf-g tf-g__col show__inline">
                                {!this.props.isCustom &&
                                    <a href={this.props.product.friendlyURL ? this.props.product.friendlyURL : friendlyURL} tabIndex={0} title={this.props.product.title ? this.props.product.title : objectPath.get(this.props, 'product.item.title', '')} className="cta show__inline">
                                        <span className="product-title cta-content" tabIndex={-1}>{this.props.product.title ? this.props.product.title : objectPath.get(this.props, 'product.item.title', '')}</span>
                                    </a>
                                }
                                {
                                    showPrice &&
                                    <p className="product-price">{priceDetail}</p>
                                }
                            </div>
                            <div className="pull-down tf-g tf-g__col">
                                {
                                    (!wishlistTyp || addTobagVisible || showViewDetails || this.props.isCustom) &&
                                    <span className="product-quantity">
                                        {
                                            showViewDetails &&
                                            <a
                                                href={this.props.product.friendlyURL ? this.props.product.friendlyURL : friendlyURL}
                                                tabIndex={0}
                                                className="view-details-cta cta"
                                                target={viewDetailsTarget}
                                            >
                                                <span className="cta-content">
                                                    <span className="cta-text" tabIndex={-1}>
                                                        {viewDetailsCta}
                                                    </span>
                                                </span>
                                                <span className="icon-dropdown-right" />
                                            </a>
                                        }
                                        {
                                            (!showViewDetails || !wishlistTyp || this.props.isCustom) &&
                                            <span
                                                role="button"
                                                tabIndex={wishlistTyp ? 0 : -1}
                                                onClick={wishlistTyp ? this.onAddToBagClick : null}
                                                className={
                                                    classNames('product-quantity__item',
                                                        {
                                                            'hover-cta': wishlistTyp
                                                        })
                                                }
                                                onKeyPress={wishlistTyp ? this.onAddToBagClick : null}
                                            >
                                                {this.props.type === 'shoppingbag' ? `${this.props.labels.quantity} ${this.props.product.quantity}` : this.props.labels.addToBag}
                                                {this.props.type === 'wishlist' &&
                                                    <span className="icon-dropdown-right" />
                                                }
                                            </span>
                                        }
                                    </span>
                                }
                                <span
                                    className={
                                        classNames('product-remove', {
                                            'no-addtobag': !addTobagVisible && !showViewDetails
                                        })
                                    }
                                >
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        onClick={this.onRemove}
                                        className="product-quantity__item cta"
                                        onKeyPress={this.onRemove}
                                    >
                                        <span className="product-remove__item cta-content">{this.props.labels.remove}</span>
                                        <span className="icon-dropdown-right" />
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                }
            </article>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authoredLabels: state.authoredLabels,
        aem: state.aem
    };
};

FlyoutItems.propTypes = {
    dispatch: PropTypes.func.isRequired,
    labels: PropTypes.object.isRequired,
    product: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    isCustom: PropTypes.bool,
    customClass: PropTypes.string,
    authoredLabels: PropTypes.any.isRequired,
    aem: PropTypes.object.isRequired
};

FlyoutItems.defaultProps = {
    isCustom: false,
    customClass: ''
};

export default connect(mapStateToProps)(FlyoutItems);
