import * as locale from 'lib/utils/ValidationMessage';
import { digitsOnly } from 'lib/utils/String';

export const required = errorMsg => value => (value ? undefined : locale.required(errorMsg));

export const maxLength = max => value => {
    return (value && value.length) > max ? locale.maxLength(max) : undefined;
};

export const minLength = min => value => {
    return value && value.length < min ? locale.minLength(min) : undefined;
};

export const cardMaxLength = max => value => {
    const digits = digitsOnly(value);
    return (digits && digits.length) > max ? locale.maxLength(max) : undefined;
};

export const cardMinLength = min => value => {
    const digits = digitsOnly(value);
    return (digits && digits.length) < min ? locale.minLength(min) : undefined;
};
