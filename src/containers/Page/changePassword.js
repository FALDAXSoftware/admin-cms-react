import React, { Component } from 'react';
import { Button, Input } from 'antd';
import IntlMessages from '../../components/utility/intlMessages';
import ForgotPasswordStyleWrapper from './forgotPassword.style';

class ChangePassword extends Component {
    render() {
        return (
            <ForgotPasswordStyleWrapper className="isoForgotPassPage">
                <div className="isoFormContentWrapper">
                    <div className="isoFormContent">
                        <div className="isoForgotPassForm">
                            <div className="isoInputWrapper">
                                <Input size="large" placeholder="Password" />
                            </div>

                            <div className="isoInputWrapper">
                                <Button type="primary">
                                    <IntlMessages id="page.sendRequest" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </ForgotPasswordStyleWrapper>
        );
    }
}

export default ChangePassword;
