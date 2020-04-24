import React, { Component } from "react";
import { notification, Tabs, Row, Col, Card, Table, Divider, Tag } from "antd";
import { connect } from "react-redux";
import authAction from "../../../redux/auth/actions";
import { withRouter } from "react-router-dom";
import { TradeTable } from "../../App/tradeStyle";
import moment from "moment";

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

  componentDidMount = () => { };


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
        render: (text, record) => (`${Number(text).toFixed(8)}`)
      },
      {
        title: "Price",
        dataIndex: "limit_price",
        key: "limit_price",
        render: (text, record) => (`${Number(text).toFixed(8)}`)
      },
      {
        title: "Time",
        dataIndex: "time",
        key: "time",
        render: (text, record) => (`${moment.utc(record.created_at).local().format("DD/MM/YYYY, H:m:s")}`)
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
        render: (text, record) => (`${Number(record.quantity * record.limit_price).toFixed(8)}`)
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
