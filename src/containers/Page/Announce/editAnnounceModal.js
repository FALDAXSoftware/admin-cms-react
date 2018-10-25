import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import QuillEditor from '../../../components/uielements/styles/editor.style';
import SimpleReactValidator from 'simple-react-validator';
import striptags from 'striptags';

class EditAnnounceModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditAnnounceModal: this.props.showEditAnnounceModal,
            loader: false,
            fields: {},
            editorContent: '',
            errMsg: false,
            errMessage: '',
            errType: 'Success'
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
                showEditAnnounceModal: nextProps.showEditAnnounceModal,
                fields: nextProps.emailDetails,
                editorContent: nextProps.emailDetails.content
            })
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

    _closeEditAnnounce = () => {
        this.setState({ showEditAnnounceModal: false })
        this.props.closeEditModal();
    }

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['coin_name'] = '';
        this.setState({ fields, showError: false });
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _editAnnounce = () => {
        const { token, getAnnouncements } = this.props;
        let { fields, editorContent } = this.state;
        let pageContent = striptags(editorContent);

        if (this.validator.allValid() && pageContent.length > 0) {
            let formData = {
                id: fields["value"],
                title: fields["title"],
                name: fields["name"],
                content: editorContent
            };

            ApiUtils.editTemplate(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this._closeEditAnnounce();
                    getAnnouncements();
                    this._resetAddForm();
                    this.setState({
                        errMsg: true, errMessage: res.message,
                        errType: 'Success', showError: false
                    })
                })
                .catch(() => {
                    this.setState({
                        errMsg: true, errMessage: 'Something went wrong!!',
                        loader: false, errType: 'error', showError: false
                    });
                    this._resetAddForm();
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
            this.setState({ showError: pageContent.length > 0 ? false : true })
        }
    }

    render() {
        const {
            loader, showEditAnnounceModal, editorContent, fields, errMsg, errType,
            showError
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
                title="Edit Announcement"
                visible={showEditAnnounceModal}
                onOk={this._editAnnounce}
                onCancel={this._closeEditAnnounce}
                confirmLoading={loader}
                okText="Update"
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
                    <Input placeholder="title" onChange={this._handleChange.bind(this, "title")} value={fields["title"]} />
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
    }))(EditAnnounceModal);
