import React, { Component } from "react";
import { notification, Tabs, Row, Col, Card, Table, Divider, Tag } from "antd";
import { connect } from "react-redux";
import authAction from "../../../redux/auth/actions";
import { withRouter } from "react-router-dom";
import { TradeTable } from "../../App/tradeStyle";
import moment from "moment";
import { Precise } from "../../../components/tables/helperCells";

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

  render() {
    const columns = [
      {
        title: "Side",
        dataIndex: "side",
        key: "side",
      },
      {
        title: "Amount",
        dataIndex: "quantity",
        key: "quantity",
        render: (text, record) =>
          `${Precise(text, this.props.amountPrecision)}`,
      },
      {
        title: "Price",
        dataIndex: "limit_price",
        key: "limit_price",
        render: (text, record) => `${Precise(text, this.props.pricePrecision)}`,
      },
      {
        title: "Time",
        dataIndex: "time",
        key: "time",
        render: (text, record) =>
          `${moment
            .utc(record.created_at)
            .local()
            .format("DD/MM/YYYY, H:m:s")}`,
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
        render: (text, record) =>
          `${Precise(
            record.quantity * record.limit_price,
            this.props.pricePrecision
          )}`,
      },
      {
        title: "Order Type",
        dataIndex: "order_type",
        key: "order_type",
        width: 150,
      },
    ];
    return (
      <TradeTable
        columns={columns}
        dataSource={this.props.data}
        pagination={false}
        scroll={{ y: 200 }}
        loading={this.props.loading}
      />
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
