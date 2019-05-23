/**
 * Find a store Util
 *
 */

'use strict';

const $ = require('jquery');

const customEventTrigger = require('lib/events/custom-event-trigger');

const forEach = require('lodash/forEach');

const cookieUtil = require('./cookies');

const objectPath = require('object-path');


/**
 * StoreLocationsModel
 * @returns {void}
 */
function StoreLocationsModel() {
    this.innerThresholdRadius = 20000;
    // this.outerThresholdRadius = 1400000;
    // this.searchGeocodeLat = 0;
    // this.searchGeocodeLong = 0;
    this.storeLocations = null;
    // this.currentLat = 0;
    // this.currentLng = 0;
    // this.DEGREES_LAT_PER_PX = 0.90166083;
    // this.DEGREES_LNG_PER_PX = 1.659375;
    // this.stateAbbrMap = {};
    // this.stateAbbrMap.al = "Alabama";
    // this.stateAbbrMap.ak = "Alaska";
    // this.stateAbbrMap.as = "American Samoa";
    // this.stateAbbrMap.az = "Arizona";
    // this.stateAbbrMap.ar = "Arkansas";
    // this.stateAbbrMap.ca = "California";
    // this.stateAbbrMap.co = "Colorado";
    // this.stateAbbrMap.ct = "Connecticut";
    // this.stateAbbrMap.de = "Delaware";
    // this.stateAbbrMap.dc = "District of Columbia";
    // this.stateAbbrMap.fm = "Federated States of Micronesia";
    // this.stateAbbrMap.fl = "Florida";
    // this.stateAbbrMap.ga = "Georgia";
    // this.stateAbbrMap.gu = "Guam";
    // this.stateAbbrMap.hi = "Hawaii";
    // this.stateAbbrMap.id = "Idaho";
    // this.stateAbbrMap.il = "Illinois";
    // this.stateAbbrMap["in"] = "Indiana";
    // this.stateAbbrMap.ia = "Iowa";
    // this.stateAbbrMap.ks = "Kansas";
    // this.stateAbbrMap.ky = "Kentucky";
    // this.stateAbbrMap.la = "Louisiana";
    // this.stateAbbrMap.me = "Maine";
    // this.stateAbbrMap.mh = "Marshall Islands";
    // this.stateAbbrMap.md = "Maryland";
    // this.stateAbbrMap.ma = "Massachusetts";
    // this.stateAbbrMap.mi = "Michigan";
    // this.stateAbbrMap.mn = "Minnesota";
    // this.stateAbbrMap.ms = "Mississippi";
    // this.stateAbbrMap.mo = "Missouri";
    // this.stateAbbrMap.mt = "Montana";
    // this.stateAbbrMap.ne = "Nebraska";
    // this.stateAbbrMap.nv = "Nevada";
    // this.stateAbbrMap.nh = "New Hampshire";
    // this.stateAbbrMap.nj = "New Jersey";
    // this.stateAbbrMap.nm = "New Mexico";
    // this.stateAbbrMap.ny = "New York";
    // this.stateAbbrMap.nc = "North Carolina";
    // this.stateAbbrMap.nd = "North Dakota";
    // this.stateAbbrMap.mp = "Northern Mariana Islands";
    // this.stateAbbrMap.oh = "Ohio";
    // this.stateAbbrMap.ok = "Oklahoma";
    // this.stateAbbrMap.or = "Oregon";
    // this.stateAbbrMap.pw = "Palau";
    // this.stateAbbrMap.pa = "Pennsylvania";
    // this.stateAbbrMap.pr = "Puerto Rico";
    // this.stateAbbrMap.ri = "Rhode Island";
    // this.stateAbbrMap.sc = "South Carolina";
    // this.stateAbbrMap.sd = "South Dakota";
    // this.stateAbbrMap.tn = "Tennessee";
    // this.stateAbbrMap.tx = "Texas";
    // this.stateAbbrMap.ut = "Utah";
    // this.stateAbbrMap.vt = "Vermont";
    // this.stateAbbrMap.vi = "Virgin Islands";
    // this.stateAbbrMap.va = "Virginia";
    // this.stateAbbrMap.wa = "Washington";
    // this.stateAbbrMap.wv = "West Virginia";
    // this.stateAbbrMap.wi = "Wisconsin";
    // this.stateAbbrMap.wy = "Wyoming";
    // this.stateAbbrMap.ab = "Alberta";
    // this.stateAbbrMap.bc = "British Columbia";
    // this.stateAbbrMap.mb = "Manitoba";
    // this.stateAbbrMap.nb = "New Brunswick";
    // this.stateAbbrMap.nl = "Newfoundland and Labrador";
    // this.stateAbbrMap.nt = "Northwest Territories";
    // this.stateAbbrMap.ns = "Nova Scotia";
    // this.stateAbbrMap.nu = "Nunavut";
    // this.stateAbbrMap.on = "Ontario";
    // this.stateAbbrMap.pe = "Prince Edward Island";
    // this.stateAbbrMap.qc = "Quebec";
    // this.stateAbbrMap.sk = "Saskatchewan";
    // this.stateAbbrMap.yt = "Yukon";
    this.pStoreLocationsHash = {};
}

/**
 * StoreLocationsModel getInstance
 * @returns {void}
 */
StoreLocationsModel.getInstance = function() {
    if (!this.pInstance) {
        this.pInstance = new StoreLocationsModel();
    }
    return this.pInstance;
};

/**
 * StoreLocationsModel setStoreLocations
 * @returns {void}
 * @param {Array} locationsArray locations Array
 */
StoreLocationsModel.prototype.setStoreLocations = function(locationsArray) {
    this.storeLocations = locationsArray;
    // var address = "";
    // var addressEscaped = "";
    // var numEvents;
    // var startDate;
    // var endDate;
    // var i;
    // var numLocations = locationsArray.length;
    // var tempLocation;
    // for (var i = 0; i < numLocations; i++) {
    //     tempLocation = locationsArray[i];
    //     if (tempLocation.IsAddressEnglish == false && locale == 'ja-JP') {
    //         if (tempLocation.Zip != null && tempLocation.Zip != "") {
    //             address = tempLocation.Zip;
    //         }
    //         if (tempLocation.State != null && tempLocation.State != "") {
    //             address += "<br />" + tempLocation.State;
    //         }
    //         if (tempLocation.City != null && tempLocation.City != "") {
    //             address += " " + tempLocation.City;
    //             address += " " + tempLocation.Address1;
    //         }
    //         if (tempLocation.Address2 != null && tempLocation.Address2 != "" && tempLocation.Address2 != " ") {
    //             address += "<br />" + tempLocation.Address2;
    //         }
    //         if (tempLocation.Address3 != null && tempLocation.Address3 != "" && tempLocation.Address3 != " ") {
    //             address += " " + tempLocation.Address3;
    //         }
    //         addressEscaped = address;
    //         if (tempLocation.Phone != null && tempLocation.Phone != "") {
    //             address += "<br /><a href='tel:" + tempLocation.Phone + "'>" + tempLocation.Phone + "</a>";
    //         }
    //     } else {
    //         address = tempLocation.Address1;
    //         if (tempLocation.Address2 != null && tempLocation.Address2 != "" && tempLocation.Address2 != " ") {
    //             address += "<br />" + tempLocation.Address2;
    //         }
    //         if (tempLocation.Address3 != null && tempLocation.Address3 != "" && tempLocation.Address3 != " ") {
    //             address += "<br />" + tempLocation.Address3;
    //         }
    //         if (tempLocation.City != null && tempLocation.City != "") {
    //             address += "<br />" + tempLocation.City;
    //         }
    //         if (tempLocation.State != null && tempLocation.State != "") {
    //             address += ", " + tempLocation.State;
    //         }
    //         if (tempLocation.Zip != null && tempLocation.Zip != "") {
    //             address += " " + tempLocation.Zip;
    //         }
    //         addressEscaped = address;
    //         if (tempLocation.Phone != null && tempLocation.Phone != "") {
    //             address += "<br /><a href='tel:" + tempLocation.Phone + "'>" + tempLocation.Phone + "</a>";
    //         }
    //         addressEscaped = addressEscaped ? addressEscaped : '';
    //     }
    //     tempLocation.Address = address;
    //     tempLocation.AddressEscaped = addressEscaped.split("<br />").join(", ").split(" ").join("+").split("&").join("%26");
    //     tempLocation.Distance = 0;
    //     tempLocation.DistanceConverted = "";
    //     tempLocation.NameEscaped = tempLocation.storeName.split(" ").join("+").split("&").join("%26");
    //     if (tempLocation.NameEscaped.toLowerCase().indexOf("tiffany") == -1) {
    //         tempLocation.NameEscaped = "Tiffany " + tempLocation.NameEscaped;
    //     }
    //     tempLocation.NameEscaped = tempLocation.NameEscaped.replace("(", " ");
    //     tempLocation.NameEscaped = tempLocation.NameEscaped.replace(")", " ");
    //     if (typeof(tempLocation.Email) == "undefined" || tempLocation.Email == null || tempLocation.Email == "") {
    //         tempLocation.EmailStoreLink = '';
    //     }
    //     tempLocation.Mappable = true;
    //     tempLocation.MappableStyle = "block";
    //     if (tempLocation.MapLevel > 1 || tempLocation.Lat == null || tempLocation.Lat == "" || tempLocation.Lat == 0 || tempLocation.Lat == "0" || tempLocation.Long == null || tempLocation.Long == "" || tempLocation.Long == 0 || tempLocation.Long == "0" || this.mapServiceAvailable == false) {
    //         tempLocation.Mappable = false;
    //         tempLocation.MappableStyle = "none";
    //         tempLocation.ViewOnMapLink = "";
    //         tempLocation.GetDirections = false;
    //         tempLocation.GetDirectionsLink = "";
    //         tempLocation.GetDirectionsInfoWindowLink = "";
    //     }
    //     if (typeof(tempLocation.GetDirections) != "undefined" && tempLocation.GetDirections == false) {
    //         tempLocation.GetDirectionsLink = "";
    //         tempLocation.GetDirectionsInfoWindowLink = "";
    //     }
    //     tempLocation.ExtraInfoDiv = "";
    //     if (tempLocation.ExtraInfo != null && tempLocation.ExtraInfo != "") {
    //         tempLocation.ExtraInfoDiv = '<div class="mapExtraInfo">' + tempLocation.ExtraInfo + '</div>';
    //     }
    //     if (tempLocation.Image == "" || tempLocation.Image == null) {
    //         tempLocation.Image = "/shared/mobile/images/stores/store_location.jpg";
    //     }
    //     if ((typeof(tempLocation.RegularHrs) == "undefined" || tempLocation.RegularHrs == null || tempLocation.RegularHrs == "") && typeof(tempLocation.HolidayHrs) != "undefined" && tempLocation.HolidayHrs != null) {
    //         tempLocation.RegularHrs = tempLocation.HolidayHrs;
    //     }
    //     var dateRange;
    //     var startDate;
    //     var endDate;
    //     tempLocation.Events = "";
    //     if (typeof(tempLocation.StoreEventsList) != "undefined" && tempLocation.StoreEventsList != null && tempLocation.StoreEventsList.length > 0) {
    //         for (var j = 0; j < tempLocation.StoreEventsList.length; j++) {
    //             startDate = (!tempLocation.StoreEventsList[j].StartDate) ? '' : stringToDate(tempLocation.StoreEventsList[j].StartDate);
    //             if (tempLocation.StoreEventsList[j].EndDate == "undefined" || tempLocation.StoreEventsList[j].EndDate == "") {
    //                 dateRange = dateRangeToString(startDate, startDate);
    //             } else {
    //                 endDate = stringToDate(tempLocation.StoreEventsList[j].EndDate);
    //                 dateRange = dateRangeToString(startDate, endDate);
    //             }
    //             // tempLocation.Events += '<div class="eventHolder"><span class="eventName">' + tempLocation.StoreEventsList[j].Name + '</span><br />' + dateRange + '</div>';
    //         }
    //     }
    //     this.pStoreLocationsHash[locationsArray[i].MipsStoreNumber] = locationsArray[i];
    // }
};

/**
 * stringToDate
 * @return {void}
 * @param {String} dateStr Date
 */
// function stringToDate(dateStr) {
//     var dateTime = new Date();
//     var date = dateStr.split("T")[0];
//     var time = dateStr.split("T")[1];
//     var dateArr;
//     var timeArr;
//     if (typeof(date) != "undefined" && date != null) {
//         dateArr = date.split("-");
//         dateTime.setFullYear(Number(dateArr[0]));
//         dateTime.setDate(1);
//         dateTime.setMonth(Number(dateArr[1]) - 1);
//         dateTime.setDate(Number(dateArr[2]));
//     }
//     if (typeof(time) != "undefined" && time != null) {
//         timeArr = time.split(":");
//         dateTime.setHours(Number(timeArr[0]));
//         dateTime.setMinutes(Number(timeArr[1]));
//     }
//     return dateTime;
// }

/**
 * dateRangeToString
 * @returns {void}
 * @param {String} date1 Date
 * @param {String} date2 Date
 * @param {Array} monthArray months
 */
// function dateRangeToString(date1, date2, monthArray) {
//     var dateStr = "";
//     var time1 = "";
//     var time2 = "";
//     if (typeof(monthArray) == "undefined" || monthArray == null || monthArray.length < 12) {
//         if (typeof(locale) !== 'undefined' && (locale == 'ja-JP' || locale == 'ja-JP-EStr' || locale == 'zh-CN' || locale == 'zh-Hant' || locale == 'ko-KR')) {
//             monthArray = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
//         } else {
//             monthArray = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
//         }
//     }
//     var day1 = date1.getDate();
//     var day2 = date2.getDate();
//     if (day1 < 10) {
//         day1 = "0" + day1;
//     }
//     if (day2 < 10) {
//         day2 = "0" + day2;
//     }
//     day1 = day1 + "日";
//     day2 = day2 + "日";
//     if (typeof(locale) !== 'undefined' && (locale == 'ja-JP' || locale == 'ja-JP-EStr' || locale == 'zh-CN' || locale == 'zh-Hant' || locale == 'ko-KR')) {
//         if (date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate()) {
//             dateStr = monthArray[date1.getMonth()] + " " + day1;
//         } else if (date1.getMonth() == date2.getMonth()) {
//             dateStr = monthArray[date1.getMonth()] + " " + day1 + "-" + day2;
//         } else {
//             dateStr = monthArray[date1.getMonth()] + " " + day1 + "-" + monthArray[date2.getMonth()] + " " + day2;
//         }
//     } else {
//         if (date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate()) {
//             dateStr = monthArray[date1.getMonth()] + " " + date1.getDate();
//         } else if (date1.getMonth() == date2.getMonth()) {
//             dateStr = monthArray[date1.getMonth()] + " " + date1.getDate() + "-" + date2.getDate();
//         } else {
//             dateStr = monthArray[date1.getMonth()] + " " + date1.getDate() + "-" + monthArray[date2.getMonth()] + " " + date2.getDate();
//         }
//     }
//     return dateStr;
// };

/**
 * StoreLocationsModel searchLatLng
 * @return {void}
 * @param {String} lat latitude
 * @param {String} lng longitude
 */
StoreLocationsModel.prototype.searchLatLng = function(lat, lng) {
    var numStores = this.storeLocations.length;
    var foundStores = [];
    var matchConfidence;
    var distance;
    var tempLat;
    var tempLng;
    var tempStores = [];
    var i;
    for (i = 0; i < numStores; i++) {
        tempLat = Number(this.storeLocations[i].geoCodeLattitude);
        tempLng = Number(this.storeLocations[i].geoCodeLongitude);
        distance = this.calculateDistance(lat, lng, tempLat, tempLng);
        this.storeLocations[i].Distance = distance;
        this.storeLocations[i].DistanceConverted = this.convertDistance(distance);
        if (distance <= this.innerThresholdRadius) {
            this.storeLocations[i].matchType = "latlng";
            tempStores.push({
                Distance: distance,
                Store: this.storeLocations[i]
            });
        }
    }
    tempStores = tempStores.sort(this.sortByDistance);
    for (i = 0; i < tempStores.length; i++) {
        foundStores.push(tempStores[i].Store);
    }
    return foundStores;
};

/**
 * StoreLocationsModel updateStoreDistances
 * @return {void}
 * @param {String} lat latitude
 * @param {String} lng longitude
 */
StoreLocationsModel.prototype.updateStoreDistances = function(lat, lng) {
    var numStores = this.storeLocations.length;
    var distance;
    var tempLat;
    var tempLng;
    for (var i = 0; i < numStores; i++) {
        tempLat = Number(this.storeLocations[i].geoCodeLattitude);
        tempLng = Number(this.storeLocations[i].geoCodeLongitude);
        distance = this.calculateDistance(lat, lng, tempLat, tempLng);
        this.storeLocations[i].Distance = distance;
        this.storeLocations[i].DistanceConverted = this.convertDistance(distance);
    }
};

/**
 * StoreLocationsModel searchLocations
 * @return {void}
 * @param {String} searchStr search text
 */
// StoreLocationsModel.prototype.searchLocations = function(searchStr) {
//     europeCounter = 0;
//     this.searchLocationsWithGeocode(searchStr);
// };

/**
 * StoreLocationsModel searchLocationsByKeyword
 * @return {void}
 * @param {String} searchStr search text
 */
// StoreLocationsModel.prototype.searchLocationsByKeyword = function(searchStr) {
//     var numStores = this.storeLocations.length;
//     var foundStores = new Array();
//     var matchType;
//     for (var i = 0; i < numStores; i++) {
//         matchType = this.locationMatch(searchStr, this.storeLocations[i]);
//         if (matchType != "") {
//             this.storeLocations[i].matchType = matchType;
//             foundStores.push(this.storeLocations[i]);
//         }
//     }
//     return foundStores;
// };

/**
 * StoreLocationsModel locationMatch
 * @return {void}
 * @param {String} searchStr search text
 * @param {Object} addressItem address
 */
// StoreLocationsModel.prototype.locationMatch = function(searchStr, addressItem) {
//     var keyword;
//     var keywordArray;
//     var numKeywords;
//     var matchType = "";
//     var lastMatchType = "";
//     if (searchStr == "") {
//         return "";
//     } else if (typeof(searchStr) != "undefined") {
//         searchStr = searchStr.toLowerCase();
//         searchStr = searchStr.split(",").join("").split("-").join("").split("  ").join(" ");
//         keywordArray = searchStr.split(" ");
//         numKeywords = keywordArray.length;
//         for (var i = 0; i < numKeywords; i++) {
//             keyword = keywordArray[i].toLowerCase();
//             if (keyword != "") {
//                 if (addressItem.Name.toLowerCase().indexOf(keyword) >= 0) {
//                     matchType = "name";
//                 } else if (addressItem.Address1.toLowerCase().indexOf(keyword) >= 0) {
//                     matchType = "address1";
//                 } else if (addressItem.Address2 != null && addressItem.Address2.toLowerCase().indexOf(keyword) >= 0) {
//                     matchType = "address2";
//                 } else if (addressItem.Address3 != null && addressItem.Address3.toLowerCase().indexOf(keyword) >= 0) {
//                     matchType = "address3";
//                 } else if (addressItem.City.toLowerCase().indexOf(keyword) >= 0) {
//                     matchType = "city";
//                 } else if (addressItem.State.toLowerCase().indexOf(keyword) >= 0) {
//                     matchType = "state";
//                 } else if (this.getStateName(addressItem.State.toLowerCase()).toLowerCase().indexOf(keyword) >= 0) {
//                     matchType = "state";
//                 } else if (addressItem.Country.toLowerCase().indexOf(keyword) >= 0) {
//                     matchType = "country";
//                 } else if (addressItem.CountryInEnglish.toLowerCase().indexOf(keyword) >= 0) {
//                     matchType = "country";
//                 } else if (addressItem.Keywords != null && addressItem.Keywords.toLowerCase().indexOf(keyword) >= 0) {
//                     matchType = "keyword";
//                 } else {
//                     matchType = "";
//                 }
//                 if (matchType == "") {
//                     return "";
//                 } else if (lastMatchType != "" && matchType != lastMatchType) {
//                     return "";
//                 } else {
//                     lastMatchType = matchType;
//                 }
//             }
//         }
//     }
//     return matchType;
// };

/**
 * StoreLocationsModel getStoreDetails
 * @return {void}
 * @param {String} storeId Store Id
 */
// StoreLocationsModel.prototype.getStoreDetails = function(storeId) {
//     if (typeof(this.pStoreLocationsHash[storeId]) != "undefined") {
//         return this.pStoreLocationsHash[storeId];
//     }
//     return null;
// };

/**
 * StoreLocationsModel searchLocationsWithGeocode
 * @return {void}
 * @param {String} searchStr search text
 * @param {String} addCountyCode country code
 */
// StoreLocationsModel.prototype.searchLocationsWithGeocode = function(searchStr, addCountyCode) {
//     var countryCode = locale.split("-")[1];
//     var countryEUArray = ["en-GB", "en-IE", "en-BE", "en-NL", "fr-FR", "de-DE", "de-AT", "it-IT", "es-ES"];
//     if (countryEUArray.indexOf(locale) >= 0) {
//         if ($("div[rel='countryDropDownEU'] .rollbar-content .active").attr('rel') != "Europe") {
//             countryCode = $("div[rel='countryDropDownEU'] .rollbar-content .active").attr('rel');
//             if (countryCode == "GB") {
//                 countryCode = "UK";
//             }
//         }
//     }
//     if (locale.split("-")[0] == "zh") {
//         var swPoint = new google.maps.LatLng(73.30078125, 18.2293513384);
//         var nePoint = new google.maps.LatLng(32135.52734375, 53.6967064753);
//         var chinaBonds = new google.maps.LatLngBounds(swPoint, nePoint);
//         geocoder.geocode({
//             'address': searchStr,
//             bounds: chinaBonds
//         }, function(response, status) {
//             showStoreList(response, status, searchStr, google.maps.GeocoderStatus.OK);
//         });
//     } else if (locale.toLowerCase() == "intl") {
//         geocoder.geocode({
//             'address': searchStr
//         }, function(response, status) {
//             showStoreList(response, status, searchStr, google.maps.GeocoderStatus.OK);
//         });
//     } else {
//         geocoder.geocode({
//             'address': searchStr,
//             componentRestrictions: {
//                 country: countryCode
//             }
//         }, function(response, status) {
//             showStoreList(response, status, searchStr, google.maps.GeocoderStatus.OK);
//         });
//     }
// };

/**
 * showStoreList
 * @return {void}
 * @param {Object} response store response
 * @param {Number} status status code
 * @param {String} searchStr search text
 * @param {String} geoCode geo code
 */
// function showStoreList(response, status, searchStr, geoCode) {
//     var combinedResults = processGeocodeSearchResponse(response, status, searchStr);
//     if (combinedResults.length == 0 && status != geoCode) {
//         $("#errNoStores").show();
//         $("#storeList").hide();
//         resizeParent();
//     } else {
//         $("#searchErrorHolder").hide();
//         if (combinedResults.length == 0) {
//             $("#errNoStores").show();
//             $("#storeList").hide();
//             $("#showPickupInStore").hide();
//             $("#chkShowPickUpInStore").prop("checked", false);
//             resizeParent();
//         } else {
//             $("#errNoStores").hide();
//             getSkuInventoryInfo(combinedResults);
//         }
//     }
// }

/**
 * StoreLocationsModel combineResults
 * @return {void}
 * @param {Array} sourceArray1 store response
 * @param {Array} sourceArray2 status code
 */
// StoreLocationsModel.prototype.combineResults = function(sourceArray1, sourceArray2) {
//     var source1Length = sourceArray1.length;
//     var source2Length = sourceArray2.length;
//     var found;
//     for (i = 0; i < source2Length; i++) {
//         found = false;
//         for (var j = 0; j < source1Length; j++) {
//             if (sourceArray1[j] == sourceArray2[i]) {
//                 found = true;
//             }
//         }
//         if (found == false) {
//             sourceArray1.push(sourceArray2[i]);
//         }
//     }
//     return sourceArray1;
// };

/**
 * StoreLocationsModel combineAndSortResults
 * @return {void}
 * @param {Array} sourceArray1 store response
 * @param {Array} sourceArray2 status code
 * @param {String} lat latitude
 * @param {String} lng longitude
 */
StoreLocationsModel.prototype.combineAndSortResults = function(sourceArray1, sourceArray2, lat, lng) {
    var source1Length = sourceArray1.length;
    var source2Length = sourceArray2.length;
    var found;
    var tempLat;
    var tempLng;
    if (lat != null && lng != null) {
        for (var i = 0; i < source1Length; i++) {
            tempLat = Number(sourceArray1[i].geoCodeLattitude);
            tempLng = Number(sourceArray1[i].geoCodeLongitude);
            sourceArray1[i].Distance = this.calculateDistance(lat, lng, tempLat, tempLng);
            sourceArray1[i].DistanceConverted = this.convertDistance(sourceArray1[i].Distance);
        }
        for (i = 0; i < source2Length; i++) {
            tempLat = Number(sourceArray2[i].geoCodeLattitude);
            tempLng = Number(sourceArray2[i].geoCodeLongitude);
            sourceArray2[i].Distance = this.calculateDistance(lat, lng, tempLat, tempLng);
            sourceArray2[i].DistanceConverted = this.convertDistance(sourceArray2[i].Distance);
        }
        sourceArray1 = sourceArray1.sort(this.sortByDistance);
        sourceArray2 = sourceArray2.sort(this.sortByDistance);
    }
    for (i = 0; i < source2Length; i++) {
        found = false;
        for (var j = 0; j < source1Length; j++) {
            if (sourceArray1[j] == sourceArray2[i]) {
                found = true;
            }
        }
        if (found == false) {
            sourceArray1.push(sourceArray2[i]);
        }
    }
    sourceArray1 = sourceArray1.sort(this.sortByDistance);
    return sourceArray1;
};

/**
 * StoreLocationsModel sortByDistance
 * @return {void}
 * @param {Object} a distance
 * @param {Object} b distance
 */
StoreLocationsModel.prototype.sortByDistance = function(a, b) {
    return a.Distance - b.Distance;
};

/**
 * StoreLocationsModel getStateName
 * @return {void}
 * @param {String} stateCode State Code
 */
// StoreLocationsModel.prototype.getStateName = function(stateCode) {
//     if (this.stateAbbrMap[stateCode.toLowerCase()] != null) {
//         return this.stateAbbrMap[stateCode.toLowerCase()];
//     }
//     return "";
// };

/**
 * StoreLocationsModel calculateDistance
 * @return {void}
 * @param {String} lat1 latitude
 * @param {String} lng1 longitude
 * @param {String} lat2 latitude
 * @param {String} lng2 longitude
 */
StoreLocationsModel.prototype.calculateDistance = function(lat1, lng1, lat2, lng2) {
    var latlng1 = new google.maps.LatLng(lat1, lng1);
    var latlng2 = new google.maps.LatLng(lat2, lng2);
    return google.maps.geometry.spherical.computeDistanceBetween(latlng1, latlng2);
};

/**
 * StoreLocationsModel convertDistance
 * @return {void}
 * @param {Number} distance distance
 */
StoreLocationsModel.prototype.convertDistance = function(distance) {
    if (typeof(locale) !== 'undefined' && (locale.toLowerCase() == "en-us" || locale.toLowerCase() == "en-gb")) {
        var foo = Math.ceil(distance / 1000 * 0.621371) + " mi";
        return Math.ceil(distance / 1000 * 0.621371) + " mi";
    } else {
        return Math.ceil(distance / 1000) + " km";
    }
};

var geocoderIntervalId = 0;
var geocoder;
var model = StoreLocationsModel.getInstance();
var storeListWidget;

/**
 * loadLocations
 * @return {void}
 */
function loadLocations() {
    // to do need to refactor
    if (!window.tiffany || !window.tiffany.authoredContent || !window.tiffany.authoredContent.findAStoreConfig
        || !window.tiffany.authoredContent.productDetailsConfig || !window.tiffany.authoredContent.findAStoreConfig.enabledStoresURL) {
            return; 
        }
    $.ajax({
        url: window.tiffany.authoredContent.findAStoreConfig.enabledStoresURL,
        type: 'POST',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            siteId: window.tiffany.authoredContent.productDetailsConfig.payload.siteId
        }),
        success: function(data) {
            model.setStoreLocations(data.resultDto);
            navigator.geolocation.getCurrentPosition(findStoresByCurrentLocation);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}




/**
 * init
 * @return {void}
 */
// function init() {
//     model.setStoreLocations(storeData.stores);
//     geocoder = new google.maps.Geocoder();
//     var mapItLink = "http://maps.google.com/maps?q=$Lat$,$Long$+($NameEscaped$)&mrt=loc&t=m";
//     templateHTML += '<tr class="$canCollectInStore$"><td class="col1">';
//     templateHTML += '<h3>$StoreName$</h3>';
//     templateHTML += '</div></div><div class="storeInfo">';
//     templateHTML += '<p class="storeAddress">$Address$</p><p class="storeHours">$RegularHrs$</p>';
//     templateHTML += '<a href="' + mapItLink + '" class="l2" target="_blank" style="display:$MappableStyle$">' + LABEL_VIEW_ON_MAP + '</a>';
//     templateHTML += '</td>';
//     templateHTML += '<td class="col2">$DistanceConverted$</td>';
//     templateHTML += '<td class="col3"><ul class="availability"><li><span class="availableSpan">$Availability$</span></li><li><span class="availableSpan">$collectInStore$</span></li><li><span class="availableSpan">$noRealTimeInventory$</span></li></ul><a href="/" class="setPreferredStore btn setStore secondary" data-storeID="$MipsStoreNumber$" data-storeName="$StoreName$" >' + LABEL_SELECT_STORE + '</a></td></tr>';
// }

/**
 * processGeocodeSearchResponse
 * @return {void}
 * @param {Object} response ajax response
 * @param {Number} status status code
 * @param {String} typedContents typed contents
 */
// function processGeocodeSearchResponse(response, status, typedContents) {
//     var lng = 0;
//     var lat = 0;
//     var geocodeResults = [];
//     var combinedResults = [];
//     var matchesCountry = false;
//     if (typeof namedCountries[locale] != "undefined") {
//         if (response[0].formatted_address == namedCountries[locale]) {
//             matchesCountry = true;
//         }
//     }
//     var countryEUArray = ["en-GB", "en-IE", "en-BE", "en-NL", "fr-FR", "de-DE", "de-AT", "it-IT", "es-ES"];
//     var localCountry = locale.split("-")[0];
//     if (countryEUArray.indexOf(locale) >= 0 && !matchesCountry) {
//         for (var i = 0; i < namedCountries[localCountry].length; i++) {
//             if (response[0].formatted_address == namedCountries[locale.split("-")[0]][i]) {
//                 matchesCountry = true;
//                 break;
//             }
//         }
//     }
//     if (response != null && status == google.maps.GeocoderStatus.OK && !matchesCountry) {
//         lng = response[0].geometry.location.lng();
//         lat = response[0].geometry.location.lat();
//         model.updateStoreDistances(lat, lng);
//         geocodeResults = StoreLocationsModel.getInstance().searchLatLng(lat, lng);
//         var map = new google.maps.Map(document.getElementById('map'), {
//             center: {
//                 lat: lng,
//                 lng: lat
//             },
//             zoom: 8
//         });
//     }
//     return geocodeResults;
// }

/**
 * handleLocationSearch
 * @return {void}
 * @param {String} storeId store id
 */
// function handleLocationSearch(storeId) {
//     var typedContents = $("#locationFieldSplashPage").val();
//     if ((typeof(storeId) != "undefined" && storeId != null && storeId != "") || (typedContents != null && typedContents != "")) {
//         clearTimeout(geocoderIntervalId);
//         if (typedContents != null && typedContents != "") {
//             trackSearchFindItemInStore(typedContents);
//         }
//         if (typeof(storeId) == "undefined" || storeId == null) {
//             model.searchLocations(typedContents, true);
//         } else {
//             storeListWidget.dataProvider = [model.getStoreDetails(storeId)];
//             storeListWidget.draw();
//         }
//     }
// }

/**
 * handleLoadLocation
 * @return {void}
 * @param {String} lat latitude
 * @param {String} lng longitude
 */
// function handleLoadLocation(lat, lng) {
//     var geocodeResults;
//     var combinedResults;
//     if (model.currentLat == 0 && model.currentLng == 0 && model.storeLocations != null) {
//         geocodeResults = model.searchLatLng(lat, lng);
//         combinedResults = model.combineAndSortResults([], geocodeResults, lat, lng);
//         storeListWidget.dataProvider = combinedResults;
//         storeListWidget.draw();
//     }
//     model.currentLat = lat;
//     model.currentLng = lng;
// }


let storesWithInventory;
let dataWithInventory;
/**
 * getSkuInventoryInfo
 * @return {void}
 * @param {Object} results results object
 */
function getSkuInventoryInfo(results) {
    // var query = window.location.search.split("?").join("");
    
    var storeListArray = [];
    for (var i = 0; i < results.length; i++) {
        storeListArray.push(results[i].mipsStoreNumber);
    }
    // to do refactor code
    if (!window.tiffany || !window.tiffany.authoredContent.productDetailsConfig || !window.tiffany.pdpConfig || !window.tiffany.pdpConfig.sku) {
        return ;
    }
    const cookieName = objectPath.get(window, 'tiffany.authoredContent.sessionCookieName', 'mysid2');
    const config = {
        assortmentId: window.tiffany.authoredContent.productDetailsConfig.payload.assortmentId,
        siteId: window.tiffany.authoredContent.productDetailsConfig.payload.siteId,
        sku: window.tiffany.pdpConfig.sku,
        selectedSku: window.tiffany.pdpConfig.selectedSku,
        webCustomerId: cookieUtil.getCookies(cookieName),
        mipsStoreList: storeListArray.join(",")
    };

    $.ajax({
        url: window.tiffany.authoredContent.findAStoreConfig.availabilitybystores,
        type: 'POST',
        data: JSON.stringify(config),
        cache: false,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            storesWithInventory = results;
            dataWithInventory = data.resultDto;
            filterStoresOnAvailability(storesWithInventory, dataWithInventory);
        },
        error: function(jqXHR, textStatus, errorThrown) {}
    });
}


function filterStoresOnAvailability(stores, data){
    forEach(stores, function(item, index){
        const mip = item.mipsStoreNumber;
        checkInventoryInStoreByMip(index, mip, data.skuAvailabilityStatusByStore);
    });
    filterStoresWithAvailability(storesWithInventory);
}

function checkInventoryInStoreByMip(index, mip, inventoryStores) {
    let isavailableInStore = false;
    forEach(inventoryStores, function(store){
        if(store.mipsStoreNumber === mip) {
            storesWithInventory[index].availableInStore = store.availableInStore;
            // storesWithInventory[index].limitedAvailabilityInStore = store.limitedAvailabilityInStore;
        }
    })
}

function filterStoresWithAvailability(stores) {
    const fitleredStores = stores.filter(function(store){
        return store.availableInStore;
    });
    if(fitleredStores.length) {
        window.findAStoreAddress = fitleredStores[0];
        customEventTrigger(window, 'onGeoLocationResponse');
    }
}

/**
 * drawStoreList
 * @return {void}
 * @param {Object} results results object
 * @param {Object} inventoryData inventory
 */
// function drawStoreList(results, inventoryData) {
//     // var listHTML = [];
//     // var itemHTML;
//     var item;
//     // var availability = "";
//     // var canShowPickupInStore = false;
//     // $("#showPickupInStore").hide();
//     // $("#chkShowPickUpInStore").prop("checked", false);
//     // listHTML.push("<table>");
//     var listAvailableStores = [];
//     for (var i = 0; i < results.length; i++) {
//         // itemHTML = templateHTML;
//
//         for (var property in results[i]) {
//             item = results[i];
//             // itemHTML = itemHTML.split("$" + property + "$").join(item[property]);
//         }
//         // console.log(inventoryData.ResponseObject);
//         for (var j = 0; j < inventoryData.ResponseObject.length; j++) {
//             if (inventoryData.ResponseObject[j].MIPSStoreNumber == results[i]["MipsStoreNumber"]) {
//                 // availability = inventoryData.ResponseObject[j].StoreInventoryMsgKey;
//                 listAvailableStores.push(inventoryData.ResponseObject[j]);
//
//                 // itemHTML = itemHTML.split("$Availability$").join(availabilityMessages[availability]);
//                 // if ((inventoryData.ResponseObject[j].StorePickUpMsgKey == "true") && (window.location.href.indexOf("&istatus=1") < 0)) {
//                 //     itemHTML = itemHTML.split("$collectInStore$").join(LABEL_COLLECT_IN_STORE);
//                 //     itemHTML = itemHTML.split("$canCollectInStore$").join("canCollectInStore");
//                 //     canShowPickupInStore = true;
//                 // } else {
//                 //     itemHTML = itemHTML.split("<li><span class=\"availableSpan\">$collectInStore$</span></li>").join("");
//                 //     itemHTML = itemHTML.split("$canCollectInStore$").join("canNotCollectInStore");
//                 // }
//             }
//         }
//
//
//         // if (results[i]["RealTimeInventoryDisclaimerKey"] == "txtInventoryDisclaimerKey") {
//         //     itemHTML = itemHTML.split("$noRealTimeInventory$").join(LABEL_NO_REAL_TIME_INVENTORY);
//         // } else {
//         //     itemHTML = itemHTML.split("<li><span class=\"availableSpan\">$noRealTimeInventory$</span></li>").join("");
//         // }
//
//         // listHTML.push(itemHTML);
//     }

    // listHTML.push("</table>");
    // console.log(listHTML.join(""));
    // $("#storesTable").html(listHTML.join(""));
    // if ($("#storesTable table").is(":empty")) {
    //     $("#storeList").hide();
    // } else {
    //     $("#storeList").show();
    // }
    // if (canShowPickupInStore) {
    //     $("#showPickupInStore").show();
    //     if (checkShowCollectInStoreOnLoad == true) {
    //         $("#chkShowPickUpInStore").click();
    //         checkShowCollectInStoreOnLoad = false;
    //     }
    // }

    // if ($("#storesTable").closest(".rollbar-content").length == 0) {
    //     initRollbar();
    // } else {
    //     $("#storesTableWrapper").trigger('rollbar', 'reset');
    // }
    // resizeParent();
// }

/**
 * setSearchRadius
 * @return {void}
 */
function setSearchRadius() {
    // if ($("body").hasClass("en-US")) {
    //     model.innerThresholdRadius = parseFloat($("#ddlDistance").val()) * 1609.34;
    // } else {
    //     model.innerThresholdRadius = parseInt($("#ddlDistance").val()) * 1000;
    // }
    model.innerThresholdRadius = model.innerThresholdRadius * 1609.34;
}

/**
 * findStoresByCurrentLocation
 * @return {void}
 * @param {Object} position position
 */
function findStoresByCurrentLocation(position) {
    setSearchRadius();
    var lng = position.coords.longitude;
    var lat = position.coords.latitude;
    var geocodeResults = [];
    var sortedResults = [];
    model.updateStoreDistances(lat, lng);
    geocodeResults = StoreLocationsModel.getInstance().searchLatLng(lat, lng);
    sortedResults = model.combineAndSortResults([], geocodeResults, lat, lng);

    getSkuInventoryInfo(sortedResults);


    // if (sortedResults.length == 0) {
    //     // console.log('resizeParent');
    //     // $("#errNoStores").show();
    //     // $("#showPickupInStore").hide();
    //     // $("#chkShowPickUpInStore").prop("checked", false);
    //     // $("#storeList").hide();
    //     // resizeParent();
    // } else {
    //     // console.log('sortedResults list');
    //     // $("#errNoStores").hide();
    //     // getSkuInventoryInfo(sortedResults);
    // }
}

// var templateHTML = "";
// var checkShowCollectInStoreOnLoad = false;

// $(document).ready(function() {
    // init();
    // var query = window.location.search.split("?").join("");
    // var preferredStoreNum = URLFactory.extractQueryStringValue(query, "psn");
    // var customSearch = URLFactory.extractQueryStringValue(query, "customsearch");
    // if (preferredStoreNum != "") {
    //     var position = {
    //         coords: {}
    //     };
    //     var preferredStore = model.getStoreDetails(preferredStoreNum);
    //     position.coords["longitude"] = preferredStore.Long;
    //     position.coords["latitude"] = preferredStore.Lat;
    //     findStoresByCurrentLocation(position);
    // }

    // $("#searchStoresBtn").click(function(e) {
    //     if ($("#locationFieldSplashPage").val() == LABEL_CURRENT_LOCATION) {
    //         $("#useCurrentLocation").click();
    //     } else {
    //         setSearchRadius();
    //         handleLocationSearch();
    //     }
    //     e.preventDefault();
    // });

    // $("#frmMain").submit(function(e) {
    //     $("#searchStoresBtn").click();
    //     e.preventDefault();
    // });
    //
    // $("body").on("click", ".storeInfo a", function(e) {
    //     e.stopPropagation();
    // });

    // $("body").on("click", "#chkShowPickUpInStore", function(e) {
    //     if ($(this).prop("checked")) {
    //         $("tr.canNotCollectInStore").hide();
    //     } else {
    //         $("tr.canNotCollectInStore").show();
    //     }
    //     $("#storesTableWrapper").trigger('rollbar', 'reset');
    // });

    // $("body").on("click", "a.setPreferredStore", function(e) {
    //     var trackStoreName = $(this).attr("data-storeName");
    //     $.ajax({
    //         url: '/Locations/Default.aspx/AddPreferredStore',
    //         type: 'POST',
    //         data: '{"MIPSStoreNumber": "' + $(this).attr("data-storeID") + '"}',
    //         cache: false,
    //         dataType: "json",
    //         contentType: "application/json; charset=utf-8",
    //         success: function(data) {
    //             if (data != null && data.d.SuccessFlag.toLowerCase() == "true") {
    //                 trackSelectFindItemInStore(trackStoreName);
    //                 var hash = window.parent.location.hash.split("#").join("");
    //                 hash = window.parent.URLFactory.updateHash(hash, "popup", "");
    //                 window.parent.HistoryManager.getInstance().addHistoryItem(hash);
    //                 window.parent.location.reload();
    //             } else {}
    //         },
    //         error: function(jqXHR, textStatus, errorThrown) {}
    //     });
    //     e.preventDefault();
    //     e.stopPropagation();
    // });

    // if (!navigator.geolocation) {
    //     $("#useCurrentLocation").hide();
    // }
    //
    // $("body").on("click", "#useCurrentLocation", function(e) {
    //     if (navigator.geolocation) {
    //         $("#locationFieldSplashPage").val(LABEL_CURRENT_LOCATION);
    //         navigator.geolocation.getCurrentPosition(findStoresByCurrentLocation);
    //     }
    //     e.preventDefault();
    // });
    //
    // if (customSearch.toLowerCase() == "london") {
    //     $("#locationFieldSplashPage").val("London");
    //     $("#searchStoresBtn").click();
    //     checkShowCollectInStoreOnLoad = true;
    // }
    // loadLocations();
// });

module.exports = loadLocations;
