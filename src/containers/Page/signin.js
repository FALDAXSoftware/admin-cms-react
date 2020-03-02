import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Input, Form, notification } from 'antd';
import authAction from '../../redux/auth/actions';
import IntlMessages from '../../components/utility/intlMessages';
import SignInStyleWrapper from './signin.style';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../helpers/apiUtills';
import logo from '../../image/Footer_logo.png';
import FaldaxLoader from '../Page/faldaxLoader';

const { login, storeToken, checkRoles } = authAction;

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      fields: {},
      errMsg: false,
      errMessage: '',
      redirect: false,
      isOtpRequired: false,
    };
    this.validator = new SimpleReactValidator();
  }

  openNotificationWithIconError = (type) => {
    notification[type]({
      message: 'Error',
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

  _handleLogin = (e) => {
    e.preventDefault();
    const { login, storeToken, checkRoles } = this.props;
    const { fields } = this.state;
    let _this = this;

    this.setState({ loader: true });

    if (this.validator.allValid()) {
      let formData = {
        email: fields["email"],
        password: fields["password"],
        otp: fields["otp"]
      };

      ApiUtils.adminSignIn(formData)
        .then((response) => response.json())
        .then(function (res) {
          if (res.user) {
            _this.setState({ loader: false, redirect: true });
            login({ user: res.user });
            storeToken({ token: res.token });
            checkRoles({ roles: res.user.roles })
            if (res.user.roleAllowedData.length > 0) {
              _this.props.history.push('/dashboard');
            } else {
              _this.props.history.push('/403');
            }
          } else if (res.status == 201) {
            _this.setState({ isOtpRequired: true, loader: false });
          } else if (res.status == 402) {
            _this.setState({ errMsg: true, errMessage: res.err, loader: false });
          } else if (res.status == 403) {
            _this.setState({ errMsg: true, errMessage: res.err, loader: false });
          } else {
            _this.setState({ errMsg: true, errMessage: res.err, loader: false });
            login({ user: null });
          }
        })
        .catch(err => {
          _this.setState({ loader: false, errMsg: true, errMessage: 'Unable to complete the requested action.' });
        });
    } else {
      this.setState({ loader: false });
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  render() {
    const path = { pathname: '/dashboard' };
    const { loader, errMsg, redirect } = this.state;

    if (errMsg) {
      this.openNotificationWithIconError('error');
    }

    if (redirect === true) {
      return <Redirect to={path} />;
    }

    return (
      <SignInStyleWrapper className="isoSignInPage">
        <div className="isoLoginContentWrapper">
          <div className="isoLoginContent">
            <div className="isoLogoWrapper">
                <img src={logo} alt="signin"/>
            </div>
            <div className="isoSignInForm">
            <Form onSubmit={this._handleLogin}>
              <div className="isoInputWrapper">
                <Input size="large" placeholder="Email ID" onChange={this._onChangeFields.bind(this, "email")} />
                <span className="field-error">
                  {this.validator.message('Email', this.state.fields['email'], 'required|email')}
                </span>
              </div>

              <div className="isoInputWrapper">
                <Input.Password size="large"  placeholder="Password" onChange={this._onChangeFields.bind(this, "password")} />
                <span className="field-error">
                  {this.validator.message('Password', this.state.fields['password'], 'required')}
                </span>
              </div>

              {this.state.isOtpRequired &&
                <div className="isoInputWrapper">
                  <span>2FA is enabled for this account. Please enter your 2FA code below to proceed.</span>
                  <div>
                    <Input size="large" type="text" placeholder="OTP" onChange={this._onChangeFields.bind(this, "otp")} />
                    {this.validator.message('OTP', this.state.fields['otp'], 'required|numeric')}
                  </div>
                  <span className="otp_msg">{this.state.otp_msg}</span>
                </div>
              }

              <div className="isoInputWrapper isoLeftRightComponent">
                {/* <Checkbox>
                  <IntlMessages id="page.signInRememberMe" />
                </Checkbox> */}
                <Button htmlType="submit" type="primary">
                  <IntlMessages id="page.signInButton" />
                </Button>
              </div>

            </Form>
              <div className="isoCenterComponent isoHelperWrapper">
                <Link to="/forgot-password" className="signin-link">
                  <IntlMessages id="page.signInForgotPass" />
                </Link>
              </div>
              {loader && <FaldaxLoader isSignUpPage={true}/>}
            </div>
          </div>
        </div>
      </SignInStyleWrapper>
    );
  }
}

export default connect(
  state => ({
    isLoggedIn: state.Auth.get('token') !== null ? true : false,
    user: state.Auth.get('user'),
  }),
  { login, storeToken, checkRoles }
)(SignIn);
