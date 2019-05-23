/**
 * Creates a dispatcher object.
 *
 */
'use strict';

/**
 * Function to trigger event on element
 * @param {HTMLElement} elem
 * @param {String} eventType
 * @param {String} eventTypeIE for IE browser
 * @param {Object}  eventData Event data
 */
function customEventTrigger(elem, eventType, eventTypeIE) {
    if (!elem) {
        return;
    }
    if ("createEvent" in document) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(eventType, false, true);
        elem.dispatchEvent(evt);
    } else {
        elem.fireEvent(eventTypeIE);
    }
}

module.exports = customEventTrigger;
