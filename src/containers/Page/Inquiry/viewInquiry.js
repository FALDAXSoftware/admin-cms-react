import React, { Component } from 'react';
import { Modal, Button } from 'antd';

class ViewInquiryModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showViewInquiryModal: this.props.showViewInquiryModal,
        }
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.showViewInquiryModal !== prevState.showViewInquiryModal) {
            return {
                showViewInquiryModal: nextProps.showViewInquiryModal
            }
        }
        return null;
    }

    _closeViewInquiryModal = () => {
        this.setState({ showViewInquiryModal: false })
        this.props.closeViewInquiryModal();
    }

    render() {
        const { inquiryDetails } = this.props;
        const { showViewInquiryModal } = this.state;

        return (
            <Modal
                title="View Inquiry"
                visible={showViewInquiryModal}
                onCancel={this._closeViewInquiryModal}
                footer={[
                    <Button onClick={this._closeViewInquiryModal}>OK</Button>,
                ]}
            >
                <span> <b>First Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {inquiryDetails.first_name ? inquiryDetails.first_name : 'NA'}
                </p>

                <span> <b>Last Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {inquiryDetails.last_name ? inquiryDetails.last_name : 'NA'}
                </p>

                <span> <b>Email:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {inquiryDetails.email ? inquiryDetails.email : 'NA'}
                </p>

                <span> <b>Message:</b> </span>
                <p style={{ "marginBottom": "15px" }}
                    dangerouslySetInnerHTML={{
                        __html: inquiryDetails.message ?
                            inquiryDetails.message : 'NA'
                    }} />
            </Modal>
        );
    }
}

export default ViewInquiryModal;
