import React, { Component } from 'react';
import { Pagination } from 'antd';
import { connect } from 'react-redux';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { userReferralInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT } from "../../../helpers/globals";

const { logout } = authAction;

class ReferralUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allReferral: this.props.allReferral,
            allReferralCount: this.props.allReferralCount,
            userId: this.props.userId,
            page: 1,
            limit: PAGESIZE,
        }
    }

    componentDidMount = () => {
        this._getAllUserReferral();
    }

    _getAllUserReferral = () => {
        const { token, user_id } = this.props;
        const { limit, page, sorterCol, sortOrder } = this.state;

        let _this = this;

        this.setState({ loader: true })
        ApiUtils.getAllUserReferrals(page, limit, token, user_id, sorterCol, sortOrder)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({
                        allReferral: res.data, allReferralCount: res.referralCount,
                        showReferralModal: true, userId: user_id
                    });
                } else if (res.status == 403 || res.status==400) {
                    _this.setState({ errMsg: true, message: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, message: res.message });
                }
                _this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    _handleReferralPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllUserReferral();
        })
    }

    _handleReferralTableChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getAllUserReferral();
        })
    }

    _changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this._getAllUserReferral();
        });
    }

    render() {
        const { allReferral, allReferralCount, loader, page, limit } = this.state;
        let pageSizeOptions = PAGE_SIZE_OPTIONS

        return (
            <LayoutWrapper>
                <TableDemoStyle className="full-width">
                    <TableWrapper
                        rowKey="id"
                        {...this.state}
                        columns={userReferralInfos[0].columns}
                        pagination={false}
                        dataSource={allReferral}
                        onChange={this._handleReferralTableChange}
                        bordered
                        scroll={TABLE_SCROLL_HEIGHT}
                    />
                    {loader && <FaldaxLoader />}
                    {allReferralCount > 0 ?
                        <Pagination
                            style={{ marginTop: '15px' }}
                            className="ant-users-pagination"
                            onChange={this._handleReferralPagination.bind(this)}
                            pageSize={limit}
                            current={page}
                            total={parseInt(allReferralCount)}
                            showSizeChanger
                            onShowSizeChange={this._changePaginationSize}
                            pageSizeOptions={pageSizeOptions}
                        /> : ''}
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(ReferralUsers);
