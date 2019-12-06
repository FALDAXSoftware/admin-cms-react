import React, { Component } from "react";
import {
  Input,
  Pagination,
  notification,
  Select,
  DatePicker,
  Button,
  Form,
  Row,
  Icon
} from "antd";
import { tradeTableInfos } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import moment from "moment";
import { CSVLink } from "react-csv";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
import {ColWithMarginBottom} from "../common.style";
import {ExecutionUl} from "../common.style";
import { PAGESIZE, PAGE_SIZE_OPTIONS } from "../../../helpers/globals";

const Option = Select.Option;
const { RangePicker } = DatePicker;
const { logout } = authAction;

class TradeHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allTrades: [],
      allTradeCount: 0,
      searchTrade: "",
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
      trade_type: 1,
      sorterCol: "created_at",
      sortOrder: "descend"
    };
  }

  componentDidMount = () => {
    this._getAllTrades();
  };

  _getAllTrades = () => {
    const { token } = this.props;
    const {
      searchTrade,
      page,
      limit,
      filterVal,
      startDate,
      endDate,
      sorterCol,
      sortOrder,
      trade_type
    } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getAllTrades(
      page,
      limit,
      token,
      searchTrade,
      filterVal,
      startDate,
      endDate,
      sorterCol,
      sortOrder,
      trade_type
    )
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          _this.setState({
            allTrades: res.data,
            allTradeCount: res.tradeCount
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
      .catch(err => {
        _this.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          errType: "error",
          loader: false
        });
      });
  };

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _searchTrade = e => {
    e.preventDefault();
    this.setState({ page: 1 }, () => {
      this._getAllTrades();
    });
  };

  _changeSearch = (field, e) => {
    this.setState({ searchTrade: field.target.value });
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
        searchTrade: "",
        startDate: "",
        endDate: "",
        rangeDate: [],
        page: 1,
        sorterCol: "",
        sortOrder: ""
      },
      () => {
        this._getAllTrades();
      }
    );
  };

  _changeFilter = val => {
    this.setState({ filterVal: val });
  };

  _handleTradePagination = page => {
    this.setState({ page }, () => {
      this._getAllTrades();
    });
  };

  _handleTradeTableChange = (pagination, filters, sorter) => {
    this.setState(
      { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
      () => {
        this._getAllTrades();
      }
    );
  };

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getAllTrades();
    });
  };

  render() {
    const {
      allTrades,
      allTradeCount,
      errType,
      errMsg,
      page,
      loader,
      limit,
      searchTrade,
      rangeDate,
      filterVal
    } = this.state;
    const tradeHeaders = [
      { label: "Created On", key: "created_at" },
      { label: "Coin", key: "symbol" },
      { label: "Side", key: "side" },
      { label: "Email", key: "email" },
      { label: "Amount", key: "quantity" },
      { label: "Filled Price", key: "fill_price" },
      { label: "Network Fees", key: "network_fees" },
      { label: "Faldax Fees", key: "faldax_fees" },
      { label: "Order Id", key: "order_id" }
      //   { label: "Execution Report", key: "execution_report" }
      // { label: "Currency", key: "currency" },
      // { label: "Settle Currency", key: "settle_currency" },
      // { label: "Type", key: "side" },
      // { label: "Pair", key: "symbol" },
      // { label: "Quantity", key: "quantity" },
      // { label: "Order Id", key: "order_id" },
      // { label: "Price", key: "price" },
      // { label: "Fill Price", key: "fill_price" },
      // { label: "Maker Fee", key: "maker_fee" },
      // { label: "Taker Fee", key: "taker_fee" },
      // { label: "Maker Email", key: "reqested_user_email" },
      // { label: "Taker Email", key: "email" },
      // { label: "Created On", key: "created_at" }
    ];
    let pageSizeOptions = PAGE_SIZE_OPTIONS;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      // <LayoutWrapper>
        <TableDemoStyle className="isoLayoutContent full-width">
          {tradeTableInfos.map(tableInfo => (
            <div>
              <div style={{ display: "inline-block", width: "100%" }}>
                <Form onSubmit={this._searchTrade}>
                  <Row>
                    <ColWithMarginBottom sm={6}>
                      <Input
                        placeholder="Search trades"
                        onChange={this._changeSearch.bind(this)}
                        value={searchTrade}
                      />
                    </ColWithMarginBottom>
                    <ColWithMarginBottom sm={3}>
                      <Select
                        getPopupContainer={trigger => trigger.parentNode}
                        placeholder="Select type"
                        onChange={this._changeFilter}
                        value={filterVal}
                      >
                        <Option value={""}>All</Option>
                        <Option value={"Sell"}>Sell</Option>
                        <Option value={"Buy"}>Buy</Option>
                      </Select>
                    </ColWithMarginBottom>
                    <ColWithMarginBottom sm={6}>
                      <RangePicker
                        value={rangeDate}
                        disabledTime={this.disabledRangeTime}
                        onChange={this._changeDate}
                        format="YYYY-MM-DD"
                        allowClear={false}
                        className='full-width'
                      />
                    </ColWithMarginBottom>
                    <ColWithMarginBottom xs={12} sm={3}>
                      <Button
                        htmlType="submit"
                        className="search-btn btn-full-width"
                        type="primary"
                      >
                        <Icon type="search"/>Search
                      </Button>
                    </ColWithMarginBottom>
                    <ColWithMarginBottom xs={12} sm={3}>
                      <Button
                        className="search-btn full-width"
                        type="primary"
                        onClick={this._resetFilters}
                      ><Icon type="reload"></Icon>
                        Reset
                      </Button>
                    </ColWithMarginBottom>
                    <ColWithMarginBottom xs={12} sm={3}>
                      {allTrades && allTrades.length > 0 ? (
                        <CSVLink
                          filename={"trade_history.csv"}
                          data={allTrades}
                          headers={tradeHeaders}
                        >
                          <Button className="search-btn" type="primary">
                            <Icon type="export"></Icon>Export
                          </Button>
                        </CSVLink>
                      ) : (
                        ""
                      )}
                    </ColWithMarginBottom>
                  </Row>
                </Form>
              </div>
              {loader && <FaldaxLoader />}
              <TableWrapper
                {...this.state}
                columns={tableInfo.columns}
                pagination={false}
                dataSource={allTrades}
                className="isoCustomizedTable"
                onChange={this._handleTradeTableChange}
                expandedRowRender={record => {
                  return (
                    <div>
                      <span>
                        {/* {JSON.stringify(record.execution_report)} */}
                        {Object.keys(record.execution_report).length > 0 ? (
                          <ExecutionUl>
                            {Object.keys(record.execution_report).map(
                              (element, index) => {
                                return (
                                  <li>
                                    <span className="ex_head">
                                      <b>{element} : </b>
                                    </span>
                                    <span className="ex_data">
                                      {record.execution_report[element]}
                                    </span>
                                  </li>
                                );
                              }
                            )}
                          </ExecutionUl>
                        ) : (
                          <ExecutionUl>
                          </ExecutionUl>
                        )}
                      </span>
                    </div>
                  );
                }}
              />
              {allTradeCount > 0 ? (
                <Pagination
                  style={{ marginTop: "15px" }}
                  className="ant-users-pagination"
                  onChange={this._handleTradePagination.bind(this)}
                  pageSize={limit}
                  current={page}
                  total={allTradeCount}
                  showSizeChanger
                  onShowSizeChange={this._changePaginationSize}
                  pageSizeOptions={pageSizeOptions}
                />
              ) : (
                ""
              )}
            </div>
          ))}
        </TableDemoStyle>
      // </LayoutWrapper>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(TradeHistory);

export { TradeHistory, tradeTableInfos };
