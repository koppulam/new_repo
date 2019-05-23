import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import * as objectPath from 'object-path';
import { Menubutton } from 'lib/Menu/Menubutton2';
import { openMiniModalAction, toggleMiniPdpAction } from 'actions/MiniPdpModalAction';

import styleVariables from 'lib/utils/breakpoints';

// Components
import Picture from 'components/common/Picture';

// Import jQuery for toggle
const $ = require('jquery');

/**
 *  ProductVariations Component
 */
class ProductVariations extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        const { config, miniPdp, productId } = this.props;
        let configObject = {};

        this.sizeButton = React.createRef();
        if (!this.props.isMiniPdp) {
            if (config && typeof config === 'string') {
                const pdpModifers = this.props.pdpConfig[config];
                const modifiersDropdown = this.props.aem[config];

                configObject = modifiersDropdown || pdpModifers || {};
            }

            this.state = {
                productVariationsData: configObject,
                isVariationsOpen: false,
                modifierAriaLabel: this.props.labels.modifierAriaLabel
            };
        } else {
            if (config) {
                configObject = miniPdp.products && miniPdp.products[productId] && miniPdp.products[productId][config];
            }
            this.state = {
                productVariationsData: configObject,
                isVariationsOpen: false,
                modifierAriaLabel: this.props.labels.modifierAriaLabel
            };
        }
    }

    /**
     * @description Life cycle hook
     * @returns {void}
     */
    componentDidMount() {
        this.productVariationHandler();
        window.addEventListener('resize', this.productVariationHandler);
        window.addEventListener('toggleSizeFlyout', this.toggleSizeFlyoutHandler);
    }

    /**
     * @description lifecycle hook
     * @param {any} nextProps Next Props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        const { productId, config, miniPdp } = nextProps;
        let configObject = {};

        if (productId !== this.props.productId) {
            if (config) {
                configObject = miniPdp.products && miniPdp.products[productId] && miniPdp.products[productId][config];
            }
            this.setState({
                productVariationsData: configObject
            });
        }
    }

    /**
     * Lifcycle hook
     * @returns {void}
     */
    componentWillUnmount() {
        window.removeEventListener('resize', this.productVariationHandler);
        window.removeEventListener('toggleSizeFlyout', this.toggleSizeFlyoutHandler);
    }

    /**
     * redirect on selecting in mobile
     * @param {event} event on select
     * @param {Boolean} isDesktop on select
     * @param {String} sku on select
     * @param {string} group on select
     * @param {string} urlToRedirect of the link clicked
     * @returns {void}
     */
    onVariationsSelect = (event, isDesktop, sku, group, urlToRedirect = event.target.href) => {
        const {
            productVariationsData
        } = this.state;
        let variation = {};
        let groupId = '';

        event.preventDefault();
        if (sku) {
            variation = productVariationsData.variations.filter(variationElem => variationElem.sku === sku);
        } else {
            variation = productVariationsData.variations.filter(variationElem => variationElem.sku === event.target.value);
        }

        if (this.props.isMiniPdp) {
            let skuId;

            if (variation.length) {
                skuId = variation[0].sku;
                groupId = objectPath.get(variation[0], 'groupId', '');
            }

            if (group) {
                groupId = group;
            }

            // get new product details
            const {
                miniPdp
            } = this.props;
            const { request } = this.props.aem && this.props.aem.miniPdpConfig;
            const { products } = miniPdp;
            const url = (groupId === true || groupId === undefined || groupId === '') ? request.url.replace('group-GRP.', '') : request.url.replace('GRP', groupId);
            const reqObj = {
                ...request,
                url: (skuId === true || skuId === undefined) ? url.replace('.sku-SKU', '') : url.replace('SKU', skuId)
            };
            const productId = groupId ? `${groupId}_${skuId}` : skuId;


            if (productId && products && !products[productId]) {
                this.props.dispatch(openMiniModalAction(reqObj, productId));
            } else if (sku) {
                this.props.dispatch(toggleMiniPdpAction(productId, true));
            } else if (isDesktop && (urlToRedirect || event.target.href)) {
                window.location = urlToRedirect || event.target.href;
            } else {
                window.location = event.target.value;
            }
            this.toggleVariationsDropdown();
        } else {
            if (isDesktop) {
                this.toggleVariationsDropdown();
            }
            if (this.props.isEngagement) {
                window.location = urlToRedirect || event.target.href || event.target.value;
            } else if (Object.keys(variation).length === 1 && variation[0]) {
                window.location = variation[0].URL;
            } else {
                window.location = event.target.value;
            }
        }
    }

    /**
     * Calculates height of all the sticky header when scrolling
     * @returns {Number} height of sticky header
     */
    getHeaderHeight = () => {
        const stickyHeader = ['.stick.header__nav-container'];
        let headerHeight = 0;

        stickyHeader.forEach((element) => {
            // outer height is used only to take margin also into consideration if any
            headerHeight += (($(element).outerHeight()) ? $(element).outerHeight() : 0);
        });
        return headerHeight;
    }

    /**
     * Update element focus
     * @param {object} e event e
     * @returns {void}
     */
    toggleSizeFlyoutHandler = (e) => {
        if (e.detail === 'close' && this.sizeButton && this.sizeButton.current) {
            this.sizeButton.current.focus();
        }
    }

    /**
     * open size guide Modal
     * @returns {void}
     */
    openSizeGuideModal = () => {
        const customEvent = new CustomEvent('toggleSizeFlyout', {
            detail: 'open'
        });

        window.dispatchEvent(customEvent);
    }

    /**
     * toggle variations dropdown open and close class.
     * @returns {void}
     */
    toggleVariationsDropdown = () => {
        if (objectPath.get(this.state, 'productVariationsData.variations', []).length >= 1) {
            this.setState({
                isVariationsOpen: !this.state.isVariationsOpen
            });
        }
    }

    /**
     * productVariationHandler
     * @returns {void}
     */
    productVariationHandler = () => {
        if (this.menuElemButton && !this.menuButton) {
            this.menuButton = new Menubutton(this.menuElemButton);

            this.menuButton.init('.dropdownlist-animation-wrapper', 'modifier-link-selected');
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            productVariationsData = {},
            productVariationsData: {
                variations = []
            },
            isVariationsOpen = false
        } = this.state;
        const selectedVariations = variations.filter((element) => {
            return element.isSelected;
        });
        const selectedVariation = selectedVariations[0] || variations[0] || {};
        const showSizeSelectLabel = objectPath.get(productVariationsData, 'sizeGuideLabel', '');
        const showSizeSelectIcon = objectPath.get(productVariationsData, 'sizeGuideIcon', '');

        return (
            variations.length > 0 ?
                <div className={`modifiers__container ${this.props.customClass}`}>
                    <div className="modifiers__container_details">
                        <div className="modifiers__container_sizeguide_wrap">
                            <span className="modifiers__container_type">{productVariationsData.label}</span>
                            <MediaQuery query={styleVariables.desktopAndAbove}>
                                {showSizeSelectLabel &&
                                    <button type="button" className="modifiers__container_sizeguide cta-underline" ref={this.sizeButton} onClick={this.openSizeGuideModal}>
                                        {productVariationsData.sizeGuideLabel}
                                    </button>
                                }
                            </MediaQuery>
                            <MediaQuery query={styleVariables.desktopAndBelow}>
                                {showSizeSelectIcon &&
                                    <button type="button" className="modifiers__container_sizeguide_icon btn" onClick={this.openSizeGuideModal}>
                                        <img src={productVariationsData.sizeGuideIcon} alt={productVariationsData.sizeGuideIconAlt} />
                                    </button>
                                }
                            </MediaQuery>
                            <div
                                className="modifiers__container_dropdownbutton"
                            >
                                {
                                    (productVariationsData.isMotif || productVariationsData.isColorSwatch) && selectedVariation.imageURL &&
                                    <Picture
                                        defaultSrc={`${selectedVariation.imageURL}?wid=20&hei=20`}
                                        altText={selectedVariation.imageAlt || selectedVariation.label}
                                        isLazyLoad={false}
                                        customClass={productVariationsData.isColorSwatch ? 'modifiers__container_dropdownlist_image circle-image' : 'modifiers__container_dropdownlist_image'}
                                    />
                                }
                                <MediaQuery query={styleVariables.desktopAndBelow}>
                                    <div className="modifiers__container_dropdownbutton_select">
                                        <select
                                            id="modifiers_select"
                                            aria-label={`${this.state.modifierAriaLabel}
                                            ${productVariationsData.label}`}
                                            className="select-list"
                                            dir="rtl"
                                            onChange={this.onVariationsSelect}
                                        >
                                            {
                                                variations.map((variation, index) => {
                                                    return (
                                                        <option
                                                            data-sku={variation.sku}
                                                            value={this.props.isMiniPdp && variation.sku ? variation.sku : variation.URL}
                                                            selected={variation.isSelected}
                                                            dir="auto"
                                                            key={variation.label}
                                                        >
                                                            {variation.label}
                                                        </option>
                                                    );
                                                })
                                            }
                                        </select>
                                        <img
                                            src={this.props.dropdownSrc}
                                            alt={this.props.dropdownAltText}
                                            className="down-arrow"
                                        />
                                    </div>
                                </MediaQuery>
                                <MediaQuery query={styleVariables.desktopAndAbove}>
                                    <button
                                        type="button"
                                        aria-label={`${this.state.modifierAriaLabel} ${productVariationsData.label}, ${selectedVariation.label}`}
                                        aria-haspopup="true"
                                        id="menubutton"
                                        aria-controls="menu2"
                                        ref={(el) => { this.menuElemButton = el; }}
                                        className="button"
                                        onClick={this.toggleVariationsDropdown}
                                    >
                                        {selectedVariation.label}
                                        <img
                                            src={this.props.dropdownSrc}
                                            alt={this.props.dropdownAltText}
                                            className={
                                                classNames({
                                                    'up-arrow': isVariationsOpen,
                                                    'down-arrow': !isVariationsOpen
                                                })
                                            }
                                        />
                                    </button>
                                </MediaQuery>
                            </div>
                            <MediaQuery query={styleVariables.desktopAndBelow}>
                                {showSizeSelectIcon &&
                                    <button type="button" className="modifiers__container_sizeguide_icon btn compact" onClick={this.openSizeGuideModal}>
                                        <img src={productVariationsData.sizeGuideIcon} alt={productVariationsData.sizeGuideIconAlt} />
                                    </button>
                                }
                            </MediaQuery>
                        </div>
                    </div>
                    <MediaQuery query={styleVariables.desktopAndAbove}>
                        <div className="dropdownlist-animation-wrapper">
                            <ul
                                aria-expanded={isVariationsOpen}
                                role="menu"
                                id="menu2"
                                aria-labelledby="menubutton"
                                className={
                                    classNames('modifiers__container_dropdownlist',
                                        {
                                            imageAvailable: productVariationsData.isMotif || productVariationsData.isColorSwatch
                                        })
                                }
                            >
                                {
                                    variations.map((variation, index) => {
                                        return (
                                            <li role="none" className="modifiers__container_dropdownlist_item" key={variation.label}>
                                                <div className="modifiers__container_dropdownlist_item--link">
                                                    <a
                                                        role="menuitem"
                                                        aria-setsize={variations.length}
                                                        aria-posinset={index + 1}
                                                        tabIndex="0"
                                                        aria-label={variation.label}
                                                        href={variation.URL}
                                                        onClick={(e) => { this.onVariationsSelect(e, true, variation.sku, variation.groupId, variation.URL); }}
                                                        className={
                                                            classNames('modifier-link',
                                                                {
                                                                    'modifier-link-selected': variation.isSelected
                                                                })
                                                        }
                                                    >
                                                        {
                                                            (productVariationsData.isMotif || productVariationsData.isColorSwatch) && variation.imageURL &&
                                                            <Picture
                                                                defaultSrc={`${variation.imageURL}?wid=20&hei=20`}
                                                                altText={variation.imageAlt || variation.label}
                                                                isLazyLoad={false}
                                                                customClass={productVariationsData.isColorSwatch ? 'modifiers__container_dropdownlist_image circle-image' : 'modifiers__container_dropdownlist_image'}
                                                            />
                                                        }
                                                        <span className="label">{variation.label}</span>
                                                    </a>
                                                </div>
                                            </li>);
                                    })
                                }
                            </ul>
                        </div>
                    </MediaQuery>
                </div> :
                null
        );
    }
}

ProductVariations.propTypes = {
    pdpConfig: PropTypes.object.isRequired,
    config: PropTypes.string.isRequired,
    labels: PropTypes.object.isRequired,
    customClass: PropTypes.string,
    aem: PropTypes.any.isRequired,
    dropdownSrc: PropTypes.string.isRequired,
    dropdownAltText: PropTypes.string.isRequired,
    isMiniPdp: PropTypes.bool,
    miniPdp: PropTypes.any.isRequired,
    productId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isEngagement: PropTypes.bool
};

ProductVariations.defaultProps = {
    customClass: '',
    isMiniPdp: false,
    productId: '',
    isEngagement: false
};

const mapStateToProps = (state, ownProps) => {
    return {
        pdpConfig: state.productDetails.pdpConfig,
        labels: state.authoredLabels,
        aem: state.aem,
        dropdownSrc: objectPath.get(state, 'aem.icons.dropdown.src', ''),
        dropdownAltText: objectPath.get(state, 'aem.icons.dropdown.altText', ''),
        miniPdp: state.miniPdp
    };
};

export default connect(mapStateToProps)(ProductVariations);
