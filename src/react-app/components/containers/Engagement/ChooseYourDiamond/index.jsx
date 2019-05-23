// Packages
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as objectPath from 'object-path';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import TiffanyModal from 'components/common/TiffanyModal';

// Utils
import styleVariables from 'lib/utils/breakpoints';

// Actions
import {
    setMoreCardSelection,
    getDiamondCards,
    updateCurrentValues,
    toggleFiltersSection
} from 'actions/ChooseDiamondActions';

// components
import DiamondFilters from './DiamondFilters.jsx';
import DiamondCards from './DiamondCards.jsx';
import NoResults from './NoResults.jsx';


// Styles
// import './index.scss';

/**
 * Product Description Component for Engagement
 */
class ChooseYourDiamond extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.state = {
            config: this.props.aem[this.props.config],
            assortmentId: objectPath.get(this.props.aem, 'engagementpdp.diamondSelectionConfig.payload.assortmentID', '')
        };
    }

    /**
     * @description On props changed life cycle event
     * @returns {void}
     */
    componentDidMount() {
        const isDesktop = window.matchMedia(styleVariables.desktopTabletAbove).matches;
        const requestPayLoad = JSON.parse(JSON.stringify(objectPath.get(this.props.aem, 'engagementpdp.diamondSelectionConfig', {})));

        if (!isDesktop) {
            this.props.dispatch(getDiamondCards(requestPayLoad, false));
        }
    }

    /**
     * @description On props changed life cycle event
     * @param {object} nextProps updated params
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        const isDesktop = window.matchMedia(styleVariables.desktopTabletAbove).matches;

        if (!isDesktop && !this.props.filtersData.modalOpen && this.props.filtersData !== nextProps.filtersData) {
            if (this.props.filtersData.filtersUndone !== nextProps.filtersData.filtersUndone && nextProps.filtersData.filtersUndone) {
                this.undoSliders(nextProps);
            }

            if (this.props.filtersData.filtersReset !== nextProps.filtersData.filtersReset && nextProps.filtersData.filtersReset) {
                this.resetSliders();
                this.props.dispatch(getDiamondCards(JSON.parse(JSON.stringify(nextProps.filtersData.defaultPayload)), false));
            }
        }

        if (this.props.filtersData.cards.mergedProducts && (this.props.filtersData.cards.mergedProducts.toString() !== nextProps.filtersData.cards.mergedProducts.toString())) {
            if (this.props.filtersData.childCardsOpen) {
                this.props.dispatch(setMoreCardSelection('', 0));
                this.props.dispatch(updateCurrentValues({ childCardsOpen: false }));
            }
        }
    }

    /**
     * @description function to reset the price slider when reset
     * @returns {void}
     */
    resetSliders = () => {
        const valuesToReset = {};

        valuesToReset.currentMinPrice = parseFloat(objectPath.get(this.props.groupComplete, 'lowerPriceLimit', 0));
        valuesToReset.currentMaxPrice = parseFloat(objectPath.get(this.props.groupComplete, 'upperPriceLimit', 0));
        valuesToReset.currentMinCarat = parseFloat(objectPath.get(this.props.aem, 'engagementpdp.defaultMinCaratPosition', 0));
        valuesToReset.currentMaxCarat = parseFloat(objectPath.get(this.props.aem, 'engagementpdp.defaultMaxCaratPosition', 0));
        valuesToReset.isAvailableOnline = false;
        valuesToReset.navigationFilters = [this.state.assortmentId];
        valuesToReset.claritiesSelected = [];
        valuesToReset.selectedColors = [];
        this.props.dispatch(updateCurrentValues(valuesToReset, true));
        this.removeErrorStates();
    }

    /**
     * @description function to undo sliders
     * @param {nextProps} nextProps of the component
     * @returns {void}
     */
    undoSliders = (nextProps) => {
        const valuesToUndo = {};

        if (parseFloat(this.props.filtersData.currentMaxCarat) !== parseFloat(nextProps.filtersData.currentPayload.payload.maxCaratWeight)) {
            valuesToUndo.currentMaxCarat = parseFloat(nextProps.filtersData.currentPayload.payload.maxCaratWeight);
        }

        if (parseFloat(this.props.filtersData.currentMinCarat) !== parseFloat(nextProps.filtersData.currentPayload.payload.minCaratWeight)) {
            valuesToUndo.currentMinCarat = parseFloat(nextProps.filtersData.currentPayload.payload.minCaratWeight);
        }

        if (parseFloat(this.props.filtersData.currentMinPrice) !== parseFloat(nextProps.filtersData.currentPayload.payload.lowerPriceLimit)) {
            valuesToUndo.currentMinPrice = nextProps.filtersData.currentPayload.payload.lowerPriceLimit ? parseFloat(nextProps.filtersData.currentPayload.payload.lowerPriceLimit) : parseFloat(objectPath.get(this.props.groupComplete, 'lowerPriceLimit', 0));
        }

        if (parseFloat(this.props.filtersData.currentMaxPrice) !== parseFloat(nextProps.filtersData.currentPayload.payload.upperPriceLimit)) {
            valuesToUndo.currentMaxPrice = nextProps.filtersData.currentPayload.payload.upperPriceLimit ? parseFloat(nextProps.filtersData.currentPayload.payload.upperPriceLimit) : parseFloat(objectPath.get(this.props.groupComplete, 'upperPriceLimit', 0));
        }

        if ((this.props.filtersData.navigationFilters).toString() !== (nextProps.filtersData.currentPayload.payload.navigationFilters).toString()) {
            valuesToUndo.navigationFilters = nextProps.filtersData.currentPayload.payload.navigationFilters ? nextProps.filtersData.currentPayload.payload.navigationFilters : [this.state.assortmentId];
        }

        if ((this.props.filtersData.claritiesSelected).toString() !== (nextProps.filtersData.claritiesSelected).toString()) {
            valuesToUndo.claritiesSelected = nextProps.filtersData.claritiesSelected ? nextProps.filtersData.claritiesSelected : [];
        }
        if ((this.props.filtersData.selectedColors).toString() !== (nextProps.filtersData.selectedColors).toString()) {
            valuesToUndo.selectedColors = nextProps.filtersData.selectedColors ? nextProps.filtersData.selectedColors : [];
        }

        this.props.dispatch(updateCurrentValues(valuesToUndo, true));
        this.removeErrorStates();
    }

    /**
     * @description function to remove error states of sliders
     * @returns {void}
     */
    removeErrorStates = () => {
        this.setState({
            priceRangeError: false,
            caratRangeError: false
        });
    }

    /**
     * @description function to handle the close / open of the modal
     * @param {openModal} openModal flag to toggle the modal
     * @returns {void}
     */
    openModal = () => {
        this.props.dispatch(updateCurrentValues({ modalOpen: true }));
    }

    /**
     * @returns {void}
     */
    hideChildren = () => {
        this.props.dispatch(setMoreCardSelection(this.props.filtersData.moreCardSku, true));
        this.props.dispatch(updateCurrentValues({ childCardsOpen: false }));
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const config = objectPath.get(this.state, 'config', {});
        const labels = objectPath.get(config, 'labels', {});
        const showChooseDiamond = objectPath.get(this.props.aem, 'engagementpdp.groupCompleteResponse.showChooseDiamond', false);
        const cardsCount = objectPath.get(this.props, 'filtersData.cards.mergedProducts', []).length;
        const showFiltersSection = objectPath.get(this.props, 'filtersData.showFiltersSection', true);
        const { desktopAndAbove, desktopAndBelow } = styleVariables;
        const diamondFilter = {
            overlay: true,
            className: 'modal add-chain-modal choose-your-diamond',
            closeClass: 'close-modal',
            overlayClass: 'clasp-overlay',
            blockMobileScrollability: false,
            blockDesktopScrollability: false,
            modalFocus: true,
            closeonTapOutside: {
                isClose: true,
                modalContainerClass: 'modal-content'
            }
        };
        const show1B = objectPath.get(this.props.aem, 'engagementpdp.forced1BVariation', false);

        return (
            showChooseDiamond ?
                <article className="choose-your-diamond">
                    {
                        labels &&
                        <div className="choose-your-diamond__description">
                            {
                                labels.chooseDiamondTitle &&
                                <h3 className="choose-your-diamond__description_title">{labels.chooseDiamondTitle}</h3>
                            }
                            {
                                labels.chooseDiamondDescription &&
                                <p className="choose-your-diamond__description_text">{labels.chooseDiamondDescription}</p>
                            }
                            {

                                labels.chooseDiamondCtaText &&
                                <a
                                    target={labels.chooseDiamondTarget}
                                    className="choose-your-diamond__description_cta cta"
                                    href={labels.chooseDiamondCtaLink}
                                >
                                    <span className="cta-content" tabIndex="-1">
                                        <span className="cta-text">
                                            {labels.chooseDiamondCtaText}
                                        </span>
                                        <i className="icon-dropdown-right" />
                                    </span>
                                </a>
                            }
                            {
                                <MediaQuery query={desktopAndBelow}>
                                    <button
                                        className="choose-your-diamond__description_filter"
                                        type="button"
                                        onClick={this.openModal}
                                    >
                                        {labels.filterByLabel}
                                    </button>
                                </MediaQuery>
                            }
                        </div>
                    }
                    {
                        this.props.filtersData.groupCompleteResponse.selectedSku &&
                        <div
                            tabIndex="0"
                            role="button"
                            className="your-diamond-selection"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    this.props.dispatch(toggleFiltersSection());
                                }
                            }}
                            onClick={() => {
                                this.props.dispatch(toggleFiltersSection());
                            }}
                            aria-expanded={this.props.filtersData.showFiltersSection}
                        >
                            <span>
                                {labels.yourSelectionHeading}
                            </span>
                            <span className={this.props.filtersData.showFiltersSection ? 'icon-dropdown-up' : 'icon-dropdown-down'} />
                        </div>
                    }
                    <MediaQuery query={desktopAndAbove}>
                        <div className={
                            classNames('choose-your-diamond_suggestions-header',
                                {
                                    hide: !showFiltersSection
                                })
                        }
                        >
                            {
                                cardsCount > 0 ?
                                    <div className="container--30x70">
                                        <div className="container--30" />
                                        {
                                            this.props.filtersData.moreCardSku ?
                                                <div className="container--70">
                                                    <div>
                                                        <button
                                                            type="button"
                                                            className="choose-your-diamond__container_cards_header cta"
                                                            onClick={this.hideChildren}
                                                        >
                                                            <span className="cta-content">
                                                                <span className="icon-Left" />
                                                                <span className="cta-text" tabIndex="-1">{labels.showingMoreHeader}</span>
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                                :
                                                <div className="container--70">
                                                    <div className="choose-your-diamond__container_cards_header">
                                                        {
                                                            labels.suggestionHeading &&
                                                            <h4 className="choose-your-diamond__container_cards_header_title">{labels.suggestionHeading}</h4>
                                                        }
                                                        {
                                                            labels.suggestionDesc &&
                                                            <p className="choose-your-diamond__container_cards_header_desc">{labels.suggestionDesc}</p>
                                                        }
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                    : null
                            }
                        </div>
                    </MediaQuery>

                    <div className={
                        classNames('choose-your-diamond__container container--30x70',
                            {
                                hide: !showFiltersSection
                            })
                    }
                    >
                        <div className="choose-your-diamond__container_filter container--30">
                            <MediaQuery query={desktopAndAbove}>
                                <DiamondFilters
                                    config={this.props.config}
                                />
                            </MediaQuery>
                            <MediaQuery query={desktopAndBelow}>
                                <TiffanyModal
                                    visible={this.props.filtersData.modalOpen}
                                    options={diamondFilter}
                                    onClose={this.closeModal}
                                >
                                    <DiamondFilters config={this.props.config} />
                                </TiffanyModal>
                            </MediaQuery>
                        </div>
                        <div className="choose-your-diamond__container_cards container--70">
                            {
                                cardsCount > 0 ?
                                    <div>
                                        <MediaQuery query={desktopAndBelow}>
                                            {
                                                this.props.filtersData.moreCardSku ?
                                                    <div>
                                                        <span className="icon-Left" />
                                                        <button
                                                            type="button"
                                                            className="choose-your-diamond__container_cards_header cta"
                                                            onClick={this.hideChildren}
                                                        >
                                                            <span className="cta-content">
                                                                <span className="cta-text" tabIndex="-1">{labels.showingMoreHeader}</span>
                                                            </span>
                                                        </button>
                                                    </div>
                                                    :
                                                    <div className="choose-your-diamond__container_cards_header">
                                                        {
                                                            labels.suggestionHeading &&
                                                            <h4 className="choose-your-diamond__container_cards_header_title">{labels.suggestionHeading}</h4>
                                                        }
                                                        {
                                                            labels.suggestionDesc &&
                                                            <p className="choose-your-diamond__container_cards_header_desc">{labels.suggestionDesc}</p>
                                                        }
                                                    </div>
                                            }
                                        </MediaQuery>
                                        <DiamondCards
                                            labels={labels}
                                            show1B={show1B}
                                        />
                                        <div className="choose-your-diamond__container_cards_help">
                                            <div className="image">
                                                <img alt={labels.needHelpIconAlt} src={labels.needHelpIcon} />
                                            </div>
                                            <div className="details">
                                                <p className="details_txt">{labels.needHelpText}</p>
                                                <a
                                                    target={labels.contactExpertTarget}
                                                    className="cta"
                                                    href={labels.contactExpertLink}
                                                >
                                                    <span className="cta-content" tabIndex="-1">
                                                        <span className="cta-text">
                                                            {labels.contactExpertText}
                                                        </span>
                                                        <i className="icon-dropdown-right" />
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <NoResults
                                        labels={labels}
                                    />
                            }
                        </div>
                    </div>
                </article> : null
        );
    }
}

ChooseYourDiamond.propTypes = {
    config: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    aem: PropTypes.any.isRequired,
    filtersData: PropTypes.object.isRequired,
    groupComplete: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        filtersData: state.diamondFilters,
        groupComplete: objectPath.get(state.aem, 'engagementpdp.groupCompleteResponse', {})
    };
};

export default connect(mapStateToProps)(ChooseYourDiamond);
