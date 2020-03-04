import React, { Component } from 'react';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import { Tabs } from 'antd';
import { TabPane } from '../../../components/uielements/tabs';
import { withRouter } from "react-router-dom";
import WalletFaldaxDashboard from './faldax/walletFaldaxDashboard';
import FALDAXWallet from './faldax main/wallet';
// import WalletWarmDashboard from './warm/walletWarmDashboard';
// import WalletCustodialDashboard from './custodial/walletCustodialDashboard';
import { isAllowed } from '../../../helpers/accessControl';
// import { BackButton } from '../../Shared/backBttton';
// import WalletHotSendDashboard from "./hot-send/walletDashboard"
import WalletHotReceiveDashboard from "./hot-receive/walletDashboard"
import { BreadcrumbComponent } from '../../Shared/breadcrumb';
class WalletDashboard extends Component {
    state = {}
    render() {
        return (
            <LayoutWrapper>
                {/* <BackButton {...this.props}/> */}
                <BreadcrumbComponent {...this.props} />
                <Tabs className="full-width">
                    {isAllowed("admin_wallet_fees_details") && <TabPane tab="FALDAX Fee Wallet" key="1"><WalletFaldaxDashboard /></TabPane>}
                    <TabPane tab="FALDAX Wallet" key="6"><FALDAXWallet/></TabPane>
                    {/* {isAllowed("admin_warm_wallet_data") &&<TabPane tab="Warm Wallet" key="2"><WalletWarmDashboard/></TabPane>}
                    {isAllowed("admin_cold_wallet_data") &&<TabPane tab="Custodial Wallet" key="3"><WalletCustodialDashboard/></TabPane>}
                    {isAllowed("admin_hotsend_wallet_data") &&<TabPane tab="Hot Send Wallet" key="4"><WalletHotSendDashboard/></TabPane>} */}
                    {isAllowed("admin_hotreceive_wallet_data") && <TabPane tab="Main Wallet" key="5"><WalletHotReceiveDashboard /></TabPane>}
                </Tabs>
            </LayoutWrapper>
        );
    }
}

export default withRouter(WalletDashboard);