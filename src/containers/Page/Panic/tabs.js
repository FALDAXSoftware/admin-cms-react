import React, { Component } from 'react';
import { Tabs } from 'antd';
import {  withRouter} from "react-router-dom";
import { TabPane } from '../../../components/uielements/tabs';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import { isAllowed } from '../../../helpers/accessControl';
import { BreadcrumbComponent } from '../../Shared/breadcrumb';
import PanicButtonComponent from './panic'
import PanicButtonHistoryComponent from './panicHistory';
class PanicTabs extends Component {
    state = {  }    
    render() { 
        console.log(this.props)
        return (
        <LayoutWrapper>
                <BreadcrumbComponent {...this.props} />
                <Tabs className="full-width">
                  {isAllowed('get_panic_status')&& <TabPane tab="Panic" key="1"><PanicButtonComponent/></TabPane>}
                  {isAllowed('get_panic_status')&& <TabPane tab="History" key="2"><PanicButtonHistoryComponent/></TabPane>}
                </Tabs>
        </LayoutWrapper>
        );
    }
}
 
export default withRouter(PanicTabs);