/**
 * Form validators.
 *
 */

'use strict';

export function emailHelper(value) {
    const emailRegExp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    const valid = emailRegExp.test(value);
    return valid;
}
