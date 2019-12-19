import React, { Component } from "react";
import { Button, Tabs, notification, Modal, Input, Pagination, Icon, Col, Row } from "antd";
import { employeeTableinfos } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import AddEmployeeModal from "./addEmployeeModal";
import EditEmployeeModal from "./editEmployeeModal";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
import { PAGE_SIZE_OPTIONS, PAGESIZE } from "../../../helpers/globals";
import { isAllowed } from '../../../helpers/accessControl';
import Metabase from './employeeMetabase'
import { BackButton } from "../../Shared/backBttton";

const { logout } = authAction;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
var self;

class Employees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allEmployee: [],
      employeeCount: 0,
      errMessage: "",
      errMsg: false,
      errType: "Success",
      loader: false,
      showAddEmpModal: false,
      showEditEmpModal: false,
      showDeleteEmpModal: false,
      empDetails: [],
      deleteEmpId: "",
      searchEmp: "",
      page: 1,
      limit: PAGESIZE
    };
    self = this;
    Employees.employeeStatus = Employees.employeeStatus.bind(this);
    Employees.editEmployee = Employees.editEmployee.bind(this);
    Employees.deleteEmployee = Employees.deleteEmployee.bind(this);
  }

  static employeeStatus(
    value,
    first_name,
    last_name,
    email,
    phone_number,
    address,
    role,
    role_id,
    is_active
  ) {
    const { token } = self.props;
    let formData = {
      id: value,
      first_name,
      last_name,
      email,
      phone_number,
      address,
      roles: role,
      is_active: !is_active
    };

    self.setState({ loader: true });
    ApiUtils.editEmployee(token, formData)
      .then(res => res.json())
      .then(res => {
        if (res.status == 200) {
          self.setState({
            errMsg: true,
            errMessage: res.message,
            loader: false,
            errType: "Success"
          });
          self._getAllEmployees();
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
            errMessage: res.err,
            loader: false,
            errType: "error"
          });
        }
      })
      .catch(error => {
        self.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          loader: false,
          errType: "error"
        });
      });
  }

  static editEmployee(
    value,
    first_name,
    last_name,
    email,
    phone_number,
    address,
    role,
    role_id,
    is_active
  ) {
    self.props.history.push("/dashboard/employee/" + value);
  }

  static deleteEmployee(value) {
    self.setState({ showDeleteEmpModal: true, deleteEmpId: value });
  }

  componentDidMount = () => {
    this._getAllEmployees();
    if (isAllowed("get_role")) {
      this._getAllRoles();
    }
  };

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _getAllEmployees = () => {
    const { token } = this.props;
    const { searchEmp, sorterCol, sortOrder, page, limit } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getAllEmployee(page, limit, token, sorterCol, sortOrder, searchEmp)
      .then(response => response.json())
      .then(function (res) {
        if (res.status == 200) {
          for (var i = 0; i < res.data.employees.length; i++) {
            res.data.employees[i].first_name =
              res.data.employees[i].first_name +
              " " +
              res.data.employees[i].last_name;
          }
          _this.setState({
            allEmployee: res.data.employees,
            employeeCount: res.data.employeeCount
          });
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
            errMsg: true,
            errMessage: res.message
          });
        }
        _this.setState({ loader: false });
      })
      .catch(err => {
        _this.setState({
          errType: "error",
          errMsg: true,
          errMessage: "Something went wrong",
          loader: false
        });
      });
  };

  _getAllRoles = () => {
    const { token } = this.props;
    const { sorterCol, sortOrder } = this.state;
    let _this = this;

    ApiUtils.getAllRoles(token, sorterCol, sortOrder, true)
      .then(response => response.json())
      .then(function (res) {
        if (res.status == 200) {
          let roles = res.roleName.map(role => ({
            key: role.id,
            value: role.name
          }));
          _this.setState({ allRoles: roles });
        } else if (res.status == 403) {
          _this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              _this.props.logout();
            }
          );
        } else {
          _this.setState({
            errType: "error",
            errMsg: true,
            errMessage: res.err
          });
        }
      })
      .catch(err => {
        _this.setState({
          errType: "error",
          errMsg: true,
          errMessage: "Something went wrong"
        });
      });
  };

  _deleteEmployee = () => {
    const { token } = this.props;
    const { deleteEmpId } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.deleteEmployee(token, deleteEmpId)
      .then(response => response.json())
      .then(function (res) {
        if (res.status == 200) {
          _this.setState({
            deleteEmpId: "",
            errMsg: true,
            errMessage: res.message,
            errType: "Success"
          });
          _this._closeDeleteEmpModal();
          _this._getAllEmployees();
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

  _showAddEmpModal = () => {
    this.setState({ showAddEmpModal: true });
  };

  _closeAddEmpModal = () => {
    this.setState({ showAddEmpModal: false });
  };

  _closeEditEmpModal = () => {
    this.setState({ showEditEmpModal: false });
  };

  _closeDeleteEmpModal = () => {
    this.setState({ showDeleteEmpModal: false });
  };

  _changeRow = emp => {
    this.props.history.push("/dashboard/employee/" + emp.id);
  };

  _handleEmployeeChange = (pagination, filters, sorter) => {
    this.setState(
      { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
      () => {
        this._getAllEmployees();
      }
    );
  };

  _handleEmployeePagination = page => {
    this.setState({ page }, () => {
      this._getAllEmployees();
    });
  };

  _searchEmpoyee = val => {
    this.setState({ searchEmp: val, page: 1 }, () => {
      this._getAllEmployees();
    });
  };

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getAllEmployees();
    });
  };

  render() {
    const {
      allEmployee,
      errType,
      errMsg,
      loader,
      showAddEmpModal,
      employeeCount,
      page,
      limit,
      showEditEmpModal,
      empDetails,
      showDeleteEmpModal,
      allRoles
    } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <LayoutWrapper>
        <BackButton {...this.props}/>
        <Tabs className="isoTableDisplayTab full-width">
          <TabPane
            tab={employeeTableinfos[0].title}
            key={employeeTableinfos[0].value}
          >
            <TableDemoStyle className="isoLayoutContent">
              <Row type="flex" justify="end">
                <Col md={4}>
                  {isAllowed("add_employee") && (
                    <Button
                      type="primary"
                      onClick={this._showAddEmpModal}
                    >
                      <Icon type="plus" /> Add Employee
                    </Button>
                  )}
                </Col>
                <Col md={6}>  
                  <Search
                    placeholder="Search employees"
                    onSearch={value => this._searchEmpoyee(value)}
                    enterButton
                  />
                </Col>
              </Row>

                {showAddEmpModal && (
                  <AddEmployeeModal
                    showAddEmpModal={showAddEmpModal}
                    allRoles={allRoles}
                    closeAddModal={this._closeAddEmpModal}
                    getAllEmployee={this._getAllEmployees.bind(this, 0)}
                  />
                )}
              {loader && <FaldaxLoader />}
              <div>
                  <TableWrapper
                    rowKey="id"
                    {...this.state}
                    columns={employeeTableinfos[0].columns}
                    pagination={false}
                    dataSource={allEmployee}
                    className="isoCustomizedTable table-tb-margin"
                    expandedRowRender={record => (
                      <div>
                        <b>Address</b> -{" "}
                        <span style={{ whiteSpace: "pre-line" }}>
                          {record.address}
                        </span>
                        <br />
                        <b>Phone Number</b> -{" "}
                        <span style={{ whiteSpace: "pre-line" }}>
                          {record.phone_number}
                        </span>
                      </div>
                    )}
                    onChange={this._handleEmployeeChange}
                  />
                {showEditEmpModal && (
                  <EditEmployeeModal
                    fields={empDetails}
                    allRoles={allRoles}
                    showEditEmpModal={showEditEmpModal}
                    closeEditEmpModal={this._closeEditEmpModal}
                    getAllEmployee={this._getAllEmployees.bind(this)}
                  />
                )}
                {employeeCount > 0 ? (
                  <Pagination
                    className="ant-users-pagination"
                    onChange={this._handleEmployeePagination.bind(this)}
                    pageSize={limit}
                    current={page}
                    total={parseInt(employeeCount)}
                    showSizeChanger
                    onShowSizeChange={this._changePaginationSize}
                    pageSizeOptions={pageSizeOptions}
                  />
                ) : (
                  ""
                )}
                {showDeleteEmpModal && (
                  <Modal
                    title="Delete Employee"
                    onCancel={this._closeDeleteEmpModal}
                    visible={showDeleteEmpModal}
                    footer={[
                      <Button onClick={this._closeDeleteEmpModal}>No</Button>,
                      <Button onClick={this._deleteEmployee}>Yes</Button>
                    ]}
                  >
                    Are you sure you want to delete this employee ?
                  </Modal>
                )}
              </div>
            </TableDemoStyle>
          </TabPane>
          {isAllowed("metabase_employee_report") && (
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

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(Employees);

export { Employees, employeeTableinfos };
