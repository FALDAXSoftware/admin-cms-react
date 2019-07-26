import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Select, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;
const { TextArea } = Input;
const Option = Select.Option;

class EditEmployeeModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditEmpModal: this.props.showEditEmpModal,
            loader: false,
            fields: this.props.fields,
            errMsg: false,
            errMessage: '',
            errType: 'Success',
            selectedRole: this.props.fields['role'],
            selectedRoleId: this.props.fields['role_id'],
            allRoles: this.props.allRoles,
            isDisabled: false
        }
        this.validator = new SimpleReactValidator();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({
                showEditEmpModal: nextProps.showEditEmpModal,
                fields: nextProps.fields,
                allRoles: nextProps.allRoles,
                selectedRole: nextProps.fields['role'],
                selectedRoleId: nextProps.fields['role_id']
            });
        }
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    _resetForm = () => {
        const { fields } = this.state;

        fields['first_name'] = '';
        fields['last_name'] = '';
        fields['email'] = '';
        fields['phone_number'] = '';
        fields['address'] = '';
        this.setState({ fields, selectedRole: '' });
    }

    _closeEditEmpModal = () => {
        this.setState({ showEditEmpModal: false, selectedRole: '' })
        this.props.closeEditEmpModal();
    }

    _editEmployee = () => {
        const { token, getAllEmployee } = this.props;
        const { fields, selectedRole, selectedRoleId } = this.state;

        if (this.validator.allValid()) {
            this.setState({ loader: true, isDisabled: true });

            let formData = {
                id: fields["value"],
                first_name: fields["first_name"],
                last_name: fields["last_name"],
                email: fields["email"],
                address: fields["address"],
                phone_number: fields["phone_number"],
                role_id: selectedRoleId,
            };

            ApiUtils.editEmployee(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        this.setState({
                            errMsg: true, errMessage: res.message, errType: 'Success'
                        });
                        this._closeEditEmpModal();
                        getAllEmployee();
                        this._resetForm();
                    } else if (res.status == 403) {
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            this.props.logout();
                        });
                    } else {
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' });
                    }
                    this.setState({ isDisabled: false, loader: false })
                })
                .catch(() => {
                    this.setState({
                        errMsg: true, errMessage: 'Something went wrong!!',
                        loader: false, errType: 'error', isDisabled: false
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _changeRole = (value) => {
        this.setState({ selectedRole: value, selectedRoleId: value })
    }

    render() {
        const { loader, showEditEmpModal, fields, errMsg, errType,
            allRoles, selectedRole, isDisabled } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        let roleOptions = allRoles.map((role) => {
            return (
                <Option value={role.key}>{role.value}</Option>
            )
        })

        return (
            <div>
                <Modal
                    title="Edit Employee"
                    visible={showEditEmpModal}
                    onCancel={this._closeEditEmpModal}
                    confirmLoading={loader}
                    footer={[
                        <Button onClick={this._closeEditEmpModal}>Cancel</Button>,
                        <Button disabled={isDisabled} onClick={this._editEmployee}>Update</Button>,
                    ]}
                >
                    <div style={{ "marginBottom": "15px" }}>
                        <span>First Name:</span>
                        <Input placeholder="First Name" onChange={this._handleChange.bind(this, "first_name")} value={fields["first_name"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('first name', fields["first_name"], 'required|max:30', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Last Name:</span>
                        <Input placeholder="Last Name" onChange={this._handleChange.bind(this, "last_name")} value={fields["last_name"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('last name', fields["last_name"], 'required|max:30', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Email:</span>
                        <Input placeholder="Email" onChange={this._handleChange.bind(this, "email")} value={fields["email"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('email', fields["email"], 'required|email|max:50', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Phone Number:</span>
                        <Input placeholder="Phone Number" onChange={this._handleChange.bind(this, "phone_number")} value={fields["phone_number"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('phone number', fields["phone_number"], 'required|numeric|max:12', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Address:</span>
                        <TextArea placeholder="Address" onChange={this._handleChange.bind(this, "address")} value={fields["address"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('address', fields["address"], 'required|max:100', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span style={{ "marginRight": "15px" }}>Role:</span>
                        <Select
                            getPopupContainer={trigger => trigger.parentNode}
                            style={{ width: 200 }}
                            placeholder="Select a role"
                            onChange={this._changeRole}
                            value={selectedRole}
                        >
                            {roleOptions}
                        </Select>
                    </div>
                    {loader && <FaldaxLoader />}
                </Modal>
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(EditEmployeeModal);
