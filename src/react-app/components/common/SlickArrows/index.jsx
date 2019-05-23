import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Lottie from 'react-lottie';
import iconData from 'lib/icon-util/icon-animations.json';
import IC from 'constants/IconsConstants';
import * as objectPath from 'object-path';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import { triggerAnalyticsEvent } from 'lib/utils/analytics-util';

// import './index.scss';

/**
 * @description Component that will wrap all react componnets toa void errors
 * @class ErrorBoundary
 */
class SlickArrow extends React.Component {
    /**
     * @description The component constructor
     * @param {object} props Defaultprops
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            isLeftStopped: true,
            isRightStopped: true,
            leftSegments: [],
            rightSegments: []
        };
    }

    /**
     * @description Right Arrow click handler
     * @param {Object} e event
     * @param {Object} clickHandler click handler
     * @returns {void}
     */
    rightArrowClick = (e, clickHandler) => {
        const {
            currentSlide,
            slideCount,
            pdpFlag,
            previewImages,
            seeItOnMediaTypeID,
            altViewsMediaTypeID
        } = this.props;

        if (currentSlide !== slideCount - 1) {
            this.setState({
                rightSegments: [0, 10],
                isRightStopped: false
            });
            this.clickCallback = clickHandler;
            let mediaTypeId = AnalyticsConstants.STRAIGHT_ON;

            if (pdpFlag) {
                if (previewImages[currentSlide + 1].mediaTypeID === seeItOnMediaTypeID) {
                    mediaTypeId = AnalyticsConstants.SEE_IT_ON;
                } else if (previewImages[currentSlide + 1].mediaTypeID === altViewsMediaTypeID) {
                    mediaTypeId = AnalyticsConstants.ALTERNATE_VIEWS;
                } else {
                    mediaTypeId = AnalyticsConstants.STRAIGHT_ON;
                }
                const previewImagesObj = {
                    name: previewImages[currentSlide + 1].altText,
                    filename: previewImages[currentSlide + 1].mediaFileName,
                    type: mediaTypeId
                };

                triggerAnalyticsEvent(AnalyticsConstants.UPDATED_PRODUCT_SLIDER, previewImagesObj);
            }
        }
    }

    /**
     * @description Left Arrow click handler
     * @param {Object} e event
     * @param {Object} clickHandler click handler
     * @returns {void}
     */
    leftArrowClick = (e, clickHandler) => {
        const {
            currentSlide,
            pdpFlag,
            previewImages,
            seeItOnMediaTypeID,
            altViewsMediaTypeID
        } = this.props;

        if (currentSlide !== 0) {
            this.setState({
                leftSegments: [0, 10],
                isLeftStopped: false
            });
            this.clickCallback = clickHandler;
            let mediaTypeId = AnalyticsConstants.STRAIGHT_ON;

            if (pdpFlag) {
                if (previewImages[currentSlide - 1].mediaTypeID === seeItOnMediaTypeID) {
                    mediaTypeId = AnalyticsConstants.SEE_IT_ON;
                } else if (previewImages[currentSlide - 1].mediaTypeID === altViewsMediaTypeID) {
                    mediaTypeId = AnalyticsConstants.ALTERNATE_VIEWS;
                } else {
                    mediaTypeId = AnalyticsConstants.STRAIGHT_ON;
                }
                const previewImagesObj = {
                    name: previewImages[currentSlide - 1].altText,
                    filename: previewImages[currentSlide - 1].mediaFileName,
                    type: mediaTypeId
                };

                triggerAnalyticsEvent(AnalyticsConstants.UPDATED_PRODUCT_SLIDER, previewImagesObj);
            }
        }
    }

    /**
     * @description Complete animation event
     * @returns {void}
     */
    completeAnimationHandler = () => {
        this.setState({
            rightSegments: [0],
            leftSegments: [0],
            isLeftStopped: true,
            isRightStopped: true
        });
        if (this.clickCallback) {
            this.clickCallback();
        }
    }

    /**
     * @returns {*} component to render
     */
    render() {
        const defaultOptions = {
            loop: false,
            autoplay: true,
            animationData: iconData['slick-arrow'],
            rendererSettings: {
                preserveAspectRatio: IC.SLICE_ASPECT
            }
        };
        const eventListeners = [{
            eventName: IC.ANIMATION_COMPLETE,
            callback: this.completeAnimationHandler
        }];
        const {
            isleftArrow,
            onClick,
            onBlur,
            onFocus,
            leftArrowAriaLabel,
            rightArrowArialLabel,
            width,
            height,
            className
        } = this.props;
        const {
            isLeftStopped,
            leftSegments,
            isRightStopped,
            rightSegments
        } = this.state;

        if (isleftArrow) {
            return (
                <button
                    type="button"
                    data-interaction-context=""
                    data-interaction-type={AnalyticsConstants.PRODUCT_CAROUSAL}
                    data-interaction-name={AnalyticsConstants.LEFT}
                    className={`custom-arrow ${className}`}
                    onClick={(e) => this.leftArrowClick(e, onClick)}
                    onBlur={onBlur}
                    onFocus={onFocus}
                >
                    <Lottie
                        ariaLabel={leftArrowAriaLabel}
                        width={width}
                        height={height}
                        isStopped={isLeftStopped}
                        options={defaultOptions}
                        segments={leftSegments}
                        eventListeners={eventListeners}
                        isClickToPauseDisabled
                    />
                </button>
            );
        }

        return (
            <button
                type="button"
                data-interaction-context=""
                data-interaction-type={AnalyticsConstants.PRODUCT_CAROUSAL}
                data-interaction-name={AnalyticsConstants.RIGHT}
                className={`custom-arrow ${className}`}
                onClick={(e) => this.rightArrowClick(e, onClick)}
                onBlur={onBlur}
                onFocus={onFocus}
            >
                <Lottie
                    ariaLabel={rightArrowArialLabel}
                    width={width}
                    height={height}
                    isStopped={isRightStopped}
                    options={defaultOptions}
                    segments={rightSegments}
                    eventListeners={eventListeners}
                    isClickToPauseDisabled
                />
            </button>
        );
    }
}

SlickArrow.propTypes = {
    isleftArrow: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string.isRequired,
    leftArrowAriaLabel: PropTypes.string,
    rightArrowArialLabel: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    currentSlide: PropTypes.number.isRequired,
    slideCount: PropTypes.number.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    pdpFlag: PropTypes.bool,
    previewImages: PropTypes.any,
    seeItOnMediaTypeID: PropTypes.number,
    altViewsMediaTypeID: PropTypes.number
};

SlickArrow.defaultProps = {
    rightArrowArialLabel: 'Next Slide',
    leftArrowAriaLabel: 'Previous Slide',
    width: 16,
    height: 16,
    pdpFlag: false,
    previewImages: {},
    seeItOnMediaTypeID: 1098,
    altViewsMediaTypeID: 1093,
    onClick: () => { },
    onBlur: () => { },
    onFocus: () => { }
};

const mapStateToProps = (state) => {
    return {
        rightArrowArialLabel: objectPath.get(state.authoredLabels, 'rightArrowArialLabel', 'Next Slide'),
        leftArrowAriaLabel: objectPath.get(state.authoredLabels, 'leftArrowAriaLabel', 'Previous Slide')
    };
};

export default connect(mapStateToProps)(SlickArrow);
