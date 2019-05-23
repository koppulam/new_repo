// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import { getUrlFromFilters } from 'lib/utils/filters';
import FC from 'constants/FiltersConstants';

// Object path Util
import objectPath from 'object-path';

import styleVariables from 'lib/utils/breakpoints';

// components
// import EngravableToggle from './EngravableToggle.jsx';
import FiltersSubMenu from './FiltersSubMenu.jsx';
import DesignerCollections from './DesignerCollections';


/**
 * Filters main menu Component
 */
class FiltersMainMenu extends React.Component {
    /**
     * @param {*} subListData filter subList Id
     * @returns {number} count of sublist selected
     */
    getSelectedSubFiltersCount = (subListData) => {
        let selectedFiltersCount = 0;

        if (subListData.length > 0) {
            subListData.forEach((filter) => {
                const filterCondition = (filter.selected && (filter.selected.toLowerCase() === 'yes' || filter.selected.toLowerCase() === 'true')) && parseInt(filter.id, 10) !== parseInt(this.props.currentPageCategory.catDimensionId, 10);

                if (filterCondition) {
                    selectedFiltersCount += 1;

                    if (filter.childDimensionValues && filter.childDimensionValues.length) {
                        filter.childDimensionValues.forEach((childFilter) => {
                            if (childFilter.selected && (childFilter.selected.toLowerCase() === 'yes' || childFilter.selected.toLowerCase() === 'true')) {
                                selectedFiltersCount += 1;
                            }
                        });
                    }
                }
            });
        }

        return selectedFiltersCount;
    }

    /**
     * @param {*} filterData filterData
     * @param {*} subListId filter subList Id
     * @param {*} event sublist event
     * @returns {object} generated url
     */
    getSubListUrl = (filterData, subListId) => {
        const { selectedFiltersList, selectedOption } = this.props;
        const selectedFiltersArray = [];
        let url;
        let id;
        const hasSortUrl = window.location.pathname.indexOf(selectedOption && encodeURI(selectedOption.sortUrlKey)) > -1;
        const sortObject = hasSortUrl ? selectedOption : '';

        if (selectedFiltersList.length > 0) {
            selectedFiltersList.forEach((filter, index) => {
                selectedFiltersArray.push(filter.filterDimensionId);
            });
        }

        if (this.checkSelectedStatus(filterData, subListId)) {
            url = getUrlFromFilters(selectedFiltersArray, sortObject);
        } else {
            id = [subListId];
            url = getUrlFromFilters([...selectedFiltersArray, ...id], sortObject);
        }

        return url;
    }

    /**
     * @param {*} filterData filter subList Id
     * @param {*} subListId filter subList Id
     * @returns {boolean} true or false
     */
    checkSelectedStatus = (filterData, subListId) => {
        const dimensionData = filterData.filter(dimension => dimension.id === subListId)[0];

        return dimensionData && dimensionData.selected ? dimensionData.selected.toLowerCase() === 'yes' : false;
    }

    /**
     * @param {*} filterData filter options
     * @param {*} index of filter submenu hide/show
     * @param {*} toggleSubList of filter submenu hide/show
     * @param {*} filterIndex for filters tabindex position
     * @param {string} name Name of the main level of filters
     * @returns {object} html structure
     */
    renderFilterByOptions = (filterData, index, toggleSubList, filterIndex, name) => {
        const { desktopTabletAbove, belowDesktopTablet } = styleVariables;
        const filterCheck = (filterData.dimensionValues.length === 1 && parseInt(filterData.dimensionValues[0].id, 10) === parseInt(this.props.currentPageCategory.catDimensionId, 10));
        const isActiveFilter = this.props.subListItemToShow === index;
        const { isCustomFilter } = this.props.currentPageCategory;
        const priceSelectedCount = filterData.endecaDimensionId === FC.ENDECA_DIMENSIONIDS.PRICE_RANGES && isCustomFilter ? 1 : this.getSelectedSubFiltersCount(filterData.dimensionValues);
        const subMenuChildFilters = filterData.dimensionValues && filterData.dimensionValues.find((i) => {
            return i.childDimensionValues && i.childDimensionValues.length > 0;
        });

        return (
            filterCheck
                ? null :
                <li
                    className={
                        classNames('main-option',
                            {
                                'main-option__designer-collection': (filterData.endecaDimensionId === FC.ENDECA_DIMENSIONIDS.DESIGNERS_COLLECTIONS),
                                'main-option-price': filterData.endecaDimensionId === 4
                            })
                    }
                    key={filterData.endecaDimensionId}
                >
                    <span
                        className={
                            classNames('sub-options__selected-count',
                                {
                                    'selected-count--hide': this.props.showSubMenu || !priceSelectedCount
                                })
                        }
                    >
                        {priceSelectedCount}
                    </span>
                    <button
                        type="button"
                        className={
                            classNames('main-option__title',
                                {
                                    'main-option--active-filter': isActiveFilter
                                })
                        }
                        onClick={(e) => toggleSubList(e, index)}
                        aria-expanded={isActiveFilter}
                        tabIndex={0}
                    >
                        <span className="main-option__title_content" tabIndex={-1}>
                            <span
                                className={
                                    classNames('main-option--active',
                                        {
                                            'active-state--hide': !priceSelectedCount
                                        })
                                }
                            />

                            {name}
                        </span>
                        {(!subMenuChildFilters) &&
                            <span className="icon-Up main-option__mobile-icon" />
                        }
                        <img
                            src={this.props.dropdownSrc}
                            alt={this.props.dropdownAltText}
                            className={
                                classNames('arrow-mobile--hide',
                                    {
                                        'up-arrow': isActiveFilter,
                                        'down-arrow': !isActiveFilter
                                    })
                            }
                        />

                    </button>
                    <MediaQuery query={desktopTabletAbove}>
                        {
                            (filterData.endecaDimensionId !== FC.ENDECA_DIMENSIONIDS.DESIGNERS_COLLECTIONS) &&
                            <FiltersSubMenu
                                getSubListUrl={this.getSubListUrl}
                                checkSelectedStatus={this.checkSelectedStatus}
                                subListItemToShow={this.props.subListItemToShow}
                                index={index}
                                endecaDimensionId={filterData.endecaDimensionId}
                                subListItems={filterData.dimensionValues}
                                setFiltersSelection={(filterId, endecaDimensionId, isChild, subListId) => this.props.setFiltersSelection(filterId, endecaDimensionId, isChild, subListId)}
                                selectedFiltersList={this.props.selectedFiltersList}
                                handleFilterSelection={this.props.handleFilterSelection}
                                showSubListChild={this.props.showSubListChild}
                                groupName={filterData.groupName}
                                isCustomFilter={isCustomFilter}
                            />
                        }
                        {
                            (filterData.endecaDimensionId === FC.ENDECA_DIMENSIONIDS.DESIGNERS_COLLECTIONS) &&
                            <DesignerCollections
                                getSubListUrl={this.getSubListUrl}
                                checkSelectedStatus={this.checkSelectedStatus}
                                filtersData={this.props.filtersData}
                                subListItemToShow={this.props.subListItemToShow}
                                setFiltersSelection={(filterId, endecaDimensionId, isChild, subListId) => this.props.setFiltersSelection(filterId, endecaDimensionId, isChild, subListId)}
                                selectedFiltersList={this.props.selectedFiltersList}
                                isCustomFilter={isCustomFilter}
                            />
                        }
                    </MediaQuery>
                    <MediaQuery query={belowDesktopTablet}>
                        <FiltersSubMenu
                            getSubListUrl={this.getSubListUrl}
                            checkSelectedStatus={this.checkSelectedStatus}
                            subListItemToShow={this.props.subListItemToShow}
                            index={index}
                            endecaDimensionId={filterData.endecaDimensionId}
                            subListItems={filterData.dimensionValues}
                            setFiltersSelection={(filterId, endecaDimensionId, isChild, subListId) => this.props.setFiltersSelection(filterId, endecaDimensionId, isChild, subListId)}
                            selectedFiltersList={this.props.selectedFiltersList}
                            handleFilterSelection={this.props.handleFilterSelection}
                            showSubListChild={this.props.showSubListChild}
                            groupName={filterData.groupName}
                            toggleMobileFilter={() => this.props.toggleMobileFilter()}
                        />
                    </MediaQuery>
                </li>
        );
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            filtersData,
            toggleSubList,
            toggleMobileFilter,
            selectedFiltersList,
            currentPageCategory
        } = this.props;
        const { belowDesktopTablet } = styleVariables;
        let { ENDECA_FILTER_DIMENSIONS_ORDER } = this.props.aem;
        const isBrowseGridFilter = selectedFiltersList.length === 1 &&
            parseInt(selectedFiltersList[0].filterDimensionId, 10) === parseInt(currentPageCategory.catDimensionId, 10);

        ENDECA_FILTER_DIMENSIONS_ORDER = this.props.type !== 'BRIDAL' ? ENDECA_FILTER_DIMENSIONS_ORDER.filter((filter) => filter.value !== FC.ENDECA_DIMENSIONIDS.COLLECTIONS) : ENDECA_FILTER_DIMENSIONS_ORDER;

        return (
            <div
                className={
                    classNames('filters-component__filterby-wrapper',
                        {
                            'selected-filters--empty': selectedFiltersList.length <= 0 || isBrowseGridFilter
                        })
                }
            >
                <h4 className="filterby-wrapper__filter-title">
                    {objectPath.get(window, 'tiffany.labels.filterByText', 'Filter by')}
                </h4>
                <ul className={
                    classNames('filterby-wrapper__filterby-options', {
                        'designer-filter': FC.ENDECA_DIMENSIONIDS.DESIGNERS_COLLECTIONS === this.props.subListItemToShow
                    })
                }
                >
                    {
                        ENDECA_FILTER_DIMENSIONS_ORDER.map((endecaFilterObj, index) => {
                            const endecaFilterId = endecaFilterObj.value;
                            const filters = filtersData.filter((filterData) => filterData.endecaDimensionId === endecaFilterId);

                            if (filters && filters.length && filters[0].dimensionValues && filters[0].dimensionValues.length) {
                                filters[0].groupName = endecaFilterObj.name;
                                return this.renderFilterByOptions(filters[0], endecaFilterId, toggleSubList, index, filters[0].singleCategoryFilter ? (filters[0].dimensionValueTypeText || filters[0].name) : endecaFilterObj.filterDisplayName);
                            }
                            return null;
                        })
                    }
                </ul>
                <MediaQuery query={belowDesktopTablet}>
                    <span
                        role="button"
                        tabIndex={0}
                        className="close-sub-menu-btn-mobile icon-Close"
                        onClick={toggleMobileFilter}
                        onKeyPress={toggleMobileFilter}
                    />
                </MediaQuery>
                {/* Commenting as AC say not to view engrablable for now */}
                {/* <EngravableToggle
                    showSubMenu={showSubMenu}
                    mobileFilter={mobileFilter}
                /> */}
            </div>
        );
    }
}

FiltersMainMenu.propTypes = {
    showSubMenu: PropTypes.bool,
    // mobileFilter: PropTypes.bool,
    type: PropTypes.string.isRequired,
    filtersData: PropTypes.array.isRequired,
    subListItemToShow: PropTypes.any,
    toggleSubList: PropTypes.func.isRequired,
    toggleMobileFilter: PropTypes.func.isRequired,
    setFiltersSelection: PropTypes.func.isRequired,
    selectedFiltersList: PropTypes.array.isRequired,
    handleFilterSelection: PropTypes.func.isRequired,
    currentPageCategory: PropTypes.any,
    selectedOption: PropTypes.any,
    aem: PropTypes.any.isRequired,
    showSubListChild: PropTypes.bool.isRequired,
    dropdownSrc: PropTypes.string.isRequired,
    dropdownAltText: PropTypes.string.isRequired
};

FiltersMainMenu.defaultProps = {
    showSubMenu: false,
    // mobileFilter: false,
    subListItemToShow: '',
    currentPageCategory: {},
    selectedOption: ''
};

const mapStateToProps = (state) => {
    return {
        aem: state.aem,
        type: state.filters.type,
        currentPageCategory: state.filters,
        selectedOption: state.sortOptions.selectedOption,
        dropdownSrc: objectPath.get(state, 'aem.icons.dropdown.src', ''),
        dropdownAltText: objectPath.get(state, 'aem.icons.dropdown.altText', '')
    };
};

export default connect(mapStateToProps)(FiltersMainMenu);
