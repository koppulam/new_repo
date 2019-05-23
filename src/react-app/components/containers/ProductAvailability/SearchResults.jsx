// Packages
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import classNames from 'classnames';
import InformationText from 'components/common/InformationText';
import MediaQuery from 'react-responsive';
import { addPreferredStore } from 'lib/utils/preferred-store-util';
import FC from 'constants/FindStoreConstants';
import ReactTooltip from 'lib/utils/react-tooltip';
import { setStoreDetails } from 'actions/FindStoreActions';
import { findFirst, addClass } from 'lib/dom/dom-util';
import styleVariables from 'lib/utils/breakpoints';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import Picture from 'components/common/Picture';
import { setAnalyticsData } from 'lib/utils/analytics-util';
import ChangeStore from './ChangeStore';


// import './index.scss';

/**
 * Marketing tile component
 */
class SearchResults extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.state = {
            pickUpStore: false
        };
    }

    /**
     * @description setLocationMap
     * @param {Object} item item of the store.
     * @returns {void}
     */
    setLocationMap = (item) => {
        const isChina = objectPath.get(this.props.aem, 'isChina', false);

        if (isChina) {
            return `//api.map.baidu.com/marker?location=${item.geoCodeLattitude.trim()},${item.geoCodeLongitude.trim()}&output=html&title=(Tiffany ${item.storeName})`;
        }
        return `//maps.google.com/maps?q=${item.geoCodeLattitude},${item.geoCodeLongitude} (Tiffany ${item.storeName})&amp;mrt=loc&amp;t=m`;
    }

    /**
     * @description pickUpStore on Toggle
     * @param {Object} event event of toggle switch button.
     * @returns {void}
     */
    pickUpStoreToggle = (event) => {
        this.setState({ pickUpStore: !this.state.pickUpStore });
    }

    /**
     * @description selectStore
     * @param {Object} storeDetail storeDetail of the selected store.
     * @returns {void}
     */
    selectStore = (storeDetail) => {
        addPreferredStore(storeDetail.mipsStoreNumber).then((res) => {
            if (res) {
                let inStoreStatus;
                const productObj = objectPath.get(window, 'dataLayer.product', {});

                if (storeDetail.availableInStore === true) {
                    inStoreStatus = AnalyticsConstants.AVALIBALE;
                } else if (storeDetail.limitedAvailabilityInStore === true) {
                    inStoreStatus = AnalyticsConstants.LIMITED_AVALIABILITY;
                } else if (storeDetail.outOfStockInStore === true) {
                    inStoreStatus = AnalyticsConstants.CALL_TO_CONFIRM;
                }
                productObj.inStoreStatus = inStoreStatus;
                setAnalyticsData('product', productObj);
                storeDetail.isPreferredStore = true;
                this.props.dispatch(setStoreDetails(storeDetail));
                this.props.onClose(FC.FROM_STORE_SEARCH);
            }
        });
    }

    /**
     * @description Check for BOPS status
     * @param {Object} response search results captured response payload
     * @returns {void}
     */
    checkForBops = (response) => {
        let isBops = false;

        response.forEach((item, index) => {
            if (item.isBOPSEnabled === true) {
                isBops = item.isBOPSEnabled;
            }
        });

        return isBops;
    }

    /**
     * @description Perform check for storeSeoAttribute existance
     * @param {Object} response search results with storeSeoAttribute response payload
     * @param {String} param Represents response parameter string from API call.
     * @returns {void}
     */
    checkForStore = (response, param) => {
        let flag = false;

        if (response && Object.keys(response).length > 0 && response[param] && response[param] && response[param] !== '') {
            flag = true;
        }
        return flag;
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const config = objectPath.get(window.tiffany, 'pdpConfig.storeSearchConfig', {});
        const { searchResults } = this.props;
        const isBops = this.checkForBops(searchResults);
        const toolTipConfig = objectPath.get(config, 'toolTipConfig', {});
        const showToggle = (config.isToggle === true && isBops);
        const htmlCallout = {
            interactionContext: '',
            interactionType: 'tab-activity',
            interactionName: 'find-item-in-store:select'
        };

        const pdpContainer = findFirst('.pdp-container');

        if (pdpContainer) {
            addClass(pdpContainer, 'base-items-hidden');
        }

        return (
            <article className="search-results">
                <MediaQuery query={styleVariables.desktopAndAbove}>
                    <div className="search-results__form-container">
                        <ChangeStore type="search-results" />
                    </div>
                </MediaQuery>
                <div className="search-results__data-container">
                    <MediaQuery query={styleVariables.desktopAndAbove}>
                        <div className="search-results__heading-block">
                            <span className="search-results__heading-block_item">{config.headingText}</span>
                            {
                                config.availabilityText &&
                                <span className="search-results__heading-block_item">
                                    <InformationText config={config.availabilityText} />
                                </span>
                            }
                        </div>
                    </MediaQuery>
                    <div className={
                        classNames(
                            {
                                'search-results__toogle': showToggle,
                                'search-results__toogle_hide': !showToggle
                            }
                        )
                    }
                    >
                        {
                            showToggle &&
                            <Fragment>
                                <span
                                    tabIndex={0}
                                    role="checkbox"
                                    className="search-results__toogle-switch"
                                    onClick={this.pickUpStoreToggle}
                                    onKeyPress={this.pickUpStoreToggle}
                                    aria-checked={this.state.pickUpStore}
                                    aria-label={config.showPickupCtaText}
                                >
                                    <i className={
                                        classNames({
                                            'toggle-switch_on': !this.state.pickUpStore,
                                            'toggle-switch_off toggle-switch_off_right': this.state.pickUpStore
                                        })
                                    }
                                    />
                                    <i className={
                                        classNames({
                                            'toggle-switch_on toggle-switch_on_right': this.state.pickUpStore,
                                            'toggle-switch_off': !this.state.pickUpStore
                                        })
                                    }
                                    />
                                </span>
                            </Fragment>
                        }
                        {
                            showToggle &&
                            <div className="search-results__toogle-label">
                                {config.showPickupCtaText}
                                {
                                    toolTipConfig.pickUpStore &&
                                    <div className="search-results__toogle-label-info">
                                        <span
                                            role="tooltip"
                                            data-tip=""
                                            data-for="pickUpStoreToolTipText"
                                            data-event="click focus"
                                            data-type="light"
                                            data-class="store-config-tooltip"
                                            data-border="true"
                                            id="pickUpStoreToolTipId"
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
                                            id="pickUpStoreToolTipText"
                                            effect="solid"
                                            isCapture
                                        >
                                            <div aria-describedby="pickUpStoreToolTipId">
                                                <InformationText config={toolTipConfig.pickUpStore} />
                                            </div>
                                        </ReactTooltip>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                    {searchResults &&
                        searchResults.map((item, index) => {
                            const storeAttr = (item.storeSiteAttributes && item.storeSiteAttributes.length > 0) ? item.storeSiteAttributes[0] : [];

                            return (
                                !showToggle ||
                                    (showToggle && this.state.pickUpStore && item.isBOPSEnabled) ||
                                    (showToggle && !this.state.pickUpStore) ?
                                    <div key={index.toString()}>
                                        <MediaQuery query={styleVariables.desktopAndBelow}>
                                            <span
                                                className="search-results_sub-heading-mobile"
                                            >
                                                {item.distanceInMiles}
                                            </span>
                                        </MediaQuery>
                                        <h5
                                            className="search-results_heading"
                                        >
                                            {this.checkForStore(storeAttr, 'storeName') ? storeAttr.storeName : item.storeName}
                                        </h5>
                                        <MediaQuery query={styleVariables.desktopAndAbove}>
                                            <div className="search-results_sub-heading">
                                                {item.distanceInMiles}
                                            </div>
                                        </MediaQuery>
                                        <div className="search-results__details">
                                            <div className="search-results__details_col">
                                                <a target="_blank" rel="noopener noreferrer" href={this.setLocationMap(item)}>
                                                    <span
                                                        className="search-results__details_col_info"
                                                    >
                                                        {this.checkForStore(storeAttr, 'address1') ? storeAttr.address1 : item.address1}
                                                        <br />
                                                        {this.checkForStore(storeAttr, 'city') ? storeAttr.city : item.city}
                                                        &#44;
                                                        &nbsp;
                                                        {this.checkForStore(storeAttr, 'region') ? storeAttr.region : item.region}
                                                        &nbsp;
                                                        {this.checkForStore(storeAttr, 'postalCode') ? storeAttr.postalCode : item.postalCode}
                                                    </span>
                                                </a>
                                                <div
                                                    className="search-results__details_col_regular-hrs"
                                                >
                                                    <InformationText config={item.regularHrs} />
                                                </div>
                                                {
                                                    item.holidayHrs &&
                                                    <span
                                                        className="search-results__details_col_holiday-hrs"
                                                    >
                                                        <InformationText config={item.holidayHrs} />
                                                    </span>
                                                }
                                            </div>
                                            <div className="search-results__details_col">
                                                <ul className="search-results__details_col_list">
                                                    {item.availableInStore &&
                                                        <li>
                                                            <span>
                                                                {config.availableText}
                                                                {
                                                                    toolTipConfig.availability &&
                                                                    <div className="search-results__details_col_tooltip">
                                                                        <span
                                                                            role="tooltip"
                                                                            data-tip=""
                                                                            data-for={`searchResultsAvailabilityToolTipText-${index}`}
                                                                            data-event="click focus"
                                                                            data-type="light"
                                                                            data-class="store-config-tooltip"
                                                                            data-border="true"
                                                                            id={`searchResultsAvailabilityToolTipId-${index}`}
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
                                                                            id={`searchResultsAvailabilityToolTipText-${index}`}
                                                                            effect="solid"
                                                                            isCapture
                                                                        >
                                                                            <div aria-describedby={`searchResultsAvailabilityToolTipId-${index}`}>
                                                                                <InformationText config={toolTipConfig.availability} />
                                                                            </div>
                                                                        </ReactTooltip>
                                                                    </div>
                                                                }
                                                            </span>
                                                        </li>
                                                    }
                                                    {item.limitedAvailabilityInStore &&
                                                        <li>
                                                            <span>
                                                                {config.limitedAvailText}
                                                                {
                                                                    toolTipConfig.limitedAvailability &&
                                                                    <div className="search-results__details_col_tooltip">
                                                                        <span
                                                                            role="tooltip"
                                                                            data-tip=""
                                                                            data-for={`limitedAvailabilityToolTipText-${index}`}
                                                                            id={`limitedAvailabilityToolTipId-${index}`}
                                                                            data-event="click focus"
                                                                            data-type="light"
                                                                            data-class="store-config-tooltip"
                                                                            data-border="true"
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
                                                                            id={`limitedAvailabilityToolTipText-${index}`}
                                                                            effect="solid"
                                                                            isCapture
                                                                        >
                                                                            <div aria-describedby="limitedAvailabilityToolTipId">
                                                                                <InformationText config={toolTipConfig.limitedAvailability} />
                                                                            </div>
                                                                        </ReactTooltip>
                                                                    </div>
                                                                }
                                                            </span>
                                                        </li>
                                                    }
                                                    {item.outOfStockInStore &&
                                                        <li>
                                                            <span>
                                                                {config.unavailableText}
                                                                {
                                                                    toolTipConfig.unAvailable &&
                                                                    <div className="search-results__details_col_tooltip">
                                                                        <span
                                                                            role="tooltip"
                                                                            data-tip=""
                                                                            data-for={`unAvailableToolTipText-${index}`}
                                                                            id={`unAvailableToolTipId-${index}`}
                                                                            data-event="click focus"
                                                                            data-type="light"
                                                                            data-class="store-config-tooltip"
                                                                            data-border="true"
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
                                                                            id={`unAvailableToolTipText-${index}`}
                                                                            effect="solid"
                                                                            isCapture
                                                                        >
                                                                            <div aria-describedby="unAvailableToolTipId">
                                                                                <InformationText config={toolTipConfig.unAvailable} />
                                                                            </div>
                                                                        </ReactTooltip>
                                                                    </div>
                                                                }
                                                            </span>
                                                        </li>
                                                    }
                                                    {item.isBOPSEnabled &&
                                                        <li>
                                                            <span>
                                                                {config.bopsStatustext}
                                                            </span>
                                                        </li>
                                                    }
                                                </ul>
                                                <button
                                                    type="button"
                                                    className="search-results__details_col_button"
                                                    onClick={() => this.selectStore(item)}
                                                    data-interaction-context={htmlCallout.interactionContext}
                                                    data-interaction-type={htmlCallout.interactionType}
                                                    data-interaction-name={htmlCallout.interactionName}
                                                >
                                                    <span
                                                        className="search-results__details_col_button_text"
                                                        tabIndex={-1}
                                                    >
                                                        {config.selectStoreBtnText}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div> : null
                            );
                        })
                    }
                </div>
            </article>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        searchResults: state.findStore.searchResults,
        toolTipIconSrc: objectPath.get(state, 'aem.icons.tooltip.src', ''),
        toolTipIconAltText: objectPath.get(state, 'aem.icons.tooltip.altText', 'tooltip icon')
    };
};

SearchResults.propTypes = {
    dispatch: PropTypes.func.isRequired,
    searchResults: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    toolTipIconSrc: PropTypes.string.isRequired,
    toolTipIconAltText: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired
};

export default connect(mapStateToProps)(SearchResults);
