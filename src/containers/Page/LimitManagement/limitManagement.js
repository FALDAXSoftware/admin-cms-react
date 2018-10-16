import React, { Component } from 'react';
import { Tabs, Icon } from 'antd';
import { limitTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import EditLimitModal from './editLimitModal';

const TabPane = Tabs.TabPane;
const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
var self;

class LimitManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allLimitData: [],
            limitDetails: [],
            showEditLimitModal: false
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

        ApiUtils.getAllLimit(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ allLimitData: res.data });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch(() => {
                _this.setState({ errType: 'error', errMsg: true, errMessage: 'Something went wrong' });
            });
    }

    _closeEditLimitModal = () => {
        this.setState({ showEditLimitModal: false })
    }

    render() {
        const { allLimitData, errType, errMsg, limitDetails, showEditLimitModal } = this.state;

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
    }))(LimitManagement);

export { LimitManagement, limitTableInfos };
