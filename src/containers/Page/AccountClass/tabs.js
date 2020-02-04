import React, { Component } from 'react';
import { Tabs } from 'antd';
import { BackButton } from '../../Shared/backBttton';
import AccountClass from './accountClass';
import { TabPane } from '../../../components/uielements/tabs';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import { isAllowed } from '../../../helpers/accessControl';
import Metabase from "./metabase";
import { BreadcrumbComponent } from '../../Shared/breadcrumb';
class Wallets extends Component {
    state = {  }    
    render() { 
        return (
        <LayoutWrapper>
                {/* <BackButton {...this.props}/>    */}
                <BreadcrumbComponent {...this.props} />
                <Tabs className="full-width">
                  {isAllowed('get_all_account_classes')&& <TabPane tab="Account Class Management" key="1"><AccountClass/></TabPane>}
                  {isAllowed('metabase_account_report')&& <TabPane tab="Report" key="2"><Metabase/></TabPane>}
                </Tabs>
        </LayoutWrapper>
        );
    }
}
 
export default Wallets;