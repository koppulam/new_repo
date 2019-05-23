// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import * as objectPath from 'object-path';
import Lottie from 'react-lottie';
import iconData from 'lib/icon-util/icon-animations.json';
import IC from 'constants/IconsConstants';
import matchMedia from 'lib/dom/match-media';

// Actions
import { addToWishlist, removeFromWishlist } from 'actions/WishlistActions';

import { removeSavedItemsAnalytics } from 'lib/utils/analytics-util';

// import './index.scss';

/**
 * Wishlist Component
 */
class WishList extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        const isSavedProduct = this.checkForSavedProducts(this.props);

        this.state = {
            isSavedProduct,
            segments: null,
            isStopped: true
        };
        this.wishListButtonRef = React.createRef();
    }

    /**
     * @param {*} nextProps changed props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.wishlist, nextProps.wishlist)) {
            const isSaved = this.checkForSavedProducts(nextProps);

            if (this.state.isSavedProduct !== isSaved) {
                this.updateProductDetails(nextProps);
            }
        }
    }

    /**
     * @description checkForSavedProducts cheked for IsSavedProduct.
     * @param {Object} item Props to perform check.
     * @returns {void}
     */
    checkForSavedProducts = (item) => {
        const groupTypeCheck = item.groupsku && item.wishlist.groupTypeList.indexOf(item.groupsku.toString()) >= 0;
        const skuIdCheck = item.wishlist.skuId.indexOf(item.sku.toString()) >= 0;
        const groupskuCheck = item.wishlist.skuId.indexOf(item.groupsku.toString()) >= 0;
        const prodCheck = item.sku && !groupTypeCheck ? skuIdCheck : groupskuCheck;

        return prodCheck;
    }

    /**
     * @description Will hide the component when no data
     * @param {Object} props product data
     * @returns {void}
     */
    updateProductDetails = (props) => {
        this.setState({
            isSavedProduct: this.checkForSavedProducts(props)
        }, () => {
            this.setState({
                isStopped: false
            });
        });
    }

    /**
     * @description Will hide the component when no data
     * @param {Event} event Event object
     * @returns {void}
     */
    handleFavoriteClick = (event) => {
        if (event) {
            event.preventDefault();
        }

        if (this.props.isInByo && event) {
            event.stopPropagation();
        }
        const deleteData = cloneDeep(objectPath.get(this.props.aem, 'wishlistConfig.delete', {}));
        const addData = cloneDeep(objectPath.get(this.props.aem, 'wishlistConfig.add', {}));

        // Remove wishlist item
        if (this.state.isSavedProduct) {
            objectPath.set(deleteData, 'payload.listItemIDs', this.props.wishlist.listId[this.props.sku] || this.props.wishlist.listId[this.props.groupsku]);
            this.props.dispatch(removeFromWishlist(deleteData, addData));
            removeSavedItemsAnalytics({ sku: this.props.sku || this.props.groupsku });
            return;
        }

        if (addData.payload) {
            delete addData.payload.sku;
            delete addData.payload.groupsku;
        }

        if (this.props.groupsku) {
            objectPath.set(addData, 'payload.groupSku', this.props.groupsku);
        }
        if (this.props.sku && (!this.props.isGroupTwo || this.props.isGroupTwo === 'false')) {
            objectPath.set(addData, 'payload.sku', this.props.sku);
        }

        this.props.dispatch(addToWishlist(addData));
    }

    /**
     * @returns {void}
     */
    mouseEnterHandler = () => {
        const isDesktopAndBelow = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;

        if (!isDesktopAndBelow) {
            this.setState({
                isMouseOver: true,
                segments: [1],
                isStopped: false
            });
        }
    }

    /**
     * @returns {void}
     */
    mouseLeaveHandler = () => {
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
        const isDesktopAndBelow = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;

        if (!this.state.isMouseOver || isDesktopAndBelow) {
            this.setState({
                segments: [1],
                isStopped: true
            });
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const wishlistLabel = this.state.isSavedProduct ? objectPath.get(window.tiffany, 'labels.wishlistRemoveLabel', 'Click to remove from wishlist') : objectPath.get(window.tiffany, 'labels.wishlistAddLabel', 'Click to add to wishlist');
        const defaultOptions = {
            loop: false,
            autoplay: false,
            animationData: this.state.isSavedProduct ? iconData['wishlist-item'] : iconData['wishlist-empty'],
            rendererSettings: {
                preserveAspectRatio: IC.SLICE_ASPECT
            }
        };
        const eventListeners = [{
            eventName: IC.ANIMATION_COMPLETE,
            callback: this.completeAnimationHandler
        }];
        const isEstore = objectPath.get(this.props.aem, 'isEstore');

        return (
            !isEstore ?
                <button
                    type="button"
                    aria-label={wishlistLabel}
                    onClick={this.handleFavoriteClick}
                    onFocus={this.mouseEnterHandler}
                    onBlur={this.mouseLeaveHandler}
                    onMouseEnter={this.mouseEnterHandler}
                    onMouseLeave={this.mouseLeaveHandler}
                    className="wishlist"
                    tabIndex={this.props.tabIndexVal || undefined}
                >
                    <Lottie
                        ariaLabel={wishlistLabel}
                        isStopped={this.state.isStopped}
                        options={defaultOptions}
                        segments={this.state.segments}
                        eventListeners={eventListeners}
                    />
                </button> : null
        );
    }
}

const mapStateToProps = (state) => {
    return {
        aem: state.aem,
        wishlist: state.wishlist,
        labels: state.authoredLabels
    };
};

WishList.defaultProps = {
    groupsku: '',
    isGroupTwo: false,
    isInByo: false
};

WishList.propTypes = {
    aem: PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired,
    wishlist: PropTypes.object.isRequired,
    sku: PropTypes.string.isRequired,
    groupsku: PropTypes.string,
    isGroupTwo: PropTypes.bool,
    isInByo: PropTypes.bool
};

export default connect(mapStateToProps, null, null, { withRef: true })(WishList);
