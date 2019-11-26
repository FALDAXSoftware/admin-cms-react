import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, notification } from 'antd';
import IntlMessages from '../../components/utility/intlMessages';
import ResetPasswordStyleWrapper from './resetPassword.style';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../helpers/apiUtills';
import logo from '../../image/Footer_logo.png';
import FaldaxLoader from '../Page/faldaxLoader';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      fields: {},
      errors: {},
      errMessage: '',
      errMsg: false,
      errType: 'Success',
    };
    this.validator = new SimpleReactValidator();
  }

  _onChangeFields(field, e) {
    let fields = this.state.fields;
    if (e.target.value.trim() == "") {
      fields[field] = "";
    } else {
      fields[field] = e.target.value;
    }
    if (field == "confirmPwd" && (e.target.value.trim() == "" || e.target.value == undefined)) {
      this.setState({ errors: {} });
    }
    this.setState({ fields });
  }

  openNotificationWithIconError = (type) => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _resetPassword = () => {
    try{
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
            if (res.status == 200) {
              _this.setState({
                errMsg: true, errMessage: res.message, loader: false
              }, () => {
                _this.props.history.push('/signin');
              });
            } else {
              _this.setState({
                errMsg: true, errMessage: res.message,
                loader: false, errType: 'error'
              }, () => {
                _this.props.history.push('/signin');
              });
            }
          })
          .catch((err) => {
            _this.setState({ errMsg: true, errMessage: err.err, loader: false });
          });
      } else {
        if (fields["newPwd"] !== fields["confirmPwd"] && fields["confirmPwd"] != "" && fields["confirmPwd"] != undefined) {
          this.state.errors["main"] = "New Password and Confirm Password doesn't match.";
        }
        this.setState({ errors, loader: false })
        this.validator.showMessages();
        this.forceUpdate();
      }
    }catch(error){
      console.log("Error",error);
    }
  }

  render() {
    const { fields, errors, errMsg, errType, loader } = this.state;

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <ResetPasswordStyleWrapper className="isoResetPassPage">
        <div className="isoFormContentWrapper">
          <div className="isoFormContent">
            <div className="isoLogoWrapper">
              <Link to="/dashboard">
                <img src={logo} />
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
                  {this.validator.message('Confirm Password', fields["confirmPwd"], 'required', 'text-danger')}
                  {errors["main"]}
                </span>
              </div>

              <div className="isoInputWrapper">
                <Button type="primary" onClick={this._resetPassword}>
                  <IntlMessages id="page.resetPassSave" />
                </Button>
              </div>
              {loader && <FaldaxLoader />}
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
