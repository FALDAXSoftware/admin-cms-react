import React, { Component } from 'react';
import { Modal, Button } from 'antd';

class ViewJobModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showViewJobModal: this.props.showViewJobModal,
        }
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.showViewJobModal !== prevState.showViewJobModal) {
            return {
                showViewJobModal: nextProps.showViewJobModal
            }
        }
        return null;
    }

    _closeViewJobModal = () => {
        this.setState({ showViewJobModal: false })
        this.props.closeViewJobModal();
    }

    render() {
        const { jobDetails } = this.props;
        const { showViewJobModal } = this.state;

        return (
            <Modal
                title="View Job"
                visible={showViewJobModal}
                onCancel={this._closeViewJobModal}
                footer={[
                    <Button onClick={this._closeViewJobModal}>OK</Button>,
                ]}
            >
                <span> <b>Position:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {jobDetails.position ? jobDetails.position : 'NA'}
                </p>

                <span> <b>Short Description:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {jobDetails.short_desc ? jobDetails.short_desc : 'NA'}
                </p>

                <span> <b>Location:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {jobDetails.location ? jobDetails.location : 'NA'}
                </p>

                <span> <b>Job Description:</b> </span>
                <p style={{ "marginBottom": "15px" }}
                    dangerouslySetInnerHTML={{ __html: jobDetails.job_desc ? jobDetails.job_desc : 'NA' }} />
            </Modal>
        );
    }
}

export default ViewJobModal;
