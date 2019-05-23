/**
 * @description debounce util
 * @param {callback} fn callback functiopn
 * @param {timeout} time timeout
 * @returns {void}
 */
export default function debounceFun(fn, time = 200) {
    let timeout;

    return function () {
        const functionCall = () => fn.apply(this, arguments);

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    }
}