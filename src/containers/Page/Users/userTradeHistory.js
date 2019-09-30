import React, { Component } from 'react';
import { Input, Pagination, notification, Select, Button, Form, Row, Tabs } from 'antd';
import { tradeTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';
import { CSVLink } from "react-csv";
import authAction from '../../../redux/auth/actions';
import ColWithPadding from '../common.style';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { logout } = authAction;

class UserTradeHistory extends Component {
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
            trade_type: 1
        }
    }

    componentDidMount = () => {
        this._getUserAllTrades();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _changeSearch = (field, e) => {
        this.setState({ searchTrade: field.target.value })
    }

    _changeFilter = (val) => {
        this.setState({ filterVal: val });
    }

    _getUserAllTrades = () => {
        const { token, user_id } = this.props;
        const { searchTrade, page, limit, filterVal, sorterCol, sortOrder, trade_type } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getUserTrades(page, limit, token, searchTrade, user_id, filterVal, sorterCol, sortOrder, trade_type)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allTrades: res.data, allTradeCount: res.tradeCount });
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

    _searchTrade = (e) => {
        e.preventDefault();
        this.setState({ page: 1 }, () => {
            this._getUserAllTrades();
        })
    }

    _handleTradePagination = (page) => {
        this.setState({ page }, () => {
            this._getUserAllTrades();
        })
    }

    _resetFilters = () => {
        this.setState({ filterVal: '', searchTrade: '', page: 1 }, () => {
            this._getUserAllTrades();
        })
    }

    _handleUserTradeChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getUserAllTrades();
        })
    }

    _changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this._getUserAllTrades();
        });
    }

    render() {
        const { allTrades, allTradeCount, errType, errMsg, page, loader, filterVal,
            searchTrade, limit } = this.state;
        let pageSizeOptions = ['20', '30', '40', '50']
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
                    <div className="isoTableDisplayTab">
                        {tradeTableInfos.map(tableInfo => (
                            <div>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Form onSubmit={this._searchTrade}>
                                        <Row>
                                            <ColWithPadding sm={8}>
                                                <Input
                                                    placeholder="Search trades"
                                                    onChange={this._changeSearch.bind(this)}
                                                    value={searchTrade}
                                                />
                                            </ColWithPadding>
                                            <ColWithPadding sm={7}>
                                                <Select
                                                    getPopupContainer={trigger => trigger.parentNode}
                                                    placeholder="Select a type"
                                                    onChange={this._changeFilter}
                                                    value={filterVal}
                                                >
                                                    <Option value={''}>All</Option>
                                                    <Option value={'Buy'}>Buy</Option>
                                                    <Option value={'Sell'}>Sell</Option>
                                                </Select>
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                <Button htmlType="submit" className="search-btn" type="primary" style={{ margin: "0px" }} >Search</Button>
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                <Button className="search-btn" type="primary" onClick={this._resetFilters} style={{ margin: "0px" }}>Reset</Button>
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                {allTrades && allTrades.length > 0 ?
                                                    <CSVLink filename={'user_trade_history.csv'} data={allTrades} headers={tradeHeaders}>
                                                        <Button type="primary" className="search-btn" style={{ margin: "0px" }}>Export</Button>
                                                    </CSVLink>
                                                    : ''}
                                            </ColWithPadding>
                                        </Row>
                                    </Form>

                                </div>
                                {loader && <FaldaxLoader />}
                                <div className="scroll-table">
                                    <TableWrapper
                                        style={{ marginTop: '20px' }}
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allTrades}
                                        className="isoCustomizedTable"
                                        onChange={this._handleUserTradeChange}
                                    />
                                    {allTradeCount > 0 ?
                                        <Pagination
                                            style={{ marginTop: '15px' }}
                                            className="ant-users-pagination"
                                            onChange={this._handleTradePagination.bind(this)}
                                            pageSize={50}
                                            current={page}
                                            total={allTradeCount}
                                            showSizeChanger
                                            onShowSizeChange={this._changePaginationSize}
                                            pageSizeOptions={pageSizeOptions}
                                        /> : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(UserTradeHistory);

export { UserTradeHistory, tradeTableInfos };
