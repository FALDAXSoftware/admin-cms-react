import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Divider } from 'antd';
import authAction from '../../../redux/auth/actions';
import DetailDiv from './detailDiv';

const { logout } = authAction;

class UserKYCDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            kycDetails: {},
        }
    }

    componentDidMount = () => {
        const { token, user_id } = this.props;
        let _this = this;

        ApiUtils.getKYCDetails(token, user_id)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ kycDetails: res.data });
                } else if (res.status == 403) {
                    _this.props.logout();
                } else {
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
            <div className="kyc-div user-profile">
                {kycDetails && Object.entries(kycDetails).length != 0 ?
                    <div>
                        <Divider>Customer ID Verification</Divider>
                        <DetailDiv title="Status"
                            value={kycDetails && kycDetails.is_approve != undefined && kycDetails.is_approve ? 'APPROVED' :(kycDetails.direct_response?'DIS-APPROVED':'PENDING-APPROVAL')} />
                        <Divider>IDM Details</Divider>
                        <DetailDiv title="Direct Response"
                            value={kycDetails && kycDetails.direct_response ? kycDetails.direct_response : 'N/A'} />
                        <DetailDiv title="Webhook Response"
                            value={kycDetails && kycDetails.webhook_response ? kycDetails.webhook_response : 'N/A'} />
                        <DetailDiv title="Customer ID Details"
                            value={kycDetails && kycDetails.kyc_doc_details ? kycDetails.kyc_doc_details : 'N/A'} />
                        <DetailDiv title="Comments"
                            value={kycDetails && kycDetails.comments ? kycDetails.comments : 'N/A'} />
                    </div>
                    : <h2 style={{ textAlign: 'center', width: '100 %' }}>Customer id not submitted</h2>
                }
            </div >
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(UserKYCDetails);
