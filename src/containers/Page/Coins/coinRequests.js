import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification, Spin } from 'antd';
import { coinReqTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';

const Search = Input.Search;
const TabPane = Tabs.TabPane;

class CoinRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allCoinRequests: [],
            allCoinCount: 0,
            searchCoin: '',
            limit: 50,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            page: 1,
            loader: false
        }
    }

    componentDidMount = () => {
        this._getAllCoinRequests();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllCoinRequests = () => {
        const { token } = this.props;
        const { limit, searchCoin, page } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllCoinRequests(page, limit, token, searchCoin)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allCoinRequests: res.data, allCoinCount: res.CoinsCount, searchCoin: ''
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, searchCoin: '' });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    searchCoin: '', errType: 'error', loader: false
                });
            });
    }

    _searchCoinReq = (val) => {
        this.setState({ searchCoin: val, page: 1 }, () => {
            this._getAllCoinRequests();
        });
    }

    _handleCoinPagination = (page) => {
        this._getAllCoinRequests(page);
        this.setState({ page })
    }

    render() {
        const { allCoinRequests, allCoinCount, errType, loader, errMsg, page } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {coinReqTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Search
                                        placeholder="Search coins"
                                        onSearch={(value) => this._searchCoinReq(value)}
                                        style={{ "float": "right", "width": "250px" }}
                                        enterButton
                                    />
                                </div>
                                {loader && <span className="loader-class">
                                    <Spin />
                                </span>}
                                <div>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allCoinRequests}
                                        className="isoCustomizedTable"
                                    />
                                    <Pagination
                                        style={{ marginTop: '15px' }}
                                        className="ant-users-pagination"
                                        onChange={this._handleCoinPagination.bind(this)}
                                        pageSize={50}
                                        current={page}
                                        total={allCoinCount}
                                    />
                                </div>
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
    }))(CoinRequests);

export { CoinRequests, coinReqTableInfos };
