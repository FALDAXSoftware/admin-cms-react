import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Icon, Spin, Button } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import QuillEditor from '../../../components/uielements/styles/editor.style';
import SimpleReactValidator from 'simple-react-validator';
import striptags from 'striptags';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class EditPageModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditPageModal: this.props.showEditPageModal,
            loader: false,
            fields: {},
            editorContent: '',
            message: '',
            errMsg: false,
            errType: 'Success',
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
            this.setState({
                showEditPageModal: nextProps.showEditPageModal,
                fields: nextProps.staticPagesDetails,
                editorContent: nextProps.staticPagesDetails.content
            })
            this.validator = new SimpleReactValidator();
        }
    }

    openNotificationWithIcon = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.message
        });
        this.setState({ errMsg: false });
    };

    _onChangeContent = (val) => {
        this.setState({ editorContent: val })
    }

    _closeEditPageModal = () => {
        this.setState({ showEditPageModal: false })
        this.props.closeEditModal();
        this._resetAddForm();
    }

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['name'] = '';
        fields['title'] = '';
        this.setState({ fields, editorContent: this.props.staticPagesDetails.content });
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _editPage = () => {
        const { token, getAllStaticPages } = this.props;
        let { fields, editorContent } = this.state;
        let pageContent = striptags(editorContent);

        if (this.validator.allValid() && pageContent.length > 0) {
            this.setState({ loader: true, isDisabled: true })
            let formData = {
                id: fields["value"],
                title: fields["title"],
                name: fields["name"],
                content: editorContent
            };

            ApiUtils.editPage(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this._closeEditPageModal();
                    getAllStaticPages();
                    this._resetAddForm();
                    this.setState({
                        loader: false, errMsg: true, message: res.message,
                        errType: 'Success', showError: false, isDisabled: false
                    })
                })
                .catch(() => {
                    this.setState({
                        loader: false, errMsg: true, showError: false,
                        message: 'Something went wrong!!', errType: 'error', isDisabled: false
                    })
                    this._resetAddForm();
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
            this.setState({ showError: pageContent.length > 0 ? false : true })
        }
    }

    render() {
        const { loader, showEditPageModal, editorContent, fields, errType,
            errMsg, showError, isDisabled } = this.state;
        const options = {
            theme: 'snow',
            placeholder: 'Write Something',
            value: editorContent,
            onChange: this._onChangeContent,
            modules: this.quillModules,
        };

        if (errMsg) {
            this.openNotificationWithIcon(errType.toLowerCase());
        }

        return (
            <Modal
                title="Edit Page"
                visible={showEditPageModal}
                onCancel={this._closeEditPageModal}
                confirmLoading={loader}
                footer={[
                    <Button onClick={this._closeEditPageModal}>Cancel</Button>,
                    <Button disabled={isDisabled} onClick={this._editPage}>Update</Button>,
                ]}
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
                        {this.validator.message('title', fields["title"], 'required|max:30', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Content:</span>
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
    }))(EditPageModal);
