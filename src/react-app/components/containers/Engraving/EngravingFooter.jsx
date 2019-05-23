import React, { Component } from 'react';
import PropTypes from 'prop-types';
import objectPath from 'object-path';
import { connect } from 'react-redux';

import Toggle from 'components/common/Toggle';

/**
 * @description Custom Engraving component
 * @class EngravingCustomization
 */
class EngravingFooter extends Component {
    /**
     * function to trigger Scroll
     * @returns {void}
     */
    triggerScroll = () => {
        window.scrollBy(0, 1);
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const { labels } = this.props;
        const orderBy = objectPath.get(labels, 'orderBy', '');
        const isDeliveryDescriptionRte = objectPath.get(labels, 'isDeliveryDescriptionRte', false);
        const isOrderByRte = objectPath.get(labels, 'isOrderByRte', false);
        const isDeliveryHeadingRte = objectPath.get(labels, 'isDeliveryHeadingRte', false);
        const deliveryHeading = objectPath.get(labels, 'deliveryHeading', '');
        const deliveryDescription = objectPath.get(labels, 'deliveryDescription', '');
        const numberInDescription = objectPath.get(labels, 'deliveryDescriptionNumber', '');

        return (
            <div className="engraving-customization__footer col__full">
                <div className="delivery_note">
                    {isOrderByRte ?
                        <div
                            className="orderby tiffany-rte"
                            dangerouslySetInnerHTML={{ __html: orderBy }}
                        />
                        :
                        <p className="orderby">{orderBy}</p>
                    }
                    <Toggle
                        heading={deliveryHeading}
                        isHeadingRTE={isDeliveryHeadingRte}
                        numberInDescription={numberInDescription}
                        description={deliveryDescription}
                        isRTE={isDeliveryDescriptionRte}
                        isToggleOpened={this.props.isdeliveryReturnsOpened}
                        customClass="delivery"
                        triggerScroll={() => this.triggerScroll()}
                    />
                </div>
            </div>
        );
    }
}

EngravingFooter.propTypes = {
    labels: PropTypes.object,
    isdeliveryReturnsOpened: PropTypes.bool
};
EngravingFooter.defaultProps = {
    labels: {},
    isdeliveryReturnsOpened: true
};
const mapStateToProps = (state) => {
    return {
        labels: objectPath.get(state, 'authoredLabels.engraving', {})
    };
};

export default connect(mapStateToProps)(EngravingFooter);
