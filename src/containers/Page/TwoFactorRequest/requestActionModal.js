import React, { Component } from 'react';
import { Modal, Button, Input, Form, notification } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../../helpers/apiUtills';
import authAction from '../../../redux/auth/actions';
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';

const TextArea = Input.TextArea;
const { logout } = authAction;

class ViewRequestModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showRejectForm: this.props.showRejectForm,
            fields: {},
        }
        this.validator = new SimpleReactValidator();
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.showRejectForm !== prevState.showRejectForm) {
            return {
                showRejectForm: nextProps.showRejectForm,
                twoFactorReqDetails: nextProps.twoFactorReqDetails
            }
        }
        return null;
    }

    _closeRejectForm = () => {
        const { fields } = this.state;

        fields['reason'] = '';
        this.setState({ fields, showRejectForm: false });
        this.props.closeActionReqModal();
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

    _rejectRequest = () => {
        const { token } = this.props;
        const { twoFactorReqDetails, fields } = this.state;

        let formData = {
            id: twoFactorReqDetails.value,
            reason: fields['reason']
        };

        if (this.validator.allValid()) {
            this.setState({ loader: true })

            ApiUtils.rejectRequest(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        this.setState({
                            errMsg: true, errMessage: res.message,
                            errType: 'Success'
                        });
                        this.props.getAll2FARequests();
                    } else if (res.status == 403) {
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            this.props.logout();
                        });
                    } else {
                        this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                    }
                    this.setState({ loader: false, showRejectForm: false })
                    this._closeRejectForm();
                })
                .catch(() => {
                    this.setState({
                        errMsg: true, errMessage: 'Unable to complete the requested action.',
                        loader: false, errType: 'error'
                    });
                });
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
        const { showRejectForm, fields, errMsg, errType, loader } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <Modal
                title="Reject Request"
                onCancel={this._closeRejectForm}
                visible={showRejectForm}
                footer={[
                    <Button onClick={this._closeRejectForm}>Cancel</Button>,
                    <Button onClick={this._rejectRequest}>Reject</Button>,
                ]}
            >
                {loader && <FaldaxLoader />}
                <Form onSubmit={this._rejectRequest}>
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
    }), { logout })(ViewRequestModal);
