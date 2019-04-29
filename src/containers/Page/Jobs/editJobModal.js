import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Icon, Spin, Button, Select } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import QuillEditor from '../../../components/uielements/styles/editor.style';
import authAction from '../../../redux/auth/actions';
import striptags from 'striptags';

const { logout } = authAction;
const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const Option = Select.Option;

class EditJobModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditJobModal: this.props.showEditJobModal,
            loader: false,
            fields: this.props.fields,
            errMsg: false,
            errMessage: '',
            errType: 'Success',
            editorContent: '',
            showError: false,
            isDisabled: false,
            selectedCategory: parseInt(this.props.fields.category_id)
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
            this.setState({
                showEditJobModal: nextProps.showEditJobModal,
                fields: nextProps.fields,
                editorContent: nextProps.fields.job_desc,
                selectedCategory: parseInt(nextProps.fields.category_id),
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

    _onChangeContent = (val) => {
        this.setState({ editorContent: val })
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

    _resetForm = () => {
        const { fields } = this.state;

        fields['position'] = '';
        fields['location'] = '';
        fields['short_desc'] = '';
        this.setState({
            fields, editorContent: this.props.fields.job_desc, showError: false,
            selectedCategory: parseInt(this.props.fields.category_id)
        });
    }

    _closeEditJobModal = () => {
        this.setState({ showEditJobModal: false })
        this.props.closeEditJobModal();
        this._resetForm();
    }

    _changeCategory = (value) => {
        this.setState({ selectedCategory: value });
    }

    _editJob = () => {
        const { token, getAllJobs } = this.props;
        const { fields, editorContent, selectedCategory } = this.state;
        let jobContent = striptags(editorContent);

        if (this.validator.allValid() && jobContent.length > 0) {
            this.setState({ loader: true, isDisabled: true });

            let formData = {
                job_id: fields["value"],
                position: fields["position"],
                location: fields["location"],
                description: editorContent,
                short_desc: fields["short_desc"],
                category: selectedCategory
            };

            ApiUtils.updateJob(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        this.setState({
                            errMsg: true, errMessage: res.message, loader: false,
                            errType: 'Success', showError: false, isDisabled: false
                        });
                        this._closeEditJobModal();
                        getAllJobs();
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
                        loader: false, errType: 'error', showError: false, isDisabled: false
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
            this.setState({ showError: jobContent.length > 0 ? false : true })
        }
    }

    render() {
        const { loader, showEditJobModal, fields, errMsg, errType, editorContent,
            showError, isDisabled, selectedCategory
        } = this.state;
        const { allJobCategories } = this.props;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        const options = {
            theme: 'snow',
            placeholder: 'Write Something',
            value: editorContent,
            onChange: this._onChangeContent,
            modules: this.quillModules,
        };

        const catOptions = allJobCategories.map((category) => {
            return (
                <Option value={category.id}>{category.category}</Option>
            )
        })

        return (
            <div>
                <Modal
                    title="Edit Job"
                    visible={showEditJobModal}
                    onCancel={this._closeEditJobModal}
                    confirmLoading={loader}
                    footer={[
                        <Button onClick={this._closeEditJobModal}>Cancel</Button>,
                        <Button disabled={isDisabled} onClick={this._editJob}>Update</Button>,
                    ]}
                >
                    <div style={{ "marginBottom": "15px" }}>
                        <span>Category:</span>
                        <Select
                            style={{ width: 200, "marginLeft": "15px" }}
                            placeholder="Select a Category"
                            onChange={this._changeCategory}
                            defaultValue={selectedCategory}
                        >
                            {catOptions}
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
            </div >
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(EditJobModal);
