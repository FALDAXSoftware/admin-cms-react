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
class AllPendingOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errMsg: false,
      errType: "Success",
      loader: false,
      data: [],
      id: null
    };
    // self = this;
  }

  componentDidMount = () => {
    this.props.io.on("all-pending-orders-data", data => {
      this.setState({
        data: data.data,
        id: data.id
      })
    });
  };



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
        dataIndex: "quantity",
        key: "quantity",
        render: (text, record) => (`${Number(text).toFixed(8)}`)
      },
      {
        title: "Limit Price",
        dataIndex: "limit_price",
        key: "limit_price",
        render: (text, record) => (`${Number(text).toFixed(8)}`)
      },
      {
        title: "Stop Price",
        dataIndex: "stop_price",
        key: "stop_price",
        render: (text, record) => (`${text ? Number(text).toFixed(8) : "-"}`)
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
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (text, record) => (record.user_id == this.state.id ? <Icon type="close-circle" onClick={() => { this.onCancle(record.encript_id, record.side, record.order_type) }} /> : "-"),
      },
    ];

    return (
      <Card>
        <TradeHeadRow type="flex" justify="space-between">
          <Col span={12}>
            <label>All Pending Orders</label>
          </Col>
        </TradeHeadRow>
        <TradeTable
          columns={columns}
          dataSource={this.state.data}
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
