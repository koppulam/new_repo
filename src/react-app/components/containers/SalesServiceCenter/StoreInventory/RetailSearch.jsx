// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as objectPath from 'object-path';

import MediaQuery from 'react-responsive';
import styleVariables from 'lib/utils/breakpoints';
import ComboBoxElem from 'components/common/ComboBoxElem';
import { getStoreRetailInv, setRetailStoresFailure } from 'actions/SalesServiceActions';
import { searchStoresInRadius, sortStoresBasedOnDistance } from 'lib/utils/store-util';
import { getAddress, getZipCodeOrCityFromPosition } from 'lib/utils/google-address';
import { addClass, removeClass } from 'lib/dom/dom-util';
import getKeyCode from 'lib/utils/KeyCodes';

/**
 * Retail Store Search
 */
class RetailStoreSearch extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        const defaultRegion = props.regionsMap.filter(x => x.isSelected);
        const defaultType = props.searchTypes.filter(term => term.type === 'address');

        this.state = {
            showAvailable: true,
            selectedRegion: defaultRegion[0],
            type: defaultType[0].type,
            placeHolder: defaultType[0].placeHolder,
            isEmptySearched: false,
            isRegionsOpen: false,
            focusOut: false
        };
    }

    /**
     * componentdidmount
     * @returns {void}
     */
    componentDidMount() {
        navigator.geolocation.getCurrentPosition(position => {
            const coordinates = { lat: position.coords.latitude, lng: position.coords.longitude };

            getZipCodeOrCityFromPosition(coordinates, true).then((response) => {
                if (Object.keys(response).length > 0) {
                    this.retailSearchRef.value = response;
                    addClass(this.retailSearchRef.nextSibling, 'active');
                    this.setState({
                        value: response
                    });
                }
            });
        });
    }

    /**
     * Type of search selection
     * @param {String} type type of selected search type
     * @param {String} placeHolder type of selected search type
     * @returns {void}
     */
    onSelectionChanged = (type, placeHolder) => {
        this.setState({
            type,
            placeHolder,
            value: '',
            isEmptySearched: false
        });
        this.retailSearchRef.value = '';
        removeClass(this.retailSearchRef.nextSibling, 'active');
    }

    /**
     * onRegionSelected
     * @param {Object} event select change
     * @returns {void}
     */
    onRegionSelected = (event) => {
        this.selectRegionHandler(event, event.target.value);
    }

    /**
     * @description mouse leave select box handler
     * @param {Object} event click event
     * @returns {void}
     */
    onMouseLeaveHandler = (event) => {
        if (event.relatedTarget.className !== 'retail-search__region_wrap'
            && event.relatedTarget.className !== 'change-store__container_dropdown'
            && event.relatedTarget.className !== 'retail-search__region_dropdown') {
            this.setState({
                focusOut: true,
                isRegionsOpen: false
            });
        }
    }

    /**
     * getInventoryDetails
     * @param {Object} event inventory search click event
     * @returns {void}
     */
    getInventoryDetails = (event) => {
        event.preventDefault();
        const request = {
            ...this.props.getRetailInventoryRequest
        };
        const { type, value } = this.state.selectedRegion;

        request.payload.hideZeroInventory = this.state.showAvailable;
        // enter address and search
        if (this.state.value || this.state.type === 'address') {
            if (this.state.type === 'address') {
                getAddress(this.state.value).then((response) => {
                    if (Object.keys(response).length > 0) {
                        const stores = this.props.allStores;

                        // filter stores in selected radius if not all
                        if (type === 'distance') {
                            const filteredStores = searchStoresInRadius(response.lat, response.lng, value, stores, true);

                            if (filteredStores.length > 0) {
                                request.payload.storeNumbers = filteredStores;
                                this.props.dispatch(getStoreRetailInv(request));
                            } else {
                                this.props.dispatch(setRetailStoresFailure());
                            }
                        }

                        if (type === 'country') {
                            // to filter stores based on country and get inventory details
                            let storesInCountry = stores.filter(store => {
                                return (store.store.country.toLowerCase() === value.toLowerCase());
                            });

                            storesInCountry = sortStoresBasedOnDistance(response.lat, response.lng, storesInCountry).map(store => store.store.mipsstoreNumber);
                            if (storesInCountry.length) {
                                request.payload.storeNumbers = storesInCountry;
                                this.props.dispatch(getStoreRetailInv(request));
                            } else {
                                this.props.dispatch(setRetailStoresFailure());
                            }
                        }

                        if (type === 'all') {
                            // sort stores based address and display results
                            const allStoresSorted = sortStoresBasedOnDistance(response.lat, response.lng, stores).map(store => store.store.mipsstoreNumber);

                            if (allStoresSorted.length) {
                                request.payload.storeNumbers = allStoresSorted;
                                this.props.dispatch(getStoreRetailInv(request));
                            } else {
                                this.props.dispatch(setRetailStoresFailure());
                            }
                        }
                    }
                }, () => {
                    // invalid address give show error message
                    this.props.dispatch(setRetailStoresFailure());
                });
            } else {
                // search by store number
                const stores = this.props.allStores;
                const filteredStores = stores.filter(store => {
                    const storeId = store.store.mipsstoreNumber.toLowerCase();

                    return (storeId === this.state.value.toLowerCase());
                });

                if (filteredStores.length > 0) {
                    const { geoCodeLattitude, geoCodeLongitude } = filteredStores[0].store;

                    if (type === 'all') {
                        const allStoresSorted = sortStoresBasedOnDistance(geoCodeLattitude, geoCodeLongitude, stores);

                        if (allStoresSorted.length) {
                            request.payload.storeNumbers = allStoresSorted.map(x => x.store.mipsstoreNumber);
                            this.props.dispatch(getStoreRetailInv(request));
                        } else {
                            this.props.dispatch(setRetailStoresFailure());
                        }
                    }

                    if (type === 'country') {
                        let storesInCountry = stores.filter(store => {
                            return (store.store.country.toLowerCase() === value.toLowerCase());
                        });

                        storesInCountry = sortStoresBasedOnDistance(geoCodeLattitude, geoCodeLongitude, storesInCountry).map(store => store.store.mipsstoreNumber);
                        if (storesInCountry.length) {
                            request.payload.storeNumbers = storesInCountry.map(x => x.store.mipsstoreNumber);
                            this.props.dispatch(getStoreRetailInv(request));
                        } else {
                            this.props.dispatch(setRetailStoresFailure());
                        }
                    }

                    if (type === 'distance') {
                        const storesByDistance = searchStoresInRadius(geoCodeLattitude, geoCodeLongitude, value, stores, true);

                        if (storesByDistance.length > 0) {
                            request.payload.storeNumbers = storesByDistance;
                            this.props.dispatch(getStoreRetailInv(request));
                        } else {
                            this.props.dispatch(setRetailStoresFailure());
                        }
                    }
                } else {
                    this.props.dispatch(setRetailStoresFailure());
                }
            }
            this.setState({
                isEmptySearched: false
            });
        } else {
            this.setState({
                isEmptySearched: true
            });
        }
    }

    /**
     * @returns {void}
     */
    showAvailableToggle = () => {
        this.setState({
            showAvailable: !this.state.showAvailable
        });
    }

    /**
     * updateAddressStore
     * @param {Object} event value entered
     * @returns {void}
     */
    updateAddressStore = (event) => {
        this.setState({
            value: event.target.value
        });
    }

    /**
     * @description Get Entered key
     * @param {Event} e keypressevent
     * @returns {void}
     */
    getEnteredKey = (e) => {
        const charCode = e.which ? e.which : e.keyCode;
        const type = getKeyCode(charCode);
        let isEnter = false;

        if (type === 'ENTER') {
            isEnter = true;
        }

        return isEnter;
    }

    /**
     * @description searchInputHandler
     * @param {Object} event key presss event
     * @returns {void}
     */
    searchInputHandler = (event) => {
        if (this.getEnteredKey(event)) {
            this.getInventoryDetails(event);
        }
    }

    /**
     * selectRegionHandler desktop
     * @param {event} event event
     * @param {number} index selected index
     * @returns {void}
     */
    selectRegionHandler = (event, index) => {
        event.preventDefault();

        this.setState({
            selectedRegion: this.props.regionsMap[index]
        }, () => {
            this.toggleRegionsView(event);
        });
    }

    /**
     * @description Open close within drop down
     * @param {Object} event click event
     * @returns {void}
     */
    toggleRegionsView = (event) => {
        event.preventDefault();

        this.setState({
            isRegionsOpen: !this.state.isRegionsOpen,
            focusOut: false
        }, () => {
            if (!this.state.isRegionsOpen || this.state.focusOut) {
                this.radiusDropdown.focus();
            }
        });
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const { regionsMap } = this.props;

        return (
            <React-Fragment>
                <form className="retail">
                    <div className="retail-search">
                        <div className="retail-search__type">
                            {
                                this.props.searchTypes.map((searchType, index) => {
                                    return (
                                        <div
                                            key={index.toString()}
                                            role="radio"
                                            tabIndex="-1"
                                            aria-checked={this.state.type === searchType.type}
                                            className="retail-search__type_group custom-radio-wrapper"
                                            onClick={() => this.onSelectionChanged(searchType.type, searchType.placeHolder)}
                                            onKeyDown={() => this.onSelectionChanged(searchType.type, searchType.placeHolder)}
                                        >
                                            <div
                                                className={
                                                    classNames('custom-radio-wrapper__radio display__inline-block vertical-align__middle ',
                                                        {
                                                            checked: this.state.type === searchType.type
                                                        })
                                                }
                                            >
                                                <span className="blue-dot display__block" />
                                            </div>
                                            {searchType.displayValue}
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <div className="retail-search__text material-input">
                            <input
                                className="retail-search_input input"
                                name="address"
                                id="address"
                                type="text"
                                ref={el => { this.retailSearchRef = el; }}
                                onChange={this.updateAddressStore}
                                onKeyPress={this.searchInputHandler}
                            />
                            <label className="storesearchbar__of_region_label label" htmlFor="address">{this.state.placeHolder}</label>
                        </div>
                        <div className="retail-search__region">
                            <span className="retail-search__region_text">{this.props.withinLabel}</span>
                            <MediaQuery query={styleVariables.desktopAndAbove}>
                                <div className="retail-search__region_wrap" onMouseLeave={this.onMouseLeaveHandler}>
                                    <button
                                        type="button"
                                        className="retail-search__region__button btn"
                                        onClick={(event) => this.toggleRegionsView(event)}
                                        aria-label={this.state.selectedRegion.displayValue}
                                        aria-haspopup="listbox"
                                        tabIndex={0}
                                        ref={(item) => {
                                            this.regionsViewButton = item;
                                        }}
                                    >
                                        <p className="retail-search__region__button_text" tabIndex={-1}>
                                            <span className="retail-search__region__button_text_opt">{this.state.selectedRegion.displayValue}</span>
                                            <span className={
                                                classNames(
                                                    {
                                                        'icon-dropdown-down': !this.state.isRegionsOpen,
                                                        'icon-dropdown-up': this.state.isRegionsOpen
                                                    }
                                                )
                                            }
                                            />
                                        </p>
                                    </button>
                                    <ul
                                        aria-expanded="true"
                                        role="listbox"
                                        className={classNames('retail-search__region_dropdown', {
                                            hide: (!this.state.isRegionsOpen || this.state.focusOut)
                                        })}
                                    >
                                        {
                                            regionsMap.map((item, index) => {
                                                return (
                                                    <ComboBoxElem
                                                        index={index}
                                                        prefix="retail-search"
                                                        key={index.toString()}
                                                        total={regionsMap.length}
                                                        defaultListElemClass="retail-search__region_dropdown_element"
                                                        listSelectedClass="retail-search__region_dropdown_element-selected"
                                                        isSelected={item.value === this.state.selectedRegion.value}
                                                        selectOptionHandler={(event) => this.selectRegionHandler(event, index)}
                                                        optionListButtonClass="retail-search__region_dropdown_element-btn"
                                                        optionListLabelClass="retail-search__region_dropdown_element-btn_label"
                                                        optionListLabel={item.displayValue}
                                                        closeDropDown={this.toggleRegionsView}
                                                        isOpen={this.state.isRegionsOpen && !this.state.focusOut}
                                                    />
                                                );
                                            })
                                        }
                                    </ul>
                                </div>
                            </MediaQuery>
                            <MediaQuery query={styleVariables.desktopAndBelow}>
                                <div className="retail-search__dropdown">
                                    <div className="retail-search__dropdown_holder">
                                        <select onChange={this.onRegionSelected}>
                                            {this.props.regionsMap.map((region, index) => <option key={index.toString()} selected={this.state.selectedRegion.value === region.value} value={index}>{region.displayValue}</option>)}
                                        </select>
                                    </div>

                                    <span className="icon-dropdown-down" />
                                </div>
                            </MediaQuery>
                        </div>
                    </div>
                    <div className="retail-search__toggle_search">
                        <div className="retail-search__toggle_search-text">
                            <MediaQuery query={styleVariables.desktopAndAbove}>
                                <span className="retail-search__toggle_search-label">
                                    {this.props.availableStoresLabel}
                                </span>
                            </MediaQuery>
                            <span
                                tabIndex={0}
                                role="checkbox"
                                className="retail-search__toggle-switch"
                                onClick={this.showAvailableToggle}
                                onKeyPress={this.showAvailableToggle}
                                aria-checked={this.state.showAvailable}
                                aria-label="Show Available"
                            >
                                <i className={
                                    classNames({
                                        'toggle-switch_on': !this.state.showAvailable,
                                        'toggle-switch_off toggle-switch_off_right': this.state.showAvailable
                                    })
                                }
                                />
                                <i className={
                                    classNames({
                                        'toggle-switch_on toggle-switch_on_right': this.state.showAvailable,
                                        'toggle-switch_off': !this.state.showAvailable
                                    })
                                }
                                />
                            </span>
                            <MediaQuery query={styleVariables.desktopAndBelow}>
                                <span className="retail-search__toggle_search-label">
                                    &nbsp;
                                    {this.props.availableStoresLabel}
                                </span>
                            </MediaQuery>
                        </div>
                        <div>
                            <button type="button" className="retail-search__btn btn-primary" onClick={this.getInventoryDetails}>
                                <span className="cta-content">
                                    <span className="cta-text">{this.props.searchLabel}</span>
                                </span>
                            </button>
                        </div>
                    </div>

                </form>
                {
                    this.props.noRetailStores && !this.state.isEmptySearched &&
                    <div className="retail-search__no-results">
                        {this.props.noResultsLabel}
                    </div>
                }
                {
                    this.state.isEmptySearched && this.state.type !== 'address' &&
                    <div className="retail-search__no-results">
                        {this.props.searchTermMandatoryLabel}
                    </div>
                }
            </React-Fragment>
        );
    }
}


RetailStoreSearch.defaultProps = {

};

const mapStateToProps = (state) => {
    return {
        aem: state.aem,
        regionsMap: objectPath.get(state, 'aem.salesServiceCenter.retailStore.regionsMap'),
        getRetailInventoryRequest: objectPath.get(state, 'aem.salesServiceCenter.retailStore.getRetailInventoryRequest'),
        allStores: state.salesService.allStores,
        searchTypes: objectPath.get(state, 'aem.salesServiceCenter.retailStore.searchTypes'),
        availableStoresLabel: objectPath.get(state, 'aem.salesServiceCenter.retailStore.availableStoresLabel'),
        withinLabel: objectPath.get(state, 'aem.salesServiceCenter.retailStore.withinLabel'),
        searchLabel: objectPath.get(state, 'aem.salesServiceCenter.retailStore.searchLabel'),
        noResultsLabel: objectPath.get(state, 'aem.salesServiceCenter.retailStore.noResultsLabel', ''),
        searchTermMandatoryLabel: objectPath.get(state, 'aem.salesServiceCenter.retailStore.searchTermMandatoryLabel', ''),
        noRetailStores: objectPath.get(state, 'salesService.noRetailStores', false)
    };
};

RetailStoreSearch.propTypes = {
    regionsMap: PropTypes.array.isRequired,
    getRetailInventoryRequest: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    allStores: PropTypes.array.isRequired,
    searchTypes: PropTypes.array.isRequired,
    availableStoresLabel: PropTypes.string.isRequired,
    withinLabel: PropTypes.string.isRequired,
    searchLabel: PropTypes.string.isRequired,
    noResultsLabel: PropTypes.string.isRequired,
    searchTermMandatoryLabel: PropTypes.string.isRequired,
    noRetailStores: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(RetailStoreSearch);
