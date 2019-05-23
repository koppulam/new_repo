
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Menu, Item, contextMenu } from 'react-contexify';
// import 'react-contexify/dist/ReactContexify.min.css';
import * as objectPath from 'object-path';
import CONSTANTS from 'constants/ContextMenuConstants';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import { findAll } from 'lib/dom/dom-util';

/**
 * ContextMenu component
 */
class CtxMenu extends React.Component {
    /**
     * @param {*} props Props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.engravingBlur = this.engravingBlur.bind(this);
        this.editBlur = this.editBlur.bind(this);
        this.closeThisMenu = this.closeThisMenu.bind(this);
    }

    /**
     * @description Triggers click on menu item
     * @param {Event} e Event Object
     * @returns {void}
     */
    removeAction = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const elements = findAll('.ctx-menu-item');
        const { hasVariation, hasEngraving } = this.props.charm;

        if (!e.shiftKey && e.keyCode === 9) {
            if (hasVariation || hasEngraving) {
                elements[2].focus();
            } else {
                elements[0].focus();
            }
        } else if (e.shiftKey && e.keyCode === 9) {
            elements[0].focus();
        }

        if (e.key === 'Enter') {
            e.target.click();
        }
    }

    /**
     * @description Triggers blur on engraving item
     * @param {Event} e Event Object
     * @returns {void}
     */
    engravingBlur = (e) => {
        const { hasVariation } = this.props.charm;
        const elements = findAll('.ctx-menu-item');

        e.preventDefault();
        e.stopPropagation();
        if (e.shiftKey && e.keyCode === 9) {
            if (hasVariation) {
                elements[2].focus();
            } else {
                elements[1].focus();
            }
        } else if (!e.shiftKey && e.keyCode === 9) {
            elements[0].focus();
        }
        if (e.key === 'Enter') {
            e.target.click();
        }
    }

    /**
     * @description Triggers blur on edit item
     * @param {Event} e Event Object
     * @returns {void}
     */
    editBlur = (e) => {
        const elements = findAll('.ctx-menu-item');

        if (e.keyCode === 9) {
            if (!this.props.charm.hasEngraving) {
                e.preventDefault();
                e.stopPropagation();
                elements[0].focus();
            }
        }
        if (e.key === 'Enter') {
            e.target.click();
        }
    }

    /**
     * @description Closes the menu on escape
     * @param {Event} e KeyCode
     * @returns {void}
     */
    closeThisMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.keyCode !== 27) {
            return;
        }
        const elements = findAll('.byo-canvas__drop-zones_zone_charm');

        let currentCharmHolder;

        for (let i = 0; i < elements.length; i += 1) {
            const element = elements[i];

            if (Number(element.getAttribute('data-fixture-index')) === Number(this.props.charm.fixtureIndex)) {
                currentCharmHolder = element;
            }
        }

        if (currentCharmHolder) {
            contextMenu.hideAll();
            currentCharmHolder.focus();
        }
    }

    /**
     * @description Triggers blur on Move item
     * @param {Event} e Event Object
     * @returns {void}
     */
    moveBlur = (e) => {
        const elements = findAll('.ctx-menu-item');

        e.preventDefault();
        e.stopPropagation();
        if (e.shiftKey && e.keyCode === 9) {
            elements[elements.length - 1].focus();
        } else if (!e.shiftKey && e.keyCode === 9) {
            elements[1].focus();
        }
        if (e.key === 'Enter') {
            e.target.click();
        }
    }

    /**
     * @description render method
     * @returns {HTML} html
     */
    render() {
        const { hasEngraving, hasVariation, groupSku } = this.props.charm;
        const { aem } = this.props;
        const htmlCallout = {
            interactionContext: '',
            interactionType: AnalyticsConstants.CHARM,
            interactionNameEdit: AnalyticsConstants.EDIT
        };
        const menuProps = {
            tabIndex: '0',
            onKeyUp: this.closeThisMenu,
            className: 'ctx-menu-item'
        };

        const moveProps = {
            onKeyDown: this.moveBlur,
            'aria-label': objectPath.get(aem, 'byoConfig.ctxMenu.move', 'Move')
        };

        const removeProps = {
            onKeyDown: this.removeAction,
            'aria-label': objectPath.get(aem, 'byoConfig.ctxMenu.remove', 'Remove')
        };

        const editProps = {
            onKeyDown: this.editBlur,
            'aria-label': objectPath.get(aem, 'byoConfig.ctxMenu.edit', 'Edit')
        };

        const personalizeProps = {
            onKeyDown: this.engravingBlur,
            'aria-label': objectPath.get(aem, 'byoConfig.ctxMenu.personalize', 'Personalize')
        };

        return (
            <Menu id={`${this.props.charm.fixtureIndex}`}>
                {this.props.byo.selectedFixture.fixturePositions && this.props.byo.selectedFixture.fixturePositions.length !== 1 &&
                    <Item
                        onClick={({ event, props }) => {
                            this.props.action(CONSTANTS.ACTIONS.MOVE, props.fixtureIndex);
                        }}
                    >
                        <div
                            {...menuProps}
                            {...moveProps}
                        >
                            {objectPath.get(aem, 'byoConfig.ctxMenu.move', 'Move')}
                        </div>
                    </Item>
                }
                <Item
                    onClick={({ event, props }) => {
                        this.props.action(CONSTANTS.ACTIONS.REMOVE, props.fixtureIndex);
                    }}
                >
                    <div
                        {...menuProps}
                        {...removeProps}
                    >
                        {objectPath.get(aem, 'byoConfig.ctxMenu.remove', 'Remove')}
                    </div>
                </Item>
                {(hasVariation || groupSku) &&
                    <Item onClick={({ event, props }) => {
                        this.props.action(CONSTANTS.ACTIONS.EDIT, props.fixtureIndex);
                    }}
                    >
                        <div
                            {...menuProps}
                            {...editProps}
                            data-interaction-context={htmlCallout.interactionContext}
                            data-interaction-type={htmlCallout.interactionType}
                            data-interaction-name={htmlCallout.interactionNameEdit}
                        >
                            {objectPath.get(aem, 'byoConfig.ctxMenu.edit', 'Edit')}
                        </div>
                    </Item>}
                {hasEngraving &&
                    <Item
                        onClick={({ event, props }) => {
                            this.props.action(CONSTANTS.ACTIONS.PERSONALIZE, props.fixtureIndex);
                        }}
                    >
                        <div
                            {...menuProps}
                            {...personalizeProps}
                            data-interaction-context={htmlCallout.interactionContext}
                            data-interaction-type={htmlCallout.interactionType}
                            data-interaction-name={AnalyticsConstants.PERSONALIZE}
                        >
                            {objectPath.get(aem, 'byoConfig.ctxMenu.personalize', 'Personalize')}
                        </div>
                        <div tabIndex="0" role="button" />
                    </Item>
                }
            </Menu>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        byo: state.byo,
        labels: state.authoredLabels,
        aem: state.aem
    };
};


CtxMenu.propTypes = {
    sku: PropTypes.any.isRequired,
    charm: PropTypes.any.isRequired,
    aem: PropTypes.any.isRequired,
    action: PropTypes.func.isRequired,
    byo: PropTypes.object.isRequired,
    fixtureIndex: PropTypes.any.isRequired
};

export default connect(mapStateToProps)(CtxMenu);
