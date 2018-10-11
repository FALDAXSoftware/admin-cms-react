import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, Icon, Spin } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import QuillEditor from '../../../components/uielements/styles/editor.style';
import SimpleReactValidator from 'simple-react-validator';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class EditBlogModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditBlogModal: this.props.showEditBlogModal,
            loader: false,
            fields: this.props.fields,
            blogDesc: this.props.fields['description'],
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
                showEditBlogModal: nextProps.showEditBlogModal,
                fields: nextProps.fields,
                blogDesc: nextProps.fields['description']
            })
        }
    }

    _onChangeContent = (val) => {
        this.setState({ blogDesc: val })
    }

    _closeEditBlogModal = () => {
        this.setState({ showEditBlogModal: false })
        this.props.closeEditBlogModal();
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['title'] = '';
        fields['author'] = '';
        fields['description'] = '';
        fields['tags'] = '';
        this.setState({ fields });
    }

    _editBlog = () => {
        const { token, getAllBlogs } = this.props;
        let { fields, blogDesc } = this.state;

        if (this.validator.allValid()) {
            let formData = {
                title: fields["title"],
                author: fields["author"],
                description: blogDesc,
                tags: fields["tags"],
            };

            ApiUtils.addCoin(token, formData)
                .then((res) => res.json())
                .then(() => {
                    this._closeEditBlogModal();
                    getAllBlogs();
                    this._resetAddForm();
                    this.setState({ blogDesc: '' })
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
        const { loader, showEditBlogModal, fields, blogDesc } = this.state;

        const options = {
            theme: 'snow',
            placeholder: 'Write Something',
            value: blogDesc,
            onChange: this._onChangeContent,
            modules: this.quillModules,
        };

        return (
            <Modal
                title="Edit Blog"
                visible={showEditBlogModal}
                onOk={this._editBlog}
                onCancel={this._closeEditBlogModal}
                confirmLoading={loader}
                okText="Add"
            >
                <div style={{ "marginBottom": "15px" }}>
                    <span>Title:</span>
                    <Input placeholder="Blog Title" onChange={this._handleChange.bind(this, "title")} value={fields["title"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('title', fields["title"], 'required', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Author:</span>
                    <Input placeholder="Author" onChange={this._handleChange.bind(this, "author")} value={fields["author"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('author', fields["author"], 'required', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Tags:</span>
                    <Input placeholder="Tags" onChange={this._handleChange.bind(this, "tags")} value={fields["tags"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('tags', fields["tags"], 'required', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Description:</span>
                    <QuillEditor>
                        <ReactQuill {...options} />
                    </QuillEditor>
                </div>
                {loader && <Spin indicator={loaderIcon} />}
            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(EditBlogModal);
