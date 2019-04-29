import React, { Component } from 'react';
import { Input, Tabs, Pagination, Select, Button, DatePicker, notification, Form, Row } from 'antd';
import { transactionTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import moment from 'moment';
import { CSVLink } from "react-csv";
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import ColWithPadding from '../common.style';

const { logout } = authAction;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allTransactions: [],
            allTransactionCount: 0,
            searchTransaction: '',
            limit: 50,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            page: 1,
            loader: false,
            filterVal: '',
            startDate: '',
            endDate: '',
            rangeDate: []
        }
    }

    componentDidMount = () => {
        this._getAllTransactions();
    }

    _getAllTransactions = () => {
        const { token } = this.props;
        const { searchTransaction, page, limit, filterVal, startDate, endDate, sorterCol, sortOrder } = this.state;
        let _this = this;

        _this.setState({ loader: true })
        ApiUtils.getAllTransaction(page, limit, token, searchTransaction, filterVal, startDate, endDate, sorterCol, sortOrder)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allTransactions: res.data, allTransactionCount: res.transactionCount });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    _searchTransaction = (e) => {
        e.preventDefault();
        this._getAllTransactions();
    }

    _handleTransactionPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllTransactions();
        })
    }

    _changeFilter = (val) => {
        this.setState({ filterVal: val });
    }

    _changeSearch = (field, e) => {
        this.setState({ searchTransaction: field.target.value })
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

    _resetFilters = () => {
        this.setState({
            filterVal: '', searchTransaction: '', startDate: '', endDate: '', rangeDate: [], page: 1
        }, () => {
            this._getAllTransactions();
        })
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _handleTransactionTableChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getAllTransactions();
        })
    }

    render() {
        const { allTransactions, allTransactionCount, errType, errMsg, page,
            loader, searchTransaction, rangeDate, filterVal
        } = this.state;
        const transactionsHeaders = [
            { label: "Source Address", key: "source_address" },
            { label: "Destination Address", key: "destination_address" },
            { label: "Transaction Type", key: "transaction_type" },
            { label: "Amount", key: "amount" },
            { label: "Email", key: "email" },
        ];

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {transactionTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Form onSubmit={this._searchTransaction}>
                                        <Row>
                                            <ColWithPadding sm={6}>
                                                <Input
                                                    placeholder="Search transactions"
                                                    onChange={this._changeSearch.bind(this)}
                                                    style={{ "width": "200px" }}
                                                    value={searchTransaction}
                                                />
                                            </ColWithPadding>
                                            <ColWithPadding sm={6}>
                                                <Select
                                                    style={{ width: 125, "marginLeft": "15px" }}
                                                    placeholder="Select a type"
                                                    onChange={this._changeFilter}
                                                    value={filterVal}
                                                >
                                                    <Option value={' '}>All</Option>
                                                    <Option value={'send'}>Send</Option>
                                                    <Option value={'receive'}>Receive</Option>
                                                </Select>
                                            </ColWithPadding>
                                            <ColWithPadding sm={6}>
                                                <RangePicker
                                                    value={rangeDate}
                                                    disabledTime={this.disabledRangeTime}
                                                    onChange={this._changeDate}
                                                    format="YYYY-MM-DD"
                                                    style={{ marginLeft: '15px' }}
                                                />
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                <Button htmlType="submit" className="search-btn" type="primary" >Search</Button>
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                {allTransactions && allTransactions.length > 0 ?
                                                    <CSVLink style={{ marginLeft: '20px' }} filename={'transaction_history.csv'} data={allTransactions} headers={transactionsHeaders}>
                                                        <Button className="search-btn" type="primary">Export</Button>
                                                    </CSVLink>
                                                    : ''}
                                            </ColWithPadding>
                                        </Row>
                                    </Form>
                                </div>
                                {loader && <FaldaxLoader />}
                                <TableWrapper
                                    style={{ marginTop: '20px' }}
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allTransactions}
                                    onChange={this._handleTransactionTableChange}
                                    className="isoCustomizedTable"
                                />
                                {allTransactionCount > 0 ? <Pagination
                                    style={{ marginTop: '15px' }}
                                    className="ant-users-pagination"
                                    onChange={this._handleTransactionPagination.bind(this)}
                                    pageSize={50}
                                    current={page}
                                    total={allTransactionCount}
                                /> : ''}
                            </TabPane>
                        ))}
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(Transactions);

export { Transactions, transactionTableInfos };
