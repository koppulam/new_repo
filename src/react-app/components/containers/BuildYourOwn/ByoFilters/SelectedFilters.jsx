// Packages
import React from 'react';
import * as objectPath from 'object-path';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import Slider from 'react-slick';

import styleVariables from 'lib/utils/breakpoints';
import { currencyFormatter } from 'lib/utils/currency-formatter';
import SlickArrow from 'components/common/SlickArrows';
import CustomScrollBar from 'components/common/CustomScrollBar';

/**
 * Selected filters Component
 */
class SelectedFilters extends React.Component {
    /**
     * @param {*} filterDimensionId sub filters id
     * @returns {string} sub filters name
     */
    getSubFiltersName = (filterDimensionId) => {
        const subFilterObj = {
            selectedFilterName: '',
            endecaDimensionId: '',
            isChild: false
        };
        const { filtersData } = this.props;
        const parsedFilterDimension = parseInt(filterDimensionId, 10);

        if (filtersData.length > 0) {
            filtersData.forEach((filter) => {
                const { endecaDimensionId } = filter;

                if (filter.dimensionValues && filter.dimensionValues.length > 0) {
                    filter.dimensionValues.forEach((subfilter) => {
                        if (parseInt(subfilter.id, 10) === parsedFilterDimension) {
                            subFilterObj.selectedFilterName = subfilter.name;
                            subFilterObj.endecaDimensionId = endecaDimensionId;
                        }
                        if (subfilter.childDimensionValues) {
                            const filteredChild = subfilter.childDimensionValues.filter(childDim => parseInt(childDim.id, 10) === parsedFilterDimension);

                            if (filteredChild && filteredChild.length > 0) {
                                subFilterObj.selectedFilterName = filteredChild[0].name;
                                subFilterObj.endecaDimensionId = endecaDimensionId;
                                subFilterObj.isChild = true;
                            }
                        }
                    });
                }
            });
        }

        return subFilterObj;
    }

    /**
     * @param {*} selectedFiltersList selected filters list
     * @returns {object} html structure
     */
    renderSelectedFiltersList = (selectedFiltersList) => {
        return (
            selectedFiltersList.length > 0 &&
            selectedFiltersList.map((filterDimensionId) => {
                const subFilterObj = this.getSubFiltersName(filterDimensionId);
                const {
                    selectedFilterName,
                    endecaDimensionId,
                    isChild
                } = subFilterObj;

                return (
                    !selectedFilterName
                        ? null :
                        <div
                            key={filterDimensionId}
                            className="selected-filters__list-title"
                        >
                            <button
                                type="button"
                                aria-label={`${objectPath.get(window, 'tiffany.labels.removeFilterLabel', 'Remove Filter')} ${selectedFilterName}`}
                                className="icon-Close selected-filters__list-title--close"
                                onClick={() => this.props.setFiltersSelection(filterDimensionId, endecaDimensionId, isChild)}
                            />
                            {selectedFilterName}
                        </div>
                );
            })
        );
    }

    /**
     * @returns {object} html structure
     */
    renderCustomFilterList = () => {
        const { max, isCustomFilter } = this.props;
        let { min } = this.props;

        if (!min) {
            min = 0;
        }

        return isCustomFilter ?
            <div
                key={`${min} - ${max}`}
                className="selected-filters__list-title"
            >
                <button
                    type="button"
                    aria-label={`${objectPath.get(window, 'tiffany.labels.removeFilterLabel', 'Remove Filter')} ${min} - ${max}`}
                    className="icon-Close selected-filters__list-title--close"
                    onClick={() => this.props.setFiltersSelection('custom')}
                />
                {`${currencyFormatter(min)} - ${currencyFormatter(max)}`}
            </div>
            :
            null;
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const clearCtaText = objectPath.get(window, 'tiffany.labels.byo.clearFilterCta', 'Clear All');
        const themeConfig = objectPath.get(this.props.aem, 'byoThemeFilterConfig', false);
        const {
            selectedFiltersList,
            showSubMenu,
            mobileFilter,
            toggleMobileFilter,
            isCustomFilter
        } = this.props;
        const { belowDesktopTablet, desktopTabletAbove } = styleVariables;
        const hasThemeConfig = themeConfig && themeConfig.id;
        const isThemeSelected = hasThemeConfig && (selectedFiltersList.indexOf(parseInt(themeConfig.id, 10)) !== -1 || selectedFiltersList.indexOf(themeConfig.id) !== -1);
        const isGridFilter = !isCustomFilter && ((!hasThemeConfig && selectedFiltersList.length <= 1) || (selectedFiltersList.length <= 2 && isThemeSelected));
        const settings = {
            dots: false,
            infinite: false,
            speed: 600,
            noRightPadding: true,
            slidesToScroll: 1,
            swipeToSlide: false,
            initialSlide: 0,
            arrows: true,
            variableWidth: true,
            useTransform: false,
            accessibility: false,
            enableAriaHidden: false,
            nextArrow: <SlickArrow isleftArrow={false} />,
            prevArrow: <SlickArrow isleftArrow />
        };
        const doneTxt = objectPath.get(window.tiffany, 'labels.doneText', '');

        return (
            <div
                className={
                    classNames('selected-filters',
                        {
                            'options-selected': this.props.selectedFiltersList && this.props.selectedFiltersList.length > 1,
                            'selected-filters--show': showSubMenu || mobileFilter,
                            'selected-filters--outside-overlay': !showSubMenu && !mobileFilter,
                            'selected-filters--hide-mobile': isGridFilter
                        })
                }
            >
                <div className="selected-filters__container">
                    <div className="selected-filters__container_list">
                        <button
                            type="button"
                            className={
                                classNames('selected-filters__container_list_clear-btn',
                                    {
                                        'clear-btn--hide': isGridFilter
                                    })
                            }
                            aria-label={clearCtaText}
                            onClick={() => this.props.setFiltersSelection('clear')}
                        >
                            {clearCtaText}
                        </button>
                        <div className="selected-filters__container_list-item">
                            <CustomScrollBar iosEnable>
                                {(this.props.currentPageCategory.products.length > 0 || Number.isNaN(this.props.currentPageCategory.total)) && <span className="grid-page__pagination">
                                    {/* eslint-disable-next-line */}
                                    {objectPath.get(this.props.labels, 'showingLabel.preText', '')} 1 {objectPath.get(this.props, 'labels.hyphen', '-')} {this.props.currentPageCategory.productsLength} {objectPath.get(this.props, 'labels.showingLabel.postText', '')} {Number.isNaN(this.props.currentPageCategory.total) ? 0 : this.props.currentPageCategory.total}</span>}
                                {!showSubMenu &&
                                    <MediaQuery query={desktopTabletAbove}>
                                        <div className="selected-filters__container_list-item_container">
                                            <Slider {...settings}>
                                                {this.renderSelectedFiltersList(selectedFiltersList)}
                                                {this.renderCustomFilterList()}
                                            </Slider>
                                        </div>
                                    </MediaQuery>
                                }
                                {(showSubMenu || mobileFilter) &&
                                    <div className="selected-filters__container_list-item_container">
                                        {this.renderSelectedFiltersList(selectedFiltersList)}
                                        {this.renderCustomFilterList()}
                                    </div>
                                }
                            </CustomScrollBar>
                        </div>
                    </div>
                </div>
                <MediaQuery query={belowDesktopTablet}>
                    <button
                        type="button"
                        className="selected-filters__done-btn"
                        onClick={toggleMobileFilter}
                    >
                        {doneTxt}
                    </button>
                </MediaQuery>
            </div>
        );
    }
}

SelectedFilters.propTypes = {
    selectedFiltersList: PropTypes.array.isRequired,
    showSubMenu: PropTypes.bool,
    mobileFilter: PropTypes.bool,
    toggleMobileFilter: PropTypes.func.isRequired,
    setFiltersSelection: PropTypes.func.isRequired,
    filtersData: PropTypes.array.isRequired,
    isCustomFilter: PropTypes.bool,
    min: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    max: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    aem: PropTypes.any.isRequired,
    currentPageCategory: PropTypes.any,
    labels: PropTypes.any.isRequired
};

SelectedFilters.defaultProps = {
    showSubMenu: false,
    mobileFilter: false,
    isCustomFilter: false,
    min: '',
    max: '',
    currentPageCategory: {}
};

const mapStateToProps = (state, ownProps) => {
    return {
        filtersData: state.filters.filtersData,
        isCustomFilter: state.filters.isCustomFilter,
        min: state.filters.minPrice,
        max: state.filters.maxPrice,
        currentPageCategory: state.filters,
        aem: state.aem,
        labels: state.authoredLabels
    };
};

export default connect(mapStateToProps)(SelectedFilters);
