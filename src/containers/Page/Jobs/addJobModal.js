import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Button, Select } from 'antd';
import CKEditor from "ckeditor4-react";
import SimpleReactValidator from 'simple-react-validator';
import striptags from 'striptags';
import authAction from '../../../redux/auth/actions';
import FaldaxLoader from '../faldaxLoader';

const { logout } = authAction;
const Option = Select.Option;

class AddJobModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAddJobModal: this.props.showAddJobModal,
            loader: false,
            fields: {},
            editorContent: '',
            errMsg: false,
            errMessage: '',
            errType: 'Success',
            showError: false,
            isDisabled: false,
            selectedCategory: ''
        }
        this.validator = new SimpleReactValidator();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({ showAddJobModal: nextProps.showAddJobModal });
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

    _closeAddJobModal = () => {
        this.setState({ showAddJobModal: false })
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

        fields['position'] = '';
        fields['location'] = '';
        fields['short_desc'] = '';
        this.setState({ fields, editorContent: '', showError: false, selectedCategory: '' });
    }

    _addJob = () => {
        const { token, getAllJobs } = this.props;
        let { fields, editorContent, selectedCategory } = this.state;
        let jobContent = striptags(editorContent);

        if (this.validator.allValid() && jobContent.length > 0) {
            this.setState({ loader: true, isDisabled: true });
            let formData = {
                position: fields["position"],
                location: fields["location"],
                job_desc: editorContent,
                category: selectedCategory,
                is_active: true,
                short_desc: fields["short_desc"],
                wallet_address: fields["wallet_address"],
            };

            ApiUtils.addJob(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        this._closeAddJobModal();
                        getAllJobs();
                        this._resetAddForm();
                        this.setState({
                            editorContent: '', errMsg: true, errMessage: res.message,
                            loader: false, errType: 'Success', showError: false, isDisabled: false
                        })
                    } else if (res.status == 403) {
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            this.props.logout();
                        });
                    } else {
                        this.setState({ errMsg: true, errMessage: res.message, loader: false });
                    }
                })
                .catch(() => {
                    this._resetAddForm();
                    this.setState({
                        errMsg: true, errMessage: 'Something went wrong!!',
                        loader: false, errType: 'error', showError: false, isDisabled: false
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
            this.setState({ showError: jobContent.length > 0 ? false : true })
        }
    }

    _changeCategory = (value) => {
        this.setState({ selectedCategory: value });
    }

    onEditorChange = evt => {
        this.setState({ editorContent: evt.editor.getData() });
    };

    render() {
        const { loader, showAddJobModal, fields, editorContent, errMsg,
            errType, showError, isDisabled, selectedCategory
        } = this.state;
        const { allJobCategories } = this.props;

        const catOptions = allJobCategories.map((category,index) => {
            return (
                <Option key={index} value={category.id}>{category.category}</Option>
            )
        })

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <Modal
                title="Add Job"
                visible={showAddJobModal}
                confirmLoading={loader}
                onCancel={this._closeAddJobModal}
                footer={[
                    <Button onClick={this._closeAddJobModal}>Cancel</Button>,
                    <Button disabled={isDisabled} onClick={this._addJob}>Add</Button>,
                ]}
            >
                <div style={{ "marginBottom": "15px" }}>
                    <span>Category:</span>
                    <Select
                        getPopupContainer={trigger => trigger.parentNode}
                        style={{ width: 200, "marginLeft": "15px" }}
                        placeholder="Select a Category"
                        onChange={this._changeCategory}
                        value={selectedCategory}
                    >
                        {catOptions}
                    </Select>
                    <span style={{ "color": "red" }}>
                        {this.validator.message('category',selectedCategory, 'required', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Position:</span>
                    <Input placeholder="Position" onChange={this._handleChange.bind(this, "position")} value={fields["position"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('position', fields["position"], 'required|max:50', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Short Description:</span>
                    <Input placeholder="Short Description" onChange={this._handleChange.bind(this, "short_desc")} value={fields["short_desc"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('short_desc', fields["short_desc"], 'required|max:160', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Job Description:</span>
                    <CKEditor
                        data={editorContent}
                        onChange={this.onEditorChange}
                        config={{
                            allowedContent: true,
                            fullPage: true,
                            toolbarGroups: [
                                { name: "clipboard", groups: ["clipboard", "undo"] },
                                {
                                    name: "editing",
                                    groups: ["find", "selection", "spellchecker"]
                                },
                                { name: "links" },
                                { name: "forms" },
                                { name: "tools" },
                                { name: "document", groups: ["mode", "document", "doctools"] },
                                { name: "others" },
                                "/",
                                { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
                                {
                                    name: "paragraph",
                                    groups: ["list", "indent", "blocks", "align", "bidi"]
                                },
                                { name: "styles" },
                                { name: "colors" },
                                { name: "about" }
                            ]
                        }}
                    />
                    {showError && <span style={{ "color": "red" }}>
                        {'The description field is required.'}
                    </span>}
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Location:</span>
                    <Input placeholder="Location" onChange={this._handleChange.bind(this, "location")} value={fields["location"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('location', fields["location"], 'required|max:50', 'text-danger')}
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
    }), { logout })(AddJobModal);
