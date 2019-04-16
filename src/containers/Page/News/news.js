import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification, Select, DatePicker, Button, Form } from 'antd';
import { newsTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import moment from 'moment';
import FaldaxLoader from '../faldaxLoader';

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
var self = this;

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
        News.newsStatus = News.newsStatus.bind(this);
    }

    static newsStatus(value, cover_image, title, link, posted_at, description, is_active, owner) {
        const { token } = this.props;
        let formData = {
            id: value,
            is_active: !is_active
        };

        let message = is_active ? 'News has been inactivated successfully.' : 'News has been activated successfully.'
        self.setState({ loader: true });
        ApiUtils.changeNewsStatus(token, formData)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    self._getAllNews();
                    self.setState({ errMsg: true, errMessage: message, errType: 'Success', loader: false })
                }
                self.setState({ loader: false });
            })
            .catch(err => {
                self.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', searchNews: '', errType: 'error', loader: false
                });
            });
    }

    componentDidMount = () => {
        this._getAllNews();
    }

    _getAllNews = () => {
        const { token } = this.props;
        const { searchNews, page, limit, filterVal, startDate, endDate, sorterCol, sortOrder } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllNews(page, limit, token, searchNews, filterVal, startDate, endDate, sorterCol, sortOrder)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ allNews: res.data, allNewsCount: res.newsCount });
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

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _searchNews = (e) => {
        e.preventDefault();
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
            filterVal: '', searchNews: '', startDate: '', endDate: '',
            rangeDate: [], sorterCol: '', sortOrder: ''
        }, () => {
            this._getAllNews();
        })
    }

    _changeFilter = (val) => {
        this.setState({ filterVal: val });
    }

    _handleNewsPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllNews();
        })
    }

    _changeRow = (news) => {
        console.log('>>>>>>>', news)
        //this.props.history.push(news.link)
    }

    _handleNewsTableChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
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
                                    <Form onSubmit={this._searchNews}>
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
                                            <Option value={'bitcoinist'}>Bitcoinist</Option>
                                            <Option value={'cointelegraph'}>Coin Telegraph</Option>
                                            <Option value={'ccnpodcast'}>CCN Podcast</Option>
                                            <Option value={'bitcoin'}>Bitcoin</Option>
                                        </Select>

                                        <RangePicker
                                            value={rangeDate}
                                            disabledTime={this.disabledRangeTime}
                                            onChange={this._changeDate}
                                            format="YYYY-MM-DD"
                                            style={{ marginLeft: '15px' }}
                                        />

                                        <Button htmlType="submit" className="search-btn" type="primary" >Search</Button>
                                        <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>
                                    </Form>
                                </div>
                                {loader && <FaldaxLoader />}
                                <TableWrapper
                                    // onRow={(record, rowIndex) => {
                                    //     return {
                                    //         onClick: () => { this._changeRow(record) },
                                    //     };
                                    // }}
                                    style={{ marginTop: '20px' }}
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allNews}
                                    className="isoCustomizedTable"
                                    onChange={this._handleNewsTableChange}
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
