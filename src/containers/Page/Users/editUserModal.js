import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Icon, Spin } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class EditUserModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditUserModal: this.props.showEditUserModal,
            loader: false,
            fields: this.props.fields,
            errMsg: false,
            errMessage: '',
        }
        this.validator = new SimpleReactValidator();
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps !== prevState) {
            return {
                showEditUserModal: nextProps.showEditUserModal,
                fields: nextProps.fields
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

        fields['first_name'] = '';
        fields['last_name'] = '';
        fields['email'] = '';

        fields['phone_number'] = '';
        this.setState({ fields });
    }

    _closeEditUserModal = () => {
        this.setState({ showEditUserModal: false })
        this.props.closeEditUserModal();
    }

    _editUser = () => {
        const { token, getAllUsers } = this.props;
        const { fields } = this.state;

        if (this.validator.allValid()) {
            this.setState({ loader: true });

            let formData = new FormData();
            formData.append('first_name', fields['first_name']);
            formData.append('last_name', fields['last_name']);
            formData.append('city_town', fields['city_town']);
            formData.append('email', fields['email']);
            formData.append('phone_number', fields['phone_number']);

            ApiUtils.editUser(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this.setState({ errMsg: true, errMessage: res.message, loader: false });
                    this._closeEditUserModal();
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
        const { loader, showEditUserModal, fields, errMsg } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError('error');
        }

        return (
            <div>
                <Modal
                    title="Edit User"
                    visible={showEditUserModal}
                    onOk={this._editUser}
                    onCancel={this._closeEditUserModal}
                    confirmLoading={loader}
                    okText="Edit"
                >
                    <div style={{ "marginBottom": "15px" }}>
                        <span>First Name:</span>
                        <Input placeholder="First Name" onChange={this._handleChange.bind(this, "first_name")} value={fields["first_name"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('first name', fields["first_name"], 'required', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Last Name:</span>
                        <Input placeholder="Last Name" onChange={this._handleChange.bind(this, "last_name")} value={fields["last_name"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('last name', fields["last_name"], 'required', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Phone Number:</span>
                        <Input placeholder="Phone Number" onChange={this._handleChange.bind(this, "phone_number")} value={fields["phone_number"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('phone number', fields["phone_number"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Email:</span>
                        <Input placeholder="Email" onChange={this._handleChange.bind(this, "email")} value={fields["email"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('email', fields["email"], 'required|email', 'text-danger')}
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
    }))(EditUserModal);
