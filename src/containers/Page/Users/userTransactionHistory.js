import React, { Component } from "react";
import {
  Input,
  Pagination,
  notification,
  Select,
  Col,
  Button,
  Form,
  Row,
  Icon,
  DatePicker,
} from "antd";
import { transactionTableInfos } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import moment from "moment";
import FaldaxLoader from "../faldaxLoader";
// import { CSVLink } from "react-csv";
import authAction from "../../../redux/auth/actions";
import {
  PAGE_SIZE_OPTIONS,
  PAGESIZE,
  TABLE_SCROLL_HEIGHT,
  EXPORT_LIMIT_SIZE,
} from "../../../helpers/globals";
import { PrecisionCell } from "../../../components/tables/helperCells";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { PageCounterComponent } from "../../Shared/pageCounter";
import { exportTransactionHistory } from "../../../helpers/exportToCsv/headers";
import { ExportToCSVComponent } from "../../Shared/exportToCsv";

const Option = Select.Option;
// const TabPane = Tabs.TabPane;
const { logout } = authAction;
const { RangePicker } = DatePicker;

class UserTransactionHistory extends Component {
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
      user_name: "",
      startDate: "",
      endDate: "",
      rangeDate: [],
      openCsvModal: false,
      csvData: [],
    };
  }

  componentDidMount = () => {
    this._getUserTransactions();
  };

  openNotificationWithIconError = (type) => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage,
    });
    this.setState({ errMsg: false });
  };

  _copyNotification = () => {
    this.setState({
      errMsg: true,
      errType: "Info",
      errMessage: "Copied to Clipboard!!",
    });
  };

  addTransactionFees(data, fees) {
    return data.map((ele) => {
      ele["transaction_fees"] =
        ele["transaction_type"] == "send"
          ? ((parseFloat(ele.amount) * parseFloat(fees)) / 100).toFixed(8) +
            " " +
            ele.coin
          : "-";
      return ele;
    });
  }

  _getUserTransactions = (isExportToCsv = false) => {
    const { token, user_id } = this.props;
    const {
      searchTransaction,
      page,
      limit,
      startDate,
      endDate,
      filterVal,
      sorterCol,
      sortOrder,
    } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    (isExportToCsv
      ? ApiUtils.getUserTransaction(
          1,
          EXPORT_LIMIT_SIZE,
          token,
          searchTransaction,
          "",
          "",
          user_id,
          filterVal,
          "",
          ""
        )
      : ApiUtils.getUserTransaction(
          page,
          limit,
          token,
          searchTransaction,
          startDate,
          endDate,
          user_id,
          filterVal,
          sorterCol,
          sortOrder
        )
    )
      .then((response) => response.json())
      .then(function (res) {
        res.data = _this.addTransactionFees(
          res.data,
          res.default_send_Coin_fee
        );
        if (res.status == 200) {
          if (isExportToCsv) _this.setState({ csvData: res.data });
          else
            _this.setState({
              allTransactions: res.data,
              allTransactionCount: res.transactionCount,
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
            errType: "error",
          });
        }
        _this.setState({ loader: false });
      })
      .catch((err) => {
        _this.setState({
          errMsg: true,
          errMessage: "Unable to complete the requested action.",
          errType: "error",
          loader: false,
        });
      });
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
        disabledSeconds: () => [55, 56],
      };
    }
    return {
      disabledHours: () => this.range(0, 60).splice(20, 4),
      disabledMinutes: () => this.range(0, 31),
      disabledSeconds: () => [55, 56],
    };
  };

  _changeDate = (date, dateString) => {
    this.setState({
      rangeDate: date,
      startDate: moment(date[0]).toISOString(),
      endDate: moment(date[1]).toISOString(),
    });
  };

  _changeFilter = (val) => {
    this.setState({ filterVal: val });
  };

  _changeSearch = (field, e) => {
    this.setState({ searchTransaction: field.target.value });
  };

  _searchTransaction = (e) => {
    e.preventDefault();
    this._getUserTransactions();
  };

  _handleTransactionPagination = (page) => {
    this.setState({ page: page - 1 }, () => {
      this._getUserTransactions();
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
        page: 1,
      },
      () => {
        this._getUserTransactions();
      }
    );
  };

  _handleUserTransactionChange = (pagination, filters, sorter) => {
    this.setState(
      { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
      () => {
        this._getUserTransactions();
      }
    );
  };

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getUserTransactions();
    });
  };

  _changeDate = (date, dateString) => {
    this.setState({
      rangeDate: date,
      startDate: date.length > 0 ? moment(date[0]).toISOString() : "",
      endDate: date.length > 0 ? moment(date[1]).toISOString() : "",
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
      rangeDate,
      filterVal,
      searchTransaction,
      limit,
      csvData,
      openCsvModal,
    } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS;

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <LayoutWrapper>
        <ExportToCSVComponent
          isOpenCSVModal={openCsvModal}
          onClose={() => {
            this.setState({ openCsvModal: false });
          }}
          filename="user_transaction_history.csv"
          data={csvData}
          header={exportTransactionHistory}
        />
        <TableDemoStyle className="isoLayoutContent">
          <Form onSubmit={this._searchTransaction}>
            <PageCounterComponent
              page={page}
              limit={limit}
              dataCount={allTransactionCount}
              syncCallBack={this._resetFilters}
            />
            <Row type="flex" justify="start" className="table-filter-row">
              <Col sm={6} xs={24}>
                <Input
                  placeholder="Search transactions"
                  onChange={this._changeSearch.bind(this)}
                  value={searchTransaction}
                />
              </Col>
              <Col sm={3} xs={24}>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder="Select a type"
                  onChange={this._changeFilter}
                  value={filterVal}
                >
                  <Option value={""}>All</Option>
                  <Option value={"send"}>
                    <span className="camel-case field-error">
                      <Icon type="arrow-up" />
                      &nbsp;Send
                    </span>
                  </Option>
                  <Option value={"receive"}>
                    <span className="camel-case color-green">
                      <Icon type="arrow-down" />
                      &nbsp;Receive
                    </span>
                  </Option>
                </Select>
              </Col>
              <Col xs={12} md={6}>
                <RangePicker
                  value={rangeDate}
                  disabledTime={this.disabledRangeTime}
                  onChange={this._changeDate}
                  format="YYYY-MM-DD"
                  className="full-width"
                />
              </Col>
              <Col xs={12} sm={3}>
                <Button
                  htmlType="submit"
                  className="filter-btn full-width"
                  icon="search"
                  type="primary"
                >
                  Search
                </Button>
              </Col>
              <Col xs={12} sm={3}>
                <Button
                  className="filter-btn full-width"
                  type="primary"
                  icon="reload"
                  onClick={this._resetFilters}
                >
                  Reset
                </Button>
              </Col>
              <Col xs={12} sm={3}>
                <Button
                  className="filter-btn full-width"
                  type="primary"
                  icon="export"
                  onClick={() => {
                    this.setState({ openCsvModal: true }, () =>
                      this._getUserTransactions(true)
                    );
                  }}
                >
                  Export
                </Button>
              </Col>
            </Row>
          </Form>
          <div className="scroll-table">
            {loader && <FaldaxLoader />}
            <TableWrapper
              rowKey="id"
              {...this.state}
              columns={transactionTableInfos.columns}
              pagination={false}
              dataSource={allTransactions}
              className="table-tb-margin float-clear"
              onChange={this._handleUserTransactionChange}
              scroll={TABLE_SCROLL_HEIGHT}
              bordered
              expandedRowRender={(record) => {
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
                      className="copy-text-container"
                      text={record.transaction_id}
                      onCopy={this._copyNotification}
                    >
                      <span>{record.transaction_id}</span>
                    </CopyToClipboard>
                    <br />
                    <span>
                      <b>Name: </b>
                    </span>{" "}
                    {record.first_name + " " + record.last_name}
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
                      <b>Transaction Amount: </b>
                    </span>{" "}
                    {PrecisionCell(record.amount)}
                    <br />
                    <span>
                      <b>Base Amount: </b>
                    </span>{" "}
                    {PrecisionCell(record.actual_amount)}
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
                          record.transaction_type == "send" ? "red" : "green",
                      }}
                    >
                      {" "}
                      <Icon
                        type={
                          record.transaction_type == "send"
                            ? "arrow-up"
                            : "arrow-down"
                        }
                      />
                      &nbsp;
                      {record.transaction_type == "send" ? "Send" : "Receive"}
                    </span>
                    <br />
                    {/* <span>
                                      <b>Transaction Fees: </b>
                                    </span>{" "}
                                    {record.transaction_fees}
                                    <br /> */}
                    {record.transaction_type == "send" &&
                      (record.coin == "susu" || record.coin == "SUSU") && (
                        <>
                          <span>
                            <b>FALDAX Fees: </b>
                          </span>{" "}
                          {PrecisionCell(record.faldax_fee)}
                          <br />
                        </>
                      )}
                    {/* <span>
                                      <b>Network Fees: </b>
                                    </span>{" "}
                                    {record.transaction_type=="send"?PrecisionCell(record.network_fees):'-'}
                                    <br /> */}
                    <span>
                      <b>Estimated Network Fees: </b>
                    </span>{" "}
                    {PrecisionCell(record.estimated_network_fees)}
                    <br />
                    <span>
                      <b>Actual Network Fees: </b>
                    </span>{" "}
                    {PrecisionCell(record.actual_network_fees)}
                    <br />
                    <span>
                      <b>Residual Amount:</b>
                    </span>{" "}
                    {PrecisionCell(record.residual_amount)}
                    <br />
                    <span>
                      <b>Transaction From: </b>
                    </span>{" "}
                    {record.transaction_from}
                    <br />
                    {record.transaction_from == "Warmwallet to Send" && (
                      <>
                        <span>
                          <b>User (Sender) Balance Before Transaction: </b>
                        </span>
                        {record.sender_user_balance_before}
                        <br />
                      </>
                    )}
                    {record.transaction_from == "Destination To Receive" && (
                      <>
                        <span>
                          <b>User (Receiver) Balance Before Transaction: </b>
                        </span>
                        {record.receiver_user_balance_before}
                        <br />
                      </>
                    )}
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
          </div>
        </TableDemoStyle>
      </LayoutWrapper>
    );
  }
}

export default connect(
  (state) => ({
    token: state.Auth.get("token"),
  }),
  { logout }
)(UserTransactionHistory);

export { UserTransactionHistory };
