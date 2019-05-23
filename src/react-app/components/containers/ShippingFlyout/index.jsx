// Packages
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import objectPath from 'object-path';
import { connect } from 'react-redux';
import {
    removeClass,
    findFirst,
    closest
} from 'lib/dom/dom-util';
import { enableBodyScroll, disableBodyScroll } from 'lib/no-scroll';
import updateShippingFlyoutState from 'actions/ShippingActions';
import scopeFocus from 'lib/dom/scope-focus';
import CustomScrollBar from 'components/common/CustomScrollBar';

// import './index.scss';

/**
 * @description Flyout component for shipping and returns
 * @class ShippingFlyout
 */
class ShippingFlyout extends React.Component {
    /**
     * @description constructor
     * @param {object} props props
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
        const globalBannerEle = findFirst('.global-banner');

        if (globalBannerEle) {
            window.addEventListener('scroll', this.handleScroll);
        }

        setTimeout(() => {
            this.handleScroll(this.flyoutContainer);
        }, 1000);

        const shippingInformation = this.shippingInformation.getElementsByClassName('text-phnumber');

        if (shippingInformation.length) {
            shippingInformation[0].innerHTML = '';
        }
    }

    /**
     * Lifcycle hook
     * @param {*} nextProps changed props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.showShippingFlyout !== this.props.showShippingFlyout) {
            if (this.flyoutContainer && this.flyoutContainer.current) {
                if (nextProps.showShippingFlyout) {
                    scopeFocus.setScopeLimit(this.flyoutContainer.current);
                } else {
                    scopeFocus.dispose();
                }
            }
        }
    }

    /**
     * @description component will unmount
     * @returns {void}
     */
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('click', this.windowClickHandler);
    }

    /**
     * @param {e} e click event
     * @returns {void}
     */
    windowClickHandler = (e) => {
        const { showShippingFlyout } = this.props;

        if (showShippingFlyout) {
            const closestElem = closest(e.target, 'header');

            if (closestElem) {
                this.toggleShippingFlyout(e);
            }
        }
    }

    /**
     * @param {e} e click event
     * @returns {void}
     */
    toggleShippingFlyout = (e) => {
        const { showShippingFlyout } = this.props;
        const shippingbagRef = e.currentTarget;
        const shippingBtnContainer = findFirst('span.shipping-cta.active');

        if (!showShippingFlyout) {
            disableBodyScroll('SHIPPING FLYOUT', true);
        } else {
            enableBodyScroll('SHIPPING FLYOUT', false);
            removeClass(shippingBtnContainer, 'active');
            if (shippingbagRef) {
                shippingbagRef.focus();
            }
        }
        this.props.dispatch(updateShippingFlyoutState({
            showShippingFlyout: !this.props.showShippingFlyout
        }));
    }

    /**
     * @description handle flyout top position
     * @param {object} flyoutContainer flyoutContainer
     * @returns {void}
     */
    handleScroll(flyoutContainer) {
        if (this.flyoutContainer) {
            const rect = findFirst('header .header__nav-container').getBoundingClientRect();

            flyoutContainer.current.style.top = `${rect.bottom}px`;
            this.flyoutBackdrop.current.style.top = `${rect.bottom}px`;
        }
    }

    /**
    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const shippingFlyoutConfig = this.props.aem[this.props.config];
        const { flyoutContentType } = this.props;
        let flyoutHTML = '';
        let engravableHTML = '';
        let closeIcon = '';
        let closeIconAlt = '';
        let backIcon = '';
        let backIconAlt = '';
        const flyoutConfig = objectPath.get(this.props.aem, `${flyoutContentType}`, {});

        if (flyoutContentType === 'shipping') {
            flyoutHTML = shippingFlyoutConfig.rteAuthored;
            engravableHTML = shippingFlyoutConfig.engravableRteAuthored;
            closeIcon = objectPath.get(shippingFlyoutConfig, 'closeIcon', './icons/close.svg');
            closeIconAlt = objectPath.get(shippingFlyoutConfig, 'closeIconAlt', 'close icon');
            backIcon = objectPath.get(shippingFlyoutConfig, 'backIcon', './icons/left.svg');
            backIconAlt = objectPath.get(shippingFlyoutConfig, 'backIconAlt', 'back icon');
        } else {
            flyoutHTML = objectPath.get(flyoutConfig, 'rteAuthored', '');
            closeIcon = objectPath.get(flyoutConfig, 'closeIcon', './icons/close.svg');
            closeIconAlt = objectPath.get(flyoutConfig, 'closeIconAlt', 'close icon');
            backIcon = objectPath.get(flyoutConfig, 'backIcon', './icons/left.svg');
            backIconAlt = objectPath.get(flyoutConfig, 'backIconAlt', 'back icon');
        }
        return (
            <div className="shipping-flyout">
                <div
                    className={
                        classNames('shipping-flyout__overlay',
                            {
                                'shipping-flyout__overlay--show': this.props.showShippingFlyout
                            })
                    }
                    role="button"
                    tabIndex={this.props.showShippingFlyout ? 0 : -1}
                    onClick={e => this.toggleShippingFlyout(e)}
                    onKeyUp={() => { }}
                    ref={this.flyoutBackdrop}
                />
                <div
                    className={
                        classNames('shipping-flyout__body',
                            {
                                'shipping-flyout__body--show': this.props.showShippingFlyout
                            })
                    }
                    ref={this.flyoutContainer}
                    role="dialog"
                    aria-modal
                >
                    <CustomScrollBar>
                        <button
                            type="button"
                            className="shipping-flyout__body_icon--close"
                            aria-label={this.props.closeAriaLabel}
                            onClick={e => this.toggleShippingFlyout(e)}
                            tabIndex={this.props.showShippingFlyout ? 0 : -1}
                        >
                            <img src={closeIcon} alt={closeIconAlt} />
                        </button>
                        <button
                            type="button"
                            className="shipping-flyout__body_icon--left-arrow"
                            aria-label={this.props.closeAriaLabel}
                            onClick={e => this.toggleShippingFlyout(e)}
                            tabIndex={this.props.showShippingFlyout ? 0 : -1}
                        >
                            <img src={backIcon} alt={backIconAlt} />
                        </button>
                        <div ref={el => { this.shippingInformation = el; }} dangerouslySetInnerHTML={{ __html: flyoutHTML }} />
                        {
                            shippingFlyoutConfig.isEngravable &&
                            <div ref={el => { this.shippingInformation = el; }} dangerouslySetInnerHTML={{ __html: engravableHTML }} />
                        }
                    </CustomScrollBar>
                </div>
                <button className="button-hidden" aria-hidden="true" type="button" tabIndex={this.props.showShippingFlyout ? 0 : -1} />
            </div>
        );
    }
}

ShippingFlyout.propTypes = {
    aem: PropTypes.object.isRequired,
    showShippingFlyout: PropTypes.bool.isRequired,
    flyoutContentType: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    closeAriaLabel: PropTypes.string,
    config: PropTypes.string.isRequired
};

ShippingFlyout.defaultProps = {
    closeAriaLabel: 'close'
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        showShippingFlyout: state.shippingReducer.showShippingFlyout,
        flyoutContentType: state.shippingReducer.flyoutContentType
    };
};

export default connect(mapStateToProps)(ShippingFlyout);
