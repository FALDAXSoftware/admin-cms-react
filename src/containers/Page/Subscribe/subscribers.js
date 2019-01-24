import React, { Component } from 'react';
import { Tabs, notification, Spin, Pagination, Input, DatePicker, Button, Modal } from 'antd';
import { subscriberTableinfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import moment from 'moment';

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
var self;

class Subscribers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allSubscribers: [],
            allSubscribersCount: 0,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
            page: 1,
            limit: 50,
            searchSubscriber: '',
            startDate: '',
            endDate: '',
            rangeDate: [],
            showDeleteSubscriberModal: false,
            deleteSubscriberId: ''
        }
        self = this;
        Subscribers.deleteSubscriber = Subscribers.deleteSubscriber.bind(this);
    }

    componentDidMount = () => {
        this._getAllSubscribers();
    }

    static deleteSubscriber(value) {
        self.setState({ showDeleteSubscriberModal: true, deleteSubscriberId: value });
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllSubscribers = () => {
        const { token } = this.props;
        const { page, limit, searchSubscriber, startDate, endDate } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllSubscribers(page, limit, token, searchSubscriber, startDate, endDate)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allSubscribers: res.data, allSubscribersCount: res.subscriberCount
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errType: 'error', errMsg: true, errMessage: 'Something went wrong',
                    loader: false
                });
            });
    }

    _deleteSubscriber = () => {
        const { token } = this.props;
        const { deleteSubscriberId } = this.state;
        let _this = this;

        _this.setState({ loader: true })
        ApiUtils.deleteSubscriber(token, deleteSubscriberId)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        deleteSubscriberId: '', errMsg: true, errMessage: res.message, errType: 'Success'
                    });
                    _this._closeDeleteSubscriberModal();
                    _this._getAllSubscribers();
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({
                    errType: 'error', errMsg: true,
                    errMessage: 'Something went wrong', loader: false
                });
            });
    }

    _searchSubscriber = () => {
        this._getAllSubscribers();
    }

    _handleSubscribePagination = (page) => {
        this.setState({ page }, () => {
            this._getAllSubscribers();
        });
    }

    _changeSearch = (field, e) => {
        this.setState({ searchSubscriber: field.target.value })
    }

    _closeDeleteSubscriberModal = () => {
        this.setState({ showDeleteSubscriberModal: false });
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
            startDate: moment(date[0]).endOf('day').toISOString(),
            endDate: moment(date[1]).endOf('day').toISOString()
        })
    }

    _resetFilters = () => {
        this.setState({
            searchSubscriber: '', startDate: '', endDate: '', rangeDate: []
        }, () => {
            this._getAllSubscribers();
        })
    }

    render() {
        const { allSubscribers, errType, errMsg, loader, page, allSubscribersCount,
            searchSubscriber, rangeDate, showDeleteSubscriberModal } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {subscriberTableinfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Input
                                        placeholder="Search subscribers"
                                        style={{ "width": "200px" }}
                                        onChange={this._changeSearch.bind(this)}
                                        value={searchSubscriber}
                                    />
                                    <RangePicker
                                        value={rangeDate}
                                        disabledTime={this.disabledRangeTime}
                                        onChange={this._changeDate}
                                        format="YYYY-MM-DD"
                                        style={{ marginLeft: '15px' }}
                                    />
                                    <Button className="search-btn" type="primary" onClick={this._searchSubscriber}>Search</Button>
                                    <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>
                                </div>
                                {loader && <span className="loader-class">
                                    <Spin />
                                </span>}
                                <TableWrapper
                                    style={{ marginTop: '20px' }}
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allSubscribers}
                                    className="isoCustomizedTable"
                                />
                                {allSubscribersCount > 0 ? <Pagination
                                    style={{ marginTop: '15px' }}
                                    className="ant-users-pagination"
                                    onChange={this._handleSubscribePagination.bind(this)}
                                    pageSize={50}
                                    current={page}
                                    total={allSubscribersCount}
                                /> : ''}
                                {showDeleteSubscriberModal &&
                                    <Modal
                                        title="Delete Subscriber"
                                        onCancel={this._closeDeleteSubscriberModal}
                                        visible={showDeleteSubscriberModal}
                                        footer={[
                                            <Button onClick={this._closeDeleteSubscriberModal}>No</Button>,
                                            <Button onClick={this._deleteSubscriber}>Yes</Button>,
                                        ]}
                                    >
                                        Are you sure you want to delete this subscriber ?
                                    </Modal>
                                }
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
    }))(Subscribers);

export { Subscribers, subscriberTableinfos };

