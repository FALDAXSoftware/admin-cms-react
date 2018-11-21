import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification, Spin, Button, Modal } from 'antd';
import { jobsTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import AddJobModal from './addJobModal';
import ViewJobModal from './viewJobModal';
import EditJobModal from './editJobModal';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
var self;

class Jobs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allJobs: [],
            allJobsCount: 0,
            searchJob: '',
            limit: 50,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            page: 1,
            loader: false,
            showAddJobModal: false,
            jobDetails: [],
            showEditJobModal: false,
            showViewJobModal: false,
            showDeleteJobModal: false,
            deleteJobId: ''
        }
        self = this;
        Jobs.jobStatus = Jobs.jobStatus.bind(this);
        Jobs.deleteJob = Jobs.deleteJob.bind(this);
        Jobs.editJob = Jobs.editJob.bind(this);
        Jobs.viewJob = Jobs.viewJob.bind(this);
        Jobs.showApplicants = Jobs.showApplicants.bind(this);
    }

    componentDidMount = () => {
        this._getAllJobs();
    }

    static jobStatus(value, position, location, short_desc, job_desc, is_active) {
        const { token } = self.props;

        let formData = {
            job_id: value,
            position,
            location,
            short_desc,
            job_desc,
            is_active: !is_active
        };

        self.setState({ loader: true })
        let message = is_active ? 'Job has been inactivated successfully.' : 'Job has been activated successfully.'

        ApiUtils.updateJob(token, formData)
            .then((res) => res.json())
            .then((res) => {
                this.setState({
                    errMsg: true, errMessage: message, loader: false,
                    errType: 'Success', showError: false, isDisabled: false
                });
                this._getAllJobs();
            })
            .catch(() => {
                this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    loader: false, errType: 'error', showError: false, isDisabled: false
                });
            });
    }

    static showApplicants(value) {
        self.props.history.push('/dashboard/job-applications/' + value);
    }

    static editJob(value, position, location, short_desc, job_desc, is_active) {
        let jobDetails = {
            value, position, location, short_desc, job_desc, is_active
        }
        self.setState({ showEditJobModal: true, jobDetails });
    }

    static viewJob(value, position, location, short_desc, job_desc, is_active) {
        let jobDetails = {
            value, position, location, short_desc, job_desc, is_active
        }
        self.setState({ showViewJobModal: true, jobDetails });
    }

    static deleteJob(value) {
        self.setState({ showDeleteJobModal: true, deleteJobId: value });
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllJobs = () => {
        const { token } = this.props;
        const { limit, searchJob, page } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllJobs(page, limit, token, searchJob)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allJobs: res.data, allJobsCount: res.allJobsCount, searchJob: ''
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, searchJob: '' });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    searchJob: '', errType: 'error', loader: false
                });
            });
    }

    _searchJob = (val) => {
        this.setState({ searchJob: val, page: 1 }, () => {
            this._getAllJobs();
        });
    }

    _handleJobPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllJobs(page);
        })
    }

    _deleteJob = () => {
        const { token } = this.props;
        const { deleteJobId } = this.state;
        let _this = this;

        this.setState({ loader: true })
        ApiUtils.deleteJob(deleteJobId, token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        deleteJobId: '', showDeleteJobModal: false,
                        errMessage: res.message, errMsg: true, page: 1
                    });
                    _this._getAllJobs();
                } else {
                    _this.setState({ deleteJobId: '', showDeleteJobModal: false });
                }
                this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({ deleteJobId: '', showDeleteJobModal: false, loader: false });
            });
    }

    _closeDeleteJobModal = () => {
        this.setState({ showDeleteJobModal: false });
    }

    _showAddJobModal = () => {
        this.setState({ showAddJobModal: true });
    }

    _closeAddJobModal = () => {
        this.setState({ showAddJobModal: false });
    }

    _closeViewJobModal = () => {
        this.setState({ showViewJobModal: false });
    }

    _closeEditJobModal = () => {
        this.setState({ showEditJobModal: false });
    }

    render() {
        const { allJobs, allJobsCount, errType, loader, errMsg, page,
            showAddJobModal, showViewJobModal, showEditJobModal, showDeleteJobModal,
            jobDetails } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {jobsTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Button type="primary" style={{ "marginBottom": "15px", "float": "left" }} onClick={this._showAddJobModal}>Add Job</Button>
                                    <AddJobModal
                                        showAddJobModal={showAddJobModal}
                                        closeAddModal={this._closeAddJobModal}
                                        getAllJobs={this._getAllJobs.bind(this, 1)}
                                    />
                                    <Search
                                        placeholder="Search jobs"
                                        onSearch={(value) => this._searchJob(value)}
                                        style={{ "float": "right", "width": "250px" }}
                                        enterButton
                                    />
                                </div>
                                {loader && <span className="loader-class">
                                    <Spin />
                                </span>}
                                <div>
                                    <ViewJobModal
                                        jobDetails={jobDetails}
                                        showViewJobModal={showViewJobModal}
                                        closeViewJobModal={this._closeViewJobModal}
                                    />
                                    <EditJobModal
                                        fields={jobDetails}
                                        showEditJobModal={showEditJobModal}
                                        closeEditJobModal={this._closeEditJobModal}
                                        getAllJobs={this._getAllJobs.bind(this, 1)}
                                    />
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allJobs}
                                        className="isoCustomizedTable"
                                    />
                                    {
                                        showDeleteJobModal &&
                                        <Modal
                                            title="Delete Job"
                                            visible={showDeleteJobModal}
                                            onCancel={this._closeDeleteJobModal}
                                            footer={[
                                                <Button onClick={this._closeDeleteJobModal}>No</Button>,
                                                <Button onClick={this._deleteJob}>Yes</Button>,
                                            ]}
                                        >
                                            Are you sure you want to delete this job ?
                                    </Modal>
                                    }
                                    <Pagination
                                        style={{ marginTop: '15px' }}
                                        className="ant-users-pagination"
                                        onChange={this._handleJobPagination.bind(this)}
                                        pageSize={50}
                                        current={page}
                                        total={allJobsCount}
                                    />
                                </div>
                            </TabPane>
                        ))}
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(Jobs);

export { Jobs, jobsTableInfos };
