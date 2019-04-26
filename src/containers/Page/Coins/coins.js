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
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
const { logout } = authAction;
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

    static view(value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon) {
        let coinDetails = {
            value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon
        }
        self.setState({ coinDetails, showViewCoinModal: true, page: 1 });
    }

    static edit(value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon) {
        let coinDetails = {
            value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon
        }
        self.setState({ coinDetails, showEditCoinModal: true, page: 1 });
    }

    static changeStatus(value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon) {
        const { token } = this.props;

        let formData = {
            coin_id: value,
            is_active: !is_active
        };

        self.setState({ loader: true })
        let message = is_active ? 'Coin has been inactivated successfully.' : 'Coin has been activated successfully.'
        ApiUtils.editCoin(token, formData)
            .then((res) => res.json())
            .then((res) => {
                if (res.status == 200) {
                    self.setState({
                        page: 1, errMsg: true, errMessage: message, errType: 'Success', loader: false
                    })
                    self._getAllCoins();
                } else if (res.status == 403) {
                    self.setState({ errMsg: true, errMessage: res.err, errType: 'error', loader: false }, () => {
                        self.props.logout();
                    });
                } else {
                    self.setState({
                        errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                    });
                }
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
        this._getAllCoins();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllCoins = () => {
        const { token } = this.props;
        const { limit, searchCoin, page, sorterCol, sortOrder } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllCoins(page, limit, token, searchCoin, sorterCol, sortOrder)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allCoins: res.data, allCoinCount: res.CoinsCount });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    _searchCoin = (val) => {
        this.setState({ searchCoin: val, page: 1 }, () => {
            this._getAllCoins();
        });
    }

    _handleCoinPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllCoins();
        })
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
                        deleteCoinId: '', showDeleteCoinModal: false, errMessage: res.message, errMsg: true
                    });
                    _this._getAllCoins();
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

    handleTableChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getAllCoins();
        })
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
                                {loader && <FaldaxLoader />}
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
                                        onChange={this.handleTableChange}
                                        className="isoCustomizedTable"
                                    />
                                    {allCoinCount > 0 ?
                                        <Pagination
                                            style={{ marginTop: '15px' }}
                                            className="ant-users-pagination"
                                            onChange={this._handleCoinPagination.bind(this)}
                                            pageSize={50}
                                            current={page}
                                            total={allCoinCount}
                                        /> : ''}
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
    }), { logout })(Coins);

export { Coins, coinTableInfos };
