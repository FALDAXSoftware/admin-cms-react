import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import authAction from '../../../redux/auth/actions';
import { Modal, Input, notification, Icon, Spin } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

const { loginnotify } = authAction;
const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class AddUserModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAddUserModal: this.props.showAddUserModal,
            loader: false,
            fields: {},
            errMsg: false,
            errMessage: '',
        }
        this.validator = new SimpleReactValidator();
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.showAddUserModal !== prevState.showAddUserModal) {
            return {
                showAddUserModal: nextProps.showAddUserModal
            }
        }
        return null;
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: 'Error',
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _closeAddUserModal = () => {
        this.setState({ showAddUserModal: false })
        this.props.closeAddModal();
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;

        if (field === 'image' && document.getElementsByClassName("beer_image")[0] !== undefined) {
            document.getElementsByClassName("beer_image")[0].style.display = "none";
            fields[field] = e.target.value;
            this.setState({ fields });
        } else {
            e.target ? fields[field] = e.target.value : fields[field] = e;
            this.setState({ fields });
        }
    }

    _resetForm = () => {
        const { fields } = this.state;

        fields['name'] = '';
        fields['email'] = '';
        fields['password'] = '';
        fields['phone_number'] = '';
        this.setState({ fields });
    }

    _closeAddUserModal = () => {
        this.setState({ showAddUserModal: false })
        this.props.closeAddModal();
    }

    _addUser = () => {
        const { token, getAllUsers } = this.props;
        const { fields } = this.state;

        if (this.validator.allValid()) {
            this.setState({ loader: true });

            let formData = new FormData();
            formData.append('email', fields['email']);
            formData.append('phone_number', fields['phone']);
            formData.append('password', fields['password']);
            // formData.append('name', fields['name']);

            ApiUtils.addUser(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this.setState({ errMsg: true, errMessage: res.message, loader: false });
                    this._closeAddUserModal();
                    getAllUsers();
                    this._resetForm();
                })
                .catch(error => {
                    console.error(error);
                    this.setState({ errMsg: true, errMessage: 'Something went wrong!!', loader: false });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { loader, showAddUserModal, fields, errMsg } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError('error');
        }

        return (
            <div>
                <Modal
                    title="Add User"
                    visible={showAddUserModal}
                    onOk={this._addUser}
                    onCancel={this._closeAddUserModal}
                    confirmLoading={loader}
                    okText="Add"
                >
                    <div style={{ "marginBottom": "15px" }}>
                        <span>Full Name:</span>
                        <Input placeholder="Full Name" onChange={this._handleChange.bind(this, "name")} value={fields["name"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('name', fields["name"], 'required', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Phone Number:</span>
                        <Input placeholder="Phone Number" onChange={this._handleChange.bind(this, "phone")} value={fields["phone"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('phone number', fields["phone"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Email:</span>
                        <Input placeholder="Email" onChange={this._handleChange.bind(this, "email")} value={fields["email"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('email', fields["email"], 'required|email', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Password:</span>
                        <Input type="password" placeholder="Password" onChange={this._handleChange.bind(this, "password")} value={fields["password"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('password', fields["password"], 'required', 'text-danger')}
                        </span>
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
    }))(AddUserModal);