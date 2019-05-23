// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import objectPath from 'object-path';
import sortBy from 'lodash/sortBy';
import scopeFocus from 'lib/dom/scope-focus';

import styleVariables from 'lib/utils/breakpoints';

import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import TiffanyChatWrapper from 'components/common/TiffanyChatWrapper';

/**
 * Initial Content Component
 */
class InitialContent extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            showPhoneDrawer: false
        };
    }

    /**
     * @description validate form fields
     * @returns {void}
     */
    componentDidMount() {
        if (this.props.flyOutRef.current) {
            scopeFocus.setScopeLimit(this.props.flyOutRef.current);
        }
    }

    /**
    * @description On props changed life cycle event
    * @param {object} newProps updated params
    * @returns {void}
    */
    componentWillReceiveProps = (newProps) => {
        if (this.props.showFlyout !== newProps.showFlyout) {
            this.setState({ showPhoneDrawer: false });
        }
    }

    /**
     * @param {*} options list
     * @returns {void}
     */
    sortDrawerOptions = (options) => {
        let sortedOptions = [];

        if (options.length) {
            sortedOptions = sortBy(options, 'order');
        }
        return sortedOptions;
    }

    /**
     * @description render drawer options
     * @returns {void}
     */
    renderDrawerOptions = () => {
        const { showPhoneDrawer } = this.state;
        const drawerOptions = objectPath.get(window, 'tiffany.labels.concierge.options');
        const sortedDrawerOptions = this.sortDrawerOptions(drawerOptions);
        const conciergeLabels = objectPath.get(window, 'tiffany.labels.concierge');

        return (
            sortedDrawerOptions.length > 0 &&
            sortedDrawerOptions.map((option, index) => {
                return (
                    <div key={option.type}>
                        {
                            option.type.toLowerCase() === 'chat' &&
                            option.showStatus &&
                            <TiffanyChatWrapper
                                chatWidgetID={option.chatWidgetID}
                                customClass="concerge-chat-wrapper concierge-chat__container"
                                context={AnalyticsConstants.CHAT_CONCIERGE_CONTEXT}
                                type={AnalyticsConstants.CHAT_CONCIERGE_TYPE}
                                name={option.name || ''}
                            />
                        }
                        {
                            option.type.toLowerCase() === 'phone' &&
                            option.state.toLowerCase() === 'hero' &&
                            option.showStatus &&
                            <div className="concierge-flyout__phone">
                                <div className="concierge-flyout__phone-wrapper" data-interaction-context="header" data-interaction-type="concierge" data-interaction-name={conciergeLabels.conciergePhoneDataIntName}>
                                    <img className="concierge-flyout__phone-icon" src={this.props.phoneIconSrc} alt={this.props.phoneIconAltText} />
                                    <h3 className="concierge-flyout__phone-heading">{option.labelText || 'Phone'}</h3>
                                </div>
                                {
                                    (option.salesService || option.diamondService) &&
                                    <div
                                        className="concierge-flyout__phone-details"
                                    >
                                        {
                                            option.salesService &&
                                            <p>
                                                {option.salesService.text}
                                            </p>
                                        }
                                        {
                                            (option.salesService && option.salesService.number) &&
                                            <a
                                                href={`tel: ${option.salesService.number}`}
                                                data-interaction-context=""
                                                data-interaction-type={AnalyticsConstants.PHONE}
                                                data-interaction-name={option.salesService.number}
                                                data-exit-context={AnalyticsConstants.HEADER}
                                                data-exit-type={AnalyticsConstants.PHONE_CONCIERGE}
                                                data-exit-name={AnalyticsConstants.SALES}
                                                className="cta hover-cta"
                                            >
                                                {option.salesService.number}
                                            </a>
                                        }
                                        {
                                            option.diamondService &&
                                            <p>
                                                {option.diamondService.text}
                                            </p>
                                        }
                                        {
                                            (option.diamondService && option.diamondService.number) &&
                                            <a
                                                href={`tel: ${option.diamondService.number}`}
                                                data-interaction-context=""
                                                data-interaction-type={AnalyticsConstants.PHONE}
                                                data-interaction-name={option.diamondService.number}
                                                data-exit-context={AnalyticsConstants.HEADER}
                                                data-exit-type={AnalyticsConstants.PHONE_CONCIERGE}
                                                data-exit-name={AnalyticsConstants.DIAMOND}
                                                className="cta hover-cta"
                                            >
                                                {option.diamondService.number}
                                            </a>
                                        }
                                    </div>
                                }
                            </div>
                        }
                        {
                            option.type.toLowerCase() === 'phone' &&
                            option.state.toLowerCase() === 'drawer' &&
                            option.showStatus &&
                            <div className={classNames('concierge-flyout__drawer', {
                                'bottom-margin-80': index + 1 === sortedDrawerOptions.length
                            })}
                            >
                                <div
                                    className="concierge-flyout__drawer-wrapper"
                                    role="button"
                                    tabIndex={0}
                                    aria-expanded={this.state.showPhoneDrawer}
                                    data-interaction-context="header"
                                    data-interaction-type="concierge"
                                    data-interaction-name={conciergeLabels.conciergePhoneDataIntName}
                                    onClick={
                                        () => {
                                            if (option.salesService || option.diamondService) {
                                                this.setState({ showPhoneDrawer: !this.state.showPhoneDrawer });
                                            }
                                        }
                                    }
                                    onKeyPress={
                                        () => {
                                            if (option.salesService || option.diamondService) {
                                                this.setState({ showPhoneDrawer: !this.state.showPhoneDrawer });
                                            }
                                        }
                                    }
                                >
                                    <img className="concierge-flyout__drawer-icon" src={this.props.phoneIconSrc} alt={this.props.phoneIconAltText} />
                                    <h3 className="concierge-flyout__drawer-heading">
                                        {option.labelText || 'Phone'}
                                        <span
                                            className={
                                                classNames(
                                                    {
                                                        'icon-downArrow': showPhoneDrawer,
                                                        'icon-rightArrow': !showPhoneDrawer
                                                    }
                                                )
                                            }
                                        />
                                    </h3>
                                </div>
                                {
                                    (option.salesService || option.diamondService) &&
                                    <div
                                        className={
                                            classNames('concierge-flyout__phone-details--drawer',
                                                {
                                                    'concierge-flyout__phone-details--drawer-show': showPhoneDrawer
                                                })
                                        }
                                    >
                                        {
                                            option.salesService &&
                                            <span>
                                                {
                                                    option.salesService.text &&
                                                    <p>
                                                        {option.salesService.text}
                                                    </p>
                                                }
                                                {
                                                    option.salesService.number &&
                                                    <a
                                                        href={`tel: ${option.salesService.number}`}
                                                        data-interaction-context=""
                                                        data-interaction-type={AnalyticsConstants.PHONE}
                                                        data-interaction-name={option.salesService.number}
                                                        data-exit-context={AnalyticsConstants.HEADER}
                                                        data-exit-type={AnalyticsConstants.PHONE_CONCIERGE}
                                                        data-exit-name={AnalyticsConstants.SALES}
                                                        className="cta hover-cta"
                                                    >
                                                        {option.salesService.number}
                                                    </a>
                                                }
                                            </span>
                                        }
                                        {
                                            option.diamondService &&
                                            <span>
                                                {
                                                    option.diamondService.text &&
                                                    <p>
                                                        {option.diamondService.text}
                                                    </p>
                                                }
                                                {
                                                    option.diamondService.number &&
                                                    <a
                                                        href={`tel: ${option.diamondService.number}`}
                                                        data-interaction-context=""
                                                        data-interaction-type={AnalyticsConstants.PHONE}
                                                        data-interaction-name={option.diamondService.number}
                                                        data-exit-context={AnalyticsConstants.HEADER}
                                                        data-exit-type={AnalyticsConstants.PHONE_CONCIERGE}
                                                        data-exit-name={AnalyticsConstants.DIAMOND}
                                                        className="cta hover-cta"
                                                    >
                                                        {option.diamondService.number}
                                                    </a>
                                                }
                                            </span>
                                        }
                                    </div>
                                }
                            </div>
                        }
                        {
                            option.type.toLowerCase() === 'email' &&
                            option.showStatus &&
                            <div className={classNames('concierge-flyout__drawer', {
                                'bottom-margin-80': index + 1 === sortedDrawerOptions.length
                            })}
                            >
                                <div className="concierge-flyout__drawer-wrapper">
                                    <button
                                        type="button"
                                        className="diamond-anchor cta"
                                        onClick={() => this.props.updateSelectedFlyoutModal({
                                            flyoutState: 'EMAIL',
                                            showFlyout: true,
                                            emailSent: false,
                                            isConcierge: true
                                        })}
                                        onKeyPress={() => this.props.updateSelectedFlyoutModal({ flyoutState: 'EMAIL', showFlyout: true, emailSent: false })}
                                        data-interaction-context="header"
                                        data-interaction-type="concierge"
                                        data-interaction-name={conciergeLabels.conciergeEmailDataIntName}
                                    >
                                        <img className="concierge-flyout__drawer-icon" src={this.props.emailIconSrc} alt={this.props.emailIconAltText} />
                                        <h3
                                            role="presentation"
                                            className="concierge-flyout__drawer-heading"
                                        >
                                            {option.labelText || 'Email'}
                                            <span className="icon-rightArrow" />
                                        </h3>
                                    </button>
                                </div>
                            </div>
                        }
                        {
                            option.type.toLowerCase() === 'diamond' &&
                            option.showStatus &&
                            <div className={classNames('concierge-flyout__drawer', {
                                'bottom-margin-80': index + 1 === sortedDrawerOptions.length
                            })}
                            >
                                <div className="concierge-flyout__drawer-wrapper">
                                    <a
                                        href={option.url}
                                        target={option.target}
                                        className="diamond-anchor cta"
                                        data-nav-context={AnalyticsConstants.HEADER}
                                        data-nav-type={AnalyticsConstants.CONCIERGE}
                                        data-nav-name={conciergeLabels.conciergeDiamondExpDataIntName}
                                    >
                                        <img className="concierge-flyout__drawer-icon" src={this.props.diamondExpertIconSrc} alt={this.props.diamondExpertIconAltText} />
                                        <span className="concierge-flyout__drawer-heading">
                                            {option.labelText || 'Diamond Expert'}
                                            <span className="icon-rightArrow" />
                                        </span>
                                    </a>
                                </div>
                            </div>
                        }
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
        const { belowDesktopTablet } = styleVariables;
        const mobileHeading = objectPath.get(window, 'tiffany.labels.concierge.mobileHeading', 'Concierge');
        const headLine = objectPath.get(window, 'tiffany.labels.concierge.headline');
        const description = objectPath.get(window, 'tiffany.labels.concierge.description');
        const learnMoreText = objectPath.get(window, 'tiffany.labels.concierge.learnMore.labelText');
        const learnMoreUrl = objectPath.get(window, 'tiffany.labels.concierge.learnMore.url');
        const learnMoreTarget = objectPath.get(window, 'tiffany.labels.concierge.learnMore.target');

        return (
            <div className="concierge-flyout__initial-content">
                <MediaQuery query={belowDesktopTablet}>
                    <p className="concierge-flyout__concierge-heading">{mobileHeading}</p>
                </MediaQuery>
                <h4 className="concierge-flyout__body-heading">{headLine}</h4>
                <p className="concierge-flyout__body-description">{description}</p>
                {this.renderDrawerOptions()}
                <div className="concierge-flyout__learn-more">
                    <a
                        href={learnMoreUrl}
                        target={learnMoreTarget}
                        data-nav-context={AnalyticsConstants.HEADER}
                        data-nav-type={AnalyticsConstants.CONCIERGE}
                        data-nav-name={AnalyticsConstants.LEARN_MORE}
                        className="cta hover-cta"
                    >
                        {learnMoreText}
                        <span className="icon-Right" />
                    </a>
                </div>
            </div>
        );
    }
}

InitialContent.propTypes = {
    updateSelectedFlyoutModal: PropTypes.func.isRequired,
    phoneIconSrc: PropTypes.string.isRequired,
    phoneIconAltText: PropTypes.string.isRequired,
    emailIconSrc: PropTypes.string.isRequired,
    emailIconAltText: PropTypes.string.isRequired,
    diamondExpertIconSrc: PropTypes.string.isRequired,
    diamondExpertIconAltText: PropTypes.string.isRequired,
    showFlyout: PropTypes.bool.isRequired,
    flyOutRef: PropTypes.any
};

InitialContent.defaultProps = {
    flyOutRef: {}
};

const mapStateToProps = (state, ownProps) => {
    return {
        phoneIconSrc: objectPath.get(state, 'aem.icons.call.src', ''),
        phoneIconAltText: objectPath.get(state, 'aem.icons.call.altText', 'Call icon'),
        emailIconSrc: objectPath.get(state, 'aem.icons.email.src', ''),
        emailIconAltText: objectPath.get(state, 'aem.icons.email.altText', 'Email icon'),
        diamondExpertIconSrc: objectPath.get(state, 'aem.icons.diamondExpert.src', ''),
        diamondExpertIconAltText: objectPath.get(state, 'aem.icons.diamondExpert.altText', 'Email icon'),
        showFlyout: state.conciergeFlyout.showFlyout
    };
};

export default connect(mapStateToProps)(InitialContent);
