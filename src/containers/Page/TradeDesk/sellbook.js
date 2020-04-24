import React, { Component } from "react";
import { Col, Card } from "antd";
import { connect } from "react-redux";
import authAction from "../../../redux/auth/actions";
import { withRouter } from "react-router-dom";
import { TradeHeadRow, TradeTable } from "../../App/tradeStyle";

const { logout } = authAction;
// var self;
const columns = [
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Ask",
    dataIndex: "ask",
    key: "ask",
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
  },
];
class SellBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errMsg: false,
      errType: "Success",
      loader: false,
      data: []
    };
    // self = this;
  }

  componentDidMount = () => {
    this.props.io.on("sell-book-data", (data) => {
      this.updateData(data);
    });
  };
  updateData = (data) => {
    const row = [];
    let sum = 0;
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      sum += element.quantity * element.price;
      row.push({
        amount: Number(element.quantity).toFixed(8),
        ask: Number(element.price).toFixed(8),
        total: Number(sum).toFixed(8)
      });
    }
    this.setState({
      data: row
    }, () => { /* this.props.onLoadComplete() */ })
  }

  render() {
    return (
      <>
        <Card className="lessPaddingCard">
          <TradeHeadRow type="flex" justify="space-between">
            <Col span={12}>
              <label>Selling {this.props.crypto}</label>
            </Col>
            {/* <Col className="text-right" span={12}>
              <span>
                <b>Total: </b>
              </span>
              <span>{this.state.data.length ? Number(this.state.data[this.state.data.length - 1].total).toFixed(8) : 0} {this.props.currency}</span>
            </Col> */}
          </TradeHeadRow>
          <TradeTable
            columns={columns}
            dataSource={this.state.data}
            pagination={false}
            scroll={{ y: 497 }}
            className="bookTable"
            loading={this.props.loading}
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
  )(SellBook)
);
