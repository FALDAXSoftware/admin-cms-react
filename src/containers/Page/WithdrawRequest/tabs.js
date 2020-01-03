import React, { Component } from 'react';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import { Tabs } from 'antd';
import { TabPane } from '../../../components/uielements/tabs';
import WithdrawalRequest from './withdrawRequest'
import { isAllowed } from '../../../helpers/accessControl';
import { BackButton } from '../../Shared/backBttton';
import {  withRouter} from "react-router-dom";
import Metabase from "./metabase";
class WalletDashboard extends Component {
    state = {  }    
    render() { 
        return (
        <LayoutWrapper>
            <BackButton {...this.props}/>
            <Tabs className="full-width">
                {isAllowed("get_all_withdraw_request") &&<TabPane tab="Withdrawal Request" key="1"><WithdrawalRequest/></TabPane>}
                {isAllowed("metabase_withdraw_request_report") &&<TabPane tab="Report" key="2"><Metabase/></TabPane>}
            </Tabs>
        </LayoutWrapper>
        );
    }
}
 
export default withRouter(WalletDashboard);