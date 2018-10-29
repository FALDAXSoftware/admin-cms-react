import React, { Component } from 'react';
import { Input, Tabs, Pagination, Button, Modal, notification, Spin } from 'antd';
import { coinTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import ViewCoinModal from './viewCoinModal';
import AddCoinModal from './addCoinModal';
import EditCoinModal from './editCoinModal';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
var self;

class Coins extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allCoins: [],
            allCoinCount: 0,
            showAddCoinModal: false,
            showEditCoinModal: false,
            showViewCoinModal: false,
            showDeleteCoinModal: false,
            searchCoin: '',
            limit: 50,
            coinDetails: [],
            deleteCoinId: '',
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            page: 1,
            loader: false
        }
        self = this;
        Coins.view = Coins.view.bind(this);
        Coins.edit = Coins.edit.bind(this);
        Coins.deleteCoin = Coins.deleteCoin.bind(this);
        Coins.changeStatus = Coins.changeStatus.bind(this);
    }

    static view(value, coin_name, coin_code, limit, description, wallet_address, created_at, is_active) {
        let coinDetails = {
            value, coin_name, coin_code, limit, description, wallet_address, created_at, is_active
        }
        self.setState({ coinDetails, showViewCoinModal: true, page: 1 });
    }

    static edit(value, coin_name, coin_code, limit, description, wallet_address, created_at, is_active) {
        let coinDetails = {
            value, coin_name, coin_code, limit, description, wallet_address, created_at, is_active
        }
        self.setState({ coinDetails, showEditCoinModal: true, page: 1 });
    }

    static changeStatus(value, coin_name, coin_code, limit, description, wallet_address, created_at, is_active) {
        const { token } = this.props;

        let formData = {
            coin_id: value,
            coin_name: coin_name,
            limit: limit,
            wallet_address: wallet_address,
            is_active: !is_active
        };

        self.setState({ loader: true })
        ApiUtils.editCoin(token, formData)
            .then((res) => res.json())
            .then((res) => {
                self._getAllCoins(1);
                self.setState({
                    page: 1, errMsg: true, errMessage: res.message,
                    errType: 'Success', loader: false
                })
            })
            .catch(() => {
                self.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    static deleteCoin(value) {
        self.setState({ showDeleteCoinModal: true, deleteCoinId: value });
    }

    componentDidMount = () => {
        this._getAllCoins(1);
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllCoins = (page) => {
        const { token } = this.props;
        const { limit, searchCoin } = this.state;
        let _this = this;

        ApiUtils.getAllCoins(page, limit, token, searchCoin)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allCoins: res.data, allCoinCount: res.CoinsCount, searchCoin: ''
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, searchCoin: '' });
                }
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    searchCoin: '', errType: 'error',
                });
            });
    }

    _searchCoin = (val) => {
        this.setState({ searchCoin: val }, () => {
            this._getAllCoins(1);
        });
    }

    _handleCoinPagination = (page) => {
        this._getAllCoins(page - 1);
        this.setState({ page })
    }

    _showAddCoinModal = () => {
        this.setState({ showAddCoinModal: true });
    }

    _closeViewCoinModal = () => {
        this.setState({ showViewCoinModal: false });
    }

    _closeEditCoinModal = () => {
        this.setState({ showEditCoinModal: false });
    }

    _closeAddCoinModal = () => {
        this.setState({ showAddCoinModal: false });
    }

    _deleteCoin = () => {
        const { token } = this.props;
        const { deleteCoinId } = this.state;
        let _this = this;

        this.setState({ loader: true })
        ApiUtils.deleteCoin(deleteCoinId, token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        deleteCoinId: '', showDeleteCoinModal: false,
                        errMessage: res.message, errMsg: true
                    });
                    _this._getAllCoins(1);
                } else {
                    _this.setState({ deleteCoinId: '', showDeleteCoinModal: false });
                }
                this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({ deleteCoinId: '', showDeleteCoinModal: false, loader: false });
            });
    }

    _closeDeleteCoinModal = () => {
        this.setState({ showDeleteCoinModal: false });
    }

    render() {
        const { allCoins, allCoinCount, showAddCoinModal, coinDetails, errType, loader,
            showViewCoinModal, showEditCoinModal, showDeleteCoinModal, errMsg, page
        } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">

                        {coinTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Button type="primary" style={{ "marginBottom": "15px", "float": "left" }} onClick={this._showAddCoinModal}>Add Coin</Button>
                                    <AddCoinModal
                                        showAddCoinModal={showAddCoinModal}
                                        closeAddModal={this._closeAddCoinModal}
                                        getAllCoins={this._getAllCoins.bind(this, 1)}
                                    />
                                    <Search
                                        placeholder="Search coins"
                                        onSearch={(value) => this._searchCoin(value)}
                                        style={{ "float": "right", "width": "250px" }}
                                        enterButton
                                    />
                                </div>
                                {loader && <span className="loader-class">
                                    <Spin />
                                </span>}
                                <div>
                                    <ViewCoinModal
                                        coinDetails={coinDetails}
                                        showViewCoinModal={showViewCoinModal}
                                        closeViewCoinModal={this._closeViewCoinModal}
                                    />
                                    <EditCoinModal
                                        fields={coinDetails}
                                        showEditCoinModal={showEditCoinModal}
                                        closeEditCoinModal={this._closeEditCoinModal}
                                        getAllCoins={this._getAllCoins.bind(this, 1)}
                                    />
                                    {
                                        showDeleteCoinModal &&
                                        <Modal
                                            title="Delete Coin"
                                            visible={showDeleteCoinModal}
                                            onCancel={this._closeDeleteCoinModal}
                                            footer={[
                                                <Button onClick={this._closeDeleteCoinModal}>No</Button>,
                                                <Button onClick={this._deleteCoin}>Yes</Button>,
                                            ]}
                                        >
                                            Are you sure you want to delete this coin ?
                                    </Modal>
                                    }
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allCoins}
                                        className="isoCustomizedTable"
                                    />
                                    <Pagination
                                        style={{ marginTop: '15px' }}
                                        className="ant-users-pagination"
                                        onChange={this._handleCoinPagination.bind(this)}
                                        pageSize={50}
                                        current={page}
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

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(Coins);

export { Coins, coinTableInfos };
