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
import TradeSummary from "./trade-summary";
import BotConfig from "./bot-config";

const { logout } = authAction;
// var self;
class TradeMonitoring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      selectedKey: "1"
    };
    // self = this;
  }

  componentDidMount = () => { };

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
        <Tabs className="isoTableDisplayTab full-width" selectedKey={this.state.selectedKey} onChange={(key) => { this.setState({ selectedKey: key }); }}>
          <TabPane tab="Trade Summary" key="1">
            {this.state.selectedKey == "1" &&
              <TableDemoStyle className="isoLayoutContent">
                <Row gutter={16} style={{ marginBottom: "20px" }}>
                  <Col span={24}>
                    <TradeSummary />
                  </Col>
                </Row>
              </TableDemoStyle>
            }
          </TabPane>
          <TabPane tab="Wallets" key="2">
            {this.state.selectedKey == "2" &&
              <TableDemoStyle className="isoLayoutContent">
                <TradeWallets />
              </TableDemoStyle>
            }

          </TabPane>
          <TabPane tab="Configurations" key="3">
            {this.state.selectedKey == "3" &&
              <TableDemoStyle className="isoLayoutContent">
                <Row gutter={16} style={{ marginBottom: "20px" }}>
                  <Col span={24}>
                    <BotConfig />
                  </Col>
                </Row>
              </TableDemoStyle>
            }
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
