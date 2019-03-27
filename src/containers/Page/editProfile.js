import React, { Component } from 'react';
import { Button, Input, Spin, Icon, notification, Col, Row } from 'antd';
import { connect } from 'react-redux';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../helpers/apiUtills';
import authAction from '../../redux/auth/actions';

const { login } = authAction;
const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class EditProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fields: {},
            errors: {},
            loader: false,
            errType: 'Success',
            isEnabled: 'DISABLED',
            is_twofactor: false,
            showQR: false,
            QRKey: ''
        }
        this.validator = new SimpleReactValidator();
    }

    componentDidMount = () => {
        let fields = this.state.fields;
        const { first_name, email, is_twofactor } = this.props.user;
        fields["first_name"] = first_name;
        fields["email"] = email;
        this.setState({ fields, is_twofactor });
        this._getAdminDetails();
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

    _editProfile = () => {
        const { token, login, user } = this.props;
        let fields = this.state.fields;
        let _this = this;

        if (this.validator.allValid()) {
            _this.setState({ loader: true });

            const formData = {
                name: fields['name'],
                email: user.email
            }

            ApiUtils.editProfile(token, formData)
                .then((response) => response.json())
                .then(function (res) {
                    if (res) {
                        login({ user: res.data[0] });
                        _this.setState({
                            errMsg: true, errMessage: 'Profile updated successfully.',
                            loader: false, errType: 'Success'
                        });
                    } else {
                        _this.setState({ errMsg: true, errMessage: res.message, loader: false, errType: 'error' });
                    }
                })
                .catch(() => {
                    _this.setState({ loader: false });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _getAdminDetails = () => {
        console.log('CALL _getAdminDetails');
        const { token, user, login } = this.props;
        let _this = this;

        ApiUtils.getAdminDetails(token, user.id)
            .then((response) => response.json())
            .then(function (res) {
                console.log('_getAdminDetails res', res)
                if (res) {
                    login({ user: res.data });
                    _this.setState({
                        isEnabled: res.data.is_twofactor ? 'ENABLED' : 'DISABLED',
                        is_twofactor: res.data.is_twofactor
                    })
                }
            })
            .catch(() => {
                _this.setState({ loader: false });
            });
    }

    _setupTwoFactor = () => {
        const { token, user } = this.props;
        let _this = this;

        _this.setState({ loader: true });

        const formData = {
            admin_id: user.id
        }

        ApiUtils.setupTwoFactor(token, formData)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        errMsg: true, errMessage: res.message,
                        loader: false, errType: 'success', QRImage: res.dataURL,
                        QRKey: res.tempSecret
                    }, () => {
                        if (_this.state.is_twofactor == false)
                            _this.setState({ showQR: true })
                        else
                            _this.setState({ showQR: false })
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.err, loader: false, errType: 'error' });
                }
            })
            .catch(() => {
                _this.setState({ loader: false });
            });
    }

    _enableAuthenticator = () => {
        if (this.props.user.is_twofactor == false) {
            this._setupTwoFactor();
        } else
            this._enable2FA();
    }

    _enable2FA = () => {
        const { token, user } = this.props;
        let _this = this;

        _this.setState({ loader: true });

        const formData = {
            admin_id: user.id
        }

        ApiUtils.disableTwoFactor(token, formData)
            .then((response) => response.json())
            .then(function (res) {
                console.log('disableTwoFactor Res', res)
                if (res) {
                    console.log('inside if');
                    _this.setState({
                        errMsg: true, errMessage: res.message,
                        loader: false, errType: 'success', isEnabled: 'ENABLED',
                    }, () => {
                        _this._getAdminDetails();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.err, loader: false, errType: 'error' });
                }
            })
            .catch(() => {
                _this.setState({ loader: false });
            });
    }

    _verifyOtp = () => {
        const { token, user } = this.props;
        const { fields } = this.state;
        let _this = this;

        _this.setState({ loader: true });

        const formData = {
            admin_id: user.id,
            otp: fields["otp"]
        }

        ApiUtils.verifyOTP(token, formData)
            .then((response) => response.json())
            .then(function (res) {
                console.log('verify Res', res)
                if (res) {
                    if (res.err) {
                        _this.setState({ errMsg: true, errMessage: res.err, loader: false, errType: 'error' });
                    } else {
                        _this.setState({
                            errMsg: true, errMessage: res.message,
                            loader: false, errType: 'Success', isEnabled: 'ENABLED', showQR: false
                        }, () => {
                            _this._getAdminDetails();
                        });
                    }
                    let fields = this.state.fields;
                    fields["otp"] = "";
                    _this.setState({ fields });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.err, loader: false, errType: 'error' });
                }
            })
            .catch(() => {
                _this.setState({ loader: false });
            });
    }

    render() {
        const { loader, fields, errMsg, errType, isEnabled, is_twofactor, QRKey, showQR } = this.state;
        console.log(isEnabled)

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div style={{ "paddingLeft": "50px", "paddingTop": "50px", paddingRight: "50px" }}>
                <h2>
                    <b> Edit Profile </b>
                </h2>

                <div style={{ "marginTop": "10px" }}>
                    <span>
                        <b>Name</b>
                    </span>
                    <Input placeholder="Name" style={{ "marginBottom": "15px", "width": "25%", "display": "inherit" }} onChange={this._onChangeFields.bind(this, "first_name")} value={fields["first_name"]} />
                    <span className="field-error">
                        {this.validator.message('Name', fields['first_name'], 'required|max:30')}
                    </span>

                    <span>
                        <b>Email</b>
                    </span>
                    <Input disabled style={{ "marginBottom": "15px", "width": "25%", "display": "inherit", "readonly": "readonly" }} value={fields["email"]} />
                    <Button type="primary" onClick={this._editProfile}> Update </Button>
                </div>
                <hr />
                <div style={{ marginTop: "50px" }}>
                    <h2>
                        <b> Two-Factor Authentication </b>
                    </h2>
                    <div style={{ "marginTop": "10px" }}>
                        <div style={{ marginTop: '20px', textAlign: "center" }}>
                            {isEnabled == 'DISABLED' ?
                                <span>Two-Factor Authentication significantly increases the security of your account. We highly recommend that you enable it. </span>
                                : <span>Way to go! You care about your security as much as we do. Thanks for enabling Two-Factor Authentication!</span>
                            }
                        </div>
                        <div style={{ marginTop: '20px', textAlign: "center" }}> Status:
                            {isEnabled == 'DISABLED' ?
                                <span style={{ color: 'red' }}> {isEnabled}</span>
                                : <span style={{ color: 'green' }}> {isEnabled}</span>
                            }
                        </div>
                        <div style={{ marginTop: '20px', textAlign: "center", marginBottom: "40px" }}>
                            <Button type="primary" onClick={this._enableAuthenticator}> {!is_twofactor ? 'ENABLE' : 'DISABLE'} AUTHENTICATOR </Button>
                        </div>
                        {(this.state.showQR == true) ?
                            <div style={{ marginTop: "30px" }}>
                                <Row>
                                    <Col sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }}>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <div style={{ height: "200px", width: "200px", display: "flex", alignItems: "center", justifyContent: "center" }} >
                                                    <img src={this.state.QRImage} />
                                                </div>
                                            </div>
                                            <div>16 Digit Key</div>
                                            <div>{QRKey}</div>
                                        </div>
                                    </Col>
                                    <Col sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }}>
                                        <ul style={{ listStyleType: "lower-roman" }}>
                                            <li>Install an authenticator app on your mobile device. We suggest Google Authenticator or Authy. </li>
                                            <li>Scan the QR code when prompted by your Authenticator.</li>
                                            <li>In case your phone gets stolen or erased, you will need this code to link FALDAX with a new app.</li>
                                            <li>Do not share the code with anyone. FALDAX will never ask you for this code.</li>
                                        </ul>
                                        <div>
                                            <span>Enter your two-factor code here:</span>
                                            <div style={{ marginTop: "20px" }}>
                                                <Input style={{ width: "200px" }} value={fields["otp"]}
                                                    onChange={this._onChangeFields.bind(this, "otp")} />
                                            </div>
                                            <span className="MSG_OTP">{this.state.otp_msg}</span>
                                        </div>
                                        <Button style={{ marginTop: "20px", marginBottom: "20px" }}
                                            type="primary" onClick={this._verifyOtp.bind(this)}>ENABLE</Button>
                                    </Col>
                                </Row>
                            </div>
                            : ''}
                    </div>
                </div>
                {loader && <Spin indicator={loaderIcon} />}
            </div >
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user'),
    }),
    { login }
)(EditProfile);
