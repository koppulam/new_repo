import ApiUtils from 'lib/api';
import ISFC from 'constants/IStatusFlyoutConstants';
import * as objectPath from 'object-path';
import { triggerAnalyticsEvent } from 'lib/utils/analytics-util';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

/**
 * @description open notify flyout
 * @param {Object} payload payload object
 * @param {Object} dispatch redux dispatch
 * @param {Object} getState redux getState
 * @returns {void}
 */
export const openNotifyFlyout = (payload) => (dispatch) => {
    dispatch({
        type: ISFC.TOGGLE_NOTIFY_ME,
        payload
    });
};

/**
 * @description submit notify flyout
 * @param {Object} payload payload object
 * @param {Object} dispatch redux dispatch
 * @param {Object} getState redux getState
 * @returns {void}
 */
export const submitNotifyFlyout = (payload) => (dispatch) => {
    ApiUtils.makeAjaxRequest(
        payload,
        res => {
            dispatch({
                type: ISFC.SUBMITTED_NOTIFY_ME
            });
            triggerAnalyticsEvent(AnalyticsConstants.NOTIFY_ME, { product: objectPath.get(window, 'dataLayer.product', {}) });
        },
        err => {
            dispatch({
                type: ISFC.SUBMITTED_NOTIFY_ME
            });
        }
    );
};
