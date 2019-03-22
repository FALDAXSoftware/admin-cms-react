import React, { Component } from 'react';
import { Input, Pagination, notification, Spin, Select, Button } from 'antd';
import { tradeTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';

const Option = Select.Option;

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
            page: 0,
            loader: false,
            filterVal: '',
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
        const { searchTrade, page, limit, filterVal } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getUserTrades(page, limit, token, searchTrade, user_id, filterVal)
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

    _searchTrade = () => {
        this._getUserAllTrades();
    }

    _handleTradePagination = (page) => {
        this.setState({ page: page - 1 }, () => {
            this._getUserAllTrades();
        })
    }

    _resetFilters = () => {
        this.setState({ filterVal: '', searchTrade: '' }, () => {
            this._getUserAllTrades();
        })
    }

    render() {
        const { allTrades, allTradeCount, errType, errMsg, page, loader, filterVal,
            searchTrade } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    {tradeTableInfos.map(tableInfo => (
                        <div>
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
                                    <Option value={' '}>All</Option>
                                    <Option value={'Buy'}>Buy</Option>
                                    <Option value={'Sell'}>Sell</Option>
                                </Select>

                                <Button className="search-btn" type="primary" onClick={this._searchTrade}>Search</Button>
                                <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>
                            </div>
                            {loader && <span className="loader-class"><Spin /></span>}
                            < TableWrapper
                                style={{ marginTop: '20px' }}
                                {...this.state}
                                columns={tableInfo.columns}
                                pagination={false}
                                dataSource={allTrades}
                                className="isoCustomizedTable"
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
    }))(UserTradeHistory);

export { UserTradeHistory, tradeTableInfos };
