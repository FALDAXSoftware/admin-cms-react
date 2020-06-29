import React, { Component } from "react";
import { notification, Tabs, Row, Col, Card, Table, Divider, Tag } from "antd";
import { connect } from "react-redux";
import authAction from "../../../redux/auth/actions";
import { withRouter } from "react-router-dom";
import { TradeHeadRow, TradeTable } from "../../App/tradeStyle";
import moment from "moment";
import { Precise } from "../../../components/tables/helperCells";

const { logout } = authAction;
// var self;
class CompletedOrders extends Component {
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
    // const { errType, errMsg } = this.state;
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
          `${Precise(text, this.props.amountPrecision)} ${
            record.settle_currency
          }`,
      },
      {
        title: "Fill Price",
        dataIndex: "fill_price",
        key: "fill_price",
        render: (text, record) =>
          `${Precise(text, this.props.pricePrecision)} ${record.currency}`,
      },
      {
        title: "Unfilled",
        dataIndex: "unfilled",
        key: "unfilled",
        render: (text, record) =>
          `${Precise(
            record.fix_quantity - record.quantity,
            this.props.amountPrecision
          )}`,
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
            record.quantity * record.fill_price,
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
  )(CompletedOrders)
);
