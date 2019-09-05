import React, { Component } from 'react';
import { Input, Pagination, notification } from 'antd';
import { pendingOrderTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const Search = Input.Search;
const { logout } = authAction;

class PendingOrders extends Component {
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
        this._getAllPendingOrders();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllPendingOrders = () => {
        const { token, user_id } = this.props;
        const { searchOrder, page, limit, sorterCol, sortOrder } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllPendingOrders(page, limit, token, searchOrder, user_id, sorterCol, sortOrder)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allOrders: res.data, allOrderCount: res.pendingDataCount });
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

    _searchOrder = (val) => {
        this.setState({ searchOrder: val, page: 1 }, () => {
            this._getAllPendingOrders();
        });
    }

    _handleOrderPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllPendingOrders();
        })
    }

    _handlePendingOrderChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getAllPendingOrders();
        })
    }

    _changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this._getAllPendingOrders();
        });
    }

    render() {
        const { allOrders, allOrderCount, errType, errMsg, page, loader, limit } = this.state;
        let pageSizeOptions = ['20', '30', '40', '50']

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    {pendingOrderTableInfos.map(tableInfo => (
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
                                    pageSize={limit}
                                    current={page}
                                    total={allOrderCount}
                                    showSizeChanger
                                    onShowSizeChange={this._changePaginationSize}
                                    pageSizeOptions={pageSizeOptions}
                                /> : ''
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
    }), { logout })(PendingOrders);

export { PendingOrders, pendingOrderTableInfos };
