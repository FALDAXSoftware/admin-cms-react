import React, { Component } from 'react';
import { Input, Tabs, Pagination, Button, Modal, notification } from 'antd';
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
            limit: 5,
            coinDetails: [],
            deleteCoinId: '',
            errMessage: '',
            errMsg: false,
            errType: 'Success'
        }
        Coins.view = Coins.view.bind(this);
        Coins.edit = Coins.edit.bind(this);
        Coins.deleteCoin = Coins.deleteCoin.bind(this);
        Coins.changeStatus = Coins.changeStatus.bind(this);
    }

    static view(value, coin_name, coin_code, limit, wallet_address, created_at, is_active) {
        let coinDetails = {
            value, coin_name, coin_code, limit, wallet_address, created_at, is_active
        }
        this.setState({ coinDetails, showViewCoinModal: true });
    }

    static edit(value, coin_name, coin_code, limit, wallet_address, created_at, is_active) {
        let coinDetails = {
            value, coin_name, coin_code, limit, wallet_address, created_at, is_active
        }
        this.setState({ coinDetails, showEditCoinModal: true });
    }

    static changeStatus(value, coin_name, coin_code, limit, wallet_address, created_at, is_active) {
        const { token } = this.props;

        let formData = {
            coin_id: value,
            coin_name: coin_name,
            limit: limit,
            wallet_address: wallet_address,
            is_active: !is_active
        };

        ApiUtils.editCoin(token, formData)
            .then((res) => res.json())
            .then((res) => {
                this._getAllCoins(0);
            })
            .catch(error => {
                console.error(error);
                this.setState({ errMsg: true, errMessage: 'Something went wrong!!', errType: 'error' });
            });
    }

    static deleteCoin(value) {
        this.setState({ showDeleteCoinModal: true, deleteCoinId: value });
    }

    componentDidMount = () => {
        this._getAllCoins(0);
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
                    _this.setState({ allCoins: res.data, allCoinCount: res.CoinsCount, searchCoin: '' });
                } else {
                    _this.setState({ errMsg: true, message: res.message, searchCoin: '' });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    _searchCoin = (val) => {
        this.setState({ searchCoin: val }, () => {
            this._getAllCoins(0);
        });
    }

    _handleCoinPagination = (page) => {
        this._getAllCoins(page - 1);
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

        ApiUtils.deleteCoin(deleteCoinId, token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        deleteCoinId: '', showDeleteCoinModal: false,
                        errMessage: 'Coin deleted successfully', errMsg: true
                    });
                    _this._getAllCoins(0);
                } else {
                    _this.setState({ deleteCoinId: '', showDeleteCoinModal: false });
                }
            })
            .catch(err => {
                console.log('error occured', err);
                _this.setState({ deleteCoinId: '', showDeleteCoinModal: false });
            });
    }

    _closeDeleteCoinModal = () => {
        this.setState({ showDeleteCoinModal: false });
    }

    render() {
        const { allCoins, allCoinCount, showAddCoinModal, coinDetails, errType,
            showViewCoinModal, showEditCoinModal, showDeleteCoinModal, errMsg
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
                                        getAllCoins={this._getAllCoins.bind(this, 0)}
                                    />
                                    <Search
                                        placeholder="Search coins"
                                        onSearch={(value) => this._searchCoin(value)}
                                        style={{ "float": "right", "width": "250px" }}
                                        enterButton
                                    />
                                </div>
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
                                        getAllCoins={this._getAllCoins.bind(this, 0)}
                                    />
                                    {
                                        showDeleteCoinModal &&
                                        <Modal
                                            title="Delete Coin"
                                            visible={showDeleteCoinModal}
                                            onCancel={this._closeDeleteCoinModal}
                                            onOk={this._deleteCoin}
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

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(Coins);

export { Coins, coinTableInfos };
