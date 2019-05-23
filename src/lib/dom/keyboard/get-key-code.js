/**
 * @module dom
 * @version 1.0.0
 * @since Sun Jun 19 2016
 */
'use strict';

/**
 * Return the key code from the `event`.
 *
 * @param  {object} event
 * @return {number}
 */
function getKeyCode(event) {
    if (!event) {
        return;
    }
    return event.which || event.keyCode;
}

module.exports = getKeyCode;
