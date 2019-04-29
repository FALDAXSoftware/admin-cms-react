import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;

class EditCoinModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditLimitModal: this.props.showEditLimitModal,
            loader: false,
            fields: this.props.fields,
            errMsg: false,
            errMessage: '',
            errType: 'Success',
        }
        this.validator = new SimpleReactValidator();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({
                showEditLimitModal: nextProps.showEditLimitModal,
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

        fields['monthlyDepositCrypto'] = '';
        fields['monthlyDepositFiat'] = '';
        fields['monthlyWithdrawCrypto'] = '';
        fields['monthlyWithdrawFiat'] = '';
        fields['dailyDepositCrypto'] = '';
        fields['dailyDepositFiat'] = '';
        fields['dailyWithdrawCrypto'] = '';
        fields['dailyWithdrawFiat'] = '';
        fields['minWithdrawlCrypto'] = '';
        fields['minWithdrawlFiat'] = '';
        this.setState({ fields });
    }

    _closeEditLimitModal = () => {
        this.setState({ showEditLimitModal: false })
        this.props.closeEditModal();
    }

    _editLimit = () => {
        const { token, getAllLimits } = this.props;
        const { fields } = this.state;

        if (this.validator.allValid()) {
            this.setState({ loader: true });

            let formData = {
                id: fields["value"],
                user: fields["user"],
                monthlyDepositCrypto: fields["monthlyDepositCrypto"],
                monthlyDepositFiat: fields["monthlyDepositFiat"],
                monthlyWithdrawCrypto: fields["monthlyWithdrawCrypto"],
                monthlyWithdrawFiat: fields["monthlyWithdrawFiat"],
                dailyDepositCrypto: fields["dailyDepositCrypto"],
                dailyDepositFiat: fields["dailyDepositFiat"],
                dailyWithdrawCrypto: fields["dailyWithdrawCrypto"],
                dailyWithdrawFiat: fields["dailyWithdrawFiat"],
                minWithdrawlCrypto: fields["minWithdrawlCrypto"],
                minWithdrawlFiat: fields["minWithdrawlFiat"]
            };

            ApiUtils.updateLimit(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        this.setState({
                            errMsg: true, errMessage: res.message, loader: false, errType: 'Success'
                        });
                        this._closeEditLimitModal();
                        getAllLimits();
                        this._resetForm();
                    } else if (res.status == 403) {
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            this.props.logout();
                        });
                    } else {
                        this.setState({ errMsg: true, errMessage: res.message });
                    }
                })
                .catch(() => {
                    this.setState({ errMsg: true, errMessage: 'Something went wrong!!', loader: false, errType: 'error' });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { loader, showEditLimitModal, fields, errMsg, errType } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div>
                <Modal
                    title="Edit Limit"
                    visible={showEditLimitModal}
                    onOk={this._editLimit}
                    onCancel={this._closeEditLimitModal}
                    confirmLoading={loader}
                    okText="Update"
                >
                    <div style={{ "marginBottom": "15px" }}>
                        <span>User:</span>
                        <Input placeholder="User" value={fields["user"]} disabled />
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Monthly Deposit Crypto:</span>
                        <Input
                            placeholder="Monthly Deposit Crypto"
                            onChange={this._handleChange.bind(this, "monthlyDepositCrypto")}
                            value={fields["monthlyDepositCrypto"]}
                            addonAfter={'$'}
                        />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('Monthly Deposit Crypto', fields["monthlyDepositCrypto"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Monthly Deposit Fiat:</span>
                        <Input
                            placeholder="Monthly Deposit Fiat"
                            onChange={this._handleChange.bind(this, "monthlyDepositFiat")}
                            value={fields["monthlyDepositFiat"]}
                            addonAfter={'$'}
                        />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('Monthly Deposit Fiat', fields["monthlyDepositFiat"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Monthly Withdraw Crypto:</span>
                        <Input
                            placeholder="Monthly Withdraw Crypto"
                            onChange={this._handleChange.bind(this, "monthlyWithdrawCrypto")}
                            value={fields["monthlyWithdrawCrypto"]}
                            addonAfter={'$'}
                        />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('Monthly Withdraw Crypto', fields["monthlyWithdrawCrypto"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Monthly Withdraw Fiat:</span>
                        <Input
                            placeholder="Monthly Withdraw Fiat"
                            onChange={this._handleChange.bind(this, "monthlyWithdrawFiat")}
                            value={fields["monthlyWithdrawFiat"]}
                            addonAfter={'$'}
                        />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('Monthly Withdraw Fiat', fields["monthlyWithdrawFiat"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Daily Deposit Crypto:</span>
                        <Input
                            placeholder="Daily Deposit Crypto"
                            onChange={this._handleChange.bind(this, "dailyDepositCrypto")}
                            value={fields["dailyDepositCrypto"]}
                            addonAfter={'$'}
                        />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('Daily Deposit Crypto', fields["dailyDepositCrypto"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Daily Deposit Fiat:</span>
                        <Input
                            placeholder="Daily Deposit Fiat"
                            onChange={this._handleChange.bind(this, "dailyDepositFiat")}
                            value={fields["dailyDepositFiat"]}
                            addonAfter={'$'}
                        />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('Daily Deposit Fiat', fields["dailyDepositFiat"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Daily Withdraw Crypto:</span>
                        <Input
                            placeholder="Daily Withdraw Crypto"
                            onChange={this._handleChange.bind(this, "dailyWithdrawCrypto")}
                            value={fields["dailyWithdrawCrypto"]}
                            addonAfter={'$'}
                        />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('Daily Withdraw Crypto', fields["dailyWithdrawCrypto"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Daily Withdraw Fiat:</span>
                        <Input
                            placeholder="Daily Withdraw Fiat"
                            onChange={this._handleChange.bind(this, "dailyWithdrawFiat")}
                            value={fields["dailyWithdrawFiat"]}
                            addonAfter={'$'}
                        />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('Daily Withdraw Fiat', fields["dailyWithdrawFiat"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Min Withdrawl Crypto:</span>
                        <Input
                            placeholder="Min Withdrawl Crypto"
                            onChange={this._handleChange.bind(this, "minWithdrawlCrypto")}
                            value={fields["minWithdrawlCrypto"]}
                            addonAfter={'$'}
                        />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('Min Withdrawl Crypto', fields["minWithdrawlCrypto"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Min Withdrawl Fiat:</span>
                        <Input placeholder="Min Withdrawl Fiat"
                            onChange={this._handleChange.bind(this, "minWithdrawlFiat")}
                            value={fields["minWithdrawlFiat"]}
                            addonAfter={'$'}
                        />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('Min Withdrawl Fiat', fields["minWithdrawlFiat"], 'required|numeric', 'text-danger')}
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
    }), { logout })(EditCoinModal);
