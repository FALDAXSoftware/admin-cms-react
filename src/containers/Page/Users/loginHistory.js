import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { historyTableInfos } from '../../Tables/antTables';
import TableWrapper from "../../Tables/antTables/antTable.style";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import { Tabs, Input, Pagination, DatePicker,Row, Button, Form, notification,Icon } from 'antd';
import ColWithMarginBottom from "../common.style";
import FaldaxLoader from '../faldaxLoader';
import moment from 'moment';
import authAction from '../../../redux/auth/actions';
import { PAGE_SIZE_OPTIONS, PAGESIZE } from "../../../helpers/globals";

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
        }
    }

    componentDidMount = () => {
        this._getAllLoginHistory();
    }

    _getAllLoginHistory = () => {
        const { token, user_id } = this.props;
        const { page, limit, searchHistory, startDate, endDate } = this.state;
        let _this = this;

        _this.setState({ loader: true })
        ApiUtils.getUserHistory(token, user_id, page, limit, searchHistory, startDate, endDate)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
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
            errMsg, errType, limit } = this.state;
       let pageSizeOptions = PAGE_SIZE_OPTIONS

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
          <LayoutWrapper>
            <Tabs className="isoTableDisplayTab full-width">
              {historyTableInfos.map(tableInfo => (
                <TabPane tab={tableInfo.title} key={tableInfo.value}>
                  <TableDemoStyle className="isoLayoutContent">
                    <Form onSubmit={this._searchHistory} className="cty-search">
                      <Row type="flex" justify="end">
                        <ColWithMarginBottom sm={6}>
                          <Input
                            placeholder="Search history"
                            onChange={this._changeSearch.bind(this)}
                            value={searchHistory}
                          />
                        </ColWithMarginBottom>
                        <ColWithMarginBottom sm={6}>
                          <RangePicker
                            value={rangeDate}
                            disabledTime={this.disabledRangeTime}
                            onChange={this._changeDate}
                            format="YYYY-MM-DD"
                          />
                        </ColWithMarginBottom>
                        <ColWithMarginBottom sm={3}>
                          <Button
                            className="filter-btn btn-full-width"
                            htmlType="submit"
                            type="primary"
                          >
                            <Icon type="search" />
                            Search
                          </Button>
                        </ColWithMarginBottom>
                        <ColWithMarginBottom sm={3}>
                          <Button
                            className="filter-btn btn-full-width"
                            type="primary"
                            onClick={this._resetFilters}
                          >
                            <Icon type="reload"></Icon>Reset
                          </Button>
                        </ColWithMarginBottom>
                      </Row>
                    </Form>

                    <div>
                      <TableWrapper
                        {...this.state}
                        columns={tableInfo.columns}
                        pagination={false}
                        dataSource={allHistory}
                        className="isoCustomizedTable"
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
                </TabPane>
              ))}
            </Tabs>
          </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(LoginHistory);
