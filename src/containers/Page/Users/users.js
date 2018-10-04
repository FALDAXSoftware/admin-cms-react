import React, { Component } from 'react';
import { Tabs, Input, Pagination, Spin, Icon } from 'antd';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { tableinfos } from "../../Tables/antTables";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import ApiUtils from '../../../helpers/apiUtills';
import ViewUserModal from './viewUserModal';
import ReferralUsers from './referralUsersModal';
import { connect } from 'react-redux';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
var self;

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allUsers: [],
            allUserCount: 0,
            searchUser: '',
            showViewUserModal: false,
            showReferralModal: false,
            userDetails: [],
            allReferral: [],
            allReferralCount: 0,
            page: 1,
            limit: 50
        }
        self = this;
        Users.view = Users.view.bind(this);
        Users.showReferrals = Users.showReferrals.bind(this);
        Users.changeStatus = Users.changeStatus.bind(this);
    }

    static view(value, profile_pic, first_name, last_name, email, city_town, street_address, phone_number, country, dob, is_active) {
        let userDetails = {
            value, profile_pic, first_name, last_name, email, city_town, street_address, phone_number, country, dob, is_active
        }
        self.setState({ userDetails, showViewUserModal: true });
    }

    static showReferrals(value) {
        self._getAllReferredUsers(value, 0)
    }

    static changeStatus(value, profile_pic, first_name, last_name, email, city_town, street_address, phone_number, country, dob, is_active) {
        const { token } = this.props;

        let formData = {
            user_id: value,
            email: email,
            is_active: !is_active
        };

        ApiUtils.activateUser(token, formData)
            .then((res) => res.json())
            .then(() => {
                self._getAllUsers(0);
                self.setState({ page: 1 })
            })
            .catch(() => {
                self.setState({ errMsg: true, errMessage: 'Something went wrong!!', errType: 'error' });
            });
    }

    componentDidMount = () => {
        this._getAllUsers(0);
    }

    _getAllUsers = (page) => {
        const { token } = this.props;
        const { searchUser, limit } = this.state;
        var _this = this;

        ApiUtils.getAllUsers(page, limit, token, searchUser)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ allUsers: res.data, allUserCount: res.userCount });
                } else {
                    _this.setState({ errMsg: true, message: res.message });
                }
            })
            .catch(() => {
                _this.setState({ errMsg: true, errMessage: 'Something went wrong!!', errType: 'error' });
            });
    }

    _getAllReferredUsers = (id, page) => {
        const { token } = this.props;
        let _this = this;

        ApiUtils.getAllReferrals(token, id)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allReferral: res.data, allReferralCount: res.usersDataCount,
                        showReferralModal: true, userId: id
                    });
                } else {
                    _this.setState({ errMsg: true, message: res.message });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    _searchUser = (val) => {
        this.setState({ searchUser: val, page: 1 }, () => {
            this._getAllUsers(0);
        });
    }

    _handleUserPagination = (page) => {
        this._getAllUsers(page - 1);
        this.setState({ page });
    }

    _closeViewUserModal = () => {
        this.setState({ showViewUserModal: false });
    }

    _closeReferralModal = () => {
        self.setState({ showReferralModal: false });
    }

    render() {
        const { allUsers, allUserCount, showViewUserModal, allReferral, page,
            userDetails, showReferralModal, allReferralCount, userId, loader } = this.state;

        return (
            <LayoutWrapper>
                <LayoutContentWrapper>
                    <TableDemoStyle className="isoLayoutContent">
                        <Tabs className="isoTableDisplayTab">
                            {tableinfos.map(tableInfo => (
                                <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                    <div style={{ "display": "inline-block", "width": "100%" }}>
                                        <Search
                                            placeholder="Search users"
                                            onSearch={(value) => this._searchUser(value)}
                                            style={{ "float": "right", "width": "250px" }}
                                            enterButton
                                        />
                                    </div>
                                    <div>
                                        <ViewUserModal
                                            userDetails={userDetails}
                                            showViewUserModal={showViewUserModal}
                                            closeViewUserModal={this._closeViewUserModal}
                                        />
                                        <TableWrapper
                                            {...this.state}
                                            columns={tableInfo.columns}
                                            pagination={false}
                                            dataSource={allUsers}
                                            className="isoCustomizedTable"
                                        />
                                        <Pagination
                                            style={{ marginTop: '15px' }}
                                            className="ant-users-pagination"
                                            onChange={this._handleUserPagination.bind(this)}
                                            pageSize={50}
                                            current={page}
                                            total={allUserCount}
                                        />
                                        {showReferralModal &&
                                            <ReferralUsers
                                                showReferralModal={showReferralModal}
                                                allReferral={allReferral}
                                                allReferralCount={allReferralCount}
                                                closeReferalModal={this._closeReferralModal}
                                                getAllReferredUsers={this._getAllReferredUsers.bind(this, userId)}
                                            />
                                        }
                                        {loader && <Spin indicator={loaderIcon} />}
                                    </div>
                                </TabPane>
                            ))}
                        </Tabs>
                    </TableDemoStyle>
                </LayoutContentWrapper>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(Users);

export { Users, tableinfos };
