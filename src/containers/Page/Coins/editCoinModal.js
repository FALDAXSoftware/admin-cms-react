import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Button, Select } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import QuillEditor from '../../../components/uielements/styles/editor.style';
import striptags from 'striptags';
import { BUCKET_URL } from '../../../helpers/globals';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;
const Option = Select.Option;

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
            selectedToken: false
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
                selectedToken: nextProps.fields.isERC,
                // editorContent: nextProps.fields.description
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
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    _resetForm = () => {
        const { fields } = this.state;

        fields['coin_name'] = '';
        //fields['wallet_address'] = '';
        fields['min_limit'] = '';
        fields['max_limit'] = '';
        this.setState({ fields, showError: false, selectedToken: false });
    }

    _closeEditCoinModal = () => {
        this.setState({ showEditCoinModal: false })
        this.props.closeEditCoinModal();
        this._resetForm();
    }

    _editCoin = () => {
        const { token, getAllCoins } = this.props;
        const { fields, editorContent, selectedToken } = this.state;
        //let coinContent = striptags(editorContent);

        if (this.validator.allValid()) {
            this.setState({ loader: true, isDisabled: true });

            let formData = new FormData();
            formData.append('coin_id', fields['value']);
            formData.append('coin_name', fields['coin_name']);
            formData.append('min_limit', fields['min_limit']);
            //formData.append('wallet_address', fields['wallet_address']);
            formData.append('max_limit', fields['max_limit']);
            formData.append('isERC', selectedToken);
            // if (this.uploadCoinInput.input.files[0] !== undefined) {
            //     formData.append('coin_icon', this.uploadCoinInput.input.files[0]);
            // }

            ApiUtils.editCoin(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        this.setState({
                            errMsg: true, errMessage: res.message, loader: false,
                            errType: 'Success', showError: false, isDisabled: false
                        });
                    } else if (res.status == 403) {
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            this.props.logout();
                        });
                    } else {
                        this.setState({
                            errMsg: true, errMessage: res.err, loader: false,
                            errType: 'Error', showError: false, isDisabled: false
                        });
                    }
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
        }
    }

    _changeFilter = (val) => {
        this.setState({ selectedToken: val });
    }

    render() {
        const { loader, showEditCoinModal, fields, errMsg, errType, editorContent,
            showError, isDisabled, showCoinErr, selectedToken
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
                        <span>Coin Icon:</span><br />
                        <img style={{ width: '150px', height: 'auto' }}
                            src={BUCKET_URL + fields['coin_icon']} />
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Coin Name:</span>
                        <Input placeholder="Coin Name" onChange={this._handleChange.bind(this, "coin_name")} value={fields["coin_name"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('coin name', fields["coin_name"], 'required|max:30', 'text-danger')}
                        </span>
                    </div>

                    {/* <div style={{ "marginBottom": "15px" }}>
                        <span>Description:</span>
                        <QuillEditor>
                            <ReactQuill {...options} />
                        </QuillEditor>
                        {showError && <span style={{ "color": "red" }}>
                            {'The description field is required.'}
                        </span>}
                    </div> */}

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Minimum Limit:</span>
                        <Input placeholder="Minimum Limit" onChange={this._handleChange.bind(this, "min_limit")} value={fields["min_limit"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('minimum limit', fields["min_limit"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Maximum Limit:</span>
                        <Input placeholder="Maximum Limit" onChange={this._handleChange.bind(this, "max_limit")} value={fields["max_limit"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('maximum limit', fields["max_limit"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Is ERC20 Token? :</span>
                        <Select
                            style={{ width: 125, "marginLeft": "15px" }}
                            placeholder="Select a type"
                            onChange={this._changeFilter}
                            value={selectedToken}
                        >
                            <Option value={true}>Yes</Option>
                            <Option value={false}>No</Option>
                        </Select>
                    </div>

                    {/* <div style={{ "marginBottom": "15px" }}>
                        <span>Wallet Address:</span>
                        <Input placeholder="Wallet Address" onChange={this._handleChange.bind(this, "wallet_address")} value={fields["wallet_address"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('wallet address', fields["wallet_address"], 'max:45', 'text-danger')}
                        </span>
                    </div> */}
                    {loader && <FaldaxLoader />}
                </Modal>
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(EditCoinModal);
