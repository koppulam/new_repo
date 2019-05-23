// Packages
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as objectPath from 'object-path';
import MediaQuery from 'react-responsive';
import { scrollTo } from 'lib/utils/scroll-to-content';
import { getStickyCartHeight } from 'lib/utils/sticky-cart';
import classNames from 'classnames';
import {
    findFirst,
    addClass,
    hasClass,
    removeClass
} from 'lib/dom/dom-util';
import ProductVariations from 'components/containers/ProductModifiers/ProductVariations';
import {
    findStore,
    storeDetailStatus,
    changeStoreStatus,
    setStoreLocation
} from 'actions/FindStoreActions';

import matchMedia from 'lib/dom/match-media';
// Styles
import styleVariables from 'lib/utils/breakpoints';
// import './index.scss';

import StoreDetail from './StoreDetail';
import ChangeStore from './ChangeStore';
/**
 * Component declaration.
 */
class ProductAvailability extends Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            isLoad: true
        };
    }

    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentDidMount() {
        this.props.dispatch(findStore());
        this.container = findFirst('.product-description__container');
        this.buttonContainer = findFirst('.product-description__buttons');
    }

    /**
    * @description On props changed life cycle event
    * @param {object} newProps updated params
    * @returns {void}
    */
    componentWillReceiveProps = (newProps) => {
        if ((this.props.storeDetails !== newProps.storeDetails && !this.state.isLoad && newProps.storeDetails.isPreferredStore !== true) || (this.props.setLocation !== newProps.setLocation)) {
            this.performChangeStoreAction(newProps);
        } else if (this.props.locationBlocked !== newProps.locationBlocked) {
            this.performChangeStoreAction(newProps);
        }
    }


    /**
     * @description show default store availability details
     * @param {object} e event
     * @returns {void}
     */
    showStoreAvailability = (e) => {
        if (this.props.setLocation) {
            this.setState({
                isLoad: false
            });
            this.props.dispatch(setStoreLocation());
        } else {
            this.performChangeStoreAction(this.props);
        }
    }

    /**
     * @description performChangeStoreAction trigger change store Modal.
     * @param {object} props Props updated on action.
     * @returns {void}
     */
    performChangeStoreAction = (props) => {
        const isDesktop = window.matchMedia(matchMedia.BREAKPOINTS.DESKTOP_AND_ABOVE).matches;
        const changeStoreContainer = findFirst('.change-store');

        if (Object.keys(props.storeDetails).length > 0) {
            this.props.dispatch(storeDetailStatus(!props.storeDetailStatus));
            if (!isDesktop) {
                if (props.changeStoreStatus) {
                    addClass(changeStoreContainer, 'hide');
                    this.props.dispatch(changeStoreStatus(false));
                } else {
                    removeClass(changeStoreContainer, 'hide');
                }
            }
        } else if (props.storeDetailStatus === false) {
            this.props.dispatch(changeStoreStatus(!props.changeStoreStatus));
        }
    }

    /**
     * @description scroll to the element original position and then perform action required
     * @returns {void}
     */
    scrollAndAct = () => {
        this.showStoreAvailability();
        if (hasClass(findFirst('.product-in-store'), 'stick-to-bottom')) {
            const viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

            // waiting for showStoreAvailability to make changes to DOM
            setTimeout(() => {
                scrollTo('.product-description_availability', undefined, -(viewPortHeight - getStickyCartHeight()), undefined);
            });
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const storeConfig = objectPath.get(window.tiffany, 'pdpConfig.store', {});
        const additionalProps = this.props.isfiis === 'true' ? {
            onClick: this.showStoreAvailability
        } : null;
        const htmlCallout = {
            interactionContext: '',
            interactionType: 'tab-activity',
            interactionName: 'find-item-in-store'
        };

        if (this.props.storeDetailStatus || this.props.changeStoreStatus) {
            if (!hasClass(this.container, 'relative-holder')) {
                addClass(this.container, 'relative-holder');
                addClass(this.buttonContainer, 'find-store-button-desktop-hidden');
            }
        } else if (hasClass(this.container, 'relative-holder')) {
            removeClass(this.container, 'relative-holder');
            removeClass(this.buttonContainer, 'find-store-button-desktop-hidden');
        }

        return (
            <div className="product-in-store">
                <MediaQuery query={styleVariables.desktopAndAbove}>
                    <button
                        type="button"
                        className={classNames('find-in-store cta underline-cta',
                            {
                                'find-in-store-expanded': this.props.storeDetailStatus
                            })}
                        {...additionalProps}
                        onClick={this.showStoreAvailability}
                        data-interaction-context={htmlCallout.interactionContext}
                        data-interaction-type={htmlCallout.interactionType}
                        data-interaction-name={htmlCallout.interactionName}
                    >
                        <span className="cta-content" tabIndex={-1}>
                            <span className="cta-text">{storeConfig.buttonPlaceholder}</span>
                        </span>
                    </button>
                </MediaQuery>
                <MediaQuery query={styleVariables.desktopAndBelow}>
                    <div className="product-in-store__wrapper">
                        <button
                            type="button"
                            className={classNames('find-in-store cta',
                                {
                                    'find-in-store-expanded': this.props.storeDetailStatus
                                })}
                            {...additionalProps}
                            onClick={this.scrollAndAct}
                            aria-expanded={this.props.storeDetailStatus ? 'true' : 'false'}
                            data-interaction-context={htmlCallout.interactionContext}
                            data-interaction-type={htmlCallout.interactionType}
                            data-interaction-name={htmlCallout.interactionName}
                        >
                            <span className="cta-content" tabIndex={-1}>
                                <span className="cta-text">{storeConfig.buttonPlaceholder}</span>
                            </span>
                            <i
                                className={classNames('find-in-store_dropdown',
                                    {
                                        'icon-dropdown-down': !this.props.storeDetailStatus && !this.props.changeStoreStatus,
                                        'icon-dropdown-up': this.props.storeDetailStatus || this.props.changeStoreStatus
                                    })}
                            />
                        </button>
                        <ProductVariations config="modifiersConfig" customClass="compact-view" />
                    </div>
                </MediaQuery>
                {
                    this.props.storeDetailStatus &&
                    <MediaQuery query={styleVariables.desktopAndBelow}>
                        <StoreDetail bops={this.props.bops} />
                    </MediaQuery>
                }
                {
                    this.props.storeDetailStatus === false &&
                    <ChangeStore type="change_store" />
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        storeDetailStatus: state.findStore.storeDetailStatus,
        storeDetails: state.findStore.storeDetails,
        changeStoreStatus: state.findStore.changeStoreStatus,
        setLocation: state.findStore.setLocation,
        locationBlocked: state.findStore.locationBlocked
    };
};

ProductAvailability.defaultProps = {
    storeDetailStatus: null,
    setLocation: false
};

ProductAvailability.propTypes = {
    dispatch: PropTypes.func.isRequired,
    storeDetails: PropTypes.object.isRequired,
    bops: PropTypes.string.isRequired,
    storeDetailStatus: PropTypes.any,
    changeStoreStatus: PropTypes.bool.isRequired,
    isfiis: PropTypes.string.isRequired,
    setLocation: PropTypes.bool,
    locationBlocked: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(ProductAvailability);
