import React, { Component } from "react";
import {
  TradeRow,
  HeadRowWallet,
  WalletCard,
  CreateWalletRow,
  LabelRow,
  TradeHeadRow,
} from "../../App/tradeStyle";
import { Col, Card, Button, Row, Table } from "antd";
import ApiUtils from "../../../helpers/apiUtills";
import authAction from "../../../redux/auth/actions";
import { withRouter } from "react-router";
import { connect } from "react-redux";
const { logout } = authAction;
const columns = [
  {
    title: 'Asset',
    dataIndex: 'coin',
    key: 'coin',
  },
  {
    title: 'Balance',
    dataIndex: 'placed_balance',
    key: 'placed_balance',
    render: (text, record) => parseFloat(text).toFixed(8)
  },
  {
    title: 'In order assets',
    dataIndex: 'balance',
    key: 'balance',
    render: (text, record) => (<>{parseFloat(record.balance - record.placed_balance).toFixed(8)}</>)
  },
  {
    title: 'Total',
    dataIndex: 'balance',
    key: 'balance',
    render: (text, record) => parseFloat(text).toFixed(8)
  },
  {
    title: 'Wallet Address',
    dataIndex: 'receive_address',
    key: 'receive_address',
  },
]
class TradeWallets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loader: true
    };
  }
  componentDidMount() {
    this.getWalletdata()
  }
  getWalletdata = () => {
    this.setState({ loader: true });
    ApiUtils.getTradeDeskBalance(this.props.token).then((response) => response.json()).then((res) => {
      this.setState({ data: res.data, loader: false });

    })
  }
  render() {
    return (
      <Card style={{ marginBottom: "13px" }}>
        {/* <TradeHeadRow gutter={16}>
          <Col span={12}>
            <label>Wallets</label>
          </Col>
        </TradeHeadRow> */}
        <TradeRow gutter={16}>
          <Col span={24}>
            <Table
              columns={columns}
              dataSource={this.state.data}
              pagination={false}
              loading={this.state.loader}
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
