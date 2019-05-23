import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { findFirst } from 'lib/dom/dom-util';
import * as objectPath from 'object-path';
import { scrollTo } from 'lib/utils/scroll-to-content';
import TiffanyInlineModal from 'components/common/TiffanyInlineModal';
import Engraving from 'components/containers/Engraving';

// import './index.scss';

/**
 * @description Browse Engraving component for all Engravings
 * @class BrowseEngraving
 */
class PDPEngraving extends React.Component {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.state = {
            showEngravings: false,
            currentScrollPosition: 0,
            modalHeight: 0,
            heightToIgnore: 0
        };

        this.triggerElement = React.createRef();
    }

    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentDidMount() {
        this.container = findFirst('.pdp-container');
    }

    /**
     * @description method to be called after engraving is all set
     * @param {Array} components elemenst to consider for height
     * @returns {void}
     */
    setHeightOfEngraving(components) {
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
     * @description method to update boolean that will open the inline modal
     * @param {Boolean} showEngravings value to set
     * @returns {void}
     */
    toggleModal(showEngravings) {
        if (showEngravings) {
            const scrollTop = window.pageYOffset;

            this.setState({
                currentScrollPosition: scrollTop,
                showEngravings
            }, () => {
                scrollTo('body');
            });
        } else {
            // waiting for DOM to load
            this.setState({
                showEngravings
            }, () => {
                if (this.state.currentScrollPosition !== 0) {
                    scrollTo('body', this.state.currentScrollPosition);
                }
            });
        }
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const { engraving } = this.props.authoredLabels;

        return (
            this.props.showComponent ?
                <Fragment>
                    <div className="pdp-engravingText">
                        <button
                            type="button"
                            className="pdp-engravingText__btn underline-cta cta"
                            onClick={() => { this.toggleModal(true); }}
                            data-interaction-context=""
                            data-interaction-type="tab-activity"
                            data-interaction-name="engraving"
                            ref={this.triggerElement}
                        >
                            <span className="cta-content" tabIndex={-1}>
                                <span className="pdp-engravingText__btn_label cta-text">
                                    {objectPath.get(this.props.authoredLabels, 'engraving.cta', 'Engadfasdfravable')}
                                </span>
                            </span>
                        </button>
                        <TiffanyInlineModal
                            showModal={this.state.showEngravings}
                            customClass="engraving pdp-engraving has-input-elements"
                            triggerElement={this.triggerElement.current}
                            closeAriaLabel={engraving.modalCloseLabel || 'Close this modal'}
                            resetInitiator={() => { this.toggleModal(false); }}
                            childComponentInit={() => this.setHeightOfEngraving(this.props.elementsToConsiderForHeight)}
                            inlineStyles={{ height: this.state.modalHeight, top: this.state.heightToIgnore }}
                            trasitionInlineStyles={{ height: this.state.modalHeight, top: this.state.heightToIgnore }}
                            blockScrollInDesktop
                            transitionProps={{
                                timeout: this.props.animationDelay,
                                classNames: {
                                    enter: 'pdp-engraving-animation_enter',
                                    enterActive: 'pdp-engraving-animation_enter-active',
                                    enterDone: 'pdp-engraving-animation_enter-done',
                                    exit: 'pdp-engraving-animation_exit',
                                    exitActive: 'pdp-engraving-animation_exit-active',
                                    exitDone: 'pdp-engraving-animation_exit-done'
                                }
                            }}
                            setScopeFocus={false}
                        >
                            <Fragment>
                                {
                                    !this.props.hasCustomAction &&
                                    !this.props.editingEngraving &&
                                    <Engraving
                                        closeEngraving={() => { this.toggleModal(false); }}
                                        sku={this.props.sku}
                                        groupSku={this.props.groupSku}
                                        isByo={this.props.isByo}
                                        hcStickyEnbled={this.props.hcStickyEnbled}
                                    />
                                }
                                {
                                    this.props.hasCustomAction &&
                                    !this.props.editingEngraving &&
                                    <Engraving
                                        closeEngraving={() => { this.toggleModal(false); }}
                                        sku={this.props.sku}
                                        groupSku={this.props.groupSku}
                                        hasCustomAction
                                        customBtnLabel={this.props.customBtnLabel}
                                        customClosingAction={this.props.customClosingAction}
                                        isByo={this.props.isByo}
                                        hcStickyEnbled={this.props.hcStickyEnbled}
                                        customActionButtonClass={this.props.customActionButtonClass}
                                    />
                                }
                                {
                                    this.props.editingEngraving &&
                                    <Engraving
                                        closeEngraving={() => { this.toggleModal(false); }}
                                        sku={this.props.sku}
                                        groupSku={this.props.groupSku}
                                        editingEngraving
                                        hasCustomAction={this.props.hasCustomAction}
                                        customClosingAction={this.props.customClosingAction}
                                        isByo={this.props.isByo}
                                        hcStickyEnbled={this.props.hcStickyEnbled}
                                        initialOne={this.props.initialOne}
                                        initialTwo={this.props.initialTwo}
                                        initialThree={this.props.initialThree}
                                        itemServiceTypeId={this.props.itemServiceTypeId}
                                        styleCode={this.props.styleCode}
                                        groupId={this.props.groupId}
                                        productBasePrice={this.props.productBasePrice}
                                        shoppingBagItemId={this.props.shoppingBagItemId}
                                    />
                                }
                            </Fragment>
                        </TiffanyInlineModal>
                    </div>
                </Fragment>
                :
                null
        );
    }
}

PDPEngraving.propTypes = {
    sku: PropTypes.string.isRequired,
    showComponent: PropTypes.bool.isRequired,
    groupSku: PropTypes.string,
    authoredLabels: PropTypes.object,
    hasCustomAction: PropTypes.bool,
    editingEngraving: PropTypes.bool,
    customClosingAction: PropTypes.func,
    customBtnLabel: PropTypes.string,
    customActionButtonClass: PropTypes.string,
    isByo: PropTypes.bool,
    hcStickyEnbled: PropTypes.bool,
    initialOne: PropTypes.string,
    initialTwo: PropTypes.string,
    initialThree: PropTypes.string,
    itemServiceTypeId: PropTypes.string,
    styleCode: PropTypes.string,
    groupId: PropTypes.string,
    productBasePrice: PropTypes.string,
    shoppingBagItemId: PropTypes.string,
    elementsToConsiderForHeight: PropTypes.array,
    animationDelay: PropTypes.number
};

PDPEngraving.defaultProps = {
    groupSku: '',
    authoredLabels: {},
    hasCustomAction: false,
    customActionButtonClass: '',
    editingEngraving: false,
    customClosingAction: () => { },
    customBtnLabel: '',
    isByo: false,
    hcStickyEnbled: false,
    initialOne: '',
    initialTwo: '',
    initialThree: '',
    itemServiceTypeId: '',
    styleCode: '',
    groupId: '',
    productBasePrice: '0',
    shoppingBagItemId: '',
    elementsToConsiderForHeight: ['.header .header__nav-container', '.global-banner', '.choose-country'],
    animationDelay: 1000
};

const mapStateToProps = (state) => {
    return {
        authoredLabels: state.authoredLabels,
        showComponent: state.engraving.showEngravingComponent
    };
};

export default connect(mapStateToProps)(PDPEngraving);
