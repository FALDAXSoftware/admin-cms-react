import React, { Component } from "react";
import { notification, Tabs, Row, Col, Card, Table, Divider, Tag } from "antd";
import { connect } from "react-redux";
import authAction from "../../../redux/auth/actions";
import { withRouter } from "react-router-dom";
import { TradeHeadRow, TradeTable } from "../../App/tradeStyle";

const { logout } = authAction;
// var self;
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
    })
  }
  openNotificationWithIconError = (type) => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage,
    });
    this.setState({ errMsg: false });
  };

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

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }
    return (
      <>
        <Card className="lessPaddingCard">
          <TradeHeadRow type="flex" justify="space-between">
            <Col span={12}>
              <label>Selling {this.props.crypto}</label>
            </Col>
            <Col className="text-right" span={12}>
              <span>
                <b>Total: </b>
              </span>
              <span>{this.state.data.length ? Number(this.state.data[this.state.data.length - 1].total).toFixed(8) : 0} {this.props.currency}</span>
            </Col>
          </TradeHeadRow>
          <TradeTable
            columns={columns}
            dataSource={this.state.data}
            pagination={false}
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
  )(SellBook)
);
