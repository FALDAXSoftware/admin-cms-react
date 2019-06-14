import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Divider } from 'antd';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;

class UserKYCDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            kycDetails: [],
        }
    }

    componentDidMount = () => {
        const { token, user_id } = this.props;
        let _this = this;

        ApiUtils.getKYCDetails(token, user_id)
            .then((response) => response.json())
            .then(function (res) {
                console.log('res', res)
                if (res.status == 200) {
                    _this.setState({ kycDetails: res.data });
                } else if (res.status == 403) {
                    _this.props.logout();
                } else {
                    console.log('else', _this.state.kycDetails)
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch((err) => {
                console.log(err)
            });
    }

    render() {
        const { kycDetails } = this.state;

        return (
            <div className="kyc-div user-profile">{
                kycDetails && kycDetails.length > 0 ?
                    <div>
                        <Divider>KYC Information</Divider>
                        <div>
                            <p style={{ "marginBottom": "10px" }}>
                                <span> <b>Status:</b> </span>
                                {kycDetails && kycDetails.isApprove !== undefined && kycDetails.isApprove ? 'APPROVED' : 'DIS-APPROVED'}
                            </p>
                        </div>
                        <Divider>IDM Details</Divider>
                        <div>
                            <p ><span><b>Direct Response: </b></span>
                                {kycDetails && kycDetails.direct_response ? kycDetails.direct_response : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p ><span><b>Webhook Response: </b></span>
                                {kycDetails && kycDetails.webhook_response ? kycDetails.webhook_response : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p>
                                <span><b>KYC Document Details: </b></span>
                                {kycDetails && kycDetails.kycDoc_details ? kycDetails.kycDoc_details : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p > <span><b>Comments: </b></span>
                                {kycDetails && kycDetails.comments ? kycDetails.comments : 'N/A'}
                            </p>
                        </div>
                    </div>
                    : 'No KYC data'
            }
            </div >
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(UserKYCDetails);
