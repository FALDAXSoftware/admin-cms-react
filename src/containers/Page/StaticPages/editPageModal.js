import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import QuillEditor from '../../../components/uielements/styles/editor.style';
import SimpleReactValidator from 'simple-react-validator';

class EditPageModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditPageModal: this.props.showEditPageModal,
            loader: false,
            fields: {},
            editorContent: ''
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
                showEditPageModal: nextProps.showEditPageModal,
                fields: nextProps.staticPagesDetails,
                editorContent: nextProps.staticPagesDetails.content
            })
        }
    }

    _onChangeContent = (val) => {
        this.setState({ editorContent: val })
    }

    _closeEditPageModal = () => {
        this.setState({ showEditPageModal: false })
        this.props.closeEditModal();
    }

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['coin_name'] = '';
        this.setState({ fields });
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _editPage = () => {
        const { token, getAllStaticPages } = this.props;
        let { fields, editorContent } = this.state;

        if (this.validator.allValid()) {
            let formData = {
                id: fields["value"],
                title: fields["title"],
                name: fields["name"],
                content: editorContent
            };

            ApiUtils.editPage(token, formData)
                .then((res) => res.json())
                .then(() => {
                    this._closeEditPageModal();
                    getAllStaticPages();
                    this._resetAddForm();
                })
                .catch(error => {
                    console.error(error);
                    this._resetAddForm();
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { loader, showEditPageModal, editorContent, fields } = this.state;
        const options = {
            theme: 'snow',
            placeholder: 'Write Something',
            value: editorContent,
            onChange: this._onChangeContent,
            modules: this.quillModules,
        };

        return (
            <Modal
                title="Edit Page"
                visible={showEditPageModal}
                onOk={this._editPage}
                onCancel={this._closeEditPageModal}
                confirmLoading={loader}
                okText="Edit"
            >

                <div style={{ "marginBottom": "15px" }}>
                    <span>Page Name:</span>
                    <Input placeholder="Page Name" onChange={this._handleChange.bind(this, "name")} value={fields["name"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('page name', fields["name"], 'required', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Title:</span>
                    <Input placeholder="title" onChange={this._handleChange.bind(this, "title")} value={fields["title"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('title', fields["title"], 'required', 'text-danger')}
                    </span>
                </div>

                <QuillEditor>
                    <ReactQuill {...options} />
                </QuillEditor>

            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(EditPageModal);
