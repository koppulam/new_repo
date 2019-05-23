import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as objectPath from 'object-path';

// import './index.scss';

/**
 * @description Browse Maps component
 * @class Maps
 */
class TiffanyMaps extends React.Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.map = {};
        this.markers = {};
        this.markersInitialized = false;
        this.mapRef = React.createRef();
        this.zoomListener = null;
        this.dragListener = null;
        // this.currentVisibleStoresList = [];
        this.state = {
            currentVisibleStoresList: []
        };
    }

    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentDidMount() {
        let mapcenterlat = this.props.mapcenter.lat;
        let mapcenterlng = this.props.mapcenter.lng;

        if (this.props.markeratlat && this.props.markeratlng) {
            mapcenterlat = parseFloat(this.props.markeratlat);
            mapcenterlng = parseFloat(this.props.markeratlng);
        }

        const mapOptions = {
            zoom: parseInt(this.props.zoomlevel, 10),
            center: new window.google.maps.LatLng(mapcenterlat, mapcenterlng),
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false,
            styles: [
                {
                    featureType: 'administrative',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#000000'
                        }
                    ]
                },
                {
                    featureType: 'administrative.province',
                    elementType: 'geometry.stroke',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                },
                {
                    featureType: 'landscape',
                    elementType: 'geometry',
                    stylers: [
                        {
                            lightness: '0'
                        },
                        {
                            saturation: '0'
                        },
                        {
                            color: '#f5f5f2'
                        },
                        {
                            gamma: '1'
                        }
                    ]
                },
                {
                    featureType: 'landscape.man_made',
                    elementType: 'all',
                    stylers: [
                        {
                            lightness: '-3'
                        },
                        {
                            gamma: '1.00'
                        }
                    ]
                },
                {
                    featureType: 'landscape.natural.terrain',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                },
                {
                    featureType: 'poi',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'geometry.fill',
                    stylers: [
                        {
                            color: '#bae5ce'
                        },
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'road',
                    elementType: 'all',
                    stylers: [
                        {
                            saturation: -100
                        },
                        {
                            lightness: 45
                        },
                        {
                            visibility: 'simplified'
                        }
                    ]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'simplified'
                        }
                    ]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry.fill',
                    stylers: [
                        {
                            color: '#ffffff'
                        },
                        {
                            visibility: 'simplified'
                        }
                    ]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'labels.text',
                    stylers: [
                        {
                            color: '#4e4e4e'
                        }
                    ]
                },
                {
                    featureType: 'road.arterial',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#787878'
                        }
                    ]
                },
                {
                    featureType: 'road.arterial',
                    elementType: 'labels.icon',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                },
                {
                    featureType: 'transit',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                },
                {
                    featureType: 'transit.station.airport',
                    elementType: 'labels.icon',
                    stylers: [
                        {
                            hue: '#0a00ff'
                        },
                        {
                            saturation: '-77'
                        },
                        {
                            gamma: '0.57'
                        },
                        {
                            lightness: '0'
                        }
                    ]
                },
                {
                    featureType: 'transit.station.rail',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#43321e'
                        }
                    ]
                },
                {
                    featureType: 'transit.station.rail',
                    elementType: 'labels.icon',
                    stylers: [
                        {
                            hue: '#ff6c00'
                        },
                        {
                            lightness: '4'
                        },
                        {
                            gamma: '0.75'
                        },
                        {
                            saturation: '-68'
                        }
                    ]
                },
                {
                    featureType: 'water',
                    elementType: 'all',
                    stylers: [
                        {
                            color: '#eaf6f8'
                        },
                        {
                            visibility: 'on'
                        }
                    ]
                },
                {
                    featureType: 'water',
                    elementType: 'geometry.fill',
                    stylers: [
                        {
                            color: '#c7eced'
                        }
                    ]
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#000000'
                        }
                    ]
                }
            ]
        };

        this.map = new window.google.maps.Map(this.mapRef.current, mapOptions);

        if (this.props.markeratlng) {
            this.createMarker();
        } else {
            this.addMapListeners();
        }
        this.mapsAda();
    }

    /**
     * Lifcycle hook
     * @param {*} nextProps changed props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (!this.props.markeratlng) {
            if (!this.markersInitialized) {
                this.markersInitialized = true;
                const stores = nextProps.stores.storesList;

                if (stores && stores.length > 0) {
                    const storesLength = stores.length;
                    const pinImage = objectPath.get(window, 'tiffany.authoredContent.pinImage');

                    for (let storeIndex = 0; storeIndex < storesLength; storeIndex += 1) {
                        if (stores[storeIndex].store && stores[storeIndex].store.geoCodeLattitude && stores[storeIndex].store.geoCodeLongitude) {
                            this.markers[stores[storeIndex].store.storeId] = {
                                marker: new window.google.maps.Marker({
                                    position: {
                                        lat: parseFloat(stores[storeIndex].store.geoCodeLattitude),
                                        lng: parseFloat(stores[storeIndex].store.geoCodeLongitude)
                                    },
                                    icon: {
                                        url: pinImage,
                                        scaledSize: {
                                            width: 24,
                                            height: 32
                                        }
                                    }
                                })
                            };
                        }
                    }
                }

                this.clearMapListeners();
                if (window.google && this.props.mapcenter) {
                    if (this.props.showFullMap) {
                        this.map.setZoom(2);
                    }
                }
            }
            if (nextProps.stores.visibleStoresList !== this.props.stores.visibleStoresList && nextProps.stores.visibleStoresList.length > 0) {
                this.clearMapListeners();
                setTimeout(() => {
                    this.updateMarkers(nextProps.stores.visibleStoresList);
                }, 100);
            }
            if (nextProps.mapcenter.lat !== this.props.mapcenter.lat && nextProps.mapcenter.lng !== this.props.mapcenter.lng) {
                this.clearMapListeners();
                const circ = new window.google.maps.Circle();
                const radiusKm = nextProps.radius * 1609.0;

                setTimeout(() => {
                    circ.setRadius(radiusKm);
                    circ.setCenter(new window.google.maps.LatLng(nextProps.mapcenter.lat, nextProps.mapcenter.lng));
                    this.map.setCenter(new window.google.maps.LatLng(nextProps.mapcenter.lat, nextProps.mapcenter.lng));
                    this.map.fitBounds(circ.getBounds());
                    setTimeout(() => {
                        this.addMapListeners();
                    }, 100);
                }, 100);
            }
            if (nextProps.searchResults.length > 0) {
                this.clearMapListeners();
                setTimeout(() => {
                    this.updateMarkers(nextProps.searchResults);
                    setTimeout(() => {
                        this.addMapListeners();
                    }, 100);
                }, 100);
            }
        }
    }

    /**
     * @description Add map listeners
     * @returns {void}
     */
    addMapListeners() {
        if (!this.props.showFullMap) {
            if (!this.zoomListener) {
                this.zoomListener = window.google.maps.event.addDomListener(this.map, 'zoom_changed', () => {
                    this.updateVisibleStores();
                });
            }
            if (!this.dragListener) {
                this.dragListener = window.google.maps.event.addListener(this.map, 'dragend', () => {
                    this.updateVisibleStores();
                });
            }
        }
    }

    /**
     * @description Remove map listeners
     * @returns {void}
     */
    clearMapListeners() {
        if (!this.props.showFullMap && this.zoomListener && this.zoomListener.remove && this.dragListener.remove) {
            this.zoomListener.remove();
            this.dragListener.remove();
            this.zoomListener = null;
            this.dragListener = null;
        }
    }

    /**
     * @description Updates maps ada
     * @returns {void}
     */
    mapsAda() {
        window.google.maps.event.addListenerOnce(this.map, 'idle', () => {
            this.updateMapTitle();
        });
        window.google.maps.event.addListener(this.map, 'tilesloaded', () => {
            setTimeout(() => {
                this.toggleFullScreen();
            }, 100);
        });
        window.google.maps.event.addListener(this.map, 'bounds_changed', () => {
            this.toggleFullScreen();
        });
    }

    /**
     * @description Updates maps Title
     * @returns {void}
     */
    updateMapTitle() {
        if (this.mapRef && this.mapRef.current) {
            const iframe = this.mapRef.current.getElementsByTagName('iframe');

            if (iframe && iframe.length > 0) {
                iframe[0].title = 'Tiffany Maps';
            }

            this.toggleFullScreen();
        }
    }

    /**
     * @description toggle map full screen
     * @returns {void}
     */
    toggleFullScreen() {
        if (this.mapRef && this.mapRef.current) {
            const fullScreenButton = this.mapRef.current.getElementsByClassName('gm-fullscreen-control');

            if (fullScreenButton && fullScreenButton.length > 0) {
                const iframe = this.mapRef.current.getElementsByTagName('iframe');

                if (iframe && iframe.length > 0 &&
                    iframe[0].offsetHeight === window.innerHeight
                ) {
                    fullScreenButton[0].parentElement.title = 'toggle full screen view off';
                    fullScreenButton[0].parentElement.setAttribute('aria-label', 'toggle full screen view off');
                    fullScreenButton[0].title = 'Toggle full screen view off';
                    fullScreenButton[0].setAttribute('aria-label', 'Toggle full screen view off');
                } else {
                    fullScreenButton[0].parentElement.title = 'toggle full screen view on';
                    fullScreenButton[0].parentElement.setAttribute('aria-label', 'toggle full screen view on');
                    fullScreenButton[0].title = 'Toggle full screen view on';
                    fullScreenButton[0].setAttribute('aria-label', 'Toggle full screen view on');
                }
            }
        }
    }

    /**
     * @description Update visible stores
     * @returns {void}
     */
    updateVisibleStores() {
        if (!this.props.showFullMap) {
            const currentBounds = this.map.getBounds();

            const stores = this.props.stores.storesList;
            const storesLength = stores.length;
            const visibleStoresList = [];

            for (let storeIndex = 0; storeIndex < storesLength; storeIndex += 1) {
                const tempLocation = stores[storeIndex];

                const point = new window.google.maps.LatLng(parseFloat(tempLocation.store.geoCodeLattitude), parseFloat(tempLocation.store.geoCodeLongitude));

                if (currentBounds.contains(point) === true) {
                    visibleStoresList.push(tempLocation.store.storeId);
                }
            }

            this.props.markersUpdated(visibleStoresList);
        }
    }

    /**
     * Creates marker at given point
     * @param {object} latlng latlng
     * @returns {void}
     */
    createMarker() {
        const pinImage = objectPath.get(window, 'tiffany.authoredContent.pinImage');
        const lat = this.props.markeratlat;
        const lng = this.props.markeratlng;

        const markerTemp = new window.google.maps.Marker({
            position: {
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            },
            icon: {
                url: pinImage,
                scaledSize: {
                    width: 24,
                    height: 32
                }
            },
            map: this.map
        });

        console.log(markerTemp);
    }

    /**
     * Render Component.
     * @returns {void} html instance
     */
    resetMarkes() {
        const stores = this.props.stores.storesList;

        for (let visibleIndex = 0; visibleIndex < stores.length; visibleIndex += 1) {
            if (this.markers[stores[visibleIndex].store.storeId]) {
                this.markers[stores[visibleIndex].store.storeId].marker.setMap(null);
            }
        }
    }

    /**
     * Render Component.
     * @param {oject} visibleStoresList visibleStoresList
     * @returns {void} html instance
     */
    updateMarkers(visibleStoresList) {
        this.setState({
            ...this.state,
            currentVisibleStoresList: visibleStoresList
        });
        const visibleMarkers = [];
        const decimalLength = 100000;

        this.resetMarkes();

        if (visibleStoresList && visibleStoresList.length > 0) {
            for (let visibleIndex = 0; visibleIndex < visibleStoresList.length; visibleIndex += 1) {
                const { storeId } = visibleStoresList[visibleIndex].store;
                let markers;

                if (!(this.markers[storeId] && this.markers[storeId].marker)) {
                    const pinImage = objectPath.get(window, 'tiffany.authoredContent.pinImage');

                    markers = new window.google.maps.Marker({
                        position: {
                            lat: parseFloat(visibleStoresList[visibleIndex].store.geoCodeLattitude),
                            lng: parseFloat(visibleStoresList[visibleIndex].store.geoCodeLongitude)
                        },
                        icon: {
                            url: pinImage,
                            scaledSize: {
                                width: 24,
                                height: 32
                            }
                        }
                    });

                    this.markers[storeId] = {
                        marker: markers
                    };
                } else {
                    markers = this.markers[storeId].marker;
                }

                if (!markers.map) {
                    markers.setMap(this.map);
                    visibleMarkers.push(markers);

                    this.markers[storeId].marker.addListener('click', (event) => {
                        const { latLng } = event;
                        const lat = Math.round(latLng.lat() * decimalLength) / decimalLength;
                        const lng = Math.round(latLng.lng() * decimalLength) / decimalLength;
                        const { currentVisibleStoresList } = this.state;

                        for (let visibleMarkerIndex = 0; visibleMarkerIndex < currentVisibleStoresList.length; visibleMarkerIndex += 1) {
                            let visibleLat = parseFloat(currentVisibleStoresList[visibleMarkerIndex].store.geoCodeLattitude);
                            let visibleLng = parseFloat(currentVisibleStoresList[visibleMarkerIndex].store.geoCodeLongitude);

                            visibleLat = Math.round(visibleLat * decimalLength) / decimalLength;
                            visibleLng = Math.round(visibleLng * decimalLength) / decimalLength;

                            if (lat === visibleLat && lng === visibleLng) {
                                this.props.markerClicked(currentVisibleStoresList[visibleMarkerIndex].store.storeId);
                                break;
                            }
                        }
                    });
                }
            }
        }

        if (this.props.showFullMap) {
            const bounds = new window.google.maps.LatLngBounds();

            if (visibleMarkers.length > 0) {
                for (let visibleMarkerIndex = 0; visibleMarkerIndex < visibleMarkers.length; visibleMarkerIndex += 1) {
                    bounds.extend(visibleMarkers[visibleMarkerIndex].getPosition());
                }
            }
            if (this.map && this.map.fitBounds && bounds) {
                this.map.fitBounds(bounds);
            }
            if (visibleMarkers.length === 1) {
                this.map.setZoom(15);
            }
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        return (
            <div className="map-container">
                <div ref={this.mapRef} className="locator_map" role="button" tabIndex="0" />
            </div>
        );
    }
}

const defaultRadius = objectPath.get(window, 'tiffany.authoredContent.storesConfig.defaultMapRadius');
const defaultmapcenter = objectPath.get(window, 'tiffany.authoredContent.storesConfig.defaultMapCenter');

TiffanyMaps.propTypes = {
    stores: PropTypes.object,
    radius: PropTypes.number,
    visibleStoresList: PropTypes.array,
    mapcenter: PropTypes.object,
    showFullMap: PropTypes.bool,
    searchResults: PropTypes.array,
    markersUpdated: PropTypes.func,
    markeratlat: PropTypes.string,
    markeratlng: PropTypes.string,
    markerClicked: PropTypes.func,
    zoomlevel: PropTypes.string
};

TiffanyMaps.defaultProps = {
    stores: {},
    radius: defaultRadius,
    visibleStoresList: [],
    mapcenter: defaultmapcenter,
    showFullMap: false,
    searchResults: [],
    markersUpdated: () => {},
    markeratlat: '',
    markeratlng: '',
    markerClicked: () => {},
    zoomlevel: '14'
};

const mapStateToProps = (state) => {
    return {
        stores: state.stores,
        visibleStoresList: state.stores.visibleStoresList
    };
};

export default connect(mapStateToProps)(TiffanyMaps);
