import React, { Component } from 'react';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import { Tabs } from 'antd';
import { TabPane } from '../../../components/uielements/tabs';
import {  withRouter} from "react-router-dom";
import { BackButton } from '../../Shared/backBttton';
import WalletDetailsComponent from './walletDetails';
import WalletJstDetailsComponent from './walletJstDetails';
class Wallets extends Component {
    state = {  }    
    render() { 
        return (
        <LayoutWrapper>
                <BackButton {...this.props}/>   
                <Tabs className="full-width">
                    <TabPane tab="Wallet" key="1"><WalletDetailsComponent/></TabPane>
                    <TabPane tab="JST" key="2"><WalletJstDetailsComponent/></TabPane>
                </Tabs>
        </LayoutWrapper>
        );
    }
}
 
export default withRouter(Wallets);