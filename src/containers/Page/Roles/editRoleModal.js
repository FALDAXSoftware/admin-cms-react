import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Icon, Spin, Checkbox, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

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
            static_page: this.props.fields['static_page'],
            roles: this.props.fields['roles'],
            announcement: this.props.fields['announcement'],
            countries: this.props.fields['countries'],
            employee: this.props.fields['employee'],
            pairs: this.props.fields['pairs'],
            limit_management: this.props.fields['limit_management'],
            trade_history: this.props.fields['trade_history'],
            transaction_history: this.props.fields['transaction_history'],
            jobs: this.props.fields['jobs'],
            coin_requests: this.props.fields['coin_requests'],
            inquiries: this.props.fields['inquiries'],
            contact_setting: this.props.fields['contact_setting'],
            subscribe: this.props.fields['subscribe'],
            withdraw_requests: this.props.fields['withdraw_requests'],
            kyc: this.props.fields['kyc'],
            all: this.props.fields['employee'] && this.props.fields['coins'] && this.props.fields['users'] &&
                this.props.fields['static_page'] && this.props.fields['roles'] && this.props.fields['announcement'] &&
                this.props.fields['countries'] && this.props.fields['pairs'] &&
                this.props.fields['limit_management'] &&
                this.props.fields['trade_history'] && this.props.fields['transaction_history'] &&
                this.props.fields['jobs'] && this.props.fields['coin_requests'] &&
                this.props.fields['inquiries'] && this.props.fields['contact_setting'] &&
                this.props.fields['subscribe'] && this.props.fields['withdraw_requests'] &&
                this.props.fields['kyc'],
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
                coins: nextProps.fields['coins'],
                users: nextProps.fields['users'],
                static_page: nextProps.fields['static_page'],
                roles: nextProps.fields['roles'],
                announcement: nextProps.fields['announcement'],
                employee: nextProps.fields['employee'],
                countries: nextProps.fields['countries'],
                pairs: nextProps.fields['pairs'],
                limit_management: nextProps.fields['limit_management'],
                trade_history: nextProps.fields['trade_history'],
                transaction_history: nextProps.fields['transaction_history'],
                jobs: nextProps.fields['jobs'],
                coin_requests: nextProps.fields['coin_requests'],
                inquiries: nextProps.fields['inquiries'],
                contact_setting: nextProps.fields['contact_setting'],
                subscribe: nextProps.fields['subscribe'],
                withdraw_requests: nextProps.fields['withdraw_requests'],
                kyc: nextProps.fields['kyc'],

                all: nextProps.fields['coins'] && nextProps.fields['users'] && nextProps.fields['static_page'] &&
                    nextProps.fields['roles'] && nextProps.fields['announcement'] && nextProps.fields['employee']
                    && nextProps.fields['countries'] && nextProps.fields['pairs'] &&
                    nextProps.fields['withdraw_requests'] && nextProps.fields['subscribe'] && nextProps.fields['contact_setting'] &&
                    nextProps.fields['coin_requests'] && nextProps.fields['kyc'] && nextProps.fields['jobs'] &&
                    nextProps.fields['trade_history'] && nextProps.fields['limit_management'] && nextProps.fields['transaction_history'] &&
                    nextProps.fields['inquiries']
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
        const { fields, roles, users, coins, static_page, announcement, countries,
            employee, pairs, showError, limit_management, trade_history,
            transaction_history, jobs, coin_requests, inquiries, contact_setting,
            subscribe, withdraw_requests, kyc
        } = this.state;
        if (users || coins | roles || static_page || announcement || countries ||
            employee || pairs || limit_management || trade_history ||
            transaction_history || jobs || coin_requests || inquiries || contact_setting ||
            inquiries || contact_setting || subscribe || withdraw_requests || kyc) {

            if (this.validator.allValid() && !showError) {
                this.setState({ loader: true, isDisabled: true });

                let formData = {
                    id: fields["value"],
                    name: fields["name"],
                    roles,
                    users,
                    coins,
                    static_page,
                    announcement,
                    countries,
                    employee,
                    pairs,
                    limit_management,
                    trade_history,
                    transaction_history,
                    jobs,
                    coin_requests,
                    inquiries,
                    contact_setting,
                    subscribe,
                    withdraw_requests,
                    kyc
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
                all: true, coins: true, users: true, static_page: true, announcement: true,
                countries: true, roles: true, employee: true, pairs: true, limit_management: true, trade_history: true, transaction_history: true,
                jobs: true, coin_requests: true, inquiries: true, contact_setting: true,
                subscribe: true, withdraw_requests: true, kyc: true
            })
        } else {
            if (field == 'all' && e.target.checked === false) {
                this.setState({
                    all: false, coins: false, users: false, static_page: false, announcement: false,
                    countries: false, roles: false, employee: false, pairs: false,
                    limit_management: false, trade_history: false, transaction_history: false,
                    jobs: false, coin_requests: false, inquiries: false, contact_setting: false,
                    subscribe: false, withdraw_requests: false, kyc: false
                })
            } else {
                this.setState({ [field]: e.target.checked })
            }
        }
    }

    render() {
        const { loader, showEditRoleModal, fields, errMsg, errType, coins, users,
            static_page, announcement, countries, roles, employee, all, isDisabled,
            pairs, showError, limit_management, trade_history, transaction_history,
            contact_setting, coin_requests, subscribe, withdraw_requests, inquiries, jobs,
            kyc
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
                        <Checkbox checked={static_page} onChange={this._onChangeRole.bind(this, 'static_page')}>Static Pages Module</Checkbox><br />
                        <Checkbox checked={announcement} onChange={this._onChangeRole.bind(this, 'announcement')}>Announcement Module</Checkbox><br />
                        <Checkbox checked={countries} onChange={this._onChangeRole.bind(this, 'countries')}>Country Module</Checkbox><br />
                        <Checkbox checked={roles} onChange={this._onChangeRole.bind(this, 'roles')}>Roles Module</Checkbox><br />
                        <Checkbox checked={employee} onChange={this._onChangeRole.bind(this, 'employee')}>Employee Module</Checkbox><br />
                        <Checkbox checked={pairs} onChange={this._onChangeRole.bind(this, 'pairs')}>Pairs Module</Checkbox><br />
                        <Checkbox checked={limit_management} onChange={this._onChangeRole.bind(this, 'limit_management')}>Limit Management Module</Checkbox><br />
                        <Checkbox checked={transaction_history} onChange={this._onChangeRole.bind(this, 'transaction_history')}>Transaction History Module</Checkbox><br />
                        <Checkbox checked={trade_history} onChange={this._onChangeRole.bind(this, 'trade_history')}>Trade History Module</Checkbox><br />
                        <Checkbox checked={withdraw_requests} onChange={this._onChangeRole.bind(this, 'withdraw_requests')}>Withdraw Request Module</Checkbox><br />
                        <Checkbox checked={coin_requests} onChange={this._onChangeRole.bind(this, 'coin_requests')}>Coin Request Module</Checkbox><br />
                        <Checkbox checked={inquiries} onChange={this._onChangeRole.bind(this, 'inquiries')}>Inquiries Module</Checkbox><br />
                        <Checkbox checked={jobs} onChange={this._onChangeRole.bind(this, 'jobs')}>Jobs Module</Checkbox><br />
                        <Checkbox checked={contact_setting} onChange={this._onChangeRole.bind(this, 'contact_setting')}>Contact Setting Module</Checkbox><br />
                        <Checkbox checked={subscribe} onChange={this._onChangeRole.bind(this, 'subscribe')}>Subscribe Module</Checkbox><br />
                        <Checkbox checked={kyc} onChange={this._onChangeRole.bind(this, 'kyc')}>KYC Module</Checkbox><br />
                    </div>
                    {showError && <span style={{ "color": "red" }}>
                        {'The module field is required.'}
                    </span>
                    }
                    {loader && <Spin indicator={loaderIcon} />}
                </Modal>
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(EditRoleModal);
