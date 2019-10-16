import React, { Component } from 'react';
import { Input, Pagination, notification, Select, Button, Form, Row } from 'antd';
import { simplexTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';
import { CSVLink } from "react-csv";
import authAction from '../../../redux/auth/actions';
import ColWithPadding from '../common.style';

const Option = Select.Option;
const { logout } = authAction;

class UserSimplexHistory extends Component {
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
            trade_type: 2,
            sorterCol: 'created_at',
            sortOrder: 'descend',
            simplex_payment_status: ''
        }
    }

    componentDidMount = () => {
        this._getUserSimplexTrades();
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

    _getUserSimplexTrades = () => {
        const { token, user_id } = this.props;
        const { searchTrade, page, limit, filterVal, sorterCol, sortOrder, trade_type, simplex_payment_status } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getUserTrades(page, limit, token, searchTrade, user_id, filterVal, sorterCol, sortOrder, trade_type, simplex_payment_status)
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
            this._getUserSimplexTrades();
        })
    }

    _changeStatus = (val) => {
        this.setState({ simplex_payment_status: val });
    }

    _handleTradePagination = (page) => {
        this.setState({ page }, () => {
            this._getUserSimplexTrades();
        })
    }

    _resetFilters = () => {
        this.setState({ filterVal: '', searchTrade: '', page: 1 }, () => {
            this._getUserSimplexTrades();
        })
    }

    _handleUserTradeChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getUserSimplexTrades();
        })
    }

    _changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this._getUserSimplexTrades();
        });
    }

    render() {
        const { allTrades, allTradeCount, errType, errMsg, page, loader, filterVal,
            searchTrade, limit, simplex_payment_status } = this.state;
        let pageSizeOptions = ['20', '30', '40', '50']
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

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    {simplexTableInfos.map(tableInfo => (
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
                                        <ColWithPadding sm={5}>
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
                                        <ColWithPadding sm={5}>
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
                                        </ColWithPadding>
                                        <ColWithPadding xs={12} sm={3}>
                                            <Button htmlType="submit" className="search-btn" type="primary" style={{ margin: "0px" }} >Search</Button>
                                        </ColWithPadding>
                                        <ColWithPadding xs={12} sm={3}>
                                            <Button className="search-btn" type="primary" onClick={this._resetFilters} style={{ margin: "0px" }}>Reset</Button>
                                        </ColWithPadding>
                                        <ColWithPadding xs={12} sm={3}>
                                            {allTrades && allTrades.length > 0 ?
                                                <CSVLink filename={'user_simplex_history.csv'} data={allTrades} headers={tradeHeaders}>
                                                    <Button type="primary" className="search-btn" style={{ margin: "0px" }}>Export</Button>
                                                </CSVLink>
                                                : ''}
                                        </ColWithPadding>
                                    </Row>
                                </Form>

                            </div>
                            {loader && <FaldaxLoader />}
                            <div className="scroll-table">
                                < TableWrapper
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
                                        pageSize={limit}
                                        current={page}
                                        total={allTradeCount}
                                        showSizeChanger
                                        onShowSizeChange={this._changePaginationSize}
                                        pageSizeOptions={pageSizeOptions}
                                    /> : ''}
                            </div>
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
    }), { logout })(UserSimplexHistory);

export { UserSimplexHistory, simplexTableInfos };
