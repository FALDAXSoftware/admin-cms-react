import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Icon, Spin } from 'antd';
import IntlMessages from '../../components/utility/intlMessages';
import ResetPasswordStyleWrapper from './resetPassword.style';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../helpers/apiUtills';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      fields: {},
      errors: {}
    };
    this.validator = new SimpleReactValidator();
  }

  _onChangeFields(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  _resetPassword = () => {
    const { fields, errors } = this.state;
    this.setState({ loader: true });
    let _this = this;

    if (this.validator.allValid() && fields["newPwd"] === fields["confirmPwd"]) {
      let URLParam = this.props.location.pathname.split('/');
      let formData = {
        reset_token: URLParam[2],
        password: this.state.fields['confirmPwd']
      }

      ApiUtils.resetPassword(formData)
        .then((response) => response.json())
        .then(function (res) {
          if (res) {
            _this.setState({ errMsg: true, errMessage: 'password reset successfully', loader: false });
            _this.props.history.push('/signin');
          } else {
            _this.setState({ errMsg: true, errMessage: res.message, loader: false });
          }
        })
        .catch(err => {
          console.log('error occured', err);
          _this.setState({ loader: false });
        });
    } else {
      if (fields["newPwd"] !== fields["confirmPwd"]) {
        this.state.errors["main"] = "Confirm Password doesn't match";
        this.setState({ errors, loader: false })
      }
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  render() {
    const { loader, fields, errors } = this.state;

    return (
      <ResetPasswordStyleWrapper className="isoResetPassPage">
        <div className="isoFormContentWrapper">
          <div className="isoFormContent">
            <div className="isoLogoWrapper">
              <Link to="/dashboard">
                <IntlMessages id="page.resetPassTitle" />
              </Link>
            </div>

            <div className="isoFormHeadText">
              <h3>
                <IntlMessages id="page.resetPassSubTitle" />
              </h3>
              <p>
                <IntlMessages id="page.resetPassDescription" />
              </p>
            </div>

            <div className="isoResetPassForm">
              <div className="isoInputWrapper">
                <Input
                  size="large"
                  type="password"
                  placeholder="New Password"
                  onChange={this._onChangeFields.bind(this, "newPwd")}
                  value={fields["newPwd"]}
                />
                <span style={{ "color": "red" }}>
                  {this.validator.message('New Password', fields["newPwd"], 'required', 'text-danger')}
                </span>
              </div>

              <div className="isoInputWrapper">
                <Input
                  size="large"
                  type="password"
                  placeholder="Confirm Password"
                  onChange={this._onChangeFields.bind(this, "confirmPwd")}
                  value={fields["confirmPwd"]}
                />
                <span style={{ "color": "red" }}>
                  {errors["main"]}
                </span>
              </div>

              <div className="isoInputWrapper">
                <Button type="primary" onClick={this._resetPassword}>
                  <IntlMessages id="page.resetPassSave" />
                </Button>
              </div>

              <div className="isoCenterComponent isoHelperWrapper">
                <Link to="/signin" className="isoForgotPass">
                  <IntlMessages id="page.signInButton" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ResetPasswordStyleWrapper>
    );
  }
}
