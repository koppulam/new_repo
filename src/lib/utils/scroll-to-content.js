const $ = require('jquery');

/**
 * ScrollTo an element
 * @param element reference or selector
 * @param scrollDelta any extra scroll if required. Usefull when we have sticky elements on page
 *                    +/- scroll should be handled from the invoking file
 */
export const scrollTo = (ref, position, scrollDelta = 0, speed = 'slow', callBack = () => { }) => {
    const $ref = $(ref);
    if (!$ref) {
        console.warn('Reference is sent to scroll-to-content utility is undefined');
        return false;
    }
    $('html, body').animate(
        {
            scrollTop: position || position === 0 ? position : Math.ceil($ref.offset().top) + scrollDelta
        },
        speed,
        () => {
            if ($ref) {
                $ref.focus();
            }
            callBack();
        }
    );
}
