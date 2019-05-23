// Packages
import React from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import PropTypes from 'prop-types';
import * as objectPath from 'object-path';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import { CSSTransition } from 'react-transition-group';
import BYOCanvas from 'components/containers/BYOCanvas';
import styleVariables from 'lib/utils/breakpoints';
import MediaQuery from 'react-responsive';
import TiffanyModal from 'components/common/TiffanyModal';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import { findFirst } from 'lib/dom/dom-util';

import { setAnalyticsData, triggerAnalyticsEvent } from 'lib/utils/analytics-util';
import {
    addChainModal,
    editCharmSelected,
    showGrid,
    isBraceletSelected,
    changeClaspEnabled,
    byoLanding,
    saveDesign,
    AddToWishListSilhouette
} from 'actions/BYOActions';

import ByoBrowseGrid from './ByoBrowseGrid';
import SelectMaterial from './SelectMaterial';
import Tray from './Tray';
import Drawer from './Drawer';
import AddChain from './AddChain';

// Style
import './byo-animations.scss';
// import './index.scss';
import './addChain.scss';
import './selectMaterial.scss';
import EditCharm from './EditCharm';
import ClaspMessage from './ClaspMessage';
import SaveCreation from './SaveCreation';

/**
 * Buy Online now and pick up in store Component
 */
class BuildYourOwn extends React.Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            showClasp: false,
            showSaveMsg: false,
            isFixtureChanged: true,
            fixtureCompleteRequest: objectPath.get(window, 'tiffany.authoredContent.byoConfig.fixtureCompleteRequest', {}),
            productData: {},
            drawerOpened: false
        };
        this.breakpointHandler = window.matchMedia(styleVariables.desktopAndBelow);
    }

    /**
     * Lifcycle hook
     * @returns {void}
     */
    componentDidMount() {
        this.breakpointHandler.addListener(this.setCanvasHeight);
        this.props.dispatch(byoLanding());
        window.addEventListener('popstate', this.byoPopState);
        window.addEventListener('orientationchange', this.setCanvasHeight);
    }

    /**
     * @description lifecycle hook
     * @param {any} nextProps Next Props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.byo.charmsOnFixture !== this.props.byo.charmsOnFixture) {
            if (!isEqual(nextProps.byo.charmsOnFixture, this.props.byo.charmsOnFixture)) {
                this.setState({ isFixtureChanged: true });
            }
        }
        if (nextProps.byo.byoEditMode !== this.props.byo.byoEditMode && nextProps.byo.byoEditMode) {
            this.setCanvasHeight();
        }
        if (!isEqual(nextProps.byo.designID, this.props.byo.designID)) {
            this.setState({ isFixtureChanged: false });
        }
    }

    /**
     * Lifcycle hook
     * @returns {void}
     */
    componentWillUnmount() {
        this.breakpointHandler.removeListener(this.setCanvasHeight);
        window.removeEventListener('popstate', this.byoPopState);
        window.removeEventListener('orientationchange', this.setCanvasHeight);
    }

    /**
     * @description set BYO canvas height dynamically
     * @returns {void}
     */
    setCanvasHeight() {
        const isMobile = window.matchMedia(styleVariables.desktopAndBelow).matches;
        const isIpadLandscape = window.matchMedia(styleVariables.ipadMaxLandscape).matches;
        const canvasContainer = findFirst('.build-your-own__canvas-container');
        const viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        const globalBanner = findFirst('.global-banner');
        const trayContainer = findFirst('.tray-container');

        if (isMobile && canvasContainer) {
            const headerHeight = findFirst('header').clientHeight > 0 ? findFirst('header').clientHeight : 48;
            const height = viewPortHeight - ((globalBanner ? globalBanner.clientHeight : 0) +
                (trayContainer ? 120 : 0) + headerHeight);

            canvasContainer.style.height = `${height}px`;
        } else if (canvasContainer) {
            if (isIpadLandscape) {
                const headerHeight = findFirst('header').clientHeight > 0 ? findFirst('header').clientHeight : 64;
                const height = viewPortHeight - ((globalBanner ? globalBanner.clientHeight : 0) +
                (trayContainer ? 204 : 0) + headerHeight);

                canvasContainer.style.height = `${height}px`;
            } else {
                canvasContainer.style.removeProperty('height');
            }
        }
    }

    /**
     * @description popstate event listner
     * @param {object} e event
     * @returns {void}
     */
    byoPopState = (e) => {
        if (this.state.isFixtureChanged && (!this.props.byo.selectedFixture.isSilhouette || Object.keys(this.props.byo.charmsOnFixture).length > 0)) {
            setTimeout(() => {
                if (this.props.byo.designID) {
                    const appendPath = objectPath.get(window, 'tiffany.authoredContent.byoConfig.baseBYOUrl', '/');
                    const designIdIdentifier = objectPath.get(window, 'tiffany.authoredContent.byoConfig.designIdIdentifier', '');

                    window.history.pushState(null, true, appendPath + designIdIdentifier + this.props.byo.designID);
                } else {
                    window.history.pushState(true, null, null);
                }
                this.setState({ showSaveMsg: true });
            });
        } else {
            window.history.go(-1);
        }
    }

    /**
     * @description save message modal
     * @returns {void}
     */
    saveMsg = () => {
        if (this.props.byo.selectedFixture.isSilhouette) {
            this.props.dispatch(AddToWishListSilhouette());
        } else {
            this.props.dispatch(saveDesign());
        }
        this.setState({ isFixtureChanged: false });
        this.setState({ showSaveMsg: false });
    }

    /**
     * @description close save message modal
     * @returns {void}
     */
    closeSavemsg = () => {
        this.setState({ showSaveMsg: false, isFixtureChanged: false });
        window.history.go(-2);
    }

    /**
     * @description close save message modal
     * @returns {void}
     */
    closeSavemsgModal = () => {
        this.setState({ showSaveMsg: false });
    }

    /**
     * @description close colpo modal
     * @returns {void}
     */
    colpoCloseHandler = () => {
        this.setState({ showClasp: false, productData: {} });
    }

    /**
     * @description close colpo modal and go to browse grid
     * @returns {void}
     */
    acknowledgeClasp = () => {
        const request = JSON.parse(JSON.stringify(this.state.fixtureCompleteRequest));
        const braceletId = objectPath.get(window, 'tiffany.authoredContent.byoConfig.braceletCategoryId', '');
        const isBracelet = objectPath.get(this.state.productData, 'productDetails.0.group.canonicalCategoryId', '').toString() === braceletId;

        if (Object.keys(this.state.productData).length > 0) {
            request.payload.Sku = objectPath.get(this.state.productData, 'sizes.memberSku', false) || objectPath.get(this.state.productData, 'sizes.selectedSku', false) || this.state.productData.fixtureDetails.selectedSku;
            this.props.dispatch(showGrid(true, this.state.productData));
            this.props.dispatch(changeClaspEnabled(true));
            if (isBracelet) {
                this.props.dispatch(isBraceletSelected(true));
            } else {
                this.props.dispatch(isBraceletSelected(false));
            }
            const byoStep = objectPath.get(window, 'dataLayer.byo', {});

            byoStep.chain.requiresClaspingLink = true;

            setAnalyticsData('byo', byoStep);
            triggerAnalyticsEvent(AnalyticsConstants.UPDATED_BYO, {});
        }
        this.colpoCloseHandler();
    }

    /**
     * @description close add chain modal
     * @param {object} obj ficture data
     * @returns {void}
     */
    closeModal = (obj) => {
        this.props.dispatch(addChainModal(false));
        if (obj && Object.keys(obj).length > 0) {
            this.setState({ productData: obj, showClasp: true });
        }
    }

    /**
     * @description close add chain modal
     * @returns {void}
     */
    closeEditCharmModal = () => {
        this.props.dispatch(editCharmSelected(false));
    }

    /**
     * @description drawer opened
     * @param {boolean} status status
     * @returns {void}
     */
    drawerOpened = (status) => {
        this.setState({ drawerOpened: status });
    }

    /**
     * @returns {object} Element
     */
    render() {
        const addChainModalOptions = {
            overlay: true,
            className: 'add-chain-modal',
            closeClass: 'close-modal',
            overlayClass: 'clasp-overlay',
            blockMobileScrollability: true,
            blockDesktopScrollability: true,
            modalFocus: true,
            exitFocusRef: this.props.byo.addChainRef,
            closeonTapOutside: {
                isClose: true,
                modalContainerClass: 'add-chain-modal'
            }
        };
        const editCharmModalOptions = {
            overlay: true,
            className: 'edit-charm-modal',
            closeClass: 'close-modal',
            overlayClass: 'clasp-overlay',
            blockMobileScrollability: true,
            blockDesktopScrollability: true,
            modalFocus: true,
            exitFocusRef: this.props.byo.editCharmRef,
            closeonTapOutside: {
                isClose: true,
                modalContainerClass: 'edit-charm-modal'
            }
        };
        const claspModalOptions = {
            overlay: true,
            className: 'clasp-modal',
            closeClass: 'close-modal',
            overlayClass: 'clasp-overlay',
            blockMobileScrollability: true,
            blockDesktopScrollability: true,
            closeonTapOutside: {
                isClose: true,
                modalContainerClass: 'clasp-message'
            }
        };
        const saveCreationOptions = {
            overlay: true,
            className: 'start-creation-modal',
            closeClass: 'close-modal',
            overlayClass: 'clasp-overlay',
            blockMobileScrollability: true,
            blockDesktopScrollability: true,
            closeonTapOutside: {
                isClose: true,
                modalContainerClass: 'start-creation'
            }
        };
        const selectedCharmOnFixture = this.props.byo.charmsOnFixture[this.props.byo.charmIndexOnFix];

        return (
            <div className="build-your-own">
                {this.props.byo.showBrowseGrid === false &&
                    <SelectMaterial />
                }
                <div
                    className={classNames('build-your-own__container',
                        {
                            'byo-edit': this.props.byo.byoEditMode
                        })}
                >

                    <div
                        className={classNames('build-your-own__canvas-container',
                            {
                                hide: !this.props.byo.byoEditMode,
                                'drawer-closed': !this.state.drawerOpened
                            })}
                    >
                        <BYOCanvas />
                        <Drawer drawerOpened={this.drawerOpened} />
                    </div>
                    <CSSTransition
                        in={this.props.byo.showBrowseGrid}
                        timeout={1000}
                        classNames="show-grid"
                        mountOnEnter
                        unmountOnExit
                    >
                        <div>
                            <Tray />
                            <MediaQuery query={styleVariables.desktopTabletAbove}>
                                <ByoBrowseGrid />
                            </MediaQuery>
                            <MediaQuery query={styleVariables.belowDesktopTablet}>
                                <CSSTransition
                                    in={!this.props.byo.byoEditMode}
                                    timeout={0}
                                    classNames={{}}
                                    mountOnEnter
                                    unmountOnExit
                                >
                                    <ByoBrowseGrid />
                                </CSSTransition>
                            </MediaQuery>
                        </div>
                    </CSSTransition>
                </div>
                {this.props.byo.showAddChain &&
                    <TiffanyModal
                        visible={this.props.byo.showAddChain}
                        options={addChainModalOptions}
                        onClose={this.closeModal}
                    >
                        <AddChain closeModal={this.closeModal} />
                    </TiffanyModal>
                }
                {selectedCharmOnFixture && this.props.byo.showEditCharm &&
                    <TiffanyModal
                        visible={this.props.byo.showEditCharm}
                        options={editCharmModalOptions}
                        onClose={this.closeEditCharmModal}
                    >
                        <EditCharm
                            variationType={selectedCharmOnFixture.variation ? selectedCharmOnFixture.variation.type : ''}
                            productDetails={selectedCharmOnFixture}
                            config="onHoverProductTileConfig"
                            closeEditCharmModal={this.closeEditCharmModal}
                        />
                    </TiffanyModal>
                }
                {
                    this.state.showClasp &&
                    <TiffanyModal
                        visible={this.state.showClasp}
                        options={claspModalOptions}
                        onClose={this.colpoCloseHandler}
                    >
                        <div className="select-material__clasp-modal">
                            <ClaspMessage colpoCloseHandler={this.colpoCloseHandler} acknowledgeClasp={this.acknowledgeClasp} />
                        </div>
                    </TiffanyModal>
                }
                {
                    this.state.showSaveMsg &&
                    <TiffanyModal
                        visible={this.state.showSaveMsg}
                        options={saveCreationOptions}
                        onClose={this.closeSavemsgModal}
                    >
                        <SaveCreation saveCreation={this.saveMsg} saveCreationClose={this.closeSavemsg} closeModal={this.closeSavemsgModal} />
                    </TiffanyModal>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        byo: state.byo
    };
};

BuildYourOwn.propTypes = {
    dispatch: PropTypes.func.isRequired,
    byo: PropTypes.any.isRequired
};

export default connect(mapStateToProps)(DragDropContext(TouchBackend({ enableMouseEvents: true }))(BuildYourOwn));
