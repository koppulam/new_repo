// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as objectPath from 'object-path';
// import debounceFun from 'lib/utils/debounce-util';
import MediaQuery from 'react-responsive';
import { addClass, hasClass, removeClass } from 'lib/dom/dom-util';
import { currencyFormatter } from 'lib/utils/currency-formatter';
import { enableBodyScroll } from 'lib/no-scroll';
// Components
import Picture from 'components/common/Picture';
import WishList from 'components/containers/WishList';
import TiffanyModal from 'components/common/TiffanyModal';
import isEqual from 'lodash/isEqual';

import { getByoGroup } from 'actions/BYOActions';
import { selectedProduct } from 'actions/OnHoverActions';
import HOVER from 'constants/OnHoverConstants';
import styleVariables from 'lib/utils/breakpoints';

import ByoOnProductTileHover from './ByoOnProductTileHover';


/**
 * Product Carousel Component
 */
class ByoTile extends React.Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            isSavedProduct: this.props.wishlist.skuId.indexOf(this.props.productProps.sku) >= 0,
            onHover: false,
            productDetails: {},
            keyBoardEnter: false,
            mouseOver: false,
            keyBoardFocus: false
        };
        this.timeoutFunc = null;
        this.productTileBody = React.createRef();
    }

    /**
     * Lifcycle hook
     * @param {*} nextProps changed props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.byo && nextProps.byo.selectedMaterialSku === this.props.productProps.sku && !isEqual(this.props.byo.byoGroupDetails, nextProps.byo.byoGroupDetails) && !nextProps.byo.byoSelectMaterialItemComplete) {
            let productData = {};

            productData = nextProps.byo.byoGroupDetails.length > 0 && nextProps.byo.byoGroupDetails.filter((item) => item.group.sku === nextProps.productProps.sku);

            if (Object.keys(productData).length > 0) {
                this.setState({
                    productDetails: {
                        productDetails: productData,
                        fixtureDetails: nextProps.productProps
                    }
                }, () => this.props.clickHandler(this.state.productDetails, this.productTileBody.current));
            }
        } else if (!isEqual(this.props.byo.byoSelectMaterialItemComplete, nextProps.byo.byoSelectMaterialItemComplete) && nextProps.byo.byoSelectMaterialItemComplete && this.props.productProps.sku === nextProps.byo.byoSelectMaterialItemComplete.item.sku) {
            this.setState({
                productDetails: {
                    productDetails: nextProps.byo.byoSelectMaterialItemComplete,
                    fixtureDetails: nextProps.productProps
                }
            }, () => this.props.clickHandler(this.state.productDetails, this.productTileBody.current));
        }

        if (this.props.index !== nextProps.onHoverProducts.selectedProduct && this.state.onHover) {
            this.setState({ onHover: false });
        }
    }

    /**
     * @description onProductTileHover onMouse Enter set the hover flag
     * @returns {void}
     */
    onProductTileHover = () => {
        if (this.state.keyBoardEnter || this.state.mouseOver || this.state.keyBoardFocus) {
            this.clearSelection();
            this.props.dispatch(selectedProduct(this.props.index));
        }
        this.setState({ onHover: true });
    }

    /**
     * @description onProductHover method invoke hover after 300
     * @param {Event} e event
     * @returns {void}
     */
    onProductHover = (e) => {
        const isDesktop = window.matchMedia(styleVariables.desktopAndAbove).matches;
        const element = this.productTileBody.current;

        if (hasClass(element, 'no-outline')) {
            removeClass(element, 'no-outline');
        }
        if (isDesktop && this.props.productProps.isHoverable) {
            // const onHoverFn = debounceFun(this.onProductTileHover, 300);

            if (e.type === 'mouseenter') {
                // e.currentTarget.focus();
                e.preventDefault();
                e.stopPropagation();
                this.setState({ keyBoardFocus: false, mouseOver: true, keyBoardEnter: false }, () => {
                    this.onProductTileHover();
                });
            } else if (e.type === 'focus') {
                this.setState({ keyBoardFocus: true, mouseOver: false, keyBoardEnter: false }, () => {
                    this.onProductTileHover();
                });
            } else if ((e.type === 'keydown' && e.key === 'Enter')) {
                this.setState({ keyBoardEnter: new Date().getTime(), mouseOver: false, keyBoardFocus: false }, () => {
                    this.onProductTileHover();
                });
            }
        } else if (!isDesktop && e.type === 'click') {
            this.setState({ keyBoardEnter: false, mouseOver: true, keyBoardFocus: false }, () => {
                this.onProductTileHover();
            });
        }
    }

    /**
     * @description onProductLeave method invoke hover after 300
     * @returns {void}
     */
    onProductLeave = () => {
        const element = this.productTileBody.current;

        if (!hasClass(element, 'no-outline')) {
            addClass(element, 'no-outline');
        }
        if (this.props.productProps.isHoverable) {
            this.setState({ keyBoardEnter: false, mouseOver: false, keyBoardFocus: false });
        }
    }

    /**
     * @description onProductBlur method reset the onHover stateObject to false
     * @returns {void}
     */
    onProductBlur = () => {
        const isDesktop = window.matchMedia(styleVariables.desktopAndAbove).matches;

        if (isDesktop) {
            if (this.props.productProps.isHoverable) {
                setTimeout(() => {
                    if (!this.productTileElement.contains(document.activeElement)) {
                        this.setState({ onHover: false });
                    }
                }, 0);
            }
        }
    }

    /**
     * @description getName method returns split Titles if passed param is an Array or a string
     * @param {string | array} name name captured from props
     * @returns {html | string} returns html if param is an array else returns a string
     */
    getName = (name) => {
        if (Array.isArray(name)) {
            return name.map((item, index) => {
                return (
                    <span
                        key={index.toString()}
                        className={classNames('product-tile__details_name__split')}
                        dangerouslySetInnerHTML={{ __html: item }}
                    />
                );
            });
        }
        return name;
    }

    /**
     * @param {Number} sku product sku
     * @param {Event} e Event object
     * @returns {object} html structure
     */
    getGroupDetails = (sku, e) => {
        if (e && e.type === 'keydown' && e.key !== 'Enter') {
            return;
        }
        if (this.props.productProps.isGroup) {
            const request = objectPath.get(window, 'tiffany.authoredContent.byoConfig.groupRequest', false);
            const groupDetails = this.props.byo.byoGroupDetails && this.props.byo.byoGroupDetails.length > 0 && this.props.byo.byoGroupDetails.filter((i) => { return i.group.sku === sku; });
            const hasProductDetails = groupDetails && groupDetails.length > 0;

            if (!hasProductDetails && request) {
                objectPath.set(request, 'payload.Sku', sku);
                this.props.dispatch(getByoGroup(request, true));
            } else if (hasProductDetails) {
                this.setState({
                    productDetails: {
                        productDetails: groupDetails,
                        fixtureDetails: this.props.productProps
                    }
                }, () => {
                    this.props.clickHandler(this.state.productDetails, this.productTileBody.current);
                });
            }
        } else {
            const request = JSON.parse(JSON.stringify(objectPath.get(this.props, 'aem.itemCompleteServiceConfig', {})));

            request.payload = JSON.parse(JSON.stringify(objectPath.get(this.props, 'aem.onHoverProductTileConfig.productPayload', {})));
            objectPath.set(request, 'payload.Sku', sku);
            this.props.dispatch(getByoGroup(request, true, true));
        }
    }

    /**
     * @description leaveHoverProdTile method reset the onHover stateObject to false
     * @returns {void}
     */
    leaveHoverProdTile = () => {
        const isDesktop = window.matchMedia(styleVariables.desktopAndAbove).matches;

        if (isDesktop) {
            this.clearSelection();
            if (this.props.productProps.isHoverable) {
                this.setState({ onHover: false });
            }
        }
    }

    /**
     * @description Will clear the product from onhover state
     * @returns {void}
     */
    clearSelection = () => {
        this.props.dispatch({
            type: HOVER.CLEAR_ON_HOVER
        });
    }

    /**
     * @description This will be triggered onmodal add charm action
     * @returns {void}
     */
    actionButtonHandler = () => {
        this.setState({ onHover: false }, () => {
            this.clearSelection();
        });
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const isDesktop = window.matchMedia(styleVariables.desktopAndAbove).matches;
        const newLabel = objectPath.get(this.props, 'labels.newLabel', 'New');
        const isEcommEnabled = objectPath.get(this.props.aem, 'byoConfig.isEcommEnabled', true);
        const {
            sku,
            image,
            name,
            isNew,
            price,
            isHoverable,
            sources,
            groupSku,
            productSku,
            title,
            nameSplit
        } = this.props.productProps;
        const isFavorite = !this.props.isMaterial && ((isHoverable && this.state.isSavedProduct) || !isHoverable || !isDesktop);
        const modalOptions = {
            overlay: true,
            className: 'size-modal',
            closeClass: 'close-modal',
            overlayClass: 'clasp-overlay',
            blockMobileScrollability: false
        };
        const isGroup = this.props.productProps.isGroup.toString();

        return (
            <article
                className={classNames('product-tile',
                    {
                        saved: this.state.isSavedProduct
                    })}
                data-sku={sku}
                ref={el => { this.productTileElement = el; }}
                onMouseLeave={!this.props.isMaterial ? this.leaveHoverProdTile : () => { }}
            >
                <div
                    className={classNames('product-tile__body',
                        {
                            'no-outline': this.props.index === this.props.onHoverProducts.selectedProduct
                        })}
                    role="button"
                    tabIndex={this.state.onHover ? -1 : 0}
                    ref={this.productTileBody}
                    onClick={this.props.isMaterial ? () => this.getGroupDetails(sku) : this.onProductHover}
                    onKeyUp={() => { }}
                    onKeyDown={this.props.isMaterial ? (e) => this.getGroupDetails(sku, e) : this.onProductHover}
                    onMouseEnter={!this.props.isMaterial ? this.onProductHover : () => { }}
                    onFocus={this.props.isMaterial ? () => { } : this.onProductHover}
                    onMouseLeave={!this.props.isMaterial ? this.onProductLeave : () => { }}
                >
                    <Picture
                        sources={this.props.isMaterial ? [] : sources}
                        defaultSrc={this.props.image ? this.props.image : image}
                        altText={name}
                        customClass="product-tile__body_image"
                        isLazyLoad={this.props.productProps.isLazyLoad}
                    />
                    <div className="tile-buttons">
                        {
                            isNew && !this.props.isChain &&
                            <span className="product-tile__new-title">{newLabel}</span>
                        }
                        {
                            (isFavorite && !this.props.isMaterial) && !this.props.isChain &&
                            <WishList
                                sku={productSku}
                                isgroup={isGroup}
                                groupsku={groupSku}
                                isInByo
                            />
                        }
                    </div>
                    {(this.props.isMaterial || !isDesktop) &&
                        <div className="product-tile__details">
                            <p
                                className={classNames('product-tile__details_name',
                                    {
                                        'price-na': !isEcommEnabled
                                    })}
                            >
                                {this.getName(nameSplit) || title}
                            </p>
                            {
                                isEcommEnabled &&
                                <p className="product-tile__details_price">{currencyFormatter(Math.floor(price))}</p>
                            }
                        </div>
                    }
                </div>
                {
                    (this.props.productProps.isHoverable && this.state.onHover) &&
                    <React.Fragment>
                        <MediaQuery query={styleVariables.desktopAndAbove}>
                            <ByoOnProductTileHover
                                onMouseLeave={this.leaveHoverProdTile}
                                sku={this.props.productProps.sku}
                                productSku={this.props.productProps.selectedSku ? this.props.productProps.selectedSku : this.props.productProps.sku}
                                isGroup={this.props.productProps.isGroup}
                                groupSku={this.props.productProps.selectedSku ? this.props.productProps.groupSku : ''}
                                isSavedProduct={this.state.isSavedProduct}
                                config="onHoverProductTileConfig"
                                parentTileProps={this.props.productProps}
                                index={this.props.index}
                                keyBoardEnter={this.state.keyBoardEnter}
                                keyBoardFocus={this.state.keyBoardFocus}
                                onProductBlur={this.onProductBlur}
                            />
                        </MediaQuery>
                    </React.Fragment>
                }
                <MediaQuery query={styleVariables.desktopAndBelow}>
                    {
                        this.state.onHover &&
                        <TiffanyModal
                            visible={this.state.onHover}
                            options={modalOptions}
                            onClose={() => {
                                enableBodyScroll('size-modal');
                                this.clearSelection();
                            }}
                        >
                            <ByoOnProductTileHover
                                showClose
                                onMouseLeave={this.leaveHoverProdTile}
                                sku={this.props.productProps.sku}
                                productSku={this.props.productProps.selectedSku ? this.props.productProps.selectedSku : this.props.productProps.sku}
                                isGroup={this.props.productProps.isGroup}
                                isSavedProduct={this.state.isSavedProduct}
                                config="onHoverProductTileConfig"
                                actionButtonHandler={this.actionButtonHandler}
                                parentTileProps={this.props.productProps}
                                index={this.props.index}
                                onProductBlur={this.onProductBlur}
                                groupSku={this.props.productProps.selectedSku ? this.props.productProps.groupSku : ''}
                            />
                        </TiffanyModal>
                    }
                </MediaQuery>
            </article>
        );
    }
}

ByoTile.propTypes = {
    productProps: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    clickHandler: PropTypes.func,
    aem: PropTypes.object.isRequired,
    isMaterial: PropTypes.bool,
    isChain: PropTypes.bool,
    wishlist: PropTypes.object.isRequired,
    byo: PropTypes.object.isRequired,
    onHoverProducts: PropTypes.object.isRequired,
    index: PropTypes.any,
    image: PropTypes.string
};

ByoTile.defaultProps = {
    clickHandler: () => { },
    isMaterial: false,
    isChain: false,
    index: null,
    image: ''
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        labels: state.authoredLabels,
        wishlist: state.wishlist,
        onHoverProducts: state.onHoverProducts,
        byo: state.byo
    };
};

export default connect(mapStateToProps)(ByoTile);
