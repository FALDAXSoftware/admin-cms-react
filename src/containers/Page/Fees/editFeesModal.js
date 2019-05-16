import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;

class EditFeesModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditFeesModal: this.props.showEditFeesModal,
            loader: false,
            fields: this.props.fields,
            errMsg: false,
            errMessage: '',
            errType: 'Success',
            editorContent: '',
            isDisabled: false,
        }
        this.validator = new SimpleReactValidator({
            className: 'text-danger',
            custom_between: {
                message: 'The :attribute must be between 1 to 100 %.',
                rule: function (val, params, validator) {
                    if (isNaN(val)) {
                        return false;
                    } else if (parseFloat(val) >= parseFloat(params[0]) && parseFloat(val) <= parseFloat(params[1])) {
                        return true;
                    } else {
                        return false;
                    }
                },
                required: true
            }
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({
                showEditFeesModal: nextProps.showEditFeesModal,
                fields: nextProps.fields,
            })
        }
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _resetForm = () => {
        const { fields } = this.state;

        fields['maker_fee'] = '';
        fields['taker_fee'] = '';
        this.setState({ fields });
    }

    _closeEditFeesModal = () => {
        this.setState({ showEditFeesModal: false })
        this.props.closeEditFeesModal();
        this._resetForm();
    }

    _editFees = () => {
        const { token, getAllFees } = this.props;
        const { fields } = this.state;

        if (this.validator.allValid()) {
            this.setState({ loader: true, isDisabled: true });

            let formData = {
                fee_id: fields['value'],
                maker_fee: fields['maker_fee'],
                taker_fee: fields['taker_fee'],
            }

            ApiUtils.updateFees(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        this.setState({
                            errMsg: true, errMessage: res.message, loader: false,
                            errType: 'Success', isDisabled: false
                        });
                    } else if (res.status == 403) {
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            this.props.logout();
                        });
                    } else {
                        this.setState({
                            errMsg: true, errMessage: res.err, loader: false, errType: 'Error', isDisabled: false
                        });
                    }
                    this._closeEditFeesModal();
                    getAllFees();
                    this._resetForm();
                })
                .catch(() => {
                    this.setState({
                        errMsg: true, errMessage: 'Something went wrong!!',
                        loader: false, errType: 'error', isDisabled: false
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { loader, showEditFeesModal, fields, errMsg, errType, isDisabled } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div>
                <Modal
                    title="Edit Fees"
                    visible={showEditFeesModal}
                    onCancel={this._closeEditFeesModal}
                    confirmLoading={loader}
                    footer={[
                        <Button onClick={this._closeEditFeesModal}>Cancel</Button>,
                        <Button disabled={isDisabled} onClick={this._editFees}>Update</Button>,
                    ]}
                >
                    <div style={{ "marginBottom": "15px" }}>
                        <span>Trade Volume:</span>
                        <Input value={fields["trade_volume"]} disabled />
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Maker Fee:</span>
                        <Input addonAfter={'%'} placeholder="Maker Fee" onChange={this._handleChange.bind(this, "maker_fee")} value={fields["maker_fee"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('maker fee', fields["maker_fee"], 'required|custom_between:0,100', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Taker Fee:</span>
                        <Input addonAfter={'%'} placeholder="Taker Fee" onChange={this._handleChange.bind(this, "taker_fee")} value={fields["taker_fee"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('Taker Fee', fields["taker_fee"], 'required|custom_between:0,100', 'text-danger')}
                        </span>
                    </div>

                    {loader && <FaldaxLoader />}
                </Modal>
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(EditFeesModal);
