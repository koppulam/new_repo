// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import objectPath from 'object-path';

import ComboBoxElem from 'components/common/ComboBoxElem';

// Constants
import SORT from 'constants/SortConstants';

// Actions
import { updateFilters, setByoSortRelevance } from 'actions/ByoFiltersActions';

import styleVariables from 'lib/utils/breakpoints';

/**
 * SortBy Options Component
 */
class SortByOption extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    async componentDidMount() {
        this.props.dispatch(setByoSortRelevance(false));
    }

    /**
     * @description On props changed life cycle event
     * @param {object} nextProps updated params
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (this.props.showSubMenu !== nextProps.showSubMenu) {
            if (this.props.byoSortRelevance && nextProps.showSubMenu) {
                this.props.dispatch(setByoSortRelevance(false));
            }
        }
    }

    /**
     * Select change handler on mobile
     * @param {Event} event onchange handler
     * @returns {void}
     */
    selectSortOptionMobile = (event) => {
        event.preventDefault();
        const { value } = event.target.options[event.target.selectedIndex];
        const sortOptions = this.props.options.filter(option => parseInt(option.value, 10) === parseInt(value, 10));

        if (sortOptions.length > 0) {
            this.loadData(sortOptions[0]);
        }
    }

    /**
     * Toggle sort options
     * @param {Event} event on click
     * @returns {void}
     */
    toggleSortOptions = (event) => {
        event.preventDefault();
        this.props.dispatch(setByoSortRelevance(!this.props.byoSortRelevance));
        if (this.props.byoSortRelevance) {
            this.sortByOptionsButton.focus();
        }
        this.props.closeFilters();
    }

    /**
     * Sort option selected on desktop
     * @param {Object} sortOption sort option
     * @returns {void}
     */
    selectSortOptionDesktop = (sortOption) => {
        this.props.dispatch(setByoSortRelevance(!this.props.byoSortRelevance));
        this.loadData(sortOption);
        setTimeout(() => {
            this.sortByOptionsButton.focus();
        });
    }

    /**
     * Load data for selected sort options
     * @param {Object} sortOption sort options selected
     * @returns {void}
     */
    loadData = (sortOption) => {
        if (this.props.selectedSortOption !== sortOption) {
            this.props.dispatch({
                type: SORT.SET_SORT_OPTION,
                payload: sortOption
            });
            const filterOptions = {
                filters: this.props.selectedFiltersList,
                init: false,
                sortOption
            };

            this.props.dispatch(updateFilters(filterOptions));
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            belowDesktopTablet,
            desktopTabletAbove
        } = styleVariables;

        return (
            <div
                className="filters-component__sortby-wrapper"
                onBlur={() => {
                    this.props.closeFilters();
                }}
            >
                <MediaQuery query={belowDesktopTablet}>
                    <span className="sortby-wrapper__sort-title">
                        {objectPath.get(window, 'tiffany.labels.sortByText', 'Sort by')}
                        <span className="icon-dropdown-right-arrow" />
                    </span>
                    <select className="sortby-wrapper__sortby-options" onChange={this.selectSortOptionMobile}>
                        {
                            this.props.options.map((sortOption) => {
                                return (
                                    <option
                                        key={sortOption.value}
                                        value={sortOption.value}
                                        selected={parseInt(this.props.selectedSortOption.value, 10) === parseInt(sortOption.value, 10)}
                                    >
                                        {sortOption.sortFilterName}
                                    </option>
                                );
                            })
                        }
                    </select>
                </MediaQuery>
                <MediaQuery query={desktopTabletAbove}>
                    <div className="sortby-wrapper__buttoncontainer">
                        <button
                            type="button"
                            className="sortby-wrapper__button"
                            onClick={this.toggleSortOptions}
                            aria-label={`${objectPath.get(window, 'tiffany.labels.sortByText', 'Filter by')}: ${this.props.selectedSortOption.sortFilterName}`}
                            aria-haspopup="listbox"
                            tabIndex={0}
                            ref={(item) => {
                                this.sortByOptionsButton = item;
                            }}
                        >
                            <p className="sortby-wrapper__sort-title" tabIndex={-1}>
                                {objectPath.get(window, 'tiffany.labels.sortByText', 'Filter by')}
                            </p>
                            <span className="hover-cta">
                                <span className="sortby-wrapper__sort-title_option">{this.props.selectedSortOption.sortFilterName}</span>
                                <span className={
                                    classNames(
                                        {
                                            'icon-dropdown-down': !this.props.byoSortRelevance,
                                            'icon-dropdown-up': this.props.byoSortRelevance
                                        }
                                    )
                                }
                                />
                            </span>
                        </button>
                        <ul
                            className={
                                classNames('sortby-wrapper__options',
                                    {
                                        'sortby-wrapper__options_hide': this.props.showSubMenu || !this.props.byoSortRelevance,
                                        'scroll-position': this.props.isSticky
                                    })
                            }
                            role="listbox"
                        >
                            {
                                this.props.options.map((sortOption, index) => {
                                    return (
                                        <ComboBoxElem
                                            index={index}
                                            key={index.toString()}
                                            prefix="sort"
                                            total={this.props.options.length}
                                            defaultListElemClass="sortby-wrapper__options_element"
                                            listSelectedClass="sortby-wrapper__options_element_selected"
                                            isSelected={(parseInt(sortOption.value, 10) === parseInt(this.props.selectedSortOption.value, 10))}
                                            selectOptionHandler={() => this.selectSortOptionDesktop(sortOption)}
                                            optionListButtonClass="sortby-wrapper__options_element-btn"
                                            optionListLabelClass="sortby-wrapper__options_element-btn_label"
                                            optionListLabel={sortOption.sortFilterName}
                                            closeDropDown={this.toggleSortOptions}
                                            isOpen={!this.props.showSubMenu && this.props.byoSortRelevance}
                                        />
                                    );
                                })
                            }
                        </ul>
                    </div>
                </MediaQuery>
            </div>
        );
    }
}

SortByOption.propTypes = {
    dispatch: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    selectedSortOption: PropTypes.object.isRequired,
    showSubMenu: PropTypes.bool.isRequired,
    closeFilters: PropTypes.func.isRequired,
    isSticky: PropTypes.bool.isRequired,
    selectedFiltersList: PropTypes.array.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        options: state.sortOptions.options,
        selectedSortOption: state.sortOptions.selectedOption,
        selectedFiltersList: state.filters.selectedFilters,
        byoSortRelevance: state.filters.isSortOpen
    };
};


export default connect(mapStateToProps)(SortByOption);
