// Packages
import React from 'react';
import { connect, Provider } from 'react-redux';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {
    addClass,
    hasClass,
    removeClass,
    findFirst,
    findAll
} from 'lib/dom/dom-util';
import ErrorBoundary from 'components/common/ErrorBoundary';
import { disableBodyScroll, enableBodyScroll } from 'lib/no-scroll';
import matchMedia from 'lib/dom/match-media';
import store from 'react-app/store';
import classNames from 'classnames';
import objectPath from 'object-path';
import styleVariables from 'lib/utils/breakpoints';
import { CSSTransition } from 'react-transition-group';

// import './index.scss';

const scopeFocus = require('lib/dom/scope-focus');

/**
 * Tiffany Inline Modal component
 */
class TiffanyInlineModal extends React.Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.relativeClass = this.props.containerClass ? this.props.containerClass.split(' ').join('-') : 'relative-holder';
        this.zIndexStep = 1;
        this.childUpdated = false;
    }

    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentDidMount() {
        const { holder } = this.props;

        this.container = findFirst(holder ? `.${holder}` : 'body') || findFirst('body');
        if (this.props.enablePopState) {
            window.addEventListener('popstate', this.close.bind(this));
        }
    }

    /**
    * @description On props changed life cycle event
    * @param {object} nextProps updated params
    * @returns {void}
    */
    componentWillReceiveProps(nextProps) {
        const {
            showModal,
            children,
            closeInit,
            inlineStyles,
            trasitionInlineStyles
        } = this.props;

        if (nextProps.showModal !== showModal) {
            if (nextProps.showModal) {
                if (this.holder) {
                    this.renderModal(nextProps.children);
                } else {
                    this.open(nextProps);
                }
            } else {
                this.close();
            }
        } else if (nextProps.showModal && this.holder && nextProps.children !== children) {
            this.renderModal(nextProps.children);
        }

        if (nextProps.closeInit !== closeInit && nextProps.closeInit) {
            this.close();
        }
        // if inline styles are updated from parent && modal is already open
        if (nextProps.inlineStyles !== inlineStyles && nextProps.showModal === showModal && showModal) {
            const wrapperElement = findFirst(`[inline-modal="${this.numberOfInlineModals}"]`);

            Object.keys(nextProps.inlineStyles).forEach(key => {
                wrapperElement.style[key] = nextProps.inlineStyles[key];
            });
        }

        // if inline styles are updated from parent && modal is already open
        if (nextProps.trasitionInlineStyles !== trasitionInlineStyles && nextProps.showModal === showModal && showModal) {
            const wrapperElement = findFirst(`[inline-modal="${this.numberOfInlineModals}"]`);
            const transitionWrapper = findFirst('.modal-transition', wrapperElement);

            Object.keys(nextProps.trasitionInlineStyles).forEach(key => {
                transitionWrapper.style[key] = nextProps.trasitionInlineStyles[key];
            });
        }
    }

    /**
     * @description method to open the inline modal
     * @returns {void}
     */
    open = () => {
        const { isFIIS } = this.props;

        if (!hasClass(this.container, this.relativeClass) && isFIIS) {
            this.openInlineModal();
        } else if (!isFIIS) {
            this.openInlineModal();
        }
    }


    /**
     * @description method to open the inline modal
     * @param {object} props props
     * @returns {void}
     */
    openInlineModal = (props = this.props) => {
        const {
            customClass,
            blockScrollInMobile,
            blockScrollInDesktop,
            focusElement,
            firstElement,
            childComponentInit
        } = this.props;

        addClass(this.container, this.relativeClass);
        this.numberOfInlineModals = findAll('.tiffany-inline-modal', this.charmsContainer).length;
        const wrapperElement = document.createElement('div');
        const isMobile = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;
        const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;
        const metaTag = findFirst('meta[name="viewport"]');

        wrapperElement.className = `tiffany-inline-modal ${customClass}`;
        wrapperElement.setAttribute('inline-modal', this.numberOfInlineModals);
        wrapperElement.setAttribute('role', 'dialog');
        wrapperElement.setAttribute('aria-modal', 'true');
        wrapperElement.style.zIndex = parseInt(styleVariables.inlineModalIndex, 10) + (this.zIndexStep * this.numberOfInlineModals);
        wrapperElement.tabIndex = "0";
        metaTag.content = `${metaTag.content}, user-scalable=no`;
        this.container.appendChild(wrapperElement);

        if ((isMobile && blockScrollInMobile) || (isDesktop && blockScrollInDesktop)) {
            addClass(findFirst('html'), 'has-modal-opened');
            disableBodyScroll(customClass || 'tiffany-inline-modal');
        }
        // creating reference
        this.holder = findFirst(`[inline-modal="${this.numberOfInlineModals}"]`);

        this.renderModal(props.children, () => {
            if (focusElement) {
                this.firstElement = firstElement ? findFirst(firstElement, this.holder) : null;

                // If we have a primary focusable element then focus it else focus the dialog box
                if (this.firstElement === null) {
                    this.holder.focus();
                } else {
                    this.firstElement.focus();
                }
            }
            childComponentInit();
            if (this.props.setScopeFocus) {
                scopeFocus.setScopeLimit(this.holder);
            }
        });
    }

    /**
     * @description tab focus
     * @returns {void}
     */
    adjustFocusInModal = () => {
        if (!this.childUpdated) {
            if (this.props.setScopeFocus) {
                scopeFocus.dispose();
                scopeFocus.setScopeLimit(this.holder);
            }
            this.childUpdated = true;
        }
    }

    /**
     * @description method to close the inline modal
     * @param {Event} e Event
     * @returns {void}
     */
    close = (e) => {
        if (this.props.enablePopState) {
            window.removeEventListener('popstate', this.close.bind(this));
        }
        if (this.holder) {
            this.props.beforeClose();
            this.renderModal(null, () => {
                if (this.container && this.holder instanceof Node) {
                    this.container.removeChild(this.holder);
                    if (this.buttonHolder) {
                        this.buttonHolder = null;
                    }
                }
                this.holder = null;
                this.props.resetInitiator();
            });
        } else {
            this.holder = null;
        }
        const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;

        if (this.props.triggerElement && isDesktop) {
            this.props.triggerElement.focus();
        }

        enableBodyScroll(this.props.customClass || 'tiffany-inline-modal');
        // only if closing modal is last inline modal inside the container then remove the relative class
        if ((this.numberOfInlineModals === 0 || this.props.isFIIS) && hasClass(this.container, this.relativeClass)) {
            removeClass(this.container, this.relativeClass);
        }
        if (this.props.setScopeFocus) {
            scopeFocus.dispose();
        }
        this.childUpdated = false;
    }

    /**
     * @description renders modal
     * @param {object} children inner children
     * @param {Function} cb callback function to be called after rendering
     * @returns {void}
     */
    renderModal = (children, cb = () => { }) => {
        if (!children) {
            ReactDOM.render(
                <Provider store={store}>
                    <ErrorBoundary>
                        <CSSTransition
                            in={false}
                            timeout={this.props.transitionProps.timeout}
                            classNames={this.props.transitionProps.classNames}
                            mountOnEnter
                            unmountOnExit
                        >
                            <div className="modal-transition" tabIndex="-1">
                                {this.props.children}
                                <button
                                    type="button"
                                    className={
                                        classNames('tiffany-inline-modal--close',
                                            {
                                                hide__tablet: this.props.showLeftArrow
                                            })
                                    }
                                    aria-label={this.props.closeAriaLabel}
                                    onClick={this.close}
                                >
                                    <img src={this.props.closeSrc} alt={this.props.closeAltText} />
                                </button>

                                {
                                    this.props.showLeftArrow &&
                                    <button
                                        type="button"
                                        className="tiffany-inline-modal--left-arrow icon icon-Left"
                                        aria-label={this.props.leftArrowAriaLabel}
                                        onClick={this.close}
                                    />
                                }
                            </div>
                        </CSSTransition>
                    </ErrorBoundary>
                </Provider>, this.holder,
                () => {
                    removeClass(findFirst('html'), 'has-modal-opened');
                    const metaTag = findFirst('meta[name="viewport"]');

                    metaTag.content = metaTag.content.split(', ').filter(value => value !== 'user-scalable=no').join(', ');
                    if (this.props.transitionProps.timeout) {
                        setTimeout(() => {
                            ReactDOM.unmountComponentAtNode(this.container);
                            cb();
                        }, this.props.transitionProps.timeout);
                        return;
                    }
                    cb();
                }
            );
            return;
        }

        ReactDOM.render(
            <Provider store={store}>
                <ErrorBoundary>
                    <CSSTransition
                        in={false}
                        timeout={this.props.transitionProps.timeout}
                        classNames={this.props.transitionProps.classNames}
                        mountOnEnter
                        unmountOnExit
                    >
                        <div className="modal-transition" tabIndex="-1">
                            {children}
                            <button
                                type="button"
                                className={
                                    classNames('tiffany-inline-modal--close',
                                        {
                                            hide__tablet: this.props.showLeftArrow
                                        })
                                }
                                aria-label={this.props.closeAriaLabel}
                                onClick={this.close}
                            >
                                <img src={this.props.closeSrc} alt={this.props.closeAltText} />
                            </button>

                            {
                                this.props.showLeftArrow &&
                                <button
                                    type="button"
                                    className="tiffany-inline-modal--left-arrow icon icon-Left"
                                    aria-label={this.props.leftArrowAriaLabel}
                                    onClick={this.close}
                                />
                            }
                        </div>
                    </CSSTransition>
                </ErrorBoundary>
            </Provider>, this.holder,
            () => {
                ReactDOM.render(
                    <Provider store={store}>
                        <ErrorBoundary>
                            <CSSTransition
                                onEntered={this.adjustFocusInModal}
                                in
                                timeout={this.props.transitionProps.timeout}
                                classNames={this.props.transitionProps.classNames}
                                mountOnEnter
                                unmountOnExit
                            >
                                <div className="modal-transition" tabIndex="-1">
                                    {children}
                                    {!this.props.hideClose &&
                                        <button
                                            type="button"
                                            className={
                                                classNames('tiffany-inline-modal--close',
                                                    {
                                                        hide__tablet: this.props.showLeftArrow
                                                    })
                                            }
                                            aria-label={this.props.closeAriaLabel}
                                            onClick={this.close}
                                        >
                                            <img src={this.props.closeSrc} alt={this.props.closeAltText} />
                                        </button>
                                    }
                                    {
                                        this.props.showLeftArrow &&
                                        <button
                                            type="button"
                                            className="tiffany-inline-modal--left-arrow icon icon-Left"
                                            aria-label={this.props.leftArrowAriaLabel}
                                            onClick={this.close}
                                        />
                                    }
                                </div>
                            </CSSTransition>
                        </ErrorBoundary>
                    </Provider>, this.holder, () => {
                        if (!this.buttonHolder && this.holder) {
                            const btn = document.createElement('button');

                            btn.setAttribute('class', 'button-hidden');
                            btn.setAttribute('aria-hidden', 'true');
                            this.buttonHolder = btn;
                            this.holder.appendChild(btn);
                        }
                    }
                );
                cb();
            }
        );
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        return null;
    }
}

TiffanyInlineModal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    holder: PropTypes.string,
    containerClass: PropTypes.string,
    customClass: PropTypes.string,
    children: PropTypes.object.isRequired,
    resetInitiator: PropTypes.func,
    transitionProps: PropTypes.shape({
        timeout: PropTypes.number,
        classNames: PropTypes.shape({
            enter: PropTypes.string,
            enterActive: PropTypes.string,
            enterDone: PropTypes.string,
            exit: PropTypes.string,
            exitActive: PropTypes.string,
            exitDone: PropTypes.string
        })
    }),
    beforeClose: PropTypes.func,
    childComponentInit: PropTypes.func,
    firstElement: PropTypes.string,
    triggerElement: PropTypes.object,
    closeAriaLabel: PropTypes.string,
    leftArrowAriaLabel: PropTypes.string,
    showLeftArrow: PropTypes.bool,
    focusElement: PropTypes.bool,
    blockScrollInDesktop: PropTypes.bool,
    blockScrollInMobile: PropTypes.bool,
    closeSrc: PropTypes.string.isRequired,
    closeAltText: PropTypes.string.isRequired,
    isFIIS: PropTypes.bool,
    inlineStyles: PropTypes.object,
    trasitionInlineStyles: PropTypes.object,
    hideClose: PropTypes.bool,
    closeInit: PropTypes.bool,
    enablePopState: PropTypes.bool,
    setScopeFocus: PropTypes.bool
};

TiffanyInlineModal.defaultProps = {
    containerClass: '',
    customClass: '',
    holder: '',
    transitionProps: {
        timeout: 0,
        classNames: {
            enter: 'enter',
            enterActive: 'enterActive',
            enterDone: 'enterDone',
            exit: 'exit',
            exitActive: 'exitActive',
            exitDone: 'exitDone'
        }
    },
    beforeClose: () => { },
    childComponentInit: () => { },
    firstElement: '',
    triggerElement: null,
    closeAriaLabel: 'Close button Icon',
    leftArrowAriaLabel: 'Left arrow Icon',
    showLeftArrow: false,
    resetInitiator: () => { },
    focusElement: true,
    isFIIS: false,
    inlineStyles: {},
    blockScrollInDesktop: false,
    blockScrollInMobile: true,
    hideClose: false,
    closeInit: false,
    trasitionInlineStyles: {},
    enablePopState: false,
    setScopeFocus: true
};

const mapStateToProps = (state, ownProps) => {
    return {
        closeSrc: objectPath.get(state, 'aem.icons.close.src', ''),
        closeAltText: objectPath.get(state, 'aem.icons.close.altText', '')
    };
};

export default connect(mapStateToProps)(TiffanyInlineModal);
