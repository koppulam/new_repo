import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import orderBy from 'lodash/orderBy';
import Slider from 'react-slick';
import * as objectPath from 'object-path';

import { setAnalyticsData, triggerAnalyticsEvent } from 'lib/utils/analytics-util';
import { createReferenceKey } from 'lib/utils/engraving';

import AnalyticsConstants from 'constants/HtmlCalloutConstants';

import {
    getProductEngravings,
    createEngravingData,
    setEngravingSelection,
    resetEngraving
} from 'actions/EngravingActions';
import { getUrlWithProtocol } from 'lib/utils/format-url';
import styleVariables from 'lib/utils/breakpoints';
import { findFirst } from 'lib/dom/dom-util';
import { disableFocusOnCustomScrollBar } from 'lib/no-scroll';

// Components
import SlickArrow from 'components/common/SlickArrows';
import Picture from 'components/common/Picture';
import scopeFocus from 'lib/dom/scope-focus';
import EngravingCustomization from './EngravingCustomization';
import InitialEngravings from './InitialEngravings';
import SymbolEngravings from './SymbolEngravings';
import CustomEngraving from './CustomEngraving';
import EngravingConfirmation from './EngravingConfirmation';

// import './index.scss';

const HcSticky = require('hc-sticky');

/**
 * @description Browse Engraving component for all Engravings
 * @class BrowseEngraving
 */
class Engraving extends React.Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.stickyComponents = [];
        this.state = {
            engravingDataComplete: props.engravingStatus,
            message: objectPath.get(window, 'tiffany.labels.engraving.initialMessage', ''),
            showError: false
        };

        this.container = React.createRef();
    }

    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentDidMount() {
        const skusAvailable = objectPath.get(this.props, 'rawData.skuData', {});

        // Check if object related to the given sku is already present in raw Data for engraving
        // Fetch details related to this sku only if raw data is not found
        const {
            groupSku,
            sku,
            isByo,
            editingEngraving,
            initialOne,
            initialTwo,
            initialThree,
            itemServiceTypeId,
            styleCode,
            groupId
        } = this.props;
        const keyToSearch = createReferenceKey(groupSku, sku);

        if (Object.keys(skusAvailable).indexOf(keyToSearch) === -1) {
            // Update raw Data and then make configuration object
            this.props.dispatch(getProductEngravings(groupSku, sku, isByo, editingEngraving, initialOne, initialTwo, initialThree, itemServiceTypeId, styleCode, groupId));
        } else {
            // Raw data is already available directly make configuration object
            this.props.dispatch(createEngravingData(groupSku, sku, editingEngraving, initialOne, initialTwo, initialThree, itemServiceTypeId, styleCode, groupId));
        }

        if (this.container.current) {
            this.stickyPreview = new HcSticky(this.container.current, {
                stickTo: this.container.current.parentNode.parentNode.parentNode.parentNode,
                responsive: {
                    898: {
                        disable: true
                    }
                }
            });
        }
        this.updateAnalytics('START');
    }

    /**
    * @description On props changed life cycle event
    * @param {object} nextProps updated params
    * @returns {void}
    */
    componentWillReceiveProps(nextProps) {
        // if (nextProps.engravingMessage !== this.props.engravingMessage) {
        //     this.setState({
        //         engravingDataComplete: nextProps.engravingStatus,
        //         message: nextProps.engravingMessage,
        //         showError: true
        //     });
        // }

        if (nextProps.engravingStatus !== this.props.engravingStatus) {
            this.setState({
                engravingDataComplete: nextProps.engravingStatus,
                message: nextProps.engravingMessage
            });

            if (nextProps.engravingStatus) {
                this.onInit();
            }
        }
    }

    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentDidUpdate() {
        disableFocusOnCustomScrollBar('.engraving');
    }

    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentWillUnmount() {
        this.props.dispatch(resetEngraving());
        if (this.props.hcStickyEnbled) {
            for (let stickyIndex = 0; stickyIndex < this.stickyComponents.length; stickyIndex += 1) {
                this.stickyComponents[stickyIndex].destroy();
            }
            this.stickyComponents = [];
        }
    }

    /**
     * @description method triggered on engraving component initialization
     * @returns {void}
     */
    onInit = () => {
        // reset redux fist then close modal
        // Resetting redux for engraving on closing and opening engraving modal
        this.resetEngravings(() => {
            // Reset Modal window
            if (this.props.screenConfig.component !== 'HOME') {
                this.setEngraving({
                    component: 'HOME'
                });
            }
        });
        this.enableFocus();
    }

    /**
     * @description method to be called on closing engraving
     * @returns {void}
     */
    onModalClose = () => {
        this.resetEngravings(() => {
            // Reset Modal window
            if (this.props.screenConfig.component !== 'HOME') {
                this.setEngraving({
                    component: 'HOME'
                });
            }

            this.props.closeEngraving();
        });
        scopeFocus.dispose();
    }

    /**
     * @description event to show screen based on selection
     * @param {object} screenConfig screen id
     * @returns {void}
     */
    setEngraving = (screenConfig) => {
        // sorting categories according to the order only if they are present
        if (screenConfig.categories) {
            screenConfig.categories = orderBy(screenConfig.categories.map(category => {
                if (!category.orderBy) {
                    category.orderBy = parseInt(objectPath.get(category, 'details.serviceTypeDisplayOrder', 0), 10);
                }
                return category;
            }), 'orderBy', 'asc');
        }

        this.props.dispatch(setEngravingSelection(screenConfig));
        if (screenConfig.component === 'HOME') {
            // Clear Redux selected variant only when home screen is showed
            this.resetEngravings();
        }
        this.updateAnalytics(screenConfig.component, screenConfig.fromScreen);
    }

    /**
     * @description method triggered for keyboard users to focus on interactive elements inside modal
     * @param {Function} cb callback function after setting focus
     * @returns {void}
     */
    enableFocus = (cb = () => { }) => {
        const engravingModal = findFirst('.engraving .modal-transition');

        scopeFocus.setScopeLimit(engravingModal, null, cb);
    }

    /**
     * @description event to clear redux state of selected engravings
     * @param {Function} cb callback function
     * @returns {void}
     */
    resetEngravings = (cb = () => { }) => {
        // Clear Redux selected variant only when home screen is showed
        cb();
    }

    /**
     * @description event called after image has loaded
     * @returns {void}
     */
    onPreviewLoad = () => {
        const leftElement = findFirst('.left-element', findFirst('.engraving'));

        leftElement.style.minHeight = `${leftElement.getBoundingClientRect().height}px`;
    }

    /**
     * Update analytics
     * @param {string} step step
     * @param {string} previousStep previousStep
     * @returns {void}
     */
    updateAnalytics(step, previousStep) {
        // if (step !== 'INITIALS_COMPONENT') {
        const productObj = objectPath.get(window, 'dataLayer.product', {});
        const existingAnalytics = objectPath.get(window, 'dataLayer.personalization', {});
        let unitPrice = '';

        if (this.props.unitPrice >= 0) {
            unitPrice = parseFloat(Math.round(this.props.unitPrice * 100) / 100).toFixed(2);
        }
        const analyticsObject = {
            step: AnalyticsConstants.ENGRAVING_START,
            price: unitPrice,
            back: false,
            product: productObj
        };

        switch (step) {
            case 'CONFIRMATION':
                analyticsObject.step = AnalyticsConstants.ENGRAVING_CONFIRM;
                productObj.engravingPrice = unitPrice;
                productObj.isEngraved = true;
                if (existingAnalytics.type) {
                    analyticsObject.type = existingAnalytics.type;
                }
                if (existingAnalytics.style) {
                    analyticsObject.style = existingAnalytics.style;
                }
                setAnalyticsData('product', productObj);
                break;
            case 'CUSTOM_COMPONENT':
                analyticsObject.step = AnalyticsConstants.ENGRAVING_CONFIGURE;
                analyticsObject.style = AnalyticsConstants.ENGRAVING_CUSTOM;
                if (existingAnalytics && existingAnalytics.step !== AnalyticsConstants.ENGRAVING_START) {
                    analyticsObject.back = true;
                }
                break;
            case 'SYMBOLS_COMPONENT':
                analyticsObject.step = AnalyticsConstants.ENGRAVING_CONFIGURE;
                analyticsObject.style = AnalyticsConstants.ENGRAVING_SYMBOLS;
                if (existingAnalytics && existingAnalytics.step !== AnalyticsConstants.ENGRAVING_START) {
                    analyticsObject.back = true;
                }
                break;
            case 'INITIALS_COMPONENT':
                analyticsObject.step = AnalyticsConstants.ENGRAVING_CONFIGURE;
                if (existingAnalytics && existingAnalytics.step !== AnalyticsConstants.ENGRAVING_START) {
                    analyticsObject.back = true;
                }
                break;
            case 'HOME':
                analyticsObject.back = true;
                break;
            default:
                if (previousStep) {
                    analyticsObject.back = true;
                }
                analyticsObject.step = AnalyticsConstants.ENGRAVING_START;
        }

        if (step !== 'INITIALS_COMPONENT') {
            setAnalyticsData(AnalyticsConstants.ENGRAVING_PERSONALIZATION, analyticsObject);
            triggerAnalyticsEvent(AnalyticsConstants.ENGRAVING_UPDATE_PERSONALIZATION, {});
        }

        if (this.props.hcStickyEnbled) {
            setTimeout(() => {
                const noOfSticky = this.stickyComponents.length;

                for (let stickyIndex = 0; stickyIndex < noOfSticky; stickyIndex += 1) {
                    this.stickyComponents[stickyIndex].resize();
                }
            });
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            preview,
            screenConfig
        } = this.props;
        const { options } = screenConfig;
        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 0,
            nextArrow: <SlickArrow isleftArrow={false} />,
            prevArrow: <SlickArrow isleftArrow />,
            responsive: [
                {
                    breakpoint: parseInt(styleVariables.pdpTabletBreakPoint, 10),
                    settings: {
                        arrows: false,
                        variableHeight: true,
                        dots: true
                    }
                }
            ]
        };

        return (
            <Fragment>
                {
                    this.state.engravingDataComplete ?
                        <div className="content-band--60x40 tf-g tf-g__strech">
                            <div className="band-item">
                                <div className="left-element">
                                    {
                                        this.props.screenConfig.component === this.props.customEngravingIdentifier &&
                                        <div className="product-preview">
                                            <article className="product-preview__container" ref={this.container}>
                                                {
                                                    options &&
                                                    options.length > 0 &&
                                                    <div className={`product-preview__carousel-holder ${options.length === 1 ? 'single-image-1' : ''}`}>
                                                        <Slider {...settings}>
                                                            {
                                                                options.map((image, index) => (
                                                                    <div className="product-preview-image" key={index.toString()}>
                                                                        <Picture
                                                                            {
                                                                            ...image
                                                                            }
                                                                            defaultSrc={getUrlWithProtocol(image.defaultSrc)}
                                                                            isLazyLoad
                                                                        />
                                                                    </div>
                                                                ))
                                                            }
                                                        </Slider>
                                                    </div>
                                                }
                                            </article>
                                        </div>
                                    }
                                    {
                                        preview.defaultSrc &&
                                        this.props.screenConfig.component !== this.props.customEngravingIdentifier &&
                                        <Picture
                                            sources={preview.sources}
                                            defaultSrc={getUrlWithProtocol(preview.defaultSrc)}
                                            altText={preview.altText}
                                            isLazyLoad={this.props.isLazyLoad}
                                            onLoadHandler={this.onPreviewLoad}
                                        />
                                    }
                                </div>
                            </div>
                            <div className="band-item">
                                <div className="right-element">
                                    <div className="right-full-element">
                                        <div className="engraving-wrapper">
                                            {
                                                screenConfig.component === 'HOME' &&
                                                <EngravingCustomization setEngraving={this.setEngraving} enableFocus={this.enableFocus} />
                                            }
                                            {
                                                screenConfig.component === 'INITIALS_COMPONENT' &&
                                                <InitialEngravings {...screenConfig} backHandler={this.setEngraving} enableFocus={this.enableFocus} />
                                            }
                                            {
                                                screenConfig.component === 'SYMBOLS_COMPONENT' &&
                                                <SymbolEngravings {...screenConfig} backHandler={this.setEngraving} enableFocus={this.enableFocus} />
                                            }
                                            {
                                                screenConfig.component === 'CUSTOM_COMPONENT' &&
                                                <CustomEngraving {...screenConfig} backHandler={this.setEngraving} enableFocus={this.enableFocus} />
                                            }
                                            {
                                                screenConfig.component === 'CONFIRMATION' &&
                                                <EngravingConfirmation
                                                    {...screenConfig}
                                                    resetEngravings={this.resetEngravings}
                                                    backHandler={this.setEngraving}
                                                    closeModal={this.onModalClose}
                                                    hasCustomAction={this.props.hasCustomAction}
                                                    editingEngraving={this.props.editingEngraving}
                                                    customClosingAction={this.props.customClosingAction}
                                                    customBtnLabel={this.props.customBtnLabel}
                                                    customClass={this.props.customActionButtonClass}
                                                    productBasePrice={parseInt(this.props.productBasePrice, 10)}
                                                    shoppingBagItemId={this.props.shoppingBagItemId}
                                                    enableFocus={this.enableFocus}
                                                    hasCustomActionPrice={this.props.hasCustomActionPrice}
                                                />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <p
                            className={
                                classNames('engraving-status',
                                    {
                                        error: this.state.showError
                                    })
                            }
                        >
                            {this.state.message}
                        </p>
                }
                {
                    this.props.hasSelfClose &&
                    <button
                        type="button"
                        className="engraving__close"
                        aria-label={this.props.closeAriaLabel}
                        onClick={this.onModalClose}
                    >
                        <img src={this.props.closeSrc} alt={this.props.closeAltText} />
                    </button>
                }
            </Fragment>
        );
    }
}

Engraving.propTypes = {
    dispatch: PropTypes.func.isRequired,
    closeEngraving: PropTypes.func.isRequired,
    sku: PropTypes.string.isRequired,
    rawData: PropTypes.object.isRequired,
    groupSku: PropTypes.string,
    screenConfig: PropTypes.object,
    preview: PropTypes.object,
    isLazyLoad: PropTypes.bool,
    unitPrice: PropTypes.number,
    hcStickyEnbled: PropTypes.bool,
    engravingStatus: PropTypes.bool,
    engravingMessage: PropTypes.string,
    customBtnLabel: PropTypes.string,
    hasCustomAction: PropTypes.bool,
    editingEngraving: PropTypes.bool,
    customClosingAction: PropTypes.func,
    isByo: PropTypes.bool,
    hasSelfClose: PropTypes.bool,
    closeAriaLabel: PropTypes.string,
    customActionButtonClass: PropTypes.string,
    initialOne: PropTypes.string,
    initialTwo: PropTypes.string,
    initialThree: PropTypes.string,
    itemServiceTypeId: PropTypes.string,
    styleCode: PropTypes.string,
    groupId: PropTypes.string,
    productBasePrice: PropTypes.string,
    shoppingBagItemId: PropTypes.string,
    customEngravingIdentifier: PropTypes.string,
    hasCustomActionPrice: PropTypes.bool,
    closeSrc: PropTypes.string,
    closeAltText: PropTypes.string
};

Engraving.defaultProps = {
    groupSku: '',
    screenConfig: {},
    preview: {},
    isLazyLoad: false,
    unitPrice: 0,
    hcStickyEnbled: false,
    engravingStatus: false,
    engravingMessage: objectPath.get(window, 'tiffany.labels.engraving.initialMessage', ''),
    customBtnLabel: '',
    hasCustomAction: false,
    editingEngraving: false,
    customClosingAction: () => { },
    isByo: false,
    hasSelfClose: false,
    closeAriaLabel: objectPath.get(window, 'tiffany.labels.engraving.closeAriaLabel', 'Close engraving modal'),
    customActionButtonClass: '',
    initialOne: '',
    initialTwo: '',
    initialThree: '',
    itemServiceTypeId: '',
    styleCode: '',
    groupId: '',
    productBasePrice: '0',
    shoppingBagItemId: '',
    customEngravingIdentifier: 'CUSTOM_COMPONENT',
    hasCustomActionPrice: false,
    closeSrc: '',
    closeAltText: ''
};

const mapStateToProps = (state) => {
    const configurator = objectPath.get(state, 'engraving.configurator', {
        preview: {
            selectedPreview: {}
        },
        engravingStatus: false,
        engravingMessage: objectPath.get(window, 'tiffany.labels.engraving.initialMessage', '')
    });
    const preview = (objectPath.get(state, 'engraving.screenConfig.component', 'HOME') === 'HOME') ? configurator.previewOnLoad : configurator.previewEngraved;

    return {
        rawData: objectPath.get(state, 'engraving.rawData', {}),
        screenConfig: objectPath.get(state, 'engraving.screenConfig', {
            component: 'HOME'
        }),
        preview,
        unitPrice: objectPath.get(state, 'engraving.variant.unitPrice', 0),
        engravingStatus: configurator.engravingStatus,
        engravingMessage: configurator.engravingMessage,
        closeSrc: objectPath.get(state, 'aem.icons.close.src', ''),
        closeAltText: objectPath.get(state, 'aem.icons.close.altText', '')
    };
};

export default connect(mapStateToProps)(Engraving);
