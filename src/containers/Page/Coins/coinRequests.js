import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification, Spin } from 'antd';
import { coinReqTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import ViewCoinReqModal from './viewCoinReqModal';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
var self;

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
            loader: false,
            coinReqDetails: [],
            showViewCoinReqModal: false
        }
        self = this;
        CoinRequests.viewCoinReq = CoinRequests.viewCoinReq.bind(this);
    }

    componentDidMount = () => {
        this._getAllCoinRequests();
    }

    static viewCoinReq(value, coin_name, email, target_date, message, url) {
        let coinReqDetails = {
            value, coin_name, email, target_date, message, url
        }
        self.setState({ coinReqDetails, showViewCoinReqModal: true, page: 1 });
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
                        allCoinRequests: res.data, allCoinCount: res.coinReqCount, searchCoin: ''
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

    _closeViewCoinReqModal = () => {
        this.setState({ showViewCoinReqModal: false })
    }

    render() {
        const { allCoinRequests, allCoinCount, errType, loader, errMsg,
            page, showViewCoinReqModal, coinReqDetails } = this.state;

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
                                    <ViewCoinReqModal
                                        coinReqDetails={coinReqDetails}
                                        showViewCoinReqModal={showViewCoinReqModal}
                                        closeViewCoinReqModal={this._closeViewCoinReqModal}
                                    />
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
