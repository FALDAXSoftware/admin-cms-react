import React, { Component } from 'react';
import { Tabs, Input, Pagination } from 'antd';
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
            page: 0,
            limit: 5
        }
        Users.view = Users.view.bind(this);
        Users.showReferrals = Users.showReferrals.bind(this);
        Users.changeStatus = Users.changeStatus.bind(this);
    }

    static view(value, first_name, last_name, email, city_town, street_address, phone_number, country, dob, is_active) {
        let userDetails = {
            value, first_name, last_name, email, city_town, street_address, phone_number, country, dob, is_active
        }
        this.setState({ userDetails, showViewUserModal: true });
    }

    static showReferrals(value) {
        this._getAllReferredUsers(value, 0)
    }

    static changeStatus(value, first_name, last_name, email, city_town, street_address, phone_number, country, dob, is_active) {
        const { token } = this.props;
        let _this = this;

        let formData = {
            user_id: value,
            email: email,
            activate: !is_active
        };

        ApiUtils.activateUser(token, formData)
            .then((res) => res.json())
            .then((res) => {
                _this._getAllUsers(0);
            })
            .catch(error => {
                console.error(error);
                _this.setState({ errMsg: true, errMessage: 'Something went wrong!!', errType: 'error' });
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
            .catch(err => {
                console.log('error occured', err);
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
        this.setState({ searchUser: val }, () => {
            this._getAllUsers(0);
        });
    }

    _handleUserPagination = (page) => {
        this._getAllUsers(page - 1);
    }

    _closeViewUserModal = () => {
        this.setState({ showViewUserModal: false });
    }

    _closeReferralModal = () => {
        this.setState({ showReferralModal: false });
    }

    render() {
        const { allUsers, allUserCount, showViewUserModal, allReferral,
            userDetails, showReferralModal, allReferralCount, userId } = this.state;

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
                                            className="ant-users-pagination"
                                            onChange={this._handleUserPagination.bind(this)}
                                            pageSize={5}
                                            defaultCurrent={1}
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
