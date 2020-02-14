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
  Icon,
  Col,
  DatePicker
} from "antd";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { tableinfos } from "../../Tables/antTables";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import ApiUtils from "../../../helpers/apiUtills";
import { connect } from "react-redux";
import { CSVLink } from "react-csv";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
import CountryData from "country-state-city";
import { withRouter } from "react-router-dom";
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT } from "../../../helpers/globals";
import moment from "moment";
import { PageCounterComponent } from "../../Shared/pageCounter";
import { ExportToCSVComponent } from "../../Shared/exportToCsv";

const Option = Select.Option;
const { logout } = authAction;
var self;
const { RangePicker } = DatePicker;
const CSVHeaders=[
{key:"id",label:"ID"},
{key:"email",label:"Email"},
{key:"password",label:"Password"},
{key:"phone_number",label:"Phone Number"},
{key:"full_name",label:"Full Name"},
{key:"first_name",label:"First Name"},
{key:"last_name",label:"Last Name"},
{key:"country",label:"Country"},
{key:"street_address",label:"Street Address"},
{key:"city_town",label:"City"},
{key:"updated_at",label:"Updated At"},
{key:"deleted_at",label:"Deleted At"},
{key:"created_at",label:"Created At"},
{key:"referred_id",label:"Referred Id"},
{key:"is_active",label:"Is Active"},
{key:"is_verified",label:"Is Verified"},
{key:"email_verify_token",label:"Email Verify Token"},
{key:"reset_token",label:"Reset Token"},
{key:"dob",label:"Date of Birth"},
{key:"is_twofactor",label:"Is Enable 2FA"},
{key:"twofactor_secret",label:"2FA Secret"},
{key:"auth_code",label:"Auth Code"},
{key:"referral_code",label:"Referral Code"},
{key:"zip",label:"Zip"},
{key:"street_address_2",label:"Street Address 2"},
{key:"postal_code",label:"Postal Code"},
{key:"reset_token_expire",label:"Reset Token Expire"},
{key:"device_token",label:"Device token"},
{key:"device_type",label:"Device Type"},
{key:"fiat",label:"Fiat"},
{key:"state",label:"State"},
{key:"country_id",label:"Country Id"},
{key:"state_id",label:"State Id"},
{key:"diffrence_fiat",label:"Different Fiat"},
{key:"total_value",label:"Total Value"},
{key:"percent_wallet",label:"Percent Wallet"},
{key:"date_format",label:"Date Formate"},
{key:"referal_percentage",label:"Referral Percentage"},
{key:"hubspot_id",label:"Hobspot ID"},
{key:"new_ip_verification_token",label:"New Ip Verification Token"},
{key:"new_ip",label:"New Ip"},
{key:"requested_email",label:"Requested Email Label"},
{key:"new_email_token",label:"New Email Token"},
{key:"is_new_email_verified",label:"Is New Email Verified"},
{key:"account_tier",label:"Account Tier"},
{key:"account_class",label:"Account Class"},
{key:"country_code",label:"Country Code"},
{key:"gender",label:"Gender"},
{key:"middle_name",label:"Middle Name"},
{key:"deleted_by",label:"Deleted By"},
{key:"whitelist_ip",label:"WhiteList Ip"},
{key:"security_feature",label:"Security Feature"},
{key:"security_feature_expired_time",label:"Security Feature Expired Time"},
{key:"is_whitelist_ip",label:"Is Whitelist Ip"},
{key:"twofactor_backup_code",label:"2FA Backup Code"},
{key:"is_terms_agreed",label:"Is Terms Agreed"},
{key:"signup_token_expiration",label:"SignUp Token Expiration"},
{key:"forgot_token_expiration",label:"Forgot Token Expiration"},
{key:"device_token_expiration",label:"Device Token Expiration"},
{key:"default_language",label:"Default Language"},
{key:"customer_id",label:"Customer ID"},
{key:"send_address",label:"Send Address"},
{key:"receive_address",label:"Receive Address"},
{key:"uuid",label:"UUID"},
{key:"no_of_referrals",label:"No of Referrals"},
{key:"ip",label:"Ip"},
{key:"is_logged_in",label:"Is Logged In"},
{key:"last_login_datetime",label:"Last Seen"},
]
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
      showDeleteUserModal: false,
      startDate:"",
      endDate:"",
      openCsvExportModal:false,
      rangeDate:"",
      csvData:[]
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
    let { searchUser,
      limit,
      page,
      sorterCol,
      sortOrder,
      filterVal,
      startDate,
      endDate}=self.state;
      self.props.history.push({pathname:"/dashboard/users/" + value,state:{selectedTab:"1",searchUser,limit,page,sorterCol,sortOrder,filterVal,startDate,endDate}});
  }

  static deleteUser(value) {
    self.setState({ showDeleteUserModal: true, deleteUserId: value });
  }

  static editUser(value) {
    self.props.history.push("/dashboard/users/edit-user/" + value);
  }

  onExportCSV=async()=>{
    try{
      this.setState({loader:true})
      let res = await await (await ApiUtils.getAllUsers(1,100000000000,this.props.token,"")).json();
      if(res.status==200){
        this.setState({csvData:res.data,openCsvExportModal:true})
      }
    }catch(error){
      console.log(error)
    }finally{
      this.setState({loader:false})
    }
  }

  componentDidMount = () => {
    let state=this.props.location.state?JSON.parse(this.props.location.state):undefined;
    if(state && state.selectedTab=="1"){
      this.setState({searchUser:state.searchUser,limit:state.limit,filterVal:state.filterVal,page:state.page,startDate:state.startDate,endDate:state.endDate,rangeDate:state.startDate?[moment(state.startDate),moment(state.endDate)]:[]},()=>this._getAllUsers())
    }else{
      this._getAllUsers();
    }
    let allCountries = CountryData.getAllCountries();
    this.setState({ allCountries });
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
      let response=await (await ApiUtils.getAllUsers(
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

  _changeDate = (date, dateString) => {
    this.setState({
      rangeDate: date,
      startDate: date.length > 0 ? moment(date[0]).toISOString() : "",
      endDate: date.length > 0 ? moment(date[1]).toISOString() : ""
    });
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
      rangeDate,
      csvData,
      openCsvExportModal
    } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }



    return (
      // <LayoutContentWrapper>
      <TableDemoStyle className="isoLayoutContent">
        <ExportToCSVComponent isOpenCSVModal={openCsvExportModal} filename="active_users" data={csvData} header={CSVHeaders}/>
        <div className="isoTableDisplayTab">
          <PageCounterComponent page={page} limit={limit} dataCount={allUserCount} syncCallBack={this._resetFilters}/>
            <div>
              <Form onSubmit={this._searchUser} className="cty-search">
                <Row className="table-filter-row" type="flex" justify="start">
                  <Col lg={5} xs={24}>
                    <Input
                      placeholder="Search users"
                      onChange={this._changeSearch.bind(this)}
                      value={searchUser}
                    />
                  </Col>
                  <Col lg={5} xs={24}>
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
                    allowClear={true}
                    className='full-width'
                  />
                </Col>
                  <Col xs={24} lg={3}>
                    <Button
                      htmlType="submit"
                      className="filter-btn btn-full-width"
                      type="primary"
                    >
                      <Icon type="search" />
                      Search
                    </Button>
                  </Col>
                  <Col xs={24} lg={3}>
                    <Button
                      className="filter-btn btn-full-width"
                      type="primary"
                      onClick={this._resetFilters}
                    >
                      <Icon type="reload" /> Reset
                    </Button>
                  </Col>
                  <Col xs={24} lg={3}>
                    {allUsers && allUsers.length > 0 ? (
                        <Button
                          className="filter-btn btn-full-width"
                          type="primary"
                          onClick={this.onExportCSV}
                        >
                          <Icon type="export" /> Export
                        </Button>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
              </Form>
              {loader && <FaldaxLoader />}
              <div className="scroll-table float-clear">
                <TableWrapper
                  {...this.state}
                  rowKey="id"
                  columns={tableinfos[0].columns}
                  pagination={false}
                  dataSource={allUsers}
                  className="table-tb-margin"
                  onChange={this.handleTableChange}
                  bordered
                  scroll={TABLE_SCROLL_HEIGHT}
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
                      <Button onClick={this._closeDeleteUserModal}>No</Button>,
                      <Button onClick={this._deleteUser}>Yes</Button>
                    ]}
                  >
                    Are you sure you want to delete this user ?
                  </Modal>
                )}
              </div>
            </div>
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
