/**
 * @module header
 * @version 1.0.0
 * @since Tue May 15 2018
 */

// dependencies
import { initIcon } from 'lib/icon-util';
import { initScrollBar, updateScrollBar } from 'lib/dom/custom-scrollbar';
import getKeyCode from 'lib/utils/KeyCodes';
import matchMedia from 'lib/dom/match-media';
import styleVariables from 'lib/utils/breakpoints';
import {
    addClass,
    removeClass,
    findFirst,
    hasClass
} from 'lib/dom/dom-util';
import { enableBodyScroll, disableBodyScroll } from 'lib/no-scroll';
import * as objectPath from 'object-path';

import './header.hbs';
import './header.scss';

const compRegisterRef = require('lib/component-register');
const scopeFocus = require('lib/dom/scope-focus');
const getDataAttributes = require('lib/dom/get-data-attributes');
const $ = require('jquery');

const { registerComponent } = compRegisterRef;
const scrollDisavledBy = 'global-header';
const hoverDelay = 150;
let mouseOutTimeOutId;
let mouseInTimeOutId;
let isMenuStillOpen = false;

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__header';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'header';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createHeaderInstance() {
    /**
     * Component instance.
     * @type {Object}
     */
    const instance = {};

    let globalBanner;
    let globalBannerBody;
    let globalBannerSlickContent;
    let countryBanner;
    let chooseHeader;
    let menuScrollInstance;
    let showMenuTouchmoveFlag;
    let hideMenuTouchmoveFlag;
    let $slideMenu;
    const subMenuScrollInstance = [];

    /**
     * By setting `instance.domRefs` the baseComponent will replace the value
     * of each keys in `instance.domRefs.first` with single elements found
     * in `instance.element`. Same for `instance.domRefs.all`, but each key
     * will have an array of elements.
     *
     * `first` example: The value of `childEl` will be a `HTMLElement`
     * `all` example: The value of `rows` will be an `Array` of `HTMLElement`
     * @type {Object}
     */
    instance.domRefs = {
        definition: styleDefinition,
        first: {
            search: '__search',
            menuButton: '__menu',
            ieMenuButton: '__menu_ie',
            storeLocator: '__storeLocator',
            flyout: '__flyout',
            navContainer: '__nav-container',
            closeBtn: ' .close_menu',
            backdrop: '__backdrop',
            subMenu: '__sub-menu',
            flyoutContent: '__flyout_content'
        },
        all: {
            hasSubMenuBtn: ' .has-sub-menu',
            subMenuBtn: ' .sub-menu-btn',
            subMenu: '__sub-menu',
            imgHoverContainer: ' .flyout-image-hover',
            closeSubMenu: ' .mobile-title .icon-Left',
            subMenuItem: ' .sub-menu-item'
        }
    };

    /** @type {Object} */
    const singleRefs = instance.domRefs.first;
    let searchModal;
    let mainContainer;

    /** @type {Object} */
    const listRefs = instance.domRefs.all;

    let menuBtnAttr;

    /** @type {Element} Jquery Element sku Image Item element */
    let $subMenuItem;

    /**
     * `created` is called before `attached`. Can be used to pass data to
     * childrens `params` property.
     */
    // instance.created = () => {
    //   forEach(instance.children, updateChildParams);
    // };

    /**
     * Update the `instance.params` for `childInstance`.
     *
     * @param {object} childInstance
     */
    // function updateChildParams(childInstance) {
    //   childInstance.receiveNewParams({
    //     id: instance.attribute.id,
    //     updateId: onIdChanged
    //   });
    // }

    /**
     * The `instance.params` object was changed from parent calling `instance.receiveNewParams`.
     * Properties and callback functions can be dealt with or passed down to
     * child components.
     */
    // instance.onNewParamsReceived = () => {
    //   forEach(instance.children, child => {
    //     child.receiveNewParams({
    //       updateId: instance.params.updateId
    //     });
    //   });
    // };

    /**
     * Initialize any DOM elements which can be found within the hbs file for
     * this component.
     * @returns {void}
     */
    function initDOMReferences() {
        globalBanner = findFirst('.global-banner');
        globalBannerBody = findFirst('.global-banner__body');
        globalBannerSlickContent = findFirst('.global-banner .slick-active .tiffany-rte');
        countryBanner = findFirst('.choose-country');
        mainContainer = findFirst('.page-wrap');
        $subMenuItem = $(listRefs.subMenuItem);
        $slideMenu = $(instance.element).find('.header__sub-menu');
        if (globalBanner) {
            chooseHeader = globalBanner;
        }

        if (window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches && globalBannerSlickContent) {
            const bodyHeight = globalBannerBody.height();
            const contentHeight = globalBannerSlickContent.height();
            const paddingTop = (bodyHeight - contentHeight) / 2;

            globalBannerSlickContent.style.paddingTop = paddingTop;
        }

        if (countryBanner) {
            chooseHeader = countryBanner;
        }
    }

    /**
     * sticky header
     * @returns {void}
     */
    function onScroll() {
        const rect = singleRefs.navContainer.getBoundingClientRect();

        singleRefs.flyoutContent.style.top = `${rect.bottom - 4}px`;
        singleRefs.backdrop.style.top = `${rect.bottom - 4}px`;

        if (listRefs.subMenu) {
            listRefs.subMenu.forEach(element => {
                element.style.top = `${rect.bottom - 4}px`;
            });
        }

        if (listRefs.imgHoverContainer) {
            listRefs.imgHoverContainer.forEach(element => {
                element.style.top = `${rect.bottom - 4}px`;
            });
        }

        if (chooseHeader) {
            const countryLabel = $('#choose-country-label');
            const elem = $('#choose-country');

            const countryBannerHeight = countryBanner ? countryBanner.getBoundingClientRect().height : 0;
            const globalBannerHeight = globalBanner ? globalBanner.getBoundingClientRect().height : 0;

            if ((window.pageYOffset > countryBannerHeight + globalBannerHeight) || ($('body').hasClass('preserve-sticky'))) {
                addClass(instance.element, 'header__sticky');
                if ($(instance.element).parent().hasClass('tiffany-aem') && objectPath.get(window, 'tiffany.authoredContent.areComponentsExposed', false)) {
                    $(instance.element).parent().addClass('header-sticked');
                }
                if (mainContainer) {
                    addClass(mainContainer, 'header__sticky');
                    elem.prop('checked', false);
                    removeClass(countryBanner, 'dropdown-open');
                    countryLabel.attr('aria-expanded', 'false');
                }
            } else {
                removeClass(instance.element, 'header__sticky');
                $(instance.element).parent().removeClass('header-sticked');
                if (mainContainer) {
                    removeClass(mainContainer, 'header__sticky');
                }
            }
        }
    }

    /**
     * @description hide sub menu
     * @param {event} e event
     * @returns {void}
     */
    function hideSubMenu(e) {
        const eventType = e.type;

        if (eventType === 'touchmove') {
            hideMenuTouchmoveFlag = true;
        }

        if (eventType === 'touchend' && hideMenuTouchmoveFlag) {
            hideMenuTouchmoveFlag = false;
        } else {
            e.stopPropagation();
            const currentActiveSubMenu = findFirst('.is-sub-menu-active', instance.element);

            if (currentActiveSubMenu) {
                removeClass(currentActiveSubMenu, 'is-sub-menu-active');
                removeClass(singleRefs.navContainer, 'sub-menu-active');
            }
        }
    }

    /**
    * close header flyout
    * @param {object} e event
    * @returns {void}
    */
    function closeMenu(e) {
        if (e.type === 'keyup') {
            const type = getKeyCode(e.keyCode, e.shiftKey);

            if (type === 'ESCAPE') {
                hideSubMenu(e);
                instance.hideFlyout(e);
            }
        } else {
            hideSubMenu(e);
            instance.hideFlyout(e);
        }
    }

    /**
    * close header flyout
    * @param {object} e event
    * @returns {void}
    */
    function focusMenuButton(e) {
        if (e.type === 'focus') {
            addClass(singleRefs.menuButton, 'is-focussed');
        } else {
            removeClass(singleRefs.menuButton, 'is-focussed');
        }
    }

    /**
     * @description hide flyout
     * @param {Object} e event
     * @returns {void}
     */
    instance.hideFlyout = (e) => {
        scopeFocus.dispose();
        hideSubMenu(e);
        singleRefs.menuButton.setAttribute('aria-label', menuBtnAttr);
        removeClass(singleRefs.flyout, 'is-active');
        removeClass(singleRefs.ieMenuButton, 'is-menu-open');
        removeClass(instance.element, 'blur-content');
        removeClass(singleRefs.navContainer, 'sub-menu-active');
        instance.menuButtonAnim.anim.playSegments([60, 0], true);
        $('.wrapper.custom-scroll').animate({ scrollTop: 0 });
        setTimeout(() => {
            enableBodyScroll(scrollDisavledBy, false);
        }, 500);
        singleRefs.menuButton.focus();
        singleRefs.closeBtn.removeEventListener('click', closeMenu, instance.element);
        singleRefs.backdrop.removeEventListener('mouseover', closeMenu, instance.element);
        document.removeEventListener('keyup', closeMenu);
    };

    /**
     * @description show flyout
     * @param {object} anim animation
     * @param {event} e event object
     * @returns {void}
     */
    function showFlyout(anim, e) {
        onScroll();
        const closeBtnAttr = singleRefs.closeBtn.getAttribute('aria-label');

        if (anim.firstFrame === 30) {
            instance.hideFlyout(e);
        } else {
            anim.playSegments([30, 60], true);
            addClass(singleRefs.flyout, 'is-active');
            addClass(singleRefs.ieMenuButton, 'is-menu-open');
            addClass(instance.element, 'blur-content');
            setTimeout(() => {
                disableBodyScroll(scrollDisavledBy, true);
            }, 600);
            scopeFocus.setScopeLimit(singleRefs.flyout);
            singleRefs.menuButton.setAttribute('aria-label', closeBtnAttr);
            singleRefs.ieMenuButton.setAttribute('aria-label', closeBtnAttr);
        }
    }

    /**
     * Dealloc variables and removes any added listeners.
     * @returns {void}
     */
    function customScroll() {
        const menuScroll = $('.wrapper.custom-scroll');
        const subMenuScroll = $('.header__sub-menu-links.custom-scroll');

        if (menuScrollInstance) {
            updateScrollBar(menuScrollInstance);
        } else {
            menuScrollInstance = initScrollBar($(menuScroll)[0]);
        }

        $.each(subMenuScroll, (key, subMenuItem) => {
            if (subMenuScrollInstance[key]) {
                updateScrollBar(subMenuScrollInstance[key]);
            } else {
                subMenuScrollInstance[key] = initScrollBar(subMenuItem);
            }
        });

    }

    /**
     * @description Menu click handler
     * @param {object} anim Animation object
     * @param {event} e click event
     * @returns {void}
     */
    function menuClickHandler(anim, e) {
        showFlyout(anim, e);
        customScroll();
    }

    /**
     * @description Menu hover handler
     * @param {object} anim Animation object
     * @param {Array} segments Segments to bbe played
     * @param {event} e click event
     * @returns {void}
     */
    function menuHoverHandler(anim, segments, e) {
        if (anim.firstFrame !== 30) {
            e.stopPropagation();
            anim.playSegments(segments, true);
        }
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {
        onScroll();
        instance.menuButtonAnim = initIcon(singleRefs.menuButton);
        instance.searchButtonAnim = initIcon(singleRefs.search);
        instance.locatorButtonAnim = initIcon(singleRefs.storeLocator);
        menuBtnAttr = singleRefs.menuButton.getAttribute('aria-label');
        // customScroll();
    }

    /**
     * Search Modal click
     * @param {object} e event
     * @returns {void}
     */
    function searchButtonClick(e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.type === 'keypress') {
            const type = getKeyCode(e.keyCode, e.shiftKey);

            if (type === 'ENTER' || type === 'SPACE') {
                searchModal.open();
            }
        } else {
            searchModal.open();
        }
    }

    /**
     * @description search hover handler
     * @param {object} anim Animation object
     * @param {Array} segments Segments to bbe played
     * @param {event} e click event
     * @returns {void}
     */
    function searchHoverHandler(anim, segments, e) {
        e.stopPropagation();
        anim.playSegments(segments, true);
    }

    /**
     * Store Locator click
     * @param {object} anim Animation object
     * @param {Array} segments Segments to bbe played
     * @param {event} e click event
     * @returns {void}
     */
    function storeLocatorClick(anim, segments, e) {
        e.stopPropagation();
        anim.playSegments(segments, true);
        if ((e.type === 'keypress' && (e.keyCode === 13 || e.keyCode === 0)) || e.type === 'click') {
            const attrs = getDataAttributes(singleRefs.storeLocator);

            if (attrs.src) {
                if (attrs.target === '_blank') {
                    const ele = window.open(attrs.src, '_blank');

                    ele.focus();
                } else {
                    window.open(attrs.src, '_self');
                }
            }
        }
    }

    /**
     * Store Locator Hover
     * @param {object} anim Animation object
     * @param {Array} segments Segments to bbe played
     * @param {event} e click event
     * @returns {void}
     */
    function storeLocatorHoverHandler(anim, segments, e) {
        e.stopPropagation();
        anim.playSegments(segments, true);
    }

    /**
     * @description show sub menu
     * @returns {void}
     * @param {object} event event
     * @param {object} currentTarget dom element target
     */
    function showSubMenu(event, currentTarget) {
        const eventType = event.type;

        if (isMenuStillOpen) {
            return;
        }

        if (eventType === 'touchmove') {
            showMenuTouchmoveFlag = true;
        }

        if (eventType === 'touchend' && showMenuTouchmoveFlag) {
            showMenuTouchmoveFlag = false;
        } else if (eventType === 'touchend' || eventType === 'mouseenter' || eventType === 'mouseleave' || (eventType === 'click' && window.matchMedia(styleVariables.desktopAndBelow).matches)) {
            const subMenuItem = currentTarget || event.currentTarget;

            if (!hasClass(subMenuItem, 'is-sub-menu-active')) {
                const activeMenu = findFirst('.is-sub-menu-active', instance.element);

                removeClass(activeMenu, 'is-sub-menu-active');
                addClass(subMenuItem, 'is-sub-menu-active');
                addClass(singleRefs.navContainer, 'sub-menu-active');
                customScroll();
            } else if (hasClass(event.target, 'top-level-item')) {
                hideSubMenu(event);
            }

            if (event.target.nodeName === 'A' && subMenuItem && !hasClass(event.target, 'sub-menu-item')) {
                event.preventDefault();
                event.target.blur();
            }
        }
    }

    /**
     * Search Modal register
     * @returns {void}
     */
    function registerSearchModal() {
        if (!searchModal) {
            searchModal = new window.TiffanyModal({
                options: {
                    overlay: false,
                    element: 'tiffany-search-modal',
                    closeClass: 'search-modal__container_header-close',
                    id: 'tiffany-search-modal',
                    className: 'search-overlay',
                    exitFocusRef: 'header__search',
                    blockMobileScrollability: true,
                    closeonTapOutside: {
                        isClose: true,
                        modalContainerClass: 'search-modal__container'
                    }
                }
            });
        }
    }

    /**
     * @description on menu item hover
     * @param {object} event event object
     * @returns {void}
     */
    function onSubMenuMouseenter(event) {
        clearTimeout(mouseOutTimeOutId);
        const e = event;
        const { currentTarget } = e;

        mouseInTimeOutId = setTimeout(() => {
            const menuItem = currentTarget;

            if (!window.matchMedia(styleVariables.desktopAndBelow).matches) {
                const menuItemCta = findFirst('.top-level-item', menuItem);

                menuItemCta.setAttribute('aria-expanded', 'true');
                showSubMenu(e, currentTarget);
            }
            findFirst('.header__sub-menu-links.custom-scroll', menuItem).scrollTop = 0;
        }, hoverDelay);
    }

    /**
     * @description on menu item hover
     * @param {object} event event object
     * @returns {void}
     */
    function onSubMenuMouseleave(event) {
        clearTimeout(mouseInTimeOutId);
        const e = event;
        const { currentTarget } = e;

        mouseOutTimeOutId = setTimeout(() => {
            if (e.toElement && (e.toElement.className === 'ps__thumb-y' || e.toElement.className === 'ps__rail-y')) {
                e.preventDefault();
            } else if (!window.matchMedia(styleVariables.desktopAndBelow).matches) {
                hideSubMenu(e, currentTarget);
                const menuItem = currentTarget;
                const menuItemCta = findFirst('.top-level-item', menuItem);

                menuItemCta.setAttribute('aria-expanded', 'false');
            }
        }, hoverDelay);
    }

    /**
     * @description Registers the menu close event listners
     * @param {Event} e Event object
     * @returns {void}
     */
    function registerCloseMenuListners(e) {
        if (e && e.type === 'keypress') {
            const type = getKeyCode(e.keyCode, e.shiftKey);

            if (type !== 'ENTER' || type !== 'SPACE') {
                return;
            }
        }
        singleRefs.closeBtn.addEventListener('click', closeMenu, instance.element);
        singleRefs.closeBtn.addEventListener('focus', focusMenuButton, instance.element);
        singleRefs.closeBtn.addEventListener('blur', focusMenuButton, instance.element);
        singleRefs.backdrop.addEventListener('mouseover', closeMenu, instance.element);
        document.addEventListener('keyup', closeMenu);
    }

    /**
     * @description onSubMenuTouchMove
     * @param {object} evt event object
     * @returns {void}
     */
    function onSubMenuTouchMove(evt) {
        evt.stopPropagation();
    }

    /**
     * Pick a store click scroll bottom
     * @param {event} e object
     * @returns {void}
     */
    function subMenuItemClick(e) {
        e.preventDefault();
        const element = $(this);

        if (element && element.length > 0) {
            const href = $(this).attr('href');
            const target = $(this).attr('target');

            if (target === '_blank') {
                window.open(href, target);
            } else {
                window.location = href;
            }
        }
    }

    /**
     * Append listeners to the element.
     * @returns {void}
     */
    function addListeners() {
        if (instance && instance.menuButtonAnim) {
            singleRefs.menuButton.addEventListener('click', menuClickHandler.bind(this, instance.menuButtonAnim.anim));
            singleRefs.menuButton.addEventListener('mouseenter', menuHoverHandler.bind(this, instance.menuButtonAnim.anim, [0, 30]));
            // singleRefs.menuButton.addEventListener('mouseleave', menuHoverHandler.bind(this, instance.menuButtonAnim.anim, [30, 0]));
            // singleRefs.menuButton.addEventListener('keypress', menuClickHandler.bind(this, instance.menuButtonAnim.anim));
            singleRefs.menuButton.addEventListener('click', registerCloseMenuListners.bind(this));

            singleRefs.ieMenuButton.addEventListener('click', menuClickHandler.bind(this, instance.menuButtonAnim.anim));
            singleRefs.ieMenuButton.addEventListener('click', registerCloseMenuListners.bind(this));
        }
        if (instance && instance.searchButtonAnim) {
            singleRefs.search.addEventListener('click', searchButtonClick.bind(this));
            singleRefs.search.addEventListener('mouseenter', searchHoverHandler.bind(this, instance.searchButtonAnim.anim, [0, 30]));
            singleRefs.search.addEventListener('mouseleave', searchHoverHandler.bind(this, instance.searchButtonAnim.anim, [30, 0]));
            singleRefs.search.addEventListener('keypress', searchButtonClick.bind(this));
        }
        if (instance && instance.locatorButtonAnim) {
            singleRefs.storeLocator.addEventListener('click', storeLocatorClick.bind(this, instance.locatorButtonAnim.anim, [0, 24]));
            singleRefs.storeLocator.addEventListener('mouseenter', storeLocatorHoverHandler.bind(this, instance.locatorButtonAnim.anim, [0, 24]));
            singleRefs.storeLocator.addEventListener('mouseleave', storeLocatorHoverHandler.bind(this, instance.locatorButtonAnim.anim, [24, 0]));
            singleRefs.storeLocator.addEventListener('keypress', storeLocatorClick.bind(this, instance.locatorButtonAnim.anim, [0, 24]));
        }

        registerSearchModal();
        // instance.addEventListener('click', hideSubMenu, listRefs.closeSubMenu);
        document.addEventListener('scroll', onScroll);

        if (listRefs.closeSubMenu.length > 0) {
            listRefs.closeSubMenu.forEach(element => {
                instance.addEventListener('click', hideSubMenu, element);
                instance.addEventListener('touchend', hideSubMenu, element);
                instance.addEventListener('touchmove', hideSubMenu, element);
            });
        }

        if (listRefs.hasSubMenuBtn.length > 0) {
            listRefs.hasSubMenuBtn.forEach(element => {
                instance.addEventListener('touchend', showSubMenu, element);
                instance.addEventListener('touchmove', showSubMenu, element);
                instance.addEventListener('click', showSubMenu, element);
                instance.addEventListener('mouseenter', onSubMenuMouseenter, element);
                instance.addEventListener('mouseleave', onSubMenuMouseleave, element);
            });
        }

        $('.header__sub-menu-links.custom-scroll').on('wheel mousewheel', onSubMenuTouchMove);

        $('.has-sub-menu').focusin(function onFocusin() {
            $('.top-level-item', $(this)).attr('aria-expanded', 'true');
        });

        $('.has-sub-menu').focusout(function onFocusin() {
            $('.top-level-item', $(this)).attr('aria-expanded', 'false');
        });

        $subMenuItem.on('click', subMenuItemClick);

        $slideMenu.on('transitionend webkitTransitionEnd oTransitionEnd', (e) => {
            const $targetElements = $(e.target.parentElement);

            isMenuStillOpen = $targetElements.hasClass('is-sub-menu-active');
        });
    }

    /**
     * Dealloc variables and removes any added listeners.
     * @returns {void}
     */
    function dispose() {
        $('.header__sub-menu-links.custom-scroll').off('touchmove mousemove wheel mousewheel', onSubMenuTouchMove);
        document.removeEventListener('keyup', closeMenu);
        document.removeEventListener('scroll', onScroll);
        $slideMenu.off('transitionend webkitTransitionEnd oTransitionEnd');
    }

    /**
     * The DOM Element was added to the DOM.
     * @returns {void}
     */
    instance.attached = () => {
        initDOMReferences();
        init();
        addListeners();
    };

    /**
     * The DOM Element was removed from the DOM.
     * Dealloc variables and removes any added listeners that was NOT added
     * through `instance.addEventListener`.
     * @returns {void}
     */
    instance.detached = () => {
        // console.log('detached!', instance.element);
        dispose();
    };

    return instance;
}

registerComponent(componentReference, createHeaderInstance);
