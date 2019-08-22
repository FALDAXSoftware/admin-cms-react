import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification } from 'antd';
import { twoFactorReqInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import SimpleReactValidator from 'simple-react-validator';
import ViewRequestModal from './viewRequestModal';
import RequestActionModal from './requestActionModal';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
const { logout } = authAction;
var self;

class TwoFactorRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            all2FARequests: [],
            allJobsCount: 0,
            searchJob: '',
            limit: 50,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            page: 1,
            loader: false,
            showRejectForm: false,
            showViewRequestModal: false,
            twoFactorReqDetails: []
        }
        this.validator = new SimpleReactValidator();
        self = this;
        TwoFactorRequests.approve2FA = TwoFactorRequests.approve2FA.bind(this);
        TwoFactorRequests.reject2FA = TwoFactorRequests.reject2FA.bind(this);
        TwoFactorRequests.viewRequest = TwoFactorRequests.viewRequest.bind(this);
    }

    componentDidMount = () => {
        this._getAll2FARequests();
    }

    static approve2FA(value) {
        const { token } = self.props;

        let formData = {
            id: value,
        };

        self.setState({ loader: true })

        ApiUtils.approve2FARequest(token, formData)
            .then((res) => res.json())
            .then((res) => {
                if (res.status == 200) {
                    self.setState({
                        errMsg: true, errMessage: res.message,
                        errType: 'Success', showError: false, isDisabled: false
                    });
                    self._getAll2FARequests();
                } else if (res.status == 403) {
                    self.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        self.props.logout();
                    });
                } else {
                    self.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                self.setState({ loader: false })
            })
            .catch(() => {
                self.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    loader: false, errType: 'error', showError: false, isDisabled: false
                });
            });
    }

    static reject2FA(value, full_name, email, uploaded_file, status, reason, created_at) {
        let twoFactorReqDetails = {
            value, full_name, email, uploaded_file, status, reason, created_at
        }
        self.setState({ showRejectForm: true, twoFactorReqDetails })
    }

    static viewRequest(value, full_name, email, uploaded_file, status, reason, created_at) {
        let twoFactorReqDetails = {
            value, full_name, email, uploaded_file, status, reason, created_at
        }
        self.setState({ showViewRequestModal: true, twoFactorReqDetails })
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAll2FARequests = () => {
        const { token } = this.props;
        const { limit, searchJob, page, sorterCol, sortOrder } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAll2FARequests(token, page, limit)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ all2FARequests: res.data, allJobsCount: res.allJobsCount });
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

    _searchRequest = (val) => {
        this.setState({ searchJob: val, page: 1 }, () => {
            this._getAll2FARequests();
        });
    }

    _handleJobPagination = (page) => {
        this.setState({ page }, () => {
            this._getAll2FARequests();
        })
    }

    _handleJobTableChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getAll2FARequests();
        })
    }

    _changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this._getAll2FARequests();
        });
    }

    _closeRejectForm = () => {
        this.setState({ showRejectForm: false })
    }

    _closeViewReqModal = () => {
        this.setState({ showViewRequestModal: false })
    }

    render() {
        const { all2FARequests, allJobsCount, errType, loader, errMsg, page, limit,
            showRejectForm, twoFactorReqDetails, showViewRequestModal } = this.state;
        let pageSizeOptions = ['20', '30', '40', '50']
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab" onChange={this._changeTab}>
                        {twoFactorReqInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                {loader && <FaldaxLoader />}
                                <TableWrapper
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={all2FARequests}
                                    className="isoCustomizedTable"
                                    onChange={this._handleJobTableChange}
                                />
                                <ViewRequestModal
                                    twoFactorReqDetails={twoFactorReqDetails}
                                    showViewRequestModal={showViewRequestModal}
                                    closeViewRequestModal={this._closeViewReqModal}
                                />
                                {allJobsCount > 0 ?
                                    <Pagination
                                        style={{ marginTop: '15px' }}
                                        className="ant-users-pagination"
                                        onChange={this._handleJobPagination.bind(this)}
                                        pageSize={limit}
                                        current={page}
                                        total={allJobsCount}
                                        showSizeChanger
                                        onShowSizeChange={this._changePaginationSize}
                                        pageSizeOptions={pageSizeOptions}
                                    /> : ''}
                                <RequestActionModal
                                    showRejectForm={showRejectForm}
                                    twoFactorReqDetails={twoFactorReqDetails}
                                    closeActionReqModal={this._closeRejectForm}
                                    getAll2FARequests={this._getAll2FARequests}
                                />
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
    }), { logout })(TwoFactorRequests);

export { TwoFactorRequests, twoFactorReqInfos };
