import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import authAction from '../../../redux/auth/actions';
import FaldaxLoader from '../faldaxLoader';

const { logout } = authAction;

class EditJobCatModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditJobCatModal: this.props.showEditJobCatModal,
            loader: false,
            fields: this.props.fields,
            errMsg: false,
            errMessage: '',
            errType: 'Success',
        }
        this.validator = new SimpleReactValidator();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({
                showEditJobCatModal: nextProps.showEditJobCatModal,
                fields: nextProps.fields,
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
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    _resetForm = () => {
        const { fields } = this.state;

        fields['category'] = '';
        this.setState({ fields });
    }

    _closeEditJobCatModal = () => {
        this.setState({ showEditJobCatModal: false })
        this.props.closeEditJobCatModal();
        this._resetForm();
    }

    _editJob = () => {
        const { token, getAllJobCategories } = this.props;
        const { fields } = this.state;

        if (this.validator.allValid()) {
            this.setState({ loader: true });

            let formData = {
                id: fields["value"],
                category: fields["category"],
            };

            ApiUtils.updateJobCategory(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        this.setState({
                            errMsg: true, errMessage: res.message, loader: false, errType: 'Success'
                        });
                        this._closeEditJobCatModal();
                        getAllJobCategories();
                        this._resetForm();
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
                        errMsg: true, errMessage: 'Something went wrong!!',
                        loader: false, errType: 'error'
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { loader, showEditJobCatModal, fields, errMsg, errType } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div>
                <Modal
                    title="Edit Job"
                    visible={showEditJobCatModal}
                    onCancel={this._closeEditJobModal}
                    confirmLoading={loader}
                    footer={[
                        <Button onClick={this._closeEditJobCatModal}>Cancel</Button>,
                        <Button onClick={this._editJob}>Update</Button>,
                    ]}
                >
                    <div style={{ "marginBottom": "15px" }}>
                        <span>Category:</span>
                        <Input placeholder="category" onChange={this._handleChange.bind(this, "category")} value={fields["category"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('category', fields["category"], 'required|max:30', 'text-danger')}
                        </span>
                    </div>
                    {loader && <FaldaxLoader />}
                </Modal>
            </div >
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(EditJobCatModal);
