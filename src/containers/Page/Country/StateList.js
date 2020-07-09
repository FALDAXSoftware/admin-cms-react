import React, { Component } from "react";
import {
  Input,
  notification,
  Row,
  Button,
  Col,
  Select,
  Form,
  Icon,
  Pagination,
} from "antd";
import { stateTableInfos } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import EditStateModal from "./editStateModal";
import FaldaxLoader from "../faldaxLoader";
// import { Link } from 'react-router-dom';
import authAction from "../../../redux/auth/actions";
// import { BackButton } from '../../Shared/backBttton';
import { BreadcrumbComponent } from "../../Shared/breadcrumb";
import { PageCounterComponent } from "../../Shared/pageCounter";
import { DateTimeCell } from "../../../components/tables/helperCells";
import { ExportToCSVComponent } from "../../Shared/exportToCsv";
import {
  PAGE_SIZE_OPTIONS,
  PAGESIZE,
  TABLE_SCROLL_HEIGHT,
  EXPORT_LIMIT_SIZE,
} from "../../../helpers/globals";
import clone from "clone";
import { exportState } from "../../../helpers/exportToCsv/headers";
const { logout } = authAction;
const Search = Input.Search;
const Option = Select.Option;
// const TabPane = Tabs.TabPane;
var self;

class StateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allStates: [],
      searchState: "",
      errMessage: "",
      errMsg: false,
      errType: "Success",
      loader: false,
      showEditStateModal: false,
      stateDetails: [],
      stateCount: 0,
      openCsvExportModal: "",
      csvData: [],
      localityVal: "",
      searchState: "",
      limit: PAGESIZE,
      page: 1,
    };
    self = this;
    StateList.stateStatus = StateList.stateStatus.bind(this);
    StateList.editState = StateList.editState.bind(this);
  }

  static stateStatus(value, name, legality, color, is_active) {
    const { token } = this.props;

    self.setState({ loader: true });
    let message = is_active
      ? "State has been inactivated successfully."
      : "State has been activated successfully.";
    let formData = {
      id: value,
      legality,
      color,
      name,
      is_active: !is_active,
    };

    ApiUtils.activateState(token, formData)
      .then((res) => res.json())
      .then((res) => {
        if (res.status == 200) {
          self.setState({
            loader: false,
            errMsg: true,
            errMessage: message,
            errType: "Success",
          });
          self._getAllStates();
        } else if (res.status == 403) {
          self.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              self.props.logout();
            }
          );
        } else {
          self.setState({
            errMsg: true,
            errMessage: res.message,
            searchState: "",
          });
        }
      })
      .catch(() => {
        self.setState({
          errMsg: true,
          errMessage: "Unable to complete the requested action.",
          errType: "error",
          loader: false,
        });
      });
  }

  static editState(value, name, legality, color, is_active) {
    let stateDetails = { value, name, legality, color, is_active };
    self.setState({ showEditStateModal: true, stateDetails });
  }

  componentDidMount = () => {
    this._getAllStates();
  };

  openNotificationWithIconError = (type) => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage,
    });
    this.setState({ errMsg: false });
  };

  _getAllStates = (isExportToCsv) => {
    const { token } = this.props;
    const {
      limit,
      searchState,
      page,
      localityVal,
      sorterCol,
      sortOrder,
    } = this.state;
    let _this = this;
    let countryId = "";
    let path = this.props.location.pathname.split("/");
    countryId = path[3];
    _this.setState({ loader: true });
    (isExportToCsv
      ? ApiUtils.getAllStates(1, countryId, EXPORT_LIMIT_SIZE, token, "", "")
      : ApiUtils.getAllStates(
          page,
          countryId,
          limit,
          token,
          searchState,
          localityVal,
          sorterCol,
          sortOrder
        )
    )
      .then((response) => response.json())
      .then((res) => {
        if (res.status == 200) {
          // Map to legality
          if (isExportToCsv) {
            let csvData = clone(res.data);
            csvData = csvData.map((ele) => {
              ele["updated_at"] = isExportToCsv
                ? DateTimeCell(ele["updated_at"], "string")
                : ele["updated_at"];
              ele["created_at"] = isExportToCsv
                ? DateTimeCell(ele["created_at"], "string")
                : ele["created_at"];
              ele["deleted_at"] = isExportToCsv
                ? DateTimeCell(ele["deleted_at"], "string")
                : ele["deleted_at"];
              ele.legality =
                ele.legality == 1
                  ? "Legal"
                  : ele.legality == 2
                  ? "Illegal"
                  : ele.legality == 3
                  ? "Neutral"
                  : "Partial Services Available";
              return ele;
            });
            _this.setState({ csvData });
          } else {
            res.data = res.data.map((ele) => {
              ele.legality =
                ele.legality == 1
                  ? "Legal"
                  : ele.legality == 2
                  ? "Illegal"
                  : ele.legality == 3
                  ? "Neutral"
                  : "Partial Services Available";
              return ele;
            });
            _this.setState({ allStates: res.data, stateCount: res.stateCount });
          }
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
            searchState: "",
          });
        }
        _this.setState({ loader: false });
      })
      .catch((error) => {
        _this.setState({
          loader: false,
          errMsg: true,
          errMessage: "Unable to complete the requested action.",
          errType: "error",
        });
      });
  };

  _closeEditStateModal = () => {
    this.setState({ showEditStateModal: false });
  };

  _searchState = (e) => {
    e.preventDefault();
    this.setState({ page: 1 }, () => {
      this._getAllStates();
    });
    // this.setState({ searchState: val, loader: true }, () => {
    //   this._getAllStates();
    // });
  };

  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const legalityA = a.legality.toUpperCase();
    const legalityB = b.legality.toUpperCase();

    let comparison = 0;
    if (legalityA > legalityB) {
      comparison = 1;
    } else if (legalityA < legalityB) {
      comparison = -1;
    }
    return comparison;
  }

  _handleStateChange = (pagination, filters, sorter) => {
    if (sorter.columnKey == "legality") {
      let { allStates } = this.state;
      if (sorter.order == "ascend") {
        allStates = allStates.sort(this.compare);
      } else if (sorter.order == "descend") {
        allStates = allStates.sort(this.compare);
        allStates = allStates.reverse();
      }
      this.setState({ allStates });
    } else {
      this.setState(
        { sorterCol: sorter.columnKey, sortOrder: sorter.order },
        () => {
          this._getAllStates();
        }
      );
    }
  };
  _changeSearch = (field, e) => {
    this.setState({ searchState: field.target.value });
  };
  _changeLocality = (val) => {
    this.setState({ localityVal: val });
  };
  onExport = () => {
    this.setState({ openCsvExportModal: true }, () => this._getAllStates(true));
  };
  _handleCountryPagination = (page) => {
    this.setState({ page }, () => {
      this._getAllStates();
    });
  };
  _resetFilters = () => {
    this.setState(
      {
        searchState: "",
        localityVal: "",
        page: 1,
        sorterCol: "",
        sortOrder: "",
      },
      () => {
        this._getAllStates();
        let countryId = "";
        let path = this.props.location.pathname.split("/");
        countryId = path[3];
        this.props.history.push(`/dashboard/countries/${countryId}/states`);
      }
    );
  };
  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getAllStates();
    });
  };

  render() {
    const {
      allStates,
      errType,
      errMsg,
      openCsvExportModal,
      csvData,
      loader,
      showEditStateModal,
      stateDetails,
      stateCount,
      localityVal,
      searchState,
      limit,
      page,
    } = this.state;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }
    let pageSizeOptions = PAGE_SIZE_OPTIONS;
    return (
      <LayoutWrapper>
        {/* <BackButton {...this.props}/> */}
        <BreadcrumbComponent {...this.props} />
        <TableDemoStyle className="isoLayoutContent">
          <PageCounterComponent
            page={page}
            limit={limit}
            dataCount={stateCount}
            syncCallBack={this._resetFilters}
          />
          <ExportToCSVComponent
            isOpenCSVModal={openCsvExportModal}
            onClose={() => {
              this.setState({ openCsvExportModal: false });
            }}
            filename="states.csv"
            data={csvData}
            header={exportState}
          />
          <Form onSubmit={this._searchState}>
            <Row type="flex" justify="start" className="table-filter-row">
              <Col lg={8}>
                <Form.Item
                  validateStatus={this.state.searchValid}
                  className="cty-search"
                >
                  <Input
                    placeholder="Search states"
                    onChange={this._changeSearch}
                    value={searchState}
                  />
                </Form.Item>
              </Col>
              <Col lg={7}>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder="Select a locality"
                  onChange={this._changeLocality}
                  value={localityVal}
                >
                  <Option value={""}>All</Option>
                  <Option value={1}>Legal</Option>
                  <Option value={2}>Illegal</Option>
                </Select>
              </Col>
              <Col lg={3}>
                <Button
                  htmlType="submit"
                  className="filter-btn btn-full-width"
                  type="primary"
                >
                  <Icon type="search" />
                  Search
                </Button>
              </Col>
              <Col lg={3}>
                <Button
                  className="filter-btn btn-full-width"
                  type="primary"
                  onClick={this._resetFilters}
                >
                  <Icon type="reload" />
                  Reset
                </Button>
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
          </Form>
          {/* <Row type="flex" justify="start" className="table-filter-row">
            <Col lg={8}>
              <Search
                placeholder="Search states"
                onSearch={(value) => this._searchState(value)}
                className="edit-profile-input"
                enterButton
              />
            </Col>
            <Col lg={7}>
              <Select
                style={{ width: "100%" }}
                getPopupContainer={(trigger) => trigger.parentNode}
                placeholder="Select a locality"
                onChange={this._changeLocality}
                value={localityVal}
              >
                <Option value={""}>All</Option>
                <Option value={1}>Legal</Option>
                <Option value={2}>Illegal</Option>
              </Select>
            </Col>
            <Col lg={3}>
              <Button type="primary" onClick={this.onExport} icon="export">
                Export
              </Button>
            </Col>
          </Row> */}
          {loader && <FaldaxLoader />}
          <div>
            <TableWrapper
              rowKey="id"
              {...this.state}
              columns={stateTableInfos[0].columns}
              pagination={false}
              dataSource={allStates}
              className="float-clear table-tb-margin"
              onChange={this._handleStateChange}
              bordered
              scroll={TABLE_SCROLL_HEIGHT}
            />
            {showEditStateModal && (
              <EditStateModal
                fields={stateDetails}
                showEditStateModal={showEditStateModal}
                closeEditStateModal={this._closeEditStateModal}
                getAllStates={this._getAllStates}
              />
            )}
            {stateCount > 0 ? (
              <Pagination
                className="ant-users-pagination"
                onChange={this._handleCountryPagination.bind(this)}
                pageSize={limit}
                current={page}
                total={stateCount}
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
)(StateList);

export { StateList, stateTableInfos };
