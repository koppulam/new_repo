// Packages
import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Highlighter from 'react-highlight-words';
import MediaQuery from 'react-responsive';
import classNames from 'classnames';
import styleVariables from 'lib/utils/breakpoints';
import * as objectPath from 'object-path';
import * as cookieUtil from 'lib/utils/cookies';
import SRH from 'constants/SearchConstants';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import { findFirst, addClass } from 'lib/dom/dom-util';
import { triggerAnalyticsEvent } from 'lib/utils/analytics-util';
import { getSearchResults } from 'actions/SearchActions';
import { toggle } from 'actions/InterceptorActions';

const scopeFocus = require('lib/dom/scope-focus');

/**
 * Styles
 */
// import './index.scss';

const remove = require('lodash/remove');

/**
 * Component declaration.
 */
class SearchModal extends Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            term: '',
            searchHistory: [],
            showSearchHistory: false,
            needHelp: '',
            loaded: false
        };
        this.placeholder = objectPath.get(window, 'tiffany.authoredContent.typeSearchConfig.config', {});
        this.labels = objectPath.get(window, 'tiffany.labels', {});
        this.focusButton = React.createRef();
        this.logoContainer = React.createRef();
        this.modalContainer = React.createRef();
        this.handleScroll = this.handleScroll.bind(this, this.logoContainer, this.modalContainer);
    }

    /**
     * Lifcycle hook for
     * @returns {void}
     */
    componentDidMount() {
        const needHelpDiv = this.needHelpDiv.getElementsByClassName('text-phnumber');
        const globalBannerEle = findFirst('.global-banner');
        const chooseCountryEle = findFirst('.choose-country');
        const mobileLogoEle = findFirst('.logo-mobile');
        const searchLogoEle = findFirst('.search-mobile-logo');
        const isDesktop = window.matchMedia(styleVariables.desktopTabletAbove).matches;

        if (mobileLogoEle && this.logoContainer && !searchLogoEle) {
            const mobileLogo = mobileLogoEle.cloneNode(true);

            addClass(mobileLogo, 'search-mobile-logo');

            this.logoContainer.current.appendChild(mobileLogo);
        }

        if (globalBannerEle || chooseCountryEle) {
            window.addEventListener('scroll', this.handleScroll);
        }

        if (needHelpDiv.length > 0) {
            const telephoneNumberTag = document.createElement('a');
            const telephoneNumberConfig = objectPath.get(this.props.aem, 'typeSearchConfig.telephoneNumber', '');
            const telephoneNumber = document.createTextNode(`${telephoneNumberConfig}`);
            const phoneContainer = document.createElement('span');

            phoneContainer.setAttribute('class', 'cta-content');
            phoneContainer.setAttribute('tabindex', '-1');
            phoneContainer.appendChild(telephoneNumber);

            telephoneNumberTag.setAttribute('href', `tel:+ ${telephoneNumberConfig}`);
            telephoneNumberTag.setAttribute('tabindex', '0');
            telephoneNumberTag.setAttribute('class', 'cta');
            telephoneNumberTag.appendChild(phoneContainer);
            telephoneNumberTag.setAttribute('data-interaction-context', '');
            telephoneNumberTag.setAttribute('data-interaction-type', AnalyticsConstants.PHONE);
            telephoneNumberTag.setAttribute('data-interaction-name', telephoneNumberConfig);
            needHelpDiv[0].innerHTML = '';
            needHelpDiv[0].appendChild(telephoneNumberTag);
        }
        this.setNeedHelp(this.needHelpDiv);
        this.holder = findFirst('.search-modal');
        scopeFocus.setScopeLimit(this.holder);
        if (isDesktop) {
            setTimeout(() => {
                this.focusButton.current.focus();
            }, 200);
        }
    }

    /**
     * Lifcycle hook for
     * @returns {void}
     */
    componentDidUpdate() {
        this.setLoadToFalse();
    }

    /**
     * @description component will unmount
     * @returns {void}
     */
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    /**
     * @description setting to false
     * @returns {void}
     */
    setLoadToFalse() {
        if (!this.state.loaded) {
            this.setState({
                loaded: true
            });
            this.handleScroll();
        }
    }

    /**
     * on form submit
     * @param {HtmlEvent} e form submit event
     * @returns {void}
     */
    onSearchSubmit = (e) => {
        e.preventDefault();
        triggerAnalyticsEvent(AnalyticsConstants.SEARCH_SITE, { keyword: this.state.term });
        this.redirectToSearch(this.state.term, true);
    }

    /**
     * get results from search API
     * @param {Object} searchTerm input change event
     * @returns {void}
     */
    onInputChanged = (searchTerm) => {
        this.setState({ showSearchHistory: false });
        this.setState({ term: searchTerm }, () => {
            this.searchTypeahead();
        });
    }

    /**
     * @param {html} needHelpDiv dom
     * @returns {void}
     */
    setNeedHelp = (needHelpDiv) => {
        this.setState({ needHelp: needHelpDiv.innerHTML });
    }

    /**
     * @description get array from cookie
     * @returns {array} searchHistoryRes
     */
    getTopSearchHistory = () => {
        const searchHistory = cookieUtil.getCookies(SRH.SEARCH_HISTORY_COOKIE);
        let searchHistoryRes = [];

        if (searchHistory) {
            const searchHistoryArr = JSON.parse(searchHistory);

            if (searchHistoryArr) {
                if (searchHistoryArr.length > 4) {
                    searchHistoryRes = searchHistoryArr.slice(Math.max(searchHistoryArr.length - 4, 1)).reverse();
                } else {
                    searchHistoryRes = searchHistoryArr.slice(Math.max(searchHistoryArr.length - 4, 0)).reverse();
                }
            }
        }
        return searchHistoryRes;
    }

    /**
     * @description set search history cookies
     * @param {string} link url
     * @param {string} term term
     * @returns {void}
     */
    setSearchHistory = (link, term) => {
        const searchHistory = cookieUtil.getCookies(SRH.SEARCH_HISTORY_COOKIE) || '[]';
        let searchHistoryRes = [];
        const searchHistoryArr = JSON.parse(searchHistory) || [];
        const item = {
            name: this.state.term,
            link,
            term
        };

        if (searchHistoryArr.length > 0) {
            const searchItem = searchHistoryArr.find((i) => {
                return i.name === this.state.term;
            });

            if (searchItem) {
                searchHistoryRes = searchHistoryArr;
                remove(searchHistoryArr, (i) => {
                    return i.name === this.state.term;
                });
                searchHistoryRes.push(item);
            } else {
                searchHistoryRes = searchHistoryArr;
                searchHistoryRes.push(item);
            }
            if (searchHistoryRes.length > 15) {
                searchHistoryRes.shift();
            }
        } else {
            searchHistoryRes.push(item);
        }
        cookieUtil.setCookie(SRH.SEARCH_HISTORY_COOKIE, JSON.stringify(searchHistoryRes), { secure: true }, true);
    }

    /**
    * @description redirect to search page
    * @param {string} term search term
    * @param {boolean} isSubmitted form submit
    * @returns {void}
    */
    redirectToSearch = (term, isSubmitted) => {
        const link = this.placeholder.searchUrl + term;

        if (this.state.term.trim().length > 0) {
            this.setSearchHistory(link, term);
            if (isSubmitted) {
                window.location = link;
            }
        }
    }


    /**
     * @description get top 4 search history results
     * @returns {void}
     */
    inputFocused = () => {
        if (this.state.term === '') {
            this.state.searchHistory = this.getTopSearchHistory();
            this.setState({ showSearchHistory: true });
        } else {
            this.state.searchHistory = [];
            this.setState({ showSearchHistory: false });
        }
    }

    /**
     * @description make ajax call to retrive typeahead results
     * @returns {void}
     * @example if(this.controller){
     *  this.controller.abort()
     * }
     * this.controller = new AbortController();
     * this.props.dispatch(getSearchResults(this.state.term, this.controller.signal));
     */
    searchTypeahead = () => {
        this.props.dispatch(toggle(false));
        if (this.controller) {
            this.controller.abort();
        }
        this.controller = new AbortController();
        this.props.dispatch(getSearchResults(this.state.term, this.controller.signal));
    }

    /**
     * @description handle flyout top position
     * @param {object} modalContainer modalContainer
     * @returns {void}
     */
    handleScroll() {
        if (this.modalContainer) {
            const rect = findFirst('header .header__nav-container').getBoundingClientRect();

            this.modalContainer.current.style.top = `${rect.bottom - 4}px`;
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const quickLinks = objectPath.get(window, 'tiffany.authoredContent.typeSearchConfig.searchQuickLinks', {});
        // removed from AC, AEM-253,252, commenting part to be added later when functionality comes
        // const suggestedContent = objectPath.get(window, 'tiffany.authoredContent.typeSearchConfig.searchSuggestedContent', {});
        const searchFooterData = objectPath.get(window, 'tiffany.authoredContent.typeSearchConfig.searchFooterData', '');
        const globalBanner = document.getElementsByClassName('global-banner');
        let bannerIsVisible = false;
        const searchResults = (objectPath.get(this.props, 'searchResults', []).length > 0 && !this.state.showSearchHistory);
        const searchResultsAlert = objectPath.get(this.labels, 'typeAheadResultsLabel', 'Suggestions are available. Use tab key to navigate to the suggestions.');

        if (globalBanner.length > 0) {
            bannerIsVisible = globalBanner[0].offsetHeight > 0 && globalBanner[0].offsetWidth > 0;
        }

        return (
            <Fragment>
                <div className="search-modal">
                    {/* <div className="search-modal__backdrop" /> */}
                    <div className="gray-bg-layer" />
                    <div
                        className={
                            classNames('search-modal__container',
                                {
                                    'search-modal__with-global-banner': bannerIsVisible
                                })
                        }
                        ref={this.modalContainer}
                    >
                        <div ref={this.logoContainer} role="search" className="search-modal__container_header">
                            <button type="button" aria-label={this.labels.searchModalCloseLabel} className="search-modal__container_header-close icon-Close" />
                        </div>
                        <div className="search-modal__container_body">
                            <div className="search-modal__container_body-term">
                                <form role="search" onSubmit={this.onSearchSubmit} action="" className="search-modal__container_body-form">
                                    <MediaQuery query={styleVariables.belowDesktopTablet}>
                                        <div className="search-modal__container_body-value material-input">
                                            <input
                                                type="text"
                                                name="searchInput"
                                                id="searchInput"
                                                value={this.state.term}
                                                onChange={(e) => {
                                                    this.onInputChanged(e.target.value);
                                                }}
                                                onFocus={this.inputFocused}
                                                ref={this.focusButton}
                                                autoComplete="off"
                                            />
                                            <label htmlFor="searchInput">{this.placeholder.mobilePlaceholder}</label>
                                        </div>
                                    </MediaQuery>
                                    <MediaQuery query={styleVariables.desktopTabletAbove}>
                                        <div className="search-modal__container_body-value material-input">
                                            <input
                                                name="searchInput"
                                                id="searchInput"
                                                type="text"
                                                value={this.state.term}
                                                onChange={(e) => {
                                                    this.onInputChanged(e.target.value);
                                                }}
                                                onFocus={this.inputFocused}
                                                ref={this.focusButton}
                                                autoComplete="off"
                                            />
                                            <label htmlFor="searchInput">{this.placeholder.desktopPlaceholder}</label>
                                        </div>
                                    </MediaQuery>
                                    <button type="button" aria-label={this.labels.searchButtonLabel} onClick={this.onSearchSubmit} className="search-modal__container_body-icon icon-Search" />
                                </form>
                            </div>
                            <div className="search-modal-results">
                                <div className="search-modal-results__body">
                                    <div role="navigation" className="search-modal-results__body-search-results">
                                        <div className="search-modal-results__body-divider">
                                            <div className="search-modal-results__body_list">
                                                {
                                                    searchResults &&
                                                    <p className="type-a-head-suggestion" role="alert">{searchResultsAlert}</p>
                                                }
                                                {
                                                    searchResults &&
                                                    <ul className="search-modal-results__body_list-gutter typeahead-results">
                                                        {this.props.searchResults.map((i) => {
                                                            return (
                                                                <li key={i.dvaL_ID} className="search-modal-results__body_list-item typeahead-list">
                                                                    {i.labelIncluded && <span className="icon-Search-Clock icon-Clock search-modal-results__body_list-icons" />}
                                                                    <a
                                                                        href={this.placeholder.searchUrl + i.label}
                                                                        onClick={() => {
                                                                            this.redirectToSearch(i.label, false);
                                                                        }}
                                                                        tabIndex={0}
                                                                    >
                                                                        <Highlighter
                                                                            searchWords={this.state.term.split(' ')}
                                                                            textToHighlight={i.label}
                                                                            highlightClassName="search-modal__resultsHighlight"
                                                                        />
                                                                    </a>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                }
                                                {this.state.showSearchHistory && this.state.searchHistory.length > 0 &&
                                                    <div className="search-modal-results__body_list-searchHistory">
                                                        <h5 className="search-modal-results__body_list-heading">{this.placeholder.searchHistoryHeading}</h5>
                                                        <ul className="search-modal-results__body_list-gutter">
                                                            {this.state.searchHistory.map(i => {
                                                                return (
                                                                    <li key={i.name} className="search-modal-results__body_list-item">
                                                                        <a
                                                                            href={i.link}
                                                                            tabIndex={0}
                                                                            data-interaction-context={AnalyticsConstants.HEADER}
                                                                            data-interaction-type={AnalyticsConstants.SEARCH}
                                                                            data-interaction-name={AnalyticsConstants.PREVIOUS}
                                                                        >
                                                                            {i.term}
                                                                        </a>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                }
                                            </div>
                                            {/* {suggestedContent && Object.keys(suggestedContent).length > 0 &&
                                                <div className="search-modal-results__body_list">
                                                    <h5 className="search-modal-results__body_list-heading">{objectPath.get(suggestedContent, 'heading', 'Tiffany & Co Suggestions')}</h5>
                                                    {objectPath.get(suggestedContent, 'results', []).length > 0 &&
                                                        <ul className="search-modal-results__body_list-gutter">
                                                            {suggestedContent.results.map(i => {
                                                                return (
                                                                    <li key={i.id} className="search-modal-results__body_list-item">
                                                                        <a href={i.url} target={i.target}>{i.name}</a>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    }
                                                </div>
                                            } */}
                                        </div>
                                        <div className="search-modal-results__body-divider">
                                            {quickLinks && Object.keys(quickLinks).length > 0 &&
                                                <div
                                                    className={
                                                        classNames('search-modal-results__body_list ',
                                                            {
                                                                'mobile-hide': this.placeholder.hideMobileSearchLinks || !this.placeholder.quickLinksMobileEnabled
                                                            })
                                                    }
                                                >
                                                    <h5 className="search-modal-results__body_list-heading">{objectPath.get(quickLinks, 'heading', 'Quick Links')}</h5>
                                                    {objectPath.get(quickLinks, 'results', []).length > 0 &&
                                                        <ul className="search-modal-results__body_list-gutter">
                                                            {quickLinks.results.map(i => {
                                                                return (
                                                                    <li key={i.id} className="search-modal-results__body_list-item">
                                                                        <a
                                                                            href={i.url}
                                                                            target={i.target}
                                                                            className="cta"
                                                                            tabIndex={0}
                                                                            data-nav-context={AnalyticsConstants.HEADER}
                                                                            data-nav-type={objectPath.get(this.props.searchTypeConfig, 'searchQuickLinks.analyticsLinkType', 'search:quick-links')}
                                                                            data-nav-name={objectPath.get(i, 'analyticsLinkName', i.name)}
                                                                        >
                                                                            <span className="cta-content" tabIndex={-1}>
                                                                                {i.name}
                                                                            </span>
                                                                        </a>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    }
                                                </div>
                                            }
                                            {searchFooterData &&
                                                <MediaQuery query={styleVariables.desktopTabletAbove}>
                                                    <div className="search-modal-results__body_list search-footer-desktop">
                                                        <div dangerouslySetInnerHTML={{ __html: this.state.needHelp }} />
                                                    </div>
                                                </MediaQuery>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="display__none" ref={el => { this.needHelpDiv = el; }} dangerouslySetInnerHTML={{ __html: searchFooterData }} />
                            </div>
                        </div>
                        {searchFooterData &&
                            <MediaQuery query={styleVariables.belowDesktopTablet}>
                                <div
                                    className={
                                        classNames('search-modal-results__body_list search-modal__container-footer-mobile ',
                                            {
                                                'mobile-hide': this.placeholder.hideMobileSearchLinks || this.placeholder.quickLinksMobileEnabled
                                            })
                                    }
                                >
                                    <div dangerouslySetInnerHTML={{ __html: this.state.needHelp }} />
                                </div>
                            </MediaQuery>
                        }
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        searchResults: state.searchResults.searchResults,
        aem: state.aem
    };
};

SearchModal.propTypes = {
    dispatch: PropTypes.func.isRequired,
    searchResults: PropTypes.array.isRequired,
    aem: PropTypes.object.isRequired,
    searchTypeConfig: PropTypes.any.isRequired
};

export default connect(mapStateToProps)(SearchModal);
