import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import MediaQuery from 'react-responsive';
import * as objectPath from 'object-path';
import styleVariables from 'lib/utils/breakpoints';
import { setSizeSelection, resetRingSizeMessage } from 'actions/ChooseDiamondActions';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';
import Picture from 'components/common/Picture';

// import './index.scss';

/**
 *  RingSize Component
 */
class RingSize extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        const ringSizeData = this.props.data;
        const { variations } = ringSizeData;

        this.state = {
            isVariationsOpen: false,
            selectedVariation: this.props.selectedVariation || objectPath.get(variations.filter(variation => variation.isSelected), '0.label', ''),
            showSuccessMessage: false
        };
        this.sizeButton = React.createRef();
        props.dispatch(setSizeSelection(Number(this.state.selectedVariation)));
    }

    /**
     * @description Life cycle hook
     * @returns {void}
     */
    componentDidMount() {
        window.addEventListener('toggleSizeFlyout', this.toggleSizeFlyoutHandler);
    }

    /**
     * @param {*} nextProps NextProps
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedVariation !== this.props.selectedVariation) {
            this.setState({
                selectedVariation: nextProps.selectedVariation
            });
        }
        if (this.props.shoppingBagId && this.props.diamondFilters.showRingSizeChangeMessage !== nextProps.diamondFilters.showRingSizeChangeMessage) {
            this.setState({
                showSuccessMessage: nextProps.diamondFilters.showRingSizeChangeMessage
            }, () => {
                if (this.state.showSuccessMessage) {
                    setTimeout(() => {
                        this.props.dispatch(resetRingSizeMessage());
                    }, 5000);
                }
            });
        }
    }

    /**
     * Lifcycle hook
     * @returns {void}
     */
    componentWillUnmount() {
        window.removeEventListener('toggleSizeFlyout', this.toggleSizeFlyoutHandler);
    }

    /**
     * Update element focus
     * @param {object} e event e
     * @returns {void}
     */
    toggleSizeFlyoutHandler = (e) => {
        if (e.detail === 'close' && this.sizeButton && this.sizeButton.current) {
            this.sizeButton.current.focus();
        }
    }

    /**
     * set selected variation
     * @param {String} val selected value
     * @returns {void}
     */
    setSelectedVariation = (val) => {
        if (val) {
            this.setState({
                selectedVariation: val,
                isVariationsOpen: !this.state.isVariationsOpen
            }, () => {
                this.props.dispatch(setSizeSelection(Number(this.state.selectedVariation)));
                this.props.onChange(this.state.selectedVariation);
            });
        }
    }

    /**
     * toggle variations dropdown open and close class.
     * @returns {void}
     */
    toggleVariationsDropdown = () => {
        if (objectPath.get(this.props, 'data.variations', []).length > 1) {
            this.setState({
                isVariationsOpen: !this.state.isVariationsOpen
            });
        }
    }

    /**
     * open size guide Modal
     * @returns {void}
     */
    openSizeGuideModal = () => {
        const customEvent = new CustomEvent('toggleSizeFlyout', {
            detail: 'open'
        });

        window.dispatchEvent(customEvent);
    }

    /**
     * @description renders the size guide cta
     * @returns {Object} HTML instance of the object
     */
    renderSizeGuideCTA = () => {
        const { labels } = this.props;
        const preText = objectPath.get(labels, 'confirmationPdpRingPreText', '');

        return (
            <article className="text-with-cta app-js__text-with-cta">
                <div className="text-with-cta__column">
                    {
                        preText &&
                        <p className="text-with-cta__column_pretext">{preText}</p>
                    }
                    <button type="button" className="text-with-cta__column_sizeguide" ref={this.sizeButton} onClick={this.openSizeGuideModal} tabIndex="0">
                        <span className="cta-content">
                            <span className="cta-text" tabIndex="-1">{objectPath.get(labels, 'confirmationPdpRingPostText', '')}</span>
                        </span>
                    </button>
                </div>
            </article>
        );
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            isVariationsOpen = false
        } = this.state;
        const ringSizeData = this.props.data;
        const { variations } = ringSizeData;
        const { selectedVariation } = this.state;
        const isVariationLengthEven = variations && (variations.length % 2 === 0);
        const htmlcallout = {
            interactionContext: 'love-engagement:diamond-selector',
            interactionType: AnalyticsConstants.TAB,
            interactionName: objectPath.get(this.props.engagementPdp, 'beautifulChoice.modifiers.sizeGuideLabel', 'ring-size-guide')
        };

        if (this.props.isPDP === 'true') {
            htmlcallout.interactionContext = '';
        }

        return (
            variations.length > 0 ?
                <div className={`modifiers__container ${this.props.customClass}`}>
                    <div className="modifiers__container_details">
                        <div className="type-holder tf-g">
                            {this.state.showSuccessMessage && <Picture customClass="type-holder_success" isLazyLoad={false} defaultSrc={objectPath.get(this.props.aem, 'engagementpdp.labels.ringSizeSuccessIcon', '')} altText={objectPath.get(this.props.aem, 'engagementpdp.labels.ringSizeSuccessIconAlt', '')} />}
                            <span className="modifiers__container_type">
                                {this.state.showSuccessMessage ? objectPath.get(this.props.aem, 'engagementpdp.labels.ringSizeSuccess', '') : objectPath.get(ringSizeData, 'heading', '')}
                            </span>
                        </div>
                        <div
                            className="modifiers__container_dropdownbutton"
                            data-interaction-context={htmlcallout.interactionContext}
                            data-interaction-type={htmlcallout.interactionType}
                            data-interaction-name={htmlcallout.interactionName}
                        >
                            <MediaQuery query={styleVariables.desktopAndBelow}>
                                <div className="modifiers__container_dropdownbutton_select">
                                    <select
                                        id="modifiers_select"
                                        aria-label={ringSizeData.label}
                                        className="select-list"
                                        onChange={(e) => this.setSelectedVariation(e.target.value)}
                                    >
                                        {
                                            variations.map((variation, index) => {
                                                return (
                                                    <option
                                                        value={variation.label}
                                                        selected={Number(this.state.selectedVariation) === Number(variation.label)}
                                                        key={variation.label}
                                                    >
                                                        {variation.label}
                                                    </option>
                                                );
                                            })
                                        }
                                    </select>
                                    <img
                                        src={this.props.dropdownSrc}
                                        alt={this.props.dropdownAltText}
                                        className="down-arrow"
                                    />
                                </div>
                            </MediaQuery>
                            <MediaQuery query={styleVariables.desktopAndAbove}>
                                <button
                                    type="button"
                                    aria-label={`${this.props.labels.selectedModifierLabel} ${selectedVariation}`}
                                    aria-haspopup="true"
                                    disabled={variations.length === 1 ? 'disabled' : ''}
                                    className={
                                        classNames('button',
                                            {
                                                disabled: variations.length === 1
                                            })
                                    }
                                    onClick={this.toggleVariationsDropdown}
                                >
                                    {selectedVariation}
                                    <img
                                        src={this.props.dropdownSrc}
                                        alt={this.props.dropdownAltText}
                                        className={
                                            classNames({
                                                'up-arrow': isVariationsOpen,
                                                'down-arrow': !isVariationsOpen
                                            })
                                        }
                                    />
                                </button>
                            </MediaQuery>
                        </div>
                    </div>
                    <MediaQuery query={styleVariables.desktopAndAbove}>
                        <CSSTransition
                            in={this.state.isVariationsOpen}
                            timeout={400}
                            classNames={{
                                enter: 'modifiers__container_dropdownlist__enter',
                                enterActive: 'modifiers__container_dropdownlist__enter_active',
                                enterDone: 'modifiers__container_dropdownlist__enter_complete',
                                exit: 'modifiers__container_dropdownlist__exit',
                                exitActive: 'modifiers__container_dropdownlist__exit_active',
                                exitDone: 'modifiers__container_dropdownlist__exit_complete'
                            }}
                            mountOnEnter
                            unmountOnExit
                        >
                            <React.Fragment>
                                <div>
                                    <ul
                                        aria-expanded={isVariationsOpen}
                                        role="menu"
                                        className={
                                            classNames('modifiers__container_dropdownlist',
                                                {
                                                    imageAvailable: ringSizeData.isMotif || ringSizeData.isColorSwatch
                                                })
                                        }
                                    >
                                        {
                                            variations.map((variation, index) => {
                                                return (
                                                    <li role="none" className="modifiers__container_dropdownlist_item" key={variation.label}>
                                                        <div className="modifiers__container_dropdownlist_item--link">
                                                            <span
                                                                role="menuitem"
                                                                tabIndex="0"
                                                                aria-label={variation.label}
                                                                className={
                                                                    classNames('modifier-link',
                                                                        {
                                                                            'modifier-link-selected': String(variation.label) === String(this.state.selectedVariation)
                                                                        })
                                                                }
                                                                onClick={() => this.setSelectedVariation(variation.label)}
                                                                onKeyPress={() => this.setSelectedVariation(variation.label)}
                                                            >
                                                                <span className="label">{variation.label}</span>
                                                            </span>
                                                        </div>
                                                    </li>);
                                            })
                                        }
                                        {
                                            !isVariationLengthEven &&
                                            <li role="none" className="modifiers__container_dropdownlist_item">
                                                <div className="modifiers__container_dropdownlist_item--link">
                                                    <span
                                                        role="menuitem"
                                                        tabIndex="-1"
                                                        className="modifier-link"
                                                    >
                                                        <span className="label">&nbsp;</span>
                                                    </span>
                                                </div>
                                            </li>
                                        }
                                    </ul>
                                    <div className="modifiers__container_note">
                                        <p className="modifiers__container_note_not-sure">{objectPath.get(ringSizeData, 'notSureText', '')}</p>
                                        <p className="modifiers__container_note_recommendation">{objectPath.get(ringSizeData, 'recommendationText', '')}</p>
                                    </div>
                                </div>
                            </React.Fragment>
                        </CSSTransition>

                    </MediaQuery>
                    {
                        this.props.isPDP === 'false' ? <div className="modifiers__container_size-guide" dangerouslySetInnerHTML={{ __html: objectPath.get(ringSizeData, 'sizeGuideRte', '') }} /> : this.renderSizeGuideCTA()
                    }
                </div> :
                null
        );
    }
}

RingSize.propTypes = {
    dispatch: PropTypes.func.isRequired,
    customClass: PropTypes.string,
    dropdownSrc: PropTypes.string.isRequired,
    dropdownAltText: PropTypes.string.isRequired,
    labels: PropTypes.object.isRequired,
    data: PropTypes.any.isRequired,
    engagementPdp: PropTypes.object.isRequired,
    isPDP: PropTypes.string,
    selectedVariation: PropTypes.string,
    onChange: PropTypes.func,
    shoppingBagId: PropTypes.any,
    diamondFilters: PropTypes.any.isRequired,
    aem: PropTypes.any.isRequired
};

RingSize.defaultProps = {
    customClass: '',
    isPDP: 'false',
    selectedVariation: '',
    onChange: () => { },
    shoppingBagId: ''
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        engagementPdp: state.engagementPdp,
        dropdownSrc: objectPath.get(state, 'aem.icons.dropdown.src', ''),
        dropdownAltText: objectPath.get(state, 'aem.icons.dropdown.altText', ''),
        labels: objectPath.get(state, 'aem.engagementpdp.labels', {}),
        diamondFilters: state.diamondFilters
    };
};

export default connect(mapStateToProps)(RingSize);
