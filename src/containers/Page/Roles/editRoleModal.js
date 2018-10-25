import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Icon, Spin, Checkbox } from 'antd';
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
            coin: this.props.fields['coin'],
            user: false,
            staticPage: false,
            role: false,
            announcement: false,
            country: false,
            employee: false,
            all: true
        }
        this.validator = new SimpleReactValidator();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({
                showEditRoleModal: nextProps.showEditRoleModal,
                fields: nextProps.fields,
                coin: nextProps.fields['coin'],
                user: nextProps.fields['user'],
                staticPage: nextProps.fields['staticPage'],
                role: nextProps.fields['role'],
                announcement: nextProps.fields['announcement'],
                employee: nextProps.fields['employee'],
                country: nextProps.fields['country'],
                all: nextProps.fields['coin'] && nextProps.fields['user'] && nextProps.fields['staticPage'] &&
                    nextProps.fields['role'] && nextProps.fields['announcement'] && nextProps.fields['employee']
                    && nextProps.fields['country']
                    ? true : false
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

        fields['name'] = '';
        this.setState({ fields });
    }

    _closeEditRoleModal = () => {
        this.setState({ showEditRoleModal: false })
        this.props.closeEditRoleModal();
    }

    _editRole = () => {
        const { token, getAllRoles } = this.props;
        const { fields, role, user, coin, staticPage, announcement, country, employee
        } = this.state;

        if (this.validator.allValid()) {
            this.setState({ loader: true });

            let formData = {
                id: fields["value"],
                name: fields["name"],
                role,
                user,
                coin,
                staticPage,
                announcement,
                country,
                employee
            };

            ApiUtils.updateRole(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this.setState({ errMsg: true, errMessage: res.message, loader: false, errType: 'Success' });
                    this._closeEditRoleModal();
                    getAllRoles();
                    this._resetForm();
                })
                .catch(error => {
                    this.setState({ errMsg: true, errMessage: 'Something went wrong!!', loader: false, errType: 'error' });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _onChangeRole = (val) => {
        if (val.includes('All')) {
            this.setState({
                user: true, coin: true, staticPage: true, role: true,
                announcement: true, country: true, employee: true
            })
        } else {
            let value = val.slice(-1)[0];
            if (val.length >= 1) {
                this.setState({ [value]: this.state[value] === false ? true : false })
            } else {
                this.setState({
                    user: false, coin: false, staticPage: false, role: false,
                    announcement: false, country: false, employee: false
                })
            }
        }
    }

    onChange = (field, e, val) => {
        const { all } = this.state;
        if (all == false && field == 'all') {
            this.setState({
                all: true, coin: true, user: true, staticPage: true, announcement: true,
                country: true, role: true, employee: true
            })
        } else {
            if (field == 'all' && e.target.checked === false) {
                this.setState({
                    all: false, coin: false, user: false, staticPage: false, announcement: false,
                    country: false, role: false, employee: false
                })
            } else {
                this.setState({ [field]: e.target.checked })
            }
        }
    }

    render() {
        const { loader, showEditRoleModal, fields, errMsg, errType, coin, user,
            staticPage, announcement, country, role, employee, all
        } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div>
                <Modal
                    title="Edit Role"
                    visible={showEditRoleModal}
                    onOk={this._editRole}
                    onCancel={this._closeEditRoleModal}
                    confirmLoading={loader}
                    okText="Update"
                >
                    <div style={{ "marginBottom": "15px" }}>
                        <span>Role Name:</span>
                        <Input placeholder="Role Name" onChange={this._handleChange.bind(this, "name")} value={fields["name"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('name', fields["name"], 'required', 'text-danger')}
                        </span>
                    </div>

                    <div>
                        <span>Roles:</span><br />
                        <Checkbox checked={all} onChange={this.onChange.bind(this, 'all')}>All</Checkbox><br />
                        <Checkbox checked={user} onChange={this.onChange.bind(this, 'user')}>Users Module</Checkbox><br />
                        <Checkbox checked={coin} onChange={this.onChange.bind(this, 'coin')}>Coins Module</Checkbox><br />
                        <Checkbox checked={staticPage} onChange={this.onChange.bind(this, 'staticPage')}>Static Pages Module</Checkbox><br />
                        <Checkbox checked={announcement} onChange={this.onChange.bind(this, 'announcement')}>Announcement Module</Checkbox><br />
                        <Checkbox checked={country} onChange={this.onChange.bind(this, 'country')}>Country Module</Checkbox><br />
                        <Checkbox checked={role} onChange={this.onChange.bind(this, 'role')}>Roles Module</Checkbox><br />
                        <Checkbox checked={employee} onChange={this.onChange.bind(this, 'employee')}>Employee Module</Checkbox><br />
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
    }))(EditRoleModal);
