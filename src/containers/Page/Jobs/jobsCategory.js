import React, { Component } from 'react';
import { notification, Button } from 'antd';
import { jobCategoryTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import AddJobCatModal from './addJobCategoryModal';
import EditJobCatModal from './editCategory';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import { isAllowed } from '../../../helpers/accessControl';

const { logout } = authAction;
var self;

class JobCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
            showAddJobCatModal: false,
            categoryDetails: [],
            showEditJobCatModal: false,
            allJobCategories: []
        }
        self = this;
        JobCategory.jobCategoryStatus = JobCategory.jobCategoryStatus.bind(this);
        JobCategory.updateCategory = JobCategory.updateCategory.bind(this);
    }

    componentDidMount = () => {
        this._getAllJobCategories();
    }

    static jobCategoryStatus(value, category, is_active) {
        const { token } = self.props;

        let formData = {
            id: value,
            category,
            is_active: !is_active
        };

        self.setState({ loader: true })
        let message = is_active ? 'Category has been inactivated successfully.' : 'Category has been activated successfully.'

        ApiUtils.updateJobCategory(token, formData)
            .then((res) => res.json())
            .then((res) => {
                if (res.status == 200) {
                    self.setState({
                        errMsg: true, errMessage: message, loader: false,
                        errType: 'Success', showError: false, isDisabled: false
                    });
                    self._getAllJobCategories();
                } else if (res.status == 403) {
                    self.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        self.props.logout();
                    });
                } else {
                    self.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch(() => {
                self.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    loader: false, errType: 'error', showError: false, isDisabled: false
                });
            });
    }

    static updateCategory(value, category, is_active) {
        let categoryDetails = {
            value, category, is_active
        }
        self.setState({ showEditJobCatModal: true, categoryDetails });
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllJobCategories = () => {
        const { token } = this.props;
        let _this = this;

        ApiUtils.getAllJobCategories(token, false)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allJobCategories: res.data });
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

    _showAddJobCatModal = () => {
        this.setState({ showAddJobCatModal: true });
    }

    _closeAddJobModal = () => {
        this.setState({ showAddJobCatModal: false });
    }

    _closeEditJobCatModal = () => {
        this.setState({ showEditJobCatModal: false });
    }

    render() {
        const { errType, loader, errMsg, showAddJobCatModal, showEditJobCatModal,
            categoryDetails, allJobCategories } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div>
                {jobCategoryTableInfos.map(tableInfo => (
                    <div key={tableInfo.value}>
                        <div style={{ "display": "inline-block", "width": "100%" }}>
                            {isAllowed("add_job_category") &&

                                <Button type="primary" style={{ "marginBottom": "15px", "float": "left" }} onClick={this._showAddJobCatModal}>Add Category</Button>
                            }
                            <AddJobCatModal
                                showAddJobCatModal={showAddJobCatModal}
                                closeAddModal={this._closeAddJobModal}
                                getAllJobCategories={this._getAllJobCategories.bind(this, 1)}
                            />
                        </div>
                        {loader && <FaldaxLoader />}
                        <EditJobCatModal
                            fields={categoryDetails}
                            showEditJobCatModal={showEditJobCatModal}
                            closeEditJobCatModal={this._closeEditJobCatModal}
                            getAllJobCategories={this._getAllJobCategories.bind(this, 1)}
                        />
                        <TableWrapper
                            {...this.state}
                            columns={tableInfo.columns}
                            pagination={false}
                            dataSource={allJobCategories}
                            className="isoCustomizedTable"
                            onChange={this._handleJobTableChange}
                        />
                    </div>
                ))}
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(JobCategory);

export { JobCategory, jobCategoryTableInfos };
