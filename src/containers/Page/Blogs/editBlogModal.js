import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, Icon, Spin, Tag, Tooltip, Select, notification, Button } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import QuillEditor from '../../../components/uielements/styles/editor.style';
import SimpleReactValidator from 'simple-react-validator';
import striptags from 'striptags';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const Option = Select.Option;

class EditBlogModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditBlogModal: this.props.showEditBlogModal,
            loader: false,
            fields: this.props.fields,
            blogDesc: this.props.fields['description'],
            tags: this.props.tags,
            allAdmins: this.props.allAdmins,
            selectedAuthor: '',
            notifyMsg: '',
            notify: false,
            showError: false,
            notifyType: 'Success',
            showAuthorErr: false,
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

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.notifyType,
            description: this.state.notifyMsg
        });
        this.setState({ notify: false });
    };

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({
                showEditBlogModal: nextProps.showEditBlogModal,
                fields: nextProps.fields,
                blogDesc: nextProps.fields['description'],
                tags: nextProps.tags,
                allAdmins: nextProps.allAdmins,
                selectedAuthor: nextProps.fields['admin_id']
            })
            this.validator = new SimpleReactValidator();
        }
    }

    _onChangeContent = (val) => {
        this.setState({ blogDesc: val })
    }

    _closeEditBlogModal = () => {
        this.setState({ showEditBlogModal: false })
        this.props.closeEditBlogModal();
        this._resetAddForm
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['title'] = '';
        this.setState({ fields, showError: false });
    }

    _editBlog = () => {
        const { token, getAllBlogs } = this.props;
        let { fields, blogDesc, tags, selectedAuthor } = this.state;
        this.setState({ loader: true })
        let blogDescription = striptags(blogDesc);

        if (this.validator.allValid() && blogDescription.length > 0 && selectedAuthor) {
            this.setState({ loader: true, isDisabled: true });
            let formData = {
                id: fields["value"],
                title: fields["title"],
                admin_id: selectedAuthor,
                description: blogDesc,
                tags: tags.toString(),
            };

            ApiUtils.editBlog(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this._closeEditBlogModal();
                    getAllBlogs();
                    this._resetAddForm();
                    this.setState({
                        blogDesc: '', loader: false, notify: true, notifyType: 'Success',
                        notifyMsg: res.message, showError: false, showAuthorErr: false,
                        isDisabled: false
                    })
                })
                .catch(() => {
                    this.setState({
                        loader: false, notify: true, notifyType: 'error', isDisabled: false,
                        notifyMsg: 'Something went wrong!', showError: false, showAuthorErr: false
                    })
                    this._resetAddForm();
                });
        } else {
            this.setState({
                loader: false,
                showError: blogDescription.length > 0 ? false : true,
                showAuthorErr: selectedAuthor.length > 0 ? false : true,
            })
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _closeTag = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags });
    }

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    }

    _changeInputTag = (e) => {
        this.setState({ inputTagVal: e.target.value });
    }

    _storeTag = () => {
        const state = this.state;
        const inputTagVal = state.inputTagVal;
        let tags = state.tags;
        if (inputTagVal && tags.indexOf(inputTagVal) === -1) {
            tags = [...tags, inputTagVal];
        }
        this.setState({ tags, inputVisible: false, inputTagVal: '' });
    }

    saveInputRef = input => this.input = input;

    _changeAuthor = (value) => {
        this.setState({ selectedAuthor: value })
    }

    render() {
        const { loader, showEditBlogModal, fields, blogDesc, tags, inputVisible,
            inputTagVal, notify, notifyType, selectedAuthor, allAdmins, showError,
            showAuthorErr, isDisabled
        } = this.state;

        const options = {
            theme: 'snow',
            placeholder: 'Write Something',
            value: blogDesc,
            onChange: this._onChangeContent,
            modules: this.quillModules,
        };

        if (notify) {
            this.openNotificationWithIconError(notifyType.toLowerCase());
        }

        let authorOptions = allAdmins.map((admin) => {
            return (
                <Option value={admin.id}>{admin.name}</Option>
            )
        })

        return (
            <Modal
                title="Edit Blog"
                visible={showEditBlogModal}
                onCancel={this._closeEditBlogModal}
                confirmLoading={loader}
                footer={[
                    <Button onClick={this._closeEditBlogModal}>Cancel</Button>,
                    <Button disabled={isDisabled} onClick={this._editBlog}>Update</Button>,
                ]}
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
                    <Select
                        style={{ width: 200, "marginLeft": "15px" }}
                        placeholder="Select a Author"
                        onChange={this._changeAuthor}
                        defaultValue={selectedAuthor}
                    >
                        {authorOptions}
                    </Select><br />
                    {showAuthorErr && <span style={{ "color": "red" }}>
                        {'The author field is required.'}
                    </span>}
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Tags:</span>
                    {
                        tags && tags.map((tag) => {
                            const isLongTag = tag.length > 20;
                            const tagElem = (
                                <Tag style={{ marginLeft: '15px' }} key={tag} closable={true} afterClose={() => this._closeTag(tag)}>
                                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                </Tag>
                            );
                            return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                        })
                    }
                    {inputVisible && (
                        <Input
                            ref={this.saveInputRef}
                            type="text"
                            style={{ width: 78, marginLeft: '15px' }}
                            value={inputTagVal}
                            onChange={this._changeInputTag}
                            onPressEnter={this._storeTag}
                        />
                    )}
                    {!inputVisible && (
                        <Tag
                            onClick={this.showInput}
                            style={{ background: '#fff', borderStyle: 'dashed', marginLeft: '15px' }}
                        >
                            <Icon type="plus" /> New Tag
</Tag>
                    )}
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Description:</span>
                    <QuillEditor>
                        <ReactQuill {...options} />
                    </QuillEditor>
                    {showError && <span style={{ "color": "red" }}>
                        {'The description field is required.'}
                    </span>}
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
