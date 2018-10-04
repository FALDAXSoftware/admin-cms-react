import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Icon, Spin } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const { TextArea } = Input;

class EditCoinModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditCoinModal: this.props.showEditCoinModal,
            loader: false,
            fields: this.props.fields,
            errMsg: false,
            errMessage: '',
            errType: 'Success'
        }
        this.validator = new SimpleReactValidator();
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps !== prevState) {
            return {
                showEditCoinModal: nextProps.showEditCoinModal,
                fields: nextProps.fields,
            }
        }
        return null;
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

        fields['coin_name'] = '';
        fields['limit'] = '';
        fields['description'] = '';
        fields['wallet_address'] = '';
        this.setState({ fields });
    }

    _closeEditCoinModal = () => {
        this.setState({ showEditCoinModal: false })
        this.props.closeEditCoinModal();
    }

    _editCoin = () => {
        const { token, getAllCoins } = this.props;
        const { fields } = this.state;


        if (this.validator.allValid()) {
            this.setState({ loader: true });

            let formData = {
                coin_id: fields["value"],
                coin_name: fields["coin_name"],
                limit: fields["limit"],
                description: fields["description"],
                wallet_address: fields["wallet_address"]
            };

            ApiUtils.editCoin(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this.setState({ errMsg: true, errMessage: res.message, loader: false, errType: 'Success' });
                    this._closeEditCoinModal();
                    getAllCoins();
                    this._resetForm();
                })
                .catch(error => {
                    console.error(error);
                    this.setState({ errMsg: true, errMessage: 'Something went wrong!!', loader: false, errType: 'error' });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { loader, showEditCoinModal, fields, errMsg, errType } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div>
                <Modal
                    title="Edit Coin"
                    visible={showEditCoinModal}
                    onOk={this._editCoin}
                    onCancel={this._closeEditCoinModal}
                    confirmLoading={loader}
                    okText="Edit"
                >
                    <div style={{ "marginBottom": "15px" }}>
                        <span>Coin Name:</span>
                        <Input placeholder="First Name" onChange={this._handleChange.bind(this, "coin_name")} value={fields["coin_name"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('coin name', fields["coin_name"], 'required', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Limit:</span>
                        <Input placeholder="Limit" onChange={this._handleChange.bind(this, "limit")} value={fields["limit"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('limit', fields["limit"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Description:</span>
                        <TextArea placeholder="Description" rows={4} onChange={this._handleChange.bind(this, "description")} value={fields["description"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('description', fields["description"], 'required', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Wallet Address:</span>
                        <Input placeholder="Email" onChange={this._handleChange.bind(this, "wallet_address")} value={fields["wallet_address"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('wallet address', fields["wallet_address"], 'required', 'text-danger')}
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
    }))(EditCoinModal);
