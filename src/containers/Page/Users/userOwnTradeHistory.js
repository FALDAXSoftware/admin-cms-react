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
import { ownTradeTable } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
// import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
// import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import FaldaxLoader from "../faldaxLoader";
// import { CSVLink } from "react-csv";
import authAction from "../../../redux/auth/actions";
// import { ExecutionUl } from "../common.style";
import { PAGESIZE, PAGE_SIZE_OPTIONS, TABLE_SCROLL_HEIGHT, EXPORT_LIMIT_SIZE } from "../../../helpers/globals";
import { PageCounterComponent } from "../../Shared/pageCounter";
import { ExportToCSVComponent } from "../../Shared/exportToCsv";
import { exportCryptoOnly } from "../../../helpers/exportToCsv/headers";
import { PrecisionCell,DateTimeCell } from "../../../components/tables/helperCells";

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { logout } = authAction;

class UserOwnTradeHistory extends Component {
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
      trade_type: 3,
      sorterCol: "created_at",
      sortOrder: "descend",
      csvData:[],
      openCsvModal:false
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

  _getUserAllTrades = (isExportToCsv=false) => {
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
    (isExportToCsv?ApiUtils.getUserTrades(
      1,
      EXPORT_LIMIT_SIZE,
      token,
      "",
      user_id,
      "",
      "",
      "",
      trade_type
    ):ApiUtils.getUserTrades(
      page,
      limit,
      token,
      searchTrade,
      user_id,
      filterVal,
      sorterCol,
      sortOrder,
      trade_type
    ))
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          if(isExportToCsv)
          _this.setState({csvData:res.data})
          else
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
          errMessage: "Unable to complete the requested action.",
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
      limit,
      csvData,
      openCsvModal
    } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS;
  
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <>
          <ExportToCSVComponent
          isOpenCSVModal={openCsvModal}
          onClose={() => {
              this.setState({ openCsvModal: false });
          }}
          filename="user_crypto_only_history.csv"
          data={csvData}  
          header={exportCryptoOnly}
          />
          <Form onSubmit={this._searchTrade}>
          <PageCounterComponent page={page} limit={limit} dataCount={allTradeCount} syncCallBack={this._resetFilters}/>
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
                
                    <Button
                      type="primary"
                      icon ="export"
                      className="filter-btn btn-full-width"
                      onClick={() => {
                        this.setState({ openCsvModal: true }, () =>
                        this._getUserAllTrades(true)
                        );
                    }}
                    >
                      Export
                    </Button>
                
              </Col>
            </Row>
          </Form>

                {loader && <FaldaxLoader />}
                <div className="scroll-table">
                  <TableWrapper
                    rowKey="id"
                    {...this.state}
                    columns={ownTradeTable[0].columns}
                    pagination={false}
                    dataSource={allTrades}
                    className="table-tb-margin"
                    onChange={this._handleUserTradeChange}
                    scroll={TABLE_SCROLL_HEIGHT}
                    bordered
                    expandedRowRender={record => {
              return (
                <div>
                    <span><b>Created At</b>&nbsp;:&nbsp; {record['created_at']}</span><br/>
                    <span><b>Fill Price</b>&nbsp;:&nbsp;{PrecisionCell(record['fill_price'])}</span><br/>
                    <span><b>Side</b>&nbsp;:&nbsp;{record['side']}</span><br/>
                    <span><b>Order Type</b>&nbsp;:&nbsp;{record['order_type']}</span><br/>
                    <span><b>User Email</b>&nbsp;:&nbsp;{record['email']}</span><br/>
                    <span><b>Requested Email</b>&nbsp;:&nbsp;{record['requested_email']}</span><br/>
                    <span><b>Order Status</b>&nbsp;:&nbsp;{record['order_status']}</span><br/>
                    <span><b>Limit price</b>&nbsp;:&nbsp;{PrecisionCell(record['limit_price'])}</span><br/>
                    <span><b>Stop Price</b>&nbsp;:&nbsp;{PrecisionCell(record['stop_price'])}</span><br/>
                    <span><b>User Fees</b>&nbsp;:&nbsp;{record["user_fee"]+" "+record['user_coin']}</span><br/>
                    <span><b>Requested Fees</b>&nbsp;:&nbsp;{record["requested_fee"]+" "+record['requested_coin']}</span><br/>
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
                </>

    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(UserOwnTradeHistory);

export { UserOwnTradeHistory, ownTradeTable };
