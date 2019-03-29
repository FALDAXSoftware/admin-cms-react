import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Checkbox, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import FaldaxLoader from '../faldaxLoader';

class EditRoleModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditRoleModal: this.props.showEditRoleModal,
            loader: false,
            fields: this.props.fields,
            errMsg: false,
            errMessage: '',
            errType: 'Success',
            coins: this.props.fields['coins'],
            users: this.props.fields['users'],
            roles: this.props.fields['roles'],
            countries: this.props.fields['countries'],
            employee: this.props.fields['employee'],
            pairs: this.props.fields['pairs'],
            limit_management: this.props.fields['limit_management'],
            trade_history: this.props.fields['trade_history'],
            transaction_history: this.props.fields['transaction_history'],
            jobs: this.props.fields['jobs'],
            withdraw_requests: this.props.fields['withdraw_requests'],
            kyc: this.props.fields['kyc'],
            fees: this.props.fields['fees'],
            panic_button: this.props.fields['panic_button'],
            all: this.props.fields['employee'] && this.props.fields['coins'] && this.props.fields['users'] &&
                this.props.fields['roles'] && this.props.fields['countries'] && this.props.fields['pairs'] &&
                this.props.fields['limit_management'] && this.props.fields['trade_history'] &&
                this.props.fields['transaction_history'] && this.props.fields['jobs'] &&
                this.props.fields['withdraw_requests'] && this.props.fields['kyc'] && this.props.fields['fees'] &&
                this.props.fields['panic_button'],
            isDisabled: false,
            showError: false
        }
        this.validator = new SimpleReactValidator();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({
                showEditRoleModal: nextProps.showEditRoleModal,
                fields: nextProps.fields,
                users: nextProps.fields['users'],
                coins: nextProps.fields['coins'],
                countries: nextProps.fields['countries'],
                roles: nextProps.fields['roles'],
                employee: nextProps.fields['employee'],
                pairs: nextProps.fields['pairs'],
                limit_management: nextProps.fields['limit_management'],
                transaction_history: nextProps.fields['transaction_history'],
                trade_history: nextProps.fields['trade_history'],
                withdraw_requests: nextProps.fields['withdraw_requests'],
                jobs: nextProps.fields['jobs'],
                kyc: nextProps.fields['kyc'],
                fees: nextProps.fields['fees'],
                panic_button: nextProps.fields['panic_button'],
                all: nextProps.fields['coins'] && nextProps.fields['users'] && nextProps.fields['roles'] &&
                    nextProps.fields['employee']
                    && nextProps.fields['countries'] && nextProps.fields['pairs'] &&
                    nextProps.fields['withdraw_requests'] && nextProps.fields['kyc'] &&
                    nextProps.fields['jobs'] &&
                    nextProps.fields['trade_history'] && nextProps.fields['limit_management'] && nextProps.fields['transaction_history'] &&
                    nextProps.fields['fees'] && nextProps.fields['panic_button'] &&
                    nextProps.fields['withdraw_requests']
                    ? true : false
            });
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

        fields['name'] = '';
        this.setState({ fields, showError: false });
    }

    _closeEditRoleModal = () => {
        this.setState({ showEditRoleModal: false })
        this.props.closeEditRoleModal();
        this._resetForm();
    }

    _editRole = () => {
        const { token, getAllRoles } = this.props;
        const { fields, users, coins, countries,
            roles, employee, pairs, showError, limit_management, trade_history,
            transaction_history, jobs, withdraw_requests, kyc, fees, panic_button
        } = this.state;
        if (users || coins | roles || countries ||
            employee || pairs || limit_management || trade_history ||
            transaction_history || jobs || withdraw_requests || kyc || fees ||
            panic_button) {

            if (this.validator.allValid() && !showError) {
                this.setState({ loader: true, isDisabled: true });

                let formData = {
                    id: fields["value"],
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

                ApiUtils.updateRole(token, formData)
                    .then((res) => res.json())
                    .then((res) => {
                        this.setState({
                            errMsg: true, errMessage: res.message, loader: false,
                            errType: 'Success', isDisabled: false
                        });
                        this._closeEditRoleModal();
                        getAllRoles();
                        this._resetForm();
                    })
                    .catch(() => {
                        this.setState({
                            errMsg: true, errMessage: 'Something went wrong!!', loader: false,
                            errType: 'error', isDisabled: false
                        });
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

    _onChangeRole = (field, e, val) => {
        const { all } = this.state;
        if (all == false && field == 'all') {
            this.setState({
                all: true, coins: true, users: true,
                countries: true, roles: true, employee: true, pairs: true, limit_management: true, trade_history: true, transaction_history: true,
                jobs: true, withdraw_requests: true, kyc: true, fees: true, panic_button: true
            })
        } else {
            if (field == 'all' && e.target.checked === false) {
                this.setState({
                    all: false, coins: false, users: false,
                    countries: false, roles: false, employee: false, pairs: false,
                    limit_management: false, trade_history: false, transaction_history: false,
                    jobs: false, withdraw_requests: false, kyc: false, fees: false, panic_button: false
                })
            } else {
                this.setState({ [field]: e.target.checked })
            }
        }
    }

    render() {
        const { loader, showEditRoleModal, fields, errMsg, errType, coins, users,
            countries, roles, employee, all, isDisabled,
            pairs, showError, limit_management, trade_history, transaction_history,
            withdraw_requests, jobs, kyc, fees, panic_button
        } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div>
                <Modal
                    title="Edit Role"
                    visible={showEditRoleModal}
                    onCancel={this._closeEditRoleModal}
                    confirmLoading={loader}
                    footer={[
                        <Button onClick={this._closeEditRoleModal}>Cancel</Button>,
                        <Button disabled={isDisabled} onClick={this._editRole}>Update</Button>,
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
                        <Checkbox checked={all} onChange={this._onChangeRole.bind(this, 'all')}>All</Checkbox><br />
                        <Checkbox checked={users} onChange={this._onChangeRole.bind(this, 'users')}>Users Module</Checkbox><br />
                        <Checkbox checked={coins} onChange={this._onChangeRole.bind(this, 'coins')}>Coins Module</Checkbox><br />
                        <Checkbox checked={countries} onChange={this._onChangeRole.bind(this, 'countries')}>Country Module</Checkbox><br />
                        <Checkbox checked={roles} onChange={this._onChangeRole.bind(this, 'roles')}>Roles Module</Checkbox><br />
                        <Checkbox checked={employee} onChange={this._onChangeRole.bind(this, 'employee')}>Employee Module</Checkbox><br />
                        <Checkbox checked={pairs} onChange={this._onChangeRole.bind(this, 'pairs')}>Pairs Module</Checkbox><br />
                        <Checkbox checked={limit_management} onChange={this._onChangeRole.bind(this, 'limit_management')}>Limit Management Module</Checkbox><br />
                        <Checkbox checked={transaction_history} onChange={this._onChangeRole.bind(this, 'transaction_history')}>Transaction History Module</Checkbox><br />
                        <Checkbox checked={trade_history} onChange={this._onChangeRole.bind(this, 'trade_history')}>Trade History Module</Checkbox><br />
                        <Checkbox checked={withdraw_requests} onChange={this._onChangeRole.bind(this, 'withdraw_requests')}>Withdraw Request Module</Checkbox><br />
                        <Checkbox checked={jobs} onChange={this._onChangeRole.bind(this, 'jobs')}>Jobs Module</Checkbox><br />
                        <Checkbox checked={kyc} onChange={this._onChangeRole.bind(this, 'kyc')}>KYC Module</Checkbox><br />
                        <Checkbox checked={fees} onChange={this._onChangeRole.bind(this, 'fees')}>Fees Module</Checkbox><br />
                        <Checkbox checked={panic_button} onChange={this._onChangeRole.bind(this, 'panic_button')}>Panic Button Module</Checkbox><br />
                    </div>
                    {showError && <span style={{ "color": "red" }}>
                        {'The module field is required.'}
                    </span>
                    }
                    {loader && <FaldaxLoader />}
                </Modal>
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(EditRoleModal);
