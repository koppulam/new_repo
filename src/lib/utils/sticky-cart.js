/**
 * @description utility to make cart and related items sticky
 * @param {Boolean} makeSticky identifier to make elements sticky or not
 * @returns {void}
 */

import $ from 'jquery';

const elementsToStick = ['.product-in-store', '.product-description_buttons_container'];
const classToAdd = 'stick-to-bottom';
const elementsToCalculate = ['.product-description_buttons_container'];
const elementsForExtraGutterHeight = ['.modifiers__container:not(\'.compact-view\')'];
const bufferForConcierge = 5;

export const toggleStickyCart = (makeSticky) => {
    if (makeSticky) {
        if (!($('.product-action-component') && $('.product-action-component').length)) {
            elementsToStick.forEach((element) => {
                const eleClientRects = $(element).position();
    
                if (eleClientRects && eleClientRects.top > 0) {
                    $(element).addClass(classToAdd);
                }
            });
            // Calculating height for gutter space and also for the concierge-cta dynamically
            const gutterHeight = getStickyCartHeight();
            const extraGutterHeight = elementsForExtraGutterHeight
                .map(element => (($(element) && $(element).outerHeight() && $('.product-in-store') && $('.product-in-store').length) ? $(element).outerHeight() : 0))
                .reduce((accumulator, nextElementHeight) => accumulator + nextElementHeight);
    
            $('.sticky-gutter').css({ 'height': `${gutterHeight + extraGutterHeight}px` });
            $('.concierge-cta').css({ 'bottom': `${gutterHeight}px` });
    
            if ($('.product-in-store') && $('.product-in-store').length) {
                $('.modifiers__container').hide();
                $('.modifiers__container.compact-view').show();
            }
        }
    } else {
        elementsToStick.forEach((element) => {
            $(element).removeClass(classToAdd);
        });

        // Remove inline styles added to elements while making cart sticky
        $('.sticky-gutter, .concierge-cta').removeAttr('style');

        if ($('.product-in-store') && $('.product-in-store').length) {
            $('.modifiers__container').not('.compact-view').show();
            $('.modifiers__container.compact-view').hide();
        }
    }
};

export const getStickyCartHeight = () => {
    let stickyHeight = bufferForConcierge;
    let stickyButtons = ['.product-description_buttons_container'];

    // If find in store is present then add its height as well
    if ($('.product-in-store') && $('.product-in-store').length) {
        stickyHeight = stickyHeight + $('.product-in-store').outerHeight();
        $(stickyButtons.join(', ')).css({ 'border': 'none', 'padding-top': '0' });
    }

    elementsToCalculate.forEach((element) => {
        stickyHeight = stickyHeight + (($(element) && $(element).outerHeight()) ? $(element).outerHeight() : 0);
    });

    return stickyHeight;
};
