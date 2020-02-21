import React, { Component } from 'react';
import { Tabs } from 'antd';
import {  withRouter} from "react-router-dom";
import Dashboard from './dashboard'
import { TabPane } from '../../../components/uielements/tabs';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import { isAllowed } from '../../../helpers/accessControl';
import Metabase from "./metabase";
class Wallets extends Component {
    state = {  }    
    render() { 
        return (
        <LayoutWrapper>
                <Tabs className="full-width">
                  {isAllowed("get_dashboard_data") && <TabPane tab="Admin-Dashboard" key="1"><Dashboard/></TabPane>}
                  {isAllowed('metabase_dashboard_report') && <TabPane tab="Report" key="2"><Metabase/></TabPane>}
                </Tabs>
        </LayoutWrapper>
        );
    }
}
 
export default withRouter(Wallets);