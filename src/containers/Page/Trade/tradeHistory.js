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
  Icon,
  Col
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
import { withRouter} from "react-router-dom";
import {ExecutionUl} from "../common.style";
import { PAGESIZE, PAGE_SIZE_OPTIONS, TABLE_SCROLL_HEIGHT, EXPORT_LIMIT_SIZE } from "../../../helpers/globals";
import { PageCounterComponent } from "../../Shared/pageCounter";
import { ExportToCSVComponent } from "../../Shared/exportToCsv";
import { exportCryptoOnly } from "../../../helpers/exportToCsv/headers";

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
      sortOrder: "descend",
      openCsvModal:false,
      csvData:[]
    };
  }

  componentDidMount = async() => {
    if(this.props.location.state){
        await this.setState({searchTrade:JSON.parse(this.props.location.state.orderId)})
    }
    this._getAllTrades();
  };

  _getAllTrades = (isExportCsv=false) => {
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
    (isExportCsv
      ? ApiUtils.getAllTrades(1, EXPORT_LIMIT_SIZE, token, "", "", "", "", "", "", 1)
      : ApiUtils.getAllTrades(
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
    )
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          if (isExportCsv) {
            _this.setState({ csvData: res.data });
          } else {
            _this.setState({
              allTrades: res.data,
              allTradeCount: res.tradeCount
            });
          }
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
          errMessage: "Unable to complete the requested action.",
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

  onExport=()=>{
    this.setState({openCsvModal:true},()=>this._getAllTrades(true));
  }
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
      filterVal,
      csvData,
      openCsvModal
    } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
        <TableDemoStyle className="isoLayoutContent full-width">
          <ExportToCSVComponent isOpenCSVModal={openCsvModal} onClose={()=>{this.setState({openCsvModal:false})}} filename="crypto_only.csv" data={csvData} header={exportCryptoOnly}/>
          <PageCounterComponent page={page} limit={limit} dataCount={allTradeCount} syncCallBack={this._resetFilters}/>
          <div><Form onSubmit={this._searchTrade}>
            <Row justify="start" type="flex" className="table-filter-row">
              <Col sm={6}>
                <Input
                  placeholder="Search trades"
                  onChange={this._changeSearch.bind(this)}
                  value={searchTrade}
                />
              </Col>
              <Col sm={3}>
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
              </Col>
              <Col sm={6}>
                <RangePicker
                  value={rangeDate}
                  disabledTime={this.disabledRangeTime}
                  onChange={this._changeDate}
                  format="YYYY-MM-DD"
                  allowClear={false}
                  className='full-width'
                />
              </Col>
              <Col xs={12} sm={3}>
                <Button
                  htmlType="submit"
                  className="filter-btn btn-full-width"
                  type="primary"
                >
                  <Icon type="search"/>Search
                </Button>
              </Col>
              <Col xs={12} sm={3}>
                <Button
                  className="filter-btn full-width"
                  type="primary"
                  onClick={this._resetFilters}
                ><Icon type="reload"></Icon>
                  Reset
                </Button>
              </Col>
              <Col xs={12} sm={3}>
                <Button className="filter-btn full-width" onClick={this.onExport} icon="export" type="primary">
                  Export
                </Button>
              </Col>
            </Row>
          </Form></div>
          <TableWrapper
            {...this.state}
            rowKey="id"
            columns={tradeTableInfos[0].columns}
            pagination={false}
            dataSource={allTrades}
            className="float-clear table-tb-margin"
            onChange={this._handleTradeTableChange}
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
          {allTradeCount > 0 && (
            <Pagination
              className="ant-users-pagination"
              onChange={this._handleTradePagination.bind(this)}
              pageSize={limit}
              current={page}
              total={parseInt(allTradeCount)}
              showSizeChanger
              onShowSizeChange={this._changePaginationSize}
              pageSizeOptions={pageSizeOptions}
            />
          )}
          {loader && <FaldaxLoader />}
        </TableDemoStyle>
    );
  }
}

export default withRouter(connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(TradeHistory));

export { TradeHistory, tradeTableInfos };
