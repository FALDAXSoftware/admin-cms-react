import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Form, notification } from "antd";
import IntlMessages from "../../components/utility/intlMessages";
import ResetPasswordStyleWrapper from "./resetPassword.style";
import SimpleReactValidator from "simple-react-validator";
import ApiUtils from "../../helpers/apiUtills";
import logo from "../../image/Footer_logo.png";
import FaldaxLoader from "../Page/faldaxLoader";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      fields: {},
      errors: {},
      errMessage: "",
      errMsg: false,
      errType: "Success",
      formSubmitted:false
    };
    this.validator = new SimpleReactValidator();
  }

  _onChangeFields(field, e) {
    let {fields,formSubmitted} = this.state;
    if (e.target.value.trim() == "") {
      fields[field] = "";
    } else {
      fields[field] = e.target.value;
    }
    if (field == "confirmPwd" && e.target.value==fields["newPwd"]) 
    {
      this.setState({ errors: {} });
    }else if(formSubmitted && fields["newPwd"]){
      this.setState({errors:{"main":"New Password and Confirm Password doesn't match."}}) 
    }
    this.setState({ fields });
  }

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  resetPassword = e => {
    try {
      this.setState({formSubmitted:true})
      e.preventDefault();
      const { fields, errors } = this.state;
      this.setState({ loader: true });
      if (
        this.validator.allValid() &&
        fields["newPwd"] === fields["confirmPwd"]
      ) {
        let URLParam = this.props.location.pathname.split("/");
        let formData = {
          reset_token: URLParam[2],
          password: this.state.fields["confirmPwd"]
        };
        ApiUtils.resetPassword(formData)
          .then(response => response.json())
          .then((res)=> {
            if (res.status == 200) {
              this.setState(
                {
                  errMsg: true,
                  errMessage: res.message,
                  loader: false
                },
                () => {
                  this.props.history.push("/signin");
                }
              );
            } else {
              this.setState(
                {
                  errMsg: true,
                  errMessage: res.message,
                  loader: false,
                  errType: "error"
                },
                () => {
                  this.props.history.push("/signin");
                }
              );
            }
          })
          .catch(err => {
            this.setState({
              errMsg: true,
              errMessage: err.err,
              loader: false
            });
          });
      } else {
        if (
          fields["newPwd"] !== fields["confirmPwd"] &&
          fields["confirmPwd"] != "" &&
          fields["confirmPwd"] != undefined
        ) {
          let {errors}=this.state;
          errors["main"] =
            "New Password and Confirm Password doesn't match.";
        }
        this.setState({ errors, loader: false });
        this.validator.showMessages();
        this.forceUpdate();
      }
    } catch (error) {
      this.setState({
        errMsg: true,
        errMessage:  "Unable to complete the requested action.",
        loader: false
      });
    }
  };

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
                <img alt="reset password" src={logo} />
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
              <Form onSubmit={this.resetPassword}>
                <div className="isoInputWrapper">
                  <Input
                    size="large"
                    type="password"
                    placeholder="New Password"
                    onChange={this._onChangeFields.bind(this, "newPwd")}
                    value={fields["newPwd"]}
                  />
                  <span style={{ color: "red" }}>
                    {this.validator.message(
                      "New Password",
                      fields["newPwd"],
                      "required",
                      "text-danger"
                    )}
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
                  <span style={{ color: "red" }}>
                    {this.validator.message(
                      "Confirm Password",
                      fields["confirmPwd"],
                      "required",
                      "text-danger"
                    )}
                    {errors["main"]}
                  </span>
                </div>

                <div className="isoInputWrapper">
                  <Button
                   htmlType='submit' type="primary"
                  >
                    <IntlMessages id="page.resetPassSave" />
                  </Button>
                </div>
                </Form>
                {loader && <FaldaxLoader isSignUpPage={true}/>}
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
