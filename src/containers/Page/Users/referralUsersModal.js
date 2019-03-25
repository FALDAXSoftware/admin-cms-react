import React, { Component } from 'react';
import { Tabs, Pagination, Modal, Button, Spin } from 'antd';
import { connect } from 'react-redux';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { referralInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';

const TabPane = Tabs.TabPane;

class ReferralUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allReferral: this.props.allReferral,
            allReferralCount: this.props.allReferralCount,
            userId: this.props.userId,
            page: 0,
            limit: 50,
        }
    }

    componentDidMount = () => {
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
                    errMsg: true, errMessage: 'Something went wrong!!',
                    errType: 'error', loader: false
                });
            });
    }

    _handleReferralPagination = (page) => {
        this.props.getAllReferredUsers(page - 1, this.state.userId);
    }

    render() {
        const { allReferral, allReferralCount, loader } = this.state;

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {
                            referralInfos.map(tableInfo => (
                                <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allReferral}
                                        className="isoCustomizedTable"
                                    />
                                    {loader && <span className="loader-class"><Spin /></span>}
                                    {allReferralCount > 0 ?
                                        <Pagination
                                            style={{ marginTop: '15px' }}
                                            className="ant-users-pagination"
                                            onChange={this._handleReferralPagination.bind(this)}
                                            pageSize={10}
                                            defaultCurrent={1}
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
