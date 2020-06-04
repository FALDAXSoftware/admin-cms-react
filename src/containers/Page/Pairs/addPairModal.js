import React, { Component } from "react";
import { connect } from "react-redux";
import ApiUtils from "../../../helpers/apiUtills";
import { Modal, Input, Select, notification, Button } from "antd";
import SimpleReactValidator from "simple-react-validator";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";

const { logout } = authAction;
const Option = Select.Option;

class AddPairModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddPairsModal: this.props.showAddPairsModal,
      loader: false,
      fields: {},
      allCoins: this.props.allCoins,
      selectedCoin1: "",
      selectedCoin2: "",
      errMessage: "",
      errMsg: false,
      errType: "Success",
      name: "",
      isDisabled: false,
      showCoin1Err: false,
      showCoin2Err: false,
      showError: false,
    };
    this.validator = new SimpleReactValidator({
      className: "text-danger",
      custom_between: {
        message: "The :attribute must be between 1 to 9.",
        rule: function (val, params, validator) {
          if (isNaN(val)) {
            return false;
          } else if (
            parseFloat(val) >= parseFloat(params[0]) &&
            parseFloat(val) <= parseFloat(params[1])
          ) {
            return true;
          } else {
            return false;
          }
        },
        required: true,
      },
    });
  }

  openNotificationWithIconError = (type) => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage,
    });
    this.setState({ errMsg: false });
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps !== this.props) {
      this.setState({
        showAddPairsModal: nextProps.showAddPairsModal,
        allCoins: nextProps.allCoins,
      });
      this.validator = new SimpleReactValidator({
        className: "text-danger",
        custom_between: {
          message: "The :attribute must be between 1 to 9.",
          rule: function (val, params, validator) {
            if (isNaN(val)) {
              return false;
            } else if (
              parseFloat(val) >= parseFloat(params[0]) &&
              parseFloat(val) <= parseFloat(params[1])
            ) {
              return true;
            } else {
              return false;
            }
          },
          required: true,
        },
      });
    }
  };

  _closeAddPairsModal = () => {
    this.setState({ showAddPairsModal: false });
    this.props.closeAddModal();
    this._resetAddForm();
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

  _resetAddForm = () => {
    const { fields } = this.state;

    fields["name"] = "";
    fields["price_precision"] = "";
    fields["quantity_precision"] = "";
    fields["order_maximum"] = "";
    this.setState({
      fields,
      selectedCoin1: "",
      selectedCoin2: "",
      name: "",
      showCoin2Err: false,
      showCoin1Err: false,
      showError: false,
    });
  };

  _addPairs = () => {
    const { token, getAllPairs } = this.props;
    let { fields, selectedCoin1, selectedCoin2, name } = this.state;

    if (
      this.validator.allValid() &&
      selectedCoin1 &&
      selectedCoin2 &&
      selectedCoin1 !== selectedCoin2
    ) {
      this.setState({ loader: true, isDisabled: true, showError: false });
      let formData = {
        name: name,
        coin_code1: selectedCoin1,
        coin_code2: selectedCoin2,
        price_precision: fields["price_precision"],
        quantity_precision: fields["quantity_precision"],
        order_maximum: fields["order_maximum"],
      };

      ApiUtils.addPair(token, formData)
        .then((res) => res.json())
        .then((res) => {
          if (res.status == 200) {
            this.setState(
              {
                errType: "success",
                errMsg: true,
                errMessage: res.message,
                isDisabled: false,
                loader: false,
              },
              () => {
                this._resetAddForm();
                this._closeAddPairsModal();
                getAllPairs();
              }
            );
          } else if (res.status == 403) {
            this.setState(
              { errMsg: true, errMessage: res.err, errType: "error" },
              () => {
                this.props.logout();
              }
            );
          } else {
            this.setState({
              errMsg: true,
              errMessage: res.err,
              loader: false,
              errType: "error",
              isDisabled: false,
            });
          }
        })
        .catch(() => {
          this.setState({
            errType: "error",
            errMsg: true,
            errMessage: "Unable to complete the requested action.",
            isDisabled: false,
            loader: false,
          });
          this._resetAddForm();
        });
    } else {
      this.setState({
        showCoin1Err: selectedCoin1.length > 0 ? false : true,
        showCoin2Err: selectedCoin2.length > 0 ? false : true,
        showError: selectedCoin1 == selectedCoin2 ? true : false,
      });
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  _changeCoin = (field, value) => {
    if (field === "coin_id1") {
      if (this.state.name.indexOf("-")) {
        let temp = this.state.name.split("-");
        this.setState(
          {
            selectedCoin1: value,
            name: value + "-" + (temp[1] == undefined ? "" : temp[1]),
          },
          () => {
            this.setState({
              showCoin1Err: this.state.selectedCoin1 ? false : true,
            });
          }
        );
      } else {
        this.setState({ selectedCoin1: value, name: value }, () => {
          this.setState({
            showCoin1Err: this.state.selectedCoin1 ? false : true,
          });
        });
      }
    } else {
      if (this.state.name.indexOf("-")) {
        let temp = this.state.name.split("-");
        this.setState(
          { selectedCoin2: value, name: temp[0] + "-" + value },
          () => {
            this.setState({
              showCoin2Err: this.state.selectedCoin2 ? false : true,
            });
          }
        );
      } else {
        this.setState(
          { selectedCoin2: value, name: this.state.name + "-" + value },
          () => {
            this.setState({
              showCoin2Err: this.state.selectedCoin2 ? false : true,
            });
          }
        );
      }
    }
  };

  render() {
    const {
      loader,
      showAddPairsModal,
      fields,
      name,
      showError,
      allCoins,
      errType,
      errMsg,
      isDisabled,
      showCoin1Err,
      showCoin2Err,
    } = this.state;

    let coinOptions = allCoins.map((coin) => {
      return (
        <Option value={coin.coin}>
          {coin.coin_name}-{coin.coin}
        </Option>
      );
    });
    let coinOptions1 = allCoins.map((coin) => {
      if (coin.coin == "BTC" || coin.coin == "ETH" || coin.coin == "PAX") {
        return (
          <Option value={coin.coin}>
            {" "}
            {coin.coin_name} - {coin.coin}
          </Option>
        );
      }
    });

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <Modal
        title="Add Pair"
        visible={showAddPairsModal}
        confirmLoading={loader}
        onCancel={this._closeAddPairsModal}
        footer={[
          <Button onClick={this._closeAddPairsModal}>Cancel</Button>,
          <Button disabled={isDisabled} onClick={this._addPairs}>
            Add
          </Button>,
        ]}
      >
        <div style={{ marginBottom: "15px" }}>
          <span>Pair Name:</span>
          <Input
            placeholder="Pair Name"
            onChange={this._handleChange.bind(this, "name")}
            value={name}
            disabled
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <span>Asset 1:</span>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            style={{ width: 200, marginLeft: "15px" }}
            placeholder="Select an Asset"
            onChange={this._changeCoin.bind(this, "coin_id1")}
          >
            {coinOptions}
          </Select>
          <br />
          {showCoin1Err && (
            <span style={{ color: "red" }}>
              {"The asset 1 field is required."}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <span>Asset 2:</span>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            style={{ width: 200, marginLeft: "15px" }}
            placeholder="Select an Asset"
            onChange={this._changeCoin.bind(this, "coin_id2")}
          >
            {coinOptions1}
          </Select>
          <br />
          {showCoin2Err && (
            <span style={{ color: "red" }}>
              {"The asset 2 field is required."}
            </span>
          )}
        </div>
        {showError && (
          <span style={{ color: "red" }}>
            {"The asset 1 & asset 2 field can not be same."}
          </span>
        )}

        <div style={{ marginBottom: "15px" }}>
          <span>Price Precision:</span>
          <Input
            placeholder="Price Precision"
            onChange={this._handleChange.bind(this, "price_precision")}
            value={fields["price_precision"]}
          />
          <span style={{ color: "red" }}>
            {this.validator.message(
              "Price Precision",
              fields["price_precision"],
              "required|numeric|custom_between:0,9",
              "text-danger"
            )}
          </span>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <span>Quantity Precision:</span>
          <Input
            placeholder="Quantity Precision"
            onChange={this._handleChange.bind(this, "quantity_precision")}
            value={fields["quantity_precision"]}
          />
          <span style={{ color: "red" }}>
            {this.validator.message(
              "Quantity precision",
              fields["quantity_precision"],
              "required|numeric|custom_between:0,9",
              "text-danger"
            )}
          </span>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <span>Maximum Order Quantity (USD):</span>
          <Input
            placeholder="Maximum Order Quantity"
            onChange={this._handleChange.bind(this, "order_maximum")}
            value={fields["order_maximum"]}
          />
          <span style={{ color: "red" }}>
            {this.validator.message(
              "Maximum Order Quantity",
              fields["order_maximum"],
              "required|numeric",
              "text-danger"
            )}
          </span>
        </div>
        {loader && <FaldaxLoader />}
      </Modal>
    );
  }
}

export default connect(
  (state) => ({
    token: state.Auth.get("token"),
  }),
  { logout }
)(AddPairModal);
