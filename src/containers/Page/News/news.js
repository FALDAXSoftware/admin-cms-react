import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification, Select, DatePicker, Button, Form, Row } from 'antd';
import { newsTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import moment from 'moment';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import ColWithPadding from '../common.style';

const Option = Select.Option;
const { logout } = authAction;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
var self;

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
        self = this;
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
        this._getAllNewsSources();
    }

    _getAllNews = () => {
        const { token } = this.props;
        const { searchNews, page, limit, filterVal, startDate, endDate, sorterCol, sortOrder } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllNews(page, limit, token, searchNews, filterVal, startDate, endDate, sorterCol, sortOrder)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allNews: res.data, allNewsCount: res.newsCount });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
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

    _getAllNewsSources = () => {
        const { token } = this.props;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllNewsSources(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allNewsSources: res.data });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
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
        this.setState({ page: 1 }, () => {
            this._getAllNews();
        });
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
            startDate: moment(date[0]).toISOString(),
            endDate: moment(date[1]).toISOString()
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

    _handleNewsTableChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getAllNews();
        })
    }

    render() {
        const { allNews, allNewsCount, errType, errMsg, page, loader,
            searchNews, rangeDate, filterVal, allNewsSources } = this.state;
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
                                        <Row>
                                            <ColWithPadding sm={5}>
                                                <Input
                                                    placeholder="Search news"
                                                    onChange={this._changeSearch.bind(this)}
                                                    value={searchNews}
                                                />
                                            </ColWithPadding>
                                            <ColWithPadding sm={5}>
                                                <Select
                                                    placeholder="Select a source"
                                                    onChange={this._changeFilter}
                                                    value={filterVal}
                                                >
                                                    <Option value={''}>{'All'}</Option>
                                                    {allNewsSources && allNewsSources.map((news, index) => <Option key={news.id} value={news.slug}>{news.source_name}</Option>)}
                                                </Select>
                                            </ColWithPadding>
                                            <ColWithPadding sm={8}>
                                                <RangePicker
                                                    value={rangeDate}
                                                    disabledTime={this.disabledRangeTime}
                                                    onChange={this._changeDate}
                                                    format="YYYY-MM-DD"
                                                    allowClear={false}
                                                />
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                <Button htmlType="submit" className="search-btn" type="primary" >Search</Button>
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>
                                            </ColWithPadding>
                                        </Row>
                                    </Form>
                                </div>
                                {loader && <FaldaxLoader />}
                                <TableWrapper
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
    }), { logout })(News);

export { News, newsTableInfos };
