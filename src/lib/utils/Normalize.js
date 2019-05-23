import { digitsOnly } from 'lib/utils/String';

export const toNumber = value => {
    return digitsOnly(value);
};

export const normalizeCardNumber = value => {
    const onlyNums = digitsOnly(value);
    const { length } = onlyNums;
    let normalizedNumber;

    if (length <= 4) {
        normalizedNumber = onlyNums;
    } else if (length <= 8) {
        normalizedNumber = `${onlyNums.slice(0, 4)}-${onlyNums.slice(4)}`;
    } else if (length <= 12) {
        normalizedNumber = `${onlyNums.slice(0, 4)}-${onlyNums.slice(4, 8)}-${onlyNums.slice(
            8,
            12
        )}`;
    } else {
        normalizedNumber = `${onlyNums.slice(0, 4)}-${onlyNums.slice(4, 8)}-${onlyNums.slice(
            8,
            12
        )}-${onlyNums.slice(12, 16)}`;
    }

    return normalizedNumber;
};
