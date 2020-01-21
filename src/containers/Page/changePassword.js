import React, { Component } from 'react';
import { Button, notification, Input } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../helpers/apiUtills';
import { connect } from 'react-redux';
import FaldaxLoader from '../Page/faldaxLoader';
import authAction from '../../redux/auth/actions';

const { logout } = authAction;

class ChangePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fields: {},
            pwdError: false,
            loader: false,
            errMsg: false,
            errMessage: '',
            errType: 'Success',
            showErr: false
        }
        this.validator = new SimpleReactValidator();
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

    _changePassword = () => {
        const { token, user } = this.props;
        let { fields } = this.state;
        let _this = this;

        _this.setState({ pwdError: false });
        if (this.validator.allValid() && fields["newPwd"] === fields["confirmPwd"]) {
            _this.setState({ loader: true });

            let formData = {
                email: user.email,
                current_password: fields["oldPwd"],
                new_password: fields["newPwd"],
                confirm_password: fields["confirmPwd"]
            };

            ApiUtils.changePassword(token, formData)
                .then((response) => response.json())
                .then((res) => {
                    if (res) {
                        let fields = _this.state.fields;
                        fields["oldPwd"] = "";
                        fields["newPwd"] = "";
                        fields["confirmPwd"] = "";
                        _this.validator = new SimpleReactValidator();
                        _this.setState({
                            fields, loader: false, errMsg: true, errType: res.err ? 'Error' : 'Success',
                            errMessage: res.err ? res.err : res.message
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
                    _this.setState({ loader: false, errMsg: true });
                });
        } else {
            if (fields["confirmPwd"] !== fields["newPwd"] || fields["newPwd"] !== fields["confirmPwd"]) {
                this.setState({ pwdError: true, loader: false })
            }
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { fields, loader, pwdError, errMsg, errType } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div style={{ "paddingLeft": "50px", "paddingTop": "50px" }}>
                <h2> <b> Change Password </b> </h2>

                <div style={{ "marginTop": "10px" }}>
                    <span>
                        <b>Current Password</b>
                    </span>
                    <Input.Password
                        placeholder="Current Password"
                        style={{ "marginBottom": "15px", "width": "25%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "oldPwd")}
                        value={fields["oldPwd"]}
                    />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('Current Password', fields["oldPwd"], 'required|min:6', 'text-danger')}
                    </span>

                    <span>
                        <b>New Password</b>
                    </span>
                    <Input.Password
                        placeholder="New Password"
                        style={{ "marginBottom": "15px", "width": "25%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "newPwd")}
                        value={fields["newPwd"]}
                    />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('New Password', fields["newPwd"], 'required|min:6', 'text-danger')}
                    </span>

                    <span>
                        <b>Confirm Password</b>
                    </span>
                    <Input.Password
                        placeholder="Confirm Password"
                        style={{ "marginBottom": "15px", "width": "25%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "confirmPwd")}
                        value={fields["confirmPwd"]}
                    />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('Confirm Password', fields["confirmPwd"], 'required|min:6', 'text-danger')}
                        {pwdError && <span>New Password and Confirm Password doesn't match.</span>}
                    </span>
                    <br />
                    <Button type="primary" onClick={this._changePassword}> Change </Button>
                </div>
                {loader && <FaldaxLoader />}
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user'),
    }), { logout })(ChangePassword);
