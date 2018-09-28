import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Icon, Spin, Switch } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class EditCoinModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditCoinModal: this.props.showEditCoinModal,
            loader: false,
            fields: this.props.fields,
            errMsg: false,
            errMessage: '',
            isActive: this.props.fields['is_active'],
            errType: 'Success'
        }
        this.validator = new SimpleReactValidator();
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps !== prevState) {
            return {
                showEditCoinModal: nextProps.showEditCoinModal,
                fields: nextProps.fields,
                //isActive: nextProps.fields['is_active']
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
        fields['wallet_address'] = '';
        this.setState({ fields });
    }

    _closeEditCoinModal = () => {
        this.setState({ showEditCoinModal: false })
        this.props.closeEditCoinModal();
    }

    _changeStatus = (checked) => {
        this.setState({ isActive: checked });
    }

    _editCoin = () => {
        const { token, getAllCoins } = this.props;
        const { fields, isActive } = this.state;


        if (this.validator.allValid()) {
            this.setState({ loader: true });

            let formData = {
                coin_id: fields["value"],
                coin_name: fields["coin_name"],
                limit: fields["limit"],
                wallet_address: fields["wallet_address"],
                is_active: isActive
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
        const { loader, showEditCoinModal, fields, errMsg, isActive, errType } = this.state;
        console.log('>>>>', isActive)
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div>
                <Modal
                    title="Edit User"
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
                        <span>Wallet Address:</span>
                        <Input placeholder="Email" onChange={this._handleChange.bind(this, "wallet_address")} value={fields["wallet_address"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('wallet address', fields["wallet_address"], 'required', 'text-danger')}
                        </span>
                    </div>

                    {loader && <Spin indicator={loaderIcon} />}

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Status:</span>
                        <Switch defaultChecked={isActive} onChange={this._changeStatus} />
                    </div>
                </Modal>
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(EditCoinModal);
