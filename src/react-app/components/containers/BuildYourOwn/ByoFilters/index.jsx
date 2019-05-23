// Packages
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import objectPath from 'object-path';
import Waypoint from 'react-waypoint';

import {
    findFirst,
    addClass,
    removeClass
} from 'lib/dom/dom-util';
import find from 'lodash/find';
import remove from 'lodash/remove';
import includes from 'lodash/includes';
import uniq from 'lodash/uniq';
import { disableBodyScroll, enableBodyScroll } from 'lib/no-scroll';

import { getChildFilters } from 'lib/utils/filters';

// Actions import
import { updateFilters, setByoSortRelevance } from 'actions/ByoFiltersActions';

// Styles
import styleVariables from 'lib/utils/breakpoints';
// import './index.scss';

// components
import FiltersMainMenu from './FiltersMainMenu.jsx';
import SortByOption from './SortByOption.jsx';
import SelectedFilters from './SelectedFilters.jsx';

const doc = document.documentElement;


/**
 * Filters component
 */
class ByoFilters extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            showSubMenu: false,
            subListItemToShow: '',
            mobileFilter: false,
            isSticky: false,
            hideFilterBorder: true
        };
        this.scrollPosition = (window.pageYOffset || document.documentElement.scrollTop);
        this.breakpointHandler = window.matchMedia(styleVariables.desktopTabletAbove);
    }

    /**
     * Lifcycle hook
     * @returns {void}
     */
    componentDidMount() {
        this.breakpointHandler.addListener(this.setBackgroundScroll);
        this.checkFilterScrollPosition();
    }

    /**
     * Lifcycle hook
     * @returns {void}
     */
    componentWillUnmount() {
        this.breakpointHandler.removeListener(this.setBackgroundScroll);
        document.removeEventListener('scroll', this.scrollListener);
    }

    /**
    * @description function to set filters selection
    * @returns {void}
    */
    setBackgroundScroll = () => {
        enableBodyScroll('Filters', false);
    }

    /**
    * function to set filters selection
    * @param {*} filterId filters subList id
    * @param {*} endecaDimensionId filters endecaDimensionId
    * @param {boolean} isChild filters is child or not
    * @param {number} subListId sub filter id
    * @returns {void}
    */
    setFiltersSelection = (filterId, endecaDimensionId, isChild, subListId) => {
        const selectedFiltersArray = [];
        let filterPresent = false;
        const childFiltersId = getChildFilters(this.props.filtersData, isChild && subListId ? subListId : filterId, endecaDimensionId);
        const themeConfig = objectPath.get(this.props.aem, 'byoThemeFilterConfig', false);

        if (filterId !== 'clear') {
            if (this.props.selectedFiltersList.length > 0) {
                this.props.selectedFiltersList.forEach((filter, index) => {
                    if (filter && parseInt(filter, 10) === parseInt(filterId, 10)) {
                        selectedFiltersArray.splice(index, 1);
                        filterPresent = true;
                    } else {
                        selectedFiltersArray.push(filter.toString());
                    }
                });
            }

            if (!filterPresent) {
                selectedFiltersArray.push(filterId.toString());
                // selecetd filter is child, and selected filters array has sub filter id remove it from array
                if (isChild && subListId && selectedFiltersArray.indexOf(subListId.toString()) > -1) {
                    selectedFiltersArray.splice(selectedFiltersArray.indexOf(subListId.toString()), 1);
                }
            } else {
                childFiltersId.forEach((childId) => {
                    if (includes(selectedFiltersArray, childId)) {
                        selectedFiltersArray.splice(selectedFiltersArray.indexOf(childId), 1);
                    }
                });
                if (isChild && subListId && selectedFiltersArray.indexOf(subListId.toString()) < 0) {
                    selectedFiltersArray.push(subListId.toString());
                }
            }
        }

        if (isChild && themeConfig && selectedFiltersArray.indexOf((themeConfig.id).toString()) > -1) {
            selectedFiltersArray.splice(selectedFiltersArray.indexOf((themeConfig.id).toString()), 1);
        }

        if (selectedFiltersArray.length <= 1 && themeConfig) {
            selectedFiltersArray.push((themeConfig.id).toString());
        }

        const filtersArray = selectedFiltersArray.filter((item) => item).map((item) => item.toString());
        const filterOptions = {
            filters: uniq(filtersArray),
            removeCustomFilter: (filterId === 'custom' || filterId === 'clear')
        };

        this.props.dispatch(updateFilters(filterOptions));
    }

    /**
     * Method for adding sticky behaviour to filters
     * @returns {void}
     */
    checkFilterScrollPosition = () => {
        document.addEventListener('scroll', this.scrollListener);
    }

    /**
     * @description Sticky filter bar listner
     * @returns {void}
     */
    scrollListener = () => {
        const currentPos = (window.pageYOffset || document.documentElement.scrollTop);
        const element = findFirst('.selected-filters__container_list-item');
        const sortElement = findFirst('.sortby-wrapper__options');

        if (currentPos > this.scrollPosition && !this.state.showSubMenu && this.state.isSticky && !this.state.mobileFilter) {
            addClass(element, 'hide');
            addClass(sortElement, 'scroll-position');
            this.setState({ hideFilterBorder: false });
        } else {
            removeClass(element, 'hide');
            removeClass(sortElement, 'scroll-position');
            this.setState({ hideFilterBorder: true });
        }
        this.scrollPosition = currentPos;
    }

    /**
     * @param {*} e filter event
     * @param {*} index filter subList index
     * @returns {void}
     */
    toggleSubList = (e, index) => {
        let showSubMenu;
        let subListItemToShow;

        if (e.currentTarget) {
            e.currentTarget.blur();
        }

        if (index === this.state.subListItemToShow || !index) {
            subListItemToShow = null;
            showSubMenu = !this.state.showSubMenu;
        } else {
            subListItemToShow = index;
            showSubMenu = true;
        }

        this.setState({
            showSubMenu,
            subListItemToShow
        });
    }

    /**
     * Handles filters selection
     * @param {object} customPrices object
     * @returns {*} updateed state
     */
    handleFilterSelection = (customPrices) => {
        const sortOption = this.props.sortOptions.selectedSortOptions;
        const modifiedSelection = this.props.selectedFiltersList;
        const priceCategory = find(this.props.filtersData, { endecaDimensionId: 4 });

        if (this.props.selectedFiltersList.length && customPrices) {
            priceCategory.dimensionValues.forEach((filter) => {
                if (filter && filter.id) {
                    remove(modifiedSelection, (id) => {
                        return id.toString() === filter.id.toString();
                    });
                }
            });
        }

        modifiedSelection.push('custom');
        const filterOptions = {
            filters: modifiedSelection,
            sortOption,
            customPrices
        };

        this.props.dispatch(updateFilters(filterOptions));
    }

    /**
     * function to toggle mobile filter state
     * @returns {void}
     */
    toggleMobileFilter = () => {
        const mobileFilterStatus = this.state.mobileFilter;

        if (!mobileFilterStatus) {
            disableBodyScroll('Filters', true);
        } else {
            enableBodyScroll('Filters', false);
        }

        this.setState({
            mobileFilter: !mobileFilterStatus,
            showSubMenu: false,
            subListItemToShow: ''
        });
    }

    /**
     * function to make filters sticky
     * @param {*} currentPosition tells if the waypoint is above/below/inside of the viewport
     * @returns {void}
     */
    makeSticky = ({ currentPosition }) => {
        // Making filters sticky only if the filter waypoint has left viewport from above
        if (currentPosition === 'above') {
            this.setState({ isSticky: true });
            this.props.onSticky((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0));
        }
    }

    /**
     * function to remove sticky filters
     * @returns {void}
     */
    removeSticky = () => {
        // Irrespective of from top or bottom if waypoint enters the view port the remove sticky behaviour
        // Checking if the sticky nav is already removed to avoid multiple mutiation on state
        if (this.state.isSticky) {
            this.setState({ isSticky: false });
        }
    }

    /**
     * function to close filters on leaving the wrapper
     * @returns {void}
     */
    closeFilters = () => {
        if (!findFirst('.hour-glass-holder')) {
            this.setState({
                showSubMenu: false,
                subListItemToShow: false
            });
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            filtersData,
            selectedFiltersList
        } = this.props;
        const {
            showSubMenu,
            mobileFilter
        } = this.state;
        const {
            belowDesktopTablet
        } = styleVariables;

        return (
            <div
                className={`filter-waypoint-wrapper ${this.state.isSticky ? 'filter-fixed' : ''}`}
                onMouseLeave={() => {
                    this.props.dispatch(setByoSortRelevance(false));
                    this.closeFilters();
                }}
                onBlur={() => { }}
            >
                <Waypoint
                    onEnter={this.removeSticky}
                    onLeave={this.makeSticky}
                    topOffset={this.props.stickyPosition}
                />
                <div
                    className={
                        classNames('filters-component',
                            {
                                'filters--sticky': this.state.isSticky,
                                'filters--desktop': !mobileFilter && !this.state.isSticky,
                                'no-border': this.state.hideFilterBorder,
                                'sort-open': this.props.byoSortRelevanceOpen
                            })
                    }
                >
                    {
                        Object.keys(filtersData).length > 0 &&
                        <div
                            className={
                                classNames('filters-component__body',
                                    {
                                        'sub-list-visible': showSubMenu,
                                        'show-mobile-filter': mobileFilter
                                    })
                            }
                        >
                            <MediaQuery query={belowDesktopTablet}>
                                <span
                                    className="filter-icon-mobile"
                                    role="button"
                                    tabIndex={0}
                                    onClick={this.toggleMobileFilter}
                                    onKeyPress={this.toggleMobileFilter}
                                >
                                    {objectPath.get(window, 'tiffany.labels.byo.filterHeadLine', 'Filter by')}
                                    <span className="icon-dropdown-right-arrow" />
                                </span>
                            </MediaQuery>

                            <FiltersMainMenu
                                filtersData={filtersData}
                                showSubMenu={showSubMenu}
                                mobileFilter={mobileFilter}
                                subListItemToShow={this.state.subListItemToShow}
                                toggleSubList={(e, index) => this.toggleSubList(e, index)}
                                toggleMobileFilter={() => this.toggleMobileFilter()}
                                setFiltersSelection={(filterId, endecaDimensionId, isChild, subListId) => this.setFiltersSelection(filterId, endecaDimensionId, isChild, subListId)}
                                selectedFiltersList={selectedFiltersList}
                                handleFilterSelection={this.handleFilterSelection}
                            />

                            <div
                                className={
                                    classNames('sort-clear-container',
                                        {
                                            'sort-clear-container--hide': !showSubMenu
                                        })
                                }
                            >
                                <SortByOption
                                    showSubMenu={showSubMenu}
                                    closeFilters={this.closeFilters}
                                    isSticky={this.state.isSticky}
                                />

                                <SelectedFilters
                                    selectedFiltersList={selectedFiltersList}
                                    showSubMenu={showSubMenu}
                                    mobileFilter={mobileFilter}
                                    toggleMobileFilter={() => this.toggleMobileFilter()}
                                    setFiltersSelection={(filterId, endecaDimensionId, isChild, subListId) => this.setFiltersSelection(filterId, endecaDimensionId, isChild, subListId)}
                                />
                            </div>

                        </div>
                    }
                    <MediaQuery query={belowDesktopTablet}>
                        {this.props.currentPageCategory.products.length > 0 && <span className="grid-page__pagination showing-text"> {objectPath.get(this.props.labels, 'showingLabel.preText', '')} 1 {objectPath.get(this.props, 'labels.hyphen', '-')} {this.props.currentPageCategory.productsLength} {objectPath.get(this.props, 'labels.showingLabel.postText', '')} {this.props.currentPageCategory.total}</span>}
                    </MediaQuery>
                </div>

                <div
                    className={
                        classNames('filters-background-overlay',
                            {
                                'filters-background-overlay--show': showSubMenu
                            })
                    }
                />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        selectedFiltersList: state.filters.selectedFilters,
        filtersData: state.filters.filtersData,
        customFilters: state.filters.customFilters,
        currentPageCategory: state.filters,
        aem: state.aem,
        sortOptions: state.sortOptions.options,
        labels: state.authoredLabels,
        byoSortRelevanceOpen: state.filters.isSortOpen
    };
};

ByoFilters.propTypes = {
    dispatch: PropTypes.func.isRequired,
    filtersData: PropTypes.array.isRequired,
    selectedFiltersList: PropTypes.array.isRequired,
    sortOptions: PropTypes.array.isRequired,
    onSticky: PropTypes.func,
    aem: PropTypes.any.isRequired,
    currentPageCategory: PropTypes.any,
    stickyPosition: PropTypes.string,
    labels: PropTypes.object.isRequired
};

ByoFilters.defaultProps = {
    onSticky: () => { },
    currentPageCategory: {},
    stickyPosition: '64px'
};

export default connect(mapStateToProps)(ByoFilters);
