import React from 'react';
import { connect } from 'react-redux';
import Waypoint from 'react-waypoint';
import PropTypes from 'prop-types';
import * as $ from 'jquery';
import isMatch from 'lodash/isMatch';
import * as objectPath from 'object-path';
import getKeyCode from 'lib/utils/KeyCodes';


import Picture from 'components/common/Picture';

import PRODUCT_CONSTANTS from 'constants/ProductConstants';
import CONSTANTS from 'constants/HtmlCalloutConstants';
import componentMap from 'react-app/componentMap.js';

import ByoTile from './ByoTile';

/**
 * @description Browse Grid component for all grids
 * @class BrowseGrid
 */
class ByoGrid extends React.Component {
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
    componentDidUpdate(prevProps) {
        if (!isMatch(prevProps.filters.selectedFilters, this.props.filters.selectedFilters) && this.props.stickyPoint) {
            $('html, body').animate({ scrollTop: this.props.stickyPoint }, 'slow');
        }
        if (this.isEnter && this.props.filters.focusProduct) {
            $(`article[data-sku="${this.props.filters.focusProduct.sku}"] .product-tile__body`).focus();
            this.isEnter = false;
            this.focusTile = null;
        }
    }

    /**
    * @description Returns Marketing tile or Product tile conditionally based on availability of slot.
    * @param {object} productItem The product item from the state.
    * @param {Number} index index
    * @returns {object} React.Component
    */
    getTile = (productItem, index) => {
        const Cmp = componentMap[productItem.component];
        let tile;
        const productProps = {
            ...productItem,
            isLazyLoad: objectPath.get(this.props.aem, 'browseConfig.isLazyLoad'),
            isHoverable: true,
            groupSku: productItem.selectedSku ? productItem.sku : '',
            productSku: productItem.selectedSku ? productItem.selectedSku : productItem.sku
        };

        if (productItem.sku) {
            tile = (<ByoTile
                productProps={productProps}
                index={index}
            />);
        } else if (productItem.component) {
            if (Cmp.isPure) {
                tile = (<Cmp.comp
                    {...productItem.props}
                />);
            } else {
                tile = (<Cmp.comp
                    config={productItem.key}
                    {...productItem.props}
                />);
            }
        } else {
            tile = (<Picture
                sources={productItem.sources}
                defaultSrc={productItem.defaultSrc}
                altText={productItem.altText}
                isLazyLoad={productItem.isLazyLoad}
            />);
        }

        return tile;
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
            this.props.onEndReached();
        } else if (e && !e.previousPosition && e.preventDefault) {
            e.preventDefault();
            this.props.onEndReached();
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
    * @returns {void}
    */
    processItems(newProps, tiles = this.state.tiles) {
        const tempTiles = [...tiles];

        const currentSize = tiles.length;
        const newDataLength = newProps.filters.products.length;

        for (let index = currentSize; index < newDataLength; index += 1) {
            const item = newProps.filters.products[index];
            const className = item.sku ? PRODUCT_CONSTANTS.BROWSE_GRID.PRODUCT_TILE_LAYOUT : PRODUCT_CONSTANTS.BROWSE_GRID.LAYOUT + item.layout;

            let style;

            if (item.col && item.row) {
                style = {
                    msGridColumn: item.col,
                    msGridRow: item.row
                };
            }

            const htmlCalloutConstants = {
                gridType: (item.isNew) ? CONSTANTS.INTERACTION_NEW : CONSTANTS.INTERACTION_STANDARD,
                groupSku: (item.isGroup) ? item.sku : undefined
            };

            tempTiles.push(
                <div
                    key={index.toString()}
                    className={className}
                    data-grid-position={index + 1}
                    data-grid-type={htmlCalloutConstants.gridType}
                    data-product-sku={item.selectedSku ? item.selectedSku : item.sku}
                    data-product-group-sku={htmlCalloutConstants.groupSku}
                    style={style}
                >
                    {this.getTile(item, index)}
                </div>
            );
            this.focusTile = item;
        }

        this.setState({
            tiles: tempTiles
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
                        <button
                            type="button"
                            className="cta cta-noflicker"
                            onClick={this.props.onEndReached}
                            onKeyPress={this.handleKeyPress}
                            data-interaction-context=""
                            data-interaction-type={CONSTANTS.LOAD_MORE}
                            data-interaction-name=""
                        >
                            <span className="cta-content">
                                <span className="show-more__label cta-text" tabIndex="-1">{objectPath.get(this.props.labels, 'showMoreLinkLabel', 'Load more')}</span>
                                <i className="icon-dropdown-down" />
                            </span>
                        </button>
                    </div>
                }
            </div>);
    }
}

ByoGrid.propTypes = {
    onEndReached: PropTypes.func,
    showCTA: PropTypes.bool.isRequired,
    filters: PropTypes.any.isRequired,
    stickyPoint: PropTypes.any.isRequired,
    aem: PropTypes.object,
    labels: PropTypes.object.isRequired
};

ByoGrid.defaultProps = {
    onEndReached: () => {

    },
    aem: {}
};

const mapStateToProps = (state) => {
    return {
        aem: state.aem,
        filters: state.filters,
        labels: state.authoredLabels
    };
};

export default connect(mapStateToProps, null, null, { withRef: true })(ByoGrid);
