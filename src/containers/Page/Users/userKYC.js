import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Divider } from 'antd';
import { BUCKET_URL } from '../../../helpers/globals';

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
                _this.setState({ kycDetails: res.data });
            })
            .catch((err) => {
                console.log(err)
            });
    }

    render() {
        const { kycDetails } = this.state;

        return (
            <div className="kyc-div user-profile">
                <Divider>KYC Information</Divider>
                <div className="">
                    <p style={{ "marginBottom": "10px" }}>
                        <span> <b>Status:</b> </span>
                        {kycDetails && kycDetails.isApprove !== undefined && kycDetails.isApprove ? 'APPROVED' : 'DIS-APPROVED'}
                    </p>

                    <p style={{ "marginBottom": "10px" }}>
                        <span> <b>Name:</b> </span>
                        {kycDetails && kycDetails.first_name ? kycDetails.last_name ? kycDetails.first_name + ' ' + kycDetails.last_name : kycDetails.first_name : 'N/A'}
                    </p>

                    <p style={{ "marginBottom": "10px" }}>
                        <span><b>Address: </b></span>
                        {kycDetails && kycDetails.address ? kycDetails.address2 ? kycDetails.address + kycDetails.address2 : kycDetails.address : 'N/A'}
                    </p>
                    {kycDetails && kycDetails.city_town ?
                        <p style={{ "marginBottom": "10px" }}>
                            {kycDetails.city_town}
                        </p> : ''}

                    {kycDetails && kycDetails.state ?
                        <p style={{ "marginBottom": "10px" }}>
                            {kycDetails.state}
                        </p> : ''}

                    {kycDetails && kycDetails.country ?
                        <p style={{ "marginBottom": "10px" }}>
                            {kycDetails.country}
                        </p> : ''}

                    <p style={{ "marginBottom": "10px" }}>
                        <span><b>Phone Number: </b></span>
                        {kycDetails && kycDetails.phone_number ? kycDetails.phone_number : 'N/A'}
                    </p>
                </div>
                <Divider>KYC Documents</Divider>
                <div>
                    <span><b>Front Document: </b></span>
                    <img src={kycDetails && kycDetails.front_doc ? BUCKET_URL + kycDetails.front_doc : ''} />
                </div>
                <div>
                    <span><b>Back Document: </b></span>
                    <img src={kycDetails && kycDetails.back_doc ? BUCKET_URL + kycDetails.back_doc : ''} />
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
            </div >
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(UserKYCDetails);
