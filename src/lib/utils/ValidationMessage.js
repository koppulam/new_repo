import getLabel from 'lib/get-label';

export const required = errorMsg => {
    return errorMsg || getLabel('form.requiredErrorText');
};

export const maxLength = val => {
    const errorMsg = getLabel('form.maxLengthError');

    return `${errorMsg} ${val}`;
};

export const minLength = val => {
    const errorMsg = getLabel('form.minLengthError');

    return `${errorMsg} ${val}`;
};
