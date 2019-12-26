import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Divider, Input, Button, Select, notification } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import authAction from '../../../redux/auth/actions';
import styled from 'styled-components';
import FaldaxLoader from '../faldaxLoader';
import { isAllowed } from '../../../helpers/accessControl';

const { logout } = authAction;
const Option = Select.Option;
const { TextArea } = Input;

const ParentDiv = styled.div`
background-color: white;
`

class PersonalDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRole: '',
            fields: {},
            pwdError: false,
        }
        this.validator = new SimpleReactValidator();
        this.PasswordValidator = new SimpleReactValidator();
    }

    componentDidMount = () => {
       if(isAllowed("get_role"))this._getAllRoles();
        this._getEmployeeDetails();
    }

    _getEmployeeDetails = () => {
        const { token, emp_id } = this.props;
        let _this = this;

        ApiUtils.getEmployeeDetails(token, emp_id)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ fields: res.data, selectedRole: res.data.role_name });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' })
                }
            })
            .catch((err) => {
                console.error('error', err)
            });
    }

    _getAllRoles = () => {
        const { token } = this.props;
        let _this = this;

        ApiUtils.getAllRoles(token, '', '', true)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    let roles = res.roleName.map((role) => ({ key: role.id, value: role.name }));
                    _this.setState({ allRoles: roles });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errType: 'error', errMsg: true, errMessage: res.err });
                }
            })
            .catch(err => {
                _this.setState({ errType: 'error', errMsg: true, errMessage: 'Something went wrong' });
            });
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _onChangeFields(field, e) {
        let fields = this.state.fields;
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    _changeRole = (value) => {
        this.setState({ selectedRole: value, selectedRoleId: value })
    }

    _changePassword = () => {
        const { token } = this.props;
        let { fields, errors } = this.state;
        let _this = this;

        if (this.PasswordValidator.allValid() && fields["newPwd"] === fields["confirmPwd"]) {
            _this.setState({ loader: true });

            let formData = {
                email: fields["email"],
                new_password: fields["newPwd"],
                confirm_password: fields["confirmPwd"]
            };

            ApiUtils.changeEmployeePassword(token, formData)
                .then((response) => response.json())
                .then((res) => {
                    if (res.status == 200) {
                        let fields = _this.state.fields;
                        fields["newPwd"] = "";
                        fields["confirmPwd"] = "";
                        _this.PasswordValidator = new SimpleReactValidator();
                        _this.setState({
                            fields, loader: false, errMsg: true, errType: res.err ? 'Error' : 'Success',
                            errMessage: res.err ? res.err : res.message, pwdError: false
                        });
                    } else if (res.status == 403) {
                        _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            _this.props.logout();
                        });
                    } else {
                        _this.setState({
                            loader: false, errMsg: true, errType: 'Error', errMessage: res.message
                        });
                    }
                })
                .catch(err => {
                    _this.setState({ loader: false, errMsg: true, errType: 'Error' });
                });
        } else {
            if (fields["confirmPwd"] !== fields["newPwd"] || fields["newPwd"] !== fields["confirmPwd"]) {
                this.setState({ pwdError: true, loader: false })
            }
            this.PasswordValidator.showMessages();
            this.forceUpdate();
        }
    }

    _updateEmployee = () => {
        const { token } = this.props;
        const { fields, selectedRoleId } = this.state;

        if (this.validator.allValid()) {
            this.setState({ loader: true, isDisabled: true });

            let formData = {
                id: fields["id"],
                first_name: fields["first_name"],
                last_name: fields["last_name"],
                address: fields["address"],
                role_id: selectedRoleId,
            };

            ApiUtils.editEmployee(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        this.setState({
                            errMsg: true, errMessage: res.message, errType: 'Success'
                        });
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

    render() {
        const { fields, errors, selectedRole, allRoles, errMsg, errType, loader, pwdError } = this.state;
        let roleOptions = allRoles && allRoles.map((role) => {
            return (
                <Option value={role.key}>{role.value}</Option>
            )
        })

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <ParentDiv className="kyc-div">
                <Divider>Personal Information</Divider>
                <div className="">
                    <div style={{ "marginBottom": "15px" }}>
                        <span>First Name:</span>
                        <Input placeholder="First Name" onChange={this._onChangeFields.bind(this, "first_name")} value={fields["first_name"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('first name', fields["first_name"], 'required|max:30', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Last Name:</span>
                        <Input placeholder="Last Name" onChange={this._onChangeFields.bind(this, "last_name")} value={fields["last_name"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('last name', fields["last_name"], 'required|max:30', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Email:</span>
                        <Input placeholder="Email" value={fields["email"]} disabled />
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Phone Number:</span>
                        <Input placeholder="Phone Number" value={fields["phone_number"]} disabled />
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Address:</span>
                        <TextArea placeholder="Address" onChange={this._onChangeFields.bind(this, "address")} value={fields["address"]} />
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
                    <br />
                   {isAllowed("update_employee") && <Button type="primary" onClick={this._updateEmployee}> Update </Button>}
                </div>
                {isAllowed("employee_change_password") &&
                    <>
                        <Divider>Change Password</Divider>
                        <div className="">
                            <div style={{ "marginTop": "10px" }}>
                                <span>
                                    <b>New Password</b>
                                </span>
                                <Input
                                    type="password"
                                    placeholder="New Password"
                                    style={{ "marginBottom": "15px", "width": "25%", "display": "inherit" }}
                                    onChange={this._onChangeFields.bind(this, "newPwd")}
                                    value={fields["newPwd"]}
                                />
                                <span style={{ "color": "red" }}>
                                    {this.PasswordValidator.message('New Password', fields["newPwd"], 'required|min:6', 'text-danger')}
                                </span>

                                <span>
                                    <b>Confirm Password</b>
                                </span>
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    style={{ "marginBottom": "15px", "width": "25%", "display": "inherit" }}
                                    onChange={this._onChangeFields.bind(this, "confirmPwd")}
                                    value={fields["confirmPwd"]}
                                />
                                <span style={{ "color": "red" }}>
                                    {this.PasswordValidator.message('Confirm Password', fields["confirmPwd"], 'required|min:6', 'text-danger')}
                                    {pwdError && <span>New Password and Confirm Password doesn't match.</span>}
                                </span>
                                <br />
                               {isAllowed("employee_change_password") && <Button type="primary" onClick={this._changePassword}> Change </Button>}
                            </div>
                        </div>
                    </>
                }

                {/* <Divider>Change Email Address</Divider>
                <div className="">
                    <div style={{ "marginTop": "10px" }}>
                        <span>
                            <b>Email ID</b>
                        </span>
                        <Input
                            type="email"
                            placeholder="Email ID"
                            style={{ "marginBottom": "15px", "width": "25%", "display": "inherit" }}
                            onChange={this._onChangeFields.bind(this, "email")}
                            value={fields["email"]}
                        />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('Email ID', fields["email"], 'required', 'text-danger')}
                        </span>
                        <br />
                        <Button type="primary" onClick={this._changePassword}> Change </Button>
                    </div> 
                </div>*/}
                {loader && <FaldaxLoader />}
            </ParentDiv>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user')
    }), { logout })(PersonalDetails);
