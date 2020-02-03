import React, { Component } from "react";
import {
  Input,
  Pagination,
  notification,
  Button,
  DatePicker,
  Select,
  Form,
  Row,
  Icon
} from "antd";
import { withdrawReqTableInfos } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import moment from "moment";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
import { CSVLink } from "react-csv";
import { ColWithMarginBottom } from "../common.style";
import DeclineActionModal from "./declineModal";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  PAGE_SIZE_OPTIONS,
  PAGESIZE,
  TABLE_SCROLL_HEIGHT
} from "../../../helpers/globals";
import { PrecisionCell } from "../../../components/tables/helperCells";

const Option = Select.Option;
const { RangePicker } = DatePicker;
const { logout } = authAction;
var self;

class WithdrawRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allRequests: [],
      allReqCount: 0,
      searchReq: "",
      limit: PAGESIZE,
      errMessage: "",
      errMsg: false,
      errType: "Success",
      page: 1,
      loader: false,
      startDate: "",
      endDate: "",
      filterVal: "",
      rangeDate: [],
      showDeclineModal: false,
      withdrawReqDetails: [],
      metabaseUrl: ""
    };
    self = this;
    WithdrawRequest.approveWithdrawReq = WithdrawRequest.approveWithdrawReq.bind(
      this
    );
    WithdrawRequest.declineWithdrawReq = WithdrawRequest.declineWithdrawReq.bind(
      this
    );
  }

  static approveWithdrawReq(
    value,
    email,
    source_address,
    destination_address,
    amount,
    transaction_type,
    is_approve,
    user_id,
    coin_id,
    is_executed,
    created_at,
    faldax_fee,
    network_fee,
    reason,
    actual_amount
  ) {
    let requestData = {
      value,
      email,
      source_address,
      destination_address,
      amount,
      transaction_type,
      is_approve,
      user_id,
      coin_id,
      is_executed,
      created_at,
      status: true,
      network_fee,
      faldax_fee,
      reason,
      actual_amount
    };
    self._updateWithdrawRequest(requestData);
  }

  static declineWithdrawReq(
    value,
    email,
    source_address,
    destination_address,
    amount,
    transaction_type,
    is_approve,
    user_id,
    coin_id,
    is_executed,
    created_at
  ) {
    let requestData = {
      value,
      email,
      source_address,
      destination_address,
      amount,
      transaction_type,
      is_approve,
      user_id,
      coin_id,
      is_executed,
      created_at,
      status: false
    };
    self.setState({ showDeclineModal: true, withdrawReqDetails: requestData });
  }

  _updateWithdrawRequest = requestData => {
    const { token } = this.props;
    let formData = {
      status: requestData.status,
      id: requestData.value,
      amount: requestData.amount,
      destination_address: requestData.destination_address,
      coin_id: requestData.coin_id,
      user_id: requestData.user_id,
      reason: requestData.reason,
      faldax_fee: requestData.faldax_fee,
      network_fee: requestData.network_fee,
      actual_amount: requestData.actual_amount
    };

    this.setState({ loader: true });
    ApiUtils.changeWithdrawStatus(token, formData)
      .then(res => res.json())
      .then(res => {
        if (res.status == 200) {
          this._getAllWithdrawReqs();
          this.setState({
            errMsg: true,
            errMessage: res.message,
            errType: "Success",
            loader: false
          });
        } else if (res.status == 403) {
          this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              this.props.logout();
            }
          );
        } else {
          this.setState({
            errType: "error",
            errMsg: true,
            errMessage: res.message,
            loader: false
          });
        }
      })
      .catch(() => {
        this.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          errType: "error",
          loader: false
        });
      });
  };

  componentDidMount = () => {
    this._getAllWithdrawReqs();
  };

  _getAllWithdrawReqs = () => {
    const { token } = this.props;
    const {
      searchReq,
      page,
      limit,
      filterVal,
      startDate,
      endDate,
      sorterCol,
      sortOrder
    } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getAllWithdrawRequests(
      page,
      limit,
      token,
      searchReq,
      filterVal,
      startDate,
      endDate,
      sorterCol,
      sortOrder
    )
      .then(response => response.json())
      .then(function (res) {
        if (res.status == 200) {
          _this.setState({
            allRequests: res.data,
            allReqCount: res.withdrawReqCount
          });
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
            errMessage: res.message,
            errType: "error"
          });
        }
        _this.setState({ loader: false });
      })
      .catch(() => {
        _this.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          errType: "error",
          loader: false
        });
      });
  };

  _searchReq = e => {
    e.preventDefault();
    this.setState({ page: 1 }, () => {
      this._getAllWithdrawReqs();
    });
  };

  _handleReqPagination = page => {
    this.setState({ page }, () => {
      this._getAllWithdrawReqs();
    });
  };

  _changeSearch = (field, e) => {
    this.setState({ searchReq: field.target.value });
  };

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  isabledRangeTime = (_, type) => {
    if (type === "start") {
      return {
        disabledHours: () => this.range(0, 60).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56]
      };
    }
    return {
      disabledHours: () => this.range(0, 60).splice(20, 4),
      disabledMinutes: () => this.range(0, 31),
      disabledSeconds: () => [55, 56]
    };
  };

  _changeDate = (date, dateString) => {
    this.setState({
      rangeDate: date,
      startDate: date.length > 0 ? moment(date[0]).toISOString() : "",
      endDate: date.length > 0 ? moment(date[1]).toISOString() : ""
    });
  };

  _changeFilter = val => {
    this.setState({ filterVal: val });
  };

  _resetFilters = () => {
    this.setState(
      {
        filterVal: "",
        searchReq: "",
        startDate: "",
        endDate: "",
        rangeDate: []
      },
      () => {
        this._getAllWithdrawReqs();
      }
    );
  };

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _handleWithdrawTableChange = (pagination, filters, sorter) => {
    this.setState(
      { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
      () => {
        this._getAllWithdrawReqs();
      }
    );
  };

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getAllWithdrawReqs();
    });
  };

  _closeDeclineModal = () => {
    this.setState({ showDeclineModal: false });
  };
  showCopyMsg=()=>{
    this.setState({err:true,errMessage:"Copied to Clipboard",errMsg:true,errType:"Info"})
  }

  render() {
    const {
      allRequests,
      allReqCount,
      errType,
      errMsg,
      page,
      loader,
      limit,
      searchReq,
      rangeDate,
      filterVal,
      showDeclineModal,
      withdrawReqDetails,
      metabaseUrl
    } = this.state;
    const requestHeaders = [
      { label: "Source Address", key: "source_address" },
      { label: "Destination Address", key: "destination_address" },
      { label: "Transaction Type", key: "transaction_type" },
      { label: "Amount", key: "amount" },
      { label: "Email", key: "email" },
      { label: "Asset", key: "coin_name" },
      { label: "Fees", key: "fees" },
      { label: "Created On", key: "created_at" }
    ];
    let pageSizeOptions = PAGE_SIZE_OPTIONS;

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <TableDemoStyle className="isoLayoutContent">
        <Form onSubmit={this._searchReq}>
          <Row>
            <ColWithMarginBottom sm={6}>
              <Input
                placeholder="Search Requests"
                onChange={this._changeSearch.bind(this)}
                value={searchReq}
              />
            </ColWithMarginBottom>
            <ColWithMarginBottom sm={3}>
              <Select
                getPopupContainer={trigger => trigger.parentNode}
                placeholder="Select a type"
                onChange={this._changeFilter}
                value={filterVal}
              >
                <Option value={""}>All</Option>
                <Option value={"null"}>Pending</Option>
                <Option value={"true"}>Approved</Option>
                <Option value={"false"}>Rejected</Option>
              </Select>
            </ColWithMarginBottom>
            <ColWithMarginBottom sm={6}>
              <RangePicker
                value={rangeDate}
                disabledTime={this.disabledRangeTime}
                onChange={this._changeDate}
                format="YYYY-MM-DD"
                className="full-width"
              />
            </ColWithMarginBottom>
            <ColWithMarginBottom xs={12} sm={3}>
              <Button
                htmlType="submit"
                className="filter-btn btn-full-width"
                type="primary"
              >
                <Icon type="search"></Icon>Search
              </Button>
            </ColWithMarginBottom>
            <ColWithMarginBottom xs={12} sm={3}>
              <Button
                className="filter-btn btn-full-width"
                type="primary"
                onClick={this._resetFilters}
              >
                <Icon type="reload" />
                Reset
              </Button>
            </ColWithMarginBottom>
            <ColWithMarginBottom xs={12} sm={3}>
              {allRequests && allRequests.length > 0 ? (
                <CSVLink
                  filename={"withdraw_requests.csv"}
                  data={allRequests}
                  headers={requestHeaders}
                >
                  <Button
                    type="primary"
                    className="filter-btn btn-full-width"
                    style={{ margin: "0px" }}
                  >
                    <Icon type="export" />
                    Export
                  </Button>
                </CSVLink>
              ) : (
                  ""
                )}
            </ColWithMarginBottom>
          </Row>
        </Form>
        {loader && <FaldaxLoader />}

        <TableWrapper
          {...this.state}
          rowKey="id"
          columns={withdrawReqTableInfos[0].columns}
          pagination={false}
          dataSource={allRequests}
          className="isoCustomizedTable table-tb-margin float-clear"
          onChange={this._handleWithdrawTableChange}
          bordered
          scroll={TABLE_SCROLL_HEIGHT}
          expandedRowRender={record => (
            <p style={{ margin: 0 }}>
              {
                <>
                  <b>Name</b> - {record.first_name + " " + record.last_name}{" "}
                  <br />
                  <b>Email ID</b> - {record.email} <br /> <b>Fees</b> -{" "}
                  {record.fees}% <br /> <b>Asset</b> - {record.coin_name}{" "}
                  {record.reason ? (
                   <span className="long-text-wrapper">
                      <b> Reason</b> - {record.reason}
                    </span>
                  ) : (
                      <br/>
                    )}
                  <b>Transaction ID</b> -{" "}
                  {record.transaction_id &&<CopyToClipboard text={record.transaction_id} onCopy={this.showCopyMsg}><span className="copy-text-container">{ record.transaction_id}</span></CopyToClipboard>}
                  <br />
                  <b>Actual Amount</b> -{" "}
                  {record.actual_amount
                    ? `${PrecisionCell(record.actual_amount)}${" "}${record.coin_code}`
                    : ""}
                  <br />
                  <b>Faldax Fee</b> -{" "}
                  {record.faldax_fee
                    ? `${PrecisionCell(record.faldax_fee)}${" "}${record.coin_code}`
                    : ""}
                  <br />
                  <b>Network Fee</b> -{" "}
                  {record.network_fee
                    ? `${PrecisionCell(record.network_fee)}${" "}${record.coin_code}`
                    : ""}
                </>
              }
            </p>
          )}
        />
        {allReqCount > 0 ? (
          <Pagination
            className="ant-users-pagination"
            onChange={this._handleReqPagination.bind(this)}
            pageSize={limit}
            current={page}
            total={parseInt(allReqCount)}
            showSizeChanger
            onShowSizeChange={this._changePaginationSize}
            pageSizeOptions={pageSizeOptions}
          />
        ) : (
            ""
          )}
        <DeclineActionModal
          showDeclineModal={showDeclineModal}
          withdrawReqDetails={withdrawReqDetails}
          closeDeclineModal={this._closeDeclineModal}
          getAllWithdrawReqs={this._getAllWithdrawReqs}
        />
      </TableDemoStyle>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(WithdrawRequest);
