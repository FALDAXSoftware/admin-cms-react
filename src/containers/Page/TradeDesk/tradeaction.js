import React, { Component } from "react";
import {
  notification,
  Tabs,
  Row,
  Col,
  Card,
  Input,
  Button,
  Checkbox,
  Icon,
} from "antd";
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
import { Precise } from "../../../components/tables/helperCells";
import styled from "styled-components";

const { logout } = authAction;
const TriggerDiv = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 0 0 0;
  font-size: 12px;
  color: "#000";
  > span {
    display: inherit;
    align-items: center;
    > i {
      font-size: 10px;
      display: inherit;
      padding: 0 5px;
    }
  }
  &.red {
    color: red;
  }
`;

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
        stop: 0,
        buycheck: false,
        sellcheck: false,
      },
      latestFillPrice: 0,
      disabledBtn: false,
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
      decimalrestrict8: {
        message:
          "Amount value must be less than or equal to 8 digits after decimal point.",
        rule: (val) => {
          var RE = /^\d*\.?\d{0,8}$/;
          if (RE.test(val)) {
            return true;
          } else {
            return false;
          }
        },
      },
    });
    this.clearValidation = this.clearValidation.bind(this);
  }

  componentDidMount = () => {
    if (this.props.io) {
      this.props.io.emit("get-limit-stop-latest", {
        symbol: `${this.props.crypto}-${this.props.currency}`,
      });
      this.props.io.on("get-latest-price", (data) => {
        if (data) {
          this.setState(
            {
              latestFillPrice: data.lastPrice,
            },
            () => {
              if (this.state.stop_price > 0) {
                if (this.state.side === "Buy") {
                  if (
                    parseFloat(this.state.fields.stop).toFixed(
                      this.props.pricePrecision
                    ) >
                    parseFloat(this.state.latestFillPrice).toFixed(
                      this.props.pricePrecision
                    )
                  ) {
                    this.setState({
                      disabledBtn: false,
                    });
                  } else {
                    this.setState({
                      disabledBtn: true,
                    });
                  }
                } else {
                  if (
                    parseFloat(this.state.fields.stop).toFixed(
                      this.props.pricePrecision
                    ) <
                    parseFloat(this.state.latestFillPrice).toFixed(
                      this.props.pricePrecision
                    )
                  ) {
                    this.setState({
                      disabledBtn: false,
                    });
                  } else {
                    this.setState({
                      disabledBtn: true,
                    });
                  }
                }
              } else {
                this.setState({
                  disabledBtn: false,
                });
              }
            }
          );
        } else {
          this.setState({
            latestFillPrice: "",
            disabledBtn: false,
          });
        }
      });
    }
  };
  clearValidation() {
    this.validator.hideMessages();
    this.forceUpdate();
    // rerender to hide messages for the first time
  }
  onMainTabChange = (key) => {
    if (!this.state.loader) {
      this.clearValidation();
      this.setState({
        mainTab: key,
        fields: {
          amount: 0,
          limit: 0,
          stop: 0,
          buycheck: false,
          sellcheck: false,
        },
      });
    }
  };
  onSubTabChange = (key) => {
    this.clearValidation();
    if (!this.state.loader) {
      this.setState({
        subTab: key,
        fields: {
          amount: 0,
          limit: 0,
          stop: 0,
          buycheck: false,
          sellcheck: false,
        },
      });
    }
  };
  onFieldChange = (field, value) => {
    let stateFields = this.state.fields;
    stateFields[field] = value;
    this.setState({
      field: stateFields,
    });
    if (field === "stop" && value > 0) {
      if (this.state.subTab === "Buy") {
        if (
          parseFloat(value).toFixed(this.props.pricePrecision) >
          parseFloat(this.state.latestFillPrice).toFixed(
            this.props.pricePrecision
          )
        ) {
          this.setState({
            disabledBtn: false,
          });
        } else {
          this.setState({
            disabledBtn: true,
          });
        }
      } else {
        if (
          parseFloat(value).toFixed(this.props.pricePrecision) <
          parseFloat(this.state.latestFillPrice).toFixed(
            this.props.pricePrecision
          )
        ) {
          this.setState({
            disabledBtn: false,
          });
        } else {
          this.setState({
            disabledBtn: true,
          });
        }
      }
    }
  };
  onSubmit = () => {
    let url = "/api/v1/tradding/orders/";
    let params = {
      symbol: `${this.props.crypto}-${this.props.currency}`,
      side: this.state.subTab,
      orderQuantity: this.state.fields.amount,
      is_checkbox_selected:
        this.state.subTab === "Buy"
          ? this.state.fields.buycheck
          : this.state.fields.sellcheck,
    };
    switch (this.state.mainTab) {
      case "market":
        url += `market-${this.state.subTab}-create/`;
        params = {
          ...params,
          order_type: "Market",
        };
        break;
      case "limit":
        url += `limit-${this.state.subTab}-order-create`;
        params = {
          ...params,
          order_type: "Limit",
          limit_price: this.state.fields.limit,
        };
        break;
      case "stop":
        url += `pending-${this.state.subTab}-order-create`;
        params = {
          ...params,
          order_type: "StopLimit",
          limit_price: this.state.fields.limit,
          stop_price: this.state.fields.stop,
        };
        break;
      default:
        break;
    }
    console.log(url, params);
    if (this.validator.allValid()) {
      this.setState({ loader: true });
      ApiUtils.executeTrade(url, this.props.token, params)
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.status === 200) {
            notification.success({
              message: "Success",
              description: responseData.message,
            });
          } else if (responseData.status === 201) {
            notification.warning({
              message: "Warning",
              description: responseData.message,
            });
          } else if (responseData.status === 500) {
            notification.error({
              message: "Error",
              description: responseData.message,
            });
          } else {
            notification.error({
              message: "Error",
              description: responseData.err,
            });
          }

          this.setState({
            loader: false,
            fields: {
              amount: 0,
              limit: 0,
              stop: 0,
            },
          });
        });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };
  onCheckBoxChange = (field, value) => {
    console.log(`checked = ${value}`);
    let stateFields = this.state.fields;
    stateFields[field] = value;
    this.setState(
      {
        field: stateFields,
      },
      () => {
        console.log("^^^", this.state.fields.buycheck);
      }
    );
  };

  render() {
    let stepValue, limitPrecision;
    switch (this.props.amountPrecision.toString()) {
      case "0":
        stepValue = "1";
        break;
      case "1":
        stepValue = "0.1";
        break;
      case "2":
        stepValue = "0.01";
        break;
      case "3":
        stepValue = "0.001";
        break;
      case "4":
        stepValue = "0.0001";
        break;
      case "5":
        stepValue = "0.00001";
        break;
      case "6":
        stepValue = "0.000001";
        break;
      case "7":
        stepValue = "0.0000001";
      case "8":
        stepValue = "0.00000001";
        break;
      default:
        break;
    }
    switch (this.props.pricePrecision.toString()) {
      case "0":
        limitPrecision = "1";
        break;
      case "1":
        limitPrecision = "0.1";
        break;
      case "2":
        limitPrecision = "0.01";
        break;
      case "3":
        limitPrecision = "0.001";
        break;
      case "4":
        limitPrecision = "0.0001";
        break;
      case "5":
        limitPrecision = "0.00001";
        break;
      case "6":
        limitPrecision = "0.000001";
        break;
      case "7":
        limitPrecision = "0.0000001";
      case "8":
        limitPrecision = "0.00000001";
        break;
      default:
        break;
    }
    return (
      <>
        <Card>
          <Tabs activeKey={this.state.mainTab} onChange={this.onMainTabChange}>
            <TabPane tab="Market" key="market">
              <InnerTabs
                onChange={this.onSubTabChange}
                activeKey={this.state.subTab}
              >
                <TabPane tab="Buy" key="Buy">
                  <InputRow>
                    <Col span={12}>
                      <label>Amount</label>
                      <Input
                        min="0"
                        type="number"
                        step={stepValue}
                        addonAfter={this.props.crypto}
                        value={Precise(
                          this.state.fields.amount,
                          this.props.amountPrecision
                        )}
                        placeholder="0"
                        name="amount"
                        onChange={(e) => {
                          this.onFieldChange("amount", e.target.value);
                        }}
                      />
                      {this.state.mainTab === "market" &&
                      this.state.subTab === "Buy"
                        ? this.validator.message(
                            "market_buy_amount",
                            this.state.fields.amount,
                            "required|gtzero|numeric|decimalrestrict8",
                            "trade-action-validation"
                          )
                        : delete this.validator.fields["market_buy_amount"]}
                    </Col>
                    <Col span={24}>
                      <Checkbox
                        value={this.state.fields.buycheck}
                        checked={this.state.fields.buycheck}
                        onChange={(e) =>
                          this.onCheckBoxChange("buycheck", e.target.checked)
                        }
                      >
                        Checkbox
                      </Checkbox>
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button
                        type="primary"
                        onClick={this.onSubmit}
                        loading={this.state.loader}
                      >
                        Buy
                      </Button>
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
                        step={stepValue}
                        addonAfter={this.props.crypto}
                        value={Precise(
                          this.state.fields.amount,
                          this.props.amountPrecision
                        )}
                        placeholder="0"
                        name="amount"
                        onChange={(e) => {
                          this.onFieldChange("amount", e.target.value);
                        }}
                      />
                      {this.state.mainTab === "market" &&
                      this.state.subTab === "Sell"
                        ? this.validator.message(
                            "market_sell_amount",
                            this.state.fields.amount,
                            "required|gtzero|numeric|decimalrestrict8",
                            "trade-action-validation"
                          )
                        : delete this.validator.fields["market_sell_amount"]}
                    </Col>
                    <Col span={24}>
                      <Checkbox
                        value={this.state.fields.sellcheck}
                        checked={this.state.fields.sellcheck}
                        onChange={(e) =>
                          this.onCheckBoxChange("sellcheck", e.target.checked)
                        }
                      >
                        Checkbox
                      </Checkbox>
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button
                        type="primary"
                        onClick={this.onSubmit}
                        loading={this.state.loader}
                      >
                        Sell
                      </Button>
                    </Col>
                  </InputRow>
                </TabPane>
              </InnerTabs>
            </TabPane>
            <TabPane tab="Limit" key="limit">
              <InnerTabs
                onChange={this.onSubTabChange}
                activeKey={this.state.subTab}
              >
                <TabPane tab="Buy" key="Buy">
                  <InputRow>
                    <Col span={12}>
                      <label>Amount</label>
                      <Input
                        min="0"
                        type="number"
                        step={stepValue}
                        addonAfter={this.props.crypto}
                        value={Precise(
                          this.state.fields.amount,
                          this.props.amountPrecision
                        )}
                        placeholder="0"
                        name="amount"
                        onChange={(e) => {
                          this.onFieldChange("amount", e.target.value);
                        }}
                      />
                      {this.state.mainTab === "limit" &&
                      this.state.subTab === "Buy"
                        ? this.validator.message(
                            "limit_buy_amount",
                            this.state.fields.amount,
                            "required|gtzero|numeric|decimalrestrict8",
                            "trade-action-validation"
                          )
                        : delete this.validator.fields["limit_buy_amount"]}
                    </Col>
                    <Col span={12}>
                      <label>Limit Price</label>
                      <Input
                        min="0"
                        type="number"
                        step={limitPrecision}
                        addonAfter={this.props.currency}
                        value={Precise(
                          this.state.fields.limit,
                          this.props.pricePrecision
                        )}
                        placeholder="0"
                        name="limit"
                        onChange={(e) => {
                          this.onFieldChange("limit", e.target.value);
                        }}
                      />
                      {this.state.mainTab === "limit" &&
                      this.state.subTab === "Buy"
                        ? this.validator.message(
                            "limit_price_buy",
                            this.state.fields.limit,
                            "required|gtzero|numeric|decimalrestrict8",
                            "trade-action-validation"
                          )
                        : delete this.validator.fields["limit_price_buy"]}
                    </Col>
                    <Col span={24}>
                      <Checkbox
                        value={this.state.fields.buycheck}
                        checked={this.state.fields.buycheck}
                        onChange={(e) =>
                          this.onCheckBoxChange("buycheck", e.target.checked)
                        }
                      >
                        Checkbox
                      </Checkbox>
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button
                        type="primary"
                        onClick={this.onSubmit}
                        loading={this.state.loader}
                      >
                        Buy
                      </Button>
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
                        step={stepValue}
                        addonAfter={this.props.crypto}
                        value={Precise(
                          this.state.fields.amount,
                          this.props.amountPrecision
                        )}
                        placeholder="0"
                        name="amount"
                        onChange={(e) => {
                          this.onFieldChange("amount", e.target.value);
                        }}
                      />
                      {this.state.mainTab === "limit" &&
                      this.state.subTab === "Sell"
                        ? this.validator.message(
                            "limit_sell_amount",
                            this.state.fields.amount,
                            "required|gtzero|numeric|decimalrestrict8",
                            "trade-action-validation"
                          )
                        : delete this.validator.fields["limit_sell_amount"]}
                    </Col>
                    <Col span={12}>
                      <label>Limit Price</label>
                      <Input
                        min="0"
                        type="number"
                        step={limitPrecision}
                        addonAfter={this.props.currency}
                        value={Precise(
                          this.state.fields.limit,
                          this.props.pricePrecision
                        )}
                        placeholder="0"
                        name="limit"
                        onChange={(e) => {
                          this.onFieldChange("limit", e.target.value);
                        }}
                      />
                      {this.state.mainTab === "limit" &&
                      this.state.subTab === "Sell"
                        ? this.validator.message(
                            "limit_price_sell",
                            this.state.fields.limit,
                            "required|gtzero|numeric|decimalrestrict8",
                            "trade-action-validation"
                          )
                        : delete this.validator.fields["limit_price_sell"]}
                    </Col>
                    <Col span={24}>
                      <Checkbox
                        value={this.state.fields.sellcheck}
                        checked={this.state.fields.sellcheck}
                        onChange={(e) =>
                          this.onCheckBoxChange("sellcheck", e.target.checked)
                        }
                      >
                        Checkbox
                      </Checkbox>
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button
                        type="primary"
                        onClick={this.onSubmit}
                        loading={this.state.loader}
                      >
                        Sell
                      </Button>
                    </Col>
                  </InputRow>
                </TabPane>
              </InnerTabs>
            </TabPane>
            <TabPane tab="Stop Limit" key="stop-limit">
              <InnerTabs
                onChange={this.onSubTabChange}
                activeKey={this.state.subTab}
              >
                <TabPane tab="Buy" key="Buy">
                  <InputRow>
                    <Col span={12}>
                      <label>Amount</label>
                      <Input
                        min="0"
                        type="number"
                        step={stepValue}
                        addonAfter={this.props.crypto}
                        value={Precise(
                          this.state.fields.amount,
                          this.props.amountPrecision
                        )}
                        placeholder="0"
                        name="amount"
                        onChange={(e) => {
                          this.onFieldChange("amount", e.target.value);
                        }}
                      />
                      {this.state.mainTab === "stop-limit" &&
                      this.state.subTab === "Buy"
                        ? this.validator.message(
                            "stop_buy_amount",
                            this.state.fields.amount,
                            "required|gtzero|numeric|decimalrestrict8",
                            "trade-action-validation"
                          )
                        : delete this.validator.fields["stop_buy_amount"]}
                    </Col>
                    <Col span={12}>
                      <label>Limit Price</label>
                      <Input
                        min="0"
                        type="number"
                        step={limitPrecision}
                        addonAfter={this.props.currency}
                        value={Precise(
                          this.state.fields.limit,
                          this.props.pricePrecision
                        )}
                        placeholder="0"
                        name="limit"
                        onChange={(e) => {
                          this.onFieldChange("limit", e.target.value);
                        }}
                      />
                      {this.state.mainTab === "stop-limit" &&
                      this.state.subTab === "Buy"
                        ? this.validator.message(
                            "stop_limit_price_buy",
                            this.state.fields.limit,
                            "required|gtzero|numeric|decimalrestrict8",
                            "trade-action-validation"
                          )
                        : delete this.validator.fields["stop_limit_price_buy"]}
                    </Col>
                    <Col span={12}>
                      <label>Stop Price</label>
                      <Input
                        min="0"
                        type="number"
                        step={limitPrecision}
                        addonAfter={this.props.currency}
                        value={Precise(
                          this.state.fields.stop,
                          this.props.pricePrecision
                        )}
                        placeholder="0"
                        name="stop"
                        onChange={(e) => {
                          this.onFieldChange("stop", e.target.value);
                        }}
                      />
                      {this.state.mainTab === "stop-limit" &&
                      this.state.subTab === "Buy"
                        ? this.validator.message(
                            "stop_price_buy",
                            this.state.fields.stop,
                            "required|gtzero|numeric|decimalrestrict8",
                            "trade-action-validation"
                          )
                        : delete this.validator.fields["stop_price_buy"]}
                    </Col>
                    {this.state.latestFillPrice && (
                      <Col span={24}>
                        <TriggerDiv
                          className={this.state.disabledBtn ? "red" : ""}
                        >
                          <span>
                            Trigger
                            <Icon type="right" />{" "}
                          </span>
                          <span>
                            {Precise(
                              this.state.latestFillPrice,
                              this.props.pricePrecision
                            )}
                          </span>
                        </TriggerDiv>
                      </Col>
                    )}
                    <Col span={24}>
                      <Checkbox
                        value={this.state.fields.buycheck}
                        checked={this.state.fields.buycheck}
                        onChange={(e) =>
                          this.onCheckBoxChange("buycheck", e.target.checked)
                        }
                      >
                        Checkbox
                      </Checkbox>
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button
                        disabled={this.state.disabledBtn}
                        type="primary"
                        onClick={this.onSubmit}
                        loading={this.state.loader}
                      >
                        Buy
                      </Button>
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
                        step={stepValue}
                        addonAfter={this.props.crypto}
                        value={Precise(
                          this.state.fields.amount,
                          this.props.amountPrecision
                        )}
                        placeholder="0"
                        name="amount"
                        onChange={(e) => {
                          this.onFieldChange("amount", e.target.value);
                        }}
                      />
                      {this.state.mainTab === "stop-limit" &&
                      this.state.subTab === "Sell"
                        ? this.validator.message(
                            "stop_sell_amount",
                            this.state.fields.amount,
                            "required|gtzero|numeric|decimalrestrict8",
                            "trade-action-validation"
                          )
                        : delete this.validator.fields["stop_sell_amount"]}
                    </Col>
                    <Col span={12}>
                      <label>Limit Price</label>
                      <Input
                        min="0"
                        type="number"
                        step={limitPrecision}
                        addonAfter={this.props.currency}
                        value={Precise(
                          this.state.fields.limit,
                          this.props.pricePrecision
                        )}
                        placeholder="0"
                        name="limit"
                        onChange={(e) => {
                          this.onFieldChange("limit", e.target.value);
                        }}
                      />
                      {this.state.mainTab === "stop-limit" &&
                      this.state.subTab === "Sell"
                        ? this.validator.message(
                            "stop_limit_price_sell",
                            this.state.fields.limit,
                            "required|gtzero|numeric|decimalrestrict8",
                            "trade-action-validation"
                          )
                        : delete this.validator.fields["stop_limit_price_sell"]}
                    </Col>
                    <Col span={12}>
                      <label>Stop Price</label>
                      <Input
                        min="0"
                        type="number"
                        step={limitPrecision}
                        addonAfter={this.props.currency}
                        value={Precise(
                          this.state.fields.stop,
                          this.props.pricePrecision
                        )}
                        placeholder="0"
                        name="stop"
                        onChange={(e) => {
                          this.onFieldChange("stop", e.target.value);
                        }}
                      />
                      {this.state.mainTab === "stop-limit" &&
                      this.state.subTab === "Sell"
                        ? this.validator.message(
                            "stop_price_sell",
                            this.state.fields.stop,
                            "required|gtzero|numeric|decimalrestrict8",
                            "trade-action-validation"
                          )
                        : delete this.validator.fields["stop_price_sell"]}
                    </Col>
                    {this.state.latestFillPrice && (
                      <Col span={24}>
                        <TriggerDiv
                          className={this.state.disabledBtn ? "red" : ""}
                        >
                          <span>
                            Trigger
                            <Icon type="left" />{" "}
                          </span>
                          <span>
                            {Precise(
                              this.state.latestFillPrice,
                              this.props.pricePrecision
                            )}
                          </span>
                        </TriggerDiv>
                      </Col>
                    )}
                    <Col span={24}>
                      <Checkbox
                        value={this.state.fields.sellcheck}
                        checked={this.state.fields.sellcheck}
                        onChange={(e) =>
                          this.onCheckBoxChange("sellcheck", e.target.checked)
                        }
                      >
                        Checkbox
                      </Checkbox>
                    </Col>
                    <Col className="action-btn" span={24}>
                      <Button
                        disabled={this.state.disabledBtn}
                        type="primary"
                        onClick={this.onSubmit}
                        loading={this.state.loader}
                      >
                        Sell
                      </Button>
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
