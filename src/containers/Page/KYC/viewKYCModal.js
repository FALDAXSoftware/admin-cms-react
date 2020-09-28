import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { BUCKET_URL } from "../../../helpers/globals";

class ViewKYCModal extends Component {
    constructor(props) {
        super(props)
        console.log("this.props.showViewKYCModal", this.props.showViewKYCModal)
        this.state = {
            showViewKYCModal: this.props.showViewKYCModal,
        }
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.showViewKYCModal !== prevState.showViewKYCModal) {
            return {
                showViewKYCModal: nextProps.showViewKYCModal
            }
        }
        return null;
    }

    _closeViewKYCModal = () => {
        this.setState({ showViewKYCModal: false })
        this.props.closeViewModal();
    }

    render() {
        const { kycDetails } = this.props;
        const { showViewKYCModal } = this.state;
        let idType = ''
        if (kycDetails.id_type == 1) {
            idType = "Passport"
        } else if (kycDetails.id_type == 2) {
            idType = "Driving Licence"
        } else if (kycDetails.id_type == 3) {
            idType = "Identity Mind API"
        } else {
            idType = ""
        }

        return (
            <Modal
                title="View Customer ID"
                visible={showViewKYCModal}
                onCancel={this._closeViewKYCModal}
                footer={[
                    <Button onClick={this._closeViewKYCModal}>OK</Button>,
                ]}
            >
                <span> <b>First Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {kycDetails.first_name ? kycDetails.first_name : 'N/A'}
                </p>

                <span> <b>Last Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {kycDetails.last_name ? kycDetails.last_name : 'N/A'}
                </p>

                <span> <b>Address:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {kycDetails.address ? kycDetails.address + ", " : ''}
                    {kycDetails.address_2 ? kycDetails.address_2 + ", " : ''}
                    {kycDetails.city ? kycDetails.city + ", " : ''}
                    {kycDetails.country ? kycDetails.country + ", " : ''}
                    {kycDetails.zip ? kycDetails.zip : ''}
                </p>
                <span> <b>Date of Birth:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {kycDetails.dob ? kycDetails.dob : 'N/A'}
                </p>

                {kycDetails.direct_response ?
                    <div>
                        <span> <b>Identity Mind Review:</b> </span>
                        <p style={{ "marginBottom": "15px" }}>
                            {kycDetails.direct_response}<br />
                            {kycDetails.comments ? kycDetails.comments : ''}
                        </p>
                    </div>
                    : ''}

                {kycDetails.webhook_response ?
                    <div>
                        <span> <b>Document Verification Review:</b> </span>
                        <p style={{ "marginBottom": "15px" }}>
                            {kycDetails.webhook_response} <br />
                            {kycDetails.kycDoc_details ? kycDetails.kycDoc_details : ''}
                        </p>
                    </div>
                    : ''}

                {idType != '' ?
                    <div>
                        <span> <b>Document Type:</b> </span>
                        <p style={{ "marginBottom": "15px" }}>
                            {idType}</p>
                    </div>
                    : ''}

                {kycDetails.front_doc &&
                    kycDetails.front_doc != null ? (
                        <div>
                            <span>
                                <b>Front Document:</b>{" "}
                            </span>
                            <br />
                            <a
                                href={BUCKET_URL + kycDetails.front_doc}
                                target="_blank"
                            >
                                <img
                                    style={{ maxWidth: "50%" }}
                                    alt=""
                                    src={BUCKET_URL + kycDetails.front_doc}
                                />
                            </a>
                        </div>
                    ) : (
                        ""
                    )}
                {kycDetails.back_doc &&
                    kycDetails.back_doc != null ? (
                        <div>
                            <span>
                                <b>Back Document:</b>{" "}
                            </span>
                            <br />
                            <a
                                href={BUCKET_URL + kycDetails.back_doc}
                                target="_blank"
                            >
                                <img
                                    style={{ maxWidth: "50%" }}
                                    alt=""
                                    src={BUCKET_URL + kycDetails.back_doc}
                                />
                            </a>
                        </div>
                    ) : (
                        ""
                    )}

                {kycDetails.ssn_number &&
                    kycDetails.ssn_number != null ? (
                        <div>
                            <span>
                                <b>Goverement Issued ID Number:</b>{" "}
                            </span>
                            <br />
                            <span>
                                {kycDetails.ssn_number}
                            </span>
                        </div>
                    ) : (
                        ""
                    )}

                {/* <span> <b>Date of Birth:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {kycDetails.dob ? kycDetails.dob : 'N/A'}
                </p> */}
            </Modal>
        );
    }
}

export default ViewKYCModal;
