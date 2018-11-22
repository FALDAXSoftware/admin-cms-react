import React, { Component } from 'react';
import { Tabs, notification, Spin, Pagination, Input } from 'antd';
import { subscriberTableinfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';

const TabPane = Tabs.TabPane;
const Search = Input.Search;

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
            searchSubscriber: ''
        }
    }

    componentDidMount = () => {
        this._getAllSubscribers();
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
        const { page, limit, searchSubscriber } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllSubscribers(page, limit, token, searchSubscriber)
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
            .catch(err => {
                _this.setState({
                    errType: 'error', errMsg: true, errMessage: 'Something went wrong',
                    loader: false
                });
            });
    }

    _searchSubscriber = (val) => {
        this.setState({ searchSubscriber: val, page: 1 }, () => {
            this._getAllSubscribers();
        });
    }

    _handleSubscribePagination = (page) => {
        this.setState({ page }, () => {
            this._getAllSubscribers();
        });
    }

    render() {
        const { allSubscribers, errType, errMsg, loader, page, allSubscribersCount } = this.state;

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
                                    <Search
                                        placeholder="Search subscribers"
                                        onSearch={(value) => this._searchSubscriber(value)}
                                        style={{ "float": "right", "width": "250px" }}
                                        enterButton
                                    />
                                </div>
                                {loader && <span className="loader-class">
                                    <Spin />
                                </span>}
                                <TableWrapper
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allSubscribers}
                                    className="isoCustomizedTable"
                                />
                                <Pagination
                                    style={{ marginTop: '15px' }}
                                    className="ant-users-pagination"
                                    onChange={this._handleSubscribePagination.bind(this)}
                                    pageSize={50}
                                    current={page}
                                    total={allSubscribersCount}
                                />
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

