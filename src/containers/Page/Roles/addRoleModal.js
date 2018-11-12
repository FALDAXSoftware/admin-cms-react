import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, Icon, Spin, Checkbox, notification, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class AddRoleModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAddRoleModal: this.props.showAddRoleModal,
            loader: false,
            fields: {},
            coins: false,
            users: false,
            static_page: false,
            roles: false,
            announcement: false,
            countries: false,
            employee: false,
            pairs: false,
            blogs: false,
            all: false,
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
            showAddRoleModal: false, users: false, coins: false, static_page: false,
            roles: false, countries: false, employee: false, pairs: false,
            blogs: false, showError: false
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
            fields, users: false, coins: false, static_page: false, roles: false,
            countries: false, employee: false, pairs: false, blogs: false,
            showError: false
        });
    }

    _addRole = () => {
        const { token, getAllRoles } = this.props;
        let { fields, users, coins, roles, static_page, announcement, countries,
            employee, pairs, blogs, showError } = this.state;
        if (users || coins | roles || static_page || announcement || countries ||
            employee || pairs || blogs) {
            if (this.validator.allValid() && !showError) {
                this.setState({ loader: true, isDisabled: true });
                let formData = {
                    name: fields["name"],
                    roles,
                    users,
                    coins,
                    static_page,
                    announcement,
                    countries,
                    employee,
                    pairs,
                    blogs
                };

                ApiUtils.addRole(token, formData)
                    .then((res) => res.json())
                    .then((res) => {
                        this._closeAddRoleModal();
                        getAllRoles();
                        this._resetAddForm();
                        this.setState({
                            errType: 'Success', errMsg: true, errMessage: res.message, isDisabled: false
                        });
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
        let { all, users, coins, roles, static_page, announcement, countries,
            employee, pairs, blogs } = this.state;

        if (all == false && field == 'all') {
            this.setState({
                all: true, coins: true, users: true, static_page: true, announcement: true,
                countries: true, roles: true, employee: true, pairs: true, blogs: true
            })
        } else if (!users || !coins | !roles || !static_page || !announcement || !countries ||
            !employee || !pairs || !blogs) {
            this.setState({ all: false, [field]: e.target.checked })

        } else {

            if (field == 'all' && e.target.checked === false) {
                this.setState({
                    all: false, coins: false, users: false, static_page: false, announcement: false,
                    countries: false, roles: false, employee: false, pairs: false, blogs: false
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
        const { loader, showAddRoleModal, fields, all, users, static_page, announcement,
            coins, countries, roles, employee, errMsg, errType, isDisabled, pairs, blogs,
            showError } = this.state;

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
                    <Checkbox checked={coins} onChange={this.onChange.bind(this, 'coins')}>Coins Module</Checkbox><br />
                    <Checkbox checked={static_page} onChange={this.onChange.bind(this, 'static_page')}>Static Pages Module</Checkbox><br />
                    <Checkbox checked={announcement} onChange={this.onChange.bind(this, 'announcement')}>Announcement Module</Checkbox><br />
                    <Checkbox checked={countries} onChange={this.onChange.bind(this, 'countries')}>Country Module</Checkbox><br />
                    <Checkbox checked={roles} onChange={this.onChange.bind(this, 'roles')}>Roles Module</Checkbox><br />
                    <Checkbox checked={employee} onChange={this.onChange.bind(this, 'employee')}>Employee Module</Checkbox><br />
                    <Checkbox checked={pairs} onChange={this.onChange.bind(this, 'pairs')}>Pairs Module</Checkbox><br />
                    <Checkbox checked={blogs} onChange={this.onChange.bind(this, 'blogs')}>Blogs Module</Checkbox><br />
                </div>
                {showError && <span style={{ "color": "red" }}>
                    {'The module field is required.'}
                </span>
                }

                {loader && <Spin indicator={loaderIcon} />}
            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(AddRoleModal);
