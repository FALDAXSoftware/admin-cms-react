import React, { Component } from "react";
import {
  Input,
  Pagination,
  notification,
  Select,
  Button,
  Form,
  Row,
  Tabs,
  Icon,
  Col
} from "antd";
import { tradeTableInfos } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import FaldaxLoader from "../faldaxLoader";
import { CSVLink } from "react-csv";
import authAction from "../../../redux/auth/actions";
import { ExecutionUl } from "../common.style";
import { PAGESIZE, PAGE_SIZE_OPTIONS, TABLE_SCROLL_HEIGHT } from "../../../helpers/globals";

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { logout } = authAction;

class UserTradeHistory extends Component {
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
      trade_type: 1,
      sorterCol: "created_at",
      sortOrder: "descend"
    };
  }

  componentDidMount = () => {
    this._getUserAllTrades();
  };

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _changeSearch = (field, e) => {
    this.setState({ searchTrade: field.target.value });
  };

  _changeFilter = val => {
    this.setState({ filterVal: val });
  };

  _getUserAllTrades = () => {
    const { token, user_id } = this.props;
    const {
      searchTrade,
      page,
      limit,
      filterVal,
      sorterCol,
      sortOrder,
      trade_type
    } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getUserTrades(
      page,
      limit,
      token,
      searchTrade,
      user_id,
      filterVal,
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
          _this.setState({
            errMsg: true,
            errMessage: res.message,
            errType: "error"
          });
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

  _searchTrade = e => {
    e.preventDefault();
    this.setState({ page: 1 }, () => {
      this._getUserAllTrades();
    });
  };

  _handleTradePagination = page => {
    this.setState({ page }, () => {
      this._getUserAllTrades();
    });
  };

  _resetFilters = () => {
    this.setState({ filterVal: "", searchTrade: "", page: 1 }, () => {
      this._getUserAllTrades();
    });
  };

  _handleUserTradeChange = (pagination, filters, sorter) => {
    this.setState(
      { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
      () => {
        this._getUserAllTrades();
      }
    );
  };

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getUserAllTrades();
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
      filterVal,
      searchTrade,
      limit
    } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS;
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

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
        <TableDemoStyle className="isoLayoutContent">   
          <Form onSubmit={this._searchTrade}>
            <Row type="flex" justify="start" className="table-filter-row">
              <Col sm={8}>
                <Input
                  placeholder="Search trades"
                  onChange={this._changeSearch.bind(this)}
                  value={searchTrade}
                />
              </Col>
              <Col sm={7}>
                <Select
                  getPopupContainer={trigger => trigger.parentNode}
                  placeholder="Select a type"
                  onChange={this._changeFilter}
                  value={filterVal}
                >
                  <Option value={""}>All</Option>
                  <Option value={"Buy"}>Buy</Option>
                  <Option value={"Sell"}>Sell</Option>
                </Select>
              </Col>
              <Col xs={12} sm={3}>
                <Button
                  htmlType="submit"
                  className="filter-btn btn-full-width"
                  type="primary"
                >
                  <Icon type="search"></Icon>Search
                </Button>
              </Col>
              <Col xs={12} sm={3}>
                <Button
                  className="filter-btn btn-full-width"
                  type="primary"
                  onClick={this._resetFilters}
                >
                  <Icon type="reload"></Icon>Reset
                </Button>
              </Col>
              <Col xs={12} sm={3}>
                {allTrades && allTrades.length > 0 ? (
                  <CSVLink
                    filename={"user_trade_history.csv"}
                    data={allTrades}
                    headers={tradeHeaders}
                  >
                    <Button
                      type="primary"
                      icon ="export"
                      className="filter-btn btn-full-width"
                    >
                      Export
                    </Button>
                  </CSVLink>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </Form>

                {loader && <FaldaxLoader />}
                <div className="scroll-table">
                  <TableWrapper
                    rowKey="id"
                    {...this.state}
                    columns={tradeTableInfos[0].columns}
                    pagination={false}
                    dataSource={allTrades}
                    className="table-tb-margin"
                    onChange={this._handleUserTradeChange}
                    scroll={TABLE_SCROLL_HEIGHT}
                    bordered
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
                                <li>
                                  <span className="ex_head">
                                    <b>Faldax Fees : </b>
                                  </span>
                                  <span className="ex_data">
                                    {parseFloat(record.faldax_fees).toFixed(8)}
                                  </span>
                                </li>
                                <li>
                                  <span className="ex_head">
                                    <b>Network Fees : </b>
                                  </span>
                                  <span className="ex_data">
                                    {parseFloat(record.network_fees).toFixed(8)}
                                  </span>
                                </li>
                              </ExecutionUl>
                            ) : (
                              <ExecutionUl>
                                <li>
                                  <span className="ex_head">
                                    <b>Faldax Fees : </b>
                                  </span>
                                  <span className="ex_data">{record.faldax_fees}</span>
                                </li>
                                <li>
                                  <span className="ex_head">
                                    <b>Network Fees : </b>
                                  </span>
                                  <span className="ex_data">{record.network_fees}</span>
                                </li>
                              </ExecutionUl>
                            )}
                          </span>
                        </div>
                      );
                    }}
                  />
                  {allTradeCount > 0 ? (
                    <Pagination
                      className="ant-users-pagination"
                      onChange={this._handleTradePagination.bind(this)}
                      pageSize={50}
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
        </TableDemoStyle>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(UserTradeHistory);

export { UserTradeHistory, tradeTableInfos };
