import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;

class EditPairModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditPairModal: this.props.showEditPairModal,
            loader: false,
            fields: this.props.fields,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            isDisabled: false
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

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({
                showEditPairModal: nextProps.showEditPairModal,
                fields: nextProps.fields
            });
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
    }

    _closeEditPairModal = () => {
        this.setState({ showEditPairModal: false })
        this.props.closeEditModal();
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

    _resetEditForm = () => {
        const { fields } = this.state;

        fields['name'] = '';
        fields['maker_fee'] = '';
        fields['taker_fee'] = '';
        this.setState({ fields });
    }

    _editPair = () => {
        const { token, getAllPairs } = this.props;
        let { fields } = this.state;

        if (this.validator.allValid()) {
            this.setState({ loader: true, isDisabled: true });
            let formData = {
                id: fields["value"],
                name: fields["name"],
                coin_id1: fields["coin_id1"],
                coin_id2: fields["coin_id2"],
                price_precision: fields['maker_fee'],
                quantity_precision: fields['taker_fee']
            };

            ApiUtils.updatePair(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        this.setState({
                            errType: 'success', errMsg: true, errMessage: res.message,
                            isDisabled: false, loader: false
                        }, () => {
                            this._closeEditPairModal();
                            getAllPairs();
                        })
                        this._resetEditForm();
                    } else if (res.status == 403) {
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            this.props.logout();
                        });
                    } else {
                        this.setState({ errMsg: true, errMessage: res.message });
                    }
                })
                .catch(() => {
                    this.setState({
                        errType: 'error', errMsg: true, errMessage: 'Unable to complete the requested action.',
                        isDisabled: false, loader: false
                    });
                    this._resetEditForm();
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { loader, showEditPairModal, fields, errType, errMsg, isDisabled } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <Modal
                title="Edit Pair"
                visible={showEditPairModal}
                onCancel={this._closeEditPairModal}
                confirmLoading={loader}
                footer={[
                    <Button onClick={this._closeEditPairModal}>Cancel</Button>,
                    <Button disabled={isDisabled} onClick={this._editPair}>Update</Button>,
                ]}
            >
                <div style={{ "marginBottom": "15px" }}>
                    <span>Pair Name:</span>
                    <Input placeholder="Pair Name" value={fields["name"]} disabled />
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Price Precision:</span>
                    <Input addonAfter={'%'} placeholder="Price Precision" onChange={this._handleChange.bind(this, "maker_fee")} value={fields["maker_fee"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('Price Precision', fields["maker_fee"], 'required|custom_between:0,100', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Quantity Precision:</span>
                    <Input addonAfter={'%'} placeholder="Quantity Precision" onChange={this._handleChange.bind(this, "taker_fee")} value={fields["taker_fee"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('Quantity precision', fields["taker_fee"], 'required|custom_between:0,100', 'text-danger')}
                    </span>
                </div>
                {loader && <FaldaxLoader />}
            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(EditPairModal);
