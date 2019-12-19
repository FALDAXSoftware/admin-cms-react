import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Button, Select } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;
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
            isDisabled: false,
            selectedToken: false
        }
        this.validator = new SimpleReactValidator();
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
        fields['min_limit'] = '';
        fields['max_limit'] = '';
        this.setState({ fields, selectedToken: false });
    }

    _addCoin = () => {
        const { token, getAllCoins } = this.props;
        let { fields, selectedToken, showCoinErr } = this.state;
        if (this.validator.allValid() && !showCoinErr && this.refs.uploadImg.files[0] !== undefined) {
            this.setState({ loader: true, isDisabled: true });

            let formData = new FormData();
            formData.append('coin_name', fields['coin_name']);
            formData.append('coin_code', fields['coin_code'])
            formData.append('min_limit', fields['min_limit']);
            formData.append('max_limit', fields['max_limit']);
            formData.append('isERC', selectedToken);
            formData.append('deposit_method', ' ');
            formData.append('kraken_coin_name', ' ');
            formData.append('coin_icon', this.refs.uploadImg.files[0] ? this.refs.uploadImg.files[0] : fields['image']);

            ApiUtils.addCoin(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        this.setState({
                            errMsg: true, errMessage: res.message,
                            loader: false, errType: 'Success', isDisabled: false
                        })
                    } else if (res.status == 403) {
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            this.props.logout();
                        });
                    } else {
                        this.setState({
                            editorContent: '', errMsg: true, errMessage: res.err,
                            loader: false, errType: 'Error', isDisabled: false
                        })
                    }
                    this._closeAddCoinModal();
                    getAllCoins();
                    this._resetAddForm();
                }).catch(() => {
                    this._resetAddForm();
                    this.setState({
                        errMsg: true, errMessage: 'Something went wrong!!',
                        loader: false, errType: 'error', isDisabled: false
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
            this.setState({
                showIamgeMessage: "Image is required.",
                showCoinErr: true
            });
        }
    }

    _changeFilter = (val) => {
        this.setState({ selectedToken: val });
    }

    _onChangeImg = e => {
        const { fields } = this.state;
        debugger
        const file = this.refs.uploadImg.files[0];
        let size = file.size / 1024 / 1024;
        let type = file.type;
        if (type == "image/jpeg" || type == "image/png" || type == "image/jpg") {
            if (size <= 10) {
                const reader = new FileReader();

                reader.onloadend = () => {
                    fields["image"] = reader.result
                    this.setState({
                        imageUrl: reader.result
                    });
                };
                if (file) {
                    reader.readAsDataURL(file);
                    this.setState({
                        imageUrl: reader.result,
                        showIamgeMessage: "",
                        showCoinErr: false
                    });
                } else {
                    this.setState({
                        imageUrl: "/images/user-dummy.png",
                        showIamgeMessage: "",
                        showCoinErr: false
                    });
                }
            } else {
                this.setState({
                    imageUrl: "/images/user-dummy.png",
                    showIamgeMessage: "Please select image of less than 10MB in size.",
                    showCoinErr: true
                });
            }
        } else {
            this.setState({
                imageUrl: "/images/user-dummy.png",
                showIamgeMessage: "Please select image of .png, .jpg, .jpeg type.",
                showCoinErr: true
            });
        }
    };

    render() {
        const { loader, showAddCoinModal, fields, errMsg, showIamgeMessage,
            errType, isDisabled, showCoinErr, selectedToken
        } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <Modal
                title="Add Asset"
                visible={showAddCoinModal}
                confirmLoading={loader}
                onCancel={this._closeAddCoinModal}
                footer={[
                    <Button onClick={this._closeAddCoinModal}>Cancel</Button>,
                    <Button disabled={isDisabled} onClick={this._addCoin}>Add</Button>,
                ]}
            >
                <div style={{ "marginBottom": "15px" }}>
                    <span>Asset Icon:</span><br />
                    <input
                        ref="uploadImg"
                        type="file"
                        name="selectedFile"
                        onChange={this._onChangeImg}
                        accept="image/x-png,image/jpg,image/jpeg"
                    /><br />
                    <span className="image-note">Supported format : .jpg , .png , .jpeg.</span>
                </div>
                {showCoinErr && <span style={{ "color": "red" }}>
                    {showIamgeMessage}
                </span>}

                <div style={{ "marginBottom": "15px" }}>
                    <span>Asset Name:</span>
                    <Input placeholder="Asset Name" onChange={this._handleChange.bind(this, "coin_name")} value={fields["coin_name"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('asset name', fields["coin_name"], 'required|max:30', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Asset Code:</span>
                    <Input placeholder="Asset Code" onChange={this._handleChange.bind(this, "coin_code")} value={fields["coin_code"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('asset code', fields["coin_code"], 'required|max:10', 'text-danger')}
                    </span>
                </div>

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
                        getPopupContainer={trigger => trigger.parentNode}
                        style={{ width: 125, "marginLeft": "15px" }}
                        placeholder="Select a type"
                        onChange={this._changeFilter}
                        value={selectedToken}
                    >
                        <Option value="true">Yes</Option>
                        <Option value="false">No</Option>
                    </Select>
                </div>
                {loader && <FaldaxLoader />}
            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(AddCoinModal);
