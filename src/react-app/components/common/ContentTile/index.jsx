// Packages
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { setTextPosition } from 'lib/utils/feature-detection';

/**
 * Content Tile Carousel Component
 */
class ContentTile extends React.Component {
    /**
     * Onresize update the slick arrow styles.
     * @returns {void}
     */
    componentDidMount() {
        setTextPosition();
    }

    /**
     * @Description openCta Open the CTA in a new tab or with in the same tab.
     * @param {Object} event Click event
     * @param {String} target Target details i.e. _self/ _blank
     * @param {String} link  Link text of the CTA.
     * @returns {void} html instance
     */
    openCta = (event, target, link) => {
        event.preventDefault();

        if (target === '_blank') {
            window.open(link, target);
        } else {
            window.location = link;
        }
    };

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        let descriptionAttr;
        let headingAttr;
        const {
            leftPos,
            topPos,
            mobileLeftPos,
            mobileTopPos,
            ctaOneStyle,
            ctaTwoStyle,
            isRte,
            description,
            heading,
            textAlignment,
            isHeroBanner,
            textColor,
            isInset,
            width,
            customClass,
            ctaLink,
            ctaText,
            ctaOneAlignment,
            ctaTarget,
            secondCtaLink,
            secondCtaTarget,
            ctaTwoAlignment,
            secondCtaText
        } = this.props;
        const desktopPos = (leftPos || topPos);
        const mobilePos = (mobileLeftPos || mobileTopPos);
        const btnStyles = ['primary', 'secondary'];
        const styleOneCheck = btnStyles.indexOf(ctaOneStyle);
        const styleTwoCheck = btnStyles.indexOf(ctaTwoStyle);

        if (isRte) {
            descriptionAttr = <div className="description" dangerouslySetInnerHTML={{ __html: description }} />;
            headingAttr = <div className="heading" role="heading" aria-level="3" dangerouslySetInnerHTML={{ __html: heading }} />;
        } else {
            descriptionAttr = <p className="description">{description}</p>;
            headingAttr = <h2 className="heading">{heading}</h2>;
        }

        return (
            <article
                className={classNames('content-tile',
                    {
                        [`${textAlignment}`]: textAlignment,
                        hide: isHeroBanner,
                        'adjust-position': (desktopPos || mobilePos),
                        [`${textColor}-text`]: textColor,
                        'inset-box': isInset,
                        [`${width}`]: width,
                        [`${customClass}`]: customClass
                    })}
                data-pos-left={leftPos}
                data-pos-top={topPos}
                data-mobile-pos-left={mobileLeftPos}
                data-mobile-pos-top={mobileTopPos}
            >
                {
                    heading
                    && headingAttr
                }

                {
                    description
                    && descriptionAttr
                }
                {
                    (ctaLink
                        && ctaText)
                        && (
                            <div className={classNames(ctaOneAlignment,
                                {
                                    'content-tile-button': ctaOneStyle === 'primary' || ctaOneStyle === 'secondary'
                                })}
                            >
                                <a
                                    className={classNames(`${ctaOneStyle}`,
                                        {
                                            cta: styleOneCheck === -1
                                        })}
                                    href={ctaLink}
                                    target={ctaTarget}
                                    tabIndex={this.props.tabIndexVal ? this.props.tabIndexVal : 0}
                                    onClick={(e) => this.openCta(e, ctaTarget, ctaLink)}
                                >
                                    <span
                                        className={classNames('cta-content button_cta_text',
                                            {
                                                'white-label': ctaOneStyle === 'primary'
                                            })}
                                    >
                                        <span className="cta-text" tabIndex={-1}>
                                            {ctaText}
                                        </span>
                                        {
                                            (ctaOneStyle === 'chevron' || ctaOneStyle === 'with-chevron' || ctaOneStyle === '')
                                            && (
                                                <span
                                                    className={classNames('icon-dropdown-right',
                                                        {
                                                            'white-label': textColor === 'white-label'
                                                        })}
                                                />
                                            )
                                        }
                                    </span>
                                </a>
                            </div>
                        )
                }
                {
                    secondCtaLink
                    && (
                        <div className={classNames(ctaTwoAlignment,
                            {
                                'content-tile-button': ctaTwoStyle === 'primary' || ctaTwoStyle === 'secondary'
                            })}
                        >
                            <a
                                className={classNames(`${ctaTwoStyle}`,
                                    {
                                        cta: styleTwoCheck === -1
                                    })}
                                href={secondCtaLink}
                                target={secondCtaTarget}
                                tabIndex={this.props.tabIndexVal ? this.props.tabIndexVal : 0}
                                onClick={(e) => this.openCta(e, secondCtaTarget, secondCtaLink)}
                            >
                                <span className={classNames('cta-content button_cta_text',
                                    {
                                        'white-label': ctaTwoStyle === 'primary'
                                    })}
                                >
                                    <span className="cta-text" tabIndex={-1}>
                                        {secondCtaText}
                                    </span>
                                    {
                                        (ctaTwoStyle === 'chevron' || ctaTwoStyle === 'with-chevron' || ctaOneStyle === '')
                                        && (
                                            <span
                                                className={classNames('icon-dropdown-right',
                                                    {
                                                        'white-label': textColor === 'white-label'
                                                    })}
                                            />
                                        )
                                    }
                                </span>
                            </a>
                        </div>
                    )
                }
            </article>
        );
    }
}

ContentTile.propTypes = {
    textAlignment: PropTypes.string,
    ctaOneAlignment: PropTypes.string,
    ctaTwoAlignment: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string,
    leftPos: PropTypes.string,
    topPos: PropTypes.string,
    mobileLeftPos: PropTypes.string,
    mobileTopPos: PropTypes.string,
    ctaLink: PropTypes.string,
    ctaTarget: PropTypes.string,
    ctaText: PropTypes.string,
    secondCtaLink: PropTypes.string,
    secondCtaTarget: PropTypes.string,
    secondCtaText: PropTypes.string,
    isHeroBanner: PropTypes.bool,
    isRte: PropTypes.bool,
    textColor: PropTypes.string,
    isInset: PropTypes.bool,
    width: PropTypes.string,
    ctaOneStyle: PropTypes.string,
    ctaTwoStyle: PropTypes.string,
    customClass: PropTypes.string
};

ContentTile.defaultProps = {
    heading: '',
    leftPos: '',
    topPos: '',
    mobileLeftPos: '',
    mobileTopPos: '',
    ctaLink: '',
    ctaText: '',
    ctaTarget: '',
    secondCtaLink: '',
    secondCtaTarget: '',
    secondCtaText: '',
    textAlignment: '',
    ctaOneAlignment: '',
    ctaTwoAlignment: '',
    ctaOneStyle: '',
    ctaTwoStyle: '',
    description: '',
    isHeroBanner: false,
    isRte: false,
    textColor: '',
    isInset: false,
    width: '',
    customClass: ''
};

export default ContentTile;
