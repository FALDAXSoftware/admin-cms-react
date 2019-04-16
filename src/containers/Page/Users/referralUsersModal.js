import React, { Component } from 'react';
import { Tabs, Pagination } from 'antd';
import { connect } from 'react-redux';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { userReferralInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import FaldaxLoader from '../faldaxLoader';

const TabPane = Tabs.TabPane;

class ReferralUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allReferral: this.props.allReferral,
            allReferralCount: this.props.allReferralCount,
            userId: this.props.userId,
            page: 1,
            limit: 50,
        }
    }

    componentDidMount = () => {
        this._getAllUserReferral();
    }

    _getAllUserReferral = () => {
        const { token, user_id } = this.props;
        const { limit, page } = this.state;

        let _this = this;

        this.setState({ loader: true })
        ApiUtils.getAllReferrals(page, limit, token, user_id)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allReferral: res.data, allReferralCount: res.usersDataCount,
                        showReferralModal: true, userId: user_id
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

    render() {
        const { allReferral, allReferralCount, loader, page } = this.state;

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {
                            userReferralInfos.map(tableInfo => (
                                <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allReferral}
                                        className="isoCustomizedTable"
                                    />
                                    {loader && <FaldaxLoader />}
                                    {allReferralCount > 0 ?
                                        <Pagination
                                            style={{ marginTop: '15px' }}
                                            className="ant-users-pagination"
                                            onChange={this._handleReferralPagination.bind(this)}
                                            pageSize={50}
                                            current={page}
                                            total={allReferralCount}
                                        /> : ''}
                                </TabPane>
                            ))
                        }
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(ReferralUsers);
