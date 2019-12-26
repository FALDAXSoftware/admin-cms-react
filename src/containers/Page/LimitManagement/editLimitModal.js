import React, { Component } from "react";
import { connect } from "react-redux";
import ApiUtils from "../../../helpers/apiUtills";
import { Modal, Input, notification } from "antd";
import SimpleReactValidator from "simple-react-validator";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
const { logout } = authAction;

class EditLimitModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditLimitModal: this.props.showEditLimitModal,
      loader: false,
      fields: this.props.fields,
      errMsg: false,
      errMessage: "",
      errType: "Success"
    };
    this.validator = new SimpleReactValidator();
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps !== this.props) {
      this.setState({
        showEditLimitModal: nextProps.showEditLimitModal,
        fields: nextProps.fields
      });
    }
  };

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
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

  _resetForm = () => {
    const { fields } = this.state;

    fields["daily_withdraw_crypto"] = "";
    fields["daily_withdraw_fiat"] = "";
    fields["min_withdrawl_crypto"] = "";
    fields["min_withdrawl_fiat"] = "";
    this.setState({ fields });
  };

  _closeEditLimitModal = () => {
    this.setState({ showEditLimitModal: false });
    this.props.closeEditModal();
  };

  _editLimit = () => {
    const { token, getAllLimits } = this.props;
    const { fields } = this.state;
    if (this.validator.allValid()) {
      this.setState({ loader: true });
      let formData = {
        id: fields["value"],
        daily_withdraw_crypto:parseFloat(fields["daily_withdraw_crypto"])>0?parseFloat(fields["daily_withdraw_crypto"]).toFixed(8):parseFloat(fields["daily_withdraw_crypto"]),
        daily_withdraw_fiat: parseFloat(fields["daily_withdraw_fiat"])>0?parseFloat(fields["daily_withdraw_fiat"]).toFixed(8):parseFloat(fields["daily_withdraw_fiat"]),
        min_withdrawl_crypto:parseFloat(fields["min_withdrawl_crypto"])>0?parseFloat(fields["min_withdrawl_crypto"]).toFixed(8):parseFloat(fields["min_withdrawl_crypto"]),
        min_withdrawl_fiat: parseFloat(fields["min_withdrawl_fiat"])>0?parseFloat(fields["min_withdrawl_fiat"]).toFixed(8):parseFloat(fields["min_withdrawl_fiat"]),
      };

      ApiUtils.updateLimit(token, formData)
        .then(res => res.json())
        .then(res => {
          if (res.status == 200) {
            this.setState({
              errMsg: true,
              errMessage: res.message,
              loader: false,
              errType: "Success"
            });
            this._closeEditLimitModal();
            getAllLimits();
            this._resetForm();
          } else if (res.status == 403) {
            this.setState(
              { errMsg: true, errMessage: res.err, errType: "error" },
              () => {
                this.props.logout();
              }
            );
          } else {
            this.setState({ errMsg: true, errMessage: res.message });
          }
        })
        .catch(() => {
          this.setState({
            errMsg: true,
            errMessage: "Something went wrong!!",
            loader: false,
            errType: "error"
          });
        });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  render() {
    const { loader, showEditLimitModal, fields, errMsg, errType } = this.state;

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <div>
        <Modal
          title="Edit Limit"
          visible={showEditLimitModal}
          onOk={this._editLimit}
          onCancel={this._closeEditLimitModal}
          confirmLoading={loader}
          okText="Update"
        >
          <div style={{ marginBottom: "15px" }}>
            <span>Daily Withdraw Crypto:</span>
            <Input
              placeholder="Daily Withdraw Crypto"
              onChange={this._handleChange.bind(this, "daily_withdraw_crypto")}
              value={fields["daily_withdraw_crypto"]}
              addonAfter={"$"}
            />
            <span style={{ color: "red" }}>
              {this.validator.message(
                "Daily Withdraw Crypto",
                fields["daily_withdraw_crypto"],
                "required|numeric",
                "text-danger"
              )}
            </span>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <span>Daily Withdraw Fiat:</span>
            <Input
              placeholder="Daily Withdraw Fiat"
              onChange={this._handleChange.bind(this, "daily_withdraw_fiat")}
              value={fields["daily_withdraw_fiat"]}
              addonAfter={"$"}
            />
            <span style={{ color: "red" }}>
              {this.validator.message(
                "Daily Withdraw Fiat",
                fields["daily_withdraw_fiat"],
                "required|numeric",
                "text-danger"
              )}
            </span>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <span>Minimum Withdraw Crypto:</span>
            <Input
              placeholder="Minimum Withdraw Crypto"
              onChange={this._handleChange.bind(this, "min_withdrawl_crypto")}
              value={fields["min_withdrawl_crypto"]}
              addonAfter={"$"}
            />
            <span style={{ color: "red" }}>
              {this.validator.message(
                "Minimum Withdraw Crypto",
                fields["min_withdrawl_crypto"],
                "required|numeric",
                "text-danger"
              )}
            </span>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <span>Minimum Withdraw Fiat:</span>
            <Input
              placeholder="Minimum Withdraw Fiat"
              onChange={this._handleChange.bind(this, "min_withdrawl_fiat")}
              value={fields["min_withdrawl_fiat"]}
              addonAfter={"$"}
            />
            <span style={{ color: "red" }}>
              {this.validator.message(
                "Minimum Withdraw Fiat",
                fields["min_withdrawl_fiat"],
                "required|numeric",
                "text-danger"
              )}
            </span>
          </div>
          {loader && <FaldaxLoader />}
        </Modal>
      </div>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(EditLimitModal);
