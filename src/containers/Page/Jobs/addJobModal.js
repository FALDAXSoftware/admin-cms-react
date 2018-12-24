import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, Icon, Spin, notification, Button, Select } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import QuillEditor from '../../../components/uielements/styles/editor.style';
import SimpleReactValidator from 'simple-react-validator';
import striptags from 'striptags';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
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

        this.quillModules = {
            toolbar: {
                container: [
                    [{ header: [1, 2, false] }, { font: [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [
                        { list: 'ordered' },
                        { list: 'bullet' },
                        { indent: '-1' },
                        { indent: '+1' },
                    ],
                    ['link', 'image', 'video'],
                    ['clean'],
                ],
            },
        };
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

    _onChangeContent = (val) => {
        this.setState({ editorContent: val })
    }

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
                short_desc: fields["short_desc"],
                wallet_address: fields["wallet_address"],
            };

            ApiUtils.addJob(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this._closeAddJobModal();
                    getAllJobs();
                    this._resetAddForm();
                    this.setState({
                        editorContent: '', errMsg: true, errMessage: res.message,
                        loader: false, errType: 'Success', showError: false, isDisabled: false
                    })
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

    render() {
        const { loader, showAddJobModal, fields, editorContent, errMsg,
            errType, showError, isDisabled
        } = this.state;

        const options = {
            theme: 'snow',
            placeholder: 'Write Something',
            value: editorContent,
            onChange: this._onChangeContent,
            modules: this.quillModules,
        };

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
                        style={{ width: 200, "marginLeft": "15px" }}
                        placeholder="Select a Category"
                        onChange={this._changeCategory}
                    >
                        <Option value="business">Business Development</Option>
                        <Option value="communications">Communications</Option>
                        <Option value="customer_support">Customer Support</Option>
                        <Option value="data_analytics">Data & Analytics</Option>
                        <Option value="media">Media</Option>
                        <Option value="engineering">Engineering</Option>
                        <Option value="finance_administration">Finance & Administration</Option>
                        <Option value="marketing">Marketing</Option>
                        <Option value="operations">Operations</Option>
                        <Option value="product_design">Product & Design</Option>
                        <Option value="security">Security</Option>
                        <Option value="human_resources">Human Resources</Option>
                    </Select>
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
                    <QuillEditor>
                        <ReactQuill {...options} />
                    </QuillEditor>
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
                {loader && <Spin indicator={loaderIcon} />}
            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(AddJobModal);
