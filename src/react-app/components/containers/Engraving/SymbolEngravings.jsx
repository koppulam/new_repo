import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as objectPath from 'object-path';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import CustomScrollBar from 'components/common/CustomScrollBar';
import { findFirst } from 'lib/dom/dom-util';

import { updateVariant } from 'actions/EngravingActions';
import getKeyCode from 'lib/utils/KeyCodes';

// Components
import Picture from 'components/common/Picture';

import styleVariables from 'lib/utils/breakpoints';
// import './index.scss';

/**
 * @description Browse Engraving component for all Engravings
 * @class BrowseEngraving
 */
class SymbolEngravings extends React.Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.state = {
            isDropDownOpen: false,
            selectedLabel: this.props.dropdownArialabel
        };
    }

    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentDidMount = () => {
        this.props.enableFocus();
    }

    /**
    * @description On props changed life cycle event
    * @param {object} nextProps updated params
    * @returns {void}
    */
    componentWillReceiveProps(nextProps) {
        if (nextProps.variant.groupId !== this.props.variant.groupId) {
            setTimeout(() => {
                findFirst('.font-wrapper__font.symbol-engraving.selected').focus();
            });
        }
    }

    /**
     * function to set font style code
     * @param {number} styleCode style code of the font selected
     * @returns {void}
     */
    setSymbolTile = (styleCode) => {
        this.props.dispatch(updateVariant({ styleCode }));
    }

    /**
     * function to set category
     * @param {*} groupId of selected symobl type
     * @returns {void}
     */
    setSymbolType = (groupId) => {
        this.props.dispatch(updateVariant({
            groupId
        }));

        const styleGroups = objectPath.get(this.props, 'categories.0.details.styleGroups', []).filter(symbolType => symbolType.groupId === groupId)[0];

        this.setState({
            selectedLabel: styleGroups.groupDescription
        });
        this.toggleSymbolsDropDown();
    }

    /**
     * function to toggle category dropdown
     * @returns {void}
     */
    toggleSymbolsDropDown = () => {
        this.setState({
            isDropDownOpen: !this.state.isDropDownOpen
        });

        setTimeout(() => {
            if (this.state.isDropDownOpen) {
                findFirst('.engraving-symbols__body_category_label[aria-selected="true"]').focus();
            } else {
                findFirst('.engraving-symbols__body_category_title').focus();
            }
        });
    }

    /**
     * function to get key press event
     * @param {object} index of symbol category
     * @param {*} groupId of selected symobl type
     * @returns {void}
     */
    handleKeyDown = (index, groupId) => (e) => {
        const type = getKeyCode(e.keyCode, e.shiftKey);
        const styleGroups = objectPath.get(this.props, 'categories.0.details.styleGroups', []);
        const total = styleGroups ? (styleGroups.length - 1) : 0; // adjusted for zero-index
        let newIndex;

        switch (type) {
            case 'ENTER':
                this.setSymbolType(groupId);
                break;
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
            case 'ESCAPE':
                this.toggleSymbolsDropDown();
                if (findFirst('.engraving-symbols__body_category')) {
                    // focus goes out of modal even if the element is available
                    // its going to hamburger after this focus so setting time out to bring it in the modal
                    findFirst('.engraving-symbols__body_category').focus();
                }
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
     * @returns {object} html structure
     * @param {object} type of category format to render
     */
    renderSymbolTypes = (type) => {
        const { variant } = this.props;
        const styleGroups = objectPath.get(this.props, 'categories.0.details.styleGroups', []);

        if (type === 'list') {
            return (
                styleGroups.map((symbolType, index) => (
                    <li
                        key={symbolType.groupId}
                        role="option"
                        tabIndex="0"
                        className="engraving-symbols__body_category_label"
                        aria-selected={parseInt(symbolType.groupId, 10) === parseInt(variant.groupId, 10)}
                        onKeyDown={this.handleKeyDown(index, symbolType.groupId)}
                        onClick={() => this.setSymbolType(symbolType.groupId)}
                        ref={(item) => {
                            this[`item_${index}`] = item;
                        }}
                    >
                        {symbolType.groupDescription.toUpperCase()}
                    </li>
                ))
            );
        }

        return (
            styleGroups.map((symbolType, index) => (
                <option
                    key={symbolType.groupId}
                    value={symbolType.groupId}
                    selected={parseInt(symbolType.groupId, 10) === parseInt(variant.groupId, 10)}
                >
                    {symbolType.groupDescription.toUpperCase()}
                </option>
            ))
        );
    }

    /**
     * @returns {object} html structure
     */
    renderSymbolTiles = () => {
        const { variant, availableStyles } = this.props;
        const { desktopAndBelow } = styleVariables;

        return (
            availableStyles.map((tile, index) => {
                return (
                    <div className="font-wrapper--sm">
                        <div
                            className={
                                classNames('font-wrapper__font symbol-engraving tf-g tf-g__col tf-g__middle btn',
                                    {
                                        selected: parseInt(variant.styleCode, 10) === parseInt(tile.styleCode, 10)
                                    })
                            }
                            tabIndex="0"
                            onClick={() => this.setSymbolTile(tile.styleCode)}
                            onKeyPress={() => this.setSymbolTile(tile.styleCode)}
                            key={index.toString()}
                            role="radio"
                            aria-checked={parseInt(variant.styleCode, 10) === parseInt(tile.styleCode, 10)}
                            aria-label={tile.styleDescription}
                            aria-setsize={availableStyles.length}
                            aria-posinset={index + 1}
                        >
                            <Picture {...tile} customClass="font-wrapper__font-preview" />
                        </div>
                        <MediaQuery query={desktopAndBelow}>
                            <div className="font-wrapper__font_name_text--sm"> {tile.styleDescription} </div>
                        </MediaQuery>
                    </div>
                );
            })
        );
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const { authoredLabels } = this.props;
        const {
            desktopAndAbove,
            desktopAndBelow
        } = styleVariables;

        return (
            <div className="engraving-symbols tf-g tf-g__wrap">
                <div className="engraving-symbols__body col__full">
                    <h3 className="engraving-symbols__body_title">
                        {objectPath.get(authoredLabels, 'engraving.symbolsHeading', '')}
                    </h3>
                    <MediaQuery query={desktopAndAbove}>
                        <div className="engraving-symbols__body_category">
                            <button
                                type="button"
                                aria-haspopup="listbox"
                                aria-expanded={this.state.isDropDownOpen}
                                onClick={() => this.toggleSymbolsDropDown()}
                                aria-label={this.state.selectedLabel}
                                className={
                                    classNames('engraving-symbols__body_category_title',
                                        {
                                            'icon-downArrow': !this.state.isDropDownOpen,
                                            'icon-upArrow': this.state.isDropDownOpen
                                        })
                                }
                            >
                                {this.props.selectedFontStyle.groupDescription.toUpperCase()}
                            </button>
                            <input type="text" tabIndex="-1" className="engraving-symbols__input-hide hide" />
                            <ul
                                className={
                                    classNames('engraving-symbols__body_category_options ',
                                        {
                                            hide: !this.state.isDropDownOpen,
                                            show: this.state.isDropDownOpen
                                        })
                                }
                                role="listbox"
                            >
                                {this.renderSymbolTypes('list')}
                            </ul>
                        </div>
                    </MediaQuery>
                    <MediaQuery query={desktopAndBelow}>
                        <div className="engraving-symbols__body_category">
                            <select
                                className="engraving-symbols__body_category_select"
                                aria-label="Symbol Categories"
                                tabIndex="0"
                                onChange={(event) => this.setSymbolType(event.target.value)}
                            >
                                {this.renderSymbolTypes()}
                            </select>
                            <span className="icon-downArrow select-arrow" />
                        </div>
                    </MediaQuery>

                    <div className="engraving-symbols__body_section tiffany-blue-custom-scroll-bar">
                        {
                            <div
                                className="engraving-symbols__body_section_body font-wrapper grid-layout show-flex__desktop-and-below"
                                role="radiogroup"
                                aria-labelledby={`${this.props.selectedFontStyle.selectedStyleName} Styles`}
                            >
                                <MediaQuery query={desktopAndBelow}>
                                    <CustomScrollBar iosEnable>
                                        {this.renderSymbolTiles()}
                                    </CustomScrollBar>
                                </MediaQuery>
                                <MediaQuery query={desktopAndAbove}>
                                    {this.renderSymbolTiles()}
                                </MediaQuery>
                            </div>
                        }
                    </div>
                </div>

                <div className="engraving-symbols__actions tf-g col__full gutter">
                    <button type="button" className="engraving-symbols__actions_back btn btn--outline tf-g--flex-equal" onClick={() => this.props.backHandler({ component: 'HOME', startEngraving: true })}>
                        {objectPath.get(this.props.authoredLabels, 'engraving.backBtn', '')}
                    </button>

                    <button
                        type="button"
                        className="engraving-symbols__actions_next btn btn-primary tf-g--flex-equal"
                        onClick={() => this.props.backHandler({ historyConfig: this.props.screenConfig, component: 'CONFIRMATION', onConfirmationPage: true })}
                    >
                        {objectPath.get(this.props.authoredLabels, 'engraving.nextBtn', '')}
                    </button>
                </div>
            </div>
        );
    }
}

SymbolEngravings.propTypes = {
    dispatch: PropTypes.func.isRequired,
    backHandler: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    variant: PropTypes.object.isRequired,
    availableStyles: PropTypes.array.isRequired,
    selectedFontStyle: PropTypes.object.isRequired,
    authoredLabels: PropTypes.object,
    screenConfig: PropTypes.object,
    enableFocus: PropTypes.func,
    dropdownArialabel: PropTypes.string
};

SymbolEngravings.defaultProps = {
    authoredLabels: {},
    screenConfig: {},
    enableFocus: () => { },
    dropdownArialabel: 'ALL SYMBOLS'
};

const mapStateToProps = (state) => {
    return {
        authoredLabels: state.authoredLabels,
        screenConfig: objectPath.get(state, 'engraving.screenConfig', {}),
        availableStyles: objectPath.get(state, 'engraving.configurator.availableStyles', []),
        variant: objectPath.get(state, 'engraving.variant', {}),
        selectedFontStyle: objectPath.get(state, 'engraving.configurator.selectedCategory', {
            groupDescription: ''
        })
    };
};

export default connect(mapStateToProps, null, null, { withRef: true })(SymbolEngravings);
