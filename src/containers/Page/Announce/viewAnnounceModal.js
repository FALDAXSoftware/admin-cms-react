import React, { Component } from 'react';
import { Modal, Button } from 'antd';

class ViewAnnounceEmail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showViewAnnounceModal: this.props.showViewAnnounceModal,
        }
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.showViewAnnounceModal !== prevState.showViewAnnounceModal) {
            return {
                showViewAnnounceModal: nextProps.showViewAnnounceModal
            }
        }
        return null;
    }

    _closeViewAnnounceModal = () => {
        this.setState({ showViewAnnounceModal: false })
        this.props.closeViewModal();
    }

    render() {
        const { emailDetails } = this.props;
        const { showViewAnnounceModal } = this.state;

        return (
            <Modal
                title="View Announcement"
                visible={showViewAnnounceModal}
                onCancel={this._closeViewAnnounceModal}
                footer={[
                    <Button onClick={this._closeViewAnnounceModal}>OK</Button>,
                ]}
            >
                <span> <b>Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {emailDetails.name ? emailDetails.name : 'NA'}
                </p>

                <span> <b>Title:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {emailDetails.title ? emailDetails.title : 'NA'}
                </p>

                <span> <b>Content:</b> </span>
                <p style={{ "marginBottom": "15px" }}
                    dangerouslySetInnerHTML={{ __html: emailDetails.content ? emailDetails.content : 'NA' }} />
            </Modal >
        );
    }
}

export default ViewAnnounceEmail;
