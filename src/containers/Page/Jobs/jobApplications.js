import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification } from 'antd';
import { jobAppTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import ViewJobAppModal from './viewJobAppModal';
import FaldaxLoader from '../faldaxLoader';
import { Link } from 'react-router-dom';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;
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

    static viewJobApplication(value, first_name, last_name, email, phone_number, created_at, resume, cover_letter, linkedin_profile, website_url) {
        let applicationDetails = {
            value, first_name, last_name, email, phone_number, created_at, resume, cover_letter, linkedin_profile, website_url
        }
        self.setState({ showViewJobAppModal: true, applicationDetails });
    }

    componentDidMount = () => {
        const { location } = this.props;
        let job = location.pathname.split('/');
        let jobId = job[job.length - 1]
        this.setState({ jobId }, () => {
            this._getAllJobApplicants();
        })
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllJobApplicants = () => {
        const { token } = this.props;
        const { limit, searchJobApp, page, sorterCol, sortOrder, jobId } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllJobApplications(jobId, page, limit, token, searchJobApp, sorterCol, sortOrder)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allApplications: res.data, allApplicationsCount: res.applicationCount });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    _searchJobApp = (val) => {
        this.setState({ searchJobApp: val, page: 1 }, () => {
            this._getAllJobApplicants();
        });
    }

    _handleJobPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllJobApplicants();
        })
    }

    _closeViewJobAppModal = () => {
        this.setState({ showViewJobAppModal: false });
    }

    _handleJobAppTableChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getAllJobApplicants();
        })
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
                                    <Link to="/dashboard/jobs">
                                        <i style={{ marginRight: '10px' }} class="fa fa-arrow-left" aria-hidden="true"></i>
                                        <a onClick={() => { this.props.history.push('/dashboard/jobs') }}>Back</a>
                                    </Link>
                                    <Search
                                        placeholder="Search applicants"
                                        onSearch={(value) => this._searchJobApp(value)}
                                        style={{ "float": "right", "width": "250px" }}
                                        enterButton
                                    />
                                </div>
                                {loader && <FaldaxLoader />}
                                <div>
                                    <ViewJobAppModal
                                        applicationDetails={applicationDetails}
                                        showViewJobAppModal={showViewJobAppModal}
                                        closeViewJobAppModal={this._closeViewJobAppModal}
                                    />
                                    <TableWrapper
                                        style={{ marginTop: '20px' }}
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allApplications}
                                        className="isoCustomizedTable"
                                        onChange={this._handleJobAppTableChange}
                                    />
                                    {allApplicationsCount > 0 ?
                                        <Pagination
                                            style={{ marginTop: '15px' }}
                                            className="ant-users-pagination"
                                            onChange={this._handleJobPagination.bind(this)}
                                            pageSize={50}
                                            current={page}
                                            total={allApplicationsCount}
                                        /> : ''}
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
    }), { logout })(JobApplications);

export { JobApplications, jobAppTableInfos };
