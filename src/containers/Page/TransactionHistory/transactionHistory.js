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
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { PAGE_SIZE_OPTIONS, PAGESIZE } from "../../../helpers/globals";

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
             limit: PAGESIZE,
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
                    res.data=_this.addTransactionFees(res.data,res.default_send_Coin_fee);
                    _this.setState({
                        allTransactions: res.data, allTransactionCount: res.transactionCount,
                        fees: res.default_send_Coin_fee
                    });
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

    addTransactionFees(data,fees){
        return data.map(ele => {
          ele["transaction_fees"] =ele["transaction_type"] == "send" ? (fees+" %") : "-";
          return ele;
        });
    }

    _searchTransaction = (e) => {
        e.preventDefault();
        this.setState({ page: 1 }, () => {
            this._getAllTransactions();
        });
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
            startDate: date.length > 0 ? moment(date[0]).toISOString() : '',
            endDate: date.length > 0 ? moment(date[1]).toISOString() : ''
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

    _changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this._getAllTransactions();
        });
    }

    _copyNotification = () => {
        this.setState({ errMsg: true, errType: 'info', errMessage: 'Copied to Clipboard!!' });
    }

    render() {
        const { allTransactions, allTransactionCount, errType, errMsg, page,
            loader, searchTransaction, rangeDate, filterVal, limit, fees
        } = this.state;
        const transactionsHeaders = [
            { label: "Created On", key: "created_at" },
            { label: "Transaction Hash", key: "transaction_id" },
            { label: "Email", key: "email" },
            { label: "Source Address", key: "source_address" },
            { label: "Destination Address", key: "destination_address" },
            { label: "Amount", key: "amount" },
            { label: "Assets", key: "coin" },
            { label: "Transaction Type", key: "transaction_type" },
            { label: "Transaction Fees(%)", key: "transaction_fees" },
        ];
       let pageSizeOptions = PAGE_SIZE_OPTIONS
        
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
                                            <ColWithPadding sm={5}>
                                                <Input
                                                    placeholder="Search transactions"
                                                    onChange={this._changeSearch.bind(this)}
                                                    value={searchTransaction}
                                                />
                                            </ColWithPadding>
                                            <ColWithPadding sm={3}>
                                                <Select
                                                    getPopupContainer={trigger => trigger.parentNode}
                                                    placeholder="Select a type"
                                                    onChange={this._changeFilter}
                                                    value={filterVal}
                                                >
                                                    <Option value={''}>All</Option>
                                                    <Option value={'send'}>Send</Option>
                                                    <Option value={'receive'}>Receive</Option>
                                                </Select>
                                            </ColWithPadding>
                                            <ColWithPadding sm={7}>
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
                                                    <CSVLink filename={'transaction_history.csv'} data={allTransactions} headers={transactionsHeaders}>
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
                                    expandedRowRender={record => {
                                        return (
                                            <div>
                                                <span> <b>Created On: </b></span> {moment(record.created_at).format('DD MMM YYYY HH:MM')}<br/>
                                                <span><b>Transaction Hash: </b></span>
                                                <CopyToClipboard style={{ cursor: 'pointer' }}
                                                    text={record.transaction_id}
                                                    onCopy={this._copyNotification}>
                                                    <span>{record.transaction_id}</span>
                                                </CopyToClipboard><br />
                                                <span><b>Email: </b></span> {record.email}<br/>
                                                <span><b>Source Address: </b></span> {record.source_address}<br/>
                                                <span><b>Destination Address: </b></span> {record.destination_address}<br/>
                                                <span><b>Amount: </b></span> {record.amount}<br/>
                                                <span><b>Asset: </b></span> {record.coin}<br/>
                                                <span><b>Transaction Type: </b></span><span style={{color:record.transaction_type=='send'?'red':'green'}}> {record.transaction_type}</span><br/>
                                                <span><b>Transaction Fees: </b></span> {record.transaction_fees}<br/>

                                            </div>)
                                    }}
                                />

                                {allTransactionCount > 0 ? <Pagination
                                    style={{ marginTop: '15px' }}
                                    className="ant-users-pagination"
                                    onChange={this._handleTransactionPagination.bind(this)}
                                    pageSize={limit}
                                    current={page}
                                    total={allTransactionCount}
                                    showSizeChanger
                                    onShowSizeChange={this._changePaginationSize}
                                    pageSizeOptions={pageSizeOptions}
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
