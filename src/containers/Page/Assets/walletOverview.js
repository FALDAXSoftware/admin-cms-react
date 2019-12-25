import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Divider, Button, notification, Row, Card, Col } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import authAction from '../../../redux/auth/actions';
import styled from 'styled-components';
import FaldaxLoader from '../faldaxLoader';
import { withRouter } from 'react-router';
import { isAllowed } from '../../../helpers/accessControl';

const { logout } = authAction;

const ParentDiv = styled.div`
    background-color: white;
    margin: 30px !important;
`

class WalletOverview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            walletUserData: [],
            loader:false
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
        _this.setState({loader:true})
        ApiUtils.getWalletDetails(token, formData)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ walletUserData: res.walletUserData ,loader:false})
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error',loader:false }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error',loader:false });
                }
            })
            .catch((err) => {
                _this.setState({ errMsg: true, errMessage: err, errType: 'error',loader:false });
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
        let _this = this;

        ApiUtils.generateWalletAddress(token, code, 36)
            .then((res) => res.json())
            .then((res) => {
                if (res.status == 200) {
                    _this.setState({
                        errMsg: true, errMessage: res.message, errType: 'Success'
                    }, () => {
                        _this.props.history.push('/dashboard/assets');
                    });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' });
                }
                _this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({
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
            <ParentDiv>
                <Divider>{walletUserData.coin} Wallet</Divider>
                {
                    Object.keys(walletUserData).length > 0 ? (walletUserData.is_admin && walletUserData.flag == 0) ?
                        <div style={{ background: '#ECECEC' }}>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Card title="HOT Send Wallet Address" bordered={false}>
                                        <span style={{ wordWrap: 'break-word' }}>
                                            {Object.keys(walletUserData).length > 0 ? walletUserData.send_address : ""}
                                        </span>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="HOT Receive Wallet Address" bordered={false}>
                                        <span style={{ wordWrap: 'break-word' }}>
                                            {Object.keys(walletUserData).length > 0 ? walletUserData.receive_address : ""}
                                        </span>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="Balance" bordered={false}>
                                        {walletUserData.balance}  {walletUserData.coin_code}
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        :
                        walletUserData && walletUserData.flag == 1 ?
                            <div className="kyc-div">
                                <div>
                                    <div>
                                        <p>Please wait for some time. As soon as your wallet is created , we'll let you know.</p>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="kyc-div">
                                <p>Your wallet is not created yet. Please click on the button below to create your wallet for {walletUserData.coin_name}.</p>
                                <Button type='primary' disabled={!isAllowed('coin_create_wallet')} onClick={this._createAssetWallet}>Create {walletUserData.coin_name} Wallet</Button>
                            </div>
                        : ''
                }
                {loader && <FaldaxLoader />}
            </ParentDiv>
        );
    }
}

export default withRouter(connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user')
    }), { logout })(WalletOverview));
