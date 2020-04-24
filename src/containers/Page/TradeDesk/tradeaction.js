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
import FaldaxLoader from "../faldaxLoader";

const { logout } = authAction;
// var self;
class TradeAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errMsg: false,
      errType: "Success",
      loader: false,
      mainTab: "market",
      subTab: "Buy",
      fields: {
        amount: 0,
        limit: 0,
        stop: 0
      },
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

  componentDidMount = () => { };
  onMainTabChange = (key) => {
    if (!this.state.loader) {
      this.setState({
        mainTab: key,
        fields: {
          amount: 0,
          limit: 0,
          stop: 0
        }
      });
    }
  }
  onSubTabChange = (key) => {
    if (!this.state.loader) {
      this.setState({
        subTab: key,
        fields: {
          amount: 0,
          limit: 0,
          stop: 0
        }
      });
    }
  }
  onFieldChange = (field, value) => {
    let stateFields = this.state.fields
    stateFields[field] = value
    this.setState({
      field: stateFields
    })
  }
  onSubmit = () => {
    this.setState({ loader: true });
    let url = "/api/v1/tradding/orders/"
    let params = {
      symbol: `${this.props.crypto}-${this.props.currency}`,
      side: this.state.subTab,
      orderQuantity: this.state.fields.amount,
    }
    switch (this.state.mainTab) {
      case "market":
        url += `market-${this.state.subTab}-create/`
        params = {
          ...params,
          order_type: "Market"
        }
        break;
      case "limit":
        url += `limit-${this.state.subTab}-order-create`
        params = {
          ...params,
          order_type: "Limit",
          limit_price: this.state.fields.limit,
        }
        break;
      case "stop":
        url += `pending-${this.state.subTab}-order-create`
        params = {
          ...params,
          order_type: "StopLimit",
          limit_price: this.state.fields.limit,
          stop_price: this.state.fields.stop,
        }
        break;
      default:
        break;
    }
    console.log(url, params);
    ApiUtils.executeTrade(url, this.props.token, params).then((response) => response.json()).then((responseData) => {
      if (responseData.status === 200) {
        notification.success({
          message: "Success",
          description: responseData.message,
        })
      } else if (responseData.status === 201) {
        notification.warning({
          message: "Warning",
          description: responseData.message,
        })
      } else if (responseData.status === 500) {
        notification.error({
          message: "Error",
          description: responseData.message,
        })
      } else {
        notification.error({
          message: "Error",
          description: responseData.err,
        })
      }
      this.setState({
        loader: false,
        fields: {
          amount: 0,
          limit: 0,
          stop: 0
        }
      })

    })


  }
  render() {
    return (
      <>
        <Card>
          <Tabs activeKey={this.state.mainTab} onChange={this.onMainTabChange}>
            <TabPane tab="Market" key="market">
              <InnerTabs onChange={this.onSubTabChange} activeKey={this.state.subTab}>
                <TabPane tab="Buy" key="Buy">
                  <InputRow>
                    <Col span={12}>
                      <label>Amount</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.001"
                        addonAfter={this.props.crypto}
                        value={this.state.fields.amount}
                        placeholder="0"
                        name="amount"
                        onChange={(e) => { this.onFieldChange("amount", e.target.value) }}
                      />
                      {/* {this.validator.message(
                        "Amount",
                        this.state.amount,
                        "required|gtzero|numeric|decimalrestrict3",
                        "trade-action-validation"
                      )} */}
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button type="primary" onClick={this.onSubmit} loading={this.state.loader}>Buy</Button>
                    </Col>
                  </InputRow>
                </TabPane>
                <TabPane tab="Sell" key="Sell">
                  <InputRow>
                    <Col span={12}>
                      <label>Amount</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.001"
                        addonAfter={this.props.crypto}
                        value={this.state.fields.amount}
                        placeholder="0"
                        name="amount"
                        onChange={(e) => { this.onFieldChange("amount", e.target.value) }}
                      />
                      {/* {this.validator.message(
                        "Amount",
                        this.state.amount,
                        "required|gtzero|numeric|decimalrestrict3",
                        "trade-action-validation"
                      )} */}
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button type="primary" onClick={this.onSubmit} loading={this.state.loader}>Sell</Button>
                    </Col>
                  </InputRow>
                </TabPane>
              </InnerTabs>
            </TabPane>
            <TabPane tab="Limit" key="limit">
              <InnerTabs onChange={this.onSubTabChange} activeKey={this.state.subTab}>
                <TabPane tab="Buy" key="Buy">
                  <InputRow>
                    <Col span={12}>
                      <label>Amount</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.001"
                        addonAfter={this.props.crypto}
                        value={this.state.fields.amount}
                        placeholder="0"
                        name="amount"
                        onChange={(e) => { this.onFieldChange("amount", e.target.value) }}
                      />
                      {/* {this.validator.message(
                        "Amount",
                        this.state.amount,
                        "required|gtzero|numeric|decimalrestrict3",
                        "trade-action-validation"
                      )} */}
                    </Col>
                    <Col span={12}>
                      <label>Limit Price</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.00001"
                        addonAfter={this.props.currency}
                        value={this.state.fields.limit}
                        placeholder="0"
                        name="limit"
                        onChange={(e) => { this.onFieldChange("limit", e.target.value) }}
                      />
                      {/* {this.validator.message(
                        "Amount",
                        this.state.limit_price,
                        "required|gtzero|numeric|decimalrestrict5",
                        "trade-action-validation"
                      )} */}
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button type="primary" onClick={this.onSubmit} loading={this.state.loader}>Buy</Button>
                    </Col>
                  </InputRow>
                </TabPane>
                <TabPane tab="Sell" key="Sell">
                  <InputRow>
                    <Col span={12}>
                      <label>Amount</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.001"
                        addonAfter={this.props.crypto}
                        value={this.state.fields.amount}
                        placeholder="0"
                        name="amount"
                        onChange={(e) => { this.onFieldChange("amount", e.target.value) }}
                      />
                      {/* {this.validator.message(
                        "Amount",
                        this.state.amount,
                        "required|gtzero|numeric|decimalrestrict3",
                        "trade-action-validation"
                      )} */}
                    </Col>
                    <Col span={12}>
                      <label>Limit Price</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.00001"
                        addonAfter={this.props.currency}
                        value={this.state.fields.limit}
                        placeholder="0"
                        name="limit"
                        onChange={(e) => { this.onFieldChange("limit", e.target.value) }}
                      />
                      {/* {this.validator.message(
                        "Amount",
                        this.state.limit_price,
                        "required|gtzero|numeric|decimalrestrict5",
                        "trade-action-validation"
                      )} */}
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button type="primary" onClick={this.onSubmit} loading={this.state.loader}>Sell</Button>
                    </Col>
                  </InputRow>
                </TabPane>
              </InnerTabs>
            </TabPane>
            <TabPane tab="Stop Limit" key="stop-limit">
              <InnerTabs onChange={this.onSubTabChange} activeKey={this.state.subTab}>
                <TabPane tab="Buy" key="Buy">
                  <InputRow>
                    <Col span={12}>
                      <label>Amount</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.001"
                        addonAfter={this.props.crypto}
                        value={this.state.fields.amount}
                        placeholder="0"
                        name="amount"
                        onChange={(e) => { this.onFieldChange("amount", e.target.value) }}
                      />
                      {/* {this.validator.message(
                        "Amount",
                        this.state.amount,
                        "required|gtzero|numeric|decimalrestrict3",
                        "trade-action-validation"
                      )} */}
                    </Col>
                    <Col span={12}>
                      <label>Limit Price</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.00001"
                        addonAfter={this.props.currency}
                        value={this.state.fields.limit}
                        placeholder="0"
                        name="limit"
                        onChange={(e) => { this.onFieldChange("limit", e.target.value) }}
                      />
                      {/* {this.validator.message(
                        "Amount",
                        this.state.limit_price,
                        "required|gtzero|numeric|decimalrestrict5",
                        "trade-action-validation"
                      )} */}
                    </Col>
                    <Col span={12}>
                      <label>Stop Price</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.00001"
                        addonAfter={this.props.currency}
                        value={this.state.fields.stop}
                        placeholder="0"
                        name="stop"
                        onChange={(e) => { this.onFieldChange("stop", e.target.value) }}
                      />
                      {/* {this.validator.message(
                        "Amount",
                        this.state.stop_price,
                        "required|gtzero|numeric|decimalrestrict5",
                        "trade-action-validation"
                      )} */}
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button type="primary" onClick={this.onSubmit} loading={this.state.loader}>Buy</Button>
                    </Col>
                  </InputRow>
                </TabPane>
                <TabPane tab="Sell" key="Sell">
                  <InputRow>
                    <Col span={12}>
                      <label>Amount</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.001"
                        addonAfter={this.props.crypto}
                        value={this.state.fields.amount}
                        placeholder="0"
                        name="amount"
                        onChange={(e) => { this.onFieldChange("amount", e.target.value) }}
                      />
                      {/* {this.validator.message(
                        "Amount",
                        this.state.amount,
                        "required|gtzero|numeric|decimalrestrict3",
                        "trade-action-validation"
                      )} */}
                    </Col>
                    <Col span={12}>
                      <label>Limit Price</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.00001"
                        addonAfter={this.props.currency}
                        value={this.state.fields.limit}
                        placeholder="0"
                        name="limit"
                        onChange={(e) => { this.onFieldChange("limit", e.target.value) }}
                      />
                      {/* {this.validator.message(
                        "Amount",
                        this.state.limt_price,
                        "required|gtzero|numeric|decimalrestrict5",
                        "trade-action-validation"
                      )} */}
                    </Col>
                    <Col span={12}>
                      <label>Stop Price</label>
                      <Input
                        min="0"
                        type="number"
                        step="0.00001"
                        addonAfter={this.props.currency}
                        value={this.state.fields.stop}
                        placeholder="0"
                        name="stop"
                        onChange={(e) => { this.onFieldChange("stop", e.target.value) }}
                      />
                      {/* {this.validator.message(
                        "Amount",
                        this.state.stop_price,
                        "required|gtzero|numeric|decimalrestrict5",
                        "trade-action-validation"
                      )} */}
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button type="primary" onClick={this.onSubmit} loading={this.state.loader}>Sell</Button>
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
