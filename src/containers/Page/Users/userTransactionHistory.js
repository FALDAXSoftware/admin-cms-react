import React, { Component } from 'react';
import { Input, Pagination, notification, DatePicker, Select, Button, Form } from 'antd';
import { userTransactionTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import moment from 'moment';
import FaldaxLoader from '../faldaxLoader';
import { CSVLink } from "react-csv";

const Option = Select.Option;
const { RangePicker } = DatePicker;

class UserTransactionHistory extends Component {
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
            page: 0,
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
        const { searchTransaction, page, limit, startDate, endDate, filterVal } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getUserTransaction(page, limit, token, searchTransaction, startDate, endDate, user_id, filterVal)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allTransactions: res.data, allTransactionCount: res.transactionCount,
                        searchTransaction: ''
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, searchTransaction: '' });
                }
                _this.setState({ loader: false });
            })
            .catch(err => {
                console.log('err', err)
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    searchTransaction: '', errType: 'error', loader: false
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

    render() {
        const { allTransactions, allTransactionCount, errType, errMsg, page, loader, filterVal,
            searchTransaction } = this.state;
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
                    {userTransactionTableInfos.map(tableInfo => (
                        <div>
                            <div style={{ "display": "inline-block", "width": "100%" }}>
                                <Form onSubmit={this._searchTransaction}>
                                    <Input
                                        placeholder="Search transactions"
                                        onChange={this._changeSearch.bind(this)}
                                        style={{ "width": "200px" }}
                                        value={searchTransaction}
                                    />

                                    <Select
                                        style={{ width: 125, "marginLeft": "15px" }}
                                        placeholder="Select a type"
                                        onChange={this._changeFilter}
                                        value={filterVal}
                                    >
                                        <Option value={' '}>All</Option>
                                        <Option value={'receive'}>Receive</Option>
                                        <Option value={'send'}>Send</Option>
                                    </Select>

                                    <Button htmlType="submit" className="search-btn" type="primary">Search</Button>
                                    <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>
                                </Form>

                                {allTransactions.length > 0 ?
                                    <CSVLink filename={'user_transactions_history.csv'} data={allTransactions} headers={transactionsHeaders}>
                                        <Button className="search-btn" type="primary">Export</Button>
                                    </CSVLink>
                                    : ''}
                            </div>
                            {loader && <FaldaxLoader />}
                            < TableWrapper
                                style={{ marginTop: '20px' }}
                                {...this.state}
                                columns={tableInfo.columns}
                                pagination={false}
                                dataSource={allTransactions}
                                className="isoCustomizedTable"
                            />
                            {allTransactionCount > 0 ?
                                <Pagination
                                    style={{ marginTop: '15px' }}
                                    className="ant-users-pagination"
                                    onChange={this._handleTransactionPagination.bind(this)}
                                    pageSize={50}
                                    current={page}
                                    total={allTransactionCount}
                                /> : ''
                            }
                        </div>
                    ))}
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(UserTransactionHistory);

export { UserTransactionHistory, userTransactionTableInfos };
