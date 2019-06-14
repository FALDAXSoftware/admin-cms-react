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
                title="View Asset"
                visible={showViewCoinModal}
                onCancel={this._closeViewCoinModal}
                footer={[
                    <Button onClick={this._closeViewCoinModal}>OK</Button>,
                ]}
            >
                <img style={{ width: '40px', height: '40px' }}
                    src={coinDetails.coin_icon ? BUCKET_URL + coinDetails.coin_icon : BUCKET_URL + 'coin/defualt_coin.png'} />
                <br /><br />

                <span> <b>Asset Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.coin_name ? coinDetails.coin_name : 'N/A'}
                </p>

                <span> <b>Asset Code:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.coin_code ? coinDetails.coin_code : 'N/A'}
                </p>

                <span> <b>Is Asset ERC Token?:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.isERC ? 'YES' : 'NO'}
                </p>

                <span> <b>Minimum Limit:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.min_limit ? coinDetails.min_limit : 'N/A'}
                </p>

                <span> <b>Maximum Limit:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.max_limit ? coinDetails.max_limit : 'N/A'}
                </p>

                <span> <b>Warm Wallet Address:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.warm_wallet_address ? coinDetails.warm_wallet_address : 'N/A'}
                </p>

                <span> <b>Hot Send Wallet Address: </b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.hot_send_wallet_address ? coinDetails.hot_send_wallet_address : 'N/A'}
                </p>

                <span> <b>Hot Receive Wallet Address:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.hot_receive_wallet_address ? coinDetails.hot_receive_wallet_address : 'N/A'}
                </p>

                <span> <b>Custody Wallet Address:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.custody_wallet_address ? coinDetails.custody_wallet_address : 'N/A'}
                </p>
            </Modal>
        );
    }
}

export default ViewCoinModal;
