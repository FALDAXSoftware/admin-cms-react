import React, { Component } from 'react';
import { Tabs, Input, Pagination, Modal } from 'antd';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { tableinfos } from "../../Tables/antTables";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import ApiUtils from '../../../helpers/apiUtills';
import EditUserModal from './editUserModal';
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
            showEditUserModal: false,
            showViewUserModal: false,
            showReferralModal: false,
            userDetails: [],
            page: 0,
            limit: 5
        }
        Users.view = Users.view.bind(this);
        Users.edit = Users.edit.bind(this);
        Users.showReferrals = Users.showReferrals.bind(this);
    }

    static view(value, first_name, last_name, email, city_town, street_address, phone_number, country, dob) {
        let userDetails = {
            value, first_name, last_name, email, city_town, street_address, phone_number, country, dob
        }
        this.setState({ userDetails, showViewUserModal: true });
    }

    static edit(value, first_name, last_name, email, city_town, street_address, phone_number, country, dob) {
        let userDetails = {
            value, first_name, last_name, email, city_town, street_address, phone_number, country, dob
        }
        this.setState({ userDetails, showEditUserModal: true });
    }

    static showReferrals(value) {
        console.log(value)
        this.setState({ userId: value, showReferralModal: true });
    }

    componentDidMount = () => {
        this._getAllUsers(this.state.page);
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

    _searchUser = (val) => {
        this.setState({ searchUser: val }, () => {
            this._getAllUsers(0);
        });
    }

    _handleUserPagination = (page) => {
        //this._getAllUsers(page - 1);
    }

    _showEditUserModal = () => {
        this.setState({ showEditUserModal: true });
    }

    _closeEditUserModal = () => {
        this.setState({ showEditUserModal: false, searchUser: '' });
    }

    _closeViewUserModal = () => {
        this.setState({ showViewUserModal: false });
    }

    _closeReferralModal = () => {
        this.setState({ showReferralModal: false });
    }

    render() {
        const { allUsers, allUserCount, showEditUserModal, showViewUserModal,
            userDetails, showReferralModal, userId } = this.state;

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
                                        <EditUserModal
                                            fields={userDetails}
                                            showEditUserModal={showEditUserModal}
                                            closeEditUserModal={this._closeEditUserModal}
                                            getAllUsers={this._getAllUsers.bind(this, 0)}
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
                                                userId={userId}
                                                showReferralModal={showReferralModal}
                                                closeReferalModal={this._closeReferralModal}
                                                getAllUsers={this._getAllUsers.bind(this, 0)}
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
        // user: state.Auth.get('user'),
        token: state.Auth.get('token')
    }))(Users);

export { Users, tableinfos };
