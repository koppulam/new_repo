import React from 'react';
import { connect } from 'react-redux';
import Waypoint from 'react-waypoint';
import PropTypes from 'prop-types';
import * as $ from 'jquery';
import isMatch from 'lodash/isMatch';
import classNames from 'classnames';

import * as objectPath from 'object-path';
import getKeyCode from 'lib/utils/KeyCodes';
import * as cookieUtil from 'lib/utils/cookies';

import ProductTile from 'components/containers/ProductTile';
import Picture from 'components/common/Picture';

import {
    getNextUrl,
    getScrollPosition,
    scrollOnPageLoad
} from 'lib/utils/filters';

import PRODUCT_CONSTANTS from 'constants/ProductConstants';
import CONSTANTS from 'constants/HtmlCalloutConstants';

import componentMap from 'react-app/componentMap.js';
import { toggle } from 'actions/InterceptorActions';
import { suppressMarketingTile } from 'actions/FiltersActions';

/**
 * @description Browse Grid component for all grids
 * @class BrowseGrid
 */
class Grid extends React.Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            tiles: []
        };
    }

    /**
    * @description Starts creating Tiles after component is mounted
    * @returns {void}
    */
    componentDidMount() {
        this.processItems(this.props);
        window.addEventListener('unload', this.setScrollPosition);
    }

    /**
    * @description add new Tiles after receiving new set of products
    * @param {object} nextProps updated Props
    * @returns {void}
    */
    componentWillReceiveProps(nextProps) {
        if (nextProps.filters.products !== this.props.filters.products) {
            this.processItems(nextProps, []);
        }
    }

    /**
     * @description add new Tiles after receiving new set of products
     * @param {object} prevProps updated Props
     * @returns {void}
     */
    componentWillUpdate(prevProps) {
        this.props.dispatch(toggle(false));
    }

    /**
     * @description add new Tiles after receiving new set of products
     * @param {object} prevProps updated Props
     * @returns {void}
     */
    componentDidUpdate(prevProps) {
        if (!isMatch(prevProps.filters.selectedFilters, this.props.filters.selectedFilters) && this.props.stickyPoint) {
            $('html, body').animate({ scrollTop: this.props.stickyPoint }, 'slow');
        }
        if (this.isEnter && this.props.filters && this.props.filters.focusProduct) {
            $(`article[data-sku="${this.props.filters.focusProduct.selectedSku}"] .product-tile__body`).focus();
            this.isEnter = false;
            this.focusTile = null;
        }
        this.props.dispatch(toggle(true));
    }

    /**
     * @description trigger when a component unmount from VDOM
     * @param {object} event event obj
     * @returns {void}
     */
    componentWillUnmount = (event) => {
        window.removeEventListener('beforeunload', this.setScrollPosition);
    }

    /**
     * @description - store scroll position
     * @param {object} event Event object
     * @returns {void}
     */
    setScrollPosition = (event) => {
        let scrollPosition = getScrollPosition();

        scrollPosition = {
            ...scrollPosition,
            url: window.location.href
        };
        cookieUtil.setCookie('scrollPosition', JSON.stringify(scrollPosition), { secure: true });
    }

    /**
    * @description Returns Marketing tile or Product tile conditionally based on availability of slot.
    * @param {object} productItem The product item from the state.
    * @returns {object} React.Component
    */
    getTile = (productItem) => {
        const Cmp = componentMap[productItem.component];
        let tile;
        const reRenderCallback = productItem.props ? {
            reRenderCallback: this.reRenderProcessItems
        } : () => { };
        let productSku;

        if (productItem.isGroup) {
            if (productItem.selectedSku.indexOf('GRP') !== -1) {
                productSku = '';
            } else {
                productSku = productItem.selectedSku;
            }
        } else {
            productSku = productItem.sku;
        }

        if (productItem.sku) {
            tile = (<ProductTile
                name={productItem.nameSplit}
                image={productItem.image}
                isNew={productItem.isNew}
                sku={productItem.sku}
                price={productItem.price}
                url={productItem.url}
                isGroup={productItem.isGroup}
                isLazyLoad={objectPath.get(this.props.aem, 'browseConfig.isLazyLoad')}
                productData={productItem}
                isHoverable
                isIRExperience={productItem.isIRExperience}
                groupSku={productItem.isGroup ? productItem.sku : ''}
                productSku={productSku}
                itemMaster={productItem.itemMasterNumber}
                isEngagement={this.props.type && this.props.type.toLowerCase() === 'bridal'}
            />);
        } else if (productItem.component) {
            if (Cmp.isPure) {
                tile = (<Cmp.comp
                    {...productItem.props}
                    {...reRenderCallback}
                />);
            } else {
                tile = (<Cmp.comp
                    config={productItem.key}
                    {...productItem.props}
                    {...reRenderCallback}
                />);
            }
        } else {
            const layoutTile = Object.keys(productItem).length > 1 ?
                (<Picture
                    sources={productItem.sources}
                    defaultSrc={productItem.defaultSrc}
                    altText={productItem.altText}
                    isLazyLoad={productItem.isLazyLoad}
                />) :
                null;

            tile = layoutTile;
        }

        return tile;
    }

    /**
    * @description Rerender the marketing product tile
    * @param {object} componentName Specifies the component name.
    * @param {string} config config specifies the config key.
    * @returns {object} React.Component
    */
    reRenderProcessItems = (componentName, config) => {
        this.props.dispatch(suppressMarketingTile(componentName, config, this.props.type));
    }

    /**
     * @description Resets the browse grid to initial state.
     * @returns {void}
     */
    reset = () => {
        this.setState({ tiles: [] });
    }

    /**
     * @description Will call the provided function for infinite scroll
     * @param {object} e Event object
     * @returns {void}
     */
    handleWaypointEnter = (e) => {
        if (e.previousPosition && e.previousPosition === 'below' && !this.props.showCTA) {
            this.props.onEndReached(e);
        } else if (e && !e.previousPosition && e.preventDefault) {
            e.preventDefault();
            this.props.onEndReached(e);
        }
    }

    /**
     * @param {e} e event key press
     * @returns {void}
     */
    handleKeyPress = (e) => {
        const charCode = e.which ? e.which : e.keyCode;

        const type = getKeyCode(charCode);

        this.isEnter = false;
        if (type === 'ENTER') {
            this.isEnter = true;
        }
    }

    /**
    * @description process products and generate Tiles
    * @param {object} newProps Props
    * @param {array} tiles tiles to append to
    * @param {string} componentName component name to suppress from the browsegrid.
    * @param {string} configName config name to differentiate the component if added multiple.
    * @returns {void}
    */
    processItems(newProps, tiles = this.state.tiles, componentName, configName) {
        const tempTiles = [...tiles];

        const currentSize = tiles.length;
        const newDataLength = newProps.filters.products.length;

        for (let index = currentSize; index < newDataLength; index += 1) {
            const item = newProps.filters.products[index];
            const className = item.sku ? PRODUCT_CONSTANTS.BROWSE_GRID.PRODUCT_TILE_LAYOUT : PRODUCT_CONSTANTS.BROWSE_GRID.LAYOUT + item.layout;
            const mobileLayout = item.mobileLayout ? PRODUCT_CONSTANTS.BROWSE_GRID.MOBILE_LAYOUT + item.mobileLayout : '';

            let style;

            if (item.col && item.row) {
                style = {
                    msGridColumn: item.col,
                    msGridRow: item.row
                };
            }

            // Dont show the component if the componentName exists and key name matches with the item.
            const componentCheck = (componentName && (componentName === item.component && configName === item.key));
            const htmlCalloutConstants = {
                gridType: item.isNew ? CONSTANTS.INTERACTION_NEW : CONSTANTS.INTERACTION_STANDARD,
                groupSku: item.isGroup ? item.sku : '',
                productSku: item.isGroup ? item.selectedSku : item.sku,
                itemMaster: item.itemMaster ? item.itemMaster : ''
            };

            if (!componentCheck) {
                tempTiles.push(
                    <div
                        key={index.toString()}
                        className={
                            classNames(className,
                                {
                                    [`${mobileLayout}`]: mobileLayout
                                })
                        }
                        style={style}
                        data-grid-position={index + 1}
                        data-product-item-master={htmlCalloutConstants.itemMaster}
                        data-grid-type={htmlCalloutConstants.gridType}
                        data-product-sku={htmlCalloutConstants.productSku}
                        data-product-group-sku={htmlCalloutConstants.groupSku}
                    >
                        {this.getTile(item)}
                    </div>
                );
            }
        }

        this.setState({
            tiles: tempTiles
        }, () => {
            if (!this.state.scrollPositionChecked || currentSize !== newDataLength) {
                let scrollPosition = cookieUtil.getCookies('scrollPosition');

                scrollPosition = scrollPosition && JSON.parse(scrollPosition);

                if (scrollPosition && (scrollPosition.url).toLowerCase() === (window.location.href).toLowerCase()) {
                    scrollOnPageLoad(scrollPosition);
                }
                this.setState({
                    ...this.state,
                    scrollPositionChecked: true
                });
            }
        });
    }

    /**
     * @returns {void}
     */
    render() {
        const isWavePoint = (!this.props.showCTA
            && this.props.filters.productsLength > 0
            && this.props.filters.productsLength < this.props.filters.total);
        const isShowCTA = (this.props.showCTA
            && this.props.filters.productsLength > 0
            && this.props.filters.productsLength < this.props.filters.total);

        return (
            <div className="marketing-product-tiles">
                <div className="browse-grid">
                    {this.state.tiles}
                </div>
                {
                    isWavePoint &&
                    <Waypoint onEnter={this.handleWaypointEnter} />
                }
                {
                    isShowCTA &&
                    <div className="show-more">
                        <a
                            rel="next"
                            href={getNextUrl('page')}
                            className="cta cta-noflicker"
                            onClick={this.props.onEndReached}
                            onKeyPress={this.handleKeyPress}
                            onMouseEnter={() => getNextUrl('page')}
                            data-interaction-context=""
                            data-interaction-type={CONSTANTS.LOAD_MORE}
                            data-interaction-name=""
                        >
                            <span className="cta-content">
                                <span className="show-more__label cta-text" tabIndex="-1">{objectPath.get(this.props.labels, 'showMoreLinkLabel', 'Load more')}</span>
                                <span className="icon-dropdown-down" />
                            </span>
                        </a>
                    </div>
                }
            </div>);
    }
}

Grid.propTypes = {
    onEndReached: PropTypes.func,
    showCTA: PropTypes.bool.isRequired,
    filters: PropTypes.any.isRequired,
    stickyPoint: PropTypes.any.isRequired,
    aem: PropTypes.object,
    labels: PropTypes.object.isRequired,
    isSkuUnavailable: PropTypes.bool,
    type: PropTypes.string.isRequired,
    isEngagement: PropTypes.bool.isRequired
};

Grid.defaultProps = {
    onEndReached: (event) => {
        event.preventDefault();
    },
    aem: {},
    isSkuUnavailable: false
};

const mapStateToProps = (state) => {
    return {
        aem: state.aem,
        filters: state.filters,
        labels: state.authoredLabels,
        isSkuUnavailable: state.textWithImage.isSkuUnavailable
    };
};

export default connect(mapStateToProps, null, null, { withRef: true })(Grid);
