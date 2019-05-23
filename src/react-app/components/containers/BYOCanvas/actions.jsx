// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import objectPath from 'object-path';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import Lottie from 'react-lottie';
import iconData from 'lib/icon-util/icon-animations.json';
import IC from 'constants/IconsConstants';
import isEqual from 'lodash/isEqual';

// Types
import type { ByoCanvasActions } from 'types/canvas';

// Actions
import {
    saveDesign,
    startOver,
    clearDropAHint,
    AddToWishListSilhouette
} from 'actions/BYOActions';
import { removeCustomItemFromWishlist } from 'actions/FlyoutActions';

// Components
import TiffanyModal from 'components/common/TiffanyModal';
import SaveCreation from 'components/containers/BuildYourOwn/SaveCreation';
import DropAHint from 'components/containers/DropAHint';

import { findFirst, removeClass, addClass } from 'lib/dom/dom-util';

type Props = {
    aem: Object,
    byo: Object,
    labels: Object,
    dispatch: Function,
    customItemsList: any
};

type State = {
    showMessage: boolean,
    showReset: boolean,
    showActions: boolean,
    showByoDropAHint: boolean,
    isStopped: boolean,
    drophintsegments: Array<any>,
    drophintIsStopped: boolean,
    segments: Array<any>,
    isWishList: boolean,
    isMouseOver: boolean,
    showDropHintMessage: boolean
};

/**
 * @description BYO Canvas Actions
 */
class ByoCanvasActionsBar extends React.Component<Props, State> {
    /**
     * @constructor
     * @param {Props} props Component Props
     * @returns {void}
     */
    constructor(props: Props) {
        super(props);

        this.state = {
            showMessage: false,
            showReset: false,
            showActions: false,
            showByoDropAHint: false,
            isStopped: true,
            drophintsegments: [],
            drophintIsStopped: true,
            segments: [],
            isWishList: this.props.byo.isSavedToWish,
            isMouseOver: false,
            showDropHintMessage: false
        };
    }

    /**
     * @description Life cycle hook
     * @param {Props} nextProps The Next Props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.byo.isSavedToWish !== this.props.byo.isSavedToWish && nextProps.byo.isSavedToWish) {
            this.setState({ showMessage: true, showDropHintMessage: false }, () => {
                setTimeout(() => { this.setState({ showMessage: false }); }, this.props.aem.byoConfig.canvas.saveCanvasMessageTimeOut);
            });
        } else if (nextProps.byo.isSavedToWish !== this.props.byo.isSavedToWish && !nextProps.byo.isSavedToWish) {
            this.setState({ showMessage: false });
        }
        if (nextProps.byo.byoEditMode !== this.props.byo.byoEditMode) {
            this.setState({ showActions: nextProps.byo.byoEditMode });
        }
        if (nextProps.byo.isSavedToWish !== this.props.byo.isSavedToWish) {
            this.setState({
                isWishList: nextProps.byo.isSavedToWish,
                isStopped: false
            });
        }
        if (this.props.byo.selectedFixture.isSilhouette !== nextProps.byo.selectedFixture.isSilhouette) {
            this.setState({ showDropHintMessage: false });
        }

        if (!isEqual(nextProps.customItemsList, this.props.customItemsList)) {
            let isSaved = false;

            if (nextProps.customItemsList.length > 0) {
                nextProps.customItemsList.forEach((item) => {
                    if (item.designID === this.props.byo.designID) {
                        isSaved = true;
                    }
                });
            }

            this.setState({ isWishList: isSaved }, () => {
                this.setState({ isStopped: !isSaved });
            });
        }

        if (!isEqual(nextProps.byo.designID, this.props.byo.designID) && !nextProps.byo.designID) {
            this.setState({ isStopped: false });
        }

        if (this.props.byo.charmsOnFixture && nextProps.byo.charmsOnFixture && nextProps.byo.charmsOnFixture !== this.props.byo.charmsOnFixture) {
            this.mouseLeaveHandler();
        }
    }

    /**
     * save design before opening drop a hint modal
     * @param {Boolean} showDropAHint The Next Props
     * @returns {void}
     */
    triggerDropAHint = (showDropAHint) => {
        this.setState({ showByoDropAHint: showDropAHint });
        if (!showDropAHint) {
            this.props.dispatch(clearDropAHint());
            removeClass(findFirst('body'), 'block-body-scroll');
        } else {
            addClass(findFirst('body'), 'block-body-scroll');
        }
    }

    /**
     * @returns {void}
     */
    mouseEnterHandler = () => {
        const animationData = this.state.isWishList ? iconData['wishlist-item'] : iconData['wishlist-empty'];

        this.setState({
            isMouseOver: true,
            segments: [0, animationData.op],
            isStopped: false
        });
    }

    /**
     * @returns {void}
     */
    mouseLeaveHandler = () => {
        this.setState({
            isMouseOver: false,
            segments: [0],
            isStopped: true
        });
    }

    /**
     * @returns {void}
     */
    completeAnimationHandler = () => {
        if (!this.state.isMouseOver) {
            this.setState({
                segments: [1],
                isStopped: true
            });
        }
    }

    /**
     * @description mouse leave handler
     * @returns {void}
     */
    mouseDropHintLeaveHandler = () => {
        this.setState({
            drophintsegments: [20, 0],
            drophintIsStopped: true
        });
    }

    /**
     * @description mouse enter handler
     * @returns {void}
     */
    mouseDropHintEnterHandler = () => {
        this.setState({
            drophintsegments: [0, 20],
            drophintIsStopped: false
        });
    }

    /**
     * save design before opening drop a hint modal
     * @param {Props} nextProps The Next Props
     * @returns {void}
     */
    saveBeforeDropHint() {
        this.props.dispatch(saveDesign('', false, true));
    }

    /**
     * @description render method
     * @returns {*} HTML or Nothing
     */
    render() {
        const actions: ByoCanvasActions = objectPath.get(this.props.aem, 'byoConfig.byoCanvasAction', {});
        const resetCreationOptions: Object = {
            overlay: true,
            className: 'reset-creation-modal',
            closeClass: 'close-modal',
            overlayClass: 'clasp-overlay',
            exitFocusRef: 'byo-start-over',
            blockMobileScrollability: true,
            blockDesktopScrollability: true,
            closeonTapOutside: {
                isClose: true,
                modalContainerClass: 'start-creation'
            }
        };
        const defaultOptions = {
            loop: false,
            autoplay: this.state.isStopped,
            animationData: this.state.isWishList ? iconData['wishlist-item'] : iconData['wishlist-empty'],
            rendererSettings: {
                preserveAspectRatio: IC.SLICE_ASPECT
            }
        };
        const defaultDropHintOptions = {
            loop: false,
            autoplay: this.state.drophintIsStopped,
            animationData: iconData['byo-drop-hint'],
            rendererSettings: {
                preserveAspectRatio: IC.SLICE_ASPECT
            }
        };
        const eventListeners = [{
            eventName: IC.ANIMATION_COMPLETE,
            callback: this.completeAnimationHandler
        }];
        const appendPath = objectPath.get(window, 'tiffany.authoredContent.byoConfig.baseBYOUrl', '');
        const hideDropAHint = objectPath.get(this.props.aem, 'hideDropAHint', false);

        return (
            <React.Fragment>
                <CSSTransition
                    in={this.state.showActions}
                    timeout={1000}
                    classNames={
                        {
                            enter: 'byo-canvas-animation__enter',
                            enterActive: 'byo-canvas-animation__enter_active',
                            enterDone: 'byo-canvas-animation__enter_complete',
                            exit: 'byo-canvas-animation__exit',
                            exitActive: 'byo-canvas-animation__exit_active',
                            exitDone: 'byo-canvas-animation__exit_complete'
                        }}
                    mountOnEnter
                    unmountOnExit
                >
                    <div className="byo-canvas__canvas_actions">
                        {
                            this.state.showMessage &&
                            <p className="byo-canvas__canvas_actions_message" role="alert">
                                {this.props.labels.byo.drawer.canvasWishlistSuccess}
                            </p>
                        }
                        {
                            this.state.showDropHintMessage &&
                            <p className="byo-canvas__canvas_actions_message" role="alert">
                                {this.props.labels.byo.silhoutte.dropAHintMessage}
                            </p>
                        }
                        <div className="byo-canvas__canvas_actions-buttons">
                            <button
                                type="button"
                                className="cta-content icon start-over byo-start-over"
                                tabIndex={0}
                                onClick={() => {
                                    this.setState({ showReset: true });
                                }}
                            >
                                <img src={actions.startOver.icon} alt={actions.startOver.alt} />
                            </button>
                            <button
                                type="button"
                                disabled={(this.props.byo.selectedFixture.isSilhouette && Object.keys(this.props.byo.charmsOnFixture).length === 0)}
                                tabIndex={0}
                                className={classNames('cta-content icon wishlist-icon',
                                    {
                                        disabled: (this.props.byo.selectedFixture.isSilhouette && Object.keys(this.props.byo.charmsOnFixture).length === 0)
                                    })}
                                onClick={() => {
                                    if (!this.state.isWishList) {
                                        if (this.props.byo.selectedFixture.isSilhouette) {
                                            this.props.dispatch(AddToWishListSilhouette());
                                        } else {
                                            this.props.dispatch(saveDesign('', false));
                                        }
                                    } else if (!this.props.byo.selectedFixture.isSilhouette) {
                                        this.props.dispatch(removeCustomItemFromWishlist(objectPath.get(this.props.byo, 'designID', '')));
                                    }
                                }}
                                aria-label={actions.wishList.alt}
                                onFocus={this.mouseEnterHandler}
                                onBlur={this.mouseLeaveHandler}
                                onMouseEnter={this.mouseEnterHandler}
                                onMouseLeave={this.mouseLeaveHandler}
                            >
                                <Lottie
                                    isStopped={this.state.isStopped}
                                    options={defaultOptions}
                                    segments={this.state.segments}
                                    eventListeners={eventListeners}
                                />
                            </button>
                            {
                                !hideDropAHint &&
                                <button
                                    type="button"
                                    className="cta-content icon drop-a-hint"
                                    onFocus={this.mouseDropHintEnterHandler}
                                    onBlur={this.mouseDropHintLeaveHandler}
                                    onMouseLeave={this.mouseDropHintLeaveHandler}
                                    onMouseEnter={this.mouseDropHintEnterHandler}
                                    onClick={() => {
                                        if (!this.props.byo.selectedFixture.isSilhouette) {
                                            this.saveBeforeDropHint();
                                            this.triggerDropAHint(true);
                                            this.setState({ showDropHintMessage: false });
                                        } else {
                                            this.setState({ showDropHintMessage: true, showMessage: false });
                                        }
                                    }}
                                    aria-label={actions.dropaHint.alt}
                                >
                                    <Lottie
                                        isStopped={this.state.drophintIsStopped}
                                        options={defaultDropHintOptions}
                                        segments={this.state.drophintsegments}
                                    />
                                </button>
                            }
                        </div>
                    </div>
                </CSSTransition>
                {
                    this.state.showReset &&
                    <TiffanyModal
                        visible={this.state.showReset}
                        options={resetCreationOptions}
                        onClose={() => {
                            this.setState({ showReset: false });
                        }}
                    >
                        <SaveCreation
                            isReset
                            saveCreation={() => {
                                this.setState({ showReset: false, showMessage: false, showDropHintMessage: false });
                                this.props.dispatch(startOver());

                                window.history.pushState(null, true, appendPath);
                            }}
                            saveCreationClose={() => {
                                this.setState({ showReset: false });
                            }}
                            closeModal={() => {
                                this.setState({ showReset: false });
                            }}
                        />
                    </TiffanyModal>
                }
                {
                    !hideDropAHint &&
                    <DropAHint
                        config={this.props.byo.dropHint}
                        dropHolder="page-wrap"
                        isByo
                        customClass="byo-drop-a-hint"
                        showByoDropAHint={this.state.showByoDropAHint}
                        triggerExternally={this.triggerDropAHint}
                    />
                }
            </React.Fragment>
        );
    }
}


ByoCanvasActionsBar.propTypes = {
    aem: PropTypes.object.isRequired,
    byo: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired,
    customItemsList: PropTypes.any.isRequired
};

const mapStateToProps = (state) => {
    return {
        aem: state.aem,
        byo: state.byo,
        labels: state.authoredLabels,
        customItemsList: state.flyout.customSavedItems
    };
};

export default connect(mapStateToProps)(ByoCanvasActionsBar);
