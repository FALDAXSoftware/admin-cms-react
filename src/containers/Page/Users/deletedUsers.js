import React, { Component } from 'react';
import { Input, Pagination, notification, Button, Row,Icon, Col,Select, Form, Modal ,DatePicker} from 'antd';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { deletedUserinfos } from "../../Tables/antTables/deletedUserConfig";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { CSVLink } from "react-csv";
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import CountryData from 'country-state-city';
import { PAGESIZE, PAGE_SIZE_OPTIONS, TABLE_SCROLL_HEIGHT, EXPORT_LIMIT_SIZE } from '../../../helpers/globals';
import { withRouter } from 'react-router-dom';
import moment from "moment";
import { PageCounterComponent } from '../../Shared/pageCounter';
import { ExportToCSVComponent } from '../../Shared/exportToCsv';
import { DateTimeCell } from '../../../components/tables/helperCells';
import clone from "clone";
import { exportUsers } from '../../../helpers/exportToCsv/headers';
const Option = Select.Option;
const {RangePicker}=DatePicker;
const { logout } = authAction;
var self;
class DeletedUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allUsers: [],
            allUserCount: 0,
            searchUser: '',
            userDetails: [],
            page: 1,
            limit: PAGESIZE,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
            allCountries: [],
            deleteUserId: '',
            showDeleteUserModal: false,
            rangeDate:[],
            startDate:"",
            endDate:"",
            openCsvExportModal:false,
            csvData:[]
        }
        self = this;
        DeletedUsers.view = DeletedUsers.view.bind(this);
        DeletedUsers.deleteUser = DeletedUsers.deleteUser.bind(this);
        DeletedUsers.editUser = DeletedUsers.editUser.bind(this);
    }

    static view(value) {   
          let { searchUser,
            limit,
            page,
            sorterCol,
            sortOrder,
            filterVal,
            startDate,
            endDate}=self.state; 
            self.props.history.push({
          pathname: `/dashboard/users/${value}`,
          state: { is_deleted: true,selectedTab:"3",searchUser,limit,page,sorterCol,sortOrder,filterVal,startDate,endDate }
        });
    }

    onExport=()=>{
      this.setState({openCsvExportModal:true},()=>this._getAllUsers(true));
    }
    
    static deleteUser(value) {
        self.setState({ showDeleteUserModal: true, deleteUserId: value });
    }

    static editUser(value) {
        self.props.history.push('/dashboard/users/edit-user/' + value)
    }

    componentDidMount = () => {
        let state = this.props.location.state
          ? JSON.parse(this.props.location.state)
          : undefined;
        if (state && state.selectedTab == "3") {
          this.setState(
            {
              searchUser: state.searchUser,
              limit: state.limit,
              filterVal: state.filterVal,
              page: state.page,
              startDate: state.startDate,
              endDate: state.endDate,
              rangeDate: state.startDate
                ? [moment(state.startDate), moment(state.endDate)]
                : []
            },
            () => this._getAllUsers()
          );
        } else {
          this._getAllUsers();
        }

        let allCountries = CountryData.getAllCountries();
        this.setState({ allCountries });
    }

    _getAllUsers = async(exportToCsv=false) => {
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
  

          let response = await (
            await (exportToCsv
              ? ApiUtils.getAllDeletedUsers(1, EXPORT_LIMIT_SIZE, token, "")
              : ApiUtils.getAllDeletedUsers(
                  page,
                  limit,
                  token,
                  searchUser,
                  sorterCol,
                  sortOrder,
                  filterVal,
                  startDate,
                  endDate
                ))
          ).json();
            if (response.status == 200) {
              if(exportToCsv){
                this.setState({csvData:response.data});
              }else{
                this.setState({ allUsers: response.data, allUserCount: response.userCount });
              }
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
    }

    _deleteUser = () => {
        const { token } = this.props;
        const { deleteUserId } = this.state;
        let _this = this;

        _this.setState({ loader: true })
        ApiUtils.deleteUser(token, deleteUserId)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({
                        deleteUserId: '', errMsg: true, errMessage: res.message, errType: 'Success'
                    });
                    _this._closeDeleteUserModal();
                    _this._getAllUsers();
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({
                    errType: 'error', errMsg: true, errMessage: 'Unable to complete the requested action.', loader: false
                });
            });
    }

    _searchUser = (e) => {
        e.preventDefault();
        this.setState({ page: 1 }, () => {
            this._getAllUsers();
        });
    }

    _handleUserPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllUsers();
        });
    }

    _changeDate = (date, dateString) => {
      this.setState({
        rangeDate: date,
        startDate: date.length > 0 ? moment(date[0]).toISOString() : "",
        endDate: date.length > 0 ? moment(date[1]).toISOString() : ""
      });
    };

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    handleTableChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getAllUsers();
        })
    }

    _changeSearch = (field, e) => {
        this.setState({ searchUser: field.target.value })
    }

    _changeCountry = (val) => {
        this.setState({ filterVal: val });
    }

    _resetFilters = () => {
        this.setState({
            filterVal:undefined, searchUser: '', page: 1, sorterCol: '', sortOrder: '',startDate:"",endDate:"",rangeDate:[]
        }, () => {
            this._getAllUsers();
        })
    }

    _goToUserDetails = (user) => {
        this.props.history.push('/dashboard/users/' + user.id)
    }

    _closeDeleteUserModal = () => {
        this.setState({ showDeleteUserModal: false });
    }

    _changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this._getAllUsers();
        });
    }

    render() {
        const { allUsers, allUserCount, page, loader, errMsg, errType, searchUser,openCsvExportModal,csvData, filterVal,rangeDate,
            allCountries, showDeleteUserModal, limit } = this.state;
        let pageSizeOptions = PAGE_SIZE_OPTIONS
        console.log(allUsers)
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
          <TableDemoStyle className="isoLayoutContent">
            <ExportToCSVComponent isOpenCSVModal={openCsvExportModal}  onClose={()=>{this.setState({openCsvExportModal:false})}} filename="deactivated_users.csv" data={csvData} header={exportUsers}/>
            <PageCounterComponent page={page} limit={limit} dataCount={allUserCount} syncCallBack={this._resetFilters}/>
            <div className="isoTableDisplayTab">
              <Form onSubmit={this._searchUser}>
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
                      <Icon type="search" />
                      Search
                    </Button>
                  </Col>
                  <Col lg={3} xs={24}>
                    <Button
                      className="filter-btn btn-full-width"
                      type="primary"
                      onClick={this._resetFilters}
                    >
                      <Icon type="reload" />
                      Reset
                    </Button>
                  </Col>
                  <Col xs={24} lg={3}>
                    <Button
                      className="filter-btn btn-full-width"
                      type="primary"
                      onClick={this.onExport}
                    >
                      <Icon type="export" />
                      Export
                    </Button>
                  </Col>
                </Row>
              </Form>

              {loader && <FaldaxLoader />}
              
                <TableWrapper
                 rowKey="id"
                  columns={deletedUserinfos[0].columns}
                  pagination={false}
                  dataSource={allUsers}
                  className="table-tb-margin"
                  onChange={this.handleTableChange}
                  scroll={TABLE_SCROLL_HEIGHT}
                  bordered
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
          </TableDemoStyle>
        );
    }
}

export default withRouter(connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(DeletedUsers));

export { DeletedUsers, deletedUserinfos };