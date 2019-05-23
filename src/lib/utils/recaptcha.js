import uuid from 'uuid/v4';

/**
 * @class TiffanyJSRecaptcha
 */
export default class TiffanyJSRecaptcha {
    /**
     * @constructor
     * @description Will create a new Recaptcha Object
     * @param {string} container The id of the div where the recaptcha has to be rendered
     * @param {string} sitekey sitekey for google recaptcha
     * @param {string} size size for google recaptcha
     * @param {string} theme (Optional with default value as invisible) theme of the recaptcha widget
     * @param {function} callback Optional Will trigger on response of widget
     * @returns {void}
     */
    constructor(container, sitekey, size = 'invisible', theme = 'light', callback = () => { }) {
        this.container = container;
        this.sitekey = sitekey;
        this.theme = theme || 'light';
        this.size = size || 'invisible';
        this.widgetId = null;
        this.callbackId = uuid();
        this.callback = callback;
    }

    /**
     * @description Will be called on recaptcha success response
     * @param {string} token The token returned on success response of widget
     * @returns {void}
     */
    catchResponse(token) {
        this.callback(token);
    }

    /**
     * @description Will render the recaptcha widget
     * @returns {Promise} A Promise that will resolve a widgetId
     */
    render() {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.constructWidget());
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Constructs a Google Recaptcha Widget
     * @returns {string} Returns the widget id of the created widget
     */
    constructWidget() {
        window[this.callbackId] = this.catchResponse.bind(this);
        this.widgetId = window.grecaptcha.render(this.container, {
            sitekey: this.sitekey,
            callback: this.callbackId,
            size: this.size
        });
        return this.widgetId;
    }

    /**
     * @description Executes the captcha widget
     * @returns {void}
     */
    execute() {
        if (this.widgetId !== null) {
            const response = this.getResponse();

            if (response) {
                this.catchResponse(response);
                return;
            }
            window.grecaptcha.execute(this.widgetId);
        }
    }

    /**
     * @description Resets the captcha widget
     * @returns {void}
     */
    reset() {
        if (this.widgetId !== null) {
            window.grecaptcha.reset(this.widgetId);
        }
    }

    /**
     * @description fetches the recaptcha response
     * @returns {string} retuns a response
     */
    getResponse() {
        if (this.widgetId !== null) {
            return window.grecaptcha.getResponse(this.widgetId);
        }
        return '';
    }
}
