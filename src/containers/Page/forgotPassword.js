import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Icon, Spin, notification } from 'antd';
import IntlMessages from '../../components/utility/intlMessages';
import ForgotPasswordStyleWrapper from './forgotPassword.style';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../helpers/apiUtills';
import logo from '../../image/Footer_logo.png';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      fields: {},
      errType: 'Success'
    };
    this.validator = new SimpleReactValidator();
  }

  _onChangeFields(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  openNotificationWithIconError = (type) => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _forgotPassword = () => {
    this.setState({ loader: true });
    let _this = this;

    if (this.validator.allValid()) {
      let formData = {
        email: this.state.fields['email']
      }

      ApiUtils.forgotPassword(formData)
        .then((response) => response.json())
        .then((res) => {
          if (!res.err) {
            _this.setState({
              errMsg: true, errMessage: res.message, loader: false, errType: 'Success'
            });
            _this.props.history.push('/signin');
          } else {
            _this.setState({ errMsg: true, errMessage: res.err, loader: false, errType: 'error' });
          }
        })
        .catch(() => {
          _this.setState({ loader: false });
        });
    } else {
      this.setState({ loader: false });
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  render() {
    const { loader, errMsg, errType } = this.state;

    if (errMsg) {
      this.openNotificationWithIconError(errType);
    }

    return (
      <ForgotPasswordStyleWrapper className="isoForgotPassPage">
        <div className="isoFormContentWrapper">
          <div className="isoFormContent">
            <div className="isoLogoWrapper">
              <Link to="/dashboard">
                <img src={logo} />
              </Link>
            </div>

            <div className="isoFormHeadText">
              <h3>
                <IntlMessages id="page.forgetPassSubTitle" />
              </h3>
              <p>
                <IntlMessages id="page.forgetPassDescription" />
              </p>
            </div>

            <div className="isoForgotPassForm">
              <div className="isoInputWrapper">
                <Input size="large" placeholder="Email" onChange={this._onChangeFields.bind(this, "email")} value={this.state.fields["email"]} />
                <span className="field-error">
                  {this.validator.message('Email', this.state.fields['email'], 'required|email')}
                </span>
              </div>

              <div className="isoInputWrapper">
                <Button type="primary" onClick={this._forgotPassword}>
                  <IntlMessages id="page.sendRequest" />
                </Button>
              </div>

              {loader && <Spin indicator={loaderIcon} />}

              <div className="isoCenterComponent isoHelperWrapper">
                <Link to="/signin" className="isoForgotPass">
                  <IntlMessages id="page.signInButton" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </ForgotPasswordStyleWrapper>
    );
  }
}
