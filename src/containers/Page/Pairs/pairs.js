import React, { Component } from 'react';
import { Tabs, notification, Pagination, Button, Input } from 'antd';
import { pairsTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import AddPairModal from './addPairModal';
import EditPairModal from './editPairModal';
import FaldaxLoader from '../faldaxLoader';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
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
                self._getAllPairs();
                self.setState({ errType: 'Success', errMsg: true, errMessage: message })
            })
            .catch(() => {
                self.setState({ errType: 'error', errMsg: true, errMessage: 'Something went wrong' });
                self._resetEditForm();
            });
    }

    componentDidMount = () => {
        this._getAllPairs();
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
        const { page, limit, searchPair } = this.state;
        let _this = this;

        _this.setState({ loader: true })
        ApiUtils.getAllPairs(page, limit, token, searchPair)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    const { pairsCount, allCoins } = res;
                    _this.setState({ allPairs: res.data, pairsCount, allCoins });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({
                    errType: 'error', errMsg: true,
                    errMessage: 'Something went wrong', loader: false
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

    _searchPair = (val) => {
        this.setState({ searchPair: val }, () => {
            this._getAllPairs();
        });
    }

    render() {
        const { allPairs, errType, errMsg, page, pairsCount, loader, allCoins,
            showAddPairsModal, pairDetails, showEditPairModal } = this.state;

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
                                    <Button type="primary" style={{ "marginBottom": "15px", "float": "left" }} onClick={this._showAddPairModal}>Add Pair</Button>
                                    {showAddPairsModal &&
                                        <AddPairModal
                                            allCoins={allCoins}
                                            showAddPairsModal={showAddPairsModal}
                                            closeAddModal={this._closeAddFeesModal}
                                            getAllPairs={this._getAllPairs}
                                        />
                                    }
                                    <Search
                                        placeholder="Search pairs"
                                        onSearch={(value) => this._searchPair(value)}
                                        style={{ "float": "right", "width": "250px" }}
                                        enterButton
                                    />
                                </div>
                                {loader && <FaldaxLoader />}
                                <div>
                                    <EditPairModal
                                        allCoins={allCoins}
                                        fields={pairDetails}
                                        showEditPairModal={showEditPairModal}
                                        closeEditModal={this._closeEditPairModal}
                                        getAllPairs={this._getAllPairs}
                                    />
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allPairs}
                                        className="isoCustomizedTable"
                                    />
                                    <Pagination
                                        style={{ marginTop: '15px' }}
                                        className="ant-users-pagination"
                                        onChange={this._handleFeesPagination.bind(this)}
                                        pageSize={50}
                                        current={page}
                                        total={pairsCount}
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
    }))(Pairs);

export { Pairs, pairsTableInfos };
