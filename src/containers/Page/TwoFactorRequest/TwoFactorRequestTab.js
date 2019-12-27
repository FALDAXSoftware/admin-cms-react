import React, { Component } from 'react';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import { Tabs } from 'antd';
import {  withRouter} from "react-router-dom";
import TwoFactorRequests from './TwoFactorRequests';
import { BackButton } from '../../Shared/backBttton';
import { TabPane } from '../../../components/uielements/tabs';
import Metabase from './metabase';
import { isAllowed } from '../../../helpers/accessControl';

class TwoFactorRequestTab extends Component {
    state = {  }    
    render() { 
        return (
        <LayoutWrapper>
                <BackButton {...this.props}/>   
                <Tabs className="full-width">
                   {isAllowed("get_twofactors_requests") &&<TabPane tab="Two Factor Requests" key="1"><TwoFactorRequests/></TabPane>}
                   {isAllowed("metabase_two_factor_request") && <TabPane tab="Report" key="2"><Metabase/></TabPane>}
                </Tabs>
        </LayoutWrapper>
        );
    }
}
 
export default withRouter(TwoFactorRequestTab);