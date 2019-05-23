import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import MediaQuery from 'react-responsive';
import classNames from 'classnames';

import styleVariables from 'lib/utils/breakpoints';

import InformationText from 'components/common/InformationText';
import { setAnalyticsData, triggerAnalyticsEvent } from 'lib/utils/analytics-util';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
// Actions
import { updateSelectedQuantity } from 'actions/ProductDetailsActions';

// import './index.scss';

/**
 *  ProductQuantity Component
 */
class ProductQuantity extends React.Component {
    /**
     * @returns {void}
     * @param {Object} props properties
     */
    constructor(props) {
        super(props);

        this.state = {
            maxquantity: parseInt(this.props.maxquantity, 10),
            incrementAdaLabel: this.props.labels.incrementAdaLabel,
            decrementAdaLabel: this.props.labels.decrementAdaLabel,
            prev: this.props.selectedQuantity - 1,
            current: this.props.selectedQuantity,
            next: this.props.selectedQuantity + 1,
            increment: false,
            decrement: false
        };
        this.inputRef = React.createRef();
    }

    /**
     * @returns {html} returns product container value
     */
    getProductQuantityValue = () => {
        return (
            <ul
                className={
                    classNames('quantity__container_value', {
                        'update-inc-count': this.state.increment,
                        'update-dec-count': this.state.decrement
                    })
                }
                aria-live="polite"
            >
                <li>{this.state.prev}</li>
                <li className="active">{this.state.current}</li>
                <li>{this.state.next}</li>
            </ul>
        );
    }

    /**
     *
     * @param {Object} event  decrement Quantity click handler
     * @returns {void}
     */
    decrementQuantity = (event) => {
        event.preventDefault();
        const currentQuantity = this.props.selectedQuantity;
        const { quantityCountDelay } = styleVariables;

        if (currentQuantity > 1) {
            setTimeout(() => {
                this.setState({ decrement: true });
            }, 0);
            setTimeout(() => {
                this.setState({ current: currentQuantity - 1 });
            }, quantityCountDelay);

            setTimeout(() => {
                this.setState({ decrement: false });
            }, 200);

            setTimeout(() => {
                this.setState({ prev: currentQuantity - 2, next: currentQuantity });
            }, 230);

            this.props.dispatch(updateSelectedQuantity(currentQuantity - 1));
        }
    }

    /**
     *
     * @param {Object} event  increment Quantity click handler
     * @returns {void}
     */
    incrementQuantity = (event) => {
        event.preventDefault();
        const currentQuantity = this.props.selectedQuantity;
        const { quantityCountDelay } = styleVariables;

        if (currentQuantity < this.state.maxquantity) {
            setTimeout(() => {
                this.setState({ increment: true });
            }, 0);
            setTimeout(() => {
                this.setState({ current: currentQuantity + 1 });
            }, quantityCountDelay);

            setTimeout(() => {
                this.setState({ increment: false });
            }, 200);

            setTimeout(() => {
                this.setState({ prev: currentQuantity, next: currentQuantity + 2 });
            }, 230);

            this.props.dispatch(updateSelectedQuantity(currentQuantity + 1));
        }
    }

    /**
     * @param {Object} event select event
     * @returns {void}
     */
    selectQuantity = (event) => {
        event.preventDefault();
        this.props.dispatch(updateSelectedQuantity(parseInt(event.target.value, 10)));
    }


    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const options = [];
        const { quantityErrorConfig } = this.props.pdpConfig;
        const htmlCallout = {
            interactionContext: '',
            interactionType: 'tab-activity',
            interactionName: 'change-quantity'
        };

        for (let i = 1; i <= this.state.maxquantity; i += 1) {
            options.push(<option key={i.toString()}>{i}</option>);
        }
        if (this.props.maxQuantityError) {
            const errors = objectPath.get(window, 'dataLayer.page.errors', []);
            const errCode = AnalyticsConstants.MAXQUAN_ERROR;

            errors.push(errCode);
            setAnalyticsData('page.errors', errors);
            triggerAnalyticsEvent(AnalyticsConstants.INLINE_ERROR, { errorCode: errCode });
        }

        return (
            <React.Fragment>
                <div className="quantity__container">
                    <span>{this.props.labels.quantity}</span>
                    <MediaQuery query={styleVariables.desktopAndAbove}>
                        <div className="quantity__container_manipulator">
                            <button
                                type="button"
                                aria-label={this.state.decrementAdaLabel}
                                onClick={this.decrementQuantity}
                                onBlur={this.resetQuantityLabels}
                                className={
                                    classNames('quantity__container_manipulator_decrement cta',
                                        {
                                            'visibility-hide': this.props.selectedQuantity === 1
                                        })
                                }
                                data-interaction-context={htmlCallout.interactionContext}
                                data-interaction-type={htmlCallout.interactionType}
                                data-interaction-name={htmlCallout.interactionName}
                            >
                                <span className="cta-content"> - </span>
                            </button>
                            {this.getProductQuantityValue()}
                            <button
                                type="button"
                                aria-label={this.state.incrementAdaLabel}
                                onClick={this.incrementQuantity}
                                onBlur={this.resetQuantityLabels}
                                className={
                                    classNames('quantity__container_manipulator_increment cta',
                                        {
                                            'visibility-hide': this.props.selectedQuantity === this.state.maxquantity
                                        })
                                }
                                data-interaction-context={htmlCallout.interactionContext}
                                data-interaction-type={htmlCallout.interactionType}
                                data-interaction-name={htmlCallout.interactionName}
                            >
                                <span className="cta-content"> + </span>
                            </button>
                        </div>
                    </MediaQuery>
                    <MediaQuery query={styleVariables.desktopAndBelow}>
                        <div className="quantity__container_selector-wrap">
                            <select
                                className="quantity__container_selector-wrap_selector"
                                value={this.props.selectedQuantity}
                                onChange={this.selectQuantity}
                            >
                                {options}
                            </select>
                            <i className="icon-dropdown-down" />
                        </div>
                    </MediaQuery>
                </div>
                {
                    this.props.maxQuantityError &&
                    <div className="quantity__error" tabIndex={-1} role="alert">
                        <InformationText config={quantityErrorConfig} />
                    </div>
                }

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        pdpConfig: state.productDetails.pdpConfig,
        maxQuantityError: state.productDetails.maxQuantityError,
        selectedQuantity: state.productDetails.selectedQuantity,
        labels: state.authoredLabels
    };
};

ProductQuantity.propTypes = {
    selectedQuantity: PropTypes.number,
    maxquantity: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    labels: PropTypes.object.isRequired,
    pdpConfig: PropTypes.object.isRequired,
    maxQuantityError: PropTypes.bool.isRequired
};

ProductQuantity.defaultProps = {
    selectedQuantity: null
};

export default connect(mapStateToProps)(ProductQuantity);
