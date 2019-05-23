// Packages
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import $ from 'jquery';

import CustomDropDown from 'components/common/CustomDropDown';
import styleVariables from 'lib/utils/breakpoints';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import { scrollTo } from 'lib/utils/scroll-to-content';

import * as objectPath from 'object-path';

import TiffanyModal from 'components/common/TiffanyModal';

// import './index.scss';

/**
 * Shop By Slider Component
 */
class ShopBySlider extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        const config = this.props.aem[this.props.config];
        const { content } = config;
        let currentSubClassificationIndex = 0;
        let currentSubClassificationObject = {};

        content[0].subClassification.forEach((subClassification, subClassificationIndex) => {
            if (subClassification.isDefault) {
                currentSubClassificationIndex = subClassificationIndex;
                currentSubClassificationObject = JSON.parse(JSON.stringify(subClassification));
            }
        });

        if (!currentSubClassificationObject.subHeading) {
            currentSubClassificationObject = objectPath.get(content, '0.subClassification.0');
        }
        this.state = {
            config,
            content,
            currentClassification: 0,
            currentSubClassificationIndex,
            currentSubClassificationObject,
            highlightedSubClassificationIndex: 0,
            showMobileMenu: false
        };
        this.relativeClass = 'current';
        this.sliderRef = React.createRef();
    }

    /**
     * Onresize update the slick arrow styles.
     * @returns {void}
     */
    componentDidMount() {
        const stickyElements = ['.stick.header__nav-container', '.sticky-nav.app-js__sticky-nav'];
        let stickyElementsHeight = 0;

        stickyElements.forEach((selector, index) => {
            // outer height is used only to take margin also into consideration if any
            stickyElementsHeight += $(selector).outerHeight();
        });
        this.sliderRef.current.style.top = `${stickyElementsHeight}px`;
    }

    /**
     * Region Changed.
     * @param {number} selectedIndex selectedIndex
     * @returns {void}
    */
    regionChanged = (selectedIndex) => {
        let currentSubClassificationIndex = 0;
        let currentSubClassificationObject = JSON.parse(JSON.stringify(this.state.content[selectedIndex].subClassification[0]));

        this.state.content[selectedIndex].subClassification.forEach((subClassification, subClassificationIndex) => {
            if (subClassification.isDefault) {
                currentSubClassificationIndex = subClassificationIndex;
                currentSubClassificationObject = JSON.parse(JSON.stringify(subClassification));
            }
        });

        this.setState({
            ...this.state,
            currentSubClassificationIndex,
            currentSubClassificationObject,
            currentClassification: selectedIndex,
            showMobileMenu: false
        });
        this.props.classificationSelected(selectedIndex);
    }

    /**
     * Subclassification Selected
     * @param {number} subClassificationIndex subClassificationIndex
     * @returns {void}
    */
    subClassificationSelected = (subClassificationIndex) => {
        const currentSubClassificationObject = this.state.content[this.state.currentClassification].subClassification[subClassificationIndex];

        this.setState({
            ...this.state,
            currentSubClassificationIndex: subClassificationIndex,
            currentSubClassificationObject,
            showMobileMenu: false
        }, () => {
            this.restoreScrollPosition();
        });
        this.props.subClassificationSelected(this.state.currentClassification, subClassificationIndex);
    }

    /**
     * Subclassification highlight in mobile
     * @param {number} subClassificationIndex subClassificationIndex
     * @param {number} currentClassification currentClassification
     * @returns {void}
    */
    subClassificationHighlighted = (subClassificationIndex, currentClassification) => {
        this.setState({
            ...this.state,
            highlightedSubClassificationIndex: subClassificationIndex,
            currentClassification
        });
    }

    /**
     * Complet selection of subclassification in mobile
     * @param {number} subClassificationIndex subClassificationIndex
     * @returns {void}
    */
    selectSubClassification = () => {
        this.subClassificationSelected(this.state.highlightedSubClassificationIndex);
    }

    /**
     * Open slider in mobile
     * @returns {void}
    */
    openSlider = () => {
        const scrollTop = window.pageYOffset;

        this.setState({
            ...this.state,
            showMobileMenu: true,
            currentScrollPosition: scrollTop
        });
    }

    /**
     * Close menu
     * @returns {void}
    */
    closeMenu = () => {
        this.setState({
            ...this.state,
            showMobileMenu: false
        }, () => {
            this.restoreScrollPosition();
        });
    }

    /**
     * Toggle list
     * @param {number} index index
     * @returns {void}
    */
    toggleList(index) {
        const { content } = this.state;

        content[index].isOpen = !content[index].isOpen;
        this.setState({
            ...this.state,
            content
        });
    }

    /**
     * Restore scroll position on modal close
     * @returns {void}
    */
    restoreScrollPosition() {
        if (this.state.currentScrollPosition) {
            scrollTo('body', this.state.currentScrollPosition);
            this.setState({
                ...this.state,
                currentScrollPosition: 0
            });
        }
    }

    /**
       * Render Component.
       * @returns {object} html instance
       */
    render() {
        const modalOptions = {
            overlay: false,
            className: 'full-screen preview pdp-image-preview',
            closeClass: 'close-modal',
            blockMobileScrollability: true,
            blockDesktopScrollability: true
        };
        const htmlcallout = {
            interactionContext: AnalyticsConstants.GIFTING,
            interactionType: AnalyticsConstants.SHOP_BY_FILTER
        };

        return (
            <article className="shop-by-slider container" ref={this.sliderRef}>
                <MediaQuery query={styleVariables.desktopAndAbove}>
                    <div className="shop-by-slider__filter-bar">
                        <h2 className="shop-by-slider__filter-bar-label">
                            {`${this.state.config.shopBy} ${this.state.config.content.length === 1 ? this.state.config.content[0].heading : ''}`}
                        </h2>
                        {
                            this.state.config.content.length > 1
                            &&
                            <CustomDropDown
                                title={this.state.config.chooseRegionText}
                                options={this.state.config.content}
                                descriptionfield="heading"
                                onselect={this.regionChanged}
                                ontoggeled={this.onDropDowntoggeled}
                                defaultSelectedIndex={0}
                                interactionContext={AnalyticsConstants.GIFTING}
                                interactionType={AnalyticsConstants.SHOP_BY_FILTER}
                                preholder={this.state.config.shopBy}
                                isCustomScroll={false}
                            />
                        }
                    </div>
                    <div className="shop-by-slider__subclasification_nav">
                        {
                            this.state.content.map((item, index) => {
                                return (
                                    (index === this.state.currentClassification) ?
                                        <div>
                                            <ul>
                                                {
                                                    item.subClassification.map((subItem, i) => {
                                                        const isSelected = i === this.state.currentSubClassificationIndex;

                                                        return (
                                                            <li
                                                                key={i.toString()}
                                                                className={
                                                                    classNames(
                                                                        'shop-by-slider__subclasification_nav-items'
                                                                    )
                                                                }
                                                            >
                                                                <button
                                                                    type="button"
                                                                    className={
                                                                        classNames(
                                                                            'cta',
                                                                            'shop-by-slider__subclasification_nav-items-btn',
                                                                            {
                                                                                'current-item': i === this.state.currentSubClassificationIndex
                                                                            }
                                                                        )
                                                                    }
                                                                    onClick={(e) => this.subClassificationSelected(i)}
                                                                    data-id={subItem.subHeading}
                                                                    aria-label={subItem.subHeading}
                                                                    aria-pressed={isSelected}
                                                                    data-interaction-context={htmlcallout.interactionContext}
                                                                    data-interaction-type={htmlcallout.interactionType}
                                                                    data-interaction-name={`${item.groupDataInteractionName}:${subItem.subClassificationInteractionName}`}
                                                                >
                                                                    {subItem.subHeading}
                                                                </button>
                                                            </li>
                                                        );
                                                    })
                                                }
                                            </ul>
                                        </div> : null
                                );
                            })
                        }
                    </div>
                </MediaQuery>

                <MediaQuery query={styleVariables.tabletAndBelow}>
                    <h2 className="shop-by-slider__filter-bar-label">
                        {this.state.config.shopBy}
                        <div className="shop-by-slider__filter-bar-label-wrapper">
                            <button
                                type="button"
                                className="shop-by-slider__filter-bar-label-btn"
                                onClick={this.openSlider}
                            >
                                <span className="shop-by-slider__filter-bar-label-btn-content">{this.state.currentSubClassificationObject.subHeading}</span>
                                <span className="icon-dropdown-down" />
                            </button>
                        </div>
                    </h2>
                    <TiffanyModal
                        visible={this.state.showMobileMenu}
                        options={modalOptions}
                    >
                        <div
                            className={
                                classNames('shop-by-slider__select')
                            }
                        >
                            <span
                                role="button"
                                tabIndex={0}
                                className="shop-by-slider__close icon-Close"
                                onClick={this.closeMenu}
                                onKeyPress={this.closeMenu}
                            />
                            <div className="shop-by-slider__fulllist">
                                {
                                    this.state.content.map((item, index) => {
                                        return (
                                            <div>
                                                <button
                                                    type="button"
                                                    className={
                                                        classNames('shop-by-slider__fulllist-heading',
                                                            {
                                                                'shop-by-slider__fulllist-heading-closed': !item.isOpen
                                                            })
                                                    }
                                                    onClick={(e) => this.toggleList(index)}
                                                    aria-expanded={item.isOpen}
                                                    tabIndex={0}
                                                >
                                                    <span className="shop-by-slider__fulllist-content" tabIndex={-1}>
                                                        {item.heading}
                                                    </span>
                                                    <span
                                                        className={
                                                            classNames('shop-by-slider__fulllist-icon',
                                                                {
                                                                    'icon-Up': item.isOpen,
                                                                    'icon-Down': !item.isOpen
                                                                })
                                                        }
                                                    />
                                                </button>
                                                {
                                                    !item.isOpen &&
                                                    <ul
                                                        className="shop-by-slider__fulllist-list"
                                                    >
                                                        {
                                                            item.subClassification.map((subItem, i) => {
                                                                const isSelected = (i === this.state.highlightedSubClassificationIndex && index === this.state.currentClassification);

                                                                return (
                                                                    <li
                                                                        className={
                                                                            classNames('shop-by-slider__submenu',
                                                                                {
                                                                                    'shop-by-slider__submenu-active': (i === this.state.highlightedSubClassificationIndex && index === this.state.currentClassification)
                                                                                })
                                                                        }
                                                                    >
                                                                        <button
                                                                            type="button"
                                                                            className="shop-by-slider__submenu-btn"
                                                                            onClick={(e) => this.subClassificationHighlighted(i, index)}
                                                                            aria-label={subItem.subHeading}
                                                                            aria-pressed={isSelected}
                                                                        >
                                                                            {subItem.subHeading}
                                                                        </button>
                                                                    </li>
                                                                );
                                                            })
                                                        }
                                                    </ul>
                                                }
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            <div className="shop-by-slider__done">
                                <button
                                    type="button"
                                    className="shop-by-slider__done_btn"
                                    onClick={(e) => this.selectSubClassification()}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </TiffanyModal>
                </MediaQuery>
            </article>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem
    };
};

ShopBySlider.defaultProps = {
    subClassificationSelected: () => { },
    classificationSelected: () => { }
};

ShopBySlider.propTypes = {
    config: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired,
    subClassificationSelected: PropTypes.func,
    classificationSelected: PropTypes.func
};

export default connect(mapStateToProps)(ShopBySlider);
