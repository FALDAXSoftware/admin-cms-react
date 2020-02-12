import React, { Component } from "react";
import {
  Input,
  Pagination,
  notification,
  Button,
  Row,
  Col,
  Select,
  Form,
  Modal,
  Icon,
  DatePicker
} from "antd";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { inActiveUserinfos } from "../../Tables/antTables";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import ApiUtils from "../../../helpers/apiUtills";
import { connect } from "react-redux";
import { CSVLink } from "react-csv";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
import CountryData from "country-state-city";
import { PAGESIZE, PAGE_SIZE_OPTIONS, TABLE_SCROLL_HEIGHT } from "../../../helpers/globals";
import moment from "moment";
import { PageCounterComponent } from "../../Shared/pageCounter";

const Option = Select.Option;
const { logout } = authAction;
const { RangePicker } = DatePicker;
var self;

class InActiveUsers extends Component {
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
      showDeleteUserModal: false,
      rangeDate:[],
      startDate:"",
      endDate:""
    };
    self = this;
    InActiveUsers.view = InActiveUsers.view.bind(this);
    InActiveUsers.deleteUser = InActiveUsers.deleteUser.bind(this);
    InActiveUsers.editUser = InActiveUsers.editUser.bind(this);
  }

  static view(
    value,
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

  _changeDate = (date, dateString) => {
    this.setState({
      rangeDate: date,
      startDate: date.length > 0 ? moment(date[0]).toISOString() : "",
      endDate: date.length > 0 ? moment(date[1]).toISOString() : ""
    });
  };

  _getAllUsers = async() => {
    try{
      const { token } = this.props;
      const {
        searchUser,
        limit,
        page,
        sorterCol,
        sortOrder,
        filterVal,
        startDate,
        endDate
      } = this.state;
      this.setState({ loader: true });
      let response=await (await ApiUtils.getAllInActiveUsers(
        page,
        limit,
        token,
        searchUser,
        sorterCol,
        sortOrder,
        filterVal,
        startDate,
        endDate
      )).json();
        if (response.status == 200) {
          this.setState({ allUsers: response.data, allUserCount: response.userCount });
        } else if (response.status == 403 || response.status==400 || response.status==401) {
          this.setState(
            { errMsg: true, errMessage: response.err, errType: "error" },
            () => {
              this.props.logout();
            }
          );
        } else {
          this.setState({ errMsg: true, errMessage: response.message });
        }
    }catch(error){
      this.setState({
        errMsg: true,
        errMessage: "Unable to complete the requested action.",
        errType: "error",
        loader: false
      });
    }finally{
      this.setState({loader:false});
    }
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
          errMessage: "Unable to complete the requested action.",
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
        filterVal:undefined,
        searchUser: "",
        page: 1,
        sorterCol: "",
        sortOrder: "",
        startDate:"",
        endDate:"",
        rangeDate:[]
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
      limit,
      startDate,
      endDate,
      rangeDate
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

    return (
      // <LayoutWrapper>
      //   <LayoutContentWrapper>
          <TableDemoStyle className="isoLayoutContent">
            <div className="isoTableDisplayTab">
            <PageCounterComponent page={page} limit={limit} dataCount={allUserCount} syncCallBack={this._resetFilters}/>
              {inActiveUserinfos.map(inActiveUserinfos => (
                <div tab={inActiveUserinfos.title} key={inActiveUserinfos.value}>
                    <Form onSubmit={this._searchUser} className="cty-search">
                      <Row type="flex" className="table-filter-row" justify="start">
                        <Col lg={5} xs={24}>
                          <Input
                            placeholder="Search users"
                            onChange={this._changeSearch.bind(this)}
                            value={searchUser}
                          />
                        </Col>
                        <Col  lg={5} xs={24}>
                          <Select
                            getPopupContainer={trigger => trigger.parentNode}
                            placeholder="Select a country"
                            onChange={this._changeCountry}
                            value={filterVal}
                            showSearch
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
                        </Col>
                        <Col lg={5} xs={24}>
                          <RangePicker
                            value={rangeDate}
                            disabledTime={this.disabledRangeTime}
                            onChange={this._changeDate}
                            format="YYYY-MM-DD"
                            allowClear={false}
                            className='full-width'
                          />
                        </Col>
                        <Col lg={3} xs={24}>
                          <Button
                            htmlType="submit"
                            className="filter-btn btn-full-width"
                            type="primary"
                          >
                           <Icon type="search"/> Search
                          </Button>
                        </Col>
                        <Col  xs={24} lg={3}>
                          <Button
                            className="filter-btn btn-full-width"
                            type="primary"
                            onClick={this._resetFilters}
                          >
                            <Icon type="reload" />Reset
                          </Button>
                        </Col>
                        <Col  md={24} lg={3}>
                          {allUsers && allUsers.length > 0 ? (
                            <CSVLink
                              data={allUsers}
                              filename={"users.csv"}
                              headers={headers}
                            >
                              <Button className="filter-btn btn-full-width" type="primary">
                              <Icon type="export" />Export
                              </Button>
                            </CSVLink>
                          ) : (
                            ""
                          )}
                        </Col>
                      </Row>
                    </Form>
                  {loader && <FaldaxLoader />}
                  <div className="scroll-table float-clear">
                    <TableWrapper
                      rowKey="id"
                      className="table-tb-margin"
                      {...this.state}
                      columns={inActiveUserinfos.columns}
                      pagination={false}
                      dataSource={allUsers}
                      bordered
                      scroll={TABLE_SCROLL_HEIGHT}
                      onChange={this.handleTableChange}
                    />
                    {allUserCount > 0 ? (
                      <Pagination
                        className="ant-users-pagination"
                        onChange={this._handleUserPagination.bind(this)}
                        pageSize={limit}
                        current={page}
                        total={parseInt(allUserCount)}
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
                          <Button onClick={this._closeDeleteUserModal}>
                            No
                          </Button>,
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
      //   </LayoutContentWrapper>
      // </LayoutWrapper>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(InActiveUsers);

export { InActiveUsers,inActiveUserinfos };
