import React, { Component } from "react";
import {
  Input,
  Tabs,
  Pagination,
  Select,
  Button,
  DatePicker,
  notification,
  Form,
  Row,
  Icon,
  Col
} from "antd";
import { transactionTableInfos } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import moment from "moment";
import { CSVLink } from "react-csv";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
import {ColWithMarginBottom} from "../common.style";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT } from "../../../helpers/globals";
import { PrecisionCell } from "../../../components/tables/helperCells";

const { logout } = authAction;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { RangePicker } = DatePicker;


class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allTransactions: [],
      allTransactionCount: 0,
      searchTransaction: "",
      limit: PAGESIZE,
      errMessage: "",
      errMsg: false,
      errType: "Success",
      page: 1,
      loader: false,
      filterVal: "",
      startDate: "",
      endDate: "",
      rangeDate: [],
      metabaseUrl: ""
    };
  }

  componentDidMount = () => {
    this._getAllTransactions();
  };

  _getAllTransactions = () => {
    const { token } = this.props;
    const {
      searchTransaction,
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
    ApiUtils.getAllTransaction(
      page,
      limit,
      token,
      searchTransaction,
      filterVal,
      startDate,
      endDate,
      sorterCol,
      sortOrder
    )
      .then(response => response.json())
      .then(function (res) {
        if (res.status == 200) {
          res.data = _this.addTransactionFees(
            res.data,
            res.default_send_Coin_fee
          );
          _this.setState({
            allTransactions: res.data,
            allTransactionCount: res.transactionCount,
            fees: res.default_send_Coin_fee
          });
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
      .catch(() => {
        _this.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          errType: "error",
          loader: false
        });
      });
  };

  addTransactionFees(data, fees) {
    return data.map(ele => {
      ele["transaction_fees"] =
        ele["transaction_type"] == "send"
          ? ((parseFloat(ele.amount) * parseFloat(fees)) / 100).toFixed(8) +" "+ 
          ele.coin
          : "-";
      return ele;
    });
  }

  _searchTransaction = e => {
    e.preventDefault();
    this.setState({ page: 1 }, () => {
      this._getAllTransactions();
    });
  };

  _handleTransactionPagination = page => {
    this.setState({ page }, () => {
      this._getAllTransactions();
    });
  };

  _changeFilter = val => {
    this.setState({ filterVal: val });
  };

  _changeSearch = (field, e) => {
    this.setState({ searchTransaction: field.target.value });
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

  _resetFilters = () => {
    this.setState(
      {
        filterVal: "",
        searchTransaction: "",
        startDate: "",
        endDate: "",
        rangeDate: [],
        page: 1
      },
      () => {
        this._getAllTransactions();
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

  _handleTransactionTableChange = (pagination, filters, sorter) => {
    this.setState(
      { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
      () => {
        this._getAllTransactions();
      }
    );
  };

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getAllTransactions();
    });
  };



  _copyNotification = () => {
    this.setState({
      errMsg: true,
      errType: "info",
      errMessage: "Copied to Clipboard!!"
    });
  };

  render() {
    const {
      allTransactions,
      allTransactionCount,
      errType,
      errMsg,
      page,
      loader,
      searchTransaction,
      rangeDate,
      filterVal,
      limit,
      fees,
      metabaseUrl
    } = this.state;
    const transactionsHeaders = [
      { label: "Created On", key: "created_at" },
      { label: "Transaction Hash", key: "transaction_id" },
      { label: "Email", key: "email" },
      { label: "Source Address", key: "source_address" },
      { label: "Destination Address", key: "destination_address" },
      { label: "Amount", key: "amount" },
      { label: "Assets", key: "coin" },
      { label: "Transaction Type", key: "transaction_type" },
      // { label: "Transaction Fees(%)", key: "transaction_fees" }
    ];
    let pageSizeOptions = PAGE_SIZE_OPTIONS;

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (    
            <TableDemoStyle className="isoLayoutContent">
              <Form onSubmit={this._searchTransaction}>
                <Row type="flex" justify="start">
                  <ColWithMarginBottom md={6}>
                    <Input
                      placeholder="Search transactions"
                      onChange={this._changeSearch.bind(this)}
                      value={searchTransaction}
                    />
                  </ColWithMarginBottom>
                  <ColWithMarginBottom md={3}>
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      placeholder="Select a type"
                      onChange={this._changeFilter}
                      value={filterVal}
                    >
                      <Option value={""}>All</Option>
                      <Option value={"send"}>Send</Option>
                      <Option value={"receive"}>Receive</Option>
                    </Select>
                  </ColWithMarginBottom>
                  <ColWithMarginBottom md={6}>
                    <RangePicker
                      value={rangeDate}
                      disabledTime={this.disabledRangeTime}
                      onChange={this._changeDate}
                      format="YYYY-MM-DD"
                      className="full-width"
                    />
                  </ColWithMarginBottom>
                  <ColWithMarginBottom xs={12} md={3}>
                    <Button
                      htmlType="submit"
                      className="filter-btn btn-full-width"
                      type="primary"
                    >
                      <Icon type="search" />
                      Search
                    </Button>
                  </ColWithMarginBottom>
                  <ColWithMarginBottom xs={12} md={3}>
                    <Button
                      className="filter-btn btn-full-width"
                      type="primary"
                      onClick={this._resetFilters}
                    >
                      <Icon type="reload" />
                      Reset
                    </Button>
                  </ColWithMarginBottom>
                  <ColWithMarginBottom xs={12} md={3}>
                    {allTransactions && allTransactions.length > 0 ? (
                      <CSVLink
                        filename={"transaction_history.csv"}
                        data={allTransactions}
                        headers={transactionsHeaders}
                      >
                        <Button
                          className="filter-btn btn-full-width"
                          type="primary"
                        >
                          <Icon type="export"></Icon>
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
                  className="float-clear"
                  rowKey="id"
                  {...this.state}
                  columns={transactionTableInfos.columns}
                  pagination={false}
                  dataSource={allTransactions}
                  onChange={this._handleTransactionTableChange}
                  bordered
                  scroll={TABLE_SCROLL_HEIGHT}
                  expandedRowRender={record => {
                    return (
                      <div>
                        <span>
                          {" "}
                          <b>Created On: </b>
                        </span>{" "}
                        {moment
                          .utc(record.created_at)
                          .local()
                          .format("DD MMM, YYYY HH:mm:ss")}
                        <br />
                        <span>
                          <b>Transaction Hash: </b>
                        </span>
                        <CopyToClipboard
                          style={{ cursor: "pointer" }}
                          text={record.transaction_id}
                          onCopy={this._copyNotification}
                        >
                          <span>{record.transaction_id}</span>
                        </CopyToClipboard>
                        <br />
                        <span>
                          <b>Email: </b>
                        </span>{" "}
                        {record.email}
                        <br />
                        <span>
                          <b>Source Address: </b>
                        </span>{" "}
                        {record.source_address}
                        <br />
                        <span>
                          <b>Destination Address: </b>
                        </span>{" "}
                        {record.destination_address}
                        <br />
                        <span>
                          <b>Amount: </b>
                        </span>{" "}
                        {PrecisionCell(record.amount)}
                        <br />
                        <span>
                          <b>Asset: </b>
                        </span>{" "}
                        {record.coin}
                        <br />
                        <span>
                          <b>Transaction Type: </b>
                        </span>
                        <span
                          style={{
                            color:
                              record.transaction_type == "send"
                                ? "red"
                                : "green"
                          }}
                        >
                          {" "}
                          <Icon type={record.transaction_type=="send"?"arrow-up":"arrow-down"}/>&nbsp;{record.transaction_type=="send"?"Send":"Receive"}
                        </span>
                        <br />
                        {/* <span>
                          <b>Transaction Fees: </b>
                        </span>{" "}
                        {record.transaction_fees}
                        <br /> */}
                        <span>
                          <b>FALDAX Fees: </b>
                        </span>{" "}
                        {record.transaction_type=="send"?PrecisionCell(record.faldax_fee):"-"}
                        <br />
                        <span>
                          <b>Network Fees: </b>
                        </span>{" "}
                        {record.transaction_type=="send"?PrecisionCell(record.network_fees):'-'}
                        <br />
                        <span>
                          <b>Estimated Network Fees: </b>
                        </span>{" "}
                        {record.transaction_type=="send"?PrecisionCell(record.estimated_network_fees):'-'}
                        <br />
                        <span>
                          <b>Actual Network Fees: </b>
                        </span>{" "}
                        {record.transaction_type=="send"?PrecisionCell(record.actual_network_fees):'-'}
                        <br />
                      </div>
                    );
                  }}
                />
              {allTransactionCount > 0 ? (
                <Pagination
                  style={{ marginTop: "15px" }}
                  className="ant-users-pagination"
                  onChange={this._handleTransactionPagination.bind(this)}
                  pageSize={limit}
                  current={page}
                  total={parseInt(allTransactionCount)}
                  showSizeChanger
                  onShowSizeChange={this._changePaginationSize}
                  pageSizeOptions={pageSizeOptions}
                />
              ) : (
                ""
              )}
            </TableDemoStyle>  
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(Transactions);

