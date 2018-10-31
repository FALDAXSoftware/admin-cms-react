import React, { Component } from 'react';
import { Input, Tabs, Pagination, Spin } from 'antd';
import { transactionTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';

const Search = Input.Search;
const TabPane = Tabs.TabPane;

class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allTransactions: [],
            allTransactionCount: 0,
            searchTransaction: '',
            limit: 50,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            page: 0,
            loader: false
        }
    }

    componentDidMount = () => {
        this._getAllTransactions(0);
    }

    _getAllTransactions = () => {
        const { token } = this.props;
        const { searchTransaction, page, limit } = this.state;
        let _this = this;

        _this.setState({ loader: true })
        ApiUtils.getAllTransaction(page, limit, token, searchTransaction)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allTransactions: res.data, allTransactionCount: res.transactionCount, searchTransaction: ''
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, searchTransaction: '' });
                }
                _this.setState({ loader: false })
            })
            .catch(err => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    searchTransaction: '', errType: 'error', loader: false
                });
            });
    }

    _searchTransaction = (val) => {
        this.setState({ searchTransaction: val }, () => {
            this._getAllTransactions(0);
        });
    }

    _handleTransactionPagination = (page) => {
        this.setState({ page: page - 1 }, () => {
            this._getAllTransactions(page - 1);
        })
    }

    render() {
        const { allTransactions, allTransactionCount, errType, errMsg, page,
            loader
        } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {transactionTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Search
                                        placeholder="Search transactions"
                                        onSearch={(value) => this._searchTransaction(value)}
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
                                    dataSource={allTransactions}
                                    className="isoCustomizedTable"
                                />
                                <Pagination
                                    style={{ marginTop: '15px' }}
                                    className="ant-users-pagination"
                                    onChange={this._handleTransactionPagination.bind(this)}
                                    pageSize={50}
                                    current={page}
                                    total={allTransactionCount}
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
    }))(Transactions);

export { Transactions, transactionTableInfos };
