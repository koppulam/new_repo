// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import MediaQuery from 'react-responsive';
import styleVariables from 'lib/utils/breakpoints';

// Import React Table
import ReactTable from 'react-table';

/**
 * Distribution Inventory center table
 */
class DistributionInventory extends React.Component {
    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            dcNubmer, dcStoreName, transitTime, onHand, reserved, available
        } = this.props.columnHeadings;
        const { distributionInventory } = this.props;
        let total = {};

        if (distributionInventory && distributionInventory.length > 0) {
            total = this.props.distributionInventory.reduce((a, b) => ({ available: a.available + b.available }));
        }

        return (
            <React.Fragment>
                {
                    this.props.noDistributionInventoryResults &&
                    <p role="alert" className="container-centered">{this.props.distributionNoResultsLabel}</p>
                }
                <MediaQuery query={styleVariables.desktopAndAbove}>
                    <div className="container-centered">
                        {
                            this.props.distributionInventory.length > 0 &&
                            <ReactTable
                                data={this.props.distributionInventory}
                                showPagination={false}
                                minRows={0}
                                resizable={false}
                                columns={[
                                    {
                                        Header: dcNubmer,
                                        accessor: 'distributionStoreNumber',
                                        sortable: false,
                                        Footer: this.props.availableFooterText,
                                        minWidth: 165
                                    },
                                    {
                                        Header: dcStoreName,
                                        accessor: 'distributionStoreNumber',
                                        Cell: row => {
                                            return <span>{this.props.storeNameMap[row.value]}</span>;
                                        },
                                        sortable: false,
                                        minWidth: 660
                                    },
                                    {
                                        Header: transitTime,
                                        accessor: 'totalInTransit',
                                        sortable: false,
                                        minWidth: 165
                                    },
                                    {
                                        Header: onHand,
                                        accessor: 'onHand',
                                        sortable: false,
                                        minWidth: 165
                                    },
                                    {
                                        Header: reserved,
                                        accessor: 'reserved',
                                        sortable: false,
                                        minWidth: 165
                                    },
                                    {
                                        Header: available,
                                        accessor: 'available',
                                        sortable: false,
                                        minWidth: 165,
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
                    </div>
                </MediaQuery>
                <MediaQuery query={styleVariables.desktopAndBelow}>
                    <div className="distribution_inv">
                        {
                            this.props.distributionInventory.length > 0 &&
                            this.props.distributionInventory.map((distributionInv, index) => {
                                return (
                                    <div key={index.toString()} className="sales-service__wrap">
                                        <div className="sales-service__row">
                                            <div className="sales-service__row_heading">
                                                {dcNubmer}
                                            </div>
                                            <div className="sales-service__row_value">
                                                {distributionInv.distributionStoreNumber}
                                            </div>
                                        </div>
                                        <div className="sales-service__row">
                                            <div className="sales-service__row_heading">
                                                {dcStoreName}
                                            </div>
                                            <div className="sales-service__row_value">
                                                {this.props.storeNameMap[distributionInv.distributionStoreNumber]}
                                            </div>
                                        </div>
                                        <div className="sales-service__row">
                                            <div className="sales-service__row_heading">
                                                {transitTime}
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
                                    </div>
                                );
                            })
                        }
                        {
                            this.props.distributionInventory.length > 0 &&
                            <div className="sales-service__row table-footer">
                                <div className="sales-service__row_heading">
                                    { this.props.availableFooterText }
                                </div>
                                <div className="sales-service__row_value">
                                    { total ? total.available : 0 }
                                </div>
                            </div>
                        }
                    </div>
                </MediaQuery>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        distributionInventory: state.salesService.distributionInventory,
        storeNameMap: objectPath.get(state, 'aem.salesServiceCenter.storeNameMap'),
        columnHeadings: state.salesService.columnHeadings,
        availableFooterText: objectPath.get(state, 'aem.salesServiceCenter.availableFooterLabel'),
        noDistributionInventoryResults: objectPath.get(state, 'salesService.noOnOrderStatusResults', false),
        distributionNoResultsLabel: objectPath.get(state, 'aem.salesServiceCenter.distributionNoResultsLabel', '')
    };
};

DistributionInventory.defaultProps = {
};

DistributionInventory.propTypes = {
    distributionInventory: PropTypes.array.isRequired,
    storeNameMap: PropTypes.object.isRequired,
    columnHeadings: PropTypes.object.isRequired,
    availableFooterText: PropTypes.string.isRequired,
    noDistributionInventoryResults: PropTypes.bool.isRequired,
    distributionNoResultsLabel: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(DistributionInventory);
