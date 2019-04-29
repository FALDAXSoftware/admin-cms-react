import React, { Component } from 'react';
import { Tabs } from 'antd';
import { limitTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import EditLimitModal from './editLimitModal';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;
const TabPane = Tabs.TabPane;
var self;

class LimitManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allLimitData: [],
            limitDetails: [],
            showEditLimitModal: false,
            loader: false
        }
        self = this;
        LimitManagement.editLimit = LimitManagement.editLimit.bind(this);
    }

    static editLimit(value, user, monthlyDepositCrypto, monthlyDepositFiat, monthlyWithdrawCrypto,
        monthlyWithdrawFiat, dailyDepositCrypto, dailyDepositFiat, dailyWithdrawCrypto,
        dailyWithdrawFiat, minWithdrawlCrypto, minWithdrawlFiat) {
        let limitDetails = {
            value, user, monthlyDepositCrypto, monthlyDepositFiat, monthlyWithdrawCrypto,
            monthlyWithdrawFiat, dailyDepositCrypto, dailyDepositFiat, dailyWithdrawCrypto,
            dailyWithdrawFiat, minWithdrawlCrypto, minWithdrawlFiat
        }
        self.setState({ limitDetails, showEditLimitModal: true });
    }

    componentDidMount = () => {
        this._getAllLimits();
    }

    _getAllLimits = () => {
        const { token } = this.props;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllLimit(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allLimitData: res.data });
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
                    errType: 'error', errMsg: true, errMessage: 'Something went wrong', loader: false
                });
            });
    }

    _closeEditLimitModal = () => {
        this.setState({ showEditLimitModal: false })
    }

    render() {
        const { allLimitData, errType, errMsg, limitDetails, showEditLimitModal, loader } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {limitTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div>
                                    <EditLimitModal
                                        fields={limitDetails}
                                        showEditLimitModal={showEditLimitModal}
                                        closeEditModal={this._closeEditLimitModal}
                                        getAllLimits={this._getAllLimits}
                                    />
                                    {loader && <FaldaxLoader />}
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allLimitData}
                                        className="isoCustomizedTable"
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
    }), { logout })(LimitManagement);

export { LimitManagement, limitTableInfos };
