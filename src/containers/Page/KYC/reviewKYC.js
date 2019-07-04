import React, { Component } from 'react';
import { notification, Pagination, Input, DatePicker, Row, Form, Button } from 'antd';
import { KYCInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import ViewKYCModal from './viewKYCModal';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import moment from 'moment';
import ColWithPadding from '../common.style';

const { logout } = authAction;
const { RangePicker } = DatePicker;
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
            status: 'REVIEW',
            startDate: '',
            endDate: '',
            rangeDate: []
        }
        self = this;
        ReviewKYC.viewKYC = ReviewKYC.viewKYC.bind(this);
    }

    static viewKYC(value, mtid, first_name, last_name, email, direct_response, kycDoc_details,
        webhook_response, address, country, city, zip, dob, id_type, created_at) {
        let kycDetails = {
            value, mtid, first_name, last_name, email, direct_response, kycDoc_details,
            webhook_response, address, country, city, zip, dob, id_type, created_at
        }
        self.setState({ kycDetails, showViewKYCModal: true })
    }

    componentDidMount = () => {
        this._getAllKYCData();
    }

    _getAllKYCData = () => {
        const { token } = this.props;
        const { page, limit, searchKYC, sorterCol, sortOrder, status, startDate, endDate } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getKYCData(token, page, limit, searchKYC, sorterCol, sortOrder, startDate, endDate, status)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allKYCData: res.data, allKYCCount: parseInt(res.KYCCount) });
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
        const { allKYCData, errMsg, errType, loader, kycDetails, showViewKYCModal, page, allKYCCount,
            rangeDate, searchKYC } = this.state;
        if (errMsg) {
            this.openNotificationWithIcon(errType.toLowerCase());
        }

        return (
            <TableDemoStyle>
                <div className="isoTableDisplayTab">
                    {KYCInfos.map(tableInfo => (
                        <div key={tableInfo.value}>
                            <Form onSubmit={this._searchKYC}>
                                <Row type="flex" justify="end">
                                    <ColWithPadding sm={5}>
                                        <Input
                                            placeholder="Search KYC"
                                            onChange={this._changeSearch.bind(this)}
                                            value={searchKYC}
                                        />
                                    </ColWithPadding>
                                    <ColWithPadding sm={7}>
                                        <RangePicker
                                            value={rangeDate}
                                            disabledTime={this.disabledRangeTime}
                                            onChange={this._changeDate}
                                            format="YYYY-MM-DD"
                                            allowClear={false}
                                            style={{ width: "100%" }}
                                        />
                                    </ColWithPadding>
                                    <ColWithPadding xs={12} sm={3}>
                                        <Button htmlType="submit" className="search-btn" type="primary" style={{ margin: "0" }}>Search</Button>
                                    </ColWithPadding>
                                    <ColWithPadding xs={12} sm={3}>
                                        <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>
                                    </ColWithPadding>
                                </Row>
                            </Form>
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
        );
    }
}

export default connect(
    state => ({
        user: state.Auth.get('user'),
        token: state.Auth.get('token')
    }), { logout })(ReviewKYC);

export { ReviewKYC }
