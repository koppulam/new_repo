import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as objectPath from 'object-path';
import { updateFooterFlyoutState, closeFooterFlyout } from 'actions/FooterActions';
import { enableBodyScroll, disableBodyScroll } from 'lib/no-scroll';
import { closest } from 'lib/dom/dom-util';
import MediaQuery from 'react-responsive';
import styleVariables from 'lib/utils/breakpoints';
import scopeFocus from 'lib/dom/scope-focus';
import HtmlCalloutConstants from 'constants/HtmlCalloutConstants';
import CustomScrollBar from 'components/common/CustomScrollBar';
// import './index.scss';

/**
 * @description Flyout component for Footer
 * @class FooterFlyout
 */
class FooterFlyout extends React.Component {
    /**
     * @description constructor
     * @param {object} props props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        window.addEventListener('click', this.windowClickHandler);
        this.footerFlyoutOpen = React.createRef();
        this.footerLabel = React.createRef();
        this.state = {
            isFlyoutOpen: false
        };
    }

    /**
     * @description method to open footer flyout
     * @returns {void}
     */
    openFooterFlyout = () => {
        const request = {};

        request.url = this.props.ctaUrl;
        request.type = 'html';
        const cLabel = this.props.ctaLabel;

        this.setState({ isFlyoutOpen: true }, () => {
            if (this.state.isFlyoutOpen && this.footerFlyoutOpen.current) {
                scopeFocus.setScopeLimit(this.footerFlyoutOpen.current);
            }
        });
        disableBodyScroll('FOOTER FLYOUT', true);

        this.props.dispatch(updateFooterFlyoutState(request, cLabel));
    }

    /**
     * @description method to close footer flyout
     * @returns {void}
     */
    closeFooterFlyout = () => {
        this.setState({ isFlyoutOpen: false }, () => {
            scopeFocus.dispose();
            if (this.footerLabel && this.footerLabel.current) {
                this.footerLabel.current.focus();
            }
        });
        enableBodyScroll('FOOTER FLYOUT', false);
        this.props.dispatch(closeFooterFlyout());
    }

    /**
     * @param {e} e click event
     * @returns {void}
     */
    windowClickHandler = (e) => {
        const isOpen = objectPath.get(this.state, 'isFlyoutOpen', false);

        if (isOpen) {
            const closestElem = closest(e.target, 'header');

            if (closestElem) {
                this.closeFooterFlyout();
            }
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const isOpen = objectPath.get(this.state, 'isFlyoutOpen', false);

        const flyoutDescriptionRTE = objectPath.get(this.props.footerFlyout, 'flyoutData', '');
        const {
            desktopAndAbove,
            desktopAndBelow
        } = styleVariables;
        const htmlCallOut = {
            context: HtmlCalloutConstants.FOOTER,
            navLinkTypeModal: HtmlCalloutConstants.MODAL,
            navLinkTypeExternal: HtmlCalloutConstants.EXTERNAL
        };

        return (
            this.props.isFlyoutCta ?
                <Fragment>
                    <div className="footer-flyout">
                        <button
                            type="button"
                            className="cta"
                            onClick={this.openFooterFlyout}
                            data-nav-context={htmlCallOut.context}
                            data-nav-link-type={htmlCallOut.navLinkTypeModal}
                            data-nav-name={this.props.navname}
                            data-nav-type={this.props.navtype}
                            ref={this.footerLabel}
                        >
                            <span className={`ctaFooter hover-cta ${this.props.customClass}`} tabIndex={-1}>
                                <span className="footer-flyout__btn_label cta-text">
                                    {this.props.ctaLabel}
                                </span>
                            </span>
                        </button>
                        {
                            <div
                                className={classNames('footer-flyout__container', {
                                    'footer-flyout-shown': (isOpen)
                                })}
                                ref={this.footerFlyoutOpen}
                                role="dialog"
                                aria-modal
                            >
                                <CustomScrollBar>
                                    <MediaQuery query={desktopAndAbove}>
                                        <button
                                            type="button"
                                            className="footer-flyout__container_close icon-Close"
                                            aria-label={this.props.closeIconAriaLabel}
                                            onClick={this.closeFooterFlyout}
                                        />
                                    </MediaQuery>
                                    <MediaQuery query={desktopAndBelow}>
                                        <button
                                            type="button"
                                            className="footer-flyout__container_icon--left-arrow"
                                            aria-label={this.props.leftArrowAriaLabel}
                                            onClick={this.closeFooterFlyout}
                                        />
                                    </MediaQuery>
                                    <div dangerouslySetInnerHTML={{ __html: flyoutDescriptionRTE }} />
                                </CustomScrollBar>
                            </div>

                        }
                        {
                            isOpen &&
                            <div
                                role="button"
                                tabIndex={0}
                                className="footer-flyout__overlay"
                                onClick={this.closeFooterFlyout}
                                onKeyUp={() => { }}
                            />
                        }
                    </div>
                </Fragment> :
                <Fragment>
                    <a
                        className={`ctaFooter cta ${this.props.customClass}`}
                        href={this.props.ctaUrl}
                        target={this.props.ctaTarget}
                        tabIndex={0}
                        data-site-id={this.props.ctaSiteId}
                        data-nav-context={htmlCallOut.context}
                        data-nav-link-type={htmlCallOut.navLinkTypeExternal}
                        data-nav-name={this.props.navname}
                        data-nav-type={this.props.navtype}
                    >
                        <span className="cta-content">
                            <span className="cta-text" tabIndex={-1}>
                                {this.props.ctaLabel}
                            </span>
                        </span>
                    </a>
                </Fragment>
        );
    }
}

FooterFlyout.propTypes = {
    isFlyoutCta: PropTypes.bool,
    ctaLabel: PropTypes.string.isRequired,
    customClass: PropTypes.string,
    ctaTarget: PropTypes.bool,
    ctaUrl: PropTypes.string.isRequired,
    ctaSiteId: PropTypes.string,
    footerFlyout: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    navname: PropTypes.string,
    navtype: PropTypes.string,
    closeIconAriaLabel: PropTypes.string,
    leftArrowAriaLabel: PropTypes.string
};

FooterFlyout.defaultProps = {
    isFlyoutCta: false,
    customClass: '',
    ctaTarget: false,
    ctaSiteId: '',
    footerFlyout: {
    },
    navname: '',
    navtype: '',
    closeIconAriaLabel: 'Close button Icon',
    leftArrowAriaLabel: 'Left arrow Icon'
};

const mapStateToProps = (state, ownProps) => {
    return {
        footerFlyout: state.footerFlyout
    };
};

export default connect(mapStateToProps)(FooterFlyout);
