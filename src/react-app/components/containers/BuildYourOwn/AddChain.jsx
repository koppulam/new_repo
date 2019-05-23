// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import Picture from 'components/common/Picture';
import classNames from 'classnames';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

import { setAnalyticsData, triggerAnalyticsEvent, transformProductObject } from 'lib/utils/analytics-util';
import {
    showGrid,
    isBraceletSelected,
    changeClaspEnabled,
    removeFixture,
    saveDrawer
} from 'actions/BYOActions';
import { currencyFormatter } from 'lib/utils/currency-formatter';
import includes from 'lodash/includes';

import SelectChain from './SelectChain';

/**
 * Add Chain Modal
 */
class AddChain extends React.Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            selectedChain: this.props.byo.selectedFixture,
            productData: {},
            isChainChanged: false,
            fixtureCompleteRequest: objectPath.get(window, 'tiffany.authoredContent.byoConfig.fixtureCompleteRequest', {})
        };
        this.addChainClose = React.createRef();
    }

    /**
     * @param {obj} obj selected chain
     * @returns {object} html structure
     */
    updateChain = (obj) => {
        const sizes = objectPath.get(obj, 'fixtureDetails.isSilhouette', false) ? false : objectPath.get(obj, 'productDetails.0.groupItems', false);
        const sizeSelected = objectPath.get(obj, 'sizes.linkText', false);

        if (Object.keys(obj).length > 0) {
            this.setState({
                selectedChain: obj.fixtureDetails,
                productData: obj
            }, () => {
                if (sizes && sizes.length > 0 && !sizeSelected) {
                    this.setState({ isChainChanged: false });
                } else {
                    this.setState({ isChainChanged: true });
                }
            });
        }
    }

    /**
     * @returns {object} html structure
     */
    saveChain = () => {
        const isSilhoutte = objectPath.get(this.state, 'productData.fixtureDetails.isSilhouette', false);

        if (this.state.isChainChanged) {
            if (isSilhoutte) {
                this.props.dispatch(removeFixture());
                this.props.dispatch(saveDrawer());
                this.props.dispatch(isBraceletSelected(false));
                this.props.closeModal();
            } else {
                const request = JSON.parse(JSON.stringify(this.state.fixtureCompleteRequest));
                const braceletId = objectPath.get(window, 'tiffany.authoredContent.byoConfig.productTypeDescription', false);
                const isBracelet = objectPath.get(this.state.productData, 'fixtureDetails.productTypeDescription', '').toString() === braceletId;
                const mountTypeId = objectPath.get(window, 'tiffany.authoredContent.byoConfig.claspMountTypeId', '');
                const isMountTypeClasp = includes(objectPath.get(this.state.productData, 'fixtureDetails.mountTypes', []), mountTypeId);

                const byoStep = objectPath.get(window, 'dataLayer.byo', {});
                const fixtureDetails = objectPath.get(this.state, 'productData.fixtureDetails', {});

                fixtureDetails.isAvailableOnline = true;
                byoStep.chain = transformProductObject(fixtureDetails);
                byoStep.chain.requiresClaspingLink = false;

                setAnalyticsData('byo', byoStep);
                triggerAnalyticsEvent(AnalyticsConstants.UPDATED_BYO, { });

                if (mountTypeId && isMountTypeClasp) {
                    this.props.dispatch(changeClaspEnabled(true));
                } else {
                    this.props.dispatch(changeClaspEnabled(false));
                }
                request.payload.Sku = objectPath.get(this.state.productData, 'sizes.memberSku', false) || objectPath.get(this.state.productData, 'sizes.selectedSku', false) || this.state.productData.fixtureDetails.selectedSku || this.state.productData.fixtureDetails.sku;
                this.props.dispatch(showGrid(true, this.state.productData));
                if (isBracelet) {
                    this.props.dispatch(isBraceletSelected(true));
                } else {
                    this.props.dispatch(isBraceletSelected(false));
                }
                this.props.closeModal();
            }
        }
    }

    /**
     * @returns {object} Element
     */
    render() {
        const addChainLabel = objectPath.get(this.props.labels.byo, 'addChain', {});
        const mountTypeId = objectPath.get(window, 'tiffany.authoredContent.byoConfig.claspMountTypeId', '');
        const isClaspRequired = includes(objectPath.get(this.state.selectedChain, 'mountTypes', []), mountTypeId);

        return (
            <div className="add-chain__container">
                <div className="add-chain__container_body">
                    <div className="add-chain__container_body-image">
                        {(this.state.selectedChain.imageLarge || this.state.selectedChain.image) &&
                            <Picture
                                defaultSrc={this.state.selectedChain.imageLarge || this.state.selectedChain.image}
                                altText={this.state.selectedChain.title}
                                customClass=""
                                isLazyLoad={false}
                            />
                        }
                    </div>
                    <div className="add-chain__container_body-content add-chain__content">
                        <div className="add-chain__container-content">
                            <p className="add-chain__content-heading">{addChainLabel.headingText}</p>
                            <p className="add-chain__content-title">{this.state.selectedChain.isSilhouette ? addChainLabel.noSelectionText : this.state.selectedChain.title}</p>
                            {!this.state.selectedChain.isSilhouette &&
                                <p className="add-chain__content-description">{this.state.selectedChain.shortDescription}</p>
                            }
                            <p
                                className={
                                    classNames('add-chain__content-price',
                                        {
                                            clasp: isClaspRequired
                                        })
                                }
                            >
                                {currencyFormatter(this.state.selectedChain.price)}
                            </p>
                            {isClaspRequired &&
                                <p className="add-chain__content-price-clasp">{addChainLabel.claspMessage}</p>
                            }
                            <SelectChain updateChain={this.updateChain} addChainCloseRef={this.addChainClose} />
                        </div>
                        <div className="add-chain__content-actions">
                            <button
                                type="button"
                                className="add-chain__content-cancel"
                                aria-label={addChainLabel.cancelText}
                                onClick={() => {
                                    this.props.closeModal();
                                }}
                            >
                                {addChainLabel.cancelText}
                            </button>
                            <button
                                type="button"
                                className={
                                    classNames('add-chain__content-done',
                                        {
                                            changed: this.state.isChainChanged
                                        })
                                }
                                aria-label={addChainLabel.doneText}
                                onClick={this.saveChain}
                                disabled={!this.state.isChainChanged}
                            >
                                {addChainLabel.doneText}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="add-chain__container_footer">
                    <button
                        type="button"
                        aria-label={addChainLabel.closeText}
                        className="add-chain__container-close icon-Close"
                        ref={this.addChainClose}
                        onClick={() => {
                            this.props.closeModal();
                        }}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        byo: state.byo,
        labels: state.authoredLabels
    };
};

AddChain.defaultProps = {
    closeModal: () => { }
};

AddChain.propTypes = {
    dispatch: PropTypes.func.isRequired,
    byo: PropTypes.object.isRequired,
    closeModal: PropTypes.func,
    labels: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(AddChain);
