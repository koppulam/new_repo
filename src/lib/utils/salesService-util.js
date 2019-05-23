
import * as objectPath from 'object-path';
import * as cookieUtil from 'lib/utils/cookies';
/**
 * Sales service Util to get sales service cookie
 */
export const getSalesServiceCookie = () => {
    const salesServiceCookieName = objectPath.get(window, 'tiffany.authoredContent.salesServiceCookieName', '');

    return cookieUtil.getCookies(salesServiceCookieName);
}