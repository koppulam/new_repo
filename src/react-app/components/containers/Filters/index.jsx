// Packages
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import objectPath from 'object-path';
import Waypoint from 'react-waypoint';
import uniq from 'lodash/uniq';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';

import FC from 'constants/FiltersConstants';

import { findFirst, addClass, removeClass } from 'lib/dom/dom-util';
import { disableBodyScroll, enableBodyScroll } from 'lib/no-scroll';

import { getChildFilters, updateCustomPriceFilterMap } from 'lib/utils/filters';
// Actions import
import { updateFilters, isSortOpen, updateSelectedFilters } from 'actions/FiltersActions';

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
class Filters extends React.Component {
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
            showSubListChild: false
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
        let navigationFilters = cloneDeep(this.props.navigationFilters);
        const filterIndex = findIndex(navigationFilters, (nav) => String(nav).toLowerCase() === String(filterId).toLowerCase());

        if (endecaDimensionId !== FC.ENDECA_DIMENSIONIDS.DESIGNERS_COLLECTIONS && endecaDimensionId !== FC.ENDECA_DIMENSIONIDS.COLLECTIONS) {
            if (filterIndex !== -1) {
                // Remove filterid exist in navigationFilters
                navigationFilters.splice(filterIndex, 1);

                if (isChild) {
                    // get all childids of the parent of current dimension - siblings
                    const childFilerIds = getChildFilters(this.props.filtersData, isChild ? subListId : filterId, endecaDimensionId);
                    let childIdExists = false;

                    // check if any of the childfilter id exists in the navigationFilters already (of course not the current one)
                    childFilerIds.forEach((childId) => {
                        const childFoundLength = navigationFilters.filter((navFilterId) => {
                            return String(navFilterId) === String(childId);
                        });

                        if (childId !== filterId && childFoundLength.length > 0) {
                            childIdExists = true;
                        }
                    });

                    // if none of the siblings exists - push the parent filter to navigation filters
                    if (!childIdExists) {
                        navigationFilters.push(subListId);
                    }
                }
            } else if (isChild) {
                // if child - remove the parent filter from navigation filters
                navigationFilters = navigationFilters.filter((navFilterId) => {
                    return String(navFilterId) !== String(subListId);
                });

                navigationFilters.push(filterId);
            } else {
                /*
                    When Filter id does not exits in navigation filters it could mean either of the below,
                        1. its being added newly - in this case we can push it to navigation filters
                        2. one or more of its child dimensions exists in navigaiton filters
                            - in this case we need to remove child demensions from navigation filters
                            also do not add this filter to the navigation filters
                */
                const childFilterIds = getChildFilters(this.props.filtersData, isChild ? subListId : filterId, endecaDimensionId);
                const originalFiltersLength = navigationFilters.length;

                if (childFilterIds.length > 0) {
                    navigationFilters = navigationFilters.filter((navFilterId) => {
                        return childFilterIds.indexOf(navFilterId.toString()) === -1;
                    });
                }

                // push only if none of the child filters exists in navigation filters
                if (originalFiltersLength === navigationFilters.length) {
                    navigationFilters.push(filterId);
                }

                if (filterId === 'clear') {
                    navigationFilters = [];
                }
            }
        } else if (endecaDimensionId === FC.ENDECA_DIMENSIONIDS.DESIGNERS_COLLECTIONS) {
            // if it is collection, its is child
            if (isChild) {
                if (filterIndex !== -1) {
                    navigationFilters.splice(filterIndex, 1);
                } else {
                    navigationFilters.push(filterId);
                }
            } else if (!isChild) {
                if (filterIndex !== -1) {
                    navigationFilters.splice(filterIndex, 1);

                    /*
                        if one designer collection object is removed from
                        remove all collections from navigation filters,
                        as we don't have any parent child relationship
                        in designers and collections
                    */
                    const collectionsObj = this.props.filtersData.filter((filterObj) => {
                        return filterObj.endecaDimensionId === FC.ENDECA_DIMENSIONIDS.DESIGNERS_COLLECTIONS;
                    });

                    if (collectionsObj && collectionsObj.length > 0) {
                        const collectionsDimensions = objectPath.get(collectionsObj, '0.dimensionValues', []);
                        const collectionsDimensionIds = collectionsDimensions.map((dimesnion) => {
                            return dimesnion.isCollection && String(dimesnion.id);
                        });

                        navigationFilters = navigationFilters.filter((navFilterId) => {
                            return collectionsDimensionIds.indexOf(String(navFilterId)) === -1;
                        });
                    }
                } else {
                    navigationFilters.push(filterId);
                }
            }
        }

        const filterOptions = {
            filters: uniq(navigationFilters),
            type: this.props.type,
            removeCustomFilter: (filterId === 'custom' || filterId === 'clear')
        };

        this.props.dispatch(updateSelectedFilters(filterOptions.filters));
        this.props.dispatch(updateFilters(filterOptions));
        this.setState({ showSubListChild: filterIndex !== -1 });
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
        } else {
            removeClass(element, 'hide');
            removeClass(sortElement, 'scroll-position');
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
        const elem = findFirst('body');

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

        if (!this.state.showSubMenu) {
            addClass(elem, 'overflow-hidden-x');
        } else {
            removeClass(elem, 'overflow-hidden-x');
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
        const modifiedSelection = [];

        if (this.props.selectedFiltersList.length) {
            this.props.selectedFiltersList.forEach((filter) => {
                if (filter && (filter.filterType).toLowerCase() !== 'price ranges') {
                    modifiedSelection.push(filter.filterDimensionId);
                }
            });
        }

        updateCustomPriceFilterMap(customPrices);

        modifiedSelection.push('custom');
        const filterOptions = {
            filters: modifiedSelection,
            sortOption,
            customPrices
        };

        this.props.dispatch(updateSelectedFilters(filterOptions.filters));
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
                subListItemToShow: false,
                showSubListChild: false

            });
            const elem = findFirst('body');

            removeClass(elem, 'overflow-hidden');
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
                    this.props.dispatch(isSortOpen(false));
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
                                'sort-open': this.props.isSortOpen
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
                            onMouseLeave={this.closeFilters}
                        >
                            <MediaQuery query={belowDesktopTablet}>
                                <span
                                    className="filter-icon-mobile"
                                    role="button"
                                    tabIndex={0}
                                    onClick={this.toggleMobileFilter}
                                    onKeyPress={this.toggleMobileFilter}
                                >
                                    {objectPath.get(window, 'tiffany.labels.filterByText', 'Filter by')}
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
                                showSubListChild={this.state.showSubListChild}
                            />

                            <div
                                className={
                                    classNames('sort-clear-container',
                                        {
                                            'sort-clear-container--hide': !showSubMenu
                                        })
                                }
                            >
                                <SelectedFilters
                                    type={this.props.type}
                                    selectedFiltersList={selectedFiltersList}
                                    showSubMenu={showSubMenu}
                                    mobileFilter={mobileFilter}
                                    toggleMobileFilter={() => this.toggleMobileFilter()}
                                    setFiltersSelection={(filterId, endecaDimensionId, isChild, subListId) => this.setFiltersSelection(filterId, endecaDimensionId, isChild, subListId)}
                                />

                                <SortByOption
                                    type={this.props.type}
                                    showSubMenu={showSubMenu}
                                    closeFilters={this.closeFilters}
                                    isSticky={this.state.isSticky}
                                />
                            </div>

                        </div>
                    }
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
        aem: state.aem,
        sortOptions: state.sortOptions.options,
        navigationFilters: state.filters.navigationFilters,
        isSortOpen: state.filters.isSortOpen
    };
};

Filters.propTypes = {
    dispatch: PropTypes.func.isRequired,
    filtersData: PropTypes.array.isRequired,
    selectedFiltersList: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    sortOptions: PropTypes.array.isRequired,
    onSticky: PropTypes.func,
    stickyPosition: PropTypes.string,
    navigationFilters: PropTypes.array
};

Filters.defaultProps = {
    onSticky: () => { },
    stickyPosition: '80px',
    navigationFilters: []
};

export default connect(mapStateToProps)(Filters);
