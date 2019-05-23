// Packages
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as objectPath from 'object-path';

import * as matchMedia from 'lib/dom/match-media';

import Picture from 'components/common/Picture';
import { undoFilters, resetFilters } from 'actions/ChooseDiamondActions';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import { formatStringForTracking } from 'lib/utils/analytics-util';

/**
 * Product Description Component for Engagement
 */
class NoResults extends React.Component {
    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;
        const showTile = (isDesktop) || (!isDesktop && this.props.labels.noResultsTile.showTileInMobile);

        return (
            <article className="no-results">
                <h4 className="no-results_title">{this.props.labels.noResultsText}</h4>
                {
                    this.props.filtersData.previousPayload.length > 1 &&
                    <div className="no-results_actions">
                        <button
                            type="button"
                            className="no-results_actions_undo"
                            data-interaction-context={AnalyticsConstants.DIAMOND_SEL}
                            data-interaction-type={AnalyticsConstants.UNDO}
                            data-interaction-name={formatStringForTracking(objectPath.get(this.props.engagementPdp, 'labels.undoFilterText', 'undo-last-filter'))}
                            onClick={() => this.props.dispatch(undoFilters())}
                        >
                            <span className="cta-content">
                                <span className="cta-text" tabIndex="-1">{this.props.labels.undoFilterText}</span>
                            </span>
                        </button>
                        <button
                            type="button"
                            className="no-results_actions_reset"
                            data-interaction-context={AnalyticsConstants.DIAMOND_SEL}
                            data-interaction-type={AnalyticsConstants.RESET}
                            data-interaction-name={formatStringForTracking(objectPath.get(this.props.engagementPdp, 'labels.resetFilterText', 'reset-filters'))}
                            onClick={() => this.props.dispatch(resetFilters())}
                        >
                            <span className="cta-content">
                                <span className="cta-text" tabIndex="-1">{this.props.labels.resetFilterText}</span>
                            </span>
                        </button>
                    </div>
                }
                <div className="no-results_content">
                    {
                        showTile &&
                        <div className="no-results_content_image">
                            <Picture
                                sources={this.props.labels.noResultsTile.sources}
                                defaultSrc={this.props.labels.noResultsTile.defaultSrc}
                                altText={this.props.labels.noResultsTile.altText}
                                isLazyLoad={this.props.labels.noResultsTile.isLazyLoad}
                            />
                        </div>
                    }
                    <div className="no-results_content_desc">
                        <h2 className="no-results_content_desc_title">{this.props.labels.noResultsTile.title}</h2>
                        <p className="no-results_content_desc_text">{this.props.labels.noResultsTile.description}</p>
                        <button
                            type="button"
                            className="cta"
                        >
                            <span className="cta-content" tabIndex="-1">
                                <span
                                    className="cta-text"
                                    data-interaction-context={AnalyticsConstants.DIAMOND_SEL}
                                    data-interaction-type={AnalyticsConstants.SERVICES}
                                    data-interaction-name={this.props.labels.noResultsTile.ctaLabel}
                                >
                                    {this.props.labels.noResultsTile.ctaText}
                                </span>
                                <i className="icon-dropdown-right" />
                            </span>
                        </button>
                        <a
                            className="no-results_content_desc_call-us"
                            href={this.props.labels.noResultsTile.callUsLink}
                            data-interaction-context={AnalyticsConstants.DIAMOND_SEL}
                            data-interaction-type={AnalyticsConstants.SERVICES}
                            data-interaction-name={this.props.labels.noResultsTile.callUsLabel}
                        >
                            <span className="cta-content" tabIndex="-1">
                                <span className="cta-text">{this.props.labels.noResultsTile.callUsText}</span>
                            </span>
                        </a>
                        <p className="no-results_content_desc_reset-text">{this.props.labels.noResultsTile.resetText}</p>
                    </div>
                </div>
            </article>
        );
    }
}

NoResults.propTypes = {
    dispatch: PropTypes.func.isRequired,
    labels: PropTypes.object.isRequired,
    engagementPdp: PropTypes.object.isRequired,
    filtersData: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        engagementPdp: state.engagementPdp,
        filtersData: state.diamondFilters
    };
};

export default connect(mapStateToProps)(NoResults);
