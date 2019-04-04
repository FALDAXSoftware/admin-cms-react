import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification, Spin } from 'antd';
import { sellOrderTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';

const Search = Input.Search;

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
            page: 1,
            loader: false
        }
    }

    componentDidMount = () => {
        this._getAllOrders();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllOrders = () => {
        const { token, user_id } = this.props;
        const { searchOrder, page, limit, sorterCol, sortOrder } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllSellOrders(page, limit, token, searchOrder, user_id, sorterCol, sortOrder)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allOrders: res.data, allOrderCount: res.sellBookCount, loader: false
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, loader: false });
                }
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    searchOrder: '', errType: 'error', loader: false
                });
            });
    }

    _searchOrder = (val) => {
        this.setState({ searchOrder: val }, () => {
            this._getAllOrders();
        });
    }

    _handleOrderPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllOrders();
        })
    }

    _handleSellOrderChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getAllOrders();
        })
    }

    render() {
        const { allOrders, allOrderCount, errType, errMsg, page, loader } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    {sellOrderTableInfos.map(tableInfo => (
                        <div>
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
                                onChange={this._handleSellOrderChange}
                            />
                            {loader && <FaldaxLoader />}
                            {allOrderCount > 0 ?
                                <Pagination
                                    style={{ marginTop: '15px' }}
                                    className="ant-users-pagination"
                                    onChange={this._handleOrderPagination.bind(this)}
                                    pageSize={50}
                                    current={page}
                                    total={allOrderCount}
                                />
                                : ''
                            }
                        </div>
                    ))}
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
