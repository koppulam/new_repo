import SC from 'constants/FooterConstants';
import ApiUtils from 'lib/api';
import { formatStringForTracking, triggerAnalyticsEvent } from 'lib/utils/analytics-util';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

/**
 * @description submit notify flyout
 * @param {Object} payload payload object
 * @param {String} cLabel ctaLabel
 * @param {Object} dispatch redux dispatch
 * @returns {void}
 */
export const updateFooterFlyoutState = (payload, cLabel) => (dispatch) => {
    ApiUtils.makeAjaxRequest(
        payload,
        res => {
            dispatch({
                type: SC.UPDATE_FOOTER_FLYOUT,
                payload: {
                    res
                }
            });
            triggerAnalyticsEvent(AnalyticsConstants.OPEN_INFO_MODAL, { title: formatStringForTracking(cLabel), type: AnalyticsConstants.POLICIES });
        },
        err => {
            // failure cases for implememtaion
        }
    );
};


/**
 * @description submit notify flyout
 * @param {Object} dispatch redux dispatch
 * @returns {void}
 */
export const closeFooterFlyout = () => (dispatch) => {
    dispatch({
        type: SC.CLOSE_FOOTER_FLYOUT
    });
};
