import React, { Component } from 'react';
import { Tabs, Pagination, Input } from 'antd';
import { connect } from 'react-redux';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { referralInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import FaldaxLoader from '../faldaxLoader';

const TabPane = Tabs.TabPane;
const Search = Input.Search;

class Referral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allReferral: [],
            allReferralCount: 0,
            page: 1,
            limit: 50,
            searchReferral: ''
        }
    }

    componentDidMount = () => {
        this._getAllReferredAdmins();
    }

    _getAllReferredAdmins = () => {
        const { token } = this.props;
        const { limit, page, searchReferral } = this.state;

        let _this = this;

        this.setState({ loader: true })
        ApiUtils.getAllReferrals(page, limit, token, searchReferral)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allReferral: res.data, allReferralCount: res.referralCount,
                        showReferralModal: true
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
        this._getAllReferredAdmins(page);
    }

    _searchCoin = (val) => {
        this.setState({ searchReferral: val }, () => {
            this._getAllReferredAdmins();
        });
    }

    _changeRow = (referral) => {
        console.log('>>>>>>>', referral)
        this.props.history.push('/dashboard/referral/' + referral.id)
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
                                    <div style={{ "display": "inline-block", "width": "100%" }}>
                                        <Search
                                            placeholder="Search users"
                                            onSearch={(value) => this._searchCoin(value)}
                                            style={{ "float": "right", "width": "250px" }}
                                            enterButton
                                        />
                                    </div>
                                    <TableWrapper
                                        onRow={(record, rowIndex) => {
                                            return {
                                                onClick: () => { this._changeRow(record) },
                                            };
                                        }}
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
    }))(Referral);
