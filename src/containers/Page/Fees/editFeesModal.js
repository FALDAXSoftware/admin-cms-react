import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Icon, Spin, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

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
            showError: false,
            isDisabled: false,
        }
        this.validator = new SimpleReactValidator();
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
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    _resetForm = () => {
        const { fields } = this.state;

        fields['maker_fee'] = '';
        fields['taker_fee'] = '';
        this.setState({ fields, showError: false });
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
                    if (res.status != 200) {
                        this.setState({
                            errMsg: true, errMessage: res.err, loader: false,
                            errType: 'Error', showError: false, isDisabled: false
                        });
                    } else {
                        this.setState({
                            errMsg: true, errMessage: res.message, loader: false,
                            errType: 'Success', showError: false, isDisabled: false
                        });
                    }
                    this._closeEditFeesModal();
                    getAllFees();
                    this._resetForm();
                })
                .catch(() => {
                    this.setState({
                        errMsg: true, errMessage: 'Something went wrong!!',
                        loader: false, errType: 'error', showError: false, isDisabled: false
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { loader, showEditFeesModal, fields, errMsg, errType,
            showError, isDisabled
        } = this.state;
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
                        <Input placeholder="Maker Fee" onChange={this._handleChange.bind(this, "maker_fee")} value={fields["maker_fee"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('maker fee', fields["maker_fee"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Taker Fee:</span>
                        <Input placeholder="Taker Fee" onChange={this._handleChange.bind(this, "taker_fee")} value={fields["taker_fee"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('Taker Fee', fields["taker_fee"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>

                    {loader && <Spin indicator={loaderIcon} />}
                </Modal>
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(EditFeesModal);
