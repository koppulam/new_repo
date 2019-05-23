const objectPath = require('object-path');
const $ = require('jquery');

/**
 * getAddress method returns the lattitude and longitude coordinates.
 * @param {string} address Address contains city,state or zipcode.
 * @param {string} locale contains countryCode ex: 'US,UK etc..'
 * @returns {void}
 */
function getAddress(address, locale) {
    const deferred = $.Deferred();
    let matchesCountry = false;
    let countryCode = '';
    const getGoogleAddress = () => {
        const geocoder = new window.google.maps.Geocoder();
        let request = {};

        if (locale) {
            countryCode = locale.split('_');
            countryCode = countryCode[1] || '';
        }

        if (countryCode) {
            request = {
                address,
                componentRestrictions: {
                    country: countryCode
                }
            };
        } else {
            request = {
                address
            };
        }

        geocoder.geocode(request, (results, status) => {
            const namedCountries = objectPath.get(window, 'tiffany.authoredContent.namedCountries', {});
            const countryEUObj = objectPath.get(window, 'tiffany.authoredContent.countryEUArray', {});
            let localCountry = '';
            let countryEUArray = [];

            if (countryEUObj && countryEUObj.values) {
                countryEUArray = countryEUObj.values;
            }

            if (locale) {
                localCountry = locale.split('_')[0] || '';
            }

            if (namedCountries[locale] && results.length > 0 && results[0].formatted_address) {
                // const formattedAddress = results[0].formatted_address.split(',').pop().trim(); // splitting the address and picking the last content i.e; country
                const formattedAddress = results[0].formatted_address;

                if (formattedAddress === namedCountries[locale]) {
                    matchesCountry = true;
                }
            }

            if (countryEUArray.indexOf(locale) >= 0 && !matchesCountry && namedCountries[localCountry]) {
                for (let i = 0; i < namedCountries[localCountry].length; i += 1) {
                    if (results[0].formatted_address === namedCountries[locale.split('_')[0]][i]) {
                        matchesCountry = true;
                    }
                }
            }

            if (status === 'OK') {
                if (results.length > 0) {
                    const result = results[0];

                    if (!matchesCountry) {
                        const location = objectPath.get(result, 'geometry.location');
                        const latLngObj = { lat: location.lat(), lng: location.lng() };

                        deferred.resolve(latLngObj);
                    }
                    deferred.resolve({});
                }
            } else {
                deferred.reject(`Couldnt't find the location of ${address}`);
            }
        });
    };

    if (locale) {
        countryCode = locale.split('_');
        countryCode = countryCode[1] || '';
    }

    if (window.BMap) {
        const geoc = new window.BMap.Geocoder();

        geoc.getPoint(address, (point) => {
            if (point) {
                deferred.resolve(point);
            } else if (window.google) {
                getGoogleAddress();
            } else {
                deferred.reject(`Couldnt't find the location of ${address}`);
            }
        }, () => {
            getGoogleAddress();
        });
    } else if (window.google) {
        getGoogleAddress();
    }
    return deferred.promise();
}

/**
 * @description get user location
 * @returns {void}
 */
function getUserCountry() {
    // CHECK IF BROWSER HAS HTML5 GEO LOCATION
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const googleFun = () => {
                    // GET USER CURRENT LOCATION
                    const locCurrent = new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                    // get the country name
                    const geocoder = new window.google.maps.Geocoder();

                    geocoder.geocode({ latLng: locCurrent }, (results, status) => {
                        const locItemCount = results.length;
                        const locCountryNameCount = locItemCount - 1;
                        const locCountryName = results[locCountryNameCount].formatted_address;

                        resolve(locCountryName);
                    });
                };

                if (window.BMap) {
                    const geoc = new window.BMap.Geocoder();
                    const point = new window.BMap.Point(position.coords.longitude, position.coords.latitude);

                    geoc.getLocation(point, (result) => {
                        if (result) {
                            const address = objectPath.get(result, 'address', '');
                            const countryName = address.split(',').pop().trim();

                            if (countryName) {
                                resolve(countryName);
                                return;
                            }
                            reject();
                        }
                        if (window.google) {
                            googleFun();
                        } else {
                            reject();
                        }
                    });
                } else if (window.google) {
                    googleFun();
                }
            },
            err => {
                reject(err);
            });
        }
    });
}

/**
 * @description get user location
 * @param {Number} deg degree
 * @returns {void}
 */
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

/**
 * @param {number} lat1 latitude
 * @param {number} lng1 longitude
 * @param {number} lat2 latitude
 * @param {number} lng2 longitude
 * @returns {number} distance
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    if (window.google) {
        const googleFun = window.google;
        const latlng1 = new googleFun.maps.LatLng(lat1, lng1);
        const latlng2 = new googleFun.maps.LatLng(lat2, lng2);

        return googleFun.maps.geometry.spherical.computeDistanceBetween(latlng1, latlng2);
    }

    const R = 6378137; // Radius of the earth in meters
    const latDeg1 = deg2rad(lat1);
    const lngDeg1 = deg2rad(lng1);
    const latDeg2 = deg2rad(lat2);
    const lngDeg2 = deg2rad(lng2);

    // eslint-disable-next-line no-restricted-properties
    return ((2 * Math.asin(Math.sqrt(Math.pow(Math.sin((latDeg1 - latDeg2) / 2), 2) + (Math.cos(latDeg1) * Math.cos(latDeg2) * Math.pow(Math.sin((lngDeg1 - lngDeg2) / 2), 2))))) * R);
}


/**
 * getZipCodeOrCityFromPosition from current geo location.
 * @param {string} coordinates  It contains lattitude and longitude position coordinates.
 * @param {boolean} isCity return only city name
 * @returns {void}
 */
function getZipCodeOrCityFromPosition(coordinates, isCity) {
    const deferred = $.Deferred();
    let postalCode = '';
    let city = '';
    let result = '';
    const googleFun = () => {
        const statusOk = window.google.maps.GeocoderStatus.OK;
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location: coordinates }, (results, status) => {
            if (status === statusOk) {
                for (let i = 0; i < results.length; i += 1) {
                    const types = objectPath.get(results[i], 'types');
                    const address = objectPath.get(results[i], 'address_components');

                    if ($.inArray('postal_code', types) > -1 && address.length >= 1) {
                        postalCode = objectPath.get(address[0], 'long_name');
                    }

                    if ($.inArray('locality', results[i].types) > -1 && address.length >= 1) {
                        city = objectPath.get(address[0], 'long_name');
                    }
                }

                if (isCity) {
                    deferred.resolve(city);
                }

                if (!postalCode) {
                    geocoder.geocode({ location: results[0].geometry.location }, (geoResults, geoStatus) => {
                        if (geoStatus === statusOk) {
                            for (let i = 0; i < geoResults.length; i += 1) {
                                const types = objectPath.get(geoResults[i], 'types');
                                const address = objectPath.get(geoResults[i], 'address_components');

                                if ($.inArray('postal_code', types) > -1 && address.length >= 1) {
                                    postalCode = objectPath.get(address[0], 'long_name');
                                }
                            }
                            if (!postalCode) {
                                // Postal Code Not found
                                deferred.reject('No Postal Code Found for this location');
                            } else {
                                // Postal Code found
                                result = postalCode || city;
                                deferred.resolve(postalCode);
                            }
                        }
                    });
                } else {
                    result = postalCode || city;
                    deferred.resolve(result);
                }
            } else {
                deferred.reject(`Couldnt't find the location ${coordinates}`);
            }
        });
    };

    if (window.BMap) { // Baidu maps doesn't retrieve Postal code, returns only city name
        const geoc = new window.BMap.Geocoder();
        const point = new window.BMap.Point(coordinates.lng, coordinates.lat);

        geoc.getLocation(point, (address) => {
            if (address) {
                const cityName = objectPath.get(address, 'addressComponents.city', '');

                deferred.resolve(cityName);
            } else if (window.google.maps) {
                googleFun();
            } else {
                deferred.reject();
            }
        });
    } else if (window.google.maps) {
        googleFun();
    }
    return deferred.promise();
}

module.exports = {
    getAddress,
    getZipCodeOrCityFromPosition,
    calculateDistance,
    getUserCountry
};
