import React, { Component } from "react";
import { notification, Tabs, Row, Col } from "antd";
import { SOCKET_HOST } from "../../../helpers/apiUtills";
import { connect } from "react-redux";
import authAction from "../../../redux/auth/actions";
import { withRouter } from "react-router-dom";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import { TabPane } from "../../../components/uielements/tabs";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import { TradeRow, InnerTabs, InputRow } from "../../App/tradeStyle.js";
import TradeAction from "./tradeaction";
import BuyBook from "./buybook";
import SellBook from "./sellbook";
import DepthChart from "./depth";
import MyOrders from "./myorders";
import AllPendingOrders from "./allpendingorders";
import OrderHistory from "./orderhistory";
import io from "socket.io-client";
import { isAllowed } from "../../../helpers/accessControl";
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
      pair: "",
      buyBookLoader: false,
      sellBookLoader: false,
      myOrderLoader: false,
      orderHistoryLoader: false,
      pricePrecision: "0",
      amountPrecision: "0",
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
    let crypto = this.props.match.params.pair.split("-")[0];
    let currency = this.props.match.params.pair.split("-")[1];
    this.setState(
      {
        crypto,
        currency,
        pair: this.props.match.params.pair,
        pricePrecision: 6,
        amountPrecision: 3,
      },
      () => {
        this.joinRoom();
      }
    );
    this.io.on("user-logout", (data) => {
      this.props.logout();
    });
  };
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (this.props.pair != nextProps.match.params.pair) {
      let crypto = nextProps.match.params.pair.split("-")[0];
      let currency = nextProps.match.params.pair.split("-")[1];
      let prevRoom = this.state.crypto + "-" + this.state.currency;
      this.setState(
        {
          crypto,
          currency,
          pair: nextProps.match.params.pair,
        },
        () => {
          this.joinRoom(prevRoom);
        }
      );
    }
  };
  joinRoom = (prevRoom = null) => {
    this.io.emit("join", {
      room: this.state.crypto + "-" + this.state.currency,
      previous_room: prevRoom,
    });
  };

  render() {
    return (
      <LayoutWrapper>
        <Tabs className="isoTableDisplayTab full-width">
          <TabPane tab="Tradedesk" key="1">
            <TableDemoStyle className="isoLayoutContent">
              <TradeRow>
                <Col span={8}>
                  <Row>
                    <Col>
                      <TradeAction
                        crypto={this.state.crypto}
                        currency={this.state.currency}
                        pair={this.state.pair}
                        io={this.io}
                        pricePrecision={this.state.pricePrecision}
                        amountPrecision={this.state.amountPrecision}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {this.state.crypto && this.state.currency && (
                        <DepthChart
                          crypto={this.state.crypto}
                          currency={this.state.currency}
                          pair={this.state.pair}
                          io={this.io}
                          pricePrecision={this.state.pricePrecision}
                          amountPrecision={this.state.amountPrecision}
                        />
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col>
                      <BuyBook
                        crypto={this.state.crypto}
                        currency={this.state.currency}
                        pair={this.state.pair}
                        io={this.io}
                        loading={this.state.buyBookLoader}
                        pricePrecision={this.state.pricePrecision}
                        amountPrecision={this.state.amountPrecision}
                        onLoadComplete={() => {
                          this.setState({ buyBookLoader: false });
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col>
                      <SellBook
                        crypto={this.state.crypto}
                        currency={this.state.currency}
                        pair={this.state.pair}
                        io={this.io}
                        loading={this.state.sellBookLoader}
                        pricePrecision={this.state.pricePrecision}
                        amountPrecision={this.state.amountPrecision}
                        onLoadComplete={() => {
                          this.setState({ sellBookLoader: false });
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </TradeRow>
              <Row>
                <Col span={24}>
                  <OrderHistory
                    crypto={this.state.crypto}
                    currency={this.state.currency}
                    pair={this.state.pair}
                    io={this.io}
                    loading={this.state.orderHistoryLoader}
                    pricePrecision={this.state.pricePrecision}
                    amountPrecision={this.state.amountPrecision}
                    onLoadComplete={() => {
                      this.setState({ orderHistoryLoader: false });
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <MyOrders
                    crypto={this.state.crypto}
                    currency={this.state.currency}
                    pair={this.state.pair}
                    io={this.io}
                    loading={this.state.myOrderLoader}
                    pricePrecision={this.state.pricePrecision}
                    amountPrecision={this.state.amountPrecision}
                    onLoadComplete={() => {
                      this.setState({ myOrderLoader: false });
                    }}
                    enableLoader={() => {
                      this.setState({ myOrderLoader: true });
                    }}
                  />
                </Col>
              </Row>
              {/* <Row>
                <Col span={24}>
                  <AllPendingOrders
                    crypto={this.state.crypto}
                    currency={this.state.currency}
                    pair={this.state.pair}
                    io={this.io} />
                </Col>
              </Row> */}
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
