import React, { Component } from 'react';
import { Input, Pagination, notification, Select, Button, Row, Form, Tabs } from 'antd';
import { userWithdrawReqTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import ColWithPadding from '../common.style';
import { CSVLink } from "react-csv";

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { logout } = authAction;

class UserWithdrawRequest extends Component {
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
            filterVal: '',
        }
    }

    componentDidMount = () => {
        this._getUserRequests();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getUserRequests = () => {
        const { token, user_id } = this.props;
        const { searchReq, page, limit, startDate, endDate, filterVal, sorterCol, sortOrder } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getUserWithdrawReq(page, limit, token, searchReq, startDate, endDate, user_id, filterVal, sorterCol, sortOrder)
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
            .catch(err => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    _changeFilter = (val) => {
        this.setState({ filterVal: val });
    }

    _changeSearch = (field, e) => {
        this.setState({ searchReq: field.target.value })
    }

    _searchReq = (e) => {
        e.preventDefault();
        this.setState({ page: 1 }, () => {
            this._getUserRequests();
        })
    }

    _handleWithdrawPagination = (page) => {
        this.setState({ page: page - 1 }, () => {
            this._getUserRequests();
        })
    }

    _resetFilters = () => {
        this.setState({
            filterVal: '', searchReq: '', startDate: '', endDate: '', rangeDate: [], page: 1
        }, () => {
            this._getUserRequests();
        })
    }

    _handleUserWithdrawReqChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getUserRequests();
        })
    }

    _changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this._getUserRequests();
        });
    }

    render() {
        const { allRequests, allReqCount, errType, errMsg, page, loader, filterVal,
            searchReq, limit } = this.state;
        let pageSizeOptions = ['20', '30', '40', '50']

        const requestHeaders = [
            { label: "Source Address", key: "source_address" },
            { label: "Destination Address", key: "destination_address" },
            { label: "Transaction Type", key: "transaction_type" },
            { label: "Amount", key: "amount" },
            { label: "Email", key: "email" },
            { label: "Created On", key: "created_at" }
        ];

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {userWithdrawReqTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Form onSubmit={this._searchReq}>
                                        <Row>
                                            <ColWithPadding sm={8}>
                                                <Input
                                                    placeholder="Search requests"
                                                    onChange={this._changeSearch.bind(this)}
                                                    value={searchReq}
                                                />
                                            </ColWithPadding>
                                            <ColWithPadding sm={7}>
                                                <Select
                                                    placeholder="Select a type"
                                                    onChange={this._changeFilter}
                                                    value={filterVal}
                                                >
                                                    <Option value={''}>All</Option>
                                                    <Option value={'true'}>Approve</Option>
                                                    <Option value={'false'}>Dis-Approve</Option>
                                                </Select>
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                <Button htmlType="submit" className="search-btn" type="primary">Search</Button>
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                {allRequests && allRequests.length > 0 ?
                                                    <CSVLink filename={'user_withdraw_requests.csv'} data={allRequests} headers={requestHeaders}>
                                                        <Button className="search-btn" type="primary">Export</Button>
                                                    </CSVLink>
                                                    : ''}
                                            </ColWithPadding>
                                        </Row>
                                    </Form>
                                </div>
                                {loader && <FaldaxLoader />}
                                < TableWrapper
                                    style={{ marginTop: '20px' }}
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allRequests}
                                    className="isoCustomizedTable"
                                    onChange={this._handleUserWithdrawReqChange}
                                />
                                {allReqCount > 0 ?
                                    <Pagination
                                        style={{ marginTop: '15px' }}
                                        className="ant-users-pagination"
                                        onChange={this._handleWithdrawPagination.bind(this)}
                                        pageSize={limit}
                                        current={page}
                                        total={allReqCount}
                                        showSizeChanger
                                        onShowSizeChange={this._changePaginationSize}
                                        pageSizeOptions={pageSizeOptions}
                                    /> : ''
                                }
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
    }), { logout })(UserWithdrawRequest);

export { UserWithdrawRequest, userWithdrawReqTableInfos };
