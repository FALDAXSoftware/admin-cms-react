import React, { Component } from 'react';
import { Input, Pagination, notification, Select,Col, Button, Form, Row, Tabs } from 'antd';
import { userTransactionTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import moment from 'moment';
import FaldaxLoader from '../faldaxLoader';
import { CSVLink } from "react-csv";
import authAction from '../../../redux/auth/actions';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT } from "../../../helpers/globals";

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { logout } = authAction;

class UserTransactionHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allTransactions: [],
            allTransactionCount: 0,
            searchTransaction: '',
             limit: PAGESIZE,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            page: 1,
            loader: false,
            filterVal: '',
            user_name: "",
            startDate: '',
            endDate: '',
            rangeDate: []
        }
    }

    componentDidMount = () => {
        this._getUserTransactions();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getUserTransactions = () => {
        const { token, user_id } = this.props;
        const { searchTransaction, page, limit, startDate, endDate, filterVal, sorterCol, sortOrder } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getUserTransaction(page, limit, token, searchTransaction, startDate, endDate, user_id, filterVal, sorterCol, sortOrder)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allTransactions: res.data, allTransactionCount: res.transactionCount });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false });
            })
            .catch(err => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    isabledRangeTime = (_, type) => {
        if (type === 'start') {
            return {
                disabledHours: () => this.range(0, 60).splice(4, 20),
                disabledMinutes: () => this.range(30, 60),
                disabledSeconds: () => [55, 56],
            };
        }
        return {
            disabledHours: () => this.range(0, 60).splice(20, 4),
            disabledMinutes: () => this.range(0, 31),
            disabledSeconds: () => [55, 56],
        };
    }

    _changeDate = (date, dateString) => {
        this.setState({
            rangeDate: date,
            startDate: moment(date[0]).toISOString(),
            endDate: moment(date[1]).toISOString()
        })
    }

    _changeFilter = (val) => {
        this.setState({ filterVal: val });
    }

    _changeSearch = (field, e) => {
        this.setState({ searchTransaction: field.target.value })
    }

    _searchTransaction = (e) => {
        e.preventDefault();
        this._getUserTransactions();
    }

    _handleTransactionPagination = (page) => {
        this.setState({ page: page - 1 }, () => {
            this._getUserTransactions();
        })
    }

    _resetFilters = () => {
        this.setState({
            filterVal: '', searchTransaction: '', startDate: '', endDate: '', rangeDate: [], page: 1
        }, () => {
            this._getUserTransactions();
        })
    }

    _handleUserTransactionChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getUserTransactions();
        })
    }

    _changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this._getUserTransactions();
        });
    }

    render() {
        const { allTransactions, allTransactionCount, errType, errMsg, page, loader, filterVal,
            searchTransaction, limit } = this.state;
       let pageSizeOptions = PAGE_SIZE_OPTIONS
        const transactionsHeaders = [
            { label: "Transaction Hash", key: "transaction_id" },
            { label: "Source Address", key: "source_address" },
            { label: "Destination Address", key: "destination_address" },
            { label: "Transaction Type", key: "transaction_type" },
            { label: "Amount", key: "amount" },
            { label: "Email", key: "email" },
            { label: "Created On", key: "craeted_at" },
        ];

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Form onSubmit={this._searchTransaction}>
                                        <Row>
                                            <Col sm={8}>
                                                <Input
                                                    placeholder="Search transactions"
                                                    onChange={this._changeSearch.bind(this)}
                                                    value={searchTransaction}
                                                />
                                            </Col>
                                            <Col sm={7}>
                                                <Select
                                                    getPopupContainer={trigger => trigger.parentNode}
                                                    placeholder="Select a type"
                                                    onChange={this._changeFilter}
                                                    value={filterVal}
                                                >
                                                    <Option value={''}>All</Option>
                                                    <Option value={'receive'}>Receive</Option>
                                                    <Option value={'send'}>Send</Option>
                                                </Select>
                                            </Col>
                                            <Col xs={12} sm={3}>
                                                <Button htmlType="submit" className="filter-btn full-width" icon="search" type="primary">Search</Button>
                                            </Col>
                                            <Col xs={12} sm={3}>
                                                <Button className="filter-btn full-width" type="primary" icon="reload" onClick={this._resetFilters}>Reset</Button>
                                            </Col>
                                            <Col xs={12} sm={3}>
                                                {allTransactions && allTransactions.length > 0 ?
                                                    <CSVLink filename={'user_transactions_history.csv'} data={allTransactions} headers={transactionsHeaders}>
                                                        <Button className="filter-btn full-width" type="primary" icon="export">Export</Button>
                                                    </CSVLink>
                                                    : ''}
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                                <div className="scroll-table">
                                    {loader && <FaldaxLoader />}
                                    < TableWrapper
                                        rowId="id"
                                        style={{ marginTop: '20px' }}
                                        {...this.state}
                                        columns={userTransactionTableInfos[0].columns}
                                        pagination={false}
                                        dataSource={allTransactions}
                                        className="isoCustomizedTable"
                                        onChange={this._handleUserTransactionChange}
                                        scroll={TABLE_SCROLL_HEIGHT}
                                        bordered
                                    />
                                    {allTransactionCount > 0 ?
                                        <Pagination
                                            style={{ marginTop: '15px' }}
                                            className="ant-users-pagination"
                                            onChange={this._handleTransactionPagination.bind(this)}
                                            pageSize={limit}
                                            current={page}
                                            total={parseInt(allTransactionCount)}
                                            showSizeChanger
                                            onShowSizeChange={this._changePaginationSize}
                                            pageSizeOptions={pageSizeOptions}
                                        /> : ''
                                    }
                                </div>
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(UserTransactionHistory);

export { UserTransactionHistory, userTransactionTableInfos };
