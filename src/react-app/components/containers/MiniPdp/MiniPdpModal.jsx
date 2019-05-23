import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CONSTANTS from 'constants/MiniPDPConstants';
import { isSpaceOrEnter } from 'lib/dom/keyboard/key-code';
import initCustomEvents from 'lib/events/custom-event-init';
import * as objectPath from 'object-path';
import replace from 'lodash/replace';

import TiffanyModal from 'components/common/TiffanyModal';
import InformationText from 'components/common/InformationText';
import { toggleMiniPdpAction, openMiniModalAction } from 'actions/MiniPdpModalAction';
import AddToCart from '../ProductModifiers/AddToCart/index';
import ProductVariations from '../ProductModifiers/ProductVariations/index';
import ProductPreviewScene7 from '../ProductPreview/ProductPreviewScene7';

/**
 * Mini PDP Modal
 */
class MiniPdpModal extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        if (!window.CustomEvent) {
            initCustomEvents();
        }
        const script = document.createElement('script'); // create a script DOM node

        script.src = 'https://s7d9.scene7.com/s7viewers/html5/js/FlyoutViewer.js';
        document.head.appendChild(script);
        window.addEventListener(CONSTANTS.OPEN_MINI_PDP, this.openMiniPdpModal);
    }

    /**
     * @param {Object} evt event
     * @returns {void}
     */
    openMiniPdpModal = (evt) => {
        const { request } = this.props.aem && this.props.aem.miniPdpConfig;
        const { miniPdp } = this.props;
        let { skuId, groupId } = this.props;
        const validations = [
            true,
            undefined,
            ''
        ];

        if (evt.detail !== 1) {
            skuId = objectPath.get(evt.detail, 'skuId', '');
            groupId = objectPath.get(evt.detail, 'groupId', '');
        }
        const { products } = miniPdp;
        const productId = groupId ? `${groupId}_${skuId}` : skuId;
        let url = (validations.indexOf(groupId) !== -1) ? replace(request.url, 'group-GRP.', '') : replace(request.url, 'GRP', groupId);

        url = (validations.indexOf(skuId) !== -1) ? replace(url, '.sku-SKU', '') : replace(url, 'SKU', skuId);

        const reqObj = {
            ...request,
            url
        };

        if (productId && products && !products[productId]) {
            this.props.dispatch(openMiniModalAction(reqObj, productId));
        } else {
            this.props.dispatch(toggleMiniPdpAction(productId));
        }
    }

    /**
     * @returns {void}
     * @param {event} evt Event object
     */
    viewDetailsClick = (evt) => {
        if (evt && evt.type === 'keypress') {
            if (isSpaceOrEnter(evt)) {
                this.openMiniPdpModal();
            }
        } else {
            this.openMiniPdpModal();
        }
    }

    /**
     * @returns {void}
     */
    closeMiniPdp = () => {
        this.props.dispatch(toggleMiniPdpAction());
    }

    /**
     * eyebrowClcikHandler
     * @param {Object} event event
     * @param {string} hrefUrl hrefUrl
     * @returns {void}
     */
    eyebrowClickHandler = (event, hrefUrl) => {
        event.preventDefault();
        window.location.href = encodeURI(hrefUrl);
    }

    /**
     * @returns {object} Element
     */
    render() {
        const {
            products, isMiniPdpOpen, productId
        } = this.props;
        const { productDescription, viewDetails, pdpConfig } = products && products[productId] ? products[productId] : {};
        const modalOptions = {
            overlay: true,
            className: 'mini-pdp-modal',
            closeClass: 'close-modal',
            overlayClass: 'ash-overlay',
            blockMobileScrollability: true,
            blockDesktopScrollability: true,
            closeonTapOutside: {
                isClose: true,
                modalContainerClass: 'mini-pdp-wrapper'
            }
        };

        return (
            <TiffanyModal
                visible={isMiniPdpOpen}
                options={modalOptions}
            >
                <div className="mini-pdp-wrapper">
                    <button
                        type="button"
                        className="mini-pdp--close"
                        onClick={this.closeMiniPdp}
                    >
                        <img src={this.props.closeSrc} alt={this.props.closeAltText} />
                    </button>
                    <div className="container">
                        <div className="band-item base-item">
                            <ProductPreviewScene7
                                isMiniPdp={isMiniPdpOpen}
                                productId={productId}
                                config="productPreviewDetailsS7"
                            />
                        </div>
                        <div className="band-item base-item">
                            <article className="mini-description">
                                <div className="mini-description__container">
                                    {
                                        productDescription ?
                                            <div>
                                                <a
                                                    className="mini-description__container_eyebrow"
                                                    href={encodeURI(productDescription.eyebrowCtaLink)}
                                                    target={productDescription.eyebrowCtaTarget}
                                                    onClick={(event) => this.eyebrowClickHandler(event, productDescription.eyebrowCtaLink)}
                                                >
                                                    <span className="cta-content">
                                                        <span className="cta-text" tabIndex="-1">
                                                            {productDescription.eyebrowCtaText}
                                                        </span>
                                                    </span>
                                                </a>
                                                <div className="mini-description__container_title">
                                                    {productDescription.productName}
                                                </div>
                                                <div className="mini-description__container_short-description">
                                                    {productDescription.shortDescription}
                                                </div>
                                                {
                                                    productDescription.specifications.length > 0 &&
                                                    <ul className="mini-description__container_detail_list">
                                                        {
                                                            productDescription.specifications.map((spec, i) => {
                                                                return (<li key={i.toString()} className="mini-description__container_list">{spec}</li>);
                                                            })
                                                        }
                                                    </ul>
                                                }
                                            </div> :
                                            null
                                    }

                                    {
                                        viewDetails && viewDetails.ctaLink &&
                                        <a
                                            className="mini-description__container_viewdetails"
                                            href={viewDetails.ctaLink}
                                        >
                                            <span className="cta-content">
                                                <span className="cta-text" tabIndex="-1">
                                                    {viewDetails.ctaText}
                                                </span>
                                            </span>
                                        </a>
                                    }
                                    <div className="mini-description__modifier">
                                        <ProductVariations isMiniPdp={isMiniPdpOpen} productId={productId} config="modifiers" />
                                    </div>
                                </div>
                                <div className="mini-description__buttons">
                                    <AddToCart
                                        addtocartconfig="addToCartConfig"
                                        config={pdpConfig}
                                        isMiniPdp={isMiniPdpOpen}
                                        productId={productId}
                                        willStickToBottom={false}
                                    />
                                </div>
                                <div className="mini-description__taxinfo">
                                    <InformationText config="pdpTaxlabel" />
                                </div>
                            </article>

                        </div>
                    </div>
                </div>
            </TiffanyModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        products: state.miniPdp.products,
        closeSrc: objectPath.get(state, 'aem.icons.close.src', ''),
        closeAltText: objectPath.get(state, 'aem.icons.close.altText', ''),
        isMiniPdpOpen: state.miniPdp.isMiniPdpOpen,
        productId: state.miniPdp.productId,
        aem: state.aem,
        miniPdp: state.miniPdp
    };
};

MiniPdpModal.propTypes = {
    dispatch: PropTypes.func.isRequired,
    products: PropTypes.any.isRequired,
    isMiniPdpOpen: PropTypes.bool,
    closeSrc: PropTypes.string.isRequired,
    closeAltText: PropTypes.string.isRequired,
    productId: PropTypes.string,
    skuId: PropTypes.any,
    groupId: PropTypes.any,
    aem: PropTypes.any.isRequired,
    miniPdp: PropTypes.any.isRequired
};

MiniPdpModal.defaultProps = {
    isMiniPdpOpen: false,
    skuId: '',
    groupId: '',
    productId: ''
};

export default connect(mapStateToProps)(MiniPdpModal);
