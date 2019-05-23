import initAemData from 'react-app/mock/aem';
import * as objectPath from 'object-path';

initAemData();

export const initialState = objectPath.get(window, 'tiffany.labels', {});

/**
 * AEM Reducer.
 * @param {object} previousState previous state data
 * @param {object} action payload data
 * @returns {object} modified payload data
 */
export default function aemReducer(previousState = initialState, action) {
    switch (action) {
        default:
            return previousState;
    }
}
