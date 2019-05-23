// Packages
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Components
import Picture from 'components/common/Picture';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

// import './index.scss';

/**
 * Marketing tile component
 */
class MarketingTile extends React.Component {
    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            ctaLink,
            imageTarget,
            defaultSrc,
            altText,
            isLazyLoad,
            ctaUrl,
            ctaText,
            ctaTarget
        } = this.props;

        return (
            <article
                className="marketing-tile tf-g tf-g__center"
                data-interaction-context=""
                data-interaction-type={AnalyticsConstants.MARKETING_TILE}
                data-interaction-name={AnalyticsConstants.PRODUCT_TILE}
            >
                <div className="marketing-tile__body tf-g tf-g__center">
                    {
                        ctaLink
                            ? (
                                <Fragment>
                                    <a
                                        href={ctaLink}
                                        target={imageTarget}
                                        tabIndex={this.props.tabIndexVal}
                                        className="marketing-tile__body_anchor"
                                    >
                                        <Picture
                                            defaultSrc={defaultSrc}
                                            altText={altText}
                                            customClass="marketing-tile__body_image"
                                            isLazyLoad={isLazyLoad}
                                        />
                                    </a>
                                    {ctaText
                                        && (
                                            <div className="marketing-tile__actions-bar tf-g tf-g__between col__full tf-g__middle">
                                                <a
                                                    className="cta marketing-tile__actions-bar-shop-cta"
                                                    href={ctaUrl}
                                                    target={ctaTarget}
                                                    tabIndex={this.props.tabIndexVal}
                                                >
                                                    <span className="cta-content">
                                                        <span className="cta-text">
                                                            {ctaText}
                                                        </span>
                                                    </span>
                                                    <span className="icon-dropdown-right" />
                                                </a>
                                            </div>
                                        )
                                    }
                                </Fragment>
                            )
                            : (
                                <Picture
                                    defaultSrc={defaultSrc}
                                    altText={altText}
                                    customClass="marketing-tile__body_image"
                                    isLazyLoad={isLazyLoad}
                                />
                            )
                    }
                </div>
            </article>
        );
    }
}

MarketingTile.propTypes = {
    defaultSrc: PropTypes.string.isRequired,
    altText: PropTypes.string.isRequired,
    ctaText: PropTypes.string,
    ctaLink: PropTypes.string,
    ctaUrl: PropTypes.string,
    ctaTarget: PropTypes.string,
    imageTarget: PropTypes.string,
    isLazyLoad: PropTypes.bool,
    tabIndexVal: PropTypes.any
};

MarketingTile.defaultProps = {
    ctaText: '',
    ctaTarget: '',
    imageTarget: '',
    ctaLink: '',
    ctaUrl: '/',
    isLazyLoad: true,
    tabIndexVal: false
};

export default MarketingTile;
