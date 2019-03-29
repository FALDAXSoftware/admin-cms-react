import React, { Component } from 'react';
import { Input, Pagination, notification, Select, Button } from 'antd';
import { userTransactionTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';

const Option = Select.Option;

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
            page: 0,
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
        const { searchReq, page, limit, startDate, endDate, filterVal } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getUserWithdrawReq(page, limit, token, searchReq, startDate, endDate, user_id, filterVal)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allRequests: res.data, allReqCount: res.withdrawReqCount
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, searchReq: '' });
                }
                _this.setState({ loader: false });
            })
            .catch(err => {
                console.log('err', err)
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    searchReq: '', errType: 'error', loader: false
                });
            });
    }

    _changeFilter = (val) => {
        this.setState({ filterVal: val });
    }

    _changeSearch = (field, e) => {
        this.setState({ searchReq: field.target.value })
    }

    _searchReq = () => {
        this._getUserRequests();
    }

    _handleWithdrawPagination = (page) => {
        this.setState({ page: page - 1 }, () => {
            this._getUserRequests();
        })
    }

    _resetFilters = () => {
        this.setState({
            filterVal: '', searchReq: '', startDate: '', endDate: '', rangeDate: []
        }, () => {
            this._getUserRequests();
        })
    }

    render() {
        const { allRequests, allReqCount, errType, errMsg, page, loader, filterVal,
            searchReq } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    {userTransactionTableInfos.map(tableInfo => (
                        <div>
                            <div style={{ "display": "inline-block", "width": "100%" }}>
                                <Input
                                    placeholder="Search requests"
                                    onChange={this._changeSearch.bind(this)}
                                    style={{ "width": "200px" }}
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

                                <Button className="search-btn" type="primary" onClick={this._searchReq}>Search</Button>
                                <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>
                            </div>
                            {loader && <FaldaxLoader />}
                            < TableWrapper
                                style={{ marginTop: '20px' }}
                                {...this.state}
                                columns={tableInfo.columns}
                                pagination={false}
                                dataSource={allRequests}
                                className="isoCustomizedTable"
                            />
                            {allReqCount > 0 ?
                                <Pagination
                                    style={{ marginTop: '15px' }}
                                    className="ant-users-pagination"
                                    onChange={this._handleWithdrawPagination.bind(this)}
                                    pageSize={50}
                                    current={page}
                                    total={allReqCount}
                                /> : ''
                            }
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
    }))(UserWithdrawRequest);

export { UserWithdrawRequest, userTransactionTableInfos };
