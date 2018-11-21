import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import moment from 'moment';

class ViewCoinReqModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showViewCoinReqModal: this.props.showViewCoinReqModal,
        }
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.showViewCoinReqModal !== prevState.showViewCoinReqModal) {
            return {
                showViewCoinReqModal: nextProps.showViewCoinReqModal
            }
        }
        return null;
    }

    _closeViewCoinReqModal = () => {
        this.setState({ showViewCoinReqModal: false })
        this.props.closeViewCoinReqModal();
    }

    render() {
        const { coinReqDetails } = this.props;
        const { showViewCoinReqModal } = this.state;

        return (
            <Modal
                title="View Coin Request"
                visible={showViewCoinReqModal}
                onCancel={this._closeViewCoinReqModal}
                footer={[
                    <Button onClick={this._closeViewCoinReqModal}>OK</Button>,
                ]}
            >
                <span> <b>Coin Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinReqDetails.coin_name ? coinReqDetails.coin_name : 'NA'}
                </p>

                <span> <b>Email:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinReqDetails.email ? coinReqDetails.email : 'NA'}
                </p>

                <span> <b>Target Date:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinReqDetails.target_date ?
                        (moment.utc(coinReqDetails.target_date).local().format("DD MMM YYYY"))
                        : 'NA'}
                </p>

                <span> <b>Message:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinReqDetails.message ? coinReqDetails.message : 'NA'}
                </p>

                <span> <b>URL:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {coinReqDetails.url ?
                        <a target="_blank" href={coinReqDetails.url}>{coinReqDetails.url}</a>
                        : 'NA'}
                </p>
            </Modal>
        );
    }
}

export default ViewCoinReqModal;
