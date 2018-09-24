import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Icon, Spin } from 'antd';
import IntlMessages from '../../components/utility/intlMessages';
import ForgotPasswordStyleWrapper from './forgotPassword.style';
import SimpleReactValidator from 'simple-react-validator';

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

  _forgotPassword = () => {
    this.setState({ loader: true });

    if (this.validator.allValid()) {
      //api call
      this.setState({ loader: false });
      this.props.history.push('/signin');
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
                <Input size="large" placeholder="Email" />
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
