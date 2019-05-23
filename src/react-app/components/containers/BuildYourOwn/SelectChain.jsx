// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import classNames from 'classnames';
import Slider from 'react-slick';
import MediaQuery from 'react-responsive';
import { getSelectedMaterialProducts, chainAvailability } from 'actions/BYOActions';
import styleVariables from 'lib/utils/breakpoints';
import Picture from 'components/common/Picture';
import { currencyFormatter } from 'lib/utils/currency-formatter';
import intersection from 'lodash/intersection';
import CustomScrollBar from 'components/common/CustomScrollBar';
import ByoTile from './ByoTile';

/**
 * Select Chain Modal
 */
class SelectChain extends React.Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        const selectedMaterialsRequest = objectPath.get(window, 'tiffany.authoredContent.byoConfig.selectMaterialRequest', []);
        const braceletId = objectPath.get(window, 'tiffany.authoredContent.byoConfig.braceletCategoryId', false);
        let braceletTabIndex = 0;
        let necklaceTabIndex = 1;

        if (selectedMaterialsRequest.length > 1) {
            const categoryids = selectedMaterialsRequest.map(a => (objectPath.get(a, 'request.payload.categoryid', '')));

            if (categoryids.length > 0 && categoryids[0].toString() === braceletId) {
                braceletTabIndex = 0;
                necklaceTabIndex = 1;
            } else {
                braceletTabIndex = 1;
                necklaceTabIndex = 0;
            }
        }
        this.state = {
            selectMaterialConfig: objectPath.get(window, 'tiffany.authoredContent.byoConfig.selectMaterialRequest', []),
            selectedIndex: (objectPath.get(window, 'tiffany.authoredContent.byoConfig.selectMaterialRequest', []).length > 1 && !this.props.byo.selectedFixture.isSilhouette && !this.props.byo.isBracelet) ? necklaceTabIndex : braceletTabIndex,
            productData: this.props.byo.selectedFixture,
            chainType: true,
            chainSize: false,
            selectedFilter: -1,
            sizeSelectedIndex: null
        };
    }

    /**
     * Lifcycle hook
     * @returns {void}
     */
    componentDidMount() {
        const request = JSON.parse((JSON.stringify(objectPath.get(window, `tiffany.authoredContent.byoConfig.selectMaterialRequest.${this.state.selectedIndex}.request`, false))));

        if (request) {
            this.dispatchActionsForSelection(request, this.state.selectedIndex, false);
        }
    }

    /**
     * @param {Number} id filter id
     * @returns {object} html structure
     */
    setFiltersSelection = (id) => {
        const request = JSON.parse((JSON.stringify(objectPath.get(window, `tiffany.authoredContent.byoConfig.selectMaterialRequest.${this.state.selectedIndex}.request`, false))));

        if (request) {
            if (id) {
                request.payload.navigationFilters.push(id);
            }
            this.dispatchActionsForSelection(request, this.state.selectedIndex, true);
        }
    }

    /**
     * @param {object} size selected size data
     * @param {Number} index size index
     * @returns {object} html structure
     */
    setSizeSelection = (size, index) => {
        const { productData } = this.state;

        productData.sizes = size;
        productData.fixtureDetails.shortDescription = objectPath.get(size, 'shortDescription', objectPath.get(productData, 'fixtureDetails.shortDescription', ''));
        this.setState({ sizeSelectedIndex: index });
        this.props.updateChain(productData);
    }

    /**
     * @param {object} productData productData
     * @returns {void}
     */
    updateChain = (productData) => {
        this.setState({
            productData,
            chainType: false
        }, () => {
            const productDetails = this.state.productData;

            if (objectPath.get(this.state.productData, 'productDetails.0.groupItems', false)) {
                this.setState({ chainSize: true });
            }
            productDetails.sizes = {};
            this.props.updateChain(productDetails);
            this.setState({ sizeSelectedIndex: null });
        });
    }

    /**
     * @description no chain selection
     * @returns {void}
     */
    noChainSelect = () => {
        const productDetails = {};

        productDetails.fixtureDetails = this.props.byo.silhoutteConst;
        this.setState({
            chainSize: false, productData: {}, sizeSelectedIndex: null, chainType: false
        });
        productDetails.sizes = {};
        this.props.updateChain(productDetails);
    }

    /**
     * @description Dispatch actions for selected chain
     * @param {object} request selected payload
     * @param {Number} index selected index
     * @param {Boolean} isFilterSelection selected filter
     * @returns {void}
     */
    dispatchActionsForSelection = (request, index, isFilterSelection) => {
        const charmsOnFix = this.props.byo.charmsOnFixture || {};
        const charmsOnTray = this.props.byo.charmsTray || [];
        let commonMountTypes = [];

        Object.keys(charmsOnFix).forEach((i) => {
            commonMountTypes.push(charmsOnFix[i].mountTypes || []);
        });
        charmsOnTray.forEach((i) => {
            commonMountTypes.push(i.mountTypes || []);
        });
        commonMountTypes = intersection(...commonMountTypes);
        if (commonMountTypes.length === 0 && (Object.keys(charmsOnFix).length > 0 || charmsOnTray.length > 0)) {
            this.props.dispatch(chainAvailability(false));
            return;
        }
        this.props.dispatch(chainAvailability(true));
        request.payload.ByoMountTypeList = commonMountTypes;
        this.props.dispatch(getSelectedMaterialProducts(request, index, isFilterSelection));
        this.setState({
            selectedIndex: index,
            selectedFilter: isFilterSelection ? this.state.selectedFilter : -1
        });
        if (this.selecMaterial) {
            this.selecMaterial.slickGoTo(0);
        }
    }

    /**
     * @returns {void}
     */
    chainTypeSelect = () => {
        this.setState({ chainType: !this.state.chainType });
    }

    /**
     * @returns {void}
     */
    chainSizeSelect = () => {
        this.setState({ chainSize: !this.state.chainSize });
    }

    /**
     * @param {*} listData filter list
     * @returns {object} html structure
     */
    renderFilterList = (listData) => {
        listData.dimensionValues.sort((subListItem1, sublistItem2) => {
            if (Number(subListItem1.displayOrder) < Number(sublistItem2.displayOrder)) {
                return -1;
            }
            if (Number(subListItem1.displayOrder) > Number(sublistItem2.displayOrder)) {
                return 1;
            }
            return 0;
        });

        return (
            listData.dimensionValues.length > 0 &&
            listData.dimensionValues.map((subList, index) => {
                return (
                    subList.count > 0 &&
                    <li
                        className="select-material__filters_list_option"
                        key={subList.id}
                    >
                        <div
                            role="radio"
                            aria-checked={this.state.selectedFilter === index}
                            tabIndex={0}
                            onClick={() => {
                                this.setFiltersSelection(subList.id);
                                this.setState({ selectedFilter: index });
                            }}
                            onKeyPress={() => {
                                this.setFiltersSelection(subList.id);
                                this.setState({ selectedFilter: index });
                            }}
                            className={
                                classNames('select-material__filters_list_option_label',
                                    {
                                        selected: this.state.selectedFilter === index
                                    })
                            }
                            aria-label={subList.name}
                        >
                            <div className="select-material__filters_list_option_label_title">
                                {subList.name}
                            </div>
                        </div>
                    </li>
                );
            })
        );
    }

    /**
     * @returns {object} Element
     */
    render() {
        const addChainLabel = objectPath.get(this.props.labels.byo, 'addChain', {});
        const settings = {
            dots: false,
            infinite: false,
            variableWidth: true,
            speed: 600,
            slidesToShow: 1.5,
            swipeToSlide: false,
            center: false,
            initialSlide: 0,
            useTransform: false,
            accessibility: false
        };
        const selectMaterialLabels = objectPath.get(window, 'tiffany.labels.byo.selectMaterial', {});
        const selectMaterialLabelsError = objectPath.get(window, 'tiffany.labels.byo.selectMaterial.errorState', {});
        const {
            countLabel,
            filterLabel
        } = selectMaterialLabels;
        const selectedProducts = objectPath.get(this.props.byo, `selectedMaterials.${this.state.selectedIndex}.products`, []);
        const selectedProductsCount = selectedProducts.length;
        const selectedProductLabel = `${countLabel}${selectedProductsCount}`;
        const materialFilters = objectPath.get(this.props.byo, `selectedMaterials.${this.state.selectedIndex}.materialFilters`, {});
        const sizes = this.state.productData.isSilhouette ? false : objectPath.get(this.state.productData, 'productDetails.0.groupItems', false);
        const isSizeLengthEven = sizes && (sizes.length % 2 === 0);

        return (
            <div className="add-chain__content_block">
                <div
                    className={
                        classNames('add-chain__content_box',
                            {
                                opened: this.state.chainType
                            })
                    }
                >
                    <button
                        type="button"
                        className="add-chain__content_type"
                        onClick={this.chainTypeSelect}
                        aria-expanded={!!this.state.chainType}
                        onKeyDown={(e) => {
                            if (e.shiftKey && this.props.addChainCloseRef.current) {
                                this.props.addChainCloseRef.current.focus();
                                e.preventDefault();
                            }
                        }}
                    >
                        {addChainLabel.chainType}
                        {this.state.chainType ?
                            <span>
                                <MediaQuery query={styleVariables.desktopAndAbove}>
                                    <span className="icon-dropdown-down" />
                                </MediaQuery>
                                <MediaQuery query={styleVariables.desktopAndBelow}>
                                    <span className="icon-dropdown-up" />
                                </MediaQuery>
                            </span> :
                            <span>
                                <MediaQuery query={styleVariables.desktopAndAbove}>
                                    <span className="icon-dropdown-right-arrow" />
                                </MediaQuery>
                                <MediaQuery query={styleVariables.desktopAndBelow}>
                                    <span className="icon-dropdown-down" />
                                </MediaQuery>
                            </span>
                        }
                    </button>
                    {this.state.chainType &&
                        <div className="select-material">
                            <div
                                className="select-material__radio-group"
                                role="tablist"
                            >
                                {
                                    this.state.selectMaterialConfig.map((item, index) => {
                                        const isSelected = this.state.selectedIndex === index;

                                        return (
                                            <div
                                                tabIndex="0"
                                                role="tab"
                                                id={`tab${index}`}
                                                aria-selected={isSelected}
                                                className={
                                                    classNames('select-material__radio-group_radio',
                                                        {
                                                            selected: isSelected,
                                                            disabled: !isSelected
                                                        })
                                                }
                                                onClick={() => this.dispatchActionsForSelection(item.request, index, false)}
                                                onKeyPress={() => this.dispatchActionsForSelection(item.request, index, false)}
                                                key={index.toString()}
                                                {...(isSelected && { 'aria-controls': `tab-content${index}` })}
                                            >
                                                {item.label}
                                                {
                                                    (selectedProductsCount > 0 && isSelected) &&
                                                    <span
                                                        className="select-material__radio-group_radio_count"
                                                        aria-label={selectedProductLabel}
                                                    >
                                                        (
                                                        {selectedProductsCount}
                                                        )
                                                    </span>
                                                }
                                            </div>);
                                    })
                                }
                            </div>
                            {Object.keys(materialFilters).length > 0 && !this.props.byo.isSelectedMaterialFailed &&
                                <div className="select-material__filters">
                                    <span id="change-chain-filter-label" className="select-material__filters_label">{filterLabel}</span>
                                    <ul
                                        className="select-material__filters_list"
                                        role="radiogroup"
                                        aria-labelledby="change-chain-filter-label"
                                    >
                                        <CustomScrollBar iosEnable>
                                            <li
                                                className="select-material__filters_list_option"
                                            >
                                                <div
                                                    role="radio"
                                                    aria-checked={this.state.selectedFilter === addChainLabel.allFilter.index}
                                                    tabIndex={0}
                                                    onClick={() => {
                                                        this.setFiltersSelection();
                                                        this.setState({ selectedFilter: addChainLabel.allFilter.index });
                                                    }}
                                                    onKeyPress={() => this.setFiltersSelection()}
                                                    className={
                                                        classNames('select-material__filters_list_option_label',
                                                            {
                                                                selected: this.state.selectedFilter === addChainLabel.allFilter.index
                                                            })
                                                    }
                                                    aria-label={addChainLabel.allFilter.text}
                                                >
                                                    <div className="select-material__filters_list_option_label_title">
                                                        {addChainLabel.allFilter.text}
                                                    </div>
                                                </div>
                                            </li>
                                            {this.renderFilterList(materialFilters[0])}
                                        </CustomScrollBar>
                                    </ul>
                                </div>
                            }
                            {selectedProductsCount > 0 && !this.props.byo.isSelectedMaterialFailed &&
                                <div
                                    role="tabpanel"
                                    aria-labelledby={`tab${this.state.selectedIndex}`}
                                    id={`tab-content${this.state.selectedIndex}`}
                                    className="select-material__tiles"
                                >
                                    <MediaQuery query={styleVariables.desktopAndAbove}>
                                        <Slider className="select-material__carousel" {...settings} ref={c => { this.selecMaterial = c; }}>
                                            {!this.props.byo.selectedFixture.isSilhouette && selectedProducts.length > 0 && this.state.selectedFilter === addChainLabel.allFilter.index &&
                                                <div
                                                    className={
                                                        classNames('select-material__carousel_image',
                                                            {
                                                                'selected-silloute': Object.keys(this.state.productData).length === 0
                                                            })
                                                    }
                                                >
                                                    <div
                                                        className="select-material__carousel_holder"
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={this.noChainSelect}
                                                        onKeyDown={(e) => {
                                                            if ((e.type === 'keydown' && e.key === 'Enter')) {
                                                                this.noChainSelect();
                                                            }
                                                        }}
                                                    >
                                                        <Picture
                                                            sources={[]}
                                                            defaultSrc={this.props.byo.silhoutteConst.image}
                                                            altText={this.props.byo.silhoutteConst.name}
                                                            isLazyLoad={false}
                                                        />
                                                        <div className="select-material__carousel_no-image">
                                                            {addChainLabel.noChainText}
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            {
                                                selectedProducts.map((item, index) => {
                                                    return (
                                                        <div
                                                            className={
                                                                classNames('select-material__carousel_image',
                                                                    {
                                                                        selected: this.state.productData.fixtureDetails && Object.keys(this.state.productData.fixtureDetails).length > 0 ?
                                                                            (this.state.productData.fixtureDetails.sku === item.sku) :
                                                                            (this.state.productData.sku === item.sku)
                                                                    })
                                                            }
                                                            key={index.toString()}
                                                        >
                                                            <ByoTile
                                                                key={index.toString()}
                                                                productProps={item}
                                                                name={item.name}
                                                                image={item.image}
                                                                isNew={item.isNew}
                                                                sku={item.sku}
                                                                price={item.price}
                                                                clickHandler={this.updateChain}
                                                                isMaterial
                                                                isChain
                                                            />
                                                        </div>);
                                                })
                                            }
                                        </Slider>
                                    </MediaQuery>
                                    <MediaQuery query={styleVariables.desktopAndBelow}>
                                        {!this.props.byo.selectedFixture.isSilhouette && selectedProducts.length > 0 && this.state.selectedFilter === addChainLabel.allFilter.index &&
                                            <div
                                                className={
                                                    classNames('select-material__mobile',
                                                        {
                                                            selected: Object.keys(this.state.productData).length === 0
                                                        })
                                                }
                                            >
                                                <div className="select-material__mobile-silloute">
                                                    <Picture
                                                        sources={[]}
                                                        defaultSrc={this.props.byo.silhoutteConst.image}
                                                        altText={this.props.byo.silhoutteConst.name}
                                                        isLazyLoad={false}
                                                        isClickable
                                                        clickHandler={this.noChainSelect}
                                                    />
                                                    <div className="select-material__mobile_no-image">
                                                        {addChainLabel.noChainText}
                                                    </div>
                                                    <div className="select-material__mobile_price">
                                                        {currencyFormatter(Math.floor(this.props.byo.silhoutteConst.price))}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {
                                            selectedProducts.map((item, index) => {
                                                return (
                                                    <div
                                                        key={index.toString()}
                                                        className={
                                                            classNames('select-material__mobile',
                                                                {
                                                                    selected: this.state.productData.fixtureDetails && Object.keys(this.state.productData.fixtureDetails).length > 0 ?
                                                                        (this.state.productData.fixtureDetails.sku === item.sku) :
                                                                        (this.state.productData.sku === item.sku)
                                                                })
                                                        }
                                                    >
                                                        <ByoTile
                                                            key={index.toString()}
                                                            productProps={item}
                                                            name={item.name}
                                                            image={item.image}
                                                            isNew={item.isNew}
                                                            sku={item.sku}
                                                            price={item.price}
                                                            clickHandler={this.updateChain}
                                                            isMaterial
                                                            isChain
                                                        />
                                                    </div>);
                                            })
                                        }
                                    </MediaQuery>
                                </div>
                            }
                            {this.props.byo.isSelectedMaterialFailed &&
                                <div className="select-material__errors">
                                    <p className="select-material__errors_heading">{selectMaterialLabelsError.title}</p>
                                    <p className="select-material__errors_description">{selectMaterialLabelsError.description}</p>
                                    {selectMaterialLabelsError.ctaText &&
                                        <a className="select-material__errors_link cta" href={selectMaterialLabelsError.ctaURL} target={selectMaterialLabelsError.ctaTarget}>
                                            {selectMaterialLabelsError.ctaText}
                                        </a>
                                    }
                                </div>
                            }
                        </div>
                    }
                </div>
                <div className="add-chain__content_box">
                    <button
                        type="button"
                        className={
                            classNames('add-chain__content_size',
                                {
                                    disabled: !sizes || sizes.length === 0
                                })
                        }
                        onClick={() => {
                            if (sizes && sizes.length > 0) {
                                this.chainSizeSelect();
                            }
                        }}
                        aria-expanded={!!this.state.chainSize}
                        disabled={!sizes || sizes.length === 0}
                    >
                        {addChainLabel.chainSize}
                        {this.state.chainSize ?
                            <span>
                                <MediaQuery query={styleVariables.desktopAndAbove}>
                                    <span className="icon-dropdown-down" />
                                </MediaQuery>
                                <MediaQuery query={styleVariables.desktopAndBelow}>
                                    <span className="icon-dropdown-up" />
                                </MediaQuery>
                            </span> :
                            <span>
                                <MediaQuery query={styleVariables.desktopAndAbove}>
                                    <span className="icon-dropdown-right-arrow" />
                                </MediaQuery>
                                <MediaQuery query={styleVariables.desktopAndBelow}>
                                    <span className="icon-dropdown-down" />
                                </MediaQuery>
                            </span>
                        }
                    </button>
                    {this.state.chainSize && sizes.length > 0 &&
                        <div className="add-chain__content_size size-selection">
                            {
                                sizes &&
                                <div
                                    className="select-size__radio-group"
                                    role="radiogroup"
                                    aria-labelledby="modal-heading"
                                >
                                    {
                                        sizes.map((item, index) => (
                                            <div
                                                key={index.toString()}
                                                className={
                                                    classNames('select-size__radio-group_radio',
                                                        {
                                                            selected: this.state.sizeSelectedIndex === index,
                                                            'two-variations': (sizes && sizes.length <= 2)
                                                        })
                                                }
                                                role="radio"
                                                aria-checked={this.state.sizeSelectedIndex === index}
                                                tabIndex={0}
                                                onClick={() => this.setSizeSelection(item, index)}
                                                onKeyPress={() => this.setSizeSelection(item, index)}
                                                aria-label={item.linkText}
                                            >
                                                {item.linkText}
                                            </div>
                                        ))
                                    }
                                    {
                                        !isSizeLengthEven &&
                                        <div
                                            className="select-size__radio-group_radio disabled"
                                            tabIndex={-1}
                                        >
                                            &nbsp;
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        byo: state.byo,
        labels: state.authoredLabels,
        aem: state.aem
    };
};

SelectChain.propTypes = {
    dispatch: PropTypes.func.isRequired,
    byo: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired,
    aem: PropTypes.object.isRequired,
    updateChain: PropTypes.func.isRequired,
    addChainCloseRef: PropTypes.object
};

SelectChain.defaultProps = {
    addChainCloseRef: {}
};

export default connect(mapStateToProps)(SelectChain);
