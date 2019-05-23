// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import objectPath from 'object-path';
import CustomScrollBar from 'components/common/CustomScrollBar';

import {
    findFirst,
    addClass,
    removeClass,
    closest
} from 'lib/dom/dom-util';
import matchMedia from 'lib/dom/match-media';
import scopeFocus from 'lib/dom/scope-focus';
import getKeyCode from 'lib/utils/KeyCodes';
import { disableBodyScroll, enableBodyScroll } from 'lib/no-scroll';
import { restrictUserScalability, releaseUserScalability } from 'lib/utils/meta-tag';
import updateSelectedFlyoutModal from 'actions/ConciergeActions';

// import './index.scss';

// components
import ConciergeCta from './ConciergeCta.jsx';
import InitialContent from './InitialContent.jsx';
import EmailContent from './EmailContent.jsx';

/**
 * Concierge Flyout Component
 */
class ConciergeFlyout extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.flyoutContainer = React.createRef();
        this.flyoutBackdrop = React.createRef();
        this.handleScroll = this.handleScroll.bind(this, this.flyoutContainer, this.flyoutBackdrop);
        window.addEventListener('click', this.windowClickHandler);
    }

    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentDidMount() {
        const showContactCta = objectPath.get(this.props.authoredContent, 'conciergeFlyoutConfig.showContactCta', false);

        if (showContactCta) {
            addClass(findFirst('.back-to-top'), 'back-btn-bottom-gutter');
        }

        const globalBannerEle = findFirst('.global-banner');

        if (globalBannerEle) {
            window.addEventListener('mouseover', this.handleScroll);
            window.addEventListener('scroll', this.handleScroll);
        }

        setTimeout(() => {
            this.handleScroll(this.flyoutContainer);
        }, 1000);
    }

    /**
    * @description On props changed life cycle event
    * @param {object} newProps updated params
    * @returns {void}
    */
    componentWillReceiveProps = (newProps) => {
        if (this.props.showFlyout !== newProps.showFlyout) {
            const headerEle = document.getElementsByTagName('header')[0];
            const mainEle = document.getElementsByTagName('main')[0];
            const footerEle = document.getElementsByTagName('footer')[0];

            if (newProps.showFlyout && this.flyoutContainer && this.flyoutContainer.current) {
                if (headerEle) {
                    headerEle.setAttribute('aria-hidden', 'true');
                }
                if (mainEle) {
                    mainEle.setAttribute('aria-hidden', 'true');
                }
                if (footerEle) {
                    footerEle.setAttribute('aria-hidden', 'true');
                }
                scopeFocus.setScopeLimit(this.flyoutContainer.current);
            } else {
                if (headerEle) {
                    headerEle.removeAttribute('aria-hidden');
                }
                if (mainEle) {
                    mainEle.removeAttribute('aria-hidden');
                }
                if (footerEle) {
                    footerEle.removeAttribute('aria-hidden');
                }
                scopeFocus.dispose();
            }
        }
    }

    /**
     * @description component will unmount
     * @returns {void}
     */
    componentWillUnmount() {
        scopeFocus.dispose();
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('click', this.windowClickHandler);
    }

    /**
     * @param {e} e click event
     * @returns {void}
     */
    windowClickHandler = (e) => {
        const showConciergeFlyout = this.props.showFlyout;

        if (showConciergeFlyout) {
            const closestElem = closest(e.target, 'header');

            if (closestElem) {
                this.toggleConciergeFlyout();
            }
        }
    }

    /**
     * @description update the flyout selected state
     * @param {string} selectedState  Selcted flyout
     * @returns {void}
     */
    updateSelectedFlyoutModal = (selectedState) => {
        this.props.dispatch(updateSelectedFlyoutModal(selectedState));
    }

    /**
     * @param {object} e html event
     * @returns {void}
     */
    toggleConciergeFlyout = (e) => {
        if (e && e.type === 'keypress') {
            e.preventDefault();
        }
        const showConciergeFlyout = this.props.showFlyout;
        const headerStickyElem = findFirst('.header__nav-container');
        const isMobile = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_BELOW).matches;

        if (!showConciergeFlyout) {
            disableBodyScroll('INITIAL', true);
            if (isMobile) {
                addClass(headerStickyElem, 'hide');
            }
            restrictUserScalability();
        } else {
            enableBodyScroll('INITIAL', false);
            if (isMobile) {
                removeClass(headerStickyElem, 'hide');
            }
            releaseUserScalability();
        }
        this.updateSelectedFlyoutModal({ flyoutState: 'INITIAL', showFlyout: !this.props.showFlyout, emailSent: false });
    }

    /**
     * @description handle flyout top position
     * @param {object} flyoutContainer flyoutContainer
     * @returns {void}
     */
    handleScroll(flyoutContainer) {
        const showContactCta = objectPath.get(this.props.authoredContent, 'conciergeFlyoutConfig.showContactCta', false);

        if (this.flyoutContainer && showContactCta) {
            const rect = findFirst('header .header__nav-container').getBoundingClientRect();

            if (this.flyoutContainer.current) {
                this.flyoutContainer.current.style.top = `${rect.bottom}px`;
                this.flyoutBackdrop.current.style.top = `${rect.bottom}px`;
            }
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const showContactCta = objectPath.get(this.props.authoredContent, 'conciergeFlyoutConfig.showContactCta', false);
        const isVisibile = typeof this.props.byo.previewWidth === 'number' ? (this.props.byo.byoEditMode) : true;

        return (
            !showContactCta
                ? null :
                <div
                    className={
                        classNames('concierge-flyout',
                            {
                                'concierge-flyout__hide-mobile': !isVisibile
                            })
                    }
                >
                    <ConciergeCta toggleConciergeFlyout={() => this.toggleConciergeFlyout()} />

                    <div
                        className={
                            classNames('concierge-flyout__overlay',
                                {
                                    'concierge-flyout__overlay--show': this.props.showFlyout,
                                    'concierge-flyout__overlay--hide-mobile': !isVisibile
                                })
                        }
                        role="button"
                        tabIndex={0}
                        onClick={this.toggleConciergeFlyout}
                        onKeyPress={this.toggleConciergeFlyout}
                        onKeyUp={() => { }}
                        ref={this.flyoutBackdrop}
                    />
                    <div
                        className={
                            classNames('concierge-flyout__body',
                                {
                                    'concierge-flyout__body--show': this.props.showFlyout
                                })
                        }
                        ref={this.flyoutContainer}
                        onKeyDown={(e) => {
                            const type = getKeyCode(e.keyCode, e.shiftKey);

                            if (type === 'ESCAPE') {
                                this.toggleConciergeFlyout();
                            }
                        }}
                        role="button"
                        tabIndex={-1}
                    >
                        <CustomScrollBar>
                            <div
                                className="concierge-flyout__body__wrap"
                                role="dialog"
                                aria-modal
                            >
                                {this.props.flyoutState === 'INITIAL' && <InitialContent updateSelectedFlyoutModal={this.updateSelectedFlyoutModal} flyOutRef={this.flyoutContainer} />}
                                {this.props.flyoutState === 'EMAIL' && <EmailContent updateSelectedFlyoutModal={this.updateSelectedFlyoutModal} emailRegex={this.props.emailRegex} flyOutRef={this.flyoutContainer} />}
                                {
                                    this.props.flyoutState !== 'EMAIL' &&
                                    <button
                                        type="button"
                                        className="concierge-flyout--close"
                                        aria-label="Click to close concierge flyout"
                                        onClick={this.toggleConciergeFlyout}
                                        onKeyPress={this.toggleConciergeFlyout}
                                    >
                                        <img src={this.props.closeSrc} alt={this.props.closeAltText} />
                                    </button>
                                }
                            </div>
                        </CustomScrollBar>
                    </div>
                    <button className="button-hidden" aria-hidden="true" type="button" tabIndex={this.props.showFlyout ? 0 : -1} />
                </div>
        );
    }
}

ConciergeFlyout.propTypes = {
    authoredContent: PropTypes.object.isRequired,
    emailRegex: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    flyoutState: PropTypes.string.isRequired,
    showFlyout: PropTypes.bool.isRequired,
    closeSrc: PropTypes.string.isRequired,
    closeAltText: PropTypes.string.isRequired,
    byo: PropTypes.any.isRequired
};

ConciergeFlyout.defaultProps = {
    emailRegex: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$'
};

const mapStateToProps = (state, ownProps) => {
    return {
        authoredContent: state.aem,
        emailSent: state.conciergeFlyout.emailSent,
        flyoutState: state.conciergeFlyout.flyoutState,
        showFlyout: state.conciergeFlyout.showFlyout,
        byo: state.byo,
        closeSrc: objectPath.get(state, 'aem.icons.close.src', ''),
        closeAltText: objectPath.get(state, 'aem.icons.close.altText', '')
    };
};

export default connect(mapStateToProps)(ConciergeFlyout);
