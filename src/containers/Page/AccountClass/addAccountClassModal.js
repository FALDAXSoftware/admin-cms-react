import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;

class AddAccountClassModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAddClassModal: this.props.showAddClassModal,
            loader: false,
            fields: {},
            errMsg: false,
            errMessage: '',
            errType: 'Success',
        }
        this.validator = new SimpleReactValidator();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({ showAddClassModal: nextProps.showAddClassModal });
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

    _onChangeContent = (val) => {
        this.setState({ editorContent: val })
    }

    _closeAddClassModal = () => {
        this.setState({ showAddClassModal: false })
        this.props.closeAddModal();
        this._resetAddForm()
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

        fields['class_name'] = '';
        this.setState({ fields });
    }

    _addAccountClass = () => {
        const { token, getAllAccountClass } = this.props;
        let { fields } = this.state;

        if (this.validator.allValid()) {
            this.setState({ loader: true });

            let formData = {
                class_name: fields['class_name']
            }

            ApiUtils.addAccountClass(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        this.setState({
                            errMsg: true, errMessage: res.message, loader: false, errType: 'Success'
                        })
                    } else if (res.status == 403) {
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            this.props.logout();
                        });
                    } else {
                        this.setState({
                            errMsg: true, errMessage: res.err, loader: false, errType: 'Error'
                        })
                    }
                    this._closeAddClassModal();
                    getAllAccountClass();
                    this._resetAddForm();
                }).catch(() => {
                    this._resetAddForm();
                    this.setState({
                        errMsg: true, errMessage: 'Something went wrong!!', loader: false, errType: 'error'
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { loader, showAddClassModal, fields, errMsg, errType } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <Modal
                title="Add Account Class"
                visible={showAddClassModal}
                confirmLoading={loader}
                onCancel={this._closeAddClassModal}
                footer={[
                    <Button onClick={this._closeAddClassModal}>Cancel</Button>,
                    <Button onClick={this._addAccountClass}>Add</Button>,
                ]}
            >
                <div style={{ "marginBottom": "15px" }}>
                    <span>Account Class Name:</span>
                    <Input placeholder="Account Class Name" onChange={this._handleChange.bind(this, "class_name")} value={fields["class_name"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('account class name', fields["class_name"], 'required|max:60', 'text-danger')}
                    </span>
                </div>
                {loader && <FaldaxLoader />}
            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(AddAccountClassModal);
