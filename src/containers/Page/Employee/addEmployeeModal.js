import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, Icon, Spin, Select, notification } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const Option = Select.Option;

class AddEmployeeModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAddEmpModal: this.props.showAddEmpModal,
            loader: false,
            fields: {},
            allRoles: [],
            selectedRole: ''
        }
        this.validator = new SimpleReactValidator();
    }

    _getAllRoles = () => {
        const { token } = this.props;
        let _this = this;

        ApiUtils.getAllRoles(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    let roles = res.roles.map((role) => ({ key: role.id, value: role.name }));
                    _this.setState({ allRoles: roles });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch(err => {
                _this.setState({ errType: 'error', errMsg: true, errMessage: 'Something went wrong' });
            });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({ showAddEmpModal: nextProps.showAddEmpModal });
            this._getAllRoles();
        }
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _closeAddEmpModal = () => {
        this.setState({ showAddEmpModal: false })
        this.props.closeAddModal();
        this._resetAddForm();
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['name'] = '';
        fields['email'] = '';
        this.setState({ fields, selectedRole: '' });
    }

    _addEmployee = () => {
        const { token, getAllEmployee } = this.props;
        let { fields, selectedRole } = this.state;

        if (this.validator.allValid()) {
            let formData = {
                name: fields["name"],
                email: fields["email"],
                roles: selectedRole,
            };

            this.setState({ loader: true })
            ApiUtils.addEmployee(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this._closeAddEmpModal();
                    getAllEmployee();
                    this._resetAddForm();
                    this.setState({
                        errMsg: true, errMessage: res.message,
                        errType: 'success', loader: false
                    })
                })
                .catch(() => {
                    this.setState({
                        errType: 'error', errMsg: true,
                        errMessage: 'Something went wrong', loader: false
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _changeRole = (value) => {
        this.setState({ selectedRole: value })
    }

    render() {
        const { loader, showAddEmpModal, fields, allRoles, errType, errMsg } = this.state;

        let options = allRoles.map((role) => {
            return (
                <Option value={role.key}>{role.value}</Option>
            )
        });

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <Modal
                title="Add Employee"
                visible={showAddEmpModal}
                onOk={this._addEmployee}
                onCancel={this._closeAddEmpModal}
                confirmLoading={loader}
                okText="Add"
            >
                <div style={{ "marginBottom": "15px" }}>
                    <span>Name:</span>
                    <Input placeholder="Name" onChange={this._handleChange.bind(this, "name")} value={fields["name"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('name', fields["name"], 'required', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Email:</span>
                    <Input placeholder="Email" onChange={this._handleChange.bind(this, "email")} value={fields["email"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('email', fields["email"], 'required|email', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span style={{ "marginRight": "15px" }}>Role:</span>
                    <Select
                        style={{ width: 200 }}
                        placeholder="Select a role"
                        onChange={this._changeRole}
                    >
                        {options}
                    </Select>
                </div>

                {loader && <Spin indicator={loaderIcon} />}
            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(AddEmployeeModal);
