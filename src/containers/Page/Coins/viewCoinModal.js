import React, { Component } from 'react';
import { Modal, Button } from 'antd';

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
                footer={[
                    <Button onClick={this._closeViewCoinModal}>OK</Button>,
                ]}
            >

                <span> <b>Coin Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.coin_name}
                </p>

                <span> <b>Coin Code:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.coin_code}
                </p>

                <span> <b>Limit:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.limit}
                </p>

                <span> <b>Description:</b> </span>
                <p style={{ "marginBottom": "15px" }}
                    dangerouslySetInnerHTML={{ __html: coinDetails.description }} />

                <span> <b>Wallet Address:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinDetails.wallet_address}
                </p>

            </Modal>
        );
    }
}

export default ViewCoinModal;
