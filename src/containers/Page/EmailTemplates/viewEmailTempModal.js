import React, { Component } from 'react';
import { Modal } from 'antd';

class ViewEmailTempModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showViewTempModal: this.props.showViewTempModal,
        }
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.showViewTempModal !== prevState.showViewTempModal) {
            return {
                showViewTempModal: nextProps.showViewTempModal
            }
        }
        return null;
    }

    _closeViewTempModal = () => {
        this.setState({ showViewTempModal: false })
        this.props.closeViewModal();
    }

    render() {
        const { templateDetails } = this.props;
        const { showViewTempModal } = this.state;

        return (
            <Modal
                title="View Email Template"
                visible={showViewTempModal}
                onCancel={this._closeViewTempModal}
                onOk={this._closeViewTempModal}
            >
                <span> <b>Template Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {templateDetails.name}
                </p>

                <span> <b>Title:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {templateDetails.title}
                </p>

                <span> <b>Content:</b> </span>
                <p style={{ "marginBottom": "15px" }}
                    dangerouslySetInnerHTML={{ __html: templateDetails.content }} />
            </Modal >
        );
    }
}

export default ViewEmailTempModal;
