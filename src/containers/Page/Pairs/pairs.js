import React, { Component } from 'react';
import { Tabs, notification, Icon, Spin, Pagination, Button } from 'antd';
import { pairsTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import AddPairModal from './addPairModal';
import EditPairModal from './editPairModal';

const TabPane = Tabs.TabPane;
const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
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
            page: 0,
            limit: 50,
            allCoins: [],
            showAddPairsModal: false,
            showEditPairModal: false
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
                self.setState({ errType: 'success', errMsg: true, errMessage: res.message, page: 0 })
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
        const { page, limit } = this.state;
        let _this = this;

        ApiUtils.getAllPairs(page, limit, token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    const { pairsCount, allCoins } = res;
                    _this.setState({ allPairs: res.data, pairsCount, allCoins });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch(() => {
                _this.setState({ errType: 'error', errMsg: true, errMessage: 'Something went wrong' });
            });
    }

    _handleFeesPagination = (page) => {
        this.setState({ page: page - 1 }, () => {
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
                                    <AddPairModal
                                        allCoins={allCoins}
                                        showAddPairsModal={showAddPairsModal}
                                        closeAddModal={this._closeAddFeesModal}
                                        getAllPairs={this._getAllPairs}
                                    />
                                </div>
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

                                {loader && <Spin indicator={loaderIcon} />}
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
