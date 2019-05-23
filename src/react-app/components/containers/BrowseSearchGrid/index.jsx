import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as objectPath from 'object-path';
import { scrollTo } from 'lib/utils/scroll-to-content';
import Grid from 'components/containers/Grid';
import Filters from 'components/containers/Filters';
import NoSearchResults from 'components/containers/Search/NoSearchResults';
import ProductsFlyout from 'components/common/ProductsFlyout';
import MediaQuery from 'react-responsive';
import { getConfigObject, updateCustomPriceFilterMap } from 'lib/utils/filters';
import Picture from 'components/common/Picture';
import { getData, updateFilters, updateSelectedFilters } from 'actions/FiltersActions';
import styleVariables from 'lib/utils/breakpoints';
import { findFirst, addClass, removeClass } from 'lib/dom/dom-util';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

import SORT from 'constants/SortConstants';

// import './index.scss';

/**
 * @description BrowseSearchGrid component for all Search and Browse pages
 * @class BrowseSearchGrid
 */
class BrowseSearchGrid extends React.Component {
    /**
     * @constructor
     * @param {*} props Props
     */
    constructor(props) {
        super(props);
        this.state = {
            stickyPoint: 0
        };
    }

    /**
     * @description Lifcycle hooks to do init steps
     * @returns {void}
     */
    componentWillMount() {
        const requestConfig = getConfigObject(this.props.aem, this.props.type);
        const filters = requestConfig.navigationFilters;
        let customPrices = '';

        if (requestConfig.lowerPriceLimit && requestConfig.upperPriceLimit) {
            filters.push('custom'); // Add custom to selected filters when we have custom filters on load
            customPrices = {
                min: requestConfig.lowerPriceLimit,
                max: requestConfig.upperPriceLimit
            };
        }
        updateCustomPriceFilterMap(customPrices);

        const filterOptions = {
            filters, // source - request.payload.navigationFilters
            init: true,
            type: this.props.type,
            customPrices,
            sortOption: this.getsortOptionSelected()
        };

        this.props.dispatch(updateSelectedFilters(filters));
        this.props.dispatch(updateFilters(filterOptions));
    }

    /**
     * Returns sort option provided in config
     * @returns {Object} null if not sort found else sort selected
     */
    getsortOptionSelected = () => {
        const sortSelectedVal = getConfigObject(this.props.aem, this.props.type).sortTypeID;
        const sort = this.props.sortOptions.filter(sortOption => sortOption.value === sortSelectedVal);

        if (sort.length) {
            this.props.dispatch({
                type: SORT.SET_SORT_OPTION,
                payload: sort[0]
            });
            return sort[0];
        }
        return null;
    }

    /**
     * @description Sets a sticky position
     * @param {number} position where filter becomes sticky
     * @returns {void}
     */
    setStickyPosition = (position) => {
        if (!this.state.stickyPoint) {
            this.setState({ stickyPoint: position });
        }
    }

    /**
     * @description loads more data
     * @param {object} event event object
     * @returns {void}
     */
    showMore = (event) => {
        event.preventDefault();
        const getOptions = {
            type: this.props.type,
            offset: this.props.filters.productsLength,
            isPagination: true
        };

        this.props.dispatch(getData(getOptions));
    }

    /**
     * @description scrolls to the top of page on click
     * @returns {void}
     */
    scrollToTop = () => {
        const scrollElement = findFirst('.header__menu');

        if (scrollElement) {
            scrollTo('.header__menu', 0);
            scrollElement.focus();
        }
    }

    /**
     * @returns {void}
     */
    render() {
        const { type } = this.props;
        const filters = getConfigObject(this.props.aem, this.props.type);
        const nextLoadCount = this.props.filters.productsLength + filters.recordsCountPerPage;
        const loadingLength = nextLoadCount > this.props.filters.total ? this.props.filters.total : nextLoadCount;
        const noResultsContainerHidden = findFirst('.no-results-container');
        const h1Toggle = objectPath.get(this.props.aem, 'engagementConfig.h1Toggle', '');
        const isFilterText = h1Toggle.toUpperCase() === 'FILTER_TEXT';
        const coreH1Toggle = objectPath.get(this.props.aem, 'browseConfig.h1Toggle', '');
        const isCoreFilterText = coreH1Toggle === 'FILTER_TEXT';
        const showBrowseHeading = type === 'BRIDAL' && this.props.aem.engagementConfig.showBrowseHeading && isFilterText;
        const showCoreBrowseHeading = type === 'BROWSE' && this.props.aem.browseConfig.showBrowseHeading && isCoreFilterText;
        const htmlcallout = {
            interactionContext: '',
            interactionType: AnalyticsConstants.BACK_TO_TOP,
            interactionName: AnalyticsConstants.BACK_TO_TOP_CENTER
        };

        if ((this.props.type === 'BROWSE' || this.props.type === 'BRIDAL') && this.props.filters.total === 0 && noResultsContainerHidden) {
            removeClass(noResultsContainerHidden, 'hide-no-results-container');
            if (window.aos) {
                window.aos.refreshHard();
            }
        } else {
            addClass(noResultsContainerHidden, 'hide-no-results-container');
        }

        return (
            <div className={
                classNames('grid-page container container-centered',
                    { 'search-grid-page': this.props.type === 'SEARCH' },
                    { 'browse-grid-page': this.props.type === 'BROWSE' },
                    { 'engagement-grid-page': this.props.type === 'BRIDAL' })
            }
            >
                {(this.props.filters.total > 0 && this.props.type === 'SEARCH') &&
                    <p className="grid-page__found-text">
                        {objectPath.get(this.props.labels, 'searchResultsPreText', 'We found')}
                        <span className="grid-page__found-text_term">{this.props.filters.total}</span>
                        {objectPath.get(this.props.labels, 'searchResultsPostText', 'results for')}
                        <span className="grid-page__found-text_term">{`"${this.props.filters.searchTerms}"`}</span>
                    </p>
                }
                {(this.props.filters.total !== 0) &&
                    <Fragment>
                        <Filters onSticky={this.setStickyPosition} type={this.props.type} />
                        <div className="grid-page__grid-holder">
                            {
                                this.props.filters.products.length > 0 &&
                                <span className="grid-page__pagination">
                                    {/* eslint-disable-next-line */}
                                    {objectPath.get(this.props, 'labels.showingLabel.preText', '')} 1 {objectPath.get(this.props, 'labels.hyphen', '-')} {this.props.filters.productsLength} {objectPath.get(this.props, 'labels.showingLabel.postText', '')} {this.props.filters.total}
                                    {
                                        showBrowseHeading &&
                                        <h1 className="browse-grid-heading">{this.props.filters.browseHeading}</h1>
                                    }
                                    {
                                        showCoreBrowseHeading &&
                                        <h1 className="browse-grid-heading">{this.props.filters.browseHeading}</h1>
                                    }
                                </span>
                            }
                            <Grid
                                stickyPoint={this.state.stickyPoint}
                                showCTA
                                onEndReached={this.showMore}
                                type={this.props.type}
                            />
                        </div>
                    </Fragment>
                }
                {this.props.filters.total > this.props.filters.productsLength && this.props.filters.productsLength > 0 &&
                    <p className="grid-page__loading">
                        {/* eslint-disable-next-line */}
                        {this.props.labels.loadingLabel.preText} {this.props.filters.productsLength + 1} {objectPath.get(this.props, 'labels.hyphen', '-')} {loadingLength} {this.props.labels.loadingLabel.postText} {this.props.filters.total}
                    </p>
                }
                {
                    this.props.filters.products.length > 0 &&
                    <div className="scroll_to_top_button">
                        <button
                            type="button"
                            className="cta"
                            onClick={this.scrollToTop}
                            aria-label={objectPath.get(this.props.labels, 'backToTopLabel', 'Back to Top')}
                            data-interaction-context={htmlcallout.interactionContext}
                            data-interaction-type={htmlcallout.interactionType}
                            data-interaction-name={htmlcallout.interactionName}
                        >
                            <span className="cta-content" tabIndex="-1">
                                <span className="scroll_to_top_button__label cta-text">
                                    {objectPath.get(this.props.labels, 'backToTopLabel', 'Back to Top')}
                                </span>
                                <Picture
                                    customClass="scroll_to_top_button_img"
                                    defaultSrc={this.props.backToTopIconSrc}
                                    altText={this.props.backToTopIconAltText}
                                    isLazyLoad
                                />
                            </span>
                        </button>
                    </div>
                }
                <MediaQuery query={styleVariables.desktopAndAbove}>
                    <ProductsFlyout />
                </MediaQuery>
                {(this.props.type === 'SEARCH'
                    && this.props.filters.total === 0) &&
                    <NoSearchResults searchTerm={this.props.filters.searchTerms} noSearchConfig={this.props.nosearchconfig} />}
            </div>);
    }
}

BrowseSearchGrid.propTypes = {
    type: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    filters: PropTypes.any.isRequired,
    labels: PropTypes.any.isRequired,
    aem: PropTypes.any.isRequired,
    backToTopIconSrc: PropTypes.string.isRequired,
    backToTopIconAltText: PropTypes.string.isRequired,
    nosearchconfig: PropTypes.any.isRequired,
    sortOptions: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
    return {
        aem: state.aem,
        backToTopIconSrc: objectPath.get(state, 'aem.icons.backToTop.src', ''),
        backToTopIconAltText: objectPath.get(state, 'aem.icons.backToTop.altText', 'backtotop icon'),
        filters: state.filters,
        labels: state.authoredLabels,
        sortOptions: state.sortOptions.options
    };
};

export default connect(mapStateToProps, null, null, { withRef: true })(BrowseSearchGrid);
