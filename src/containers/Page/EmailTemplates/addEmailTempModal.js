import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import QuillEditor from '../../../components/uielements/styles/editor.style';
import SimpleReactValidator from 'simple-react-validator';

class AddTemplateModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAddTempModal: this.props.showAddTempModal,
            loader: false,
            fields: {},
            editorContent: '',
            notifyMsg: '',
            notify: false
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
        if (nextProps.showAddTempModal !== this.props.showAddTempModal) {
            this.setState({ showAddTempModal: nextProps.showAddTempModal })
        }
    }

    openNotificationWithIcon = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.notifyMsg
        });
        this.setState({ notify: false });
    };

    _closeAddPageModal = () => {
        this.setState({ showAddTempModal: false })
        this.props.closeAddModal();
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['name'] = '';
        fields['title'] = '';
        this.setState({ fields, editorContent: '' });
    }

    _addPage = () => {
        const { token, getEmailTemplates } = this.props;
        let { editorContent, fields } = this.state;

        if (this.validator.allValid()) {
            let formData = {
                name: fields["name"],
                title: fields["title"],
                content: editorContent
            };

            ApiUtils.addTemplate(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this._closeAddPageModal();
                    getEmailTemplates();
                    this._resetAddForm();
                    this.setState({
                        errType: 'success', notifyMsg: res.error ? res.error : res.message, notify: true
                    });
                })
                .catch(error => {
                    console.error(error);
                    this._resetAddForm();
                    error && this.setState({ errType: 'error', notifyMsg: 'Something went wrong!!', notify: true });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _onChangeContent = (val) => {
        this.setState({ editorContent: val })
    }

    render() {
        const { loader, showAddTempModal, editorContent, fields, notify, errType } = this.state;
        const options = {
            theme: 'snow',
            placeholder: 'Write Something',
            value: editorContent,
            onChange: this._onChangeContent,
            modules: this.quillModules,
        };

        if (notify) {
            this.openNotificationWithIcon(errType.toLowerCase());
        }

        return (
            <Modal
                title="Add Template"
                visible={showAddTempModal}
                onOk={this._addPage}
                onCancel={this._closeAddPageModal}
                confirmLoading={loader}
                okText="Add"
            >

                <div style={{ "marginBottom": "15px" }}>
                    <span>Template Name:</span>
                    <Input placeholder="Template Name" onChange={this._handleChange.bind(this, "name")} value={fields["name"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('template name', fields["name"], 'required', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Title:</span>
                    <Input placeholder="Title" onChange={this._handleChange.bind(this, "title")} value={fields["title"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('title', fields["title"], 'required', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Content:</span>
                    <QuillEditor>
                        <ReactQuill {...options} />
                    </QuillEditor>
                </div>

            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(AddTemplateModal);
