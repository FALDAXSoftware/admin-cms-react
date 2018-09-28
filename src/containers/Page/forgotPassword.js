import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Icon, Spin } from 'antd';
import IntlMessages from '../../components/utility/intlMessages';
import ForgotPasswordStyleWrapper from './forgotPassword.style';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../helpers/apiUtills';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      fields: {}
    };
    this.validator = new SimpleReactValidator();
  }

  _onChangeFields(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  _forgotPassword = () => {
    this.setState({ loader: true });
    let _this = this;

    if (this.validator.allValid()) {
      let formData = {
        email: this.state.fields['email']
      }

      ApiUtils.forgotPassword(formData)
        .then((response) => response.json())
        .then(function (res) {
          if (res) {
            _this.setState({ errMsg: true, errMessage: 'email sent successfully', loader: false });
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
      this.setState({ loader: false });
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  render() {
    const { loader } = this.state;

    return (
      <ForgotPasswordStyleWrapper className="isoForgotPassPage">
        <div className="isoFormContentWrapper">
          <div className="isoFormContent">
            <div className="isoLogoWrapper">
              <Link to="/dashboard">
                <IntlMessages id="page.forgetPassTitle" />
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
