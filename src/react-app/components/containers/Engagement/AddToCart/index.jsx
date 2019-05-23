import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { connect } from 'react-redux';
import classNames from 'classnames';
// import { currencyFormatter } from 'lib/utils/currency-formatter';
import styleVariables from 'lib/utils/breakpoints';

// import './index.scss';

/**
 *  AddToCart Component
 */
class AddToCart extends React.Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.state = {
            addToBagAnimation: false,
            isDisabled: false
        };
    }

    /**
     * @description Life cycle hook
     * @param {any} nextProps next Props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.isInBag !== this.props.isInBag && !nextProps.show1B) {
            this.setState({ addToBagAnimation: nextProps.isInBag });
        }
        if (nextProps.isInWishList !== this.props.isInWishList && nextProps.show1B) {
            this.setState({ addToBagAnimation: nextProps.isInWishList });
        }
    }

    /**
     * Add to cart - adds active class to button on click
     * @param {Object} event add to cart handler
     * @returns {void}
     */
    addToCartHandler = (event) => {
        event.preventDefault();
        if ((!this.props.show1B && !this.props.isInBag) || (this.props.show1B && !this.props.isInWishList)) {
            this.props.onAdd();
        }
    }

    /**
     * @description Renders text to be shown on button
     * @param {BBoolean} isMobile boolean to identify if its mobile
     * @returns {object} html instance
     */
    textToShowOnButton = (isMobile) => {
        const {
            buttonText,
            labels,
            addToBagActiveTextForMobile,
            addToBagActive,
            addToBagHoverLabel
        } = this.props;

        if (this.state.addToBagAnimation) {
            return (
                <span>
                    {
                        buttonText ||
                        (
                            isMobile
                                ?
                                (addToBagActiveTextForMobile || labels.addToBagActiveTextForMobile)
                                :
                                addToBagActive || labels.addToBagActive
                        )
                    }
                </span>
            );
        }
        return (
            <div>
                <span>
                    {
                        buttonText ||
                        labels.addToBag
                    }
                </span>
                <span>
                    {
                        buttonText ||
                        addToBagHoverLabel ||
                        labels.addToBagHoverLabel ||
                        labels.addToBag
                    }
                </span>
            </div>
        );
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            price,
            congratsText,
            isInBag,
            isInWishList,
            show1B,
            fromEnPage
        } = this.props;
        const showBtn = (!show1B && !isInBag) || (show1B && !isInWishList) || this.state.isDisabled || (this.state.addToBagAnimation && !fromEnPage);

        return (
            <Fragment>
                {
                    showBtn &&
                    <div className="engagement-pdp__product-description__addtobag">
                        <button
                            type="button"
                            disabled={this.state.isDisabled}
                            className={
                                classNames('engagement-pdp__product-description__addtobag_btn', {
                                    'active-btn': this.state.addToBagAnimation
                                })
                            }
                            onClick={this.addToCartHandler}
                            onKeyDown={(e) => {
                                if ((e.type === 'keydown' && e.key === 'Enter')) {
                                    this.addToCartHandler();
                                }
                            }}
                            aria-label={this.state.addToBagAnimation ? congratsText : `${price} ${this.props.buttonText || this.props.labels.addToBag}`}
                        >
                            <div className="engagement-pdp__product-description__addtobag_btn_curtain">
                                <span>{congratsText}</span>
                            </div>
                            <div className="engagement-pdp__product-description__addtobag_btn_text-static">
                                <span className="engagement-pdp__product-description__addtobag_btn_text-static_price-wrapper">
                                    <span className="engagement-pdp__product-description__addtobag_btn_text-static_price-wrapper_price">
                                        {price}
                                    </span>
                                </span>
                                <MediaQuery query={styleVariables.desktopAndAbove}>
                                    <div className="engagement-pdp__product-description__addtobag_btn_text-static_addtobagtext">
                                        {
                                            this.textToShowOnButton()
                                        }
                                    </div>
                                </MediaQuery>
                                <MediaQuery query={styleVariables.desktopAndBelow}>
                                    <div className="engagement-pdp__product-description__addtobag_btn_text-static_addtobagtext">
                                        {
                                            this.textToShowOnButton('isMobile')
                                        }
                                    </div>
                                </MediaQuery>
                            </div>
                        </button>
                    </div>
                }
            </Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        labels: state.authoredLabels
    };
};

AddToCart.propTypes = {
    price: PropTypes.string.isRequired,
    addToBagActive: PropTypes.bool.isRequired,
    addToBagActiveTextForMobile: PropTypes.string.isRequired,
    addToBagHoverLabel: PropTypes.string,
    labels: PropTypes.object.isRequired,
    buttonText: PropTypes.string.isRequired,
    isInBag: PropTypes.bool.isRequired,
    isInWishList: PropTypes.bool.isRequired,
    onAdd: PropTypes.func.isRequired,
    congratsText: PropTypes.string.isRequired,
    show1B: PropTypes.bool.isRequired
};

AddToCart.defaultProps = {
    addToBagHoverLabel: ''
};

export default connect(mapStateToProps)(AddToCart);
