import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification } from 'antd';
import { tradeTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';

const Search = Input.Search;
const TabPane = Tabs.TabPane;

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
            page: 0
        }
    }

    componentDidMount = () => {
        this._getUserAllTrades(0);
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getUserAllTrades = () => {
        const { token } = this.props;
        const { searchTrade, page, limit } = this.state;
        let path = this.props.location.pathname.split('/');
        let user_id = path[path.length - 1]
        let _this = this;

        ApiUtils.getAllTrades(page, limit, token, searchTrade, user_id)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allTrades: res.data, allTradeCount: res.transactionCount, searchTrade: ''
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, searchTrade: '' });
                }
            })
            .catch(err => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    searchTrade: '', errType: 'error',
                });
            });
    }

    _searchTrade = (val) => {
        this.setState({ searchTrade: val }, () => {
            this._getUserAllTrades(0);
        });
    }

    _handleTradePagination = (page) => {
        this.setState({ page: page - 1 }, () => {
            this._getUserAllTrades(page - 1);
        })
    }

    render() {
        const { allTrades, allTradeCount, errType, errMsg, page } = this.state;

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
                                    <Search
                                        placeholder="Search trades"
                                        onSearch={(value) => this._searchTrade(value)}
                                        style={{ "float": "right", "width": "250px" }}
                                        enterButton
                                    />
                                </div>
                                <TableWrapper
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
    }))(UserTradeHistory);

export { UserTradeHistory, tradeTableInfos };
