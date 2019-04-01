import React, { Component } from 'react';
import { Input, Tabs, Pagination, Spin, Button, DatePicker, Select, Form } from 'antd';
import { withdrawReqTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import moment from 'moment';
import FaldaxLoader from '../faldaxLoader';

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

class WithdrawRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allRequests: [],
            allReqCount: 0,
            searchReq: '',
            limit: 50,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            page: 0,
            loader: false,
            startDate: '',
            endDate: '',
            filterVal: '',
            rangeDate: []
        }
    }

    componentDidMount = () => {
        this._getAllWithdrawReqs();
    }

    _getAllWithdrawReqs = () => {
        const { token } = this.props;
        const { searchReq, page, limit, filterVal, startDate, endDate } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllWithdrawRequests(page, limit, token, searchReq, filterVal, startDate, endDate)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allRequests: res.data, allReqCount: res.withdrawReqCount
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    errType: 'error', loader: false
                });
            });
    }

    _searchReq = (e) => {
        e.preventDefault();
        this._getAllWithdrawReqs();
    }

    _handleReqPagination = (page) => {
        this.setState({ page: page - 1 }, () => {
            this._getAllWithdrawReqs();
        })
    }

    _changeSearch = (field, e) => {
        this.setState({ searchReq: field.target.value })
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

    _changeFilter = (val) => {
        this.setState({ filterVal: val });
    }

    _resetFilters = () => {
        this.setState({
            filterVal: '', searchReq: '', startDate: '', endDate: '', rangeDate: []
        }, () => {
            this._getAllWithdrawReqs();
        })
    }

    render() {
        const { allRequests, allReqCount, errType, errMsg, page, loader,
            searchReq, rangeDate, filterVal } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {withdrawReqTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Form onSubmit={this._searchReq}>
                                        <Input
                                            placeholder="Search Requests"
                                            style={{ "width": "200px" }}
                                            onChange={this._changeSearch.bind(this)}
                                            value={searchReq}
                                        />

                                        <Select
                                            style={{ width: 125, "marginLeft": "15px" }}
                                            placeholder="Select a type"
                                            onChange={this._changeFilter}
                                            value={filterVal}
                                        >
                                            <Option value={' '}>All</Option>
                                            <Option value={'true'}>Approve</Option>
                                            <Option value={'false'}>Dis-Approve</Option>
                                        </Select>

                                        <RangePicker
                                            value={rangeDate}
                                            disabledTime={this.disabledRangeTime}
                                            onChange={this._changeDate}
                                            format="YYYY-MM-DD"
                                            style={{ marginLeft: '15px' }}
                                        />

                                        <Button htmlType="submit" className="search-btn" type="primary">Search</Button>
                                        <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>
                                    </Form>

                                </div>
                                {loader && <FaldaxLoader />}
                                <TableWrapper
                                    style={{ marginTop: '20px' }}
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allRequests}
                                    className="isoCustomizedTable"
                                />
                                {allReqCount > 0 ? <Pagination
                                    style={{ marginTop: '15px' }}
                                    className="ant-users-pagination"
                                    onChange={this._handleReqPagination.bind(this)}
                                    pageSize={50}
                                    current={page}
                                    total={allReqCount}
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
    }))(WithdrawRequest);

export { WithdrawRequest, withdrawReqTableInfos };
