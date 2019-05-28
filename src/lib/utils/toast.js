import objectPath from 'object-path';
import { findFirst, removeClass, addClass, hasClass, findAll } from 'lib/dom/dom-util';

const assign = require('lodash/assign');

/**
 * @description Exposing Toast to window object need to create instance to create toast.
 * @returns {void}
 * @example
    const testToast = new window.Toast({
        type: 'error',
        customClass: 'my-toast-modifier',
        holder: 'page-wrap',
        message: 'Hello !',
        closeBtnAriaLabel: 'config aria label',
        duration: 100000,
        showCloseBtn: false,
        customCloseClass: 'my-own-toast-close class',
        position: 'top',
        isFixed: true,
        contentAlignment: 'left'
    });

    testToast.show();
 */
(function () {
    const WRAPPER_CLASS = 'toast-container',
        RELATIVE_CLASS = 'relative-holder',
        ONLY_MESSAGE = 'message-only',
        FIXED_CLASS = 'isFixed',
        TIME_TO_CLOSE_TOAST = 500,
        DEFAULT_HOLDER = 'page-wrap',
        DEFAULT_POSITION = 'top',
        DEFAULT_DURATION = 10000,
        DEFAULT_CLOSE_ANIMATION = 'fade-out',
        DEFAULT_CLOSE_BTN_ARIA_LABEL = 'close toast',
        TOAST_CLOSE_CLASS = 'close-toast',
        IS_TOAST_FIXED = false,
        TOAST_CLASS = 'toast';

    /**
     * @description this method takes care of checking and creating a wrapper
     * for all the toasts inside the container given wrapper/holder
     * @param {DOM} holder element where the toast will appear
     * @param {String} position position where the toasts wrappers should be present
     * @param {Boolean} isFixed we fix the toast only if the holder is page-wrap
     * @returns {DOM} returns container instance inside wrapper given
     */
    const giveWrapperElement = (holder, position, isFixed) => {
        let container = findFirst(`.${WRAPPER_CLASS}`, holder);

        if (!hasClass(holder, RELATIVE_CLASS)) {
            addClass(holder, RELATIVE_CLASS);
        }

        if (!container) {
            // container not present, create one
            container = document.createElement('div');
            container.className = `${WRAPPER_CLASS} ${position} ${isFixed ? FIXED_CLASS : ''}`;
            holder.appendChild(container);
        }

        container = findFirst(`.${WRAPPER_CLASS}`, holder);

        return container;
    };

    /**
     * @description Method to remove/close a toast.
     * @param {DOM} toast toast to be removed
     * @param {String} removeClass class to be added for transition
     */
    const removeToast = (toast, removalClass) => {
        // Add class to toast that will fade the toast out of the DOM once that is done remove toast from DOM
        addClass(toast, removalClass);
        unBindEvents(toast);
        setTimeout(() => {
            const parent = toast.parentElement;

            parent.removeChild(toast);
            if (!findAll(`.${TOAST_CLASS}`, parent).length) {
                const grandParent = parent.parentElement
                grandParent.removeChild(parent);
                removeClass(grandParent, RELATIVE_CLASS);
            }
        }, TIME_TO_CLOSE_TOAST);
    };

    /**
     * @description Binds events on close button
     * @param {DOM} closeButton close button from DOM element
     * @param {String} closingAnimation class that shows off the closing animation
     * @param {Object} autoCloseTimeOut timeOut to be stopped
     * @returns {void}
     */
    const bindEvents = (closeButton, closingAnimation, autoCloseTimeOut) => {
        closeButton.addEventListener('click', () => {
            clearTimeout(autoCloseTimeOut);
            removeToast(closeButton.parentElement, closingAnimation);
        });
    }

    /**
     * @description Binds events on close button
     * @param {DOM} toast close button from DOM element
     * @returns {void}
     */
    const unBindEvents = (toast) => {
        const closeButton = findFirst(`.${TOAST_CLOSE_CLASS}`, toast);

        if (closeButton) {
            closeButton.addEventListener('click', () => { removeToast(toast) });
        }
    }

    window.Toast = window.Toast || function (config) {
        /**
         * Create global element references
         */
        this.toast = null;
        this.contentHolder = null;
        this.contentHTML = null;
        this.container = null;
        this.holder = findFirst(`.${config.holder || DEFAULT_HOLDER}`);
        this.type = config.type || '';
        this.customClass = config.customClass || '';
        this.contentClass = config.contentClass;
        this.message = config.message || '';
        this.position = config.position || DEFAULT_POSITION;
        this.duration = config.duration || DEFAULT_DURATION;
        this.closeAnimation = config.closeAnimation || DEFAULT_CLOSE_ANIMATION;
        this.customCloseClass = config.customCloseClass || '';
        this.showCloseBtn = config.showCloseBtn || false;
        this.closeBtnAriaLabel = config.closeBtnAriaLabel || DEFAULT_CLOSE_BTN_ARIA_LABEL;
        // toast will be fixed on the page only if the toast appears on the complete page not on any other inner element
        this.isFixed = ((config.holder || DEFAULT_HOLDER) === DEFAULT_HOLDER && config.isFixed) || IS_TOAST_FIXED;
        this.contentAlignment = config.contentAlignment || '';
    }

    /**
     * @description method to show  toast
     * @returns {void}
     */
    Toast.prototype.show = function () {
        // throw warning if element is not present in DOM
        if (!this.holder) {
            console.warn('the holder is not valid please provide a available holder element');
            return;
        }

        // Check if wrapper exits and and donot create it if not required.
        this.container = giveWrapperElement(this.holder, this.position, this.isFixed);
        const toast = document.createElement('div');
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-hidden', false);

        if (this.contentClass) {
            const elementToBeCloned = findFirst(`.${this.contentClass}`, this.holder);
            const clonedElement = elementToBeCloned.cloneNode(true);

            toast.className = `${TOAST_CLASS} ${this.type} ${this.customClass}`;
            toast.appendChild(clonedElement);
        } else {
            const textNode = document.createTextNode(this.message);

            toast.className = `${TOAST_CLASS} ${this.type} ${this.customClass} ${ONLY_MESSAGE} ${this.contentAlignment}`;
            toast.appendChild(textNode);
        }

        // Adding close button
        const closeButton = document.createElement('button')

        closeButton.className = `${TOAST_CLOSE_CLASS} ${this.customCloseClass}`;
        closeButton.setAttribute('aria-label', this.closeBtnAriaLabel);

        if (this.showCloseBtn) {
            toast.appendChild(closeButton);
        }

        this.container.appendChild(toast);

        const autoCloseTimeOut = setTimeout(() => {
            removeToast(toast, this.closeAnimation);
        }, this.duration);

        if (closeButton) {
            bindEvents(closeButton, this.closeAnimation, autoCloseTimeOut);
        }
    };
}());
