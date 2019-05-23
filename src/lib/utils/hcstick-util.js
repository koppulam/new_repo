const $ = require('jquery');

const currentStickyComponents = [];
let scrollElement = {};

/**
 * @param {object} hcStickyComponent hcStickyComponent
 * @returns {void}
 */
function StickComponents() {
    this.hcStickyComponent = {};
    this.matchedComponents = [];
    this.leftElement = {};
    this.rightElement = {};
    this.rightFullElement = {};

    this.stickScroll = () => {
        const stickyTop = ($('.filters-component.sticky').length > 0) ? $('.filters-component.sticky') : $('.header.app-js__header');
        const hcTop = (stickyTop && stickyTop.outerHeight()) ? stickyTop.outerHeight() : 0;

        if (this.hcStickyComponent && this.leftElement.is(':visible')) {
            const hcRects = this.rightFullElement.get(0).getBoundingClientRect();

            if (hcRects.top <= hcTop) {
                if (hcTop - hcRects.top > this.rightFullElement.outerHeight()) {
                    if (this.leftElement.attr('data-position')) {
                        this.leftElement.css('position', this.leftElement.attr('data-position'));
                    } else {
                        this.leftElement.css('position', 'static');
                    }
                    this.leftElement.css('top', 'auto');
                    this.hcStickyComponent.removeClass('currentSticky');
                } else {
                    const topDiff = hcTop - hcRects.top;

                    if (parseInt(this.rightFullElement.outerHeight(), 10) <= parseInt(this.leftElement.outerHeight(), 10)) {
                        this.rightFullElement.css('height', `${this.leftElement.outerHeight()}px`);
                    }
                    const heightDiff = this.rightFullElement.outerHeight() - this.leftElement.outerHeight();

                    if (topDiff <= heightDiff || hcRects.top >= 0) {
                        this.leftElement.css('position', 'fixed');
                        this.leftElement.css('top', `${hcTop}px`);
                    } else {
                        this.leftElement.css('position', 'fixed');
                        this.leftElement.css('top', `${(heightDiff - topDiff) + hcTop}px`);
                    }
                    this.leftElement.css('left', this.leftElement.attr('data-left'));
                    this.hcStickyComponent.addClass('currentSticky');

                    let newHeight = this.leftElement.outerHeight() + (hcTop - hcRects.top);

                    newHeight = (newHeight < this.leftElement.outerHeight()) ? this.leftElement.outerHeight() : newHeight;

                    if (newHeight > this.rightFullElement.outerHeight()) {
                        newHeight = this.rightFullElement.outerHeight();
                    }
                    newHeight = newHeight < this.leftElement.outerHeight() ? `${this.leftElement.outerHeight()}px` : `${newHeight}px`;
                    this.rightElement.css('height', newHeight);

                    if (this.matchedComponents.length > 0) {
                        for (let matchIndex = 0; matchIndex < this.matchedComponents.length; matchIndex++) {
                            const rightEle = this.matchedComponents[matchIndex].hcStickyComponent.find('.right-element');

                            rightEle.css('height', newHeight);
                        }
                    }

                }
            } else {
                this.leftElement.css('position', 'relative');
                this.leftElement.css('top', 'auto');
                this.leftElement.css('left', 'auto');
                this.hcStickyComponent.removeClass('currentSticky');
            }
        }
    };

    this.init = (hcStickyComponent, disableOnWidth) => {
        if (hcStickyComponent) {
            const images = hcStickyComponent.find('.left-element img');

            this.hcStickyComponent = hcStickyComponent;
            this.disableOnWidth = disableOnWidth;

            this.leftElement = this.hcStickyComponent.find('.left-element');
            this.rightElement = this.hcStickyComponent.find('.right-element');
            this.rightFullElement = this.hcStickyComponent.find('.right-full-element');

            if (images.length > 0) {
                // if there are any images in left element, wait for them to load to initiate sticky
                images.on('load', () => {
                    setTimeout(() => {
                        this.stickElements();
                    });
                });

                this.stickElements();
            } else {
                // Wait for any manual DOM updates being made by calling component
                setTimeout(() => {
                    this.stickElements();
                });
            }
            $(scrollElement).on('resize', this.resize);

            let currentLength = currentStickyComponents.length;

            for (let currentIndex = 0; currentIndex < currentLength; currentIndex += 1) {
                if (currentStickyComponents[currentIndex]) {
                    const tempComponent = currentStickyComponents[currentIndex].hcStickyComponent;
                    const tempBounds = tempComponent.get(0).getBoundingClientRect();
                    const currentBounds = this.hcStickyComponent.get(0).getBoundingClientRect();

                    if (tempComponent.attr('data-stickyId') != this.hcStickyComponent.attr('data-stickyId')) {
                        if (tempBounds.x == currentBounds.x && tempBounds.y == currentBounds.y) {
                            this.matchedComponents.push(currentStickyComponents[currentIndex]);
                            $(scrollElement).off('scroll', currentStickyComponents[currentIndex].stickScroll);
                            const tempLeft = tempComponent.find('.left-element');

                            tempLeft.css('position', 'static');
                            tempLeft.css('top', 'auto');
                        }
                    }
                }
            }
        }
    };

    this.stickElements = () => {
        const isDisabledWidth = window.matchMedia(`(max-width: ${this.disableOnWidth}px)`).matches;
        const leftElementRects = this.leftElement ? this.leftElement.get(0).getBoundingClientRect() : {};

        if (this.leftElement && this.rightElement) {
            if (this.rightFullElement && this.disableOnWidth && !isDisabledWidth) {
                this.rightFullElement.css('height', 'auto');
                if (!this.leftElement.attr('data-position')) {
                    this.leftElement.attr('data-position', this.leftElement.css('position'));
                }
                this.leftElement.attr('data-width', leftElementRects.width);
                this.leftElement.attr('data-left', `${leftElementRects.x}px`);
                this.leftElement.css('width', `${leftElementRects.width}px`);

                if (parseInt(this.rightFullElement.outerHeight(), 10) <= parseInt(this.leftElement.outerHeight(), 10)) {
                    this.rightFullElement.css('height', `${this.leftElement.outerHeight()}px`);
                }

                const newHeight = this.leftElement.outerHeight();

                if (newHeight > 100) {
                    this.rightElement.css('height', `${newHeight}px`);
                    this.rightElement.css('overflowY', 'hidden');
                }
                $(scrollElement).off('scroll', this.stickScroll).on('scroll', this.stickScroll);
            } else {
                $(scrollElement).off('scroll', this.stickScroll);
                this.leftElement.css('width', 'auto');
                this.leftElement.css('position', 'relative');
                this.leftElement.css('top', 'auto');
                this.leftElement.css('left', 'auto');
                this.rightElement.css('height', 'auto');
                this.rightElement.css('overflowY', 'auto');
                this.hcStickyComponent.removeClass('currentSticky');
            }
        }
    };

    this.resize = () => {
        const leftElementRects = this.leftElement ? this.leftElement.parent().get(0).getBoundingClientRect() : {};
        const isDisabledWidth = window.matchMedia(`(max-width: ${this.disableOnWidth}px)`).matches;

        if (this.leftElement && this.rightElement && this.leftElement.is(':visible')) {
            if (this.rightFullElement && this.disableOnWidth && !isDisabledWidth) {
                this.rightFullElement.css('height', 'auto');
                this.leftElement.attr('data-width', leftElementRects.width);
                this.leftElement.attr('data-left', `${leftElementRects.x}px`);
                this.leftElement.css('width', `${leftElementRects.width}px`);

                const newHeight = this.leftElement.outerHeight();

                if (newHeight > 100) {
                    this.rightElement.css('height', `${newHeight}px`);
                    this.rightElement.css('overflowY', 'hidden');
                }

                const images = this.hcStickyComponent.find('.left-element img');

                if (images.length > 0) {
                    images.on('load', () => {
                        const isHcStickyDisabled = window.matchMedia(`(max-width: ${this.disableOnWidth}px)`).matches;

                        if (!isHcStickyDisabled) {
                            if (parseInt(this.rightFullElement.outerHeight(), 10) <= parseInt(this.leftElement.outerHeight(), 10)) {
                                this.rightFullElement.css('height', `${this.leftElement.outerHeight()}px`);
                            } else {
                                this.rightFullElement.css('height', 'static');
                            }
                        } else {
                            this.rightFullElement.css('height', 'auto');
                        }
                    });
                }

                if (parseInt(this.rightFullElement.outerHeight(), 10) <= parseInt(this.leftElement.outerHeight(), 10)) {
                    this.rightFullElement.css('height', `${this.leftElement.outerHeight()}px`);
                } else {
                    this.rightFullElement.css('height', 'static');
                }
                $(scrollElement).off('scroll', this.stickScroll).on('scroll', this.stickScroll);
            } else {
                $(scrollElement).off('scroll', this.stickScroll);
                this.leftElement.css('width', 'auto');
                this.leftElement.css('position', 'relative');
                this.leftElement.css('top', 'auto');
                this.leftElement.css('left', 'auto');
                this.rightElement.css('height', 'auto');
                this.rightElement.css('overflowY', 'auto');
                this.rightFullElement.css('height', 'auto');
                this.hcStickyComponent.removeClass('currentSticky');
            }
        }
    };

    this.destroy = () => {
        $(scrollElement).off('scroll', this.stickScroll);
        for (let matchIndex = 0; matchIndex < this.matchedComponents.length; matchIndex += 1) {
            this.matchedComponents[matchIndex].stickElements();
        }
    };

}

/**
 * @param {object} hcSelect hcSelect
 * @returns {void}
 */
export default function hsStickyUtil(hcSelect) {
    const {
        element,
        disableOnWidth = '',
        container
    } = hcSelect;
    const hcStickyComponents = $(element);
    const numberOfSticky = hcStickyComponents.length;
    const stickyObjs = [];

    scrollElement = container ? $(container) : window;

    for (let index = 0; index < numberOfSticky; index += 1) {
        const ele = $(hcStickyComponents[index]);

        ele.attr('data-stickyid', currentStickyComponents.length += 1);
        const stick = new StickComponents();

        stick.init(ele, disableOnWidth);
        currentStickyComponents.push(stick);
        stickyObjs.push(stick);
    }

    return stickyObjs;
}
