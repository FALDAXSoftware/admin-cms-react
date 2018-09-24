import React, { Component } from 'react';
import { Tabs, Button, Input, Pagination, Modal } from 'antd';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { tableinfos } from "../../Tables/antTables";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import ApiUtils from '../../../helpers/apiUtills';
import AddUserModal from './addUserModal';
import ViewUserModal from './viewUserModal';
import { connect } from 'react-redux';

const Search = Input.Search;
const TabPane = Tabs.TabPane;

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allUsers: [{
                firstName: 'Jon',
                lastName: 'Snow',
                city: 'Night watch',
                email: 'jon@snow.com'
            }, {
                firstName: 'Cersi',
                lastName: 'Lannister',
                city: 'Citadel',
                email: 'cersi@lannister.com'
            }],
            allUserCount: 2,
            searchUser: '',
            showAddUserModal: false,
            showViewUserModal: false,
            showDeleteUser: false,
            userDetails: []
        }
    }

    componentDidMount = () => {
        // this._getAllUsers();
    }

    _getAllUsers = (page) => {
        const { token, user } = this.props;
        const { searchUser } = this.state;
        var _this = this;

        let formData = {
            name: searchUser
        };

        ApiUtils.getAllUsers(page, token, user.id, formData)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status === "SUCCESS") {
                    _this.setState({ allUsers: res.data, allUserCount: res.totalElements });
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
            //this._getAllUsers(0);
        });
    }

    _deleteUser = () => {
        //call api for delete user
    }

    _handleUserPagination = (page) => {
        //this._getAllUsers(page - 1);
    }

    _showAddUserModal = () => {
        this.setState({ showAddUserModal: true });
    }

    _closeAddUserModal = () => {
        this.setState({ showAddUserModal: false, searchUser: '' });
    }

    _closeViewUserModal = () => {
        this.setState({ showViewUserModal: false });
    }

    _closeDeleteUserModal = () => {
        this.setState({ showDeleteUser: false });
    }

    render() {
        const { allUsers, allUserCount, showAddUserModal, showViewUserModal,
            userDetails, showDeleteUser } = this.state;

        return (
            <LayoutWrapper>
                <LayoutContentWrapper>
                    <TableDemoStyle className="isoLayoutContent">
                        <Tabs className="isoTableDisplayTab">
                            {tableinfos.map(tableInfo => (
                                <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                    <div style={{ "display": "inline-block", "width": "100%" }}>
                                        <Button type="primary" style={{ "marginBottom": "15px", "float": "left" }} onClick={this._showAddUserModal}>Add User</Button>
                                        <AddUserModal
                                            showAddUserModal={showAddUserModal}
                                            closeAddModal={this._closeAddUserModal}
                                            getAllUsers={this._getAllUsers.bind(this, 0)}
                                        />
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
                                        {/* <EditBeerModal
                                            fields={editBeerDetails}
                                            showEditBeerModal={showEditBeerModal}
                                            closeEditBeerModal={this._closeEditBeerModal}
                                            getAllBeers={this._getAllUsers.bind(this, 0)}
                                        />  */}
                                        <TableWrapper
                                            {...this.state}
                                            columns={tableInfo.columns}
                                            pagination={false}
                                            dataSource={allUsers}
                                            className="isoCustomizedTable"
                                        />
                                        {
                                            showDeleteUser &&
                                            <Modal
                                                title="Delete User"
                                                visible={showDeleteUser}
                                                onOk={this._deleteUser}
                                                onCancel={this._closeDeleteUserModal}
                                            >
                                                <span>
                                                    Are you sure you want to delete this User?
                                          </span>
                                            </Modal>
                                        }
                                        <Pagination
                                            className="ant-users-pagination"
                                            onChange={this._handleUserPagination.bind(this)}
                                            pageSize={5}
                                            defaultCurrent={1}
                                            total={allUserCount}
                                        />
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
        user: state.Auth.get('user'),
        token: state.Auth.get('token')
    }))(Users);

export { Users, tableinfos };
