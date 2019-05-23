/**
 * Currency Formatter::
 * 
 * Currency formatter is a simple wrapper over INTL API -
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
 * This util can be used both in React app and also in hbs
 * 
 * We can pass configurations to this method or it will pick configurations from window.tiffany.authoredContent.currencyConfig
 * In cas both the above configurations are not available default configurations are used for formatting. Friendly dev note is
 * printed in console in this case.
 * 
 * Configuration details:
 * 
 * locale: Local to be used
 * currency: Currency to be used
 * currencyDisplay: How should be the vurrency displayed. Possible values are name/code/symbol. If 
 *                  If local is en-US, currency is USD result will be US dollars, USD, $ on using name/code/symbol respectively
 * showDecimals: Show decimals or not
 * customCurrency: Custom currency to be displayed. If present then this will be displayed instead of standard currency code
 * displayAhead: Where should the custom currency be displayed with respect to the formatted number.
 *               This will work only if we have custom currency configuration
 * 
 * 
 * We can use currencyFormatter as follows once imported into the required file
 * 
 * currencyFormatter(34112312.1231);
 * currencyFormatter(34112312.1231, { showDecimals: true, customCurrency: 'myCurrency', displayAhead: false });
 */

import * as objectPath from 'object-path';

const DEFAULTS = {
    locale: 'en-US',
    currency: 'USD',
    currencyDisplay: 'symbol',
    showDecimals: false,
    customCurrency: '',
    displayAhead: true,
    forCustomCurrency: 'code',
    charactersToIgnore: 0,
    delimeterToSearch: ',',
    delimeterToReplace: '.'
};

/**
 * @description formats a number to currency according to configuration provided
 * @param {Number} number number to be formatter
 * @param {Object} options configurations for formatter
 * @returns {String} currency string
 */
export const currencyFormatter = (number, options) => {
    const defaultOptions = objectPath.get(window, 'tiffany.authoredContent.currencyConfig', undefined);

    // If provided options and default options are undefined then options is a empty object.
    if (!Object.keys({
        ...defaultOptions,
        ...options
    }).length) {
        console.warn('Developer Note: Did not find any config for currency so going ahead with defaults');
    }

    options = {
        ...DEFAULTS,
        ...defaultOptions,
        ...options
    }

    if (isNaN(parseInt(number, 10))) {
        console.warn('Developer Note: Pass proper number to currency formatter');
        return number.toString();
    }

    // checking if the characters to ignore is a number
    options.charactersToIgnore = isNaN(parseInt(options.charactersToIgnore, 10)) ? DEFAULTS.charactersToIgnore : parseInt(options.charactersToIgnore, 10);

    // rounding of the number given
    number = Math.round(parseInt(number, 10));

    try {
        // Check if there is custom currency to be displayed. If yes then change the currency display to code and replace later
        options.currencyDisplay = options.customCurrency !== '' ? DEFAULTS.forCustomCurrency : options.currencyDisplay;
        let formattedCurrency = new Intl.NumberFormat(options.locale, { locale: options.locale, style: 'currency', currency: options.currency, currencyDisplay: options.currencyDisplay }).format(number);
        let delimeterToSearch = decodeURI(options.delimeterToSearch);
        const delimeterToReplace = decodeURI(options.delimeterToReplace);

        delimeterToSearch = delimeterToSearch.replace(/ /g, '\u00a0'); //if space is used, convert it to nbsp to match encoding

        // if custom currency is present then remove currency code from the result and trim the result else leave the result as is.
        formattedCurrency = options.customCurrency !== '' ? formattedCurrency.replace(options.currency, '').trim() : formattedCurrency;
        // Remove decimals based on the configuration
        formattedCurrency = options.showDecimals ? formattedCurrency : formattedCurrency.substring(0, formattedCurrency.length - options.charactersToIgnore);
        // Adding custom currency to the resultant formatted currency. Note: if displayAhead is false then we add a extra space between currency and format 
        formattedCurrency = options.displayAhead ? `${options.customCurrency}${formattedCurrency}` : `${formattedCurrency} ${options.customCurrency}`;
        formattedCurrency = delimeterToSearch ? formattedCurrency.split(delimeterToSearch).join(delimeterToReplace) : formattedCurrency;
        return formattedCurrency;
    } catch (e) {
        console.warn('Developer Note: Following error occured');
        console.warn(e);
        return number.toString();
    }
};
