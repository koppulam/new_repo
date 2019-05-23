// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as objectPath from 'object-path';
import getFormattedDate from 'lib/utils/date-formatter';
import MediaQuery from 'react-responsive';
import styleVariables from 'lib/utils/breakpoints';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

/**
 * Distribution Inventory center table
 */
class OnOrderStatus extends React.Component {
    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            storeNumber, dcName, poOrder, onOrder, reserved, available, expectedDate, countryOfOrigin
        } = this.props.columnHeadings;

        return (
            <React.Fragment>
                <MediaQuery query={styleVariables.desktopAndAbove}>
                    <div className="container-centered">
                        {
                            this.props.onOrderStatus.length > 0 &&
                            <ReactTable
                                data={this.props.onOrderStatus}
                                showPagination={false}
                                minRows={0}
                                resizable={false}
                                columns={[
                                    {
                                        Header: storeNumber,
                                        accessor: 'poLocation',
                                        sortable: false,
                                        minWidth: 153
                                    },
                                    {
                                        Header: dcName,
                                        accessor: 'poName',
                                        sortable: false,
                                        minWidth: 265
                                    },
                                    {
                                        Header: poOrder,
                                        accessor: 'data',
                                        Cell: row => row.value.map(onOrderData => <div key={onOrderData.poNumber}>{onOrderData.poNumber}</div>),
                                        sortable: false,
                                        minWidth: 153
                                    },
                                    {
                                        Header: onOrder,
                                        accessor: 'data',
                                        Cell: row => row.value.map(onOrderData => <div key={onOrderData.poNumber}>{onOrderData.onOrder}</div>),
                                        sortable: false,
                                        minWidth: 153
                                    },
                                    {
                                        Header: reserved,
                                        accessor: 'data',
                                        Cell: row => row.value.map(onOrderData => <div key={onOrderData.poNumber}>{onOrderData.reserved}</div>),
                                        sortable: false,
                                        minWidth: 153
                                    },
                                    {
                                        Header: available,
                                        accessor: 'data',
                                        Cell: row => row.value.map(onOrderData => <div key={onOrderData.poNumber}>{onOrderData.available}</div>),
                                        sortable: false,
                                        minWidth: 153
                                    },
                                    {
                                        Header: expectedDate,
                                        accessor: 'data',
                                        Cell: row => row.value.map(onOrderData => <div key={onOrderData.poNumber}>{getFormattedDate(onOrderData.expectedDate)}</div>),
                                        sortable: false,
                                        minWidth: 153
                                    },
                                    {
                                        Header: countryOfOrigin,
                                        accessor: 'data',
                                        Cell: row => <div>{row.value && row.value.length > 0 ? row.value[0].countryOfOriginName : ''}</div>,
                                        sortable: false,
                                        minWidth: 153
                                    }
                                ]}
                            />
                        }
                        {
                            this.props.noOnOrderStatusResults &&
                            <p role="alert">{this.props.onOrderNoResultsLabel}</p>
                        }
                    </div>

                </MediaQuery>
                <MediaQuery query={styleVariables.desktopAndBelow}>
                    <div className="on_order">
                        {
                            this.props.onOrderStatus.length > 0 &&
                            this.props.onOrderStatus.map(orderStatus => {
                                return (
                                    <div key={orderStatus.poName} className="sales-service__wrap">
                                        <div className="sales-service__row">
                                            <div className="sales-service__row_heading">
                                                {storeNumber}
                                            </div>
                                            <div className="sales-service__row_value">
                                                {orderStatus.poLocation}
                                            </div>
                                        </div>
                                        <div className="sales-service__row">
                                            <div className="sales-service__row_heading">
                                                {dcName}
                                            </div>
                                            <div className="sales-service__row_value">
                                                {orderStatus.poName}
                                            </div>
                                        </div>
                                        <div className="sales-service__row">
                                            <div className="sales-service__row_heading">
                                                {poOrder}
                                            </div>
                                            <div className="sales-service__row_value">
                                                {orderStatus.data.map(orderData => <p key={orderData.poNumber} className="sales-service__row_col">{orderData.poNumber}</p>)}
                                            </div>
                                        </div>
                                        <div className="sales-service__row">
                                            <div className="sales-service__row_heading">
                                                {onOrder}
                                            </div>
                                            <div className="sales-service__row_value">
                                                {orderStatus.data.map(orderData => <p key={orderData.poNumber} className="sales-service__row_col">{orderData.onOrder}</p>)}
                                            </div>
                                        </div>
                                        <div className="sales-service__row">
                                            <div className="sales-service__row_heading">
                                                {reserved}
                                            </div>
                                            <div className="sales-service__row_value">
                                                {orderStatus.data.map(orderData => <p key={orderData.poNumber} className="sales-service__row_col">{orderData.reserved}</p>)}
                                            </div>
                                        </div>
                                        <div className="sales-service__row">
                                            <div className="sales-service__row_heading">
                                                {available}
                                            </div>
                                            <div className="sales-service__row_value">
                                                {orderStatus.data.map(orderData => <p key={orderData.poNumber} className="sales-service__row_col">{orderData.available}</p>)}
                                            </div>
                                        </div>
                                        <div className="sales-service__row">
                                            <div className="sales-service__row_heading">
                                                {expectedDate}
                                            </div>
                                            <div className="sales-service__row_value">
                                                {orderStatus.data.map(orderData => <p key={orderData.poNumber} className="sales-service__row_col">{getFormattedDate(orderData.expectedDate)}</p>)}
                                            </div>
                                        </div>
                                        <div className="sales-service__row">
                                            <div className="sales-service__row_heading">
                                                {countryOfOrigin}
                                            </div>
                                            <div className="sales-service__row_value">
                                                {orderStatus.data.length ? orderStatus.data[0].countryOfOriginName : ''}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                        {
                            this.props.onOrderStatus.length === 0 &&
                            <p className="on_order__no-results" role="alert">{this.props.onOrderNoResultsLabel}</p>
                        }
                    </div>
                </MediaQuery>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        onOrderStatus: state.salesService.onOrderStatus,
        columnHeadings: state.salesService.columnHeadings,
        noOnOrderStatusResults: objectPath.get(state, 'salesService.noOnOrderStatusResults', false),
        onOrderNoResultsLabel: objectPath.get(state, 'aem.salesServiceCenter.onOrderNoResultsLabel', '')
    };
};

OnOrderStatus.defaultProps = {
};

OnOrderStatus.propTypes = {
    onOrderStatus: PropTypes.array.isRequired,
    columnHeadings: PropTypes.object.isRequired,
    noOnOrderStatusResults: PropTypes.bool.isRequired,
    onOrderNoResultsLabel: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(OnOrderStatus);
