import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification } from 'antd';
import { sellOrderTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';

const Search = Input.Search;
const TabPane = Tabs.TabPane;

class SellOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOrders: [],
            allOrderCount: 0,
            searchOrder: '',
            limit: 50,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            page: 0
        }
    }

    componentDidMount = () => {
        this._getAllOrders(0);
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllOrders = () => {
        const { token } = this.props;
        const { searchOrder, page, limit } = this.state;
        let _this = this;
        let path = this.props.location.pathname.split('/');
        let user_id = path[path.length - 1]

        ApiUtils.getAllSellOrders(page, limit, token, searchOrder, user_id)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allOrders: res.data, allOrderCount: res.transactionCount, searchOrder: ''
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, searchOrder: '' });
                }
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    searchOrder: '', errType: 'error',
                });
            });
    }

    _searchOrder = (val) => {
        this.setState({ searchOrder: val }, () => {
            this._getAllOrders(0);
        });
    }

    _handleOrderPagination = (page) => {
        this.setState({ page: page - 1 }, () => {
            this._getAllOrders(page - 1);
        })
    }

    render() {
        const { allOrders, allOrderCount, errType, errMsg, page } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {sellOrderTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Search
                                        placeholder="Search Orders"
                                        onSearch={(value) => this._searchOrder(value)}
                                        style={{ "float": "right", "width": "250px" }}
                                        enterButton
                                    />
                                </div>
                                <TableWrapper
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allOrders}
                                    className="isoCustomizedTable"
                                />
                                <Pagination
                                    style={{ marginTop: '15px' }}
                                    className="ant-users-pagination"
                                    onChange={this._handleOrderPagination.bind(this)}
                                    pageSize={50}
                                    current={page}
                                    total={allOrderCount}
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
    }))(SellOrders);

export { SellOrders, sellOrderTableInfos };
