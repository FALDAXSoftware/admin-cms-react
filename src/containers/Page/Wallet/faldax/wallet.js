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
class Wallets extends Component {
    state = {  }    
    render() { 
        return (
        <LayoutWrapper>
                <BackButton {...this.props}/>   
                <Tabs className="full-width">
                    <TabPane tab="Faldax Fee-Wallet" key="1"><WalletDetailsComponent/></TabPane>
                    <TabPane tab="Crypto Only" key="2"><WalletJstDetailsComponent/></TabPane>
                    <TabPane tab="Faldax Account Activity" key="3"><WalletFaldaxAccountDetailsComponent/></TabPane>
                    <TabPane tab="Forfeit Fund" key="4"><WalletForfeitDetailsComponent/></TabPane>
                </Tabs>
        </LayoutWrapper>
        );
    }
}
 
export default withRouter(Wallets);