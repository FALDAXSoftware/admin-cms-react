import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Icon, Spin, Select, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const Option = Select.Option;

class EditEmployeeModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditEmpModal: this.props.showEditEmpModal,
            loader: false,
            fields: this.props.fields,
            errMsg: false,
            errMessage: '',
            errType: 'Success',
            selectedRole: '',
            allRoles: [],
            isDisabled: false
        }
        this.validator = new SimpleReactValidator();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({
                showEditEmpModal: nextProps.showEditEmpModal,
                fields: nextProps.fields,
                selectedRole: nextProps.fields['role']
            });
            this._getAllRoles();
        }
    }

    _getAllRoles = () => {
        const { token } = this.props;
        let _this = this;

        ApiUtils.getAllRoles(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    let roles = res.roles.map((role) => ({ key: role.id, value: role.name }));
                    _this.setState({ allRoles: roles });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch(err => {
                _this.setState({ errType: 'error', errMsg: true, errMessage: 'Something went wrong' });
            });
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
        this.setState({ fields, selectedRole: '' });
    }

    _closeEditEmpModal = () => {
        this.setState({ showEditEmpModal: false, selectedRole: '' })
        this.props.closeEditEmpModal();
    }

    _editEmployee = () => {
        const { token, getAllEmployee } = this.props;
        const { fields, selectedRole } = this.state;


        if (this.validator.allValid()) {
            this.setState({ loader: true, isDisabled: true });

            let formData = {
                id: fields["value"],
                name: fields["name"],
                roles: selectedRole
            };

            ApiUtils.editEmployee(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this.setState({
                        errMsg: true, errMessage: res.message, loader: false,
                        errType: 'Success', isDisabled: false
                    });
                    this._closeEditEmpModal();
                    getAllEmployee();
                    this._resetForm();
                })
                .catch(() => {
                    this.setState({
                        errMsg: true, errMessage: 'Something went wrong!!',
                        loader: false, errType: 'error', isDisabled: false
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _changeRole = (value) => {
        this.setState({ selectedRole: value })
    }

    render() {
        const { loader, showEditEmpModal, fields, errMsg, errType,
            allRoles, selectedRole, isDisabled } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        let options = allRoles.map((role) => {
            return (
                <Option value={role.key}>{role.value}</Option>
            )
        })

        return (
            <div>
                <Modal
                    title="Edit Employee"
                    visible={showEditEmpModal}
                    onCancel={this._closeEditEmpModal}
                    confirmLoading={loader}
                    footer={[
                        <Button onClick={this._closeEditEmpModal}>Cancel</Button>,
                        <Button disabled={isDisabled} onClick={this._editEmployee}>Update</Button>,
                    ]}
                >
                    <div style={{ "marginBottom": "15px" }}>
                        <span>Name:</span>
                        <Input placeholder="Name" onChange={this._handleChange.bind(this, "name")} value={fields["name"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('name', fields["name"], 'required|max:30', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span style={{ "marginRight": "15px" }}>Role:</span>
                        <Select
                            style={{ width: 200 }}
                            placeholder="Select a role"
                            onChange={this._changeRole}
                            defaultValue={selectedRole}
                        >
                            {options}
                        </Select>
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
    }))(EditEmployeeModal);
