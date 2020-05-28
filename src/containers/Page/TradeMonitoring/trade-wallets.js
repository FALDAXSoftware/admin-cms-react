import React, { Component } from "react";
import {
  TradeRow,
  HeadRowWallet,
  WalletCard,
  CreateWalletRow,
  LabelRow,
  TradeHeadRow,
} from "../../App/tradeStyle";
import { Col, Card, Button, Row, Table, Tooltip, Icon } from "antd";
import ApiUtils from "../../../helpers/apiUtills";
import authAction from "../../../redux/auth/actions";
import { withRouter } from "react-router";
import { connect } from "react-redux";
const { logout } = authAction;
const columns = [
  {
    title: "Action",
    dataIndex: "",
    key: "action",
    render: (object) => (
      <>
        <Tooltip className="cursor-pointer" title="Send">
          <Icon type="export" onClick={() => console.log("hello")}></Icon>
        </Tooltip>
        <Tooltip className="btn-icon" title="View Transaction History">
          <Icon
            // onClick={() => TradeWallets.navigateToView(object["coin_code"])}
            onClick={() => TradeWallets.navigateToView("tbch")}
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
    this.state = {
      data: [],
      loader: true,
    };
    this.timeInterval = null;
  }
  componentDidMount() {
    this.getWalletdata();
    this.timeInterval = setInterval(() => {
      this.getWalletdata(false);
    }, 10000);
  }
  static navigateToView = (coin_code) => {
    // let { walletValue } = this.state;
    // let assets = [];
    // walletValue.map((ele) => {
    //   assets.push({
    //     name: ele.coin,
    //     value: ele.coin_code,
    //     icon: ele.coin_icon,
    //   });
    //   return ele;
    // });
    this.props.history.push({
      pathname: `./wallet/faldax/${coin_code}`,
      // state: { assets: JSON.stringify(assets) },
    });
  };
  getWalletdata = (showLoader = true) => {
    if (showLoader) {
      this.setState({ loader: true });
    }
    ApiUtils.getTradeDeskBalance(this.props.token)
      .then((response) => response.json())
      .then((res) => {
        this.setState({ data: res.data, loader: false });
        console.log("^^^", res.data);
      });
  };
  componentWillUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }
  render() {
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
