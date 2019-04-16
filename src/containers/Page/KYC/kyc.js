import React, { Component } from 'react';
import { Tabs, notification, Pagination } from 'antd';
import { KYCInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import ViewKYCModal from './viewKYCModal';
import FaldaxLoader from '../faldaxLoader';

const TabPane = Tabs.TabPane;
var self;

class KYC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allKYCData: [],
            showViewKYCModal: false,
            kycDetails: [],
            notifyMsg: '',
            notify: false,
            errType: '',
            loader: false,
            page: 1,
            limit: 50,
            searchKYC: '',
            allKYCCount: 0,
        }
        self = this;
        KYC.rejectKYC = KYC.rejectKYC.bind(this);
        KYC.rejectKYC = KYC.rejectKYC.bind(this);
        KYC.viewKYC = KYC.viewKYC.bind(this);
    }

    static viewKYC(value, first_name, last_name, email, direct_response, kycDoc_details,
        front_doc, back_doc, ssn, webhook_response, address, country, city, zip, dob, id_type) {
        let kycDetails = {
            value, first_name, last_name, email, direct_response, kycDoc_details, front_doc,
            back_doc, ssn, webhook_response, address, country, city, zip, dob, id_type
        }
        self.setState({ kycDetails, showViewKYCModal: true })
    }

    static rejectKYC(value, first_name, last_name, email, direct_response, kycDoc_details,
        front_doc, back_doc, ssn, webhook_response, address, country, city, zip, dob, id_type) {
        self._updateStatusKYC(value, false);
    }

    static approveKYC(value, first_name, last_name, email, direct_response,
        kycDoc_details, front_doc, back_doc, ssn, webhook_response, address,
        country, city, zip, dob, id_type) {
        self._updateStatusKYC(value, true);
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
                self.setState({ loader: false, errMsg: true, errMessage: res.message, errType: 'error' });
                self._getAllKYCData();
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
        const { page, limit, searchKYC, sorterCol, sortOrder } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getKYCData(token, page, limit, searchKYC, sorterCol, sortOrder)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ allKYCData: res.data, allKYCCount: res.KYCCount });
                } else {
                    _this.setState({ errMsg: true, message: res.message });
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
            description: this.state.notifyMsg
        });
        this.setState({ notify: false });
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

    render() {
        const { allKYCData, notify, errType, loader, kycDetails, showViewKYCModal, page, allKYCCount } = this.state;

        if (notify) {
            this.openNotificationWithIcon(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {KYCInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                {loader && <FaldaxLoader />}
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
                                    />
                                    : ''}
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
        user: state.Auth.get('user'),
        token: state.Auth.get('token')
    }))(KYC);

export { KYC }
