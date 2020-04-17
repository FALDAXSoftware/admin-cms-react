import React, { Component } from "react";
import { notification, Tabs, Row, Col, Card, Input, Button } from "antd";
import ApiUtils from "../../../helpers/apiUtills";
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

const { logout } = authAction;
// var self;
class TradeDesk extends Component {
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
                      <TradeAction />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <DepthChart />
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <BuyBook />
                </Col>
                <Col span={8}>
                  <SellBook />
                </Col>
              </TradeRow>
              <Row>
                <Col span={24}>
                  <OrderHistory />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <MyOrders />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <AllPendingOrders />
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
