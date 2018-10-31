import React, { Component } from 'react';
import { Button, Tabs, notification, Icon, Spin, Modal } from 'antd';
import { rolesTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import AddRoleModal from './addRoleModal';
import EditRoleModal from './editRoleModal';

const TabPane = Tabs.TabPane;
const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
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

    static roleStatus(value, name, coin, user, country, announcement, employee, role, staticPage, is_active) {
        const { token } = self.props;

        let formData = {
            id: value,
            role,
            user,
            coin,
            staticPage,
            announcement,
            country,
            employee,
            name: name,
            is_active: !is_active
        };

        self.setState({ loader: true })
        let message = is_active ? 'Role has been inactivated successfully.' : 'Role has been activated successfully.'
        ApiUtils.updateRole(token, formData)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    self._getAllRoles();
                    self.setState({ errMsg: true, errMessage: message, errType: 'Success' });
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

    static editRole(value, name, coin, user, country, announcement, employee, role, staticPage, is_active) {
        let roleDetails = {
            value, name, coin, user, country, announcement, employee, role, staticPage, is_active
        }
        self.setState({ showEditRoleModal: true, roleDetails });
    }

    static deleteRole(value) {
        self.setState({ showDeleteRoleModal: true, deleteRoleId: value });
    }

    componentDidMount = () => {
        this._getAllRoles();
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
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllRoles(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ allRoles: res.roles });
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
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.deleteRole(token, deleteRoleId)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        deleteRoleId: '', errType: 'Success', errMsg: true, errMessage: res.message
                    });
                    _this._closeDeleteRoleModal();
                    _this._getAllRoles();
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
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

    render() {
        const { allRoles, errType, errMsg, loader, showAddRoleModal,
            showEditRoleModal, roleDetails, showDeleteRoleModal } = this.state;

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
                                    <AddRoleModal
                                        showAddRoleModal={showAddRoleModal}
                                        closeAddModal={this._closeAddRoleModal}
                                        getAllRoles={this._getAllRoles.bind(this, 0)}
                                    />
                                </div>
                                {loader && <span className="loader-class">
                                    <Spin />
                                </span>}
                                <div>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allRoles}
                                        className="isoCustomizedTable"
                                    />
                                    <EditRoleModal
                                        fields={roleDetails}
                                        showEditRoleModal={showEditRoleModal}
                                        closeEditRoleModal={this._closeEditRoleModal}
                                        getAllRoles={this._getAllRoles.bind(this)}
                                    />
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
    }))(Roles);

export { Roles, rolesTableInfos };

