
import React from 'react';
import PropTypes from 'prop-types';
import * as objectPath from 'object-path';
import { DragSource } from 'react-dnd';
import Picture from 'components/common/Picture';
import { MenuProvider, contextMenu } from 'react-contexify';
import classNames from 'classnames';
import CONSTANTS from 'constants/ContextMenuConstants';
import {
    removeCharmFromFixture,
    editCharmSelected,
    selectedcharmOnFixture,
    setCharmMoveIndex,
    ctxClicked,
    setCharmEngravingIndex
} from 'actions/BYOActions';
import { findFirst, findAll } from 'lib/dom/dom-util';
import scopeFocus from 'lib/dom/scope-focus';

import CtxMenu from './ctx';

const draggableSource = {
    beginDrag(props) {
        return {
            charm: props.charm,
            inTray: props.inTray,
            trayIndex: props.trayIndex,
            fixtureIndex: props.fixtureIndex,
            isValid: () => {
                let mountTypesMatching;

                if (props.selectedChain) {
                    if (!props.selectedChain.isSilhouette) {
                        props.charm.mountTypes.forEach(mountType => {
                            const mountTypes = props.selectedChain.mountTypes.map(String);

                            if (mountTypes.indexOf(mountType.toString()) !== -1) {
                                mountTypesMatching = true;
                            }
                        });
                    } else if (props.selectedChain.isSilhouette) {
                        mountTypesMatching = true;
                    }
                } else {
                    mountTypesMatching = true;
                }
                return mountTypesMatching;
            }
        };
    }
};

/**
 * @description collect function
 * @param {*} connect  connect object
 * @param {*} monitor monitor object
 * @returns {object} an object
 */
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        item: monitor.getItem()
    };
}

/**
 * Draggable component
 */
class Draggable extends React.Component {
    /**
     * @description Constructor
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.menuRef = React.createRef();
        this.menuWrapperRef = React.createRef();
        this.state = {
            isDangle: true
        };

        this.domRef = React.createRef();
    }

    /**
     * @description Life cycle hook
     * @returns {void}
     */
    componentDidMount() {
        setTimeout(() => { this.setState({ isDangle: false }); }, 1000);
    }

    /**
     * @description Life cycle hook
     * @param {any} nextProps Next Props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (this.props.charm && nextProps.charm && nextProps.charm.time !== this.props.charm.time) {
            this.setState({ isDangle: true }, () => {
                setTimeout(() => { this.setState({ isDangle: false }); }, 1000);
            });
        }
    }

    /**
     * @description returns alt message
     * @returns {string} alt message
     */
    getMessage = () => {
        const {
            aem,
            byo,
            charm
        } = this.props;
        let message = objectPath.get(aem, 'byoConfig.canvas.anchorAlt', '');

        message = `${charm.name} ${message}`;
        message = message.replace('{{}}', parseInt(charm.fixtureIndex, 10) + 1);
        message = message.replace('{{}}', byo.selectedFixture.maxCharmsAllowed);
        return message;
    }

    /**
     * @description Life cycle hook
     * @returns {void}
     */
    imageLoaded = () => {
        this.setState({ isDangle: true }, () => {
            setTimeout(() => { this.setState({ isDangle: false }); }, 1000);
        });
    }

    /**
     * @description Opens the context menu
     * @param {object} e Event object
     * @returns {void}
     */
    openMenu = (e) => {
        if (e.key === 'Enter' && this.props.byo.selectedCharmMoveIndex === null && this.domRef === document.activeElement) {
            e.stopPropagation();
            const rect = e.target.getBoundingClientRect();
            const clientX = rect.left;
            const clientY = rect.top;
            const nativeEvent = new MouseEvent(e.type, {
                ...e.nativeEvent,
                clientX,
                clientY
            });
            const event = {
                type: e.type,
                ...e.nativeEvent,
                clientX,
                clientY,
                nativeEvent,
                preventDefault: () => { },
                stopPropagation: () => { }
            };

            this.triggerCtx(event);
            this.hideMessages();
        }
    }

    /**
     * @description Triggers ctx menu on submit
     * @param {object} e Event Object
     * @returns {void}
     */
    triggerCtx = (e) => {
        e.preventDefault();
        contextMenu.show({
            id: `${this.props.fixtureIndex}`,
            event: e,
            props: {
                fixtureIndex: this.props.fixtureIndex
            }
        });
        setTimeout(() => {
            const element = findFirst('.ctx-menu-item');

            if (element) {
                element.focus();
            }
        }, 0);
    }

    /**
     * @description Will trighger ctx action
     * @param {String} type Action Type
     * @param {Number} index charm index
     * @returns {null} null
     */
    ctxAction = (type, index) => {
        contextMenu.hideAll();
        scopeFocus.dispose();
        switch (type) {
            case CONSTANTS.ACTIONS.MOVE: {
                this.props.dispatch(setCharmMoveIndex(index));
                this.props.dispatch(ctxClicked());
                const elements = findAll('.byo-canvas__drop-zones_zone_charm');

                scopeFocus.setScopeLimit(findFirst('.byo-canvas__drop-zones'));
                if (elements && elements.length > 0) {
                    elements.forEach(element => {
                        if (String(element.getAttribute('data-fixture-index')) === String(this.props.fixtureIndex)) {
                            element.focus();
                        }
                    });
                }
                break;
            }
            case CONSTANTS.ACTIONS.REMOVE:
                scopeFocus.dispose();
                this.props.dispatch(removeCharmFromFixture(index));
                this.props.dispatch(ctxClicked());
                break;
            case CONSTANTS.ACTIONS.EDIT:
                this.props.dispatch(editCharmSelected(true, 'tray-container__body_fixture-image'));
                this.props.dispatch(selectedcharmOnFixture(index));
                this.props.dispatch(ctxClicked());
                break;
            case CONSTANTS.ACTIONS.PERSONALIZE:
                this.props.dispatch(setCharmEngravingIndex(index));
                this.props.dispatch(ctxClicked());
                break;
            default:
                return null;
        }
        return null;
    }

    /**
     * @description hide canvas messgaes
     * @returns {void}
     */
    hideMessages = () => {
        this.props.hideMessages();
    }

    /**
     * @description render method
     * @returns {HTML} html
     */
    render() {
        const {
            connectDragSource,
            isClasp,
            inTray,
            fixtureIndex,
            item,
            isColpo,
            labels
        } = this.props;
        let { imageURL } = this.props.charm;
        const claspText = objectPath.get(labels, 'byo.claspAlt', 'clasp');
        const charmText = objectPath.get(labels, 'byo.charmAlt', 'charm');

        if (!inTray) {
            if (isColpo) {
                imageURL = isClasp ? this.props.charm.colpoClaspURL : this.props.charm.colpoTransparentURL;
            } else {
                imageURL = isClasp ? this.props.charm.claspURL : this.props.charm.transparentURL;
            }
        }

        // Animations Note: Add addCharmAnimation class to the element that has to swing/hang to the chain
        return connectDragSource(
            inTray ?
                <button
                    type="button"
                    className={this.props.customClass}
                    onClick={this.props.dragElement}
                    style={{
                        backgroundImage: `url(${imageURL})`
                    }}
                    tabIndex="0"
                /> :
                <div
                    onKeyDown={this.openMenu}
                    onClick={this.hideMessages}
                    tabIndex={(isClasp && this.props.byo.selectedCharmMoveIndex === null) ? 0 : -1}
                    role="button"
                    data-fixture-index={this.props.fixtureIndex}
                    className={classNames(
                        'byo-canvas__drop-zones_zone_charm',
                        { addCharmAnimation: this.state.isDangle },
                        { 'charm-drag-blur': item && fixtureIndex === item.fixtureIndex }
                    )}
                    aria-label={this.getMessage()}
                    ref={el => { this.domRef = el; }}
                >
                    {isClasp ?
                        <React.Fragment key={this.props.trayIndex}>
                            <MenuProvider
                                id={`${this.props.fixtureIndex}`}
                                event="onClick"
                                ref={el => { this.menu = el; }}
                                data={{ fixtureIndex }}
                            >
                                <Picture onClick={this.triggerCtx} ref={this.menuWrapperRef} customClass={this.props.customClass} altText={isClasp ? claspText : charmText} defaultSrc={imageURL} isLazyLoad={false} />
                            </MenuProvider>
                            <CtxMenu aem={this.props.aem} sku={this.props.charm.sku} charm={this.props.charm} action={this.ctxAction} dispatch={this.props.dispatch} fixtureIndex={this.props.fixtureIndex} />
                        </React.Fragment>
                        :
                        <Picture customClass={this.props.customClass} altText={isClasp ? claspText : charmText} defaultSrc={imageURL} isLazyLoad={false} onLoadHandler={this.imageLoaded} />
                    }
                </div>
        );
    }
}

Draggable.defaultProps = {
    inTray: false,
    customClass: '',
    fixtureIndex: null,
    dispatch: () => { },
    trayIndex: null,
    dragElement: () => { },
    item: {},
    hideMessages: () => {}
};

Draggable.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    charm: PropTypes.any.isRequired,
    isClasp: PropTypes.bool.isRequired,
    customClass: PropTypes.string,
    dragElement: PropTypes.func,
    inTray: PropTypes.bool,
    fixtureIndex: PropTypes.number,
    dispatch: PropTypes.func,
    trayIndex: PropTypes.any,
    item: PropTypes.any,
    byo: PropTypes.any.isRequired,
    aem: PropTypes.any.isRequired,
    isColpo: PropTypes.bool.isRequired,
    hideMessages: PropTypes.func
};

export default DragSource('CHARM', draggableSource, collect)(Draggable);
