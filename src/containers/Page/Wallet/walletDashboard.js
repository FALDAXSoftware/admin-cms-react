import React, { Component } from 'react';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import { Tabs } from 'antd';
import { TabPane } from '../../../components/uielements/tabs';
import {  withRouter} from "react-router-dom";
import WalletFaldaxDashboard from './faldax/walletFaldaxDashboard';
import WalletWarmDashboard from './warm/walletWarmDashboard';
import WalletCustodialDashboard from './custodial/walletCustodialDashboard';
class WalletDashboard extends Component {
    state = {  }    
    render() { 
        return (
        <LayoutWrapper>
                <Tabs className="full-width">
                    <TabPane tab="Faldax Wallet" key="1"><WalletFaldaxDashboard/></TabPane>
                    <TabPane tab="Warm Wallet" key="2"><WalletWarmDashboard/></TabPane>
                    <TabPane tab="Custodial Wallet" key="3"><WalletCustodialDashboard/></TabPane>
                </Tabs>
        </LayoutWrapper>
        );
    }
}
 
export default withRouter(WalletDashboard);