// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';

import Picture from 'components/common/Picture';
import { searchLatLngWrapper } from 'actions/FindStoreActions';
import { getUpcomingEvents } from 'actions/StoresActions';
import { getPreferredStore } from 'lib/utils/preferred-store-util';
import find from 'lodash/find';

// import './index.scss';

/**
 * Upcoming Events Component
 */
class UpcomingEvents extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.aem[this.props.config]
        };
        this.eventsRecieved = false;
    }

    /**
     * Lifcycle hook
     * @param {*} nextProps changed props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        const storesList = objectPath.get(nextProps, 'stores.storesList');

        if (!this.eventsRecieved && nextProps.stores && storesList
            && nextProps.stores !== this.props.stores) {
            getPreferredStore().then((preferredStore) => {
                this.getNearByStores(preferredStore, storesList);
            }, (err) => {
                this.getNearByStores(false, storesList);
            });
            this.eventsRecieved = true;
        }
    }

    /**
     * Get near by stores
     * @param {object} preferredStore preferrestore
     * @param {object} storesList storesList
     * @returns {void}
     */
    getNearByStores(preferredStore, storesList) {
        navigator.geolocation.getCurrentPosition((position) => {
            const filteredStoresIds = [];
            const filteredStores = {};
            let tempStores = [];
            let i;
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const { defaultFilterRadius } = this.state.config;

            tempStores = searchLatLngWrapper(lat, lng, storesList, defaultFilterRadius);
            for (i = 0; i < tempStores.length; i += 1) {
                filteredStoresIds.push(tempStores[i].store.storeId);
                filteredStores[tempStores[i].store.storeId] = tempStores[i];
            }

            const eventsPayload = {
                stores: filteredStoresIds
            };

            if (preferredStore) {
                const storeinfo = find(storesList, (storeObj) => { return storeObj.store.mipsstoreNumber === preferredStore; });
                const storeId = objectPath.get(storeinfo, 'store.storeId');

                if (storeId) {
                    eventsPayload.preferredStore = storeId;
                    filteredStores[storeId] = storeinfo;
                }
            }

            const { upcomingEventsApiConfig } = this.state.config;

            eventsPayload.siteId = objectPath.get(window, 'tiffany.authoredContent.wishlistConfig.get.payload.siteId', '');
            eventsPayload.locale = objectPath.get(window, 'tiffany.authoredContent.currencyConfig.locale', '');

            objectPath.set(upcomingEventsApiConfig, 'queryParams', eventsPayload);

            this.props.dispatch(getUpcomingEvents(upcomingEventsApiConfig, filteredStores, storesList));
        });
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            ctatarget,
            alttext,
            ctatext,
            imagepathprefix,
            eventpath
        } = this.props;

        const ctatargetblank = (ctatarget) ? '_blank' : '_self';

        return (
            (this.props.stores.upcomingEvents.length > 0) &&
            <article className="upcoming-events container-centered">
                <h2 className="upcoming-events__heading">{this.state.config.content.heading}</h2>

                <div className="upcoming-events__content">
                    {
                        this.props.stores.upcomingEvents.map((item, index) => {
                            return (
                                <div key={index.toString()} className="upcoming-events__content_body">
                                    <div className="upcoming-events__content_body_content">
                                        <div className="upcoming-events__content_body_image">
                                            <a className="cta" href={`${eventpath}?eventid=${item.eventId}`} target={ctatargetblank} tabIndex={0}>
                                                <span className="cta-content">
                                                    <Picture
                                                        defaultSrc={`${imagepathprefix}${item.imagePath}`}
                                                        altText={alttext}
                                                        isLazyLoad={false}
                                                    />
                                                </span>
                                            </a>
                                        </div>
                                        <div className="upcoming-events__content_body_event-details">
                                            <h2 className="heading">
                                                {item.title}
                                            </h2>
                                            <div className="upcoming-events__content_body_event-time-location">
                                                <p>
                                                    {item.visibleStartDatetime}
                                                </p>
                                                <p>
                                                    {item.storeName}
                                                </p>
                                            </div>
                                            <div className="upcoming-events__content_body_event-description">
                                                <p className="description">
                                                    {item.shortDescription}
                                                </p>
                                            </div>
                                            <div className="upcoming-events__content_body_cta">
                                                <a className="cta" href={`${eventpath}?eventid=${item.eventId}`} target={ctatargetblank} tabIndex={0}>
                                                    <span className="cta-content">
                                                        {ctatext}
                                                        <span className="icon-Right" />
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </article>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        stores: state.stores,
        aem: state.aem,
        fullStoresList: state.stores.storesList
    };
};

UpcomingEvents.defaultProps = {
    stores: {},
    ctatarget: '',
    alttext: 'Upcoming events',
    ctatext: '',
    imagepathprefix: '',
    eventpath: ''
};

UpcomingEvents.propTypes = {
    config: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired,
    stores: PropTypes.object,
    ctatarget: PropTypes.string,
    alttext: PropTypes.string,
    ctatext: PropTypes.string,
    eventpath: PropTypes.string,
    imagepathprefix: PropTypes.string
};

export default connect(mapStateToProps)(UpcomingEvents);
