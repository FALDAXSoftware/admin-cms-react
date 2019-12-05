import React, { Component } from "react";
import {
  Input,
  Pagination,
  notification,
  Button,
  Row,
  Select,
  Form,
  Modal,
  Col,
  Icon
} from "antd";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { tableinfos } from "../../Tables/antTables";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import ApiUtils from "../../../helpers/apiUtills";
import { connect } from "react-redux";
import { CSVLink } from "react-csv";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
import ColWithMarginBottom from "../common.style";
import CountryData from "country-state-city";
import { withRouter } from "react-router-dom";
import { PAGE_SIZE_OPTIONS, PAGESIZE } from "../../../helpers/globals";

const Option = Select.Option;
const { logout } = authAction;
var self;

class ActiveUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allUsers: [],
      allUserCount: 0,
      searchUser: "",
      userDetails: [],
      page: 1,
      limit: PAGESIZE,
      errMessage: "",
      errMsg: false,
      errType: "Success",
      loader: false,
      allCountries: [],
      deleteUserId: "",
      showDeleteUserModal: false
    };
    self = this;
    ActiveUsers.vi = ActiveUsers.view.bind(this);
    ActiveUsers.deleteUser = ActiveUsers.deleteUser.bind(this);
    ActiveUsers.editUser = ActiveUsers.editUser.bind(this);
  }

  static view(
    value,
    profile_pic,
    first_name,
    last_name,
    email,
    city_town,
    street_address,
    street_address_2,
    phone_number,
    country,
    dob,
    is_active,
    kyc
  ) {
    self.props.history.push("/dashboard/users/" + value);
  }

  static deleteUser(value) {
    self.setState({ showDeleteUserModal: true, deleteUserId: value });
  }

  static editUser(value) {
    self.props.history.push("/dashboard/users/edit-user/" + value);
  }

  componentDidMount = () => {
    this._getAllUsers();
    let allCountries = CountryData.getAllCountries();
    this.setState({ allCountries });
  };

  _getAllUsers = () => {
    const { token } = this.props;
    const {
      searchUser,
      limit,
      page,
      sorterCol,
      sortOrder,
      filterVal
    } = this.state;
    var _this = this;

    _this.setState({ loader: true });
    ApiUtils.getAllUsers(
      page,
      limit,
      token,
      searchUser,
      sorterCol,
      sortOrder,
      filterVal
    )
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          _this.setState({ allUsers: res.data, allUserCount: res.userCount });
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

  _deleteUser = () => {
    const { token } = this.props;
    const { deleteUserId } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.deleteUser(token, deleteUserId)
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          _this.setState({
            deleteUserId: "",
            errMsg: true,
            errMessage: res.message,
            errType: "Success"
          });
          _this._closeDeleteUserModal();
          _this._getAllUsers();
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
      .catch(() => {
        _this.setState({
          errType: "error",
          errMsg: true,
          errMessage: "Something went wrong",
          loader: false
        });
      });
  };

  _searchUser = e => {
    e.preventDefault();
    this.setState({ page: 1 }, () => {
      this._getAllUsers();
    });
  };

  _handleUserPagination = page => {
    this.setState({ page }, () => {
      this._getAllUsers();
    });
  };

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
      () => {
        this._getAllUsers();
      }
    );
  };

  _changeSearch = (field, e) => {
    this.setState({ searchUser: field.target.value });
  };

  _changeCountry = val => {
    this.setState({ filterVal: val });
  };

  _resetFilters = () => {
    this.setState(
      {
        filterVal: "",
        searchUser: "",
        page: 1,
        sorterCol: "",
        sortOrder: ""
      },
      () => {
        this._getAllUsers();
      }
    );
  };

  _goToUserDetails = user => {
    this.props.history.push("/dashboard/users/" + user.id);
  };

  _closeDeleteUserModal = () => {
    this.setState({ showDeleteUserModal: false });
  };

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getAllUsers();
    });
  };

  render() {
    const {
      allUsers,
      allUserCount,
      page,
      loader,
      errMsg,
      errType,
      searchUser,
      filterVal,
      allCountries,
      showDeleteUserModal,
      limit
    } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS;

    const headers = [
      { label: "First Name", key: "first_name" },
      { label: "Last Name", key: "last_name" },
      { label: "Full Name", key: "full_name" },
      { label: "Email", key: "email" },
      { label: "Country", key: "country" },
      { label: "State", key: "state" },
      { label: "City", key: "city_town" },
      { label: "Street Address Line 1", key: "street_address" },
      { label: "Street Address Line 2", key: "street_address_2" },
      { label: "Postal Code", key: "postal_code" },
      { label: "DOB", key: "dob" },
      { label: "Active/Inactive", key: "is_active" },
      { label: "Verified/Non Verified", key: "is_verified" },
      { label: "Fiat Currency", key: "fiat" },
      { label: "Referral Percentage", key: "referal_percentage" },
      { label: "No Of Referrals", key: "no_of_referrals" },
      { label: "Account Tier", key: "account_tier" },
      { label: "Created On", key: "created_at" }
    ];

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    const iframe = `<iframe
        src="http://reports.faldax.com/public/question/c01b328a-d107-49e5-a01b-a6b3e2d7d2b5"
        frameborder="0"
        width="800"
        height="600"
        allowtransparency
    ></iframe>`;
    {
      /* <div dangerouslySetInnerHTML={{ __html: iframe }} /> */
    }

    return (
      // <LayoutContentWrapper>
      <TableDemoStyle className="isoLayoutContent">
        <div className="isoTableDisplayTab">
          {tableinfos.map(tableInfo => (
            <div>
              <Form onSubmit={this._searchUser} className="cty-search">
                <Row type="flex" justify="end">
                  <ColWithMarginBottom lg={7} xs={24}>
                    <Input
                      placeholder="Search users"
                      onChange={this._changeSearch.bind(this)}
                      value={searchUser}
                    />
                  </ColWithMarginBottom>
                  <ColWithMarginBottom lg={7} xs={24}>
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      placeholder="Select a country"
                      onChange={this._changeCountry}
                      value={filterVal}
                    >
                      {allCountries &&
                        allCountries.map((country, index) => {
                          return (
                            <Option key={country.id} value={country.name}>
                              {country.name}
                            </Option>
                          );
                        })}
                    </Select>
                  </ColWithMarginBottom>
                  <ColWithMarginBottom xs={24} lg={3}>
                    <Button
                      htmlType="submit"
                      className="filter-btn btn-full-width"
                      type="primary"
                    >
                      <Icon type="search" />
                      Search
                    </Button>
                  </ColWithMarginBottom>
                  <ColWithMarginBottom xs={24} lg={3}>
                    <Button
                      className="filter-btn btn-full-width"
                      type="primary"
                      onClick={this._resetFilters}
                    >
                      <Icon type="reload" /> Reset
                    </Button>
                  </ColWithMarginBottom>
                  <ColWithMarginBottom xs={24} lg={3}>
                    {allUsers && allUsers.length > 0 ? (
                      <CSVLink
                        data={allUsers}
                        filename={"users.csv"}
                        headers={headers}
                      >
                        <Button
                          className="filter-btn btn-full-width"
                          type="primary"
                        >
                          <Icon type="export" /> Export
                        </Button>
                      </CSVLink>
                    ) : (
                      ""
                    )}
                  </ColWithMarginBottom>
                </Row>
              </Form>
              {loader && <FaldaxLoader />}
              <div className="scroll-table float-clear">
                <TableWrapper
                  {...this.state}
                  columns={tableInfo.columns}
                  pagination={false}
                  dataSource={allUsers}
                  className="isoCustomizedTable"
                  onChange={this.handleTableChange}
                />
                {allUserCount > 0 ? (
                  <Pagination
                    style={{ marginTop: "15px" }}
                    className="ant-users-pagination"
                    onChange={this._handleUserPagination.bind(this)}
                    pageSize={limit}
                    current={page}
                    total={allUserCount}
                    showSizeChanger
                    onShowSizeChange={this._changePaginationSize}
                    pageSizeOptions={pageSizeOptions}
                  />
                ) : (
                  ""
                )}
                {showDeleteUserModal && (
                  <Modal
                    title="Delete User"
                    onCancel={this._closeDeleteUserModal}
                    visible={showDeleteUserModal}
                    footer={[
                      <Button onClick={this._closeDeleteUserModal}>No</Button>,
                      <Button onClick={this._deleteUser}>Yes</Button>
                    ]}
                  >
                    Are you sure you want to delete this user ?
                  </Modal>
                )}
              </div>
            </div>
          ))}
        </div>
      </TableDemoStyle>
      //</LayoutContentWrapper>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(withRouter(ActiveUsers));

export { ActiveUsers, tableinfos };
