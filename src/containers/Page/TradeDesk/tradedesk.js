import React, { Component } from "react";
import { notification, Tabs, Row, Col, Card, Input, Button } from "antd";
import ApiUtils, { SOCKET_HOST } from "../../../helpers/apiUtills";
import { connect } from "react-redux";
import authAction from "../../../redux/auth/actions";
import { withRouter } from "react-router-dom";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import { TabPane } from "../../../components/uielements/tabs";
import SimpleReactValidator from "simple-react-validator";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import { TradeRow, InnerTabs, InputRow } from "../../App/tradeStyle.js";
import TradeAction from "./tradeaction";
import BuyBook from "./buybook";
import SellBook from "./sellbook";
import DepthChart from "./depth";
import PendingOrders from "./pendingorders";
import CancelledOrders from "./cancelledorders";
import CompletedOrders from "./completedorders";
import MyOrders from "./myorders";
import AllPendingOrders from "./allpendingorders";
import OrderHistory from "./orderhistory";
import io from 'socket.io-client';
const { logout } = authAction;
// var self;
class TradeDesk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errMsg: false,
      errType: "Success",
      loader: false,
      crypto: "",
      currency: "",
      pair: ""
    };
    // alert(this.props.token)
    this.io = io(SOCKET_HOST, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: "Bearer " + this.props.token, //ahiya header pass karide auth
          },
        },
      },
    });
    // self = this;
  }

  componentDidMount = () => {
    let crypto = this.props.match.params.pair.split("-")[0]
    let currency = this.props.match.params.pair.split("-")[1]
    this.setState({
      crypto,
      currency,
      pair: this.props.match.params.pair
    }, () => {
      this.joinRoom()
    })
    this.io.on("user-logout", (data) => {
      this.props.logout()
    })

  };
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (this.props.pair != nextProps.match.params.pair) {
      let crypto = nextProps.match.params.pair.split("-")[0]
      let currency = nextProps.match.params.pair.split("-")[1]
      let prevRoom = this.state.crypto + "-" + this.state.currency
      this.setState({
        crypto,
        currency,
        pair: nextProps.match.params.pair
      }, () => {
        this.joinRoom(prevRoom)
      })
    }
  }
  joinRoom = (prevRoom = null) => {
    this.io.emit("join", { room: this.state.crypto + "-" + this.state.currency, previous_room: prevRoom })
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
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }
    return (
      <LayoutWrapper>
        <Tabs className="isoTableDisplayTab full-width">
          <TabPane tab="Tradedesk" key="1">
            <TableDemoStyle className="isoLayoutContent">
              <TradeRow>
                <Col span={8}>
                  <Row>
                    <Col>
                      <TradeAction crypto={this.state.crypto} currency={this.state.currency} pair={this.state.pair} io={this.io} />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <DepthChart crypto={this.state.crypto} currency={this.state.currency} pair={this.state.pair} io={this.io} />
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col>
                      <BuyBook crypto={this.state.crypto} currency={this.state.currency} pair={this.state.pair} io={this.io} />
                    </Col>
                  </Row>

                </Col>
                <Col span={8}>
                  <Row>
                    <Col>
                      <SellBook crypto={this.state.crypto} currency={this.state.currency} pair={this.state.pair} io={this.io} />
                    </Col>
                  </Row>
                </Col>
              </TradeRow>
              <Row>
                <Col span={24}>
                  <OrderHistory crypto={this.state.crypto} currency={this.state.currency} pair={this.state.pair} io={this.io} />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <MyOrders crypto={this.state.crypto} currency={this.state.currency} pair={this.state.pair} io={this.io} />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <AllPendingOrders crypto={this.state.crypto} currency={this.state.currency} pair={this.state.pair} io={this.io} />
                </Col>
              </Row>
            </TableDemoStyle>
          </TabPane>
        </Tabs>
      </LayoutWrapper>
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
  )(TradeDesk)
);
