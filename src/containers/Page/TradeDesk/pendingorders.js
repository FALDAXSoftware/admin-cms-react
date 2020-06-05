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
  Button,
} from "antd";
import { connect } from "react-redux";
import authAction from "../../../redux/auth/actions";
import { withRouter } from "react-router-dom";
import { TradeHeadRow, TradeTable } from "../../App/tradeStyle";
import moment from "moment";
import ApiUtils from "../../../helpers/apiUtills";
import { Precise } from "../../../components/tables/helperCells";

const { logout } = authAction;
// var self;
class PendingOrders extends Component {
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

  onCancle = (id, side, type) => {
    ApiUtils.cancleOrder(this.props.token, {
      id: id,
      side: side,
      order_type: type,
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.status === 200) {
          // this.orderSocket(this.state.timePeriod, this.state.status);
          notification.success({
            message: "Success",
            description: responseData.message,
          });
        } else {
          notification.error({
            message: "Error",
            description: responseData.err,
          });
        }
      });
  };

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
        title: "Limit Price",
        dataIndex: "limit_price",
        key: "limit_price",
        render: (text, record) => `${Precise(text, this.props.pricePrecision)}`,
      },
      {
        title: "Stop Price",
        dataIndex: "stop_price",
        key: "stop_price",
        render: (text, record) =>
          `${text ? Precise(text, this.props.pricePrecision) : "-"}`,
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
        width: 150,
      },
      {
        title: "Placed By",
        dataIndex: "placed_by",
        key: "placed_by",
        width: 150,
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
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (text, record) => (
          <Icon
            type="close-circle"
            onClick={() => {
              this.onCancle(record.id, record.side, record.order_type);
            }}
          />
        ),
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
  )(PendingOrders)
);
