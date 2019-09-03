import React, { Component } from 'react';
import { notification, Card, Row, Col, Button, Modal, Form, Input } from 'antd';
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import LayoutContentWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';
import SimpleReactValidator from 'simple-react-validator';

const { logout } = authAction;
const Search = Input.Search;

const BalanceDiv = styled.div`
    border: gray solid 2px;
    padding: 6px;
    border-radius: 7px;
    margin: 5px;
`
const FeeDiv = styled.div`
    border: gray solid 2px;
    padding: 6px;    
    border-radius: 7px;
`

class WalletDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allWallets: [],
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
            sendModal: false,
            fields: {},
            walletDetails: [],
            defaultFee: 0
        }
        this.validator = new SimpleReactValidator({
            gtzero: {
                message: 'value must be greater than zero',
                rule: (val, params, validator) => {
                    if (val > 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                required: true
            }
        });
    }

    componentDidMount = () => {
        this._getAllWallets();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllWallets = () => {
        const { token } = this.props;
        const { searchWallet } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllWallets(token, searchWallet)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allWallets: res.data, defaultFee: res.default_send_Coin_fee });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false });
            })
            .catch(err => {
                _this.setState({
                    errType: 'error', errMsg: true, errMessage: 'Something went wrong', loader: false
                });
            });
    }

    _handleWalletChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order }, () => {
            this._getAllWallets();
        })
    }

    _copyNotification = () => {
        this.setState({ errMsg: true, errType: 'info', errMessage: 'Copied to Clipboard!!' });
    }

    _openSendModal = (values) => {
        this.setState({ sendModal: true, walletDetails: values });
    }

    _closeSendModal = () => {
        this.validator = new SimpleReactValidator({
            gtzero: {  // name the rule
                message: 'value must be greater than zero',
                rule: (val, params, validator) => {
                    if (val > 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                required: true  // optional
            }
        });
        this.setState({ sendModal: false, fields: {}, walletDetails: [] });
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

    _sendWalletBal = () => {
        const { token } = this.props;
        const { fields, walletDetails } = this.state;
        let _this = this;

        let formData = {
            amount: fields['amount'],
            destination_address: fields['dest_address'],
            coin_code: walletDetails.coin_code
        };

        if (this.validator.allValid()) {
            _this.setState({ loader: true });
            ApiUtils.sendWalletBalance(token, formData)
                .then((response) => response.json())
                .then(function (res) {
                    if (res.status == 200) {
                        _this.setState({ allWallets: res.data });
                    } else if (res.status == 403) {
                        _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            _this.props.logout();
                        });
                    } else {
                        _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                    }
                    _this.setState({ loader: false });
                    _this._closeSendModal();
                })
                .catch(err => {
                    _this.setState({
                        errType: 'error', errMsg: true, errMessage: 'Something went wrong', loader: false
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _searchWalletData = (val) => {
        this.setState({ searchWallet: val }, () => {
            this._getAllWallets();
        });
    }

    render() {
        const { allWallets, errType, errMsg, loader, sendModal, fields, walletDetails, defaultFee } = this.state;
        let subtotal = fields["amount"] + fields["amount"] * ((walletDetails.fee) / (100));
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>

                <TableDemoStyle className="isoLayoutContent">
                    <div style={{ "display": "inline-block", "width": "100%" }}>
                        <Search
                            placeholder="Search assets"
                            onSearch={(value) => this._searchWalletData(value)}
                            style={{ "float": "right", "width": "250px" }}
                            enterButton
                        />
                    </div>
                    <div className="isoTableDisplayTab">
                        {loader && <FaldaxLoader />}
                        <Row>
                            {allWallets.length > 0 ? allWallets.map(wallet => (
                                <Col xs={{ span: 5 }} lg={{ span: 6 }}>
                                    <Card className="wallet-card" title={wallet.coin}
                                        extra={<Button style={{ borderRadius: '5px' }} onClick={this._openSendModal.bind(this, wallet)}>Send</Button>}>
                                        <div className="wallet-div">
                                            <div>
                                                <b className="custom-spacing">HOT Send Address</b><br />
                                                <CopyToClipboard style={{ cursor: 'pointer' }}
                                                    text={wallet.send_address}
                                                    onCopy={this._copyNotification}>
                                                    <span>{wallet.send_address}</span>
                                                </CopyToClipboard>
                                            </div>
                                            <div>
                                                <b className="custom-spacing">HOT Receive Address</b><br />
                                                <CopyToClipboard style={{ cursor: 'pointer' }}
                                                    text={wallet.receive_address}
                                                    onCopy={this._copyNotification}>
                                                    <span>{wallet.receive_address}</span>
                                                </CopyToClipboard>
                                            </div>
                                        </div>
                                        <BalanceDiv><span>Total Balance : {wallet.balance}</span></BalanceDiv>
                                        <FeeDiv><span>Total Fees : {wallet.fee} %</span></FeeDiv>
                                    </Card>
                                </Col>
                            )) : "No Data Found!!"
                            }
                        </Row>
                        <Modal
                            title="Send"
                            visible={sendModal}
                            onOk={this._closeSendModal}
                            onCancel={this._closeSendModal}
                            footer={[
                                <Button type="primary" onClick={this._sendWalletBal}>Send {walletDetails.coin}</Button>
                            ]}
                        >
                            <Form onSubmit={this._sendWalletBal}>
                                <div style={{ "marginBottom": "15px" }}>
                                    <span>Destination Address:</span>
                                    <Input placeholder="Destination Address" onChange={this._handleChange.bind(this, "dest_address")} value={fields["dest_address"]} />
                                    <span style={{ "color": "red" }}>
                                        {this.validator.message('destination address', fields["dest_address"], 'required', 'text-danger-validation')}
                                    </span>
                                </div>
                                <div style={{ "marginBottom": "15px" }}>
                                    <span>Amount:</span>
                                    <Input placeholder="Amount" onChange={this._handleChange.bind(this, "amount")} value={fields["amount"]} />
                                    <span style={{ "color": "red" }}>
                                        {this.validator.message('amount', fields["amount"], 'required|numeric|gtzero', 'text-danger')}
                                    </span>
                                </div>
                                <div>
                                    <span>
                                        <b>Fee : {defaultFee + '%'}</b>
                                    </span>
                                    <span style={{ float: 'right' }}>
                                        <b>Total Payout : {subtotal ? subtotal : ''} {walletDetails.coin}</b>
                                    </span>
                                </div>
                            </Form>
                        </Modal>
                    </div>
                </TableDemoStyle>

            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(WalletDashboard);
