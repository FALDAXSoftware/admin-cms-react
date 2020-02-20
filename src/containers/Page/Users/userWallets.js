import React, { Component } from "react";
import ApiUtils from "../../../helpers/apiUtills";
import { connect } from "react-redux";
import { Row, Col, notification, Card, Button } from "antd";
import authAction from "../../../redux/auth/actions";
import styled from "styled-components";
import { BUCKET_URL } from "../../../helpers/globals";
import FaldaxLoader from "../faldaxLoader";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { isAllowed } from "../../../helpers/accessControl";
import { PrecisionCell } from "../../../components/tables/helperCells";

const { logout } = authAction;

const ParentDiv = styled.div`
`;
const Image = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 10px;
`;
const WalletRow = styled(Row)`
    display: flex !important;
    flex-wrap: wrap;
`;
const WalletCol = styled(Col)`
  display: flex !important;
  width: 50% !important;
  flex-wrap: nowrap;
  > .ant-card {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    > .ant-card-head {
      display: flex;
      width: 100%;
      align-self: flex-start;
      > .ant-card-head-wrapper{
            width:100%;
          > .ant-card-head-title{
              width:100%;
          }
      }
    }
    > .ant-card-body {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      > p {
        display: flex;
        width: 100%;
      }
    }
    > .ant-card-actions {
      display: flex;
      width: 100%;
      align-self: flex-end;
      > li {
        width: 100%;
        justify-content: center;
      }
    }
  }
`;

class UserWallets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userWallets: [],
            errType: "error",
            loader: false
        };
    }

    componentDidMount = () => {
        this._getUserWallets();
    };

    _getUserWallets = () => {
        const { token, user_id } = this.props;
        console.log(this.props)
        let _this = this;
        this.setState({ loader: true });
        ApiUtils.getUserWallets(token, user_id)
            .then(response => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ userWallets: res.data, loader: false });
                } else if (res.status == 403) {
                    _this.setState(
                        { errMsg: true, errMessage: res.err, errType: "error", loader: false },
                        () => {
                            _this.props.logout();
                        }
                    );
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, loader: false });
                }
            })
            .catch(err => {
                _this.setState({ errMsg: true, errMessage: "Unable to complete the requested action.", loader: false });
                console.log(err);
            });
    };

    _createUserWallet = asset => {
        const { token, user_id } = this.props;
        let code = asset.coin;

        this.setState({ loader: true });
        let _this = this;

        ApiUtils.generateUserWalletAddress(token, code, user_id)
            .then(res => res.json())
            .then(res => {
                if (res.status == 200) {
                    _this.setState({
                        errMsg: true,
                        errMessage: res.message,
                        errType: "Success"
                    });
                    _this._getUserWallets();
                } else if (res.status == 403) {
                    _this.setState(
                        { errMsg: true, errMessage: res.err, errType: "error" },
                        () => {
                            _this.props.logout();
                        }
                    );
                } else {
                    _this.setState({
                        errMsg: true,
                        errMessage: res.err,
                        errType: "error"
                    });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true,
                    errMessage: "Unable to complete the requested action.",
                    loader: false,
                    errType: "error"
                });
            });
    };
    _copyNotification = () => {
        this.setState({
            errMsg: true,
            errType: "Info",
            errMessage: "Copied to Clipboard!!"
        });
    };

    openNotificationWithIconError = type => {
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
                <WalletRow className="main_wallet_row">
                    {userWallets &&
                        userWallets.length > 0 &&
                        userWallets.map(wallet => {
                            let coinTitle = (
                                <div>
                                    <div className="float-left">
                                        <Image src={BUCKET_URL + wallet.coin_icon} />
                                        <span>{wallet.coin_code}</span>
                                    </div>
                                    <div className="float-right">
                                        <span>{wallet.placed_balance ? PrecisionCell(wallet.placed_balance) : 0.0}</span>
                                    </div>
                                </div>
                            );
                            return (
                                <WalletCol xs={{ span: 7 }} lg={{ span: 12 }}>
                                    <Card
                                        title={coinTitle}
                                        actions={[
                                            wallet.receive_address == "" && isAllowed("create_wallet") ? (
                                                isAllowed("create_wallet") && (<Button
                                                    type="primary"
                                                    onClick={this._createUserWallet.bind(this, wallet)}
                                                >
                                                    Create Wallet
                                               </Button>)
                                            ) : (
                                                    ""
                                                )
                                        ]}
                                    >
                                        {/* <p>
                                            <b>HOT Send Address : </b>{" "}
                                            <CopyToClipboard
                                                className="cursor-pointer"
                                                text={wallet.send_address}
                                                onCopy={this._copyNotification}
                                            >
                                                <span>{wallet.send_address}</span>
                                            </CopyToClipboard>
                                        </p> */}
                                        <p>
                                            <b>Address : </b>
                                            <CopyToClipboard
                                                className="cursor-pointer"
                                                text={wallet.receive_address}
                                                onCopy={this._copyNotification}
                                            >
                                                <span>{wallet.receive_address}</span>
                                            </CopyToClipboard>
                                        </p>
                                    </Card>
                                </WalletCol>
                            );
                        })}
                    {loader && <FaldaxLoader />}
                </WalletRow>
            </ParentDiv>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get("token"),
        user: state.Auth.get("user")
    }),
    { logout }
)(UserWallets);