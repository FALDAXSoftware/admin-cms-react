import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, Checkbox, notification, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;

class AddRoleModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAddRoleModal: this.props.showAddRoleModal,
            loader: false,
            fields: {},
            coins: false,
            users: false,
            roles: false,
            countries: false,
            employee: false,
            pairs: false,
            all: false,
            limit_management: false,
            trade_history: false,
            transaction_history: false,
            jobs: false,
            withdraw_requests: false,
            kyc: false,
            fees: false,
            panic_button: false,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            isDisabled: false,
            showError: false
        }
        this.validator = new SimpleReactValidator();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({ showAddRoleModal: nextProps.showAddRoleModal });
            this.validator = new SimpleReactValidator();
        }
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _closeAddRoleModal = () => {
        this.setState({
            showAddRoleModal: false, users: false, coins: false,
            roles: false, countries: false, employee: false, pairs: false,
            showError: false, limit_management: false, trade_history: false, transaction_history: false,
            jobs: false, coin_requests: false, withdraw_requests: false, kyc: false, fees: false, panic_button: false
        }, () => {
            this.props.closeAddModal();
            this._resetAddForm();
        })
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

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['name'] = '';
        this.setState({
            fields, users: false, coins: false, roles: false,
            countries: false, employee: false, pairs: false,
            showError: false, limit_management: false, trade_history: false, transaction_history: false,
            jobs: false, withdraw_requests: false, kyc: false, fees: false, panic_button: false
        });
    }

    _addRole = () => {
        const { token, getAllRoles } = this.props;
        let { fields, users, coins, roles, countries,
            employee, pairs, showError, limit_management, trade_history,
            transaction_history, jobs, withdraw_requests, kyc, fees, panic_button
        } = this.state;
        if (users || coins | roles || countries ||
            employee || pairs || limit_management || trade_history ||
            transaction_history || jobs || withdraw_requests || kyc
        ) {
            if (this.validator.allValid() && !showError) {
                this.setState({ loader: true, isDisabled: true });
                let formData = {
                    name: fields["name"],
                    roles,
                    users,
                    coins,
                    countries,
                    employee,
                    pairs,
                    limit_management,
                    trade_history,
                    transaction_history,
                    jobs,
                    withdraw_requests,
                    kyc,
                    fees,
                    panic_button
                };

                ApiUtils.addRole(token, formData)
                    .then((res) => res.json())
                    .then((res) => {
                        if (res.status == 200) {
                            this._closeAddRoleModal();
                            getAllRoles();
                            this._resetAddForm();
                            this.setState({
                                errType: 'Success', errMsg: true, errMessage: res.message, isDisabled: false
                            });
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
                            errType: 'error', errMsg: true, errMessage: 'Something went wrong', isDisabled: false
                        });
                        this._resetAddForm();
                    });
            } else {
                this.validator.showMessages();
                this.forceUpdate();
            }
            this.setState({ showError: false })
        } else {
            this.setState({ showError: true })
        }
    }

    onChange = (field, e, val) => {
        let { all, users, coins, roles, countries,
            employee, pairs, limit_management, trade_history,
            transaction_history, jobs, withdraw_requests, kyc, fees, panic_button
        } = this.state;

        if (all == false && field == 'all') {
            this.setState({
                all: true, coins: true, users: true,
                countries: true, roles: true, employee: true, pairs: true,
                limit_management: true, trade_history: true, transaction_history: true,
                jobs: true, withdraw_requests: true, kyc: true, fees: true, panic_button: true
            })
        } else if (!users || !coins | !roles || !countries || !employee || !pairs || !limit_management
            || !trade_history || !transaction_history || !jobs || !withdraw_requests
            || !kyc || !fees || !panic_button) {
            this.setState({ all: false, [field]: e.target.checked })

        } else {
            if (field == 'all' && e.target.checked === false) {
                this.setState({
                    all: false, coins: false, users: false, countries: false, roles: false,
                    employee: false, pairs: false, limit_management: false, trade_history: false,
                    transaction_history: false, jobs: false, withdraw_requests: false, kyc: false,
                    fees: false, panic_button: false
                })
            } else {
                if (e.target.checked === false) {
                    this.setState({ [field]: e.target.checked, all: false })
                } else {
                    this.setState({ [field]: e.target.checked })
                }
            }
        }
    }

    render() {
        const { loader, showAddRoleModal, fields, all, users, coins, countries, roles, employee,
            errMsg, errType, isDisabled, pairs, showError, limit_management, trade_history,
            transaction_history, withdraw_requests, jobs, kyc, fees, panic_button
        } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <Modal
                title="Add Role"
                visible={showAddRoleModal}
                onCancel={this._closeAddRoleModal}
                confirmLoading={loader}
                footer={[
                    <Button onClick={this._closeAddRoleModal}>Cancel</Button>,
                    <Button disabled={isDisabled} onClick={this._addRole}>Add</Button>,
                ]}
            >
                <div style={{ "marginBottom": "15px" }}>
                    <span>Role Name:</span>
                    <Input placeholder="Role Name" onChange={this._handleChange.bind(this, "name")} value={fields["name"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('name', fields["name"], 'required|max:30', 'text-danger')}
                    </span>
                </div>

                <div>
                    <span>Modules:</span><br />
                    <Checkbox checked={all} onChange={this.onChange.bind(this, 'all')}>All</Checkbox><br />
                    <Checkbox checked={users} onChange={this.onChange.bind(this, 'users')}>Users Module</Checkbox><br />
                    <Checkbox checked={coins} onChange={this.onChange.bind(this, 'coins')}>Assets Module</Checkbox><br />
                    <Checkbox checked={countries} onChange={this.onChange.bind(this, 'countries')}>Country Module</Checkbox><br />
                    <Checkbox checked={roles} onChange={this.onChange.bind(this, 'roles')}>Roles Module</Checkbox><br />
                    <Checkbox checked={employee} onChange={this.onChange.bind(this, 'employee')}>Employee Module</Checkbox><br />
                    <Checkbox checked={pairs} onChange={this.onChange.bind(this, 'pairs')}>Pairs Module</Checkbox><br />
                    <Checkbox checked={limit_management} onChange={this.onChange.bind(this, 'limit_management')}>Limit Management Module</Checkbox><br />
                    <Checkbox checked={transaction_history} onChange={this.onChange.bind(this, 'transaction_history')}>Transaction History Module</Checkbox><br />
                    <Checkbox checked={trade_history} onChange={this.onChange.bind(this, 'trade_history')}>Trade History Module</Checkbox><br />
                    <Checkbox checked={withdraw_requests} onChange={this.onChange.bind(this, 'withdraw_requests')}>Withdraw Request Module</Checkbox><br />
                    <Checkbox checked={jobs} onChange={this.onChange.bind(this, 'jobs')}>Jobs Module</Checkbox><br />
                    <Checkbox checked={kyc} onChange={this.onChange.bind(this, 'kyc')}>KYC Module</Checkbox><br />
                    <Checkbox checked={fees} onChange={this.onChange.bind(this, 'fees')}>Fees Module</Checkbox><br />
                    <Checkbox checked={panic_button} onChange={this.onChange.bind(this, 'panic_button')}>Panic Button Module</Checkbox><br />
                </div>
                {showError && <span style={{ "color": "red" }}>
                    {'The module field is required.'}
                </span>
                }
                {loader && <FaldaxLoader />}
            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(AddRoleModal);
