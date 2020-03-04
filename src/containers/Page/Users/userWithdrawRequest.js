import React, { Component } from 'react';
import { Input, Pagination, notification, Select, Button, Row, Form, Col } from 'antd';
import { userWithdrawReqTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
// import { CSVLink } from "react-csv";
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT, EXPORT_LIMIT_SIZE } from "../../../helpers/globals";
import { export2faRequest } from '../../../helpers/exportToCsv/headers';
import { ExportToCSVComponent } from '../../Shared/exportToCsv';

const Option = Select.Option;
// const TabPane = Tabs.TabPane;
const { logout } = authAction;

class UserWithdrawRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allRequests: [],
            allReqCount: 0,
            searchReq: '',
             limit: PAGESIZE,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            page: 1,
            loader: false,
            filterVal: '',
            openCsvModal:false,
            csvData:[]
        }
    }

    componentDidMount = () => {
        this._getUserRequests();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getUserRequests = (isExportToCsv=false) => {
        const { token, user_id } = this.props;
        const { searchReq, page, limit, startDate, endDate, filterVal, sorterCol, sortOrder } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        (isExportToCsv?ApiUtils.getUserWithdrawReq(1, EXPORT_LIMIT_SIZE, token, "", "", "", user_id, "", "", ""):ApiUtils.getUserWithdrawReq(page, limit, token, searchReq, startDate, endDate, user_id, filterVal, sorterCol, sortOrder))
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    if(isExportToCsv)
                    _this.setState({csvData:res.data})
                    else
                    _this.setState({ allRequests: res.data, allReqCount: res.withdrawReqCount });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false });
            })
            .catch(err => {
                _this.setState({
                    errMsg: true, errMessage: 'Unable to complete the requested action.', errType: 'error', loader: false
                });
            });
    }

    _changeFilter = (val) => {
        this.setState({ filterVal: val });
    }

    _changeSearch = (field, e) => {
        this.setState({ searchReq: field.target.value })
    }

    _searchReq = (e) => {
        e.preventDefault();
        this.setState({ page: 1 }, () => {
            this._getUserRequests();
        })
    }

    _handleWithdrawPagination = (page) => {
        this.setState({ page: page - 1 }, () => {
            this._getUserRequests();
        })
    }

    _resetFilters = () => {
        this.setState({
            filterVal: '', searchReq: '', startDate: '', endDate: '', rangeDate: [], page: 1
        }, () => {
            this._getUserRequests();
        })
    }

    _handleUserWithdrawReqChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getUserRequests();
        })
    }

    _changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this._getUserRequests();
        });
    }

    render() {
        const { allRequests, allReqCount, errType, errMsg, page, loader, filterVal,
            searchReq, limit,openCsvModal,csvData} = this.state;
       let pageSizeOptions = PAGE_SIZE_OPTIONS

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <ExportToCSVComponent isOpenCSVModal={openCsvModal} onClose={()=>{this.setState({openCsvModal:false})}} filename="user_withdrawal_request.csv" data={csvData} header={export2faRequest}/>
                <TableDemoStyle className="isoLayoutContent full-width">

                                    <div className="form-container">
                                    <Form onSubmit={this._searchReq}>
                                        <Row>
                                            <Col sm={8}>
                                                <Input
                                                    placeholder="Search requests"
                                                    onChange={this._changeSearch.bind(this)}
                                                    value={searchReq}
                                                />
                                            </Col>
                                            <Col sm={7}>
                                                <Select
                                                    getPopupContainer={trigger => trigger.parentNode}
                                                    placeholder="Select a type"
                                                    onChange={this._changeFilter}
                                                    value={filterVal}
                                                >
                                                    <Option value={''}>All</Option>
                                                    <Option value={'true'}>Approve</Option>
                                                    <Option value={'false'}>Dis-Approve</Option>
                                                </Select>
                                            </Col>
                                            <Col xs={12} sm={3}>
                                                <Button htmlType="submit" className="filter-btn full-width" icon ="search" type="primary">Search</Button>
                                            </Col>
                                            <Col xs={12} sm={3}>
                                                <Button className="filter-btn full-width" type="primary" icon="reload" onClick={this._resetFilters}>Reset</Button>
                                            </Col>
                                            <Col xs={12} sm={3}>
                                                <Button icon="export" className="filter-btn full-width" type="primary" 
                                                 onClick={()=>{this.setState({openCsvModal:true},()=>{this._getUserRequests(true)})}}>Export</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                    </div>
                                {loader && <FaldaxLoader />}
                                < TableWrapper
                                    className="table-tb-margin float-clear"
                                    rowKey="id"
                                    {...this.state}
                                    columns={userWithdrawReqTableInfos[0].columns}
                                    pagination={false}
                                    dataSource={allRequests}
                                    onChange={this._handleUserWithdrawReqChange}
                                    bordered
                                    scroll={TABLE_SCROLL_HEIGHT}
                                />
                                {allReqCount > 0 ?
                                    <Pagination
                                        className="ant-users-pagination"
                                        onChange={this._handleWithdrawPagination.bind(this)}
                                        pageSize={limit}
                                        current={page}
                                        total={allReqCount}
                                        showSizeChanger
                                        onShowSizeChange={this._changePaginationSize}
                                        pageSizeOptions={pageSizeOptions}
                                    /> : ''
                                }
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(UserWithdrawRequest);

export { UserWithdrawRequest, userWithdrawReqTableInfos };
