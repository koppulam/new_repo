// Packages
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import { openNotifyFlyout } from 'actions/IStatusFlyoutAction';
import MediaQuery from 'react-responsive';
import { findStore, storeDetailStatus, changeStoreStatus } from 'actions/FindStoreActions';
import classNames from 'classnames';

import StoreDetail from 'components/containers/ProductAvailability/StoreDetail';
import styleVariables from 'lib/utils/breakpoints';

// import './index.scss';

/**
 * ProductAction component
 */
class ProductAction extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.buttonContainer = React.createRef();
    }

    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentDidMount() {
        const { type } = this.props;

        if (type && type.toUpperCase() === 'FIND_IN_STORE') {
            this.props.dispatch(findStore());
        }
    }

    /**
    * @description On props changed life cycle event
    * @param {object} newProps updated params
    * @returns {void}
    */
    componentWillReceiveProps = (newProps) => {
        if (this.props.iStatusFlyout.productFlyoutOpenState !== newProps.iStatusFlyout.productFlyoutOpenState) {
            if (this.props.iStatusFlyout.productFlyoutOpenState) {
                if (this.buttonContainer.current) {
                    this.buttonContainer.current.focus();
                }
            }
        }
    }


    /**
     * Render Component.
     * @returns {void}
     */
    openChangeStoreModal = () => {
        if (Object.keys(this.props.storeDetails).length > 0) {
            this.props.dispatch(storeDetailStatus(!this.props.storeDetailStatus));
        } else {
            this.props.dispatch(changeStoreStatus(!this.props.changeStoreStatus));
        }
    }

    /**
     * Render Component.
     * @returns {void}
     */
    notifyWhenAvailable = () => {
        const config = objectPath.get(this.props.aem, this.props.productconfig, {});
        const productImageDefaultURL = objectPath.get(config, 'productImageUrl', '');
        const payload = {};

        payload.productImageDefaultURL = productImageDefaultURL;
        payload.productName = this.props.productname;
        payload.productPrice = this.props.price;
        payload.sku = this.props.sku;
        payload.groupSku = this.props.groupsku;
        payload.parentGroupSku = this.props.parentgroupsku;

        this.props.dispatch(openNotifyFlyout(payload));
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const findInStoreCtaText = objectPath.get(this.props.pdpConfig, 'findInStoreConfig.ctaText', 'Find in Store');
        const notifyCtaText = objectPath.get(this.props.aem, 'productNotPurchasableConfig.notifyMeButtonText', 'Notify me when available');
        const type = this.props.type || '';
        const isNotify = (type.toUpperCase() === 'NOTIFY');
        const cta = isNotify ? { ctaText: notifyCtaText, ctaAction: this.notifyWhenAvailable } : { ctaText: findInStoreCtaText, ctaAction: this.openChangeStoreModal };
        const htmlCallout = {
            interactionContext: isNotify ? '' : false,
            interactionType: isNotify ? 'tab-activity' : false,
            interactionName: isNotify ? 'notify-me-when-available' : false
        };
        const isFISS = (type.toUpperCase() === 'FIND_IN_STORE');

        return (
            <Fragment>
                <div className="product-action-component">
                    {
                        isFISS &&
                        <MediaQuery query={styleVariables.desktopAndBelow}>
                            <StoreDetail isFISS={isFISS} />
                        </MediaQuery>
                    }
                    <button
                        type="button"
                        className={
                            classNames('secondary-btn',
                                {
                                    'show__desktop-and-above': (isFISS && (this.props.storeDetailStatus || this.props.changeStoreStatus))
                                })
                        }
                        tabIndex={0}
                        onClick={cta.ctaAction}
                        data-interaction-context={htmlCallout.interactionContext}
                        data-interaction-type={htmlCallout.interactionType}
                        data-interaction-name={htmlCallout.interactionName}
                        ref={this.buttonContainer}
                    >
                        <span className="secondary-btn_content" tabIndex={-1}>
                            <span>{cta.ctaText}</span>
                        </span>
                    </button>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        pdpConfig: state.productDetails.pdpConfig,
        price: state.productDetails.productData.price,
        aem: state.aem,
        storeDetailStatus: state.findStore.storeDetailStatus,
        changeStoreStatus: state.findStore.changeStoreStatus,
        iStatusFlyout: state.iStatusFlyout,
        storeDetails: state.findStore.storeDetails
    };
};

ProductAction.propTypes = {
    type: PropTypes.string.isRequired,
    pdpConfig: PropTypes.object.isRequired,
    productconfig: PropTypes.string,
    storeDetailStatus: PropTypes.bool.isRequired,
    changeStoreStatus: PropTypes.bool.isRequired,
    productname: PropTypes.string,
    aem: PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired,
    price: PropTypes.array.isRequired,
    sku: PropTypes.string,
    groupsku: PropTypes.string,
    parentgroupsku: PropTypes.string,
    iStatusFlyout: PropTypes.object,
    storeDetails: PropTypes.object.isRequired
};

ProductAction.defaultProps = {
    productconfig: '',
    productname: '',
    sku: '',
    groupsku: '',
    parentgroupsku: '',
    iStatusFlyout: {
        productFlyoutOpenState: false
    }
};

export default connect(mapStateToProps)(ProductAction);
