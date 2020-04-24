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
import moment from "moment";

const { logout } = authAction;
// var self;
class OrderHistory extends Component {
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
    this.props.io.on("trade-history-data", data => {
      this.updateData(data);
    });
  };
  updateData = (data) => {
    const rows = [];
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      var date = moment.utc(element.created_at)
        .local()
        .format("DD/MM/YYYY, H:m:s");
      rows.push({
        side: element.side,
        amount: Number(element.quantity).toFixed(8),
        fill_price: Number(element.fill_price).toFixed(8),
        time: date,
        total: Number(element.quantity * element.fill_price).toFixed(8)
      });
    }
    this.setState({ data: rows }, () => { /* this.props.onLoadComplete() */ })
  }


  render() {
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
        title: "Total",
        dataIndex: "total",
        key: "total",
      },
    ];


    return (
      <Card>
        <TradeHeadRow type="flex" justify="space-between">
          <Col span={12}>
            <label>Order History</label>
          </Col>
        </TradeHeadRow>
        <TradeTable
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          scroll={{ y: 200 }}
          loading={this.props.loading}
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
  )(OrderHistory)
);
