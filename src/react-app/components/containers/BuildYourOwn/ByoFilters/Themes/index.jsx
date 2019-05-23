// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import classNames from 'classnames';
import objectPath from 'object-path';

import Picture from 'components/common/Picture';
import styleVariables from 'lib/utils/breakpoints';

// import './index.scss';

/**
 * Engavable Toggle button Component
 */
class Themes extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            selectedThemesCollection: {
                isLazyLoad: false,
                hiddenOnError: true
            }
        };
    }

    /**
     * @param {object} nextProps updated Props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.subListItemToShow === 1) {
            // reset hover image on change of any filters
            this.setState({
                selectedThemesCollection: {
                    isLazyLoad: false,
                    hiddenOnError: true
                }
            });
        }
    }

    /**
     * @param {Object} dimensionId hovered dimension id
     * @param {String} name hover collection name
     * @param {String} urlUniqueID hover collection name
     * @returns {void}
     */
    hoverThemesCollection = (dimensionId, name, urlUniqueID) => {
        const imageObject = objectPath.get(this.props.aem, 'themeFilterImages', '');

        this.setState({
            selectedThemesCollection: {
                ...this.state.selectedThemesCollection,
                defaultSrc: imageObject[`${urlUniqueID}`],
                altText: urlUniqueID,
                name
            }
        });
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const { desktopTabletAbove } = styleVariables;
        const endecaThemesData = this.props.filtersData ? this.props.filtersData : [];

        return (
            <div className="themes-main-wrapper">
                {
                    endecaThemesData.length > 0 &&
                    <MediaQuery query={desktopTabletAbove}>
                        <div className="themes-container tf-g--inline">
                            <ul className="themes-container__options">
                                <li className="themes-container__preview">
                                    {
                                        this.state.selectedThemesCollection.defaultSrc &&
                                        <Picture
                                            sources={this.state.selectedThemesCollection.sources}
                                            defaultSrc={this.state.selectedThemesCollection.defaultSrc}
                                            isLazyLoad={this.state.selectedThemesCollection.isLazyLoad}
                                            altText={this.state.selectedThemesCollection.altText}
                                            customClass={this.state.selectedThemesCollection.customClass}
                                            hiddenOnError={this.state.selectedThemesCollection.hiddenOnError}
                                        />
                                    }
                                    <span className="themes-container__preview_label">{this.state.selectedThemesCollection.name}</span>
                                </li>
                                {
                                    endecaThemesData.map((subList) => {
                                        const isSelected = this.props.checkSelectedStatus(endecaThemesData, subList.id);
                                        const ariaBoolean = isSelected;
                                        const ariaNameCount = `${subList.name} ${subList.count}`;
                                        const ariaName = `${subList.name}`;

                                        return (
                                            <li
                                                key={subList.id}
                                                className={
                                                    classNames('themes-container__options_item',
                                                        {
                                                            'sub-list--selected': isSelected
                                                        })
                                                }
                                            >
                                                <div
                                                    role="checkbox"
                                                    className="themes-container__options_wrapper cta"
                                                    onMouseOver={() => this.hoverThemesCollection(subList.id, subList.name, subList.urluniqueId)}
                                                    onFocus={() => this.hoverThemesCollection(subList.id, subList.name, subList.urluniqueId)}
                                                    onClick={(e) => { e.preventDefault(); this.props.setFiltersSelection(subList.id); }}
                                                    onKeyPress={(e) => { e.preventDefault(); this.props.setFiltersSelection(subList.id); }}
                                                    tabIndex={0}
                                                    aria-label={ariaBoolean ? ariaNameCount : ariaName}
                                                    aria-checked={isSelected}
                                                >
                                                    <label
                                                        className="themes-container__options_label cta-content"
                                                        htmlFor={subList.id}
                                                        tabIndex={-1}
                                                    >
                                                        {subList.name}
                                                        <input
                                                            className="themes-container__options_checkbox"
                                                            type="checkbox"
                                                            id={subList.id}
                                                            defaultChecked={isSelected}
                                                        />
                                                        <span className="themes-container__options_checkbox--active" />
                                                    </label>
                                                    {
                                                        isSelected &&
                                                        <span className="themes-container__options_count">
                                                            (
                                                            {subList.count}
                                                            )
                                                        </span>
                                                    }
                                                </div>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    </MediaQuery>
                }
            </div>
        );
    }
}

Themes.propTypes = {
    filtersData: PropTypes.array.isRequired,
    subListItemToShow: PropTypes.any,
    setFiltersSelection: PropTypes.func.isRequired,
    aem: PropTypes.any.isRequired,
    checkSelectedStatus: PropTypes.func.isRequired
};

Themes.defaultProps = {
    subListItemToShow: ''
};

const mapStateToProps = (state) => {
    return {
        aem: state.aem,
        type: state.filters.type,
        selectedFilters: state.filters.selectedFilters
    };
};

export default connect(mapStateToProps)(Themes);
