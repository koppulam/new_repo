// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';

import SS from 'constants/SalesServiceConstants';
import * as objectPath from 'object-path';
import styleVariables from 'lib/utils/breakpoints';
import { getSalesServiceCookie } from 'lib/utils/salesService-util';

import {
    getDistributionInventory,
    getOnOrderStatus,
    setColumnHeading,
    getAllStores
} from 'actions/SalesServiceActions';
import TiffanyInlineModal from 'components/common/TiffanyInlineModal';

import DistributionInventory from './DistributionInventory';
import OnOrderStatus from './OnOrderStatus/index';
import StoreRetailInventory from './StoreInventory';

// import './index.scss';

/**
 * Sales Service Inventory center
 */
class SalesServiceCenter extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        const initialTab = props.tabs.filter(tab => {
            return tab.key === SS.RETAIL_STORE;
        });
        const salesSrvSite = getSalesServiceCookie();

        this.state = {
            currentTab: SS.RETAIL_STORE,
            columnHeadings: initialTab.length > 0 ? initialTab[0].columnHeadings : [],
            salesSrvSite
        };
        props.dispatch(setColumnHeading(this.state.columnHeadings));
    }

    /**
     * @returns {void}
     */
    componentDidMount() {
        // Get Retail store inventory
        // this.props.dispatch(getRetailStoreInventory(this.props.distributionInvRequest));

        if (this.state.salesSrvSite) {
            // Get Distribution Inventory
            this.props.dispatch(getDistributionInventory(this.props.distributionInvRequest));
            // On order status tab
            this.props.dispatch(getOnOrderStatus(this.props.onOrderStatusRequest));
            // All stores for retail inventory tab
            this.props.dispatch(getAllStores(this.props.getAllStoresRequest));
        }
    }

    /**
     * @param {Object} event click event
     * @param {Object} tab selected tab detail
     * @param {Boolean} isOpen is open flag
     * @returns {void}
     */
    setCurrentTab = (event, tab, isOpen) => {
        event.preventDefault();
        this.setState({
            currentTab: tab.key,
            columnHeadings: tab.columnHeadings,
            isOpen
        });
        this.props.dispatch(setColumnHeading(tab.columnHeadings));
    }

    /**
     * @returns {void}
     */
    toggleModal = () => {
        this.setState({
            currentTab: '',
            columnHeadings: ''
        });
        this.props.dispatch(setColumnHeading([]));
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const { ariaLabels } = this.props;

        return (
            this.state.salesSrvSite ?
                <div className="sales-service">
                    <MediaQuery query={styleVariables.desktopAndAbove}>
                        <div>
                            <ul className="sales-service__options tf-g--no-wrap container--2" role="tablist">
                                {
                                    this.props.tabs.map(tab => {
                                        return (
                                            <li
                                                className="sales-service__options_item col-4-12 display__inline-block"
                                                role="presentation"
                                                onClick={(e) => this.setCurrentTab(e, tab)}
                                            >
                                                <a
                                                    href={tab.href}
                                                    className={classNames('sales-service__options_item_link', {
                                                        active: tab.key === this.state.currentTab
                                                    })
                                                    }
                                                    role="tab"
                                                    aria-selected="true"
                                                >
                                                    {tab.title}
                                                </a>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                            <div role="tabpanel">
                                {
                                    <div
                                        className={classNames({
                                            hide: (this.state.currentTab !== SS.ORDER_STATUS)
                                        })}
                                    >
                                        <OnOrderStatus />
                                    </div>
                                }
                                {
                                    <div
                                        className={classNames({
                                            hide: (this.state.currentTab !== SS.RETAIL_STORE)
                                        })}
                                    >
                                        <StoreRetailInventory />
                                    </div>
                                }
                                {
                                    <div
                                        className={classNames({
                                            hide: (this.state.currentTab !== SS.DISTRIBUTION_CENTER)
                                        })}
                                    >
                                        <DistributionInventory />
                                    </div>
                                }
                            </div>
                        </div>
                    </MediaQuery>
                    <MediaQuery query={styleVariables.desktopAndBelow}>
                        <div className="sales-service__cta">
                            {
                                this.props.tabs.map(tab => {
                                    return (
                                        <button
                                            type="button"
                                            className="cta"
                                            onClick={(e) => this.setCurrentTab(e, tab, true)}
                                        >
                                            <span className="cta-content hover-cta" tabIndex="-1">
                                                <span className="cta-text">
                                                    {tab.title}
                                                </span>
                                                <i className="icon-dropdown-right" />
                                            </span>
                                        </button>
                                    );
                                })
                            }
                            <TiffanyInlineModal
                                showModal={this.state.isOpen && (this.state.currentTab === SS.ORDER_STATUS)}
                                showLeftArrow
                                holder="sales-service"
                                closeAriaLabel={ariaLabels.closeAriaLabel}
                                leftArrowAriaLabel={ariaLabels.leftArrowAriaLabel}
                                focusElement={false}
                                resetInitiator={() => { this.toggleModal(); }}
                                customClass="sales-service__modal"
                            >
                                <OnOrderStatus />
                            </TiffanyInlineModal>

                            <TiffanyInlineModal
                                showModal={this.state.isOpen && (this.state.currentTab === SS.RETAIL_STORE)}
                                showLeftArrow
                                holder="sales-service"
                                closeAriaLabel={ariaLabels.closeAriaLabel}
                                leftArrowAriaLabel={ariaLabels.leftArrowAriaLabel}
                                focusElement={false}
                                resetInitiator={() => { this.toggleModal(); }}
                                customClass="sales-service__modal"
                            >
                                <StoreRetailInventory />
                            </TiffanyInlineModal>

                            <TiffanyInlineModal
                                showModal={this.state.isOpen && (this.state.currentTab === SS.DISTRIBUTION_CENTER)}
                                showLeftArrow
                                holder="sales-service"
                                closeAriaLabel={ariaLabels.closeAriaLabel}
                                leftArrowAriaLabel={ariaLabels.leftArrowAriaLabel}
                                focusElement={false}
                                resetInitiator={() => { this.toggleModal(); }}
                                customClass="sales-service__modal"
                            >
                                <DistributionInventory />
                            </TiffanyInlineModal>

                        </div>
                    </MediaQuery>
                </div> : null
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        tabs: objectPath.get(state, 'aem.salesServiceCenter.tabs', []),
        distributionInvRequest: objectPath.get(state, 'aem.salesServiceCenter.distributionInvRequest'),
        onOrderStatusRequest: objectPath.get(state, 'aem.salesServiceCenter.onOrderStatusRequest'),
        getAllStoresRequest: objectPath.get(state, 'aem.salesServiceCenter.retailStore.getAllStoresRequest'),
        ariaLabels: objectPath.get(state, 'aem.salesServiceCenter.ariaLabels', {})
    };
};

SalesServiceCenter.defaultProps = {

};

SalesServiceCenter.propTypes = {
    dispatch: PropTypes.func.isRequired,
    tabs: PropTypes.array.isRequired,
    distributionInvRequest: PropTypes.object.isRequired,
    onOrderStatusRequest: PropTypes.object.isRequired,
    ariaLabels: PropTypes.object.isRequired,
    getAllStoresRequest: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(SalesServiceCenter);
