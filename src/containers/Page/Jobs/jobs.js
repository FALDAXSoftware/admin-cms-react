import React, { Component } from "react";
import { Input, Tabs, Pagination, Icon, notification, Button, Modal, Row, Col } from "antd";
import { jobsTableInfos } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import AddJobModal from "./addJobModal";
import ViewJobModal from "./viewJobModal";
import EditJobModal from "./editJobModal";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
import JobCategory from "./jobsCategory";
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT } from "../../../helpers/globals";
import { isAllowed } from '../../../helpers/accessControl';
import Metabase from "./jobsMetabase"
import { ColWithMarginBottom } from "../common.style";
import { BackButton } from "../../Shared/backBttton";

const Search = Input.Search;
const TabPane = Tabs.TabPane;
const { logout } = authAction;
var self;

class Jobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allJobs: [],
      allJobsCount: 0,
      searchJob: "",
      limit: PAGESIZE,
      errMessage: "",
      errMsg: false,
      errType: "Success",
      page: 1,
      loader: false,
      showAddJobModal: false,
      jobDetails: [],
      showEditJobModal: false,
      showViewJobModal: false,
      showDeleteJobModal: false,
      deleteJobId: "",
      allJobCategories: [],
      activeTab: 1
    };
    self = this;
    Jobs.jobStatus = Jobs.jobStatus.bind(this);
    Jobs.deleteJob = Jobs.deleteJob.bind(this);
    Jobs.editJob = Jobs.editJob.bind(this);
    Jobs.viewJob = Jobs.viewJob.bind(this);
    Jobs.showApplicants = Jobs.showApplicants.bind(this);
  }

  componentDidMount = () => {
    this._getAllJobs();
    if (isAllowed("get_job_categories")) {
      this._getAllJobCategories();
    }
  };

  static jobStatus(
    value,
    position,
    location,
    short_desc,
    job_desc,
    category_id,
    is_active,
    category
  ) {
    const { token } = self.props;

    let formData = {
      job_id: value,
      position,
      location,
      short_desc,
      job_desc,
      is_active: !is_active
    };

    self.setState({ loader: true });
    ApiUtils.updateJob(token, formData)
      .then(res => res.json())
      .then(res => {
        if (res.status == 200) {
          self.setState({
            errMsg: true,
            errMessage: res.message,
            loader: false,
            errType: "Success",
            showError: false,
            isDisabled: false
          });
          self._getAllJobs();
          self._getAllJobCategories();
        } else if (res.status == 403) {
          self.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              self.props.logout();
            }
          );
        } else {
          self.setState({ errMsg: true, errMessage: res.message });
        }
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

  static showApplicants(value) {
    self.props.history.push("/dashboard/job-applications/" + value);
  }

  static editJob(
    value,
    position,
    location,
    short_desc,
    job_desc,
    category_id,
    is_active,
    category
  ) {
    let jobDetails = {
      value,
      position,
      location,
      short_desc,
      job_desc,
      category_id,
      is_active,
      category
    };
    self.setState({ showEditJobModal: true, jobDetails });
  }

  static viewJob(
    value,
    position,
    location,
    short_desc,
    job_desc,
    category_id,
    is_active,
    category
  ) {
    let jobDetails = {
      value,
      position,
      location,
      short_desc,
      job_desc,
      category_id,
      is_active,
      category
    };
    self.setState({ showViewJobModal: true, jobDetails });
  }

  static deleteJob(value) {
    self.setState({ showDeleteJobModal: true, deleteJobId: value });
  }

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _getAllJobs = () => {
    const { token } = this.props;
    const { limit, searchJob, page, sorterCol, sortOrder } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getAllJobs(page, limit, token, searchJob, sorterCol, sortOrder)
      .then(response => response.json())
      .then(function (res) {
        if (res.status == 200) {
          _this.setState({ allJobs: res.data, allJobsCount: res.allJobsCount });
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

  _getAllJobCategories = () => {
    const { token } = this.props;
    let _this = this;

    ApiUtils.getAllJobCategories(token, true)
      .then(response => response.json())
      .then(function (res) {
        if (res.status == 200) {
          _this.setState({ allJobCategories: res.data });
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

  _searchJob = val => {
    this.setState({ searchJob: val, page: 1 }, () => {
      this._getAllJobs();
    });
  };

  _handleJobPagination = page => {
    this.setState({ page }, () => {
      this._getAllJobs();
    });
  };

  _deleteJob = () => {
    const { token } = this.props;
    const { deleteJobId } = this.state;
    let _this = this;

    this.setState({ loader: true });
    ApiUtils.deleteJob(deleteJobId, token)
      .then(response => response.json())
      .then(function (res) {
        if (res.status == 200) {
          _this.setState({
            deleteJobId: "",
            showDeleteJobModal: false,
            errMessage: res.message,
            errMsg: true,
            page: 1
          });
          _this._getAllJobs();
        } else if (res.status == 403) {
          _this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              _this.props.logout();
            }
          );
        } else {
          _this.setState({ deleteJobId: "", showDeleteJobModal: false });
        }
        this.setState({ loader: false });
      })
      .catch(() => {
        _this.setState({
          deleteJobId: "",
          showDeleteJobModal: false,
          loader: false
        });
      });
  };

  _closeDeleteJobModal = () => {
    this.setState({ showDeleteJobModal: false });
  };

  _showAddJobModal = () => {
    this.setState({ showAddJobModal: true });
  };

  _closeAddJobModal = () => {
    this.setState({ showAddJobModal: false });
  };

  _closeViewJobModal = () => {
    this.setState({ showViewJobModal: false });
  };

  _closeEditJobModal = () => {
    this.setState({ showEditJobModal: false });
  };

  _handleJobTableChange = (pagination, filters, sorter) => {
    this.setState(
      { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
      () => {
        this._getAllJobs();
      }
    );
  };

  _changeTab = value => {
    this.setState({ activeTab: value });
  };

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getAllJobs();
    });
  };

  render() {
    const {
      allJobs,
      allJobsCount,
      errType,
      loader,
      errMsg,
      page,
      showAddJobModal,
      showViewJobModal,
      showEditJobModal,
      showDeleteJobModal,
      jobDetails,
      allJobCategories,
      activeTab,
      limit
    } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <LayoutWrapper>
        <BackButton {...this.props}/>
        <Tabs className="isoTableDisplayTab full-width" onChange={this._changeTab}>
          <TabPane tab={jobsTableInfos[0].title} key={jobsTableInfos[0].value}>
            <TableDemoStyle className="isoLayoutContent">
              <Row type="flex" justify="start">
                <ColWithMarginBottom md={3}>
                  {isAllowed("add_job") && isAllowed("get_job_categories") && (
                    <Button
                      type="primary"
                      onClick={this._showAddJobModal}
                    >
                      <Icon type="plus" />
                      Add Job
                    </Button>
                  )}
                </ColWithMarginBottom>
                <ColWithMarginBottom md={13}></ColWithMarginBottom>
                <ColWithMarginBottom md={8}>
                  <Search
                    placeholder="Search jobs"
                    onSearch={value => this._searchJob(value)}
                    enterButton
                  />  
                </ColWithMarginBottom>
              </Row>
                <AddJobModal
                  showAddJobModal={showAddJobModal}
                  closeAddModal={this._closeAddJobModal}
                  getAllJobs={this._getAllJobs.bind(this, 1)}
                  allJobCategories={allJobCategories}
                />
              {loader && <FaldaxLoader />}
              <ViewJobModal
                jobDetails={jobDetails}
                showViewJobModal={showViewJobModal}
                closeViewJobModal={this._closeViewJobModal}
              />
              {showEditJobModal && (
                <EditJobModal
                  fields={jobDetails}
                  showEditJobModal={showEditJobModal}
                  closeEditJobModal={this._closeEditJobModal}
                  getAllJobs={this._getAllJobs.bind(this, 1)}
                  allJobCategories={allJobCategories}
                />
              )}
              <TableWrapper
                rowKey="id"
                {...this.state}
                columns={jobsTableInfos[0].columns}
                pagination={false}
                dataSource={allJobs}
                className="isoCustomizedTable float-clear table-tb-margin"
                onChange={this._handleJobTableChange}
                scroll={TABLE_SCROLL_HEIGHT}
                bordered
              />
              {showDeleteJobModal && (
                <Modal
                  title="Delete Job"
                  visible={showDeleteJobModal}
                  onCancel={this._closeDeleteJobModal}
                  footer={[
                    <Button onClick={this._closeDeleteJobModal}>No</Button>,
                    <Button onClick={this._deleteJob}>Yes</Button>
                  ]}
                >
                  Are you sure you want to delete this job ?
                </Modal>
              )}
              {allJobsCount > 0 ? (
                <Pagination
                  className="ant-users-pagination"
                  onChange={this._handleJobPagination.bind(this)}
                  pageSize={limit}
                  current={page}
                  total={parseInt(allJobsCount)}
                  showSizeChanger
                  onShowSizeChange={this._changePaginationSize}
                  pageSizeOptions={pageSizeOptions}
                  
                />
              ) : (
                ""
              )}
            </TableDemoStyle>
          </TabPane>
          {isAllowed("get_job_categories") && (
            <TabPane tab="Job Category" key="2">
              {activeTab == 2 && <JobCategory />}
            </TabPane>
          )}
          {isAllowed("metabase_career_report") && (
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
)(Jobs);

export { Jobs, jobsTableInfos };
