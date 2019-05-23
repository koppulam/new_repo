// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import React Table
import ReactTable from 'react-table';
import MediaQuery from 'react-responsive';
import styleVariables from 'lib/utils/breakpoints';

import * as objectPath from 'object-path';
import RetailStoreSearch from './RetailSearch';

/**
 * Retail store details
 */
class StoreRetailInventory extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.state = {
            selectedSortBy: ''
        };
    }

    /**
     * redirect on selecting in mobile
     * @param {event} event on select
     * @returns {void}
     */
    onSortByChange = (event) => {
        this.setState({
            selectedSortBy: event.target.value
        });
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            storeNumber, storeName, totalInTransit, onHand, reserved, available, assorted
        } = this.props.columnHeadings;
        const total = this.props.retailStoreInventory.length ? this.props.retailStoreInventory.reduce((a, b) => ({ available: a.available + b.available })) : 0;
        const { sortByLabel = 'Sort By' } = this.props.labels;
        const sortByOptions = {
            storeNumber,
            storeName
        };

        if (this.state.selectedSortBy) {
            this.props.retailStoreInventory.sort((store1, store2) => {
                if (this.state.selectedSortBy === 'storeNumber') {
                    return store1[this.state.selectedSortBy] - store2[this.state.selectedSortBy];
                }
                if (store1[this.state.selectedSortBy] < store2[this.state.selectedSortBy]) {
                    return -1;
                }
                if (store1[this.state.selectedSortBy] > store2[this.state.selectedSortBy]) {
                    return 1;
                }
                return 0;
            });
        }

        /**
         * Render Component.
         * @returns {object} html instance
         */
        return (
            <div className="container-centered">
                <RetailStoreSearch />
                <MediaQuery query={styleVariables.desktopAndAbove}>
                    {
                        (this.props.retailStoreInventory.length > 0) &&
                        <ReactTable
                            data={this.props.retailStoreInventory}
                            showPagination={false}
                            minRows={0}
                            defaultPageSize={this.props.retailStoreInventory.length}
                            resizable={false}
                            columns={[
                                {
                                    Header: () => {
                                        return (
                                            <span className="sort-header tf-g--no-wrap tf-g__between">
                                                {/* eslint-disable-next-line */}
                                                {storeNumber} <i className="icon-dropdown-up" /> <i className="icon-dropdown-down" />
                                            </span>
                                        );
                                    },
                                    accessor: table => Number(table.storeNumber),
                                    id: 'storeNumber',
                                    sortable: true,
                                    minWidth: 165,
                                    Footer: this.props.availableFooterText
                                },
                                {
                                    Header: () => {
                                        return (
                                            <span className="sort-header tf-g--no-wrap tf-g__between">
                                                {/* eslint-disable-next-line */}
                                                {storeName} <i className="icon-dropdown-up" /> <i className="icon-dropdown-down" />
                                            </span>
                                        );
                                    },
                                    accessor: 'storeName',
                                    minWidth: 465,
                                    sortable: true
                                },
                                {
                                    Header: totalInTransit,
                                    accessor: 'totalInTransit',
                                    minWidth: 165,
                                    sortable: false
                                },
                                {
                                    Header: onHand,
                                    accessor: 'onHand',
                                    minWidth: 165,
                                    sortable: false
                                },
                                {
                                    Header: reserved,
                                    accessor: 'reserved',
                                    minWidth: 165,
                                    sortable: false
                                },
                                {
                                    Header: available,
                                    accessor: 'available',
                                    minWidth: 165,
                                    sortable: false
                                },
                                {
                                    Header: assorted,
                                    accessor: 'isAssorted',
                                    minWidth: 165,
                                    sortable: false,
                                    Cell: (row) => <span>{row.value ? 'Y' : 'N'}</span>,
                                    Footer: (
                                        <span>
                                            {
                                                total ? total.available : 0
                                            }
                                        </span>
                                    )
                                }
                            ]}
                        />
                    }
                </MediaQuery>
                <MediaQuery query={styleVariables.desktopAndBelow}>
                    {
                        this.props.retailStoreInventory.length > 0 &&
                        <React.Fragment>
                            <div className="sales-service__sort-by">
                                <label htmlFor="salesServiceSortBy">
                                    <select
                                        onChange={this.onSortByChange}
                                        id="salesServiceSortBy"
                                    >
                                        {
                                            this.state.selectedSortBy === '' &&
                                            <option
                                                value=""
                                                key={sortByLabel}
                                            >
                                                {sortByLabel}
                                            </option>
                                        }
                                        {
                                            Object.keys(sortByOptions).map((option) => (
                                                <option
                                                    value={option}
                                                    key={option}
                                                >
                                                    {sortByOptions[option]}
                                                </option>
                                            ))
                                        }
                                    </select>
                                    <span className="icon-dropdown-down" />
                                </label>
                            </div>
                            {
                                this.props.retailStoreInventory.map(distributionInv => {
                                    return (
                                        <div className="sales-service__wrap">
                                            <div className="sales-service__row">
                                                <div className="sales-service__row_heading">
                                                    {storeNumber}
                                                </div>
                                                <div className="sales-service__row_value">
                                                    {distributionInv.storeNumber}
                                                </div>
                                            </div>
                                            <div className="sales-service__row">
                                                <div className="sales-service__row_heading">
                                                    {storeName}
                                                </div>
                                                <div className="sales-service__row_value">
                                                    {distributionInv.storeName}
                                                </div>
                                            </div>
                                            <div className="sales-service__row">
                                                <div className="sales-service__row_heading">
                                                    {totalInTransit}
                                                </div>
                                                <div className="sales-service__row_value">
                                                    {distributionInv.totalInTransit}
                                                </div>
                                            </div>
                                            <div className="sales-service__row">
                                                <div className="sales-service__row_heading">
                                                    {onHand}
                                                </div>
                                                <div className="sales-service__row_value">
                                                    {distributionInv.onHand}
                                                </div>
                                            </div>
                                            <div className="sales-service__row">
                                                <div className="sales-service__row_heading">
                                                    {reserved}
                                                </div>
                                                <div className="sales-service__row_value">
                                                    {distributionInv.reserved}
                                                </div>
                                            </div>
                                            <div className="sales-service__row">
                                                <div className="sales-service__row_heading">
                                                    {available}
                                                </div>
                                                <div className="sales-service__row_value">
                                                    {distributionInv.available}
                                                </div>
                                            </div>
                                            <div className="sales-service__row">
                                                <div className="sales-service__row_heading">
                                                    {assorted}
                                                </div>
                                                <div className="sales-service__row_value">
                                                    {distributionInv.isAssorted ? 'Y' : 'N'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            <div className="sales-service__row table-footer">
                                <div className="sales-service__row_heading">
                                    { this.props.availableFooterText }
                                </div>
                                <div className="sales-service__row_value">
                                    { total ? total.available : 0 }
                                </div>
                            </div>
                        </React.Fragment>
                    }
                </MediaQuery>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        aem: state.aem,
        labels: state.authoredLabels,
        retailStoreInventory: objectPath.get(state, 'salesService.retailStoreInventory', []),
        availableFooterText: objectPath.get(state, 'aem.salesServiceCenter.availableFooterLabel'),
        columnHeadings: state.salesService.columnHeadings
    };
};

StoreRetailInventory.propTypes = {
    retailStoreInventory: PropTypes.array.isRequired,
    columnHeadings: PropTypes.object.isRequired,
    availableFooterText: PropTypes.string.isRequired,
    labels: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(StoreRetailInventory);
