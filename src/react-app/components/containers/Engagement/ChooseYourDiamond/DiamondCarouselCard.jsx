// @flow

// Packages
import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Slider from 'react-slick';
import * as objectPath from 'object-path';
import PropTypes from 'prop-types';
import ReactTooltip from 'lib/utils/react-tooltip';

// Components
import Picture from 'components/common/Picture';
import SlickArrow from 'components/common/SlickArrows';
import InformationText from 'components/common/InformationText';

import { getCaratValue } from 'lib/utils/format-data';

import { selectDiamondAnalytics } from 'lib/utils/analytics-util';

// Style Vars
import styleVariables from 'lib/utils/breakpoints';

type State = {
    hideCountryOfOrigin: boolean
};

type Props = {
    aem: Object,
    config: string,
    diamondFilters: Object,
    beautifulChoice: Object
};

/**
 * @class DiamondCarouselCard
 */
class DiamondCarouselCard extends React.Component<Props, State> {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props: Props) {
        super(props);

        this.state = {
            hideCountryOfOrigin: objectPath.get(this.props.aem, 'engagementpdp.hideCountryOfOrigin', false)
        };
    }

    /**
     * Lifcycle hook for
     * @returns {void}
     */
    componentDidMount() {
        selectDiamondAnalytics(objectPath.get(this.props.diamondFilters, 'selectedDiamond.group.group.caratWeight', ''));
    }

    /**
     * @description The render method
     * @returns {HTMLElement} Html Element
     */
    render() {
        const previewImages = objectPath.get(this.props.diamondFilters, 'selectedDiamond.images');
        const toolTips = objectPath.get(this.props.beautifulChoice, 'toolTips', {});
        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 0,
            useTransform: false,
            swipeToSlide: false,
            variableWidth: false,
            nextArrow: <SlickArrow isleftArrow={false} />,
            prevArrow: <SlickArrow isleftArrow />,
            responsive: [
                {
                    breakpoint: parseInt(styleVariables.tabletBreakPoint, 10),
                    settings: {
                        arrows: false,
                        variableHeight: true
                    }
                }
            ]
        };
        const countryOfOriginPresent = objectPath.get(this.props.diamondFilters, 'selectedDiamond.group.group.diamondProvenance.0', '').length > 0;

        const slctDmd = objectPath.get(this.props.diamondFilters, 'selectedDiamond', {});
        const group = objectPath.get(slctDmd, 'group.group', {});
        let caratVal = '';

        if (group) {
            const caratMapping = objectPath.get(this.props.aem, 'engagementProductPreviewDetails.caratMapping', []);
            const caratWeight = objectPath.get(group, 'caratWeight', '');
            const sku = objectPath.get(group, 'sku', false);

            caratVal = getCaratValue(caratMapping, caratWeight, sku);
        }

        return (
            <div className={classNames('diamond-carousel-card')}>
                <div className="diamond-carousel-card__carousel-holder">
                    <Slider {...settings}>
                        {
                            (previewImages || []).map((src, index) => (
                                <Picture
                                    key={index.toString()}
                                    defaultSrc={src.url}
                                    altText=""
                                    isLazyLoad={objectPath.get(this.props, 'aem.engagementpdp.labels.chooseDiamondLazyload')}
                                />
                            ))
                        }
                    </Slider>
                    {caratVal && <span className="product-preview__carat-weight">{caratVal}</span>}
                </div>
                <div className="diamond-carousel-card__carousel-title">
                    <p
                        tabIndex={0} // eslint-disable-line
                    >
                        {objectPath.get(this.props.diamondFilters, 'selectedDiamond.group.group.titleSplit.1', objectPath.get(this.props.diamondFilters, 'selectedDiamond.group.group.titleSplit.0', ''))}
                    </p>
                </div>
                <div className="diamond-carousel-card__carousel-style">
                    <p>
                        {objectPath.get(this.props.beautifulChoice, 'stylePrefix', '')}
                        {objectPath.get(this.props.diamondFilters, 'selectedDiamond.group.group.style', '')}
                    </p>
                </div>
                <div className="diamond-carousel-card__certification-holder">
                    <div className="diamond-carousel-card__certification-holder_diamond-icon">
                        <Picture
                            defaultSrc={objectPath.get(this.props.beautifulChoice, 'certificationDiamondIcon', '')}
                            isLazyLoad={objectPath.get(this.props, 'aem.engagementpdp.labels.chooseDiamondLazyload')}
                            altText={objectPath.get(this.props.beautifulChoice, 'certificationDiamondIconAltText', '')}
                        />
                    </div>
                    <p className="diamond-carousel-card__certification-holder_certification-text">
                        {objectPath.get(this.props.beautifulChoice, 'certification', '')}
                    </p>
                    <div className="diamond-carousel-card__certification-holder_certification-tooltip">
                        {
                            toolTips.beautifulchoiceRTE &&
                            <span className="diamond-carousel-card__certification-holder_certification-tooltip_cntr">
                                <span
                                    role="button"
                                    data-tip=""
                                    data-for="beautifulChoicePriceToolTip"
                                    data-type="light"
                                    data-event="click focus"
                                    data-place="top"
                                    data-class="beautiful-price-tooltip"
                                    data-border="true"
                                    id="beautifulChoicePriceToolTipId"
                                    tabIndex="0"
                                    className="tooltip-element"
                                >
                                    <Picture
                                        customClass="tooltip-image"
                                        defaultSrc={objectPath.get(this.props.beautifulChoice, 'certifiedTooltipIcon', '')}
                                        altText={objectPath.get(this.props.beautifulChoice, 'certifiedTooltipIconAlt', '')}
                                        isLazyLoad={objectPath.get(this.props, 'aem.engagementpdp.labels.chooseDiamondLazyload')}
                                    />
                                </span>
                                <ReactTooltip
                                    className="beautiful-price-tooltip"
                                    id="beautifulChoicePriceToolTip"
                                    effect="solid"
                                    globalEventOff="click focus"
                                    isCapture
                                >
                                    <div aria-describedby="diamondFromPriceToolTip">
                                        <InformationText config={objectPath.get(toolTips, 'beautifulchoiceRTE', '')} />
                                    </div>
                                </ReactTooltip>
                            </span>
                        }

                    </div>
                </div>
                <div className="diamond-carousel-card__carousel-properties">
                    {
                        objectPath.get(this.props.diamondFilters, 'selectedDiamond.group.group.caratWeight', '') &&
                        <div className="diamond-carousel-card__carousel-properties_property">
                            <p className="diamond-carousel-card__carousel-properties_property_value">
                                {objectPath.get(this.props.diamondFilters, 'selectedDiamond.group.group.caratWeight', '')}
                            </p>
                            <p className="diamond-carousel-card__carousel-properties_property_heading">
                                {objectPath.get(this.props.beautifulChoice, 'carat', '')}
                            </p>
                        </div>
                    }
                    {
                        objectPath.get(this.props.diamondFilters, 'selectedDiamond.group.group.diamondColor.0', '') &&
                        <div className="diamond-carousel-card__carousel-properties_property">
                            <p className="diamond-carousel-card__carousel-properties_property_value">
                                {objectPath.get(this.props.diamondFilters, 'selectedDiamond.group.group.diamondColor.0', '')}
                            </p>
                            <p className="diamond-carousel-card__carousel-properties_property_heading">
                                {objectPath.get(this.props.beautifulChoice, 'color', '')}
                            </p>
                        </div>
                    }
                    {
                        objectPath.get(this.props.diamondFilters, 'selectedDiamond.group.group.diamondClarity.0', '') &&
                        <div className="diamond-carousel-card__carousel-properties_property">
                            <p className="diamond-carousel-card__carousel-properties_property_value">
                                {objectPath.get(this.props.diamondFilters, 'selectedDiamond.group.group.diamondClarity.0', '')}
                            </p>
                            <p className="diamond-carousel-card__carousel-properties_property_heading">
                                {objectPath.get(this.props.beautifulChoice, 'clarity', '')}
                            </p>
                        </div>
                    }
                    <div className="diamond-carousel-card__carousel-properties_property">
                        <p className="diamond-carousel-card__carousel-properties_property_value">
                            {objectPath.get(this.props.beautifulChoice, 'excellentcut', 'Excellent')}
                        </p>
                        <p className="diamond-carousel-card__carousel-properties_property_heading">
                            {objectPath.get(this.props.beautifulChoice, 'cut', '')}
                        </p>
                    </div>
                </div>
                {
                    !this.state.hideCountryOfOrigin && countryOfOriginPresent &&
                    <div className="diamond-carousel-card__carousel-origin-holder">
                        <p className="diamond-carousel-card__carousel-origin-holder_value">
                            {objectPath.get(this.props.diamondFilters, 'selectedDiamond.group.group.diamondProvenance.0', '')}
                        </p>
                        <div className="diamond-carousel-card__carousel-origin-holder_heading">
                            <p>{objectPath.get(this.props.beautifulChoice, 'originCountry', '')}</p>
                            {
                                toolTips.countryOfOriginRTE &&
                                <div className="diamond-carousel-card__carousel-origin-holder_heading_tooltip">
                                    <span
                                        role="button"
                                        data-tip=""
                                        data-for="countryOfOriginToolTip"
                                        data-type="light"
                                        data-event="click focus"
                                        data-place="top"
                                        data-class="country-origin-tooltip"
                                        data-border="true"
                                        id="countryOfOriginToolTipId"
                                        tabIndex="0"
                                        className="tooltip-element"
                                    >
                                        <Picture
                                            customClass="tooltip-image"
                                            defaultSrc={objectPath.get(this.props.beautifulChoice, 'certifiedTooltipIcon', '')}
                                            altText={objectPath.get(this.props.beautifulChoice, 'certifiedTooltipIconAlt', '')}
                                            isLazyLoad={objectPath.get(this.props, 'aem.engagementpdp.labels.chooseDiamondLazyload')}
                                        />
                                    </span>
                                    <ReactTooltip
                                        className="country-origin-tooltip"
                                        id="countryOfOriginToolTip"
                                        effect="solid"
                                        globalEventOff="click focus"
                                        isCapture
                                    >
                                        <div aria-describedby="country of origin tool tip">
                                            <InformationText config={objectPath.get(toolTips, 'countryOfOriginRTE', '')} />
                                        </div>
                                    </ReactTooltip>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
}

DiamondCarouselCard.propTypes = {
    aem: PropTypes.object.isRequired,
    config: PropTypes.string.isRequired,
    diamondFilters: PropTypes.any.isRequired,
    beautifulChoice: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        diamondFilters: state.diamondFilters
    };
};

export default connect(mapStateToProps)(DiamondCarouselCard);
