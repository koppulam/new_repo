import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import find from 'lodash/find';
import MediaQuery from 'react-responsive';
import styleVariables from 'lib/utils/breakpoints';

import * as objectPath from 'object-path';
import { getSearchedStores, visibleStores } from 'actions/StoresActions';
import TiffanyMaps from 'components/containers/Maps';
import CustomDropDown from 'components/common/CustomDropDown';
import ContentTile from 'components/common/ContentTile';
import BaiduMaps from 'components/containers/Maps/BaiduMaps';

// import './index.scss';

/**
 * @description Globalflagship component
 * @class Maps
 */
class GlobalFlagShip extends React.Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.regionsRef = React.createRef();
        this.state = {
            flagShipStores: [],
            showFullMap: true,
            mapcenter: {
                lat: 0,
                lng: 0
            },
            config: this.props.aem[this.props.config],
            dropdownVisible: false,
            selectedRegionIndex: 0
        };
        this.mapcenter = {
            lat: 0,
            lng: 0
        };

        this.fetchStores();
    }

    /**
     * Dropdown toggled.
     * @returns {void} none
     */
    onDropDowntoggeled = () => {
        this.setState({
            ...this.state,
            dropdownVisible: !this.state.dropdownVisible
        });
    }

    /**
     * @param {string} storeId storeId
     * @returns {void}
     */
    markerClicked = (storeId) => {
        const searchResultLabels = objectPath.get(this.props.aem, 'storeLocatorSearchResultLabels', {});
        const { selectedRegionIndex } = this.state;
        const { stores } = this.state.flagShipStores[selectedRegionIndex];
        const store = find(stores, (item) => {
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
     * Region changed callback
     *  @param {string} selectedIndex selectedIndex
     * @returns {void} regions
     */
    regionChanged = (selectedIndex) => {
        const visibleStoresList = objectPath.get(this.state.flagShipStores, `${selectedIndex}.stores`, []);

        this.props.dispatch(visibleStores(visibleStoresList));
        this.setState({
            ...this.state,
            selectedRegionIndex: selectedIndex,
            dropdownVisible: false
        });
    }

    /**
     * Fetch stores
     * @returns {void} none
     */
    fetchStores() {
        const { regionsConfig } = this.state.config;
        const storesIdsList = [];
        const storesRegionMapping = {};
        const regionsList = {};

        for (let regionIndex = 0; regionIndex < regionsConfig.length; regionIndex += 1) {
            const { storesData } = regionsConfig[regionIndex];

            regionsList[regionIndex] = {
                stores: []
            };

            for (let cityIndex = 0; cityIndex < storesData.length; cityIndex += 1) {
                storesIdsList.push(storesData[cityIndex].id);
                storesRegionMapping[storesData[cityIndex].id] = regionIndex;
            }
        }
        const searchConfig = objectPath.get(this.props.aem, 'storeLocatorSearchBar', {});
        const request = searchConfig.storeLocatorConfig;

        request.payload = {};
        request.payload[searchConfig.payloadKeys.storeIdKey] = storesIdsList;
        request.payload[searchConfig.payloadKeys.siteIdKey] = searchConfig.siteId;

        getSearchedStores(request, []).then((results) => {
            if (results.length > 0) {
                for (let cityIndex = 0; cityIndex < results.length; cityIndex += 1) {
                    const storeobj = results[cityIndex];
                    const storeSeoAttributes = objectPath.get(storeobj, 'storeSeoAttributes', []);
                    const storeSiteAttributes = objectPath.get(storeobj, 'store.storeSiteAttributes', []);

                    if (storeSeoAttributes.length > 0) {
                        storeobj.storeUrl = storeSeoAttributes[0].canonicalUrlkeyword;
                    } else {
                        storeobj.storeUrl = '';
                    }

                    if (storeSiteAttributes.length > 0) {
                        storeobj.city = storeSiteAttributes[0].city;
                    } else {
                        storeobj.city = storeobj.store.city;
                    }

                    const { storeId } = results[cityIndex].store;
                    const regionsListPerStore = regionsList[storesRegionMapping[storeId]];

                    if (regionsListPerStore && regionsListPerStore.stores) {
                        regionsList[storesRegionMapping[storeId]].stores.push(results[cityIndex]);
                    }
                }

                this.setState({
                    ...this.state,
                    flagShipStores: regionsList
                });
            }
        }, (err) => {
        });
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const { regionsConfig } = this.state.config;
        const mobileRegionsConfig = [
            ...regionsConfig
        ];
        const searchResultLabels = objectPath.get(this.props.aem, 'storeLocatorSearchResultLabels', {});
        const initialMobileOption = { index: -1, region: 'Choose your region' };
        const isChina = objectPath.get(this.props.aem, 'isChina', false);

        mobileRegionsConfig.unshift(initialMobileOption);

        return (
            <div className="global-flagship-container container container-centered">
                <div className="content-band--70x30">
                    <div className="band-item map-band">
                        {
                            isChina &&
                            <BaiduMaps
                                radius={200}
                                showFullMap={this.state.showFullMap}
                                markerClicked={this.markerClicked}
                            />
                        }
                        {
                            !isChina &&
                            <TiffanyMaps
                                radius={200}
                                showFullMap={this.state.showFullMap}
                                markerClicked={this.markerClicked}
                            />
                        }
                    </div>
                    <div className="band-item content-band">
                        <ContentTile
                            heading={this.state.config.heading}
                            description={this.state.config.description}
                        />
                        <MediaQuery query={styleVariables.desktopAndAbove}>
                            {
                                (regionsConfig.length > 0) &&
                                <CustomDropDown
                                    title={this.state.config.chooseRegionText}
                                    options={regionsConfig}
                                    descriptionfield="region"
                                    onselect={this.regionChanged}
                                    ontoggeled={this.onDropDowntoggeled}
                                />
                            }
                        </MediaQuery>
                        <MediaQuery query={styleVariables.desktopAndBelow}>
                            {
                                (mobileRegionsConfig.length > 0) &&
                                    <CustomDropDown
                                        title={this.state.config.chooseRegionText}
                                        options={mobileRegionsConfig}
                                        descriptionfield="region"
                                        onselect={this.regionChanged}
                                        ontoggeled={this.onDropDowntoggeled}
                                        additionalOption
                                    />
                            }
                        </MediaQuery>
                        {
                            (this.props.stores.visibleStoresList.length > 0) &&
                            <div className={
                                classNames(
                                    'visible-stores-list',
                                    { hide: this.state.dropdownVisible }
                                )}
                            >
                                <ul>
                                    {
                                        this.props.stores.visibleStoresList.map((store, index) => (
                                            <li key={index.toString()}>
                                                <a href={`${searchResultLabels.storeDetailUrl}/${store.storeUrl}`}>{store.city}</a>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

GlobalFlagShip.defaultProps = {
    stores: {}
};

GlobalFlagShip.propTypes = {
    dispatch: PropTypes.func.isRequired,
    stores: PropTypes.object,
    config: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired
};

const mapStateToProps = (state) => {
    return {
        stores: state.stores,
        aem: state.aem
    };
};

export default connect(mapStateToProps)(GlobalFlagShip);
