// Packages
import React from 'react';
import * as objectPath from 'object-path';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProductSupplementalInfo } from 'actions/SalesServiceActions';
import { getSalesServiceCookie } from 'lib/utils/salesService-util';
import { findFirst } from 'lib/dom/dom-util';
import TiffanyInlineModal from 'components/common/TiffanyInlineModal';
import Picture from 'components/common/Picture';
import SupplementProductInfo from './SupplementProductInfo';
// import './index.scss';
/**
 * Marketing tile component
 */
class PdpSalesService extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        const salesSrvSite = getSalesServiceCookie();
        const requestPayload = objectPath.get(this.props.aem, 'supplementalServiceApiConfig', {});

        this.state = {
            salesSrvSite,
            config: this.props.aem[this.props.config],
            requestPayload,
            showSupplementModal: false,
            modalHeight: 0,
            heightToIgnore: 0
        };

        this.supplemntInfoIcon = React.createRef();
    }

    /**
     * @returns {void}
     */
    componentDidMount() {
        if (this.state.salesSrvSite) {
            this.props.dispatch(getProductSupplementalInfo(this.state.requestPayload));
        }
    }

    /**
     * @description onInfoIconClick method invokes on info icon click.
     * @returns {void}
     */
    onInfoIconClick = () => {
        this.setState({ showSupplementModal: true });
    };

    /**
     * @description getSupplementalInfo method capture the productSumplementalInfo to
     * @param {object} salesService API response of productsupplementalinfossystemapi.
     * @returns {void}
     */
    getSupplementalInfo = salesService => {
        const suppInfo = objectPath.get(salesService, 'productSuppInfo', {});
        const prodSrvc = objectPath.get(salesService, 'productSuppInfoService', {});
        const departmentDesc = suppInfo.departmentDesc ? `-${suppInfo.departmentDesc}` : '';
        const classDesc = suppInfo.classDesc ? `-${suppInfo.classDesc}` : '';
        const styleDesc = suppInfo.styleDesc ? `-${suppInfo.styleDesc}` : '';
        const servicingType = objectPath.get(prodSrvc[0], 'serviceDesc', '');
        const sku = objectPath.get(this.props.aem, 'supplementalDefaultSku', '');
        let serviceableFlag = suppInfo.serviceable ? suppInfo.serviceable.toUpperCase() : '';

        if (serviceableFlag === 'TRUE') {
            serviceableFlag = 'Y';
        } else if (serviceableFlag === 'FALSE') {
            serviceableFlag = 'N';
        }

        return {
            sku,
            department: `${objectPath.get(suppInfo, 'departmentCode', '')}${departmentDesc}`,
            class: `${objectPath.get(suppInfo, 'classCode', '')}${classDesc}`,
            style: `${objectPath.get(suppInfo, 'styleCode', '')}${styleDesc}`,
            mipStatus: suppInfo.mipsStatus,
            serviceableFlag,
            servicingType
        };
    };

    /**
    * @description method to be called after engraving is all set
    * @param {Array} components elemenst to consider for height
    * @returns {void}
    */
    setHeightOfEngraving = (components) => {
        let heightToExclude = 0;

        components.forEach(element => {
            heightToExclude += (findFirst(element) ? findFirst(element).getBoundingClientRect().height : 0);
        });

        this.setState({
            modalHeight: `calc(100% - ${heightToExclude}px)`,
            heightToIgnore: `${heightToExclude}px`
        });
    }

    /**
    * Reset modal state object.
    * @returns {void}
    */
    resetModal = () => {
        this.setState({ showSupplementModal: false });
    }

    /**
     * @description inlineModalInit Initiate the inline modal
     * @returns {void}
     */
    inlineModalInit = () => {
        this.setHeightOfEngraving(this.props.elementsToConsiderForHeight);
    }


    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const { config } = this.state;
        const info = objectPath.get(config, 'infoIconconfig', {});
        const modalConfig = objectPath.get(config, 'modalConfig', {});
        const apiRes = objectPath.get(this.props.salesService, 'productSupplementalInfo', {});
        let prodInfo = {};

        if (Object.keys(apiRes).length > 0) {
            prodInfo = this.getSupplementalInfo(apiRes);
        }

        return (this.state.salesSrvSite && config && Object.keys(prodInfo).length > 0) ? (
            <article className="pdp-sales-service">
                {prodInfo.sku && (
                    <div className="pdp-sales-service__container">
                        <label
                            htmlFor="sales-src-sku"
                            className="pdp-sales-service__container_label"
                        >
                            {config.sku}
                        </label>
                        <p id="sales-src-sku" className="pdp-sales-service__container_text">
                            {prodInfo.sku}
                            {
                                info &&
                                <button
                                    type="button"
                                    className="pdp-sales-service__container_icon cta"
                                    onClick={this.onInfoIconClick}
                                    aria-label={info.ariaLabel}
                                    ref={this.supplemntInfoIcon}
                                >
                                    <Picture
                                        defaultSrc={objectPath.get(info, 'icon', './icons/information.svg')}
                                        altText={objectPath.get(info, 'altText', 'Info icon')}
                                        customClass="sales-service-tool-tip-icon"
                                        isLazyLoad={false}
                                    />
                                </button>
                            }
                        </p>
                    </div>
                )}
                {prodInfo.department && (
                    <div className="pdp-sales-service__container">
                        <label
                            htmlFor="sales-service-department"
                            className="pdp-sales-service__container_label"
                        >
                            {config.department}
                        </label>
                        <p
                            id="sales-service-department"
                            className="pdp-sales-service__container_text"
                        >
                            {prodInfo.department}
                        </p>
                    </div>
                )}
                {prodInfo.class && (
                    <div className="pdp-sales-service__container">
                        <label
                            htmlFor="sales-service-class"
                            className="pdp-sales-service__container_label"
                        >
                            {config.class}
                        </label>
                        <p id="sales-service-class" className="pdp-sales-service__container_text">
                            {prodInfo.class}
                        </p>
                    </div>
                )}
                {prodInfo.style && (
                    <div className="pdp-sales-service__container">
                        <label
                            htmlFor="sales-service-style"
                            className="pdp-sales-service__container_label"
                        >
                            {config.style}
                        </label>
                        <p id="sales-service-style" className="pdp-sales-service__container_text">
                            {prodInfo.style}
                        </p>
                    </div>
                )}
                {prodInfo.mipStatus && (
                    <div className="pdp-sales-service__container">
                        <label
                            htmlFor="sales-service-mip-status"
                            className="pdp-sales-service__container_label"
                        >
                            {config.MIPStatus}
                        </label>
                        <p
                            id="sales-service-mip-status"
                            className="pdp-sales-service__container_text"
                        >
                            {prodInfo.mipStatus}
                        </p>
                    </div>
                )}
                {prodInfo.serviceableFlag && (
                    <div className="pdp-sales-service__container">
                        <label
                            htmlFor="sales-service-service-servicable-flag"
                            className="pdp-sales-service__container_label"
                        >
                            {config.serviceableFlag}
                        </label>
                        <p
                            id="sales-service-service-servicable-flag"
                            className="pdp-sales-service__container_text"
                        >
                            {prodInfo.serviceableFlag}
                        </p>
                    </div>
                )}
                {prodInfo.servicingType && (
                    <div className="pdp-sales-service__container">
                        <label
                            htmlFor="sales-service-service-servicable-type"
                            className="pdp-sales-service__container_label"
                        >
                            {config.servicingType}
                        </label>
                        <p
                            id="sales-service-service-servicable-type"
                            className="pdp-sales-service__container_text"
                        >
                            {prodInfo.servicingType}
                        </p>
                    </div>
                )}
                <TiffanyInlineModal
                    childComponentInit={this.inlineModalInit}
                    showModal={this.state.showSupplementModal}
                    customClass="supplement-product-info"
                    triggerElement={this.supplemntInfoIcon.current}
                    showLeftArrow
                    blockScrollInDesktop
                    closeAriaLabel={modalConfig.closeAriaLabel}
                    leftArrowAriaLabel={modalConfig.leftArrowAriaLabel}
                    resetInitiator={this.resetModal}
                    inlineStyles={{ height: this.state.modalHeight, top: this.state.heightToIgnore }}
                    trasitionInlineStyles={{ height: this.state.modalHeight, top: this.state.heightToIgnore }}
                    transitionProps={{
                        timeout: 1000,
                        classNames: {
                            enter: 'supplement-product-info-modal-animation_enter',
                            enterActive: 'supplement-product-info-modal-animation_enter-active',
                            enterDone: 'supplement-product-info-modal-animation_enter-done',
                            exit: 'supplement-product-info-modal-animation_exit',
                            exitActive: 'supplement-product-info-modal-animation_exit-active',
                            exitDone: 'supplement-product-info-modal-animation_exit-done'
                        }
                    }}
                >
                    <SupplementProductInfo config="supplementalProdInfoConfig" />
                </TiffanyInlineModal>
            </article>
        ) : null;
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        salesService: state.salesService
    };
};

PdpSalesService.propTypes = {
    config: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired,
    salesService: PropTypes.object.isRequired,
    elementsToConsiderForHeight: PropTypes.array
};

PdpSalesService.defaultProps = {
    elementsToConsiderForHeight: ['.header .header__nav-container', '.global-banner', '.choose-country']
};

export default connect(mapStateToProps)(PdpSalesService);
