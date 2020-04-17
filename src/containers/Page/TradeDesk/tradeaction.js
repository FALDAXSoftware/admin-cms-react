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

const { logout } = authAction;
// var self;
class TradeAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errMsg: false,
      errType: "Success",
      loader: false,
    };
    // self = this;
    this.validator = new SimpleReactValidator({
      gtzero: {
        // name the rule
        message: "Amount should be greater than zero",
        rule: (val, params, validator) => {
          if (val > 0) {
            return true;
          } else {
            return false;
          }
        },
        required: true, // optional
      },
      decimalrestrict3: {
        message:
          "Amount value must be less than or equal to 3 digits after decimal point.",
        rule: (val) => {
          var RE = /^\d*\.?\d{0,3}$/;
          if (RE.test(val)) {
            return true;
          } else {
            return false;
          }
        },
      },
      decimalrestrict5: {
        message:
          "Amount value must be less than or equal to 5 digits after decimal point.",
        rule: (val) => {
          var RE = /^\d*\.?\d{0,5}$/;
          if (RE.test(val)) {
            return true;
          } else {
            return false;
          }
        },
      },
    });
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
      <>
        <Card>
          <Tabs>
            <TabPane tab="Market" key="1">
              <InnerTabs>
                <TabPane tab="Buy" key="1">
                  <InputRow>
                    <Col span={12}>
                      <label>Amount</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.001"
                        addonAfter="XRP"
                        //   value={this.state.amount}
                        placeholder="0"
                        name="amount"
                        //   onChange={this.onChange}
                      />
                      {this.validator.message(
                        "Amount",
                        this.state.amount,
                        "required|gtzero|numeric|decimalrestrict3",
                        "trade-action-validation"
                      )}
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button type="primary">Buy</Button>
                    </Col>
                  </InputRow>
                </TabPane>
                <TabPane tab="Sell" key="2">
                  <InputRow>
                    <Col span={12}>
                      <label>Amount</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.001"
                        addonAfter="XRP"
                        //   value={this.state.amount}
                        placeholder="0"
                        name="amount"
                        //   onChange={this.onChange}
                      />
                      {this.validator.message(
                        "Amount",
                        this.state.amount,
                        "required|gtzero|numeric|decimalrestrict3",
                        "trade-action-validation"
                      )}
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button type="primary">Sell</Button>
                    </Col>
                  </InputRow>
                </TabPane>
              </InnerTabs>
            </TabPane>
            <TabPane tab="Limit" key="2">
              <InnerTabs>
                <TabPane tab="Buy" key="1">
                  <InputRow>
                    <Col span={12}>
                      <label>Amount</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.001"
                        addonAfter="XRP"
                        //   value={this.state.amount}
                        placeholder="0"
                        name="amount"
                        //   onChange={this.onChange}
                      />
                      {this.validator.message(
                        "Amount",
                        this.state.amount,
                        "required|gtzero|numeric|decimalrestrict3",
                        "trade-action-validation"
                      )}
                    </Col>
                    <Col span={12}>
                      <label>Limit Price</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.00001"
                        addonAfter="XRP"
                        //   value={this.state.amount}
                        placeholder="0"
                        name="amount"
                        //   onChange={this.onChange}
                      />
                      {this.validator.message(
                        "Amount",
                        this.state.limit_price,
                        "required|gtzero|numeric|decimalrestrict5",
                        "trade-action-validation"
                      )}
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button type="primary">Buy</Button>
                    </Col>
                  </InputRow>
                </TabPane>
                <TabPane tab="Sell" key="2">
                  <InputRow>
                    <Col span={12}>
                      <label>Amount</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.001"
                        addonAfter="XRP"
                        //   value={this.state.amount}
                        placeholder="0"
                        name="amount"
                        //   onChange={this.onChange}
                      />
                      {this.validator.message(
                        "Amount",
                        this.state.amount,
                        "required|gtzero|numeric|decimalrestrict3",
                        "trade-action-validation"
                      )}
                    </Col>
                    <Col span={12}>
                      <label>Limit Price</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.00001"
                        addonAfter="XRP"
                        //   value={this.state.amount}
                        placeholder="0"
                        name="amount"
                        //   onChange={this.onChange}
                      />
                      {this.validator.message(
                        "Amount",
                        this.state.limit_price,
                        "required|gtzero|numeric|decimalrestrict5",
                        "trade-action-validation"
                      )}
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button type="primary">Sell</Button>
                    </Col>
                  </InputRow>
                </TabPane>
              </InnerTabs>
            </TabPane>
            <TabPane tab="Stop Limit" key="3">
              <InnerTabs>
                <TabPane tab="Buy" key="1">
                  <InputRow>
                    <Col span={12}>
                      <label>Amount</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.001"
                        addonAfter="XRP"
                        //   value={this.state.amount}
                        placeholder="0"
                        name="amount"
                        //   onChange={this.onChange}
                      />
                      {this.validator.message(
                        "Amount",
                        this.state.amount,
                        "required|gtzero|numeric|decimalrestrict3",
                        "trade-action-validation"
                      )}
                    </Col>
                    <Col span={12}>
                      <label>Limit Price</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.00001"
                        addonAfter="XRP"
                        //   value={this.state.amount}
                        placeholder="0"
                        name="amount"
                        //   onChange={this.onChange}
                      />
                      {this.validator.message(
                        "Amount",
                        this.state.limit_price,
                        "required|gtzero|numeric|decimalrestrict5",
                        "trade-action-validation"
                      )}
                    </Col>
                    <Col span={12}>
                      <label>Stop Price</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.00001"
                        addonAfter="XRP"
                        //   value={this.state.amount}
                        placeholder="0"
                        name="amount"
                        //   onChange={this.onChange}
                      />
                      {this.validator.message(
                        "Amount",
                        this.state.stop_price,
                        "required|gtzero|numeric|decimalrestrict5",
                        "trade-action-validation"
                      )}
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button type="primary">Buy</Button>
                    </Col>
                  </InputRow>
                </TabPane>
                <TabPane tab="Sell" key="2">
                  <InputRow>
                    <Col span={12}>
                      <label>Amount</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.001"
                        addonAfter="XRP"
                        //   value={this.state.amount}
                        placeholder="0"
                        name="amount"
                        //   onChange={this.onChange}
                      />
                      {this.validator.message(
                        "Amount",
                        this.state.amount,
                        "required|gtzero|numeric|decimalrestrict3",
                        "trade-action-validation"
                      )}
                    </Col>
                    <Col span={12}>
                      <label>Limit Price</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.00001"
                        addonAfter="XRP"
                        //   value={this.state.amount}
                        placeholder="0"
                        name="amount"
                        //   onChange={this.onChange}
                      />
                      {this.validator.message(
                        "Amount",
                        this.state.limt_price,
                        "required|gtzero|numeric|decimalrestrict5",
                        "trade-action-validation"
                      )}
                    </Col>
                    <Col span={12}>
                      <label>Stop Price</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.00001"
                        addonAfter="XRP"
                        //   value={this.state.amount}
                        placeholder="0"
                        name="amount"
                        //   onChange={this.onChange}
                      />
                      {this.validator.message(
                        "Amount",
                        this.state.stop_price,
                        "required|gtzero|numeric|decimalrestrict5",
                        "trade-action-validation"
                      )}
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button type="primary">Sell</Button>
                    </Col>
                  </InputRow>
                </TabPane>
              </InnerTabs>
            </TabPane>
          </Tabs>
        </Card>
      </>
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
  )(TradeAction)
);
