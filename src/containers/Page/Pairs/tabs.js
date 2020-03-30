import React, { Component } from 'react';
import { Tabs } from 'antd';
import {  withRouter} from "react-router-dom";
import { TabPane } from '../../../components/uielements/tabs';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import { isAllowed } from '../../../helpers/accessControl';
import { BreadcrumbComponent } from '../../Shared/breadcrumb';
import Metabase from "./metabase";
import Pairs from "./pairs";

class PanicTabs extends Component {
    state = {  }    
    render() { 
        console.log(this.props)
        return (
        <LayoutWrapper>
                <BreadcrumbComponent {...this.props} />
                <Tabs className="full-width">
                  {isAllowed('admin_all_pairs')&& <TabPane tab="Pairs" key="1"><Pairs/></TabPane>}
                  {isAllowed('admin_pair_report')&& <TabPane tab="Report" key="2"><Metabase/></TabPane>}
                </Tabs>
        </LayoutWrapper>
        );
    }
}
 
export default withRouter(PanicTabs);