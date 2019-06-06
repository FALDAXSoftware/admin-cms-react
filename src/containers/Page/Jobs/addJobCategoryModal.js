import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Button, } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import authAction from '../../../redux/auth/actions';
import FaldaxLoader from '../faldaxLoader';

const { logout } = authAction;

class AddJobCatModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAddJobCatModal: this.props.showAddJobCatModal,
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
            this.setState({ showAddJobCatModal: nextProps.showAddJobCatModal });
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

    _closeAddCatJobModal = () => {
        this.setState({ showAddJobCatModal: false })
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

        fields['category'] = '';
        this.setState({ fields });
    }

    _addJob = () => {
        const { token, getAllJobCategories } = this.props;
        let { fields } = this.state;

        if (this.validator.allValid()) {
            this.setState({ loader: true });
            let formData = {
                category: fields["category"],
            };

            ApiUtils.addJobCategory(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        this._closeAddCatJobModal();
                        getAllJobCategories();
                        this._resetAddForm();
                        this.setState({
                            errMsg: true, errMessage: res.message, loader: false, errType: 'Success'
                        })
                    } else if (res.status == 403) {
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            this.props.logout();
                        });
                    } else {
                        this.setState({ errMsg: true, errMessage: res.message });
                    }
                })
                .catch(() => {
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
        const { loader, showAddJobCatModal, fields, errMsg, errType } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <Modal
                title="Add Job Category"
                visible={showAddJobCatModal}
                confirmLoading={loader}
                onCancel={this._closeAddCatJobModal}
                footer={[
                    <Button onClick={this._closeAddCatJobModal}>Cancel</Button>,
                    <Button onClick={this._addJob}>Add</Button>,
                ]}
            >
                <div style={{ "marginBottom": "15px" }}>
                    <span>Category:</span>
                    <Input placeholder="Category" onChange={this._handleChange.bind(this, "category")} value={fields["category"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('category', fields["category"], 'required', 'text-danger')}
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
    }), { logout })(AddJobCatModal);
