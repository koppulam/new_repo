import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import PropTypes from 'prop-types';
import objectPath from 'object-path';
import cloneDeep from 'lodash/cloneDeep';

import styleVariables from 'lib/utils/breakpoints';
import { setDropdownWidth } from 'lib/utils/feature-detection';
import getKeyCode from 'lib/utils/KeyCodes';
import CustomScrollBar from 'components/common/CustomScrollBar';
import $ from 'jquery';
// import './index.scss';

/**
 * @description CustomDropDown component
 * @class CustomDropDown
 */
class CustomDropDown extends React.Component {
    /**
         * @description Constructor
         * @param {object} props Super Props
         * @returns {void}
         */
    constructor(props) {
        super(props);

        let selectedItem = {};

        if (this.props.defaultSelectedIndex !== -1) {
            selectedItem = this.props.options[this.props.defaultSelectedIndex];
        }

        this.state = {
            isDropDownOpen: false,
            title: this.props.title,
            selectedItem,
            selectedItemIndex: this.props.defaultSelectedIndex
        };
        this.dropDownHolder = React.createRef();
    }

    /**
     * set token.
     * @returns {void}
     */
    componentDidMount() {
        setDropdownWidth($(this.mobileCatDropdown), `custom-dropdown_body_category_select ${this.props.showDefault ? 'default' : ''}`);
        if (this.props.closeOnOutsideClick) {
            window.addEventListener('click', this.handleClickOutside);
        }
    }

    /**
     * @description component will unmount
     * @returns {void}
     */
    componentWillUnmount() {
        if (this.props.closeOnOutsideClick) {
            window.removeEventListener('click', this.handleClickOutside);
        }
    }

    /**
     * function to set category
     * @param {object} selectedIndex of selected symobl type
     * @param {boolean} isMobile to check if mobile
     * @returns {void}
     */
    setCustomType = (selectedIndex, isMobile) => {
        if (this.props.additionalOption && isMobile) {
            this.props.onselect(selectedIndex - 1);
        } else if (this.props.showtitle && isMobile) {
            if (selectedIndex && selectedIndex !== 0) {
                this.props.onselect(selectedIndex - 1);
            }
        } else {
            this.props.onselect(selectedIndex);
        }
        this.setState(
            {
                ...this.state,
                selectedItem: this.props.options[selectedIndex],
                selectedItemIndex: selectedIndex
            },
            () => {
                if (!isMobile) {
                    this.toggleCustomDropDown();
                    this.setState({ isDropDownOpen: false });
                    if (this.dropDownHolder && this.dropDownHolder.current) {
                        this.dropDownHolder.current.focus();
                    }
                }
            }
        );
    }


    /**
     * Alert if clicked on outside of element
     * @param {DocumentEvent} event clicked event
     * @returns {void}
     */
    handleClickOutside = (event) => {
        if (this.customDropWrapper && !this.customDropWrapper.contains(event.target)) {
            this.closeCustomDropDown();
        }
    }

    /**
     * function to get key press event
     * @param {object} index of symbol category
     * @returns {void}
     */
    handleKeyDown = (index) => (e) => {
        e.stopPropagation();
        const type = getKeyCode(e.keyCode, e.shiftKey);
        const { options } = this.props;
        const total = options ? (options.length - 1) : 0; // adjusted for zero-index
        let newIndex;

        switch (type) {
            case 'TAB':
            case 'DOWNARROW':
                e.preventDefault();
                newIndex = (index === total) ? 0 : index + 1;
                this.handleFocus(newIndex);
                break;
            case 'UPARROW':
            case 'BACKTAB':
                e.preventDefault();
                newIndex = (index === 0) ? total : index - 1;
                this.handleFocus(newIndex);
                break;
            case 'ENTER':
                this.setCustomType(index, false);
                break;
            case 'ESCAPE':
                e.preventDefault();
                this.setState({ isDropDownOpen: false });
                if (this.dropDownHolder && this.dropDownHolder.current) {
                    this.dropDownHolder.current.focus();
                }
                this.props.ontoggeled();
                break;
            default:
                break;
        }
    }

    /**
     * function to shift focus on category list
     * @param {object} index of symbol category
     * @returns {void}
     */
    handleFocus = (index) => {
        if (this[`item_${index}`]) {
            this[`item_${index}`].focus();
        }
    }

    /**
     * function to toggle dropdown
     * @returns {void}
     */
    closeCustomDropDown = () => {
        this.setState({
            ...this.state,
            isDropDownOpen: false
        });
    }

    /**
     * function to toggle dropdown
     * @param {object} event event
     * @returns {void}
     */
    toggleCustomDropDown = (event) => {
        if (event) {
            const type = (event.which) ? event.which : event.keyCode;

            switch (type) {
                case 13:
                    this.toggleCustomDropDownOnClick();
                    event.preventDefault();
                    break;
                case 40:
                    if (!this.state.isDropDownOpen) {
                        this.setState({
                            ...this.state,
                            isDropDownOpen: !this.state.isDropDownOpen
                        }, () => {
                            this.handleFocus(this.state.selectedItemIndex < 0 ? 0 : this.state.selectedItemIndex);
                        });
                        this.props.ontoggeled();
                    } else {
                        this.handleFocus(this.state.selectedItemIndex < 0 ? 0 : this.state.selectedItemIndex);
                    }
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * function to toggle dropdown on click
     * @returns {void}
     */
    toggleCustomDropDownOnClick() {
        this.setState({
            ...this.state,
            isDropDownOpen: !this.state.isDropDownOpen
        }, () => {
            this.handleFocus(this.state.selectedItemIndex < 0 ? 0 : this.state.selectedItemIndex);
        });
        this.props.ontoggeled();
    }

    /**
     * @returns {object} html structure
     * @param {object} type of category format to render
     * @param {bool} isMobile is mobile rendering
     */
    renderCustomTypes = (type, isMobile) => {
        const {
            options,
            keyfield,
            descriptionfield
        } = this.props;
        const mobileOptions = cloneDeep(this.props.options);

        if (this.props.showtitle && isMobile) {
            if (this.props.options.filter(item => item.value === this.props.title).length === 0) {
                this.props.options.unshift({ value: this.props.title, key: this.props.title });
                mobileOptions.unshift({ value: this.props.title, key: this.props.title });
            }
        }
        const selectedLabel = objectPath.get(window, 'tiffany.labels.selectedLabel', 'Selected');
        const htmlcallout = {
            interactionContext: this.props.interactionContext ? this.props.interactionContext : undefined,
            interactionType: this.props.interactionType ? this.props.interactionType : undefined
        };

        if (type === 'list') {
            return (
                options.map((option, index) => (
                    <li
                        key={option[keyfield]}
                        className={
                            classNames('custom-dropdown_category_list', {
                                'custom-dropdown_selected': parseInt(this.state.selectedItemIndex, 10) === index
                            })
                        }
                        tabIndex={this.state.isDropDownOpen ? 0 : -1}
                        aria-selected={parseInt(this.state.selectedItemIndex, 10) === index}
                        aria-label={parseInt(this.state.selectedItemIndex, 10) === index ? `${selectedLabel}, ${option[descriptionfield]}` : ''}
                        onKeyPress={() => this.setCustomType(index, false)}
                        onClick={() => this.setCustomType(index, false)}
                        ref={(item) => {
                            this[`item_${index}`] = item;
                        }}
                        onKeyDown={this.handleKeyDown(index)}
                        role="option"
                    >
                        <span
                            className="custom-dropdown_category_label"
                            data-interaction-context={htmlcallout.interactionContext}
                            data-interaction-type={htmlcallout.interactionType}
                            data-interaction-name={this.props.interactionType ? option[descriptionfield] : undefined}
                            key={option[keyfield]}
                        >
                            {option[descriptionfield]}
                        </span>
                    </li>
                ))
            );
        }

        const initialMobileOption = {};

        initialMobileOption[keyfield] = 'initial';
        initialMobileOption[descriptionfield] = this.state.title;

        return (
            mobileOptions.map((option, index) => (
                <option
                    key={option[keyfield]}
                    value={index}
                >
                    {option[descriptionfield]}
                </option>
            ))
        );
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            desktopAndAbove,
            desktopAndBelow
        } = styleVariables;
        const title = this.state.selectedItem[this.props.descriptionfield] ? this.state.selectedItem[this.props.descriptionfield] : this.state.title;
        const htmlcallout = {
            interactionContext: this.props.interactionContext ? this.props.interactionContext : undefined,
            interactionType: this.props.interactionType ? this.props.interactionType : undefined,
            interactionName: this.props.interactionType ? this.state.selectedItem[this.props.descriptionfield] : undefined
        };

        return (
            <div ref={el => { this.customDropWrapper = el; }}>
                <MediaQuery query={desktopAndAbove}>
                    <div
                        className="custom-dropdown"
                    >
                        <div
                            className="custom-dropdown_category_title cta hover-cta"
                            ref={this.dropDownHolder}
                            role="button"
                            tabIndex="0"
                            onClick={() => this.toggleCustomDropDownOnClick()}
                            onKeyDown={(e) => this.toggleCustomDropDown(e)}
                            aria-expanded={this.state.isDropDownOpen}
                            aria-haspopup="true"
                            data-interaction-context={htmlcallout.interactionContext}
                            data-interaction-type={htmlcallout.interactionType}
                            data-interaction-name={htmlcallout.interactionName}
                            aria-label={this.props.preholder ? `${this.props.preholder} ${title}` : title}
                        >
                            <span className={
                                classNames('custom-dropdown_category_title_text',
                                    {
                                        close: !this.state.isDropDownOpen,
                                        open: this.state.isDropDownOpen
                                    })
                            }
                            >
                                {
                                    this.state.selectedItem[this.props.descriptionfield] ? this.state.selectedItem[this.props.descriptionfield] : this.state.title
                                }
                            </span>
                            <span
                                className={
                                    classNames('icon',
                                        {
                                            'icon-dropdown-down': !this.state.isDropDownOpen,
                                            'icon-dropdown-up': this.state.isDropDownOpen
                                        })
                                }
                            />
                        </div>
                        <ul
                            className={
                                classNames('custom-dropdown_category_options',
                                    {
                                        show: this.state.isDropDownOpen,
                                        hide: !this.state.isDropDownOpen
                                    })
                            }
                            role="listbox"
                            aria-labelledby={`custom-dropdown-control-${this.props.title}`}
                            id={`custom-dropdown-control-${this.props.title}`}
                            {...(this.props.closeOnMouseLeave ? { onMouseLeave: this.toggleCustomDropDown } : {})}
                        >
                            {
                                this.props.isCustomScroll ?
                                    <CustomScrollBar>
                                        {this.renderCustomTypes('list')}
                                    </CustomScrollBar>
                                    : this.renderCustomTypes('list')
                            }

                        </ul>
                    </div>
                </MediaQuery>
                <MediaQuery query={desktopAndBelow}>
                    <div className="custom-dropdown_body_category">
                        <label htmlFor="mobileOptions">
                            <select
                                className={
                                    classNames('custom-dropdown_body_category_select', {
                                        default: this.props.showDefault
                                    })
                                }
                                id="flagshipStores"
                                aria-label={this.state.title}
                                tabIndex="0"
                                onChange={(event) => {
                                    setDropdownWidth($(event.currentTarget), `custom-dropdown_body_category_select ${this.props.showDefault ? 'default' : ''}`);
                                    this.setCustomType(event.target.value, true);
                                }}
                                onFocus={(event) => {
                                    setTimeout(() => {
                                        setDropdownWidth($(this.mobileCatDropdown), `custom-dropdown_body_category_select ${this.props.showDefault ? 'default' : ''}`);
                                    });
                                }}
                                {...this.state.selectedItemIndex && { value: this.state.selectedItemIndex }}
                                ref={el => { this.mobileCatDropdown = el; }}
                            >
                                {this.renderCustomTypes('selectlist', true, this.props.options)}
                            </select>
                            <span className="icon-dropdown-down" />
                        </label>
                    </div>
                </MediaQuery>
            </div>
        );
    }
}

CustomDropDown.defaultProps = {
    title: 'SELECT',
    options: [],
    showtitle: false,
    keyfield: 'index',
    descriptionfield: 'description',
    ontoggeled: () => { },
    defaultSelectedIndex: -1,
    interactionContext: undefined,
    interactionType: undefined,
    closeOnMouseLeave: false,
    closeOnOutsideClick: false,
    additionalOption: false,
    showDefault: true,
    preholder: '',
    isCustomScroll: true
};

CustomDropDown.propTypes = {
    title: PropTypes.string,
    options: PropTypes.array,
    showtitle: PropTypes.bool,
    keyfield: PropTypes.string,
    descriptionfield: PropTypes.string,
    onselect: PropTypes.func.isRequired,
    ontoggeled: PropTypes.func,
    defaultSelectedIndex: PropTypes.number,
    interactionContext: PropTypes.string,
    interactionType: PropTypes.string,
    closeOnMouseLeave: PropTypes.bool,
    closeOnOutsideClick: PropTypes.bool,
    additionalOption: PropTypes.bool,
    showDefault: PropTypes.bool,
    preholder: PropTypes.string,
    isCustomScroll: PropTypes.bool
};


const mapStateToProps = (state) => {
    return {
    };
};

export default connect(mapStateToProps)(CustomDropDown);
