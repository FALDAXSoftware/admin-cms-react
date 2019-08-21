import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Divider, Button, notification } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import authAction from '../../../redux/auth/actions';
import styled from 'styled-components';
import FaldaxLoader from '../faldaxLoader';

const { logout } = authAction;

const ParentDiv = styled.div`
    padding: 20px;
    background-color: white;
    margin: 30px !important;
`

class WalletOverview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            walletUserData: []
        }
        this.validator = new SimpleReactValidator();
        this.PasswordValidator = new SimpleReactValidator();
    }

    componentDidMount = () => {
        this._getWalletDetails();
    }

    _getWalletDetails = () => {
        const { token, asset_id } = this.props;
        let formData = {
            coinReceive: asset_id
        }
        let _this = this;

        ApiUtils.getWalletDetails(token, formData)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ walletUserData: res.walletUserData })
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' });
                }
            })
            .catch((err) => {
                _this.setState({ errMsg: true, errMessage: err, errType: 'error' });
            });
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _createAssetWallet = () => {
        const { token } = this.props;
        let code = this.state.walletUserData.coin;

        this.setState({ loader: true });

        ApiUtils.generateWalletAddress(token, code)
            .then((res) => res.json())
            .then((res) => {
                if (res.status == 200) {
                    this.setState({
                        errMsg: true, errMessage: res.message, errType: 'Success'
                    }, () => {
                        this.props.history.push('/dashboard/assets');
                    });
                } else if (res.status == 403) {
                    this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        this.props.logout();
                    });
                } else {
                    this.setState({ errMsg: true, errMessage: res.err, errType: 'error' });
                }
                this.setState({ loader: false })
            })
            .catch(() => {
                this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    loader: false, errType: 'error'
                });
            });
    }

    render() {
        const { errMsg, errType, loader, walletUserData } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <ParentDiv className="kyc-div">
                <Divider>{walletUserData.coin} Wallet</Divider>
                {
                    Object.keys(walletUserData).length > 0 ? walletUserData.flag == 0 ?
                        <div>
                            <div>
                                Send Address:
                                <b style={{ color: "black" }}>{Object.keys(walletUserData).length > 0 ? walletUserData.receive_address : ""}</b>
                                <br />
                                Receive Address :
                                <b style={{ color: "black" }}>{Object.keys(walletUserData).length > 0 ? walletUserData.send_address : ""}</b>
                            </div>
                            <div>
                                {Object.keys(walletUserData).length > 0 ? <span>Balance : {walletUserData.balance}  {walletUserData.coin_code}</span> : ""}
                            </div>
                        </div>
                        :
                        walletUserData && walletUserData.flag == 1 ?
                            <div>
                                <div>
                                    <div>
                                        <p>Please wait for some time.As soon as your wallet is created , we'll let you know.</p>
                                    </div>
                                </div>
                            </div>
                            :
                            walletUserData && walletUserData.flag == 2 ?
                                <React.Fragment>
                                    <p>Your wallet is not created yet. Please click on the button below to create your wallet for {walletUserData.coin_name}.</p>
                                    <Button type='primary' onClick={this._createAssetWallet}>Create {walletUserData.coin_name} Wallet</Button>
                                </React.Fragment>
                                : 'testing'
                        : ''
                }
                {loader && <FaldaxLoader />}
            </ParentDiv>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user')
    }), { logout })(WalletOverview);
