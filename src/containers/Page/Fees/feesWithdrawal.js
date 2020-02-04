import React, { Component } from "react";
import { Tabs, notification, Input, Button } from "antd";
import ApiUtils from "../../../helpers/apiUtills";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import { connect } from "react-redux";
import FaldaxLoader from "../faldaxLoader";
import SimpleReactValidator from "simple-react-validator";
import authAction from "../../../redux/auth/actions";
import { isAllowed } from "../../../helpers/accessControl";
import { TwoFactorModal, TwoFactorEnableModal } from "../../Shared/2faModal";
const { logout } = authAction;

class FeesWithdrawal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allFeesData: [],
      feesDetails: [],
      errMessage: "",
      errMsg: false,
      errType: "",
      loader: false,
      fields: {},
      withdrawlFeesData: "",
      show2FAEnableModal:false,
      show2FAModal:false
    };
    this.validator = new SimpleReactValidator({
      className: "text-danger",
      custom_between: {
        message: "The :attribute must be between 1 to 100 %.",
        rule: function(val, params, validator) {
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
        required: true
      }
    });
    
  }


  componentDidMount = () => {
    this._getWithdrawlFeeData();
  };

  _getWithdrawlFeeData = async () => {
    const { token } = this.props;
    this.setState({ loader: true });
    try {
      let res = await (await ApiUtils.getWithdrawlFee(token)).json();
      if (res.status == 200) {
        let fields = this.state.fields;
        fields["default_send_coin_fee"] = res.withdrawFee[1].value;
        this.setState({ fields });
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
    } catch (err) {
      this.setState({
        errMsg: true,
        errMessage: "Something went wrong!!",
        errType: "error"
      });
    } finally {
      this.setState({ loader: false });
    }
  };

  _onChangeFields(field, e) {
    let fields = this.state.fields;
    if (e.target.value.trim() == "") {
      fields[field] = "";
    } else {
      fields[field] = e.target.value;
    }
    this.setState({ fields });
  }

  onSubmit=()=>{
    let {user}=this.props;
    if(user.is_twofactor){
      this.setState({show2FAModal:true})
    }else{
      this.setState({show2FAEnableModal:true})
    }
  }

  _updateSendFee = async (otp) => {
    const { token } = this.props;
    let fields = this.state.fields;
    if (this.validator.allValid()) {
      this.setState({ loader: true });
      const formData = {
        send_coin_fee: fields["default_send_coin_fee"],
        otp: otp
      };
      try {
        let res = await (
          await ApiUtils.updateSendCoinFee(token, formData)
        ).json();
        if (res.status == 200) {
          this.setState(
            {
              errMsg: true,
              errMessage: res.message,
              loader: false,
              errType: "Success",
              show2FAModal:false
            },
            () => {
              this._getWithdrawlFeeData();
            }
          );
        } else if (res.status == 403) {
          this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" ,show2FAModal:false},
            () => {
              this.props.logout();
            }
          );
        } else {
          this.setState({
            errMsg: true,
            errMessage: res.message,
            loader: false,
            errType: "error",
            show2FAModal:false
          });
        }
      } catch (error) {
      } finally {
        this.setState({ loader: false });
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  openNotificationWithIcon = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  render() {
    const { errMsg, errType, loader, fields,show2FAModal,show2FAEnableModal } = this.state;
    if (errMsg) {
      this.openNotificationWithIcon(errType.toLowerCase());
    }
    return (
      <TableDemoStyle className="isoLayoutContent">
        {show2FAModal && <TwoFactorModal callback={this._updateSendFee} title="Withdrawal Fees" onClose={()=>this.setState({show2FAEnableModal:false,show2FAModal:false})}/>}
        {show2FAEnableModal && <TwoFactorEnableModal title="Withdrawal Fees" onClose={()=>this.setState({show2FAEnableModal:false,show2FAModal:false})}/>}
        <div className="fees-container">
          <span>
            <b>Withdrawal Fee</b>
          </span>
          <Input
            addonAfter={"%"}
            placeholder="Withdrawal Fee"
            onChange={this._onChangeFields.bind(this, "default_send_coin_fee")}
            value={fields["default_send_coin_fee"]}
          />
          <span className="field-error">
            {this.validator.message(
              "withdrawal fee",
              fields["default_send_coin_fee"],
              "required|custom_between:0,100"
            )}
          </span>
          <div className="fees-divider"></div>
            {isAllowed("update_send_coin_fee") && (
            <>
                <Button
                type="primary"
                onClick={this.onSubmit}
                >
                Update
                </Button>
            </>
            )}
        </div>
        {loader && <FaldaxLoader />}
      </TableDemoStyle>
    );
  }
}

export default connect(
  state => ({
    user: state.Auth.get("user"),
    token: state.Auth.get("token")
  }),
  { logout }
)(FeesWithdrawal);

