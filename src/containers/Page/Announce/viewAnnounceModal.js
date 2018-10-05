import React, { Component } from 'react';
import { Modal } from 'antd';

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
                onOk={this._closeViewAnnounceModal}
            >
                <span> <b>Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {emailDetails.name}
                </p>

                <span> <b>Title:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {emailDetails.title}
                </p>

                <span> <b>Content:</b> </span>
                <p style={{ "marginBottom": "15px" }}
                    dangerouslySetInnerHTML={{ __html: emailDetails.content }} />
            </Modal >
        );
    }
}

export default ViewAnnounceEmail;
