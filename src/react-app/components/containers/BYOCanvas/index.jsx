// @flow

// Packages
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import * as objectPath from 'object-path';
import { CSSTransition } from 'react-transition-group';

// Components
import Picture from 'components/common/Picture';
import Droppable from 'components/containers/BYOCanvas/droppable';
import Preview from 'components/containers/BYOCanvas/preview';
import MaxCharmMessage from 'components/containers/BYOCanvas/MaxCharmMessage';
import ByoCanvasActionsBar from 'components/containers/BYOCanvas/actions';
import EngravingInModal from 'components/containers/EngravingVariations/EngravingInModal';
import { findAll, findFirst } from 'lib/dom/dom-util';
import { contextMenu } from 'react-contexify';
import { setAnalyticsData, triggerAnalyticsEvent } from 'lib/utils/analytics-util';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

// Actions
import {
    setPreviewWidth,
    saveDrawer,
    saveEngraving,
    clearCharmEngravingIndex
} from 'actions/BYOActions';

// Styles
// import './index.scss';

type Props = {
    byo: any,
    dispatch: Function,
    aem: any,
    labels: any,
    engraving: any
};
type State = {
    showAddCharmsMessage: boolean,
    showAddCharmsMessage: boolean,
    fixturePositions: Array<any>,
    showTapCharmsMessage: boolean,
    showCanavs: boolean,
    showCharmErrorMessage: boolean,
    allowMaxCharmMessage: boolean
};

/**
 * @class BYOCanvas
 * @description Drag and drop interface for BYO functionality
 */
class BYOCanvas extends React.Component<Props, State> {
    /**
     * @constructor
     * @param {*} props component props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            fixturePositions: [],
            showAddCharmsMessage: false,
            showTapCharmsMessage: false,
            showCanavs: false,
            showCharmErrorMessage: false,
            allowMaxCharmMessage: false
        };
    }

    /**
     * @description Lifecycle hook
     * @returns {void}
     */
    componentDidMount() {
        this.props.dispatch(saveDrawer());
    }

    /**
     * @description Lifecycle hook
     * @param {any} nextProps Next Props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if ((this.props.byo.byoEditMode !== nextProps.byo.byoEditMode && nextProps.byo.byoEditMode) || (!isEqual(nextProps.byo.selectedFixture, this.props.byo.selectedFixture))) {
            if (Object.keys(this.props.byo.charmsOnFixture).length === 0) {
                this.setState({ showAddCharmsMessage: true, showTapCharmsMessage: false }, () => {
                    setTimeout(() => this.setState({ showAddCharmsMessage: false }), objectPath.get(this.props, 'aem.byoConfig.noCharmsMessage.timeout', 0));
                });
            }
        }
        if (!isEqual(nextProps.byo.drawerData, this.props.byo.drawerData) && ((!nextProps.byo.selectedFixture.isSilhouette || nextProps.byo.drawerData.length > 1) || (nextProps.byo.selectedFixture.isSilhouette && nextProps.byo.drawerData.length < this.props.byo.drawerData.length))) {
            this.props.dispatch(saveDrawer());
        }
        if (Object.keys(this.props.byo.charmsOnFixture).length === 0 && Object.keys(nextProps.byo.charmsOnFixture).length > 0) {
            this.setState({ showTapCharmsMessage: true, showAddCharmsMessage: false }, () => {
                setTimeout(() => this.setState({ showTapCharmsMessage: false }), objectPath.get(this.props, 'aem.byoConfig.canvas.tapCharmTimeOut', 0));
            });
        }
        if (Object.keys(this.props.byo.charmsOnFixture).length > 0 && Object.keys(nextProps.byo.charmsOnFixture).length === 0) {
            const onChainProducts = JSON.parse(JSON.stringify(objectPath.get(window, 'dataLayer.byo.onChain', [])));

            setAnalyticsData('byo.onChain', []);
            onChainProducts.forEach(item => {
                triggerAnalyticsEvent(AnalyticsConstants.REMOVE_FROM_CHAIN, { product: item.charm });
            });
        }
        if (Object.keys(this.props.byo.charmsOnFixture).length > 0 && Object.keys(nextProps.byo.charmsOnFixture).length === 0) {
            this.setState({ showTapCharmsMessage: false });
        }
        if (!isEqual(nextProps.byo.byoEditMode, this.props.byo.byoEditMode)) {
            this.setState({ showCanavs: nextProps.byo.byoEditMode });
        }
    }

    /**
     * @description Lifecycle hook
     * @param {any} prevProps prev Props
     * @returns {void}
     */
    componentDidUpdate(prevProps) {
        const prevKeys = Object.keys(prevProps.byo.charmsOnFixture);
        const currentKeys = Object.keys(this.props.byo.charmsOnFixture);
        let removedKey;
        let closest;

        if (currentKeys.length < prevKeys.length) {
            // A charm has been removed
            if (currentKeys.length === 0) {
                // set focus to chain
                const fixtureRef = findFirst('.byo-canvas__fixture');

                if (fixtureRef) {
                    fixtureRef.focus();
                }
            } else {
                Object.keys(prevKeys).forEach(key => {
                    if (currentKeys.indexOf(key) === -1) {
                        removedKey = key;
                    }
                });
                closest = currentKeys.reduce((prev, curr) => {
                    return (Math.abs(curr - removedKey) < Math.abs(prev - removedKey) ? curr : prev);
                });

                if (closest) {
                    const elements = findAll('.byo-canvas__drop-zones_zone_charm');

                    for (let i = 0; i < elements.length; i += 1) {
                        const element = elements[i];

                        if (element.getAttribute('data-fixture-index') === closest) {
                            element.focus();
                            contextMenu.hideAll();
                        }
                    }
                }
            }
        }
    }

    /**
     * @description hide all canvas messages
     * @returns {void} no return
     */
    hideMessages = () => {
        this.setState({
            showAddCharmsMessage: false,
            showTapCharmsMessage: false,
            showCharmErrorMessage: false,
            allowMaxCharmMessage: false
        });
    }

    /**
     * @description returns informational message
     * @returns {string} informational message
     */
    getMessage = () => {
        const {
            byo,
            aem
        } = this.props;

        let message = objectPath.get(aem, 'byoConfig.noCharmsMessage.necklaceInformational.necklaceInformationalMessage', '');

        if (byo.selectedFixture.isSilhouette) {
            message = objectPath.get(aem, 'byoConfig.noCharmsMessage.silhoutteInformationalMessage', '');
        } else if (byo.isBracelet) {
            message = objectPath.get(aem, 'byoConfig.noCharmsMessage.braceletInformational.braceletInformationalMessage', '');
        }
        message = message.replace('{{}}', byo.selectedFixture.maxCharmsAllowed);

        return message;
    }

    /**
     * @description Will dispatch engraving save for a charm
     * @returns {void}
     */
    setEngraving = () => {
        const selectedEngraving = JSON.parse(JSON.stringify(this.props.engraving.variant));

        this.props.dispatch(saveEngraving(selectedEngraving));
    }

    /**
     * @description Will dispatch engraving clear index for Charm
     * @returns {void}
     */
    clearEngravingIndex = () => {
        this.props.dispatch(clearCharmEngravingIndex());
    }

    /**
     * @description will trigger on image load
     * @param {object} e Event object
     * @returns {void}
     */
    fixtureLoaded = (e) => {
        const { target: { width, naturalWidth, naturalHeight } } = e;

        if (this.props.byo.selectedFixture.fixturePositions && this.props.byo.previewWidth !== null) {
            const fixturePositions = this.props.byo.selectedFixture.fixturePositions.map(postion => {
                return { left: (postion[0] / naturalWidth) * 100, top: (postion[1] / naturalHeight) * 100 };
            });

            this.props.dispatch(setPreviewWidth(width));
            this.setState({ fixturePositions });
        }
    }

    /**
     * @description hide info messages
     * @returns {void}
     */
    hideInfoMessage = () => {
        this.setState({ showTapCharmsMessage: false });
    }

    /**
     * @description show charm Incompatible error message
     * @param {boolean} isValid isValid
     * @returns {void}
     */
    charmErrorMessage = (isValid) => {
        if (isValid) {
            this.setState({ showCharmErrorMessage: false, allowMaxCharmMessage: true });
        } else {
            this.setState({ showCharmErrorMessage: true, allowMaxCharmMessage: false }, () => {
                if (this.state.showTapCharmsMessage) {
                    this.setState({ showTapCharmsMessage: false });
                }
            });
        }
    }

    /**
     * @description Render Method
     * @returns {void}
     */
    render() {
        const canvasRole = 'application';
        const tIndex = 0;

        return (
            <React.Fragment>
                <div className="byo-canvas__gradient_overlay" />
                <CSSTransition
                    in={this.state.showCanavs}
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
                    <div
                        className="byo-canvas"
                        tabIndex={tIndex}
                        role={canvasRole}
                        aria-label="BYO Canvas"
                    >
                        <img
                            alt={this.props.byo.selectedFixture.title ? this.props.byo.selectedFixture.title : this.props.byo.selectedFixture.name}
                            src={this.props.byo.selectedFixture.imageURL}
                            onLoad={this.fixtureLoaded}
                            tabIndex={tIndex}
                            className="byo-canvas__fixture"
                        />
                        <div
                            className="byo-canvas__drop-zones"
                        >
                            {this.state.fixturePositions.map((position, index) => {
                                return (<Droppable isClasp isColpo={this.props.byo.isClaspEnabled} key={index.toString()} index={index} left={position.left} top={position.top} hideMessages={this.hideMessages} />);
                            })}
                        </div>
                        <div
                            className="byo-canvas__charms-holder"
                        >
                            {this.state.fixturePositions.map((position, index) => {
                                return (<Droppable isClasp={false} isColpo={this.props.byo.isClaspEnabled} key={index.toString()} index={index} left={position.left} top={position.top} />);
                            })}
                        </div>
                    </div>
                </CSSTransition>
                {this.props.byo.byoEditMode &&
                    <React.Fragment>
                        <Preview width={this.props.byo.previewWidth} isColpo={this.props.byo.isClaspEnabled} charmErrorMessage={this.charmErrorMessage} />
                        <MaxCharmMessage hideInfoMessage={this.hideInfoMessage} allowMaxCharmMessage={this.state.allowMaxCharmMessage} />
                    </React.Fragment>
                }
                {(this.props.byo.currentEngravingCharm && !this.props.byo.currentEngravingCharm.selectedEngraving) &&
                    <EngravingInModal
                        sku={this.props.byo.currentEngravingCharm.selectedSku ? this.props.byo.currentEngravingCharm.selectedSku : this.props.byo.currentEngravingCharm.sku}
                        groupSku={this.props.byo.currentEngravingCharm.selectedSku ? this.props.byo.currentEngravingCharm.sku : ''}
                        buttonLabel="Start Engraving"
                        isByo
                        showComponent
                        hasCustomAction
                        customBtnLabel={this.props.labels.byo.engraving.engravingFinishLabel}
                        customClosingAction={this.setEngraving}
                        onClose={this.clearEngravingIndex}
                        hasCustomActionPrice
                        productBasePrice={String(this.props.byo.currentEngravingCharm.price)}
                    />
                }
                {(this.props.byo.currentEngravingCharm && this.props.byo.currentEngravingCharm.selectedEngraving) &&
                    <EngravingInModal
                        sku={this.props.byo.currentEngravingCharm.selectedSku ? this.props.byo.currentEngravingCharm.selectedSku : this.props.byo.currentEngravingCharm.sku}
                        groupSku={this.props.byo.currentEngravingCharm.selectedSku ? this.props.byo.currentEngravingCharm.sku : ''}
                        buttonLabel="Personalise"
                        buttonType="cta"
                        customButtonClass="hide"
                        restrictBackground
                        hasOverlay
                        isByo
                        showComponent
                        closeonTapOutside
                        customActionButtonClass=""
                        hasCustomAction
                        editingEngraving
                        initialOne={String(this.props.byo.currentEngravingCharm.selectedEngraving.initialOne || '')}
                        initialTwo={String(this.props.byo.currentEngravingCharm.selectedEngraving.initialTwo || '')}
                        initialThree={String(this.props.byo.currentEngravingCharm.selectedEngraving.initialThree || '')}
                        itemServiceTypeId={String(this.props.byo.currentEngravingCharm.selectedEngraving.itemServiceTypeId)}
                        styleCode={String(this.props.byo.currentEngravingCharm.selectedEngraving.styleCode)}
                        groupId={String(this.props.byo.currentEngravingCharm.selectedEngraving.groupId)}
                        productBasePrice={String(this.props.byo.currentEngravingCharm.price)}
                        customClosingAction={this.setEngraving}
                        onClose={this.clearEngravingIndex}
                        customBtnLabel={this.props.labels.byo.engraving.engravingFinishLabel}
                        hasCustomActionPrice
                    />
                }
                <ByoCanvasActionsBar />
                {
                    this.state.showAddCharmsMessage &&
                    <div
                        className="byo-canvas__nocharm-messsage"
                    >
                        <div
                            className="byo-canvas__nocharm-messsage_author-text"
                            dangerouslySetInnerHTML={{ __html: this.getMessage() }}
                            role="alert"
                        />
                        <div className="byo-canvas__nocharm-messsage_image">
                            <Picture
                                sources={[]}
                                defaultSrc={objectPath.get(this.props, 'aem.byoConfig.noCharmsMessage.instructionImage', '')}
                                altText={objectPath.get(this.props, 'aem.byoConfig.noCharmsMessage.instructionImageAlt', '')}
                                isLazyLoad={false}
                            />
                        </div>
                    </div>
                }
                {
                    this.state.showTapCharmsMessage &&
                    <div
                        className="byo-canvas__tapcharm-messsage"
                    >
                        <p role="alert" className="byo-canvas__tapcharm-messsage_author-text">
                            {objectPath.get(this.props, 'aem.byoConfig.canvas.tapCharmMessage', '')}
                        </p>
                        <div className="byo-canvas__tapcharm-messsage_image">
                            <Picture
                                sources={[]}
                                defaultSrc={objectPath.get(this.props, 'aem.icons.byoArrow.src', '')}
                                altText={objectPath.get(this.props, 'aem.icons.byoArrow.altText', '')}
                                isLazyLoad={false}
                            />
                        </div>
                    </div>
                }
                {
                    this.state.showCharmErrorMessage &&
                    <div
                        className="byo-canvas__charm-messsage"
                    >
                        <p role="alert" className="byo-canvas__charm-messsage_author-text">
                            {objectPath.get(this.props, 'aem.byoConfig.canvas.tapCharmErrorMessage', '')}
                        </p>
                    </div>
                }
            </React.Fragment>
        );
    }
}

BYOCanvas.propTypes = {
    byo: PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired,
    aem: PropTypes.any.isRequired,
    labels: PropTypes.any.isRequired,
    engraving: PropTypes.any.isRequired
};

const mapStateToProps = (state) => {
    return {
        byo: state.byo,
        aem: state.aem,
        labels: state.authoredLabels,
        engraving: state.engraving
    };
};

export default connect(mapStateToProps)(BYOCanvas);
