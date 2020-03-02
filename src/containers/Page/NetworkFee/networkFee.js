import React, { Component } from 'react';
import { notification } from 'antd';
import { networkFeeTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import EditNetworkFeeModal from './editNetworkFeeModal';
import authAction from '../../../redux/auth/actions';
import { withRouter} from "react-router-dom";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import {TwoFactorEnableModal } from '../../Shared/2faModal';

const { logout } = authAction;
var self;
class NetworkFee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coinFees: [],
      errMessage: '',
      errMsg: false,
      errType: 'Success',
      loader: false,
      modalData: {},
      showEditNetworkFeeModal: false,
      show2FAModel:false,
      show2FAEnableModel:false
    }
    self = this;
  }

  componentDidMount = () => {
    this.getNetworkFee();
  }

  openNotificationWithIconError = (type) => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };


  static edit(value, name, slug, type, updated_at, fees_value) {
    let {user}=self.props;
    let data = {
      id: value,
      name: name,
      type: type,
      updated_at: updated_at,
      slug: slug,
      value: fees_value
    }
    if(user.is_twofactor){
      self.setState({ showEditNetworkFeeModal: true, modalData: data })
    }else{
      self.setState({ show2FAEnableModel: true, modalData: data })
    }
  }


  hideLoader() {
    this.setState({ loader: false })
  }

  showLoader() {
    this.setState({ loader: true })
  }

  getNetworkFee = async () => {
    const { token } = this.props;
    const { sorterCol, sortOrder } = this.state;
    this.showLoader();
    try {
      let res = await (
        await ApiUtils.getNetworkFee(token, sorterCol, sortOrder, "")
      ).json();
      if (res.status == 200) {
        this.setState({ coinFees: res.feesValue });
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
      this.hideLoader();
    } catch (error) {
      this.setState({
        errType: "error",
        errMsg: true,
        errMessage: "Unable to complete the requested action.",
        loader: false
      });
    }
  }

  // updateNetworkFees=(otp)=>{
  //   let {modalData}=this.state;
  //   this.setState({modalData:{...modalData,otp:otp},showEditNetworkFeeModal:true,show2FAModel:false})
  // }

  onCloseEditModal = () => {
    this.setState({ showEditNetworkFeeModal: false })
    this.getNetworkFee();
  }
  on2FAModalClose=()=>{
    this.setState({show2FAModel:false})
  }
  on2FAEnableModalClose=()=>{
    this.setState({show2FAEnableModel:false})
  }

  handleNetworkChange = (pagination, filters, sorter) => {
    let {coinFees}=this.state;
    if(sorter.columnKey=="value"){
      if(sorter.order =="descend"){
        coinFees=coinFees.sort((a,b)=>parseFloat(a[sorter.columnKey])-parseFloat(b[sorter.columnKey]))
      }else  if(sorter.order =="ascend"){
        coinFees=coinFees.sort((a,b)=>parseFloat(b[sorter.columnKey])-parseFloat(a[sorter.columnKey]))
      }
    }
    this.setState(coinFees)
  }
  render() {
    const { errType, errMsg, show2FAEnableModel, coinFees, modalData, showEditNetworkFeeModal} = this.state;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }
    return (
      <TableDemoStyle className="isoLayoutContent">
        {/* {show2FAModel && <TwoFactorModal callback={this.updateNetworkFees} title="Update Network Fees" onClose={this.on2FAModalClose}/>} */}
        {show2FAEnableModel && <TwoFactorEnableModal title="Update Network Fees" onClose={this.on2FAEnableModalClose}/>}
        <TableWrapper
          rowKey="id"
          {...this.state}
          columns={networkFeeTableInfos[0].columns}
          pagination={false}
          dataSource={coinFees}
          className="isoCustomizedTable fill-width"
          onChange={this.handleNetworkChange}
          bordered
        />
        <EditNetworkFeeModal
          showEditNetworkFeeModal={showEditNetworkFeeModal}
          onCloseEditModal={this.onCloseEditModal}
          fields={modalData}
        />
      </TableDemoStyle>

    );
  }
}

export default withRouter(connect(
  state => ({
    token: state.Auth.get('token'),
    user:state.Auth.get('user')
  }), { logout })(NetworkFee));

