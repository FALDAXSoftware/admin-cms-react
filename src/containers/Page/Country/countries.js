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
import ColWithMarginBottom from "../common.style";
import authAction from "../../../redux/auth/actions";
import { PAGE_SIZE_OPTIONS, PAGESIZE } from "../../../helpers/globals";

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
      localityVal: ""
    };
    self = this;
    Countries.countryStatus = Countries.countryStatus.bind(this);
    Countries.editCountry = Countries.editCountry.bind(this);
    Countries.showStates = Countries.showStates.bind(this);
  }

  static countryStatus(value, name, legality, color, is_active) {
    const { token } = this.props;

    self.setState({ loader: true });
    let message = is_active
      ? "Country has been inactivated successfully."
      : "Country has been activated successfully.";
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
          errMessage: message,
          errType: "Success",
          loader: false
        });
        self._getAllCountries();
      })
      .catch(() => {
        self.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
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
    self.props.history.push("/dashboard/country/" + value + "/states");
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

  _getAllCountries = () => {
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
    ApiUtils.getAllCountries(
      page,
      limit,
      token,
      searchCountry,
      localityVal,
      sorterCol,
      sortOrder
    )
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          _this.setState({
            allCountries: res.data,
            allCountryCount: res.CountryCount
          });
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
          message: "Something went wrong!!",
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
    var patt = new RegExp("^[_A-z0-9]*((-|s)*[_A-z0-9])*$");
    if (patt.test(this.state.searchCountry)) {
      this.setState({ page: 1 }, () => {
        this._getAllCountries();
      });
    } else {
      this.setState({
        errMsg: true,
        errMessage: "Special Characters are not allowed in search.",
        errType: "error",
        loader: false
      });
    }
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
      localityVal
    } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS;

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <LayoutWrapper>
        <Tabs className="isoTableDisplayTab">
          <TabPane
            tab={countryTableInfos[0].title}
            key={countryTableInfos[0].value}
          >
            <TableDemoStyle className="isoLayoutContent">
                <Form onSubmit={this._searchCountry}>
                  <Row gutter={[0,16]}>
                    <ColWithMarginBottom lg={7}>
                      <Form.Item
                        style={{ margin: 0 }}
                        validateStatus={this.state.searchValid}
                        className="cty-search"
                      >
                        <Input
                          placeholder="Search countries"
                          onChange={this._changeSearch}
                          value={searchCountry}
                        />
                      </Form.Item>
                    </ColWithMarginBottom>
                    <ColWithMarginBottom lg={7}>
                      <Select
                        getPopupContainer={trigger => trigger.parentNode}
                        placeholder="Select a locality"
                        onChange={this._changeLocality}
                        value={localityVal}
                      >
                        <Option value={""}>All</Option>
                        <Option value={1}>Legal</Option>
                        <Option value={2}>Illegal</Option>
                        <Option value={3}>Neutral</Option>
                        <Option value={4}>Partial Services Available</Option>
                      </Select>
                    </ColWithMarginBottom>
                    <ColWithMarginBottom lg={3}>
                      <Button
                        htmlType="submit"
                        className="search-btn btn-full-width"
                        type="primary"
                      >
                        <Icon type="search" />
                        Search
                      </Button>
                    </ColWithMarginBottom>
                    <ColWithMarginBottom lg={3}>
                      <Button
                        className="search-btn btn-full-width"
                        type="primary"
                        onClick={this._resetFilters}
                      >
                        <Icon type="reload" />
                        Reset
                      </Button>
                    </ColWithMarginBottom>
                  </Row>
                </Form>
              {loader && <FaldaxLoader />}
              {countryTableInfos.map(tableInfo => (
                <div className="float-clear"> 
                  <TableWrapper
                    {...this.state}
                    columns={tableInfo.columns}
                    pagination={false}
                    dataSource={allCountries}
                    className="isoCustomizedTable"
                    onChange={this._handleCountryChange}
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
                      style={{ marginTop: "15px" }}
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
              ))}
            </TableDemoStyle>
          </TabPane>
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
