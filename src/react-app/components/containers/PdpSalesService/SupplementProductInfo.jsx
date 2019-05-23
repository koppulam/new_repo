// Packages
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import getClassificationData from 'lib/utils/supplemental-util';

/**
 * SupplementProductInfo Component
 */
class SupplementProductInfo extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.aem[this.props.config]
        };
    }

    /**
     * @description getSupplementalInfo method capture the SupplementalInfo.
     * @param {object} response API response of productsupplementalinfossystemapi.
     * @param {object} config configuration from window object.
     * @returns {void}
     */
    getPhysicalSpecData = (response, config) => {
        const productSuppInfo = objectPath.get(response, 'productSuppInfo', {});
        const primarySpecDesc = this.checkForDtsGenerated(productSuppInfo.primarySpeciesDesc);
        const primarySpeciesDesc = primarySpecDesc ? `-${primarySpecDesc}` : '';
        const mDesc = this.checkForDtsGenerated(productSuppInfo.materialDesc);
        const metalDesc = mDesc ? `-${mDesc}` : '';
        const sizeText = productSuppInfo.sizeText ? `-${productSuppInfo.sizeText}` : '';

        return [
            {
                key: config.primaryGemstone,
                value: `${objectPath.get(
                    productSuppInfo,
                    'primarySpeciesCode',
                    ''
                )}${primarySpeciesDesc}`
            }, {
                key: config.metalMaterial,
                value: `${objectPath.get(productSuppInfo, 'materialCode', '')}${metalDesc}`
            }, {
                key: config.size,
                value: `${objectPath.get(productSuppInfo, 'sizeCode', '')}${sizeText}`
            }
        ];
    };

    /**
     * @description setClassifications method gets the getMetalData.
     * @param {object} response API response of productsupplementalinfossystemapi.
     * @param {object} config author configired data.
     * @returns {void}
     */
    setClassifications = (response, config) => {
        return (
            <div className="supplement-info_wrapper">
                <div className="supplement-info_wrapper_heading">
                    <h5>{config.originClassification}</h5>
                </div>
                {this.setClassificationDetails(response, config)}
            </div>
        );
    }

    /**
     * @description setClassificationDetails method gets the classificationDetails.
     * @param {object} response API response of productsupplementalinfossystemapi.
     * @param {object} config author configired data.
     * @returns {void}
     */
    setClassificationDetails = (response, config) => {
        const classifications = getClassificationData(response, config);

        return classifications.map((element, index) => {
            return (
                <div
                    className="supplement-info_wrapper_item"
                    key={index.toString()}
                >
                    <label
                        htmlFor={element.key}
                        className="supplement-info_wrapper_item_label"
                    >
                        {element.key}
                    </label>
                    <p
                        id={element.key}
                        className="supplement-info_wrapper_item_text"
                    >
                        {element.value}
                    </p>
                </div>
            );
        });
    };

    /**
     * @description setPhysicalSpec method gets the physicalSpec.
     * @param {object} response API response of productsupplementalinfossystemapi.
     * @param {object} config author configired data.
     * @returns {void}
     */
    setPhysicalSpec = (response, config) => {
        const productSuppInfo = objectPath.get(response, 'productSuppInfo', {});
        const physSpecData = this.getPhysicalSpecData(response, config);
        const metalData = objectPath.get(response, 'productSuppInfoMetal', {});

        return (
            <div className="supplement-info_wrapper">
                <div className="supplement-info_wrapper_heading">
                    <h5>{config.physicalSpec}</h5>
                </div>
                {this.setPhysicalSpecData(physSpecData, config)}
                {this.setMetalData(metalData, config)}
                {this.setUnits(productSuppInfo, config)}
                {this.setDimensions(productSuppInfo, config)}
                <div className="supplement-info_wrapper_item">
                    <label
                        htmlFor={config.noOfPieces}
                        className="supplement-info_wrapper_item_label"
                    >
                        {config.noOfPieces}
                    </label>
                    <p
                        id={config.noOfPieces}
                        className="supplement-info_wrapper_item_text"
                    >
                        {productSuppInfo.numberofPieces}
                    </p>
                </div>
            </div>
        );
    };

    /**
     * @description setDimensions method gets the productSuppInfo.
     * @param {object} response API response of productsupplementalinfossystemapi.
     * @param {object} config author configired data.
     * @returns {void}
     */
    setDimensions = (response, config) => {
        const height = objectPath.get(config, 'height', 'Height in');
        const length = objectPath.get(config, 'length', 'Length in');
        const width = objectPath.get(config, 'width', 'Width in');
        const dimensionOpts = [height, length, width];
        const dimensions = ['Inches', 'MM'];
        const dimConfig = objectPath.get(config, 'units', {});
        const responseKey = [
            'heightin',
            'lengthin',
            'widthin'
        ];

        return dimensionOpts.map((option, index) => {
            const responseDimension = responseKey[`${index}`];

            return dimensions.map((element, ind) => {
                const dim = element ? element.toLowerCase() : ''; // Inches --> inche
                const configDim = dimConfig[`${dim}`]; // Check in config.
                // Configure response key.
                const key = `${responseDimension}${element}`; // Form heightinInches
                const value = response[key];

                return (
                    <div
                        className="supplement-info_wrapper_item"
                        key={ind.toString()}
                    >
                        <label
                            htmlFor={`${option}${configDim}`}
                            className="supplement-info_wrapper_item_label"
                        >
                            {option}
                            &nbsp;
                            {configDim}
                        </label>
                        <p
                            id={`${option}${configDim}`}
                            className="supplement-info_wrapper_item_text"
                        >
                            {value}
                        </p>
                    </div>
                );
            });
        });
    };

    /**
     * @description setDimensions method gets the productSuppInfo.
     * @param {object} response API response of productsupplementalinfossystemapi.
     * @param {object} config author configired data.
     * @returns {void}
     */
    setUnits = (response, config) => {
        const units = ['Grams', 'OZ', 'Lb'];
        const dimConfig = objectPath.get(config, 'units', {});
        const resTotalKey = 'totalWeightin';

        return units.map((element, index) => {
            const key = `${resTotalKey}${element}`;
            const value = response[key];
            const unitKey = element ? element.toLowerCase() : '';
            const keyLabel = dimConfig[`${unitKey}`];

            return (
                <div
                    className="supplement-info_wrapper_item"
                    key={index.toString()}
                >
                    <label
                        htmlFor={`${config.total}${keyLabel}`}
                        className="supplement-info_wrapper_item_label"
                    >
                        {config.total}
                        &nbsp;
                        {keyLabel}
                    </label>
                    <p
                        id={`${config.total}${keyLabel}`}
                        className="supplement-info_wrapper_item_text"
                    >
                        {value}
                    </p>
                </div>
            );
        });
    };

    /**
    * @description setPhysicalSpecData method gets the getMetalData.
    * @param {object} response API response of productsupplementalinfossystemapi.
    * @returns {void}
    */
    setPhysicalSpecData = (response) => {
        return response.map((element, index) => {
            return (
                <div
                    className="supplement-info_wrapper_item"
                    key={index.toString()}
                >
                    <label
                        htmlFor={element.key}
                        className="supplement-info_wrapper_item_label"
                    >
                        {element.key}
                    </label>
                    <p
                        id={element.key}
                        className="supplement-info_wrapper_item_text"
                    >
                        {element.value}
                    </p>
                </div>
            );
        });
    }

    /**
    * @description setMetalData method gets the metal details.
    * @param {object} metalData API response of productsupplementalinfossystemapi.
    * @param {object} config author configired data.
    * @returns {void}
    */
    setMetalData = (metalData, config) => {
        return metalData.map((element, index) => {
            return (
                <Fragment>
                    <div
                        className="supplement-info_wrapper_item"
                        key={index.toString()}
                    >
                        <label
                            htmlFor={`${config.metalType}${index + 1}`}
                            className="supplement-info_wrapper_item_label"
                        >
                            {config.metalType}
                            &nbsp;
                            {index + 1}
                        </label>
                        <p
                            id={`${config.metalType}${index + 1}`}
                            className="supplement-info_wrapper_item_text"
                        >
                            {element.metalCode}
                            -
                            {this.checkForDtsGenerated(element.metalDesc)}
                        </p>
                    </div>
                    <div className="supplement-info_wrapper_item">
                        <label
                            htmlFor={`${config.metalType}${index + 1}-${config.weight}${config.units.grams}`}
                            className="supplement-info_wrapper_item_label"
                        >
                            {/* eslint-disable-next-line */}
                            {config.metalType} {index + 1} - {config.weight} {config.units.grams}
                        </label>
                        <p
                            id={`${config.metalType}${index + 1}-${config.weight}${config.units.grams}`}
                            className="supplement-info_wrapper_item_text"
                        >
                            {element.metalWeightGm}
                        </p>
                    </div>
                    <div className="supplement-info_wrapper_item">
                        <label
                            htmlFor={`${config.metalType}${index + 1}-${config.weight}${config.units.oz}`}
                            className="supplement-info_wrapper_item_label"
                        >
                            {/* eslint-disable-next-line */}
                            {config.metalType} {index + 1} - {config.weight} {config.units.oz}
                        </label>
                        <p
                            id={`${config.metalType}${index + 1}-${config.weight}${config.units.oz}`}
                            className="supplement-info_wrapper_item_text"
                        >
                            {element.metalWeightOz}
                        </p>
                    </div>
                    <div className="supplement-info_wrapper_item">
                        <label
                            htmlFor={`${config.metalType}${index + 1}-${config.weight}${config.units.lb}`}
                            className="supplement-info_wrapper_item_label"
                        >
                            {/* eslint-disable-next-line */}
                            {config.metalType} {index + 1} - {config.weight} {config.units.lb}
                        </label>
                        <p
                            id={`${config.metalType}${index + 1}-${config.weight}${config.units.lb}`}
                            className="supplement-info_wrapper_item_text"
                        >
                            {element.metalWeightLb}
                        </p>
                    </div>
                </Fragment>
            );
        });
    }

    /**
    * @description setIRInfo method gets the IR details.
    * @param {object} response API response of productsupplementalinfossystemapi.
    * @param {object} config author configired data.
    * @returns {void}
    */
    setIRInfo = (response, config) => {
        const IRData = objectPath.get(response, 'productSuppInfo', {});

        return (
            <div className="supplement-info_wrapper">
                <div className="supplement-info_wrapper_heading">
                    <h5>{config.IRHeading}</h5>
                </div>
                {this.setIRDetails(IRData, config)}
            </div>
        );
    }

    /**
    * @description setSkuMemo method gets the IR details.
    * @param {object} response API response of productsupplementalinfossystemapi.
    * @param {object} config author configired data.
    * @returns {void}
    */
    setSkuMemo = (response, config) => {
        const skuMemoVal = objectPath.get(response, 'productSuppInfo.memo', '');
        const skuMemoLabel = objectPath.get(config, 'skuMemoLabel', 'SKU MEMO');

        return (
            <div className="supplement-info_wrapper">
                <div className="supplement-info_wrapper_heading">
                    <h5>{skuMemoLabel}</h5>
                </div>
                <div className="supplement-info_wrapper_item">
                    <p
                        className="supplement-info_wrapper_item_text sku_memo_content"
                    >
                        {skuMemoVal}
                    </p>
                </div>
            </div>
        );
    }

    /**
    * @description setIRInfo method gets the IR details.
    * @param {object} IRData API response of productsupplementalinfossystemapi.
    * @param {object} config author configired data.
    * @returns {void}
    */
    setIRDetails = (IRData, config) => {
        return (
            <Fragment>
                <div className="supplement-info_wrapper_item">
                    <label
                        htmlFor={config.IRFlag}
                        className="supplement-info_wrapper_item_label"
                    >
                        {config.IRFlag}
                    </label>
                    <p
                        id={config.IRFlag}
                        className="supplement-info_wrapper_item_text"
                    >
                        {IRData.irFlag}
                    </p>
                </div>
                <div className="supplement-info_wrapper_item">
                    <label
                        htmlFor={config.gemColor}
                        className="supplement-info_wrapper_item_label"
                    >
                        {config.gemColor}
                    </label>
                    <p
                        id={config.gemColor}
                        className="supplement-info_wrapper_item_text"
                    >
                        {IRData.gemColorCode}
                        -
                        {this.checkForDtsGenerated(IRData.gemColorDesc)}
                    </p>
                </div>
                <div className="supplement-info_wrapper_item">
                    <label
                        htmlFor={config.gemclarity}
                        className="supplement-info_wrapper_item_label"
                    >
                        {config.gemclarity}
                    </label>
                    <p
                        id={config.gemclarity}
                        className="supplement-info_wrapper_item_text"
                    >
                        {IRData.gemClarityCode}
                        -
                        {this.checkForDtsGenerated(IRData.gemClarityDesc)}
                    </p>
                </div>
            </Fragment>
        );
    }

    /**
    * @description setIRInfo method gets the IR details.
    * @param {object} response API response of productsupplementalinfossystemapi.
    * @param {object} config author configired data.
    * @returns {void}
    */
    setService = (response, config) => {
        const productSuppInfo = objectPath.get(response, 'productSuppInfo', {});
        const prodSuppInfoService = objectPath.get(response, 'productSuppInfoService', {});
        const prodSuppInfoEng = objectPath.get(response, 'productSuppInfoEngraving', {});
        const engravingText = this.showEngravingText(prodSuppInfoEng);

        return (
            <div className="supplement-info_wrapper">
                <div className="supplement-info_wrapper_heading">
                    <h5>{config.servicingInfo}</h5>
                </div>
                <div className="supplement-info_wrapper_item">
                    <label
                        htmlFor={config.serviceableFlag}
                        className="supplement-info_wrapper_item_label"
                    >
                        {config.serviceableFlag}
                    </label>
                    <p
                        id={config.serviceableFlag}
                        className="supplement-info_wrapper_item_text"
                    >
                        {productSuppInfo.serviceable}
                    </p>
                </div>
                {this.setServicingTypes(prodSuppInfoService, config)}
                <div className="supplement-info_wrapper_item">
                    <label
                        htmlFor={config.eCommEngravingAttr}
                        className="supplement-info_wrapper_item_label"
                    >
                        {config.eCommEngravingAttr}
                    </label>
                    <p
                        id={config.eCommEngravingAttr}

                        className="supplement-info_wrapper_item_text"
                    >
                        {engravingText}
                        <br />
                        {(productSuppInfo.engvPositionName && productSuppInfo.engvPositionName.length > 0) ? config.ecommengravingposition : ''}
                        &nbsp;
                        {productSuppInfo.engvPositionName}
                        <br />
                        {(productSuppInfo.engravingQuantity && productSuppInfo.engravingQuantity > 0) ? config.ecommengravingquantity : ''}
                        &nbsp;
                        {(productSuppInfo.engravingQuantity && productSuppInfo.engravingQuantity > 0) ? productSuppInfo.engravingQuantity : ''}
                    </p>
                </div>
            </div>
        );
    }

    /**
    * @description setServicingTypes method sets the servicing info.
    * @param {object} response API response of productsupplementalinfossystemapi.
    * @param {object} config author configired data.
    * @returns {void}
    */
   setServicingTypes = (response, config) => {
       return response.map((element, index) => {
           const item = index + 1;

           return (
               <div
                   className="supplement-info_wrapper_item"
                   key={item.toString()}
               >
                   <label
                       htmlFor={`${config.servicingType}${item}`}
                       className="supplement-info_wrapper_item_label"
                   >
                       {config.servicingType}
                       &nbsp;
                       {item}
                   </label>
                   <p
                       id={`${config.servicingType}${item}`}
                       className="supplement-info_wrapper_item_text"
                   >
                       {this.checkForDtsGenerated(element.serviceDesc)}
                       &nbsp;
                       -
                       &nbsp;
                       {this.checkForDtsGenerated(element.serviceDesc)}
                   </p>
               </div>
           );
       });
   };

    /**
    * @description setIRInfo method gets the IR details.
    * @param {object} response API response of productsupplementalinfossystemapi.
    * @param {object} config author configired data.
    * @returns {void}
    */
    setPackaging = (response, config) => {
        const productSuppInfo = objectPath.get(response, 'productSuppInfo', {});
        const productSuppAttachment = objectPath.get(response, 'productSuppInfoAttachment', {});

        return (
            <div className="supplement-info_wrapper">
                <div className="supplement-info_wrapper_heading">
                    <h5>{config.packagingInformationLabel}</h5>
                </div>
                <div className="supplement-info_wrapper_item">
                    <label
                        htmlFor={config.takebox}
                        className="supplement-info_wrapper_item_label"
                    >
                        {config.takebox}
                    </label>
                    <p
                        id={config.takebox}
                        className="supplement-info_wrapper_item_text"
                    >
                        {productSuppInfo.takeBoxCode}
                        &nbsp;
                        -
                        &nbsp;
                        {this.checkForDtsGenerated(productSuppInfo.takeBoxDesc)}
                    </p>
                </div>
                <div className="supplement-info_wrapper_item">
                    <label
                        htmlFor={config.sendBox}
                        className="supplement-info_wrapper_item_label"
                    >
                        {config.sendBox}
                    </label>
                    <p
                        id={config.sendBox}
                        className="supplement-info_wrapper_item_text"
                    >
                        {productSuppInfo.sendBoxCode}
                        &nbsp;
                        -
                        &nbsp;
                        {this.checkForDtsGenerated(productSuppInfo.sendBoxDesc)}
                    </p>
                </div>
                <div className="supplement-info_wrapper_item">
                    <label
                        htmlFor={config.pouch}
                        className="supplement-info_wrapper_item_label"
                    >
                        {config.pouch}
                    </label>
                    <p
                        id={config.pouch}
                        className="supplement-info_wrapper_item_text"
                    >
                        {productSuppInfo.flannelPouchCode}
                        &nbsp;
                        -
                        &nbsp;
                        {this.checkForDtsGenerated(productSuppInfo.flannelPouchDesc)}
                    </p>
                </div>
                {
                    productSuppAttachment.length > 0 &&
                    <div className="supplement-info_wrapper_item">
                        <label
                            htmlFor={config.attachment}
                            className="supplement-info_wrapper_item_label"
                        >
                            {config.attachment}
                        </label>
                        <p
                            id={config.attachment}
                            className="supplement-info_wrapper_item_text"
                        >
                            {productSuppAttachment[0].attachmentCode}
                            &nbsp;
                            -
                            &nbsp;
                            {this.checkForDtsGenerated(productSuppAttachment[0].attachmentDesc)}
                        </p>
                    </div>
                }
            </div>
        );
    }

    /**
    * @description setIRInfo method gets the IR details.
    * @param {object} response API response of productsupplementalinfossystemapi.
    * @param {object} config author configired data.
    * @returns {void}
    */
    setTicket = (response, config) => {
        const productSuppInfo = objectPath.get(response, 'productSuppInfo', {});

        return (
            <div className="supplement-info_wrapper">
                <div className="supplement-info_wrapper_heading">
                    <h5>{config.ticket}</h5>
                </div>
                <div className="supplement-info_wrapper_item">
                    <label
                        htmlFor={config.ticketDesc}
                        className="supplement-info_wrapper_item_label"
                    >
                        {config.ticketDesc}
                    </label>
                    <p
                        id={config.ticketDesc}
                        className="supplement-info_wrapper_item_text"
                    >
                        {this.checkForDtsGenerated(productSuppInfo.ticketDescription1)}
                        {this.checkForDtsGenerated(productSuppInfo.ticketDescription2)}
                        {this.checkForDtsGenerated(productSuppInfo.ticketDescription3)}
                    </p>
                </div>
            </div>
        );
    }

    /**
    * @description showEngravingText method gets the engraving details.
    * @param {object} response API response of productSuppInfoEngraving.
    * @returns {void}
    */
    showEngravingText = (response) => {
        let engText = '';

        if (response && response.length > 0) {
            response.forEach((ele, index) => {
                let updatedText = this.checkForDtsGenerated(ele.engravingAttribute);

                if (index < (response.length - 1)) {
                    updatedText = `${this.checkForDtsGenerated(ele.engravingAttribute)}, `;
                }

                engText += updatedText;
            });
        }

        return engText;
    };

    /**
     * @description checkForDtsGenerated method checks for DTS GENERATED
     * @param {string} desc response key check.
     * @returns {void}
     */
    checkForDtsGenerated = (desc) => {
        if (desc && desc.toUpperCase() !== 'DTS GENERATED') {
            return desc;
        }

        return '';
    }

    /**
     * @description showGemLabel method checks whether to show gemelogical report
     * @param {Object} response response object from API response.
     * @returns {void}
     */
    showGemLabel = (response) => {
        const productSuppInfo = objectPath.get(response, 'productSuppInfo', {});
        const gemLabFlag = productSuppInfo.gemLabFlag ? productSuppInfo.gemLabFlag.toUpperCase() : false;

        return gemLabFlag === 'TRUE';
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const config = objectPath.get(this.state, 'config', {});
        const sku = objectPath.get(this.props.aem, 'supplementalDefaultSku', '');
        let headingText = objectPath.get(config, 'headingText', '');
        const {
            gemologicalCta,
            physicalSpecConfig,
            classificationConfig,
            servicingConfig,
            IRConfig,
            skuMemoConfig,
            packagingConfig,
            ticketConfig
        } = config;
        const response = objectPath.get(this.props.salesService, 'productSupplementalInfo', {});

        headingText = headingText.replace('{}', sku);
        return (
            <article className="supplement-info">
                <h4 className="supplement-info_heading">{headingText}</h4>
                {
                    gemologicalCta && this.showGemLabel(response) &&
                    <div className="supplement-info_gemological-cta">
                        <a
                            href={gemologicalCta.ctaLink}
                            tabIndex={0}
                            className="cta"
                            target={gemologicalCta.ctaTarget}
                        >
                            <span className="cta-content">
                                <span className="cta-text" tabIndex={-1}>
                                    {gemologicalCta.ctaText}
                                </span>
                            </span>
                            <span className="icon-dropdown-right" />
                        </a>
                    </div>
                }
                <div className="supplement-info_container">
                    <div className="supplement-info_container_item-1">
                        {this.setPhysicalSpec(response, physicalSpecConfig)}
                        {this.setIRInfo(response, IRConfig)}
                        {this.setSkuMemo(response, skuMemoConfig)}
                    </div>
                    <div className="supplement-info_container_item-2">
                        {this.setClassifications(response, classificationConfig)}
                        {this.setService(response, servicingConfig)}
                        {this.setPackaging(response, packagingConfig)}
                        {this.setTicket(response, ticketConfig)}
                    </div>
                </div>
            </article>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        salesService: state.salesService
    };
};

SupplementProductInfo.propTypes = {
    config: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired,
    salesService: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(SupplementProductInfo);
