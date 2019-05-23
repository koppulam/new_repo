import objectPath from 'object-path';
import { findFirst, removeClass, addClass } from 'lib/dom/dom-util';
import { disableBodyScroll, enableBodyScroll, stopVerticalScroll } from '../no-scroll';
import matchMedia from '../dom/match-media';

const assign = require('lodash/assign');
const wrapInNameSpace = objectPath.get(window, 'tiffany.authoredContent.areComponentsExposed', false);
const nameSpaceClass = 'tiffany-aem';

/**
 * @description Exposing TiffanyModal to window object need to create instance to create modal.
 * @returns {void}
 * @example
 * this.searchModal = new window.TiffanyModal({
 *    options: {
 *        overlay: false,
 *        element: 'tiffany-search-modal',
 *        closeClass: 'search-modal__container__header__close',
 *        exitFocusRef: 'tray-container__body_fixture-image', //unique class name or reference to element (optional)
 *    }
 * });
 * this.searchModal.open();
 */
(function () {
    window.TiffanyModal = window.TiffanyModal || function () {
        /**
         * Create global element references
         */
        this.modal = null;
        this.modalContainer = null;
        this.contentHolder = null;
        this.isOpened = false;

        let defaults = {};

        /**
         * Create options by extending defaults with the passed in arugments
         */
        if (arguments[0] && typeof arguments[0] === 'object') {
            const optionsExists = objectPath.get(arguments[0], 'options');

            if (optionsExists) {
                objectPath.set(defaults, 'className', arguments[0].options.className || '');
                objectPath.set(defaults, 'overlay', arguments[0].options.overlay);
                objectPath.set(defaults, 'element', arguments[0].options.element || 'div');
                objectPath.set(defaults, 'close', arguments[0].options.closeClass);
                objectPath.set(defaults, 'tearDown', arguments[0].options.tearDown || function () { });
                objectPath.set(defaults, 'id', arguments[0].options.id);
                objectPath.set(defaults, 'blockVerticalScroll', arguments[0].options.blockVerticalScroll || false);
                objectPath.set(defaults, 'blockMobileScrollability', arguments[0].options.blockMobileScrollability || false);
                objectPath.set(defaults, 'blockDesktopScrollability', arguments[0].options.blockDesktopScrollability || false);
                objectPath.set(defaults, 'closeonTapOutside', arguments[0].options.closeonTapOutside || {});
                objectPath.set(defaults, 'overlayClass', arguments[0].options.overlayClass || '');
                objectPath.set(defaults, 'modalFocus', arguments[0].options.modalFocus || '');
                objectPath.set(defaults, 'exitFocusRef', arguments[0].options.exitFocusRef || false);
                objectPath.set(defaults, 'props', arguments[0].options.props || {});
            }
            this.options = extendDefaults(defaults, arguments[0]);
        }
    }

    /**
     * close method to remove instance of modal from dom
     * make sure to close before creating new instance
     */
    TiffanyModal.prototype.close = function () {
        if (wrapInNameSpace) {
            modalRemove(this.modalWrapper);
        } else {
            modalRemove(this.modal);
        }

        const metaTag = findFirst('meta[name="viewport"]');

        metaTag.content = metaTag.content.split(', ').filter(value => value !== 'user-scalable=no').join(', ');
        if (this.options.overlay && this.pageWrapContainer) {
            removeClass(this.pageWrapContainer, this.options.overlayClass);
        }
        this.resizeHandler(this.options.blockMobileScrollability, this.options.blockDesktopScrollability, true);
        if (this.options.exitFocusRef) {
            if (typeof this.options.exitFocusRef === 'string') {
                const element = findFirst(`.${this.options.exitFocusRef}`);

                if (element) {
                    element.focus();
                }
            } else if (typeof this.options.exitFocusRef === 'object') {
                this.options.exitFocusRef.focus();
            }
        }

        this.options.tearDown(this.contentHolder);
        unBindEvents.call(this);
        this.isOpened = false;
    }

    /**
     * method to open modal
     */
    TiffanyModal.prototype.open = function (callback) {
        const metaTag = findFirst('meta[name="viewport"]');

        metaTag.content = `${metaTag.content}, user-scalable=no`;
        buildOut.call(this);
        initializeEvents.call(this);
        window.getComputedStyle(this.modal).height;
        this.modalContainer.className = this.modalContainer.className + ' tiffany-modal-open';
        if (this.options.overlay) {
            addClass(this.modal, this.options.overlayClass);
        }
        if (typeof callback === 'function') {
            callback();
        }
        this.resizeHandler(this.options.blockMobileScrollability, this.options.blockDesktopScrollability);
        if (this.options.blockVerticalScroll) {
            stopVerticalScroll(this.options.className);
        }
        this.isOpened = true;

        // This will set focus to modal div. need to extend this if element is passed set focus to that else this
        if (this.options.modalFocus) {
            findFirst('.modal-content').focus();
        }
    }

    function createElementFromHTML(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    }

    /**
     *  build elements to wrap above content
     */
    function buildOut() {
        let content, contentHolder, docFrag;
        const btn = document.createElement("button");

        if (typeof this.options.content) {
            content = this.options.content;
        }

        // Create a DocumentFragment to build with
        docFrag = document.createDocumentFragment();

        if (wrapInNameSpace) {
            // Create modalWrapper if namespace is required
            this.modalWrapper = document.createElement('div');
            this.modalWrapper.className = nameSpaceClass;
        }

        // Create modal element
        this.modal = document.createElement('div');
        this.modal.className = 'modal__wrapper';

        // Create modal element
        this.modalContainer = document.createElement('div');
        this.modalContainer.className = 'tiffany-modal ' + this.options.className;
        this.modalContainer.setAttribute("aria-modal", "true");
        if (this.options.id) {
            this.modalContainer.setAttribute("id", this.options.id);
        }

        // Create content area and append to modal container
        let props = '';
        Object.keys(this.options.props).forEach((prop) => {
            props += ` ${prop}="${this.options.props[prop]}"`;
        });

        const comp = `<${this.options.element} ${props} />`;

        contentHolder = createElementFromHTML(comp);
        contentHolder.className = 'modal-content';
        contentHolder.innerHTML = content;

        this.modalContainer.appendChild(contentHolder);
        btn.setAttribute("class", "button-hidden");
        btn.setAttribute("aria-hidden", "true");
        this.modalContainer.appendChild(btn);
        this.contentHolder = contentHolder;
        this.contentHolder.setAttribute("role", "dialog");
        this.contentHolder.setAttribute("tabindex", "-1");

        this.modal.appendChild(this.modalContainer);
        // Append modal to DocumentFragment

        if (wrapInNameSpace) {
            this.modalWrapper.appendChild(this.modal);
            docFrag.appendChild(this.modalWrapper);
        } else {
            docFrag.appendChild(this.modal);
        }

        // Append DocumentFragment to body
        document.body.appendChild(docFrag);

    }

    /**
     * remove dom element
     * @param {HTML Element} modal
     */
    function modalRemove(modal) {
        if (typeof modal.remove === 'function') {
            modal.remove();
        } else if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }

    TiffanyModal.prototype.resizeBy = function (e) {
        if (e.matches && this.isOpened) {
            addClass(findFirst('html'), 'has-modal-opened');
            disableBodyScroll(this.options.className || 'tiffany-modal');
        } else {
            removeClass(findFirst('html'), 'has-modal-opened');
            enableBodyScroll(this.options.className || 'tiffany-modal');
        }
    }

    TiffanyModal.prototype.resizeHandler = function (isMobile, isDesktop, isClose) {
        if (isMobile && !isDesktop) {
            const belowDesktop = window.matchMedia(matchMedia.BREAKPOINTS.BELOW_EXACT_DESKTOP_TABLET);

            if (isClose) {
                removeClass(findFirst('html'), 'has-modal-opened');
                belowDesktop.removeListener(this.resizeBy.bind(this));
                enableBodyScroll(this.options.className || 'tiffany-modal');
            } else {
                belowDesktop.addListener(this.resizeBy.bind(this));
                if (belowDesktop.matches) {
                    addClass(findFirst('html'), 'has-modal-opened');
                    disableBodyScroll(this.options.className || 'tiffany-modal');
                }
            }
        } else if (isMobile && isDesktop) {
            if (isClose) {
                removeClass(findFirst('html'), 'has-modal-opened');
                enableBodyScroll(this.options.className || 'tiffany-modal');
            } else {
                addClass(findFirst('html'), 'has-modal-opened');
                disableBodyScroll(this.options.className || 'tiffany-modal');
            }
        }
    }

    /**
     * @param {String} source
     * @param {String} properties
     */
    function extendDefaults(source, properties) {
        return assign(source, properties);
    }

    /**
     * initialize overlay click events
     */
    function closeModalOnTap(e) {
        if (this.modal && this.isOpened) {
            const element = this.modal.getElementsByClassName(this.options.closeonTapOutside.modalContainerClass);
            if (element.length > 0 && e.target !== element[0] && !element[0].contains(e.target)) {
                this.close();
            }
        }
    }

    /**
     * initialize overlay click events
     */
    function initializeEvents() {
        this.modal.addEventListener('click', closeModalTrigger.bind(this));
        if (this.options.closeonTapOutside.isClose) {
            document.addEventListener('click', closeModalOnTap.bind(this), true);
        }
    }

    /**
     * @param {HtmlEvent} e click
     * @param {className} className modal class name
     */
    function closeModalTrigger(e) {
        if (e.target.classList.contains(this.options.close)) {
            this.close();
        }
    }

    /**
     * unbind overlay
     */
    function unBindEvents() {
        this.modal.removeEventListener('click', closeModalTrigger.bind(this));
        if (this.options.closeonTapOutside.isClose) {
            document.removeEventListener('click', closeModalOnTap.bind(this), true);
        }
    }
}());
