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
import FC from 'constants/FiltersConstants';
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

                            if (endecaDimensionId === FC.ENDECA_DIMENSIONIDS.DESIGNERS_COLLECTIONS && subfilter.isCollection) {
                                subFilterObj.isChild = true;
                            }
                        }
                        if (subfilter.childDimensionValues) {
                            const filteredChild = subfilter.childDimensionValues.filter(childDim => parseInt(childDim.id, 10) === parsedFilterDimension);

                            if (filteredChild && filteredChild.length > 0) {
                                subFilterObj.selectedFilterName = filteredChild[0].name;
                                subFilterObj.endecaDimensionId = endecaDimensionId;
                                subFilterObj.isChild = true;
                                subFilterObj.filterId = subfilter.id;
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
            selectedFiltersList.map((filters) => {
                const subFilterObj = this.getSubFiltersName(filters.filterDimensionId);
                const {
                    selectedFilterName,
                    endecaDimensionId,
                    isChild,
                    filterId
                } = subFilterObj;
                const selectedFilterId = isChild ? filterId : filters.filterDimensionId;

                return (
                    ((filters && parseInt(filters.filterDimensionId, 10) === parseInt(this.props.currentPageCategory.catDimensionId, 10)) || selectedFilterName === '')
                        ? null :
                        <div
                            key={filters.filterDimensionId}
                            className="selected-filters__list-title"
                        >
                            <button
                                type="button"
                                aria-label={`${objectPath.get(window, 'tiffany.labels.removeFilterLabel', 'Remove Filter')} ${selectedFilterName}`}
                                className="icon-Close selected-filters__list-title--close"
                                onClick={() => this.props.setFiltersSelection(filters.filterDimensionId, endecaDimensionId, isChild, selectedFilterId)}
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
        return (isCustomFilter && (min || max)) ?
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
        const clearCtaText = objectPath.get(window, 'tiffany.labels.clearCtaText', 'Clear All');
        const {
            selectedFiltersList,
            showSubMenu,
            mobileFilter,
            toggleMobileFilter,
            isCustomFilter,
            type
        } = this.props;
        const { belowDesktopTablet, desktopTabletAbove } = styleVariables;
        const settings = {
            dots: false,
            infinite: false,
            speed: 600,
            slidesToScroll: 1,
            swipeToSlide: false,
            initialSlide: 0,
            arrows: true,
            variableWidth: true,
            useTransform: false,
            noRightPadding: true,
            accessibility: false,
            enableAriaHidden: false,
            nextArrow: <SlickArrow isleftArrow={false} />,
            prevArrow: <SlickArrow isleftArrow />
        };
        const isBrowseGridFilter = selectedFiltersList.length === 1 &&
            parseInt(selectedFiltersList[0].filterDimensionId, 10) === parseInt(this.props.currentPageCategory.catDimensionId, 10) && !isCustomFilter;
        const h1Toggle = objectPath.get(window.tiffany.authoredContent, 'engagementConfig.h1Toggle', '');
        const heroBannerCheck = h1Toggle.toUpperCase() === 'FILTER_TEXT';
        const coreH1Toggle = objectPath.get(window.tiffany.authoredContent, 'browseConfig.h1Toggle', '');
        const coreHeroBannerCheck = coreH1Toggle === 'FILTER_TEXT';
        const showBrowseHeading = type === 'BRIDAL' && this.props.aem.engagementConfig.showBrowseHeading && heroBannerCheck;
        const showCoreBrowseHeading = type === 'BROWSE' && this.props.aem.browseConfig.showBrowseHeading && coreHeroBannerCheck;
        const selectedFiltersShown = (showSubMenu || mobileFilter) || false;
        const doneTxt = objectPath.get(window.tiffany, 'labels.doneText', '');

        return (
            <div
                className={
                    classNames('selected-filters',
                        {
                            'selected-filters--show': showSubMenu || mobileFilter,
                            'selected-filters--outside-overlay': !showSubMenu,
                            'selected-filters--hide-mobile': (selectedFiltersList.length <= 0 && !isCustomFilter) || isBrowseGridFilter
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
                                        'clear-btn--hide': (!isCustomFilter && selectedFiltersList.length <= 0) || isBrowseGridFilter
                                    })
                            }
                            aria-label={clearCtaText}
                            onClick={() => this.props.setFiltersSelection('clear')}
                        >
                            {clearCtaText}
                        </button>
                        <div className="selected-filters__container_list-item">
                            <CustomScrollBar iosEnable>
                                {this.props.currentPageCategory.products.length > 0 &&
                                    <span className="grid-page__pagination">
                                        {/* eslint-disable-next-line */}
                                        <span>{objectPath.get(this.props.labels, 'showingLabel.preText', '')} 1 {objectPath.get(this.props, 'labels.hyphen', '-')} {this.props.currentPageCategory.productsLength} {objectPath.get(this.props, 'labels.showingLabel.postText', '')} {this.props.currentPageCategory.total} </span>
                                        {
                                            showBrowseHeading &&
                                            <h1 className="browse-grid-heading">{this.props.browseHeading}</h1>
                                        }
                                        {
                                            showCoreBrowseHeading &&
                                            <h1 className="browse-grid-heading">{this.props.browseHeading}</h1>
                                        }
                                    </span>
                                }
                                {!selectedFiltersShown &&
                                    <div className="selected-filters__container_list-item_container">
                                        <MediaQuery query={desktopTabletAbove}>
                                            <Slider {...settings}>
                                                {this.renderSelectedFiltersList(selectedFiltersList)}
                                                {this.renderCustomFilterList()}
                                            </Slider>
                                        </MediaQuery>
                                        <MediaQuery query={belowDesktopTablet}>
                                            {this.renderSelectedFiltersList(selectedFiltersList)}
                                            {this.renderCustomFilterList()}
                                        </MediaQuery>
                                    </div>
                                }
                                {selectedFiltersShown &&
                                    <div>
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
    currentPageCategory: PropTypes.any,
    labels: PropTypes.any.isRequired,
    browseHeading: PropTypes.string.isRequired,
    aem: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired
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
        labels: state.authoredLabels,
        aem: state.aem,
        browseHeading: state.filters.browseHeading
    };
};

export default connect(mapStateToProps)(SelectedFilters);
