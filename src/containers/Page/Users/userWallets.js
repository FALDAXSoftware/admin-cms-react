import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Row, Col, notification, Card, Button } from 'antd';
import authAction from '../../../redux/auth/actions';
import styled from 'styled-components';
import { BUCKET_URL } from '../../../helpers/globals';
import FaldaxLoader from '../faldaxLoader';

const { logout } = authAction;

const ParentDiv = styled.div`
    padding: 20px;
    margin: 30px !important;
`
const Image = styled.img`
    width: 25px;
    height: 25px;
    margin-right: 10px
`

class UserWallets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userWallets: [],
            errType: 'error',
            loader: false
        }
    }

    componentDidMount = () => {
        this._getUserWallets();
    }

    _getUserWallets = () => {
        const { token, user_id } = this.props;
        let _this = this;

        ApiUtils.getUserWallets(token, user_id)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ userWallets: res.data });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch((err) => {
                console.log(err)
            });
    }

    _createUserWallet = (asset) => {
        const { token, user_id } = this.props;
        let code = asset.coin;

        this.setState({ loader: true });
        let _this = this;

        ApiUtils.generateUserWalletAddress(token, code, user_id)
            .then((res) => res.json())
            .then((res) => {
                if (res.status == 200) {
                    _this.setState({
                        errMsg: true, errMessage: res.message, errType: 'Success'
                    });
                    _this._getUserWallets();
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

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    render() {
        const { userWallets, errMsg, errType, loader } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <ParentDiv>
                <Row>
                    {userWallets && userWallets.length > 0 &&
                        userWallets.map((wallet) => {
                            let coinTitle = <div>
                                <Image src={BUCKET_URL + wallet.coin_icon} />
                                <span>{wallet.coin_code}</span>
                            </div>
                            return (
                                <Col xs={{ span: 7 }} lg={{ span: 12 }}>
                                    <Card title={coinTitle}
                                        actions={[
                                            wallet.send_address == '' && wallet.send_address == '' ?
                                                <Button type="primary" onClick={this._createUserWallet.bind(this, wallet)}>Create Wallet</Button>
                                                : ''
                                        ]}>
                                        <p><b>HOT Send Address : </b> <span>{wallet.send_address}</span></p>
                                        <p><b>HOT Receive Address : </b><span>{wallet.receive_address}</span></p>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                    {loader && <FaldaxLoader />}
                </Row>
            </ParentDiv>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user')
    }), { logout })(UserWallets);
