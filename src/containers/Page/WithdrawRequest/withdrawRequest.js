import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification, Button, DatePicker, Select, Form, Row } from 'antd';
import { withdrawReqTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import moment from 'moment';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import { CSVLink } from "react-csv";
import ColWithPadding from '../common.style';

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
const { logout } = authAction;

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
            page: 1,
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
        const { searchReq, page, limit, filterVal, startDate, endDate, sorterCol, sortOrder } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllWithdrawRequests(page, limit, token, searchReq, filterVal, startDate, endDate, sorterCol, sortOrder)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allRequests: res.data, allReqCount: res.withdrawReqCount });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    _searchReq = (e) => {
        e.preventDefault();
        this._getAllWithdrawReqs();
    }

    _handleReqPagination = (page) => {
        this.setState({ page }, () => {
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
            startDate: moment(date[0]).toISOString(),
            endDate: moment(date[1]).toISOString()
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

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _handleWithdrawTableChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getAllWithdrawReqs();
        })
    }

    render() {
        const { allRequests, allReqCount, errType, errMsg, page, loader,
            searchReq, rangeDate, filterVal } = this.state;
        const requestHeaders = [
            { label: "Source Address", key: "source_address" },
            { label: "Destination Address", key: "destination_address" },
            { label: "Status", key: "is_approve" },
            { label: "Amount", key: "amount" },
            { label: "Email", key: "email" },
        ];

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
                                        <Row>
                                            <ColWithPadding sm={8}>
                                                <Input
                                                    placeholder="Search Requests"
                                                    style={{ "width": "200px" }}
                                                    onChange={this._changeSearch.bind(this)}
                                                    value={searchReq}
                                                />
                                            </ColWithPadding>
                                            <ColWithPadding sm={8}>
                                                <Select
                                                    style={{ width: 125, "marginLeft": "15px" }}
                                                    placeholder="Select a type"
                                                    onChange={this._changeFilter}
                                                    value={filterVal}
                                                >
                                                    <Option value={' '}>All</Option>
                                                    <Option value={'true'}>Approved</Option>
                                                    <Option value={'false'}>Declined</Option>
                                                </Select>
                                            </ColWithPadding>
                                            <ColWithPadding sm={8}>
                                                <RangePicker
                                                    value={rangeDate}
                                                    disabledTime={this.disabledRangeTime}
                                                    onChange={this._changeDate}
                                                    format="YYYY-MM-DD"
                                                    style={{ marginLeft: '15px' }}
                                                />
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                <Button htmlType="submit" className="search-btn" type="primary">Search</Button>
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                {allRequests && allRequests.length > 0 ?
                                                    <CSVLink filename={'user_trade_history.csv'} data={allRequests} headers={requestHeaders}>
                                                        <Button type="primary" className="search-btn" style={{ margin: "0px" }}>Export</Button>
                                                    </CSVLink>
                                                    : ''}
                                            </ColWithPadding>
                                        </Row>
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
                                    onChange={this._handleWithdrawTableChange}
                                    expandedRowRender={record => <p style={{ margin: 0 }}>{<div><b>Email ID</b> - {record.email} <br />  <b>Fees</b> - {record.fees}% </div>}</p>}
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
    }), { logout })(WithdrawRequest);

export { WithdrawRequest, withdrawReqTableInfos };
