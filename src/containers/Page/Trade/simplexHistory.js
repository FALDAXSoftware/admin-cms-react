import React, { Component } from 'react';
import { Input, Pagination, notification,Icon,Select, DatePicker, Button, Form, Row } from 'antd';
import { simplexTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import moment from 'moment';
import { CSVLink } from "react-csv";
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import ColWithMarginBottom from '../common.style';
import { PAGE_SIZE_OPTIONS, PAGESIZE } from "../../../helpers/globals";

const Option = Select.Option;
const { RangePicker } = DatePicker;
const { logout } = authAction;

class SimplexHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allSimplexTrades: [],
            allTradeCount: 0,
            searchTrade: '',
             limit: PAGESIZE,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            page: 1,
            loader: false,
            filterVal: '',
            startDate: '',
            endDate: '',
            rangeDate: [],
            trade_type: 2,
            sorterCol: 'created_at',
            sortOrder: 'descend',
            simplex_payment_status: ''
        }
    }

    componentDidMount = () => {
        this._getAllSimplexTrades();
    }

    _getAllSimplexTrades = () => {
        const { token } = this.props;
        const { searchTrade, page, limit, filterVal, startDate, endDate, sorterCol, sortOrder, trade_type, simplex_payment_status } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllSimplexTrades(page, limit, token, searchTrade, filterVal, startDate, endDate, sorterCol, sortOrder, trade_type, simplex_payment_status)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allSimplexTrades: res.data, allTradeCount: res.tradeCount });
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

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _searchTrade = (e) => {
        e.preventDefault();
        this.setState({ page: 1 }, () => {
            this._getAllSimplexTrades();
        })
    }

    _changeSearch = (field, e) => {
        this.setState({ searchTrade: field.target.value })
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
            filterVal: '', searchTrade: '', startDate: '', endDate: '',
            rangeDate: [], page: 1, sorterCol: '', sortOrder: '',simplex_payment_status:''
        }, () => {
            this._getAllSimplexTrades();
        })
    }

    _changeFilter = (val) => {
        this.setState({ filterVal: val });
    }

    _changeStatus = (val) => {
        this.setState({ simplex_payment_status: val });
    }

    _handleTradePagination = (page) => {
        this.setState({ page }, () => {
            this._getAllSimplexTrades();
        })
    }

    _handleTradeTableChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getAllSimplexTrades();
        })
    }

    _changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this._getAllSimplexTrades();
        });
    }

    render() {
        const { allSimplexTrades, allTradeCount, errType, errMsg, page, loader, limit,
            searchTrade, rangeDate, filterVal, simplex_payment_status } = this.state;
        const tradeHeaders = [
            { label: "Email", key: "email" },
            { label: "Coin", key: "currency" },
            { label: "Date", key: "created_at" },
            { label: "Filled Price", key: "fill_price" },
            { label: "amount", key: "quantity" },
            { label: "Wallet Address", key: "address" },
            { label: "Payment ID", key: "payment_id" },
            { label: "Quote ID", key: "quote_id" },
            { label: "Simplex Payment Status", key: "simplex_payment_status" },
        ];
       let pageSizeOptions = PAGE_SIZE_OPTIONS
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                        
                           
                                <Form onSubmit={this._searchTrade}>
                                    <Row>
                                        <ColWithMarginBottom md={6} sm={24}>
                                            <Input
                                                placeholder="Search trades"
                                                onChange={this._changeSearch.bind(this)}
                                                value={searchTrade}
                                            />
                                        </ColWithMarginBottom>
                                        {/* <ColWithMarginBottom sm={3}>
                                            <Select
                                                getPopupContainer={trigger => trigger.parentNode}
                                                placeholder="Select type"
                                                onChange={this._changeFilter}
                                                value={filterVal}
                                            >
                                                <Option value={''}>All</Option>
                                                <Option value={'Sell'}>Sell</Option>
                                                <Option value={'Buy'}>Buy</Option>
                                            </Select>
                                        </ColWithMarginBottom> */}
                                        <ColWithMarginBottom sm={24} md={3}>
                                            <Select
                                                getPopupContainer={trigger => trigger.parentNode}
                                                placeholder="Select Status"
                                                onChange={this._changeStatus}
                                                value={simplex_payment_status}
                                            >
                                                <Option value={''}>All</Option>
                                                <Option value={1}>Under Approval</Option>
                                                <Option value={2}>Approved</Option>
                                                <Option value={3}>Cancelled</Option>
                                            </Select>
                                        </ColWithMarginBottom>
                                        <ColWithMarginBottom md={6} sm={24}>
                                            <RangePicker
                                                value={rangeDate}
                                                disabledTime={this.disabledRangeTime}
                                                onChange={this._changeDate}
                                                format="YYYY-MM-DD"
                                                allowClear={false}
                                                style={{ width: "100%" }}
                                            />
                                        </ColWithMarginBottom>
                                        <ColWithMarginBottom xs={24} md={3} sm={24}>
                                            <Button htmlType="submit" className="search-btn btn-full-width" type="primary"><Icon type="search"></Icon>Search</Button>
                                        </ColWithMarginBottom>
                                        <ColWithMarginBottom xs={24} md={3} sm={24}>
                                            <Button className="search-btn btn-full-width" type="primary" onClick={this._resetFilters}><Icon type="reload"/>Reset</Button>
                                        </ColWithMarginBottom>
                                        <ColWithMarginBottom xs={24} sm={24} md={3}>
                                            {allSimplexTrades && allSimplexTrades.length > 0 ?
                                                <CSVLink filename={'simplex_history.csv'} data={allSimplexTrades} headers={tradeHeaders}>
                                                    <Button className="search-btn btn-full-width" type="primary"><Icon type="export"></Icon>Export</Button>
                                                </CSVLink>
                                                : ''}
                                        </ColWithMarginBottom>
                                    </Row>
                                </Form>
                            
                            {loader && <FaldaxLoader />}
                            <TableWrapper
                                {...this.state}
                                rowKey="id"
                                columns={simplexTableInfos[0].columns}
                                pagination={false}
                                dataSource={allSimplexTrades}
                                className="isoCustomizedTable table-tb-margin float-clear"
                                onChange={this._handleTradeTableChange}
                            />
                            {allTradeCount > 0 ?
                                <Pagination
                                    className="ant-users-pagination"
                                    onChange={this._handleTradePagination.bind(this)}
                                    pageSize={limit}
                                    current={page}
                                    total={parseInt(allTradeCount)}
                                    showSizeChanger
                                    onShowSizeChange={this._changePaginationSize}
                                    pageSizeOptions={pageSizeOptions}
                                /> : ''}
                        
                    
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(SimplexHistory);

export { SimplexHistory, simplexTableInfos };
