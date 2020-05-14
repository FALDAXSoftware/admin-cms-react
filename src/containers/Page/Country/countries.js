import React, { Component } from "react";
import {
  Input,
  Tabs,
  Pagination,
  notification,
  Button,
  Select,
  Form,
  Row,
  Icon,
  Col
} from "antd";
import { countryTableInfos } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import EditCountryModal from "./editCountryModal";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT, EXPORT_LIMIT_SIZE } from "../../../helpers/globals";
import Metabase from "./countriesMetabase"
import { isAllowed } from "../../../helpers/accessControl";
// import { BackButton } from "../../Shared/backBttton";
import { BreadcrumbComponent } from "../../Shared/breadcrumb";
import { PageCounterComponent } from "../../Shared/pageCounter";
import { ExportToCSVComponent } from "../../Shared/exportToCsv";
import clone from "clone";
import { DateTimeCell } from "../../../components/tables/helperCells";
import { exportCountry } from "../../../helpers/exportToCsv/headers";

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { logout } = authAction;
var self;
class Countries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCountries: [],
      allCountryCount: 0,
      searchCountry: "",
      limit: PAGESIZE,
      errMessage: "",
      errMsg: false,
      errType: "Success",
      loader: false,
      page: 1,
      showEditCountryModal: false,
      countryDetails: [],
      localityVal: "",
      openCsvExportModal: "",
      csvData: []
    };
    self = this;
    Countries.countryStatus = Countries.countryStatus.bind(this);
    Countries.editCountry = Countries.editCountry.bind(this);
    Countries.showStates = Countries.showStates.bind(this);
  }

  static countryStatus(value, name, legality, color, is_active) {
    const { token } = this.props;

    self.setState({ loader: true });

    let formData = {
      id: value,
      legality,
      color,
      name,
      is_active: !is_active
    };

    ApiUtils.activateCountry(token, formData)
      .then(res => res.json())
      .then(res => {
        self.setState({
          errMsg: true,
          errMessage: res.message,
          errType: "Success",
          loader: false
        });
        self._getAllCountries();
      })
      .catch(() => {
        self.setState({
          errMsg: true,
          errMessage: "Unable to complete the requested action.",
          errType: "error"
        });
      });
  }

  static editCountry(value, name, legality, color, stateCount, is_active) {
    let countryDetails = {
      value,
      name,
      legality,
      color,
      stateCount,
      is_active
    };
    self.setState({ showEditCountryModal: true, countryDetails, page: 1 });
  }

  static showStates(value) {
    self.props.history.push("/dashboard/countries/" + value + "/states");
  }

  componentDidMount = () => {
    this._getAllCountries();
  };

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _getAllCountries = (isExportToCsv) => {
    const { token } = this.props;
    const {
      limit,
      searchCountry,
      page,
      localityVal,
      sorterCol,
      sortOrder
    } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    (isExportToCsv ? ApiUtils.getAllCountries(
      1,
      EXPORT_LIMIT_SIZE,
      token,
      "",
      ""
    ) : ApiUtils.getAllCountries(
      page,
      limit,
      token,
      searchCountry,
      localityVal,
      sorterCol,
      sortOrder
    ))
      .then(response => response.json())
      .then(function (res) {
        if (res.status == 200) {
          if (isExportToCsv) {
            let csvData = clone(res.data);
            csvData = csvData.map((ele) => {
              ele["updated_at"] = DateTimeCell(ele["updated_at"], 'string');
              ele["created_at"] = DateTimeCell(ele["created_at"], 'string');
              ele["deleted_at"] = DateTimeCell(ele["deleted_at"], 'string');
              ele["legality"] = ele["legality"] == 1
                ? "Legal"
                : ele["legality"] == 2
                  ? "Illegal"
                  : ele["legality"] == 3
                    ? "Neutral"
                    : "Partial Services Available"
              return ele;
            });
            _this.setState({ csvData });
          } else {
            _this.setState({
              allCountries: res.data,
              allCountryCount: res.CountryCount,
            });
          }
        } else if (res.status == 403) {
          _this.setState(
            { errMsg: true, message: res.err, errType: "error" },
            () => {
              _this.props.logout();
            }
          );
        } else {
          _this.setState({
            errMsg: true,
            message: res.message,
            errType: "error"
          });
        }
        _this.setState({ loader: false });
      })
      .catch(() => {
        _this.setState({
          errMsg: true,
          message: "Unable to complete the requested action.",
          errType: "error",
          loader: false
        });
      });
  };

  _closeEditCountryModal = () => {
    this.setState({ showEditCountryModal: false, countryDetails: [] });
  };

  _changeSearch = (field, e) => {
    this.setState({ searchCountry: field.target.value });
  };

  _searchCountry = e => {
    e.preventDefault();
    // var patt = new RegExp("^[_A-z0-9]*((-|s)*[_A-z0-9])*$");
    // if (patt.test(this.state.searchCountry)) {
    this.setState({ page: 1 }, () => {
      this._getAllCountries();
    });
    // } else {
    //   this.setState({
    //     errMsg: true,
    //     errMessage: "Special Characters are not allowed in search.",
    //     errType: "error",
    //     loader: false
    //   });
    // }
  };

  _resetFilters = () => {
    this.setState(
      {
        searchCountry: "",
        localityVal: "",
        page: 1,
        sorterCol: "",
        sortOrder: ""
      },
      () => {
        this._getAllCountries();
        this.props.history.push("/dashboard/countries");
      }
    );
  };

  _handleCountryPagination = page => {
    this.setState({ page }, () => {
      this._getAllCountries();
    });
  };

  _changeLocality = val => {
    this.setState({ localityVal: val });
  };

  _handleCountryChange = (pagination, filters, sorter) => {
    this.setState(
      { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
      () => {
        this._getAllCountries();
      }
    );
  };

  onExport = () => {
    this.setState({ openCsvExportModal: true }, () => this._getAllCountries(true));
  }

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getAllCountries();
    });
  };

  render() {
    const {
      allCountries,
      allCountryCount,
      errType,
      errMsg,
      loader,
      limit,
      page,
      showEditCountryModal,
      countryDetails,
      searchCountry,
      localityVal,
      openCsvExportModal,
      csvData
    } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS;

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <LayoutWrapper>
        {/* <BackButton {...this.props}/> */}
        <BreadcrumbComponent {...this.props} />
        <ExportToCSVComponent isOpenCSVModal={openCsvExportModal} onClose={() => { this.setState({ openCsvExportModal: false }) }} filename="country.csv" data={csvData} header={exportCountry} />
        <Tabs className="isoTableDisplayTab full-width">
          <TabPane
            tab={countryTableInfos[0].title}
            key={countryTableInfos[0].value}
          >
            <TableDemoStyle className="isoLayoutContent">
              <PageCounterComponent page={page} limit={limit} dataCount={allCountryCount} syncCallBack={this._resetFilters} />
              <Form onSubmit={this._searchCountry}>
                <Row type="flex" justify="start" className="table-filter-row">
                  <Col lg={8}>
                    <Form.Item
                      validateStatus={this.state.searchValid}
                      className="cty-search"
                    >
                      <Input
                        placeholder="Search countries"
                        onChange={this._changeSearch}
                        value={searchCountry}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={7}>
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      placeholder="Select a locality"
                      onChange={this._changeLocality}
                      value={localityVal}
                    >
                      <Option value={""}>All</Option>
                      <Option value={1}>Legal</Option>
                      <Option value={2}>Illegal</Option>
                      {/* <Option value={3}>Neutral</Option>
                      <Option value={4}>Partial Services Available</Option> */}
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
              {loader && <FaldaxLoader />}

              <div className="float-clear">
                <TableWrapper
                  {...this.state}
                  rowKey="id"
                  columns={countryTableInfos[0].columns}
                  pagination={false}
                  dataSource={allCountries}
                  className="isoCustomizedTable table-tb-margin"
                  onChange={this._handleCountryChange}
                  bordered
                  scroll={TABLE_SCROLL_HEIGHT}
                />
                {showEditCountryModal && (
                  <EditCountryModal
                    fields={countryDetails}
                    showEditCountryModal={showEditCountryModal}
                    closeEditCountryModal={this._closeEditCountryModal}
                    getAllCountry={this._getAllCountries.bind(this, 1)}
                  />
                )}
                {allCountryCount > 0 ? (
                  <Pagination
                    className="ant-users-pagination"
                    onChange={this._handleCountryPagination.bind(this)}
                    pageSize={limit}
                    current={page}
                    total={allCountryCount}
                    showSizeChanger
                    onShowSizeChange={this._changePaginationSize}
                    pageSizeOptions={pageSizeOptions}
                  />
                ) : (
                    ""
                  )}
              </div>
            </TableDemoStyle>
          </TabPane>
          {isAllowed("metabase_country_report") && (
            <TabPane tab="Report" key="metabase">
              <TableDemoStyle>
                <Metabase></Metabase>
              </TableDemoStyle>
            </TabPane>
          )}
        </Tabs>
      </LayoutWrapper>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      token: state.Auth.get("token")
    }),
    { logout }
  )(Countries)
);

export { Countries, countryTableInfos };
