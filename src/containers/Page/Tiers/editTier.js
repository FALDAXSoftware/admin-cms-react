import React, { Component } from "react";
import { connect } from "react-redux";
import ApiUtils from "../../../helpers/apiUtills";
import { Input, notification, Button, Form, Col, Row, Switch } from "antd";
import SimpleReactValidator from "simple-react-validator";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
import { Link } from "react-router-dom";
import { isAllowed } from "../../../helpers/accessControl";

const { logout } = authAction;

class EditTier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      fields: {},
      tierID: "",
      errType: "Success",
      tierActive: true,
    };
    this.validator = new SimpleReactValidator({
      unlimited: {
        // name the rule
        message: 'The :attribute must be a number or type "Unlimited"',
        rule: function (val, params, validator) {
          let validation1 =
            this._testRegex(val, /^[0-9]*\.?\d*$/i) &&
            params.indexOf(val) === -1;
          if (validation1) {
            return true;
          } else {
            return val == "unlimited" || val == "Unlimited";
          }
        },
      },
    });
  }

  componentDidMount = () => {
    const { location } = this.props;
    let path = location.pathname.split("/");
    let tierId = path[path.length - 1];
    this.setState({
      tierID: tierId,
    });
    this._getTierDetails(tierId);
  };

  _getTierDetails = (tierId) => {
    const { token } = this.props;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getTierTierRequirement(token, tierId)
      .then((response) => response.json())
      .then(function (res) {
        if (res.status == 200) {
          let fields = res.data;
          let [
            {
              Account_Age,
              Minimum_Total_Transactions,
              Minimum_Total_Value_of_All_Transactions,
            },
            { Total_Wallet_Balance },
          ] = [
            res.data.minimum_activity_thresold,
            res.data.requirements_two ? res.data.requirements_two : "",
          ];
          fields["account_age"] = Account_Age;
          fields["total_tras"] = Minimum_Total_Transactions;
          fields["total_value"] = Minimum_Total_Value_of_All_Transactions;
          fields["total_fiat_value"] = Total_Wallet_Balance;
          _this.setState({ fields, tierActive: res.data.is_active });
        } else if (res.status == 403) {
          _this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              _this.props.logout();
            }
          );
        } else {
          _this.setState({ errMsg: true, errMessage: res.message });
        }
        _this.setState({ loader: false });
      })
      .catch((err) => {
        _this.setState({
          errType: "error",
          errMsg: true,
          errMessage: "Unable to complete the requested action.",
          loader: false,
        });
      });
  };

  openNotificationWithIconError = (type) => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage,
    });
    this.setState({ errMsg: false });
  };

  _handleChange = (field, e) => {
    let fields = this.state.fields;
    if (e.target.value.trim() == "") {
      fields[field] = "";
    } else {
      fields[field] = e.target.value;
    }
    this.setState({ fields });
  };

  _updateTier = (e) => {
    e.preventDefault();
    const { token } = this.props;
    let { fields } = this.state;
    let _this = this;
    var formData;
    if (this.state.tierID == "5") {
      formData = {
        id: fields["id"],
        daily_withdraw_limit: fields["daily_withdraw_limit"],
        max_trade_amount: fields["max_trade_amount"],
        max_allowed_days: fields["max_allowed_days"],
        is_active: this.state.tierActive,
      };
    } else {
      formData = {
        id: fields["id"],
        daily_withdraw_limit: fields["daily_withdraw_limit"],
        monthly_withdraw_limit: fields["monthly_withdraw_limit"],
        minimum_activity_thresold: {
          Account_Age: fields["account_age"],
          Minimum_Total_Transactions: fields["total_tras"],
          Minimum_Total_Value_of_All_Transactions: fields["total_value"],
        },
        requirements: fields.requirements,
        requirements_two: { Total_Wallet_Balance: fields["total_fiat_value"] },
      };
    }
    console.log(
      "test",
      formData,
      this.validator.allValid(),
      this.validator.fieldValid("daily_withdraw_limit"),
      this.validator.fieldValid("maximum_trade_amount"),
      this.validator.fieldValid("maximum_allowed_days")
      //   this.validator.fieldValid("account_age"),
      //   this.validator.fieldValid("minimum_total_transactions"),
      //   this.validator.fieldValid("total_value"),
      //   this.validator.fieldValid("Total wallet usd value")
    );
    if (this.state.tierID === "5") {
      if (
        this.validator.fieldValid("daily_withdraw_limit") &&
        this.validator.fieldValid("maximum_trade_amount") &&
        this.validator.fieldValid("maximum_allowed_days")
      ) {
        this.setState({ loader: true, isDisabled: true });
        ApiUtils.updateTier(token, formData)
          .then((res) => res.json())
          .then((res) => {
            if (res.status == 200) {
              _this.setState(
                {
                  errMsg: true,
                  errMessage: res.message,
                  errType: "Success",
                },
                () => {
                  _this.props.history.push("/dashboard/account-tier");
                }
              );
            } else if (res.status == 403) {
              _this.setState(
                { errMsg: true, errMessage: res.err, errType: "error" },
                () => {
                  _this.props.logout();
                }
              );
            } else {
              _this.setState({
                errMsg: true,
                errMessage: res.err,
                errType: "error",
              });
            }
            _this.setState({ loader: false });
          })
          .catch(() => {
            _this.setState({
              errType: "error",
              errMsg: true,
              errMessage: "Unable to complete the requested action.",
              loader: false,
            });
          });
      } else {
        this.validator.showMessages();
        this.forceUpdate();
      }
    } else {
      if (this.validator.allValid()) {
        this.setState({ loader: true, isDisabled: true });
        ApiUtils.updateTier(token, formData)
          .then((res) => res.json())
          .then((res) => {
            if (res.status == 200) {
              _this.setState(
                {
                  errMsg: true,
                  errMessage: res.message,
                  errType: "Success",
                },
                () => {
                  _this.props.history.push("/dashboard/account-tier");
                }
              );
            } else if (res.status == 403) {
              _this.setState(
                { errMsg: true, errMessage: res.err, errType: "error" },
                () => {
                  _this.props.logout();
                }
              );
            } else {
              _this.setState({
                errMsg: true,
                errMessage: res.err,
                errType: "error",
              });
            }
            _this.setState({ loader: false });
          })
          .catch(() => {
            _this.setState({
              errType: "error",
              errMsg: true,
              errMessage: "Unable to complete the requested action.",
              loader: false,
            });
          });
      } else {
        this.validator.showMessages();
        this.forceUpdate();
      }
    }
  };
  _tierStatus(checked) {
    this.setState({
      tierActive: checked,
    });
  }

  render() {
    const { loader, fields, errType, errMsg } = this.state;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <div className="isoLayoutContent">
        <div style={{ display: "inline-block", width: "100%" }}>
          <Link to="/dashboard/account-tier">
            <i
              style={{ marginRight: "10px", marginBottom: "10px" }}
              className="fa fa-arrow-left"
              aria-hidden="true"
            ></i>
            <a
              onClick={() => {
                this.props.history.push("/dashboard/account-tier");
              }}
            >
              Back
            </a>
          </Link>
        </div>
        <div>
          <h2>Update Tier</h2>
          <br />
        </div>
        <Form onSubmit={this._updateTier}>
          <Row style={{ marginBottom: "15px" }}>
            <Col>
              <span>Tier:</span>
              <Input placeholder="Tier" value={fields["tier_step"]} disabled />
            </Col>
          </Row>
          <Row style={{ marginBottom: "15px" }}>
            <Col>
              <span>Daily Withdraw Limit (USD):</span>
              <Input
                placeholder="Daily Withdraw Limit"
                onChange={this._handleChange.bind(this, "daily_withdraw_limit")}
                value={fields["daily_withdraw_limit"]}
              />
              <span style={{ color: "red" }}>
                {this.validator.message(
                  "daily_withdraw_limit",
                  fields["daily_withdraw_limit"],
                  "required|unlimited",
                  "text-danger"
                )}
              </span>
            </Col>
          </Row>
          <Row style={{ marginBottom: "15px" }}>
            {this.state.tierID == "5" ? (
              <Col>
                <span>Maximum Trade Amount (USD):</span>
                <Input
                  placeholder="Maximum Trade Amount"
                  onChange={this._handleChange.bind(this, "max_trade_amount")}
                  value={fields["max_trade_amount"]}
                />
                <span style={{ color: "red" }}>
                  {this.state.tierID == "5"
                    ? this.validator.message(
                        "maximum_trade_amount",
                        fields["max_trade_amount"],
                        "required|numeric",
                        "text-danger"
                      )
                    : delete this.validator.fields["maximum_trade_amount"]}
                </span>
              </Col>
            ) : (
              <Col>
                <span>Monthly Withdraw Limit (USD):</span>
                <Input
                  placeholder="Monthly Withdraw Limit"
                  onChange={this._handleChange.bind(
                    this,
                    "monthly_withdraw_limit"
                  )}
                  value={fields["monthly_withdraw_limit"]}
                />
                <span style={{ color: "red" }}>
                  {this.state.tierID != "5"
                    ? this.validator.message(
                        "monthly_withdraw_limit",
                        fields["monthly_withdraw_limit"],
                        "required|unlimited",
                        "text-danger"
                      )
                    : delete this.validator.fields["monthly_withdraw_limit"]}
                </span>
              </Col>
            )}
          </Row>
          <Row style={{ marginBottom: "15px" }}>
            {this.state.tierID == "5" ? (
              <Col>
                <span>Maximum Allowed Days (Trade):</span>
                <Input
                  placeholder="Maximum Allowed Days"
                  onChange={this._handleChange.bind(this, "max_allowed_days")}
                  value={fields["max_allowed_days"]}
                />
                <span style={{ color: "red" }}>
                  {this.state.tierID == "5"
                    ? this.validator.message(
                        "maximum_allowed_days",
                        fields["max_allowed_days"],
                        "required",
                        "text-danger"
                      )
                    : delete this.validator.fields["maximum_allowed_days"]}
                </span>
              </Col>
            ) : (
              <Col>
                <span>Minimum Account Age (Days):</span>
                <Input
                  placeholder="Account Age"
                  onChange={this._handleChange.bind(this, "account_age")}
                  value={fields["account_age"]}
                />
                <span style={{ color: "red" }}>
                  {this.state.tierID != "5"
                    ? this.validator.message(
                        "account_age",
                        fields["account_age"],
                        "required",
                        "text-danger"
                      )
                    : delete this.validator.fields["account_age"]}
                </span>
              </Col>
            )}
          </Row>
          {this.state.tierID == "5" ? (
            ""
          ) : (
            <>
              <Row style={{ marginBottom: "15px" }}>
                <Col>
                  <span>Minimum Total Number of Transactions of Trade:</span>
                  <Input
                    placeholder="Minimum Total Transactions"
                    onChange={this._handleChange.bind(this, "total_tras")}
                    value={fields["total_tras"]}
                  />
                  <span style={{ color: "red" }}>
                    {this.state.tierID != "5"
                      ? this.validator.message(
                          "minimum_total_transactions",
                          fields["total_tras"],
                          "required",
                          "text-danger"
                        )
                      : delete this.validator.fields[
                          "minimum_total_transactions"
                        ]}
                  </span>
                </Col>
              </Row>
              <Row style={{ marginBottom: "15px" }}>
                <Col>
                  <span>
                    Minimum Total Value of All Transactions of Trade (USD):
                  </span>
                  <Input
                    placeholder="Minimum Total Value of All Transactions"
                    onChange={this._handleChange.bind(this, "total_value")}
                    value={fields["total_value"]}
                  />
                  <span style={{ color: "red" }}>
                    {this.state.tierID != "5"
                      ? this.validator.message(
                          "total_value",
                          fields["total_value"],
                          "required",
                          "text-danger"
                        )
                      : delete this.validator.fields["total_value"]}
                  </span>
                </Col>
              </Row>
              <Row style={{ marginBottom: "15px" }}>
                <Col>
                  <span>Total Wallet Value (USD):</span>
                  <Input
                    placeholder="Total Wallet USD Value"
                    onChange={this._handleChange.bind(this, "total_fiat_value")}
                    value={fields["total_fiat_value"]}
                  />
                  <span style={{ color: "red" }}>
                    {this.state.tierID != "5"
                      ? this.validator.message(
                          "Total_wallet_usd_value",
                          fields["total_fiat_value"],
                          "required",
                          "text-danger"
                        )
                      : delete this.validator.fields["Total_wallet_usd_value"]}
                  </span>
                </Col>
              </Row>
            </>
          )}
          {this.state.tierID == "5" ? (
            <Row>
              <Col>
                <Switch
                  className="personal-btn"
                  checked={this.state.tierActive}
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  size="large"
                  onChange={this._tierStatus.bind(this)}
                />
                <br />
              </Col>
            </Row>
          ) : (
            ""
          )}
          {isAllowed("update_tier_list") && (
            <Row>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="user-btn"
                  style={{ marginLeft: "0px" }}
                >
                  Update
                </Button>
              </Col>
            </Row>
          )}
        </Form>
        {loader && <FaldaxLoader />}
      </div>
    );
  }
}

export default connect(
  (state) => ({
    token: state.Auth.get("token"),
  }),
  { logout }
)(EditTier);
