import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import InformationText from 'components/common/InformationText';
// import './index.scss';

/**
 * Toggle component for display content
 */
class Toggle extends PureComponent {
    /**
     * @description Constructor
     * @param {object} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.state = {
            showDesc: props.isToggleOpened
        };
    }

    /**
     * @description handle toggle state
     * @returns {object} generated url
     */
    handleToggle = () => {
        this.setState((prevState) => {
            return {
                showDesc: !prevState.showDesc
            };
        }, this.props.triggerScroll());
    };

    /**
     * @description decides how to render RTE
     * @returns {DOM} rte
     */
    renderRTE = () => {
        const { description, numberInDescription } = this.props;

        if (description.split('text-phnumber').length > 1) {
            return (
                <div
                    className={
                        classNames({
                            hide: !this.state.showDesc
                        })
                    }
                >
                    <InformationText config={{ informationTextRTE: description, telephoneNumber: numberInDescription }} />
                </div>
            );
        }

        return (
            <div
                className={
                    classNames('toggle__description tiffany-rte',
                        {
                            hide: !this.state.showDesc
                        })
                }
                dangerouslySetInnerHTML={{ __html: description }}
            />
        );
    }

    /**
     * Render function.
     * @returns {object} html instance
     */
    render() {
        const {
            isRTE, isHeadingRTE, heading, description
        } = this.props;
        const htmlCallout = {
            interactionContext: 'engraving',
            interactionType: 'delivery-returns',
            interactionName: ''
        };

        return (
            <div className={`toggle ${this.props.customClass}`}>
                {isHeadingRTE ?
                    <div
                        role="button"
                        className="cta"
                        tabIndex="0"
                        onKeyPress={this.handleToggle}
                        onClick={this.handleToggle}
                        aria-expanded={this.state.showDesc}
                        data-interaction-context={htmlCallout.interactionContext}
                        data-interaction-type={htmlCallout.interactionType}
                        data-interaction-name={htmlCallout.interactionName}
                    >
                        <span
                            className="cta-content"
                            tabIndex="-1"
                            dangerouslySetInnerHTML={{ __html: heading }}
                        />
                        {
                            this.state.showDesc ?
                                <span className="icon-dropdown-up" /> : <span className="icon-dropdown-down" />
                        }
                    </div>
                    :
                    <button
                        type="button"
                        className="cta"
                        tabIndex="0"
                        onClick={this.handleToggle}
                        aria-expanded={this.state.showDesc}
                        data-interaction-context={htmlCallout.interactionContext}
                        data-interaction-type={htmlCallout.interactionType}
                        data-interaction-name={htmlCallout.interactionName}
                    >
                        <span className="cta-content" tabIndex="-1">
                            {heading}
                            {!this.state.showDesc && <span className="icon-dropdown-up" />}
                            {this.state.showDesc && <span className="icon-dropdown-down" />}
                        </span>
                    </button>
                }
                {
                    isRTE ?
                        <Fragment>
                            {
                                this.renderRTE()
                            }
                        </Fragment>
                        :
                        <p
                            className={
                                classNames('toggle__description',
                                    {
                                        hide: !this.state.showDesc
                                    })
                            }
                        >
                            {description}
                        </p>
                }
            </div>
        );
    }
}

Toggle.propTypes = {
    heading: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isRTE: PropTypes.bool.isRequired,
    customClass: PropTypes.string,
    triggerScroll: PropTypes.func,
    isHeadingRTE: PropTypes.bool,
    numberInDescription: PropTypes.string,
    isToggleOpened: PropTypes.bool
};

Toggle.defaultProps = {
    isToggleOpened: false,
    isHeadingRTE: false,
    customClass: '',
    numberInDescription: '',
    triggerScroll: () => { }
};

export default Toggle;
