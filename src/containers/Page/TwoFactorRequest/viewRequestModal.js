import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import styled from 'styled-components';
import { BUCKET_URL } from '../../../helpers/globals';

const RequestImg = styled.img`
    height: 160px;
    width: 160px;
`

class ViewRequestModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showViewRequestModal: this.props.showViewRequestModal,
        }
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.showViewRequestModal !== prevState.showViewRequestModal) {
            return {
                showViewRequestModal: nextProps.showViewRequestModal
            }
        }
        return null;
    }

    _closeViewRequestModal = () => {
        this.setState({ showViewRequestModal: false })
        this.props.closeViewRequestModal();
    }

    render() {
        const { twoFactorReqDetails } = this.props;
        const { showViewRequestModal } = this.state;

        return (
            <Modal
                title="View Two Factor Request"
                visible={showViewRequestModal}
                onCancel={this._closeViewRequestModal}
                footer={[
                    <Button onClick={this._closeViewRequestModal}>OK</Button>,
                ]}
            >
                <span> <b>Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {twoFactorReqDetails.full_name ? twoFactorReqDetails.full_name : 'N/A'}
                </p>

                {twoFactorReqDetails.uploaded_file && twoFactorReqDetails.status == "open" ?
                    <div>
                        <span><b>Uploaded Image:</b> </span><br />
                        <RequestImg alt="" src={BUCKET_URL + twoFactorReqDetails.uploaded_file} />
                    </div>
                    : ''}

                {twoFactorReqDetails.reason ?
                    <div>
                        <span><b>Reason:</b> </span><br />
                        <p style={{ "marginBottom": "15px" }}>{twoFactorReqDetails.reason}</p>
                    </div> : ''}
            </Modal>
        );
    }
}

export default ViewRequestModal;
