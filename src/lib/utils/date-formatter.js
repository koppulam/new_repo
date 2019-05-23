import * as objectPath from 'object-path';

/**
 * @description debounce util
 * @param {callback} fn callback functiopn
 * @param {timeout} time timeout
 * @returns {void}
 */
export default function getFormattedDate(utcDate) {
    const jsDate = new Date(utcDate);
    const monthNames = objectPath.get(window, 'authoredContent.salesServiceCenter.months', [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]);
    
      var day = jsDate.getDate();
      var monthIndex = jsDate.getMonth();
      var year = jsDate.getFullYear();

      return `${monthNames[monthIndex]} ${day}, ${year}`;
}