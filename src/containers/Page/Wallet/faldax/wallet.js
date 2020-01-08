import React, { Component } from 'react';
import LayoutWrapper from '../../../../components/utility/layoutWrapper';
import { Tabs } from 'antd';
import { TabPane } from '../../../../components/uielements/tabs';
import {  withRouter} from "react-router-dom";
import { BackButton } from '../../../Shared/backBttton';
import WalletDetailsComponent from './walletFaldaxFeeDetails';
import WalletJstDetailsComponent from './walletJstDetails';
import WalletForfeitDetailsComponent from './walletForfeitDetails';
import WalletFaldaxAccountDetailsComponent from './walletFaldaxAccountDetails';
import { BreadcrumbComponent } from '../../../Shared/breadcrumb';
class Wallets extends Component {
    state = {  }    
    render() { 
        console.log("enjoy with props",this.props)
        return (
        <LayoutWrapper>
                <BackButton {...this.props}/>   
                <BreadcrumbComponent {...this.props}/>
                <Tabs className="full-width">
                    <TabPane tab="FALDAX Fee-Wallet" key="1"><WalletDetailsComponent/></TabPane>
                    <TabPane tab="Crypto Only" key="2"><WalletJstDetailsComponent/></TabPane>
                    <TabPane tab="Direct Deposit" key="3"><WalletFaldaxAccountDetailsComponent/></TabPane>
                    <TabPane tab="Forfeit Fund" key="4"><WalletForfeitDetailsComponent/></TabPane>
                </Tabs>
        </LayoutWrapper>
        );
    }
}
 
export default withRouter(Wallets);