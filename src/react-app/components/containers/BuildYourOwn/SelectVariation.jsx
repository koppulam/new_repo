// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as objectPath from 'object-path';

import { getBYOImageURL } from 'lib/utils/format-data';
import MediaQuery from 'react-responsive';
import styleVariables from 'lib/utils/breakpoints';
import { currencyFormatter } from 'lib/utils/currency-formatter';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import { formatStringForTracking } from 'lib/utils/analytics-util';

/**
 * Select Variation Component
 */
class SelectVariation extends React.Component {
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
            price: false
        };
    }

    /**
     * @param {object} size selected size data
     * @param {Number} index size index
     * @returns {object} html structure
     */
    setSizeSelection = (size, index) => {
        const imageURL = getBYOImageURL(size);

        size.imageURL = imageURL;
        this.setState({
            selectedIndex: index,
            sizeSelected: size,
            showError: false,
            price: size.price
        }, () => {
            if (this.props.addOnVariation && window.matchMedia(styleVariables.desktopAndAbove).matches) {
                this.props.addVariationOnSelect(true, this.state.sizeSelected);
            }
        });
    }

    /**
     * @returns {object} html structure
     */
    validateSizeSelection = () => {
        if (this.state.sizeSelected) {
            this.props.clickHandler(true, this.state.sizeSelected, true);
            this.setState({
                showError: false
            });
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
            variationType,
            backText,
            backHandler,
            selectedLabel,
            isFixture
        } = this.props;
        const sizeLabels = objectPath.get(this.props.labels, `byo.variations.${variationType}`, {});
        const {
            heading,
            linkText,
            linkTarget,
            linkUrl,
            ctaText,
            charmCtaText,
            errorText,
            errorChainText,
            editCharmText
        } = sizeLabels;
        const sizes = objectPath.get(productDetails, 'productDetails.0.groupItems', false);
        const price = this.state.price ? this.state.price : objectPath.get(sizes, '0.price', '') || objectPath.get(productDetails, 'productDetails.0.group.price', '') || objectPath.get(productDetails, 'productDetails.0.price', '');
        const isSizeLengthEven = sizes && (sizes.length % 2 === 0);
        const htmlCallout = {
            interactionContext: '',
            interactionType: AnalyticsConstants.CHOOSE_CHAIN,
            interactionName: formatStringForTracking(selectedLabel)
        };

        return (
            <div
                className="select-size"
                tabIndex="-1"
                ref={el => { this.variationElement = el; }}
                style={this.props.containerHeight > 0 ? { minHeight: `${this.props.containerHeight}px` } : null}
            >
                <div className="select-size__wrapper">
                    <MediaQuery query={styleVariables.tabletAndAbove}>
                        {backText &&
                            <button type="button" onClick={backHandler} className="select-size__back">
                                <span className="icon-Left" />
                                <span>{backText}</span>
                            </button>
                        }
                    </MediaQuery>
                    <h3 className="select-size__heading" id="modal-heading">
                        <div tabIndex={0} role="radiogroup" aria-labelledby="modal-heading">{isFixture ? heading : editCharmText}</div>
                    </h3>
                    {
                        sizes &&
                        <div
                            className="select-size__radio-group"
                        >
                            {
                                sizes.map((item, index) => (
                                    <div
                                        key={index.toString()}
                                        className={
                                            classNames('select-size__radio-group_radio',
                                                {
                                                    selected: this.state.selectedIndex === index,
                                                    'two-variations': (sizes && sizes.length <= 2)
                                                })
                                        }
                                        role="radio"
                                        aria-checked={this.state.selectedIndex === index}
                                        tabIndex={0}
                                        onClick={() => this.setSizeSelection(item, index)}
                                        onKeyDown={(e) => {
                                            if ((e.type === 'keydown' && e.key === 'Enter')) {
                                                this.setSizeSelection(item, index);
                                            }
                                        }}
                                        aria-label={this.state.selectedIndex === index && !this.props.isFixture ? `${this.state.sizeSelected.linkText} ${objectPath.get(this.props.labels, 'byo.addCharmToTray', '')}` : item.linkText}
                                    >
                                        {item.linkText}
                                    </div>
                                ))
                            }
                            {
                                !isSizeLengthEven &&
                                <div
                                    className="select-size__radio-group_radio disabled"
                                    tabIndex={-1}
                                >
                                    &nbsp;
                                </div>
                            }
                        </div>
                    }
                    {linkUrl && this.props.isFixture &&
                        <a className="select-size__link cta" href={linkUrl} target={linkTarget}>
                            <span className="cta-content">
                                <span className="cta-text" tabIndex="-1">
                                    {linkText}
                                </span>
                            </span>
                        </a>}
                    <p
                        className={
                            classNames('select-size__error',
                                {
                                    hide: !this.state.showError
                                })
                        }
                        role="alert"
                    >
                        {this.props.isFixture ? errorChainText : errorText}
                    </p>
                </div>
                <button
                    type="button"
                    className={
                        classNames('select-size__button',
                            {
                                disabled: !this.state.sizeSelected
                            })
                    }
                    onClick={this.validateSizeSelection}
                    data-interaction-context={htmlCallout.interactionContext}
                    data-interaction-type={htmlCallout.interactionType}
                    data-interaction-name={htmlCallout.interactionName}
                    onBlur={this.props.onProductBlur}
                >
                    <span className="select-size__button_currency">{currencyFormatter(price)}</span>
                    <span className="select-size__button_text">{isFixture ? ctaText : (charmCtaText || ctaText)}</span>
                </button>
            </div>
        );
    }
}

SelectVariation.propTypes = {
    variationType: PropTypes.string.isRequired,
    productDetails: PropTypes.object.isRequired,
    clickHandler: PropTypes.func.isRequired,
    backHandler: PropTypes.func,
    backText: PropTypes.string,
    selectedLabel: PropTypes.string,
    isFixture: PropTypes.bool,
    addOnVariation: PropTypes.bool,
    addVariationOnSelect: PropTypes.func,
    onProductBlur: PropTypes.func,
    labels: PropTypes.any.isRequired,
    containerHeight: PropTypes.number
};

SelectVariation.defaultProps = {
    selectedLabel: '',
    backText: '',
    backHandler: () => {

    },
    isFixture: false,
    addOnVariation: false,
    addVariationOnSelect: () => { },
    onProductBlur: () => { },
    containerHeight: 0
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        labels: state.authoredLabels,
        byo: state.byo
    };
};

export default connect(mapStateToProps)(SelectVariation);
