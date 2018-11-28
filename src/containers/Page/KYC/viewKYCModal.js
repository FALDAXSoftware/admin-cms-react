import React, { Component } from 'react';
import { Modal, Button } from 'antd';

class ViewKYCModal extends Component {
    constructor(props) {
        super(props)
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

        return (
            <Modal
                title="View KYC Application"
                visible={showViewKYCModal}
                onCancel={this._closeViewKYCModal}
                footer={[
                    <Button onClick={this._closeViewKYCModal}>OK</Button>,
                ]}
            >
                <span> <b>First Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {kycDetails.first_name ? kycDetails.first_name : 'NA'}
                </p>

                <span> <b>Last Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {kycDetails.last_name ? kycDetails.last_name : 'NA'}
                </p>

                <span> <b>Email:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {kycDetails.email ? kycDetails.email : 'NA'}
                </p>

                <span> <b>Direct Response:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {kycDetails.direct_response ? kycDetails.direct_response : 'NA'}
                </p>

                <span> <b>KYC document Details:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {kycDetails.kycDoc_details ? kycDetails.kycDoc_details : 'NA'}
                </p>
            </Modal>
        );
    }
}

export default ViewKYCModal;
