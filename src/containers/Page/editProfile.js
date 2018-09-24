import React, { Component } from 'react';
import { Button, Input } from 'antd';
import ForgotPasswordStyleWrapper from './forgotPassword.style';

class EditProfile extends Component {
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
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </ForgotPasswordStyleWrapper>
        );
    }
}

export default EditProfile;
