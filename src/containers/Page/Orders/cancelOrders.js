import React, { Component } from "react";
import { Input, Pagination, notification, Row, Col, Button } from "antd";
import { cancelOrderTableInfos } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
import { BreadcrumbComponent } from "../../Shared/breadcrumb";
import { PageCounterComponent } from "../../Shared/pageCounter";
import { ExportToCSVComponent } from "../../Shared/exportToCsv";
import { exportSellOrder } from "../../../helpers/exportToCsv/headers";
import { withRouter } from "react-router";

import {
  PAGE_SIZE_OPTIONS,
  PAGESIZE,
  TABLE_SCROLL_HEIGHT
} from "../../../helpers/globals";
const Search = Input.Search;
const { logout } = authAction;

class CancelOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allOrders: [],
      allOrderCount: 0,
      searchOrder: "",
      limit: PAGESIZE,
      errMessage: "",
      errMsg: false,
      errType: "Success",
      page: 1,
      loader: false,
      csvData:[],
      openCsvExportModal:false
      
    };
  }

  componentDidMount = () => {
    this._getAllOrders();
  };

onExport=()=>{
    this.setState({openCsvExportModal:true},()=>this._getAllOrders(true));
  }
  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _getAllOrders = (isExportToCsv=false) => {
    const { token, user_id } = this.props;
    const { searchOrder, page, limit, sorterCol, sortOrder } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    (isExportToCsv?ApiUtils.getAllCancelledOrders(
     1,
      100000,
      token,
      "",
      "",
      "",
      ""
    ):ApiUtils.getAllCancelledOrders(
      page,
      limit,
      token,
      searchOrder,
      user_id,
      sorterCol,
      sortOrder
    ))
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          if(isExportToCsv){
            _this.setState({csvData:res.data})
          }else{
          _this.setState({
            allOrders: res.data,
            allOrderCount: res.cancelledOrderCount
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
      .catch(() => {
        _this.setState({
          errMsg: true,
          errMessage: "Unable to complete the requested action.",
          errType: "error",
          loader: false
        });
      });
  };

  _searchOrder = val => {
    this.setState({ searchOrder: val, page: 1 }, () => {
      this._getAllOrders();
    });
  };

  _handleOrderPagination = page => {
    this.setState({ page }, () => {
      this._getAllOrders();
    });
  };

  _handleCancelOrderChange = (pagination, filters, sorter) => {
    this.setState(
      { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
      () => {
        this._getAllOrders();
      }
    );
  };

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getAllOrders();
    });
  };

  render() {
    const {
      allOrders,
      allOrderCount,
      errType,
      errMsg,
      page,
      loader,
      limit,
      csvData,
      openCsvExportModal
    } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS;

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <TableDemoStyle className="isoLayoutContent">
       <BreadcrumbComponent {...this.props}/> 
        <ExportToCSVComponent isOpenCSVModal={openCsvExportModal} onClose={()=>{this.setState({openCsvExportModal:false})}} filename="cancel_order.csv" data={csvData} header={exportSellOrder}/>
        {cancelOrderTableInfos.map(tableInfo => (
          <div>
            <Row type="flex" justify="start" className="table-filter-row">
              <Col lg={8}>
                <Search
                  placeholder="Search Orders"
                  onSearch={value => this._searchOrder(value)}
                  enterButton
                />
              </Col>
              <Col lg={3}>
                <Button
                  className="filter-btn btn-full-width"
                  type="primary"
                  onClick={this.onExport}
                  icon="export"
                >
                  Export
                </Button>
              </Col>
            </Row>
            <TableWrapper
              {...this.state}
              columns={tableInfo.columns}
              pagination={false}
              dataSource={allOrders}
              className="isoCustomizedTable"
              onChange={this._handleCancelOrderChange}
              bordered
              Scroll={TABLE_SCROLL_HEIGHT}
            />
            {loader && <FaldaxLoader />}
            {allOrderCount > 0 ? (
              <Pagination
                style={{ marginTop: "15px" }}
                className="ant-users-pagination"
                onChange={this._handleOrderPagination.bind(this)}
                pageSize={limit}
                current={page}
                total={allOrderCount}
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
    );
  }
}

export default withRouter(connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(CancelOrders));

export { CancelOrders, cancelOrderTableInfos };
