import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { historyTableInfos } from '../../Tables/antTables';
import TableWrapper from "../../Tables/antTables/antTable.style";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import { Tabs, Input, Pagination, DatePicker, Button, Form } from 'antd';
import FaldaxLoader from '../faldaxLoader';
import moment from 'moment';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const { RangePicker } = DatePicker;

class LoginHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allHistory: [],
            loader: false,
            allHistoryCount: 0,
            page: 1,
            limit: 50,
            startDate: '',
            endDate: '',
            rangeDate: [],
            searchHistory: ''
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
                _this.setState({ allHistory: res.data, loader: false, allHistoryCount: res.allHistoryCount });
            })
            .catch((err) => {
                _this.setState({ loader: false })
                console.log(err)
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
            startDate: moment(date[0]).startOf('day').toISOString(),
            endDate: moment(date[1]).endOf('day').toISOString()
        })
    }

    _resetFilters = () => {
        this.setState({
            searchHistory: '', startDate: '', endDate: '', rangeDate: []
        }, () => {
            this._getAllLoginHistory();
        })
    }

    _searchHistory = (e) => {
        e.preventDefault();
        this._getAllLoginHistory();
    }

    _handleHistoryPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllLoginHistory();
        })
    }

    _changeSearch = (field, e) => {
        this.setState({ searchHistory: field.target.value })
    }

    render() {
        const { allHistory, loader, allHistoryCount, page, rangeDate, searchHistory } = this.state;

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {historyTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Form onSubmit={this._searchHistory}>
                                        <Input
                                            placeholder="Search history"
                                            onChange={this._changeSearch.bind(this)}
                                            style={{ "width": "200px" }}
                                            value={searchHistory}
                                        />
                                        <RangePicker
                                            value={rangeDate}
                                            disabledTime={this.disabledRangeTime}
                                            onChange={this._changeDate}
                                            format="YYYY-MM-DD"
                                            style={{ marginLeft: '15px' }}
                                        />

                                        <Button className="search-btn" htmlType="submit" type="primary">Search</Button>
                                        <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>
                                    </Form>
                                </div>
                                <div>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allHistory}
                                        className="isoCustomizedTable"
                                    />
                                    {loader && <FaldaxLoader />}
                                    {allHistoryCount > 0 ?
                                        <Pagination
                                            style={{ marginTop: '15px' }}
                                            className="ant-users-pagination"
                                            onChange={this._handleHistoryPagination.bind(this)}
                                            pageSize={50}
                                            current={page}
                                            total={allHistoryCount}
                                        /> : ''}
                                </div>
                            </TabPane>
                        ))}
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper>
        )
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(LoginHistory);
