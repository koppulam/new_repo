import AEM_CONSTANTS from 'constants/AemConstants';

/**
 * @description Dispatches the set shopping bag flag
 * @returns {Object} action object
 */
export default function setShoppingBagPage() {
    return {
        type: AEM_CONSTANTS.SET_SHOPPING_BAG_FLAG
    };
}
