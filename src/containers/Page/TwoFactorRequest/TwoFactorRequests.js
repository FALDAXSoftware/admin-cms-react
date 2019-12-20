import React, { Component } from "react";
import {
  Input,
  Tabs,
  Pagination,
  notification,
  Form,
  Row,
  Button,
  Select,
  Icon,
} from "antd";
import { twoFactorReqInfos } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
import SimpleReactValidator from "simple-react-validator";
import ViewRequestModal from "./viewRequestModal";
import RequestActionModal from "./requestActionModal";
import {ColWithMarginBottom} from "../common.style";
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT } from "../../../helpers/globals";
import { isAllowed } from "../../../helpers/accessControl";
import { BackButton } from "../../Shared/backBttton";

const TabPane = Tabs.TabPane;
const { logout } = authAction;
const Option = Select.Option;
var self;

class TwoFactorRequests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all2FARequests: [],
      allRequestsCount: 0,
      searchReq: "",
      limit: PAGESIZE,
      errMessage: "",
      errMsg: false,
      errType: "Success",
      page: 1,
      loader: false,
      showRejectForm: false,
      showViewRequestModal: false,
      twoFactorReqDetails: [],
      filterVal: "",
      metabaseUrl: ""
    };
    this.validator = new SimpleReactValidator();
    self = this;
    TwoFactorRequests.approve2FA = TwoFactorRequests.approve2FA.bind(this);
    TwoFactorRequests.reject2FA = TwoFactorRequests.reject2FA.bind(this);
    TwoFactorRequests.viewRequest = TwoFactorRequests.viewRequest.bind(this);
  }

  componentDidMount = () => {
    this._getAll2FARequests();
  };

  static approve2FA(value) {
    const { token } = self.props;

    let formData = {
      id: value
    };

    self.setState({ loader: true });

    ApiUtils.approve2FARequest(token, formData)
      .then(res => res.json())
      .then(res => {
        if (res.status == 200) {
          self.setState({
            errMsg: true,
            errMessage: res.message,
            errType: "Success",
            showError: false,
            isDisabled: false
          });
          self._getAll2FARequests();
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
            errType: "error"
          });
        }
        self.setState({ loader: false });
      })
      .catch(() => {
        self.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          loader: false,
          errType: "error",
          showError: false,
          isDisabled: false
        });
      });
  }

  static reject2FA(
    value,
    full_name,
    email,
    uploaded_file,
    status,
    reason,
    created_at
  ) {
    let twoFactorReqDetails = {
      value,
      full_name,
      email,
      uploaded_file,
      status,
      reason,
      created_at
    };
    self.setState({ showRejectForm: true, twoFactorReqDetails });
  }

  static viewRequest(
    value,
    full_name,
    email,
    uploaded_file,
    status,
    reason,
    created_at
  ) {
    let twoFactorReqDetails = {
      value,
      full_name,
      email,
      uploaded_file,
      status,
      reason,
      created_at
    };
    self.setState({ showViewRequestModal: true, twoFactorReqDetails });
  }

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _getAll2FARequests = () => {
    const { token } = this.props;
    const {
      limit,
      searchReq,
      page,
      filterVal,
      sorterCol,
      sortOrder
    } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getAll2FARequests(
      token,
      page,
      limit,
      searchReq,
      filterVal,
      sorterCol,
      sortOrder
    )
      .then(response => response.json())
      .then(function (res) {
        if (res.status == 200) {
          _this.setState({
            all2FARequests: res.data,
            allRequestsCount: res.requests_counts
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
      .catch(() => {
        _this.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          errType: "error",
          loader: false
        });
      });
  };

  async getMetaBaseUrl() {
    try {
      this.setState({ loader: true })
      let response = await (await ApiUtils.metabase(this.props.token).getTwoFactorRequest()).json();
      if (response.status == 200) {
        this.setState({ metabaseUrl: response.frameURL })
      } else if (response.statue == 400 || response.status == 403) {

      }
    } catch (error) {

    } finally {
      this.setState({ loader: false })
    }
  }

  _searchRequest = e => {
    e.preventDefault();
    this.setState({ page: 1 }, () => {
      this._getAll2FARequests();
    });
  };

  _handleRequestPagination = page => {
    this.setState({ page }, () => {
      this._getAll2FARequests();
    });
  };

  _handleRequestTableChange = (pagination, filters, sorter) => {
    this.setState(
      { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
      () => {
        this._getAll2FARequests();
      }
    );
  };

  onChangeTabs = (key) => {
    if (key == "metabase" && this.state.metabaseUrl == "") {
      this.getMetaBaseUrl();
    }
  }

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getAll2FARequests();
    });
  };

  _closeRejectForm = () => {
    this.setState({ showRejectForm: false });
  };

  _closeViewReqModal = () => {
    this.setState({ showViewRequestModal: false });
  };

  _changeSearch = (field, e) => {
    this.setState({ searchReq: field.target.value });
  };

  _changeFilter = val => {
    this.setState({ filterVal: val });
  };

  _resetFilters = () => {
    this.setState(
      { filterVal: "", searchReq: "", sorterCol: "", sortOrder: "" },
      () => {
        this._getAll2FARequests();
      }
    );
  };

  render() {
    const {
      all2FARequests,
      allRequestsCount,
      errType,
      loader,
      errMsg,
      page,
      limit,
      showRejectForm,
      twoFactorReqDetails,
      showViewRequestModal,
      searchReq,
      filterVal,
      metabaseUrl
    } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <LayoutWrapper>
        <BackButton {...this.props}/>
        <Tabs className="isoTableDisplayTab full-width" onChange={this.onChangeTabs}>
          {twoFactorReqInfos.map(tableInfo => (
            <TabPane tab={tableInfo.title} key={tableInfo.value}>
              <TableDemoStyle className="isoLayoutContent">
                <Form onSubmit={this._searchRequest}>
                  <Row type="flex" justify="end">
                    <ColWithMarginBottom md={6}>
                      <Input
                        placeholder="Search Requests"
                        onChange={this._changeSearch.bind(this)}
                        value={searchReq}
                      />
                    </ColWithMarginBottom>
                    <ColWithMarginBottom md={6}>
                      <Select
                        getPopupContainer={trigger => trigger.parentNode}
                        placeholder="Select a type"
                        onChange={this._changeFilter}
                        value={filterVal}
                      >
                        <Option value={""}>All</Option>
                        <Option value={"open"}>Open</Option>
                        <Option value={"closed"}>Closed</Option>
                        <Option value={"rejected"}>Rejected</Option>
                      </Select>
                    </ColWithMarginBottom>
                    <ColWithMarginBottom xs={12} sm={3}>
                      <Button
                        htmlType="submit"
                        className="filter-btn btn-full-width"
                        type="primary"
                      >
                        <Icon type="search" />
                        Search
                      </Button>
                    </ColWithMarginBottom>
                    <ColWithMarginBottom xs={12} sm={3}>
                      <Button
                        className="filter-btn btn-full-width"
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
                <TableWrapper
                  {...this.state}
                  columns={tableInfo.columns}
                  pagination={false}
                  dataSource={all2FARequests}
                  className="isoCustomizedTable float-clear"
                  onChange={this._handleRequestTableChange}
                  scroll={TABLE_SCROLL_HEIGHT}
                  bordered
                />
                <ViewRequestModal
                  twoFactorReqDetails={twoFactorReqDetails}
                  showViewRequestModal={showViewRequestModal}
                  closeViewRequestModal={this._closeViewReqModal}
                />
                {allRequestsCount > 0 ? (
                  <Pagination
                    style={{ marginTop: "15px" }}
                    className="ant-users-pagination"
                    onChange={this._handleRequestPagination.bind(this)}
                    pageSize={limit}
                    current={page}
                    total={allRequestsCount}
                    showSizeChanger
                    onShowSizeChange={this._changePaginationSize}
                    pageSizeOptions={pageSizeOptions}
                  />
                ) : (
                  ""
                )}
                <RequestActionModal
                  showRejectForm={showRejectForm}
                  twoFactorReqDetails={twoFactorReqDetails}
                  closeActionReqModal={this._closeRejectForm}
                  getAll2FARequests={this._getAll2FARequests}
                />
              </TableDemoStyle>
            </TabPane>
          ))}

          {isAllowed("metabase_two_factor_request") && (
            <TabPane
              tab="Report"
              key="metabase"
            >
              <TableDemoStyle className="isoLayoutContent">
                {metabaseUrl && (
                  <div>
                    <iframe
                    className="metabase-iframe"
                      src={metabaseUrl}
                      frameborder="0"
                      width="100%"
                      allowtransparency
                    ></iframe>
                  </div>
                )}
              </TableDemoStyle>
            </TabPane>
          )}
        </Tabs>
      </LayoutWrapper>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(TwoFactorRequests);

export { TwoFactorRequests, twoFactorReqInfos };
