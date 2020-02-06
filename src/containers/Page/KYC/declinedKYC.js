import React, { Component } from 'react';
import { notification, Pagination, Input, Form,Icon, Button, DatePicker, Row, Col } from 'antd';
import { ApprovedKYCInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import ViewKYCModal from './viewKYCModal';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import moment from 'moment';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT } from "../../../helpers/globals";

const { logout } = authAction;
const { RangePicker } = DatePicker;
var self;

class DeclinedKYC extends Component {
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
             limit: PAGESIZE,
            searchKYC: '',
            allKYCCount: 0,
            status: 'DENY',
            startDate: '',
            endDate: '',
            rangeDate: []
        }
        self = this;
        DeclinedKYC.viewKYC = DeclinedKYC.viewKYC.bind(this);
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
                    errMsg: true, errMessage: 'Unable to complete the requested action.', errType: 'error', loader: false
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

    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    isabledRangeTime = (_, type) => {
        if (type === 'start') {
            return {
                disabledHours: () => this.range(0, 60).splice(4, 20),
                disabledMinutes: () => this.range(30, 60),
                disabledSeconds: () => [55, 56],
            };
        }
        return {
            disabledHours: () => this.range(0, 60).splice(20, 4),
            disabledMinutes: () => this.range(0, 31),
            disabledSeconds: () => [55, 56],
        };
    }

    _changeDate = (date, dateString) => {
        this.setState({
            rangeDate: date,
            startDate: date.length > 0 ? moment(date[0]).toISOString() : '',
            endDate: date.length > 0 ? moment(date[1]).toISOString() : ''
        })
    }

    _searchKYC = (e) => {
        e.preventDefault();
        this.setState({ page: 1, status: 'DENY' }, () => {
            this._getAllKYCData();
        })
    }

    _changeSearch = (field, e) => {
        this.setState({ searchKYC: field.target.value })
    }

    _resetFilters = () => {
        this.setState({
            filterVal: '', searchKYC: '', startDate: '', endDate: '',
            rangeDate: [], page: 1, sorterCol: '', sortOrder: ''
        }, () => {
            this._getAllKYCData();
        })
    }

    _changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this._getAllKYCData();
        });
    }

    render() {
        const { allKYCData, errMsg, errType, loader, kycDetails, showViewKYCModal, page,
            allKYCCount, searchKYC, rangeDate, limit } = this.state;
        if (errMsg) {
            this.openNotificationWithIcon(errType.toLowerCase());
        }
       let pageSizeOptions = PAGE_SIZE_OPTIONS

        return (
            <TableDemoStyle>
                <div className="isoLayoutContent">
                            <Form onSubmit={this._searchKYC}>
                                <Row type="flex" justify="start" className="table-filter-row">
                                    <Col md={6}>
                                        <Input
                                            placeholder="Search Customer ID"
                                            onChange={this._changeSearch.bind(this)}
                                            value={searchKYC}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <RangePicker
                                            value={rangeDate}
                                            disabledTime={this.disabledRangeTime}
                                            onChange={this._changeDate}
                                            format="YYYY-MM-DD"
                                            allowClear={false}
                                        />
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <Button htmlType="submit" className="filter-btn btn-full-width" type="primary"><Icon type="search"></Icon>Search</Button>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <Button className="filter-btn btn-full-width" type="primary" onClick={this._resetFilters}><Icon type="reload"/>Reset</Button>
                                    </Col>
                                </Row>
                            </Form>
                            {loader && <FaldaxLoader />}
                                <ViewKYCModal
                                    kycDetails={kycDetails}
                                    showViewKYCModal={showViewKYCModal}
                                    closeViewModal={this._closeViewKYCModal}
                                />
                                <TableWrapper
                                    rowKey="id"
                                    {...this.state}
                                    columns={ApprovedKYCInfos[0].columns}
                                    pagination={false}
                                    dataSource={allKYCData}
                                    bordered
                                    className="table-tb-margin"
                                    scroll={TABLE_SCROLL_HEIGHT}
                                    onChange={this._handleKYCTableChange}
                                />
                                {allKYCCount > 0 ?
                                    <Pagination
                                        className="ant-users-pagination"
                                        onChange={this._handleKYCPagination.bind(this)}
                                        pageSize={limit}
                                        current={page}
                                        total={parseInt(allKYCCount)}
                                        showSizeChanger
                                        onShowSizeChange={this._changePaginationSize}
                                        pageSizeOptions={pageSizeOptions}
                                    /> : ''}
                            </div>
            </TableDemoStyle>
        );
    }
}

export default connect(
    state => ({
        user: state.Auth.get('user'),
        token: state.Auth.get('token')
    }), { logout })(DeclinedKYC);


