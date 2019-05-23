import CC from 'constants/ConciergeConstants';
import * as objectPath from 'object-path';
import ApiUtils from 'lib/api';

/**
 * @description - Update the flyout odal open states
 * @param {*} flyoutState - selected modal
 * @returns {object} Action tyep and payload
 */
const updateSelectedFlyoutModal = (flyoutState) => (dispatch, getState) => {
    dispatch({
        type: CC.UPDATE_SELECTED_FLYOUT,
        payload: flyoutState
    });
};

/**
 * @description - send email
 * @param {object} subject subject object
 * @param {string} mailBodyConent Mail Body
 * @param {string} fromEmail From Email Address
 * @returns {object} Action tyep and payload
 */
export const sendConciergeEmail = (subject, mailBodyConent, fromEmail) => (dispatch, getState) => {
    const emailConfig = objectPath.get(getState(), 'authoredLabels.concierge.email', {});
    const pagePath = objectPath.get(getState(), 'authoredLabels.concierge.email.request.pagePath', '');
    const mailSubject = objectPath.get(subject, 'name', '');

    if (emailConfig.request) {
        emailConfig.request.payload = {
            fromEmail, pagePath, mailBodyConent, mailSubject
        };
    }

    ApiUtils.makeAjaxRequest(
        emailConfig.request,
        res => {
            dispatch({
                type: CC.EMAIL_SENT,
                payload: {
                    emailSent: true,
                    flyoutState: 'EMAIL',
                    showFlyout: true
                }
            });
        },
        err => {
            console.log(err);
        }
    );
};

export default updateSelectedFlyoutModal;
