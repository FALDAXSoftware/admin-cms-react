import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, Checkbox, notification, Button, Form, Row, Col } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;
const CheckboxGroup = Checkbox.Group;

class AddRoleModal extends Component {
    constructor(props) {
        super(props)
        let roles = Object.keys(this.props.allRolesValue)
        this.state = {
            showAddRoleModal: this.props.showAddRoleModal,
            loader: false,
            allRoles: roles,
            fields: {},
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            isDisabled: false,
            showError: false,
            indeterminate: true,
        }
        this.validator = new SimpleReactValidator();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            let roles = Object.keys(nextProps.allRoles)
            this.setState({
                showAddRoleModal: nextProps.showAddRoleModal,
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

    _closeAddRoleModal = () => {
        this.setState({ showAddRoleModal: false, showError: false }, () => {
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
        this.setState({ fields, showError: false });
    }

    _addRole = () => {
        const { token, getAllRoles } = this.props;
        let { fields, showError, checkedList } = this.state;
        let roles = {}
        let _this = this;

        if (this.validator.allValid()) {
            this.setState({ loader: true, isDisabled: true, showError: false });

            let formData = {
                name: fields["name"],
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
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' });
                    }
                    this.setState({ loader: false, isDisabled: false });
                })
                .catch(() => {
                    this.setState({
                        loader: false, errType: 'error', errMsg: true, errMessage: 'Unable to complete the requested action.', isDisabled: false
                    });
                    this._resetAddForm();
                });
        } else {
            _this.setState({ showError: (roles == undefined || Object.entries(roles).length == 0) ? true : false })
            _this.validator.showMessages();
            _this.forceUpdate();
        }
    }

    render() {
        const {
            loader, showAddRoleModal, fields, errMsg, errType, isDisabled, showError, allRoles
        } = this.state;
        let allRoleOptions = []

        allRoles && allRoles.map((role) => {
            return (
                allRoleOptions.push({ value: role, label: role })
            )
        })

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
                <Form onSubmit={this._addRole}>
                    <div style={{ "marginBottom": "15px" }}>
                        <span>Role Name:</span>
                        <Input placeholder="Role Name" onChange={this._handleChange.bind(this, "name")} value={fields["name"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('name', fields["name"], 'required|max:30', 'text-danger')}
                        </span>
                    </div>
                </Form>
                {loader && <FaldaxLoader />}
            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(AddRoleModal);
