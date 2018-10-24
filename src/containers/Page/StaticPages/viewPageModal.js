import React, { Component } from 'react';
import { Modal, Button } from 'antd';

class ViewPageModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showViewPageModal: this.props.showViewPageModal,
        }
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.showViewPageModal !== prevState.showViewPageModal) {
            return {
                showViewPageModal: nextProps.showViewPageModal
            }
        }
        return null;
    }

    _closeViewPageModal = () => {
        this.setState({ showViewPageModal: false })
        this.props.closeViewModal();
    }

    render() {
        const { staticPagesDetails } = this.props;
        const { showViewPageModal } = this.state;

        return (
            <Modal
                title="View Page"
                visible={showViewPageModal}
                footer={[
                    <Button onClick={this._closeViewPageModal}>OK</Button>,
                ]}
            >

                <span> <b>Page Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {staticPagesDetails.name}
                </p>

                <span> <b>Title:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {staticPagesDetails.title}
                </p>

                <span> <b>Content:</b> </span>
                <p style={{ "marginBottom": "15px" }}
                    dangerouslySetInnerHTML={{ __html: staticPagesDetails.content }} />
            </Modal >
        );
    }
}

export default ViewPageModal;
