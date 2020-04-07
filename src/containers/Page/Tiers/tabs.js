import React, { Component } from 'react';
import { Tabs } from 'antd';
import {  withRouter} from "react-router-dom";
import { TabPane } from '../../../components/uielements/tabs';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import { isAllowed } from '../../../helpers/accessControl';
import { BreadcrumbComponent } from '../../Shared/breadcrumb';
import TierComponent from './tiers'
import TierRequest from './tierRequests'
class TierTabs extends Component {
    state = {  }    
    render() { 
        return (
        <LayoutWrapper>
                <BreadcrumbComponent {...this.props} />
                <Tabs className="full-width">
                  {isAllowed('get_tier_details')&& <TabPane tab="Account Tier" key="1"><TierComponent/></TabPane>}
                  {isAllowed('user_tier_request')&& <TabPane tab="Tier 2" key="3"><TierRequest tier="2"/></TabPane>}
                  {isAllowed('user_tier_request')&& <TabPane tab="Tier 3" key="4"><TierRequest tier="3"/></TabPane>}
                  {isAllowed('user_tier_request')&& <TabPane tab="Tier 4" key="5"><TierRequest tier="4"/></TabPane>}
                </Tabs>
        </LayoutWrapper>
        );
    }
}
 
export default withRouter(TierTabs);