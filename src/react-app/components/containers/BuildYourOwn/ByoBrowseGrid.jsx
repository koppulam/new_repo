import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import isEqual from 'lodash/isEqual';
import { scrollTo } from 'lib/utils/scroll-to-content';
import SORT from 'constants/SortConstants';
import Picture from 'components/common/Picture';
import { getData, updateFilters } from 'actions/ByoFiltersActions';
import styleVariables from 'lib/utils/breakpoints';
import { CSSTransition } from 'react-transition-group';
import { findFirst, addClass, removeClass } from 'lib/dom/dom-util';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

import ByoGrid from './ByoGrid';
import Filters from './ByoFilters';


// import './index.scss';

/**
 * @description ByoBrowseGrid component for all Search and Browse pages
 * @class ByoBrowseGrid
 */
class ByoBrowseGrid extends React.Component {
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
        if (!objectPath.get(this.props, 'filters.navigationFilters', []).length > 0) {
            const designExists = objectPath.get(this.props, 'byo', {});

            if (!designExists.designID) {
                this.getBrowseGrid();
            }
        }
    }

    /**
     * @description Lifecycle hook
     * @param {any} nextProps Next Props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (!isEqual(nextProps.byo.selectedFixture.sku, this.props.byo.selectedFixture.sku) && nextProps.byo.previewWidth !== null) {
            this.getBrowseGrid();
        }
        if (nextProps.byo.previewWidth !== this.props.byo.previewWidth && nextProps.byo.previewWidth === null) {
            const noResultsContainerHidden = findFirst('.no-results-container');

            if (noResultsContainerHidden) {
                addClass(noResultsContainerHidden, 'hide');
            }
        }
    }

    /**
     * Returns sort option provided in config
     * @returns {Object} null if not sort found else sort selected
     */
    getBrowseGrid = () => {
        const byoFilters = JSON.parse(JSON.stringify(objectPath.get(this.props.aem, 'byoConfig.gridRequest.payload.navigationFilters')));
        const filterOptions = {
            filters: byoFilters,
            init: true,
            sortOption: this.getsortOptionSelected()
        };

        this.props.dispatch(updateFilters(filterOptions));
    }

    /**
     * Returns sort option provided in config
     * @returns {Object} null if not sort found else sort selected
     */
    getsortOptionSelected = () => {
        const sortSelectedVal = objectPath.get(this.props.aem, 'byoConfig.gridRequest.payload.sortTypeID');
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
     * @returns {void}
     */
    showMore = () => {
        const getOptions = {
            offset: this.props.filters.productsLength
        };

        this.props.dispatch(getData(getOptions));
    }

    /**
     * @description scrolls to the top of page on click
     * @returns {void}
     */
    scrollToTop = () => {
        scrollTo('.skipToMain', 0);
    }

    /**
     * @returns {void}
     */
    render() {
        const nextLoadCount = this.props.filters.productsLength + this.props.aem.byoConfig.gridRequest.payload.recordsCountPerPage;
        const loadingLength = nextLoadCount > this.props.filters.total ? this.props.filters.total : nextLoadCount;
        const isDesktop = window.matchMedia(styleVariables.desktopAndAbove).matches;
        const wayPointOffset = isDesktop ? '64px' : '48px';
        const noResultsContainerHidden = findFirst('.no-results-container');
        const htmlcallout = {
            interactionContext: '',
            interactionType: AnalyticsConstants.BACK_TO_TOP,
            interactionName: AnalyticsConstants.BACK_TO_TOP_CENTER
        };

        if (this.props.filters.gridCallInitialized && !this.props.filters.total && noResultsContainerHidden && this.props.byo.previewWidth !== null) {
            removeClass(noResultsContainerHidden, 'hide');
            if (window.aos) {
                window.aos.refreshHard();
            }
        } else {
            addClass(noResultsContainerHidden, 'hide');
        }

        return (
            <div className="grid-page container byo-grid-page container-centered">
                <CSSTransition
                    in={(!isDesktop && !this.props.byo.byoEditMode && this.props.filters.total !== 0)}
                    timeout={1000}
                    mountOnEnter
                    unmountOnExit
                    classNames={
                        {
                            enter: 'byo-filters-bar-animation__enter',
                            enterActive: 'byo-filters-bar-animation__enter_active',
                            enterDone: 'byo-filters-bar-animation__enter_complete',
                            exit: 'byo-filters-bar-animation__exit',
                            exitActive: 'byo-filters-bar-animation__exit_active',
                            exitDone: 'byo-filters-bar-animation__exit_complete'
                        }}
                >
                    <div>
                        <Filters onSticky={this.setStickyPosition} stickyPosition={wayPointOffset} />
                    </div>
                </CSSTransition>
                {(isDesktop && this.props.filters.total !== 0) && <Filters onSticky={this.setStickyPosition} stickyPosition={wayPointOffset} />}
                <CSSTransition
                    in={(!isDesktop && !this.props.byo.byoEditMode && this.props.filters.total !== 0)}
                    timeout={1000}
                    classNames={
                        {
                            enter: 'byo-grid-animation__enter',
                            enterActive: 'byo-grid-animation__enter_active',
                            enterDone: 'byo-grid-animation__enter_complete',
                            exit: 'byo-grid-animation__exit',
                            exitActive: 'byo-grid-animation__exit_active',
                            exitDone: 'byo-grid-animation__exit_complete'
                        }}
                >
                    <div className="grid-page__grid-holder">
                        <ByoGrid
                            stickyPoint={this.state.stickyPoint}
                            showCTA
                            onEndReached={this.showMore}
                        />
                    </div>
                </CSSTransition>
                {this.props.filters.total > this.props.filters.productsLength && this.props.filters.productsLength > 0 &&
                    <p className="grid-page__loading">
                        {/* eslint-disable-next-line */}
                        {objectPath.get(this.props, 'labels.loadingLabel.preText', '')} {this.props.filters.productsLength + 1} {objectPath.get(this.props, 'labels.hyphen', '-')} {loadingLength} {objectPath.get(this.props, 'labels.loadingLabel.postText', '')} {this.props.filters.total}
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
                                    <Picture
                                        customClass="scroll_to_top_button_img"
                                        defaultSrc={this.props.backToTopIconSrc}
                                        altText={this.props.backToTopIconAltText}
                                        isLazyLoad
                                    />
                                </span>
                            </span>
                        </button>
                    </div>
                }
            </div>);
    }
}

ByoBrowseGrid.propTypes = {
    byo: PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired,
    filters: PropTypes.any.isRequired,
    labels: PropTypes.any.isRequired,
    aem: PropTypes.any.isRequired,
    backToTopIconSrc: PropTypes.string.isRequired,
    backToTopIconAltText: PropTypes.string.isRequired,
    sortOptions: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
    return {
        byo: state.byo,
        aem: state.aem,
        backToTopIconSrc: objectPath.get(state, 'aem.icons.backToTop.src', ''),
        backToTopIconAltText: objectPath.get(state, 'aem.icons.backToTop.altText', 'backtotop icon'),
        filters: state.filters,
        labels: state.authoredLabels,
        sortOptions: state.sortOptions.options
    };
};

export default connect(mapStateToProps, null, null, { withRef: true })(ByoBrowseGrid);
