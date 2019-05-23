// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import classNames from 'classnames';
import objectPath from 'object-path';

import Picture from 'components/common/Picture';

import { getFilterUrlMap, isRobotTag, updateCanonicalTag } from 'lib/utils/filters';
import styleVariables from 'lib/utils/breakpoints';
import CustomScrollBar from 'components/common/CustomScrollBar';

// import './index.scss';

/**
 * Engavable Toggle button Component
 */
class DesignerCollections extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            selectedDesignerCollection: {
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
        if (nextProps.subListItemToShow === 2) {
            // reset hover image on change of any filters
            this.setState({
                selectedDesignerCollection: {
                    isLazyLoad: false,
                    hiddenOnError: true
                }
            });

            setTimeout(() => {
                const visibleSublist = document.getElementsByClassName('sub-list-visible');
                const containerOptions = document.getElementsByClassName('designer-container__options');

                if (visibleSublist && visibleSublist.length) {
                    if (containerOptions && containerOptions.length) {
                        if (containerOptions[0].clientHeight > 340) {
                            visibleSublist[0].style.height = `${containerOptions[0].clientHeight + 48}px`;

                            const filterOverlay = document.getElementsByClassName('filters-background-overlay--show');

                            if (filterOverlay && filterOverlay.length) {
                                filterOverlay[0].style.top = `${containerOptions[0].clientHeight + 64}px`;
                            }
                        }
                    }
                }
            });
        } else {
            setTimeout(() => {
                const filtersCom = document.getElementsByClassName('filters-component__body');
                const filterOverlay = document.getElementsByClassName('filters-background-overlay--show');

                if (filtersCom && filtersCom.length) {
                    filtersCom[0].style.height = '';
                    if (filterOverlay && filterOverlay.length) {
                        filterOverlay[0].style.top = '352px';
                    }
                }
            });
        }
    }

    /**
     * @param {Object} dimensionId hovered dimension id
     * @param {String} name hover collection name
     * @returns {void}
     */
    hoverDesignerCollection = (dimensionId, name) => {
        const designerCollections = objectPath.get(this.props.aem, 'designerCollections', {});
        const urlMap = getFilterUrlMap(dimensionId);
        const urlUniqueID = urlMap ? urlMap.filterUrlId : '';

        this.setState({
            selectedDesignerCollection: {
                ...this.state.selectedDesignerCollection,
                defaultSrc: designerCollections[`${urlUniqueID}`],
                altText: urlUniqueID,
                name
            }
        });
    }

    /**
     * @param {Array} endecaCollectionsData collection data
     * @param {Object} subList collection object
     * @param {String} filterUrl selected filter url
     * @returns {void}
     */
    collectionClickHandler = (endecaCollectionsData, subList, filterUrl) => {
        this.props.setFiltersSelection(subList.id, endecaCollectionsData[0].endecaDimensionId);
        updateCanonicalTag(filterUrl);
    };

    /**
     * @param {Array} endecaCollectionsData collection data
     * @param {Object} subList collection object
     * @param {Boolean} isSelected selected or not
     * @returns {void}
     */
    renderCollectionList = (endecaCollectionsData, subList, isSelected) => {
        const filterUrl = this.props.getSubListUrl(endecaCollectionsData[0].dimensionValues, subList.id);

        return (
            <div
                key={subList.id}
                role="listitem"
                className={
                    classNames('designer-container__options_item',
                        {
                            'sub-list--selected': isSelected
                        })
                }
            >
                <div
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    onClick={() => this.collectionClickHandler(endecaCollectionsData, subList, filterUrl)}
                    onKeyPress={() => this.props.setFiltersSelection(subList.id, endecaCollectionsData[0].endecaDimensionId)}
                    onMouseOver={() => this.hoverDesignerCollection(subList.id, subList.name)}
                    onFocus={() => this.hoverDesignerCollection(subList.id, subList.name)}
                    aria-label={subList.name}
                >
                    <a
                        href={filterUrl}
                        className="designer-container__options_wrapper"
                        rel={isRobotTag(this.props.selectedFilters, subList.id, 'DESIGNERS & COLLECTIONS', this.props.type, this.props.isCustomFilter) ? 'nofollow noindex' : ''}
                        onClick={(e) => { e.preventDefault(); }}
                        aria-hidden="true"
                    >
                        <label
                            className="designer-container__options_label"
                            htmlFor={subList.id}
                            tabIndex={-1}
                        >
                            {subList.name}
                            <input
                                className="designer-container__options_checkbox"
                                type="checkbox"
                                id={subList.id}
                                defaultChecked={isSelected}
                            />
                            <span className="designer-container__options_checkbox--active" />
                        </label>
                    </a>
                </div>
            </div>
        );
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const { desktopTabletAbove } = styleVariables;
        const { filtersData } = this.props;
        const endecaCollectionsData = filtersData.filter((filterData) => filterData.endecaDimensionId === 2);
        const collectionArray = [];
        const designerArray = [];

        if (endecaCollectionsData.length > 0 &&
            endecaCollectionsData[0].dimensionValues) {
            endecaCollectionsData[0].dimensionValues.forEach((filter) => {
                if (filter.isCollection) {
                    collectionArray.push(filter);
                } else {
                    designerArray.push(filter);
                }
            });
        }

        const collectionClass = collectionArray.length > 8 ? 'two-column' : 'single-column';
        const desingerClass = designerArray.length > 8 ? 'two-column' : 'single-column';

        return (
            <div className="designer-main-wrapper">
                {
                    endecaCollectionsData.length > 0 &&
                    endecaCollectionsData[0].dimensionValues &&
                    endecaCollectionsData[0].dimensionValues.length &&
                    <MediaQuery query={desktopTabletAbove}>
                        <div className={
                            classNames('designer-container',
                                {
                                    'sub-list--show': this.props.subListItemToShow === 2,
                                    'sub-list--hide': this.props.subListItemToShow !== 2
                                })
                        }
                        >
                            <div className="designer-container__preview">
                                <div>
                                    {
                                        this.state.selectedDesignerCollection.defaultSrc &&
                                        <Picture
                                            sources={this.state.selectedDesignerCollection.sources}
                                            defaultSrc={this.state.selectedDesignerCollection.defaultSrc}
                                            isLazyLoad={this.state.selectedDesignerCollection.isLazyLoad}
                                            altText={this.state.selectedDesignerCollection.altText}
                                            customClass={this.state.selectedDesignerCollection.customClass}
                                            hiddenOnError={this.state.selectedDesignerCollection.hiddenOnError}
                                        />
                                    }
                                    <span className="designer-container__preview_label">{this.state.selectedDesignerCollection.name}</span>
                                </div>
                            </div>
                            <div
                                role="list"
                                className={
                                    classNames(
                                        `designer-container__options ${desingerClass}`
                                    )
                                }
                            >
                                {
                                    designerArray.length < 8 ?
                                        <div className="col1">
                                            {
                                                endecaCollectionsData[0].dimensionValues &&
                                                endecaCollectionsData[0].dimensionValues.map((subList) => {
                                                    const isSelected = this.props.checkSelectedStatus(endecaCollectionsData[0].dimensionValues, subList.id);

                                                    return (
                                                        !subList.isCollection ?
                                                            this.renderCollectionList(endecaCollectionsData, subList, isSelected)
                                                            : null
                                                    );
                                                })
                                            }
                                        </div>
                                        :
                                        <div className="tf-g--inline">
                                            <div className="col1">
                                                {
                                                    designerArray.slice(0, 8).map((subList) => {
                                                        const isSelected = this.props.checkSelectedStatus(endecaCollectionsData[0].dimensionValues, subList.id);

                                                        return (
                                                            !subList.isCollection ?
                                                                this.renderCollectionList(endecaCollectionsData, subList, isSelected)
                                                                : null
                                                        );
                                                    })
                                                }
                                            </div>
                                            <div className="col2">
                                                {
                                                    designerArray.slice(8, designerArray.length).map((subList) => {
                                                        const isSelected = this.props.checkSelectedStatus(endecaCollectionsData[0].dimensionValues, subList.id);

                                                        return (
                                                            !subList.isCollection ?
                                                                this.renderCollectionList(endecaCollectionsData, subList, isSelected)
                                                                : null
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                }
                            </div>
                            {
                                collectionArray.length > 0 &&
                                <div
                                    role="list"
                                    className={
                                        classNames(
                                            `designer-container__options ${collectionClass} child`
                                        )
                                    }
                                >
                                    {
                                        <CustomScrollBar iosEnable>
                                            {
                                                collectionArray.map((subList) => {
                                                    const isSelected = this.props.checkSelectedStatus(endecaCollectionsData[0].dimensionValues, subList.id);

                                                    return (
                                                        subList.isCollection ?
                                                            this.renderCollectionList(endecaCollectionsData, subList, isSelected)
                                                            : null
                                                    );
                                                })
                                            }
                                        </CustomScrollBar>
                                    }
                                </div>
                            }

                        </div>
                    </MediaQuery>
                }
            </div>
        );
    }
}

DesignerCollections.propTypes = {
    filtersData: PropTypes.array.isRequired,
    subListItemToShow: PropTypes.any,
    setFiltersSelection: PropTypes.func.isRequired,
    aem: PropTypes.any.isRequired,
    type: PropTypes.string.isRequired,
    getSubListUrl: PropTypes.func.isRequired,
    checkSelectedStatus: PropTypes.func.isRequired,
    selectedFilters: PropTypes.array.isRequired,
    isCustomFilter: PropTypes.bool
};

DesignerCollections.defaultProps = {
    subListItemToShow: '',
    isCustomFilter: false
};

const mapStateToProps = (state) => {
    return {
        aem: state.aem,
        type: state.filters.type,
        selectedFilters: state.filters.selectedFilters
    };
};

export default connect(mapStateToProps)(DesignerCollections);
