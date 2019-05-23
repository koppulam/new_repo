
import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { contextMenu } from 'react-contexify';
import $ from 'jquery';

const droppableTarget = {
    canDrop(props, monitor) {
        const item = monitor.getItem();

        return item.fixtureIndex !== undefined;
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
        canDrop: monitor.canDrop(),
        item: monitor.getItem()
    };
}

/**
 * A Droppable element
 */
class MaxCharmMessage extends React.Component {
    /**
     * @description returns informational message
     * @returns {string} informational message
     */
    getMessage = () => {
        const {
            byo,
            aem
        } = this.props;
        let message = aem.byoConfig.noCharmsMessage.necklace.necklaceMaxcharmLimitMessage;

        if (byo.selectedFixture.isSilhouette) {
            message = aem.byoConfig.noCharmsMessage.silhoutteMaxCharmMessage;
        } else if (byo.isBracelet) {
            message = aem.byoConfig.noCharmsMessage.bracelet.braceletMaxcharmLimitMessage;
        }
        message = message.replace('{{}}', byo.selectedFixture.maxCharmsAllowed);
        return message;
    }

    /**
     * @description render method
     * @returns {HTML} html
     */
    render() {
        const {
            connectDropTarget,
            item,
            byo
        } = this.props;
        const html = $.parseHTML(this.getMessage());
        let message = '';

        if (html.length > 0) {
            message = html[0].innerText;
        }

        if (((item && item.fixtureIndex === undefined) || this.props.byo.showMaxCharmMessage) && byo.selectedFixture.maxCharmsAllowed === Object.keys(byo.charmsOnFixture).length && this.props.allowMaxCharmMessage) {
            this.props.hideInfoMessage();
            contextMenu.hideAll();
            return connectDropTarget(<div role="alert" className="charm-max-limit-message" aria-label={message} dangerouslySetInnerHTML={{ __html: this.getMessage() }} />);
        }
        return null;
    }
}

MaxCharmMessage.defaultProps = {
    item: {},
    hideInfoMessage: () => {},
    allowMaxCharmMessage: false
};

MaxCharmMessage.propTypes = {
    byo: PropTypes.any.isRequired,
    aem: PropTypes.any.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    item: PropTypes.any,
    hideInfoMessage: PropTypes.func,
    allowMaxCharmMessage: PropTypes.bool
};

const mapStateToProps = (state) => {
    return {
        byo: state.byo,
        aem: state.aem
    };
};

export default connect(mapStateToProps)(DropTarget('Message', droppableTarget, collect)(MaxCharmMessage));
