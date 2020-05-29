import React, { Component } from "react";
import {
  TradeRow,
  HeadRowWallet,
  WalletCard,
  CreateWalletRow,
  LabelRow,
  TradeHeadRow,
} from "../../App/tradeStyle";
import {
  Col,
  Card,
  Button,
  Row,
  Table,
  Tooltip,
  Icon,
  Form,
  Input,
  Modal,
  notification,
} from "antd";
import ApiUtils from "../../../helpers/apiUtills";
import authAction from "../../../redux/auth/actions";
import SimpleReactValidator from "simple-react-validator";
import { PrecisionCell } from "../../../components/tables/helperCells";
import Loader from "../faldaxLoader";
import { withRouter } from "react-router";
import { connect } from "react-redux";
const { logout } = authAction;
var self;
const columns = [
  {
    title: "Action",
    dataIndex: "",
    key: "action",
    render: (text, record) => (
      <>
        <Tooltip className="cursor-pointer" title="Send">
          <Icon
            type="export"
            onClick={() => TradeWallets.openSendModal(record)}
          ></Icon>
        </Tooltip>
        <Tooltip className="btn-icon" title="View Transaction History">
          <Icon
            // onClick={() => TradeWallets.navigateToView(object["coin_code"])}
            onClick={() =>
              TradeWallets.navigateToView(record.coin_code, "2105")
            }
            type="info-circle"
          ></Icon>
        </Tooltip>
      </>
    ),
  },
  {
    title: "Asset",
    dataIndex: "coin",
    key: "coin",
  },
  {
    title: "Balance",
    dataIndex: "placed_balance",
    key: "placed_balance",
    render: (text, record) => parseFloat(text).toFixed(8),
  },
  {
    title: "Equivivalent USD Value",
    dataIndex: "fiat_value",
    key: "fiat_value",
    render: (text, record) => (
      <>{parseFloat(record.placed_balance * record.fiat_value).toFixed(2)}</>
    ),
  },
  {
    title: "In order assets",
    dataIndex: "balance",
    key: "balance",
    render: (text, record) => (
      <>{parseFloat(record.balance - record.placed_balance).toFixed(8)}</>
    ),
  },
  {
    title: "Total",
    dataIndex: "balance",
    key: "balance",
    render: (text, record) => parseFloat(text).toFixed(8),
  },
  {
    title: "Wallet Address",
    dataIndex: "receive_address",
    key: "receive_address",
    render: (text) => <span>{text}</span>,
    width: 400,
  },
];
class TradeWallets extends Component {
  constructor(props) {
    super(props);
    this.timer = 1000; //1.5 seconds
    this.timeCounter = undefined;
    this.state = {
      data: [],
      loader: true,
      sendModal: false,
      walletDetails: {},
      fields: {},
      networkFee: 0,
    };
    this.timeInterval = null;
    this.loader = {
      show: () => this.setState({ loader: true }),
      hide: () => this.setState({ loader: false }),
    };
    self = this;
    this.validator = new SimpleReactValidator({
      gtzero: {
        message: "value must be greater than zero",
        rule: (val, params, validator) => {
          if (val > 0) {
            return true;
          } else {
            return false;
          }
        },
        required: true,
      },
    });
  }
  async componentDidMount() {
    await this.getWalletData();
    this.timeInterval = setInterval(() => {
      this.getWalletData(false);
    }, 10000);
  }
  static openSendModal = async (values) => {
    // await self.getAssetAvailableBalance(values.coin_code, values);
    self.setState({ sendModal: true, walletDetails: values });
  };
  static navigateToView = (transaction_hash, userid) => {
    self.props.history.push({
      pathname: `/dashboard/transaction-history/`,
      state: { transaction_hash: transaction_hash, userid: userid },
    });
  };

  getWalletData = async (showLoader = true) => {
    if (showLoader) {
      this.setState({ loader: true });
    }
    let { data, message, status } = await (
      await ApiUtils.getTradeDeskBalance(this.props.token)
    ).json();
    if (status == 200) {
      this.setState({
        data: data,
        loader: showLoader ? false : this.state.loader,
      });
    }
  };

  _handleChange = (field, e) => {
    if (this.state.loader) {
      return false;
    }
    clearTimeout(this.timeCounter);
    let { token } = this.props,
      { fields, walletDetails } = this.state;
    if (e.target.value.trim() == "") {
      fields[field] = "";
    } else {
      fields[field] = e.target.value;
    }
    this.setState({ fields }, () => {
      if (this.validator.allValid()) {
        this.timeCounter = setTimeout(async () => {
          try {
            this.loader.show();
            let res = await (
              await ApiUtils.getWalletNetworkFee(token, {
                dest_address: fields["dest_address"],
                amount: fields["amount"],
                coin: walletDetails.coin_code,
              })
            ).json();
            if (res.status == 200) {
              this.setState({ networkFee: res.data });
            } else if (
              res.status == 400 ||
              res.status == 401 ||
              res.status == 403
            ) {
              this.openNotificationWithIcon("Error", res.err);
              this.props.logout();
            } else {
              this.openNotificationWithIcon(
                "Error",
                res.err ? res.err : res.message
              );
            }
          } catch (error) {
            this.openNotificationWithIcon(
              "Error",
              "Unable to complete the requested action."
            );
          } finally {
            this.loader.hide();
          }
        }, this.timer);
      } else {
        this.setState({ networkFee: 0 });
        this.validator.showMessages();
        this.forceUpdate();
      }
    });
  };
  openNotificationWithIcon = (
    type = "Error",
    message = "Unable to complete the requested action."
  ) => {
    notification[type.toLowerCase()]({
      message: type,
      description: message,
    });
  };

  sendWalletBal = async () => {
    const { token } = this.props;
    const { fields, walletDetails, networkFee } = this.state;
    let formData = {
      amount: fields["amount"],
      destination_address: fields["dest_address"],
      coin_code: walletDetails.coin_code,
      networkFees: parseFloat(networkFee) ? parseFloat(networkFee) : 0,
      total_fees:
        parseFloat(fields["amount"]) && parseFloat(networkFee)
          ? (parseFloat(fields["amount"]) + parseFloat(networkFee)).toFixed(8)
          : 0,
    };
    if (this.validator.allValid()) {
      try {
        this.loader.show();
        let res = await (
          await ApiUtils.sendWalletBalanceTradedesk(token, formData)
        ).json();
        let [{ data, status, err, message }, { logout }] = [res, this.props];
        if (status == 200) {
          this.openNotificationWithIcon("Success", message);
          // this.getWalletData();
        } else if (status == 403) {
          this.openNotificationWithIcon("Error", err);
          logout();
        } else {
          this.openNotificationWithIcon("Error", message ? message : err);
        }
        this.closeSendModal();
      } catch (err) {
        this.openNotificationWithIcon(
          "Error",
          "Unable to complete the requested action."
        );
      } finally {
        this.loader.hide();
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  closeSendModal = () => {
    this.validator = new SimpleReactValidator({
      gtzero: {
        // name the rule
        message: "value must be greater than zero",
        rule: (val, params, validator) => {
          if (val > 0) {
            return true;
          } else {
            return false;
          }
        },
        required: true, // optional
      },
    });
    this.setState({
      sendModal: false,
      fields: {},
      walletDetails: [],
      networkFee: 0,
    });
  };
  componentWillUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }
  render() {
    const { walletDetails, sendModal, fields, networkFee, loader } = this.state;
    return (
      <Card style={{ marginBottom: "13px" }}>
        <TradeRow gutter={16}>
          <Col span={24}>
            <Table
              title={() => (
                <TradeHeadRow>
                  <Col span={12}>
                    <label>Wallets</label>
                  </Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    <Button
                      type="primary"
                      icon="reload"
                      onClick={this.getWalletdata}
                    />
                  </Col>
                </TradeHeadRow>
              )}
              columns={columns}
              dataSource={this.state.data}
              pagination={false}
              loading={this.state.loader}
              // scroll={{ x: "max-content", y: "70vh" }}
            />
          </Col>
        </TradeRow>
        <Modal
          title="Send"
          visible={sendModal}
          onOk={this.closeSendModal}
          onCancel={this.closeSendModal}
          footer={[
            <Button key="submit-a" type="primary" onClick={this.sendWalletBal}>
              Send {walletDetails.coin}
            </Button>,
          ]}
        >
          {/* <span className="wallet-send-summery-title">
            <b>Total Balance </b>
          </span>
          <span>
            {PrecisionCell(walletDetails.total_earned_from_wallets) == "-"
              ? 0
              : PrecisionCell(walletDetails.total_earned_from_wallets)}{" "}
            {walletDetails.coin}
          </span>
          <br />
          <span className="wallet-send-summery-title">
            <b>Available Balance </b>
          </span>
          <span>
            {PrecisionCell(availableBalance) == "-"
              ? 0
              : PrecisionCell(availableBalance)}{" "}
            {walletDetails.coin}
          </span> */}
          <Form onSubmit={this._sendWalletBal}>
            <div className="table-tb-margin">
              <span>Destination Address:</span>
              <Input
                placeholder="Destination Address"
                onChange={(e) => this._handleChange("dest_address", e)}
                value={fields["dest_address"]}
              />
              <span style={{ color: "red" }}>
                {this.validator.message(
                  "destination address",
                  fields["dest_address"],
                  "required",
                  "text-danger-validation"
                )}
              </span>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <span>Amount:</span>
              <Input
                placeholder="Amount"
                onChange={(e) => this._handleChange("amount", e)}
                value={fields["amount"]}
              />
              <span style={{ color: "red" }}>
                {this.validator.message(
                  "amount",
                  fields["amount"],
                  // `required|numeric|gte:${
                  //   walletDetails.min_limit == 0
                  //     ? 0
                  //     : walletDetails.min_limit
                  //     ? parseFloat(walletDetails.min_limit).toFixed(8)
                  //     : 0
                  // }|lte:${availableBalance}`,
                  "required|numeric",
                  "text-danger"
                )}
              </span>
            </div>
            <div className="clearfix">
              <div className="float-left">
                {/* <span className="wallet-send-summery-head"><b>Sending Amount</b></span><span>{fields["amount"] || 0} {walletDetails.coin}</span><br /> */}
                <span className="wallet-send-summery-head">
                  <b>Network Fee</b>
                </span>
                <span>
                  {networkFee} {walletDetails.coin}
                </span>
                <br />
                <span className="wallet-send-summery-head">
                  <b>Total Payload</b>
                </span>
                <span>
                  {parseFloat(fields["amount"]) && parseFloat(networkFee)
                    ? (
                        parseFloat(fields["amount"]) + parseFloat(networkFee)
                      ).toFixed(8)
                    : 0}{" "}
                  {walletDetails.coin}
                </span>
                <br />
              </div>
              <div className="float-right">
                <span className="wallet-send-summery-head">
                  <b>Fiat Value</b>
                </span>
                <span>
                  $&nbsp;
                  {parseFloat(
                    parseFloat(walletDetails.fiat_value || 0) *
                      parseFloat(fields["amount"] || 0)
                  ).toFixed(2)}
                </span>
                <br />
              </div>
            </div>
          </Form>
        </Modal>
        {loader && <Loader />}
      </Card>
    );
  }
}
export default withRouter(
  connect(
    (state) => ({
      token: state.Auth.get("token"),
      user: state.Auth.get("user"),
    }),
    { logout }
  )(TradeWallets)
);
