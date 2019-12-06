import React, { Component } from 'react';
import { Button, Tabs, notification, Modal } from 'antd';
import { networkFeeTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import EditNetworkFeeModal from './editNetworkFeeModal';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const TabPane = Tabs.TabPane;
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
    let data = {
      id: value,
      name: name,
      type: type,
      updated_at: updated_at,
      slug: slug,
      value: fees_value
    }
    self.setState({ showEditNetworkFeeModal: true, modalData: data })
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
        errMessage: "Something went wrong",
        loader: false
      });
    }
  }

  onCloseEditModal = () => {
    this.setState({ showEditNetworkFeeModal: false })
    this.getNetworkFee();
  }
  handleNetworkChange = (pagination, filters, sorter) => {
    this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order }, () => {
      this.getNetworkFee();
    })
  }
  render() {
    const { errType, errMsg, loader, coinFees, modalData, showEditNetworkFeeModal } = this.state;
    console.log("showEditNetworkFeeModel", showEditNetworkFeeModal);
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }
    return (

      <div>
        <TableWrapper
          {...this.state}
          columns={networkFeeTableInfos[0].columns}
          pagination={false}
          dataSource={coinFees}
          className="isoCustomizedTable"
          onChange={this.handleNetworkChange}
          style={{ width: "100%" }}
        />
        <EditNetworkFeeModal
          showEditNetworkFeeModal={showEditNetworkFeeModal}
          onCloseEditModal={this.onCloseEditModal}
          fields={modalData}
        />
      </div>

    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get('token')
  }), { logout })(NetworkFee);

export { NetworkFee, networkFeeTableInfos };
