import { findFirst, addClass, removeClass } from 'lib/dom/dom-util';
import PDPMODAL from 'constants/PdpModalConstants';
import matchMedia from 'lib/dom/match-media';
import { storeDetailStatus, changeStoreStatus } from 'actions/FindStoreActions';
import { disableBodyScroll, enableBodyScroll } from 'lib/no-scroll';


/**
 * @description Close PDP modal
 * @param {Object} actionDetails details that specify to add or remove a perticular quantity
 * @param {Object} dispatch redux dispatch
 * @param {Object} getState redux getState
 * @returns {void}
 */
export const closePdpModal = (actionDetails) => (dispatch, getState) => {
    const buttonContainer = findFirst('.product-description__buttons');
    const isMobile = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;


    if (isMobile) {
        enableBodyScroll('pdp-modal-actions');
    } else {
        removeClass(buttonContainer, 'hide__desktop-and-above');
    }

    if (actionDetails.type === PDPMODAL.CHECK_BALANCE) {
        dispatch({
            type: PDPMODAL.TOGGLE_CHECK_BALANCE,
            payload: {
                isMobile
            }
        });
    }

    if (actionDetails.type === PDPMODAL.CHANGE_STORE) {
        dispatch(storeDetailStatus(false));
    }

    setTimeout(() => {
        const cta = findFirst(actionDetails.cta);

        if (cta) {
            cta.focus();
        }
    });
};


/**
 * @description update selected product price
 * @param {Object} actionDetails details that specify to add or remove a perticular quantity
 * @param {Object} dispatch redux dispatch
 * @param {Object} getState redux getState
 * @returns {void}
 */
export const openPdpModal = (actionDetails) => (dispatch, getState) => {
    const buttonContainer = findFirst('.product-description__buttons');
    const isMobile = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;

    if (isMobile && !actionDetails.desktopModal) {
        disableBodyScroll('pdp-modal-actions');
    } else {
        addClass(buttonContainer, 'hide__desktop-and-above');
    }

    if (actionDetails.type === PDPMODAL.CHECK_BALANCE) {
        dispatch({
            type: PDPMODAL.TOGGLE_CHECK_BALANCE,
            payload: {
                isMobile
            }
        });

        setTimeout(() => {
            const modalContainer = findFirst(actionDetails.modalElem);

            if (modalContainer) {
                modalContainer.focus();
            }
        });
    }

    if (actionDetails.type === PDPMODAL.CHANGE_STORE) {
        dispatch(changeStoreStatus(true));
    }
};
