import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification, Spin, Select, DatePicker, Button } from 'antd';
import { newsTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import moment from 'moment';
import { CSVLink } from "react-csv";

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allNews: [],
            allNewsCount: 0,
            searchNews: '',
            limit: 50,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            page: 1,
            loader: false,
            filterVal: '',
            startDate: '',
            endDate: '',
            rangeDate: []
        }
    }

    componentDidMount = () => {
        this._getAllNews();
    }

    _getAllNews = () => {
        const { token } = this.props;
        const { searchNews, page, limit, filterVal, startDate, endDate } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllNews(page, limit, token, searchNews, filterVal, startDate, endDate)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allNews: res.data, allNewsCount: res.newsCount
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(err => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    searchNews: '', errType: 'error', loader: false
                });
            });
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _searchNews = () => {
        this._getAllNews();
    }

    _changeFilter = (val) => {
        this.setState({ filterVal: val });
    }

    _changeSearch = (field, e) => {
        this.setState({ searchNews: field.target.value })
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
            filterVal: '', searchNews: '', startDate: '', endDate: '', rangeDate: []
        }, () => {
            this._getAllNews();
        })
    }

    _changeFilter = (val) => {
        this.setState({ filterVal: val });
    }

    _handleNewsPagination = (page) => {
        this.setState({ page: page - 1 }, () => {
            this._getAllNews();
        })
    }

    render() {
        const { allNews, allNewsCount, errType, errMsg, page, loader,
            searchNews, rangeDate, filterVal } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {newsTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Input
                                        placeholder="Search news"
                                        onChange={this._changeSearch.bind(this)}
                                        style={{ "width": "200px" }}
                                        value={searchNews}
                                    />

                                    <Select
                                        style={{ width: 125, "marginLeft": "15px" }}
                                        placeholder="Select a type"
                                        onChange={this._changeFilter}
                                        value={filterVal}
                                    >
                                        <Option value={' '}>All</Option>
                                        <Option value={'Sell'}>Sell</Option>
                                        <Option value={'Buy'}>Buy</Option>
                                    </Select>

                                    <RangePicker
                                        value={rangeDate}
                                        disabledTime={this.disabledRangeTime}
                                        onChange={this._changeDate}
                                        format="YYYY-MM-DD"
                                        style={{ marginLeft: '15px' }}
                                    />

                                    <Button className="search-btn" type="primary" onClick={this._searchNews}>Search</Button>
                                    <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>
                                </div>
                                {loader && <span className="loader-class"><Spin /></span>}
                                <TableWrapper
                                    style={{ marginTop: '20px' }}
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allNews}
                                    className="isoCustomizedTable"
                                />
                                {allNewsCount > 0 ?
                                    <Pagination
                                        style={{ marginTop: '15px' }}
                                        className="ant-users-pagination"
                                        onChange={this._handleNewsPagination.bind(this)}
                                        pageSize={50}
                                        current={page}
                                        total={allNewsCount}
                                    /> : ''}
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
    }))(News);

export { News, newsTableInfos };
