import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification, Spin } from 'antd';
import { jobAppTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import ViewJobAppModal from './viewJobAppModal';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
var self;

class JobApplications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allApplications: [],
            allApplicationsCount: 0,
            searchJobApp: '',
            limit: 50,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            page: 1,
            loader: false,
            applicationDetails: [],
            showViewJobAppModal: false,
            jobId: ''
        }
        self = this;
        JobApplications.viewJobApplication = JobApplications.viewJobApplication.bind(this);
    }

    static viewJobApplication(value, first_name, last_name, email, phone_number, created_at, resume, cover_letter) {
        let applicationDetails = {
            value, first_name, last_name, email, phone_number, created_at, resume, cover_letter
        }
        self.setState({ showViewJobAppModal: true, applicationDetails });
    }

    componentDidMount = () => {
        const { location } = this.props;
        let job = location.pathname.split('/');
        let jobId = job[job.length - 1]
        this._getAllJobApplicants(jobId);
        this.setState({ jobId })
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllJobApplicants = (jobId) => {
        const { token } = this.props;
        const { limit, searchJobApp, page } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllJobApplications(jobId, page, limit, token, searchJobApp)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allApplications: res.data, allApplicationsCount: res.inquiryCount,
                        searchJobApp: ''
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, searchJobApp: '' });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    searchJobApp: '', errType: 'error', loader: false
                });
            });
    }

    _searchJobApp = (val) => {
        this.setState({ searchJobApp: val, page: 1 }, () => {
            this._getAllJobApplicants(this.state.jobId);
        });
    }

    _handleJobPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllJobApplicants(this.state.jobId);
        })
    }

    _closeViewJobAppModal = () => {
        this.setState({ showViewJobAppModal: false });
    }

    render() {
        const { allApplications, allApplicationsCount, errType, loader, errMsg, page,
            showViewJobAppModal, applicationDetails } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {jobAppTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Search
                                        placeholder="Search applicants"
                                        onSearch={(value) => this._searchJobApp(value)}
                                        style={{ "float": "right", "width": "250px" }}
                                        enterButton
                                    />
                                </div>
                                {loader && <span className="loader-class">
                                    <Spin />
                                </span>}
                                <div>
                                    <ViewJobAppModal
                                        applicationDetails={applicationDetails}
                                        showViewJobAppModal={showViewJobAppModal}
                                        closeViewJobAppModal={this._closeViewJobAppModal}
                                    />
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allApplications}
                                        className="isoCustomizedTable"
                                    />
                                    <Pagination
                                        style={{ marginTop: '15px' }}
                                        className="ant-users-pagination"
                                        onChange={this._handleJobPagination.bind(this)}
                                        pageSize={50}
                                        current={page}
                                        total={allApplicationsCount}
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
    }))(JobApplications);

export { JobApplications, jobAppTableInfos };
