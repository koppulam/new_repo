import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as objectPath from 'object-path';

// import './index.scss';

/**
 * @description Browse Maps component
 * @class Maps
 */
class BaiduMaps extends React.Component {
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
        const point = new window.BMap.Point(mapcenterlng, mapcenterlat);

        const mapStylers = [
            {
                featureType: 'districtlabel',
                elementType: 'labels.text.fill',
                stylers: {
                    color: '#000000ff',
                    visibility: 'on'
                }
            },
            {
                featureType: 'land',
                elementType: 'all',
                stylers: {
                    color: '#f5f5f2ff'
                }
            },
            {
                featureType: 'all',
                elementType: 'labels.icon',
                stylers: {
                    visibility: 'off'
                }
            },
            {
                featureType: 'local',
                elementType: 'all',
                stylers: {
                    visibility: 'off'
                }
            },
            {
                featureType: 'highway',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#ffffffff'
                }
            },
            {
                featureType: 'highway',
                elementType: 'labels.text.fill',
                stylers: {
                    color: '#4e4e4eff',
                    weight: '0.6'
                }
            },
            {
                featureType: 'arterial',
                elementType: 'labels.text.fill',
                stylers: {
                    color: '#787878ff',
                    visibility: 'on'
                }
            },
            {
                featureType: 'arterial',
                elementType: 'all',
                stylers: {
                    color: '#ffffffff',
                    weight: '0.1',
                    visibility: 'on'
                }
            },
            {
                featureType: 'airportlabel',
                elementType: 'labels.icon',
                stylers: {
                    hue: '#0a00ff',
                    saturation: -77
                }
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: {
                    color: '#eaf6f8ff',
                    visibility: 'on'
                }
            },
            {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#c7ecedff',
                    visibility: 'on'
                }
            },
            {
                featureType: 'railway',
                elementType: 'all',
                stylers: {
                    visibility: 'off'
                }
            },
            {
                featureType: 'highway',
                elementType: 'all',
                stylers: {
                    color: '#ffffffff',
                    visibility: 'on'
                }
            },
            {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: {
                    color: '#000000ff',
                    hue: '#000000',
                    visibility: 'on'
                }
            },
            {
                featureType: 'road',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            },
            {
                featureType: 'boundary',
                elementType: 'geometry.fill',
                stylers: {
                    weight: '0.1',
                    visibility: 'on'
                }
            },
            {
                featureType: 'boundary',
                elementType: 'geometry.stroke',
                stylers: {
                    weight: '0',
                    visibility: 'on'
                }
            },
            {
                featureType: 'green',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#bae5ceff',
                    visibility: 'on'
                }
            }
        ];

        this.map = new window.BMap.Map(this.mapRef.current);
        this.map.setMapStyle({
            styleJson: mapStylers
        });
        this.map.centerAndZoom(point, 6);
        if (this.props.showFullMap) {
            this.map.setZoom(2);
        }
        this.zoomedOrDragged = false;
        // this.map.addControl(new window.BMap.NavigationControl(
        //     {
        //         anchor: window.BMAP_ANCHOR_BOTTOM_RIGHT,
        //         type: window.BMAP_NAVIGATION_CONTROL_ZOOM
        //     }
        // ));

        /**
         * @returns {void}
         */
        function FullScreenControl() {
            this.defaultAnchor = 1;
            this.defaultOffset = new window.BMap.Size(10, 10);
        }

        FullScreenControl.prototype = new window.BMap.Control();

        FullScreenControl.prototype.initialize = (map) => {
            const div = document.createElement('div');

            // using google used svg for full screen icon
            div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path fill="#666" d="M0,0v2v4h2V2h4V0H2H0z M16,0h-4v2h4v4h2V2V0H16z M16,16h-4v2h4h2v-2v-4h-2V16z M2,12H0v4v2h2h4v-2H2V12z"/></svg>';
            div.style.cursor = 'pointer';
            div.style.backgroundColor = 'white';
            div.setAttribute('class', 'baidu-map-full-screen');

            div.onclick = (e) => {
                if (
                    document.fullscreenElement ||
                    document.webkitFullscreenElement ||
                    document.mozFullScreenElement ||
                    document.msFullscreenElement
                ) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    const element = this.mapRef.current;

                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.webkitRequestFullscreen) {
                        element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    } else if (element.msRequestFullscreen) {
                        element.msRequestFullscreen();
                    }
                }
            };

            map.getContainer().appendChild(div);
            return div;
        };

        /**
         * @returns {void}
         */
        function ZoomControl() {
            this.defaultAnchor = 3;
            this.defaultOffset = new window.BMap.Size(10, 10);
        }

        ZoomControl.prototype = new window.BMap.Control();

        ZoomControl.prototype.initialize = (map) => {
            const div = document.createElement('div');
            const zoomIn = document.createElement('div');
            const seperator = document.createElement('div');
            const zoomOut = document.createElement('div');

            div.style.cursor = 'pointer';
            div.style.backgroundColor = 'white';
            div.setAttribute('class', 'baidu-zoom');
            zoomIn.setAttribute('class', 'baidu-zoom-in');
            zoomOut.setAttribute('class', 'baidu-zoom-out');
            seperator.setAttribute('class', 'baidu-zoom-seperator');

            // using google used svg for full screen icon
            zoomIn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><polygon fill="#666" points="18,7 11,7 11,0 7,0 7,7 0,7 0,11 7,11 7,18 11,18 11,11 18,11"/></svg>';

            zoomIn.onclick = (e) => {
                this.map.setZoom(this.map.getZoom() + 1);
            };

            zoomOut.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path fill="#666" d="M0,7h18v4H0V7z"/></svg>';

            zoomOut.onclick = (e) => {
                this.map.setZoom(this.map.getZoom() - 1);
            };

            div.appendChild(zoomIn);
            div.appendChild(seperator);
            div.appendChild(zoomOut);

            map.getContainer().appendChild(div);
            return div;
        };

        this.map.addControl(new FullScreenControl(
            {
                anchor: window.BMAP_ANCHOR_TOP_RIGHT
            }
        ));

        this.map.addControl(new ZoomControl(
            {
                anchor: window.BMAP_ANCHOR_BOTTOM_RIGHT
            }
        ));

        if (this.props.markeratlng) {
            this.createMarker();
        } else {
            this.addMapListeners();
        }
        // this.mapsAda();
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
                    const pinIcon = new window.BMap.Icon(pinImage, new window.BMap.Size(32, 41));


                    for (let storeIndex = 0; storeIndex < storesLength; storeIndex += 1) {
                        if (stores[storeIndex].store && stores[storeIndex].store.geoCodeLattitude && stores[storeIndex].store.geoCodeLongitude) {
                            const point = new window.BMap.Point(parseFloat(stores[storeIndex].store.geoCodeLongitude), parseFloat(stores[storeIndex].store.geoCodeLattitude));

                            this.markers[stores[storeIndex].store.storeId] = {
                                marker: new window.BMap.Marker(point, { icon: pinIcon })
                            };
                        }
                    }
                }

                this.clearMapListeners();
                if (window.Bmap && this.props.mapcenter && this.map) {
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
            if (nextProps.searchResults.length > 0) {
                this.clearMapListeners();
                setTimeout(() => {
                    this.updateMarkers(nextProps.searchResults);
                    setTimeout(() => {
                        this.addMapListeners();
                    }, 100);
                }, 100);
            }
            if (nextProps.mapcenter.lat !== this.props.mapcenter.lat || nextProps.mapcenter.lng !== this.props.mapcenter.lng) {
                this.clearMapListeners();
                const radiusKm = nextProps.radius * 1609.0;
                const circ = new window.BMap.Circle(
                    new window.BMap.Point(parseFloat(nextProps.mapcenter.lng), parseFloat(nextProps.mapcenter.lat)),
                    radiusKm,
                    {
                        strokeColor: 'transparant',
                        fillColor: 'none'
                    }
                );

                setTimeout(() => {
                    this.map.addOverlay(circ);
                    this.zoomedOrDragged = false;
                    this.fitBounds(circ.getBounds());
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
                this.zoomListener = this.map.addEventListener('zoomend', () => {
                    this.updateVisibleStores();
                });
            }
            if (!this.dragListener) {
                this.dragListener = this.map.addEventListener('dragend', () => {
                    this.updateVisibleStores();
                });
            }
        }
    }

    /**
     * @description Add map listeners
     * @param {Object} circleBounds map bounds of circle
     * @returns {void}
     */
    fitBounds(circleBounds) {
        const circleBoundsSW = circleBounds.getSouthWest();
        const circleBoundsNE = circleBounds.getNorthEast();

        setTimeout(() => {
            this.map.setViewport([
                circleBoundsSW,
                circleBoundsNE
            ]);
        }, 1);
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
    // mapsAda() {
    //     window.google.maps.event.addListenerOnce(this.map, 'idle', () => {
    //         this.updateMapTitle();
    //     });
    //     window.google.maps.event.addListener(this.map, 'tilesloaded', () => {
    //         this.toggleFullScreen();
    //     });
    // }

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
                } else {
                    fullScreenButton[0].parentElement.title = 'toggle full screen view on';
                    fullScreenButton[0].parentElement.setAttribute('aria-label', 'toggle full screen view on');
                }
            }
        }
    }

    /**
     * @description Update visible stores
     * @returns {void}
     */
    updateVisibleStores() {
        if (!this.props.showFullMap && this.zoomedOrDragged) {
            const currentBounds = this.map.getBounds();

            const stores = this.props.stores.storesList;
            const storesLength = stores.length;
            const visibleStoresList = [];
            const visibleStores = [];

            for (let storeIndex = 0; storeIndex < storesLength; storeIndex += 1) {
                const tempLocation = stores[storeIndex];

                const point = new window.BMap.Point(parseFloat(tempLocation.store.geoCodeLongitude), parseFloat(tempLocation.store.geoCodeLattitude));

                if (currentBounds.containsPoint(point) === true) {
                    visibleStoresList.push(tempLocation.store.storeId);
                    visibleStores.push(tempLocation);
                }
            }

            this.updateMarkers(visibleStores);
            this.props.markersUpdated(visibleStoresList);
        } else {
            this.zoomedOrDragged = true;
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
        const point = new window.BMap.Point(parseFloat(lng), parseFloat(lat));

        const pinIcon = new window.BMap.Icon(pinImage, new window.BMap.Size(32, 41));

        const marker = new window.BMap.Marker(point, { icon: pinIcon });

        this.map.addOverlay(marker);
    }

    /**
     * Render Component.
     * @returns {void} html instance
     */
    resetMarkes() {
        const stores = this.props.stores.storesList;

        for (let visibleIndex = 0; visibleIndex < stores.length; visibleIndex += 1) {
            if (this.markers[stores[visibleIndex].store.storeId] && this.map) {
                this.map.removeOverlay(this.markers[stores[visibleIndex].store.storeId].marker);
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
                    const pinImage = objectPath.get(window, 'tiffany.authoredContent.pinImage', '');
                    const pinIcon = new window.BMap.Icon(pinImage, new window.BMap.Size(32, 41));
                    const point = new window.BMap.Point(parseFloat(visibleStoresList[visibleIndex].store.geoCodeLongitude), parseFloat(visibleStoresList[visibleIndex].store.geoCodeLattitude));

                    markers = new window.BMap.Marker(point, { icon: pinIcon });
                } else {
                    markers = this.markers[storeId].marker;
                }

                if (!markers.map) {
                    this.map.addOverlay(markers);
                    visibleMarkers.push(markers.point);

                    this.markers[storeId].marker.addEventListener('click', (event) => {
                        console.log(event);
                        const { point } = event.target;
                        const lat = Math.round(point.lat * decimalLength) / decimalLength;
                        const lng = Math.round(point.lng * decimalLength) / decimalLength;
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
            if (visibleMarkers.length > 0) {
                this.map.setViewport(visibleMarkers);
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

BaiduMaps.propTypes = {
    stores: PropTypes.object,
    radius: PropTypes.number,
    visibleStoresList: PropTypes.array,
    mapcenter: PropTypes.object,
    showFullMap: PropTypes.bool,
    searchResults: PropTypes.array,
    markersUpdated: PropTypes.func,
    markeratlat: PropTypes.string,
    markeratlng: PropTypes.string,
    markerClicked: PropTypes.func
};

BaiduMaps.defaultProps = {
    stores: {},
    radius: defaultRadius,
    visibleStoresList: [],
    mapcenter: defaultmapcenter,
    showFullMap: false,
    searchResults: [],
    markersUpdated: () => {},
    markeratlat: '',
    markeratlng: '',
    markerClicked: () => {}
};

const mapStateToProps = (state) => {
    return {
        stores: state.stores,
        visibleStoresList: state.stores.visibleStoresList
    };
};

export default connect(mapStateToProps)(BaiduMaps);
