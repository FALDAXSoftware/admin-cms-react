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
                onCancel={this._closeViewPageModal}
                footer={[
                    <Button onClick={this._closeViewPageModal}>OK</Button>,
                ]}
            >
                <span> <b>Page Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {staticPagesDetails.name ? staticPagesDetails.name : 'NA'}
                </p>

                <span> <b>Title:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {staticPagesDetails.title ? staticPagesDetails.title : 'Na'}
                </p>

                <span> <b>Content:</b> </span>
                <p style={{ "marginBottom": "15px" }} className="descriptionContainer"
                    dangerouslySetInnerHTML={{
                        __html:
                            staticPagesDetails.content ? staticPagesDetails.content : 'NA'
                    }} />
            </Modal >
        );
    }
}

export default ViewPageModal;
