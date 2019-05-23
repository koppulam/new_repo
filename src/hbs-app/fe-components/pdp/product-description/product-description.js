/**
 * @module product-description
 * @version 1.0.0
 * @since Tue May 15 2018
 */

import { getSalesServiceCookie } from 'lib/utils/salesService-util';
import { enableBodyScroll, disableBodyScroll } from 'lib/no-scroll';
// import { addClass, removeClass, findFirst } from 'lib/dom/dom-util';

// dependencies
import * as objectPath from 'object-path';
import './product-description.hbs';
import './product-description.scss';

const $ = require('jquery');

const compRegisterRef = require('lib/component-register');
const scopeFocus = require('lib/dom/scope-focus');

const { scrollTo } = require('lib/utils/scroll-to-content');

const { registerComponent } = compRegisterRef;

const matchMedia = require('lib/dom/match-media');

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__product-description';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'product-description';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createProductdescriptionInstance() {
    /**
     * Component instance.
     * @type {Object}
     */
    const instance = {};

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
            showMore: '__container_show-more',
            specsEllipses: '__container_detail_list',
            closeLink: '__container_close',
            pickaStore: '__container_store-link',
            disclaimerCta: '__disclaimer_link',
            actionContainer: '__buttons',
            wrapper: '__container',
            disclaimerModal: '__modal',
            closeIcon: '__modal_item_close-btn',
            naviagteBackIcon: '__modal_item_arrow-btn',
            candleDisclaimerModal: '__modal_item-candle',
            modifiersContainer: '__modifier_container',
            giftCardTermsModal: '__modal_item-gift-terms',
            giftCardTerms: '__gift-card-terms_cta',
            shareContainer: '__social-sharing_container',
            shareAccordian: '__social-sharing_container_accordian',
            panel: '__social-sharing_panel',
            arrow: '__social-sharing_container_arrow',
            availabilityContainer: '_availability',
            weibo: '__social-sharing_weibo',
            supplementInfo: '__container_supplement-info'
        },
        all: {
            moreContainer: '__container_more'
        }
    };

    /** @type {Object} */
    const singleRefs = instance.domRefs.first;

    /** @type {Object} */
    const listRefs = instance.domRefs.all;

    /** @type {Element} Jquery Element Show more cta element */
    let $showMore;

    /** @type {Element} Supplement info element */
    let $supplementInfo;

    /** @type {Element}  JQuery element for More content */
    let $moreContainer;

    /** @type {Element} pickaStore container */
    let $pickastore;

    /** @type {Element} disclaimer cta element */
    let $disclaimerCta;

    /** @type {Element} pdp buttons element */
    let $actionContainer;

    /** @type {Element} container wrapper element */
    let $containerWrapper;

    /** @type {Element} Disclaimer modal element */
    let $disclaimerDesc;

    /** @type {Element} close button element */
    let $closeIcon;

    /** @type {Element} close Link element */
    let $closeLink;

    /** @type {Element} Left arrow element */
    let $naviagteBackIcon;

    /** @type {Element} Candle disclaimer modal data */
    let $candleDisclaimerModal;

    /** @type {Element} giftCardTerms modal data */
    let $giftCardTermsModal;

    /** @type {Element} giftCardTerms cta */
    let $giftCardTerms;

    /** @type {Element} social sharing container */
    let $shareContainer;

    /** @type {Element} social sharing arrow */
    let $dropdown;

    /** @type {Element} social sharing weibo icon */
    let $weiboIcon;

    /** @type {Boolean} is description expanded */
    let isReadmoreExpanded;
    /** @type {Element} modal close focus back */
    let $modalTriggeredCta;

    /** @type {Element} scope focus ada */
    const btn = document.createElement('button');

    btn.setAttribute('class', 'button-hidden');
    btn.setAttribute('aria-hidden', 'true');

    /**
     * Initialize any DOM elements which can be found within the hbs file for
     * this component.
     * @returns {void}
     */
    function initDOMReferences() {
        $pickastore = $(singleRefs.pickaStore);
        $showMore = $(singleRefs.showMore);
        $disclaimerCta = $(singleRefs.disclaimerCta);
        $actionContainer = $(singleRefs.actionContainer);
        $containerWrapper = $(singleRefs.wrapper);
        $disclaimerDesc = $(singleRefs.disclaimerModal);
        $moreContainer = $(listRefs.moreContainer);
        $closeIcon = $(singleRefs.closeIcon);
        $closeLink = $(singleRefs.closeLink);
        $naviagteBackIcon = $(singleRefs.naviagteBackIcon);
        $candleDisclaimerModal = $(singleRefs.candleDisclaimerModal);
        $giftCardTermsModal = $(singleRefs.giftCardTermsModal);
        $giftCardTerms = $(singleRefs.giftCardTerms);
        $shareContainer = $(singleRefs.shareContainer);
        $dropdown = $(singleRefs.arrow);
        $weiboIcon = $(singleRefs.weibo);
        $supplementInfo = $(singleRefs.supplementInfo);

        if ($showMore && $showMore.length) {
            isReadmoreExpanded = true;
        }
    }

    /**
     * @description function triggered on scroll
     * @returns {void}
     */
    // function onScroll() {
    //     let anchorEle;
    //     const sizeGuide = findFirst('.modifiers__container_sizeguide_wrap');
    //
    //     if (singleRefs.actionContainer) {
    //         anchorEle = singleRefs.actionContainer.previousElementSibling;
    //         const anchorRect = anchorEle.getBoundingClientRect();
    //         const actionsRect = singleRefs.actionContainer.getBoundingClientRect();
    //         let modifierRect;
    //
    //         // const modifierEle = singleRefs.wrapper;
    //         if (singleRefs.modifiersContainer && sizeGuide) {
    //             modifierRect = sizeGuide.getBoundingClientRect();
    //         }
    //
    //         if (anchorRect.bottom + actionsRect.height + 16 >= window.innerHeight) {
    //             addClass(singleRefs.actionContainer, 'buttons-sticky');
    //         } else {
    //             removeClass(singleRefs.actionContainer, 'buttons-sticky');
    //         }
    //
    //         if (singleRefs.modifiersContainer && sizeGuide && singleRefs.actionContainer && (modifierRect.top + 8) > actionsRect.top) {
    //             removeClass(singleRefs.actionContainer, 'hide_modifier');
    //         } else if (singleRefs.modifiersContainer) {
    //             addClass(singleRefs.actionContainer, 'hide_modifier');
    //         }
    //     }
    // }

    /**
     * Display ellipsis
     * @param {className} className object
     * @returns {void}
     */
    function showEllipses(className) {
        if (isReadmoreExpanded) {
            const descriptionHeight = $('.product-description__container_long-desc-total').height();

            $(className).css({
                'max-height': descriptionHeight
            }).toggleClass('ellipses');
        } else {
            $(className).css({
                'max-height': '48px'
            }).toggleClass('ellipses');
        }

        const specsHeight = $('.product-description__container_detail_list-specs').height();

        $('.product-description__container_detail_list').css({
            'max-height': specsHeight
        });
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {
        // onScroll();
        showEllipses('product-description__container_long-desc');
        const salesSrvSite = getSalesServiceCookie();

        if (salesSrvSite) {
            $supplementInfo.removeClass('hide');
        }
    }

    /**
     * Close click handler - Hide all the content
     * @param {event} event object
     * @returns {void}
     */
    function closeHandler(event) {
        event.preventDefault();
        $showMore.show();
        $closeLink.hide();
        isReadmoreExpanded = false;
        $('.product-description__container_detail_list-specs').toggleClass('show-more');
        $('.product-description__container_long-desc').css({
            'max-height': '48px'
        }).toggleClass('ellipses');
        const specsHeight = $('.product-description__container_detail_list-specs').height();

        $('.product-description__container_detail_list').css({
            'max-height': specsHeight
        });

        $moreContainer.slideToggle(500);
    }

    /**
     * Show more click handler - shows all the content
     * @param {event} event object
     * @returns {void}
     */
    function showMoreHandler(event) {
        event.preventDefault();
        $showMore.hide();
        $closeLink.show();
        isReadmoreExpanded = true;
        $('.product-description__container_detail_list-specs').toggleClass('show-more');

        const descriptionHeight = $('.product-description__container_long-desc-total').height();

        $('.product-description__container_long-desc').css({
            'max-height': descriptionHeight
        }).toggleClass('ellipses');

        const specsHeight = $('.product-description__container_detail_list-specs').height();

        $('.product-description__container_detail_list').css({
            'max-height': specsHeight
        });
        $moreContainer.slideToggle(500);
    }

    /**
     * Pick a store click scroll bottom
     * @param {event} e object
     * @returns {void}
     */
    function pickAstoreClick(e) {
        e.preventDefault();
        scrollTo(e.target.getAttribute('href'));
    }
    /**
     * Gift Card Terms CTA Handler
     * @param {event} e object
     * @returns {void}
     */
    function giftCardTermsHandler(e) {
        e.preventDefault();
        $actionContainer.addClass('hide');
        $containerWrapper.addClass('hide');
        $disclaimerDesc.removeClass('hide');
        $disclaimerDesc.focus();
        if ($disclaimerDesc && $disclaimerDesc.length > 0) {
            $disclaimerDesc.append(btn);
            scopeFocus.setScopeLimit($disclaimerDesc[0]);
            $modalTriggeredCta = $giftCardTerms;
        }
        $giftCardTermsModal.removeClass('hide');
        // TODO Work on this modal open behaviour
        const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;

        if (!isDesktop) {
            disableBodyScroll('product-description', true);
        } else {
            scrollTo('.pdp-container');
        }
    }
    /**
     * Disclaimer CTA click
     * @param {event} e object
     * @returns {void}
     */
    function disclaimerCtaHandler(e) {
        e.preventDefault();
        $actionContainer.addClass('hide');
        $containerWrapper.addClass('hide');
        $disclaimerDesc.removeClass('hide');
        $disclaimerDesc.focus();
        $candleDisclaimerModal.removeClass('hide');
        if ($disclaimerDesc && $disclaimerDesc.length > 0) {
            $disclaimerDesc.append(btn);
            scopeFocus.setScopeLimit($disclaimerDesc[0]);
            $modalTriggeredCta = $disclaimerCta;
        }
        // TODO Work on this modal open behaviour
        const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;

        if (!isDesktop) {
            disableBodyScroll('product-description', true);
        } else {
            scrollTo('.pdp-container');
        }
    }

    /**
     * Close icon and Left arrow click event has been handled here.
     * @param {event} e object
     * @returns {void}
     */
    function navigateBackHandler(e) {
        e.preventDefault();
        $actionContainer.removeClass('hide');
        $containerWrapper.removeClass('hide');
        $disclaimerDesc.addClass('hide');
        $candleDisclaimerModal.addClass('hide');
        $giftCardTermsModal.addClass('hide');
        const modalBtn = $disclaimerDesc.find('.button-hidden');

        if (modalBtn.length > 0) {
            modalBtn.remove();
        }
        if ($modalTriggeredCta && $modalTriggeredCta.length > 0) {
            $modalTriggeredCta[0].focus();
        }
        scopeFocus.dispose();
        const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;

        if (!isDesktop) {
            enableBodyScroll('product-description', false);
        } else {
            scrollTo('.pdp-container');
        }
    }

    /**
     * Share Cta click
     * @returns {void}
     */
    function shareAccordianHandler() {
        const $panel = $(singleRefs.panel);

        this.classList.toggle('active');
        if ($panel.css('display') === 'block') {
            $panel.css({ display: 'none' });
        } else {
            $panel.css({ display: 'block' });
        }
        if ($dropdown.hasClass('icon-dropdown-down')) {
            $dropdown.removeClass('icon-dropdown-down').addClass('icon-dropdown-up');
        } else {
            $dropdown.removeClass('icon-dropdown-up').addClass('icon-dropdown-down');
        }
    }

    /**
     * weibo Cta click
     * @param {DOMEvent} e event
     * @returns {void}
     */
    function weiboIconHandler(e) {
        e.preventDefault();
        const location = Location;
        const productImage = objectPath.get(window.tiffany.authoredContent, 'productPreviewDetails.images.0.defaultSrc', '');
        const $target = $(e.target);
        const productTitle = $target.data('product-title');
        const weiboURL = $target.data('url');
        const shareURL = window.location.href;
        const url = `${weiboURL}?title=${productTitle}&url=${shareURL}&pic=${productImage}'`;

        const weiboModal = function weiboModalHandler() {
            if (!window.open(url, 'weibo', 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=635,height=455')) location.href = 'url&url=1';
        };

        if (/Firefox/.test(navigator.userAgent)) {
            setTimeout(weiboModal, 0);
        } else {
            weiboModal();
        }
    }

    /**
     * Append listeners to the element.
     * @returns {void}
     */
    function addListeners() {
        $pickastore.on('click', pickAstoreClick);
        $showMore.on('click', showMoreHandler);
        $disclaimerCta.on('click', disclaimerCtaHandler);
        $closeIcon.on('click', navigateBackHandler);
        $naviagteBackIcon.on('click', navigateBackHandler);
        $closeLink.on('click', closeHandler);

        // Gift Card terms cta click
        $giftCardTerms.on('click', giftCardTermsHandler);

        // share container open
        $shareContainer.on('click', shareAccordianHandler);

        // weibo icon redirect
        $weiboIcon.on('click', weiboIconHandler);
        // window.addEventListener('scroll', onScroll);
        // window.addEventListener('stickyATB', onScroll);
        window.addEventListener('onresize', showEllipses('product-description__container_long-desc'));
    }

    /**
     * Dealloc variables and removes any added listeners.
     * @returns {void}
     */
    function dispose() {
        $pickastore.off();
        $showMore.off();
        $disclaimerCta.off();
        $closeIcon.off();
        $naviagteBackIcon.off();
        $closeLink.off();
        window.removeEventListener('onresize', showEllipses);
        // window.removeEventListener('scroll', onScroll);
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
        dispose();
    };

    return instance;
}

registerComponent(componentReference, createProductdescriptionInstance);
