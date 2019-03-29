import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Button, Select } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import QuillEditor from '../../../components/uielements/styles/editor.style';
import SimpleReactValidator from 'simple-react-validator';
import striptags from 'striptags';
import FaldaxLoader from '../faldaxLoader';

const Option = Select.Option;

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
        this.validator = new SimpleReactValidator({
            space: {
                message: 'The attribute must be a valid IP address.',
                rule: function (val, options) {
                    if (val) {
                        return val;
                    }
                }
            }
        });
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
        if (field == 'image' && document.getElementsByClassName("coin_icon")[0] != undefined) {
            document.getElementsByClassName("coin_icon")[0].style.display = "none";
            fields[field] = e.target.value;
            this.setState({ fields });
        } else {
            if (e.target.value.trim() == "") {
                fields[field] = "";
            } else {
                fields[field] = e.target.value;
            }
        }
        this.setState({ fields });
    }

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['coin_name'] = '';
        fields['coin_code'] = '';
        //fields['description'] = '';
        fields['minLimit'] = '';
        fields['maxLimit'] = '';
        //fields['wallet_address'] = '';
        this.setState({ fields, editorContent: '', showError: false, selectedToken: false });
    }

    _addCoin = () => {
        const { token, getAllCoins } = this.props;
        let { fields, editorContent, selectedToken } = this.state;
        let coinContent = striptags(editorContent);

        if (this.validator.allValid() && this.uploadCoinInput.input.files.length > 0) {
            this.setState({ loader: true, isDisabled: true });

            let formData = new FormData();
            formData.append('coin_name', fields['coin_name']);
            formData.append('coin_code', fields['coin_code'])
            formData.append('minLimit', fields['minLimit']);
            formData.append('maxLimit', fields['maxLimit']);
            formData.append('isERC', selectedToken);
            formData.append('coin_icon', this.uploadCoinInput.input.files[0]);

            ApiUtils.addCoin(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status != 200) {
                        this.setState({
                            editorContent: '', errMsg: true, errMessage: res.err,
                            loader: false, errType: 'Error', showError: false, isDisabled: false
                        })
                    } else {
                        this.setState({
                            editorContent: '', errMsg: true, errMessage: res.message,
                            loader: false, errType: 'Success', showError: false, isDisabled: false
                        })
                    }
                    this._closeAddCoinModal();
                    getAllCoins();
                    this._resetAddForm();
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
            this.setState({ showCoinErr: this.uploadCoinInput.input.files.length > 0 ? false : true })
        }
    }

    _changeFilter = (val) => {
        this.setState({ selectedToken: val });
    }

    render() {
        const { loader, showAddCoinModal, fields, editorContent, errMsg,
            errType, showError, isDisabled, showCoinErr, selectedToken
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
                onCancel={this._closeAddCoinModal}
                footer={[
                    <Button onClick={this._closeAddCoinModal}>Cancel</Button>,
                    <Button disabled={isDisabled} onClick={this._addCoin}>Add</Button>,
                ]}
            >
                <div style={{ "marginBottom": "15px" }}>
                    <span>Coin Icon:</span>
                    <Input ref={(ref) => { this.uploadCoinInput = ref; }} type="file"
                        id="uploadCoinInput" name="uploadCoinInput"
                        style={{ "borderColor": "#fff", "padding": "10px 0px 0px 0px" }}
                        onChange={this._handleChange.bind(this, "coin_icon")} value={fields["coin_icon"]} />
                    <span className="image-note">Supported format : .jpg , .png , .jpeg.</span>
                </div>
                {showCoinErr && <span style={{ "color": "red" }}>
                    {'The coin icon is required.'}
                </span>}

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
                    <Input placeholder="Minimum Limit" onChange={this._handleChange.bind(this, "minLimit")} value={fields["minLimit"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('minimum limit', fields["minLimit"], 'required|numeric', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Maximum Limit:</span>
                    <Input placeholder="Maximum Limit" onChange={this._handleChange.bind(this, "maxLimit")} value={fields["maxLimit"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('maximum limit', fields["maxLimit"], 'required|numeric', 'text-danger')}
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
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(AddCoinModal);
