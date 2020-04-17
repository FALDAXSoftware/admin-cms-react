import React, { Component } from "react";
import { notification, Tabs, Row, Col, Card, Table, Divider, Tag } from "antd";
import { connect } from "react-redux";
import authAction from "../../../redux/auth/actions";
import { withRouter } from "react-router-dom";
import { TradeHeadRow, TradeTable } from "../../App/tradeStyle";

const { logout } = authAction;
// var self;
class CancelledOrders extends Component {
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
    const data = [];
    for (let index = 0; index < 100; index++) {
      data.push({
        key: index,
        amount: "1.00",
        bid: "0.005",
        total: "2.5000",
      });
    }

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }
    return (
      <>
        <Card>
          <TradeHeadRow type="flex" justify="space-between">
            <Col span={12}>
              <label>Cancelled Orders</label>
            </Col>
          </TradeHeadRow>
          <TradeTable
            columns={columns}
            dataSource={data}
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
  )(CancelledOrders)
);
