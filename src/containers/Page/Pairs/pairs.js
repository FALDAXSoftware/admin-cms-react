import React, { Component } from 'react';
import { Tabs, notification, Pagination, Button, Input, Form, Row, Select } from 'antd';
import { pairsTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import AddPairModal from './addPairModal';
import EditPairModal from './editPairModal';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import ColWithPadding from '../common.style';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
const { logout } = authAction;
const Option = Select.Option;
var self;

class Pairs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allPairs: [],
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            pairDetails: [],
            pairsCount: 0,
            page: 1,
            limit: 50,
            allCoins: [],
            showAddPairsModal: false,
            showEditPairModal: false,
            searchPair: '',
            selectedAsset: '',
            sorterCol: '',
            sortOrder: ''
        }
        self = this;
        Pairs.editPair = Pairs.editPair.bind(this);
        Pairs.pairStatus = Pairs.pairStatus.bind(this);
    }

    static editPair(value, name, maker_fee, taker_fee, created_at, is_active) {
        let pairDetails = {
            value, name, maker_fee, taker_fee, created_at, is_active
        }
        self.setState({ pairDetails, showEditPairModal: true });
    }

    static pairStatus(value, name, maker_fee, taker_fee, created_at, is_active) {
        const { token } = this.props;

        let message = is_active ? 'Pair has been inactivated successfully.' : 'Pair has been activated successfully.'
        let formData = {
            id: value,
            name: name,
            maker_fee: maker_fee,
            taker_fee: taker_fee,
            is_active: !is_active
        };

        ApiUtils.updatePair(token, formData)
            .then((res) => res.json())
            .then((res) => {
                if (res.status == 200) {
                    self._getAllPairs();
                    self.setState({ errType: 'Success', errMsg: true, errMessage: message })
                } else if (res.status == 403) {
                    self.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        self.props.logout();
                    });
                } else {
                    self.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch(() => {
                self.setState({ errType: 'error', errMsg: true, errMessage: 'Something went wrong' });
                self._resetEditForm();
            });
    }

    componentDidMount = () => {
        this._getAllPairs();
        this._getAllAssets();
    }

    _getAllAssets = () => {
        const { token } = this.props;
        let _this = this;

        ApiUtils.getWalletCoins(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allAssets: res.data });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch((err) => {
                _this.setState({ loader: false })
            });
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllPairs = () => {
        const { token } = this.props;
        const { page, limit, searchPair, sorterCol, sortOrder, selectedAsset } = this.state;
        let _this = this;

        _this.setState({ loader: true })
        ApiUtils.getAllPairs(page, limit, token, searchPair, sorterCol, sortOrder, selectedAsset)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    const { pairsCount, allCoins } = res;
                    _this.setState({ allPairs: res.data, pairsCount, allCoins });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({
                    errType: 'error', errMsg: true, errMessage: 'Something went wrong', loader: false
                });
            });
    }

    _handleFeesPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllPairs();
        });
    }

    _showAddPairModal = () => {
        this.setState({ showAddPairsModal: true })
    }

    _closeAddFeesModal = () => {
        this.setState({ showAddPairsModal: false })
    }

    _closeEditPairModal = () => {
        this.setState({ showEditPairModal: false })
    }

    _searchPair = (e) => {
        e.preventDefault();
        this._getAllPairs();
    }

    _handlePairsChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getAllPairs();
        })
    }

    _changeAsset = (value) => {
        this.setState({ selectedAsset: value })
    }

    _resetFilters = () => {
        this.setState({ selectedAsset: '', searchPair: '' }, () => {
            this._getAllPairs();
        });
    }

    _changeSearch = (field, e) => {
        this.setState({ searchPair: field.target.value })
    }

    render() {
        const { allPairs, errType, errMsg, page, pairsCount, loader, allCoins, searchPair,
            showAddPairsModal, pairDetails, showEditPairModal, allAssets, selectedAsset } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {pairsTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Form onSubmit={this._searchPair}>
                                        <Row type="flex" justify="end">
                                            <ColWithPadding sm={5}>
                                                <Button type="primary" style={{ "marginBottom": "15px" }} onClick={this._showAddPairModal}>Add Pair</Button>
                                            </ColWithPadding>
                                            <ColWithPadding sm={3}>
                                                {showAddPairsModal &&
                                                    <AddPairModal
                                                        allCoins={allCoins}
                                                        showAddPairsModal={showAddPairsModal}
                                                        closeAddModal={this._closeAddFeesModal}
                                                        getAllPairs={this._getAllPairs}
                                                    />
                                                }
                                            </ColWithPadding>
                                            <ColWithPadding sm={4}>
                                                <Input
                                                    placeholder="Search pairs"
                                                    onChange={this._changeSearch.bind(this)}
                                                    style={{ "width": "100%" }}
                                                    value={searchPair}
                                                />
                                            </ColWithPadding>
                                            <ColWithPadding sm={5}>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    placeholder="Select a asset"
                                                    onChange={this._changeAsset}
                                                    value={selectedAsset}
                                                >
                                                    {allAssets && allAssets.map((asset, index) => <Option key={asset.coin} value={asset.id}>{asset.coin}</Option>)}
                                                </Select>
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                <Button htmlType="submit" className="search-btn" type="primary" >Search</Button>
                                            </ColWithPadding>
                                            <ColWithPadding xs={12} sm={3}>
                                                <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>
                                            </ColWithPadding>
                                        </Row>
                                    </Form>
                                </div>
                                {loader && <FaldaxLoader />}
                                <div>
                                    {showEditPairModal && <EditPairModal
                                        allCoins={allCoins}
                                        fields={pairDetails}
                                        showEditPairModal={showEditPairModal}
                                        closeEditModal={this._closeEditPairModal}
                                        getAllPairs={this._getAllPairs}
                                    />}
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allPairs}
                                        className="isoCustomizedTable"
                                        onChange={this._handlePairsChange}
                                    />
                                    {
                                        pairsCount > 0 ?
                                            <Pagination
                                                style={{ marginTop: '15px' }}
                                                className="ant-users-pagination"
                                                onChange={this._handleFeesPagination.bind(this)}
                                                pageSize={50}
                                                current={page}
                                                total={pairsCount}
                                            /> : ''
                                    }
                                </div>
                            </TabPane>
                        ))}
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper >
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(Pairs);

export { Pairs, pairsTableInfos };
