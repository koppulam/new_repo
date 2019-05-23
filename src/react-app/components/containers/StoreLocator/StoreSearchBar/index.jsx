// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as objectPath from 'object-path';
import { updateStoresSearchData } from 'actions/StoresActions';
import MediaQuery from 'react-responsive';
import { isEnter } from 'lib/dom/keyboard/key-code';
import getKeyCode from 'lib/utils/KeyCodes';

import styleVariables from 'lib/utils/breakpoints';

import AnalyticsConstants from 'constants/HtmlCalloutConstants';

// import './index.scss';


/**
 * No Search Results Component
 */
class StoreSearchBar extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.sortedDistance = objectPath.get(this.props.aem, 'storeLocatorSearchBar.distance', []).concat();
        this.sortedDistance.sort(((x, y) => { return x - y; }));
        this.state = {
            isDistanceDropdownOpen: false,
            isServicesDropdownOpen: false,
            foundAStore: false,
            selectedDistance: this.sortedDistance[0],
            selectedRegion: '',
            selectedServices: objectPath.get(this.props.aem, 'storeLocatorSearchBar.allowedServices', [])
        };
        this.regionInputElement = React.createRef();
        this.servicesContainer = React.createRef();
        this.keyPress = this.keyPress.bind(this);
    }

    /**
     * redirect on selecting in mobile
     * @param {event} event on select
     * @returns {void}
     */
    onDistanceSelect = (event) => {
        this.selectDistance(event.target.value);
    }

    /**
     * toggle variations dropdown open and close class.
     * @param {String} action OnMouse leave action
     * @returns {void}
     */
    toggleDistanceDropdown = (action) => {
        if (objectPath.get(this.props.aem, 'storeLocatorSearchBar.distance', []).length > 1 && action === 'CLICK') {
            this.setState({
                isDistanceDropdownOpen: !this.state.isDistanceDropdownOpen
            });
        }

        if (action === 'LEAVE') {
            this.setState({
                isDistanceDropdownOpen: false
            });
        }
    }

    /**
     * toggle variations dropdown open and close class.
     * @param {string} distance selected distance
     * @returns {void}
     */
    selectDistance = (distance) => {
        if (distance !== this.state.selectedDistance) {
            this.setState({
                selectedDistance: distance,
                isDistanceDropdownOpen: false,
                foundAStore: false
            });
        }
    }

    /**
     * toggle variations dropdown open and close class.
     * @param {String} action OnMouse leave action
     * @returns {void}
     */
    toggleServicesDropdown = (action) => {
        if (action && action === 'LEAVE') {
            this.setState({
                isServicesDropdownOpen: false
            });
        } else if (objectPath.get(this.props.aem, 'storeLocatorSearchBar.allowedServices', []).length > 0 ||
            objectPath.get(this.props.aem, 'storeLocatorSearchBar.serviceLabels.allServices', '')) {
            this.setState({
                isServicesDropdownOpen: !this.state.isServicesDropdownOpen
            }, () => {
                if (!this.state.isServicesDropdownOpen && this.servicesContainer && this.servicesContainer.current) {
                    console.log(this.servicesContainer.current);
                    this.servicesContainer.current.focus();
                } else if (this.state.isServicesDropdownOpen) {
                    this.handleFocus(0);
                }
            });
        }
    }

    /**
     * handling Key Press on Input
     * @param {event} evt Event object
     * @returns {void}
     */
    keyPress = (evt) => {
        if (isEnter(evt)) {
            this.findAStore();
        }
    }

    /**
     * update in region input
     * @param {DocumentEvent} event triggered event
     * @returns {void}
     */
    updateRegion = (event) => {
        const selectedRegion = event.target.value;

        this.setState({
            selectedRegion,
            foundAStore: false
        });
    }

    /**
     * toggle variations dropdown open and close class.
     * @param {string} service selected service
     * @returns {void}
     */
    selectService = (service) => {
        let { selectedServices } = this.state;
        const allservices = objectPath.get(this.props.aem, 'storeLocatorSearchBar.allowedServices', []);

        if (selectedServices.length === allservices.length) {
            selectedServices = [];
            selectedServices.push(service);
        } else if (selectedServices.length !== 1 || (selectedServices.length === 1 && selectedServices[0] !== service)) {
            const serviceIndex = selectedServices.indexOf(service);

            if (serviceIndex > -1) {
                selectedServices.splice(serviceIndex, 1);
            } else {
                selectedServices.push(service);
            }
        }
        this.setState({
            selectedServices,
            foundAStore: false
        });
    }

    /**
     * select all services
     * @returns {void}
     */
    selectAllService = () => {
        const { selectedServices } = this.state;
        const allservices = objectPath.get(this.props.aem, 'storeLocatorSearchBar.allowedServices', []).concat();

        if (selectedServices.length < allservices.length) {
            this.setState({
                selectedServices: allservices,
                foundAStore: false
            });
        }
    }

    /**
     * toggle variations dropdown open and close class.
     * @param {string} distance selected distance
     * @returns {void}
     */
    findAStore = () => {
        const allowedServices = objectPath.get(this.props.aem, 'storeLocatorSearchBar.allowedServices', []);
        const viewAllStoresLabel = objectPath.get(this.props.aem, 'storeLocatorSearchBar.serviceLabels.allServices', '');
        const searchData = {
            selectedDistance: this.state.selectedDistance,
            selectedRegion: this.state.selectedRegion,
            selectedServices: this.state.selectedServices,
            allowedServices,
            viewAllStoresLabel
        };

        this.props.dispatch(updateStoresSearchData(searchData));
        this.setState({
            foundAStore: true
        });
    }

    /**
     * toggle variations dropdown open and close class.
     * @param {string} distance selected distance
     * @returns {void}
     */
    reset = () => {
        this.setState({
            foundAStore: false,
            selectedDistance: this.sortedDistance[0],
            selectedRegion: '',
            selectedServices: objectPath.get(this.props.aem, 'storeLocatorSearchBar.allowedServices', []).concat()
        });
        this.regionInputElement.value = '';
    }

    /**
     * function to shift focus on category list
     * @param {object} index of symbol category
     * @returns {void}
     */
    handleFocus = (index) => {
        if (this[`item_${index}`]) {
            this[`item_${index}`].focus();
        }
    }

    /**
     * function to get key press event
     * @param {object} index of symbol category
     * @returns {void}
     */
    handleKeyDown = (index) => (e) => {
        e.stopPropagation();
        const type = getKeyCode(e.keyCode, e.shiftKey);
        const { storeLocatorSearchBar } = this.props.aem;
        const total = objectPath.get(storeLocatorSearchBar, 'allowedServices', []).length;
        let newIndex;

        switch (type) {
            case 'TAB':
            case 'DOWNARROW':
                e.preventDefault();
                newIndex = (index === total) ? 0 : index + 1;
                this.handleFocus(newIndex);
                break;
            case 'UPARROW':
            case 'BACKTAB':
                e.preventDefault();
                newIndex = (index === 0) ? total : index - 1;
                this.handleFocus(newIndex);
                break;
            case 'ESCAPE':
                e.preventDefault();
                this.toggleServicesDropdown();
                break;
            default:
                break;
        }
    }

    /**
     * @returns {object} Element
     */
    render() {
        const { storeLocatorSearchBar } = this.props.aem;
        const {
            isDistanceDropdownOpen,
            isServicesDropdownOpen,
            foundAStore,
            selectedDistance,
            selectedServices
        } = this.state;
        let serviceButtonLabel = '';

        if (selectedServices.length === storeLocatorSearchBar.allowedServices.length) {
            serviceButtonLabel = storeLocatorSearchBar.serviceLabels.allServices;
        } else if (selectedServices.length === 1) {
            serviceButtonLabel = `${selectedServices.length} ${storeLocatorSearchBar.serviceLabels.service}`;
        } else {
            serviceButtonLabel = `${selectedServices.length} ${storeLocatorSearchBar.serviceLabels.services}`;
        }

        const selectedLabel = objectPath.get(window, 'tiffany.labels.selectedLabel', 'Selected');

        return (
            <div className="storesearchbar container-centered">
                <h1 className="storesearchbar__heading">{storeLocatorSearchBar.heading}</h1>
                <div className="storesearchbar__search_in">
                    <p className="storesearchbar__search_in_label">{storeLocatorSearchBar.storesWithinLabel}</p>
                    <div
                        className="storesearchbar__button distance-dropdown"
                        onMouseLeave={() => { this.toggleDistanceDropdown('LEAVE'); }}
                    >
                        <MediaQuery query={styleVariables.desktopAndAbove}>
                            <button
                                type="button"
                                aria-label={storeLocatorSearchBar.adaLabels.distanceButtonLabel}
                                aria-haspopup="true"
                                className={
                                    classNames('button',
                                        {
                                            open: isDistanceDropdownOpen
                                        })
                                }
                                onClick={
                                    () => {
                                        this.toggleDistanceDropdown('CLICK');
                                    }
                                }
                            >
                                <span className="storesearchbar__button_title">{`${selectedDistance} ${storeLocatorSearchBar.distanceLabel}`}</span>
                                <span className={
                                    classNames('icon',
                                        {
                                            'icon-dropdown-down': !isDistanceDropdownOpen,
                                            'icon-dropdown-up': isDistanceDropdownOpen
                                        })
                                }
                                />
                            </button>
                        </MediaQuery>
                        <MediaQuery query={styleVariables.desktopAndBelow}>
                            <label className="storesearchbar__button_select" htmlFor="storeLocatorSearchBarDistance">
                                <select
                                    onChange={this.onDistanceSelect}
                                    value={parseInt(this.state.selectedDistance, 10)}
                                    id="storeLocatorSearchBarDistance"
                                >
                                    {
                                        this.sortedDistance.map((distance, index) => {
                                            return (
                                                <option
                                                    value={parseInt(distance, 10)}
                                                    key={distance}
                                                >
                                                    {`${distance} ${storeLocatorSearchBar.distanceLabel}`}
                                                </option>);
                                        })
                                    }
                                </select>
                                <span className="icon-dropdown-down" />
                            </label>
                        </MediaQuery>
                        <div
                            className={
                                classNames('storesearchbar__button_dropdownlist',
                                    {
                                        hide: !isDistanceDropdownOpen
                                    })
                            }
                        >
                            <ul
                                aria-expanded={isDistanceDropdownOpen}
                                role="menu"
                                aria-hidden={!isDistanceDropdownOpen}
                                className="storesearchbar__button_dropdownlist-list"
                            >
                                {
                                    this.sortedDistance.map((distance, index) => {
                                        return (
                                            <li
                                                className="storesearchbar__button_dropdownlist-list-item"
                                                key={distance}
                                                role="menuitem"
                                                aria-setsize={this.sortedDistance.length}
                                                aria-posinset={index + 1}
                                            >
                                                <button
                                                    type="button"
                                                    className={
                                                        classNames('dropdown-button',
                                                            {
                                                                selected: (this.state.selectedDistance === distance)
                                                            })
                                                    }
                                                    onClick={() => { this.selectDistance(distance); }}
                                                >
                                                    {`${distance} ${storeLocatorSearchBar.distanceLabel}`}
                                                </button>
                                            </li>);
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="storesearchbar__of">
                    <p className="storesearchbar__of_label">{storeLocatorSearchBar.ofLabel}</p>
                    <div className="storesearchbar__of_region material-input">
                        <input
                            className="storesearchbar__of_region_input input"
                            name="regionInput"
                            id="regionInput"
                            type="text"
                            required
                            onChange={this.updateRegion}
                            onKeyDown={this.keyPress}
                            ref={(el) => { this.regionInputElement = el; }}
                        />
                        <label className="storesearchbar__of_region_label label" htmlFor="regionInput">{storeLocatorSearchBar.locationPlaceholder}</label>
                    </div>
                </div>
                {
                    (storeLocatorSearchBar.serviceLabels.allServices || storeLocatorSearchBar.allowedServices.length > 0) &&
                    <div className="storesearchbar__offer">
                        <p className="storesearchbar__offer_label">{storeLocatorSearchBar.offerLabel}</p>
                        <div
                            className="storesearchbar__button services-dropdown"
                            onMouseLeave={() => { this.toggleServicesDropdown('LEAVE'); }}
                        >
                            <button
                                type="button"
                                aria-label={serviceButtonLabel}
                                aria-haspopup="true"
                                aria-expanded={isServicesDropdownOpen}
                                className={
                                    classNames('button',
                                        {
                                            open: isServicesDropdownOpen
                                        })
                                }
                                onClick={this.toggleServicesDropdown}
                                ref={this.servicesContainer}
                            >
                                <span className="storesearchbar__button_title">{serviceButtonLabel}</span>
                                <span className={
                                    classNames('icon',
                                        {
                                            'icon-dropdown-down': !isServicesDropdownOpen,
                                            'icon-dropdown-up': isServicesDropdownOpen
                                        })
                                }
                                />
                            </button>
                            {
                                isServicesDropdownOpen &&
                                <div
                                    className={
                                        classNames('storesearchbar__button_dropdownlist',
                                            {
                                                'visibility-hide': !this.state.isServicesDropdownOpen
                                            })
                                    }
                                >
                                    <ul
                                        aria-expanded={isServicesDropdownOpen}
                                        role="menu"
                                        aria-hidden={!isServicesDropdownOpen}
                                        className="storesearchbar__button_dropdownlist-list"
                                    >
                                        {
                                            storeLocatorSearchBar.serviceLabels.allServices &&
                                            <li className="storesearchbar__button_dropdownlist-list-item">
                                                <button
                                                    type="button"
                                                    className={
                                                        classNames('dropdown-button',
                                                            {
                                                                selected: (selectedServices.length === storeLocatorSearchBar.allowedServices.length)
                                                            })
                                                    }
                                                    aria-label={selectedServices.length === storeLocatorSearchBar.allowedServices.length ? `${selectedLabel}, ${storeLocatorSearchBar.serviceLabels.allServices}` : ''}
                                                    role="menuitem"
                                                    onClick={() => { this.selectAllService(); }}
                                                    aria-setsize={storeLocatorSearchBar.allowedServices.length + 1}
                                                    aria-posinset={1}
                                                    ref={(item) => {
                                                        this[`item_${0}`] = item;
                                                    }}
                                                    onKeyDown={this.handleKeyDown(0)}
                                                >
                                                    <span className="storesearchbar__button_dropdownlist-list-item-label">
                                                        {storeLocatorSearchBar.serviceLabels.allServices}
                                                    </span>
                                                </button>
                                            </li>
                                        }
                                        {
                                            storeLocatorSearchBar.allowedServices.map((service, index) => {
                                                const isSelected = selectedServices.indexOf(service) > -1 && selectedServices.length !== storeLocatorSearchBar.allowedServices.length;

                                                return (
                                                    <li
                                                        className="storesearchbar__button_dropdownlist-list-item"
                                                        key={service}
                                                    >
                                                        <button
                                                            type="button"
                                                            aria-label={isSelected ? `${selectedLabel}, ${service}` : ''}
                                                            className={
                                                                classNames('dropdown-button',
                                                                    {
                                                                        selected: (selectedServices.indexOf(service) > -1 && selectedServices.length !== storeLocatorSearchBar.allowedServices.length)
                                                                    })
                                                            }
                                                            role="menuitem"
                                                            aria-setsize={storeLocatorSearchBar.allowedServices.length + 1}
                                                            aria-posinset={index + 2}
                                                            onClick={() => { this.selectService(service); }}
                                                            ref={(item) => {
                                                                this[`item_${index + 1}`] = item;
                                                            }}
                                                            onKeyDown={this.handleKeyDown(index + 1)}
                                                        >
                                                            <span className="storesearchbar__button_dropdownlist-list-item-label">
                                                                {service}
                                                            </span>
                                                        </button>
                                                    </li>);
                                            })
                                        }
                                    </ul>
                                </div>
                            }
                        </div>
                    </div>
                }
                {
                    !foundAStore &&
                    <button type="button" className="storesearchbar__findastore btn--outline" onClick={this.findAStore}>
                        {storeLocatorSearchBar.findAStore}
                    </button>
                }
                {
                    foundAStore &&
                    <button type="button" className="storesearchbar__findastore btn--outline" onClick={this.reset}>
                        {storeLocatorSearchBar.reset}
                    </button>
                }
                <a
                    className="storesearchbar__viewstores cta"
                    href={storeLocatorSearchBar.viewAllStores.url}
                    target={storeLocatorSearchBar.viewAllStores.target}
                    tabIndex="0"
                    data-interaction-context=""
                    data-interaction-type=""
                    data-interaction-name={AnalyticsConstants.VIEW_ALL_STORES}
                >
                    <span className="cta-content">
                        <span className="cta-text" tabIndex="-1">
                            {storeLocatorSearchBar.viewAllStores.label}
                        </span>
                        <span className="icon icon-Right" />
                    </span>
                </a>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        aem: state.aem
    };
};

StoreSearchBar.propTypes = {
    aem: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(StoreSearchBar);
