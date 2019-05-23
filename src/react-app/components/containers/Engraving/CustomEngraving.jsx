import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as objectPath from 'object-path';

import AnalyticsConstants from 'constants/HtmlCalloutConstants';

// Components
import InformationText from 'components/common/InformationText';

// import './index.scss';

/**
 * @description Browse Engraving component for all Engravings
 * @class BrowseEngraving
 */
class CustomEngraving extends React.Component {
    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentDidMount = () => {
        this.props.enableFocus();
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            heading,
            helpConfig,
            cta,
            description,
            isDescriptionRTE
        } = this.props;
        const backBtn = objectPath.get(window, 'tiffany.labels.engraving.backBtn', '');

        return (
            <div className="custom-engraving">
                <div className="custom-engraving__wrapper tf-g tf-g__wrap">
                    <div className="custom-engraving__wrapper_content">
                        <h3 className="custom-engraving__wrapper_content_heading" id="symbols-styles">
                            {heading}
                        </h3>
                        {isDescriptionRTE ?
                            <div
                                className="custom-engraving__wrapper_content_desc"
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                            :
                            <p className="custom-engraving__wrapper_content__desc">
                                {description}
                            </p>
                        }
                    </div>
                    <div className="custom-engraving__wrapper_footer">
                        <InformationText config={helpConfig} />
                        <div className={
                            classNames('custom-engraving__wrapper_footer_actions tf-g',
                                {
                                    gutter: cta
                                })
                        }
                        >
                            <button type="button" className="custom-engraving__wrapper_footer_actions_back btn btn--outline tf-g--flex-equal" onClick={() => this.props.backHandler({ component: 'HOME', startEngraving: true })}>{backBtn}</button>
                            {
                                cta &&
                                <a
                                    className="custom-engraving__wrapper_footer_actions_contact btn btn-primary tf-g tf-g__middle tf-g__center tf-g--flex-equal"
                                    href={cta.link}
                                    tabIndex="0"
                                    target={cta.target}
                                    data-interaction-context=""
                                    data-interaction-type={AnalyticsConstants.PHONE}
                                    data-interaction-name={helpConfig.telephoneNumber}
                                >
                                    <span className="custom-engraving__wrapper_footer_actions_contact_text">
                                        {cta.text}
                                    </span>
                                </a>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CustomEngraving.propTypes = {
    heading: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isDescriptionRTE: PropTypes.bool.isRequired,
    helpConfig: PropTypes.object.isRequired,
    cta: PropTypes.any,
    backHandler: PropTypes.func.isRequired,
    enableFocus: PropTypes.func
};

CustomEngraving.defaultProps = {
    cta: false,
    enableFocus: () => { }
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(CustomEngraving);
