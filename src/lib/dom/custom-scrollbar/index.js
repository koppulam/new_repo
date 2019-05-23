import PerfectScrollbar from 'perfect-scrollbar';

const $ = require('jquery');

/**
 * custom scroll bar implementation
 * @param {any} element This is HTML class/id.
 * @returns {any} instance of PerfectScrollbar
 */
export const initScrollBar = (element) => {
    const isIOSdevice = $('body').hasClass('ios');

    if (element && (!isIOSdevice || $(element).hasClass('force-ios-custom-scroll'))) {
        const scrollInstance = new PerfectScrollbar(element);

        if (scrollInstance.scrollbarX) {
            scrollInstance.scrollbarX.tabIndex = -1;
        }

        if (scrollInstance.scrollbarY) {
            scrollInstance.scrollbarY.tabIndex = -1;
        }

        return scrollInstance;
    }
    return false;
};

/**
 * remove custom scroll bar instance
 * @param {any} ps instance.
 * @returns {void}
 */
export const removeScrollBar = (ps) => {
    if (ps && ps.destroy) {
        ps.destroy();
        ps = null;
    }
};

/**
 * update custom scroll bar instance
 * @param {any} ps instance.
 * @returns {void}
 */
export const updateScrollBar = (ps) => {
    if (ps && ps.update) {
        ps.update();
    }
};
