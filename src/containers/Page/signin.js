import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Input, Checkbox, Icon, Spin, notification } from 'antd';
import authAction from '../../redux/auth/actions';
import IntlMessages from '../../components/utility/intlMessages';
import SignInStyleWrapper from './signin.style';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../helpers/apiUtills';

const { login, storeToken } = authAction;
const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      fields: {},
      errMsg: false,
      errMessage: '',
      redirect: false
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
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  _handleLogin = () => {
    const { login, storeToken } = this.props;
    const { fields } = this.state;
    let _this = this;

    this.setState({ loader: true });

    if (this.validator.allValid()) {
      let formData = {
        email: fields["email"],
        password: fields["password"]
      };

      ApiUtils.adminSignIn(formData)
        .then((response) => response.json())
        .then(function (res) {
          if (res.user) {
            _this.setState({ loader: false, redirect: true });
            login({ user: res.user });
            storeToken({ token: res.token });
            _this.props.history.push('/dashboard');
          } else {
            _this.setState({ errMsg: true, errMessage: res.err, loader: false });
            login({ user: null });
          }
        })
        .catch(err => {
          console.log('err', err)
          _this.setState({ loader: false, errMsg: true, errMessage: 'Something went wrong!!' });
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
              <Link to="/dashboard">
                <IntlMessages id="page.signInTitle" />
              </Link>
            </div>

            <div className="isoSignInForm">
              <div className="isoInputWrapper">
                <Input size="large" placeholder="Email ID" onChange={this._onChangeFields.bind(this, "email")} />
                <span className="field-error">
                  {this.validator.message('Email', this.state.fields['email'], 'required|email')}
                </span>
              </div>

              <div className="isoInputWrapper">
                <Input size="large" type="password" placeholder="Password" onChange={this._onChangeFields.bind(this, "password")} />
                <span className="field-error">
                  {this.validator.message('Password', this.state.fields['password'], 'required')}
                </span>
              </div>

              <div className="isoInputWrapper isoLeftRightComponent">
                <Checkbox>
                  <IntlMessages id="page.signInRememberMe" />
                </Checkbox>
                <Button type="primary" onClick={this._handleLogin}>
                  <IntlMessages id="page.signInButton" />
                </Button>
              </div>

              <div className="isoCenterComponent isoHelperWrapper">
                <Link to="/forgot-password" className="isoForgotPass">
                  <IntlMessages id="page.signInForgotPass" />
                </Link>
              </div>

              {loader && <Spin indicator={loaderIcon} />}
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
  { login, storeToken }
)(SignIn);
