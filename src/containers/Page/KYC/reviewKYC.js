import React, { Component } from 'react';
import { notification, Pagination, Input } from 'antd';
import { KYCInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import ViewKYCModal from './viewKYCModal';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const Search = Input.Search;
const { logout } = authAction;
var self;

class ReviewKYC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allKYCData: [],
            showViewKYCModal: false,
            kycDetails: [],
            errMessage: '',
            errMsg: false,
            errType: '',
            loader: false,
            page: 1,
            limit: 50,
            searchKYC: '',
            allKYCCount: 0,
            status: 'REVIEW'
        }
        self = this;
    }

    static viewKYC(value, first_name, last_name, email, direct_response, kycDoc_details,
        front_doc, back_doc, ssn, webhook_response, address, country, city, zip, dob, id_type) {
        let kycDetails = {
            value, first_name, last_name, email, direct_response, kycDoc_details, front_doc,
            back_doc, ssn, webhook_response, address, country, city, zip, dob, id_type
        }
        self.setState({ kycDetails, showViewKYCModal: true })
    }

    _updateStatusKYC = (value, isApprove) => {
        const { token } = this.props;

        let formData = {
            isApprove,
            id: value
        }

        ApiUtils.updateKYCStatus(token, formData)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    self.setState({ loader: false, errMsg: true, errMessage: res.message, errType: 'error' });
                    self._getAllKYCData();
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
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    componentDidMount = () => {
        this._getAllKYCData();
    }

    _getAllKYCData = () => {
        const { token } = this.props;
        const { page, limit, searchKYC, sorterCol, sortOrder, status } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getKYCData(token, page, limit, searchKYC, sorterCol, sortOrder, status)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allKYCData: res.data, allKYCCount: res.KYCCount });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    openNotificationWithIcon = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _closeViewKYCModal = () => {
        this.setState({ showViewKYCModal: false });
    }

    _handleKYCPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllKYCData();
        })
    }

    _handleKYCTableChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getAllKYCData();
        })
    }

    _searchKYC = (val) => {
        this.setState({ searchKYC: val, page: 1 }, () => {
            this._getAllKYCData();
        });
    }

    render() {
        const { allKYCData, errMsg, errType, loader, kycDetails, showViewKYCModal, page, allKYCCount } = this.state;
        if (errMsg) {
            this.openNotificationWithIcon(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle>
                    <div className="isoTableDisplayTab">
                        {KYCInfos.map(tableInfo => (
                            <div>
                                <div style={{
                                    "display": "flex", "width": "100%",
                                    "justifyContent": "flex-end",
                                    "alignItems": "center",
                                }}>
                                    <Search
                                        placeholder="Search kyc"
                                        onSearch={(value) => this._searchKYC(value)}
                                        style={{ "width": "250px", "marginRight": "20px" }}
                                        enterButton
                                    />
                                </div>
                                {loader && <FaldaxLoader />}
                                <div style={{ marginTop: "30px" }}>
                                    <ViewKYCModal
                                        kycDetails={kycDetails}
                                        showViewKYCModal={showViewKYCModal}
                                        closeViewModal={this._closeViewKYCModal}
                                    />
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allKYCData}
                                        className="isoCustomizedTable"
                                        onChange={this._handleKYCTableChange}
                                    />
                                    {allKYCCount > 0 ?
                                        <Pagination
                                            style={{ marginTop: '15px' }}
                                            className="ant-users-pagination"
                                            onChange={this._handleKYCPagination.bind(this)}
                                            pageSize={50}
                                            current={page}
                                            total={allKYCCount}
                                        /> : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        user: state.Auth.get('user'),
        token: state.Auth.get('token')
    }), { logout })(ReviewKYC);

export { ReviewKYC }
