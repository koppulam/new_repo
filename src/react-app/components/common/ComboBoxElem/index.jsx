// Packages
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Object path Util
import objectPath from 'object-path';

import getKeyCode from 'lib/utils/KeyCodes';
import { findFirst } from 'lib/dom/dom-util';


/**
 * ComboBoxElem Component
 */
class ComboBoxElem extends React.Component {
    /**
     * @description On props changed life cycle event
     * @param {object} nextProps updated params
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.isOpen && nextProps.isSelected) {
            if (this[`item_${nextProps.index}`]) {
                setTimeout(() => {
                    this[`item_${nextProps.index}`].focus();
                });
            }
        }
    }

    /**
     * function to get key press event
     * @param {object} index of option
     * @returns {void}
     */
    handleKeyDown = (index) => (e) => {
        const type = getKeyCode(e.keyCode, e.shiftKey);
        const { total, prefix } = this.props;
        let newIndex;

        switch (type) {
            case 'TAB':
            case 'DOWNARROW':
                e.preventDefault();
                newIndex = (index === total - 1) ? 0 : index + 1;
                this.handleFocus(`.${prefix}${newIndex}`);
                break;
            case 'UPARROW':
            case 'BACKTAB':
                e.preventDefault();
                newIndex = (index === 0) ? total - 1 : index - 1;
                this.handleFocus(`.${prefix}${newIndex}`);
                break;
            case 'ESCAPE':
                e.preventDefault();
                this.props.closeDropDown(e);
                break;
            case 'ENTER':
                this.props.selectOptionHandler(e);
                break;
            default:
                break;
        }
    }

    /**
     * function to shift focus on next/prev on options list
     * @param {object} elem of options list
     * @returns {void}
     */
    handleFocus = (elem) => {
        setTimeout(() => {
            const nextElem = findFirst(elem);

            if (nextElem) {
                nextElem.focus();
            }
        });
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const selectedClass = {};
        const selectedLabel = objectPath.get(window, 'tiffany.labels.selectedLabel', 'Selected');
        const {
            listSelectedClass,
            isSelected,
            defaultListElemClass,
            index,
            optionListLabel,
            optionListLabelClass,
            optionListButtonClass,
            selectOptionHandler,
            prefix
        } = this.props;

        selectedClass[listSelectedClass] = isSelected;
        return (
            <li
                className={
                    listSelectedClass ? classNames(`${defaultListElemClass}`, selectedClass, `${prefix}${index}`) : `${prefix}${index}`
                }
                tabIndex={0}
                aria-label={isSelected ? `${selectedLabel}, ${optionListLabel}` : ''}
                aria-selected={isSelected}
                onClick={(e) => selectOptionHandler(e)}
                onKeyDown={this.handleKeyDown(index)}
                ref={(item) => {
                    this[`item_${index}`] = item;
                }}
                role="option"
            >
                <span
                    className={`${optionListButtonClass}`}
                >
                    <span className={optionListLabelClass}>
                        {optionListLabel}
                    </span>
                </span>
            </li>
        );
    }
}

ComboBoxElem.propTypes = {
    listSelectedClass: PropTypes.string,
    defaultListElemClass: PropTypes.string,
    index: PropTypes.number,
    selectOptionHandler: PropTypes.func.isRequired,
    closeDropDown: PropTypes.func,
    isSelected: PropTypes.bool.isRequired,
    optionListButtonClass: PropTypes.string,
    optionListLabelClass: PropTypes.string,
    optionListLabel: PropTypes.any.isRequired,
    total: PropTypes.number.isRequired,
    prefix: PropTypes.string.isRequired,
    isOpen: PropTypes.bool
};

ComboBoxElem.defaultProps = {
    listSelectedClass: '',
    defaultListElemClass: '',
    index: 0,
    optionListButtonClass: '',
    optionListLabelClass: '',
    isOpen: false,
    closeDropDown: () => {}
};

export default ComboBoxElem;
