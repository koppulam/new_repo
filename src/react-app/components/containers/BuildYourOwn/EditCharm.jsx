// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as objectPath from 'object-path';
import { getBYOImageURL, getFixtureImageURL, getBYOCharmImageURL } from 'lib/utils/format-data';
import MediaQuery from 'react-responsive';
import styleVariables from 'lib/utils/breakpoints';
import Picture from 'components/common/Picture';
import { editCharm, getCharmVariation } from 'actions/BYOActions';
/**
 * Product Carousel Component
 */
class EditCharm extends React.Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: false,
            sizeSelected: false,
            showError: false,
            charmFixture: this.props.byo.charmsOnFixture[this.props.byo.charmIndexOnFix]
        };
    }

    /**
     * set token.
     * @returns {void}
     */
    componentDidMount() {
        const {
            productDetails
        } = this.props;
        const variationExists = objectPath.get(productDetails, 'variation.selectedVariation', false);

        if (!variationExists) {
            this.getVariation();
        }
    }

    /**
     * @param {object} size selected size data
     * @param {Number} index size index
     * @returns {object} html structure
     */
    setSizeSelection = (size, index) => {
        const charm = this.state.charmFixture;

        charm.variation.selectedVariation = size;
        this.setState({
            selectedIndex: index,
            charmFixture: charm,
            sizeSelected: true,
            showError: false
        });
    }

    /**
     * @param {object} size selected size data
     * @returns {void}
     */
    getVariation = () => {
        const requestPayload = JSON.parse(JSON.stringify(objectPath.get(window, 'tiffany.authoredContent.onHoverProductTileConfig.productPayload', {})));
        const groupComplete = JSON.parse(JSON.stringify(objectPath.get(window, 'tiffany.authoredContent.byoConfig.groupRequest', {})));

        requestPayload.Sku = this.state.charmFixture.groupSku;
        groupComplete.payload = requestPayload;

        this.props.dispatch(getCharmVariation(groupComplete, this.state.charmFixture.selectedSku, this.state.charmFixture.fixtureIndex));
    }

    /**
     * @param {object} charmFixture charmFixture
     * @returns {object} html structure
     */
    validateSizeSelection = () => {
        if (this.state.sizeSelected && this.state.charmFixture) {
            let charm = this.state.charmFixture;
            const { selectedVariation } = charm.variation;
            const mediaTypeID = objectPath.get(this.props.aem, 'byoConfig.charmMediaTypeId', 0);
            const mediaPreset = objectPath.get(this.props.aem, 'byoConfig.charmImagePreset', 0);
            const colpoMediaTypeID = objectPath.get(this.props.aem, 'byoConfig.colpoMediaTypeId', 0);
            const queryParam = objectPath.get(this.props.aem, 'byoConfig.charmImageQueryParam', '');
            const claspParam = objectPath.get(this.props.aem, 'byoConfig.charmImageClaspQueryParam', '');
            const colpoParam = objectPath.get(this.props.aem, 'byoConfig.colpoImageClaspQueryParam', '');
            const imageURL = getBYOImageURL(selectedVariation);

            if (!selectedVariation.itemMedia) {
                return false;
            }
            charm = {
                ...charm,
                price: selectedVariation.price,
                imageURL,
                transparentURL: getFixtureImageURL(selectedVariation.itemMedia.imageUrlFormat, mediaPreset, selectedVariation.itemMedia.imagePrefix, mediaTypeID, selectedVariation.itemMedia.itemMedia, queryParam),
                claspURL: getFixtureImageURL(selectedVariation.itemMedia.imageUrlFormat, mediaPreset, selectedVariation.itemMedia.imagePrefix, mediaTypeID, selectedVariation.itemMedia.itemMedia, queryParam) + claspParam,
                colpoTransparentURL: getFixtureImageURL(selectedVariation.itemMedia.imageUrlFormat, mediaPreset, selectedVariation.itemMedia.imagePrefix, colpoMediaTypeID, selectedVariation.itemMedia.itemMedia, queryParam),
                colpoClaspURL: getFixtureImageURL(selectedVariation.itemMedia.imageUrlFormat, mediaPreset, selectedVariation.itemMedia.imagePrefix, colpoMediaTypeID, selectedVariation.itemMedia.itemMedia, queryParam) + colpoParam
            };

            this.props.dispatch(editCharm(charm));
            this.setState({
                showError: false
            });
            this.props.closeEditCharmModal(false);
            return false;
        }
        this.setState({
            showError: true
        });
        return false;
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            productDetails,
            variationType
        } = this.props;

        const variationLabel = objectPath.get(window, 'tiffany.labels.byo.variations', {});
        const sizeLabels = objectPath.get(window, `tiffany.labels.byo.variations.${variationType}`, {});
        const editCharmLabels = objectPath.get(window, 'tiffany.labels.byo.editCharm', {});
        const {
            editCharmText,
            linkText,
            linkTarget,
            linkUrl,
            errorText
        } = sizeLabels;
        const charm = this.props.onHoverProducts.productsList.find((item) => {
            return item.products.sku === productDetails.sku;
        });
        const sizes = charm ? objectPath.get(charm, 'products.groupItems', false) : this.state.charmFixture.groupItems;
        const isSizeLengthEven = sizes && (sizes.length % 2 === 0);
        const variation = objectPath.get(this.state.charmFixture, 'variation.selectedVariation', false);
        const isSize = this.state.charmFixture.variation ? this.state.charmFixture.variation.type.toString() === variationLabel.sizeText : false;

        return (
            <div className="select-size edit-charm">
                {
                    sizes && this.state.charmFixture &&
                    <div className="edit-charm__container">
                        <MediaQuery query={styleVariables.desktopAndAbove}>
                            <div className="edit-charm__image">
                                <Picture
                                    defaultSrc={variation ? getBYOCharmImageURL(variation, true) : getBYOCharmImageURL(this.state.charmFixture, true)}
                                    altText={variation ? variation.linkText : this.state.charmFixture.linkText}
                                    customClass=""
                                    isLazyLoad={false}
                                />
                            </div>
                        </MediaQuery>
                        <div
                            className="select-size__radio-group edit-charm__group"
                            role="radiogroup"
                            aria-labelledby="modal-heading"
                        >
                            <div className="edit-charm__group-heading_container">
                                <h3 className="edit-charm__group-heading" id="modal-heading">
                                    <div tabIndex={0} role="radiogroup" aria-labelledby="modal-heading">{editCharmText}</div>
                                </h3>
                                <div className="edit-charm__group-body">
                                    {
                                        sizes.map((item, index) => (
                                            <div
                                                key={index.toString()}
                                                className={
                                                    classNames('select-size__radio-group_radio edit-charm__group-radio',
                                                        {
                                                            selected: this.state.selectedIndex === index,
                                                            'two-variations': (sizes && sizes.length <= 2)
                                                        })
                                                }
                                                role="radio"
                                                aria-checked={this.state.selectedIndex === index}
                                                tabIndex={0}
                                                onClick={() => this.setSizeSelection(item, index)}
                                                onKeyPress={() => this.setSizeSelection(item, index)}
                                                aria-label={item.linkText}
                                            >
                                                {item.linkText}
                                            </div>
                                        ))
                                    }
                                    {
                                        !isSizeLengthEven &&
                                        <div
                                            className="select-size__radio-group_radio edit-charm__group-radio disabled"
                                            tabIndex={-1}
                                        >
                                            &nbsp;
                                        </div>
                                    }
                                </div>
                                {linkUrl &&
                                <a className="select-size__link cta" href={linkUrl} target={linkTarget}>
                                    <span className="cta-content">
                                        <span className="cta-text" tabIndex="-1">
                                            {linkText}
                                        </span>
                                    </span>
                                </a>}
                            </div>
                            {!isSize &&
                            <div className="edit-charm__group-buttons">
                                <p
                                    className={
                                        classNames('select-size__error ',
                                            {
                                                hide: !this.state.showError
                                            })
                                    }
                                    role="alert"
                                >
                                    {errorText}
                                </p>
                                <div className="edit-charm__group-button_conatiner">
                                    <MediaQuery query={styleVariables.desktopAndAbove}>
                                        <button
                                            type="button"
                                            className="edit-charm__group-cancel"
                                            onClick={this.props.closeEditCharmModal}
                                        >
                                            <span className="select-size__button_text edit-charm__group-text">{editCharmLabels.cancelText}</span>
                                        </button>
                                    </MediaQuery>
                                    <button
                                        type="button"
                                        className={
                                            classNames('edit-charm__group-change',
                                                {
                                                    disabled: !this.state.sizeSelected
                                                })
                                        }
                                        onClick={() => {
                                            this.validateSizeSelection();
                                        }}
                                    >
                                        <span className="select-size__button_text edit-charm__group-text">{editCharmLabels.changeText}</span>
                                    </button>
                                </div>
                            </div>
                            }
                            {isSize &&
                                <div className="edit-charm__group-size">
                                    <p
                                        className={
                                            classNames('select-size__error ',
                                                {
                                                    hide: !this.state.showError
                                                })
                                        }
                                        role="alert"
                                    >
                                        {errorText}
                                    </p>
                                    <button
                                        type="button"
                                        className={
                                            classNames('select-size__button edit-charm__group-done',
                                                {
                                                    disabled: !this.state.sizeSelected
                                                })
                                        }
                                        onClick={() => {
                                            this.validateSizeSelection();
                                        }}
                                    >
                                        <span className="select-size__button_currency">{this.state.charmFixture.variation.selectedVariation.formattedPrice}</span>
                                        <MediaQuery query={styleVariables.desktopAndAbove}>
                                            <span className="select-size__button_text">{editCharmLabels.doneText}</span>
                                        </MediaQuery>
                                        <MediaQuery query={styleVariables.desktopAndBelow}>
                                            <span className="select-size__button_text">{editCharmLabels.changeText}</span>
                                        </MediaQuery>
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                }
                <div className="edit-charm__footer">
                    <button type="button" aria-label={editCharmLabels.closeAltText} className="edit-charm__footer-close icon-Close" onClick={this.props.closeEditCharmModal} />
                </div>
            </div>
        );
    }
}

EditCharm.propTypes = {
    aem: PropTypes.any.isRequired,
    variationType: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    productDetails: PropTypes.object.isRequired,
    onHoverProducts: PropTypes.object.isRequired,
    closeEditCharmModal: PropTypes.func.isRequired,
    byo: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        onHoverProducts: state.onHoverProducts,
        labels: state.authoredLabels,
        byo: state.byo
    };
};

export default connect(mapStateToProps)(EditCharm);
