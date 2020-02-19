import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification, Row, Col, Button } from 'antd';
import { jobAppTableInfos as tableColumn } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import ViewJobAppModal from './viewJobAppModal';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT, EXPORT_LIMIT_SIZE } from "../../../helpers/globals";
import { BackButton } from '../../Shared/backBttton';
import { BreadcrumbComponent } from '../../Shared/breadcrumb';
import { ExportToCSVComponent } from '../../Shared/exportToCsv';
import { exportJobs, exportJobApplicants } from '../../../helpers/exportToCsv/headers';
import { PageCounterComponent } from '../../Shared/pageCounter';

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
             limit: PAGESIZE,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            page: 1,
            loader: false,
            applicationDetails: [],
            showViewJobAppModal: false,
            jobId: '',
            csvData:[],
            openCsvModal:false
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

    _getAllJobApplicants = (isExportToCsv=false) => {
        const { token } = this.props;
        const { limit, searchJobApp, page, sorterCol, sortOrder, jobId } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        (isExportToCsv?ApiUtils.getAllJobApplications(jobId, 1,EXPORT_LIMIT_SIZE, token, "", "", ""):ApiUtils.getAllJobApplications(jobId, page, limit, token, searchJobApp, sorterCol, sortOrder))
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    if(isExportToCsv)
                    _this.setState({csvData:res.data});
                    else
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
                    errMsg: true, errMessage: 'Unable to complete the requested action.', errType: 'error', loader: false
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

    _changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this._getAllJobApplicants();
        });
    }

    render() {
        const { allApplications, allApplicationsCount, errType, loader, errMsg, page,
            showViewJobAppModal, applicationDetails, limit,csvData,openCsvModal } = this.state;
       let pageSizeOptions = PAGE_SIZE_OPTIONS
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                {loader && <FaldaxLoader />}
                <ExportToCSVComponent
              isOpenCSVModal={openCsvModal}
              onClose={() => {
                this.setState({ openCsvModal: false });
              }}
              filename="job_applicants"
              data={csvData}
              header={exportJobApplicants}
            />
                {/* <BackButton {...this.props}></BackButton> */}
                <BreadcrumbComponent {...this.props}></BreadcrumbComponent>
                <TableDemoStyle className="isoLayoutContent">
                <PageCounterComponent page={page} limit={limit} dataCount={allApplicationsCount} syncCallBack={()=>this._getAllJobApplicants(false)}/>
                <Row className="table-filter-row" type="flex" justify="start">
                    <Col md={7}>
                        <Search
                        placeholder="Search applicants"
                        onSearch={(value) => this._searchJobApp(value)}
                        enterButton
                        />
                    </Col>
                    <Col xs={24} md={3}>
                  <Button
                    type="primary"
                    icon="export"
                    className="full-width"
                    onClick={() => {
                      this.setState({ openCsvModal: true }, () =>
                        this._getAllJobApplicants(true)
                      );
                    }}
                  >
                    Export
                  </Button>
                </Col>
                </Row>
                
                <ViewJobAppModal
                    applicationDetails={applicationDetails}
                    showViewJobAppModal={showViewJobAppModal}
                    closeViewJobAppModal={this._closeViewJobAppModal}
                />
                <TableWrapper
                    rowKey="id"
                    className="float-clear table-tb-margin"
                    {...this.state}
                    columns={tableColumn.columns}
                    pagination={false}
                    dataSource={allApplications}
                    onChange={this._handleJobAppTableChange}
                    bordered
                    scroll={TABLE_SCROLL_HEIGHT}
                />
                {allApplicationsCount > 0 ?
                    <Pagination
                        className="ant-users-pagination"
                        onChange={this._handleJobPagination.bind(this)}
                        pageSize={limit}
                        current={page}
                        total={parseInt(allApplicationsCount)}
                        showSizeChanger
                        onShowSizeChange={this._changePaginationSize}
                        pageSizeOptions={pageSizeOptions}
                    /> : ''}
        

                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(JobApplications);

export { JobApplications };
