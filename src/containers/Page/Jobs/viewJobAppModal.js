import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { BUCKET_URL } from '../../../helpers/globals';

class ViewJobAppModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showViewJobAppModal: this.props.showViewJobAppModal,
        }
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.showViewJobAppModal !== prevState.showViewJobAppModal) {
            return {
                showViewJobAppModal: nextProps.showViewJobAppModal
            }
        }
        return null;
    }

    _closeViewJobAppModal = () => {
        this.setState({ showViewJobAppModal: false })
        this.props.closeViewJobAppModal();
    }

    render() {
        const { applicationDetails } = this.props;
        const { showViewJobAppModal } = this.state;

        return (
            <Modal
                title="View Job Applicant"
                visible={showViewJobAppModal}
                onCancel={this._closeViewJobAppModal}
                footer={[
                    <Button onClick={this._closeViewJobAppModal}>OK</Button>,
                ]}
            >
                <span> <b>First Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {applicationDetails.first_name ? applicationDetails.first_name : 'N/A'}
                </p>

                <span> <b>Last Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {applicationDetails.last_name ? applicationDetails.last_name : 'N/A'}
                </p>

                <span> <b>Email:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {applicationDetails.email ? applicationDetails.email : 'N/A'}
                </p>

                <span> <b>Phone Number:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {applicationDetails.phone_number ? applicationDetails.phone_number : 'N/A'}
                </p>

                <span> <b>LinkedIn Profile:</b> </span>
                <a style={{ "marginBottom": "15px" }} href={applicationDetails.linkedin_profile ? applicationDetails.linkedin_profile : '#'} target="_blank">
                    {applicationDetails.linkedin_profile ? applicationDetails.linkedin_profile : ''}
                </a>
                <br />

                <span> <b>Website URL:</b> </span>
                <a style={{ "marginBottom": "15px" }} href={applicationDetails.website_url ? applicationDetails.website_url : '#'} target="_blank" >
                    {applicationDetails.website_url ? applicationDetails.website_url : ''}
                </a>
                <br />

                <span> <b>Resume:</b> </span>
                {applicationDetails.resume ?
                    <a target="_blank" href={BUCKET_URL + applicationDetails.resume}>View Resume</a> : 'N/A'}
                <br />

                <span> <b>Cover Letter:</b> </span>
                {applicationDetails.cover_letter ?
                    <a target="_blank" href={BUCKET_URL + applicationDetails.cover_letter}>View Cover Letter</a> : 'N/A'}
            </Modal>
        );
    }
}

export default ViewJobAppModal;
