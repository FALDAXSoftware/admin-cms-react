import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import moment from 'moment';
import { BUCKET_URL } from '../../../helpers/globals';

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
                footer={[
                    <Button onClick={this._closeViewBlogModal}>OK</Button>,
                ]}
            >
                {fields.cover_image ?
                    <img style={{ width: '40px', height: '40px' }}
                        src={BUCKET_URL + fields.cover_image} /> : 'NA'}
                <br /><br />

                <span> <b>Title:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {fields.title ? fields.title : 'NA'}
                </p>

                <span> <b>Author:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {fields.admin_name ? fields.admin_name : 'NA'}
                </p>

                <span> <b>Created On:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {fields.created_at ? moment(fields.created_at).format("DD MMM, YYYY") : 'NA'}
                </p>

                <span> <b>Tags:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {fields.tags ? fields.tags : 'NA'}
                </p>

                <span> <b>Description:</b> </span>
                <p style={{ "marginBottom": "15px" }}
                    dangerouslySetInnerHTML={{ __html: fields.description ? fields.description : 'NA' }} />

            </Modal>
        );
    }
}

export default ViewBlogModal;
