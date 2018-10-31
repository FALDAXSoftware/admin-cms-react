import React, { Component } from 'react';
import { Input, Tabs, Pagination, Spin } from 'antd';
import { withdrawReqTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';

const Search = Input.Search;
const TabPane = Tabs.TabPane;

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
            loader: false
        }
    }

    componentDidMount = () => {
        this._getAllWithdrawReqs(0);
    }

    _getAllWithdrawReqs = () => {
        const { token } = this.props;
        const { searchReq, page, limit } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllWithdrawRequests(page, limit, token, searchReq)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allRequests: res.data, allReqCount: res.withdrawReqCount, searchReq: ''
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, searchReq: '' });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    searchReq: '', errType: 'error', loader: false
                });
            });
    }

    _searchReq = (val) => {
        this.setState({ searchReq: val }, () => {
            this._getAllWithdrawReqs(0);
        });
    }

    _handleReqPagination = (page) => {
        this.setState({ page: page - 1 }, () => {
            this._getAllWithdrawReqs(page - 1);
        })
    }

    render() {
        const { allRequests, allReqCount, errType, errMsg, page, loader } = this.state;

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
                                    <Search
                                        placeholder="Search Requests"
                                        onSearch={(value) => this._searchReq(value)}
                                        style={{ "float": "right", "width": "250px" }}
                                        enterButton
                                    />
                                </div>
                                {loader && <span className="loader-class">
                                    <Spin />
                                </span>}
                                <TableWrapper
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allRequests}
                                    className="isoCustomizedTable"
                                />
                                <Pagination
                                    style={{ marginTop: '15px' }}
                                    className="ant-users-pagination"
                                    onChange={this._handleReqPagination.bind(this)}
                                    pageSize={50}
                                    current={page}
                                    total={allReqCount}
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
    }))(WithdrawRequest);

export { WithdrawRequest, withdrawReqTableInfos };
