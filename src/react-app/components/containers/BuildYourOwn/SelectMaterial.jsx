// @flow

// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import Slider from 'react-slick';
import * as objectPath from 'object-path';
import { scrollTo } from 'lib/utils/scroll-to-content';
import * as cookieUtil from 'lib/utils/cookies';
import CustomScrollBar from 'components/common/CustomScrollBar';

import TiffanyModal from 'components/common/TiffanyModal';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import { setAnalyticsData, triggerAnalyticsEvent, transformProductObject } from 'lib/utils/analytics-util';

import {
    getSelectedMaterialProducts,
    showGrid,
    getClaspDetails,
    changeClaspEnabled,
    isBraceletSelected
} from 'actions/BYOActions';
import { fetchShoppingBag } from 'actions/FlyoutActions';
import includes from 'lodash/includes';

import styleVariables from 'lib/utils/breakpoints';

// Types

import type { ByoGuidedProduct, ByoGroupResponse } from 'types/byo';

// Components
import ByoTile from './ByoTile';
import ClaspMessage from './ClaspMessage';
import SelectVariation from './SelectVariation';

type Props = {
    byo: any,
    dispatch: Function,
    aem: any
};
type State = {
    selectedIndex: number,
    selectMaterialConfig: any,
    fixtureCompleteRequest: any,
    showClasp: boolean,
    showSizeModal: boolean,
    productData: ByoGuidedProduct | Object,
    selectionDetails: any,
    animateOptions: boolean,
    selectedFilter: number,
    focusableElemnt: any
};

/**
 * Buy Online now and pick up in store Component
 */
class SelectMaterial extends React.Component<Props, State> {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            selectMaterialConfig: objectPath.get(window, 'tiffany.authoredContent.byoConfig.selectMaterialRequest', []),
            fixtureCompleteRequest: objectPath.get(window, 'tiffany.authoredContent.byoConfig.fixtureCompleteRequest', {}),
            showClasp: false,
            showSizeModal: false,
            selectionDetails: {},
            animateOptions: true,
            selectedFilter: -1,
            productData: {},
            focusableElemnt: null
        };

        this.chainsAvailableAnimationDelay = 1000;
    }

    /**
     * Lifcycle hook
     * @returns {void}
     */
    componentWillMount() {
        const cookie = cookieUtil.getCookies('customBagItemsReduce', { encode: true });
        const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');
        const webCustomerId = cookieUtil.getCookies(cookieName);

        if (!cookie && webCustomerId) {
            this.props.dispatch(fetchShoppingBag());
        }
    }

    /**
     * Lifcycle hook
     * @returns {void}
     */
    componentDidMount() {
        const request = JSON.parse((JSON.stringify(objectPath.get(window, `tiffany.authoredContent.byoConfig.selectMaterialRequest.${this.state.selectedIndex}.request`, false))));

        if (request) {
            request.payload.ByoMountTypeList = this.props.byo.selectedCharmMountTypes;
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
     * @description Dispatch actions for selected chain
     * @param {object} request selected payload
     * @param {Number} index selected index
     * @param {Boolean} isFilterSelection selected filter
     * @returns {void}
     */
    dispatchActionsForSelection = (request, index, isFilterSelection) => {
        if (!this.props.byo.selectedMaterials[index] || (this.props.byo.selectedMaterials[index] && this.props.byo.selectedMaterials[index].isFilterSelection) || isFilterSelection) {
            if (request.payload && request.payload.ByoMountTypeList) {
                request.payload.ByoMountTypeList = [];
            }
            this.props.dispatch(getSelectedMaterialProducts(request, index, isFilterSelection));
        }
        this.setState({
            animateOptions: false
        }, () => {
            setTimeout(() => {
                this.setState({
                    selectedIndex: index,
                    animateOptions: true,
                    selectedFilter: isFilterSelection ? this.state.selectedFilter : -1
                });
            }, this.chainsAvailableAnimationDelay);
        });
        const claspDetails = objectPath.get(this.props.byo, 'claspDetails', {});
        const claspRequest = objectPath.get(window, 'tiffany.authoredContent.byoConfig.claspRequest', false);

        if (claspRequest && !(Object.keys(claspDetails).length > 0)) {
            this.props.dispatch(getClaspDetails(claspRequest));
        }

        if (this.slider) {
            this.slider.slickGoTo(0);
        }
    }

    /**
     * @param {*} productData filter list
     * @param {html} focusableElemnt focusableElemnt
     * @returns {object} html structure
     */
    showModal = (productData: { fixtureDetails: ByoGuidedProduct, productDetails: Array<ByoGroupResponse> }, focusableElemnt) => {
        const sizes = objectPath.get(productData, 'productDetails.0.groupItems', []);
        const showSizeModal = sizes.length > 0;

        this.setState({
            focusableElemnt,
            showSizeModal,
            productData
        }, () => {
            if (!showSizeModal) {
                let data = {};

                data = productData;
                this.showGrid(true, data, showSizeModal);
            }
        });
    }

    /**
     * @returns {object} html structure
     */
    closeModal = () => {
        this.setState({
            showSizeModal: false
        });
    }

    /**
     * @param {Boolean} show filter list
     * @param {object} sizes selected sizes
     * @param {Boolean} hasSizes filter list
     * @returns {object} html structure
     */
    showGrid = (show, sizes, hasSizes) => {
        let selectionDetails = {};

        if (sizes && hasSizes) {
            selectionDetails = {
                ...this.state.productData,
                sizes
            };
        } else {
            selectionDetails = {
                ...this.state.productData
            };
        }

        this.setState({ selectionDetails });

        const mountTypeId = objectPath.get(window, 'tiffany.authoredContent.byoConfig.claspMountTypeId', '');
        const braceletId = objectPath.get(window, 'tiffany.authoredContent.byoConfig.productTypeDescription', false);
        const isMountTypeClasp = includes(objectPath.get(selectionDetails, 'fixtureDetails.mountTypes', []), mountTypeId);
        const isBracelet = objectPath.get(this.state.productData, 'fixtureDetails.productTypeDescription', '').toString() === braceletId;

        if (mountTypeId && isMountTypeClasp) {
            this.setState({ showSizeModal: false }, () => this.setState({ showClasp: true }));
            this.props.dispatch(changeClaspEnabled(true));
        } else {
            const request = JSON.parse(JSON.stringify(this.state.fixtureCompleteRequest));

            this.props.dispatch(changeClaspEnabled(false));
            if (this.state.showSizeModal) {
                this.setState({
                    showSizeModal: false
                }, () => this.props.dispatch(showGrid(true, selectionDetails)));
                request.payload.Sku = objectPath.get(selectionDetails, 'sizes.memberSku', false) || objectPath.get(selectionDetails, 'sizes.selectedSku', false) || objectPath.get(selectionDetails, 'fixtureDetails.defaultSku', '');
            } else if (!hasSizes && Object.keys(sizes).length > 0) {
                this.props.dispatch(showGrid(true, sizes));
                let sku = objectPath.get(sizes, 'memberSku', objectPath.get(sizes, 'fixtureDetails.sku', ''));

                if (sku.match(/GRP/)) {
                    sku = objectPath.get(sizes, 'memberSku', objectPath.get(sizes, 'fixtureDetails.selectedSku', ''));
                }
                request.payload.Sku = sku;
            } else {
                this.props.dispatch(showGrid(true, {}));
                request.payload.Sku = objectPath.get(sizes, 'selectedSku', '');
            }
            this.props.dispatch(isBraceletSelected(isBracelet));
            scrollTo('body');
        }

        const byoStep = objectPath.get(window, 'dataLayer.byo', {});

        if (byoStep.step) {
            byoStep.back = true;
        } else {
            byoStep.back = false;
        }
        const fixtureDetails = objectPath.get(this.state, 'productData.fixtureDetails', {});

        fixtureDetails.isAvailableOnline = true;
        byoStep.step = AnalyticsConstants.BYO_START;
        byoStep.chain = transformProductObject(fixtureDetails);
        byoStep.chain.requiresClaspingLink = false;

        if (this.state.selectMaterialConfig && this.state.selectMaterialConfig[this.state.selectedIndex]) {
            const selectedMaterialConfig = this.state.selectMaterialConfig[this.state.selectedIndex];

            byoStep.chain.categoryName = selectedMaterialConfig.label;
            byoStep.chain.categoryID = objectPath.get(selectedMaterialConfig, 'request.payload.categoryid', '');
        }

        setAnalyticsData('byo', byoStep);
        triggerAnalyticsEvent(AnalyticsConstants.UPDATED_BYO, {});
    }

    /**
     * @description close colpo modal
     * @returns {void}
     */
    colpoCloseHandler = () => {
        this.setState({ showClasp: false });
    }

    /**
     * @description close colpo modal and go to browse grid
     * @returns {void}
     */
    acknowledgeClasp = () => {
        const request = JSON.parse(JSON.stringify(this.state.fixtureCompleteRequest));
        const braceletId = objectPath.get(window, 'tiffany.authoredContent.byoConfig.productTypeDescription', false);
        const isBracelet = objectPath.get(this.state.productData, 'fixtureDetails.productTypeDescription', '').toString() === braceletId;

        if (Object.keys(this.state.selectionDetails).length > 0) {
            this.props.dispatch(showGrid(true, this.state.selectionDetails));
            request.payload.Sku = objectPath.get(this.state.selectionDetails, 'sizes.memberSku', false) || objectPath.get(this.state.selectionDetails, 'sizes.selectedSku', false) || objectPath.get(this.state.selectionDetails, 'fixtureDetails.defaultSku', '');
        } else if (Object.keys(this.state.productData).length > 0) {
            this.props.dispatch(showGrid(true, this.state.productData));
            request.payload.Sku = objectPath.get(this.state.productData, 'memberSku', '');
        }
        if (isBracelet) {
            this.props.dispatch(isBraceletSelected(isBracelet));
        }
        scrollTo('body');
        this.colpoCloseHandler();
        const byoStep = objectPath.get(window, 'dataLayer.byo', {});

        byoStep.chain.requiresClaspingLink = true;

        setAnalyticsData('byo', byoStep);
        triggerAnalyticsEvent(AnalyticsConstants.UPDATED_BYO, {});
    }

    chainsAvailableAnimationDelay: number;

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
                            onKeyPress={() => this.setFiltersSelection(subList.id)}
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
        const settings = {
            dots: false,
            infinite: false,
            variableWidth: false,
            speed: 600,
            slidesToShow: 4,
            slidesToScroll: 4,
            swipeToSlide: false,
            initialSlide: 0,
            useTransform: false,
            accessibility: false,
            responsive: [
                {
                    breakpoint: parseInt(styleVariables.tabletBreakPoint, 10),
                    settings: {
                        slidesToShow: 3.2,
                        slidesToScroll: 3,
                        arrows: false,
                        finalPadding: 20
                    }
                },
                {
                    breakpoint: parseInt(styleVariables.mobileBreakPoint, 10),
                    settings: {
                        slidesToShow: 1.5,
                        slidesToScroll: 1,
                        arrows: false,
                        finalPadding: 50
                    }
                }
            ]
        };
        const selectMaterialLabels = objectPath.get(window, 'tiffany.labels.byo.selectMaterial', {});
        const sizeText = objectPath.get(window, 'tiffany.labels.byo.variations.sizeText', false);
        const selectMaterialLabelsError = objectPath.get(window, 'tiffany.labels.byo.selectMaterial.errorState', {});
        const addChainLabel = objectPath.get(window, 'tiffany.labels.byo.addChain', {});
        const {
            heading,
            subHeading,
            skipDescriptionText,
            skipCtaText,
            countLabel,
            filterLabel
        } = selectMaterialLabels;
        const selectedProducts = objectPath.get(this.props.byo, `selectedMaterials.${this.state.selectedIndex}.products`, []);
        const selectedProductsCount = selectedProducts.length;
        const selectedProductLabel = `${countLabel}${selectedProductsCount}`;
        const materialFilters = objectPath.get(this.props.byo, `selectedMaterials.${this.state.selectedIndex}.materialFilters`, {});
        const claspModalOptions = {
            overlay: true,
            className: 'clasp-modal',
            closeClass: 'close-modal',
            overlayClass: 'clasp-overlay',
            blockMobileScrollability: true,
            blockDesktopScrollability: true,
            exitFocusRef: this.state.focusableElemnt,
            closeonTapOutside: {
                isClose: true,
                modalContainerClass: 'clasp-message'
            }
        };
        const sizeModalOptions = {
            overlay: true,
            className: 'size-modal',
            closeClass: 'close-modal',
            overlayClass: 'clasp-overlay',
            blockMobileScrollability: true,
            blockDesktopScrollability: true,
            modalFocus: true,
            exitFocusRef: this.state.focusableElemnt,
            closeonTapOutside: {
                isClose: true,
                modalContainerClass: 'select-size'
            }
        };
        const htmlCallout = {
            interactionContext: '',
            interactionType: AnalyticsConstants.CHOOSE_CHAIN,
            interactionName: AnalyticsConstants.SKIP
        };

        const selectedLabel = this.state.selectMaterialConfig[this.state.selectedIndex].label;

        return (
            <div className="select-material">
                <h2 className="select-material__heading">{heading}</h2>
                <h1 className="select-material__sub-heading">{subHeading}</h1>
                <p className="select-material__description">
                    {skipDescriptionText}
                    <button
                        type="button"
                        className="select-material__description_btn"
                        onClick={() => this.setState({ productData: {} }, () => {
                            this.showGrid(true, {});
                        })}
                        data-interaction-context={htmlCallout.interactionContext}
                        data-interaction-type={htmlCallout.interactionType}
                        data-interaction-name={htmlCallout.interactionName}
                    >
                        {skipCtaText}
                    </button>
                </p>
                <div
                    className="select-material__radio-group"
                    role="tablist"
                >
                    {
                        this.state.selectMaterialConfig.map((item, index) => {
                            const isSelected = this.state.selectedIndex === index;

                            return ( // $FlowFixMe
                                <div
                                    tabIndex="0"
                                    role="tab"
                                    id={`tab${index}`}
                                    aria-selected
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
                                </div>
                            );
                        })
                    }
                </div>

                {
                    Object.keys(materialFilters).length > 0 && !this.props.byo.isSelectedMaterialFailed &&
                    <div className="select-material__filters">
                        <span id="select-material-filters-label" className="select-material__filters_label">{filterLabel}</span>
                        <ul
                            className="select-material__filters_list"
                            role="radiogroup"
                            aria-labelledby="select-material-filters-label"
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

                {!this.props.byo.isSelectedMaterialFailed &&
                    <CSSTransition
                        in={this.state.animateOptions}
                        timeout={this.chainsAvailableAnimationDelay}
                        classNames={{
                            enter: 'byo__slideup-and-enter',
                            enterActive: 'byo__slideup-and-enter_active',
                            enterDone: 'byo__slideup-and-enter_complete',
                            exit: 'byo__fade-out',
                            exitActive: 'byo__fade-out_active',
                            exitDone: 'byo__fade-out_complete'
                        }}
                        mountOnEnter
                        unmountOnExit
                    >
                        <div
                            role="tabpanel"
                            aria-labelledby={`tab${this.state.selectedIndex}`}
                            id={`tab-content${this.state.selectedIndex}`}
                        >
                            <Slider className="select-material__carousel" ref={c => { this.slider = c; }} {...settings}>
                                {
                                    selectedProducts.map((item, index) => {
                                        return (
                                            <ByoTile
                                                key={index.toString()}
                                                productProps={item}
                                                name={item.name}
                                                image={item.image}
                                                isNew={item.isNew}
                                                sku={item.sku}
                                                price={item.price}
                                                clickHandler={this.showModal}
                                                isMaterial
                                            />);
                                    })
                                }
                            </Slider>
                        </div>
                    </CSSTransition>
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
                {
                    this.state.showClasp &&
                    <TiffanyModal
                        visible={this.state.showClasp}
                        options={claspModalOptions}
                        onClose={this.colpoCloseHandler}
                    >
                        <div className="select-material__clasp-modal">
                            <ClaspMessage colpoCloseHandler={this.colpoCloseHandler} acknowledgeClasp={this.acknowledgeClasp} />
                        </div>
                    </TiffanyModal>
                }
                {
                    this.state.showSizeModal &&
                    <TiffanyModal
                        visible={this.state.showSizeModal}
                        options={sizeModalOptions}
                        onClose={this.closeModal}
                    >
                        <div className="select-material__size-modal">
                            <SelectVariation
                                variationType={sizeText}
                                productDetails={this.state.productData}
                                clickHandler={this.showGrid}
                                selectedLabel={selectedLabel}
                                isFixture
                            />
                            <button type="button" className="close-modal icon-Close" aria-label="click to close" />
                        </div>
                    </TiffanyModal>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        byo: state.byo,
        aem: state.aem
    };
};

SelectMaterial.propTypes = {
    dispatch: PropTypes.func.isRequired,
    byo: PropTypes.object.isRequired,
    aem: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(SelectMaterial);
