import React, { Component } from 'react';
import LayoutWrapper from '../../../../components/utility/layoutWrapper';
import { Tabs } from 'antd';
import { TabPane } from '../../../../components/uielements/tabs';
import {  withRouter} from "react-router-dom";
// import { BackButton } from '../../../Shared/backBttton';
import WalletDetailsComponent from './walletFaldaxFeeDetails';
import WalletJstDetailsComponent from './walletJstDetails';
import WalletForfeitDetailsComponent from './walletForfeitDetails';
import WalletFaldaxAccountDetailsComponent from './walletFaldaxAccountDetails';
import WalletTradeDetailsComponent from './walletTradeDetails'
import { BreadcrumbComponent } from '../../../Shared/breadcrumb';
class Wallets extends Component {
    state = {  
        isCoinJstSupported:this.props.match.params.coin!="SUSU"?true:false
    }
    
    render() { 
        return (
        <LayoutWrapper>
                {/* <BackButton {...this.props}/>    */}
                <BreadcrumbComponent {...this.props}/>
                <Tabs className="full-width" defaultActiveKey="5">
                    <TabPane tab="FALDAX Fee-Wallet" key="1"><WalletDetailsComponent/></TabPane>
                    {this.state.isCoinJstSupported &&<TabPane tab="Crypto Only" key="2"><WalletJstDetailsComponent/></TabPane>}
                    <TabPane tab="Direct Deposit" key="3"><WalletFaldaxAccountDetailsComponent/></TabPane>
                    <TabPane tab="Forfeit Fund" key="4"><WalletForfeitDetailsComponent/></TabPane>
                    <TabPane tab="Trade" key="5"><WalletTradeDetailsComponent/></TabPane>
                </Tabs>
        </LayoutWrapper>
        );
    }
}
 
export default withRouter(Wallets);