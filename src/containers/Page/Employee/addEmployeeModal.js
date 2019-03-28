import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, Icon, Spin, Select, notification, Button } from 'antd';
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
            selectedRole: '',
            isDisabled: false,
            showRoleErr: false
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
            this.validator = new SimpleReactValidator();
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
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['first_name'] = '';
        fields['last_name'] = '';
        fields['email'] = '';
        fields['phone_number'] = '';
        fields['address'] = '';
        this.setState({ fields, selectedRole: '', showRoleErr: false });
    }

    _addEmployee = () => {
        const { token, getAllEmployee } = this.props;
        let { fields, selectedRole } = this.state;

        if (this.validator.allValid() && selectedRole) {
            let formData = {
                first_name: fields["first_name"],
                last_name: fields["last_name"],
                email: fields["email"],
                address: fields["address"],
                roles: selectedRole,
                phone_number: fields["phone_number"],
            };

            this.setState({ loader: true, isDisabled: true })
            ApiUtils.addEmployee(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this._closeAddEmpModal();
                    getAllEmployee();
                    this._resetAddForm();
                    this.setState({
                        errMsg: true, errMessage: res.message, showRoleErr: false,
                        errType: 'Success', loader: false, isDisabled: false
                    })
                })
                .catch(() => {
                    this.setState({
                        errType: 'error', errMsg: true, isDisabled: false,
                        errMessage: 'Something went wrong', loader: false
                    });
                });
        } else {
            this.setState({ showRoleErr: selectedRole ? false : true })
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _changeRole = (value) => {
        this.setState({ selectedRole: value }, () => {
            this.setState({ showRoleErr: this.state.selectedRole ? false : true });
        })
    }

    render() {
        const { loader, showAddEmpModal, fields, allRoles, errType, errMsg,
            isDisabled, showRoleErr } = this.state;

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
                confirmLoading={loader}
                onCancel={this._closeAddEmpModal}
                footer={[
                    <Button onClick={this._closeAddEmpModal}>Cancel</Button>,
                    <Button disabled={isDisabled} onClick={this._addEmployee}>Add</Button>,
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
                        {this.validator.message('email', fields["email"], 'required|email', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Phone Number:</span>
                    <Input placeholder="Phone Number" onChange={this._handleChange.bind(this, "phone_number")} value={fields["phone_number"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('phone number', fields["phone_number"], 'required|numeric', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Address:</span>
                    <Input placeholder="Address" onChange={this._handleChange.bind(this, "address")} value={fields["address"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('address', fields["address"], 'required', 'text-danger')}
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
                    </Select><br />
                    {showRoleErr && <span style={{ "color": "red" }}>
                        {'The role field is required.'}
                    </span>}
                </div>
                {loader && <span className="loader-class"><Spin /></span>}
            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(AddEmployeeModal);

