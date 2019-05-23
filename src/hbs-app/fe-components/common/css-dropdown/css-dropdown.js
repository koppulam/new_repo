/**
 * @module css-dropdown
 * @version 1.0.0
 * @since Tue Aug 30 2016
 */

'use strict';

// dependencies
import './css-dropdown.hbs';
import './css-dropdown.scss';

// var registerComponent = require('com/register/register-component');
// var domUtil = require('dom/dom-util');
// var jQuery = require('jQuery');
// var forEach = require('lodash.foreach');
// var keyCode = require('dom/keyboard/key-code');

// exports = module.exports = createCssDropdownInstance;

// /**
//  * The definition of the component. Each DOM element will
//  * define the elements class with this string.
//  * @type {String}
//  */
// exports.componentReference = 'am-js__css-dropdown';

// /**
//  * The style definition of the component.
//  * @type {String}
//  */
// exports.styleDefinition = 'css-dropdown';


// /**
//  * Factory method to create an instance. Linked to an html element.
//  *
//  * @return {object} Component instance.
//  */
// function createCssDropdownInstance() {
//     /**
//      * Component instance.
//      * @type {Object}
//      */
//     var instance = {};

//     /**
//      * dropdown trigger element.
//      * @type {HTMLElement}
//      */
//     var dropdownTrigger;

//     /**
//      * dropdown content element.
//      * @type {HTMLElement}
//      */
//     var dropdownContent;

//     /**
//      * dropdown trigger element.
//      * @type {HTMLElement}
//      */
//     var dropdownText;

//     /**
//      * parameter
//      * @type {Boolean}
//      */
//     var param = true;

//     /**
//      * The DOM Element was added to the DOM.
//      */
//     instance.attached = function() {
//         init();
//     };

//     /**
//      * The DOM Element was removed from the DOM.
//      */
//     instance.detached = function() {
//         dispose();
//     };

//     /**
//      * The DOM Element was removed from the DOM.
//      */
//     function init() {
//         dropdownTrigger = domUtil.findFirst('.' + exports.styleDefinition + '__trigger', instance.element);
//         dropdownContent = domUtil.findFirst('.' + exports.styleDefinition + '__content', instance.element);
//         dropdownText = domUtil.findFirst('.' + exports.styleDefinition + '__text-button', instance.element);

//         addListeners();
//     }

//     /**
//      * Append listeners to the element.
//      */
//     function addListeners() {
//         jQuery(instance.element).on('keydown', openDropdown);
//         instance.addEventListener('blur', onDropdownBlur, dropdownContent);
//     }

//     function openDropdown(event) {
//         if (keyCode.isSpaceOrEnter(event, {prevent: true})) {
//             if (dropdownTrigger.checked === false) {
//                 dropdownTrigger.checked = true;
//             } else {
//                 dropdownTrigger.checked = false;
//             }
//             instance.element.focus();
//         }
//     }

//     /**
//      * callback function for blur event on dropdown
//      */
//     function onDropdownBlur() {
//         setTimeout(onDropdownAction, 100);
//     }

//     /**
//      * closes the dropdown when dropdown is blured
//      */
//     function onDropdownAction() {
//         var activeElement = document.activeElement;
//         if (activeElement !== dropdownTrigger && activeElement !== dropdownContent && !jQuery.contains(dropdownContent, activeElement)) {
//             dropdownTrigger.checked = false;
//         }
//     }

//     /**
//      * closes dropdown on document click
//      * @param  {event} event
//      */
//     function onDocumentClicked(event) {
//         var el = event.target;
//         if(el !== dropdownText && el !== dropdownContent && !jQuery.contains(dropdownContent, el)) {
//             dropdownText.checked = false;
//         }
//         if(el !== dropdownText){
//             jQuery(this).off('click');
//         }
//     }

//     /**
//      * The DOM Element was removed from the DOM.
//      */
//     function dispose() {
//         jQuery(document).off('click', onDocumentClicked);
//     }

//     return instance;
// }

// registerComponent(exports.componentReference, createCssDropdownInstance);
