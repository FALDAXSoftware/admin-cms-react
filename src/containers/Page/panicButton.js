import React, { Component } from 'react';
import { notification, Button, Modal } from 'antd';
import ApiUtils from '../../helpers/apiUtills';
import LayoutWrapper from "../../components/utility/layoutWrapper.js";
import { connect } from 'react-redux';

class PanicButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifyMsg: '',
            notify: false,
            errType: '',
            loader: false,
            isPanic: false
        }
    }

    _panicButton = () => {

        const { token } = this.props;
        let _this = this;

        _this.setState({ isPanic: true });
        ApiUtils.panicBtn(token)
            .then((response) => response.json())
            .then(function (res) {
                console.log('res', res)
                _this.setState({
                    notify: true, errType: 'Success', isPanic: false,
                    message: res.message
                });
            })
            .catch(() => {
                _this.setState({
                    notify: true, message: 'Something went wrong!!',
                    errType: 'error', isPanic: false
                });
            });
    }

    openNotificationWithIcon = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.message
        });
        this.setState({ notify: false });
    };

    _closeConfirmModal = () => {
        this.setState({ panicConfirmModal: false })
    }


    _showConfirmPanicModal = () => {
        this.setState({ panicConfirmModal: true })
    }

    render() {
        const { notify, errType, isPanic, panicConfirmModal } = this.state;

        if (notify) {
            this.openNotificationWithIcon(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <Button type="primary" onClick={this._showConfirmPanicModal} disabled={isPanic}>Panic Button</Button>
                <Modal
                    title="Confirm Panic"
                    onCancel={this._closeConfirmModal}
                    visible={panicConfirmModal}
                    footer={[
                        <Button onClick={this._closeConfirmModal}>No</Button>,
                        <Button onClick={this._panicButton}>Yes</Button>,
                    ]}
                >
                    Are you sure you want to press panic button?
                </Modal>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        user: state.Auth.get('user'),
        token: state.Auth.get('token')
    }))(PanicButton);

export { PanicButton }
