import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Button } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import QuillEditor from '../../../components/uielements/styles/editor.style';
import SimpleReactValidator from 'simple-react-validator';
import striptags from 'striptags';

class AddAnnounceModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAddEmailModal: this.props.showAddEmailModal,
            loader: false,
            fields: {},
            editorContent: '',
            notifyMsg: '',
            notify: false,
            showError: false,
            isDisabled: false
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
            this.setState({ showAddEmailModal: nextProps.showAddEmailModal })
        }
        this.validator = new SimpleReactValidator();
    }

    openNotificationWithIcon = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.notifyMsg
        });
        this.setState({ notify: false });
    };

    _closeAddPageModal = () => {
        this.setState({ showAddEmailModal: false })
        this.props.closeAddModal();
        this._resetAddForm();
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
        this.setState({ fields, editorContent: '', showError: false });
    }

    _addAnnouncement = () => {
        const { token, getAnnouncements } = this.props;
        let { editorContent, fields } = this.state;
        let pageContent = striptags(editorContent);

        if (this.validator.allValid() && pageContent.length > 0) {
            this.setState({ loader: true, isDisabled: true });
            let formData = {
                name: fields["name"],
                title: fields["title"],
                content: editorContent
            };

            ApiUtils.addTemplate(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this._closeAddPageModal();
                    getAnnouncements();
                    this._resetAddForm();
                    this.setState({
                        errType: 'Success', notifyMsg: res.error ? res.error : res.message,
                        notify: true, showError: false, isDisabled: false
                    });
                })
                .catch(error => {
                    this._resetAddForm();
                    error && this.setState({
                        showError: false, errType: 'error', isDisabled: false,
                        notifyMsg: 'Something went wrong!!', notify: true
                    });
                });
        } else {
            this.validator.showMessages();
            this.setState({ showError: pageContent.length > 0 ? false : true })
            this.forceUpdate();
        }
    }

    _onChangeContent = (val) => {
        this.setState({ editorContent: val })
    }

    render() {
        const { loader, showAddEmailModal, editorContent, fields, notify,
            errType, showError, isDisabled } = this.state;
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
                title="Add New Announcement"
                visible={showAddEmailModal}
                confirmLoading={loader}
                onCancel={this._closeAddPageModal}
                footer={[
                    <Button onClick={this._closeAddPageModal}>Cancel</Button>,
                    <Button disabled={isDisabled} onClick={this._addAnnouncement}>Add</Button>,
                ]}
            >
                <div style={{ "marginBottom": "15px" }}>
                    <span>Name:</span>
                    <Input placeholder="Name" onChange={this._handleChange.bind(this, "name")} value={fields["name"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('name', fields["name"], 'required|max:50', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Title:</span>
                    <Input placeholder="Title" onChange={this._handleChange.bind(this, "title")} value={fields["title"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('title', fields["title"], 'required|max:50', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Content:</span>
                    <QuillEditor>
                        <ReactQuill {...options} />
                    </QuillEditor>
                    {showError && <span style={{ "color": "red" }}>
                        {'The content field is required.'}
                    </span>}
                </div>

            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(AddAnnounceModal);
