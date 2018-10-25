import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Spin, Icon } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import QuillEditor from '../../../components/uielements/styles/editor.style';
import SimpleReactValidator from 'simple-react-validator';
import striptags from 'striptags';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class AddPageModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAddPageModal: this.props.showAddPageModal,
            loader: false,
            fields: {},
            editorContent: '',
            notifyMsg: '',
            notify: false,
            errType: 'Success',
            showError: false
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
            this.setState({ showAddPageModal: nextProps.showAddPageModal });
            this.validator = new SimpleReactValidator();
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
        this.setState({ showAddPageModal: false })
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
        this.setState({ fields, editorContent: '' });
    }

    _addPage = () => {
        const { token, getAllStaticPages } = this.props;
        let { editorContent, fields } = this.state;
        let pageContent = striptags(editorContent);

        if (this.validator.allValid() && pageContent.length > 0) {
            this.setState({ loader: true })
            let formData = {
                name: fields["name"],
                title: fields["title"],
                content: editorContent
            };

            ApiUtils.addPage(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this._closeAddPageModal();
                    getAllStaticPages();
                    this._resetAddForm();
                    this.setState({
                        errType: 'success', notifyMsg: res.error ? res.error : res.message,
                        notify: true, loader: false, showError: false
                    });
                })
                .catch(error => {
                    this._resetAddForm();
                    error && this.setState({
                        errType: 'error', notifyMsg: 'Something went wrong!!',
                        notify: true, loader: false, showError: false
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
            this.setState({ showError: pageContent.length > 0 ? false : true })
        }
    }

    _onChangeContent = (val) => {
        this.setState({ editorContent: val })
    }

    render() {
        const { loader, showAddPageModal, editorContent, fields, notify,
            errType, showError } = this.state;
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
                title="Add Page"
                visible={showAddPageModal}
                onOk={this._addPage}
                onCancel={this._closeAddPageModal}
                confirmLoading={loader}
                okText="Add"
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
                    {showError && <span style={{ "color": "red" }}>
                        {'The content field is required.'}
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
    }))(AddPageModal);
