import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Input, notification, Button, Form, Row, Col } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import { Link } from 'react-router-dom';
import CKEditor from "ckeditor4-react";
import { isAllowed } from '../../../helpers/accessControl';

const { logout } = authAction;

class UpdateEmailTemplate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            fields: {},
            errMsg: false,
            errMessage: '',
            errType: 'Success',
            editorContent: '',
            showError: false,
            isReadOnly:false,
        }
        this.validator = new SimpleReactValidator();
    }

    componentDidMount = () => {
        if(this.props.location.state &&  this.props.location.state.isReadOnly){
            this.setState({isReadOnly:this.props.location.state.isReadOnly})
        }
        this._getTemplateDetails();
    }

    _getTemplateDetails = () => {
        const { location, token } = this.props;
        let path = location.pathname.split('/');
        let template_id = path[path.length - 1]
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getTemplateDetails(token, template_id)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    const { fields } = _this.state;
                    fields['content'] = res.template.content
                    _this.setState({ fields: res.template, editorContent: res.template.content });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

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

        this.setState({
            fields, showError: false
        });
    }

    onEditorChange = evt => {
        this.setState({ editorContent: evt.editor.getData() });
    };

    _updateTemplate = (e) => {
        e.preventDefault();
        const { token } = this.props;
        const { fields, editorContent } = this.state;

        if (this.validator.allValid()) {
            this.setState({ loader: true });

            let formData = {
                id: fields['id'],
                content: editorContent
            }

            ApiUtils.updateEmailTemplate(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status != 200) {
                        this.setState({
                            errMsg: true, errMessage: res.err, loader: false,
                            errType: 'Error', showError: false
                        });
                    } else if (res.status == 403) {
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            this.props.logout();
                        });
                    } else {
                        this.setState({
                            errMsg: true, errMessage: res.message, loader: false,
                            errType: 'Success', showError: false
                        });
                        this.props.history.push('/dashboard/email-templates')
                    }
                    this._resetForm();
                })
                .catch(() => {
                    this.setState({
                        errMsg: true, errMessage: 'Something went wrong!!',
                        loader: false, errType: 'error', showError: false
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { loader, fields, errMsg, errType, editorContent, showError,isReadOnly } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div className="isoLayoutContent">
                <div style={{ "display": "inline-block", "width": "100%" }}>
                    <Link to="/dashboard/email-templates">
                        <i style={{ marginRight: '15px', marginBottom: '15px' }} class="fa fa-arrow-left" aria-hidden="true"></i>
                        <a onClick={() => { this.props.history.push('/dashboard/email-templates') }}>Back</a>
                    </Link>
                </div>
                <Form onSubmit={this._updateTemplate}>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <strong>Template Name:</strong><br />
                            <Input placeholder="Template Name" value={fields["name"]} disabled />
                        </Col>
                    </Row>

                    <div style={{ "marginBottom": "15px" }}>
                        <strong>Template Note:</strong>
                        <p dangerouslySetInnerHTML={{ __html: fields["note"] }}></p>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <strong>Email Content:</strong>
                        <CKEditor
                            data={editorContent}
                            onChange={this.onEditorChange}
                            config={{
                                allowedContent: true,
                                fullPage: true,
                                toolbarGroups: [
                                    { name: "clipboard", groups: ["clipboard", "undo"] },
                                    {
                                        name: "editing",
                                        groups: ["find", "selection", "spellchecker"]
                                    },
                                    { name: "links" },
                                    { name: "forms" },
                                    { name: "tools" },
                                    { name: "document", groups: ["mode", "document", "doctools"] },
                                    { name: "others" },
                                    "/",
                                    { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
                                    {
                                        name: "paragraph",
                                        groups: ["list", "indent", "blocks", "align", "bidi"]
                                    },
                                    { name: "styles" },
                                    { name: "colors" },
                                    { name: "about" }
                                ]
                            }}
                        />
                        {showError && <span style={{ "color": "red" }}>
                            {'The content field is required.'}
                        </span>}
                    </div>
                    {!isReadOnly &&
                        <Row>
                            <Col>
                                <Button type="primary" htmlType="submit" className="user-btn" style={{ marginLeft: "0px" }} >Update</Button>
                            </Col>
                        </Row>
                    }
                    {loader && <FaldaxLoader />}
                </Form>
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(UpdateEmailTemplate);
