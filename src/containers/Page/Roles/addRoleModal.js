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
            checkAll: false,
        }
        this.validator = new SimpleReactValidator();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            let roles = Object.keys(nextProps.allRolesValue)
            this.setState({
                showAddRoleModal: nextProps.showAddRoleModal,
                allRoles: roles
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
        this.setState({ fields, showError: false, checkedList: [] });
    }

    _addRole = () => {
        const { token, getAllRoles } = this.props;
        let { fields, showError, checkedList } = this.state;
        console.log('checkedList', checkedList)

        if (this.validator.allValid() && !showError) {
            this.setState({ loader: true, isDisabled: true });
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
    }

    _onRolesCheck = (e) => {
        this.setState({
            checkedList: e.target.checked ? this.state.allRoles : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    }

    onChange = (checkedList) => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < this.state.allRoles.length),
            checkAll: checkedList.length === this.state.allRoles.length,
        });
    }

    render() {
        const {
            loader, showAddRoleModal, fields, errMsg, errType, isDisabled, showError, allRoles
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
                <Form onSubmit={this._addRole}>
                    <div style={{ "marginBottom": "15px" }}>
                        <span>Role Name:</span>
                        <Input placeholder="Role Name" onChange={this._handleChange.bind(this, "name")} value={fields["name"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('name', fields["name"], 'required|max:30', 'text-danger')}
                        </span>
                    </div>

                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Modules:</span><br />
                            <Checkbox
                                indeterminate={this.state.indeterminate}
                                onChange={this._onRolesCheck}
                                checked={this.state.checkAll}
                            >
                                Check all
          </Checkbox>
                            <br />
                            <CheckboxGroup options={allRoles} value={this.state.checkedList} onChange={this.onChange} />
                        </Col>
                    </Row>
                    {showError && <span style={{ "color": "red" }}>
                        {'The module field is required.'}
                    </span>
                    }
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
