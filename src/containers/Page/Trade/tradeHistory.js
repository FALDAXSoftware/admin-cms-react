import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification, Select, DatePicker, Button, Form, Row } from 'antd';
import { tradeTableInfos } from "../../Tables/antTables";
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

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
const { logout } = authAction;

class TradeHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allTrades: [],
            allTradeCount: 0,
            searchTrade: '',
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
        this._getAllTrades();
    }

    _getAllTrades = () => {
        const { token } = this.props;
        const { searchTrade, page, limit, filterVal, startDate, endDate, sorterCol, sortOrder } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllTrades(page, limit, token, searchTrade, filterVal, startDate, endDate, sorterCol, sortOrder)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allTrades: res.data, allTradeCount: res.tradeCount });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(err => {
                console.log('err', err)
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
            this._getAllTrades();
        })
    }

    _changeFilter = (val) => {
        this.setState({ filterVal: val });
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
            rangeDate: [], page: 1, sorterCol: '', sortOrder: ''
        }, () => {
            this._getAllTrades();
        })
    }

    _changeFilter = (val) => {
        this.setState({ filterVal: val });
    }

    _handleTradePagination = (page) => {
        this.setState({ page }, () => {
            this._getAllTrades();
        })
    }

    _handleTradeTableChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getAllTrades();
        })
    }

    render() {
        const { allTrades, allTradeCount, errType, errMsg, page, loader,
            searchTrade, rangeDate, filterVal } = this.state;
        const tradeHeaders = [
            { label: "Currency", key: "currency" },
            { label: "Settle Currency", key: "settle_currency" },
            { label: "Type", key: "side" },
            { label: "Pair", key: "symbol" },
            { label: "Quantity", key: "quantity" },
            { label: "Price", key: "price" },
            { label: "Fill Price", key: "fill_price" },
            { label: "Maker Fee", key: "maker_fee" },
            { label: "Taker Fee", key: "taker_fee" },
            { label: "Created On", key: "created_at" }
        ];

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {tradeTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Form onSubmit={this._searchTrade}>
                                        <Row>
                                            <ColWithPadding sm={5}>
                                                <Input
                                                    placeholder="Search trades"
                                                    onChange={this._changeSearch.bind(this)}
                                                    value={searchTrade}
                                                />
                                            </ColWithPadding>
                                            <ColWithPadding sm={3}>
                                                <Select
                                                    placeholder="Select type"
                                                    onChange={this._changeFilter}
                                                    value={filterVal}
                                                >
                                                    <Option value={''}>All</Option>
                                                    <Option value={'Sell'}>Sell</Option>
                                                    <Option value={'Buy'}>Buy</Option>
                                                </Select>
                                            </ColWithPadding>
                                            <ColWithPadding sm={7}>
                                                <RangePicker
                                                    value={rangeDate}
                                                    disabledTime={this.disabledRangeTime}
                                                    onChange={this._changeDate}
                                                    format="YYYY-MM-DD"
                                                    allowClear={false}
                                                    style={{ width: "100%" }}
                                                />
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                <Button htmlType="submit" className="search-btn" type="primary" style={{ margin: "0" }}>Search</Button>
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                {allTrades && allTrades.length > 0 ?
                                                    <CSVLink filename={'trade_history.csv'} data={allTrades} headers={tradeHeaders}>
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
                                    dataSource={allTrades}
                                    className="isoCustomizedTable"
                                    onChange={this._handleTradeTableChange}
                                />
                                {allTradeCount > 0 ?
                                    <Pagination
                                        style={{ marginTop: '15px' }}
                                        className="ant-users-pagination"
                                        onChange={this._handleTradePagination.bind(this)}
                                        pageSize={50}
                                        current={page}
                                        total={allTradeCount}
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
    }), { logout })(TradeHistory);

export { TradeHistory, tradeTableInfos };
