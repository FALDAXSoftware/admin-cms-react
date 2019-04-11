import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { BUCKET_URL } from '../../../helpers/globals';

class ViewCoinModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showViewCoinModal: this.props.showViewCoinModal,
        }
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.showViewCoinModal !== prevState.showViewCoinModal) {
            return {
                showViewCoinModal: nextProps.showViewCoinModal
            }
        }
        return null;
    }

    _closeViewCoinModal = () => {
        this.setState({ showViewCoinModal: false })
        this.props.closeViewCoinModal();
    }

    render() {
        const { coinDetails } = this.props;
        const { showViewCoinModal } = this.state;

        return (
            <Modal
                title="View Coin"
                visible={showViewCoinModal}
                onCancel={this._closeViewCoinModal}
                footer={[
                    <Button onClick={this._closeViewCoinModal}>OK</Button>,
                ]}
            >
                {coinDetails.coin_icon ?
                    <img style={{ width: '40px', height: '40px' }}
                        src={BUCKET_URL + coinDetails.coin_icon} /> : ''}
                <br /><br />

                <span> <b>Coin Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.coin_name ? coinDetails.coin_name : 'N/A'}
                </p>

                <span> <b>Coin Code:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.coin_code ? coinDetails.coin_code : 'N/A'}
                </p>

                <span> <b>Minimum Limit:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.min_limit ? coinDetails.min_limit : 'N/A'}
                </p>

                <span> <b>Maximum Limit:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.max_limit ? coinDetails.max_limit : 'N/A'}
                </p>

                {/* <span> <b>Description:</b> </span>
                <p style={{ "marginBottom": "15px" }}
                    dangerouslySetInnerHTML={{ __html: coinDetails.description ? coinDetails.description : 'N/A' }} /> */}

                <span> <b>Wallet Address:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.wallet_address ? coinDetails.wallet_address : 'N/A'}
                </p>
            </Modal>
        );
    }
}

export default ViewCoinModal;
