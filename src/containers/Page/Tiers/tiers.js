import React, { Component } from 'react';
import { Tabs, notification } from 'antd';
import { tierTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import EditTierModal from './editTierModal';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const TabPane = Tabs.TabPane;
const { logout } = authAction;
var self;

class Tiers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allTiers: [],
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            tierDetails: [],
            showEditPairModal: false,
            sorterCol: '',
            sortOrder: ''
        }
        self = this;
        Tiers.editPair = Tiers.editPair.bind(this);
    }

    static editPair(value, name, maker_fee, taker_fee, created_at, is_active) {
        let tierDetails = {
            value, name, maker_fee, taker_fee, created_at, is_active
        }
        self.setState({ tierDetails, showEditPairModal: true });
    }

    componentDidMount = () => {
        this._getAllTiers();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllTiers = () => {
        const { token } = this.props;
        const { sorterCol, sortOrder } = this.state;
        let _this = this;

        _this.setState({ loader: true })
        ApiUtils.getAllTiers(token, sorterCol, sortOrder)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allTiers: res.data });
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

    _closeEditPairModal = () => {
        this.setState({ showEditPairModal: false })
    }

    render() {
        const { allTiers, errType, errMsg, loader, tierDetails, showEditPairModal } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {tierTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                {loader && <FaldaxLoader />}
                                {showEditPairModal && <EditTierModal
                                    fields={tierDetails}
                                    showEditPairModal={showEditPairModal}
                                    closeEditModal={this._closeEditPairModal}
                                    getAllTiers={this._getAllTiers}
                                />}
                                <TableWrapper
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allTiers}
                                    className="isoCustomizedTable"
                                    onChange={this._handlePairsChange}
                                />
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
    }), { logout })(Tiers);

export { Tiers, tierTableInfos };
