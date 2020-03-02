import React, { Component } from 'react';
import { Tabs } from 'antd';
import { TabPane } from '../../../components/uielements/tabs';
import {  withRouter} from "react-router-dom";
// import { BackButton } from '../../Shared/backBttton';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import  ApprovedKYC  from './approvedKYC';
import  ReviewKYC  from './reviewKYC';
import  DeclinedKYC  from './declinedKYC';
import Kyc from './kyc';
import Metabase from './metabase';
import { isAllowed } from '../../../helpers/accessControl';
import { BreadcrumbComponent } from '../../Shared/breadcrumb';


class KycTabs extends Component {
    state = {  }    
    render() { 
        return (
          <LayoutWrapper>
            {/* <BackButton {...this.props} /> */}
            <BreadcrumbComponent {...this.props}></BreadcrumbComponent>
            <Tabs className="full-width">
             {isAllowed("get_all_kyc_data") && <TabPane tab="Customer ID" key="1"><Kyc/></TabPane>}
             {isAllowed("get_all_kyc_data") && <TabPane tab="Approved Customer ID" key="2"><ApprovedKYC /></TabPane>}
             {isAllowed("get_all_kyc_data") && <TabPane tab="Under Review Customer ID" key="3"><ReviewKYC /></TabPane>}
             {isAllowed("get_all_kyc_data") &&<TabPane tab="Declined Customer ID" key="4"><DeclinedKYC /></TabPane>}
             {isAllowed("metabase_kyc_report") && <TabPane tab="Report" key="5"><Metabase /></TabPane>}
            </Tabs>
          </LayoutWrapper>
        );
    }
}
 
export default withRouter(KycTabs)