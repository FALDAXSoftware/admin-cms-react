import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification, Spin, Select, DatePicker, Button } from 'antd';
import { tradeTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import moment from 'moment';

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

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
            page: 0,
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
        const { searchTrade, page, limit, filterVal, startDate, endDate } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllTrades(page, limit, token, searchTrade, filterVal, startDate, endDate)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allTrades: res.data, allTradeCount: res.tradeCount
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(err => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    searchTrade: '', errType: 'error', loader: false
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

    _searchTrade = () => {
        this._getAllTrades();
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
            startDate: moment(date[0]).endOf('day').toISOString(),
            endDate: moment(date[1]).endOf('day').toISOString()
        })
    }

    _resetFilters = () => {
        this.setState({
            filterVal: '', searchTrade: '', startDate: '', endDate: '', rangeDate: []
        }, () => {
            this._getAllTrades();
        })
    }

    _changeFilter = (val) => {
        this.setState({ filterVal: val });
    }

    _handleTradePagination = (page) => {
        this.setState({ page: page - 1 }, () => {
            this._getAllTrades();
        })
    }

    render() {
        const { allTrades, allTradeCount, errType, errMsg, page, loader,
            searchTrade, rangeDate, filterVal } = this.state;

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
                                    <Input
                                        placeholder="Search trades"
                                        onChange={this._changeSearch.bind(this)}
                                        style={{ "width": "200px" }}
                                        value={searchTrade}
                                    />

                                    <Select
                                        style={{ width: 125, "marginLeft": "15px" }}
                                        placeholder="Select a type"
                                        onChange={this._changeFilter}
                                        value={filterVal}
                                    >
                                        <Option value={'Sell'}>Sell</Option>
                                        <Option value={'Buy'}>Buy</Option>
                                    </Select>

                                    <RangePicker
                                        value={rangeDate}
                                        disabledTime={this.disabledRangeTime}
                                        onChange={this._changeDate}
                                        format="YYYY-MM-DD"
                                        style={{ marginLeft: '15px' }}
                                    />

                                    <Button className="search-btn" type="primary" onClick={this._searchTrade}>Search</Button>
                                    <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>

                                </div>
                                {loader && <span className="loader-class">
                                    <Spin />
                                </span>}
                                <TableWrapper
                                    style={{ marginTop: '20px' }}
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allTrades}
                                    className="isoCustomizedTable"
                                />
                                <Pagination
                                    style={{ marginTop: '15px' }}
                                    className="ant-users-pagination"
                                    onChange={this._handleTradePagination.bind(this)}
                                    pageSize={50}
                                    current={page}
                                    total={allTradeCount}
                                />
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
    }))(TradeHistory);

export { TradeHistory, tradeTableInfos };
