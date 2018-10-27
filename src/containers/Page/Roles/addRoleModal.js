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
            coin: false,
            user: false,
            staticPage: false,
            role: false,
            announcement: false,
            country: false,
            employee: false,
            all: false,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            isDisabled: false
        }
        this.validator = new SimpleReactValidator();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({
                showAddRoleModal: nextProps.showAddRoleModal
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

    _closeAddRoleModal = () => {
        this.setState({
            showAddRoleModal: false, user: false, coin: false, staticPage: false, role: false,
            country: false, employee: false, employee: false
        }, () => {
            this.props.closeAddModal();
        })
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['name'] = '';
        this.setState({
            fields, user: false, coin: false, staticPage: false, role: false,
            country: false, employee: false, employee: false
        });
    }

    _addRole = () => {
        const { token, getAllRoles } = this.props;
        let { fields, user, coin, role, staticPage, announcement, country, employee } = this.state;

        if (this.validator.allValid()) {
            this.setState({ loader: true, isDisabled: true });
            let formData = {
                name: fields["name"],
                role,
                user,
                coin,
                staticPage,
                announcement,
                country,
                employee
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
        const { loader, showAddRoleModal, fields, all, user, staticPage, announcement,
            coin, country, role, employee, errMsg, errType, isDisabled
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
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(AddRoleModal);
