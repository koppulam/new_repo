
const jQuery = require('jquery');
const input_selector = '.material-input textarea, .material-input input[type=text], .material-input input[type=password], .material-input input[type=email], .material-input input[type=url], .material-input input[type=tel], .material-input input[type=number], .material-input input[type=search], .material-input input[type=date], .material-input input[type=time]';

/**
 * @description Function to update labels of text fields
 * @returns {void}
 */
function updateTextFields () {
    jQuery(input_selector).each((index, element) => {
        let $this = jQuery(this);
        if (
            element.value.length > 0 ||
            jQuery(element).is(':focus') ||
            element.autofocus ||
            $this.attr('placeholder') !== null
        ) {
            $this.addClass('active').siblings('label').addClass('active');
        } else {
            $this.removeClass('active').siblings('label').removeClass('active');
        }
    });
}

jQuery(document).ready(() => {
    // Add active if input element has been pre-populated on document ready
    updateTextFields();

    // Add active if form auto complete
    jQuery(document).on('change', input_selector, (e) => {
        if (
            jQuery(e.target).is(input_selector) &&
            (
                jQuery(e.target).val() &&
                jQuery(e.target).val().length !== 0
            ) ||
            jQuery(e.target).attr('placeholder')
        ) {
            jQuery(e.target)
                .addClass('active')
                .siblings('label')
                .addClass('active');
        }
    });

    /**
     * @description HTML DOM FORM RESET handling
     * @param {Event} e event object
     * @returns {void}
     */
    jQuery(document).on('reset', (e) => {
        let formReset = jQuery(e.target);
        if (formReset.is('form')) {
            formReset
                .find(input_selector)
                .removeClass('valid')
                .removeClass('invalid');
            formReset.find(input_selector).each(() => {
                if (this.value.length) {
                    jQuery(this)
                        .removeClass('active')
                        .siblings('label')
                        .removeClass('active');
                }
            });
        }
    });

    /**
     * @description Add active when element has focus
     * @param {Event} e event object
     * @returns {void}
     */
    jQuery(document).on('focus', input_selector, (e) => {
        if (jQuery(e.target).is(input_selector)) {
            jQuery(e.target)
                .addClass('active')
                .siblings('label, .prefix')
                .addClass('active');
        }
    });

    /**
     * @description Remove active when element is blurred
     * @param {Event} e event object
     * @returns {void}
     */
    jQuery(document).on('blur', input_selector, (e) => {
        let $inputElement = jQuery(e.target);
        if ($inputElement.is(input_selector)) {
            let selector = '.prefix';

            if (
                $inputElement[0].value.length === 0 &&
                !$inputElement.attr('placeholder')
            ) {
                selector += ', label';
            }
            $inputElement.removeClass('active');
            $inputElement.siblings(selector).removeClass('active');
        }
    });
});
