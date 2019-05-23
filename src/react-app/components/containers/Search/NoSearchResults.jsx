// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as cookieUtil from 'lib/utils/cookies';
import SRH from 'constants/SearchConstants';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

// import './index.scss';

const remove = require('lodash/remove');

/**
 * No Search Results Component
 */
class NoSearchResults extends React.Component {
    /**
     * Lifcycle hook for
     * @returns {void}
     */
    componentDidMount() {
        const contactDiv = this.contactDiv.getElementsByClassName('text-phnumber');
        const noSearchResultsHidden = document.getElementsByClassName('no-search-results');

        if (contactDiv.length > 0) {
            const telephoneNumberTag = document.createElement('a');
            const telephoneNumber = document.createTextNode(` ${this.props.aem.noSearchConfig.telephoneNumber}`);

            telephoneNumberTag.setAttribute('href', `tel:+ ${this.props.aem.noSearchConfig.telephoneNumber}`);
            telephoneNumberTag.setAttribute('data-interaction-context', '');
            telephoneNumberTag.setAttribute('data-interaction-type', AnalyticsConstants.PHONE);
            telephoneNumberTag.setAttribute('data-interaction-name', this.props.aem.noSearchConfig.telephoneNumber);
            telephoneNumberTag.appendChild(telephoneNumber);
            contactDiv[0].innerHTML = '';
            contactDiv[0].appendChild(telephoneNumberTag);
        }

        if (noSearchResultsHidden.length) {
            Array.from(noSearchResultsHidden).forEach(element => element.classList.remove('no-search-results__hidden'));
        }
        this.removeSearchTermFromCookie();
    }

    /**
    * @description remove search term from cookie
    * @returns {void}
    */
    removeSearchTermFromCookie = () => {
        const searchHistory = cookieUtil.getCookies(SRH.SEARCH_HISTORY_COOKIE);

        if (searchHistory) {
            const searchHistoryArr = JSON.parse(searchHistory);

            remove(searchHistoryArr, (i) => {
                return i.term === this.props.searchTerm;
            });
            cookieUtil.setCookie(SRH.SEARCH_HISTORY_COOKIE, JSON.stringify(searchHistoryArr || []), { secure: true }, true);
        }
    }

    /**
     * @returns {object} Element
     */
    render() {
        const { noSearchConfig } = this.props.aem;

        return (
            <div className="nosearch">
                <div className="nosearch__container">
                    <p className="nosearch__container_heading">
                        {noSearchConfig.noSearchLabel}
                        <span className="nosearch__container_term">
                            &quot;
                            {this.props.searchTerm}
                            &quot;
                        </span>
                    </p>
                </div>
                <div className="contact__container">
                    <div
                        ref={el => { this.contactDiv = el; }}
                        dangerouslySetInnerHTML={{ __html: noSearchConfig.contactInfoRTE }}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        aem: state.aem
    };
};

NoSearchResults.propTypes = {
    aem: PropTypes.object.isRequired,
    searchTerm: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(NoSearchResults);
