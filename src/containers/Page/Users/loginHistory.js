import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { historyTableInfos } from '../../Tables/antTables';
import TableWrapper from "../../Tables/antTables/antTable.style";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import { Tabs, Input, Pagination, DatePicker,Row, Button, Form, notification,Icon,Col } from 'antd';
import FaldaxLoader from '../faldaxLoader';
import moment from 'moment';
import authAction from '../../../redux/auth/actions';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT, EXPORT_LIMIT_SIZE } from "../../../helpers/globals";
import { PageCounterComponent } from '../../Shared/pageCounter';
import { ExportToCSVComponent } from '../../Shared/exportToCsv';
import { exportLoginHistory } from '../../../helpers/exportToCsv/headers';

const { logout } = authAction;

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

class LoginHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allHistory: [],
            loader: false,
            allHistoryCount: 0,
            page: 1,
             limit: PAGESIZE,
            startDate: '',
            endDate: '',
            rangeDate: [],
            searchHistory: '',
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            openCsvModal:false,
            csvData:[]
        }
    }

    componentDidMount = () => {
        this._getAllLoginHistory();
    }

    _getAllLoginHistory = (isExportCsv=false) => {
        const { token, user_id } = this.props;
        const { page, limit, searchHistory, startDate, endDate } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        (isExportCsv?ApiUtils.getUserHistory(token, user_id, 1, EXPORT_LIMIT_SIZE, "", "", ""):ApiUtils.getUserHistory(token, user_id, page, limit, searchHistory, startDate, endDate))
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    if(isExportCsv)
                    _this.setState({csvData:res.data,loader: false})
                    else
                    _this.setState({ allHistory: res.data, loader: false, allHistoryCount: res.allHistoryCount });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch((err) => {
                _this.setState({ loader: false })
            });
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

    _resetFilters = () => {
        this.setState({
            searchHistory: '', startDate: '', endDate: '', rangeDate: [], page: 1
        }, () => {
            this._getAllLoginHistory();
        })
    }

    _searchHistory = (e) => {
        e.preventDefault();
        this.setState({ page: 1 }, () => {
            this._getAllLoginHistory();
        })
    }

    _handleHistoryPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllLoginHistory();
        })
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _changeSearch = (field, e) => {
        this.setState({ searchHistory: field.target.value })
    }

    _changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this._getAllLoginHistory();
        });
    }

    render() {
        const { allHistory, loader, allHistoryCount, page, rangeDate, searchHistory,
            errMsg, errType, limit,openCsvModal,csvData} = this.state;
       let pageSizeOptions = PAGE_SIZE_OPTIONS

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
          
                  <TableDemoStyle className="isoLayoutContent">
                    <ExportToCSVComponent
                    isOpenCSVModal={openCsvModal}
                    onClose={() => {
                        this.setState({ openCsvModal: false });
                    }}
                    filename="user_login_history"
                    data={csvData}
                    header={exportLoginHistory}
                    />
                    <Form onSubmit={this._searchHistory} className="cty-search">
                    <PageCounterComponent page={page} limit={limit} dataCount={allHistoryCount} syncCallBack={this._resetFilters}/>
                        <Row justify="start" type="flex" className="table-filter-row">
                        <Col sm={7}>
                          <Input
                            placeholder="Search history"
                            onChange={this._changeSearch.bind(this)}
                            value={searchHistory}
                          />
                        </Col>
                        <Col sm={8}>
                          <RangePicker
                            value={rangeDate}
                            disabledTime={this.disabledRangeTime}
                            onChange={this._changeDate}
                            format="YYYY-MM-DD"
                          />
                        </Col>
                        <Col sm={3}>
                          <Button
                            className="filter-btn btn-full-width"
                            htmlType="submit"
                            type="primary"
                          >
                            <Icon type="search" />
                            Search
                          </Button>
                        </Col>
                        <Col sm={3}>
                          <Button
                            className="filter-btn btn-full-width"
                            type="primary"
                            onClick={this._resetFilters}
                          >
                            <Icon type="reload"></Icon>Reset
                          </Button>
                        </Col>
                        <Col xs={12} md={3}>
                        <Button
                        type="primary"
                        icon="export"
                        className="filter-btn full-width"
                        onClick={() => {
                            this.setState({ openCsvModal: true }, () =>
                            this._getAllLoginHistory(true)
                            );
                        }}
                        >
                      Export
                    </Button>
                  </Col>
                      </Row>
                    </Form>

                    <div>
                      <TableWrapper
                        rowKey="id"
                        {...this.state}
                        columns={historyTableInfos[0].columns}
                        pagination={false}
                        dataSource={allHistory}
                        bordered
                        className="table-tb-margin"
                        scroll={TABLE_SCROLL_HEIGHT}
                      />
                      {loader && <FaldaxLoader />}
                      {allHistoryCount > 0 ? (
                        <Pagination
                          style={{ marginTop: "15px" }}
                          className="ant-users-pagination"
                          onChange={this._handleHistoryPagination.bind(this)}
                          pageSize={limit}
                          current={page}
                          total={allHistoryCount}
                          showSizeChanger
                          onShowSizeChange={this._changePaginationSize}
                          pageSizeOptions={pageSizeOptions}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </TableDemoStyle>
        
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(LoginHistory);
