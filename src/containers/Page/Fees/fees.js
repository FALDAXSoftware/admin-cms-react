import React, { Component } from 'react';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import { Tabs } from 'antd';
import { TabPane } from '../../../components/uielements/tabs';
import {  withRouter} from "react-router-dom";
import { isAllowed } from '../../../helpers/accessControl';
import FeesMetabase from './feesMetabase';
import NetworkFee  from '../NetworkFee/networkFee';
import FeesWithdrawal from './feesWithdrawal';
import FeesFaldax from './feesFaldax';
import { BackButton } from '../../Shared/backBttton';
import { BreadcrumbComponent } from '../../Shared/breadcrumb';
class FeesComponent extends Component {
    state = {  }    
    render() { 
        return (
        <LayoutWrapper>
            <BackButton {...this.props}/>
            <BreadcrumbComponent {...this.props} />
            <Tabs className="full-width">
                {isAllowed("get_withdrawl_faldax_fee") &&<TabPane tab="Withdrawal Fees" key="3"><FeesWithdrawal/></TabPane>}
                {isAllowed("get_withdrawl_faldax_fee") &&<TabPane tab="Faldax Fees" key="2"><FeesFaldax/></TabPane>}
                {isAllowed("get_coin_fees") &&<TabPane tab="Network Fees" key="1"><NetworkFee/></TabPane>}
                {isAllowed("metabase_fee_report") &&<TabPane tab="Report" key="4"><FeesMetabase/></TabPane>}
            </Tabs>
        </LayoutWrapper>
        );
    }
}
 
export default withRouter(FeesComponent);