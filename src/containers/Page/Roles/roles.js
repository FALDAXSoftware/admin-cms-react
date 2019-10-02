import React, { Component } from 'react';
import { Button, Tabs, notification, Modal } from 'antd';
import { rolesTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import AddRoleModal from './addRoleModal';
import EditRoleModal from './editRoleModal';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const TabPane = Tabs.TabPane;
const { logout } = authAction;
var self;

class Roles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allRoles: [],
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
            showAddRoleModal: false,
            showEditRoleModal: false,
            showDeleteRoleModal: false,
            roleDetails: [],
            deleteRoleId: '',
        }
        self = this;
        Roles.roleStatus = Roles.roleStatus.bind(this);
        Roles.editRole = Roles.editRole.bind(this);
        Roles.deleteRole = Roles.deleteRole.bind(this);
    }

    static roleStatus(value, name, users, assets, countries, roles, employee, pairs,
        transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button,
        news, is_referral, add_user, is_active) {

        const { token } = self.props;

        let formData = {
            id: value,
            roles,
            users,
            assets,
            countries,
            employee,
            name: name,
            withdraw_requests,
            jobs,
            pairs,
            transaction_history,
            trade_history,
            kyc,
            fees,
            panic_button,
            news,
            is_referral,
            add_user,
            is_active: !is_active
        };

        self.setState({ loader: true })
        let message = is_active ? 'Role has been inactivated successfully.' : 'Role has been activated successfully.'
        ApiUtils.updateRole(token, formData)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    self._getAllRoles();
                    self.setState({ errMsg: true, errMessage: message, errType: 'Success' });
                } else if (res.status == 403) {
                    self.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        self.props.logout();
                    });
                } else {
                    self.setState({ errMsg: true, errMessage: message });
                }
                self.setState({ loader: false })
            })
            .catch(() => {
                self.setState({
                    errType: 'error', errMsg: true, errMessage: 'Something went wrong', loader: false
                });
            });
    }

    static editRole(value, name, users, assets, countries, roles, employee, pairs,
        transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button,
        news, is_referral, add_user, is_active) {
        let roleDetails = {
            value, name, users, assets, countries, roles, employee, pairs,
            transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button,
            news, is_referral, add_user, is_active
        }
        self.setState({ showEditRoleModal: true, roleDetails });
    }

    static deleteRole(value) {
        self.setState({ showDeleteRoleModal: true, deleteRoleId: value });
    }

    componentDidMount = () => {
        this._getAllRoles();
        //this._getAllPermissions();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllRoles = () => {
        const { token } = this.props;
        const { sorterCol, sortOrder } = this.state;

        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllRoles(token, sorterCol, sortOrder, '')
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    //_this.setState({ allRoles: res.roles });
                    _this.setState({ allRolesValue: res.roles[0], allRoles: res.roleName });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errType: 'error', errMsg: true,
                    errMessage: 'Something went wrong', loader: false
                });
            });
    }

    _getAllPermissions = () => {
        const { token } = this.props;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllPermissions(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allPermissions: res.data });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errType: 'error', errMsg: true,
                    errMessage: 'Something went wrong', loader: false
                });
            });
    }

    _deleteRole = () => {
        const { token } = this.props;
        const { deleteRoleId } = this.state;

        self.setState({ loader: true });
        ApiUtils.deleteRole(token, deleteRoleId)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    if (res.status == 200) {
                        self.setState({
                            deleteRoleId: '', errType: 'Success', errMsg: true, errMessage: res.message
                        });
                        self._closeDeleteRoleModal();
                        self._getAllRoles();
                    } else if (res.status == 403) {
                        self.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            self.props.logout();
                        });
                    } else {
                        self.setState({ errMsg: true, errMessage: res.err, errType: 'error' });
                    }
                    self.setState({ loader: false });
                } else {
                    self.setState({ errMsg: true, errMessage: res.message, loader: false });
                }
            })
            .catch(() => {
                self.setState({
                    errType: 'error', errMsg: true, errMessage: 'Something went wrong', loader: false
                });
            });
    }

    _showAddRoleModal = () => {
        this.setState({ showAddRoleModal: true });
    }

    _closeAddRoleModal = () => {
        this.setState({ showAddRoleModal: false });
    }

    _closeEditRoleModal = () => {
        this.setState({ showEditRoleModal: false });
    }

    _closeDeleteRoleModal = () => {
        this.setState({ showDeleteRoleModal: false });
    }

    _handleRoleChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order }, () => {
            this._getAllRoles();
        })
    }

    render() {
        const { allRoles, errType, errMsg, loader, showAddRoleModal,
            showEditRoleModal, roleDetails, showDeleteRoleModal, allRolesValue } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {rolesTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Button type="primary" style={{ "marginBottom": "15px", "float": "left" }} onClick={this._showAddRoleModal}>Add Role</Button>
                                    {showAddRoleModal && <AddRoleModal
                                        allRolesValue={allRolesValue}
                                        showAddRoleModal={showAddRoleModal}
                                        closeAddModal={this._closeAddRoleModal}
                                        getAllRoles={this._getAllRoles.bind(this, 0)}
                                    />}
                                </div>
                                {loader && <FaldaxLoader />}
                                <div>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allRoles}
                                        className="isoCustomizedTable"
                                        onChange={this._handleRoleChange}
                                    />
                                    {/* {showEditRoleModal && */}
                                    <EditRoleModal
                                        fields={roleDetails}
                                        showEditRoleModal={showEditRoleModal}
                                        closeEditRoleModal={this._closeEditRoleModal}
                                        getAllRoles={this._getAllRoles.bind(this)}
                                    />
                                    {/* } */}
                                    {showDeleteRoleModal &&
                                        <Modal
                                            title="Delete Role"
                                            visible={showDeleteRoleModal}
                                            onCancel={this._closeDeleteRoleModal}
                                            footer={[
                                                <Button onClick={this._closeDeleteRoleModal}>No</Button>,
                                                <Button onClick={this._deleteRole}>Yes</Button>,
                                            ]}
                                        >
                                            Are you sure you want to delete this role ?
                                    </Modal>
                                    }
                                </div>
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
    }), { logout })(Roles);

export { Roles, rolesTableInfos };
