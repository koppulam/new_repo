import * as objectPath from 'object-path';
import SORT from 'constants/SortConstants';

const initialState = {
    options: objectPath.get(window, 'tiffany.authoredContent.sortOptionsConfig.options', [])
};

[initialState.selectedOption] = initialState.options;
/**
 * AEM Reducer.
 * @param {object} previousState previous state data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
export default function sortOptionsReducer(previousState = initialState, action) {
    switch (action.type) {
        case SORT.SET_SORT_OPTION:
            return {
                ...previousState,
                selectedOption: action.payload
            };
        default:
            return previousState;
    }
}
