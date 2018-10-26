import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, Icon, Spin, notification, Button } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import QuillEditor from '../../../components/uielements/styles/editor.style';
import SimpleReactValidator from 'simple-react-validator';
import striptags from 'striptags';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class AddCoinModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAddCoinModal: this.props.showAddCoinModal,
            loader: false,
            fields: {},
            editorContent: '',
            errMsg: false,
            errMessage: '',
            errType: 'Success',
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
            this.setState({ showAddCoinModal: nextProps.showAddCoinModal });
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

    _closeAddCoinModal = () => {
        this.setState({ showAddCoinModal: false })
        this.props.closeAddModal();
        this._resetAddForm()
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['coin_name'] = '';
        fields['coin_code'] = '';
        fields['description'] = '';
        fields['limit'] = '';
        fields['wallet_address'] = '';
        this.setState({ fields, editorContent: '' });
    }

    _addCoin = () => {
        const { token, getAllCoins } = this.props;
        let { fields, editorContent } = this.state;
        let coinContent = striptags(editorContent);

        if (this.validator.allValid() && coinContent.length > 0) {
            this.setState({ loader: true, isDisabled: true });
            let formData = {
                coin_name: fields["coin_name"],
                coin_code: fields["coin_code"],
                description: editorContent,
                limit: fields["limit"],
                wallet_address: fields["wallet_address"],
            };

            ApiUtils.addCoin(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this._closeAddCoinModal();
                    getAllCoins();
                    this._resetAddForm();
                    this.setState({
                        editorContent: '', errMsg: true, errMessage: res.message,
                        loader: false, errType: 'Success', showError: false, isDisabled: false
                    })
                })
                .catch(() => {
                    this._resetAddForm();
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
        const { loader, showAddCoinModal, fields, editorContent, errMsg,
            errType, showError, isDisabled
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
                title="Add Coin"
                visible={showAddCoinModal}
                confirmLoading={loader}
                footer={[
                    <Button onClick={this._closeAddCoinModal}>Cancel</Button>,
                    <Button disabled={isDisabled} onClick={this._addCoin}>Add</Button>,
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
                    <span>Coin Code:</span>
                    <Input placeholder="Coin Code" onChange={this._handleChange.bind(this, "coin_code")} value={fields["coin_code"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('coin code', fields["coin_code"], 'required|max:10', 'text-danger')}
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
                    <Input placeholder="Limit" onChange={this._handleChange.bind(this, "limit")} disabled={this.state.disabled} value={fields["limit"]} />
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
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(AddCoinModal);
