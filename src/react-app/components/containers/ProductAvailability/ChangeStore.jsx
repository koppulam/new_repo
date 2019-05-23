// Packages
import $ from 'jquery';
import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import { removeClass } from 'lib/dom/dom-util';
import CustomDropDown from 'components/common/CustomDropDown';

import { setAnalyticsError } from 'lib/utils/analytics-util';
import getKeyCode from 'lib/utils/KeyCodes';

import ComboBoxElem from 'components/common/ComboBoxElem';

import {
    changeStoreStatus,
    storeSearch,
    storeSearchCountry,
    updateSearchAddress,
    setRadius,
    fetchStoresForCountry,
    setSelectedRegion
} from 'actions/FindStoreActions';

import styleVariables from 'lib/utils/breakpoints';

import FC from 'constants/FindStoreConstants';
import AnalyticsConstants from 'constants/HtmlCalloutConstants';

import TiffanyInlineModal from 'components/common/TiffanyInlineModal';
import SearchResults from './SearchResults';

// import './index.scss';

const { getAddress, getZipCodeOrCityFromPosition } = require('lib/utils/google-address');


/**
 * @description changeStore component
 * @param {object} selectedIndex of selected symobl type
 * @returns {void}
 */
class ChangeStore extends Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        const changeStoreConfig = objectPath.get(window.tiffany, 'pdpConfig.changeStore', {});
        const regionConfig = objectPath.get(changeStoreConfig, 'regionsConfig', []);
        let selectedCountryIndex = -1;
        const pageSiteID = objectPath.get(props.aem, 'siteID', 0);
        const selectedRegions = regionConfig.filter((element, index) => {
            let isSelected;

            if (props.selectedRegion) {
                isSelected = element.siteId === props.selectedRegion;

                if (isSelected) {
                    selectedCountryIndex = index;
                }
            } else {
                isSelected = element.siteId === pageSiteID;

                if (isSelected) {
                    selectedCountryIndex = index;
                }
            }
            return isSelected;
        });

        this.state = {
            isRadiusSelected: false,
            addressDetails: this.props.addressDetails || '',
            searchStore: false,
            selectedRadius: changeStoreConfig.radiusOptions[0],
            focusOut: false,
            isLoading: false,
            showModal: false,
            noResponse: false,
            noInputAddress: false,
            selectedRegion: this.props.selectedRegion ? this.props.selectedRegion : (selectedRegions[0] || regionConfig[0] || {}),
            selectedCountryIndex,
            dropdownVisible: false
        };
        this.showMoreBtn = React.createRef();
    }

    /**
     * @description On component monted life cycle event
     * @returns {void}
     */
    componentDidMount() {
        this.container = document.querySelector('.product-description__container');
        this.buttonContainer = document.querySelector('.product-description__buttons');
    }

    /**
    * @description On props changed life cycle event
    * @param {object} nextProps updated params
    * @returns {void}
    */
    componentWillReceiveProps(nextProps) {
        if (this.props.searchResults !== nextProps.searchResults && nextProps.searchResults.length > 0) {
            this.setState({ showModal: true, addressDetails: nextProps.addressDetails });
        }
    }

    /**
     * @description On focus out from the dropdown close the dropdown.
     * @param {Object} event select event
     * @returns {void}
     */
    onMouseLeaveHandler = (event) => {
        if (event.relatedTarget.className !== 'change-store__container' && event.relatedTarget.className !== 'change-store__container_dropdown' && event.relatedTarget.className !== 'change-store__container__button') {
            this.setState({
                focusOut: true,
                isRadiusSelected: false
            });
        }
    }

    /**
     * Dropdown toggled.
     * @returns {void} none
     */
    onDropDowntoggeled = () => {
        this.setState({
            ...this.state,
            dropdownVisible: !this.state.dropdownVisible
        });
    }

    /**
     * @description get geolocation on selecting the current location
     * @param {Object} position position of the geo location.
     * @returns {void}
     */
    onSucess = (position) => {
        const coordinates = { lat: position.coords.latitude, lng: position.coords.longitude };

        getZipCodeOrCityFromPosition(coordinates).then((response) => {
            if (Object.keys(response).length > 0) {
                this.setState({ addressDetails: response });
                this.props.dispatch(updateSearchAddress(response));
            }
        });
    }

    /**
     * @description On KeyPress event of search Store button action
     * @param {Event} e keypressevent
     * @returns {void}
     */
    onStoreSearch = (e) => {
        if (this.getEnteredKey(e)) {
            this.storeSearchAction();
        }
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
     * @description getErrorState method to check error state
     * @returns {boolean} returns error state
     */
    getErrorState = () => {
        if ((this.props.isError ||
            this.state.noInputAddress ||
            ((!this.state.isLoading && this.state.searchStore && this.props.foundStores.length === 0) ||
                this.state.noResponse))) {
            return true;
        }
        return false;
    }

    /**
     * @description setAddressDetails on Enter
     * @param {Object} event select event
     * @returns {void}
     */
    setAddressDetails = (event) => {
        if (this.getEnteredKey(event)) {
            this.storeSearchAction();
        }
    }

    /**
     * @description getCountryDetails get country details based on siteId.
     * @returns {void}
     */
    getCountryDetails = () => {
        const countryList = objectPath.get(window.tiffany, 'authoredContent.globalSiteConfig', {});
        const { siteId } = this.state.selectedRegion;
        let country = '';

        if (countryList && countryList.length > 0) {
            countryList.forEach(element => {
                if (element.siteID === siteId) {
                    country = `${element.googleMapRegionCode}_${element.googleMapRegionCode}`;
                }
            });
        }
        return country;
    }

    /**
     * function to set category
     * @param {object} selectedIndex of country
     * @returns {void}
     */
    regionChanged = (selectedIndex) => {
        const regionsConfig = objectPath.get(this.props.pdpConfig, 'changeStore.regionsConfig', []);

        if (regionsConfig[selectedIndex]) {
            const {
                region,
                siteId,
                regionLabel
            } = regionsConfig[selectedIndex];

            this.setState({
                ...this.state,
                selectedRegion: {
                    region,
                    siteId,
                    regionLabel
                }
            });
        }
    }

    /**
     * @description Capture address i.e. city,state,zipcode from the input field.
     * @param {Object} event select event
     * @returns {void}
     */
    captureAddress = (event) => {
        event.preventDefault();
        this.setState({
            addressDetails: event.target.value
        });
        this.props.dispatch(updateSearchAddress(event.target.value));
    }

    /**
     * @description Choose radius from the custom dropdown.
     * @param {Object} event select event
     * @param {Number} radius selected radius from the dropdown.
     * @returns {void}
     */
    chooseRadius = (event, radius) => {
        event.stopPropagation();
        this.setState({
            focusOut: false,
            selectedRadius: radius,
            isRadiusSelected: !this.state.isRadiusSelected
        });
        setTimeout(() => {
            this.radiusDropdown.focus();
        });
        this.props.dispatch(setRadius(radius));
    }

    /**
     * @description close change store modal
     * @param {String} navigateFrom specifies from which section/page its been navigated.
     * @returns {void}
     */
    closeChangeStore = (navigateFrom) => {
        const storeDetails = document.querySelector('.store-details');

        this.props.dispatch(changeStoreStatus(false));
        removeClass(storeDetails, 'hide');
        removeClass(this.buttonContainer, 'find-store-button-desktop-hidden');

        if (!this.props.storeDetailStatus) {
            removeClass(this.container, 'relative-holder');
            removeClass(this.buttonContainer, 'hide__desktop-and-above');
        }
        this.setState({ searchStore: false });
        this.resetShowModal();

        if (navigateFrom === FC.FROM_STORE_SEARCH) {
            this.props.closeModal();
        }
        this.props.closeInit();
    }

    /**
     * @description On search Store button action
     * @returns {void}
     */
    storeSearchAction = () => {
        if (this.state.addressDetails && this.state.addressDetails.length > 0) {
            const choosedRadius = this.props.selectedRadius ? this.props.selectedRadius : this.state.selectedRadius;
            const locale = objectPath.get(window.tiffany, 'locale', '');
            const regionCode = this.getCountryDetails();

            this.props.dispatch(updateSearchAddress(this.state.addressDetails));
            this.setState({ isLoading: true });

            if (this.state.selectedRegion.siteId && this.state.selectedRegion.region) {
                getAddress(this.state.addressDetails, regionCode).then((response) => {
                    if (Object.keys(response).length > 0 && this.state.selectedRegion && this.state.selectedRegion.siteId && this.state.selectedRegion.region) {
                        fetchStoresForCountry(this.state.selectedRegion.siteId, this.state.selectedRegion.region).then((res) => {
                            this.props.dispatch(storeSearchCountry(response.lat, response.lng, choosedRadius, res));
                            this.setState({
                                ...this.state,
                                searchStore: true,
                                isLoading: false
                            });
                            const {
                                region,
                                siteId,
                                regionLabel
                            } = this.state.selectedRegion;

                            this.props.dispatch(setSelectedRegion({
                                selectedRegion: {
                                    region,
                                    regionLabel,
                                    siteId
                                }
                            }));
                        }, () => {
                            this.setState({
                                noResponse: true
                            });
                            setAnalyticsError(AnalyticsConstants.NORESPONSE);
                        });
                    } else {
                        this.setState({
                            ...this.state,
                            searchStore: true,
                            isLoading: false
                        });
                        setAnalyticsError(AnalyticsConstants.SERVICEFAILED);
                    }
                }, () => {
                    this.setState({ noInputAddress: true });
                    setAnalyticsError(AnalyticsConstants.NOINPUTADDRESS);
                    this.setState({
                        ...this.state,
                        searchStore: true,
                        isLoading: false
                    });
                    setAnalyticsError(AnalyticsConstants.SERVICEFAILED);
                });
            } else {
                getAddress(this.state.addressDetails, locale).then((response) => {
                    this.setState({
                        ...this.state,
                        searchStore: true,
                        isLoading: false
                    });
                    if (Object.keys(response).length > 0) {
                        this.props.dispatch(storeSearch(response.lat, response.lng, choosedRadius));
                    } else {
                        this.setState({
                            noResponse: true
                        });
                        setAnalyticsError(AnalyticsConstants.NORESPONSE);
                    }
                }, () => {
                    this.setState({
                        ...this.state,
                        searchStore: true,
                        isLoading: false
                    });
                    setAnalyticsError(AnalyticsConstants.SERVICEFAILED);
                });
            }
        } else {
            this.setState({ noInputAddress: true });
            setAnalyticsError(AnalyticsConstants.NOINPUTADDRESS);
        }
    }

    /**
     * @description search Store.
     * @returns {void}
     */
    useCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.onSucess);
        }
    }

    /**
     * @description toggle the radius dropdown.
     * @returns {void}
     */
    toggleRadiusView = () => {
        this.setState({
            focusOut: false,
            isRadiusSelected: !this.state.isRadiusSelected
        }, () => {
            if (!this.state.isRadiusSelected || this.state.focusOut) {
                this.radiusDropdown.focus();
            }
        });
    }

    /**
     * @description Select change handler on mobile
     * @param {Event} event onchange handler
     * @returns {void}
     */
    selectDropdownOnMobile = (event) => {
        event.preventDefault();
        const { value } = event.target.options[event.target.selectedIndex];

        this.setState({ selectedRadius: value });
        this.props.dispatch(setRadius(value));
    }

    /**
     * Reset error message
     * @param {Event} event onchange handler
     * @returns {void}
     */
    resetErrorMessage = () => {
        this.setState({ searchStore: false });
        this.setState({ addressDetails: '' });
        this.setState({
            noResponse: false,
            noInputAddress: false
        });
        this.props.dispatch(updateSearchAddress(''));
    }

    /**
     * Reset showModal state
     * @param {Event} event onchange handler
     * @returns {void}
     */
    resetShowModal = () => {
        this.setState({ showModal: false });
        $('.pdp-container').removeClass('base-items-hidden');
    }

    /**
     * @description life cycle method to update form validator on every update
     * @returns {void}
     */
    inlineModalInit = () => {
        $('.pdp-container').addClass('change-store-holder');
    }

    /**
     * @returns {object} Element
     */
    render() {
        const changeStoreConfig = objectPath.get(this.props.pdpConfig, 'changeStore', {});
        const searchConfig = objectPath.get(this.props.pdpConfig, 'storeSearchConfig', {});
        const labels = objectPath.get(window, 'tiffany.labels', {});
        const radiusConfig = (objectPath.get(changeStoreConfig, 'radiusOptions', {}));
        const radiusOptions = radiusConfig.sort((a, b) => { return (a - b); });
        const choosedRadius = this.props.selectedRadius ? this.props.selectedRadius : this.state.selectedRadius;
        const htmlCallout = {
            interactionContext: '',
            interactionType: 'tab-activity',
            interactionName: 'find-item-in-store:search'
        };
        const countryList = objectPath.get(changeStoreConfig, 'regionsConfig', []);
        const showCountryDropdown = (countryList && countryList.length > 0);

        return (
            <Fragment>
                {this.props.changeStoreStatus &&
                    <div className="change-store">
                        {
                            this.props.isFISS &&
                            <MediaQuery query={styleVariables.desktopAndBelow}>
                                <button type="button" className="change-store__item_close" aria-label={labels.changeStoreCloseLabel} onClick={this.closeChangeStore}>
                                    <img src={this.props.closeSrc} alt={this.props.closeAltText} />
                                </button>
                            </MediaQuery>
                        }
                        <div className="change-store__item">
                            <p className="change-store__item_text">{changeStoreConfig.availabilityPlaceholderText}</p>
                            <span className="change-store__item_section">
                                {changeStoreConfig.text}
                                <MediaQuery query={styleVariables.desktopAndBelow}>
                                    <div
                                        className="change-store__item_section_container"
                                    >
                                        <select
                                            aria-label={changeStoreConfig.selectMilesArialLabel}
                                            id="radius-dropdown"
                                            value={this.props.selectedRadius}
                                            className="change-store__item_section_container_dropdown"
                                            onChange={this.selectDropdownOnMobile}
                                        >
                                            {
                                                radiusOptions.map((item, index) => {
                                                    return (
                                                        <option
                                                            key={index.toString()}
                                                            value={item}
                                                            selected={parseInt(this.state.selectedRadius, 10) === parseInt(item, 10)}
                                                        >
                                                            {item}
                                                            &nbsp;
                                                            {changeStoreConfig.radiusUnit}
                                                        </option>
                                                    );
                                                })
                                            }
                                        </select>
                                        <span className="icon-dropdown-down" />
                                    </div>
                                </MediaQuery>
                                <MediaQuery query={styleVariables.desktopAndAbove}>
                                    <div
                                        className="change-store__container"
                                        onMouseLeave={this.onMouseLeaveHandler}
                                    >
                                        <button
                                            type="button"
                                            className="change-store__container__button"
                                            onClick={this.toggleRadiusView}
                                            aria-label={`${choosedRadius} ${changeStoreConfig.radiusUnit}`}
                                            aria-haspopup="listbox"
                                            tabIndex={0}
                                            ref={(item) => {
                                                this.radiusDropdown = item;
                                            }}
                                        >
                                            <p className="change-store__container__button_text" tabIndex={-1}>
                                                <span className="change-store__container__button_text_opt">
                                                    {choosedRadius}
                                                    &nbsp;
                                                    {changeStoreConfig.radiusUnit}
                                                </span>
                                                <span className={
                                                    classNames(
                                                        {
                                                            'icon-dropdown-down': !this.state.isRadiusSelected || this.state.isRadiusSelected
                                                        }
                                                    )
                                                }
                                                />
                                            </p>
                                        </button>
                                        <ul
                                            aria-expanded={this.state.isRadiusSelected}
                                            role="listbox"
                                            className={classNames('change-store__container_dropdown', {
                                                hide: (!this.state.isRadiusSelected || this.state.focusOut)
                                            })
                                            }
                                        >
                                            {
                                                radiusOptions.map((item, index) => {
                                                    const radiusOption = `${item} ${changeStoreConfig.radiusUnit}`;

                                                    return (
                                                        <ComboBoxElem
                                                            index={index}
                                                            key={index.toString()}
                                                            prefix={this.props.type}
                                                            total={radiusOptions.length}
                                                            defaultListElemClass="change-store__container_dropdown_element"
                                                            listSelectedClass="change-store__container_dropdown_element_selected"
                                                            isSelected={(parseInt(item, 10) === parseInt(choosedRadius, 10))}
                                                            selectOptionHandler={(event) => this.chooseRadius(event, item)}
                                                            optionListButtonClass="change-store__container_dropdown_element-btn"
                                                            optionListLabelClass="change-store__container_dropdown_element-btn_label"
                                                            optionListLabel={radiusOption}
                                                            closeDropDown={this.toggleRadiusView}
                                                            isOpen={this.state.isRadiusSelected && !this.state.focusOut}
                                                        />
                                                    );
                                                })
                                            }
                                        </ul>
                                    </div>
                                </MediaQuery>
                                {changeStoreConfig.concatenationText}
                            </span>
                            <div className="change-store__item_input-container">
                                <div className="material-input">
                                    <input
                                        type="text"
                                        id={`change-store-input-${this.props.type}`}
                                        value={this.props.addressDetails}
                                        onChange={this.captureAddress}
                                        onKeyPress={this.setAddressDetails}
                                        onClick={this.resetErrorMessage}
                                        required
                                    />
                                    <label
                                        className={classNames({
                                            active: this.props.addressDetails
                                        })}
                                        htmlFor={`change-store-input-${this.props.type}`}
                                    >
                                        {changeStoreConfig.inputPlaceholder}
                                    </label>
                                    <button
                                        type="button"
                                        className="change-store__item_cta cta"
                                        onClick={this.useCurrentLocation}
                                    >
                                        <span
                                            role="button"
                                            tabIndex={0}
                                            className="cta-content"
                                        >
                                            {changeStoreConfig.currentLocation}
                                        </span>
                                    </button>
                                    {
                                        showCountryDropdown &&

                                        <div
                                            className="change-store__item_pdpCountryDropdown"
                                        >
                                            <span className="change-store__item_drop-text">{changeStoreConfig.StaticDropdownText}</span>
                                            <CustomDropDown
                                                title={this.state.selectedRegion.regionLabel}
                                                options={countryList}
                                                descriptionfield="regionLabel"
                                                onselect={this.regionChanged}
                                                ontoggeled={this.onDropDowntoggeled}
                                                closeOnMouseLeave
                                                defaultSelectedIndex={this.state.selectedCountryIndex}
                                                closeOnOutsideClick
                                            />
                                        </div>
                                    }
                                </div>
                                <button
                                    type="button"
                                    className="change-store__item_button"
                                    onKeyPress={this.onStoreSearch}
                                    onClick={this.storeSearchAction}
                                    ref={this.showMoreBtn}
                                    data-interaction-context={htmlCallout.interactionContext}
                                    data-interaction-type={htmlCallout.interactionType}
                                    data-interaction-name={htmlCallout.interactionName}
                                >
                                    <span className="change-store__item_button_text" tabIndex={-1}>{changeStoreConfig.buttonText}</span>
                                </button>
                            </div>
                            {
                                (this.getErrorState()) &&
                                <div role="alert" className="change-store__item_error-msg">
                                    <tiffany-information-text config={changeStoreConfig.errorMsg} />
                                </div>
                            }
                            <MediaQuery query={styleVariables.desktopAndAbove}>
                                <tiffany-information-text config={changeStoreConfig.helpText} />
                            </MediaQuery>
                        </div>
                        <MediaQuery query={styleVariables.desktopAndAbove}>
                            <button type="button" className="change-store__item_close" aria-label={labels.changeStoreCloseLabel} onClick={this.closeChangeStore}>
                                <img src={this.props.closeSrc} alt={this.props.closeAltText} />
                            </button>
                        </MediaQuery>
                    </div>
                }
                <TiffanyInlineModal
                    childComponentInit={this.inlineModalInit}
                    showModal={this.state.showModal}
                    holder="pdp-container"
                    customClass="store-results"
                    triggerElement={this.showMoreBtn.current}
                    showLeftArrow
                    closeAriaLabel={searchConfig.closeAriaLabel}
                    leftArrowAriaLabel={searchConfig.leftArrowAriaLabel}
                    resetInitiator={this.resetShowModal}
                    isFIIS
                >
                    <SearchResults onClose={this.closeChangeStore} />
                </TiffanyInlineModal>
            </Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        changeStoreStatus: state.findStore.changeStoreStatus,
        foundStores: state.findStore.foundStores,
        storeDetailStatus: state.findStore.storeDetailStatus,
        addressDetails: state.findStore.addressDetails,
        searchResults: state.findStore.searchResults,
        selectedRadius: state.findStore.selectedRadius,
        isError: state.findStore.isError,
        pdpConfig: state.productDetails.pdpConfig,
        aem: state.aem,
        closeSrc: objectPath.get(state, 'aem.icons.close.src', ''),
        closeAltText: objectPath.get(state, 'aem.icons.close.altText', ''),
        selectedRegion: state.findStore.selectedRegion
    };
};

ChangeStore.propTypes = {
    dispatch: PropTypes.func.isRequired,
    closeModal: PropTypes.func,
    changeStoreStatus: PropTypes.bool.isRequired,
    foundStores: PropTypes.array.isRequired,
    storeDetailStatus: PropTypes.any,
    addressDetails: PropTypes.string.isRequired,
    searchResults: PropTypes.array.isRequired,
    selectedRadius: PropTypes.any.isRequired,
    type: PropTypes.string,
    isError: PropTypes.bool.isRequired,
    pdpConfig: PropTypes.object.isRequired,
    aem: PropTypes.object.isRequired,
    closeSrc: PropTypes.string.isRequired,
    closeAltText: PropTypes.string.isRequired,
    selectedRegion: PropTypes.any.isRequired,
    closeInit: PropTypes.func,
    isFISS: PropTypes.bool
};

ChangeStore.defaultProps = {
    closeModal: () => { },
    storeDetailStatus: null,
    type: 'change-store',
    closeInit: () => { },
    isFISS: false
};

export default connect(mapStateToProps)(ChangeStore);
