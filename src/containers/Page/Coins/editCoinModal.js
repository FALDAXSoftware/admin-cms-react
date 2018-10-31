import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Icon, Spin, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import QuillEditor from '../../../components/uielements/styles/editor.style';
import striptags from 'striptags';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class EditCoinModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditCoinModal: this.props.showEditCoinModal,
            loader: false,
            fields: this.props.fields,
            errMsg: false,
            errMessage: '',
            errType: 'Success',
            editorContent: '',
            showError: false,
            isDisabled: false,
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
                showEditCoinModal: nextProps.showEditCoinModal,
                fields: nextProps.fields,
                editorContent: nextProps.fields.description
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
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _resetForm = () => {
        const { fields } = this.state;

        fields['coin_name'] = '';
        fields['limit'] = '';
        fields['wallet_address'] = '';
        this.setState({
            fields, editorContent: this.props.fields.description, showError: false
        });
    }

    _closeEditCoinModal = () => {
        this.setState({ showEditCoinModal: false })
        this.props.closeEditCoinModal();
        this._resetForm();
    }

    _editCoin = () => {
        const { token, getAllCoins } = this.props;
        const { fields, editorContent } = this.state;
        let coinContent = striptags(editorContent);

        if (this.validator.allValid() && coinContent.length > 0) {
            this.setState({ loader: true, isDisabled: true });

            let formData = {
                coin_id: fields["value"],
                coin_name: fields["coin_name"],
                limit: fields["limit"],
                description: editorContent,
                wallet_address: fields["wallet_address"]
            };

            ApiUtils.editCoin(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this.setState({
                        errMsg: true, errMessage: res.message, loader: false,
                        errType: 'Success', showError: false, isDisabled: false
                    });
                    this._closeEditCoinModal();
                    getAllCoins();
                    this._resetForm();
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
            this.setState({ showError: coinContent.length > 0 ? false : true })
        }
    }

    render() {
        const { loader, showEditCoinModal, fields, errMsg, errType, editorContent,
            showError, isDisabled
        } = this.state;
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

        return (
            <div>
                <Modal
                    title="Edit Coin"
                    visible={showEditCoinModal}
                    onCancel={this._closeEditCoinModal}
                    confirmLoading={loader}
                    footer={[
                        <Button onClick={this._closeEditCoinModal}>Cancel</Button>,
                        <Button disabled={isDisabled} onClick={this._editCoin}>Update</Button>,
                    ]}
                >
                    <div style={{ "marginBottom": "15px" }}>
                        <span>Coin Name:</span>
                        <Input placeholder="Coin Name" onChange={this._handleChange.bind(this, "coin_name")} value={fields["coin_name"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('coin name', fields["coin_name"], 'required|max:30', 'text-danger')}
                        </span>
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

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Limit:</span>
                        <Input placeholder="Limit" onChange={this._handleChange.bind(this, "limit")} value={fields["limit"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('limit', fields["limit"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Wallet Address:</span>
                        <Input placeholder="Wallet Address" onChange={this._handleChange.bind(this, "wallet_address")} value={fields["wallet_address"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('wallet address', fields["wallet_address"], 'required|max:45', 'text-danger')}
                        </span>
                    </div>

                    {loader && <Spin indicator={loaderIcon} />}
                </Modal>
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(EditCoinModal);
