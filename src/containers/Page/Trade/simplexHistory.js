import React, { Component } from "react";
import {
  Input,
  Pagination,
  notification,
  Icon,
  Select,
  DatePicker,
  Button,
  Form,
  Row,
  Col
} from "antd";
import { simplexTableInfos } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import moment from "moment";
import { CSVLink } from "react-csv";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
import {
  PAGE_SIZE_OPTIONS,
  PAGESIZE,
  TABLE_SCROLL_HEIGHT,
  EXPORT_LIMIT_SIZE
} from "../../../helpers/globals";
import { PageCounterComponent } from "../../Shared/pageCounter";
import { exportCreditCard } from "../../../helpers/exportToCsv/headers";
import { ExportToCSVComponent } from "../../Shared/exportToCsv";

const Option = Select.Option;
const { RangePicker } = DatePicker;
const { logout } = authAction;

class SimplexHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allSimplexTrades: [],
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
      trade_type: 2,
      sorterCol: "created_at",
      sortOrder: "descend",
      simplex_payment_status: "",
      openCsvModal:false,
      csvData:[]
    };
  }

  componentDidMount = () => {
    this._getAllSimplexTrades();
  };

  _getAllSimplexTrades = (isExportCsv=false) => {
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
      trade_type,
      simplex_payment_status
    } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    (isExportCsv?ApiUtils.getAllSimplexTrades(
        1,
        EXPORT_LIMIT_SIZE,
        token,
        "",
        "",
        "",
        "",
        "created_at",
       "descend",
        2,
        ""
      ):ApiUtils.getAllSimplexTrades(
      page,
      limit,
      token,
      searchTrade,
      filterVal,
      startDate,
      endDate,
      sorterCol,
      sortOrder,
      trade_type,
      simplex_payment_status
    ))
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          res.data = res.data.map(ele => {
            ele["simplex_payment_status"] =
              ele["simplex_payment_status"] == 1
                ? "Under Approval"
                : ele["simplex_payment_status"] == 2
                ? "Approved"
                : "Cancelled";
            return ele;
          });
          if(isExportCsv){
            _this.setState({csvData:res.data})
          }else
          {_this.setState({
            allSimplexTrades: res.data,
            allTradeCount: res.tradeCount
          });}
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
      this._getAllSimplexTrades();
    });
  };

  onExport=()=>{
      this.setState({openCsvModal:true},()=>this._getAllSimplexTrades(true))
  }
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
        sortOrder: "",
        simplex_payment_status: ""
      },
      () => {
        this._getAllSimplexTrades();
      }
    );
  };

  _changeFilter = val => {
    this.setState({ filterVal: val });
  };

  _changeStatus = val => {
    this.setState({ simplex_payment_status: val });
  };

  _handleTradePagination = page => {
    this.setState({ page }, () => {
      this._getAllSimplexTrades();
    });
  };

  _handleTradeTableChange = (pagination, filters, sorter) => {
    this.setState(
      { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
      () => {
        this._getAllSimplexTrades();
      }
    );
  };

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getAllSimplexTrades();
    });
  };

  render() {
    const {
      allSimplexTrades,
      allTradeCount,
      errType,
      errMsg,
      page,
      loader,
      limit,
      searchTrade,
      rangeDate,
      filterVal,
      simplex_payment_status,
      csvData,
      openCsvModal
    } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <TableDemoStyle className="isoLayoutContent">
        <ExportToCSVComponent isOpenCSVModal={openCsvModal} onClose={()=>{this.setState({openCsvModal:false})}} filename="credit_card.csv" data={csvData} header={exportCreditCard}/>
        <PageCounterComponent
          page={page}
          limit={limit}
          dataCount={allTradeCount}
          syncCallBack={this._resetFilters}
        />
        <Form onSubmit={this._searchTrade}>
          <Row type="flex" justify="start" className="table-filter-row">
            <Col md={6} sm={24}>
              <Input
                placeholder="Search trades"
                onChange={this._changeSearch.bind(this)}
                value={searchTrade}
                className="full-width"
              />
            </Col>
            {/* <Col sm={3}>
                                            <Select
                                                getPopupContainer={trigger => trigger.parentNode}
                                                placeholder="Select type"
                                                onChange={this._changeFilter}
                                                value={filterVal}
                                            >
                                                <Option value={''}>All</Option>
                                                <Option value={'Sell'}>Sell</Option>
                                                <Option value={'Buy'}>Buy</Option>
                                            </Select>
                                        </Col> */}
            <Col sm={24} md={3}>
              <Select
                getPopupContainer={trigger => trigger.parentNode}
                placeholder="Select Status"
                className="full-width"
                onChange={this._changeStatus}
                value={simplex_payment_status}
              >
                <Option value={""}>All</Option>
                <Option value={1}>Under Approval</Option>
                <Option value={2}>Approved</Option>
                <Option value={3}>Cancelled</Option>
              </Select>
            </Col>
            <Col md={6} sm={24}>
              <RangePicker
                value={rangeDate}
                disabledTime={this.disabledRangeTime}
                onChange={this._changeDate}
                format="YYYY-MM-DD"
                allowClear={false}
                className="full-width"
              />
            </Col>
            <Col xs={24} md={3} sm={24}>
              <Button
                htmlType="submit"
                className="filter-btn btn-full-width"
                type="primary"
              >
                <Icon type="search"></Icon>Search
              </Button>
            </Col>
            <Col xs={24} md={3} sm={24}>
              <Button
                className="filter-btn btn-full-width"
                type="primary"
                onClick={this._resetFilters}
              >
                <Icon type="reload" />
                Reset
              </Button>
            </Col>
            <Col xs={24} sm={24} md={3}>
              <Button className="filter-btn btn-full-width" type="primary" onClick={this.onExport}>
                Export
              </Button>
            </Col>
          </Row>
        </Form>

        {loader && <FaldaxLoader />}
        <TableWrapper
          {...this.state}
          rowKey="id"
          columns={simplexTableInfos[0].columns}
          pagination={false}
          dataSource={allSimplexTrades}
          className="table-tb-margin float-clear"
          onChange={this._handleTradeTableChange}
          scroll={TABLE_SCROLL_HEIGHT}
          bordered
        />
        {allTradeCount > 0 ? (
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
)(SimplexHistory);

export { SimplexHistory, simplexTableInfos };
