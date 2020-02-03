import React, { Component } from 'react';
import { Modal, Button, Input, Form, notification } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../../helpers/apiUtills';
import authAction from '../../../redux/auth/actions';
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';

const TextArea = Input.TextArea;
const { logout } = authAction;

class DeclineRequestModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showDeclineModal: this.props.showDeclineModal,
            fields: {},
        }
        this.validator = new SimpleReactValidator();
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.showDeclineModal !== prevState.showDeclineModal) {
            return {
                showDeclineModal: nextProps.showDeclineModal,
            }
        }
        return null;
    }

    _closeDeclineForm = () => {
        const { fields } = this.state;
        fields['reason'] = '';
        this.validator.hideMessages();
        this.setState({ fields, showDeclineModal: false });
        this.props.closeDeclineModal();
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    _declineRequest = () => {
        const { token, getAllWithdrawReqs, withdrawReqDetails } = this.props;
        const { fields } = this.state;

        if (this.validator.allValid()) {

            let formData = {
                status: false,
                id: withdrawReqDetails.value,
                amount: withdrawReqDetails.amount,
                destination_address: withdrawReqDetails.destination_address,
                coin_id: withdrawReqDetails.coin_id,
                user_id: withdrawReqDetails.user_id,
                reason: fields['reason']
            };

            this.setState({ loader: true });
            ApiUtils.changeWithdrawStatus(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        getAllWithdrawReqs();
                        this.setState({
                            errMsg: true, errMessage: res.message, errType: 'Success', loader: false
                        })
                    } else if (res.status == 403) {
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            this.props.logout();
                        });
                    } else {
                        this.setState({ errType: 'error', errMsg: true, errMessage: res.message, loader: false });
                    }
                })
                .catch(() => {
                    this.setState({
                        errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                    });
                });
            this._closeDeclineForm();
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    render() {
        const { showDeclineModal, fields, errMsg, errType, loader } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <Modal
                title="Decline Withdraw Request"
                onCancel={this._closeDeclineForm}
                visible={showDeclineModal}
                footer={[
                    <Button onClick={this._closeDeclineForm}>Cancel</Button>,
                    <Button onClick={this._declineRequest}>Decline</Button>,
                ]}
            >
                {loader && <FaldaxLoader />}
                <Form onSubmit={this._declineRequest}>
                    <div style={{ "marginBottom": "15px" }}>
                        <span>Reason:</span>
                        <TextArea placeholder="Reason" onChange={this._handleChange.bind(this, "reason")} value={fields["reason"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('reason', fields["reason"], 'required', 'text-danger')}
                        </span>
                    </div>
                </Form>
            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(DeclineRequestModal);
