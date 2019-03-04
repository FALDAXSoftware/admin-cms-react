import React, { Component } from 'react';
import { Input, Pagination, notification, Spin } from 'antd';
import { tradeTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';

const Search = Input.Search;

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
            user_name: ""
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

    _getUserAllTrades = () => {
        const { token, user_id } = this.props;
        const { searchTrade, page, limit } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getUserTrades(page, limit, token, searchTrade, user_id)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allTrades: res.data, allTradeCount: res.tradeCount,
                        searchTrade: '', user_name: res.user_name.full_name
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, searchTrade: '' });
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

    _searchTrade = (val) => {
        this.setState({ searchTrade: val }, () => {
            this._getUserAllTrades();
        });
    }

    _handleTradePagination = (page) => {
        this.setState({ page: page - 1 }, () => {
            this._getUserAllTrades();
        })
    }

    render() {
        const { allTrades, allTradeCount, errType, errMsg, page, loader, user_name } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    {tradeTableInfos.map(tableInfo => (
                        <div>
                            <div style={{ "display": "inline-block", "width": "100%" }}>
                                <Search
                                    placeholder="Search trades"
                                    onSearch={(value) => this._searchTrade(value)}
                                    style={{ "float": "right", "width": "250px" }}
                                    enterButton
                                />
                            </div>
                            {
                                loader && <span className="loader-class">
                                    <Spin />
                                </span>
                            }
                            < TableWrapper
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
