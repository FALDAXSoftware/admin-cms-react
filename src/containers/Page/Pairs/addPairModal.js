import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, Icon, Spin, Select, notification } from 'antd';
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
            name: ''
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
        }
    }

    _closeAddPairsModal = () => {
        this.setState({ showAddPairsModal: false })
        this.props.closeAddModal();
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['name'] = '';
        fields['maker_fee'] = '';
        fields['taker_fee'] = '';
        this.setState({ fields, selectedCoin1: '', selectedCoin2: '' });
    }

    _addPairs = () => {
        const { token, getAllPairs } = this.props;
        let { fields, selectedCoin1, selectedCoin2, name } = this.state;

        if (this.validator.allValid()) {
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
                    this.setState({ errType: 'success', errMsg: true, errMessage: res.message })
                })
                .catch(() => {
                    this.setState({ errType: 'error', errMsg: true, errMessage: 'Something went wrong' });
                    this._resetAddForm();
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _changeCoin = (field, value) => {
        if (field === 'coin_id1') {
            this.setState({ selectedCoin1: value, name: value })
        } else {
            this.setState({ selectedCoin2: value, name: this.state.name + '-' + value })
        }
    }

    render() {
        const { loader, showAddPairsModal, fields, name,
            allCoins, errType, errMsg, } = this.state;

        let coinOptions = allCoins.map((coin) => {
            return (
                <Option value={coin.coin_code}>{coin.coin_name}</Option>
            )
        });

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <Modal
                title="Add Pair"
                visible={showAddPairsModal}
                onOk={this._addPairs}
                onCancel={this._closeAddPairsModal}
                confirmLoading={loader}
                okText="Add"
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
                    </Select>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Coin 2:</span>
                    <Select
                        style={{ width: 200, "marginLeft": "15px" }}
                        placeholder="Select a Coin"
                        onChange={this._changeCoin.bind(this, 'coin_id2')}
                    >
                        {coinOptions}
                    </Select>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Maker Fee:</span>
                    <Input placeholder="Maker Fee" onChange={this._handleChange.bind(this, "maker_fee")} value={fields["maker_fee"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('maker fee', fields["maker_fee"], 'required|decimal', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Taker Fee:</span>
                    <Input placeholder="Maker Fee" onChange={this._handleChange.bind(this, "taker_fee")} value={fields["taker_fee"]} />
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
