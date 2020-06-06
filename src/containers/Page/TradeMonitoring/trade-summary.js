import React, { Component } from "react";
import { TradeHeadRow } from "../../App/tradeStyle";
import { Col, Card, Row, Table, Button } from "antd";
import ApiUtils from "../../../helpers/apiUtills";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import authAction from "../../../redux/auth/actions";
const { logout } = authAction;

const columns = [
  {
    title: "Pair",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Best Bid Price",
    dataIndex: "bid_price",
    key: "bid_price",
    render: (text, record) => <>{text ? parseFloat(text).toFixed(8) : "-"}</>,
    // sorter: (a, b) => parseFloat(a.bid_price).toFixed(8) - parseFloat(b.bid_price).toFixed(8),
  },
  {
    title: "Best Ask Price",
    dataIndex: "ask_price",
    key: "ask_price",
    render: (text, record) => <>{text ? parseFloat(text).toFixed(8) : "-"}</>,
    // sorter: (a, b) => parseFloat(a.ask_price).toFixed(8) - parseFloat(b.ask_price).toFixed(8),
  },
  {
    title: "Spread",
    dataIndex: "spread",
    key: "spread",
    render: (text, record) => (
      <>
        {!isNaN(record.ask_price - record.bid_price)
          ? parseFloat(record.ask_price - record.bid_price).toFixed(8)
          : parseFloat(0).toFixed(8)}
      </>
    ),
    // sorter: (a, b) => (<>{!isNaN(a.bid_price - a.ask_price) ? parseFloat(a.bid_price - a.ask_price).toFixed(8) : parseFloat(0).toFixed(8)}</>) - (<>{!isNaN(b.bid_price - b.ask_price) ? parseFloat(b.bid_price - b.ask_price).toFixed(8) : parseFloat(0).toFixed(8)}</>),
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (text, record) => (
      <>
        {!isNaN((record.bid_price + record.ask_price) / 2)
          ? parseFloat((record.bid_price + record.ask_price) / 2).toFixed(8)
          : parseFloat(0).toFixed(8)}
      </>
    ),
    // sorter: (a, b) => (<>{!isNaN((a.bid_price + a.ask_price) / 2) ? parseFloat((a.bid_price + a.ask_price) / 2).toFixed(8) : parseFloat(0).toFixed(8)}</>) - (<>{!isNaN((b.bid_price + b.ask_price) / 2) ? parseFloat((b.bid_price + b.ask_price) / 2).toFixed(8) : parseFloat(0).toFixed(8)}</>),
  },
  {
    title: "Spread %",
    dataIndex: "spread_per",
    key: "spread_per",
    render: (text, record) => (
      <>
        {!isNaN(
          (record.ask_price - record.bid_price) /
            ((record.bid_price + record.ask_price) / 2)
        )
          ? parseFloat(
              (record.ask_price - record.bid_price) /
                ((record.bid_price + record.ask_price) / 2)
            ).toFixed(8)
          : parseFloat(0).toFixed(8)}
      </>
    ),
  },
];
class TradeSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loader: true,
    };
    this.timeInterval = null;
  }
  componentDidMount() {
    this.getData();
    this.timeInterval = setInterval(() => {
      this.getData(false);
    }, 10000);
  }
  getData = (showLoader = true) => {
    if (showLoader) {
      this.setState({ loader: true });
    }
    ApiUtils.getSpreadData(this.props.token)
      .then((response) => response.json())
      .then((res) => {
        console.log("-------------------", res);
        this.setState({ data: res.data, loader: false });
      });
  };
  componentWillUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }
  render() {
    return (
      <Card>
        <Row>
          <Table
            title={() => (
              <TradeHeadRow>
                <Col span={12}>
                  <label>Trade Summary</label>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Button type="primary" icon="reload" onClick={this.getData} />
                </Col>
              </TradeHeadRow>
            )}
            dataSource={this.state.data}
            columns={columns}
            pagination={false}
            loading={this.state.loader}
          />
        </Row>
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
  )(TradeSummary)
);
