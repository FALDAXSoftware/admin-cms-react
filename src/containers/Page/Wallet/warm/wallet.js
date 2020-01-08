import React, { Component } from 'react';
import LayoutWrapper from '../../../../components/utility/layoutWrapper';
import { Tabs } from 'antd';
import { TabPane } from '../../../../components/uielements/tabs';
import {  withRouter} from "react-router-dom";
import { BackButton } from '../../../Shared/backBttton';
import WalletWarmDetails from './walletWarmDetails';
import { BreadcrumbComponent } from '../../../Shared/breadcrumb';

class Wallets extends Component {
    state = {  }    
    render() { 
        return (
        <LayoutWrapper>
                <BackButton {...this.props}/>   
                <BreadcrumbComponent {...this.props}/>
                <Tabs className="full-width">
                   <TabPane tab="Wallet" key="1"><WalletWarmDetails/></TabPane>
                </Tabs>
        </LayoutWrapper>
        );
    }
}
 
export default withRouter(Wallets);