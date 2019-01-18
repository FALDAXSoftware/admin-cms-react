import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification, Spin, Button, Select, DatePicker } from 'antd';
import { coinReqTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import ViewCoinReqModal from './viewCoinReqModal';
import moment from 'moment';

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
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
            showViewCoinReqModal: false,
            startDate: '',
            endDate: '',
            coinFilter: '',
            rangeDate: []
        }
        self = this;
        CoinRequests.viewCoinReq = CoinRequests.viewCoinReq.bind(this);
    }

    componentDidMount = () => {
        this._getAllCoinRequests();
    }

    static viewCoinReq(value, coin_name, email, target_date, message, url, coin_symbol, country,
        elevator_pitch, first_name, last_name, skype, ref_site, phone, other_site) {
        let coinReqDetails = {
            value, coin_name, email, target_date, message, url, coin_symbol, country,
            elevator_pitch, first_name, last_name, skype, ref_site, phone, other_site
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
        const { limit, searchCoin, page, startDate, endDate } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllCoinRequests(page, limit, token, searchCoin, startDate, endDate)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allCoinRequests: res.data, allCoinCount: res.coinReqCount
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
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

    _searchCoinReq = () => {
        this._getAllCoinRequests();
    }

    _handleCoinPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllCoinRequests();
        })
    }

    _closeViewCoinReqModal = () => {
        this.setState({ showViewCoinReqModal: false })
    }

    _changeSearch = (field, e) => {
        this.setState({ searchCoin: field.target.value })
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
            startDate: moment(date[0]).startOf('day').toISOString(),
            endDate: moment(date[1]).endOf('day').toISOString()
        })
    }

    _resetFilters = () => {
        this.setState({
            searchCoin: '', startDate: '', endDate: '', rangeDate: []
        }, () => {
            this._getAllCoinRequests();
        })
    }

    render() {
        const { allCoinRequests, allCoinCount, errType, loader, errMsg, rangeDate,
            page, showViewCoinReqModal, coinReqDetails, searchCoin } = this.state;

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
                                    <Input
                                        placeholder="Search coins"
                                        onChange={this._changeSearch.bind(this)}
                                        style={{ "width": "200px" }}
                                        value={searchCoin}
                                    />

                                    <RangePicker
                                        value={rangeDate}
                                        disabledTime={this.disabledRangeTime}
                                        onChange={this._changeDate}
                                        format="YYYY-MM-DD"
                                        style={{ marginLeft: '15px' }}
                                    />

                                    <Button className="search-btn" type="primary" onClick={this._searchCoinReq}>Search</Button>
                                    <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>
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
                                        style={{ marginTop: '20px' }}
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allCoinRequests}
                                        className="isoCustomizedTable"
                                    />
                                    {allCoinCount.length > 0 ? <Pagination
                                        style={{ marginTop: '15px' }}
                                        className="ant-users-pagination"
                                        onChange={this._handleCoinPagination.bind(this)}
                                        pageSize={50}
                                        current={page}
                                        total={allCoinCount}
                                    /> : ''}
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
