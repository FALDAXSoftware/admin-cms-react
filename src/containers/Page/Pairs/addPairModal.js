import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, Icon, Spin, Select, notification, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const Option = Select.Option;

class AddPairModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAddPairsModal: this.props.showAddPairsModal,
            loader: false,
            fields: {},
            allCoins: this.props.allCoins,
            selectedCoin1: '',
            selectedCoin2: '',
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            name: '',
            isDisabled: false,
            showCoin1Err: false,
            showCoin2Err: false,
            showError: false
        }
        this.validator = new SimpleReactValidator();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({
                showAddPairsModal: nextProps.showAddPairsModal,
                allCoins: nextProps.allCoins
            })
            this.validator = new SimpleReactValidator();
        }
    }

    _closeAddPairsModal = () => {
        this.setState({ showAddPairsModal: false })
        this.props.closeAddModal();
        this._resetAddForm();
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

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['name'] = '';
        fields['maker_fee'] = '';
        fields['taker_fee'] = '';
        this.setState({
            fields, selectedCoin1: '', selectedCoin2: '', name: '',
            showCoin2Err: false, showCoin1Err: false, showError: false
        });
    }

    _addPairs = () => {
        const { token, getAllPairs } = this.props;
        let { fields, selectedCoin1, selectedCoin2, name } = this.state;

        if (this.validator.allValid() && selectedCoin1 && selectedCoin2 && selectedCoin1 !== selectedCoin2) {
            this.setState({ loader: true, isDisabled: true, showError: false });
            let formData = {
                name: name,
                coin_code1: selectedCoin1,
                coin_code2: selectedCoin2,
                maker_fee: fields['maker_fee'],
                taker_fee: fields['taker_fee']
            };

            ApiUtils.addPair(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this._closeAddPairsModal();
                    getAllPairs();
                    this._resetAddForm();
                    this.setState({
                        errType: 'Success', errMsg: true, errMessage: res.message,
                        isDisabled: false, loader: false
                    })
                })
                .catch(() => {
                    this.setState({
                        errType: 'error', errMsg: true, errMessage: 'Something went wrong',
                        isDisabled: false, loader: false
                    });
                    this._resetAddForm();
                });
        } else {
            this.setState({
                showCoin1Err: selectedCoin1.length > 0 ? false : true,
                showCoin2Err: selectedCoin2.length > 0 ? false : true,
                showError: selectedCoin1 == selectedCoin2 ? true : false
            })
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _changeCoin = (field, value) => {
        if (field === 'coin_id1') {
            if (this.state.name.indexOf('-')) {
                let temp = this.state.name.split('-');
                this.setState({ selectedCoin1: value, name: value + '-' + (temp[1] == undefined ? '' : temp[1]) }, () => {
                    this.setState({ showCoin1Err: this.state.selectedCoin1 ? false : true });
                })
            } else {
                this.setState({ selectedCoin1: value, name: value }, () => {
                    this.setState({ showCoin1Err: this.state.selectedCoin1 ? false : true });
                })
            }
        } else {
            if (this.state.name.indexOf('-')) {
                let temp = this.state.name.split('-');
                this.setState({ selectedCoin2: value, name: temp[0] + '-' + value }, () => {
                    this.setState({ showCoin2Err: this.state.selectedCoin2 ? false : true });
                })
            } else {
                this.setState({ selectedCoin2: value, name: this.state.name + '-' + value }, () => {
                    this.setState({ showCoin2Err: this.state.selectedCoin2 ? false : true });
                })
            }
        }
    }

    render() {
        const { loader, showAddPairsModal, fields, name, showError,
            allCoins, errType, errMsg, isDisabled, showCoin1Err, showCoin2Err } = this.state;

        let coinOptions = allCoins.map((coin) => {
            return (
                <Option value={coin.coin_code}>{coin.coin_name}-{coin.coin_code}</Option>
            )
        });

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <Modal
                title="Add Pair"
                visible={showAddPairsModal}
                confirmLoading={loader}
                onCancel={this._closeAddPairsModal}
                footer={[
                    <Button onClick={this._closeAddPairsModal}>Cancel</Button>,
                    <Button disabled={isDisabled} onClick={this._addPairs}>Add</Button>,
                ]}
            >
                <div style={{ "marginBottom": "15px" }}>
                    <span>Pair Name:</span>
                    <Input placeholder="Pair Name" onChange={this._handleChange.bind(this, "name")} value={name} disabled />
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Coin 1:</span>
                    <Select
                        style={{ width: 200, "marginLeft": "15px" }}
                        placeholder="Select a Coin"
                        onChange={this._changeCoin.bind(this, 'coin_id1')}
                    >
                        {coinOptions}
                    </Select><br />
                    {showCoin1Err && <span style={{ "color": "red" }}>
                        {'The coin 1 field is required.'}
                    </span>}
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Coin 2:</span>
                    <Select
                        style={{ width: 200, "marginLeft": "15px" }}
                        placeholder="Select a Coin"
                        onChange={this._changeCoin.bind(this, 'coin_id2')}
                    >
                        {coinOptions}
                    </Select><br />
                    {showCoin2Err && <span style={{ "color": "red" }}>
                        {'The coin 2 field is required.'}
                    </span>}
                </div>
                {showError && <span style={{ "color": "red" }}>
                    {'The coin 1 & coin 2 field can not be same.'}
                </span>}

                <div style={{ "marginBottom": "15px" }}>
                    <span>Maker Fee:</span>
                    <Input addonAfter={'%'} placeholder="Maker Fee" onChange={this._handleChange.bind(this, "maker_fee")} value={fields["maker_fee"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('maker fee', fields["maker_fee"], 'required|decimal', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Taker Fee:</span>
                    <Input addonAfter={'%'} placeholder="Maker Fee" onChange={this._handleChange.bind(this, "taker_fee")} value={fields["taker_fee"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('taker fee', fields["taker_fee"], 'required|decimal', 'text-danger')}
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
    }))(AddPairModal);
