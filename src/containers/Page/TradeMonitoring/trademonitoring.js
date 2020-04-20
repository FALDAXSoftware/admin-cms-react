import React, { Component } from "react";
import { notification, Tabs, Row, Col, Card, Input, Button } from "antd";
import ApiUtils from "../../../helpers/apiUtills";
import { connect } from "react-redux";
import authAction from "../../../redux/auth/actions";
import { withRouter } from "react-router-dom";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import { TabPane } from "../../../components/uielements/tabs";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import { TradeRow, InnerTabs, InputRow } from "../../App/tradeStyle.js";
import TradeWallets from "./trade-wallets";
import AllPendingOrders from "../TradeDesk/allpendingorders";

const { logout } = authAction;
// var self;
class TradeMonitoring extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  render() {
    return (
      <LayoutWrapper>
        <Tabs className="isoTableDisplayTab full-width">
          <TabPane tab="Trade Monitoring" key="1">
            <TableDemoStyle className="isoLayoutContent">
              <TradeWallets />
              <Row gutter={16} style={{ marginBottom: "13px" }}>
                <Col span={24}>
                  <AllPendingOrders />
                </Col>
              </Row>
              {/* <TradeRow>
                <Col span={8}>test</Col>
              </TradeRow> */}
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
  )(TradeMonitoring)
);
