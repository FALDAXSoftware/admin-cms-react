import React, { Component } from "react";
import ApiUtils from "../../../helpers/apiUtills";
import authAction from "../../../redux/auth/actions";
import FaldaxLoader from "../faldaxLoader";
import { connect } from "react-redux";
import {
  PAGE_SIZE_OPTIONS,
  PAGESIZE,
  TABLE_SCROLL_HEIGHT,
  EXPORT_LIMIT_SIZE
} from "../../../helpers/globals";
import { PageCounterComponent } from "../../Shared/pageCounter";
import { ExportToCSVComponent } from "../../Shared/exportToCsv";
import { exportPanicHistory } from "../../../helpers/exportToCsv/headers";
import { notification, DatePicker, Row, Form, Input, Col, Button, Pagination } from "antd";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { DateTimeCell } from "../../../components/tables/helperCells";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import moment from "moment";

const { RangePicker } = DatePicker;
const tableColumn = [
  {
    title: "Created At",
    align: "left",
    ellipsis: true,
    key: "created_at",
    dataIndex:"created_at",
    width: 100,
    render: data => DateTimeCell(data)
  },
  {
    title: "IP",
    align: "left",
    ellipsis: true,
    key: "ip",
    dataIndex:"ip",
    width: 100,
  },
  {
    title: "Status",
    align: "left",
    ellipsis: true,
    dataIndex:"panic_status",
    key: "status",
    width: 100,
    render:data=>data?'Active':'Inactive'
  }
  
];
class PanicHistory extends Component {
  constructor(props) {
    super(props);
    this.state = { history: [],openCsvExportModal:false,sortCol:"",sortOrder:"",loader: false,page: 1,limit: PAGESIZE,rangeDate:"",csvData:[],startDate:"",endDate:"",count:0,searchData:""};
    this.loader = {
      show: () => this.setState({ loader: true }),
      hide: () => this.setState({ loader: false })
    };
  }
  componentDidMount() {
    this._init();
  }
  searchData = e => {
    e.preventDefault();
    this.setState({ page: 1 }, () => {
      this._init();
    });
  };
  _changeDate = (date, dateString) => {
    this.setState({
      rangeDate: date,
      startDate: date.length > 0 ? moment(date[0]).toISOString() : "",
      endDate: date.length > 0 ? moment(date[1]).toISOString() : ""
    });
  };
  _handleUserPagination = page => {
    this.setState({ page }, () => {
      this._init();
    });
  };

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._init();
    });
  };
   _init=async()=> {
    try {
      this.loader.show();
      let {page,limit,searchData,startDate,endDate,sortCol,sortOrder}=this.state;
      let response = await (
        await ApiUtils.getPanicBtnHistory(this.props.authToken,searchData,startDate,endDate,sortCol,sortOrder,page,limit)
      ).json();
      let { tradeCount,status, message, err, data } = response;
      if (status == 200) {
        this.setState({ history: data ,count:tradeCount});
      } else if (status == 400 || status == 401 || status == 403) {
        this.props.logout();
        this.openNotification("error", err ? err : message);
      } else {
        this.openNotification("error", err ? err : message);
      }
    } catch (error) {
      this.openNotification(
        "error",
        "Unable to complete the requested action."
      );
    } finally {
      this.loader.hide();
    }
  }
  openNotification = (type = "error", description = "") => {
    notification[type]({
      message: type,
      description: description
    });
  };

  onExportCSV = async () => {
    try {
      this.loader.show();
      let res = await await (
        await ApiUtils.getPanicBtnHistory(this.props.token,"","","","","",1,EXPORT_LIMIT_SIZE,)
      ).json();
      if (res.status == 200) {
        this.setState({ csvData: res.data, openCsvExportModal: true });
      } else if (res.status == 400 || res.status == 401 || res.status == 403) {
        this.props.logout();
        this.openNotification("error", res.err ? res.err : res.message);
      } else {
        this.openNotification("error", res.err ? res.err : res.message);
      }
    } catch (error) {
      this.openNotification(
        "error",
        "Unable to complete the requested action."
      );
    } finally {
      this.loader.hide();
    }
  };
  resetFilters = () => {
    this.setState(
      {
        searchData:"",
        page: 1,
        sorterCol: "",
        sortOrder: "",
        startDate:"",
        endDate:"",
        rangeDate:[]
      },
      () => {
        this._init();
      }
    );
  };

  render() {
    let [{ history,openCsvExportModal,loader,rangeDate,count,searchData,csvData,page,limit}] = [this.state];
    return (
      <>
        <TableDemoStyle className="isoLayoutContent">
          <ExportToCSVComponent
            isOpenCSVModal={openCsvExportModal}
            onClose={() => {
              this.setState({ openCsvExportModal: false });
            }}
            filename="panic_history.csv"
            data={csvData}
            header={exportPanicHistory}
          />
          <PageCounterComponent
            page={page}
            limit={limit}
            dataCount={count}
            syncCallBack={this.resetFilters}
          />
          {loader && <FaldaxLoader />}
          <Form onSubmit={this.searchData} className="cty-search">
            <Row className="table-filter-row" type="flex" justify="start">
              <Col lg={8} xs={24}>
                <Input
                  placeholder="Search"
                  onChange={e => {
                    this.setState({ searchData: e.target.value });
                  }}
                  value={searchData}
                />
              </Col>
              <Col lg={7} xs={24}>
                <RangePicker
                  value={rangeDate}
                  disabledTime={this.disabledRangeTime}
                  onChange={this._changeDate}
                  format="YYYY-MM-DD"
                  allowClear={true}
                  className="full-width"
                />
              </Col>
              <Col xs={24} lg={3}>
                <Button
                  htmlType="submit"
                  className="filter-btn btn-full-width"
                  type="primary"
                  icon="search"
                >
                  Search
                </Button>
              </Col>
              <Col xs={24} lg={3}>
                <Button
                  className="filter-btn btn-full-width"
                  type="primary"
                  onClick={this.resetFilters}
                  icon="reload"
                >
                  Reset
                </Button>
              </Col>
              <Col xs={24} lg={3}>
                <Button
                  className="filter-btn btn-full-width"
                  type="primary"
                  onClick={this.onExportCSV}
                  icon="export"
                >
                  Export
                </Button>
              </Col>
            </Row>
          </Form>
          <TableWrapper
            {...this.state}
            rowKey="id"
            columns={tableColumn}
            pagination={false}
            dataSource={history}
            className="table-tb-margin"
            onChange={this.handleTableChange}
            bordered
            scroll={TABLE_SCROLL_HEIGHT}
          />
        {count > 0 ? (<Pagination
          className="ant-users-pagination"
          onChange={this._handleUserPagination.bind(this)}
          pageSize={limit}
          current={page}
          total={count}
          showSizeChanger
          onShowSizeChange={this._changePaginationSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          />) : (
              ""
              )}
              </TableDemoStyle>
      </>
    );
  }
}

export default connect(
  state => ({
    authToken: state.Auth.get("token")
  }),
  { ...authAction }
)(PanicHistory);
