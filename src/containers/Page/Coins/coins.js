import React, { Component } from 'react';
import { Input, Tabs, Pagination } from 'antd';
import { coinTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";

const Search = Input.Search;
const TabPane = Tabs.TabPane;

class Coins extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allCoins: [],
            allCoinCount: 0,
            searchCoin: ''
        }
    }

    componentDidMount = () => {
        //  this._getAllCoins();
    }

    _getAllCoins = () => {
        const { isLoggedIn } = this.props;

        ApiUtils.getAllCount(isLoggedIn)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status === "SUCCESS") {
                    const { allCoins, allReferralCount } = res.data;
                    this.setState({ allCoins, allReferralCount });
                } else {
                    this.setState({ errMsg: true, message: res.message });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    _searchCoin = (val) => {
        this.setState({ searchCoin: val }, () => {
            //this._getAllCoins(0);
        });
    }

    _handleCoinPagination = (page) => {
        //this._getAllCoins(page - 1);
    }

    render() {
        const { allCoins, allCoinCount } = this.state;

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {coinTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    {/* <Button type="primary" style={{ "marginBottom": "15px", "float": "left" }} onClick={this._showAddUserModal}>Add Coin</Button> */}
                                    {/* <AddUserModal
                                            showAddUserModal={showAddUserModal}
                                            closeAddModal={this._closeAddUserModal}
                                            getAllUsers={this._getAllUsers.bind(this, 0)}
                                        /> */}
                                    <Search
                                        placeholder="Search coins"
                                        onSearch={(value) => this._searchCoin(value)}
                                        style={{ "float": "right", "width": "250px" }}
                                        enterButton
                                    />
                                </div>
                                <div>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allCoins}
                                        className="isoCustomizedTable"
                                    />
                                    <Pagination
                                        className="ant-users-pagination"
                                        onChange={this._handleCoinPagination.bind(this)}
                                        pageSize={5}
                                        defaultCurrent={1}
                                        total={allCoinCount}
                                    />
                                </div>
                            </TabPane>
                        ))}
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default Coins;
