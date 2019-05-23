// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import objectPath from 'object-path';
import { findFirst } from 'lib/dom/dom-util';
import { currencyFormatter } from 'lib/utils/currency-formatter';

import Picture from 'components/common/Picture';

import styleVariables from 'lib/utils/breakpoints';

import { getFilterUrlMap } from 'lib/utils/filters';

import Themes from './Themes';


/**
 * Filters submenu Component
 */
class FiltersSubMenu extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            childDimensionValues: [],
            showChildDimensionsIndex: '',
            enableApply: false,
            childDimensionId: '',
            min: this.props.minPrice,
            max: this.props.maxPrice,
            typingInMin: false,
            typingInMax: false
        };
        this.filtersContainer = React.createRef();
    }

    /**
     * @param {Object} nextProps next props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        const { childDimensionId } = this.state;
        let childArray = [];

        if (childDimensionId) {
            const sublist = nextProps.subListItems;

            if (sublist && sublist.length) {
                sublist.forEach((list) => {
                    if (parseInt(list.id, 10) === parseInt(childDimensionId, 10) && list.childDimensionValues) {
                        childArray = list.childDimensionValues;
                    }
                });
            }
        }
        if (nextProps.minPrice !== this.props.minPrice || nextProps.maxPrice !== this.props.maxPrice) {
            this.setState({
                min: nextProps.minPrice,
                max: nextProps.maxPrice,
                typingInMin: !nextProps.minPrice,
                typingInMax: !nextProps.maxPrice,
                enableApply: nextProps.minPrice && nextProps.maxPrice
            });
        }
        this.setState({
            childDimensionValues: childArray
        });
    }

    /**
     * Set child dimensions on hover or focus
     * @param {Object} subList hovered sub list
     * @returns {void}
     */
    setChildDimensions = (subList) => {
        let subfilterValues = [];

        if (subList.childDimensionValues) {
            subfilterValues = subList.childDimensionValues;
        }

        this.setState({
            childDimensionValues: subfilterValues
        });
    }

    /**
     * handle custom filter selection
     * @param {object} event object
     * @returns {object} - return object
     */
    getCustomPriceValues = () => {
        return {
            min: findFirst('input[name="min"]').value.replace(/\D/g, ''),
            max: findFirst('input[name="max"]').value.replace(/\D/g, '')
        };
    }

    /**
     * handle custom filter selection
     * @param {object} event object
     * @returns {object} - return object
     */
    handleFilterOnEnter = (event) => {
        if (event.key === 'Enter') {
            this.handleFilterSelection(event);
        }
    }

    /**
     * handle custom filter selection
     * @param {object} event object
     * @returns {object} - return object
     */
    handleFilterSelection = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (this.state.min || this.state.max) {
            this.props.handleFilterSelection({
                min: this.state.min,
                max: this.state.max
            });
        }
        this.props.toggleMobileFilter();
    }

    /**
     * handle input validation
     * @param {object} event object
     * @returns {*} prevent action
     */
    handleInputValidation = (event) => {
        const charCode = (event.which) ? event.which : event.keyCode;

        if (!(charCode === 13 || charCode === 46 || charCode === 36 || (charCode > 47 && charCode < 58))) {
            event.preventDefault();
        }
    }

    /**
     * @description Will enable / disable apply button
     * @param {string} inputIdentifier input identifier
     * @returns {void}
     */
    handleEnableApply = (inputIdentifier) => {
        const customFields = this.getCustomPriceValues();

        this.setState((state) => {
            return {
                enableApply: customFields.min && customFields.max,
                min: inputIdentifier === 'min' ? customFields.min : this.state.min,
                max: inputIdentifier === 'max' ? customFields.max : this.state.max
            };
        });
    }

    /**
     * @description Method to toggle state variable, determines to show formatted value or not
     * @param {String} inputIdentifier Identifier to check which input is being used currently
     * @param {string} type type of event
     * @returns {void}
     */
    togglePriceFormat = (inputIdentifier, type) => {
        if (inputIdentifier === 'min') {
            this.setState((state) => {
                return { typingInMin: type === 'focus' };
            });
        } else if (inputIdentifier === 'max') {
            this.setState((state) => {
                return { typingInMax: type === 'focus' };
            });
        }
    }

    /**
     * @description return styles from current offset
     * @returns {*} object
     */
    getItemStyles = () => {
        const isDesktop = window.matchMedia(styleVariables.desktopTabletAbove).matches;

        if (isDesktop && this.filtersContainer && this.filtersContainer.current) {
            const options = this.filtersContainer.current.getElementsByClassName('sub-list__sub-option');
            const offsetLeft = options[options.length - 1].getBoundingClientRect().left;

            if (!offsetLeft) {
                return {
                    visibility: 'hidden'
                };
            }
            return {
                left: `${8 + offsetLeft}px`,
                display: 'block'
            };
        }
        return {
            display: 'none'
        };
    }

    /**
     * @returns {void}
     * @param {Object} index of sub filter
     */
    toggleChildDimension(index) {
        let indexToSet = '';

        if (this.state.showChildDimensionsIndex !== index) {
            indexToSet = index;
        }

        this.setState({
            showChildDimensionsIndex: indexToSet
        });
    }

    /**
     * @param {*} subListData filter subList
     * @param {*} isChildDimension isChldDimension
     * @returns {object} html structure
     */
    renderFilterSubList = (subListData, isChildDimension) => {
        const { endecaDimensionId } = this.props;
        const isTheme = endecaDimensionId === 1;
        const themeConfig = objectPath.get(this.props.aem, 'byoThemeFilterConfig', false);

        subListData.sort((subListItem1, sublistItem2) => {
            if (Number(subListItem1.displayOrder) < Number(sublistItem2.displayOrder)) {
                return -1;
            }
            if (Number(subListItem1.displayOrder) > Number(sublistItem2.displayOrder)) {
                return 1;
            }
            return 0;
        });
        return (
            subListData.length > 0 &&
            subListData.map((subList, index) => {
                const colorImageRelPath = objectPath.get(this.props.aem, 'color.path', '/');
                const colorImageExtension = objectPath.get(this.props.aem, 'color.extension', 'png');
                const colorAltText = objectPath.get(this.props.aem, 'color.altText', 'Color Image');
                const urlMap = getFilterUrlMap(subList.id);
                const urlUniqueID = urlMap ? urlMap.filterUrlId : '';

                const colorImageProperties = {
                    defaultSrc: `${colorImageRelPath}/${urlUniqueID}.${colorImageExtension}`,
                    isLazyLoad: true,
                    altText: colorAltText,
                    hiddenOnError: true
                };
                const dimensionValues = isChildDimension ? this.state.childDimensionValues : this.props.subListItems;
                const ariaBoolean = this.props.checkSelectedStatus(dimensionValues, subList.id);
                const ariaNameCount = `${subList.name} ${subList.count}`;
                const ariaName = `${subList.name}`;
                const { showChildDimensionsIndex } = this.state;

                return (
                    (parseInt(this.props.currentPageCategory.catDimensionId, 10) !== parseInt(subList.id, 10)) && subList.count > 0 &&
                    <li
                        className={
                            classNames('sub-list__sub-option',
                                {
                                    'sub-list--selected': this.props.checkSelectedStatus(dimensionValues, subList.id, isChildDimension)
                                })
                        }
                        key={subList.id}
                    >
                        <div
                            className="sub-option__title"
                        >
                            <div
                                role="checkbox"
                                aria-checked={this.props.checkSelectedStatus(dimensionValues, subList.id)}
                                tabIndex={-1}
                                onClick={() => this.props.setFiltersSelection(subList.id, endecaDimensionId, isTheme, themeConfig.id)}
                                onKeyPress={() => this.props.setFiltersSelection(subList.id, endecaDimensionId, isTheme, themeConfig.id)}
                                className="sub-option__label"
                                aria-label={ariaBoolean ? ariaNameCount : `${ariaName} ${ariaNameCount}`}
                            >
                                {(this.props.subListItemToShow === endecaDimensionId && this.props.index === 14) ?
                                    <span
                                        className={
                                            classNames('sub-option__label_color',
                                                {
                                                    noimage: colorImageProperties.defaultSrc
                                                })
                                        }
                                    >
                                        <Picture
                                            defaultSrc={colorImageProperties.defaultSrc}
                                            isLazyLoad={colorImageProperties.isLazyLoad}
                                            altText={colorImageProperties.altText}
                                            hiddenOnError={colorImageProperties.hiddenOnError}
                                        />
                                    </span>
                                    : null
                                }
                                {/* eslint-disable-next-line */}
                                <MediaQuery query={styleVariables.desktopTabletAbove}>
                                    <button
                                        type="button"
                                        aria-hidden="true"
                                        className="sub-option__label--text"
                                        onClick={
                                            (event) => {
                                                event.preventDefault();
                                                if (!isChildDimension && subList.selected && (subList.selected.toLowerCase() === 'no' || subList.selected.toLowerCase() === 'false')) {
                                                    this.setChildDimensions(subList);
                                                    this.setState({
                                                        showChildDimensionsIndex: index,
                                                        childDimensionId: subList.id
                                                    });
                                                } else if (!isChildDimension) {
                                                    this.setChildDimensions({});
                                                    this.setState({
                                                        childDimensionValues: [],
                                                        showChildDimensionsIndex: '',
                                                        childDimensionId: ''
                                                    });
                                                }
                                            }
                                        }
                                        onMouseEnter={
                                            () => {
                                                if (!isChildDimension && subList.selected && (subList.selected.toLowerCase() === 'yes' || subList.selected.toLowerCase() === 'true')) {
                                                    this.setChildDimensions(subList);
                                                }
                                            }
                                        }
                                        rel=""
                                        tabIndex={0}
                                    >
                                        <span className="submenu-link-content" tabIndex={-1}>
                                            {subList.name}
                                        </span>
                                    </button>
                                </MediaQuery>
                                <MediaQuery query={styleVariables.belowDesktopTablet}>
                                    <button
                                        type="button"
                                        className="sub-option__label--text"
                                        onClick={
                                            (event) => {
                                                event.preventDefault();
                                                if (!isChildDimension && subList.selected && (subList.selected.toLowerCase() === 'no' || subList.selected.toLowerCase() === 'false')) {
                                                    this.setState({ showChildDimensionsIndex: index });
                                                } else {
                                                    this.setState({ showChildDimensionsIndex: '' });
                                                }
                                            }
                                        }
                                        rel=""
                                        tabIndex={0}
                                    >
                                        <span className="cta-content" tabIndex={-1}>
                                            {subList.name}
                                        </span>
                                    </button>
                                </MediaQuery>

                                <span className="sub-option__product-count">
                                    (
                                    {subList.count}
                                    )
                                </span>
                                {(this.props.subListItemToShow === this.props.endecaDimensionId && this.props.index !== 14) ?
                                    <span className="sub-option__checkbox--active" />
                                    : null
                                }
                            </div>

                            {
                                subList.childDimensionValues && subList.childDimensionValues.length &&
                                <button type="button" onClick={() => this.toggleChildDimension(index)} className="child-dimensions__toggle">
                                    <span className={
                                        classNames({
                                            'icon-Up': showChildDimensionsIndex !== index,
                                            'icon-Down': showChildDimensionsIndex === index
                                        })
                                    }
                                    />
                                </button>
                            }
                        </div>
                        <MediaQuery query={styleVariables.belowDesktopTablet}>
                            {
                                subList.childDimensionValues && subList.childDimensionValues.length &&
                                this.props.subListItemToShow === this.props.endecaDimensionId &&
                                showChildDimensionsIndex === index &&
                                <ul className="child-dimensions__list">
                                    {
                                        subList.childDimensionValues.map((childDimension) => (
                                            <li
                                                key={childDimension.id}
                                                className={
                                                    classNames('child-dimensions__list_option',
                                                        {
                                                            selected: this.props.checkSelectedStatus(subList.childDimensionValues, childDimension.id)
                                                        })
                                                }
                                            >
                                                <div
                                                    className="child-dimensions__list_wrap"
                                                    role="checkbox"
                                                    aria-checked={this.props.checkSelectedStatus(subList.childDimensionValues, childDimension.id)}
                                                    tabIndex={0}
                                                    onClick={() => this.props.setFiltersSelection(childDimension.id, endecaDimensionId)}
                                                    onKeyPress={() => this.props.setFiltersSelection(childDimension.id, endecaDimensionId)}
                                                    aria-label={childDimension.name}
                                                >
                                                    <label
                                                        className="child-dimensions__list_label"
                                                        htmlFor={childDimension.id}
                                                    >
                                                        {/* eslint-disable-next-line */}
                                                        <button
                                                            type="button"
                                                            aria-hidden="true"
                                                            onClick={(event) => event.preventDefault()}
                                                            // {...hoverProps}
                                                            rel="nofollow noindex"
                                                        >
                                                            {childDimension.name}
                                                        </button>
                                                        <span className="child-dimensions__list_count">
                                                            (
                                                            {childDimension.count}
                                                            )
                                                        </span>
                                                        <span className="child-dimensions__list_checkbox--active" />
                                                    </label>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            }
                        </MediaQuery>
                    </li>
                );
            })
        );
    }

    /**
     * render custom prices section
     * @returns {*} html content
     */
    renderCustomPrices = () => {
        let minVal = '';

        if (this.state.typingInMin) {
            if (this.props.isCustomFilter && this.state.min === '') {
                minVal = 0;
            } else {
                minVal = this.state.min;
            }
        } else {
            minVal = currencyFormatter(this.state.min);
        }
        return (
            <React.Fragment>
                <p className="custom-price-ada" id="custom-price-label-group">{objectPath.get(this.props.authoredLabels, 'customPriceLabel', 'Custom prices')}</p>
                <form className="main-option__custom-prices">
                    <MediaQuery query={styleVariables.desktopTabletAbove}>
                        <p className="desc">{objectPath.get(window, 'tiffany.labels.customPriceDesc', 'Custom price range lorem ipsum for ADA compliance.')}</p>
                    </MediaQuery>
                    <div className="main-option__custom-prices_inputs" role="group" aria-labelledby="custom-price-label-group">
                        <span
                            className={
                                classNames('main-option--active',
                                    {
                                        'active-state--show': (this.state.min || this.state.max)
                                    })
                            }
                        />
                        <div className="main-option__custom-prices_range-wrapper_input material-input">
                            <input
                                type="text"
                                name="min"
                                id="min"
                                value={minVal}
                                aria-label={`${objectPath.get(window, 'tiffany.labels.customPriceMinAriaLabel', 'Min')}`}
                                onKeyPress={this.handleInputValidation}
                                onChange={() => { this.handleEnableApply('min'); }}
                                onFocus={() => { this.togglePriceFormat('min', 'focus'); }}
                                onBlur={() => { this.togglePriceFormat('min'); }}
                                autoComplete="off"
                            />
                            <label
                                htmlFor="min"
                                className={classNames({
                                    active: this.state.min === 0 || (this.state.min === '' && this.props.isCustomFilter) || this.state.min
                                })}
                            >
                                {`${objectPath.get(window, 'tiffany.labels.customPriceMin', '$min')}`}
                            </label>
                        </div>
                        <span className="custom-label">
                            {objectPath.get(window, 'tiffany.labels.customPriceTo', 'to Price')}
                        </span>
                        <div className="main-option__custom-prices_range-wrapper_input material-input">
                            <input
                                type="text"
                                name="max"
                                id="max"
                                value={this.state.typingInMax ? this.state.max : currencyFormatter(this.state.max)}
                                aria-label={`${objectPath.get(window, 'tiffany.labels.customPriceMaxAriaLabel', 'Max')}`}
                                onKeyPress={this.handleInputValidation}
                                onChange={() => { this.handleEnableApply('max'); }}
                                onFocus={() => { this.togglePriceFormat('max', 'focus'); }}
                                onBlur={() => { this.togglePriceFormat('max'); }}
                                autoComplete="off"
                            />
                            <label
                                htmlFor="max"
                                className={classNames({
                                    active: this.state.max
                                })}
                            >
                                {`${objectPath.get(window, 'tiffany.labels.customPriceMax', '$max')}`}
                            </label>
                        </div>
                    </div>
                    <button
                        disabled={!this.state.enableApply}
                        type="submit"
                        className="main-option__custom-prices_submit"
                        onClick={this.handleFilterSelection}
                        onKeyPress={this.handleFilterOnEnter}
                    >
                        <span>{objectPath.get(window, 'tiffany.labels.customPriceApply', 'Apply')}</span>
                    </button>
                </form>
            </React.Fragment>
        );
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            subListItemToShow,
            index,
            endecaDimensionId,
            subListItems,
            aem
        } = this.props;
        const isDesktop = window.matchMedia(styleVariables.desktopTabletAbove).matches;
        const themeConfig = objectPath.get(aem, 'byoThemeFilterConfig', false);

        return (
            <React.Fragment>
                <ul
                    ref={this.filtersContainer}
                    className={
                        classNames('main-option__sub-list',
                            {
                                'sub-list--show': subListItemToShow === index,
                                'sub-list--hide': subListItemToShow !== index,
                                'sub-list__price_container_list': endecaDimensionId === 4,
                                'sub-list__themes_container_list': endecaDimensionId === 1
                            })
                    }
                >
                    {
                        (endecaDimensionId === 1 && isDesktop) ?
                            <Themes
                                checkSelectedStatus={this.props.checkSelectedStatus}
                                filtersData={subListItems}
                                subListItemToShow={this.props.subListItemToShow}
                                setFiltersSelection={(filterId) => this.props.setFiltersSelection(filterId, endecaDimensionId, true, themeConfig.id)}
                            />
                            :
                            this.renderFilterSubList(subListItems)
                    }
                    <li className="price-container">
                        {(subListItemToShow === endecaDimensionId && index === 4)
                            ? this.renderCustomPrices()
                            : null
                        }
                    </li>
                </ul>
                {
                    this.state.childDimensionValues &&
                    this.state.childDimensionValues.length > 0 &&
                    this.props.subListItemToShow === endecaDimensionId &&
                    <ul
                        style={{ display: 'none', ...this.getItemStyles() }}
                        className="main-option__sub-list_child"
                    >
                        {this.renderFilterSubList(this.state.childDimensionValues, true)}
                    </ul>
                }
            </React.Fragment>
        );
    }
}

FiltersSubMenu.propTypes = {
    subListItemToShow: PropTypes.any,
    setFiltersSelection: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    endecaDimensionId: PropTypes.number.isRequired,
    subListItems: PropTypes.array.isRequired,
    checkSelectedStatus: PropTypes.func.isRequired,
    handleFilterSelection: PropTypes.func.isRequired,
    minPrice: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    maxPrice: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    aem: PropTypes.any.isRequired,
    authoredLabels: PropTypes.any.isRequired,
    currentPageCategory: PropTypes.any,
    toggleMobileFilter: PropTypes.func.isRequired,
    isCustomFilter: PropTypes.bool
};

FiltersSubMenu.defaultProps = {
    subListItemToShow: '',
    minPrice: '',
    maxPrice: '',
    currentPageCategory: {},
    isCustomFilter: false
};

const mapStateToProps = (state) => {
    return {
        minPrice: state.filters.minPrice,
        maxPrice: state.filters.maxPrice,
        aem: state.aem,
        authoredLabels: state.authoredLabels,
        currentPageCategory: state.filters
    };
};

export default connect(mapStateToProps)(FiltersSubMenu);
