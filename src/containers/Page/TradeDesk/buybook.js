import React, { Component } from "react";
import { notification, Tabs, Row, Col, Card, Table, Divider, Tag } from "antd";
import { connect } from "react-redux";
import authAction from "../../../redux/auth/actions";
import { withRouter } from "react-router-dom";
import { TradeHeadRow, TradeTable } from "../../App/tradeStyle";

const { logout } = authAction;
// var self;
class BuyBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errMsg: false,
      errType: "Success",
      loader: false,
    };
    // self = this;
  }

  componentDidMount = () => {};

  hideLoader() {
    this.setState({ loader: false });
  }

  showLoader() {
    this.setState({ loader: true });
  }

  render() {
    const { errType, errMsg } = this.state;
    const columns = [
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
      },
      {
        title: "Bid",
        dataIndex: "bid",
        key: "bid",
      },
      {
        title: "Total",
        dataIndex: "total",
        key: "total",
      },
    ];

    const data = [];
    for (let index = 0; index < 100; index++) {
      data.push({
        key: index,
        amount: "1.00",
        bid: "0.005",
        total: "2.5000",
      });
    }

    return (
      <>
        <Card>
          <TradeHeadRow type="flex" justify="space-between">
            <Col span={12}>
              <label>Buying XRP</label>
            </Col>
            <Col className="text-right" span={12}>
              <span>
                <b>Total: </b>
              </span>
              <span>0 BTC</span>
            </Col>
          </TradeHeadRow>
          <TradeTable
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered={false}
            scroll={{ y: 600 }}
          />
        </Card>
      </>
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
  )(BuyBook)
);
