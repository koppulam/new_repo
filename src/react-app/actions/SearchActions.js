import SRH from 'constants/SearchConstants';
import * as objectPath from 'object-path';
import ApiUtils from 'lib/api';
import * as cookieUtil from 'lib/utils/cookies';

const find = require('lodash/find');

/* eslint-disable */

/**
 * @default typeahead
 * @param {object} data search term 
 * @param {abort} signal abort 
 */
export const getSearchResults = (data, signal) => (dispatch, getState) => {
    const searchTypeaheadUrl = objectPath.get(window, 'tiffany.authoredContent.typeSearchConfig.gettypeaheadUrl');
    const searchRedirectURL = objectPath.get(window, 'tiffany.authoredContent.typeSearchConfig.config.searchUrl', '');

    if (searchTypeaheadUrl) {
        const searchHistory = cookieUtil.getCookies(SRH.SEARCH_HISTORY_COOKIE) || '[]';
        let searchHistoryRes = JSON.parse(searchHistory);

        if (searchTypeaheadUrl.payload) {
            searchTypeaheadUrl.payload.disableHourGlass = true;
        }

        data = (!data) ? '' : data.trim();
        if (data.length > 2) {
            objectPath.set(searchTypeaheadUrl, 'payload.searchTerms', data);
            ApiUtils.makeAjaxRequest(
                searchTypeaheadUrl,
                res => {
                    const response = objectPath.get(res, 'resultDto.typeahead.typeaheadList', []);
                    const result = response.map((i) => {
                        let labelIncludes = find(searchHistoryRes, {
                            link: searchRedirectURL + i.label
                        });
                        if (labelIncludes) {
                            i.labelIncluded = true;
                        } else {
                            i.labelIncluded = false;
                        }
                        return i;
                    });

                    dispatch({
                        type: SRH.SEARCH_RESULTS,
                        payload: response
                    });
                },
                err => {
                    dispatch({
                        type: SRH.SEARCH_RESULTS,
                        payload: []
                    });
                },
                signal
            );
        } else {
            dispatch({
                type: SRH.SEARCH_RESULTS,
                payload: []
            });
        }

    } else {
        dispatch({
            type: SRH.SEARCH_RESULTS,
            payload: []
        });
    }
};
