import React, { Component } from "react";
import {
  notification,
  Tabs,
  Row,
  Col,
  Card,
  Table,
  Divider,
  Tag,
  Icon,
} from "antd";
import { connect } from "react-redux";
import authAction from "../../../redux/auth/actions";
import { withRouter } from "react-router-dom";
import { TradeHeadRow, TradeTable } from "../../App/tradeStyle";

const { logout } = authAction;
// var self;
class AllPendingOrders extends Component {
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
        title: "Side",
        dataIndex: "side",
        key: "side",
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
      },
      {
        title: "Limit Price",
        dataIndex: "limit_price",
        key: "price",
      },
      {
        title: "Stop Price",
        dataIndex: "stop_price",
        key: "price",
      },
      {
        title: "Fill Price",
        dataIndex: "fill_price",
        key: "fill_price",
      },
      {
        title: "Time",
        dataIndex: "time",
        key: "time",
      },
      {
        title: "Placed By",
        dataIndex: "placed_by",
        key: "placed_by",
      },
      {
        title: "Total",
        dataIndex: "total",
        key: "total",
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: () => <Icon type="close-circle" />,
      },
    ];
    const data = [];
    for (let index = 0; index < 100; index++) {
      data.push({
        key: index,
        side: "Buy",
        amount: 0.001,
        price: 0.000456,
        placed_by: "Bot",
        time: "17/04/2020, 11:39:30",
        total: "2.5000",
      });
    }

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }
    return (
      <Card>
        <TradeHeadRow type="flex" justify="space-between">
          <Col span={12}>
            <label>All Pending Orders</label>
          </Col>
        </TradeHeadRow>
        <TradeTable
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ y: 600 }}
        />
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
  )(AllPendingOrders)
);
