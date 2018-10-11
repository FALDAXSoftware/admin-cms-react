import React, { Component } from 'react';
import { Modal } from 'antd';

class ViewBlogModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showViewBlogModal: this.props.showViewBlogModal,
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({ showViewBlogModal: nextProps.showViewBlogModal })
        }
    }

    _closeViewBlogModal = () => {
        this.setState({ showViewBlogModal: false })
        this.props.closeViewBlogModal();
    }

    render() {
        const { fields } = this.props;
        const { showViewBlogModal } = this.state;

        return (
            <Modal
                title="View Blog"
                visible={showViewBlogModal}
                onCancel={this._closeViewBlogModal}
                onOk={this._closeViewBlogModal}
            >
                <span> <b>Title:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {fields.title}
                </p>

                <span> <b>Author:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {fields.author}
                </p>

                <span> <b>Created On:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {fields.created_at}
                </p>

                <span> <b>Tags:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {fields.tags}
                </p>

                <span> <b>Description:</b> </span>
                <p style={{ "marginBottom": "15px" }}
                    dangerouslySetInnerHTML={{ __html: fields.description }} />

            </Modal>
        );
    }
}

export default ViewBlogModal;
