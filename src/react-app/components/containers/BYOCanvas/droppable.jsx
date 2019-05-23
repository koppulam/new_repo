
import React from 'react';
import * as objectPath from 'object-path';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import {
    addCharmToFixture,
    swapCharmOnFixture,
    moveCharmToNearestOnFixture,
    removeCharmFromFixture
} from 'actions/BYOActions';
import { setAnalyticsData, triggerAnalyticsEvent, transformProductObject } from 'lib/utils/analytics-util';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import Picture from 'components/common/Picture';
import scopeFocus from 'lib/dom/scope-focus';

import Draggable from './draggable';

const addCharmToChainAnalytics = (item) => {
    const byoData = objectPath.get(window, 'dataLayer.byo', {});

    byoData.step = AnalyticsConstants.BYO_CONFIGURE;
    byoData.back = false;

    setAnalyticsData('byo', byoData);
    triggerAnalyticsEvent(AnalyticsConstants.ADD_TO_CHAIN, { product: transformProductObject(item.charm) });
};

const drop = (props, monitor) => {
    // dispatch an item drop here
    const item = monitor.getItem ? monitor.getItem() : monitor;

    if (props.inTray) {
        props.dispatch(removeCharmFromFixture(item.fixtureIndex));
    } else if (props.byo.charmsOnFixture[props.index]) {
        // swap the charms or move charm to near by drop zone
        if (!item.inTray) {
            if (!item.fixtureIndex && item.fixtureIndex !== 0) {
                return;
            }
            props.dispatch(swapCharmOnFixture(item.charm, props.index, item.fixtureIndex));
        } else {
            props.dispatch(moveCharmToNearestOnFixture(item.charm, props.index, item.trayIndex));
            addCharmToChainAnalytics(item);
        }
    } else {
        props.dispatch(addCharmToFixture(item.charm || item, props.index, item.trayIndex, item.fixtureIndex, item.movedUsingAnchor));
        addCharmToChainAnalytics(item);
    }
};

const droppableTarget = {
    drop,
    canDrop(props, monitor) {
        // check from redux state if this zone is available
        const item = monitor.getItem();
        let mountTypesMatching = false;

        if (props.inTray && item.fixtureIndex !== undefined) {
            return true;
        }
        if (item.fixtureIndex === undefined && props.inTray) {
            return false;
        }

        // check for mountType mismatch and return false
        if (!props.byo.selectedFixture.isSilhouette) {
            item.charm.mountTypes.forEach(mountType => {
                const mountTypes = props.byo.selectedFixture.mountTypes.map(String);

                if (mountTypes.indexOf(mountType.toString()) !== -1) {
                    mountTypesMatching = true;
                }
            });
        } else if (props.byo.selectedFixture.isSilhouette) {
            mountTypesMatching = true;
        }
        return mountTypesMatching;
    }
};

/**
 * @description Collect function for droppable
 * @param {*} dndconnect connect object
 * @param {*} monitor monitor object
 * @returns {object} returns the props
 */
function collect(dndconnect, monitor) {
    return {
        connectDropTarget: dndconnect.dropTarget(),
        isOver: monitor.isOver(),
        item: monitor.getItem(),
        canDrop: monitor.canDrop()
    };
}

/**
 * A Droppable element
 */
class Droppable extends React.Component {
    /**
     * @description render method
     * @returns {HTML} html
     */
    render() {
        const {
            connectDropTarget,
            isOver,
            canDrop,
            left,
            top,
            isClasp,
            byo,
            index,
            isColpo
        } = this.props;
        const anchorPointActiveImgAlt = objectPath.get(this.props, 'aem.byoConfig.canvas.anchorPointActiveImgAlt', 'active');
        const anchorPointImgAlt = objectPath.get(this.props, 'aem.byoConfig.canvas.anchorPointImgAlt', 'icon');

        if (!this.props.inTray) {
            return connectDropTarget(
                <div
                    className="byo-canvas__drop-zones_zone"
                    style={{
                        position: 'absolute',
                        width: '20%',
                        left: `${left}%`,
                        top: `${top}%`,
                        transform: `translate(-50%, -6%) scale(${this.props.byo.selectedCharmMoveIndex === index ? 1.05 : 1})`,
                        paddingBottom: this.props.byo.charmsOnFixture[this.props.index] ? '0%' : '50%'
                    }}
                >
                    <CSSTransition
                        in={this.props.byo.selectedCharmMoveIndex !== null || canDrop}
                        timeout={300}
                        classNames={{
                            enter: 'hotspot__enter',
                            enterActive: 'hotspot__enter_active',
                            enterDone: 'hotspot__enter_complete',
                            exit: 'hotspot__fade-out',
                            exitActive: 'hotspot__fade-out_active',
                            exitDone: 'hotspot__fade-out_complete'
                        }}
                        mountOnEnter
                        unmountOnExit
                    >
                        <div
                            className="hotspot"
                            style={{
                                position: 'absolute',
                                top: -25,
                                left: 0,
                                height: '100%',
                                width: '100%',
                                zIndex: 1
                            }}
                            onClick={() => {
                                drop(this.props, {
                                    charm: byo.charmsOnFixture[byo.selectedCharmMoveIndex],
                                    fixtureIndex: byo.selectedCharmMoveIndex,
                                    inTray: false,
                                    trayIndex: undefined,
                                    movedUsingAnchor: true
                                });
                                scopeFocus.dispose();
                            }}
                            onKeyDown={(e) => {
                                // e.preventDefault();
                                // e.stopPropagation();
                                if (e.key === 'Enter') {
                                    drop(this.props, {
                                        charm: byo.charmsOnFixture[byo.selectedCharmMoveIndex],
                                        fixtureIndex: byo.selectedCharmMoveIndex,
                                        inTray: false,
                                        trayIndex: undefined,
                                        movedUsingAnchor: true
                                    });
                                    scopeFocus.dispose();
                                }
                            }}
                            role="button"
                            tabIndex={isClasp ? 0 : -1}
                            aria-label={objectPath.get(window, 'tiffany.labels.byo.hotspotLabel', 'charm hotspot')}
                        >
                            {isOver ? <Picture altText={anchorPointActiveImgAlt} defaultSrc={this.props.aem.byoConfig.canvas.anchorPointActiveUrl} isLazyLoad={false} /> : <Picture altText={anchorPointImgAlt} defaultSrc={this.props.aem.byoConfig.canvas.anchorPointUrl} isLazyLoad={false} />}
                        </div>
                    </CSSTransition>
                    {this.props.byo.charmsOnFixture[this.props.index] && <Draggable labels={this.props.labels} aem={this.props.aem} byo={this.props.byo} dispatch={this.props.dispatch} fixtureIndex={this.props.index} isClasp={isClasp} isColpo={isColpo} charm={this.props.byo.charmsOnFixture[this.props.index]} hideMessages={this.props.hideMessages} />}
                </div>
            );
        }
        return (
            <React.Fragment>
                {(this.props.inTray && canDrop) && connectDropTarget(<div className="tray-drop-zone" />)}
                <CSSTransition
                    in={this.props.inTray && canDrop}
                    timeout={1}
                    classNames={{
                        enter: 'tray-drop-zone-placeholder__enter',
                        enterActive: 'tray-drop-zone-placeholder__enter_active',
                        enterDone: 'tray-drop-zone-placeholder__enter_complete',
                        exit: 'tray-drop-zone-placeholder__exit',
                        exitActive: 'tray-drop-zone-placeholder__exit_active',
                        exitDone: 'tray-drop-zone-placeholder__exit_complete'
                    }}
                    mountOnEnter
                    unmountOnExit
                >
                    <div className="tray-drop-zone-placeholder" />
                </CSSTransition>
            </React.Fragment>
        );
    }
}

Droppable.defaultProps = {
    inTray: false,
    hideMessages: () => {}
};

Droppable.propTypes = {
    byo: PropTypes.any.isRequired,
    aem: PropTypes.any.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    isClasp: PropTypes.bool.isRequired,
    isColpo: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    inTray: PropTypes.bool,
    hideMessages: PropTypes.func
};

const mapStateToProps = (state) => {
    return {
        byo: state.byo,
        aem: state.aem,
        labels: state.authoredLabels
    };
};

export default connect(mapStateToProps)(DropTarget('CHARM', droppableTarget, collect)(Droppable));
