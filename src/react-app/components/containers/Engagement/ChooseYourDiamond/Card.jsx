// @flow

// Packages
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as objectPath from 'object-path';
import * as cookieUtil from 'lib/utils/cookies';
import matchMedia from 'lib/dom/match-media';

import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import { setMoreCardSelection, setBeautifulChoice } from 'actions/ChooseDiamondActions';
import { triggerAnalyticsEvent, setStockStatusAnalytics } from 'lib/utils/analytics-util';
import { findFirst, addClass, hasClass } from 'lib/dom/dom-util';


import Picture from 'components/common/Picture';
import { currencyFormatter } from 'lib/utils/currency-formatter';

type Props = {
    dispatch: Function,
    caratWeight: string,
    diamondClarity: string,
    diamondColor: string,
    diamondCut: string,
    image: string,
    title: string,
    isAvailableOnline: boolean,
    parentSku: string,
    price: string,
    sku: string,
    labels: Object,
    filtersData: Object,
    hasChildren: boolean,
    parentIndex: number,
    aem: Object,
    show1B: boolean,
    onMoreClick: Function
};

type State = {

};

/**
 * Product Description Component for Engagement
 */
class Card extends React.Component<Props, State> {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            flyoutItems: []
        };
        this.cardContainer = React.createRef();
    }

    /**
     * @description componentWillMount life cycle
     * @returns {void}
     */
    componentWillMount() {
        let shoppingBagCookie = cookieUtil.getCookies('engagmentReduce', { encode: true });

        if (shoppingBagCookie) {
            shoppingBagCookie = JSON.parse(shoppingBagCookie);
            this.setState({ flyoutItems: shoppingBagCookie });
        }
    }

    /**
     * @description On props changed life cycle event
     * @param {object} nextProps updated params
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (this.props.filtersData.selectedCard !== nextProps.filtersData.selectedCard) {
            if (this.props.interactionName === this.props.filtersData.selectedCard) {
                if (this.cardContainer.current) {
                    this.cardContainer.current.focus();
                }
            }
        }
    }

    /**
     * @param {Object} e event
     * @returns {void}
     */
    showChildren = (e): void => {
        triggerAnalyticsEvent(AnalyticsConstants.LOAD_MORE_DIAMONDS, {});
        e.stopPropagation();
        this.props.dispatch(setMoreCardSelection({
            sku: this.props.sku,
            clear: false,
            parentIndex: this.props.parentIndex
        }));
        this.props.onMoreClick();
    }

    /**
     * @returns {void}
     */
    selectDiamond = (): void => {
        const globalBanner = findFirst('.global-banner');
        const chooseCountry = findFirst('.app-js__choose-country');
        const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;

        if ((!globalBanner || (globalBanner && hasClass(globalBanner, 'hide'))) && (!chooseCountry || (chooseCountry && hasClass(chooseCountry, 'hide'))) && isDesktop) {
            addClass(findFirst('body'), 'preserve-sticky');
        }
        const request = JSON.parse(JSON.stringify(objectPath.get(this.props.aem, 'engagementpdp.groupCompleteConfig', {})));

        objectPath.set(request, 'payload.selectedSku', this.props.sku);
        this.props.dispatch(setBeautifulChoice(request, this.props.isAvailableOnline, this.props.interactionName));
        setStockStatusAnalytics(this.props.isAvailableOnline);
    }

    /**
     * @description function to check for SKU exists in bag.
     * @returns {void}
     */
    checkForItemInBag = () => {
        let isInShoppingBag = false;
        const flyoutItems = objectPath.get(this.props, 'flyout.itemsList.items', []);

        if (flyoutItems && flyoutItems.length > 0) {
            isInShoppingBag = !!objectPath.get(flyoutItems.filter(item => String(item.item.sku) === String(this.props.sku)), '0', false);
        } else {
            isInShoppingBag = !!objectPath.get(this.state.flyoutItems.filter(item => String(item.sku) === String(this.props.sku)), '0', false);
        }
        return isInShoppingBag;
    }


    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const showCard = this.props.parentSku ? (this.props.filtersData.moreCardSku && this.props.filtersData.moreCardIndex === this.props.parentIndex) : ((this.props.filtersData.moreCardIndex === this.props.parentIndex) || !this.props.filtersData.moreCardSku);
        const isChild = !this.props.hasChildren;
        const animationClass = (this.props.filtersData.moreCardSku && (this.props.filtersData.moreCardSku === this.props.sku)) ? `animate-${this.props.parentIndex}` : '';
        const isInBag = this.checkForItemInBag();
        const diamondCut = this.props.diamondCut && this.props.diamondCut.length > 0 ? this.props.diamondCut : 'Excellent';
        // const isInWishList = this.props.wishlist.skuId.indexOf(this.props.sku) !== -1;

        return (
            <div
                className={
                    classNames(`card ${animationClass}`,
                        {
                            hide: !showCard,
                            'primary-card': !isChild,
                            'secondary-card': isChild,
                            show: showCard,
                            selected: isInBag
                        })
                }
                role="button"
                tabIndex="0"
                onKeyPress={this.selectDiamond}
                onClick={this.selectDiamond}
                ref={this.cardContainer}
            >
                <div className="card_wrapper">
                    {
                        (this.props.isAvailableOnline && !this.props.show1B) ?
                            <p className="card_wrapper_status">
                                <img alt={this.props.labels.availableIconAlt} src={this.props.labels.availableIcon} />
                                <span className="card_wrapper_status_info">{this.props.labels.availableText}</span>
                            </p>
                            :
                            <a
                                className="card_wrapper_status link"
                                href={this.props.labels.callUsLink}
                                onClick={(event) => event.stopPropagation()}
                            >
                                <span className="cta-content" tabIndex="-1">
                                    <span className="cta-text">
                                        <img alt={this.props.labels.callUsIconAlt} src={this.props.labels.callUsIcon} />
                                        <span className="card_wrapper_status_info">{this.props.labels.callUsText}</span>
                                    </span>
                                </span>
                            </a>
                    }
                    <Picture
                        sources={[]}
                        defaultSrc={this.props.image}
                        altText={this.props.title}
                        customClass="card_wrapper_image"
                        isLazyLoad={false}
                    />
                    {
                        this.props.filtersData.moreCardSku === this.props.sku &&
                        <p className="card_wrapper_show-more">{this.props.labels.showingMoreCardText}</p>
                    }
                    {
                        isInBag &&
                        <p className="card_wrapper_selected-card">{this.props.labels.selectedCardText}</p>
                    }
                    {
                        (this.props.filtersData.moreCardSku === this.props.parentSku && !isInBag) &&
                        <p className="card_wrapper_show-more" />
                    }
                    <p className="card_wrapper_price">{currencyFormatter(this.props.price)}</p>
                    <div className="card_wrapper_row">
                        {
                            this.props.caratWeight &&
                            <div className="card_wrapper_row_details">
                                <p className="card_wrapper_row_details_info">{this.props.caratWeight}</p>
                                <p className="card_wrapper_row_details_label">{this.props.labels.cardsCaratTitle}</p>
                            </div>
                        }
                        {
                            this.props.diamondColor &&
                            <div className="card_wrapper_row_details">
                                <p className="card_wrapper_row_details_info">{this.props.diamondColor}</p>
                                <p className="card_wrapper_row_details_label">{this.props.labels.cardsColorTitle}</p>
                            </div>
                        }
                        {
                            this.props.diamondClarity &&
                            <div className="card_wrapper_row_details">
                                <p className="card_wrapper_row_details_info">{this.props.diamondClarity}</p>
                                <p className="card_wrapper_row_details_label">{this.props.labels.cardsClarityTitle}</p>
                            </div>
                        }
                        <div className="card_wrapper_row_details">
                            <p className="card_wrapper_row_details_info">{diamondCut}</p>
                            <p className="card_wrapper_row_details_label">{this.props.labels.cardsCutTitle}</p>
                        </div>
                    </div>
                    {
                        this.props.hasChildren &&
                        this.props.filtersData.moreCardSku !== this.props.sku ?
                            <button
                                type="button"
                                className="card_wrapper_more cta"
                                onClick={(event) => this.showChildren(event)}
                                data-interaction-context={AnalyticsConstants.DIAMOND_SEL}
                                data-interaction-type={AnalyticsConstants.FIND_SIMILAR}
                                data-interaction-name={AnalyticsConstants.MORE_LIKE_THIS}
                            >
                                <span className="cta-content">
                                    <span className="cta-text" tabIndex="-1">{this.props.labels.moreCardsText}</span>
                                    <span className="icon-rightArrow" />
                                </span>
                            </button>
                            :
                            <button
                                type="button"
                                className="card_wrapper_more cta-hidden"
                                tabIndex="-1"
                                aria-hidden="true"
                            >
                                {this.props.labels.moreCardsText}
                            </button>

                    }
                </div>
            </div>
        );
    }
}

Card.propTypes = {
    dispatch: PropTypes.func.isRequired,
    caratWeight: PropTypes.string.isRequired,
    diamondClarity: PropTypes.string.isRequired,
    diamondColor: PropTypes.string.isRequired,
    diamondCut: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isAvailableOnline: PropTypes.bool.isRequired,
    parentSku: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    sku: PropTypes.string.isRequired,
    labels: PropTypes.object.isRequired,
    filtersData: PropTypes.object.isRequired,
    hasChildren: PropTypes.bool.isRequired,
    parentIndex: PropTypes.number.isRequired,
    aem: PropTypes.object.isRequired,
    show1B: PropTypes.bool.isRequired,
    onMoreClick: PropTypes.func.isRequired,
    interactionName: PropTypes.any.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        filtersData: state.diamondFilters,
        flyout: state.flyout
    };
};

export default connect(mapStateToProps)(Card);
