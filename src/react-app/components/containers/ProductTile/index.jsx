// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as objectPath from 'object-path';
import debounceFun from 'lib/utils/debounce-util';
import matchMedia from 'lib/dom/match-media';

// Components
import Picture from 'components/common/Picture';
import OnProductTileHover from 'components/containers/OnProductTileHover';
import WishList from 'components/containers/WishList';
import { currencyFormatter } from 'lib/utils/currency-formatter';

/**
 * Product Tile Component
 */
class ProductTile extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            isSavedProduct: this.props.wishlist.skuId.indexOf(this.props.sku) >= 0,
            onHover: false,
            mouseEnter: false,
            isDesktop: !window.matchMedia(matchMedia.BREAKPOINTS.BELOW_EXACT_DESKTOP_TABLET).matches
        };
        this.isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.BELOW_EXACT_DESKTOP_TABLET);
    }

    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentDidMount() {
        this.isDesktop.addListener(this.resizeListener);
    }

    /**
     * Lifcycle hook
     * @param {*} nextProps changed props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.flyout.isWishlistOpen) {
            this.setState({
                onHover: false,
                mouseEnter: false
            });
        }
    }

    /**
     * @description component will unmount
     * @returns {void}
     */
    componentWillUnmount() {
        this.isDesktop.removeListener(this.resizeListener);
    }

    /**
     * @description onProductTileHover onMouse Enter set the hover flag
     * @returns {void}
     */
    onProductTileHover = () => {
        if (this.state.mouseEnter) {
            this.setState({ onHover: !this.state.onHover });
        }
    }

    /**
     * @description onProductHover method invoke hover after 300
     * @returns {void}
     */
    onProductHover = () => {
        if (this.props.isHoverable) {
            this.setState({ mouseEnter: true });
            const onHoverFn = debounceFun(this.onProductTileHover, 300);

            onHoverFn();
        }
    }

    /**
     * @description onProductHover method invoke hover after 300
     * @returns {void}
     */
    onProductLeave = () => {
        if (this.props.isHoverable) {
            if (this.props.isFullWidthShoppableTile && this.props.interceptor.count) {
                return;
            }
            this.setState({ mouseEnter: false });
        }
    }

    /**
     * @description onProductBlur method reset the onHover stateObject to false
     * @returns {void}
     */
    onProductBlur = () => {
        setTimeout(() => {
            if (!this.productTileElement.contains(document.activeElement)) {
                const onHoverFn = debounceFun(this.leaveHoverProdTile, 300);

                onHoverFn();
            }
        }, 0);
    }

    /**
     * @description onProductFocus method reset the onHover stateObject to false
     * @returns {void}
     */
    onProductFocus = () => {
        if (this.props.isHoverable) {
            this.setState({ mouseEnter: true });
            const onHoverFn = debounceFun(this.onProductTileHover, 300);

            onHoverFn();
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
     * @description getAltText method returns joined split Titles if passed param is an Array or a string
     * @param {string | array} name name captured from props
     * @returns {string} returns concated string if param is an array else returns a string
     */
    getAltText = (name) => {
        if (Array.isArray(name)) {
            return name.join(':');
        }
        return name;
    }

    /**
     * @description resize listner
     * @param {object} e event
     * @returns {void}
     */
    resizeListener = (e) => {
        this.setState({ isDesktop: !e.matches });
    }

    /**
     * @description leaveHoverProdTile method reset the onHover stateObject to false
     * @returns {void}
     */
    leaveHoverProdTile = () => {
        if (this.props.isHoverable) {
            if (this.props.isFullWidthShoppableTile && this.props.interceptor.count) {
                return;
            }
            this.setState({ onHover: false });
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const newLabel = objectPath.get(this.props, 'labels.newLabel', 'New');
        const priceCheck = (this.props.price && this.props.price > 0);
        const isGroup = this.props.isGroup.toString();
        const defTabIndex = this.state.onHover ? -1 : 0;
        const { isWishlistOpen } = this.props.flyout;

        return (
            <article
                className={classNames('product-tile',
                    {
                        saved: this.state.isSavedProduct
                    })}
                onMouseLeave={this.leaveHoverProdTile}
                tabIndex={-1}

                ref={el => { this.productTileElement = el; }}
            >
                <a
                    className="product-tile__body"
                    href={this.props.url}
                    onMouseEnter={this.onProductHover}
                    onFocus={this.onProductFocus}
                    aria-label={this.getAltText(this.props.name)}
                    onMouseLeave={this.onProductLeave}
                    onBlur={(event) => this.onProductBlur()}
                    tabIndex={this.props.tabIndexVal ? this.props.tabIndexVal : defTabIndex}
                >
                    <Picture
                        sources={this.props.sources}
                        defaultSrc={this.props.image}
                        altText={this.getAltText(this.props.name)}
                        customClass="product-tile__body_image"
                        isLazyLoad={this.props.isLazyLoad}
                        isHoverable={this.props.isHoverable}
                        onLoadHandler={this.props.onLoadHandler}
                    />
                    <div className="tile-buttons">
                        {
                            this.props.isNew &&
                            <span className="product-tile__new-title">{newLabel}</span>
                        }
                        {
                            (!this.props.isHoverable || !this.state.isDesktop) &&
                            <WishList
                                sku={this.props.productSku}
                                isgroup={isGroup}
                                groupsku={this.props.groupSku}
                                tabIndexVal={this.props.tabIndexVal ? this.props.tabIndexVal : undefined}
                            />
                        }
                        {/* <button
                            aria-label="Add to bag"
                            className="button_action bag-action"
                        >
                            <span className="icon-Shopping-Bag" />
                        </button> */}
                    </div>
                    <div className="product-tile__details">
                        <p
                            className={classNames('product-tile__details_name',
                                {
                                    'price-na': !((priceCheck && this.props.isIRExperience !== true))
                                })}
                        >
                            {this.getName(this.props.name)}
                        </p>
                        {(priceCheck && this.props.isIRExperience !== true) &&
                            <p className="product-tile__details_price">{currencyFormatter(Math.floor(this.props.price))}</p>
                        }
                    </div>
                </a>
                {
                    (this.state.isDesktop && this.props.isHoverable && this.state.onHover && !isWishlistOpen) &&
                    <OnProductTileHover
                        onMouseLeave={this.leaveHoverProdTile}
                        onProductBlur={this.onProductBlur}
                        sku={this.props.productSku}
                        isSavedProduct={this.state.isSavedProduct}
                        config="onHoverProductTileConfig"
                        tileData={this.props.productData}
                        isGroup={isGroup}
                        groupSku={this.props.groupSku}
                    />
                }
            </article>
        );
    }
}

ProductTile.propTypes = {
    sources: PropTypes.array,
    image: PropTypes.string.isRequired,
    isNew: PropTypes.bool.isRequired,
    isGroup: PropTypes.bool,
    isLazyLoad: PropTypes.bool,
    price: PropTypes.any,
    name: PropTypes.any.isRequired,
    url: PropTypes.string.isRequired,
    sku: PropTypes.string.isRequired,
    wishlist: PropTypes.object.isRequired,
    isHoverable: PropTypes.bool,
    productData: PropTypes.object,
    groupSku: PropTypes.string,
    productSku: PropTypes.string,
    isIRExperience: PropTypes.bool,
    onLoadHandler: PropTypes.func,
    // isEngagement: PropTypes.bool,
    interceptor: PropTypes.any.isRequired,
    isFullWidthShoppableTile: PropTypes.bool,
    flyout: PropTypes.any.isRequired
};

ProductTile.defaultProps = {
    isLazyLoad: true,
    isHoverable: false,
    productData: {},
    sources: [],
    price: '',
    isGroup: false,
    groupSku: '',
    productSku: '',
    isIRExperience: false,
    // isEngagement: false,
    onLoadHandler: () => { },
    isFullWidthShoppableTile: false
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        labels: state.authoredLabels,
        wishlist: state.wishlist,
        interceptor: state.interceptor,
        flyout: state.flyout
    };
};

export default connect(mapStateToProps)(ProductTile);
