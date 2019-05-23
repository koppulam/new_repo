// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import { getSearchedStores, dispatchNoSearchResultsData } from 'actions/StoresActions';
import SC from 'constants/StoresConstants';
import find from 'lodash/find';
import classNames from 'classnames';
import CustomScrollBar from 'components/common/CustomScrollBar';

import { triggerAnalyticsEvent, setAnalyticsData } from 'lib/utils/analytics-util';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

// Components
import BaiduMaps from 'components/containers/Maps/BaiduMaps';
import TiffanyMaps from 'components/containers/Maps';
import Picture from 'components/common/Picture';
import InformationText from 'components/common/InformationText';
import { getSalesServiceCookie } from 'lib/utils/salesService-util';

// import './index.scss';

const { getAddress } = require('lib/utils/google-address');
const { searchStoresInRadius, sortStoresBasedOnDistance } = require('lib/utils/store-util');

/**
 * Store Search Results Component
 */
class StoreSearchResults extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            isSearched: false,
            noSearchResults: false,
            searchedLatlng: { lat: 0, lng: 0 },
            searchedRadius: 25
        };
    }

    /**
     * Lifcycle hook
     * @param {*} nextProps changed props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        let filteredStores = [];

        if (nextProps.stores.storeSearchData !== this.props.stores.storeSearchData) {
            const {
                storeSearchData: {
                    selectedRegion,
                    selectedDistance,
                    selectedServices
                }
            } = nextProps.stores;

            this.props.stores.searchResponseList = [];

            if (!this.state.isSearched) {
                this.setState({
                    isSearched: true
                });
            }
            if (selectedRegion) {
                getAddress(selectedRegion).then((response) => {
                    if (Object.keys(response).length > 0) {
                        const stores = objectPath.get(this.props.stores, 'storesList', {});

                        filteredStores = searchStoresInRadius(response.lat, response.lng, selectedDistance, stores);
                        if (filteredStores.length > 0) {
                            this.getSearchResults(filteredStores, selectedServices, response, selectedDistance);
                        } else {
                            this.noSearchResults();
                        }
                    }
                }, () => {
                    this.noSearchResults();
                });
            } else {
                this.noSearchResults();
            }
        } else if (nextProps.stores.searchResponseList !== this.props.stores.searchResponseList && nextProps.stores.searchResponseList.length > 0) {
            this.setState({
                noSearchResults: false
            });
        } else if (nextProps.stores.searchResponseList.length === 0 && this.props.stores.searchResponseList.length !== 0) {
            this.noSearchResults();
        }
    }

    /**
     * @param {object} latlng latlng
     * @param {boolean} radius radius
     * @returns {void}
     */
    setLatLngRadius(latlng, radius) {
        if (latlng && latlng.lat && latlng.lng && radius) {
            this.setState({
                ...this.state,
                searchedLatlng: latlng,
                searchedRadius: parseInt(radius, 10)
            });
        }
    }

    /**
     * @param {array} storeList list of stores
     * @param {array} selectedServices selectedServices
     * @param {object} latlng latlng
     * @param {number} selectedDistance selectedDistance
     * @returns {array} list of stores
     */
    getSearchResults(storeList, selectedServices, latlng, selectedDistance) {
        if (storeList.length > 0) {
            const searchConfig = objectPath.get(this.props.aem, 'storeLocatorSearchBar', {});
            const request = searchConfig.storeLocatorConfig;

            request.payload = {};
            request.payload[searchConfig.payloadKeys.storeIdKey] = storeList;
            request.payload[searchConfig.payloadKeys.siteIdKey] = searchConfig.siteId;

            getSearchedStores(request, selectedServices).then((results) => {
                const list = sortStoresBasedOnDistance(latlng ? latlng.lat : 0, latlng ? latlng.lng : 0, results);

                if (results.length > 0) {
                    this.props.dispatch({
                        type: SC.STORES_SEARCH_RESPONSE_DATA,
                        payload: {
                            searchResponseList: list
                        }
                    });
                    setAnalyticsData('stores.resultsCount', results.length);
                    triggerAnalyticsEvent(AnalyticsConstants.SEARCH_STORES, '');
                } else {
                    this.noSearchResults();
                }
                this.setLatLngRadius(latlng, selectedDistance);
            }, (err) => {
                this.noSearchResults();
                this.setLatLngRadius(latlng, selectedDistance);
            });
        } else {
            this.noSearchResults();
            this.setLatLngRadius(latlng, selectedDistance);
        }
    }

    /**
     * get local stores around the user
     * @returns {void}
     */
    getLocalStores = () => {
        let filteredStores = [];
        const defaultRadius = 50;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const coordinates = { lat: position.coords.latitude, lng: position.coords.longitude };
                const stores = objectPath.get(this.props.stores, 'storesList', {});
                const searchConfig = objectPath.get(this.props.aem, 'storeLocatorSearchBar', {});
                const request = searchConfig.storeLocatorConfig;

                filteredStores = searchStoresInRadius(coordinates.lat, coordinates.lng, defaultRadius, stores);
                if (filteredStores.length > 0) {
                    request.payload = {};
                    request.payload[searchConfig.payloadKeys.storeIdKey] = filteredStores;
                    request.payload[searchConfig.payloadKeys.siteIdKey] = searchConfig.siteId;
                    getSearchedStores(request, []).then((results) => {
                        if (results.length > 0) {
                            const payload = {
                                noSearchResponceList: results,
                                storesNearBySearched: true
                            };

                            this.props.dispatch(dispatchNoSearchResultsData(payload));
                        }
                    });
                }
            });
        }
    }

    /**
     * Markers updated callback
     * @param {object} visibleStoresList visibleStoresList
     * @returns {object} Element
     */
    markersUpdated = (visibleStoresList) => {
        this.getSearchResults(visibleStoresList, this.props.stores.storeSearchData.selectedServices);
    }

    /**
     * @param {string} storeId storeId
     * @returns {void}
     */
    markerClicked = (storeId) => {
        const searchResultLabels = objectPath.get(this.props.aem, 'storeLocatorSearchResultLabels', {});
        const store = find(this.props.stores.searchResponseList, (item) => {
            if (item.store.storeId === storeId) {
                return item;
            }
            return false;
        });
        const siteAttributesIndex = 0;
        const storeSeoAttributes = objectPath.get(store, 'storeSeoAttributes', []);
        let storeSeoAttributesObject = {};

        if (storeSeoAttributes.length > 0) {
            storeSeoAttributesObject = storeSeoAttributes[siteAttributesIndex];
            const storeUrl = `${searchResultLabels.storeDetailUrl}/${storeSeoAttributesObject.canonicalUrlkeyword}`;

            window.location = storeUrl;
        }
    }

    /**
     * @returns {void}
     */
    noSearchResults() {
        const errors = objectPath.get(window, 'dataLayer.page.errors', []);
        const errCode = AnalyticsConstants.NOSTORE_ERROR;

        errors.push(errCode);
        setAnalyticsData('page.errors', errors);
        triggerAnalyticsEvent(AnalyticsConstants.INLINE_ERROR, { errorCode: errCode });
        this.setState({
            ...this.state,
            noSearchResults: true
        });
        this.props.dispatch({
            type: SC.STORES_SEARCH_RESPONSE_DATA,
            payload: {
                searchResponseList: []
            }
        });
        triggerAnalyticsEvent(AnalyticsConstants.SEARCH_STORES, '');
    }

    /**
     * @returns {object} Element
     */
    render() {
        const searchResultLabels = objectPath.get(this.props.aem, 'storeLocatorSearchResultLabels', {});
        const storesConfig = objectPath.get(this.props.aem, 'storesConfig', {});
        const telephoneNumber = objectPath.get(window.tiffany, 'authoredContent.noSearchConfig.telephoneNumber', '');
        const searchConfig = objectPath.get(this.props.aem, 'storeLocatorSearchBar', {});
        const isChina = objectPath.get(this.props.aem, 'isChina', false);
        const { selectedServices } = this.props.stores.storeSearchData;
        let searchResponseList = objectPath.get(this.props.stores, 'searchResponseList', []);
        const contactTiffanyRTE = {
            telephoneNumber,
            informationTextRTE: searchResultLabels.contactTiffanyLabel
        };
        const salesServiceVal = getSalesServiceCookie();
        const baiduMapsDomain = objectPath.get(storesConfig, 'baiduMapsDomain', '//api.map.baidu.com/marker');

        if (searchResponseList.length === 0 && this.state.noSearchResults) {
            const noSearchResponceList = objectPath.get(this.props.stores, 'noSearchResponceList', []);
            const storesNearBySearched = objectPath.get(this.props.stores, 'storesNearBySearched', true);

            if (!storesNearBySearched) {
                this.getLocalStores();
            } else {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        const coordinates = { lat: position.coords.latitude, lng: position.coords.longitude };

                        if (this.state.searchedLatlng.lat !== coordinates.lat || this.state.searchedLatlng.lng !== coordinates.lng) {
                            this.setLatLngRadius(coordinates, 50);
                        }
                    });
                }
                searchResponseList = noSearchResponceList;
            }
        }

        return (
            this.state.isSearched && (this.state.noSearchResults || searchResponseList.length > 0) ?
                <div className={
                    classNames('store-search-results container-centered',
                        {
                            'no-search-container': this.state.noSearchResults && searchResponseList.length === 0
                        })
                }
                >
                    {
                        this.state.noSearchResults &&
                        <div className="store-search-results__empty">
                            <p className="store-search-results__empty_heading">
                                {searchResultLabels.noResultsLabel}
                            </p>
                            <p className="store-search-results__empty_desc">
                                {searchResultLabels.assistanceCopyLabel}
                            </p>
                            <div className="store-search-results__empty_label">
                                <InformationText config={contactTiffanyRTE} />
                            </div>
                        </div>
                    }
                    {searchResponseList.length > 0 && !this.state.noSearchResults &&
                        <div className="store-search-results__heading" role="heading" aria-level="1">
                            <span className="store-search-results__heading_label">{`${searchResultLabels.resultslabel} `}</span>
                            <div className="store-search-results__heading_services">
                                {searchConfig.allowedServices.length === this.props.stores.storeSearchData.selectedServices.length &&
                                    <span>
                                        {searchConfig.serviceLabels.allServices}
                                    </span>
                                }
                                {selectedServices.length > 0 && searchConfig.allowedServices.length !== selectedServices.length &&
                                    selectedServices.map((service, index) => {
                                        return (
                                            <span>
                                                {selectedServices.length - 1 !== index &&
                                                    `${service}, `
                                                }
                                                {selectedServices.length - 1 === index &&
                                                    `${service}`
                                                }
                                            </span>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    }
                    {searchResponseList.length > 0 &&
                        <div className="store-search-results__details">
                            <div className="store-search-results__map">
                                {
                                    isChina &&
                                    <BaiduMaps
                                        mapcenter={this.state.searchedLatlng}
                                        radius={this.state.searchedRadius}
                                        searchResults={searchResponseList}
                                        markersUpdated={this.markersUpdated}
                                        markerClicked={this.markerClicked}
                                    />
                                }
                                {
                                    !isChina &&
                                    <TiffanyMaps
                                        mapcenter={this.state.searchedLatlng}
                                        radius={this.state.searchedRadius}
                                        searchResults={searchResponseList}
                                        markersUpdated={this.markersUpdated}
                                        markerClicked={this.markerClicked}
                                    />
                                }
                            </div>


                            <div className="store-search-results__stores">
                                <CustomScrollBar iosEnable>
                                    {this.state.noSearchResults &&
                                        <span className="store-search-results__stores_label">
                                            {searchResultLabels.storesNearYouLabel}
                                        </span>
                                    }
                                    <div className="store-search-results__stores_items">
                                        {
                                            searchResponseList.map((store) => {
                                                const storeSiteAttributes = objectPath.get(store, 'store.storeSiteAttributes', []);
                                                const storeSeoAttributes = objectPath.get(store, 'storeSeoAttributes', []);
                                                const {
                                                    storeHours: siteStoreHours = []
                                                } = store;
                                                const storeHours = [];

                                                const events = store.events || [];

                                                const siteAttributesIndex = 0;
                                                let storeSiteAttributesObject;
                                                let storeSeoAttributesObject = {};
                                                let filteredEvents = [];

                                                siteStoreHours.forEach((storeItem) => {
                                                    if (storeItem.storeHrSiteAttributes && storeItem.storeHrSiteAttributes.length > 0) {
                                                        storeHours.push(...storeItem.storeHrSiteAttributes);
                                                    } else {
                                                        storeHours.push(storeItem);
                                                    }
                                                });

                                                events.forEach((event) => {
                                                    if (event.siteId === parseInt(searchConfig.siteId, 10)) {
                                                        filteredEvents = filteredEvents.concat(event.events);
                                                    }
                                                });

                                                if (storeSeoAttributes.length > 0) {
                                                    storeSeoAttributesObject = storeSeoAttributes[siteAttributesIndex];
                                                }

                                                if (storeSiteAttributes.length > 0) {
                                                    storeSiteAttributesObject = storeSiteAttributes[siteAttributesIndex];
                                                } else {
                                                    storeSiteAttributesObject = store.store;
                                                }
                                                const storeMips = objectPath.get(store, 'store.mipsstoreNumber', null);

                                                return (
                                                    <div className="store-search-results__stores_item" key={storeSiteAttributesObject.storeName}>
                                                        <div className="store-search-results__stores_item-wrap">
                                                            <span className="store-search-results__stores_item-heading" role="heading" aria-level="1">
                                                                <a className="store-cta cta" tabIndex="0" href={`${searchResultLabels.storeDetailUrl}/${storeSeoAttributesObject.canonicalUrlkeyword || ''}`}>
                                                                    <span className="cta-content">
                                                                        <span className="cta-text" tabIndex="-1">
                                                                            {storeSiteAttributesObject.storeName}
                                                                        </span>
                                                                        <span className="icon-dropdown-right" />
                                                                    </span>
                                                                </a>
                                                            </span>
                                                            <p className={
                                                                classNames('store-search-results__stores_item-mips',
                                                                    {
                                                                        hide: !salesServiceVal || (!storeMips)
                                                                    })
                                                            }
                                                            >
                                                                {searchResultLabels.mipsLabel}
                                                                {storeMips}
                                                            </p>
                                                        </div>
                                                        <div className="store-search-results__stores_item-address">
                                                            <a
                                                                className="address"
                                                                href={
                                                                    isChina ?
                                                                        `${baiduMapsDomain}?location=${store.store.geoCodeLattitude.trim()},${store.store.geoCodeLongitude.trim()}&output=html&title=${storeSiteAttributesObject.storeName}` :
                                                                        `${storesConfig.googleMapsDomain}?q=${storeSiteAttributesObject.storeName}&sll=${store.store.geoCodeLattitude},${store.store.geoCodeLongitude}`}
                                                                target={storesConfig.googleMapsTarget}
                                                                tabIndex="0"
                                                            >
                                                                <span className="address_address1 cta-content">
                                                                    <span className="cta-text" tabIndex="-1">
                                                                        {storeSiteAttributesObject.address1}
                                                                    </span>
                                                                    <br />
                                                                    <span className="address_city-region-zip cta-text" tabIndex="-1">
                                                                        {`${storeSiteAttributesObject.city}, ${storeSiteAttributesObject.region} ${storeSiteAttributesObject.postalCode}`}
                                                                    </span>
                                                                </span>
                                                            </a>
                                                            <div className="contact">
                                                                {storeSiteAttributesObject.phone &&
                                                                    <div className="contact_tel">
                                                                        <a
                                                                            className="store-link tel cta"
                                                                            href={`tel: ${storeSiteAttributesObject.phone}`}
                                                                            data-interaction-context=""
                                                                            data-interaction-type={AnalyticsConstants.PHONE}
                                                                            data-interaction-name={storeSiteAttributesObject.phone}
                                                                        >
                                                                            <span className="cta-content">
                                                                                <span className="cta-text" tabIndex="-1">
                                                                                    {storeSiteAttributesObject.phone}
                                                                                </span>
                                                                            </span>
                                                                        </a>
                                                                    </div>
                                                                }
                                                                {storeSiteAttributesObject.email &&
                                                                    <div className="contact_email">
                                                                        <a
                                                                            className="store-link email"
                                                                            href={`mailto: ${storeSiteAttributesObject.email}`}
                                                                            data-interaction-context=""
                                                                            data-interaction-type={AnalyticsConstants.EMAIL}
                                                                            data-interaction-name={storeSiteAttributesObject.email}
                                                                            tabIndex="0"
                                                                        >
                                                                            <span className="cta-content">
                                                                                <span className="cta-text" tabIndex="-1">
                                                                                    {this.state.noSearchResults ? searchResultLabels.noEmailStoreLabel : searchResultLabels.emailStoreLabel}
                                                                                </span>
                                                                            </span>
                                                                        </a>
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="store-search-results__stores_item-opentime">
                                                            {
                                                                storeHours.map((storeTime, index) => {
                                                                    return (
                                                                        storeTime.storeHours ?
                                                                            <div key={storeTime.storeHourTypeId} dangerouslySetInnerHTML={{ __html: storeTime.storeHours }} /> :
                                                                            null
                                                                    );
                                                                })
                                                            }
                                                        </div>
                                                        <div key={store.store.storeId}>
                                                            {
                                                                filteredEvents.map((event) => {
                                                                    return (
                                                                        <div className="store-search-results__stores_event" key={event.eventId}>
                                                                            <Picture
                                                                                defaultSrc={`${searchResultLabels.eventsImagePrefix}${event.imagePath}`}
                                                                                altText={event.title}
                                                                                isLazyLoad={false}
                                                                                customClass="store-search-results__stores_event-image"
                                                                            />
                                                                            <div className="store-search-results__stores_event-content">
                                                                                <div className="title" role="heading" aria-level="2" dangerouslySetInnerHTML={{ __html: event.title }} />
                                                                                <div className="description" dangerouslySetInnerHTML={{ __html: event.shortDescription }} />
                                                                                <div className="event-link">
                                                                                    <a className="event-link-cta" href={`${searchResultLabels.eventsCtaUrl}${event.eventId}`} rel="noopener noreferrer" target="_blank">
                                                                                        <span className="cta-content">
                                                                                            {searchResultLabels.eventsCtaLabel}
                                                                                            <span className="icon-dropdown-right" />
                                                                                        </span>
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </CustomScrollBar>
                            </div>

                        </div>
                    }
                </div> :
                null
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        stores: state.stores,
        aem: state.aem
    };
};

StoreSearchResults.defaultProps = {
    stores: {}
};

StoreSearchResults.propTypes = {
    stores: PropTypes.object,
    aem: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(StoreSearchResults);
