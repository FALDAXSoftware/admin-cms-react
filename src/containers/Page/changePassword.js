import React, { Component } from 'react';
import { Button, notification, Spin, Icon, Input } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../helpers/apiUtills';
import { connect } from 'react-redux';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class ChangePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fields: {},
            errors: {},
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
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _changePassword = () => {
        const { token, user } = this.props;
        let { fields, errors } = this.state;
        let _this = this;

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
                    } else {
                        _this.setState({
                            loader: false, errMsg: true, errType: 'Error',
                            errMessage: res.message
                        });
                    }
                })
                .catch(err => {
                    _this.setState({ loader: false, errMsg: true });
                });
        } else {
            if (fields["confirmPwd"] !== fields["newPwd"] || fields["newPwd"] !== fields["confirmPwd"]) {
                this.state.errors["main"] = "New Password and Confirm Password doesn't match.";
                this.setState({ errors, loader: false })
            }
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { fields, loader, errors, errMsg, errType } = this.state;

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
                    <Input
                        type="password"
                        placeholder="Current Password"
                        style={{ "marginBottom": "15px", "width": "25%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "oldPwd")}
                        value={fields["oldPwd"]}
                    />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('Current Password', fields["oldPwd"], 'required', 'text-danger')}
                    </span>

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
                        {this.validator.message('New Password', fields["newPwd"], 'required', 'text-danger')}
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
                        {this.validator.message('Confirm Password', fields["confirmPwd"], 'required', 'text-danger')}
                        {errors["main"]}
                    </span>
                    <br />
                    <Button type="primary" onClick={this._changePassword}> Change </Button>
                </div>
                {loader && <Spin indicator={loaderIcon} />}
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user'),
    }))(ChangePassword);
