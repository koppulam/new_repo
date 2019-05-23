/**
 * @module footer
 * @version 1.0.0
 * @since Tue May 15 2018
 */

// dependencies
import getKeyCode from 'lib/utils/KeyCodes';
import './footer.hbs';
import './footer.scss';
import * as objectPath from 'object-path';

const compRegisterRef = require('lib/component-register');

const $ = require('jquery');

const { registerComponent } = compRegisterRef;
const EMAIL_IDENTIFIER = '?email=';

/**
 * The definition of the component. Each DOM element will
 * define the elements class with this string.
 * @type {string}
 */
export const componentReference = 'app-js__footer';

/**
 * The style definition of the component.
 * @type {string}
 */
export const styleDefinition = 'footer';

/**
 * Factory method to create an instance. Linked to an html element.
 *
 * @returns {object} Component instance.
 */
function createFooterInstance() {
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
            signUpBtn: '__top-wrapper_right-wrapper_signup-button',
            emailInput: '__top-wrapper_right-wrapper_email-wrapper_email-input',
            emailLabel: '__top-wrapper_right-wrapper_email-wrapper_email-label',
            dropdownTurn: '__bottom-wrapper_left-container_toggle',
            countryFooter: '__bottom-wrapper_left-container'
        },
        all: {
            weChat: '__wechat',
            closeButton: '__overlay_popup_close',
            popUp: '__overlay_popup',
            overlay: '__overlay'
        }
    };

    /** @type {Object} */
    const singleRefs = instance.domRefs.first;

    /** @type {Object} */
    const listRefs = instance.domRefs.all;

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

    }

    /**
     * @description signup
     * @param {object} e event
     * @returns {void}
     */
    function onSignupClick(e) {
        let email = singleRefs.emailInput.value;
        let link = e.target.dataset.url;

        e.preventDefault();
        if (email) {
            email = window.btoa(email);
            e.preventDefault();
            // check if email is already present in link authored
            // Sign up page expects ?email= to be at the ending of URL
            if (link.indexOf(EMAIL_IDENTIFIER) !== -1) {
                // email query param is present
                link = link.replace(EMAIL_IDENTIFIER, '');
            }
            window.location.href = `${link}${EMAIL_IDENTIFIER}${email}`;
            return;
        }
        window.location.href = link;
    }

    /**
     * @param {e} e event key press
     * @returns {void}
     */
    function handleKeyPress(e) {
        const charCode = e.which ? e.which : e.keyCode;
        const type = getKeyCode(charCode);

        if (type === 'ENTER') {
            const checkBoxID = $(e.target).find('label').attr('for');

            $(e.target).trigger('click');

            if (checkBoxID) {
                const checkbox = $(`#${checkBoxID}`);

                checkbox.prop('checked', !checkbox.prop('checked'));
                checkbox.trigger('change');
            }
        }
    }

    /**
    * Updates footer column layout width to avoid overlapping
    * @returns {void}
    */
    function updateWidthOnResize() {
        $('.choose-country__bottom-wrapper ul').each(function updateWidth(index) {
            const lastChild = $(this).children().last();
            const newWidth = lastChild.position().left - $(this).position().left + lastChild.outerWidth(true);

            $(this).width(newWidth);
        });
    }

    /**
     * @description dropdown
     * @param {object} e event
     * @returns {void}
     */
    function onDropdownClick(e) {
        const currentEle = e.currentTarget;
        const $dropdown = $(currentEle).find('.footer__bottom-wrapper_left-container_arrow');
        const $countryContainer = $(singleRefs.countryFooter).find('.choose-country__container');
        const $footerChooseCountry = $('.footer__bottom-wrapper .choose-country__content');

        $dropdown.toggleClass('down');

        if ($dropdown.hasClass('down')) {
            $(singleRefs.dropdownTurn).attr('aria-expanded', 'true');
            $footerChooseCountry.removeClass('hide');
            setTimeout(() => {
                $footerChooseCountry.siblings('input[type="checkbox"]').prop('checked', true);
                $countryContainer.show();
                updateWidthOnResize();
                $('html, body').animate({ scrollTop: $(document).height() }, 800);
            });
        } else {
            $countryContainer.slideUp(600, () => {
                $(singleRefs.dropdownTurn).attr('aria-expanded', 'false');
                $('html, body').animate({ scrollTop: $(document).height() - ($(window).height() + 1) });
                setTimeout(() => {
                    $footerChooseCountry.addClass('hide');
                    $footerChooseCountry.siblings('input[type="checkbox"]').prop('', false);
                });
            });
        }
    }

    /**
     * @description adds a class to make the column wider to avoid the overlap
     * @returns {void}
     */
    function adjustFooterColumnWidth() {
        const $bottomWrappers = $('.choose-country__bottom-wrapper');

        $bottomWrappers.each((index, wrapper) => {
            if ($(wrapper).find('li').length > 7) {
                $($bottomWrappers[index]).addClass('wide-column');
            }
        });
    }

    /**
     * @description on dropdown open/close
     * @param {object} evt event
     * @param {object} ele $element
     * @returns {void}
     */
    function globalFooterChange(evt) {
        const ischecked = $(evt.target).is(':checked');

        if (!ischecked) {
            $(window).off('resize', updateWidthOnResize);
        } else {
            updateWidthOnResize();
            $(window).on('resize', updateWidthOnResize);
        }
    }

    /**
     * @description wechat popup
     * @returns {void}
     */
    function onWechatClick() {
        $(listRefs.overlay).show();
    }

    /**
     * @description wechat popup close
     * @returns {void}
     */
    function closePopUp() {
        $(listRefs.overlay).hide();
    }
    /**
     * @description method that checks if the signupfield has some value and activates the iput box
     * @returns {void}
     */
    function activateInput() {
        const emailInputVal = objectPath.get(singleRefs, 'emailInput.value', '');

        if (emailInputVal && emailInputVal.length) {
            $(singleRefs.emailLabel).addClass('active');
        }
    }

    /**
     * Logic to run when component is ready
     * @returns {void}
     */
    function init() {
        adjustFooterColumnWidth();
        activateInput();
    }

    /**
     * Append listeners to the element.
     * @returns {void}
     */
    function addListeners() {
        // TODO remove inline comments, just example code.
        // To attach an event, use one of the following methods.
        // No need remove the listener in `instance.detached`
        // instance.addEventListener('click', onClick); //attached to `instance.element`
        instance.addEventListener('click', onSignupClick, singleRefs.signUpBtn); // attached to `myEl`
        instance.addEventListener('click', onDropdownClick, singleRefs.dropdownTurn); // attached to `myEl`
        instance.addEventListener('keypress', handleKeyPress, singleRefs.dropdownTurn);

        listRefs.weChat.forEach(element => {
            instance.addEventListener('click', onWechatClick, element);
        });
        listRefs.closeButton.forEach(element => {
            instance.addEventListener('click', closePopUp, element);
        });
        listRefs.overlay.forEach(element => {
            instance.addEventListener('click', closePopUp, element);
        });
        listRefs.popUp.forEach(element => {
            instance.addEventListener('click',
                (event) => {
                    event.cancelBubble = true;
                    if (event.stopPropogation) {
                        event.stopPropogation();
                    }
                }, element);
        });
        $('.css-dropdown__trigger').on('change', globalFooterChange);
    }

    /**
     * Dealloc variables and removes any added listeners.
     * @returns {void}
     */
    function dispose() { }

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

registerComponent(componentReference, createFooterInstance);
