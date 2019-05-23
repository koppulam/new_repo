// Packages
import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as objectPath from 'object-path';
import MediaQuery from 'react-responsive';
import ReactTooltip from 'lib/utils/react-tooltip';
import {
    findFirst,
    hasClass,
    removeClass,
    addClass
} from 'lib/dom/dom-util';
import { storeDetailStatus, changeStoreStatus } from 'actions/FindStoreActions';

import InformationText from 'components/common/InformationText';
import matchMedia from 'lib/dom/match-media';
import getKeyCode from 'lib/utils/KeyCodes';

import Picture from 'components/common/Picture';

// Styles
import styleVariables from 'lib/utils/breakpoints';
// import './index.scss';

import ChangeStore from './ChangeStore';
/**
 * Component declaration.
 */
class StoreDetail extends Component {
    /**
     * @param {*} props super props
     * @returns {void}
	 */
    constructor(props) {
        super(props);
        this.labels = objectPath.get(window, 'tiffany.labels', {});
    }

    /**
	 * @description On component monted life cycle event
	 * @returns {void}
	 */
    componentDidMount() {
        this.container = findFirst('.product-description__container');
        this.buttonContainer = findFirst('.product-description__buttons');
        this.findStoreButton = findFirst('.find-in-store');
    }


    /**
	 * @description show default store availability details
	 * @param {object} e event
	 * @returns {void}
	 */
    changeStore = e => {
        const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;
        const storeDetails = findFirst('.store-details');

        if (Object.keys(this.props.storeDetails).length > 0) {
            this.props.dispatch(changeStoreStatus(!this.props.changeStoreStatus));
            addClass(storeDetails, 'hide');
            if (!isDesktop) {
                this.props.dispatch(storeDetailStatus(false));
            }
        }
    };

    /**
	 * @description focus on find store
	 * @param {Event} e keypressevent
	 * @returns {void}
	 */
    focusStore = e => {
        const charCode = e.which ? e.which : e.keyCode;
        const type = getKeyCode(charCode);

        if (type === 'ENTER') {
            this.closeStore();
            this.findStoreButton.focus();
            e.preventDefault();
        }
    };

    /**
	 * @description close store modal
	 * @returns {void}
	 */
    closeStore = () => {
        this.props.dispatch(storeDetailStatus(false));
        if (hasClass(this.container, 'relative-holder')) {
            removeClass(this.container, 'relative-holder');
        }
        removeClass(this.buttonContainer, 'find-store-button-desktop-hidden');
        this.props.closeInit();
    };

    /**
	 * @description Method to get the store name based on API response.
	 * @param {Object} storeData keypressevent
	 * @returns {String} storeName
	 */
    setStoreName =(storeData) => {
        const storeAttr = (storeData.storeSiteAttributes && storeData.storeSiteAttributes.length > 0) ? storeData.storeSiteAttributes[0] : [];
        let selectedStoreName = objectPath.get(storeData, 'storeName', '');

        if (storeAttr && storeAttr.storeName && storeAttr.storeName !== '') {
            selectedStoreName = storeAttr.storeName;
        }

        return selectedStoreName;
    }

    /**
	 * Render Component.
	 * @returns {object} html instance
	 */
    render() {
        const storeConfig = objectPath.get(window.tiffany, 'pdpConfig.store', {});
        const labels = objectPath.get(window, 'tiffany.labels', {});
        const inforText = {
            informationTextRTE: objectPath.get(storeConfig, 'availability.callToConfirm', ''),
            telephoneNumber: objectPath.get(this.props.aem, 'noSearchConfig.telephoneNumber', '')
        };
        const toolTipConfig = objectPath.get(storeConfig, 'availability.toolTipConfig', {});

        const closeSrc = objectPath.get(this.props.aem, 'icons.close.src', '');
        const closeAltText = objectPath.get(this.props.aem, 'aem.icons.close.altText', '');

        if (this.props.storeDetailStatus) {
            const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;

            if (isDesktop) {
                setTimeout(() => {
                    const storeModal = findFirst('.store-details');

                    if (storeModal) {
                        storeModal.focus();
                    }
                });
            }
        }

        const storedetails = this.props.storeDetails;
        const selectedStoreName = this.setStoreName(storedetails);

        return (
            <Fragment>
                {this.props.storeDetailStatus && !this.props.changeStoreStatus && (
                    <div className="store-details" role="dialog" tabIndex={-1}>
                        {
                            this.props.isFISS &&
                            <MediaQuery query={styleVariables.desktopAndBelow}>
                                <button
                                    type="button"
                                    className="store-details_close"
                                    aria-label={labels.findStoreCloseLabel}
                                    onClick={this.closeStore}
                                    onKeyPress={this.focusStore}
                                >
                                    <img src={closeSrc} alt={closeAltText} />
                                </button>
                            </MediaQuery>
                        }
                        <div className="store-details__container">
                            <MediaQuery query={styleVariables.desktopAndAbove}>
                                <p className="store-details__container_header">
                                    {storeConfig.inStoreAvailability}
                                </p>
                            </MediaQuery>
                            <div className="store-details__container_body">
                                <div className="store-details__container_body-availability">
                                    {storedetails.limitedAvailabilityInStore && (
                                        <span className="store-details__container_body-limited">{storeConfig.availability.limitedAvailable}</span>
                                    )}
                                    {storedetails.availableInStore && (
                                        <span className="store-details__container_body-limited">{storeConfig.availability.availabile}</span>
                                    )}
                                    {storedetails.outOfStockInStore && (
                                        <InformationText config={inforText} />
                                    )}
                                    {storedetails.storeName && (
                                        <span className="store-details__container_body-address">
                                            {selectedStoreName}
                                            {
                                                toolTipConfig &&
                                                    <div className="store-details__container_body-info">
                                                        <span
                                                            role="tooltip"
                                                            data-tip=""
                                                            data-for="storeToolTipText"
                                                            data-event="click focus"
                                                            data-type="light"
                                                            data-class="store-config-tooltip"
                                                            data-border="true"
                                                            id="storeToolTipId"
                                                        >
                                                            <Picture
                                                                defaultSrc={this.props.toolTipIconSrc}
                                                                altText={this.props.toolTipIconAltText}
                                                                customClass="tooltip-image"
                                                                isLazyLoad
                                                            />
                                                        </span>
                                                        <ReactTooltip
                                                            globalEventOff="click focus"
                                                            id="storeToolTipText"
                                                            effect="solid"
                                                            isCapture
                                                        >
                                                            <div aria-describedby="storeToolTipId">
                                                                {
                                                                    (storedetails.limitedAvailabilityInStore && toolTipConfig.limitedAvailable) &&
                                                                    <InformationText config={toolTipConfig.limitedAvailable} />
                                                                }
                                                                {
                                                                    (storedetails.availableInStore && toolTipConfig.availabile) &&
                                                                    <InformationText config={toolTipConfig.availabile} />
                                                                }
                                                                {
                                                                    (storedetails.outOfStockInStore && toolTipConfig.callToConfirm) &&
                                                                    <InformationText config={toolTipConfig.callToConfirm} />
                                                                }
                                                            </div>
                                                        </ReactTooltip>
                                                    </div>
                                            }
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="cta underline-cta store-details__container_body-button"
                                onClick={this.changeStore}
                            >
                                <span
                                    className="cta-content store-details__container_body-buttonText"
                                    tabIndex={-1}
                                >
                                    {storeConfig.changeStore}
                                </span>
                            </button>
                        </div>
                        {this.props.bops === 'true' &&
                            storedetails.isBOPSEnabled && (
                            <div className="store-details__bops">
                                <tiffany-bops />
                            </div>
                        )}
                        <MediaQuery query={styleVariables.desktopAndAbove}>
                            <button
                                type="button"
                                className="store-details_close"
                                aria-label={labels.findStoreCloseLabel}
                                onClick={this.closeStore}
                                onKeyPress={this.focusStore}
                            >
                                <img src={closeSrc} alt={closeAltText} />
                            </button>
                        </MediaQuery>
                    </div>
                )}
                <ChangeStore isFISS={this.props.isFISS} closeModal={this.closeStore} />
            </Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        storeDetailStatus: state.findStore.storeDetailStatus,
        changeStoreStatus: state.findStore.changeStoreStatus,
        storeDetails: state.findStore.storeDetails,
        aem: state.aem,
        toolTipIconSrc: objectPath.get(state, 'aem.icons.tooltip.src', ''),
        toolTipIconAltText: objectPath.get(state, 'aem.icons.tooltip.altText', 'tooltip icon')
    };
};

StoreDetail.defaultProps = {
    storeDetailStatus: null,
    closeInit: () => {},
    isFISS: false
};

StoreDetail.propTypes = {
    dispatch: PropTypes.func.isRequired,
    storeDetailStatus: PropTypes.any,
    bops: PropTypes.any.isRequired,
    storeDetails: PropTypes.object.isRequired,
    changeStoreStatus: PropTypes.bool.isRequired,
    aem: PropTypes.object.isRequired,
    toolTipIconSrc: PropTypes.string.isRequired,
    toolTipIconAltText: PropTypes.string.isRequired,
    closeInit: PropTypes.func,
    isFISS: PropTypes.bool
};

export default connect(mapStateToProps)(StoreDetail);
