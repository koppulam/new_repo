// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import objectPath from 'object-path';
import { findFirst, addClass } from 'lib/dom/dom-util';
import { currencyFormatter } from 'lib/utils/currency-formatter';
import CustomScrollBar from 'components/common/CustomScrollBar';

import Picture from 'components/common/Picture';
import FC from 'constants/FiltersConstants';

import styleVariables from 'lib/utils/breakpoints';

import {
    getFilterUrlMap,
    getFilterImageConfig,
    isRobotTag,
    updateCanonicalTag
} from 'lib/utils/filters';

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
            typingInMax: false,
            showSubListChildOnHover: false,
            subListInitialClick: false
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
        this.setState({
            min: nextProps.minPrice,
            max: nextProps.maxPrice,
            typingInMin: !nextProps.minPrice,
            typingInMax: !nextProps.maxPrice,
            enableApply: false,
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
     * @description generate image object
     * @param {string} filterId sub filter id
     * @returns {object} returns formated image object
     */
    generateImageObject = (filterId) => {
        const imageObject = getFilterImageConfig(this.props.aem, this.props.endecaDimensionId);
        const urlMap = getFilterUrlMap(filterId);
        const urlUniqueID = urlMap ? urlMap.filterUrlId : '';

        return {
            defaultSrc: imageObject[`${urlUniqueID}`],
            isLazyLoad: true,
            altText: urlUniqueID,
            hiddenOnError: true
        };
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
        const isColor = (this.props.subListItemToShow === endecaDimensionId) && this.props.index === FC.ENDECA_DIMENSIONIDS.GEMSTONECOLOR;
        const isDiamond = (this.props.subListItemToShow === endecaDimensionId) && this.props.index === FC.ENDECA_DIMENSIONIDS.DIAMONSHAPE;
        const isMetal = (this.props.subListItemToShow === endecaDimensionId) && this.props.index === FC.ENDECA_DIMENSIONIDS.MATERIALS;
        const isSettings = (this.props.subListItemToShow === endecaDimensionId) && this.props.index === FC.ENDECA_DIMENSIONIDS.SETTING;

        subListData.sort((subListItem1, sublistItem2) => {
            if (Number(subListItem1.displayOrder) < Number(sublistItem2.displayOrder)) {
                return -1;
            }
            if (Number(subListItem1.displayOrder) > Number(sublistItem2.displayOrder)) {
                return 1;
            }
            return 0;
        });

        // sort designer and collections
        if ((this.props.subListItemToShow === endecaDimensionId) && this.props.index === 2) {
            subListData.sort((subListItem1, sublistItem2) => {
                if (subListItem1.isCollection === sublistItem2.isCollection) {
                    return 0;
                }
                if (subListItem1.isCollection) {
                    return 1;
                }
                return -1;
            });
        }

        return (
            subListData.length > 0 &&
            subListData.map((subList, index) => {
                const imageProperties = this.generateImageObject(subList.id);
                const dimensionValues = isChildDimension ? this.state.childDimensionValues : this.props.subListItems;
                const ariaBoolean = this.props.checkSelectedStatus(dimensionValues, subList.id);
                const ariaNameCount = `${subList.name} ${subList.count}`;
                const ariaName = `${subList.name}`;
                const { showChildDimensionsIndex } = this.state;
                const filterUrl = this.props.getSubListUrl(dimensionValues, subList.id);

                return (
                    (parseInt(this.props.currentPageCategory.catDimensionId, 10) !== parseInt(subList.id, 10)) && subList.count > 0 &&
                    <li
                        className={
                            classNames('sub-list__sub-option',
                                {
                                    'sub-list--selected': this.props.checkSelectedStatus(dimensionValues, subList.id, isChildDimension),
                                    'is-collection': subList.isCollection
                                })
                        }
                        key={subList.id}
                    >
                        <div
                            className={
                                classNames('sub-option__title',
                                    {
                                        'sub-option__title_with-image': (isDiamond || isMetal || isSettings) && (this.props.type === 'BRIDAL') && Object.keys(imageProperties).length
                                    })
                            }
                        >
                            <div
                                role="checkbox"
                                aria-checked={this.props.checkSelectedStatus(dimensionValues, subList.id)}
                                tabIndex={-1}
                                onClick={() => this.props.setFiltersSelection(subList.id, endecaDimensionId, isChildDimension, this.state.childDimensionId)}
                                onKeyPress={() => this.props.setFiltersSelection(subList.id, endecaDimensionId, isChildDimension, this.state.childDimensionId)}
                                className="sub-option__label"
                                aria-label={ariaBoolean ? ariaNameCount : ariaName}
                            >
                                {isColor && this.props.type !== 'BRIDAL' && Object.keys(imageProperties).length ?
                                    <span
                                        className={
                                            classNames('option__label_color',
                                                {
                                                    noimage: imageProperties.defaultSrc
                                                })
                                        }
                                    >
                                        <Picture
                                            {...imageProperties}
                                        />
                                    </span>
                                    : null
                                }
                                {/* eslint-disable-next-line */}
                                <MediaQuery query={styleVariables.desktopTabletAbove}>
                                    <a
                                        aria-hidden="true"
                                        href={filterUrl}
                                        onClick={
                                            (event) => {
                                                event.preventDefault();
                                                if (!isChildDimension && subList.selected && (subList.selected.toLowerCase() === 'no' || subList.selected.toLowerCase() === 'false')) {
                                                    this.setChildDimensions(subList);
                                                    this.setState({
                                                        showChildDimensionsIndex: index,
                                                        childDimensionId: subList.id,
                                                        subListInitialClick: true
                                                    });
                                                } else if (!isChildDimension) {
                                                    this.setChildDimensions({});
                                                    this.setState({
                                                        childDimensionValues: [],
                                                        showChildDimensionsIndex: '',
                                                        childDimensionId: '',
                                                        subListInitialClick: false
                                                    });
                                                }
                                                updateCanonicalTag(filterUrl);
                                            }
                                        }
                                        onMouseEnter={
                                            () => {
                                                if (!isChildDimension && subList.selected && (subList.selected.toLowerCase() === 'yes' || subList.selected.toLowerCase() === 'true')) {
                                                    this.setState({
                                                        showSubListChildOnHover: true,
                                                        childDimensionId: subList.id
                                                    });
                                                    this.setChildDimensions(subList);
                                                }
                                            }
                                        }
                                        onMouseLeave={
                                            () => {
                                                this.setState({
                                                    subListInitialClick: false
                                                });
                                            }
                                        }
                                        rel={isRobotTag(this.props.selectedFilters, subList.id, this.props.groupName, this.props.type, this.props.isCustomFilter) ? 'nofollow noindex' : ''}
                                        tabIndex={0}
                                        className="submenu-link"
                                    >
                                        <span className="submenu-link-content" tabIndex={-1}>
                                            {subList.name}
                                        </span>
                                        <span aria-label={subList.count} className="sub-option__product-count">
                                            (
                                            {subList.count}
                                            )
                                        </span>
                                    </a>
                                </MediaQuery>
                                <MediaQuery query={styleVariables.belowDesktopTablet}>
                                    <a
                                        href={filterUrl}
                                        onClick={
                                            (event) => {
                                                event.preventDefault();
                                                if (!isChildDimension && subList.selected && (subList.selected.toLowerCase() === 'no' || subList.selected.toLowerCase() === 'false')) {
                                                    this.setState({
                                                        showChildDimensionsIndex: index,
                                                        childDimensionId: subList.id
                                                    });
                                                } else {
                                                    this.setState({ showChildDimensionsIndex: '' });
                                                }
                                                updateCanonicalTag(filterUrl);
                                            }
                                        }
                                        rel={isRobotTag(this.props.selectedFilters, subList.id, this.props.groupName, this.props.type, this.props.isCustomFilter) ? 'nofollow noindex' : ''}
                                        className="cta"
                                        tabIndex={0}
                                    >
                                        <span className="cta-content" tabIndex={-1}>
                                            {subList.name}
                                        </span>
                                    </a>
                                    <span aria-label={subList.count} className="sub-option__product-count">
                                        (
                                        {subList.count}
                                        )
                                    </span>
                                </MediaQuery>

                                {(this.props.subListItemToShow === endecaDimensionId && this.props.index !== 14) ?
                                    <span className="sub-option__checkbox--active" />
                                    : null
                                }
                                {(isDiamond || isMetal || isSettings) && (this.props.type === 'BRIDAL') && imageProperties.defaultSrc && Object.keys(imageProperties).length ?
                                    <span
                                        className="sub-option__label_image noimage"
                                    >
                                        <Picture
                                            customClass={isDiamond ? 'diamond' : ''}
                                            {...imageProperties}
                                        />
                                    </span>
                                    : null
                                }
                            </div>

                            {
                                subList.childDimensionValues && subList.childDimensionValues.length &&
                                <button type="button" onClick={() => this.toggleChildDimension(index)} className="child-dimensions__toggle">
                                    <span className={
                                        classNames({
                                            'icon-Down': showChildDimensionsIndex !== index,
                                            'icon-Up': showChildDimensionsIndex === index
                                        })
                                    }
                                    />
                                </button>
                            }
                        </div>
                        <MediaQuery query={styleVariables.belowDesktopTablet}>
                            {
                                subList.childDimensionValues && subList.childDimensionValues.length &&
                                this.props.subListItemToShow === endecaDimensionId &&
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
                                                    onClick={() => this.props.setFiltersSelection(childDimension.id, endecaDimensionId, true, subList.id)}
                                                    onKeyPress={() => this.props.setFiltersSelection(childDimension.id, endecaDimensionId, true, subList.id)}
                                                    aria-label={childDimension.name}
                                                >
                                                    <label
                                                        className="child-dimensions__list_label"
                                                        htmlFor={childDimension.id}
                                                    >
                                                        {/* eslint-disable-next-line */}
                                                        <a
                                                            aria-hidden="true"
                                                            href={this.props.getSubListUrl(subList.childDimensionValues, childDimension.id)}
                                                            onClick={(event) => event.preventDefault()}
                                                            // {...hoverProps}
                                                            rel={isRobotTag(this.props.selectedFilters, childDimension.id, this.props.groupName, this.props.type, this.props.isCustomFilter) ? 'nofollow noindex' : ''}
                                                        >
                                                            {childDimension.name}
                                                        </a>
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
                        <div className="main-option__custom-prices_range-wrapper_input material-input">
                            <input
                                type="text"
                                name="min"
                                id="min"
                                value={minVal}
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
            subListItems // dimensionValues
        } = this.props;
        const filtersContainer = findFirst('.filters-component__body');
        const showSublist = this.state.childDimensionValues &&
            this.state.childDimensionValues.length > 0 &&
            this.props.subListItemToShow === this.props.endecaDimensionId && (this.props.showSubListChild || this.state.showSubListChildOnHover || this.state.subListInitialClick);

        if (showSublist && subListItems.length > 8) {
            addClass(filtersContainer, 'two-col-child');
        }

        return (
            <React.Fragment>
                <ul
                    ref={this.filtersContainer}
                    className={
                        classNames('main-option__sub-list',
                            {
                                'sub-list--show': subListItemToShow === index,
                                'sub-list--hide': subListItemToShow !== index,
                                'sub-list__price_container_list': endecaDimensionId === 4
                            })
                    }
                >
                    {this.renderFilterSubList(subListItems)}
                    <li className="price-container">
                        {(subListItemToShow === endecaDimensionId && index === 4)
                            ? this.renderCustomPrices()
                            : null
                        }
                    </li>
                </ul>
                {
                    showSublist &&
                    <ul
                        style={{ display: 'none', ...this.getItemStyles() }}
                        className={
                            classNames('main-option__sub-list_child',
                                {
                                    'category--two-column sub-list--show': endecaDimensionId === 1 && subListItems.length > 8
                                })
                        }
                    >
                        {showSublist.length > 8 ?
                            <CustomScrollBar iosEnable>
                                {this.renderFilterSubList(this.state.childDimensionValues, true)}
                            </CustomScrollBar> :
                            this.renderFilterSubList(this.state.childDimensionValues, true)
                        }
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
    getSubListUrl: PropTypes.func.isRequired,
    checkSelectedStatus: PropTypes.func.isRequired,
    handleFilterSelection: PropTypes.func.isRequired,
    selectedFilters: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
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
    showSubListChild: PropTypes.bool.isRequired,
    groupName: PropTypes.any.isRequired,
    isCustomFilter: PropTypes.bool,
    toggleMobileFilter: PropTypes.func.isRequired
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
        selectedFilters: state.filters.selectedFilters,
        type: state.filters.type,
        minPrice: state.filters.minPrice,
        maxPrice: state.filters.maxPrice,
        aem: state.aem,
        authoredLabels: state.authoredLabels,
        currentPageCategory: state.filters
    };
};

export default connect(mapStateToProps)(FiltersSubMenu);
