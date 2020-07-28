import React, { Component } from 'react';
import { Button, Input, notification, Col, Row, Divider } from 'antd';
import { connect } from 'react-redux';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../helpers/apiUtills';
import authAction from '../../redux/auth/actions';
import FaldaxLoader from '../Page/faldaxLoader';
import ProfileWhitelist from './profileWhitelist';
import { TwoFactorModal } from '../Shared/2faModal';

const { login, logout } = authAction;

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      loader: false,
      errType: "Success",
      isEnabled: "DISABLED",
      is_twofactor: false,
      showQR: false,
      QRKey: "",
      show2FAModal:false
    };
    this.validator = new SimpleReactValidator();
    this.twoFaValidator = new SimpleReactValidator();
  }

  componentDidMount = () => {
    let fields = this.state.fields;
    const { first_name, email, is_twofactor } = this.props.user;
    fields["first_name"] = first_name;
    fields["email"] = email;
    this.setState({ fields, is_twofactor });
    this._getAdminDetails();
    fields["otp"] = "";
  };

  openNotificationWithIconError = type => {
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
        first_name: fields["first_name"],
        email: user.email
      };

      ApiUtils.editProfile(token, formData)
        .then(response => response.json())
        .then(function(res) {
          if (res.status == 200) {
            login({ user: { ..._this.props.user, ...res.data[0] } });
            _this.setState({
              errMsg: true,
              errMessage: res.message,
              loader: false,
              errType: "Success"
            });
          } else if (res.status == 403) {
            _this.setState(
              { errMsg: true, errMessage: res.err, errType: "error" },
              () => {
                _this.props.logout();
              }
            );
          } else {
            _this.setState({
              errMsg: true,
              errMessage: res.message,
              loader: false,
              errType: "error"
            });
          }
        })
        .catch(() => {
          _this.setState({ loader: false });
        });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  _getAdminDetails = async () => {
    try {
      const { token, user, login } = this.props;
      let response = await (
        await ApiUtils.getAdminDetails(token, user.id)
      ).json();
      if (response.status == 200) {
        login({ user: { ...this.props.user, ...response.data } });
        this.setState({
          isEnabled: response.data.is_twofactor ? "ENABLED" : "DISABLED",
          is_twofactor: response.data.is_twofactor
        });
      } else if (response.status == 400 || response.status == 403) {
        this.setState({
          errType: "Error",
          errMessage: response.message,
          errMsg: true
        });
      }
    } catch (error) {
      this.setState({
        errType: "Error",
        errMessage: "Unable to complete the requested action.",
        errMsg: true,
      });
    } finally {
      this.setState({ loader: false });
    }
  };

  _setupTwoFactor = () => {
    const { token, user } = this.props;
    const { fields } = this.state;
    let _this = this;

    _this.setState({ loader: true });

    const formData = {
      admin_id: user.id
    };

    ApiUtils.setupTwoFactor(token, formData)
      .then(response => response.json())
      .then(function(res) {
        if (res) {
          if (res.status == 200) {
            fields["otp"] = "";
            _this.setState(
              {
                loader: false,
                QRImage: res.dataURL,
                QRKey: res.tempSecret,
                fields
              },
              () => {
                if (_this.state.is_twofactor == false)
                  _this.setState({ showQR: true });
                else _this.setState({ showQR: false });
              }
            );
          } else if (res.status == 403) {
            _this.setState(
              { errMsg: true, errMessage: res.err, errType: "error" },
              () => {
                _this.props.logout();
              }
            );
          } else {
            _this.setState({
              errMsg: true,
              errMessage: res.message,
              loader: false,
              errType: "error"
            });
          }
        } else {
          _this.setState({
            errMsg: true,
            errMessage: res.err,
            loader: false,
            errType: "error"
          });
        }
      })
      .catch(() => {
        _this.setState({ loader: false });
      });
  };

  _enableAuthenticator = () => {
    if (this.props.user.is_twofactor == false) {
      this._setupTwoFactor();
    } else {
      this.setState({loader:false,show2FAModal:true})
    }
  };

  _enable2FA = (otp) => {
    const { token, user } = this.props;
    let _this = this;

    _this.setState({ loader: true});

    const formData = {
      admin_id: user.id,
      otp: otp
    };

    ApiUtils.disableTwoFactorViaCode(token, formData)
      .then(response => response.json())
      .then(function(res) {
        if (res) {
          if (res.status == 200) {
            _this.setState(
              {
                errMsg: true,
                errMessage: res.message,
                loader: false,
                errType: "success",
                isEnabled: "ENABLED",
                show2FAModal:false
              },
              () => {
                _this._getAdminDetails();
              }
            );
          } else if (res.status == 403) {
            _this.setState(
              { errMsg: true, errMessage: res.err, errType: "error" },
              () => {
                _this.props.logout();
              }
            );
          } else {
            _this.setState({
              errMsg: true,
              errMessage: res.message,
              loader: false,
              errType: "error"
            });
          }
        } else {
          _this.setState({
            errMsg: true,
            errMessage: res.err,
            loader: false,
            errType: "error"
          });
        }
      })
      .catch(() => {
        _this.setState({ loader: false });
      });
  };

  _verifyOtp = () => {
    if (!this.twoFaValidator.allValid()) {
      this.twoFaValidator.showMessages();
      this.forceUpdate();
      return;
    }
    const { token, user } = this.props;
    const { fields } = this.state;
    let _this = this;

    _this.setState({ loader: true });

    const formData = {
      admin_id: user.id,
      otp: fields["otp"]
    };

    ApiUtils.verifyOTP(token, formData)
      .then(response => response.json())
      .then(function(res) {
        if (res) {
          if (res.status == 200) {
            // fields["otp"] = '';
            _this.setState(
              {
                // fields,
                errMsg: true,
                errMessage: res.message,
                loader: false,
                errType: "Success",
                isEnabled: "ENABLED",
                showQR: false
              },
              () => {
                _this._getAdminDetails();
              }
            );
          } else if (res.status == 403) {
            _this.setState(
              { errMsg: true, errMessage: res.err, errType: "error" },
              () => {
                _this.props.logout();
              }
            );
          } else {
            _this.setState({
              errMsg: true,
              errMessage: res.err,
              loader: false,
              errType: "error"
            });
          }
          let fields = this.state.fields;
          fields["otp"] = "";
          _this.setState({ fields });
        } else {
          _this.setState({
            errMsg: true,
            errMessage: res.err,
            loader: false,
            errType: "error"
          });
        }
      })
      .catch(() => {
        _this.setState({ loader: false });
      });
  };

  render() {
    const {
      loader,
      fields,
      errMsg,
      errType,
      isEnabled,
      is_twofactor,
      QRKey,
      show2FAModal
    } = this.state;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <div
        className="profile-div"
        style={{
          paddingLeft: "50px",
          paddingTop: "50px",
          paddingRight: "50px"
        }}
      >
        <Divider>Edit Profile</Divider>
        <div style={{ marginTop: "10px" }}>
          <div className="edit-profile-input">
            <span>
              <b>Name</b>
            </span>
            <Input
              placeholder="Name"
              onChange={this._onChangeFields.bind(this, "first_name")}
              value={fields["first_name"]}
            />
            <span className="field-error">
              {this.validator.message(
                "Name",
                fields["first_name"],
                "required|max:30"
              )}
            </span>
          </div>
          <div className="edit-profile-input">
            <span>
              <b>Email</b>
            </span>
            <Input disabled value={fields["email"]} />
          </div>
          <Button type="primary" onClick={this._editProfile}>
            {" "}
            Update{" "}
          </Button>
        </div>
        <div style={{ marginTop: "50px" }}>
          <Divider>2FA</Divider>
          <div style={{ marginTop: "10px" }}>
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              {isEnabled == "DISABLED" ? (
                <span>
                  2FA significantly increases the security of your account. We
                  highly recommend that you enable it.{" "}
                </span>
              ) : (
                <span>
                  Way to go! You care about your security as much as we do.
                  Thanks for enabling 2FA!
                </span>
              )}
            </div>
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              {" "}
              Status:
              {isEnabled == "DISABLED" ? (
                <span style={{ color: "red" }}> {isEnabled}</span>
              ) : (
                <span style={{ color: "green" }}> {isEnabled}</span>
              )}
            </div>
            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
                marginBottom: "40px"
              }}
            >
              <Button type="primary" onClick={this._enableAuthenticator}>
                {" "}
                {!is_twofactor ? "ENABLE" : "DISABLE"} AUTHENTICATOR{" "}
              </Button>
            </div>
            {this.state.showQR == true ? (
              <div style={{ marginTop: "30px" }}>
                <Row>
                  <Col sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }}>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <div
                          style={{
                            height: "200px",
                            width: "200px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <img src={this.state.QRImage} />
                        </div>
                      </div>
                      <div>16 Digit Key</div>
                      <div>{QRKey}</div>
                    </div>
                  </Col>
                  <Col sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }}>
                    <ul style={{ listStyleType: "lower-roman" }}>
                      <li>
                        Install an authenticator app on your mobile device. We
                        suggest Google Authenticator.{" "}
                      </li>
                      <li>
                        Scan the QR code when prompted by your Authenticator.
                      </li>
                      <li>
                        In case your phone gets stolen or erased, you will need
                        this code to link FALDAX with a new app.
                      </li>
                      <li>
                        Do not share the code with anyone. FALDAX will never ask
                        you for this code.
                      </li>
                    </ul>
                    <div>
                      <span>Enter your 2FA code here:</span>
                      <div style={{ marginTop: "20px" }}>
                        <Input
                          style={{ width: "200px" }}
                          value={fields["otp"]}
                          onChange={this._onChangeFields.bind(this, "otp")}
                        />
                      </div>
                      <div class="error-danger">
                        {this.twoFaValidator.message(
                          "otp",
                          fields["otp"],
                          "required|min:6|max:6",
                          "error-danger"
                        )}
                      </div>
                      <span className="MSG_OTP">{this.state.otp_msg}</span>
                    </div>
                    <Button
                      style={{ marginTop: "20px", marginBottom: "20px" }}
                      type="primary"
                      onClick={this._verifyOtp.bind(this)}
                    >
                      ENABLE
                    </Button>
                  </Col>
                </Row>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div>
          <Divider>Whitelist IP Address</Divider>
          <ProfileWhitelist />
        </div>
        {loader && <FaldaxLoader />}
        {show2FAModal && <TwoFactorModal callback={this._enable2FA} title="Disable 2FA" onClose={()=>this.setState({show2FAModal:false})}/>}
      </div>
    );
  }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user'),
    }),
    { login, logout }
)(EditProfile);
