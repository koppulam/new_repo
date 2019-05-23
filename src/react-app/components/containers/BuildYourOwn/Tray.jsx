// Packages
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Slider from 'react-slick';

import Picture from 'components/common/Picture';
import Draggable from 'components/containers/BYOCanvas/draggable';
import Droppable from 'components/containers/BYOCanvas/droppable';
import {
    addClass,
    removeClass,
    findAll,
    findFirst,
    hasClass,
    isElementInView
} from 'lib/dom/dom-util';
import * as objectPath from 'object-path';
import styleVariables from 'lib/utils/breakpoints';
import MediaQuery from 'react-responsive';
import classNames from 'classnames';
import Waypoint from 'react-waypoint';
import { scrollTo } from 'lib/utils/scroll-to-content';
import { setAnalyticsData, triggerAnalyticsEvent } from 'lib/utils/analytics-util';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import { CSSTransition } from 'react-transition-group';

// Actions import
import {
    removeCharmFromTray,
    toggleCanvas,
    addChainModal,
    addCharmToFixture,
    moveCharmToNearestOnFixture,
    toggleMaxCharm
} from 'actions/BYOActions';

// import './index.scss';

/**
 * BYO Tray Component
 */
class Tray extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        const designId = objectPath.get(window, 'tiffany.authoredContent.byoConfig.designId', false);
        const urlUniqueId = objectPath.get(window, 'tiffany.authoredContent.byoConfig.urlUniqueId', false);
        const uniqueId = !designId ? urlUniqueId : designId;

        this.state = {
            selectedCharm: {},
            selectedIndex: 0,
            trayOpened: true,
            isMobileDragged: false,
            isInCanvasView: !!uniqueId,
            canvasInitiated: false,
            isSticky: false
        };
    }

    /**
     * Lifcycle hook
     * @returns {void}
     */
    componentDidMount() {
        this.charmsContainer = findFirst('.tray-container__body_charms');
        document.addEventListener('scroll', this.hideTrayOnScroll);
    }

    /**
     * @description On props changed life cycle event
     * @param {object} nextProps updated params
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (this.props.byo.charmsTray.length !== nextProps.byo.charmsTray.length || nextProps.byo.charmsTray.length > 0) {
            this.setState({ trayOpened: true });
            if (nextProps.byo.charmsTray.length > this.props.byo.charmsTray.length && this.slider) {
                this.slider.slickGoTo(0);
            }
        }
    }

    /**
     * Lifcycle hook
     * @returns {void}
     */
    componentWillUnmount() {
        document.removeEventListener('scroll', this.hideTrayOnScroll);
    }

    /**
     * @description hide tray
     * @returns {void}
     */
    hideTrayOnScroll = () => {
        const currentPos = (window.pageYOffset || document.documentElement.scrollTop);
        const scrollDiff = Math.abs(currentPos - this.state.scrollPos);
        const canvasContainer = findFirst('.build-your-own__canvas-container');
        const scrollVerticallScrollPos = objectPath.get(window, 'tiffany.labels.byo.tray.scrollVerticallScrollPos', 0);

        let isCanvasVisible = false;

        if (canvasContainer) {
            isCanvasVisible = isElementInView(canvasContainer);
        }

        this.setState({ scrollPos: currentPos }, () => {
            if (!isCanvasVisible && currentPos > scrollVerticallScrollPos && scrollDiff > 5) {
                this.setState({ trayOpened: false });
            }
            if (currentPos < 5) {
                this.setState({ trayOpened: true });
            }
        });
    }

    /**
     * @description move to canvas display
     * @returns {void}
     */
    startCreating = () => {
        if (this.props.byo.charmsTray.length > 0 || Object.keys(this.props.byo.charmsOnFixture).length > 0) {
            this.props.dispatch(toggleCanvas(true));
            this.setState({ isInCanvasView: true });
            scrollTo('body');
            if (!this.state.canvasInitiated) {
                if (!window.history.state) {
                    window.history.pushState(true, null, null);
                }
                this.setState({ canvasInitiated: true });
            }
            const byoStep = objectPath.get(window, 'dataLayer.byo', {});

            if (byoStep.step !== AnalyticsConstants.BYO_TRAY && byoStep.step !== AnalyticsConstants.BYO_CONFIGURE) {
                byoStep.back = true;
            } else {
                byoStep.back = false;
            }
            byoStep.step = AnalyticsConstants.BYO_CONFIGURE;

            setAnalyticsData('byo', byoStep);
            triggerAnalyticsEvent(AnalyticsConstants.UPDATED_BYO, {});
        }
    }

    /**
     * @description edit tray
     * @returns {void}
     */
    editTray = () => {
        this.setState({ isInCanvasView: false });
        this.props.dispatch(toggleCanvas(false));
    }

    /**
     * @description toggle tray mobile
     * @returns {void}
     */
    toggleTray = () => {
        this.setState({ trayOpened: !this.state.trayOpened });
    }

    /**
     * @param {event} event event
     * @param {object} item charm
     * @param {number} index index
     * @returns {void}
     */
    showClose = (event, item, index) => {
        const element = event.currentTarget;

        this.setState({ selectedCharm: item }, () => {
            addClass(element, 'selected-charm');
            this.setState({ selectedIndex: index });
        });
    }

    /**
     * @param {event} event event
     * @returns {void}
     */
    hideClose = (event) => {
        const element = event.currentTarget;

        this.setState({ selectedCharm: {} }, () => {
            removeClass(element, 'selected-charm');
        });
    }

    /**
     * @param {event} event event
     * @returns {void}
     */
    dragElement = (event) => {
        const activeSlider = findAll('.slick-active', this.charmsContainer);
        const isDesktop = window.matchMedia(styleVariables.desktopAndAbove).matches;

        if (activeSlider.length > 0) {
            const lastActiveElement = activeSlider[activeSlider.length - 1];
            const firstActiveElement = activeSlider[0];

            if (event.target === findFirst('.tray-container__body_charms-button', lastActiveElement)) {
                if (!isDesktop) {
                    this.slider.slickNext();
                } else {
                    setTimeout(() => {
                        this.slider.slickNext();
                    }, 700);
                }
            }
            if (event.target === findFirst('.tray-container__body_charms-button', firstActiveElement)) {
                if (!isDesktop) {
                    this.slider.slickPrev();
                } else {
                    setTimeout(() => {
                        this.slider.slickPrev();
                    }, 700);
                }
            }
        }
    }

    /**
     * @description mobile dragged lef/right
     * @param {string} drapDirection left/right
     * @returns {void}
     */
    mobileDragged = (drapDirection) => {
        if (drapDirection === 'left') {
            this.setState({ isMobileDragged: true });
        } else {
            const firstSlide = findFirst('.slick-slide', this.charmsContainer);

            if (hasClass(firstSlide, 'slick-active')) {
                this.setState({ isMobileDragged: false });
            }
        }
    }

    /**
     * @returns {void}
     */
    removeCharm = () => {
        if (this.state.selectedCharm) {
            this.props.dispatch(removeCharmFromTray(this.state.selectedCharm, this.state.selectedIndex));
            this.setState({ selectedIndex: -1 });
            const inTrayProducts = objectPath.get(window, 'dataLayer.byo.inTray', []);

            const removedProduct = inTrayProducts.splice(this.state.selectedIndex, 1);

            setAnalyticsData('byo.inTray', inTrayProducts);
            triggerAnalyticsEvent(AnalyticsConstants.REMOVE_FROM_TRAY, { product: removedProduct });
        }
    }

    /**
     * function to make filters sticky
     * @param {*} currentPosition tells if the waypoint is above/below/inside of the viewport
     * @returns {void}
     */
    makeSticky = ({ currentPosition }) => {
        // Making filters sticky only if the filter waypoint has left viewport from above
        if (currentPosition === 'above') {
            const isDesktop = window.matchMedia(styleVariables.desktopAndAbove).matches;

            this.setState({ isSticky: true });
            if (isDesktop) {
                this.setState({ isInCanvasView: false });
            }
        }
    }

    /**
     * function to remove sticky filters
     * @returns {void}
     */
    removeSticky = () => {
        // Irrespective of from top or bottom if waypoint enters the view port the remove sticky behaviour
        // Checking if the sticky nav is already removed to avoid multiple mutiation on state
        if (this.state.isSticky) {
            this.setState({ isInCanvasView: this.props.byo.byoEditMode, trayOpened: true, isSticky: false });
        }
    }

    /**
     * @description show add chain modal
     * @returns {void}
     */
    addChain = () => {
        this.props.dispatch(addChainModal(true, 'tray-container__body_fixture-image'));
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const settings = {
            dots: false,
            infinite: false,
            speed: 600,
            slidesToShow: 10.5,
            swipeToSlide: true,
            initialSlide: 0,
            arrows: false,
            responsive: [
                {
                    breakpoint: parseInt(styleVariables.tabletBreakPoint, 10),
                    settings: {
                        slidesToScroll: 1,
                        slidesToShow: this.state.isMobileDragged ? 7.5 : 5.6,
                        onSwipe: this.mobileDragged
                    }
                },
                {
                    breakpoint: parseInt(styleVariables.mobileBreakPoint, 10),
                    settings: {
                        swipeToSlide: false,
                        slidesToScroll: 1,
                        slidesToShow: this.state.isMobileDragged ? 6.6 : 4.6,
                        onSwipe: this.mobileDragged
                    }
                }
            ]
        };
        const trayLabels = objectPath.get(window, 'tiffany.labels.byo.tray', {});
        const isDesktop = window.matchMedia(styleVariables.desktopAndAbove).matches;
        const wayPointOffset = isDesktop ? '64px' : '48px';
        const imgRole = 'img';
        const disable = this.props.byo.charmsTray.length === 0 && Object.keys(this.props.byo.charmsOnFixture).length === 0;

        return (
            <div
                className={classNames('tray-block',
                    {
                        'mobile-tray-collapse': !this.state.trayOpened
                    })}
            >
                <Waypoint
                    onEnter={this.removeSticky}
                    onLeave={this.makeSticky}
                    topOffset={wayPointOffset}
                />
                <article
                    className={classNames('tray-container',
                        {
                            'tray-fixed': this.state.isSticky,
                            'tray-transitioning': !this.state.trayOpened
                        })}
                >
                    <div
                        className={classNames('tray-container__header',
                            {
                                'tray-fixed': this.state.isSticky,
                                'tray-transitioning': !this.state.trayOpened
                            })}
                    >
                        <div>
                            <h5 className="tray-container__header_title">
                                {trayLabels.optionsText}
                                (
                                {this.props.byo.charmsTray.length}
                                )
                            </h5>
                            <MediaQuery query={styleVariables.desktopAndAbove}>
                                <button
                                    type="button"
                                    className={classNames('tray-container__header-arrow',
                                        {
                                            'icon-Up': this.state.trayOpened,
                                            'icon-Down': !this.state.trayOpened
                                        })}
                                    onClick={this.toggleTray}
                                    aria-label={this.state.trayOpened ? trayLabels.arrowUp : trayLabels.arrowDown}
                                    aria-expanded={this.state.trayOpened}
                                />
                            </MediaQuery>
                        </div>
                        {!this.state.isInCanvasView &&
                            <button
                                type="button"
                                tabIndex={0}
                                className={classNames('tray-container__header_button',
                                    {
                                        disabled: disable
                                    })}
                                onClick={this.startCreating}
                                aria-label={Object.keys(this.props.byo.charmsOnFixture).length > 0 ? trayLabels.continueText : trayLabels.startText}
                                disabled={disable}
                                aria-disabled={disable}
                            >
                                <span className="tray-container__header_button-text" tabIndex={-1}>
                                    {Object.keys(this.props.byo.charmsOnFixture).length > 0 ? trayLabels.continueText : trayLabels.startText}
                                </span>
                            </button>
                        }
                        <MediaQuery query={styleVariables.desktopAndBelow}>
                            <button
                                type="button"
                                className={classNames('tray-container__header-arrow',
                                    {
                                        'icon-Up': this.state.trayOpened,
                                        'icon-Down': !this.state.trayOpened
                                    })}
                                onClick={this.toggleTray}
                                aria-label={this.state.trayOpened ? trayLabels.arrowUp : trayLabels.arrowDown}
                                aria-expanded={this.state.trayOpened}
                            />
                        </MediaQuery>
                    </div>
                    <CSSTransition
                        in={this.state.trayOpened}
                        timeout={1000}
                        classNames={{
                            enter: 'tray-container__body__enter',
                            enterActive: 'tray-container__body__enter_active',
                            enterDone: 'tray-container__body__enter_complete',
                            exit: 'tray-container__body__exit',
                            exitActive: 'tray-container__body__exit_active',
                            exitDone: 'tray-container__body__exit_complete'
                        }}
                    >
                        <div
                            className={classNames('tray-container__body',
                                {
                                    'mobile-draggable': this.state.isMobileDragged,
                                    'tray-closed': !this.state.trayOpened
                                })}
                        >
                            <div className="tray-container__body_leftaccordion">
                                <button type="button" tabIndex={this.state.trayOpened ? 0 : -1} className="icon-Right tray-container__body_slide" onClick={() => { this.setState({ isMobileDragged: false }); }} />
                            </div>
                            <div className="tray-container__body_fixture">
                                <button type="button" tabIndex={this.state.trayOpened ? 0 : -1} className="tray-container__body_fixture-image" aria-label={this.props.byo.selectedFixture.isSilhouette ? trayLabels.addChain : trayLabels.yourChain} onClick={this.addChain}>
                                    <Picture
                                        sources={this.props.sources}
                                        defaultSrc={this.props.byo.selectedFixture.image}
                                        altText={this.props.byo.selectedFixture.altText}
                                        isLazyLoad={false}
                                    />
                                    <p className="tray-container__body_fixture-text textTop">
                                        {this.props.byo.selectedFixture.isSilhouette ? trayLabels.addChain : trayLabels.yourChain}
                                    </p>
                                </button>
                            </div>
                            <CSSTransition
                                in={this.props.byo.byoEditMode}
                                timeout={400}
                                classNames={{
                                    enter: 'tray-container__body_fixture_add_charm__enter',
                                    enterActive: 'tray-container__body_fixture_add_charm__enter_active',
                                    enterDone: 'tray-container__body_fixture_add_charm__enter_complete',
                                    exit: 'tray-container__body_fixture_add_charm__exit',
                                    exitActive: 'tray-container__body_fixture_add_charm__exit_active',
                                    exitDone: 'tray-container__body_fixture_add_charm__exit_complete'
                                }}
                                unmountOnExit
                            >
                                <div className="tray-container__body_fixture">
                                    <button type="button" className="tray-container__body_fixture-add icon-Add" onClick={this.editTray} aria-label={trayLabels.addCharmText} />
                                    <p className="tray-container__body_fixture-text">
                                        {trayLabels.addCharmText}
                                    </p>
                                </div>
                            </CSSTransition>
                            <Droppable isClasp={false} isColpo={false} inTray index={-1} left={-1} top={-1} />
                            <div
                                className={classNames('tray-container__body_charms',
                                    {
                                        'tray-ready': this.props.byo.byoEditMode,
                                        'mobile-draggable': this.state.isMobileDragged
                                    })}
                            >
                                {this.props.byo.charmsTray.length > 0 ?
                                    <Slider
                                        ref={c => { this.slider = c; }}
                                        {...settings}
                                    >
                                        {
                                            this.props.byo.charmsTray.map((item, index) => (
                                                <div
                                                    className="tray-container__body_charms-item"
                                                    key={index.toString()}
                                                    onMouseEnter={(e) => {
                                                        this.showClose(e, item, index);
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        this.hideClose(e);
                                                    }}
                                                    onClick={(e) => {
                                                        this.showClose(e, item, index);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.keyCode === 9) {
                                                            this.showClose(e, item, index);
                                                        } else if (e.key === 'Enter') {
                                                            let posindex;

                                                            if (e.target.classList.contains('tray-container__body_charms-close')) {
                                                                return;
                                                            }
                                                            this.props.byo.selectedFixture.fixturePositions.forEach((el, elindex) => {
                                                                if (!this.props.byo.charmsOnFixture[elindex] && posindex === undefined) {
                                                                    posindex = elindex;
                                                                }
                                                            });

                                                            if (posindex !== undefined) {
                                                                this.props.dispatch(addCharmToFixture(item, posindex, index));
                                                            } else {
                                                                this.props.dispatch(moveCharmToNearestOnFixture(item, 0, index));
                                                            }
                                                        }
                                                    }}
                                                    onFocus={(e) => {
                                                        this.showClose(e, item, index);
                                                        this.props.dispatch(toggleMaxCharm(true));
                                                    }}
                                                    onBlur={() => {
                                                        this.props.dispatch(toggleMaxCharm(false));
                                                    }}
                                                    role="button"
                                                    tabIndex={-1}
                                                >
                                                    {this.props.byo.byoEditMode ?
                                                        <Draggable labels={this.props.labels} aem={this.props.aem} byo={this.props.byo} dragElement={this.dragElement} customClass="tray-container__body_charms-button" inTray isClasp={false} key={index.toString()} trayIndex={index} charm={item} label={item.label} isColpo={false} selectedChain={this.props.byo.selectedFixture} /> :
                                                        <button
                                                            type="button"
                                                            tabIndex={this.state.trayOpened ? 0 : -1}
                                                            className="tray-container__body_charms-button"
                                                            style={{
                                                                backgroundImage: `url(${item.imageURL})`

                                                            }}
                                                            onTouchStart={this.dragElement}
                                                            onClick={this.dragElement}
                                                            aria-label={item.name}
                                                            onBlur={() => {
                                                                this.props.dispatch(toggleMaxCharm(false));
                                                            }}
                                                        />
                                                    }
                                                    {index === this.state.selectedIndex &&
                                                        <button
                                                            type="button"
                                                            selected={this.state.selectedIndex}
                                                            tabIndex={this.state.trayOpened ? 0 : -1}
                                                            className="icon-Close tray-container__body_charms-close"
                                                            aria-label={trayLabels.removeCharm}
                                                            onClick={this.removeCharm}
                                                            alt={trayLabels.removeCharm}
                                                            role={imgRole}
                                                            onFocus={() => {
                                                                this.props.dispatch(toggleMaxCharm(false));
                                                            }}
                                                            onBlur={() => { this.setState({ selectedIndex: -1 }); }}
                                                        />
                                                    }
                                                </div>
                                            ))
                                        }
                                    </Slider> :
                                    <div className="tray-container__body_charms-empty">
                                        {!this.state.isInCanvasView &&
                                            <div>
                                                <Picture
                                                    sources={[]}
                                                    defaultSrc={trayLabels.trayInstructionImage}
                                                    altText={trayLabels.trayInstructionImageAlt}
                                                    isLazyLoad={false}
                                                    customClass="tray-container__body_charms-empty_image"
                                                />
                                                <p className="tray-container__body_charms-empty_text" role="alert">
                                                    {trayLabels.chooseCharmText}
                                                </p>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </CSSTransition>
                </article>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        byo: state.byo,
        aem: state.aem,
        labels: state.authoredLabels
    };
};

Tray.defaultProps = {
    sources: []
};

Tray.propTypes = {
    dispatch: PropTypes.func.isRequired,
    sources: PropTypes.array,
    aem: PropTypes.any.isRequired,
    byo: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Tray);
