import React from 'react';
import PropTypes from 'prop-types';
import DragLayer from 'react-dnd/lib/DragLayer';
import Picture from 'components/common/Picture';
import { findFirst } from 'lib/dom/dom-util';

/**
 * @description test
 * @param {*} monitor monitor
 * @returns {*} object
 */
function collect(monitor) {
    const item = monitor.getItem();

    return {
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
        item: item && item.charm,
        isValid: item && item.isValid()
    };
}

/**
 * @description return styles from current offset
 * @param {*} currentOffset currentOffset
 * @param {*} width width of the previewlayer
 * @returns {*} object
 */
function getItemStyles(currentOffset, width) {
    if (!currentOffset) {
        return {
            display: 'none'
        };
    }
    const trayContainer = findFirst('.tray-container');
    const trayOffset = trayContainer ? trayContainer.getBoundingClientRect() : null;

    if (trayOffset && currentOffset.y > trayOffset.y && currentOffset.y < trayOffset.y + trayOffset.height) {
        return {
            display: 'none'
        };
    }
    const {
        x,
        y
    } = currentOffset;

    return {
        pointerEvents: 'none',
        left: `${x}px`,
        top: `${y}px`,
        position: 'fixed',
        width: `${width}px`,
        zIndex: '16'
    };
}

/**
 * @class Preview
 * @description custom drag preview
 */
class Preview extends React.Component {
    /**
     * @description render method
     * @returns {HTML} html
     */
    render() {
        const {
            item,
            isDragging,
            currentOffset,
            width,
            isColpo,
            isValid
        } = this.props;

        if (isValid === false) {
            this.props.charmErrorMessage(false);
        } else {
            this.props.charmErrorMessage(true);
        }
        if (!isDragging) {
            return null;
        }

        return (
            <div
                style={getItemStyles(currentOffset, width)}
            >
                <Picture altText="charm" defaultSrc={isColpo ? item.colpoTransparentURL : item.transparentURL} isLazyLoad={false} />
            </div>
        );
    }
}

Preview.defaultProps = {
    item: null,
    currentOffset: PropTypes.shape({
        x: 0,
        y: 0
    }),
    isDragging: false,
    isValid: false,
    charmErrorMessage: () => {}
};

Preview.propTypes = {
    item: PropTypes.any,
    currentOffset: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    }),
    isDragging: PropTypes.bool,
    width: PropTypes.number.isRequired,
    isColpo: PropTypes.bool.isRequired,
    isValid: PropTypes.bool,
    charmErrorMessage: PropTypes.func
};

export default DragLayer(collect)(Preview);
