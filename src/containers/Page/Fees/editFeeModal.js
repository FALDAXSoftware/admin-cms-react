import React, { Component } from "react";
import { connect } from "react-redux";
import ApiUtils from "../../../helpers/apiUtills";
import { Modal, Input, notification, Button } from "antd";
import SimpleReactValidator from "simple-react-validator";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";

const { logout } = authAction;

class EditFeeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditFeeModal: this.props.showEditFeeModal,
      loader: false,
      fields: this.props.fields,
      errMessage: "",
      errMsg: false,
      errType: "Success",
      isDisabled: false,
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
    // if (nextProps !== this.props) {
    //   this.setState({
    //     showEditPairModal: nextProps.showEditPairModal,
    //     fields: nextProps.fields,
    //   });
    //   this.validator = new SimpleReactValidator({
    //     className: "text-danger",
    //     custom_between: {
    //       message: "The :attribute must be between 1 to 9.",
    //       rule: function (val, params, validator) {
    //         if (isNaN(val)) {
    //           return false;
    //         } else if (
    //           parseFloat(val) >= parseFloat(params[0]) &&
    //           parseFloat(val) <= parseFloat(params[1])
    //         ) {
    //           return true;
    //         } else {
    //           return false;
    //         }
    //       },
    //       required: true,
    //     },
    //   });
    // }
  };

  _closeEditPairModal = () => {
    this.setState({ showEditFeeModal: false });
    this.props.closeEditModal();
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

  _resetEditForm = () => {
    const { fields } = this.state;
    fields["makerfee"] = "";
    fields["takerfee"] = "";
    this.setState({ fields });
  };

  _editPair = () => {
    const { token, getAllPairs } = this.props;
    let { fields } = this.state;
    if (this.validator.allValid()) {
      this.setState({ loader: true, isDisabled: true });
      let formData = {
        id: fields["id"],
        maker_fee: fields["makerfee"],
        taker_fee: fields["takerfee"],
      };
      ApiUtils.updateFee(token, formData)
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
                this._closeEditPairModal();
                getAllPairs();
              }
            );
            this._resetEditForm();
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
            errType: "error",
            errMsg: true,
            errMessage: "Unable to complete the requested action.",
            isDisabled: false,
            loader: false,
          });
          this._resetEditForm();
        });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  render() {
    const {
      loader,
      showEditFeeModal,
      fields,
      errType,
      errMsg,
      isDisabled,
    } = this.state;

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <Modal
        title="Edit Fee"
        visible={showEditFeeModal}
        onCancel={this._closeEditPairModal}
        confirmLoading={loader}
        footer={[
          <Button onClick={this._closeEditPairModal}>Cancel</Button>,
          <Button disabled={isDisabled} onClick={this._editPair}>
            Update
          </Button>,
        ]}
      >
        <div style={{ marginBottom: "15px" }}>
          <span>Trade Volume (30-Day Trailing Average):</span>
          <Input
            placeholder="Trade Volume"
            value={fields["tradevolume"]}
            disabled
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <span>Maker Fee:</span>
          <Input
            placeholder="Maker Fee"
            onChange={this._handleChange.bind(this, "makerfee")}
            value={fields["makerfee"]}
          />
          <span style={{ color: "red" }}>
            {this.validator.message(
              "Maker Fee",
              fields["makerfee"],
              "required|numeric",
              "text-danger"
            )}
          </span>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <span>Taker Fee:</span>
          <Input
            placeholder="Taker Fee"
            onChange={this._handleChange.bind(this, "takerfee")}
            value={fields["takerfee"]}
          />
          <span style={{ color: "red" }}>
            {this.validator.message(
              "Taker Fee",
              fields["takerfee"],
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
)(EditFeeModal);
